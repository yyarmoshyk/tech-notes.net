---
id: 1699
title: Использование виртуальных пользователей в Vsftpd
date: 2014-09-15T12:54:12+00:00
author: admin

guid: http://www.tech-notes.net/?p=1699
permalink: /create-virtual-users-in-vsftpd/
image: /wp-content/uploads/2014/09/vsftpd_logo.png
categories:
  - FTP
tags:
  - vsftpd
---
Эта заметка поведает о том, как создать виртуальных пользователей в vsftpd.  

Для начала сделаем резервную копию конфигурационного файла:

```bash
cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.bak$(date +%m-%d-%Y)
```

Теперь редактиреум `/etc/vsftpd/vsftpd.conf`. Вам нужно удостоваериться, что следующие директивы выставлены верно:

```bash
chown_uploads=YES
chown_username=apache
guest_username=apache
connect_from_port_20=YES
dirmessage_enable=YES
listen_ipv6=YES
listen=NO
local_umask=022
nopriv_user=apache
syslog_enable=YES
tcp_wrappers=YES
userlist_enable=YES
xferlog_enable=YES
xferlog_std_format=YES

anonymous_enable=NO
local_enable=YES
guest_enable=YES
virtual_use_local_privs=YES
write_enable=YES
pam_service_name=vsftpd
local_root=/var/www/html
chroot_local_user=YES
hide_ids=YES
```

Редактируем файл `/etc/pam.d/vsftpd` слудющими строками:

```bash
@include common-session  
auth required pam_userdb.so db=/etc/vsftpd/virtual_users  
account required pam_userdb.so db=/etc/vsftpd/virtual_users  
session required pam_loginuid.so
```

В случае с Linux Ubuntu в файле могут присутствовать другие строки. Их нужно закоментировать иначе не заработает. В логах при этом будет появляться следующее сообщение при доступе к серверу:

```bash
vsftpd: pam_unix(vsftpd:auth): authentication failure; logname= uid=0 euid=0 tty=ftp
```

Создаем файл `/root/ftp_users.txt` и вносим в него имена пользователей и их пароли построчно:

```bash
ftpuser  
userpassword
```

Создаем базу виртуальных пользователей, предварительно сделав резервную копию текущей:

```bash
cp /etc/vsftpd/virtual_users.db /etc/vsftpd/virtual_users.db.bak$(date +%m-%d-%Y)  
db_load -T -t hash -f /root/ftp_users.txt /etc/vsftpd/virtual_users.db
```

Перезапускаем демон `vsftpd` что бы исменения вступили в силу.
