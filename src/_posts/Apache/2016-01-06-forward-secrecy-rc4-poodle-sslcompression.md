---
id: 2810
title: Securing Weak Points in Apache SSL Configuration
date: 2016-01-06T13:48:54+00:00
author: yaroslav.yarmoshyk

guid: http://www.tech-notes.net/?p=2810
permalink: /forward-secrecy-rc4-poodle-sslcompression/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Apache
tags:
  - SSL
  - Forward Secrecy
  - Poodle
  - RC4
  - SSLCompression
---
Vulnerabilities are occasionally found in the SSL protocol, which enables encrypted traffic exchange between a server and a client. These vulnerabilities potentially allow malicious actors to decrypt SSL traffic. While there's no need to panic, it's wise to avoid unnecessary risks.

I'm updating this article as new vulnerabilities emerge.

Next, let's talk about what needs to be done and where to do it to protect your server.

First, I recommend using the [SslTest от SslLabs](https://www.ssllabs.com/ssltest) utility to assess how vulnerable your server is.

On my initial run, I observed the following situation:  
[<img src="/wp-content/uploads/2015/08/before_ssl_update.png" alt="before_ssl_update" width="916" height="643" class="aligncenter size-full wp-image-2811" srcset="/wp-content/uploads/2015/08/before_ssl_update.png 916w, /wp-content/uploads/2015/08/before_ssl_update-170x119.png 170w, /wp-content/uploads/2015/08/before_ssl_update-300x211.png 300w" sizes="(max-width: 916px) 100vw, 916px" />](/wp-content/uploads/2015/08/before_ssl_update.png)

Next, open the OpenSSL configuration file for Apache and start editing it:
```bash
vim /etc/httpd/conf.d/ssl.conf
```

## Poodle Vulnerability
To mitigate the `Poodle` vulnerability, you should disable `SSL v3` encryption protocol support. Nowadays, anything other than `TLSv1.1` and `TLSv1.2` is considered vulnerable
```bash
SSLProtocol -ALL +TLSv1.1 +TLSv1.2
```

## Enabling Forward Secrecy
Enable `Forward Secrecy` by prioritizing the `kEDH` cipher. The `RC4` cipher has been considered weak for quite some time and should be turned off. It's also not recommended to use `Diffie-Hellman`:

```bash
SSLHonorCipherOrder on  
SSLCipherSuite kEDH:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:EECDH+ECDSA+AESGCM:EECDH+aRSA+AESGCM:EECDH+ECDSA+SHA384:EECDH+ECDSA+SHA256:EECDH+aRSA+SHA384:EECDH+aRSA+SHA256:EECDH+AESGCM:EECDH:EDH+AESGCM:EDH+aRSA:HIGH:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!DHE-RSA-SEED-SHA:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA:!DH+3DES:!DHE-RSA-AES256-GCM-SHA384:!DHE-RSA-AES256-SHA256:!DHE-RSA-AES256-SHA:!DHE-RSA-CAMELLIA256-SHA:!DHE-RSA-DES-CBC3-SHA:!DHE-RSA-AES128-GCM-SHA256:!DHE-RSA-AES128-SHA256:!DHE-RSA-AES128-SHA:!DHE-RSA-CAMELLIA128-SHA:!RC4
```

## CRIME: Attack SSL/TLS  
Honestly, I have a weak understanding of how SSL data compression works, but it's believed that an attacker can inject malicious code into a packet before it's compressed and sent to the client. That's why data compression should be disabled. On modern systems, you can achieve this by adding the following line to the configuration:
```bash
SSLCompression off
```
However, if you're running `apache 2.2` and an older version of `OpenSSL`, you'll encounter the following error when you restart apache:
```bash
Invalid command 'SSLCompression', perhaps misspelled or defined by a module not included in the server configuration
```
For Linux systems in the RedHat family, you need to edit the `/etc/sysconfig/httpd` file with the following line:
```bash
export OPENSSL_NO_DEFAULT_ZLIB=1
```

You can now restart Apache and return to the [SslTest от SslLabs](https://www.ssllabs.com/ssltest)

```bash
service httpd restart
```

Upon retesting, you should see a pleasing green result:  
[<img src="/wp-content/uploads/2015/08/after_ssl_update.png" alt="after_ssl_update" width="899" height="510" class="aligncenter size-full wp-image-2812" srcset="/wp-content/uploads/2015/08/after_ssl_update.png 899w, /wp-content/uploads/2015/08/after_ssl_update-170x96.png 170w, /wp-content/uploads/2015/08/after_ssl_update-300x170.png 300w" sizes="(max-width: 899px) 100vw, 899px" />](/wp-content/uploads/2015/08/after_ssl_update.png)

References:  
* [ivoras.net/perfect-forward-secrecy-pfs.html](http://ivoras.net/blog/tree/2013-10-21.apache-2.2-and-perfect-forward-secrecy-pfs.html)
* [serverfault.com/disable-sslcompression-on-apache](http://serverfault.com/questions/455450/how-to-disable-sslcompression-on-apache-httpd-2-2-15-defense-against-crime-bea)
