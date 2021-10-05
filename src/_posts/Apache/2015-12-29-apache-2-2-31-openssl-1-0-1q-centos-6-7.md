---
id: 3042
title: Apache 2.2.31 OpenSSL 1.0.1q на CentOS 6.7
date: 2015-12-29T09:05:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=3042
permalink: /apache-2-2-31-openssl-1-0-1q-centos-6-7/
image: /wp-content/uploads/2015/12/apache-ssl-logo.jpg
categories:
  - Apache
tags:
  - SSL
  - Apache
  - centos
  - openssl
---
В последнее время все чаще стал сталкиваться с тем, что на серверах нужно каким-то образом обновлять openssl до последней версии.

К сожалению от библиотек OpenSSL зависит очень многое на сервере, поэтому глобально его заменить не получится. Вернее получится, но это приведет к плачевным результатам. Мне как-то удалось собрать rpm пакет `OpenSSL 1.0.1n` для `CentOS 6.5`, который успешно заменил OpenSSL 1.0.1e, но после этого на сервере перестали работать демоны Apache и MySQL. Они упорно продолжали искать библиотеки от OpenSSL 1.0.1e и не понимали что такое 1.0.1n.

Пару дней назад меня все же добили, и я решил вернуться к поискам решения этой проблемы.

Без сигарет мозг работает лучше, как оказывается. И вот уже некурящий я понял, что не обязательно переписывать системные библиотеки OpenSSL. Можно скомпилировать последний OpenSSL используя пакет с исходным кодом, при этом оставить системный OpenSSL. На основе его уже создать модуль для Apache. К моему счастью (как потом оказалось. изначально я был несчастлив) клиенту нужен был еще и Apache последней версии ветки 2.2, который в репозитариях CentOS 6.7 недоступен.

На подготовительном этапе установим пару пакетов:

```bash
yum install gcc make zlib-devel wget
```

Дальше я буду работать в папке `/usr/local/src`. Вы можете выбрать любую другую на свое усмотрение.

## Начинаем мы с OpenSSL.

На момент написания этой статьи заменой для 1.0.1e был 1.0.1q. Его и качаем:

```bash
wget https://www.openssl.org/source/openssl-1.0.1q.tar.gz
```

Все собирается очень просто. Главное - не забыть создать `shared` библиотеку:

```bash
./config -prefix=/opt/openssl -openssldir=/opt/openssl/openssl -shared  
make  
make install
```

После этого все компоненты, будут лежать в папке `/opt/openssl`.

Некоторые люди любят использовать префикс `/usr/local`. В таком случае все файлы после компиляции будут расположены в следующих папках:
  * /usr/local/bin
  * /usr/local/include
  * /usr/local/lib
  * /usr/local/openssl

Любой другой пакет OpenSSL можно собрать по аналогии.

Для удобства использования можно слинковать бинарник в папку из переменного окружения $PATH:

```bash
ln -s /opt/openssl/bin/openssl /usr/bin/openssl101q
```

Для коректной работы openssl требует Perl модуль &#8216;WWW::Curl::Easy&#8217;.

```bash
yum install perl-WWW-Curl.x86_64
```

## Apache

Версия Apache не критична. У меня в требованиях было использование последней версии ветки 2.2.

Скачиваем и распаковываем:

```bash
wget http://ftp.ps.pl/pub/apache/httpd/httpd-2.2.31.tar.gz  
tar xf httpd-2.2.31.tar.gz  
cd httpd-2.2.31
```

Минимальный набор опций для скрипта configure будет следующим:

```bash
./configure -prefix=/opt/httpd2 -with-included-apr **-enable-ssl=shared -with-ssl=/opt/openssl -enable-ssl-staticlib-deps**
```

Полный набор модулей будет собран с помощью следующей комбинации опций для configure, при этом каждый модуль будет представлен в виде отдельного файла с расширением `so`:

```bash
./configure -prefix=/opt/httpd2 -enable-ssl=shared -with-ssl=/opt/openssl -enable-ssl-staticlib-deps=shared -enable-mods-static=ssl=shared -enable-exception-hook=shared -enable-maintainer-mode=shared -enable-pie=shared -enable-authn-dbm=shared -enable-authn-anon=shared -enable-authn-dbd=shared -enable-authn-alias=shared -enable-isapi=shared -enable-file-cache=shared -enable-cache=shared -enable-disk-cache=shared -enable-mem-cache=shared -enable-dbd=shared -enable-reqtimeout=shared -enable-ext-filter=shared -enable-substitute=shared -enable-charset-lite=shared -enable-deflate=shared -enable-log-forensic=shared -enable-logio=shared -enable-mime-magic=shared -enable-cern-meta=shared -enable-expires=shared -enable-headers=shared -enable-ident=shared -enable-usertrack=shared -enable-unique-id=shared -enable-proxy=shared -enable-proxy-connect=shared -enable-proxy-http=shared -enable-proxy-scgi=shared -enable-proxy-ajp=shared -enable-proxy-balancer=shared -enable-optional-hook-export=shared -enable-optional-hook-import=shared -enable-optional-fn-import=shared -enable-optional-fn-export=shared -enable-dav=shared -enable-info=shared -enable-suexec=shared -enable-cgi=shared -enable-cgid=shared -enable-dav-fs=shared -enable-dav-lock=shared -enable-vhost-alias=shared -enable-imagemap=shared -enable-speling=shared -enable-rewrite=shared -enable-so -enable-http
```

Если Вы получили слудеющую ошибку, значит `zlib-devel` отсутствует в системе:

```bash
mod_deflate... configure: error: mod_deflate has been requested but can not be built due to prerequisite failures
```

Осталось дело за малым:

```bash
make  
make install
```

По завершении компиляции все файлы будут лежать в папке `/opt/httpd2`.  
Осталось создать init скрипт и добавить сервис на автозагрузку.

```bash
wget -O /etc/init.d/httpd2 /wp-content/uploads/2015/12/httpd2  
chmod +x /etc/init.d/httpd2  
chkconfig httpd2 on
```

Во время сборки нужные библиотеки не были скопированы в папку Apache, поэтому демон откажется запускаться. Выполните следующее:

```bash
ln -s /opt/openssl/lib/libcrypto.so.1.0.0 /opt/httpd2/lib/  
ln -s /opt/openssl/lib/libssl.so.1.0.0 /opt/httpd2/lib/
```

Теперь можно запускать:

```bash
/etc/init.d/httpd2 start
```

Линкуем apachectl:

```bash
ln -s /opt/httpd2/bin/apachectl /usr/sbin/apachectl2
```

Для проверки можно воспользоваться утилитой telnet. Будучи в косоли сервера выполните:

```bash
telnet localhost 80
```

После того как увидие приветствие от сервера apache, выполните:

```bash
HEAD / HTTP/1.0
```

По умолчанию Apache настроен показывать все заголовки, поэтому в ответ вы должны увидеть следующее:  
<img src="/wp-content/uploads/2015/12/apach-openssl.png" alt="apach-openssl" width="548" height="225" class="aligncenter size-full wp-image-3053" srcset="/wp-content/uploads/2015/12/apach-openssl.png 548w, /wp-content/uploads/2015/12/apach-openssl-170x70.png 170w, /wp-content/uploads/2015/12/apach-openssl-300x123.png 300w" sizes="(max-width: 548px) 100vw, 548px" />

## Послесловие

После этого Вы можете без лишней головной боли обновлять как `Apache` так и `OpenSSL` по мере выхода новых версий.

Полезными могут быть следующие статьи:
  * [Затыкаем слабые места в настройках SSL Apache](/forward-secrecy-rc4-poodle-sslcompression/)
  * [Установка PHP из исходников](/compile-php-5-5-10-from-sources/)
  * [Установка mod_security для Apache](/install-modsecurity-for-apache/)
  * [Установка mod_geoip](/mod_geoip-from-sources-apache/)
  * [Создаем безопасный WEB сервер](/create-secure-web-server/)

При написании статьи использовались следующие ресурсы:  
* [blog.ivanristic.com](http://blog.ivanristic.com/2013/08/compiling-apache-with-static-openssl.html)
* [dan.drydog.com](http://dan.drydog.com/apache2php.html)
