---
id: 2414
title: Включаем поддержку геоданных в Apache или mod_geoip из исходников
date: 2015-02-11T19:59:54+00:00
author: admin

guid: http://www.tech-notes.net/?p=2414
permalink: /mod_geoip-from-sources-apache/
image: /wp-content/uploads/2015/02/goiplogo.jpg
categories:
  - Apache
  - WHM/cPanel
tags:
  - geoip_module
  - mod_geoip
---
В ходе работы с WHM сервером столкнулся со следующей проблемой при установке mod_geoip:

```bash
mod_geoip-1.2.7-1.el5.x86_64 from epel has depsolving problems
  --> Missing Dependency: httpd-mmn = 20051115 is needed by package mod_geoip-1.2.7-1.el5.x86_64 (epel)
 You could try using --skip-broken to work around the problem
 You could try running: package-cleanup --problems
                        package-cleanup --dupes
                        rpm -Va --nofiles --nodigest
The program package-cleanup is found in the yum-utils package.
```


Всязанно это с тем, что в WHM апач - кастомизирован и лежит в папке `/usr/local/apache/`. Соответственно `yum` его не видит и говорит, что без `httpd` - никак. Соответсвенно та же проблема будет, если у Вас Apache собран из исходников.

Веселого мало, но и грустить не стоит.

Ставим GeoIP:

```bash
yum install geoip-devel geoip-data geoip
```

Скачиваем исходник mod_geoip:

```bash
wget -O 1.2.9.tar.gz https://github.com/maxmind/geoip-api-mod_geoip2/archive/1.2.9.tar.gz  
gunzip 1.2.9.tar.gz  
cd geoip-api-mod_geoip2-1.2.9/
```

Собирается он с помощью `apxs`:

```bash
/usr/local/apache/bin/apxs -i -a -L/usr/local/lib -I/usr/local/include -lGeoIP -c mod_geoip.c
```

В ходе компияции модуль будет установлен в нужный каталог и в конфиг Apache будет внесена следующая строка:

```bash
LoadModule geoip_module modules/mod_geoip.so
```

В случае с WHM конфиг файл apache (/usr/local/apache/conf/httpd.conf) динамичен, тоесть может быть сгенерирован из заготовок за ново в завимисти от обстоятельств. Именно поэтому его править не стоит, потомучто настройки потеряются, сайты лягут, клиент будет орать в телефон. В WHM редактируем файл:

```bash
nano /usr/local/apache/conf/includes/post_virtualhost_global.conf
```

Вкидываем в него:

```bash
LoadModule geoip_module       modules/mod_geoip.so

<IfModule mod_geoip.c>
  GeoIPEnable On
  GeoIPDBFile /usr/share/GeoIP/GeoIP.dat
</IfModule>

```


Делаем:

```bash
/usr/local/apache/bin/apachectl -t
```

Ну и рестартуем апач что бы включить модуль.

Для проверки в корне сайта создаем файл `geoiptest.php` со следующим содержанием:

```php
<?php
  print_r($_SERVER);
?>
```


Открываем в браузере файл и видим GEOIP_ADDR, и GEOIP_CONTINENT_CODE, и GEOIP_COUNTRY_NAME, и все остальное.  
Для того, что бы информация о городах и странах обновлялась автоматически, создайте файл /etc/cron.monthly/geoip со следующим содержанием:

```bash
#!/bin/bash  
mv /usr/share/GeoIP/GeoIP.dat /usr/share/GeoIP/GeoIP.dat.`$(ls /usr/share/GeoIP/GeoIP.dat* |wc -l)`  
wget -q -O /usr/share/GeoIP/GeoIP.dat.gz http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz  
gunzip /usr/share/GeoIP/GeoIP.dat.gz
```

Осталось сделать файл исполняемым, после чего даные GeoIP будут обновляться каждый месяц:

```bash
chmod +x /etc/cron.monthly/geoip
```

Пример ограничения доступа к сайту для северной америки:

```bash
RewriteEngine on
RewriteCond %{ENV:GEOIP_CONTINENT_CODE} ^NA$
RewriteRule ^(.*)$ - [F]
```
