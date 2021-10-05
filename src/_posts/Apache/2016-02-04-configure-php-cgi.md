---
id: 3118
title: Переклчаем PHP в режим CGI для одной папки
date: 2016-02-04T10:08:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=3118
permalink: /configure-php-cgi/
image: /wp-content/uploads/2014/03/apache+php_logo.jpg
categories:
  - Apache
  - PHP
tags:
  - php-cgi
---
На днях столкнулся с проблемой: phpmyadmin ругался на отсутствие модуля `mcrypt` в php. Странность заключалась в том, что в консольном выводе `php -i` модуль `mcrypt` присутствовал:

```bash
php -m |grep mcrypt
```

Я немного потупил, и до меня дошло, что на сервере было 2 инсталляции php, обе собраны из исходников, при этом модуль для apache присутствовал только в одной из них, а `mcrypt` - в другой.

Ситуация бредовая, но именно она сподвигла меня на создание это записи о том, как настроить PHP работать в режиме CGI для одной папки на примере phpmyadmin.

Для этого нужно отредактировать файл конфигурации следующими строками:

```bash
ScriptAlias /php/ /usr/bin/

<Directory /usr/share/phpMyAdmin/>  
  AddHandler php-cgi-handler .php  
  Action php-cgi-handler /php/php-cgi  
</Directory>
```

Вместо phpmyadmin может быть папка сайта.
