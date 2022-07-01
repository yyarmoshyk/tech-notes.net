---
id: 2651
title: Configure SFTP Chroot at Ubuntu 14.04
date: 2015-06-02T12:41:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=2651
permalink: /configure-sftp-chroot-on-ubuntu-14-04/
image: /wp-content/uploads/2015/06/sftpnew.png
categories:
  - Linux server
tags:
  - chroot
  - sftp
---
This article covers setting up an `sftp` server and isolating users in their home directories (`chroot`) based on Linux Ubuntu 14.04.

`Sftp` is a protocol for exchanging files over a secure network connection.
`Chroot` is an isolated environment.

First, let's create a group with users:
```bash
groupadd sftpusers
```

Since `sftp` is a subsystem of ssh so it's settings are located in the `sshd_config` file. It needs to be edited:
```bash
vim /etc/ssh/sshd_config
```

Find and comment-out the line:
```bash
#Subsystem sftp /usr/lib/openssh/sftp-server
```

Add a line right below it:
```bash
Subsystem sftp internal-sftp
```

Add the following to the end of the document:
```bash
Match Group sftpusers
        X11Forwarding no
        AllowTcpForwarding no
        ChrootDirectory %h
        ForceCommand internal-sftp
        PasswordAuthentication yes
```

Restart the ssh daemon for the changes to take effect:
```bash
initctl restart ssh
```

Now you can create a user:
```bash
useradd -g sftpusers -d /home/**username** -m -s /bin/false **username**
```

Actually, the `/bin/false` shell is missing from `/etc/shells` but that doesn't cause problems with sftp login. You can addd it if you want but it will not change much:
```bash
echo `/bin/false` >> /etc/shells
```

An important step is to change the owner of the user's folder. Users cannot write to their home directories:
```bash
chown root:root /home/**username**
```

If you need to create a folder with write access:
```bash
mkdir /home/**username**/upload
chown **username**:sftpusers /home/**username**/upload
```