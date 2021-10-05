---
id: 2223
title: Настройка Linux сервера для WordPress/Drupal/Joomla
date: 2014-11-25T17:47:02+00:00
author: admin

guid: http://www.tech-notes.net/?p=2223
permalink: /configure-linux-server-wordpress-drupal-joomla/
image: /wp-content/uploads/2014/11/lnmpv.jpg
categories:
  - Linux_server
tags:
  - mysql
  - nginx
  - php
  - varnish
  - drupal
  - joomla
  - wordpress
---
Эта статья - реальное пособие как настроить сервер для максимальной производительности при работе с одной из блоговых CMS систем WordPress, Drupal или Joomla.

Буду рассматривать настройку сервера на базе Linux Ubuntu. Нам понадобятся Nginx, PHP, MySQL и Varnish.

## 1. MySQL

Начну с конца. Меня вполне устраивают стандартные настройки MySQL, поэтому его нужно просто установить:

```bash
apt-get install mysql-server-5.5 mysql-client-5.5
```

## 2. PHP

PHP должно работать режиме [fast-cgi](http://www.tech-notes.net/nginx-php-fcgi/). Для `NginX` не существует модуля подобного `libapache-modphp`.  
Соответственно нам понадобится `php-cli`, `php-common` и остальное. Если у Вас - паранойя и Вы желаете использовать самую последнюю версию php - воспользуйтесь [этой статьей](http://www.tech-notes.net/compile-php-5-5-10-from-sources/) и соберите его из исходинков.

Вполне сгодится версия php, которая доступна в репозитариях:

```bash
apt-get install php5-cgi php5-cli php5-common php5-curl php5-gd php5-json php5-mysql php5-readline spawn-fcgi
```

Скачайте init.d скрипт. Для Ubuntu он отличается от того, что представлен в [этой статье](http://www.tech-notes.net/nginx-php-fcgi/)

```bash
wget -O /etc/init.d/php-fastcgi /wp-content/uploads/2014/11/php-fastcgi-init
```

Также скачайте сам fastcgi handler:

```bash
wget -O /usr/bin/php-fastcgi /wp-content/uploads/2014/11/php-fastcgi-bin
```

Сделайте их исполняемыми:

```bash
chmod +x /etc/init.d/php-fastcgi  
chmod +x /usr/bin/php-fastcgi
```

Поставим php на автозагрузку:

```bash
sudo update-rc.d php-fastcgi defaults 80
```

Запускаем:

```bash
/etc/init.d/php-fastcgi start
```

Проверяем:

```bash
netstat -tunlp |grep 9000
```

Если php-fcgi запустился, то вы получите следующий вывод:

```bash
tcp        0      0 127.0.0.1:9000          0.0.0.0:*               LISTEN      6806/php5-cgi
```

## 3. Nginx

Предлагаю использовать версию, доступную в репозитариях. Если у Вас - паранойя и Вы хотите использовать самую последнюю версию - соберите ее из исходников, воспользовавшись [этой статьей](http://www.tech-notes.net/install-nginx-from-sources/ "Установка nginx из исходников").

Устанавливаем:

```bash
apt-get install nginx
```

Создаем конфигурационный файл для сайта:

```bash
nano /etc/nginx/sites-available/**mywebsite.com**
```

Вносим в него следующие:

```bash
server {
    listen 8080;
    server_name mywebsite.com www.mywebsite.com;

    root /var/www/html;

    index index.php;

    if ($host ~ !^(mywebsite.com|www.mywebsite.com)$) {
        rewrite ^ http://www.mywebsite.com$request_uri? permanent;
    }

    # Limit methods, allowed on server to GET, HEAD and POST
    if ($request_method !~ ^(GET|HEAD|POST)$ ) {
        return 444;
    }

    location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
        root /var/www/html;
        expires 30d;
        access_log off;
    }

    location ~* \.(css|js)$ {
        root /var/www/html;
        expires 7h;
        access_log off;
    }

    location / {
        try_files $uri $uri/ /index.php;
    }

    location ~ \.(php|html)$ {
        root /var/www/html;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

Чувствительные места блога лучше закрыть формами базовой авторизации.
### WordPress:

```bash
location /wp-admin {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/auth/.ht.passwd_admin;
    }
    location ~* /wp-login.php {
        try_files $uri $uri/ $uri/wp-login.php /wp-login.php;
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/auth/.ht.passwd_admin;
        root /var/www/html;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;

    }
    location ~* /xmlrpc.php {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/auth/.ht.passwd_admin;

        try_files $uri $uri/ $uri/xmlrpc.php /xmlrpc.php;
        root /var/www/html;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;

    }
```


### Joomla:

```bash
location /administrator {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/auth/.ht.passwd_admin;
    }
```


### Drupal:

```bash
location /admin {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/auth/.ht.passwd_admin;
    }
```


Для создания файла с паролями нам понадобятся `apache2-utils`. Установим:

```bash
apt-get install apache2-utils
```

Создадим файл `/etc/nginx/auth/.ht.passwd_admin` (папки `/etc/nginx/auth` не существует):

```bash
mkdir /etc/nginx/auth  
htpasswd -cmb /etc/nginx/auth/.ht.passwd_admin **user password**
```

Редактируем главный конфигурационный файл:

```bash
nano /etc/nginx/nginx.conf
```

Вносим в него следующие изменения:

Меняем пользователя на `www-data`:

```bash
user www-data;
```


Улучшаем безопасность:

```bash
client_body_buffer_size 4K;
        client_header_buffer_size 4k;
        large_client_header_buffers 4 4k;
        limit_conn_zone $binary_remote_addr zone=slimits:5m;
```


Следующий блок позволит Вам видеть реальные ip адреса посетителей в лог файлах:

```bash
##
        # Logging Settings
        ##
        set_real_ip_from   127.0.0.1;
        real_ip_header X-Forwarded-For;

        log_format   main '$remote_addr - $remote_user [$time_local]  $status '
            '"$request" $body_bytes_sent "$http_referer" '
            '"$http_user_agent" "$http_x_forwarded_for"';

        log_format forwarded '"$http_x_forwarded_for" - $remote_user [$time_local]  $status '
            '"$request" $body_bytes_sent "$http_referer" '
            '"$http_user_agent"';

        access_log /var/log/nginx/access.log forwarded;
        error_log /var/log/nginx/error.log;

```


Завершающим шагом является настройка компресси файлов:

```bash
##
        # Gzip Settings
        ##

        gzip on;

        gzip_disable "msie6";

        gzip_vary on;
        # gzip_proxied any;
        gzip_comp_level 6;
        gzip_buffers 64 8k;
        gzip_http_version 1.1;
        gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml alication/xml+rss text/javascript;
```


Убедитесь, что папка /var/www/html существует:

```bash
mkdir -p /var/www/html
```

Осталось включить сайт:  
ln -s /etc/nginx/sites-available/mywebsite.com /etc/nginx/sites-enabled/mywebsite.com

и перезапустить nginx что бы изменения вступили в силу:

```bash
service nginx restart
```

Настройка Nginx завершена. После запуска он будет доступен на порту 8080. Осталось настроить Varnish что бы он принимал входящие соединения на 80 порту.

<center>
  <div id="gads">
  </div>
</center>

## 4.Varnish

Устатавливаем Varnish

```bash
apt-get install varnish
```

Разбор настройки Varnish приводил в статье `[Обзор конфигурации Varnish](http://www.tech-notes.net/varnish-configuration-rewiev/)`, поэтому в рамках этой статьи разжевывать не буду.

Для начала редактируем `/etc/default/varnish` и приводим секцию DAEMON_OPTS к следующему виду:

```bash
DAEMON_OPTS="-a :80 \
             -T localhost:6082 \
             -t 120\
             -f /etc/varnish/website.vcl \
             -S /etc/varnish/secret \
             -s malloc,256m"
```


Дальше создаем файл `/etc/varnish/website.vcl` и наполняем его:

```bash
backend default {
    .host = "127.0.0.1";
    .port = "8080";
}

acl purge { "localhost"; }

sub vcl_recv {

    set req.http._sess = regsub( regsub( req.http.Cookie, ".*PHPSESSID=", "" ), ";.*", "" );

    if (req.request == "PURGE") {
      if (!client.ip ~ purge) {
        error 405 "Not allowed.";
      }
    }

     if (req.restarts == 0) {
        if (req.http.x-forwarded-for) {
            set req.http.X-Forwarded-For = req.http.X-Forwarded-For;
        } else {
            set req.http.X-Forwarded-For = client.ip;
        }
    }

    if (req.request != "GET") { return (pipe); }

    if (req.url == "^/(wp-admin|wp-login|admin|administrator)") {
	return (pipe);
    }

    if (req.url ~ "^/(/wp-content|media|images|graphics)/.*\.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
	unset req.http.Cookie;
	return (pipe);
    }


    if (req.http.Authorization || req.request == "POST" || req.http.Authenticate)
    {
	return (pass);
    }

    set req.backend = default;
    return (lookup);
 }
sub vcl_fetch {
    # Remove Expires from backend, it's not long enough
    unset beresp.http.expires;
    # Set the clients TTL on this object
    set beresp.http.cache-control = "max-age=900";
    # Set how long Varnish will keep it (1 minute)
    set beresp.ttl = 3600 s;

     return (deliver);
 }

sub vcl_deliver {
    remove resp.http.Via;
    remove resp.http.Age;
    remove resp.http.X-Purge-URL;
    remove resp.http.X-Purge-Host;
    remove resp.http.X-CF-Powered-By;

    return (deliver);
}
```


**Обратите внимание** на следующую конструкцию в секции `vcl_recv`

```bash
if (req.url ~ "^/(/wp-content|media|images|graphics)/.*\.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
	unset req.http.Cookie;
	return (pipe);
    }
```


С помощью нее запросы статических файлов доставляются к Nginx&#8217;у минуя varnish. Если на Вашем сайте картинки хранятся в каталоге `pictures`, приведите эту секцию к следующему виду:

```bash
if (req.url ~ "^/(/wp-content|media|images|graphics|pictures)/.*\.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
	unset req.http.Cookie;
	return (pipe);
    }
```


Таким образом Varnish не будет кешировать запросы статики, запросы, отличные от GET, запросы авторизации и весь доступ в админку.

Перезапустите Varnish что бы изменения вступили в силу:

```bash
service varnish restart
```

Рекомендуется установить плагины, которые очищают Varnish кэш при обновлении статей в блоге. Такие плагины существуют практически для всех CMS.

## Заключение:

С такими настройками WordPress на сервере c 1GB RAM, 1CPU выдерживает 500+ пользователей в секунду. Больше не смог сгенерировать в рамках бесплатного плана [blazemeter.com](http://blazemeter.com).

Теперь можно настроить ftp сервер и [создать виртуальных ползователей](http://www.tech-notes.net/pure-ftpd-virtual-users/), после чего залить контент и установить CMS.

Также рекомендую [настроить резервное копирование Ваших сайтов](http://www.tech-notes.net/backup-website-with-upload-to-dropbox/).

Для подолнитльного спокойствия можно [установить fail2ban](http://www.tech-notes.net/fail2ban-configuration/)

После того как контент будет загружен, рекомендую [оптимизировать изображения](http://www.tech-notes.net/optimize-images/) для увеличения скорости отдачи изображений.
