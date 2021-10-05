---
id: 977
title: Установка PostfixAdmin и RoundCube
date: 2014-05-29T13:46:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=977
permalink: /install-postfixadmin-and-roundcube/
image: /wp-content/uploads/2014/05/managing-postfix.jpg
categories:
  - Почта
tags:
  - PostfixAdmin
  - RoundCube
---
Эта заметка поведает о том, как установить инструмент управления почтовыми ящиками - PostfixAdmin, и удобный интерфейс для чтения почты - RoundCube, на сервер под управлением CentOS Linux.

Первая статья: [Установка и Настройка Postfix](http://www.tech-notes.net/install-configure-postfix/ "Установка и Настройка Postfix")  
Вторая статья: [Установка и настройка службы imap/pop3 на базе Dovecot](http://www.tech-notes.net/install-dovecot-centos/ "Установка и настройка службы imap/pop3 на базе  Dovecot")

Настоятельно рекомендую ознакомиться с ними.

Для начала ставим нужные пакеты:  
```bash
yum -y install httpd php-mysql php-common php php-mail php-imap php-mbstring php-Mcrypt php-mcrypt php-dom php-intl pam  mod_ssl openssl crypto-utils setuptool wget
```

**1. Установка PostfixAdmin**

Скачиваем postfixadmin:  
```bash
wget http://downloads.sourceforge.net/project/postfixadmin/postfixadmin/postfixadmin-2.91/postfixadmin-2.91.tar.gz
```

1.1. Распаковываем его и копируем в папку /usr/share:  
```bash
tar xf postfixadmin-2.91.tar.gz
mv postfixadmin-2.91 /usr/share/postfixadmin
```

1.2. Меняем владельца папки на пользователя под которым запущен Apache:  
```bash
chown -R apache:apache /usr/share/postfixadmin
```

1.3. Редактируем параметры конфигурации Apache. Затем пере-запускаем Apache, что бы изменения вступили в силу:  
```bash
echo "Alias /postfixadmin /usr/share/postfixadmin" >> /etc/httpd/conf.d/mail.conf
/etc/init.d/httpd reload
```

1.4.***** Создаем базу для хранения почты, если ее нету. Если база существует - переходите к пункту 1.5. Учтите что **postfix и postfixadmin должны работать с одной базой данных**.

1.4.1. Подключаемся к mysql с правами root, создаем базу и пользователя:  
```bash
mysql -uroot -p
create database mail;
grant all privileges on mail.* to postfix@localhost identified by 'password';
```

1.4.2. Идем в браузере на ваш сайт и вводил с конец адреса ``/postfixadmin/setup.php``  
http://domainname.com/postfixadmin/setup.php

1.5.***** Если ваш postfix уже настроен на работу с базой данных, тогда Вам нужно ввести ее параметры в конфигурационный файл postfixadmin.

1.5.1. Для этого откройте в любимом редакторе файл `/usr/share/postfixadmin/config.inc.php` и введите параметры конфигурации:  
```bash
$CONF['database_type'] = 'mysqli';
$CONF['database_host'] = 'localhost';
$CONF['database_user'] = 'postfix';
$CONF['database_password'] = 'password';
$CONF['database_name'] = 'mail';
```

1.5.2. Измените значение `$CONF['configured']` на `true` после ввода настроек базы.

1.5.3. Идем в браузере на ваш сайт и вводил с конец адреса ``/postfixadmin/upgrade.php``  
http://domainname.com/postfixadmin/upgrade.php

После ввода пароля установки и создания администратора, PostfixAdmin заработает по ссылке.  
http://domainname.com/postfixadmin/

**2. Установка RoundCube**

Скачиваем roundcube:  
```bash
wget http://downloads.sourceforge.net/project/roundcubemail/roundcubemail/1.0.1/roundcubemail-1.0.1.tar.gz
```

2.1. Распаковываем его и копируем в папку /usr/share:  
```bash
tar xf roundcubemail-1.0.1.tar.gz
mv roundcubemail-1.0.1 /usr/share/roundcubemail
```

2.2. Меняем владельца папки на пользователя под которым запущен Apache:  
```bash
chown -R apache:apache /usr/share/roundcubemail
```

2.3. Создаем копию примера конфигурации:  
```bash
cp /usr/share/roundcubemail/config/config.inc.php.sample /usr/share/roundcubemail/config/config.inc.php
```

2.4. Создаем базу данных и пользователя mysql:  
```bash
mysql -uroot -p
create database roundcubemail;
grant all privileges on roundcubemail.* to roundcube@localhost identified by 'password';
```

2.5. Редактируем параметры конфигурации Apache. Затем пере-запускаем Apache, что бы изменения вступили в силу  
```bash
echo "Alias /roundcubemail /usr/share/roundcubemail" >> /etc/httpd/conf.d/mail.conf
/etc/init.d/httpd reload
```

2.6. В браузере переходим по адресу:  
http://domainname.com/roundcubemail/installer/

После завершения всех манипуляций RoundCube заработаетю
