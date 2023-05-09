---
id: 951
title: Перенос почты с одного сервера на другой с помощью Larch
date: 2014-05-14T14:19:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=951
permalink: /transfer-mail-with-larch/
image: /wp-content/uploads/2014/05/MailRelay_Icon.jpg
categories:
  - Почта
tags:
  - Larch
---
Larch - утилита, написана на ruby, которая может очень сильно пригодиться при переносе почты с одного почтового сервиса на другой.

То есть если Вы меняете почтового провайдера, но сохраняете полное имя почтового ящика, тогда невозможно настроить пересылку со старого на новый адрес. Для того что бы перенести почту читайте дальше.

Для начала нужно установить нужные пакеты.

### Ubuntu:

```bash
apt-get install ruby ruby-dev rubygems irb ri libopenssl-ruby libssl-dev gcc sqlite-dev
```
### CentOS

Для начала [установите Ruby 1.9.3](/install-ruby-1-9-red-hat6/)

Потом:

```bash
yum install openssl-devel openssl sqlite-devel gcc
```
Устанавливаем сам larch

```bash
gem install larch
```

Из консоли трансфер запускается вот такой командой:

```bash
larch -from imaps://imap.googlemail.com -from-user **user@mydomain.com** -from-pass **mysuperpass** -to imaps://imap.newemailsrv.com -to-user **user@mydomain.com** -to-pass **mysuperpass** -all
```
[larch на github](https://github.com/rgrove/larch)
