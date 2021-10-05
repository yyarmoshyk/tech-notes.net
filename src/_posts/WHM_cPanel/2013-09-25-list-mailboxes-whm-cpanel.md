---
id: 29
title: Список почтовых ящиков WHM/cPanel
date: 2013-09-25T20:45:21+00:00
author: admin

guid: http://wp38.local/?p=29
permalink: /list-mailboxes-whm-cpanel/
attitude_sidebarlayout:
  - default
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053.png
categories:
  - WHM/cPanel
---
[<img class="size-medium wp-image-30 aligncenter" alt="Screenshot from 2013-09-25 16:40:53" src="/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053-300x125.png" width="300" height="125" srcset="/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053-300x125.png 300w, /wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053-1024x430.png 1024w, /wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053.png 1100w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-164053.png)

Всем известный Plesk хранит записи о почтовых ящиком в базе `mysql`. В то же время получить список почтовых ящиков в WHM cPanel можнос использованием следующего скрипта:

```bash
#!/bin/bash
for f in $(ls |grep -v "^\.\|virtfs\|lost+found\|cpeasyapache\|quota.user"); do
  f2=$(echo $f |sed 's/\/$//g');
  for box in $(ls "$f"/mail/ |grep -v "^\.\|new\|cur\|sent\|tmp" ); do
    m=$(ls -l /home/"$f"/mail/"$box"/ |awk '{print $9}' |grep -v "^\." |sed '/^$/d');
   	if [ "$m" != "" ];then
     	for m2 in $m;
     	do
       	echo "$m2"@"$box"
     	done;
   	fi
   done;
done;
```
