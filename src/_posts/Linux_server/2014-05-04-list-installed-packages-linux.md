---
id: 909
title: Получение списка установленных пакетов программ в Linux
date: 2014-05-04T19:33:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=909
permalink: /list-installed-packages-linux/
image: /wp-content/uploads/2014/02/nfs_mount.png
categories:
  - Linux server
tags:
  - bash
  - dpkg
  - yum
---
Получить список установленных пакетов в Linux Ubuntu можно вот такой командой:

```bash
dpkg -get-selections | grep -v deinstall
```

Получить список установленных пакетов в CentOS Linux можно вот такой командой:

```bash
rpm -qa
```

Если нужно получить список модулей php, можно воспользоваться одной из следующих команд:

```bash
dpkg -get-selections | grep -v deinstall |grep **php**
```

```bash
rpm -qa |grep **php**
```

`php` можно заменить другим именем пакета
