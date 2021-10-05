---
id: 2513
title: Автоматическое развертывание Yii в Docker контейнере
date: 2015-04-16T20:34:12+00:00
author: admin

guid: http://www.tech-notes.net/?p=2513
permalink: /auto-configure-yii-in-docker/
image: /wp-content/uploads/2015/04/docker_yii_logo.png
categories:
  - Docker
tags:
  - Yii
---
Вот и у меня дошли руки до этой софтварины. Разработчики нормально так развернули идею контейнеров, которые уже 100 лет работают в виде `OpenVZ` и/или `Parallels Virtuozzo`.  
Но не могу не согласиться - отправить `doсker` контейнер с дэмо-сайтом клиенту на много легче, чем контейнер `OpenVZ/Virtuozzo`.

Дальше буду рассказывать что я делал для автомитического развертывания `NginX`, `php-fcgi` и установки `Yii` с помощью `docker`.

Для даного контейнера я использовал [Yii 2 Starter Kit](https://github.com/trntv/yii2-starter-kit)

Итак имеем сервер или ПК с установленым docker. Контенеры у себя я складывал в папку `/opt/docker`, соответственнно первым делом создаем папку:

```bash
mkdir /opt/docker/yii
```

Я буду использовать два отдельных контейнера:
  * yiiweb (nginx+php+yii)
  * yiidb (mysql)

Создаю им папки:

```bash
mkdir /opt/docker/yii/web  
mkdir /opt/docker/yii/db
```

Дальше буду работать в папке контейнера:

```bash
cd /opt/docker/yii
```

Для начала нам понадобятся следующие файлы:
  * `backend.conf` и `frontend.conf` - конфиги сайтов для nginx
  * `env` - файл, который пойдет в папку сайта. В нем описаны настройки фрэймворка.
  * `php-fastcgi-init` - стартер скрипт для php
  * `php-fastcgi-bin` - еще одна пепяка для работы php
  * `autoconf.sh` - этот скрипт нужно выполнить в контейнере после запуска.

<center>
  <div id="gads">
  </div>
</center>

Следующие два файла не представляют из себя ничего особого - конфиги nginx для двух сайтов. Эирным шрифтом выделены доменные имена сайтов. Смените на нужные Вам.  

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    backend.conf
  </div>

  <div class="spoiler-body">


<pre>
server {
    listen 80;
    server_name backend.yiisite.com admin.yiisite.com;

    root /var/www/html/website/backend/web;

    index index.php;

    # Limit methods, allowed on server to GET, HEAD and POST
    if ($request_method !~ ^(GET|HEAD|POST)$ ) {
return 444;
    }

    location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
root /var/www/html/website/backend/web;
expires 30d;
access_log off;
    }

    location ~* \.(css|js)$ {
root /var/www/html/website/backend/web;
expires 7h;
access_log off;
    }

    location / {
try_files $uri $uri/ /index.php;
    }

    location ~ \.(php|html)$ {
root /var/www/html/website/backend/web;

	fastcgi_param PATH_INFO $fastcgi_path_info;
	fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	fastcgi_split_path_info ^(.+\.php)(/.+)$;

fastcgi_pass 127.0.0.1:9000;
include fastcgi_params;
    }
}
</pre>

</div> </div>

<div class="spoiler-wrap">
<div class="spoiler-head folded">
  frontend.conf
</div>

<div class="spoiler-body">
<pre>
server {
    listen 80;
    server_name yiisite.com;

    root /var/www/html/website/frontend/web;

    index index.php;

    # Limit methods, allowed on server to GET, HEAD and POST
    if ($request_method !~ ^(GET|HEAD|POST)$ ) {
return 444;
    }

    location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
root /var/www/html/website/frontend/web;
expires 30d;
access_log off;
    }

    location ~* \.(css|js)$ {
root /var/www/html/website/frontend/web;
expires 7h;
access_log off;
    }

    location / {
try_files $uri $uri/ /index.php;
    }

    location ~ \.(php|html)$ {
root /var/www/html/website/frontend/web;

	fastcgi_param PATH_INFO $fastcgi_path_info;
	fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	fastcgi_split_path_info ^(.+\.php)(/.+)$;

fastcgi_pass 127.0.0.1:9000;
include fastcgi_params;
    }
}
</pre>



</div> </div>


В следующем спойлере обратите внимание на выделенные жирным шрифтом базу, имя пользователя и пароль. Они будут содаваться при построении инстанса базы данных. Инстанс `yiiweb` будет использовать имя хоста `yiidb` для свзяи с инстансом `mysql`:

<div class="spoiler-wrap">
<div class="spoiler-head folded">
  env
</div>

<div class="spoiler-body">


<pre>
# Framework
# ---------
YII_DEBUG   = false
YII_ENV     = prod

# Databases
# ---------
DB_DSN     = mysql:host=yiidb;port=3306;dbname=yiidb
DB_USERNAME= yiiuser
DB_PASSWORD= yiipasswd
DB_TABLE_PREFIX  =

# Urls
# ----
FRONTEND_URL    = http://yiisite.com
BACKEND_URL     = http://backend.yiisite.com
STORAGE_URL     = http://storage.yiisite.com

# Other
# -----
FRONTEND_COOKIE_VALIDATION_KEY = 7VDYlzcbOcxPJNh8Z2ZNDoRXauT2p1_T
BACKEND_COOKIE_VALIDATION_KEY = JbbAiWyG5isNQSz4FoIblVSxg0mdpOUF
ADMIN_EMAIL = admin@example.com
ROBOT_EMAIL = robot@example.com
GITHUB_CLIENT_ID = your-client-id
GITHUB_CLIENT_SECRET = your-client-secret
</pre>
</div> </div>

Опираясь на [статью о настройке nginx+php-fcgi](/nginx-php-fcgi/) создаем следующие файлы. Во время создания контейнера они лягут в нужные места:

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    php-fastcgi-init
  </div>

  <div class="spoiler-body">
<pre>
#!/bin/sh
#
# php-fastcgi - Use PHP as a FastCGI process via nginx.
#
# chkconfig: - 85 15 description: Use PHP as a FastCGI process via nginx. processname: php-fastcgi pidfile: /var/run/php-fastcgi.pid Source function library.
. /etc/rc.d/init.d/functions
# Source networking configuration.
. /etc/sysconfig/network
# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

phpfastcgi="/usr/bin/php-fastcgi"
prog=$(basename php-cgi)
lockfile=/var/lock/subsys/php-fastcgi

start() {
    [ -x $phpfastcgi ] || exit 5
    echo -n $"Starting $prog: "
    daemon $phpfastcgi
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}
stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -Q
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}
restart() {
    configtest || return $?
    stop
    start
}
reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $prog -HUP
    RETVAL=$?
    echo
}
force_reload() {
    restart
}
rh_status() {
    status $prog
}
rh_status_q() {
    rh_status >gt;/dev/null 2>gt;&1
}
case "$1" in
    start)
rh_status_q && exit 0
$1
;;
    stop)
rh_status_q || exit 0
$1
;;
    restart|configtest)
$1
;;
    reload)
rh_status_q || exit 7
$1
;;
    force-reload)
force_reload
;;
    status)
rh_status
;;
    condrestart|try-restart)
rh_status_q || exit 0
;;
    *)
echo $"Usage: $0 {start|stop|status|restart}"
exit 2
esac
</pre>

</div> </div>


<div class="spoiler-wrap">
<div class="spoiler-head folded">
  php-fastcgi-bin
</div>

<div class="spoiler-body">
<pre>
#!/bin/bash

FASTCGI_USER=nginx
FASTCGI_GROUP=nginx
ADDRESS=127.0.0.1
PORT=9000
PIDFILE=/var/run/php-fastcgi.pid
CHILDREN=6
PHP5=/usr/bin/php-cgi

/usr/bin/spawn-fcgi -a $ADDRESS -p $PORT -P $PIDFILE -C $CHILDREN -u $FASTCGI_USER -g $FASTCGI_GROUP -f $PHP5

</pre>
</div> </div>


Вся красота автоматической настройки заключается в следующем скрипте. Для его работы нужна учетная запись на [github.com](http://www.github.com). Если у Вас таковой нету - зарегистрируйтесь и подредактируйте скрипт (`\r` должно оставаться в конце).

Этот скрипт нельзя выполнить на этапе инициализации контейнера (так называемого `билда`), так как на этом этапе docker не линкует контейнеры и не монтирует разделы.


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    autoconf.sh
  </div>

  <div class="spoiler-body">
<pre>
#!/bin/bash
git clone https://github.com/trntv/yii2-starter-kit.git /var/www/html/website

cd /var/www/html/website

expect -c 'set timeout 3600; spawn composer install; expect "Username:" {send -- "your_name@mail.com\r";}; expect "Password:" { send -- "password\r"}; interact'

expect -c 'set timeout 3600; spawn ./init; expect "Your choice " {send -- "1\r"}; expect "Initialize the application" {send -- "yes\r"}; interact'

cp /root/env /var/www/html/website/.env

expect -c 'set timeout 3600; spawn php console/yii migrate; expect "Apply the above migrations" {send -- "yes\r"}; interact'

php console/yii rbac/init

chown -R nginx:nginx /var/www/html
</pre>


</div> </div>

<center>
  <div id="gads">
  </div>
</center>


Ох навалил я тексто-кода. Спасибо спойлерам. Читать его практически не нужно. Копи-паст решает все.



Подготовка закончена, возвращаемся к самому докеру.



Создаем `Dockerfile` со следующим содержанием:


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Dockerfile
  </div>

  <div class="spoiler-body">
<pre>
FROM centos:6
# install the PHP extensions we need
# Add repos
RUN rpm -Uhv http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
RUN rpm -Uhv http://rpms.famillecollet.com/enterprise/remi-release-6.rpm

# Install stuff using yum from peel and remi repos
RUN yum install spawn-fcgi expect openssh openssh-server git php-common php php-pdo php-gd php-pecl-memcache php-mbstring php-xmlrpc php-devel php-soap php-mysql php-cli php-pear php-snmp php-xml php-intl php-pspell php-pecl-zendopcache nginx -y --enablerepo=epel --enablerepo=remi --enablerepo=remi-php55

# Copy websites' configuration files to nginx folder
COPY backend.conf /etc/nginx/conf.d/
COPY frontend.conf /etc/nginx/conf.d/

# Configure php to run in fastcgi mode
COPY php-fastcgi-init /etc/rc.d/init.d/
RUN mv /etc/rc.d/init.d/php-fastcgi-init /etc/rc.d/init.d/php-fastcgi && chmod +x /etc/rc.d/init.d/php-fastcgi

COPY php-fastcgi-bin /usr/bin/
RUN mv /usr/bin/php-fastcgi-bin /usr/bin/php-fastcgi && chmod +x /usr/bin/php-fastcgi

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin
RUN mv /bin/composer.phar /bin/composer
RUN composer global require "fxp/composer-asset-plugin"

# Attach website folder
VOLUME /var/www/html

# Add autoconfigure script to container
COPY env /root/
COPY autoconf.sh /root/

EXPOSE 80

CMD /etc/rc.d/init.d/php-fastcgi start && service nginx start && /bin/sh -c "while true; do sleep 1; done"
</pre>
</div></div>

Сам файл предоставляет набор команд, которые будут выполнены в ходе создания контейнера. Второй (db) инстанс будет создан из образа.

Создаем файл `docker-compose.yml` со следующим содержанием:


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    docker-compose.yml
  </div>

<div class="spoiler-body">
<pre>

yiiweb:
  build: .
  ports:
    - 80:80
  links:
    - yiidb
  volumes:
    - ./web:/var/www/html

yiidb:
  image: mysql
  ports:
    - 3306:3306
  volumes:
    - ./db:/var/lib/mysql
  environment:
    MYSQL_DATABASE: yiidb
    MYSQL_USER: yiiuser
    MYSQL_PASSWORD: yiipasswd
    MYSQL_ROOT_PASSWORD: rootpasswd
</pre>
</div></div>


<center>
  <div id="gads">
  </div>
</center>


Подготовка закончена. Создаем контейнер:
```bash
docker-compose build
```

Побежали бегунки, поскакали цифры. Во время выполнения вы будете видеть все, что происходит в контейнере. Об успешном окончании сборки вы бедет уведомлены.

Можно запускать:
```bash
docker-compose up -d
```

Осталось выполнить `autoconf.sh`.

Для начала получим список контейнеров:

```bash
docker ps
```

Вы увидите таблицу из двух строк, первая колонка - id контейнера.

Выполняем скрипт:

```bash
docker exec %id_контейнера% bash /root/autoconf.sh
```

Если же вы хотите поработать в консоли самого контейнера - выполните следующую команду:

```bash
docker exec -ti %id_контейнера% bash
```


Находясь в консоли контейнера можно запустить:
```bash
bash /root/autoconf.sh
```

Осталось дождаться окончания работы скрипта.
