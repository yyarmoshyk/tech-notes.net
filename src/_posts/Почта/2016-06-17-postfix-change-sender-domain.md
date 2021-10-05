---
id: 3337
title: Postfix меняем домен отправителя
date: 2016-06-17T08:10:03+00:00
author: admin

guid: http://www.tech-notes.net/?p=3337
permalink: /postfix-change-sender-domain/
image: /wp-content/uploads/2014/05/managing-postfix.jpg
categories:
  - Почта
tags:
  - postfix
---
Как правило сразу после установки `postfix` отправляет письма используя домен, который возвращает команда

```bash
uname -n
```
При этом отправителем является системный пользователь от которого выполняется скрипт или идет отправка.

Пример может быть `www-data@localhost.localdomain`.

Для того что бы изменить домен, который будет значиться в отправленных письмах, и имя пользователя, от которого осуществляется отправка, нужно подредактировать файл `/etc/postfix/main.cf` следующей строкой:

```bash
smtp_generic_maps = hash:/etc/postfix/generic
```

После этого редактируем файл `/etc/postfix/generic`

```bash
www-data@localhost.localdomain info@domain.com
```

Дальше в консоли выполняем:

```bash
postmap /etc/postfix/generic
```

И перезапускаем postfix, чтобы измменения вступили в силу:

```bash
service postfix restart
```
