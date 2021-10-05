---
id: 1742
title: Настройка High Availability кластера с помощью Heartbeat на Centos
date: 2014-09-22T16:51:09+00:00
author: admin

guid: http://www.tech-notes.net/?p=1742
permalink: /configure-heartbeat-centos/
image: /wp-content/uploads/2014/09/heartbeat_logo.jpg
categories:
  - CentOS
  - Clusters
  - Linux server
tags:
  - heartbeat IPaddr
  - настройка heartbeat
  - настройка heartbeat centos
---
В этой заметке хочу рассмотреть использование heatbeat на примере двух серверов. В даном примере у меня есть два сервера, на которых вертится mysql. Сайты устанавливают соединение с ip адресом 192.168.1.150. Я настрою hartbeat таким образом, что бы сетевой интерфейс с этим ip адресом поднимался на втором сервере, если первый выключается (падает).  
<!--more-->

Heartbeat - полезная утилита, которая позволяет выполнять различные действия на серверах в кластере, в зависимости от состояния остальных серверов.

Дано:  
				db1: 192.168.1.130  
				db2: 192.168.1.140  
				постоянный ip: 192.168.1.150

Для начала включим репозитарий Epel:

> rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

Дальше установим heartbeat на обоих серверах:

> yum install heartbeat

Внесем следующие строки в файл /etc/hosts:

```bash
db1 192.168.1.130
db2 192.168.1.140
```


Учтите, что db1 и db2 должно возвращаться в результате выполнения следующей команды на обоих серверах:

> uname -n

Вы можете испоьзовать имена серверов, которые возвращает выше упомянутая команда.

**Переходим на сервер db1.**

Создаем файл `/etc/ha.d/ha.cf` со следующим содержанием:

```bash
logfile /var/log/ha.log
keepalive 500ms
deadtime 10
warntime 5
initdead 30
auto_failback off
node db1
node db2
ping db1
deadping 2
```


Создаем файл `/etc/ha.d/haresources` со следующим содержанием:

```bash
db1 IPaddr::192.168.1.150/24/eth0:0
```


В результате выполнения скрипта `/etc/ha.d/resource.d/<strong>IPaddr</strong>` на сервере db1 поднимется виртуальный сетевой интерфейс `eth0:0` с ip адресом `192.168.1.150` и сакой подсети `255.255.255.0`

Если сервер db1 вдруг станет недоступен, этот интерфейс должен подняться на сервере db2.

<center>
  <div id="gads">
  </div>
</center>

Для этого создадим файл авторизации:

> echo -ne `# Automatically generated authkeys file \n auth 1 \n 1 sha1 $(dd if=/dev/urandom count=4 2>/dev/null | md5sum | cut -c1-32) \n` >> /etc/ha.d/authkeys

Выставим ему правильные права доступа:

> chmod 600 /etc/ha.d/authkeys

Теперь копируем все на второй сервер:

> rsync -Hogva /etc/ha.d root@db2:/etc/

и рестартуем heartbeat на обоих серверах:

> /etc/init.d/heartbeat restart

Выполняем `ifconfig` обнаруживаем, что вот такой вот интерфейс появился:

[<img src="/wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207.png" alt="Screenshot from 2014-09-22 12:42:07" width="723" height="130" class="aligncenter size-full wp-image-1743" srcset="/wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207.png 723w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207-170x30.png 170w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207-300x53.png 300w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207-660x118.png 660w" sizes="(max-width: 723px) 100vw, 723px" />](/wp-content/uploads/2014/09/Screenshot-from-2014-09-22-124207.png)

Для проверки можно отправить db1 в reboot и удостовериться, что eth0:0 с ip 192.168.1.150 поднялся на db2.

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>