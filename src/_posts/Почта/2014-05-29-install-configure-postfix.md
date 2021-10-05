---
id: 987
title: Установка и Настройка Postfix
date: 2014-05-29T14:45:55+00:00
author: admin

guid: http://www.tech-notes.net/?p=987
permalink: /install-configure-postfix/
image: /wp-content/uploads/2014/05/gmail_logo_stylized.png
categories:
  - Почта
tags:
  - postfix
  - dovecot
---
Эта статья открывает цикл статей о настройке почтового сервера. Весь рассказ начнется с настройки так называемого `mail transfer agent` (MTA). Святая святых и основная служба, которая будет отправлять почту с сервера, принимать входящую почту и класть ее в нужные места.

Рассмотрю настройку `Postfix` c `Mysql` на `CentOS`.

Для начала установим необходимые пакеты

```bash
yum install postfix postfix-mysql mysql-server openssl
```

Поставим их на автозагрузку и запустим:

```bash
chkconfig mysqld on  
chkconfig postfix on  
/etc/init.d/mysqld start  
/etc/init.d/postfix start
```

1. Первым шагом станет создание базы данных, в которой будет храниться информация о всех почтовых ящиках, пользователи почты и х пароли:

```bash
mysql -uroot -p  
create database mail;  
grant all privileges on mail.* to postfix@localhost identified by 'password';
```

Дальше создаем таблицы в новой базе данных:

```bash
use mail;
```

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица Admin:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `admin` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица alias:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `alias` (
  `address` varchar(255) NOT NULL,
  `goto` text NOT NULL,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`address`),
  KEY `domain` (`domain`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица alias_domain
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `alias_domain` (
  `alias_domain` varchar(255) NOT NULL,
  `target_domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`alias_domain`),
  KEY `active` (`active`),
  KEY `target_domain` (`target_domain`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица config:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `value` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица domain:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `domain` (
  `domain` varchar(255) NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 NOT NULL,
  `aliases` int(10) NOT NULL DEFAULT '0',
  `mailboxes` int(10) NOT NULL DEFAULT '0',
  `maxquota` bigint(20) NOT NULL DEFAULT '0',
  `quota` bigint(20) NOT NULL DEFAULT '0',
  `transport` varchar(255) NOT NULL,
  `backupmx` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`domain`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица domain_admins
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `domain_admins` (
  `username` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица fetchmail:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `fetchmail` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `mailbox` varchar(255) NOT NULL,
  `src_server` varchar(255) NOT NULL,
  `src_auth` enum('password','kerberos_v5','kerberos','kerberos_v4','gssapi','cram-md5','otp','ntlm','msn','ssh','any') DEFAULT NULL,
  `src_user` varchar(255) NOT NULL,
  `src_password` varchar(255) NOT NULL,
  `src_folder` varchar(255) NOT NULL,
  `poll_time` int(11) unsigned NOT NULL DEFAULT '10',
  `fetchall` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `keep` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `protocol` enum('POP3','IMAP','POP2','ETRN','AUTO') DEFAULT NULL,
  `usessl` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `extra_options` text,
  `returned_text` text,
  `mda` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица log:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `log` (
  `timestamp` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `username` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `data` text NOT NULL,
  KEY `timestamp` (`timestamp`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица mailbox:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `mailbox` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `maildir` varchar(255) NOT NULL,
  `quota` bigint(20) NOT NULL DEFAULT '0',
  `local_part` varchar(255) NOT NULL,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`username`),
  KEY `domain` (`domain`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица quota (не уверен, что она нужна):
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `quota` (
  `username` varchar(255) NOT NULL,
  `path` varchar(100) NOT NULL,
  `current` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`username`,`path`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица quota2 (не уверен, что она нужна):
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `quota2` (
  `username` varchar(100) NOT NULL,
  `bytes` bigint(20) NOT NULL DEFAULT '0',
  `messages` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица transport:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `transport` (
  `domain` varchar(128) NOT NULL DEFAULT '',
  `transport` varchar(128) NOT NULL DEFAULT '',
  UNIQUE KEY `domain` (`domain`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица vacation:
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `vacation` (
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8 NOT NULL,
  `body` text CHARACTER SET utf8 NOT NULL,
  `cache` text NOT NULL,
  `domain` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`email`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Virtual Vacation';</pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Таблица vacation_notification
  </div>

  <div class="spoiler-body">
    <pre>CREATE TABLE `vacation_notification` (
  `on_vacation` varchar(255) CHARACTER SET latin1 NOT NULL,
  `notified` varchar(255) CHARACTER SET latin1 NOT NULL,
  `notified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`on_vacation`,`notified`),
  CONSTRAINT `vacation_notification_pkey` FOREIGN KEY (`on_vacation`) REFERENCES `vacation` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Virtual Vacation Notifications';</pre>
  </div>
</div>

Создадим пользователя admin:

```bash
INSERT INTO `admin` VALUES ('admin@localhost','$1$9fef2610$C4gS50VrdIXb0D.JEAyCK/','0000-00-00 00:00:00','0000-00-00 00:00:00',1);
```

Вносим в информацию о пользователе admin в таблицу domain_admins:

```bash
INSERT INTO `domain_admins` VALUES ('admin@localhost','ALL','0000-00-00 00:00:00',1);
```

Не уверен, что этот шаг нужен:

```bash
INSERT INTO `domain` VALUES ('ALL',`,0,0,0,0,`,0,'0000-00-00 00:00:00','0000-00-00 00:00:00',1);
```

Пример вставки в таблицу transport: ``INSERT INTO `transport` VALUES ('server.com','smtp:[mx.mailserver2.com]');``

2. Создаем пользователя для работы с файлами почты:

```bash
useradd -r -u 1150 -g mail -d /var/vmail -s /sbin/nologin -c Virtual vmail
```

2.1. Делаем его владельцем папки /var/spool/mail:

```bash
chown -R vmail:mail /var/spool/mail/
```

3. Создаем папку /etc/postfix/sql и переходим в нее:

```bash
mkdir /etc/postfix/sql  
cd /etc/postfix/sql
```

3.1. Создаем файл `valias.cf` со следующим содержанием:  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    valias.cf
  </div>

  <div class="spoiler-body">
    <pre>user = postfix
password = password
hosts = 127.0.0.1
dbname = mail
table = alias
select_field = goto
where_field = address
#additional_conditions = active = 1
# query examples:
#query = SELECT goto FROM alias WHERE address='%s' AND active = '1'
#query = SELECT CONCAT(domain,'/',maildir) FROM mailbox WHERE username='%s'AND active = '1'</pre>
  </div>
</div>

3.2. Создаем файл vdomains.cf со следующим содержанием:  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    vdomains.cf
  </div>

  <div class="spoiler-body">
    <pre>user = postfix
password = password
hosts = 127.0.0.1
dbname = mail
table = domain
select_field = domain
where_field = domain
#additional_conditions = and backupmx = 0 and active = 1
# query example
#query = SELECT domain FROM domain WHERE domain='%s' AND backupmx='0' AND active='1'</pre>
  </div>
</div>

3.3. Создаем файл `vmailbox.cf` со следующим содержанием:  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    vmailbox.cf
  </div>

  <div class="spoiler-body">
    <pre>user = postfix
password = password
hosts = 127.0.0.1
dbname = mail
table = mailbox
select_field = CONCAT(domain,'/',maildir)
where_field = username
#additional_conditions = and active = 1
# query example
#query = SELECT CONCAT(domain,'/',maildir) FROM mailbox WHERE username='%s'AND active = '1'</pre>
  </div>
</div>

4. В любимом редакторе открываем файл `/etc/postfix/main.cf` и начинаем беспощадно редактировать:

4.1. Убедимся, что следующая строка не закомментирована::  
`mynetworks_style = subnet`

4.2. Убедимся, что внешний и внутренний ip адреса сервера присутствуют в mynetworks:

```bash
mynetworks = </strong>public_ip_address</strong>/32, 127.0.0.0/8, 192.168.0.0/16, 10.0.0.0/8
```


3.3. Объявляем конфигурационные файлы для виртуальных почтовых ящиков, доменов и групп:

```bash
virtual_mailbox_domains = mysql:$config_directory/sql/vdomains.cf
virtual_mailbox_maps = mysql:$config_directory/sql/vmailbox.cf
virtual_alias_maps = mysql:$config_directory/sql/valias.cf
virtual_mailbox_base = /var/spool/mail
home_mailbox = Maildir/
```


4.4. Настраиваем авторизацию smtp смежную с pop3 (dovecot):

```bash
smtpd_sasl_auth_enable = yes
smtpd_sasl_exceptions_networks = $mynetworks
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_security_options = noanonymous
broken_sasl_auth_clients = yes
smtpd_sasl_path = /var/spool/postfix/private/dovecot-auth
```


4.5. Обозначаем пользователя для работы с файлами почты (создали в п.2). Указываем транспорт почты:

```bash
virtual_minimum_uid = 1150
virtual_uid_maps = static:1150
virtual_gid_maps = static:12
virtual_transport = dovecot
```


4.6. Настраиваем ограничения для доступа к почтовой службе:

```bash
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, reject_non_fqdn_recipient, reject_unverified_recipient, permit
```


4.7 Включаем ssl/tls при необходимости:

```bash
smtpd_use_tls = yes
smtpd_tls_cert_file = /etc/ssl/certs/server.crt
smtpd_tls_key_file = /etc/ssl/certs/server.key
smtpd_sasl_auth_enable = yes
broken_sasl_auth_clients = yes
smtpd_tls_received_header = yes
smtpd_tls_ask_ccert = yes
smtpd_tls_loglevel = 1
tls_random_source = dev:/dev/urandom
```


4.7.1. Генерируем ssl сертификат:

```bash
mkdir /etc/ssl/certs/  
cd /etc/ssl/certs/  
openssl genrsa -out server.key 2048  
openssl req -new -key server.key -out server.csr -nodes  
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

4.7.2. В случае необходимости конвертируем их в pem:

```bash
openssl pkcs12 -export -out server.pfx -inkey server.key -in server.crt  
openssl pkcs12 -in server.pfx -out server.pem -nodes
```

Сохраняем. Закрываем.

5. В любимом редакторе открываем файл `/etc/postfix/master.cf` и начинаем беспощадно редактировать:  
5.1. Удостоверимся, что следующие строки присутствуют:

```bash
submission inet n       -       n       -       -       smtpd
		-o smtpd_tls_security_level=encrypt
		-o smtpd_sasl_auth_enable=yes
```


4.9. Разрешаем доставку в dovecot:

```bash
dovecot unix - n n - - pipe
		-o flags=DRhu user=vmail:mail argv=/usr/libexec/dovecot/deliver -f ${sender} -d ${recipient}
```


Сохраняем. Закрываем.

Перезапускаем postfix что бы изменения вступили в силу:

```bash
/etc/init.d/postfix restart
```

Читать дальше: [Установка и настройка службы imap/pop3 на базе Dovecot](http://www.tech-notes.net/install-dovecot-centos/ "Установка и настройка службы imap/pop3 на базе  Dovecot")
