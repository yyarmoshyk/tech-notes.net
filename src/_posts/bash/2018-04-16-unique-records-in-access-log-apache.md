---
id: 3674
title: Get Inique IP addresses from Apache access.log 
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

The following can be used to fetch the unique records from apache access.log. This example covers IP addresses of the clients but this example can be used to extract other data as well:
```bash
cat access.log | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20
```
It also will work for `nginx` access logs because visitor's IP address is also a first field for every row.
