---
id: 801
title: Балансировка нагрузки с помощью Apache
date: 2014-05-01T17:12:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=801
permalink: /load-balancing-with-apache/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
tags:
  - Apache
  - балансировка нагрузки
---
Приветствую тебя, дорогой читатель. В этой статье я хочу описать настройку Apache для балансировки нагрузки на несколько back-end серверов.  
Для корректной работы понадобятся два модуля:
  * `mod_proxy`
  * `mod_proxy_balancer`

Пример конфигурации хоста:

```bash
<VirtualHost *:80>
	ServerName mywebsite.com
	ProxyRequests On
	ProxyVia On
	<Proxy balancer://mycluster>
		BalancerMember http://192.168.1.50:80
		BalancerMember http://192.168.1.51:80
		BalancerMember http://192.168.1.51:80
	</Proxy>
	ProxyPass / balancer://mycluster
</VirtualHost>
```

Для того что бы включить `липкие сессии` или source балансировку, нужно привести конфиг к следующему виду:  
```bash
<VirtualHost *:80>
	ServerName mywebsite.com
	ProxyRequests On
	ProxyVia On
	Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
	<Proxy balancer://mycluster>
		BalancerMember http://192.168.1.50:80 route=1
		BalancerMember http://192.168.1.51:80 route=2
		BalancerMember http://192.168.1.51:80 route=3
		ProxySet stickysession=ROUTEID
	</Proxy>
	ProxyPass / balancer://mycluster
</VirtualHost>
```
