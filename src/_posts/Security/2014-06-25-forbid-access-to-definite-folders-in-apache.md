---
id: 1066
title: How to deny access to specific folders on a server in Apache
date: 2014-06-25T19:49:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=1066
permalink: /forbid-access-to-definite-folders-in-apache/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
  - Security
---
You can deny access to certain folders using the following construction. You can add it in the Apache virtual host settings, `httpd.conf` or create a separate file with settings:

```bash
<DirectoryMatch "\.(git|svn|hg)">
  order allow,deny
  deny from all
</DirectoryMatch>
```


In this example, I am denying access to the `.git`, `.svn` and `.hg` folders. You can use other values ​​instead.

The same can be done with `mod_rewrite`:

```bash
Rewrite Engine on
RewriteCond %{REQUEST_URI} ^\.(git|svn|hg) -d
RewriteRule .* - [F]
```

This construction can be thrown into the `Apache` host settings and `.htaccess` file