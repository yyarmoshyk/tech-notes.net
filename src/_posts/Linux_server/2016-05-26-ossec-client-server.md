---
id: 3325
title: OSSEC клиент-серверная установка
date: 2016-05-26T12:01:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=3325
permalink: /ossec-client-server/
image: /wp-content/uploads/2016/05/ossec_logo.jpg
categories:
  - Linux server
  - Безопасность
tags:
  - oosec
---
`OSSEC` - это система выявления и предотвращения атак и открытым исходным кодом. Его можно настроить следить не только за событиями в лог файлах, но и за изменением файлов и запущенных демонов, служб и сервисов.

Страница на GitHUB: [http://ossec.github.io/](http://ossec.github.io/)

В дальнейшем речь пойдет не просто об установке OSSEC, но и о настройке клиент-серверной системы, в которой несколько клиентов репортят события в один сервер.

## Часть 1: Установка OSSEC

Установка серверной части ничем не отличается от клиентской, кроме соответствующего вопроса на этапе установки. Поэтому все шаги можно проделывать паралельно на сервере и на клиентах.

Установим нужные пакеты:

```bash
yum install build-essential inotify-tools php-cli php php-imap php-gd php-xml httpd php-pear mysql-libs httpd-tools php-pdo php-mysql php-mbstring php-common mysql mysql-server
```

На сегодняшний день самой последней версией является `OSSEC v.2.8.1`. Его и будем ставить:

```bash
cd /usr/local/src/  
wget -U ossec http://www.ossec.net/files/ossec-hids-2.8.1.tar.gz  
tar xf ossec-hids-2.8.1.tar.gz  
cd ossec-hids-2.8.1
```

Запускаем скрипт установки:

```bash
./install
```

Все вопросы в устновщике довольно просты и понятны. Можно тупо бить по энтеру, принимая настройки по умолчанию.

Отдельного внимания заслуживает первый вопрос:

```bash
What kind of installation do you want?
```

Введите `server` если устанавливаете серверную часть, `agent` на клиентах.

Рекомендую указать ваш email для получения уведомлений и публичный IP адрес, когда скрипт спросит о белых списках (white list).

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

## Часть 2: Настройка сервера
> Редактируем конфиг `/var/ossec/etc/ossec.conf`

### Email уведомления:
Если вы выбрали отправку email уведомлений, то OSSEC будет Вам слать 12 email в час. Стоит подкрутить секцию:
```bash
<email_maxperhour>1</email_maxperhour>
```
Также настоятельно рекомендовано отредактировать и вписать туда нормальный домен, что бы письма хотя бы в папку спам попадали:
```bash
<email_from>ossecm@ossec-server.com</email_from>
```
<div class="spoiler-wrap">
<div class="spoiler-head folded">
  полная секция
</div>
<div class="spoiler-body">
<pre>
<global>
    <email_notification>yes</email_notification>
    <email_to>admin@domain.com</email_to>
    <smtp_server>localhost</smtp_server>
    <email_from>ossecm@ossec-server.com</email_from>
</global>
</pre>
</div> </div>

### Включем оповещения о новых файлах.
Для этого находим следующую секцию:
```bash
<syscheck>
    <!-- Frequency that syscheck is executed - default to every 22 hours -->
    <frequency>79200</frequency>
```
Добавляем в нее:
```bash
<alert_new_files>yes</alert_new_files>
```

### Настройка слежения за папками и файлами.
Следующим шагом нужно указать за чем должен следить OSSEC. Находим следующую секцию
```bash
<!-- Directories to check  (perform all possible verifications) -->
<directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories check_all="yes">/bin,/sbin</directories>
```
Для того чтобы включить уведомления в реальном времени, нужно добавить `report_changes="yes" realtime="yes"` к описанию каждого каталога. Со следующим прмером становится понятнее:
```bash
<!-- Directories to check  (perform all possible verifications) -->
<directories report_changes="yes" realtime="yes" check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/bin,/sbin</directories>
```
Следующая строка в этой секции будет следить за появлением новых файлов с задаными расшрениями в папках `/home` и `/var/www`:
```bash
<directories report_changes="yes" realtime="yes" restrict=".php|.js|.py|.sh|.html|.pl" check_all="yes">/home/,/var/www</directories>

```
### Белые списки
По ходу дела OSSEC будет блочить доступ к серверу для IP адресов, если будет подозревать их в неправомерных действиях (на основе своей логики). Поэтому настоятельно рекомендую указать все IP адреса Вашей подсети в следующей секции по аналогии с 127.0.0.1
```bash
  <global>
    <white_list>127.0.0.1</white_list>
```

На этом базовая настройка закончена и можно запускать сам демон:

```bash
/var/ossec/bin/ossec-control start
```

### Добавление клиентов к серверу

Завершающим шагом является добавление агентов в OSSEC сервер. Это делается с помощью `manage_agents`.

Полный путь к утилите:

```bash
/var/ossec/bin/manage_agents
```

Добавляем все нужные агенты (A). После этого экспортируем ключи (E). Следующим шагом является импорт этих ключей на серверах, которые клиенты. На клеинтах тоже нужно воспользоваться `manage_agents`.

Диалог добавления агента на сервер довольно прост:

```bash
****************************************
* OSSEC HIDS v2.8 Agent manager.     *
* The following options are available: *
****************************************
(A)dd an agent (A).
(E)xtract key for an agent (E).
(L)ist already added agents (L).
(R)emove an agent (R).
(Q)uit.
Choose your action: A,E,L,R or Q: A

- Adding a new agent (use '\q' to return to the main menu).
Please provide the following:
* A name for the new agent: server-01-name.localnet
* The IP Address of the new agent: 10.10.10.101
* An ID for the new agent[001]:
Agent information:
ID:001
Name: server-01-name.localnet
IP Address: 10.10.10.101

Confirm adding it?(y/n): y
Agent added.
```

Отсталось разрешить трафик в iptables. Для этого на каждом агенте разрешить доступ в 1514 порту UDP воспользовавшись следующей командой:
```bash
iptables -A INPUT -p UDP -dport 1514 -s IP_сервера -j ACCEPT
```

На сервере OSSEC, соответствуенно разрешаем доступ для каждого агента:
```bash
iptables -A INPUT -p UDP -dport 1514 -s IP_агента -j ACCEPT
```
## Часть 4: Web интерфейс
Удобно иметь возможность посмотреть что же там происходит в OSSEC через web интерфейс. Он должен быть установлен на сервере:

```bash
curl -O http://www.ossec.net/files/ossec-wui-0.3.tar.gz
tar -zxvf ossec-wui-0.3.tar.gz
mv ossec-wui-0.3 /usr/local/share/ossec
chown -R apache:apache /usr/local/share/ossec
```

Для того что бы сделать этот каталог доступным по web-у, создайте конфиг apache со следующим содержанием:

```bash
Alias /ossec /usr/local/share/ossec
<Directory /usr/local/share/ossec>
  Order allow,deny
  AuthType Basic
  AuthUserFile /usr/local/share/ossec/.htpasswd
  AuthGroupFile /dev/null
  AuthName "Enter username/password"
  Require valid-user
  Satisfy any
  Deny from all
</Directory>
```

Генерируем пароль для базовой авторизцаии:
```bash
htpasswd -cmb /usr/local/share/ossec/.htpasswd ossecadmin password
```

Перезапустите apache для применения изменений. После этого можно заходить в web интерфейс OSSEC по адресу:
[http://server_ip/ossec](http://server_ip/ossec)

Список литературы:
* [https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ossec-security-notifications-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ossec-security-notifications-on-ubuntu-14-04)
* [https://www.digitalocean.com/community/tutorials/how-to-monitor-ossec-agents-using-an-ossec-server-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-monitor-ossec-agents-using-an-ossec-server-on-ubuntu-14-04)
* [http://www.ossec.net/wiki/index.php/OSSECWUI:Install](http://www.ossec.net/wiki/index.php/OSSECWUI:Install)
