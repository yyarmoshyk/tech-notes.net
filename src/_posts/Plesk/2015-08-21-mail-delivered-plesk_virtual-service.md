---
id: 2826
title: 'Почта доставляется через plesk_virtual service'
date: 2015-08-21T20:11:02+00:00
author: admin

guid: http://www.tech-notes.net/?p=2826
permalink: /mail-delivered-plesk_virtual-service/
image: /wp-content/uploads/2014/02/sp-logo-plesk.png
categories:
  - Plesk
tags:
  - plesk_virtual
---
По умолчанию при создании учетной записи в Plesk для этой записи включается локальная доставка почты. Сколько бы вы не указывали ему, чтобы почта ходила согласно <a href="http://www.tech-notes.net/dns-mx-record/" target="_blank">DNS MX записи</a>, он все равно упорно будет доставлять почту для домена локально.

В результате в лог файле postfix (/usr/local/psa/var/log/maillog) появляются следующие записи:

```bash
postfix/pipe[19101]: 4986B18E20FE: to=<user@domain.com>, relay=plesk_virtual, delay=0.02, delays=0.01/0/0/0, dsn=2.0.0, status=sent (delivered via plesk_virtual service)
```

Устранить сие безобразие через web-морду нельзя.

В консоли сервера выполните следующее:

```bash
/usr/local/psa/bin/mail -off domain.com
```

Ничего перезапускать не нужно. Все само заработает.

Если Вам нужно отключить локальную доставку для всех доменов выполните следующий цикл:

```bash
for domain in $(echo "select name from domains;" |mysql -uadmin -p`cat /etc/psa/.psa.shadow ` psa);
do
   /usr/local/psa/bin/mail --off $domain;
done
```
