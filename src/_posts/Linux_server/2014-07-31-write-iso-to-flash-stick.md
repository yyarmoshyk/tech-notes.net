---
id: 1337
title: Как записать образ на флэшку из командной стороки
date: 2014-07-31T19:48:50+00:00
author: admin

guid: http://www.tech-notes.net/?p=1337
permalink: /write-iso-to-flash-stick/
categories:
  - Linux server
---
Бывает нужно создать загрузочную флэшку с образом дистрибутива операционной системы или чего-нибудь другого.

Поможет в этом утилита командной строки linux под названием dd

Пример создания загрузочной флэкши из образа диска CentOS:

```bash
sudo dd if=CentOS-6.2-i386-bin-DVD1.iso of=/dev/sdb
```

/dev/sdb - идентификатор вашей флэхи.

Перед началом манипуляций ее нужно отмонтировать:

```bash
sudo umount /dev/sdb
```
