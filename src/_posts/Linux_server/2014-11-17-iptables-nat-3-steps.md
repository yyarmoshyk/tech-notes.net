---
id: 1945
title: IpTables NAT в 3 шагa
date: 2014-11-17T19:28:32+00:00
author: admin

guid: http://www.tech-notes.net/?p=1945
permalink: /iptables-nat-3-steps/
image: /wp-content/uploads/2014/11/Nat-Logo.jpg
categories:
  - Linux server
tags:
  - iptables
---
NAT - Network address translation или преобразование (трансляция) сетевых адресов, это хорошая фича любого фаервола, позволяющий преобразовывать IP-адреса транзитных пакетов.

Рассмотрю пример проброса трафика с одного VPN соединения в другое.  
VPN1: tap0  
VPN2: ppp0  
никакой привязки в ip адресам

Для начала разрешаем перенаправление ipадресов:

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

Создаем правила маскарада пакетов

```bash
iptables -t nat -A POSTROUTING -o tap0 -j MASQUERADE  
iptables -t nat -A POSTROUTING -o ppp0 -j MASQUERADE
```

Разрешаем пакетам ходить в обе стороны:

```bash
iptables -A FORWARD -i ppp0 -o tap0 -j ACCEPT  
iptables -A FORWARD -i tap0 -o ppp0 -j ACCEPT
```

* `-i` - incoming - входящий интерфейс  
* `-o` - outgoing - исходящий интерфейс
