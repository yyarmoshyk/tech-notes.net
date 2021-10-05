---
id: 559
title: Установка modsecurity для Nginx
date: 2014-06-06T16:06:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=559
permalink: /install-modsecurity-for-nginx/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Nginx
  - Безопасность
tags:
  - ModSecurity
---
``ModSecurity`` - своеобразный фаервол для `Apache`, `Nginx` и `IIS`. Это модуль, предоставляющий набор правил для фильтрации трафика. Это модуль из разряда must have для любого сервера.

19 Декабря 2013 года была выпущена версия 2.7.7. Она является наиболее актуальной на момент написания этой заметки. Собирать будем из исходников и настраивать для вэб сервера `Nginx`.

6 октября 2019 доступна более новая версия - 2.9.3. Без проверки её на работоспособность, я не буду обновлять статью.


Как не странно, сначала нужно скомпилировать сам mod_security, а потом включить его при компиляции `Nginx`.  
К сожалению mod_security нельзя подключить к уже установленному Nginx серверу. **Nginx должен быть скомпилирован с этим модулем.**

Устанавливаем нужное:

```bash
yum install libxml2 libxml2-devel httpd-devel libcurl-devel pcre-devel
```

При установке всякой ерунды я создаю папку /root/install и в ней веду работу:

```bash
mkdir /root/install  
cd /root/install
```

Скачиваем архив с исходным кодом mod_security:

```bash
wget https://www.modsecurity.org/tarball/2.7.7/modsecurity-apache_2.7.7.tar.gz  
tar xf modsecurity-apache_2.7.7.tar.gz  
cd modsecurity-apache_2.7.7
```

Устанавливаем:

```bash
./configure -enable-standalone-module  
make  
make install
```

<center>
  <div id="gads">
  </div>
</center>

На этом этапе будут сгенерированы исходные файлы, которые можно использовать при сборке nginx. Лежать они будут в папке:

```bash
nginx/modsecurity/
```

Инструкцию по установке `nginx` из исходного кода можно почитать [здесь](/install-nginx-from-sources/). Надеюсь не поленитесь и посмотрите, поэтому не копирую сюда всю инструкцию.

Нужно выполнить все шаги и этой заметки и на этапе конфигурирования (выполнение ./configure) добавить в строку вот это:

```bash
-add-module=/root/install/modsecurity-apache_2.7.7/nginx/modsecurity/
```

Для этого эксперимента я пропустил подключение модуля geo_ip и результирующая строка конфигурирования Nginx выглядела вот так:

```bash
./configure -prefix=/etc/nginx -user=nginx -group=nginx -with-http_ssl_module -with-http_spdy_module -with-http_realip_module -with-http_gzip_static_module -with-http_auth_request_module -with-http_perl_module -http-log-path=/var/log/nginx/ **-add-module=/root/install/modsecurity-apache_2.7.7/nginx/modsecurity**
```

Дальше скопируем предложенный файл настроек в папку nginx:

```bash
cp /root/install/modsecurity-apache_2.7.7/modsecurity.conf-recommended /etc/nginx/conf/modsecurity.conf
```

Включается он вот такими строками в описании location:

```bash
location / {
	ModSecurityEnabled on;
	ModSecurityConfig modsecurity.conf;
	ModSecurityPass @backend;
}
```
