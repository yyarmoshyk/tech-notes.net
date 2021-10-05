---
id: 1137
title: Установка php-mcrypt на CentOS 6
date: 2014-07-03T19:50:39+00:00
author: admin

guid: http://www.tech-notes.net/?p=1137
permalink: /install-php-mcrypt-centos/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - Linux server
tags:
  - PHP
---
Для того, что бы установить `php-mcrypt` на `CentOS` Linux нужно включить дополнительные репозитарии:

```bash
wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm  
wget http://rpms.famillecollet.com/enterprise/remi-release-6.rpm  
rpm -Uhv epel-release-6-8.noarch.rpm remi-release-6.rpm
```

Дальше установить сам php-mcrypt:

```bash
yum -y install php-mcrypt
```
