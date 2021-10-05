---
id: 785
title: Проблема файла поддержки языка в osCommerce
date: 2014-04-08T13:46:14+00:00
author: admin

guid: http://www.tech-notes.net/?p=785
permalink: /issue-with-language-oscommerce/
image: /wp-content/uploads/2014/04/osCommerce.jpg
categories:
  - Other CMS
tags:
  - osCommerce
  - failed to open stream osCommerce
---
При работе с магазином на osCommerce периодически вылетает ошибка '503 Server Error'.

В логах обнаружил вот такие сообщения:

```bash
PHP Warning: require(includes/languages/.php): failed to open stream: No such file or directory &#8230;  
PHP Fatal error: require(): Failed opening required 'includes/languages/.php'
```

Для того что бы все завелось нужно немного подредактировать файл:  
includes/application_top.php

Найти вот такую строку:

```php
// set the language
if (!tep_session_is_registered(‘language’) || isset($HTTP_GET_VARS['language'])) {
```


Привести ее к вот такому виду:
```php
// set the language
if (!tep_session_is_registered(‘language’) || isset($HTTP_GET_VARS['language']) || empty($language)) {
```
