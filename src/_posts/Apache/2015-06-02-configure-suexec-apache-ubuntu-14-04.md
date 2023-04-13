---
id: 2655
title: Configure suexec for Apache2 on Ubuntu 14.04
date: 2015-06-02T13:43:04+00:00
author: admin

guid: http://www.tech-notes.net/?p=2655
permalink: /configure-suexec-apache-ubuntu-14-04/
image: /wp-content/uploads/2015/06/Fastcgi.jpg
categories:
  - Apache
tags:
  - Ubuntu
  - Apache2
  - cgi
  - php-cgi
  - suexec
---
The `suexec` mechanism allows you to execute `CGI` scripts on behalf of different system users. In this article, I'll walk through an example of setting up suexec based on Linux Ubuntu 14.04.
<!--more-->

It is very convenient to use `suexec` if you have multiple websites on the single server and you use [sftp isolation]((/configure-sftp-chroot-on-ubuntu-14-04/)) to access the files. 
With `suexec` you'll never see the problems with the file owner/permissions mismatch

Install the required software:
```bash
apt-get install php5-cgi libapache2-mod-fcgid apache2-suexec apache2-suexec-custom -y
```

Enable `apache2` modules
```bash
a2enmod fcgid  
a2enmod suexec
```

Now we need to identify `php` files as `cgi` scripts to be executed by the `fcgid` module
There are multiple options to enable this
1. Updarte global `fcgid.conf`
1. Update configuration files of every website

The second option:
```bash
nano /etc/apache2/sites-enabled/**sitename.conf**
```

Update the website configuration with the following:
```bash
<IfModule mod_mime.c>
  AddHandler     fcgid-script .php
  FCGIWrapper /usr/bin/php5-cgi .php
</IfModule>
```

Next we need to specify the name of the user and group that should be used by suexec to work with the website files (additionally I use separate php.ini for every website on this server):
```bash
<IfModule mod_suexec.c>
  FcgidInitialEnv PP_CUSTOM_PHP_INI /etc/php_conf.d/websitename_php.ini
  SuexecUserGroup "<strong>systemuser</strong>" "<strong>systemgroup</strong>"
</IfModule>
```

The remaining configuration is unchanged.

Restart `apache` daemon to apply the changes
```bash
service apache2 restart
```

Allow listing for the website folder:
```bash
chmod +x /var/www/**sitename.conf**
```

Add executable permission to all php files in the website folder:
```bash
find /var/www/**sitename.conf** -type f -name `*.php` -exec chmod +x {} \;
```
