---
id: 2513
title: Run Yii in Docker container locally
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
In this article I want to tell you what I did to automatically deploy `NginX`, `php-fcgi` and install `Yii` using `docker`. It can be usefull for local development. Eventually it was written many years ago so some steps might be outdated.

For this container I used [Yii 2 Starter Kit](https://github.com/trntv/yii2-starter-kit)

So we have a server or PC with `docker` installed. I located all files in `/opt/docker` folder so first lets create it:

```bash
mkdir /opt/docker/yii
```

I will be using two separate containers:
   * yiiweb (nginx+php+yii)
   * yiidb (mysql)

Lets create folders for them:
```bash
mkdir /opt/docker/yii/web  
mkdir /opt/docker/yii/db
```

Switch to the container folder:
```bash
cd /opt/docker/yii
```

To get started we need the following files:
   * `backend.conf` and `frontend.conf` - site configs for nginx
   * `env` - the file that will go to the site folder. It describes the framework settings.
   * `php-fastcgi-init` - starter script for php
   * `php-fastcgi-bin` is another script for php to work
   * `autoconf.sh` - this script needs to be executed in the container after startup.

<center>
  <div id="gads">
  </div>
</center>

The next two files are nothing special - nginx configs for two sites. You'll need to customize them accordingly.

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

In the following spoiler please pay attention to the database, username and password in bold. They will be generated when the database instance is built. The `yiiweb` instance will use the hostname `yiidb` to communicate with the `mysql` instance:

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

Based on [an article about configuring nginx+php-fcgi](/nginx-php-fcgi/) we create the following files. During the container build they will be located in the correct paths:
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


The whole beauty of automatic configuration lies in the following script. You need an account on [github.com](http://www.github.com) to use it. If you don't have one than go ahead and register. Next edit the script (`\r` should remain at the end).

This script cannot be executed at the stage of container initialization (the so-called `build`) since at this stage docker does not link containers and does not mount partitions.

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
The preparation is finished. Let's move on

Create `Dockerfile`:
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


Create `docker-compose.yml` with the following contexts:
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


Let's build the container:
```bash
docker-compose build
```

Run the following to launch the container:
```bash
docker-compose up -d
```

Now we need to run the `autoconf.sh`.

Get the list of contianers running:

```bash
docker ps
```

You'll get the table that consists on multiple columns and a 2 rows. The first collumn contains the id of the container. The last one contains the name of the container. You can use either `container_id` or `container_name` in the following command:

```bash
docker exec %container_id% bash /root/autoconf.sh
```

You can attach to the container console by running the following:
```bash
docker exec -ti %container_id% bash
```

Run the following in the container console:
```bash
bash /root/autoconf.sh
```
