---
id: 3674
title: Уникальные IP адреса в access.log Apache
date: 2018-04-16T06:33:14+00:00
author: admin
guid: http://www.tech-notes.net/?p=3674
permalink: '/unique-records-in-access-log-apache/'
image: /wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2.jpg
redirect_from:
  - /уникальные-ip-адреса-в-access-log-apache/
categories:
  - bash
tags:
  - Apache
  - Nginx
  - logfile
---
Получить список уникальных IP адресов в лог файле вэбсервера `Apache` можно с помощью:  

```bash
cat access.log | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20
```


Она же сработает и для логов вэбсервера `Nginx`, носколько в обоих фарматах IP адрес посетителя является первым полем каждой записи.
