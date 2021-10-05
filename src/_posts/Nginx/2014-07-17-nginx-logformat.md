---
id: 1277
title: Изменение формата ведения логов в NginX
date: 2014-07-17T17:01:53+00:00
author: admin

guid: http://www.tech-notes.net/?p=1277
permalink: /nginx-logformat/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
---
Многим известен `logformat` в настройках сервера `Apache`. То же самое существует и для `Nginx`.

Для того что бы использовать значение `X-Forwarded-For` вместо `$remote_addr` в логах, внесите следующие изменения в файл `/etc/nginx/nginx.conf`:

```bash
log_format   forwarded '"$http_x_forwarded_for" - $remote_user [$time_local]  $status '
            '"$request" $body_bytes_sent "$http_referer" '
            '"$http_user_agent"';
```


Дальше укажите формат для стандартного лог-файла доступа:

```bash
access_log /var/log/nginx/access.log forwarded;
```
