---
id: 2390
title: Настройка Apache для работы с Python 3.4 в CentOS 6.5
date: 2015-02-06T15:19:59+00:00
author: admin

guid: http://www.tech-notes.net/?p=2390
permalink: /configure-apache-wscgi-for-python3-4-centos-6-5/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
tags:
  - wscgi
---
Для установки последей версии Python 3.4 на CentOS 6.5 можно [воспользоваться предыдущей статьей](http://www.tech-notes.net/install-python-centos6-5/).

Для работы с python 3.4 вэб сервер apache требует модуль wsgi. Если у Вас в системе имеется два питона (2.7 и 3.4), тогда этот модуль нужно собрать из исходинков. Я предполагаю, что для работы сайта нужна именно последняя версия Python.

Установим нужные пакеты:

```bash
yum install httpd-devel -y
```

Создадим необходимые симлинки:

```bash
ln -s /usr/local/lib/libpython3.so /usr/lib64/libpython3.4.so  
ln -s /usr/local/lib/libpython3.4m.so.1.0 /usr/lib64/libpython3.4m.so.1.0  
cp /usr/local/lib/libpython3.4m.so /usr/lib/
```

<center>
  <div id="gads">
  </div>
</center>

Скачиваем, конфигурируем, устанавливаем:

```bash
wget https://modwsgi.googlecode.com/files/mod_wsgi-3.4.tar.gz  
tar -xf mod_wsgi-3.4.tar.gz  
cd mod_wsgi-3.4  
./configure -with-python=/usr/local/bin/python3.4  
make  
make install
```

Все установлено в папку

```bash
/usr/lib64/httpd/modules
```

Осталось включить модуль.

```bash
echo 'LoadModule wsgi_module modules/mod_wsgi.so' >> /etc/httpd/conf.d/wsgi.conf
```

создаем конфиг файл для Django:

```bash
nano /etc/httpd/conf.d/django.conf
```

Приводим его к следующему виду:

```bash
WSGIPythonPath /var/www/website

<VirtualHost *:80>
ServerName website.com

WSGIScriptAlias / /var/www/website/website/wsgi.py
<Directory /var/www/website/>
  <Files wsgi.py>
    Order deny,allow
    Allow from all
  </Files>
</Directory>
</VirtualHost>
```


Если у Вас несколько проэктов в разных директориях:

```bash
WSGIPythonPath /var/www/website:/var/www/website2:/var/www/website3
```


Файл wsgi.py должен быть исполняемым:

```bash
chmod +x /var/www/website/website/wsgi.py
```

Нужно удостовериться, что апач исправен:

```bash
apachectl -t
```

Перезапускаем его, если все хорошо:

```bash
/etc/init.d/httpd restart
```

Из-за включенного selinux, могут быть проблемы:

```bash
setenforce 0
```

Подредактируйте файл `/etc/selinux/config` и измените:

```bash
SELINUX=enforcing
```

на

```bash
SELINUX=disabled
```
