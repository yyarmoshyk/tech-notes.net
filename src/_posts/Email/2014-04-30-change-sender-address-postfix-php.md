---
id: 887
title: 'Postfix: Изменить адрес отправителя'
date: 2014-04-30T17:26:53+00:00
author: admin

guid: http://www.tech-notes.net/?p=887
permalink: /change-sender-address-postfix-php/
categories:
  - Почта
tags:
  - PHP
  - postfix
  - изменить адрес отправителя
---
Если у Вас на сервере выполняется рассылка писем, и Вы не хотите чтобы письма доставлялись не от `root@srv01.some-bla-bla-bla.net`, тогда можно изменить адрес отправителя.

В `php.ini` приводим `значение sendmail_path` к вот такому виду:

```bash
sendmail_path = /usr/sbin/sendmail.postfix -t -i -F "no-reply"
```


Перезапускаем apache:

```bash
/etc/init.d/httpd restart
```
или

```bash
/etc/init.d/apache2 restart
```

### Альтернативой может быть изменение настроек postfix.

Для этого в файл `/etc/postfix/main.cf` дописываем такую строку:

```bash
smtp_generic_maps = hash:/etc/postfix/generic
```

В файл `/etc/postfix/generic` добавляем вот такое:

```bash
root@server01.hosting.com no-reply@domain.com
```


Создаем хеш-файл:

```bash
postmap /etc/postfix/generic
```
Перезапускаем postfix:

```bash
/etc/init.d/postfix restart
```
