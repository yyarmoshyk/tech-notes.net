---
id: 2491
title: Автоматическая настройка сайтов в Apache
date: 2015-03-30T18:16:00+00:00
author: admin

guid: http://www.tech-notes.net/?p=2491
permalink: /auto-configure-webhosts-apache/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - bash
---
Простая жизнь простых сайтов на сервере с Apache.

Пришлось мне недлать клеинту сервер на котором размещается 1000+ маленькх сайтов. Сайт представляет собой маленькую html страницу с iframe, но нужно автоматизировать процесс настройки виртуальных хостов в Apache.

Клиенту было предложено заливать сайты на сервер по фтп называть папки полными именами сайтов. Со стороны сервера был настроен [pure-ftpd с виртуальных пользователем](http://www.tech-notes.net/pure-ftpd-virtual-users/). После логина клиент попадает в папку `/var/www/html`, где ему предстоит создать папку с именем сайта и залить в эту папку файлы.

После чего срабатывает серверная магия и сайт становится доступен по велению волшебного basha.

Для этого в папке `/etc/httpd/conf.d/` был созад шаблон:  

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /etc/httpd/conf.d/template
  </div>

  <div class="spoiler-body">
<pre>
<VirtualHost *:80>
  ServerName websiterepl
  ServerAlias www.websiterepl
  DocumentRoot /var/www/html/websiterepl

  LogLevel warn
  ErrorLog /var/log/httpd/websites/error.log
  CustomLog /var/log/httpd/websites/access.log combined

  <Directory /var/www/html/websiterepl>
    Options +ExecCGI -Indexes +FollowSymLinks +MultiViews
    AllowOverride All
    Order allow,deny
    allow from all
  </Directory>
</VirtualHost>
</pre>

      </div> </div>



После чего следующий скрипт обрабатывает содержание `/var/www/html/` и создает для всех папок виртуальные хосты в конфиге apache.<br />

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /usr/local/bin/make_vhosts
  </div>

  <div class="spoiler-body">


<pre>
#!/bin/bash

do_websites () {
for f in $(ls /var/www/html/);
do
  sed 's/websiterepl/'"$f"'/g' /etc/httpd/conf.d/template >> /etc/httpd/conf.d/websites.conf
  echo "" >> /etc/httpd/conf.d/websites.conf
done
}

make_logs() {
for folder in $(grep ErrorLog /etc/httpd/conf.d/websites.conf |awk '{print $2}' |sed 's/error.log//g');
do
  if [ ! -d $folder ];
  then
    mkdir -p $folder;
  fi
done
}

if [ "$1" == "force" ]
then
  rm -f /etc/httpd/conf.d/websites.conf
  do_websites
  make_logs
  service httpd reload
else

servernames=$(grep ServerName /etc/httpd/conf.d/websites.conf |wc -l)
folders=$(ls /var/www/html |wc -l)

if [ "$folders" != "$servernames" ]
then
  rm -f /etc/httpd/conf.d/websites.conf
  do_websites
  make_logs
  service httpd reload
fi
fi

</pre>          
            </div> </div>

С помощью `crontab` заставляет скрипт выполняться каждые 15 минут.

```bash
*/15 * * * * /usr/local/bin/make_vhosts_nginx 2>&1 >> /dev/null
```

В принцыпе в сам скрипт зашита проверка количества виртуальных хостов и сравнение их с количеством папок в /var/www/html, поэтому можно выполнять его и каждые 5 минут.

Скрипт можно запустить принудительно используя ключь `force`.
