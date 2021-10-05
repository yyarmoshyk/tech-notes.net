---
id: 1240
title: Настройка базовой авторизации в Nginx
date: 2014-07-15T13:34:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=1240
permalink: /basic-auth-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
  - Безопасность
---
Рассмотрю пример настройки базовой авторизации в Nginx для сайта на базе WordPress. Мне нужно что бы окно авторизации выпрыгивало для следующих страниц:

  * http://www.tech-notes.net/wp-admin
  * http://www.tech-notes.net/wp-login.php

Для этого для начала нужно установить apache2-utils. На сервере установлена Linux Ubuntu:

```bash
apt-get install apache2-utils
```

В случае с CentOS:

```bash
yum install httpd-tools
```

Этот набор утилит нужен для генерации файла с паролем и именем пользователя. Я создал папку для хранения таких файлов:

```bash
mkdir /etc/nginx/auth
```

Дальше генерируем сам пароль:

```bash
htpasswd -cmb /etc/nginx/auth/.htpasswd **user password**
```

Значения **user** и **password** меняем на нужные имя пользователя и пароль.

Дальше редактируем файл конфигурации виртуального хоста nginx следующими строками:

```bash
location /wp-admin {
	auth_basic "Restricted";
	auth_basic_user_file /etc/nginx/auth/.ht.passwd_wpadmin;
}

location /wp-login\.php {
	auth_basic "Restricted";
	auth_basic_user_file /etc/nginx/auth/.ht.passwd_wpadmin;
}
```
