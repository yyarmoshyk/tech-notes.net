---
id: 1068
title: How to restrict allowed http methods in Apache
date: 2014-06-25T19:54:29+00:00
author: admin

guid: http://www.tech-notes.net/?p=1068
permalink: /limit-http-methods-apache/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-design.jpg
categories:
   - Apache
   - Security
---
The following construction allows you to disable all http request methods in `Apache`, except for `GET`, `POST` and `HEAD`:

```bash
<Directory /var/www/html/>
	<LimitExcept POST GET HEAD>
		order allow,deny
		deny from all
	</LimitExcept>

	Options Indexes FollowSymLinks MultiViews
	AllowOverride All

	<Limit POST GET HEAD>
		order allow,deny
		allow from all
	</Limit>
</Directory>
```