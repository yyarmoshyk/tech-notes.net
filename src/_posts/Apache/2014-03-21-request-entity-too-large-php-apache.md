---
id: 726
title: Проблема загрузки файлов через формы php в Apache
date: 2014-03-21T17:59:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=726
permalink: /request-entity-too-large-php-apache/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - Apache
tags:
  - Request Entity Too Large
---
Сегодня столкнулся с проблемой загрузки файлов, которые явно не превышают лимит post_max_size и upload_max_filesize.  
На выходе вот такая ошибка:

```bash
Request Entity Too Large  
The requested resource media-new.php does not allow request data with POST requests ...
```

Вот картинка:  
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png" alt="Screenshot from 2014-03-21 13:21:16" width="738" height="101" class="aligncenter size-full wp-image-727" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png 738w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116-300x41.png 300w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116-660x90.png 660w" sizes="(max-width: 738px) 100vw, 738px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png)

Это сообщение о ошибке не относится к настройкам php. Это - ограничение со стороны сервера Apache, а именно mod-security.

<center>
  <div id="gads">
  </div>
</center>

Для того что бы починить, нужно добавить вот такие строки в .htaccess:

```bash
<IfModule mod_security.c>
	<Files media-new.php>
		#4Mb
		LimitRequestBody 4096000
	</Files>
</IfModule>
```


Таким образом для файла `media-new.php` выставляется ограничение в `4Mb` на размер тела запроса.
