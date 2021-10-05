---
id: 2330
title: Ошибка верификации сертификата в Lftp
date: 2015-01-28T14:29:39+00:00
author: admin

guid: http://www.tech-notes.net/?p=2330
permalink: /lftp-certificate-verification-error/
image: /wp-content/uploads/2014/09/thinknook-new-logo3.png
categories:
  - FTP
---
Сегодня столкнулся с таким сообщением при обычной работе с lftp:
```bash
ls: Fatal error: Certificate verification: Not trusted
```

Устраняется она на скорую руку так:  
1. запускаем консоль lftp:
```bash
lftp
```
1. Отключаем верификацию сертификатов:
```bash
set ssl:verify-certificate no
```
1. Подключаемся к серверу:
```bash
open user@ip_address
```

Для того, что бы закрепить пройденый материал и больше к нему не возвращаться - создайте папку `~/.lftp/`
```bash
mkdir ~/.lftp/
```

В папке создайте файл:
```bash
nano ~/.lftp/rc
```

Содержимое файла:
```bash
set ssl:verify-certificate no
```
