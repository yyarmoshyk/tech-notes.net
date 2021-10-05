---
id: 904
title: Как настроить ClamAV на сканирование файлов загружаемых по FTP (PureFTPd)
date: 2014-05-01T17:32:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=904
permalink: /pureftpd-check-file-uploads-with-clamav/
image: /wp-content/uploads/2014/05/ftp_logo.jpg
categories:
  - FTP
tags:
  - Безопасность
  - clamav
  - PureFTPd
---
В этой заметке хочу рассказать, как настроить антивирус `ClamAV` сканировать файлы, которые заливаются на сервер через `PureFTPD`.

Пример приводится для `Linux Ubuntu`. Для `CentOS` особых различий не будет.  

Для начала ставим `clam`, обновляем и запускаем:

```bash
apt-get install clamav clamav-daemon clamav-data  
freshclam  
service clamav-daemon start
```

Дальше нужно разрешить выполнение скриптов при загрузке файлов в настройках PureFTPd:

```bash
echo yes > /etc/pure-ftpd/conf/CallUploadScript
```

Теперь создаем сам скрипт:

```bash
/etc/pure-ftpd/clam-checker
```

Вот такое содержание:

```bash
#!/bin/sh
/usr/bin/clamdscan --remove --quiet --no-summary "$1"
```

Делаем его исполняемым:

```bash
chmod +x /etc/pure-ftpd/clam-checker
```

Теперь открываем в любимом редакторе файл `/etc/default/pure-ftpd-common`.  
Находим в нем секцию `UPLOADSCRIPT` и вносим в нее следующую строку:

```bash
UPLOADSCRIPT=/etc/pure-ftpd/clam-checker
```

Перезапускаем PureFTPD и радуемся жизни:

```bash
/etc/init.d/pure-ftpd restart
```

По мотивам одноименной повести на [howtoforge.com](http://www.howtoforge.com/clamav-pureftpd-virus-scanning-ubuntu-14.04-lts)
