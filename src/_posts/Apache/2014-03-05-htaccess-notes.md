---
id: 73
title: .htaccess tips and tricks
date: 2014-03-05T20:59:58+00:00
author: admin

guid: http://wp38.local/?p=73
permalink: /htaccess-notes/
attitude_sidebarlayout:
  - default
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2013/09/person-typing2.jpg
categories:
  - Apache
tags:
  - .htaccess
  - RewriteCond
  - rewriterule
---
I'd like to present a set of interesting and not very features of `.htaccess` files and what can be done with them. Most of what is described here falls into the `must have` category.

Rewrite rule tester: [htaccess.madewithlove.be](http://htaccess.madewithlove.be/)
To test regular expressions you can use [www.regex101.com](https://www.regex101.com/)
Another rewrite rule tester: [martinmelin.se/rewrite-rule-tester/](http://martinmelin.se/rewrite-rule-tester/)

**1. Basic Authorization:**
It happens that you need to close a website or some part of it from visitors. This can be done using the following construction in the `.htaccess` file in the correct directory:
```bash
Order allow,deny  
AuthType Basic  
AuthUserFile /var/www/html/.htpasswd  
AuthGroupFile /dev/null  
AuthName `Enter username/password`  
Require valid-user  
Satisfy any  
Deny from all
```

**2. Remove www from the domain URL** (redirect to non-www domain):

```bash
RewriteEngine On  
RewriteCond %{HTTP_HOST} !^your-site.com$ [NC]  
RewriteRule ^(.*)$ http://your-site.com/$1 [L,R=301]
```

**3. Add www to the website address** (redirect to www website address):

```bash
RewriteEngine On  
RewriteCond %{HTTP_HOST} !^www.your-site.com$ [NC]  
RewriteRule ^(.*)$ http://www.your-site.com/$1 [L,R=301]
```

**4. Redirect from http to https:**

```bash
RewriteEngine On  
RewriteCond %{HTTPS} !on [OR]  
RewriteCond %{SERVER_PORT} ^80$  
RewriteRule ^(.*)$ https://%{SERVER_NAME}/$1 [L]
```

you can use one of the RewriteCond's.

<center>
  <div id="gads">
  </div>
</center>

**5. Prevent hotlinking** 
If someone uses a resource or object from your site then the traffic is generated for someone else's profit. 
If this bothers you - prohibit the use of your content with the following lines in the .htaccess file:
```bash
RewriteEngine On  
#Replace ?mysite\.com/ with your blog url  
RewriteCond %{HTTP_REFERER} !(.\*)?your-site\.com(.\*) [NC]  
# Don't forget to exclude traffic for search engines  
RewriteCond %{HTTP_REFERER} !(.\*)(google|bing|ask.com|duckduckgo|yahoo|lycos|dogpile|search)(.\*) [NC]  
RewriteCond %{HTTP_REFERER} !^$  
#Replace /images/nohotlink.jpg with your `don't hotlink` image url  
RewriteRule .*\.(jpe?g|gif|bmp|png|other extensions)$ /images/nohotlink.jpg [L]
```

You can create different files (jpg/txt/html) with the message: `I'm stealing someone else's content` and add RewriteRule's for each type of file.

**6. Block visitors coming from a specific domain with .htaccess:**

```bash
RewriteEngine on  
RewriteCond %{HTTP_REFERER} bannedurl1.com [NC,OR]  
RewriteCond %{HTTP_REFERER} bannedurl2.com [NC,OR]  
RewriteRule .* - [F]
```

**7. Re-define error pages in .htaccess:**

```bash
ErrorDocument 400 /error/HTTP_BAD_REQUEST.html  
ErrorDocument 404 /error/HTTP_NOT_FOUND.html  
ErrorDocument 500 /error/HTTP_INTERNAL_SERVER_ERROR.html  
ErrorDocument 503 /error/HTTP_SERVICE_UNAVAILABLE.html
```

**8. Hide file extensions over .htaccess:**  
This information may be useful only to you and your developers. Ordinary mortals have no reason to see file extensions on your site:
```bash
RewriteEngine on  
RewriteCond %{REQUEST_FILENAME} !-d  
RewriteCond %{REQUEST_FILENAME} \.custom_ext -f  
RewriteRule ^(.*)$ $1.custom_ext
```

`custom_ext` can be changes to whatever you'd like.

<center>
  <div id="gads">
  </div>
</center>

**9. Disable directory listing**

```bash
#Off:  
Options -Indexes
```

```bash
#On:  
Options +Indexes
```

By the way, options such as `ExecCgi` and `FollowSymLinks` can also be included in .htaccess. Respectively:
```bash
#On:  
Options Indexes ExecCgi FollowSymLinks
```

**10. File compression in .htaccess**

```bash
AddOutputFilterByType DEFLATE text/html text/plain text/xml application/xml application/xhtml+xml  
text/javascript text/css application/x-javascript  
BrowserMatch ^Mozilla/4 gzip-only-text/html  
BrowserMatch ^Mozilla/4.0[678] no-gzip  
BrowserMatch bMSIE !no-gzip !gzip-only-text/html
```

**11. Set encoding for certain files using .htaccess**

```bash
<FilesMatch `\.(htm|html|css|js)$`>  
AddDefaultCharset UTF-8  
</FilesMatch>
```

**12. Client side file caching**  
Your visitors do not need to request all the media content each time they navigate through the pages of your site. This content can be stored on the client side in temporary storage. You can force the browsers of your visitors to keep these files with the following construction in `.htaccess`:
```bash
<FilesMatch `.(flv|gif|jpg|jpeg|png|ico|swf|js|css|pdf)$`>  
Header set Cache-Control `max-age=2592000`  
</FilesMatch>
```

`max-age` is being specified in seconds.

**13. Restrict certain browsers (UserAgents)**  
You looked at the site access logs and saw a strange influx of requests using some incomprehensible UserAgent. Be sure you are being parsed, robbed or stupidly put down the site, increasing the load. You can deny access to the site based on information about the `UserAgent`:
```bash
RewriteEngine On  
RewriteBase /  
SetEnvIfNoCase Referer `^$` bad_user  
SetEnvIfNoCase User-Agent `^badbot1` bad_user  
SetEnvIfNoCase User-Agent `^badbot2` bad_user  
SetEnvIfNoCase User-Agent `^badbot3` bad_user

Order allow,deny  
Deny from env=bad_user
```

**14. File download enforcement.**  
I had a case to make the site offer to download pdf files instead of opening them using the pdf browser plugin:
```bash
<FilesMatch `\.xls`>  
  ForceType application/octet-stream  
  Header set Content-Disposition attachment  
</FilesMatch>  
<FilesMatch `\.pdf`>  
  ForceType application/octet-stream  
  Header set Content-Disposition attachment  
</FilesMatch>
```

<center>
  <div id="gads">
  </div>
</center>

 **15. Force download of files depending on the browser**  
In addition to previous point I had to get the site offer to download a pdf file if the client is using Internet Explorer:
```bash
<FilesMatch `\.(?i:pdf)$`\>  
  BrowserMatch `.\*MSIE.\*` ie  
  Header set Content-Disposition attachment env=ie  
</FilesMatch>
```

**16. Browser based redirect :**  
As a continuation of the previous point a pre-created variable can be used in the RewriteRule to redirect users to a different page depending on the browser:
```bash
BrowserMatch `.\*MSIE.\*` ie  
RewriteCond %{env:ie} =1  
RewriteRule ^(.*)$ http://%{SERVER_NAME}/page_for_ie.html [L]
```

**17. Make InternetExplorer to use custom CSS file:**

```bash
BrowserMatch `.\*MSIE.\*` ie  
RewriteCond %{env:ie} =1  
RewriteRule ^.*default_style.css$ /path_to_folder/style_for_ie.css [L]
```

**19. Use X-Forwarded-For:**

```bash
RewriteEngine On  
RewriteCond %{HTTP:X-FORWARDED-FOR} !100\.100\.100\.100 [NC]  
RewriteRule ^(.*)$ /some_page.html [R=302,L]
```

**20. Make browsers insensible to the letters case:**

```bash
RewriteEngine On
RewriteBase /
RewriteRule [A-Z] - [E=HASCAPS:TRUE,S=1]
RewriteRule ![A-Z] - [S=28]
RewriteRule ^([^A]\*)A(.\*)$ $1a$2  
RewriteRule ^([^B]\*)B(.\*)$ $1b$2  
RewriteRule ^([^C]\*)C(.\*)$ $1c$2  
RewriteRule ^([^D]\*)D(.\*)$ $1d$2  
RewriteRule ^([^E]\*)E(.\*)$ $1e$2  
RewriteRule ^([^F]\*)F(.\*)$ $1f$2  
RewriteRule ^([^G]\*)G(.\*)$ $1g$2  
RewriteRule ^([^H]\*)H(.\*)$ $1h$2  
RewriteRule ^([^I]\*)I(.\*)$ $1i$2  
RewriteRule ^([^J]\*)J(.\*)$ $1j$2  
RewriteRule ^([^K]\*)K(.\*)$ $1k$2  
RewriteRule ^([^L]\*)L(.\*)$ $1l$2  
RewriteRule ^([^M]\*)M(.\*)$ $1m$2  
RewriteRule ^([^N]\*)N(.\*)$ $1n$2  
RewriteRule ^([^O]\*)O(.\*)$ $1o$2  
RewriteRule ^([^P]\*)P(.\*)$ $1p$2  
RewriteRule ^([^Q]\*)Q(.\*)$ $1q$2  
RewriteRule ^([^R]\*)R(.\*)$ $1r$2  
RewriteRule ^([^S]\*)S(.\*)$ $1s$2  
RewriteRule ^([^T]\*)T(.\*)$ $1t$2  
RewriteRule ^([^U]\*)U(.\*)$ $1u$2  
RewriteRule ^([^V]\*)V(.\*)$ $1v$2  
RewriteRule ^([^W]\*)W(.\*)$ $1w$2  
RewriteRule ^([^X]\*)X(.\*)$ $1x$2  
RewriteRule ^([^Y]\*)Y(.\*)$ $1y$2  
RewriteRule ^([^Z]\*)Z(.\*)$ $1z$2

RewriteRule [A-Z] - [N]

RewriteCond %{ENV:HASCAPS} TRUE  
RewriteCond %{REQUEST_FILENAME} -f  
RewriteRule ^/?(.*) /$1 [R=301,L]
```

**21. Use of IP address in `RewriteCond`**  
Restrict access from particular IP address
```bash
RewriteEngine On  
RewriteCond %{REMOTE_ADDR} ^12\.34\.56\.78$  
RewriteRule .* - [F]
```

**22. Create custom header in .htaccess**

```bash
Header add TimeTaken `It took %D ms to serve this request`  
Header add ServerName %{SERVER_NAME}e  
Header add ServerAddr %{SERVER_ADDR}e
```

In `Ubuntu` don't forget to enable `mod_headers` othervice the website will return 500 http error:

```bash
sudo a2enmod headers
```

**23. Use QUERY_STRING**  
This deserves special attention. Sometimes you need to set up a redirect for the following page:
```bash
http://tech-notes.net/somescript.php?var1=val2&var2=val2
```


It's obvious to drive everything after the domain name in `%{REQUEST_URI}` but that rule won't work. The `% {QUERY_STRING}` begins after `?` sign:
```bash
RewriteEngine On  
RewriteCond %{REQUEST_URI} ^/somescript.php$  
RewriteCond %{QUERY_STRING} ^\&var1=(.\*)\&var2=(.\*)  
RewriteRule ^(.*)$ /%1/%2 [R,L]
```

As a result the visitor will be sent to the following address:
```bash
http://tech-notes.net/val2/val2/
```

Note that the values (`val1` and `val2`) are `%1` and `%2` (not `$1` and `$2`).

Источники:  
* [speckyboy.com](http://speckyboy.com/2013/01/08/useful-htaccess-snippets-and-hacks/)  
* [catswhocode.com](http://www.catswhocode.com/blog/10-useful-htaccess-snippets-to-have-in-your-toolbox)  
* **+personal experience.**
