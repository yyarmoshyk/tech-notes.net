---
id: 801
title: Load Balancing with Apache
date: 2014-05-01T17:12:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=801
permalink: /load-balancing-with-apache/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
tags:
  - Apache
  - load balancing
---
Greetings dear reader. In this article I want to describe how to configure Apache to load balance multiple back-end servers.
You'll need the following two modules:
* `mod_proxy`
* `mod_proxy_balancer`

Host configuration example:
```bash
<VirtualHost *:80>
	ServerName mywebsite.com
	Proxy Requests On
	ProxyVia On
	
	<Proxy balancer://mycluster>
		BalancerMember http://192.168.1.50:80
		BalancerMember http://192.168.1.51:80
		BalancerMember http://192.168.1.52:80
	</Proxy>

	ProxyPass / balancer://mycluster
</VirtualHost>
```

In order to enable `sticky sessions` you need to bring the config to the following form:
```bash
<VirtualHost *:80>
	ServerName mywebsite.com
	Proxy Requests On
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