---
id: 338
title: Установка nginx из исходников
date: 2019-09-30T20:40:15+00:00
author: admin

guid: http://www.tech-notes.net/?p=338
permalink: /install-nginx-from-sources/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - nginx from sources
  - установка nginx из исходного
---
В разных случаях приходится компилировать ПО имея его исходники. Опять же хочу разводить демагогию на эту тему. Хочу рассказать как собрать nginx последней версии на CentOS v.6.3.

Итак идем на [nginx.org](http://nginx.org/) и скачиваем последнюю версию. (в моем случае это 1.9.9)

```bash
wget http://nginx.org/download/nginx-1.9.9.tar.gz
```

Распаковываем архив:

```bash
tar xf nginx-1.9.9.tar.gz && cd nginx-1.9.9
```

Можно посмотреть справку по configure и включить только то, что нужно в нашу сборку:

```bash
./configure -help |less
```

Между прочим, можно почитать требования к CMS системе, на которой написан сайт и включить только то, что для нее нужно.

Для себя я выбрал вот такой вот набор опций:

```bash
-prefix=/etc/nginx - папка для установки  
-user=nginx - пользователь, под которым будет выполняться nginx  
-group=nginx - группа  
-with-http_ssl_module - включаем поддержку ssl  
-with-http_spdy_module - включаем поддержку spdy  
-with-http_realip_module - включаем поддержку realip  
-with-http_geoip_module - включаем поддержку geoip  
-with-http_gzip_static_module - включаем поддержку gzip для статического контента  
-with-http_auth_request_module - включаем поддержку базовой авторизации  
-with-http_perl_module - включаем поддержку perl  
-http-log-path=/var/log/nginx/access.log - путь к логу.
```

Добавляем пользователя (группа для него будет создана автоматически):

```bash
useradd -d /etc/nginx nginx
```

Создаем папку для логов:

```bash
mkdir /var/log/nginx/  
chown nginx:nginx /var/log/nginx/
```

Для такого набора мне нужно установить недостающие в системе библиотеки:

```bash
yum install pcre-devel openssl-devel perl-ExtUtils-Embed
```

Логика такая: выбираю dev пакеты, остальные - втягиваются, как зависимости

В ходе сбора пакета мне выплюнуло вот такую вот ошибку:

```bash
./configure: error: the GeoIP module requires the GeoIP library.  
You can either do not enable the module or install the library.
```

Я так хочу, что бы `GeoIp` был включен в сборку, придется его тоже ставить руками, поскольку yum его не нашел.

```bash
wget http://www.maxmind.com/download/geoip/api/c/GeoIP-latest.tar.gz  
tar xf GeoIP-latest.tar.gz && cd cd GeoIP-1.*  
./configure  
make  
make install
```

В ход установки в консоле пробежало сообщение:

```bash
Libraries have been installed in:  
/usr/local/lib
```

Подозреваю, что именно туда оно и было установлено. Сделаем симлинк на всякий случай. Боюсь, что nginx там не увидит нужную библиотеку:

```bash
ln -s /usr/local/lib/libGeoIP.so.1.6.0 /usr/lib64/libGeoIP.so.1
```

После этого nginx собирался без проблем:

```bash
./configure -prefix=/etc/nginx -user=nginx -group=nginx -with-http_ssl_module -with-http_spdy_module -with-http_realip_module -with-http_geoip_module -with-http_gzip_static_module -with-http_auth_request_module -with-http_perl_module -http-log-path=/var/log/nginx  
make  
make install
```

После долгих раздумий на виртуальной машине оно все таки скомпилировалось и установилось.

После этого осталось сделать init скрипт для запуска. К сожалению в папке с исходниками его нету.  
Его можно [скачать с моего сайта](/wp-content/uploads/2014/05/nginx):

```bash
wget -O /etc/init.d/nginx /wp-content/uploads/2014/05/nginx  
chmod +x /etc/init.d/nginx
```

Дальше запускаем:

```bash
/etc/init.d/nginx start
```

и проверяем или он запущен:

```bash
netstat -nlp |grep nginx
```

Радуемся.
