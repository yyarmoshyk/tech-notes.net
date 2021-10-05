---
id: 611
title: Использование кастомного порта ssh для rsync
date: 2014-02-27T18:23:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=611
permalink: /use-rsync-custom-ssh-port/
categories:
  - Linux server
tags:
  - rsync
  - порт ssh
---
Rsync - удобная утилита для синхронизации данных между серверами.

По умолчанию использует 22-й порт для подключения. Но бывает так, что ssh сервер настроен принимать соединения на другом порту. При этом rsync можно использовать вот так:

```bash
rsync -Hav -e "ssh -p 2222" someserver.com:/remote/server/path /local/server/path
```
