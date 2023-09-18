---
id: 1865
title: Virtual users in Pure-Ftp
date: 2014-10-08T14:43:23+00:00
author: admin

canonical_url: 'https://www.tech-notes.net/pure-ftpd-virtual-users/'

permalink: /pure-ftpd-virtual-users/
image: /wp-content/uploads/2014/10/pure-ftpd-logo.png
categories:
   - FTP
tags:
   - Pure-Ftp
---
I would like to describe the way how to use virtual users in `pure-ftpd`.

I assume that you have Pure-Ftp installed. If not, run the following command:
```bash
apt-get install pure-ftpd-common pure-ftpd
```

or
```bash
yum install pure-ftpd
```

You need to edit the configuration file (`/etc/pure-ftpd/pure-ftpd.conf`) and make sure that the following parameters are not commented out and are set properly:
```bash
ChrootEveryone yes
PureDB /etc/pure-ftpd/pureftpd.pdb
PAMAuthentication yes
PassivePortRange 30000 50000
```

Virtual users are being added with the following command:
```bash
pure-pw useradd **username** -u **ftpuser** -d /home/ftpusers/username
```

From this point on I would like to describe it in more detail. In the example I gave, the virtual user **username** will have access to the files and folders that the user **ftpuser** has access to. This turns out to be an alias for the user **ftpuser**. Instead of **ftpuser**, you can use other usernames and specify the home directory accordingly.

For example, there is a user `techuser` on the system, his home directory is `/home/techuser`. There is some folder in this directory that we want to share. Let it be `/home/techuser/documents/shared_docs`.

```bash
pure-pw useradd ftptechuser -u techuser -d /home/techuser/documents/shared_docs
```

Another example, which is more practical: you need to organize access to site files that belong to the user `www-data` (`apache`) and are stored in the `/var/www/html` folder. It is necessary that after uploading via FTP, new files belong to the user `www-data` (`apache`).

Create a virtual user like this:
```bash
pure-pw useradd ftpapache -u www-data -d /var/www/html
```

Naturally, no user will be able to connect to the server without a password. Passwords are set like this:

```bash
pure-pw passwd **username**
```

Passwords for virtual users are stored in the file `/etc/pure-ftpd/pureftpd.passwd`

The file is updated with the following command:

```bash
pure-pw mkdb
```

You can view information about a virtual user like this:

```bash
pure-pw show **username**
```

You can see which users exist in the config using:

```bash
pure-pw list
```

In CenoS, be sure to pay attention to the user id to which the virtual user `pure-ftpd` is linked. The value must be greater than 1000. Previously, it was possible to edit `/etc/pure-ftpd/pure-ftpd.conf` and change the `MinUID` and `TrustedGID` values in it from 100 to 48, in the case of the `apache` user.

In the latest versions, `pure-ftpd` refuses to take this pill and persistently continues to produce the following error in `/var/log/messages`:

```bash
[INFO] New connection from 109.123.120.187
[WARNING] Can't login as [user]: account disabled
[INFO] Logout.
```

Run the following command to get the system user id:

```bash
id www-data
```

In the standard version you will get 48. The following mokand combination will help you:

```bash
usermod -u 1021 -p -U www-data
groupmod -g 1021 www-data
sed -i 's/48/1021/g' /etc/pure-ftpd/pureftpd.passwd
pure-pw mkdb
```

In Ununtu/Debian everything is smooth. Just edit the following file with the id of the system user www-data (usually 33):

```bash
/etc/pure-ftpd/conf/MinUID
```

Please note that after such actions, the system user `www-data` will no longer be the owner of the files that belonged to him before.

**Don't forget to update the permissions using the `chown` command**

In Ubuntu I encountered such errors in `/var/log/auth.log`

```bash
pure-ftpd: pam_unix(pure-ftpd:auth): authentication failure; logname= uid=0 euid=0 tty=pure-ftpd ruser=username rhost= user=username
```

and like this in `/var/log/syslog`

```bash
Jun 19 14:48:43 pure-ftpd: (?@1xx.xx.xxx.x7) [INFO] PAM_RHOST enabled. Getting the peer address
Jun 19 14:48:48 pure-ftpd: (?@1xx.xx.xxx.x7) [WARNING] Authentication failed for user
```

The pure-ftpd configuration differs in Ubuntu from CentOS. To make virtual users work, run the following commands:

```bash
sudo echo 'no' > /etc/pure-ftpd/conf/PAMAuthentication
sudo echo 'no' > /etc/pure-ftpd/conf/UnixAuthentication
sudo echo '/etc/pure-ftpd/pureftpd.pdb' > /etc/pure-ftpd/conf/PureDB
sudo ln -s /etc/pure-ftpd/conf/PureDB /etc/pure-ftpd/auth/50pure
```

Don't forget about the ports for passive mode:

```bash
iptables -A INPUT -p tcp -m tcp -sport 1024: -dport 1024: -m conntrack -ctstate ESTABLISHED -j ACCEPT -m comment -comment 'Allow passive inbound connections'
iptables -A OUTPUT -p tcp -m tcp -sport 1024: -dport 1024: -m conntrack -ctstate ESTABLISHED,RELATED -j ACCEPT -m comment -comment 'Allow passive inbound connections'
```

In the case of CentOS 7:

```bash
firewall-cmd -permanent -zone=public -add-service=ftp
firewall-cmd -permanent -add-port=30000-50000/tcp
firewall-cmd -reload
```