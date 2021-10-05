---
id: 3230
title: Как настроить Exim использовать SendGrid для отправки почты
date: 2016-03-01T13:26:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=3230
permalink: /configure-exim-to-use-sendgrid/
image: /wp-content/uploads/2016/03/exim-logo.png
categories:
  - Почта
tags:
  - Exim
  - Sendgrid
  - WHM
---
Продолжаю линейку статей о почтовых сервисах пока не улетучилось вдохновление от недавно решенных проблем.

Я уже описывал как [настроить PostFix отправлять почту через MailGun](http://www.tech-notes.net/configure-postfix-use-mailgun/).

В этой статье речь пойдет о настройке `Exim` для ипользования сервиса доставки почты [SendGrid](https://sendgrid.com/).

Очень удачно совпадает описание настройки разных почтовых сервисов на разных почтовых демонах.

У меня есть сервер с панелью WHM + Exim. Я зарегистрировал бесплатную учетную запись в SendGrid.

Приступаем к настройке. Для начала в панель WHM найдите `Exim Configuration Manager`  
<img src="/wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938.png" alt="Screenshot from 2016-03-01 13:59:38" width="412" height="301" class="aligncenter size-full wp-image-3232" srcset="/wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938.png 412w, /wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938-170x124.png 170w, /wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938-300x219.png 300w" sizes="(max-width: 412px) 100vw, 412px" />

Переходим на вкладку ``Advanced Editor`` и ищем секцию ``Section: AUTH``. В текстовое поле нужно вставить информацию для авторизацци в sendgrid:

```bash
sendgrid_login:
  driver = plaintext
  public_name = LOGIN
  client_send = : <strong>login@email.com</strong> : %password%
```


Дальше ищем секцию ``Section: ROUTERSTART``. Вставляем в нее слудующее:

```bash
send_via_sendgrid:
  driver = manualroute
  domains = ! +local_domains
  transport = sendgrid_smtp
  route_list = "* smtp.sendgrid.net::587 byname"
  host_find_failed = defer
  no_more
```


Осталось указать транспорт. Для этого находим ``Section: TRANSPORTSTART`` и прописываем в текстовом поле следующее:

```bash
sendgrid_smtp:
  driver = smtp
  hosts = smtp.sendgrid.net
  hosts_require_auth = smtp.sendgrid.net
  hosts_require_tls = smtp.sendgrid.net

```


Если вы хотите [использовать DKIM](http://www.tech-notes.net/use-dkim-to-sign-outgoing-mail/) тогда `TRANSPORTSTART` - именно то место, в которое нужно добавить конфигурацию:

```bash
DKIM_CANON = relaxed
DKIM_SELECTOR = key1
DKIM_DOMAIN = example.com
DKIM_FILE = /etc/ssl/private/example.com-private.pem
```
