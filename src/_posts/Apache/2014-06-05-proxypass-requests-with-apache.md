---
id: 1004
title: Forward requests over Apache with ProxyPass
date: 2014-06-05T13:30:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=1004
permalink: /proxypass-requests-with-apache/
image: /wp-content/uploads/2014/06/giuseppe-urso-redirect-http-to-https-slider-280x290-280x280.png
categories:
  - Apache
tags:
  - load balancing
  - Proxy Pass
---
For various reasons you may want to display information from one server to another. I won't go into the reasons.

I will give an example of how this can be implemented using the `mod_rewrite` and `mod_proxy` tools of the `Apache2` web server. In this example, I will be proxying WordPress admin requests from one server to another.

Using mod_proxy:

```bash
Proxy Requests On
ProxyPass /wp-admin http://second.server.com/wp-admin
ProxyPass /wp-login.php http://second.server.com/wp-login.php
ProxyPassReverse /wp-admin http://second.server.com/wp-admin
```


If you want to proxy SSL/https traffic then add:

```bash
SSLProxyEngine on
```

Using mod_rewrite:
```bash
Rewrite Engine on
RewriteCond %{REQUEST_URI} ^/wp-admin [NC]
RewriteCond %{REQUEST_URI} ^/wp-login.php [NC]
RewriteRule ^(.*)$ http://second.server.com/%{REQUEST_URI} [P]
```


In either case, `mod_rewrite`, `mod_proxy` and `mod_proxy_http` must be enabled.
```bash
a2enmod mod_rewrite mod_proxy mod_proxy_http
```