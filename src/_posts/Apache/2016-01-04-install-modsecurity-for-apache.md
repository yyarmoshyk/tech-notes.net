---
id: 558
title: Install modsecurity for Apache
date: 2016-01-04T08:28:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=558
permalink: /install-modsecurity-for-apache/
image: /wp-content/uploads/2015/02/mod-security.png
categories:
  - Apache
  - Security
---
`ModSecurity` is a kind of firewall for Apache, Nginx and IIS. This is a module that provides a set of rules for filtering traffic. This is a 'must have' module for any server.

On February 12, 2015 version 2.9.0 was released. It is the most current at the time of this writing.

Even on January 4, 2016, this version is the most current.

We will compile it from source and configure for the Apache web server.

This version requires `libxml2` version `2.6.29` to compile properly. The first step is to make sure it is available for your server OS:
```bash
yum info libxml2
```

Or:
```bash
apt-cache showpkg libxml2
```

If the required package is available for installation than you can continue.

Make sure you have the following packages installed:
**RedHat/Centos:**
```bash
yum install gcc automake libxml2 libxml2-devel httpd-threaded-devel libcurl4-openssl-devel libpcre3-devel
```

**Ubuntu/Debian:**
```bash
apt-get install gcc automake libxml2 libxml2-dev apache2-threaded-dev libcurl-dev pcre-dev
```

I will work in the /usr/local/src folder.
```bash
cd /usr/local/src
```

Download the required archive:
```bash
wget -no-check-certificate https://www.modsecurity.org/tarball/2.9.0/modsecurity-2.9.0.tar.gz
```

Unpack and go to the directory:
```bash
tar xf modsecurity-2.9.0.tar.gz && cd modsecurity*
./configure
make && make install
```

The module will be installed in the `/usr/local/modsecurity/lib` folder. The binaries will be in the `/usr/local/modsecurity/bin` folder.

Next, you need to add the following lines to the Apache configuration file (/etc/httpd/conf/httpd.conf)
```bash
LoadModule security2_module /usr/local/modsecurity/lib/mod_security2.so
```

And uncomment:
```bash
LoadModule unique_id_module modules/mod_unique_id.so
```

Next, we take the recommended module configuration and copy it to the Apache conf.d folder:
```bash
cp modsecurity.conf-recommended /etc/httpd/conf.d/modsecurity.conf
```

You can open this file and edit the path to the audit log - SecAuditLog.

When checking the configuration, it may give the following error:

```bash
Syntax error on line 212 of /etc/httpd/conf.d/modsecurity.conf:
Could not open unicode map file `/etc/httpd/conf.d/unicode.mapping`: No such file or directory
```

To fix, copy the desired file:
```bash
cp unicode.mapping /etc/httpd/conf.d/
```

That's all. Installation completed. Even with the basic set of parameters, the server began to breathe more freely.

To hide the Apache version, disable the Trace method, you can add the following lines to `/etc/httpd/conf.d/modsecurity.conf`:
```bash
ServerSignature Off
ServerTokensProd
Trace Enable Off
```

More information about all configuration options can be found [here](https://github.com/SpiderLabs/ModSecurity/wiki/Reference-Manual#wiki-Configuration_Directives)

Because mod_security is a firewall, there are rulesets for it that need to be enabled in order for mod_security to be useful.

The list of free rules is available on [GitHub](https://github.com/SpiderLabs/owasp-modsecurity-crs):

We download and unpack it:
```bash
wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/master.zip
unzip master.zip
```

We create a folder in which we will add the configs for the rules that we need to enable and copy the sets of rules we need:
```bash
mkdir /etc/modsecurity/activated_rules
cp owasp-modsecurity-crs-master/base_rules/* /etc/modsecurity/activated_rules/
```

The following rule sets have done more harm than good, so it's best to turn them off:
```bash
rm /etc/modsecurity/activated_rules/modsecurity_crs_35_bad_robots.conf
rm /etc/modsecurity/activated_rules/modsecurity_crs_41_sql_injection_attacks.conf
rm /etc/modsecurity/activated_rules/modsecurity_crs_21_protocol_anomalies.conf
```

The following folder deserves additional attention, as it contains recommended rules for popular CMS systems:
```bash
owasp-modsecurity-crs-master/slr_rules
```

Copy the files you need with the extensions `.conf` and `.data` to the folder `/etc/modsecurity/activated_rules/`

Edit the `/etc/httpd/conf.d/modsecurity.conf` file with the following line to make it work:
```bash
Include /etc/modsecurity/activated_rules/*.conf
```