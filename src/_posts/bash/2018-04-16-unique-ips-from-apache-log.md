---
title: "Reading unique records from file"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "How to quickly install and setup Minimal Mistakes for use with GitHub Pages."
last_modified_at: 2018-04-16T00:00:00-00:00
toc: false
categories:
  - Bash
tags:
  - Bash
  - Apache
  - awk
redirect_from:
  - /уникальные-ip-адреса-в-access-log-apache/
---
The following command can be executed to read unique IPs from the apache access log. Different variations can be used to process records from any file:

```bash
cat access.log | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20
```
