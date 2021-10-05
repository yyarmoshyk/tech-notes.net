---
id: 2040
title: Страница статистики HaProxy
date: 2014-10-31T12:46:25+00:00
author: admin

guid: http://www.tech-notes.net/?p=2040
permalink: /haproxy-stats-page/
image: /wp-content/uploads/2014/10/statpic1.jpeg
categories:
  - HaProxy
tags:
  - HaProxy
  - haproxy stats
---
HaProxy предоставляет удобный инструмент отображения статистики в реальном времени.  
<!--more-->

Для коректного отображения статистики рекомендуется создать отдельный listen и повесить его на отдельный порт в режиме http:

```bash
listen stats *:8080
 mode http
 stats enable
 stats realm LoadBalancer_statistics
 stats scope http-web
 stats scope https-web
 stats scope http-app
 stats scope mysql-proxy
 stats auth admin:<strong>adminpassword</strong>
 stats uri /stats
```


После перезапуска демона HaProxy статистика будет доступна по адресу:  
http://ip_сервера:8080/stats

[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120-1024x503.png" alt="Screenshot from 2014-10-31 08:31:20" width="640" height="314" class="aligncenter size-large wp-image-2041" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120-1024x503.png 1024w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120-170x83.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120-300x147.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120.png 1369w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-31-083120.png)

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>