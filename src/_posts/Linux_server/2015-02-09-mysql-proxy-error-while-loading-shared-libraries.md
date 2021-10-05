---
id: 2407
title: 'Mysql-Proxy: Error while loading shared libraries'
date: 2015-02-09T20:10:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=2407
permalink: /mysql-proxy-error-while-loading-shared-libraries/
image: /wp-content/uploads/2014/10/mysql-cluster-logo-150x105.png
categories:
  - Linux server
tags:
  - mysql-proxy
  - Балансировка нагрузки
---
Если Вы читаете эту заметку - значит Вы использовали произвольный мануал по установке mysql-proxy.

Если бы Вы воспользовались [этим](/install-mysql-proxy-redhat-6-4/) или [этим](/mysql-proxy-intall-configure-in-centos7/) руководством, то все работало бы как часы.

Необходимые библиотеки не слинкованы, если Вы видите одну из следующих ошибок:

```bash
mysql-proxy: error while loading shared libraries: libmysql-chassis.so.0: cannot open shared object file: No such file or directory  
mysql-proxy: error while loading shared libraries: libmysql-proxy.so.0.0.0: cannot open shared object file: No such file or directory  
mysql-proxy: error while loading shared libraries: libevent-2.0.so.5.1.9: cannot open shared object file: No such file or directory  
mysql-proxy: error while loading shared libraries: libmysql-chassis-timing.so.0.0.0: cannot open shared object file: No such file or directory
```

Проблема решается следующим образом:

```bash
cd /usr/lib64  
ln -s /opt/mysql-proxy/lib/libmysql-chassis.so.0.0.0 libmysql-chassis.so.0  
ln -s /opt/mysql-proxy/lib/libmysql-proxy.so.0.0.0 libmysql-proxy.so.0  
ln -s /opt/mysql-proxy/lib/libmysql-chassis-glibext.so.0.0.0 libmysql-chassis-glibext.so.0  
ln -s /opt/mysql-proxy/lib/libevent-2.0.so.5.1.9 libevent-2.0.so.5  
ln -s /opt/mysql-proxy/lib/libmysql-chassis-timing.so.0.0.0 libmysql-chassis-timing.so.0
```

Возможно Вам прийдется подредактировать пути к библиотекам.
