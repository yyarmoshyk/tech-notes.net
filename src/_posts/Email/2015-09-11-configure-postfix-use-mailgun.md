---
id: 2880
title: Настраиваем Postfix на отправку писем через MailGun
date: 2015-09-11T17:16:54+00:00
author: admin

guid: http://www.tech-notes.net/?p=2880
permalink: /configure-postfix-use-mailgun/
image: /wp-content/uploads/2015/09/mailgun_logo.jpg
categories:
  - Почта
tags:
  - MailGun
  - postfix
---
В этой статье пойдет речь о том, как настроить ваш Linux сервер отправлять почту через сервис MailGun.

Для начала нужно удостовериться что с Вашей учетной записью все в порядке. Для этого можно воспользоваться утилитой curl и отправить письмо через API:

```bash
curl -s -user 'api:ВАШ_API_КЛЮЧЬ' \  
https://api.mailgun.net/v3/домен/messages \  
-F from='Excited User <mailgun@домен>' \  
-F to=ВЫ@домен> \  
-F subject='Тест' \  
-F text='Проверка Mailgun!'
```

Убедимся, что в системе присутствуют необходимые пакеты:

### CentOS/RedHat:

```bash
yum install postfix cyrus-sasl-plain cyrus-sasl-md5
```

### Ubuntu/Debian:

```bash
apt-get update apt-get install postfix libsasl2-modules
```

Дальше нужно отредактировать файл с настройками postfix:

```bash
vim /etc/postfix/main.cf
```

В конец добавляем следующие строки:

```bash
smtp_sasl_auth_enable = yes
relayhost = smtp.mailgun.org            
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps=hash:/etc/postfix/sasl_passwd
```


Создаем файл с логином:

```bash
vim /etc/postfix/sasl_passwd
```

Вносим в него следующую информацию:

```bash
smtp.mailgun.org пользователь@домен.com:пароль
```


Создаем hash:

```bash
chmod 600 /etc/postfix/sasl_passwd  
postmap /etc/postfix/sasl_passwd
```

Перезапускаем postfix для применения изменений:

```bash
service postfix restart
```
