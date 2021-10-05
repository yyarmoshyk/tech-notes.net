---
id: 1068
title: Как ограничить разрешенные http методы в Apache
date: 2014-06-25T19:54:29+00:00
author: admin

guid: http://www.tech-notes.net/?p=1068
permalink: /limit-http-methods-apache/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - Apache
  - Безопасность
---
Приведенная ниже конструкция позволяет запретить в `Apache` все методы http запросов, кроме `GET`, `POST` и `HEAD`:  
<!--more-->

```bash
<Directory /var/www/html/>
	<LimitExcept POST GET HEAD>
		Order allow,deny
		deny from all
	</LimitExcept>

	Options Indexes FollowSymLinks MultiViews
	AllowOverride All

	<Limit POST GET HEAD>
		Order allow,deny
		allow from all
	</Limit>
</Directory>
```
