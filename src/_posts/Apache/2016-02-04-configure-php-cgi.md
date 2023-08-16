---
id: 3118
title: Switching PHP to CGI mode for a specific folder.
date: 2016-02-04T10:08:43+00:00
author: yaroslav.yarmoshyk

guid: http://www.tech-notes.net/?p=3118
permalink: /configure-php-cgi/
image: /wp-content/uploads/2014/03/apache+php_logo.jpg
categories:
  - Apache
  - PHP
tags:
  - php-cgi
---
Recently, I came across an issue: `phpMyAdmin` was complaining about the absence of the `mcrypt` module in `PHP`. The strange thing was that when I ran `php -m` in the console, the `mcrypt` module was present:
```bash
php -m |grep mcrypt
```

I scratched my head for a moment, and then it dawned on me that there were two installations of `PHP` on the server, both were built from source. Interestingly, the `mcrypt` module was only present in one of them, and the `Apache module` was only in the other.

The situation was quite absurd, but it's precisely what prompted me to create this post on how to configure PHP to work in CGI mode for a specific folder, using `phpMyAdmin` as an example.

To achieve this, you need to edit the configuration file with the following lines:


```bash
ScriptAlias /php/ /usr/bin/

<Directory /usr/share/phpMyAdmin/>  
  AddHandler php-cgi-handler .php  
  Action php-cgi-handler /php/php-cgi  
</Directory>
```

Instead of phpMyAdmin, it could be a website folder.
