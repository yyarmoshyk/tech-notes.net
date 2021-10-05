---
id: 1407
title: Использование NginX за балансировщиком нагрузки и правильные ip адреса в логах
date: 2014-08-20T18:05:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=1407
permalink: /nginx-realip-in-logs/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
---
Если у Вас на сервере установлен `Varnish + NginX`, то в логах `NginX` все посетители будут с одним ip адресом - `127.0.0.1`. Есть два варианта:

1. [Изменить формат ведения логов](http://www.tech-notes.net/nginx-logformat/ "Изменение формата ведения логов в NginX")  
2. Заставить NginX сразу обрабатывать правильный ip адрес

Для начала нужно заставить `Varnish` отправлять этот ip адрес бэкэнду. Для этого добавьте следующие строки в секцию `vcl_recv`:

```bash
if (req.restarts == 0) {
  if (req.http.x-forwarded-for) {
    set req.http.X-Forwarded-For = req.http.X-Forwarded-For + ", " + client.ip;
  } else {
    set req.http.X-Forwarded-For = client.ip;
  }
}
```


На самом деле можно ограничиться только:

```bash
set req.http.X-Forwarded-For = client.ip;
```


Теперь удостовертесь, что realip включен в вашем NginX:

```bash
nginx -V 2>&1 |grep realip
```

Если все ОК, добавьте следующие строки в файл настройки NginX (`/etc/nginx/nginx.conf`) в секцию http:

```bash
set_real_ip_from   127.0.0.1;
real_ip_header      X-Forwarded-For;
```


Проверяем конфиг:

```bash
nginx -t
```

Перезапускаем Varnish и NginX:

```bash
/etc/init.d/varnish restart && /etc/init.d/nginx restart
```

Читаем логи.
