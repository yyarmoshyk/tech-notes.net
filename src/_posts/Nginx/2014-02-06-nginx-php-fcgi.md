---
id: 356
title: Настройка Nginx + php-fcgi
date: 2014-02-06T16:47:52+00:00
author: admin

guid: http://www.tech-notes.net/?p=356
permalink: /nginx-php-fcgi/
image: /wp-content/uploads/2014/02/Screenshot-from-2014-02-06-170622.png
categories:
  - Nginx
tags:
  - nginx
  - php-fcgi
---
Полагаю, что `nginx` у Вас уже установлен. Осталось настроить обработку php. Все описанные действия проводились на `CentOS Linux`. По аналогии их можно повторить и для Linux Ubuntu.

Для CentOS Вам потребуется добавить `Epel` репозитарий:  
**Centos 5.x**:

```bash
wget http://dl.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm  
rpm -Uvh epel-release-5*.rpm
```

**Centos 6.x**:

```bash
wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm  
rpm -Uvh epel-release-6*.rpm
```

Дальше ставим нужные пакеты:

```bash
yum install php-common php-mbstring php-bcmath php-cli php-mysql spawn-fcgi
```

Скачиваем нужные файлы:

```bash
wget -O /etc/init.d/php-fastcgi /wp-content/uploads/2014/02/etc-init.d-php-fastcgi  
wget -O /usr/bin/php-fastcgi /wp-content/uploads/2014/02/usr-bin-php-fastcgi
```

Делаем их исполняемыми:

```bash
chmod +x /etc/init.d/php-fastcgi  
chmod +x /usr/bin/php-fastcgi
```

Ставим на автозагрузку и запускаем:

```bash
chkconfig -add php-fastcgi  
chkconfig php-fastcgi on  
/etc/init.d/php-fastcgi start
```

Проверяем:

```bash
netstat -nlp |grep cgi
```

Дальше настраиваем Nginx:  
Добавляем следующие строки в настройки хоста в nginx:

```bash
location ~ \.php$ {
  root           /var/www/html;
  fastcgi_pass   127.0.0.1:9000;
  fastcgi_index  index.php;
  fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
  include        fastcgi_params;
}
```


Перезапускаем nginx.
