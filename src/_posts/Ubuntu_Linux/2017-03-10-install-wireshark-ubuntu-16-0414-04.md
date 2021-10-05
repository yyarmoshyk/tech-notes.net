---
id: 3636
title: Установка WireShark на Ubuntu 16.04/14.04
date: 2017-03-10T10:36:00+00:00
author: admin

guid: http://www.tech-notes.net/?p=3636
permalink: /install-wireshark-ubuntu-16-0414-04/
image: /wp-content/uploads/2017/03/wireshark-icon2.png
categories:
  - Ubuntu Linux
tags:
  - WireShark Ubuntu
---
WireShark предоставляет удобный функционал для анализа сетевого трафика.

Для Linux он доступен в виде пакета с исходным кодом, который можно скачать по следующей ссылке:
  * [https://1.na.dl.wireshark.org/src/wireshark-2.2.5.tar.bz2](https://1.na.dl.wireshark.org/src/wireshark-2.2.5.tar.bz2)

На много удобнее устанавливать уже готовый пакет. Для этого достаточно выполнить всего 2 шага:
```bash    
sudo add-apt-repository ppa:wireshark-dev/stable
apt-get update
apt-get install wireshark
```
