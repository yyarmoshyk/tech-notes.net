---
id: 982
title: 'Установка и настройка службы imap/pop3 на базе  Dovecot'
date: 2014-05-29T14:23:42+00:00
author: admin

guid: http://www.tech-notes.net/?p=982
permalink: /install-dovecot-centos/
image: /wp-content/uploads/2014/05/dovecot.jpg
categories:
  - Почта
tags:
  - Dovecot
  - mysql
---
Это вторая статья цикла посвященного почтовому серверу на базе ОС CentOS Linux. В ней речь пойдет о том, как же дать людям доступ ко входящим письмам по средствам imap/pop3 c помощью Dovecot.

Первая статья: [Установка и Настройка Postfix](http://www.tech-notes.net/install-configure-postfix/ "Установка и Настройка Postfix")

Настоятельно рекомендую начинать настройку сервера с нее.

Для начала установи нужные части Dovecot:

```bash
yum install dovecot dovecot-mysql
```

1. В любимом редакторе открываем файл `/etc/dovecot/dovecot.conf` и начинаем его беспощадно редактировать.

1.1. Для начала укажем механизм авторизации (доступные: login, cram-md5, DIGEST-MD5):

```bash
auth_mechanisms = plain
```


1.2. Укажем рабочий каталог dovecot:

```bash
base_dir = /var/run/dovecot/
```


1.3. Включаем поддержку ssl (если Ваш dovecot упадет на страте - попробуйте использовать pem сертификаты п.1.3.2.):

```bash
ssl = yes
ssl_cipher_list = ALL:!LOW:!SSLv2
ssl_cert=&lt;/etc/ssl/certs/server.crt
ssl_key=&lt;/etc/ssl/certs/server.key
```


1.3.1. Если сертификатов безопасности у Вас нету - сгенерируйте их самостоятельно:

```bash
mkdir /etc/ssl/certs/  
cd /etc/ssl/certs/  
openssl genrsa -out server.key 2048  
openssl req -new -key server.key -out server.csr -nodes  
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

```bash
openssl pkcs12 -export -out server.pfx -inkey server.key -in server.crt  
openssl pkcs12 -in server.pfx -out server.pem -nodes
```

1.4. Указываем id пользователей под которым Dovecot будет стучаться к файлам:

```bash
first_valid_uid = 1150
last_valid_uid = 1150
```


* полагаю что пользователь уже был создан.

1.5. Указываем где искать файлы почты:

```bash
mail_location = maildir:/var/spool/mail/%d/%u
```


%d - домен  
%u - имя пользователя

1.6. База паролей:

```bash
passdb {
	args = /etc/dovecot/dovecot-sql.conf
	driver = sql
}
```


1.7. База пользователей:

```bash
userdb {
	args = /etc/dovecot/dovecot-sql.conf
	driver = sql
}
```


1.8. Сокеты авторизации:

```bash
service auth {
	unix_listener /var/spool/postfix/private/dovecot-auth {
		user = postfix
		group = postfix
		mode = 0660
	}
	unix_listener auth-master {
		user = vmail
		group = mail
		mode = 0660
	}
	unix_listener auth-userdb {
		user = vmail
		group = mail
		mode = 0660
	}
}
```


1.9. Сокет для imap логина:

```bash
service imap-login {
	executable = /usr/libexec/dovecot/imap-login
	inet_listener imap {
		address = *
		port = 143
	}
}
```


1.10. Расположение сервиса imap:

```bash
service imap {
	executable = /usr/libexec/dovecot/imap
}
```


1.11. Сокет для pop3 логина:

```bash
service pop3-login {
	executable = /usr/libexec/dovecot/pop3-login
	inet_listener pop3 {
		address = *
		port = 110
	}
}
```


1.12. Расположение сервиса pop3:

```bash
service pop3 {
	executable = /usr/libexec/dovecot/pop3
}
```


1.13. Включаем логирование:

```bash
log_path = /var/log/dovecot.log
info_log_path = /var/log/dovecot-info.log
```


1.14. Настраиваем сжатие логов с использованием logrotate. Создаем файл `/etc/logrotate.d/dovecot` и вставляем следующие строки в него:

```bash
/var/log/dovecot*.log {
	missingok
	notifempty
	delaycompress
	create 666 root mail
	sharedscripts
	postrotate
		/bin/kill -USR1 `cat /var/run/dovecot/master.pid 2>/dev/null` 2> /dev/null || true
	endscript
}
```

2. Создаем файл `/etc/dovecot/dovecot-sql.conf`. Вставляем в него следующие строки:

```bash
driver = mysql
connect = host=localhost dbname=mail user=postfix password=password
default_pass_scheme = MD5
user_query = SELECT '/var/spool/mail/%d/%n' as home, 'maildir:/var/spool/mail/%d/%n'as mail, 1150 AS uid, 12 AS gid, concat('dirsize:storage=', quota) AS quota FROM mailbox WHERE username = '%u' AND active = '1'
password_query = SELECT username as user, password, '/var/spool/mail/%d/%n' as userdb_home, 'maildir:/var/spool/mail/%d/%n' as userdb_mail, 1150 as userdb_uid, 12 asuserdb_gid FROM mailbox WHERE username = '%u' AND active = '1'
```

Учтите что **postfix и dovecot должны работать с одной базой данных**.

Если базы не существует - зачем Вам Dovecot?

Перезапустите Dovecot чтобы изменения вступили в силу

```bash
service dovecot restart
```

Читайте дальше: [Установка PostfixAdmin and RoundCube](http://www.tech-notes.net/install-postfixadmin-and-roundcube/ "Установка PostfixAdmin and RoundCube")
