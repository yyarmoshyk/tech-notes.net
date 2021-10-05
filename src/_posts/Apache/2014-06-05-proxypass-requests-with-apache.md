---
id: 1004
title: Проксирование запросов в Apache c ProxyPass
date: 2014-06-05T13:30:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=1004
permalink: /proxypass-requests-with-apache/
image: /wp-content/uploads/2014/06/giuseppe-urso-redirect-http-to-https-slider-280x290-280x280.png
categories:
  - Apache
tags:
  - Балансировка нагрузки
  - ProxyPass
---
По разным причинам может понадобиться отображать информацию с одного сервера на другом. В причины вдаваться не буду.

Приведу пример как это можно реализовать средствами `mod_rewrite` и `mod_proxy` web-сервера `Apache2`. В этом примере я буду проксировать запросы на админку WordPress с одного сервера на второй.

Используя mod_proxy:

```bash
ProxyRequests On
ProxyPass /wp-admin http://second.server.com/wp-admin
ProxyPass /wp-login.php http://second.server.com/wp-login.php
ProxyPassReverse /wp-admin http://second.server.com/wp-admin
```


В случае если Вы хотите проксировать SSL/https трафик тогда добавте еще:

```bash
SSLProxyEngine on
```


Используя mod_rewrite:

```bash
RewriteEngine on
RewriteCond %{REQUEST_URI} ^/wp-admin [NC]
RewriteCond %{REQUEST_URI} ^/wp-login.php [NC]
RewriteRule ^(.*)$ http://second.server.com/%{REQUEST_URI} [P]
```


В любом из случаев нужно что бы были включены `mod_rewrite`, `mod_proxy` и `mod_proxy_http`.

```bash
a2enmod mod_rewrite mod_proxy mod_proxy_http
```
