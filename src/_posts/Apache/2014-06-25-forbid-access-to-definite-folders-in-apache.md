---
id: 1066
title: Как запретить доступ к конкретных папками на сервере в Apache
date: 2014-06-25T19:49:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=1066
permalink: /forbid-access-to-definite-folders-in-apache/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
  - Безопасность
---
Запретить доступ к определенным папкам можно с помощью следующей конструкции. Закидывать ее можно в настройки виртуального хоста Apache, `httpd.conf` или создать отдельный файл с настройками:  

```bash
<DirectoryMatch "\.(git|svn|hg)">
  Order allow,deny
  deny from all
</DirectoryMatch>
```


В этом примере я запрещаю доступ к папкам `.git`, `.svn` и `.hg`. Вместо них можно использовать другие значения.

То же самое можно проделать с помощью mod_rewrite:

```bash
RewriteEngine on
RewriteCond %{REQUEST_URI} ^\.(git|svn|hg) -d
RewriteRule .* - [F]
```


Эту конструкцию можно закидывать в настройки хоста `Apache` и `.htaccess` файл
