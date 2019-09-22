---
title: "Configure NginX to distribute traffic between multiple servers"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "Use NginX as a load balancer"
last_modified_at: 2014-03-14T00:00:00-00:00
toc: false
categories:
  - NginX
tags:
  - nginx
  - loadbalancing
redirect_from:
  - /load-balancing-nginx/
---
In this article I'd like to give some guidelines how to configure NginX to be the loadbalancer for a multiple backend servers.
I consider the following schema:
<center><img src="/assets/images/nginx-load-balancer.jpg"></center>

There are 2 NginX features that will do the trick for us:
 * `upstream` is shipped with [HttpUpstream](http://wiki.nginx.org/HttpUpstreamModule) module and allows to loadbalance the traffict between multiple backend servers.
 * `proxypass` is shipped with [HttpProxy](http://wiki.nginx.org/HttpProxyModule) module and allows to proxy requests to the servers behind the load balancer.

So let's consider 3 webservers that run a single website and we need to distribute the incomming traffic between them:
```
Apapche#1:
ip: 192.168.10.10

Apapche#2
ip: 192.168.10.20

Apapche#3
ip: 192.168.10.30
```

We need to update the nginx configuration with the following:
```bash
upstream http {
    server 192.168.10.10 weight=2 max_fails=2 fail_timeout=2s;
    server 192.168.10.20 weight=2 max_fails=2 fail_timeout=2s;
    server 192.168.10.30 weight=2 max_fails=2 fail_timeout=2s;
}
```
Here:
  * `weight` is used to define the importance of the server in the cluster. In this particular case all servers are equal. If you need more traffic to be delivered to some server than you can increase it's `weight` with the higher value.
  * `max_fails` defines the number of failed connections to the backend server before considering it as unhealthy.
  * `fail_timeout` the amount of time between failed connections.

In this case the the server will be marked as unheathy after 2 failures during 4 seconds and NginX will stop delivering traffic to it.
This ecxample describes the approach with `Passive health checks`. More details about health checks can be read [here](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/)

There is one more thing that can be defined in the upstream section. It is the loadbalancing type. One of the following:
Методы балансировки нагрузки (описываются в начале секции upstream):

  * `ip_hash` will make nginx to deliver all incomming requests from one client to the same backend server according to the information about it's ip address. *Not compatible with `weight`*.
  * `least_conn` will make nginx to deliver requests to the backend server with that has the least active connections.
  * `round-robin` is the default mode. Traffic will be delivered to all servers one by one.

Now we need to tell NginX what to do with the http upstream. This can be done by specifying the default location:
```bash
location / {
    proxy_read_timeout 1200;
    proxy_connect_timeout 1200;
    proxy_pass http://http/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

It is really cool that NginX supports ssl termination. This means that there is no need to specify the separate upstream for https connections. We need to specify the ssl certificate to be used for https listener and that is it. Here is an example of https config:

```bash
server {
  servername mywebsite.com www.mywebsite.com;
  listen 443;

  ssl on;
  ssl_certificate /etc/nginx/SSL/hostname.pem;
  ssl_certificate_key /etc/nginx/SSL/server.key;

  location / {
      proxy_read_timeout 1200;
      proxy_connect_timeout 1200;
      proxy_pass http://http/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header HTTPS on;
  }
}
```

Small recommendation is to offload static content with NginX insteed of reading it from backend server:
```bash
location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
    root /var/www/html;
    expires 30d;
    access_log off;
}
location ~* \.(css|js)$ {
    root /var/www/html;
    expires 1d;
    access_log off;
}
```
