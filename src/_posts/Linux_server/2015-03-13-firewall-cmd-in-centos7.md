---
id: 2466
title: FireWall в CentOS7
date: 2015-03-13T14:51:03+00:00
author: admin

guid: http://www.tech-notes.net/?p=2466
permalink: /firewall-cmd-in-centos7/
image: /wp-content/uploads/2015/03/download.jpg
categories:
  - Linux server
tags:
  - firewall-cmd
---
В CentOS7 обычные правила фаервола `iptables` больше нельзя редактировать привычным способом. Сам `iptables` остался, но стал обернут в `firewalld`. Для разрешения трафика используется утилита `firewall-cmd`

Можно воспользоваться утилитой `firewall-cmd` для добавления правил, на пример:

```bash
firewall-cmd -zone=public -add-port=http/tcp  
firewall-cmd -zone=public -add-port=http/tcp -permanent
```

Вторая команда нужна для того что бы правило применялось при перезапуске фаервола.

Для того что бы разрешить доступ к произвольному порту используйте:

```bash
firewall-cmd -zone=public -add-port=2121/tcp  
firewall-cmd -zone=public -add-port=2121/tcp -permanent
```

Так же можно задать диапазон:

```bash
firewall-cmd -zone=public -add-port=35000-60000/tcp  
firewall-cmd -zone=public -add-port=35000-60000/tcp -permanent
```

Разрешаем доступ с ip адреса:

```bash
firewall-cmd -permanent -zone=public -add-source=10.209.128.30  
firewall-cmd -permanent -zone=public -add-source=10.209.128.30 -permanent
```
