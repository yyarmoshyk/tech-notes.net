---
id: 1655
title: Как удалить приложение и его зависимости из CentOS/RHEL
date: 2014-09-05T17:12:06+00:00
author: admin

guid: http://www.tech-notes.net/?p=1655
permalink: /yum-remove-dependencies/
image: /wp-content/uploads/2014/09/yum_logo.jpg
categories:
  - Linux server
tags:
  - yum
---
Как правило комнда yum remove удаляет только выбраный пакет. Для того что бы удалить всю бяку, которая была установлена с ним вмете нужно воспользоваться функционалом пакета yum-plugin-remove-with-leaves  

Устанавливаем его:

```bash
yum install yum-plugin-remove-with-leaves
```

Теперь можно грохнуть ненужное апликуху используя ключь -remove-leaves

```bash
yum remove package_name -remove-leaves
```

Для того что бы yum уносил все зависимости пакетов при удалении, нужно подредактировать файл `/etc/yum/pluginconf.d/remove-with-leaves.conf` следующей строкой:  
```bash
remove_always = 1
```
