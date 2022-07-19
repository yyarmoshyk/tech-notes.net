---
id: 1240
title: Configuring Basic Authentication in Nginx
date: 2014-07-15T13:34:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=1240
permalink: /basic-auth-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - nginx
  - Security
---
I will consider an example of setting up basic authorization in Nginx for a WordPress site. I need the authorization window to pop up for the following pages:
* http://www.tech-notes.net/wp-admin
* http://www.tech-notes.net/wp-login.php

To do this, you first need to install apache2-utils. Linux Ubuntu installed on the server:
```bash
apt-get install apache2-utils
```

In the case of CentOS:
```bash
yum install httpd-tools
```

This set of utilities is needed to generate a file with a password and username. I created a folder to store files like this:
```bash
mkdir /etc/nginx/auth
```

Next we generate the password itself:
```bash
htpasswd -cmb /etc/nginx/auth/.htpasswd **user password**
```

Change the **user** and **password** values ​​to the desired username and password.

Next, edit the nginx virtual host configuration file with the following lines:
```bash
location /wp-admin {
  auth_basic "Restricted";
  auth_basic_user_file /etc/nginx/auth/.ht.passwd_wpadmin;
}

location /wp-login\.php {
  auth_basic "Restricted";
  auth_basic_user_file /etc/nginx/auth/.ht.passwd_wpadmin;
}
```