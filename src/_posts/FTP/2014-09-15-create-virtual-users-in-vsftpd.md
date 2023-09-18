---
id: 1699
title: Using virtual users in Vsftpd
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
This post will show you how to create virtual users in vsftpd.

First, let's make a backup copy of the configuration file:
```bash
cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.bak$(date +%m-%d-%Y)
```

Now edit the `/etc/vsftpd/vsftpd.conf`. You need to make sure that the following directives are set correctly:

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

Edit the file `/etc/pam.d/vsftpd` with the following:

```bash
@include common-session  
auth required pam_userdb.so db=/etc/vsftpd/virtual_users  
account required pam_userdb.so db=/etc/vsftpd/virtual_users  
session required pam_loginuid.so
```

In the case of Linux Ubuntu there might be otherconfiguration lines in the file. They need to be commented out, otherwise it won’t work. The following message will appear in the logs when accessing the server:
```bash
vsftpd: pam_unix(vsftpd:auth): authentication failure; logname= uid=0 euid=0 tty=ftp
```

Create `/root/ftp_users.txt` and enter user names and passwords into it line by line:

```bash
ftpuser  
userpassword
```

Создаем базу виртуальных пользователей, предварительно сделав резервную копию текущей:
Next create a database of virtual users. Make sure to backup the current one:

```bash
cp /etc/vsftpd/virtual_users.db /etc/vsftpd/virtual_users.db.bak$(date +%m-%d-%Y)  
db_load -T -t hash -f /root/ftp_users.txt /etc/vsftpd/virtual_users.db
```

Restart the `vsftpd` daemon for the changes to take effect.