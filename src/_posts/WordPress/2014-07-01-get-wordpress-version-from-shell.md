---
id: 1129
title: Как узнать версию WordPress из командной строки
date: 2014-07-01T17:52:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=1129
permalink: /get-wordpress-version-from-shell/
image: /wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2.jpg
categories:
  - WordPress
---
Узнать версию установленного `WordPress` можно на главной странице админки, но в админку можно не иметь доступа. В этом случае выполните вот такую команду:  
```bash
grep wp_version /var/www/html/wp-includes/version.php |grep -v "*"
```

* Предполагаю, что WordPress находится в папке /var/www/html
