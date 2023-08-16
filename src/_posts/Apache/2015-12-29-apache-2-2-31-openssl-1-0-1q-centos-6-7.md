---
id: 3042
title: Upgrading Apache 2.2.31 OpenSSL 1.0.1q on CentOS 6.7
date: 2015-12-29T09:05:45+00:00
author: yaroslav.yarmoshyk

guid: http://www.tech-notes.net/?p=3042
permalink: /apache-2-2-31-openssl-1-0-1q-centos-6-7/
image: /wp-content/uploads/2015/12/apache-ssl-logo.jpg
categories:
  - Apache
tags:
  - SSL
  - Apache
  - centos
  - openssl
---
In recent times, I've increasingly encountered the need to update OpenSSL to its latest version on servers. Unfortunately, so much relies on the OpenSSL libraries within the server that replacing them entirely isn't feasible – or if attempted, it could yield disastrous results. I once managed to compile an RPM package of `OpenSSL 1.0.1n` for CentOS 6.5, successfully replacing `OpenSSL 1.0.1e`. However, post-replacement, both Apache and MySQL daemons stopped working. They continued to search for libraries from `OpenSSL 1.0.1e` and couldn't recognize 1.0.1n.

Recently, the issue caught up with me, and I decided to find a solution to this problem.

As it turns out, clarity often comes when cigarettes are set aside. A non-smoking version of myself realized that there was no need to completely replace the system OpenSSL libraries. Instead, I could compile the latest OpenSSL version using source code, while leaving the system OpenSSL in place. From this base, I could create an Apache module. Fortunately (though I was unhappy at the time), the client also required the latest version of Apache 2.2, which wasn't available in CentOS 6.7 repositories.

To begin, let's install a couple of packages:
```bash
yum install gcc make zlib-devel wget
```

Next, I'll work in the `/usr/local/src` folder, though you can choose any location you prefer.

## Starting with OpenSSL.

At the time of writing this article, the replacement for `1.0.1e` was `1.0.1q`. Let's download it
```bash
wget https://www.openssl.org/source/openssl-1.0.1q.tar.gz
```

Compiling is straightforward. The key is to remember to create a shared library:
```bash
./config -prefix=/opt/openssl -openssldir=/opt/openssl/openssl -shared  
make  
make install
```

After this, all components will reside in the `/opt/openssl` directory.

Some people prefer using the prefix `/usr/local`. In that case, after compilation, files will be located in the following folders:
* /usr/local/bin
* /usr/local/include
* /usr/local/lib
* /usr/local/openssl

You can compile any other OpenSSL package similarly.

For ease of use, you can symlink the binary to a folder within the $PATH environment variable
```bash
ln -s /opt/openssl/bin/openssl /usr/bin/openssl101q
```

To ensure proper functionality, OpenSSL requires the Perl module `WWW::Curl::Easy`:
```bash
yum install perl-WWW-Curl.x86_64
```

## Apache
The Apache version is not critical. I needed the latest version from the 2.2 branch.

Download and extract it:

```bash
wget http://ftp.ps.pl/pub/apache/httpd/httpd-2.2.31.tar.gz  
tar xf httpd-2.2.31.tar.gz  
cd httpd-2.2.31
```

The minimal set of options for the configure script will be:
```bash
./configure -prefix=/opt/httpd2 -with-included-apr **-enable-ssl=shared -with-ssl=/opt/openssl -enable-ssl-staticlib-deps**
```

The full set of modules can be compiled using the following combination of configure options. Each module will be represented as a separate `.so` file:
```bash
./configure -prefix=/opt/httpd2 -enable-ssl=shared -with-ssl=/opt/openssl -enable-ssl-staticlib-deps=shared -enable-mods-static=ssl=shared -enable-exception-hook=shared -enable-maintainer-mode=shared -enable-pie=shared -enable-authn-dbm=shared -enable-authn-anon=shared -enable-authn-dbd=shared -enable-authn-alias=shared -enable-isapi=shared -enable-file-cache=shared -enable-cache=shared -enable-disk-cache=shared -enable-mem-cache=shared -enable-dbd=shared -enable-reqtimeout=shared -enable-ext-filter=shared -enable-substitute=shared -enable-charset-lite=shared -enable-deflate=shared -enable-log-forensic=shared -enable-logio=shared -enable-mime-magic=shared -enable-cern-meta=shared -enable-expires=shared -enable-headers=shared -enable-ident=shared -enable-usertrack=shared -enable-unique-id=shared -enable-proxy=shared -enable-proxy-connect=shared -enable-proxy-http=shared -enable-proxy-scgi=shared -enable-proxy-ajp=shared -enable-proxy-balancer=shared -enable-optional-hook-export=shared -enable-optional-hook-import=shared -enable-optional-fn-import=shared -enable-optional-fn-export=shared -enable-dav=shared -enable-info=shared -enable-suexec=shared -enable-cgi=shared -enable-cgid=shared -enable-dav-fs=shared -enable-dav-lock=shared -enable-vhost-alias=shared -enable-imagemap=shared -enable-speling=shared -enable-rewrite=shared -enable-so -enable-http
```

If you encounter the following error, it means `zlib-devel` is missing in the system:
```bash
mod_deflate... configure: error: mod_deflate has been requested but can not be built due to prerequisite failures
```

The finishing touch:
```bash
make  
make install
```

Once compilation is complete, files will be in the `/opt/httpd2` directory. To finalize, create an init script and add the service to auto-start.
```bash
wget -O /etc/init.d/httpd2 /wp-content/uploads/2015/12/httpd2  
chmod +x /etc/init.d/httpd2  
chkconfig httpd2 on
```

During the build, necessary libraries were not copied to the Apache folder, causing the daemon to fail to start. Execute the following:
```bash
ln -s /opt/openssl/lib/libcrypto.so.1.0.0 /opt/httpd2/lib/  
ln -s /opt/openssl/lib/libssl.so.1.0.0 /opt/httpd2/lib/
```

Now, let's start it
```bash
/etc/init.d/httpd2 start
```

Link `apachectl`:
```bash
ln -s /opt/httpd2/bin/apachectl /usr/sbin/apachectl2
```

You can use the `telnet` utility for verification. While in the server console, run
```bash
telnet localhost 80
```

Once you receive the greeting from the `Apache` server, execute:

```bash
HEAD / HTTP/1.0
```

By default, Apache is configured to display all headers, so you should see the following in response:  
<img src="/wp-content/uploads/2015/12/apach-openssl.png" alt="apach-openssl" width="548" height="225" class="aligncenter size-full wp-image-3053" srcset="/wp-content/uploads/2015/12/apach-openssl.png 548w, /wp-content/uploads/2015/12/apach-openssl-170x70.png 170w, /wp-content/uploads/2015/12/apach-openssl-300x123.png 300w" sizes="(max-width: 548px) 100vw, 548px" />

## Conclusion

Following this, you can update both `Apache` and `OpenSSL` effortlessly as new versions are released.

The following articles can be useful:
  * [Securing Weak Points in SSL Apache Settings](/forward-secrecy-rc4-poodle-sslcompression/)
  * [Compiling PHP from Source](/compile-php-5-5-10-from-sources/)
  * [Installing mod_security for Apache](/install-modsecurity-for-apache/)
  * [Installing mod_geoip](/mod_geoip-from-sources-apache/)
  * [Creating a Secure Web Server](/create-secure-web-server/)

The following resources were used in writing the article:  
* [blog.ivanristic.com](http://blog.ivanristic.com/2013/08/compiling-apache-with-static-openssl.html)
* [dan.drydog.com](http://dan.drydog.com/apache2php.html)
