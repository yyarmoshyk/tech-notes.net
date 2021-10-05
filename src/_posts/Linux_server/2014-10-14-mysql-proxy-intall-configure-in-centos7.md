---
id: 1919
title: 'Mysql-Proxy: Установка и настройка на CentOS7'
date: 2014-10-14T12:17:32+00:00
author: admin

guid: http://www.tech-notes.net/?p=1919
permalink: /mysql-proxy-intall-configure-in-centos7/
panels_data:
  - 'a:0:{}'
image: /wp-content/uploads/2014/10/mysql-cluster-logo-150x105.png
categories:
  - Linux server
tags:
  - mysql-proxy
  - Балансировка нагрузки
---
Балансировка mysql запросов - важная вещь, если мы используете несколько mysql серверов. Если у Вас настроена [master-slave репликация](/mysql-master-slave-replication/) баз даных, то есть смысл распределить нагрузку на несколько серверов. Отправлять update, insert запросы на master сервер, а select запросы распределять между двумя, тремя и более серверами.  

[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038-300x211.png" alt="Screenshot from 2014-10-14 08:00:38" width="300" height="211" class="aligncenter size-medium wp-image-1923" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038-300x211.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038-170x120.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038-200x140.png 200w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038.png 630w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-14-080038.png)

Для этого можно воспользоваться утилитой mysql-proxy. К сожалению довольно мало документации на эту тему присутствует на просторах интернета. Нужно устранить эту брешь.

Итак, для начала нам понадобится glib последней версии. Все действия я проводил на CentOS7.

Скачиваем исходник и распаковываем его:

```bash
wget http://ftp.gnome.org/pub/gnome/sources/glib/2.42/glib-2.42.0.tar.xz  
tar xvf glib-2.42.0.tar.xz
```

В случае проблем с распаковкой - усановите `xz-utils` или просто пакет `xz` и посторите операцию.

Следующие пакеты нужны будут для выполнения правильной сборки:

```bash
yum install lua lua-devel libevent libevent-devel glib2 glib2-devel pkg-config mysqlclient14-devel libffi mysql libffi-devel zlib zlib-devel gcc gettext-devel glibc glibc-devel
```

Теперь переходим в папку `glib` и устанавливаем его:

```bash
cd glib-2.42.0  
./configure  
make  
make install
```

В ходе выполнения появится вот такое сообщение:

```bash
Libraries have been installed in:
   /usr/local/lib

If you ever happen to want to link against installed libraries
in a given directory, LIBDIR, you must either use libtool, and
specify the full pathname of the library, or use the `-LLIBDIR'
flag during linking and do at least one of the following:
   - add LIBDIR to the `LD_LIBRARY_PATH' environment variable
     during execution
   - add LIBDIR to the `LD_RUN_PATH' environment variable
     during linking
   - use the `-Wl,-rpath -Wl,LIBDIR' linker flag
   - have your system administrator add LIBDIR to '/etc/ld.so.conf'
```


Соответсвенно библиотеки оказались в `/usr/local/lib/`

<center>
  <div id="gads">
  </div>
</center>

Для того что бы система их увидела, я сделал симлинки, создав резервные копии оригиальных файлов:

```bash
mv /usr/lib64/libglib-2.0.so.0 /usr/lib64/libglib-2.0.so.0.bak  
mv /usr/lib64/libglib-2.0.so /usr/lib64/libglib-2.0.so.bak
ln -s /usr/local/lib/libglib-2.0.so.0.4200.0 /usr/lib64/libglib-2.0.so.0  
ln -s /usr/local/lib/libglib-2.0.so.0.4200.0 /usr/lib64/libglib-2.0.so
```

Теперь можно переходить к установке `mysql-proxy`. Говорят, что он когда-то был доступен в репозитарии `Epel`. К сожалению я его там не нашел. Поэтому скачиваем готовый пакет и устанавливаем его:

```bash
wget ftp://195.220.108.108/linux/fedora/linux/releases/22/Everything/x86_64/os/Packages/m/mysql-proxy-0.8.5-1.fc22.x86_64.rpm  
rpm -ihv mysql-proxy-0.8.5-1.fc22.x86_64.rpm
```

Также понадобится оригинальный пакет с исходниками из-за дополнительного скрипта. Скачиваем его и распаковываем:
```bash
wget http://dev.mysql.com/get/Downloads/MySQL-Proxy/mysql-proxy-0.8.5-linux-glibc2.3-x86-64bit.tar.gz  
tar xf mysql-proxy-0.8.5-linux-glibc2.3-x86-64bit.tar.gz
```

Чудо скрипт, который будет разделять `read` и `write` запросы, нужно скопировать в папку к `mysql-proxy`:

```bash
cp share/doc/mysql-proxy/rw-splitting.lua /usr/lib64/mysql-proxy/lua/proxy/
```

Узнаем расположение конфиг файла вот ткой командой:

```bash
rpm -qc mysql-proxy
```

В моем случае это `/etc/sysconfig/mysql-proxy`. В любимом редакторе открываем этот файл для редактирования и устанавливаем пароль для админа (`ADMIN_PASSWORD`) - он не должен быть пустым.

`PROXY_OPTIONS` приводим к следующему виду:

```bash
PROXY_OPTIONS=`-log-level=info \  
-proxy-address=:3306 \  
-log-use-syslog \  
-plugins=proxy \  
-plugins=admin \  
-proxy-backend-addresses=192.168.1.143:3306 \  
-proxy-read-only-backend-addresses=192.168.1.132 \  
-proxy-lua-script=/usr/lib64/mysql-proxy/lua/proxy/rw-splitting.lua`
```
* `proxy-backend-addresses` - адрес `master` сервера, на который будут отправляться `insert` и `update` запросы.  
* `proxy-read-only-backend-addresses` - адрес сервера, на который будут уходить только `select` запросы.  
* `proxy-address` - определяет `ip` адрес и порт, на котором будут обрабатываться входящие соединения. По умолчанию 4040

Создаем симлинки:

```bash
cd /usr/lib64  
ln -s /opt/mysql-proxy/lib/libmysql-chassis.so.0.0.0 libmysql-chassis.so.0  
ln -s /opt/mysql-proxy/lib/libmysql-proxy.so.0.0.0 libmysql-proxy.so.0  
ln -s /opt/mysql-proxy/lib/libmysql-chassis-glibext.so.0.0.0 libmysql-chassis-glibext.so.0  
ln -s /opt/mysql-proxy/lib/libevent-2.0.so.5.1.9 libevent-2.0.so.5  
ln -s /opt/mysql-proxy/lib/libmysql-chassis-timing.so.0.0.0 libmysql-chassis-timing.so.0
```

Теперь можно запускать:

```bash
/etc/init.d/mysql-proxy start
```

Для того что бы проверть состояние кластера подключитесь к админке:

```bash
mysql -hlocalhost -P4041 -uadmin -ppassword
```

Для отображения всех бэкэндов выполните следующий запрос:

```bash
SELECT * FROM backends;
```

<center>
  <div id="gads">
  </div>
</center>

В результате получаем табличку:

```bash
+-------------+--------------------+---------+------+------+-------------------+
| backend_ndx | address            | state   | type | uuid | connected_clients |
+-------------+--------------------+---------+------+------+-------------------+
|           1 | 192.168.1.143:3306 | unknown | rw   | NULL |                 0 |
|           2 | 192.168.1.132:3306 | unknown | ro   | NULL |                 0 |
+-------------+--------------------+---------+------+------+-------------------+

```


При написании получал вдохновление с [этой](http://www.openlogic.com/wazi/bid/259864/Simple-database-load-balancing-with-MySQL-Proxy" target="_blank">этой</a> и <a href="http://blog.zhuzhaoyuan.com/category/software/mysql-proxy/) статей.
