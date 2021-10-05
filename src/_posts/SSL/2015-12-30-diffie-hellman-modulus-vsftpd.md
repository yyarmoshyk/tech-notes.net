---
id: 3060
title: Diffie-Hellman Modulus vsFTPD
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
Нигде не смог найти, как отключить в vsFTPD TLS шифрование с помощью Diffie-Hellman.

PCi compliance сканер отказывался пропускать этот сервер, пока мы не пофиксили конфиг vsftp сервера:  
<img src="/wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808.png" alt="Screenshot from 2015-12-30 13:38:08" width="830" height="310" class="aligncenter size-full wp-image-3062" srcset="/wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808.png 830w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-170x63.png 170w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-300x112.png 300w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-30-133808-768x287.png 768w" sizes="(max-width: 830px) 100vw, 830px" />

Автор [weakdh.org](https://weakdh.org/sysadmin.html) расписал как отключить `Diffie-Hellman` и для `Lighttpd`, и для `Nginx`, и для `Tomcat`, но только не для `vsFTPD`.

Собственно сюда я не буду все репостить, а остановлюcь только на `vsftpd`. Оговорюсь, что я работал с `vsFTPD v.3.0.2`. Не уверен сработает ли для предыдущих версий.

Открываем для редактирования конфигурационный файл:

```bash
 vim /etc/vsftpd/vsftpd.conf
```

Для начала отключим ssl v1,v2,v3 что бы vsftpd шифровал весь трафик с помощью tls v.1.1 и v.1.2:
```bash
ssl_tlsv1=NO  
ssl_sslv2=NO  
ssl_sslv3=NO
```
`Nessus` меня перестал ругать после того, как строка со списком разрешенных и ззапрещенных шифров достигла следующего вида:

```bash
ssl_ciphers=ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-DSS-AES128-SHA256:DHE-DSS-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA:!DHE-RSA-AES128-GCM-SHA256:!DHE-RSA-AES256-GCM-SHA384:!DHE-RSA-AES128-SHA256:!DHE-RSA-AES256-SHA:!DHE-RSA-AES128-SHA:!DHE-RSA-AES256-SHA256:!DHE-RSA-CAMELLIA128-SHA:!DHE-RSA-CAMELLIA256-SHA
```
