---
id: 2390
title: Configure Apache for Python 3.4 on CentOS 6.5
date: 2015-02-06T15:19:59+00:00
author: admin

guid: http://www.tech-notes.net/?p=2390
permalink: /configure-apache-wscgi-for-python3-4-centos-6-5/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
tags:
  - wscgi
---
To install the latest version of Python 3.4 on CentOS 6.5, you can [use the previous article](http://www.tech-notes.net/install-python-centos6-5/).

In order to work with python 3.4 the apache web server requires the `wsgi module`. If you have two pythons in your system (2.7 and 3.4) then this module needs to be built from sources. I assume that the site needs the latest version of Python to work.

Install the required packages:
```bash
yum install httpd-devel -y
```

Create the necessary symlinks:
```bash
ln -s /usr/local/lib/libpython3.so /usr/lib64/libpython3.4.so
ln -s /usr/local/lib/libpython3.4m.so.1.0 /usr/lib64/libpython3.4m.so.1.0
cp /usr/local/lib/libpython3.4m.so /usr/lib/
```

<center>
  <div id="gads">
  </div>
</center>

Download, configure, install:
```bash
wget https://modwsgi.googlecode.com/files/mod_wsgi-3.4.tar.gz
tar -xf mod_wsgi-3.4.tar.gz
cd mod_wsgi-3.4
./configure -with-python=/usr/local/bin/python3.4
make
make install
```

Everything is installed in a folder
```bash
/usr/lib64/httpd/modules
```

It is left to enable the module.
```bash
echo 'LoadModule wsgi_module modules/mod_wsgi.so' >> /etc/httpd/conf.d/wsgi.conf
```

create a config file for Django:
```bash
nano /etc/httpd/conf.d/django.conf
```

We bring it to the following form:
```bash
WSGIPythonPath /var/www/website

<VirtualHost *:80>
ServerName website.com

WSGIScriptAlias ​​/ /var/www/website/website/wsgi.py
<Directory /var/www/website/>
  <Files wsgi.py>
    Order deny, allow
    Allow from all
  </Files>
</Directory>
</VirtualHost>
```


If you have several projects in different directories:
```bash
WSGIPythonPath /var/www/website:/var/www/website2:/var/www/website3
```


The `wsgi.py` file must be executable:
```bash
chmod +x /var/www/website/website/wsgi.py
```

You need to make sure that Apache is working:
```bash
apachectl -t
```

Restart it if all is well:
```bash
/etc/init.d/httpd restart
```

There might be problems related to selinux:
```bash
setenforce 0
```

Edit the file `/etc/selinux/config` and set:
```bash
SELINUX=disabled
```