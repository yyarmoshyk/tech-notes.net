---
id: 3060
title: Disable Diffie-Hellman Modulus vsFTPD
date: 2015-12-30T18:45:38+00:00
author: admin

guid: http://www.tech-notes.net/?p=3060
permalink: /diffie-hellman-modulus-vsftpd/
image: /wp-content/uploads/2014/09/vsftpd_logo.png
categories:
  - SSL
tags:
  - FTP
  - vsftpd
---
I couldn't find how to disable Diffie-Hellman encryption in vsFTPD TLS.

PCi compliance scanner refused to skip this server until we fixed the vsftp server config:
<img src="/wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808.png" alt="Screenshot from 2015-12-30 13:38:08" width="830" height="310" class="aligncenter size-full wp-image-3062" srcset="/wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808.png 830w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-170x63.png 170w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-300x112.png 300w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-768x287.png 768w" sizes="(max-width: 830px) 100vw, 830px" />

The author of [weakdh.org](https://weakdh.org/sysadmin.html) described how to disable `Diffie-Hellman` for `Ligtpd`,`Nginx` and `Tomcat`, but not for ` vsFTPD`.

I will make a reservation that I worked with `vsFTPD v.3.0.2`. Not sure if it will work for previous versions.

Open the configuration file for editing:
```bash
vim /etc/vsftpd/vsftpd.conf
```

Disable ssl v1,v2,v3 to make `vsftpd` encrypt all traffic using tls v.1.1 and v.1.2:
```bash
ssl_tlsv1=NO  
ssl_sslv2=NO  
ssl_sslv3=NO
```

Next update the list of allowed ciphers to match the following and restart `vsFTPD` daemon:
```bash
ssl_ciphers=ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-DSS-AES128-SHA256:DHE-DSS-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA:!DHE-RSA-AES128-GCM-SHA256:!DHE-RSA-AES256-GCM-SHA384:!DHE-RSA-AES128-SHA256:!DHE-RSA-AES256-SHA:!DHE-RSA-AES128-SHA:!DHE-RSA-AES256-SHA256:!DHE-RSA-CAMELLIA128-SHA:!DHE-RSA-CAMELLIA256-SHA
```
