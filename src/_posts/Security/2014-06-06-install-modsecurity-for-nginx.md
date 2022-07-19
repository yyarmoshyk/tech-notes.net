---
id: 559
title: Install modsecurity for Nginx
date: 2014-06-06T16:06:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=559
permalink: /install-modsecurity-for-nginx/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - nginx
  - Security
tags:
  - ModSecurity
---
``ModSecurity`` is a kind of firewall for `Apache`, `Nginx` and `IIS`. This is a module that provides a set of rules for filtering traffic. This is a must have module for any server.

On December 19, 2013 version 2.7.7 was released. It is the most current at the time of this writing. We will collect from source and configure `Nginx` for the web server.

On October 6, 2019, a newer version is available - 2.9.3. Without checking it for performance I will not update the article.

Oddly enough you first need to compile mod_security itself and then include it when compiling `Nginx`.
Unfortunately mod_security cannot be connected to an already installed Nginx server. **Nginx must be compiled with this module.**

Install what we need:
```bash
yum install libxml2 libxml2-devel httpd-devel libcurl-devel pcre-devel
```

When installing anything from source I create the /root/install folder and work in it:
```bash
mkdir /root/install
cd /root/install
```

Download the archive with mod_security source code:
```bash
wget https://www.modsecurity.org/tarball/2.7.7/modsecurity-apache_2.7.7.tar.gz
tar xf modsecurity-apache_2.7.7.tar.gz
cd modsecurity-apache_2.7.7
```

Install:
```bash
./configure -enable-standalone-module
make
make install
```

<center>
  <div id="gads">
  </div>
</center>

This step will generate source files that can be used to build nginx. It will be in the folder:
```bash
nginx/modsecurity/
```

Instructions to install `nginx` from source can be found [here](/install-nginx-from-sources/). I hope you are not too lazy and take a look so I do not copy the entire instruction here.

You need to follow all the steps of this note and at the configuration stage (executing ./configure) add this to the line:
```bash
-add-module=/root/install/modsecurity-apache_2.7.7/nginx/modsecurity/
```

For this experiment, I omitted the geo_ip module connection and the resulting Nginx configuration line looked like this:
```bash
./configure -prefix=/etc/nginx -user=nginx -group=nginx -with-http_ssl_module -with-http_spdy_module -with-http_realip_module -with-http_gzip_static_module -with-http_auth_request_module -with-http_perl_module -http-log-path=/ var/log/nginx/ **-add-module=/root/install/modsecurity-apache_2.7.7/nginx/modsecurity**
```

Next, copy the proposed settings file to the nginx folder:
```bash
cp /root/install/modsecurity-apache_2.7.7/modsecurity.conf-recommended /etc/nginx/conf/modsecurity.conf
```

It is included with the following lines in the location description:
```bash
location / {
  ModSecurityEnabled on;
  ModSecurityConfig modsecurity.conf;
  ModSecurityPass @backend;
}
```