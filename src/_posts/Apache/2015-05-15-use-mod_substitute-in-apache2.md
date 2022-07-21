---
id: 2586
title: Use mod_substitute in Apache
date: 2015-05-15T14:48:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=2586
permalink: /use-mod_substitute-in-apache2/
image: /wp-content/uploads/2015/05/SearchReplaceSheet.png
categories:
  - Apache
tags:
  -mod_substitute
---
The essence [mod_substitute](http://httpd.apache.org/docs/2.4/mod/mod_substitute.html) is to replace the text in the body of the response from the web server. With it you can change for example links to one domain with links to another domain without interfering with the site code.

You can check if the module is loaded like this:
```bash
/usr/sbin/apachectl -t -D DUMP_MODULES 2>&1|grep subst
```

Or make sure the following line is present and not commented out in the httpd.conf file:
```bash
LoadModule substitute_module modules/mod_substitute.so
```

Let's say you have a website with the domain name `mysite.com`. You need to make the site `dev.mysite.com` out of it, but there are links to the `mysite.com` hardcoded in the database and website files.

There is an option to update the database and files but you can go the path of least resistance and add the following construction to [.htaccess](http://www.tech-notes.net/htaccess-notes/" title="Cheat sheet for .htaccess):

```bash
AddOutputFilterByType SUBSTITUTE text/html
Substitute "s|mysite.com|dev.mysite.com|in"
Substitute "s|www.mysite.com|dev.mysite.com|in"
```
The first line indicates the type of files that will be replaced. 

If you also have customized scripts, make the server process them including:
```bash
AddOutputFilterByType SUBSTITUTE text/javascript
```


In case of problems, check [Apache site settings](/configure-vhosts-apache2/). Pay attention to:
```bash
AllowOverride All
```

`Substitute` is sensitive to the `Accept-Ranges` header. In case of problems try adding the following to the `Substitute` construct in your `.htaccess` file:
```bash
Header set Accept-Ranges "none"
```