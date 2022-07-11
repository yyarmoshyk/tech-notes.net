---
id: 647
title: Brief description of Apache mod_rewrite directives
date: 2014-03-13T09:47:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=647
permalink: /mod_rerwrite-directives/
image: /wp-content/uploads/2014/03/rewrite-small.png
categories:
  - Apache
---
A brief educational program about the directives that `mod_rewrite` provides

**Regular Expression Syntax**
^ Start of line
$ end of line
. Any single character
(a|b) "a" or "b"
(...) Group
[abc] "a" or "b" or "c"
[^abc] Not "a", not "b" and not "c"
\s Space
a? 0 or 1 character "a"
a* 0 or more "a"
a*? 0 or more "a", not greedy
a+ 1 or more "a"
a+? 1 or more "a", not greedy
a{3} Exactly 3 "a" characters
a{3,} 3 or more "a"
a{3,6} from 3 to 6 "a"
a{3,6}? 3 to 6 "a", not greedy
!(...) Prefix "not". Rule of action

---
**RewriteRule Flags**
R[=code] Redirect to a new URL,
optional with code (see below)
F Access denied
(sends 403 header)
G "Dead" page (deleted)
P Proxy
L The last rule
N Next round (rules restart)
C Chain
T=mime-type Set MIME type
NS Skip inner subquery
NC Not case sensitive
QSA Add query string
NE Do not escape on output
PT Skip through next
S=x Skip next x rules
E=var:value Set environment variable
---
**RewriteCond flags**
NC Not case sensitive
OR Combine according to the "or" principle
---
**Redirect header codes**
301 Transferred permanently
302 Rescheduled temporarily
403 Access denied
404 Page not found
410 "Dead" page
---
**Variables: HTTP headers**
%{HTTP_USER_AGENT}
%{HTTP_REFERER}
%{HTTP_COOKIE}
%{HTTP_FORWARDED}
%{HTTP_HOST}
%{HTTP_PROXY_CONNECTION}
%{HTTP_ACCEPT}
---
**Variables: query**
%{REMOTE_ADDR}
%{REMOTE_HOST}
%{REMOTE_USER}
%{REMOTE_IDENT}
%{REQUEST_METHOD}
%{SCRIPT_FILENAME}
%{PATH_INFO}
%{QUERY_STRING}
%{AUTH_TYPE}
---
**Variables: server**
%{DOCUMENT_ROOT}
%{SERVER_ADMIN}
%{SERVER_NAME}
%{SERVER_ADDR}
%{SERVER_PORT}
%{SERVER_PROTOCOL}
%{SERVER_SOFTWARE}
---
**Variables: time**
%{TIME_YEAR}
%{TIME_MON}
%{TIME_DAY}
%{TIME_HOUR}
%{TIME_MIN}
%{TIME_SEC}
%{TIME_WDAY}
%{TIME}
---
**Variables: special**
%{API_VERSION}
%{THE_REQUEST}
%{REQUEST_URI}
%{REQUEST_FILENAME}
%{IS_SUBREQ}
---
**Directives**
RewriteEngine
RewriteOptions
RewriteLog
RewriteLogLevel
RewriteLock
RewriteMap
RewriteBase
RewriteCond
RewriteRule
---
**Example: new domain**
```bash
# domain.com to domain2.com
RewriteCond %{HTTP_HOST} ^www\.domain\.com$  [NC]
RewriteRule ^(.*)$ http://www.domain2.com/$1 [R=301,L]
```

**Example: page temporarily moved**
```bash
# domain.com/page.htm to domain.com/new_page.htm
RewriteRule ^page.htm$ new_page.htm [R,NC,L]
```
**Example: human-readable URLs** (no query string)
```bash
# domain.com/category-name/ to domain.com/categories.php?name=category-name
RewriteRule ^([A-Za-z0-9-]+)/?$ categories.php?name=$1 [L]
```
**Example: block link spam**
(if the URL contains "viagra" or "xxx")
```bash
RewriteCond %{HTTP_REFERER} (viagra) [NC,OR]
RewriteCond %{HTTP_REFERER} (xxx) [NC]
RewriteRule .* - [F]
```
<a href="http://www.tech-notes.net/htaccess-notes/" title=".htaccess cheat sheet" target="_blank">More examples</a>