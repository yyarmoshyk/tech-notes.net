---
id: 1299
title: Включаем страницу статистики в NginX
date: 2014-07-23T12:56:05+00:00
author: admin

guid: http://www.tech-notes.net/?p=1299
permalink: /enable-status-page-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
---
Для того, что бы включить страницу статистики `NginX` нужно добавить вот такие строки в файл настроек `nginx.conf` или в файл, в котором описаны сайты. Изменения нужно вносить в секцию `server { ... }`:

```bash
location /statistics {
  # Turn on nginx stats
  stub_status on;
  # I do not need logs for stats
  access_log   off;
  # Send rest of the world to /dev/null #
  #deny all;
  auth_basic "Restricted";
  auth_basic_user_file /etc/nginx/auth/.htpasswd;
}
```

Последние две строки нужны для того, что бы прикрыть страницу статистики простой формой логина. Не стоит показывать ее всем.

Дальше проверяем конфигурацию `Nginx`:

```bash
nginx -t
```

Если все ОК - перезапускаем:

```bash
/etc/init.d/nginx restart
```

В результате по адресу `http://www.website.com/statistics` увидите следующую картину:  
[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-23-085355.png" alt="Screenshot from 2014-07-23 08:53:55" width="265" height="108" class="aligncenter size-full wp-image-1301" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-23-085355.png 265w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-23-085355-170x69.png 170w" sizes="(max-width: 265px) 100vw, 265px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-23-085355.png)
