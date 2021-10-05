---
id: 2557
title: NginX и X-Forwarded-Proto:HTTPS за балансировщиком нагрузки
date: 2015-05-04T19:01:51+00:00
author: admin

guid: http://www.tech-notes.net/?p=2557
permalink: /x-forwarded-proto-https-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - SSL
  - Балансировка нагрузки
  - X-Forwarded-Proto
---
Быстрая заметка о https трафике за кривыми балансировщиками нагрузки. Мы имеем [Настройка Nginx + php-fcgi](/nginx-php-fcgi/) за балансировщиком нагрузки. Балансировщик, как женщина, которую никто так не понимает, как она сама себя не понимает.

Тоесть балансировщик нагрузки (он же БН, он же LB) обрабатывает либо `https`, либо `http` трафик. `SSL Termination` можно настроить на LB, но к серверам он обращается все-равно в 80-й порт. В таком случае сайт не получает заголовок `https` со значением `on`. В случае с разными валидациями безопасных сесий, будет выходить безконечное перенаправление и ошибка в результате.

Но LB отправляет протокол связи с помощью заголовка `X-Forwarded-Proto`. Его-то и будем ловить.

Для того, что бы NginX начал преобразовывать заголовок ``X-Forwarded-Proto: HTTPS`` в ``HTTPS: on`` нужно подредактировать главный конфигурационный файл `/etc/nginx/nginx.conf`.

В секцию http, которая выглядит так:

```bash
http {
    ...
}
```

Вставить следующий код:

```bash
map $http_x_forwarded_proto $fastcgi_https {
        default off;
        https on;
    }

```


Если его добавить в любое другое место - получите следующую ошибку при перезапуске nginx:

```bash
nginx: [emerg] `map` directive is not allowed here
```

Если прописать просто `$https` вместо `$fastcgi_https` - получите следующую ошибку:

```bash
nginx: [emerg] the duplicate `https` variable in /etc/nginx/nginx.conf
```

Дело в том, что начиная с какой-то бородатой версии NginX имеет встроеную переменную $https, поэтому ее повторно заюзать не получится.

Редактируем `/etc/nginx/fastcgi_params`:

Коментируем/удаляем:

```bash
fastcgi_param  HTTPS              $https if_not_empty;
```


Добавляем:

```bash
fastcgi_param  HTTPS              $fastcgi_https if_not_empty;
fastcgi_param  SERVER_PORT $http_x_forwarded_port;
```


Перезапускаем nginx что бы изменения вступили в силу.

Проверяем с помощью phpinfo и видим, что все рабоает:  
[<img src="/wp-content/uploads/2015/05/nginx-x-forwarded-proto.png" alt="nginx-x-forwarded-proto" width="823" height="302" class="aligncenter size-full wp-image-2561" srcset="/wp-content/uploads/2015/05/nginx-x-forwarded-proto.png 823w, /wp-content/uploads/2015/05/nginx-x-forwarded-proto-170x62.png 170w, /wp-content/uploads/2015/05/nginx-x-forwarded-proto-300x110.png 300w" sizes="(max-width: 823px) 100vw, 823px" />](/wp-content/uploads/2015/05/nginx-x-forwarded-proto.png)

Подобная картина ломает шаблон.
