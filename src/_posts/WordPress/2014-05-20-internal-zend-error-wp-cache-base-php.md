---
id: 958
title: Internal Zend error wp-cache-base.php
date: 2014-05-20T17:07:28+00:00
author: admin

guid: http://www.tech-notes.net/?p=958
permalink: /internal-zend-error-wp-cache-base-php/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - Internal Zend error
  - wp-cache-base.php
---
Если Вы наблюдаете вот такую ошибку при работе Вашего WordPress блога:

```bash
Fatal error: Internal Zend error - Missing class information for in /var/www/html/wp-content/plugins/wp-super-cache/wp-cache-base.php on line 5
```

Самое время подредактировать файлик `/etc/php.d/apc.ini` вот такими строчками:  
```bash
apc.filters = wp-cache-config
apc.include_once_override = 0
```
