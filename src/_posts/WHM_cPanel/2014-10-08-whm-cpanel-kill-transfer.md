---
id: 1875
title: 'WHM (cPanel): Как убить зависший transfer'
date: 2014-10-08T19:49:47+00:00
author: admin

guid: http://www.tech-notes.net/?p=1875
permalink: /whm-cpanel-kill-transfer/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM/cPanel
tags:
  - cpanel
  - transfer tool
  - WHM
---
Пришло мне сегодня переносить учетные записи между серверами. Естественно использовал WHM `Transfer tool`. Один из батчей `залип` в процесе работы. К сожалению кнопки terminate не предусмотрено разработчиками.  

Итак, что же делать в таком случае? В окне активного трансфера есть запись:

```bash
You may close this window and view the transfer on the command line: **/usr/local/cpanel/bin/view_  
srccopya201410081920225pq211Nuc1jZ6z**
```

Если выполнить ее из командной строки - получите что-то вроде следующего:

```bash
Transfer running with pid: 795  
[795][MASTER]: Start Session  
[795][MASTER]: Version: 1.9  
[795][MASTER]: Queue “TRANSFER” items: 1
```

Имея pid можно убить процесс используя [kill -9](/manage-bash-processes-linux/)

  Мне повезло меньше и `pidа` в выводе не было. Нашел я этот плохой процесс с помощью ps:

```bash
ps aux |grep transfer
```

В результате получаем:

```bash
root 13296 0.0 1.2 163572 51608 ? Ss 19:20 0:00 transfer_session - srccopya201410081920225pq211Nuc1jZ6z - MASTER  
root 13298 0.0 1.4 171224 59592 ? S 19:20 0:00 transfer_session - srccopya201410081920225pq211Nuc1jZ6z - RESTORE:1
```

Опять же можно убить эти процесы, используя [kill -9](/manage-bash-processes-linux/)

Остается дело за малым - сказать WHM, что трансфер закончен, иначе он будет болтаться в истории, как незавершенный.

Для этого запускаем консоль mysql и выполняем следующие команды:

```bash
select * from whmxfer.sessions where sessionid='srccopya201410081920225pq211Nuc1jZ6z';
```

Убеждаемся еще раз в том, что процент выполнения (state) не равен сотне и запись о времени завершения трансфера (endtime) отсутствует (NULL)

Так сжем же ж ему, что эта задача закончена:

```bash
update whmxfer.sessions set state='100&#8242;, endtime='now()' where sessionid='srccopya201410081920225pq211Nuc1jZ6z';
```
