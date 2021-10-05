---
id: 2290
title: Установка Mysql-Proxy на RedHat 6.4
date: 2014-12-16T15:46:20+00:00
author: admin

guid: http://www.tech-notes.net/?p=2290
permalink: /install-mysql-proxy-redhat-6-4/
image: /wp-content/uploads/2014/10/mysql-cluster-logo-150x105.png
categories:
  - Linux server
tags:
  - mysql-proxy
  - Балансировка нагрузки
---
Вот такой он Linux. При работе с `CentOS` я не столкнулся с проблемами при [установке Mysql-Proxy](/mysql-proxy-intall-configure-in-centos7/). В случае с `RedHad 6.4` этот подход не сработал. Поэтому вторая версия того, как можно установить `mysql-proxy`.

Для начала скачиваем нужну версию:

```bash
wget http://dev.mysql.com/get/Downloads/MySQL-Proxy/mysql-proxy-0.8.5-linux-el6-x86-64bit.tar.gz
```

Распаковываем её:

```bash
tar xf mysql-proxy-0.8.5-linux-el6-x86-64bit.tar.gz
```

Перемещаем в папку opt^

```bash
mv mysql-proxy-0.8.5-linux-el6-x86-64bit /opt/mysql-proxy
```

Ничего компилировать не нужно.

Создаем init.d скрипт:

```bash
nano /etc/init.d/mysql-proxy
```

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /etc/init.d/mysql-proxy
  </div>

  <div class="spoiler-body">


<pre>
#!/bin/sh
#
# mysqlproxy init file for MySQL-Proxy
# /etc/init.d/mysqlproxy: This script starts and stops the mysql-proxy daemon
#
# chkconfig: - 50 50
# description: The MySQL Proxy daemon init script
#
# processname: mysql-proxy
# config: /opt/mysql-proxy/mysql-proxy.conf


# Source function library.
. /etc/rc.d/init.d/functions

PROXY_PATH=/opt/mysql-proxy
LUA_PATH=$PROXY_PATH/share/mysql-proxy/?.lua
prog="mysql-proxy"

# Source networking configuration
. /etc/sysconfig/network

# Check that networking is up
[ ${NETWORKING} = "no" ] && exit 0

# Set default mysql-proxy configuration.
declare -x PROXY_OPTIONS=""

# Parse mysql-proxy configuration file
if [ -f /opt/mysql-proxy/mysql-proxy.conf ] ; then
    exec 3&lt;&0
    exec &lt; /opt/mysql-proxy/mysql-proxy.conf
    while read opt
    do
        # remove comments, tabs, and spaces
        opt=`echo $opt | sed "s/\#.*//;s/\t//g;s/ //g"`
        if [ -n "$opt" ]
        then
            PROXY_OPTIONS=$PROXY_OPTIONS" --$opt"
        fi
    done
fi

# Set a successful return value by default
RETVAL=0

# See how we were called.
case "$1" in
  start)
        # Start daemon.
        echo -n $"Starting $prog: "
        daemon $NICELEVEL $PROXY_PATH/bin/mysql-proxy $PROXY_OPTIONS
        RETVAL=$?
        echo
        if [ $RETVAL = 0 ]; then
                touch /var/lock/subsys/mysql-proxy
        fi
        ;;
  stop)
        # Stop daemons.
        echo -n $"Stopping $prog: "
        killproc $prog
        RETVAL=$?
        echo
        if [ $RETVAL = 0 ]; then
                rm -f /var/lock/subsys/mysql-proxy
                rm -f $PROXY_PID
        fi
        ;;

  restart)
        $0 stop $2
        sleep 3
        $0 start $2
        ;;

  status)
        status mysql-proxy
        RETVAL=$?
        ;;

  condrestart)
		[ -e /var/lock/subsys/mysql-proxy ] && restart || :
	;;
  \*)
        echo "Usage: $0 {start|stop|restart|condrestart|status }"
        RETVAL=1
        ;;
esac

exit $RETVAL
</pre>
</div> </div>


Делаем его исполняемым:


```bash
chmod +x /etc/init.d/mysql-proxy
```

<center>
<div id="gads">
</div>
</center>


Создаем конфигурационный файл:

<div class="spoiler-wrap">
<div class="spoiler-head folded">
/opt/mysql-proxy/mysql-proxy.conf
</div>

<div class="spoiler-body">
<pre>
#########################
# admin module
#########################
plugins=proxy
plugins=admin

# listening address:port of internal admin-server (default: :4041)
admin-address               = :4041
admin-username = admin
admin-password = password

admin-lua-script = /opt/mysql-proxy/share/mysql-proxy/admin-sql.lua

#########################
# proxy-module
#########################

# listening address:port of the proxy-server (default: :4040)
#  this can also be a socket: /tmp/mysql.sock
proxy-address               = :3307

# address:port of the remote slave-server (default: not set)
proxy-read-only-backend-addresses   = slave1:3306
proxy-read-only-backend-addresses   = slave2:3306

# address:port of the remote backend-servers (default: 127.0.0.1:3306)
proxy-backend-addresses     = master:3306

# disables profiling of queries (default: enabled)
#proxy-skip-profiling

# fix bug #25371 (mysqld > 5.1.12) for older libmysql versions
proxy-fix-bug-25371

# filename of the lua script (default: not set)
proxy-lua-script    = /opt/mysql-proxy/share/mysql-proxy/rw-splitting.lua

#########################
# application options
#########################

# Start in daemon-mode
daemon

# Location of PID file
pid-file                  = /var/run/mysql-proxy.pid

log-use-syslog
</pre>
  </div> </div>



Размещаем папку со скриптами в более удобном месте.


```bash  
mv /opt/mysql-proxy/share/doc/mysql-proxy /opt/mysql-proxy/share/
```


Создаем симлинки:


```bash  
cd /usr/lib64;
ln -s /opt/mysql-proxy/lib/libmysql-chassis.so.0.0.0 libmysql-chassis.so.0
ln -s /opt/mysql-proxy/lib/libmysql-proxy.so.0.0.0 libmysql-proxy.so.0
ln -s /opt/mysql-proxy/lib/libmysql-chassis-glibext.so.0.0.0 libmysql-chassis-glibext.so.0
ln -s /opt/mysql-proxy/lib/libevent-2.0.so.5.1.9 libevent-2.0.so.5
ln -s /opt/mysql-proxy/lib/libmysql-chassis-timing.so.0.0.0 libmysql-chassis-timing.so.0
  ```


Включаем автозагрузку `mysql-proxy`


```bash  
chkconfig mysql-proxy on
```


Запускаем:
```bash  
/etc/init.d/mysql-proxy start
```

[Настраиваем master-slave репликацию](http://www.tech-notes.net/mysql-master-slave-replication/) между серверами
