---
id: 1022
title: Configure website in Apache2
date: 2014-06-09T13:04:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=1022
permalink: /configure-vhosts-apache2/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
---
The following example contains the `Apache2` server configuration file for the `tech-notes.net` site:

```bash
<VirtualHost *:80>
  ServerName tech-notes.net
  ServerAlias ​​www.tech-notes.net
  DocumentRoot /var/www/tech-notes

  LogLevel warn
  ErrorLog /var/log/httpd/tech-notes_error.log
  CustomLog /var/log/httpd/tech-notes_access.log combined

  <Directory /var/www/tech-notes>
    Options +ExecCGI Indexes FollowSymLinks MultiViews
    AllowOverride All
    order allow,deny
    allow from all
  </Directory>
</VirtualHost>
```


Explanations:
* **ServerName** - site domain name.
* **ServerAlias** - site alias. You can specify multiple
* **DocumentRoot** - root folder where site files are located
* **LogLevel** - determines the number of messages that will be written to the log file Available values: `debug, info, notice, warn, error, crit, alert, emerg.`
In the case of using debug log the file will contain the largest number of entries with information about requests, emerg - the smallest number of entries/information.
* **ErrorLog** - path to error log. If not specified, all errors will be logged to a standard file (`/var/log/httpd/error_log` or `/var/log/apache2/error.log`).
* **CustomLog** - log on demand. It takes two arguments - the path to the file and the log type (in the example, combined - can be used for visit statistics)

From the start, the following log file formats are declared in the Apache config:

```bash
LogFormat "%v:%p %h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" vhost_combined
LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
LogFormat "%h %l %u %t \"%r\" %>s %O" common
LogFormat "%{Referer}i -> %U" referer
LogFormat "%{User-agent}i" agent
```


You can create your own.

Between the **<Directory>** and **</Directory>** tags, you can specify parameters specific to a particular directory (in the example - /var/www/tech-notes)
* **Options** - options. The `+` sign - turns on forcibly, `-` turns off:
* **ExecCGI** - Allows execution of `cgi` scripts. Must be enabled if php is running in cgi mode.
* **Indexes** - gives additional options for catalog indexing (not to be confused with indexing by search engines).
* **FollowSymLinks** - Enables support for `symbolic links` in the directory.
* **MultiViews** is an optional parameter. Its quirk is that if a request comes in for the `/some/dir/foo` directory, and `MultiViews` is enabled for `/some/dir`, and the directory `/some/dir/foo` does not exist, then the server will look for files named `foo.*` in the directory `/some/dir/`.

Using the `Alias` directive, you can connect a directory to the site that is not in the site's home directory. For example `phpmyadmin`:
```bash
Alias ​​/phpmyadmin /usr/share/phpmyadmin
```

If this line is present in the host config, then when you open http://www.tech-notes.net/phpmyadmin, you would get into the database management interface.

This is an example of `https/ssl` host settings on a `CentOS` server:
```bash
<VirtualHost *:443>
	ServerName tech-notes.net
	ServerAlias ​​www.tech-notes.net
	DocumentRoot /var/www/tech-notes

	SSL Engine on
	SSLCertificateKeyFile /etc/ssl/private/tech-notes.key
	SSLCertificateFile /etc/ssl/certs/tech-notes.crt
	SSLCACertificateFile /etc/ssl/private/ca-bundle.crt

	LogLevel warn
	ErrorLog /var/log/httpd/tech-notes_ssl_error.log
	CustomLog /var/log/httpd/tech-notes_ssl_access.log combined

	<Directory /var/www/tech-notes>
		Options +ExecCGI Indexes FollowSymLinks MultiViews
		AllowOverride All
		order allow,deny
		allow from all
	</Directory>
</VirtualHost>
```


In case of Debian/Ubuntu the host's ssl settings are recommended to be placed between the tags `<IfModule mod_ssl.c>` and `</IfModule>`

If you have several sites spinning on the same ip address, you need to add the following to `ports.conf` or `httpd.conf` (`apache2.conf`):

```bash
NameVirtualHost *:80
NameVirtualHost *:443
```