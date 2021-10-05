---
id: 545
title: Установка Asp.Net на Linux (nginx+mono+xsp)
date: 2014-04-18T13:32:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=545
permalink: /asp-net-install-nginx-mono-xsp/
image: /wp-content/uploads/2014/04/2aff80f2.png
categories:
  - FromHabrSandbox
  - Nginx
  - Ubuntu Linux
tags:
  - Asp.Net на Linux
  - mono
  - nginx
  - xsp
---
В этой статье я покажу, как настроить простую связку nginx + Asp.Net. Под простой надо понимать, что какие-то специфические особенности проектов, разграничение прав пользователей, высокие нагрузки и т.п. нужно настраивать отдельно (особенно это касается Asp.Net). Статья написана хабраюзером [gouranga](http://habrahabr.ru/users/gouranga/).

В свое время озадачившись проблемой хостинга маленьких Asp.Net-проектов я осознал одну простую вещь: покупать лицензию на Windows Server, а потом и арендовывать достаточно мощный выделенный/виртуальный сервер для каких-то домашних поделок/экспериментов — крайне неразумно. Решение как-то сразу всплыло в моей лысой голове: есть же Mono! Непродолжительный поиск по mono-project.com вывел на FAQ об Asp.Net. 

Итак, мы имеем свежеустановленный Debian Squeeze x64 Minimal. Самый простой вариант установки последних версий nginx — установка из репозиториев dotdeb.org. Кстати, очень хороший репозиторий: в нем, помимо nginx, всегда последние версии php, mysql (percona) и redis. Чуть сложнее установить из исходников — об этом чуть ниже.

### Установка nginx

Добавим в sources.list новый репозиторий, пропишем GnuPG-ключ и обновим источники:

> echo `deb http://packages.dotdeb.org stable all` >> /etc/apt/sources.list  
> wget -q http://www.dotdeb.org/dotdeb.gpg -O- | apt-key add -  
> apt-get update

Существует три разных пакета, собранных с разными наборами модулей: nginx-lite, nginx-full (пакет nginx как раз его алиас) и nginx-extras. Какой устанавливать — решать вам, нам бы хватило и lite версии (Proxy есть и ладно), но на момент написания статьи я уже установил full, поэтому будем устанавливать его:

> apt-get install nginx

Если вы <a href="http://www.tech-notes.net/install-nginx-from-sources/" title="Установка nginx из исходников" target="_blank">устанавливаете nginx из исходников</a>, то ./configure надо запускать с такими параметрами:

> ./configure -conf-path=/etc/nginx/nginx.conf -error-log-path=/var/log/nginx/error.log -http-client-body-temp-path=/var/lib/nginx/body -http-fastcgi-temp-path=/var/lib/nginx/fastcgi -http-log-path=/var/log/nginx/access.log -http-proxy-temp-path=/var/lib/nginx/proxy -http-scgi-temp-path=/var/lib/nginx/scgi -http-uwsgi-temp-path=/var/lib/nginx/uwsgi -lock-path=/var/lock/nginx.lock -pid-path=/var/run/nginx.pid -with-debug -with-http_addition_module -with-http_dav_module -with-http_geoip_module -with-http_gzip_static_module -with-http_image_filter_module -with-http_realip_module -with-http_stub_status_module -with-http_ssl_module -with-http_sub_module -with-http_xslt_module -with-ipv6 -with-sha1=/usr/include/openssl -with-md5=/usr/include/openssl -with-mail -with-mail_ssl_module

Это будет практически соответствовать пакету nginx-full, за исключением отсутствия сторонних модулей Upstream Fair Queue и Echo.

<center>
  <div id="gads">
  </div>
</center>

### Установка Mono

Для Mono таких удобств с репозиториями нет, придется сразу компилировать последние исходники.  
<a href="http://ftp.novell.com/pub/mono/sources/" target="_blank">Качаем</a> последние исходники mono и xsp (на момент написания 2.10.2):

> wget `http://ftp.novell.com/pub/mono/sources/mono/mono-2.10.2.tar.bz2`  
> wget `http://ftp.novell.com/pub/mono/sources/xsp/xsp-2.10.2.tar.bz2`

Теперь распакуем архивы:

> tar xf *.tar.bz2

Если tar ругнется на отсутствие bzip2 (в minimal точно ругнется), его нужно поставить:

> apt-get install bzip2

Для компиляции mono и xsp нам понадобится следующее:

> apt-get install build-essential gawk bison gettext libgdiplus pkg-config libglib2.0-0 libglib2.0-dev

Приступим к конфигурированию и компиляции:

> cd mono-2.10.2 && ./configure -prefix=/usr -sysconfdir=/etc/mono && make && make install && cd ..

Если установка прошла успешно, то запуск команды mono -version покажет нам заветное и долгожданное:

> mono -version

<pre>Mono JIT compiler version 2.10.2 (tarball Сбт Июн 11 15:54:39 MSD 2011)
Copyright (C) 2002-2011 Novell, Inc and Contributors. www.mono-project.com
			        TLS:           __thread
			        SIGSEGV:       altstack
			        Notifications: epoll
			        Architecture:  amd64
			        Disabled:      none
			        Misc:          softdebug
			        LLVM:          supported, not enabled.
			        GC:            Included Boehm (with typed GC and Parallel Mark)
```


<center>
  <div id="gads">
  </div>
</center>

### Теперь установим xsp:

> cd xsp-2.10.2 && ./configure -prefix=/usr -sysconfdir=/etc/xsp && make && make install && cd ..

Весь xsp написан на C#, компиляция должна пройти очень быстро. Проверим, что оно нам выдаст:

> xsp4 -version

<pre>xsp4.exe 2.10.2.0
Copyright (C) 2002-2011 Novell, Inc.
Minimalistic web server for testing System.Web
```


Похоже, все схватилось. Пора переходить к настройке.

### Настройка Xsp

Создадим директорию нашей будущей странички Hello World: 

> mkdir -p /var/www/asptest

Сразу создадим классический «Hello World» для пробы:

> nano /var/www/asptest/Default.aspx

В файле напишем следующие строки:

```bash
&lt;%@ Page language="C#" %&gt;
&lt;html&gt;
				    &lt;head&gt;
								        &lt;title&gt;Hello C#&lt;/title&gt;
				    &lt;/head&gt;
				    &lt;body&gt;
								        &lt;p>&lt;% Response.Write("Hello World");%&gt;&lt;/p&gt;
				    &lt;/body&gt;
&lt;/html&gt;
```


Поскольку xsp изначально задумывался как тестовый сервер, скриптов запуска демона там нет. Будем исправлять такую ситуацию. Создадим файл `/etc/default/xsp`, и запишем в него переменные по-умолчанию:

> user=www-data  
> group=www-data
> 
> port=8080  
> address=0.0.0.0

Создадим загрузочный файл, дадим ему права на выполнение:

> wget /wp-content/uploads/2014/04/xsp  
> mv xsp /etc/init.d/  
> chmod +x /etc/init.d/xsp 

Добавим его в автозапуск с дефолтными уровнями запуска (поправить по надобности) и запустим наш новый демон:

> update-rc.d xsp defaults  
> /etc/init.d/xsp start

По-умолчанию, сервер слушает на всех интерфейсах, проверить легко:

> netstat -nlp | grep 8080

<center>
  <div id="gads">
  </div>
</center>

### Настройка nginx

Суть настройки nginx в проксировании обращений только для asp-файлов. Остальные статические файлы должен раздавать nginx.

```bash
server {
		        listen 80;
		        server_name  serveraddr.ru;
		        location / {
				                root /var/www/asptest
				                #root /usr/lib/xsp/test;
				                index index.html index.htm index.aspx default.aspx Default.aspx;
		        }
		        error_page   500 502 503 504  /50x.html;
		        location = /50x.html {
				                root   html;
		        }
		        location ~ \.(aspx|asmx|ashx|axd|asax|ascx|soap|rem|axd|cs|config|dll)$ {
				                root /var/www/asptest
				                proxy_pass   http://127.0.0.1:8080;
		        }
}
```


Вот и все. Повторюсь, что в wiki Mono ясно указано, что xsp лучше использовать для тестов!

[Оригинал](http://habrahabr.ru/post/121159/)

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>