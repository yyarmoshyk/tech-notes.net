---
id: 458
title: 'Magento: remove trailing slash from the website URL'
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
A note on how to remove the slash at the end of the URL without damaging the store.

What it's for: For a server, `mydomain.com/category` and `mydomain.com/category/` are the same. But for search engines these are two different pages with the same content. And this is important for SEO. 

### What do we have to do:
First we need to slightly fix the `getUrl()` function so that the generated URLs do not have a trailing slash. In order not to make changes to the core itself (which is fraught with the loss of all custom functionality when updating Magento), copy the file `app/code/core/Mage/Core/Block/Abstract.php` to `app/code/local/Mage/Core/Block/Abstract.php`.

Find the `getUrl()` function in the `app/code/local/Mage/Core/Block/Abstract.php` file (line 941):

```php
public function getUrl($route = '', $params = array())
{
  return $this->_getUrlModel()->getUrl($route, $params);
}
```


Change the code of this function to this one:

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

Next, we will need to edit `.htaccess` in the root of the site with the following lines:
```bash
RewriteCond %{request_method} ^GET$
RewriteCond %{REQUEST_URI} ^(.+)/$
RewriteRule ^(.+)$ %1 [L,R=301]
```

In the standard `.htaccess` this should be added after the line:

```bash
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
```

If you have a multi-store, then the rules in `.htaccess` must be added for each store.

<a href="http://habrahabr.ru/sandbox/78747/" target="_blank">origin</a>