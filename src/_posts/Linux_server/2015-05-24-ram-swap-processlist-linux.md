---
id: 2631
title: Упорядочить Процессы по Используемой Памяти в Linux
date: 2015-05-24T17:31:13+00:00
author: admin

guid: http://www.tech-notes.net/?p=2631
permalink: /ram-swap-processlist-linux/
image: /wp-content/uploads/2014/02/bash_shell.jpg
categories:
  - Linux server
---
Следующуя команда вернет список процессов, наиболее активно использующих память, в мегабайтах:

```bash
ps axo rss,comm,pid | awk '{ proc_list[$2] += $1; } END \  
{ for (proc in proc_list) { printf(`%d\t%s\n`, proc_list[proc],proc); }}' \  
| sort -n | tail -n 10 | sort -rn | awk '{$1/=1024;printf `%.0fMB\t`,$1}{print $2}'
```
