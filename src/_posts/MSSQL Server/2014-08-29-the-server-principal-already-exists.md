---
id: 1609
title: 'Обходим сообщение `The server principal already exists`'
date: 2014-08-29T13:48:03+00:00
author: admin

guid: http://www.tech-notes.net/?p=1609
permalink: /the-server-principal-already-exists/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - MSSQL Server
---
В ходе переноса пользователей MSSQL получил вот такое сообщение:

```sql
Server principal 'username' already exists.
```

[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-093720.png" alt="Screenshot from 2014-08-29 09:37:20" width="530" height="193" class="aligncenter size-full wp-image-1610" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-093720.png 530w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-29-093720-170x61.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-29-093720-300x109.png 300w" sizes="(max-width: 530px) 100vw, 530px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-093720.png)

Засада была в том, что такого пользователя не было в списке пользователей базы.

Для того, что бы обойти ее открываем новое окно запроса и выполняем:

```sql
USE master  
GO  
DROP login **username**
```

<center>
  <div id="gads">
  </div>
</center>

Возвращаемся во вкладку с запросом, который отпал с ошибкой и выполняем его:

```sql
GO  
CREATE LOGIN [username] WITH PASSWORD=N'**абракадабра_с_крякозябрами**', DEFAULT_DATABASE=[master], DEFAULT_LANGUAGE=[us_english], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF  
GO
```

[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-094537.png" alt="Screenshot from 2014-08-29 09:45:37" width="504" height="146" class="aligncenter size-full wp-image-1611" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-094537.png 504w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-29-094537-170x49.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-29-094537-300x86.png 300w" sizes="(max-width: 504px) 100vw, 504px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-29-094537.png)
