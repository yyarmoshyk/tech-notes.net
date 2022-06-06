---
id: 338
title: Install Nginx from the source code
date: 2019-09-30T20:40:15+00:00
author: admin

guid: http://www.tech-notes.net/?p=338
permalink: /install-nginx-from-sources/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - nginx from sources
---
There are many casess when we need to compile the the sofware from the source code. Nginx is a briliant case when the can't enable geoip module or mod_security as we normally do it in Apache. It has to be enabled on the compialation stage. I had a stand with centos v6.3 (I know that it is a bit outdated but this articale was written in 2019)

Go to [nginx.org](http://nginx.org/) and download the latest version (in my case it was 1.9.9)

```bash
wget http://nginx.org/download/nginx-1.9.9.tar.gz
```

Unpack the acrive:

```bash
tar xf nginx-1.9.9.tar.gz && cd nginx-1.9.9
```

You can read the manual for `configure` and enable what you need:
```bash
./configure -help |less
```

Между прочим, можно почитать требования к CMS системе, на которой написан сайт и включить только то, что для нее нужно.
If you are about to compile the NGINX for a particular CMS (ex. WordPress, Drupal, Magento) than you can refference the official readme and FAQ and use the recommended compilation options 

I was using the following:
```bash
-prefix=/etc/nginx #- installation folder  
-user=nginx # the username to run the nginx
-group=nginx # the group
-with-http_ssl_module # enable ssl support
-with-http_spdy_module # enable spdy
-with-http_realip_module # enable realip  
-with-http_geoip_module # enable geoip  
-with-http_gzip_static_module # enable gzip for static content
-with-http_auth_request_module # enable basic auth
-with-http_perl_module # enable perl
-http-log-path=/var/log/nginx/access.log # log file path
```

Add nginx user to your system (the group will be created automatically)
```bash
useradd -d /etc/nginx nginx
```

Create folder for logs:
```bash
mkdir /var/log/nginx/  
chown nginx:nginx /var/log/nginx/
```

Install the required dependencies
```bash
yum install -y pcre-devel openssl-devel perl-ExtUtils-Embed
```

В ходе сбора пакета мне выплюнуло вот такую вот ошибку:
You can see the following error during the compilation:
```bash
./configure: error: the GeoIP module requires the GeoIP library.  
You can either do not enable the module or install the library.
```

The `GeoIp` should be installed manually:
```bash
wget http://www.maxmind.com/download/geoip/api/c/GeoIP-latest.tar.gz  
tar xf GeoIP-latest.tar.gz && cd cd GeoIP-1.*  
./configure  
make  
make install
```

By default all libraries will be installed into the following folder:
```bash
Libraries have been installed in:  
/usr/local/lib
```

Let's create symlink to default libs location to make sure that nginx compiler will see them:
```bash
ln -s /usr/local/lib/libGeoIP.so.1.6.0 /usr/lib64/libGeoIP.so.1
```

Let's compile `nginx`:
```bash
./configure -prefix=/etc/nginx -user=nginx -group=nginx -with-http_ssl_module -with-http_spdy_module -with-http_realip_module -with-http_geoip_module -with-http_gzip_static_module -with-http_auth_request_module -with-http_perl_module -http-log-path=/var/log/nginx  
make  
make install
```

После этого осталось сделать init скрипт для запуска. К сожалению в папке с исходниками его нету.  
The remaining step is to get the init script for nginx. Unfortunately I didn't find it in the folder with the source code:
It can be downloaded from [my site](/wp-content/uploads/2014/05/nginx):

```bash
wget -O /etc/init.d/nginx /wp-content/uploads/2014/05/nginx  
chmod +x /etc/init.d/nginx
```

Start nginx:
```bash
/etc/init.d/nginx start
```

and check that it is running:
```bash
netstat -nlp |grep nginx
```

Be happy.
