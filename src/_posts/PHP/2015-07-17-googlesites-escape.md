---
id: 2690
title: Перенос сайта из GoogleSites
date: 2015-07-17T13:51:10+00:00
author: admin
guid: http://www.tech-notes.net/?p=2690
permalink: /googlesites-escape/
image: /wp-content/uploads/2015/07/gsites.png
categories:
  - PHP
tags:
  - GoogleSites
  - миграция
---
Сегодня хабрапользователь 'лорд Брабазон Вир-де-Вир' хотел бы поделиться своим методом переноса сайта с GoogleSites на отдельный хостинг.  

Основной скрипт трансфера выглядит следующим образом:

```php
<?php
include "_config.php";
error_reporting(0);
$param=$_GET["param"];
if($param==$_index_page OR $param==$_index_page.'/'){
    $param='';
}
$url = strtolower('https://sites.google.com/site/'.$_google_sites_sitename.'/'.$param);
if (file_get_contents($url)){
    $content = file_get_contents($url);
    include '_parser.php';
    include '_header.php';
    echo $content;

    $file_info = new finfo(FILEINFO_MIME);
    $mime_type = $file_info->buffer($content);
    Header ('Content-type: '.$mime_type);

    $widgeturl = 'http://'.$_site_url.'/'.$param;
    include "_comments.php";
}else{
    $url='http://'.$_site_url.'/error.php?code=404';
    $content = file_get_contents($url);
    echo $content;
}
?>
```

Все довольно понятно.

В работе используются 4 дополнительных файла:
1. `_config.php` - из названия ясно, что это файл с настройками:
```php
<?php
$_site_url = 'blastorq.url.ph/oldsite';
$_google_sites_sitename = "blastorq";
$_index_page = 'landing';
```
    * `$_site_url` — Адрес сайта на хостинге.
    * `$_google_sites_sitename` — Адрес сайта GS без "`sites.google.com/site/`", у меня, как видите, "`sites.google.com/site/blastorq`"
    * `$_index_page` — Индекс страница сайта (index, index.php, index.html, home.php), в этом примере — landing.
2. `_parser.php` парсит страницы гугл-сайта, заменяет адреса и т.п.
```php
<?php
    $content = str_replace('<a href="https://sites.google.com/site/'.$_google_sites_sitename.'/" ', '<a href="http://'.$_site_url.'/" ', $content);
    $content = str_replace('https://sites.google.com/site/'.$_google_sites_sitename.'/', 'http://'.$_site_url.'/', $content);
    $content = str_replace('/site/blastorq', '/oldsite', $content);
    $content = str_replace('type="image/x-icon" href="//www.google.com/images/icons/product/sites-16.ico"', 'href="http://'.$_site_url.'/favicon.png" type="image/png"', $content);
    $content = str_replace('<link rel="canonical" href="http://blastorq.url.ph/', '<link rel="canonical" href="http://'.$_site_url.'/', $content);
    $script="if(document.getElementById('sites-chrome-sidebar-left').style.display=='block'){document.getElementById('sites-chrome-sidebar-left').style.display='none';document.getElementById('sites-canvas-wrapper').style.display='block';document.getElementById('displayer').style.background='no-repeat url(http://'.$_site_url.'/pad.png) 1px 0'}else{document.getElementById('sites-chrome-sidebar-left').style.display='block';document.getElementById('displayer').style.background='no-repeat url(http://'.$_site_url.'/pad.png) -16px 0';document.getElementById('sites-canvas-wrapper').style.display='none';}";
    $content = str_replace('-header-horizontal-nav-container" role="navigation">', '-header-horizontal-nav-container" role="navigation"><div id="displayerr" onclick="'.$script.'"><div id="displayer"></div>', $content);
?>
```
3. `_header.php`

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="HandheldFriendly" content="True" />
<?php
  if(**Функция проверки девайса на мобильность**){echo "";}
?>
```
4. `_comments.php` - пустой файл. Может использоваться для коментариев.

Ссылки:
1. [Страинца проэкта на github](https://github.com/da411d/Google-Sites-Stealer)  
1. [Оригинал статьи](http://habrahabr.ru/sandbox/95839/)
