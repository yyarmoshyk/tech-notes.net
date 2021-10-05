---
id: 73
title: Шпаргалка по .htaccess
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
Представляю Вашему вниманию подборку интересных и не очень возможностей .htaccess файлов, и того, что с ними можно сделать. Большинство описаного относится к категории `must have`.

Тестер правил rewrite: [htaccess.madewithlove.be](http://htaccess.madewithlove.be/)

Для тестирование регулярных выражений можно воспользоваться [www.regex101.com](https://www.regex101.com/)

Еще один тестер правил rewrite: [martinmelin.se/rewrite-rule-tester/](http://martinmelin.se/rewrite-rule-tester/)

**1. Базовая авторизация:**  
Бывает так, что нужно закрыть вэб-сайт, или какую-то его часть, от посетителей. Сделать это можно с помощью следующей конструкции в .htaccess файле, в нужном каталоге:

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

**2. Убрать www из адреса сайта** (переадресация на сайт без www):

```bash
RewriteEngine On  
RewriteCond %{HTTP_HOST} !^your-site.com$ [NC]  
RewriteRule ^(.*)$ http://your-site.com/$1 [L,R=301]
```

**3. Добавить www в адрес сайта** (переадресация на www сайт):

```bash
RewriteEngine On  
RewriteCond %{HTTP_HOST} !^www.your-site.com$ [NC]  
RewriteRule ^(.*)$ http://www.your-site.com/$1 [L,R=301]
```

**4. Переадресация c http на https сайт:**

```bash
RewriteEngine On  
RewriteCond %{HTTPS} !on [OR]  
RewriteCond %{SERVER_PORT} ^80$  
RewriteRule ^(.*)$ https://%{SERVER_NAME}/$1 [L]
```

можно использовать одно из условий RewriteCond.

<center>
  <div id="gads">
  </div>
</center>

**5. Prevent hotlinking** (запретить использование объектов с вашего сайта другими сайтами)  
Если кто-то использует ресурс или объект с вашего сайта, то трафик генерируется для чужого профита. Если Вас это напрягает - запретите использование Вашего контента следующими строками в .htaccess файле:

```bash
RewriteEngine On  
#Replace ?mysite\.com/ with your blog url  
RewriteCond %{HTTP_REFERER} !(.\*)?your-site\.com(.\*) [NC]  
\# Не забываем исключить трафик с поисковых машин  
RewriteCond %{HTTP_REFERER} !(.\*)(google|bing|yandex|ask.com|duckduckgo|yahoo|lycos|dogpile|search)(.\*) [NC]  
RewriteCond %{HTTP_REFERER} !^$  
#Replace /images/nohotlink.jpg with your `don&#8217;t hotlink` image url  
RewriteRule .*\.(jpe?g|gif|bmp|png|другие_типы_файлов)$ /images/nohotlink.jpg [L]
```

Можно насоздавать разных файлов (jpg/txt/html) с сообщением: `Я ворую чужой контент`, и добавить RewriteRule&#8217;ов для каждого типа файлов.

**6. Заблокировать посетителей, пришедших с определенного домена строками в .htaccess:**

```bash
RewriteEngine on  
RewriteCond %{HTTP_REFERER} bannedurl1.com [NC,OR]  
RewriteCond %{HTTP_REFERER} bannedurl2.com [NC,OR]  
RewriteRule .* - [F]
```

**7. Назначить нестандартные страницы ошибок .htaccess:**

```bash
ErrorDocument 400 /error/HTTP_BAD_REQUEST.html  
ErrorDocument 404 /error/HTTP_NOT_FOUND.html  
ErrorDocument 500 /error/HTTP_INTERNAL_SERVER_ERROR.html  
ErrorDocument 503 /error/HTTP_SERVICE_UNAVAILABLE.html
```

**8. Спрятать расширения файлов через .htaccess:**  
Эта информация может быть полезна разве что Вам и разработчикам. Обычным смертным не за чем видеть расширения файлов на вашем сайте:

```bash
RewriteEngine on  
RewriteCond %{REQUEST_FILENAME} !-d  
RewriteCond %{REQUEST_FILENAME} \.custom_ext -f  
RewriteRule ^(.*)$ $1.custom_ext
```

custom_ext можно заменить на что угодно.

<center>
  <div id="gads">
  </div>
</center>

**9. Листинг каталогов:**

```bash
#Off:  
Options -Indexes
```

```bash
#On:  
Options +Indexes
```

Кстати, такие опции как ExecCgi и FollowSymLinks тоже можно включать в .htaccess. Соответственно:

```bash
#On:  
Options Indexes ExecCgi FollowSymLinks
```

**10. Сжатие файлов .htaccess:**

```bash
AddOutputFilterByType DEFLATE text/html text/plain text/xml application/xml application/xhtml+xml  
text/javascript text/css application/x-javascript  
BrowserMatch ^Mozilla/4 gzip-only-text/html  
BrowserMatch ^Mozilla/4.0[678] no-gzip  
BrowserMatch bMSIE !no-gzip !gzip-only-text/html
```

**11. Задать кодировку для определенных файлов используя .htaccess:**

```bash
<FilesMatch `\.(htm|html|css|js)$`>  
AddDefaultCharset UTF-8  
</FilesMatch>
```

**12. Кэширование файлов на стороне клиента:**  
Ваши посетителям не за чем каждый раз запрашивать весь медиа контент при переходе по страницам Вашего сайта. Этот контент можно хранить на стороне клиента во временном хранилище. Заставить браузеры Ваших посетителей держать эти файлы можно следующей конструкцией в .htaccess:

```bash
<FilesMatch `.(flv|gif|jpg|jpeg|png|ico|swf|js|css|pdf)$`>  
Header set Cache-Control `max-age=2592000`  
</FilesMatch>
```

max-age указывается в секундах.

**13. Запретить доступ для определенных браузеров (UserAgents)**  
Посмотрели логи доступа к сайту и увидели странный наплыв запросов с использованием какого-то не понятного UserAgent&#8217;а. Будьте уверены вас парсят, грабят или тупо ложат сайт, увеличивая нагрузку. Можно запретить доступ к сайту исходя из информации о UserAgent:

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

**14. Принудительная загрузка файлов.**  
В моих заметках давно была эта запись и однажды пригодилась, когда нужно было сделать так что бы сайт предлагал загрузить pdf файлы вместо того, что бы открывать их с помощью pdf плагина браузера:

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

 **15. Принудительная загрузка файлов в зависимости от браузера:**  
В дополнение к пункту №7, мне нужно было заставить сайт предлагать загружать pdf файл, если клиент использует InternetExplorer:

```bash
<FilesMatch `\.(?i:pdf)$`\>  
BrowserMatch `.\*MSIE.\*` ie  
Header set Content-Disposition attachment env=ie  
</FilesMatch>
```

**16. Переадресация в зависимости от браузера клиента:**  
В продолжение предыдущего пункта, предварительно созданную переменную можно использовать в RewriteRule для переадресации пользователей на другую страницу, в зависимости от браузера:

```bash
BrowserMatch `.\*MSIE.\*` ie  
RewriteCond %{env:ie} =1  
RewriteRule ^(.*)$ http://%{SERVER_NAME}/page_for_ie.html [L]
```

**17.** Так же в .htaccess можно **включить отдельный css** для посетителей использующих InternetExplorer:

```bash
BrowserMatch `.\*MSIE.\*` ie  
RewriteCond %{env:ie} =1  
RewriteRule ^.*default_style.css$ /path_to_folder/style_for_ie.css [L]
```

**18. Обработка файлов состоящих из английских (не русских) символов**

```bash
RewriteEngine On  
RewriteCond %{REQUEST_FILENAME} -f  
RewriteCond %{REQUEST_URI} ^/?(.*)/([a-zA-Z])+\.(gif|jpeg|jpg|png)$  
RewriteRule ^(.*)$ /куда-то_там.php [QSA,NC]
```

19. Использование X-Forwarded-For:

```bash
RewriteEngine On  
RewriteCond %{HTTP:X-FORWARDED-FOR} !100\.100\.100\.100 [NC]  
RewriteRule ^(.*)$ /some_page.html [R=302,L]
```

20. Делаем браузеры нечувствительными к регистру в именах файлов:

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

21. **Использвание IP адресов в `RewriteCond`**  
Для примера запретим доступ к сайту для одного ip адреса:

```bash
RewriteEngine On  
RewriteCond %{REMOTE_ADDR} ^12\.34\.56\.78$  
RewriteRule .* - [F]
```

22. **Создание произвольного заголовка**

```bash
Header add TimeTaken `It took %D ms to serve this request`  
Header add ServerName %{SERVER_NAME}e  
Header add ServerAddr %{SERVER_ADDR}e
```

В Ubuntu не забудьте включить mod_headers иначе фокус не получится, а сайт ляжет с 500-й ошибкой:

```bash
sudo a2enmod headers
```

23. **Использование QUERY_STRING**  
Это заслуживает отдельного внимания. Иногда бывает нужно настроить редирект для следующей страницы:

```bash
http://tech-notes.net/somescript.php?var1=val2&var2=val2
```


Очевидным является загнать все, после имени домена в `%{REQUEST_URI}`, но такое правило не сработает. Голову сломал сегодня, пока дошло, что после `?` начинается `%{QUERY_STRING}`

```bash
RewriteEngine On  
RewriteCond %{REQUEST_URI} ^/somescript.php$  
RewriteCond %{QUERY_STRING} ^\&var1=(.\*)\&var2=(.\*)  
RewriteRule ^(.*)$ /%1/%2 [R,L]
```

В результате посетитель будет отправлен по следующему адресу:

```bash
http://tech-notes.net/val2/val2/
```


Обратите внимание, что для обозначения значений (val1 и val2) используются %1 и %2 (а не $1 и $2).

Источники:  
* [speckyboy.com](http://speckyboy.com/2013/01/08/useful-htaccess-snippets-and-hacks/)  
* [catswhocode.com](http://www.catswhocode.com/blog/10-useful-htaccess-snippets-to-have-in-your-toolbox)  
* **+Личный опыт.**
