---
id: 2920
title: 'Error: xz compression not available'
date: 2015-10-09T16:11:18+00:00
author: admin

guid: http://www.tech-notes.net/?p=2920
permalink: /error-xz-compression-not-available/
image: /wp-content/uploads/2014/09/yum_logo.jpg
categories:
  - Linux server
tags:
  - CentOS
  - Red Hat
---
Если при попытке установить любой пакет с помощью yum вы получете следующее сообщение, значит Вы ошиблись в выборе пакета репозитория при установке:

```bash
Error: xz compression not available
```

С большой вероятностью Вы установили `Epel` 7-й версии на CentOS 6.5

Чтобы устранить проблему нужно:  
Удалить кэш репозитория:

```bash
rm -rf /var/cache/yum/x86_64/6/epel
```

Удалить сам rpm пакет:

```bash
rpm -e epel-release-7-5.noarch
```

Удалить конфигурациооные файлы:

```bash
rm -rf /etc/yum.repos.d/epel*
```

[Включить правильный репозитарий.](http://www.tech-notes.net/epel-remi-atrpms-rhel-centos/)
