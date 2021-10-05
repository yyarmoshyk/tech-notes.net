---
id: 3130
title: Сборка NginX v.1.9.10 из исходника
date: 2016-01-29T18:46:27+00:00
author: admin

guid: http://www.tech-notes.net/?p=3130
permalink: /compile-latest-nginx-from-source/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - nginx 1.9.10
---
Установка любого ПО по средствам компиляции пакета с исходным кодом - лучший способ использовать последние версии.

Я буду собирать NginX с поддержкой mod_security, geoip и srcache. Srcache позволяет NginX использовать Memcache для хранения кэша.

На сегодняшний день последней версией является NginX v.1.9.10, его и будем устанавливать.

**Возимся с GeoIP.** Процесс ничем не отличается от <a href="http://www.tech-notes.net/install-nginx-from-sources/" target="_blank">описного в этой статье</a>:

```bash
cd /usr/local/src  
wget http://www.maxmind.com/download/geoip/api/c/GeoIP-latest.tar.gz  
tar xf GeoIP-latest.tar.gz && cd GeoIP-1.*  
./configure  
make  
make install
```

В ходе установки в консоле пробежало сообщение:

```bash
Libraries have been installed in:  
/usr/local/lib
```

Подозреваю, что именно туда оно и было установлено. Сделаем симлинк на всякий случай. Боюсь, что nginx там не увидит нужную библиотеку:

```bash
ln -s /usr/local/lib/libGeoIP.so.1.6.0 /usr/lib/libGeoIP.so.1
```

**Возимся с srcache**  
Список релизов можно найти на следующей странице:  
<a href="https://github.com/openresty/srcache-nginx-module/tags" target="_blank">https://github.com/openresty/srcache-nginx-module/tags</a>

Установка происходит по <a href="http://wiki.nginx.org/HttpSRCacheModule#Installation" target="_blank">стандартной инструкции.</a> Скачиваем, распаковываем и включаем в конфигурацию nginx с помощью `--add-module=`:

```bash
cd /usr/local/src  
wget https://github.com/openresty/srcache-nginx-module/archive/v0.30.tar.gz  
tar xf v0.30.tar.gz
```

**Приступаем непосредственно к NginX.** Скачиваем и распаковываем:

```bash
cd /usr/local/src  
wget http://nginx.org/download/nginx-1.9.10.tar.gz  
tar xf nginx-1.9.10.tar.gz  
cd nginx-1.9.10
```

Включаем в сборку mod_security и http_stub_status_module на этапе конфигурирования. Модуль http_stub_status_module мне нужен для более детального надзора за сервером через NewRelic:

```bash
./configure -prefix=/opt/nginx -user=nginx -group=nginx -with-http_ssl_module -with-http_realip_module -with-http_gzip_static_module -with-http_auth_request_module -add-module=/usr/local/src/modsecurity-2.9.0/nginx/modsecurity -with-http_stub_status_module **-add-module=/usr/local/src/srcache-nginx-module-0.30**  
make -j 2  
make install
```

Создаем скрипт, который будет запускать демон. В пакете я его не нашел:

```bash
vim /etc/init.d/nginx
```

<a href="http://wiki.nginx.org/Nginx-init-ubuntu" target="_blank">Содержимое из официального сайта</a> - в спойлере ниже  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /etc/init.d/nginx
  </div>

  <div class="spoiler-body">
    </p>

    ```bash
#! /bin/sh
### BEGIN INIT INFO
# Provides:          nginx
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: nginx init.d dash script for Ubuntu &lt;=9.10.
# Description:       nginx init.d dash script for Ubuntu &lt;=9.10.
### END INIT INFO
#------------------------------------------------------------------------------
# nginx - this Debian Almquist shell (dash) script, starts and stops the nginx
#         daemon for ubuntu 9.10 and lesser version numbered releases.
#
# description:  Nginx is an HTTP(S) server, HTTP(S) reverse \
#               proxy and IMAP/POP3 proxy server.  This \
#		script will manage the initiation of the \
#		server and it's process state.
#
# processname: nginx
# config:      /usr/local/nginx/conf/nginx.conf
# pidfile:     /acronymlabs/server/nginx.pid
# Provides:    nginx
#
# Author:  Jason Giedymin
#          &lt;jason.giedymin AT gmail.com&gt;.
#
# Version: 2.0 02-NOV-2009 jason.giedymin AT gmail.com
# Notes: nginx init.d dash script for Ubuntu &lt;=9.10.
#
# This script's project home is:
# 	http://code.google.com/p/nginx-init-ubuntu/
#
#------------------------------------------------------------------------------
#                               MIT X11 License
#------------------------------------------------------------------------------
#
# Copyright (c) 2009 Jason Giedymin, http://Amuxbit.com formerly
#				     http://AcronymLabs.com
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
#------------------------------------------------------------------------------

#------------------------------------------------------------------------------
#                               Functions
#------------------------------------------------------------------------------
. /lib/lsb/init-functions

#------------------------------------------------------------------------------
#                               Consts
#------------------------------------------------------------------------------
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/opt/nginx/sbin/nginx

PS="nginx"
PIDNAME="nginx"				#lets you do $PS-slave
PIDFILE=$PIDNAME.pid                    #pid file
PIDSPATH=/var/run

DESCRIPTION="Nginx Server..."

RUNAS=root                              #user to run as

SCRIPT_OK=0                             #ala error codes
SCRIPT_ERROR=1                          #ala error codes
TRUE=1                                  #boolean
FALSE=0                                 #boolean

lockfile=/var/lock/subsys/nginx
NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"

#------------------------------------------------------------------------------
#                               Simple Tests
#------------------------------------------------------------------------------

#test if nginx is a file and executable
test -x $DAEMON || exit 0

# Include nginx defaults if available
if [ -f /etc/default/nginx ] ; then
        . /etc/default/nginx
fi

#set exit condition
#set -e

#------------------------------------------------------------------------------
#                               Functions
#------------------------------------------------------------------------------

setFilePerms(){

        if [ -f $PIDSPATH/$PIDFILE ]; then
                chmod 400 $PIDSPATH/$PIDFILE
        fi
}

configtest() {
	$DAEMON -t -c $NGINX_CONF_FILE
}

getPSCount() {
	return `pgrep -f $PS | wc -l`
}

isRunning() {
        if [ $1 ]; then
                pidof_daemon $1
                PID=$?

                if [ $PID -gt 0 ]; then
                        return 1
                else
                        return 0
                fi
        else
                pidof_daemon
                PID=$?

                if [ $PID -gt 0 ]; then
                        return 1
                else
                        return 0
                fi
        fi
}

#courtesy of php-fpm
wait_for_pid () {
        try=0

        while test $try -lt 35 ; do

                case "$1" in
                        'created')
                        if [ -f "$2" ] ; then
                                try=''
                                break
                        fi
                        ;;

                        'removed')
                        if [ ! -f "$2" ] ; then
                                try=''
                                break
                        fi
                        ;;
                esac

                #echo -n .
                try=`expr $try + 1`
                sleep 1
        done
}

status(){
	isRunning
	isAlive=$?

	if [ "${isAlive}" -eq $TRUE ]; then
                echo "$PIDNAME found running with processes:  `pidof $PS`"
        else
                echo "$PIDNAME is NOT running."
        fi


}

removePIDFile(){
	if [ $1 ]; then
                if [ -f $1 ]; then
        	        rm -f $1
	        fi
        else
		#Do default removal
		if [ -f $PIDSPATH/$PIDFILE ]; then
        	        rm -f $PIDSPATH/$PIDFILE
	        fi
        fi
}

start() {
        log_daemon_msg "Starting $DESCRIPTION"

	isRunning
	isAlive=$?

        if [ "${isAlive}" -eq $TRUE ]; then
                log_end_msg $SCRIPT_ERROR
        else
                start-stop-daemon --start --quiet --chuid $RUNAS --pidfile $PIDSPATH/$PIDFILE --exec $DAEMON \
                -- -c $NGINX_CONF_FILE
                setFilePerms
                log_end_msg $SCRIPT_OK
        fi
}

stop() {
	log_daemon_msg "Stopping $DESCRIPTION"

	isRunning
	isAlive=$?
        if [ "${isAlive}" -eq $TRUE ]; then
                start-stop-daemon --stop --quiet --pidfile $PIDSPATH/$PIDFILE

		wait_for_pid 'removed' $PIDSPATH/$PIDFILE

                if [ -n "$try" ] ; then
                        log_end_msg $SCRIPT_ERROR
                else
                        removePIDFile
	                log_end_msg $SCRIPT_OK
                fi

        else
                log_end_msg $SCRIPT_ERROR
        fi
}

reload() {
	configtest || return $?

	log_daemon_msg "Reloading (via HUP) $DESCRIPTION"

        isRunning
        if [ $? -eq $TRUE ]; then
		`killall -HUP $PS` #to be safe

                log_end_msg $SCRIPT_OK
        else
                log_end_msg $SCRIPT_ERROR
        fi
}

quietupgrade() {
	log_daemon_msg "Peforming Quiet Upgrade $DESCRIPTION"

        isRunning
        isAlive=$?
        if [ "${isAlive}" -eq $TRUE ]; then
		kill -USR2 `cat $PIDSPATH/$PIDFILE`
		kill -WINCH `cat $PIDSPATH/$PIDFILE.oldbin`

		isRunning
		isAlive=$?
		if [ "${isAlive}" -eq $TRUE ]; then
			kill -QUIT `cat $PIDSPATH/$PIDFILE.oldbin`
			wait_for_pid 'removed' $PIDSPATH/$PIDFILE.oldbin
                        removePIDFile $PIDSPATH/$PIDFILE.oldbin

			log_end_msg $SCRIPT_OK
		else
			log_end_msg $SCRIPT_ERROR

			log_daemon_msg "ERROR! Reverting back to original $DESCRIPTION"

			kill -HUP `cat $PIDSPATH/$PIDFILE`
			kill -TERM `cat $PIDSPATH/$PIDFILE.oldbin`
			kill -QUIT `cat $PIDSPATH/$PIDFILE.oldbin`

			wait_for_pid 'removed' $PIDSPATH/$PIDFILE.oldbin
                        removePIDFile $PIDSPATH/$PIDFILE.oldbin

			log_end_msg $SCRIPT_ok
		fi
        else
                log_end_msg $SCRIPT_ERROR
        fi
}

terminate() {
        log_daemon_msg "Force terminating (via KILL) $DESCRIPTION"

	PIDS=`pidof $PS` || true

	[ -e $PIDSPATH/$PIDFILE ] && PIDS2=`cat $PIDSPATH/$PIDFILE`

	for i in $PIDS; do
		if [ "$i" = "$PIDS2" ]; then
	        	kill $i
                        wait_for_pid 'removed' $PIDSPATH/$PIDFILE
			removePIDFile
		fi
	done

	log_end_msg $SCRIPT_OK
}

destroy() {
	log_daemon_msg "Force terminating and may include self (via KILLALL) $DESCRIPTION"
	killall $PS -q &gt;&gt; /dev/null 2&gt;&1
	log_end_msg $SCRIPT_OK
}

pidof_daemon() {
    PIDS=`pidof $PS` || true

    [ -e $PIDSPATH/$PIDFILE ] && PIDS2=`cat $PIDSPATH/$PIDFILE`

    for i in $PIDS; do
        if [ "$i" = "$PIDS2" ]; then
            return 1
        fi
    done
    return 0
}

case "$1" in
  start)
	start
        ;;
  stop)
	stop
        ;;
  restart|force-reload)
	stop
	sleep 1
	start
        ;;
  reload)
	$1
	;;
  status)
	status
	;;
  configtest)
        $1
        ;;
  quietupgrade)
	$1
	;;
  terminate)
	$1
	;;
  destroy)
	$1
	;;
  *)
	FULLPATH=/etc/init.d/$PS
	echo "Usage: $FULLPATH {start|stop|restart|force-reload|status|configtest|quietupgrade|terminate|destroy}"
	echo "       The 'destroy' command should only be used as a last resort."
	exit 1
	;;
esac

exit 0

```


    <p>
      </div> </div>
    </p>

    <p>
      Делаем его исполняемым и ставим на автозагрузку:
    </p>

    <blockquote>
      <p>
        sudo chmod +x /etc/init.d/nginx<br /> sudo /usr/sbin/update-rc.d -f nginx defaults
      </p>
    </blockquote>

    <p>
      Линкуем папку с логами:
    </p>

    <blockquote>
      <p>
        ln -s /opt/nginx/logs/ /var/log/nginx
      </p>
    </blockquote>

    <p>
      Создаем пользователя nginx:
    </p>

    <blockquote>
      <p>
        echo `/bin/false` >> /etc/shells<br /> useradd -d /opt/nginx -s /bin/false nginx
      </p>
    </blockquote>

    <p>
      Редактируем главный конфигурационный файл:
    </p>

    <blockquote>
      <p>
        vim /opt/nginx/conf/nginx.conf
      </p>
    </blockquote>

    <p>
      Вносим в него следующие изменения:
    </p>

    <p>
      Меняем пользователя на nginx:
    </p>

    ```bash
user nginx;
```


    <p>
      Улучшаем безопасность:
    </p>

    ```bash
        client_body_buffer_size 4K;
        client_header_buffer_size 4k;
        large_client_header_buffers 4 4k;
        limit_conn_zone $binary_remote_addr zone=slimits:5m;
```


    <p>
      Убираем коментарии с формата лога доступа и явно прописываем пути к файлам:
    </p>

    ```bash

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

        ##
        # Logging Settings
        ##
        access_log /var/log/nginx/access.log main;
        error_log /var/log/nginx/error.log;

```


    <p>
      Завершающим шагом является настройка компресси файлов:
    </p>

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
<strong>#Это - одна строка. </strong>
        gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml alication/xml+rss text/javascript;
```


    <p>
      Добавляем следующую строку в секцию <code>http</code>:
    </p>

    ```bash
include /opt/nginx/sites/*.conf;
```


    <p>
      Создаем папку, в которой будем хранить все конфиги сайтов:
    </p>

    <blockquote>
      <p>
        mkdir /opt/nginx/sites
      </p>
    </blockquote>

    <p>
      Создаем конфиг сайта:
    </p>

    <blockquote>
      <p>
        vim /opt/nginx/sites/mywebsite.conf
      </p>
    </blockquote>

    <p>
      Вносим в него следующие:
    </p>

    ```bash
server {
    listen 80;
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


    <p>
      На этом этапе все закончено. Можно запускать nginx и проверять:<br /> <img src="/wp-content/uploads/2016/01/Screenshot-from-2016-01-29-133048.png" alt="Screenshot from 2016-01-29 13:30:48" width="729" height="292" class="aligncenter size-full wp-image-3128" srcset="/wp-content/uploads/2016/01/Screenshot-from-2016-01-29-133048.png 729w, /wp-content/uploads/2016/01/Screenshot-from-2016-01-29-133048-170x68.png 170w, /wp-content/uploads/2016/01/Screenshot-from-2016-01-29-133048-300x120.png 300w" sizes="(max-width: 729px) 100vw, 729px" />
    </p>

    <p>
      После выхода новой версии можно повторить все шаги и снова иметь самый новый NginX.
    </p>

    <div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
      <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->

      <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
    </div>
