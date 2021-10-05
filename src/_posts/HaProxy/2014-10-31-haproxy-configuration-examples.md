---
id: 1987
title: Примеры настройки HaProxy
date: 2014-10-31T08:51:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=1987
permalink: /haproxy-configuration-examples/
image: /wp-content/uploads/2014/10/160x160-haproxy_logo.png
categories:
  - HaProxy
tags:
  - Балансировка нагрузки
---
В догонку за [первой статьей](http://www.tech-notes.net/haproxy-configuration-overview/) в этой я хочу рассмотреть несколько примеров настройки HaProxy для балансировки трафика.  

Вся конфигурация HaProxy хранится в файле /etc/haproxy/haproxy.cfg  
Стандартный конфиг имеет несколько примеров описания backend, frontend и listen секций.

Также он содержит секцию `**Global**`, в которой описаны опции, которые являются глобальными. Опять же все очень просто и понятно для любого, кто владеет английским на уровне `читаю со словарем`. Разверните спойлер:  

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Пример секции <strong>global</strong>
  </div>

  <div class="spoiler-body">
<pre>
global
    log         127.0.0.1 local2
    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon
</pre>
  </div>
</div>

Для того, что бы включить логирование воспользуйтесь [этой статьей.](http://www.tech-notes.net/haproxy-configure-logs/" title="Как настроить лог для HaProxy)

Дальше идет секция defaults, которая содержит общие для всех настройки.<br />

<div class="spoiler-wrap">
<div class="spoiler-head folded">
Пример секции <strong>defaults</strong>
</div>

<div class="spoiler-body">
<pre>
defaults
log         global
option      dontlognull
option      forwardfor
option      redispatch
timeout connect 10000 # default 10 second time out if a backend is not found
timeout client 300000
timeout server 300000
maxconn     60000
retries     3
</pre>
</div> </div>

Свой пример я начну с более сложного подхода: описание Frontend-Backend. Этот подход может быть очень полезным, если у Вас есть несколько групп серверов, отвечающих за разные задачи, в моем примере - 2 сайта находятся на 2-х парах серверов. Соответственно группы серверов объединяются в backendы, а условия доставки запросов к ним определяются с помощью acl в секции frontend.

```bash
####
# HTTP section
####
frontend http-proxy
bind *:80
mode http
acl web1 hdr_beg(host) www.website1.com
acl web2 hdr_beg(host) www.website2.com
use_backend http-web2 if web2
default_backend http-web1

####
# Description of the web1 servers
####
backend http-web1
mode http
balance roundrobin
option httpclose
option forwardfor
option httpchk OPTIONS * HTTP/1.1rnHost: www
server web01 192.168.10.20:80 check inter 2000 fall 3
server web02 192.168.10.16:80 check inter 2000 fall 3

####
# Description of the web2 servers
####
backend http-web2
balance roundrobin
mode http
option httpclose
option forwardfor
option httpchk OPTIONS * HTTP/1.1rnHost: www
server app01 192.168.10.13:80 check inter 2000 fall 3
server app02 192.168.10.14:80 check inter 2000 fall 3
```

Балансировка https трафика происходит в режиме tcp. Ниже представлен пример описания секции listen. По аналогии с предыдущим примером, несколько серверов можно описывать с помощью подхода frontend-backend.

В режиме tcp HaProxy просто отправляет весь трафик на сервера за балансировщиком.

```bash
####
# HTTPs section
####
listen https-proxy *:443
mode tcp
balance source
option httpclose
option forwardfor
server web01 192.168.10.20:443 check port 443
server web02 192.168.10.16:443 check port 443
```


В режиме tcp также можно балансировать `MySQL` или `MSSQL` трафик, если у Вас настроена `master-master` репликация. В случае `master-slave` репликации рекомендую [использовать mysql-proxy](http://www.tech-notes.net/mysql-proxy-intall-configure-in-centos7) для распределения `select`, `update`, `insert` запросов между серверами<br />

<div class="spoiler-wrap">
<div class="spoiler-head folded">
Описание mysql серверов
</div>

<div class="spoiler-body">

<pre>
####
# Description of the sql servers
####

listen mysql-proxy *:3306
mode tcp
balance roundrobin
option tcplog
server SQL01 192.168.10.21:3306 check port 3306
server SQL02 192.168.10.22:3306 check port 3306
server SQL02 192.168.10.23:3306 check port 3306
<pre>


</div> </div>
