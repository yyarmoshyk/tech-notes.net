---
id: 2037
title: Как настроить лог для HaProxy
date: 2014-10-31T12:26:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=2037
permalink: /haproxy-configure-logs/
image: /wp-content/uploads/2014/10/160x160-haproxy_logo.png
categories:
  - HaProxy
tags:
  - логирование HaProxy
---
Для того, что бы включить логирование HaProxy отредактируйте /etc/sysconfig/rsyslog - приведите едиственную строку к следующему виду:

```bash
SYSLOGD_OPTIONS="-c 2 -r"
```


По факту, нужно добавить ключ `-r` в опции демона rsyslog что бы разрешить ему принимать события на ip сокете.

Дальше редактируем файл `/etc/rsyslog.conf`:  
1. Сначала нраскоментируем следующие строки:

```bash
# Provides UDP syslog reception
$ModLoad imudp
$UDPServerRun 514
```


и

```bash
# Provides TCP syslog reception
$ModLoad imtcp
$InputTCPServerRun 514
```


2. Теперь осталось создать соответсвующую logfacility. Если в секции global конфигурационного файла haproxy у Вас написано следующее:

```bash
log         127.0.0.1 local2
```


тогда вкидываем в rsyslog.conf вот такую строку:

```bash
local2.*                                                /var/log/haproxy.log
```


Для того что бы изменения вступили в силу, нужно перезапустить демон rsyslog:

> /etc/init.d/rsyslog restart

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>