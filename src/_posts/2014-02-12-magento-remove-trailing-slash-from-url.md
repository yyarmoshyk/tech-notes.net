---
id: 458
title: 'Magento: как убрать последний слэш из URL сайта'
date: 2014-02-12T13:40:01+00:00
author: admin

guid: http://www.tech-notes.net/?p=458
permalink: /magento-remove-trailing-slash-from-url/
image: /wp-content/uploads/2014/02/magento_logo_3533.gif
categories:
  - Apache
  - FromHabrSandbox
  - Magento
tags:
  - magento
  - url trailing slash
---
Заметка о том, как как убрать слэш в конце URL, не навредив работе магазина.

Для чего это нужно: Для сервера `mydomain.com/category` и `mydomain.com/category/` это одно и то же. Но для поисковых систем это две разные страницы с одинаковым контентом. И это не есть хорошо. Те сайты, которые уличены в такой, казалось бы мелочи, начинают падать в самый низ поисковых рейтингов.

### Что нужно делать:
Для начала нам нужно немного исправить функцию `getUrl()`, чтобы в генерируемых URL не было замыкающего слэша. Для того, чтобы не вносить изменения в само ядро (что черевато потерей всего custom функционала при обновлении Magento) копируем файл `app/code/core/Mage/Core/Block/Abstract.php` в `app/code/local/Mage/Core/Block/Abstract.php`.

Находим функцию `getUrl()` в файле `app/code/local/Mage/Core/Block/Abstract.php` (941 строка):

```php
public function getUrl($route = '', $params = array())
{
  return $this->_getUrlModel()->getUrl($route, $params);
}
```


Меняем код этой функции на вот этот:

```php
public function getUrl($route = '', $params = array())
{
  $return_url = $this->_getUrlModel()->getUrl($route, $params);
  if ($return_url != $this->getBaseUrl() && substr($return_url, -1) == '/' && !Mage::getSingleton('admin/session')->isLoggedIn()):
    return substr($return_url, 0, -1);
  else:
    return $return_url;
  endif;
}
```

Дальше нам нужно будет отредактировать .htaccess в корне сайта следующими строками:

```bash
RewriteCond %{request_method} ^GET$  
RewriteCond %{REQUEST_URI} ^(.+)/$  
RewriteRule ^(.+)$ %1 [L,R=301]
```

В стандартный `.htaccess` это нужно добавить после строки:

```bash
RewriteRule .* – [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
```

Если у Вас multi-store, то правила в `.htaccess` нужно добавлять для каждого магазина.

<a href="http://habrahabr.ru/sandbox/78747/" target="_blank">и(C)точник</a>
