---
id: 694
title: Как скомпилировать php v.5.5.10 из исходников
date: 2014-03-18T19:07:52+00:00
author: admin

guid: http://www.tech-notes.net/?p=694
permalink: /compile-php-5-5-10-from-sources/
image: /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-150809.png
categories:
  - PHP
tags:
  - Apache
  - скомпилировать php
---
Эта заметка расскажет как можно установить PHP последней версии на свой сервер из исходного кода, на примере PHP 5.5.10 + CentOS 6.5.

Для начала скачиваем исходный код с официального зеркала. Я живу в Украине и для меня php.net предложил вот такой вот список зеркал.  
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-105840-300x145.png" alt="Screenshot from 2014-03-18 10:58:40" width="300" height="145" class="aligncenter size-medium wp-image-697" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-105840-300x145.png 300w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-105840.png 379w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-105840.png)

Можно перейти по [этой](http://ua1.php.net/get/php-5.5.10.tar.gz/from/a/mirror) ссылке, и на основе Вашего местонахождения будут предложены зеркала, которые находятся в Вашей стране.

Буду рассматривать пример установки php v.5.5.10 на чистый сервер CentOS 6.5.

Итак скачиваем и распаковываем:

```bash
wget -O php-5.5.10.tar.gz http://ua1.php.net/get/php-5.5.10.tar.gz/from/this/mirror  
tar xf php-5.5.10.tar.gz && cd php-5.5.10
```

Что бы все получилось нам нужен C++ компилятор.  
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-110707-300x37.png" alt="Screenshot from 2014-03-18 11:07:07" width="300" height="37" class="aligncenter size-medium wp-image-698" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-110707-300x37.png 300w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-110707.png 553w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-110707.png)

На чистом сервере его нету, поэтому его нужно установить:

```bash
yum install gcc make
```

В принципе на этом этапе конфигуратор запустится и отвалится с вот такой ошибкой:

```bash
checking libxml2 install dir no  
checking for xml2-config path  
configure: error: xml2-config not found. Please check your libxml2 installation.
```

Нужно доставить libxml:

```bash
yum install libxml2-devel
```

На этом этапе configure скрипт выполняется без ошибок. Он находит что есть в системе и с чем он может собрать php. Не буду расписывать в подробностях опции, которые включены по умолчанию, скажу лишь то, что с таким набором далеко не зайдешь. В этом списке нету ничего что помогло бы нам запустить какой-то простенький сайтик.

<center>
  <div id="gads">
  </div>
</center>

Я буду собирать php c поддержкой следующих модулей:

  * curl
  * mysql
  * mysqli
  * mhash
  * pdo-mysql
  * gd
  * mcrypt
  * mbstring
  * openssl
  * pcre
  * soap
  * Apache module
  * zlib

Сначала включим Epel репозиторий:

```bash
wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm  
rpm -Uvh epel-release-6*.rpm
```

Дальше нужно доставить нужные пакеты:

```bash
yum install mysql-devel httpd-devel gd-devel libmcrypt-devel mcrypt bison-devel mhash-devel libcurl-devel
```

Теперь можно и пособирать:

```bash
./configure -bindir=/usr/bin -with-config-file-path=/etc -with-curl -with-mhash -with-mysql -with-mysqli -with-gd -with-pdo-mysql -with-mcrypt -enable-mbstring -with-openssl -with-pcre-regex -enable-soap -with-apxs2 -with-zlib
```

немного пояснений:  
`--bindir` - путь, куда сохранить бинарники  
`--with-config-file-path` - путь хранения php.ini

По умолчанию php складывается в папку /usr/local.

Дальше устанавливаем:

```bash
make && make install
```

В ходе установки make должен внести вот такую строчку в httpd.conf. Если этого не произошло - сделайте это сами:  
`LoadModule php5_module        /usr/lib/httpd/modules/libphp5.so`

<center>
  <div id="gads">
  </div>
</center>

В папке с исходным кодом предоставляется 2 типа php.ini. В зависимости от целей, для которых используется сервер, выполняем одну из следующих команд:

```bash
cp php.ini-development /etc/php.ini
```

или

```bash
cp php.ini-production /etc/php.ini
```

Учим Apache работать с php файлами:  
`nano /etc/httpd/conf.d/php.conf`

```bash
<FilesMatch \.php$>  
	SetHandler application/x-httpd-php  
</FilesMatch>
```

При рестарте Apache я получил вот такую ошибку:

```bash
Starting httpd: httpd: Syntax error on line 216 of /etc/httpd/conf/httpd.conf: Cannot load /usr/lib/httpd/modules/libphp5.so into server: /usr/lib/httpd/modules/libphp5.so: cannot restore segment prot after reloc: Permission denied
```

Это связано с тем, что Selinux блокирует добавление модулей в Apache. Временно отключить SeLinux можно командой:

```bash
/usr/sbin/setenforce 0
```

Для того что бы на всегда отключить SeLinux, нужно в файле /etc/selinux/config  
Заменить:  
`SELINUX=enforcing`  
на  
`SELINUX=disabled`

Теперь можно создать в папке /var/www/html файл php.php со следующим содержанием:

```bash
<?php phpinfo() ?>
```


И открыть его в браузере. Если все работает - увидите вот такую картинку:  
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-145842-300x205.png" alt="Screenshot from 2014-03-18 14:58:42" width="300" height="205" class="aligncenter size-medium wp-image-699" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-145842-300x205.png 300w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-145842-660x451.png 660w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-145842.png 878w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-18-145842.png)
