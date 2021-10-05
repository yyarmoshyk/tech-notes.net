---
id: 2730
title: Netstat не найден Fedora
date: 2015-07-23T17:46:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=2730
permalink: /netstat-not-found-fedora/
image: /wp-content/uploads/2015/07/netstat.jpg
categories:
  - Linux server
tags:
  - Fedora
  - Netstat
---
Сегодня при первичной настройке сервера с Fedora 20 получил вот такую ошибку:

```bash
bash: netstat: command not found
```

Во время кризиса статей любая заметка сгодится, лишь бы поисковики не считали, что блог заброшен.

В общем найти нужный пакет можно с помощью yum:

```bash
yum provides netstat
```

В ответ получаем следующее:

```bash
net-tools-2.0-0.15.20131119git.fc20.x86_64 : Basic networking tools
Repo        : fedora
Matched from:
Filename    : /bin/netstat
```


Устанавливаем нужное:

```bash
yum install net-tools -y
```

Пользуемся.
