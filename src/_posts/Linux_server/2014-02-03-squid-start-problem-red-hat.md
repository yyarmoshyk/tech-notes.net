---
id: 280
title: Проблема при запуске Squid
date: 2014-02-03T16:52:55+00:00
author: admin

guid: http://www.tech-notes.net/?p=280
permalink: /squid-start-problem-red-hat/
image: /wp-content/uploads/2014/02/squid-proxy-redhat.png
categories:
  - Linux server
tags:
  - squid
---
Столкнулся с проблемой старта `Squid` на `RedHad Linux v.6.4`. `Squid` просто не запускался.

При попытке запуска бинарника squid вот такой командой:  
```bash
/usr/sbin/squid -N
```

Проявляется корень зла:

```bash
/usr/sbin/squid: relocation error: /usr/sbin/squid: symbol private_MD5_Init, version libcrypto.so.10 not defined in file libcrypto.so.10 with link time reference
```

Проверить кто предоставляет нужную библиотеку можно вот так:  
```bash
yum provides */libcrypto.so.10
```

На выходе получаем список пакетов, в которых он есть. Ищем самый последний. В моем случае это openssl-1.0.1e-16.el6_5.4.x86_64  
```bash
rpm -q --provides openssl v.1.0.1e| grep libcrypto.so.10
```

И получаем вот такой вот результат:  
```bash
libcrypto.so.10()(64bit)  
libcrypto.so.10(OPENSSL_1.0.1)(64bit)  
libcrypto.so.10(OPENSSL_1.0.1_EC)(64bit)  
libcrypto.so.10(libcrypto.so.10)(64bit)
```

Можем немножко порадоваться, тому что в составе пакета `openssl-1.0.1e-16.el6_5.4.x86_64` библиотека `libcrypto.so.10` имеет подпись. Но долго радоваться не придется - при попытке установки новой версии `openssl` система поругается на файлы, которые относятся к уже установленной версии:

```bash
Transaction Check Error:  
file /usr/lib64/libcrypto.so.1.0.1e from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/libssl.so.1.0.1e from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/lib4758cca.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libaep.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libatalla.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libcapi.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libchil.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libcswift.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libgmp.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libnuron.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libpadlock.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libsureware.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64  
file /usr/lib64/openssl/engines/libubsec.so from install of openssl-1.0.1e-16.el6_5.4.x86_64 conflicts with file from package openssl10-libs-1.0.1e-1.ius.el6.x86_64
```

Проблема в том, что на сервере уже были установлены пакеты

```bash
openssl  
openssl-devel  
openssl10-libs
```

Нужно удалить `openssl10-libs`. Если использовать `yum` - он вынесет из системы все зависимые пакеты. В моем случае - тонна пакетов `nodejs`. Для удаления пакетов без зависимостей используем rpm:  
```bash
rpm --nodeps -e openssl10-libs
```

Устанавливаем новую версию openssl:  
```bash
yum install openssl v.1.0.1e
```

Можем стартовать Sqid.  
```bash
/etc/init.d/squid start
```

Проверяем или запустился:  
```bash
netstat -tunlp |grep 3128
```

После бубнопляски вокруг пакетов, рекомендую проверить остальные:  
```bash
yum check
```
