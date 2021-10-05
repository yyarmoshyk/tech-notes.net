---
id: 336
title: GeoIP для Nginx
date: 2014-02-06T15:42:04+00:00
author: admin

guid: http://www.tech-notes.net/?p=336
permalink: /geoip-for-nginx/
image: /wp-content/uploads/2014/02/nginx_geoip-660x232.png
categories:
  - Nginx
tags:
  - GeoIP Nginx
---
Расширение GeoIP позволяет определить местоположение клиента в зависимости от его IP адрес. Определяется Город, область, страна, долгота, широта, и другая информация. Очень удобно использовать на сайтах, которые переведены на несколько языков и переадресовывать клиентов из разных стран на страницы с их родным языком.

Итак для начала нужно убедиться что Nginx собран с поддержкой geoip:

```bash
nginx -V 2>&1 |grep http_geoip_module
```

Если вы ничего не получили в ответ - можете почитать статью о том,  [как собрать nginx из исходников с поддержкой geip](/install-nginx-from-sources/ "Установка nginx из исходников").

Дальше нужно скачать базы GeoIP и разместить их в месте, доступном для nginx. Я создал папку:

```bash
mkdir /etc/nginx/geoip && cd /etc/nginx/geoip
```

Скачиваем последние версии баз:

```bash
wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz  
wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz  
gunzip *.gz
```

Настраиваем Nginx на работу с базами. Для начала нужно добавить следующие строки в nginx.conf в секцию http:

```bash
geoip_country /etc/nginx/geoip/GeoIP.dat; # the country IP database  
geoip_city /etc/nginx/geoip/GeoLiteCity.dat; # the city IP database
```

Директива **geoip_country** добавляет доступными переменные:

  * `$geoip_country_code` - две буквы кода страны, на пример: RU, US, UA.
  * `$geoip_country_code3` - две буквы кода страны, на пример: RUS, USA.
  * `$geoip_country_name` - расширенное имя страны, на пример: Russian Federation, United States

Директива **geoip_city** добавляет доступными переменные:

  * `$geoip_region` - имя региона на пример, Moscow City.
  * `$geoip_city` - имя города, на пример: Moscow, Washington, Lisbon.
  * `$geoip_postal_code` - почтовый код
  * `$geoip_city_continent_code`
  * `$geoip_latitude`
  * `$geoip_longitude`

Для того, что бы это все заработало, нужно добавить нужны переменные в файл с конфигурацией fcgi.

У меня это /etc/nginx/conf/fastcgi_params:

```bash
### SET GEOIP Variables ###  
fastcgi_param GEOIP_COUNTRY_CODE $geoip_country_code;  
fastcgi_param GEOIP_COUNTRY_CODE3 $geoip_country_code3;  
fastcgi_param GEOIP_COUNTRY_NAME $geoip_country_name;  
fastcgi_param GEOIP_CITY_COUNTRY_CODE $geoip_city_country_code;  
fastcgi_param GEOIP_CITY_COUNTRY_CODE3 $geoip_city_country_code3;  
fastcgi_param GEOIP_CITY_COUNTRY_NAME $geoip_city_country_name;  
fastcgi_param GEOIP_REGION $geoip_region;  
fastcgi_param GEOIP_CITY $geoip_city;  
fastcgi_param GEOIP_POSTAL_CODE $geoip_postal_code;  
fastcgi_param GEOIP_CITY_CONTINENT_CODE $geoip_city_continent_code;  
fastcgi_param GEOIP_LATITUDE $geoip_latitude;  
fastcgi_param GEOIP_LONGITUDE $geoip_longitude;
```

Если же вы используете Nginx как фронт-энд (reverse proxy), тогда нужно еще создать эти же строки в файл proxy.conf

**Примеры использования в настройках Nginx:**

Использование кода страны для отображения контента:

```bash
if ($geoip_country_code = RU) {
	сделать что-то для посетителей из России ;
	# например set root path /var/www/html/content/ru/;
}
```


Использование кода города для отображения контента:

```bash
if ($geoip_region = Moscow) {
	сделать что-то для посетителей из Москвы ;
	# например set root path /var/www/html/content/Moscow/;
}
```
