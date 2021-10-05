---
id: 2843
title: Проблемы с визуальным редактором в WordPress
date: 2015-08-26T18:28:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=2843
permalink: /visual-editor-wordpress-nextgen/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
---
Сегодня столкнулся с проблемой на одном из сайтов с которым работал.

Суть проблемы заключалась в том, что визуальный редактор (Visual editor) `TinyMCE` не работал и показывал пустое поле.  
В консоли браузера отображались ошибки о том, что невозможно подгрузить стили и скрипты. Картина была следующая:  
[<img src="/wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024.png" alt="Screenshot from 2015-08-26 13:20:24" width="1563" height="312" class="aligncenter size-full wp-image-2844" srcset="/wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024.png 1563w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024-170x34.png 170w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024-300x60.png 300w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024-1024x204.png 1024w" sizes="(max-width: 1563px) 100vw, 1563px" />](/wp-content/uploads/2015/08/Screenshot-from-2015-08-26-132024.png)

Все нужные файлы находились в папке плагина `NextGen library`. При выключении этого плагина визуальный редактор работал как ни в чем не бывало.

На форумах `WordPress`'а люди [ругаются на функцию 'DIRECTORY_SEPARATOR'](https://wordpress.org/support/topic/the-nextgen-button-is-not-working-in-visual-editor), [рекомендуют включить script_debug](https://wordpress.org/support/topic/visual-editor-blank-no-text-editor).

Оказалось у плагина проблемы с [нахождением папки /wp-content](https://wordpress.org/support/topic/slashes-are-missing-still-problem-is-not-fixed)

Все лечится очень просто. Нужно найти следующую строку в файле `wp-config.php`

```php
define('WP_CONTENT_URL', '/wp-content');
```

И заменить ее следующей:

```php
define('WP_CONTENT_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/wp-content');
```
