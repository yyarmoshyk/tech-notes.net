---
title: "Install Wireshark to Ubuntu 16.04/14.04"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "How to quickly install and setup Minimal Mistakes for use with GitHub Pages."
last_modified_at: 2018-03-17T00:00:00-00:00
toc: false
categories:
  - Ubuntu desktop
tags:
  - ubuntu
  - wireshark
redirect_from:
  - /install-wireshark-ubuntu-16-0414-04/
---
[WireShark](https://www.wireshark.org/) is a great tool to analyze the network traffic. One day I discovered that it is not a trivial task to gegt it installed on Ubuntu.
There is a surce package available for linux:
[https://1.na.dl.wireshark.org/src/wireshark-3.1.0.tar.xz](https://1.na.dl.wireshark.org/src/wireshark-3.1.0.tar.xz)

However it is way easier to get it installed using the default package manager:
```bash
sudo add-apt-repository ppa:wireshark-dev/stable
apt-get update
apt-get install wireshark
```
