---
id: 2296
title: Получаем IP-адреса HTTPS-клиентов с HAProxy (frontend) на Nginx (backend) в режимах HTTP и TCP-балансировки
date: 2015-01-13T15:58:25+00:00
author: admin

guid: http://www.tech-notes.net/?p=2296
permalink: '/%d0%bf%d0%be%d0%bb%d1%83%d1%87%d0%b0%d0%b5%d0%bc-ip-%d0%b0%d0%b4%d1%80%d0%b5%d1%81%d0%b0-https-%d0%ba%d0%bb%d0%b8%d0%b5%d0%bd%d1%82%d0%be%d0%b2-%d1%81-haproxy-frontend-%d0%bd%d0%b0-nginx-backend/'
image: /wp-content/uploads/2014/10/160x160-haproxy_logo.png
categories:
  - Nginx
  - HaProxy
tags:
  - Балансировка нагрузки
  - FromHabrSandbox
---
### Предисловие

Я просто не мог пройти мимо [этой статьи на habrahabr.ru](http://habrahabr.ru/post/247297/)

### Содержание

Довольно часто требуется балансировать нагрузку между несколькими веб-серверами. При этом, как правило, необходимо, чтобы веб-приложения получали реальные IP-адреса клиентов, а не IP балансировщика.

В случае балансировки и терминации HTTP(S)-трафика на HAProxy (Layer 7 [[1](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB%D1%8B_%D0%BF%D1%80%D0%B8%D0%BA%D0%BB%D0%B0%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE_%D1%83%D1%80%D0%BE%D0%B2%D0%BD%D1%8F)]), данная задача легко решается добавлением заголовка “X-Real-IP” и его обработкой на Nginx при помощи модуля ngx_http_realip_module [[2](http://nginx.org/ru/docs/http/ngx_http_realip_module.html)]. При балансировке TCP-трафика от HTTPS-клиентов и передаче его на веб-сервера напрямую без модификации или терминации (Layer 4 [[3](https://ru.wikipedia.org/wiki/%D0%A2%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BD%D1%8B%D0%B9_%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C)]) добавить данный заголовок невозможно, поэтому требуется воспользоваться возможностями, предоставляемыми Proxy Protocol [[4](http://www.haproxy.org/download/1.5/doc/proxy-protocol.txt), [5](http://cbonte.github.io/haproxy-dconv/configuration-1.5.html#send-proxy), [6](http://nginx.org/ru/docs/http/ngx_http_core_module.html#listen)].

Рассмотрим оба варианта (балансировка L7 и L4) на примере выдержек из конфигурационных файлов haproxy 1.5.9 и nginx 1.6.2

### Балансировка на прикладном уровне (Layer 7): терминация HTTPS-трафика на HAProxy и передача по HTTPS на Nginx

В данном примере HTTPS-трафик от клиента терминируется на HAProxy, модифицируется и передается на Nginx так же по HTTPS.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    haproxy.cfg
  </div>

  <div class="spoiler-body">
<pre>global
  maxconn 4096
  chroot /usr/share/haproxy
  uid 99
  gid 99
  daemon
  tune.ssl.default-dh-param  2048

defaults
  log     global
  option  redispatch
  option  tcp-smart-accept
  option  tcp-smart-connect
  retries 3
  maxconn 2000
  timeout connect 5000
  timeout check   3000
  timeout client  50000
  timeout server  50000

frontend http_frontend *:80
  mode http
  redirect scheme https code 301 if !{ ssl_fc }

frontend https_frontend_ssl_terminate
  mode http
  bind *:443 ssl crt /etc/haproxy/ssl/public.example.com.pem
  option forwardfor header >X-Real-IP>
  default_backend web_server_http

backend web_server_http
  mode http
  balance roundrobin
  # Отправляем трафик на backend по HTTPS
  server s1_https 192.168.1.10:443 ssl verify none
  server s2_https 192.168.1.20:443 ssl verify none
</pre>
</div> </div>

<div class="spoiler-wrap">
<div class="spoiler-head folded">
nginx.conf
</div>

<div class="spoiler-body">
<pre>
server {
  server_name localhost;

  listen 443 ssl default_server;

  ssl_certificate      /etc/nginx/ssl/internal.example.com.pem;
  ssl_certificate_key  /etc/nginx/ssl/internal.example.com.key;

  # Адрес HAProxy
  set_real_ip_from >192.168.1.254>;
  real_ip_header >X-Real-IP>;

  root /usr/share/nginx/html;
  index index.html index.htm;

  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
      root /usr/share/nginx/html;
  }

  location ~ /\.ht {
      deny all;
  }
}
</pre>
</div> </div>

###   Балансировка на транспортном уровне (Layer 4): передача TCP-трафика с HAProxy на Nginx


В данном примере HTTPS-трафик клиентов не модифицируется (HAProxy вмешивается в транспортный уровень) и его терминация происходит непосредственно на Nginx.


<div class="spoiler-wrap">
<div class="spoiler-head folded">
haproxy.cfg
</div>

<div class="spoiler-body">


<pre>
global
  maxconn 4096
  chroot /usr/share/haproxy
  uid 99
  gid 99
  daemon

defaults
  log     global
  option  redispatch
  option  tcp-smart-accept
  option  tcp-smart-connect
  retries 3
  maxconn 2000
  timeout connect 5000
  timeout check   3000
  timeout client  50000
  timeout server  50000

frontend http_frontend *:80
  mode http
  redirect scheme https code 301 if !{ ssl_fc }

frontend https_frontend_ssl_pass
  mode tcp
  bind *:443
  default_backend web_server_tcp

backend web_server_tcp
  mode tcp
  balance roundrobin
  # ВНИМАНИЕ! Работа с send-proxy возможна только,
  # когда принимающая сторона понимает, что это такое.
  # Для Nginx необходимо включить в директиву listen
  # опцию proxy_protocol.
  server s1_tcp 192.168.1.10:443 >send-proxy>
  server s2_tcp 192.168.1.20:443 >send-proxy>
</pre>
</div> </div>

<div class="spoiler-wrap">
<div class="spoiler-head folded">
nginx.conf
</div>

<div class="spoiler-body">
<pre>
server {
  server_name localhost;

  # ВНИМАНИЕ! Работа с директивой proxy_protocol возможна только в связке с haproxy.
  # Для прямого доступа данную директиву необходимо отключить.
  listen 443 ssl default_server >proxy_protocol>;

  ssl_certificate      /etc/nginx/ssl/public.example.com.pem;
  ssl_certificate_key  /etc/nginx/ssl/public.example.com.key;

  # Адрес HAProxy
  set_real_ip_from >192.168.1.254>;
  real_ip_header >proxy_protocol>;

  root /usr/share/nginx/html;
  index index.html index.htm;

  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
      root /usr/share/nginx/html;
  }

  location ~ /\.ht {
      deny all;
  }
}

</pre>
</div> </div>

### Заключение


Используя описанные выше настройки мы смогли передать веб-серверу Nginx, расположенному за HAProxy, реальные IP-адреса клиентов при работе по HTTPS. Подобным подходом так же можно воспользоваться при работе со сторонними балансировщиками нагрузки, например CloudFlare [<a href="https://danielmiessler.com/getting-real-ip-addresses-using-cloudflare-nginx-and-varnish/" target="_blank">7</a>, <a href="http://www.babaei.net/blog/2013/03/09/getting-real-ip-addresses-using-nginx-and-cloudflare/" target="_blank">8</a>] и AWS ELB [<a href="https://chrislea.com/2014/03/20/using-proxy-protocol-nginx/" target="_blank">9</a>, <a href="http://aws.amazon.com/elasticloadbalancing/" target="_blank">10</a>].
