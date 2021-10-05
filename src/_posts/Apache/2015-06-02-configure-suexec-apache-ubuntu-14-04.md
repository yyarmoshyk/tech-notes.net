---
id: 2655
title: Настройка suexec в Apache2 на Ubuntu 14.04
date: 2015-06-02T13:43:04+00:00
author: admin

guid: http://www.tech-notes.net/?p=2655
permalink: /configure-suexec-apache-ubuntu-14-04/
image: /wp-content/uploads/2015/06/Fastcgi.jpg
categories:
  - Apache
tags:
  - Ubuntu
  - Apache2
  - cgi
  - php-cgi
  - suexec
---
Механизм suexec позволяет выполнять `CGI` скрипты от имени разных пользователей системы. В этой статье я рассмотрю пример настройки suexec на базе Linux Ubuntu 14.04.  
<!--more-->

Использовать suexec очень удобно если у вас есть несколько сайтов на сервере, доступ к которым организован [через sftp](/configure-sftp-chroot-on-ubuntu-14-04/). В таком случае вы **не столкнетесь** с проблемой разных владельцев файлов.

Для начала установим нужные пакеты:

```bash
apt-get install php5-cgi libapache2-mod-fcgid apache2-suexec apache2-suexec-custom -y
```

Включим модули

```bash
a2enmod fcgid  
a2enmod suexec
```

Теперь нужно указать, что все `php` файлы - это `cgi` скрипты и должны обрабатываться модулем `fcgid`

Есть два варианта

  1. отредактировать глобальный `fcgid.conf`
  2. отредактировать отдельной конфиг каждого сайта.

Я выбираю второй:

```bash
nano /etc/apache2/sites-enabled/**sitename.conf**
```

Следующая конструкция объявляет `php` файлы `cgi` скриптами:

```bash
<IfModule mod_mime.c>
  AddHandler     fcgid-script .php
  FCGIWrapper /usr/bin/php5-cgi .php
</IfModule>

```


В том же самом файле указываем от имени какого именно системного пользователя apache будет получать доступ к папкам и файлам сайта. В даном примере я указываю отдельный `php.ini` для каждого сайта:

```bash
<IfModule mod_suexec.c>
  FcgidInitialEnv PP_CUSTOM_PHP_INI /etc/php_conf.d/websitename_php.ini
  SuexecUserGroup "<strong>systemuser</strong>" "<strong>systemgroup</strong>"
</IfModule>
```

В остальном конфигурационный файл остается стандартным. Полный пример можно посмотреть по адресу:  
[Настройка сайтов в Apache2](/configure-vhosts-apache2/)

Перезапускаем демон apache:

```bash
service apache2 restart
```

Разрешаем листинг каталога сайта:

```bash
chmod +x /var/www/**sitename.conf**
```

Делаем все php файлы исполняемыми:

```bash
find /var/www/**sitename.conf** -type f -name `*.php` -exec chmod +x {} \;
```
