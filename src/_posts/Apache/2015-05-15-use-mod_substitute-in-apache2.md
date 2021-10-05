---
id: 2586
title: Использование mod_substitute в Apache
date: 2015-05-15T14:48:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=2586
permalink: /use-mod_substitute-in-apache2/
image: /wp-content/uploads/2015/05/SearchReplaceSheet.png
categories:
  - Apache
tags:
  - mod_substitute
---
Для это штуки решил сделать отдельную заметку.

Суть работы этого [mod_substitute](http://httpd.apache.org/docs/2.4/mod/mod_substitute.html) заключается в замене текста в теле ответа от вэб сервера. Тоесть можно сменить, на принмер, ссылки на один домен ссылками на другой домен без вмешательства в код сайта.

Проверить загружен ли модуль можно так:

```bash
/usr/sbin/apachectl -t -D DUMP_MODULES 2>&1|grep subst
```

Либо удостовериться что следующая строка присутствует и не закомнтирована в файле httpd.conf:

```bash
LoadModule substitute_module modules/mod_substitute.so
```

Допустим у вас есть сайт с доменным именем mysite.com. Вам нужно из него сделать сайт dev.mysite.com, но в базе, да и в файлах, существует целая туча ссылок на mysite.com. Соответственно dev домен будет на половину работать с живым сайтом и половна ссылок будут вести на живой сайт. Мжно ковырять базу, обновлять ссылки в файлах, но можно пойти путем наименьшего сопротивления, а именно, добавить следущую конструкцию в [.htaccess](http://www.tech-notes.net/htaccess-notes/" title="Шпаргалка по .htaccess):

```bash
AddOutputFilterByType SUBSTITUTE text/html
Substitute "s|mysite.com|dev.mysite.com|in"
Substitute "s|www.mysite.com|dev.mysite.com|in"
```


Первая строка означает тип файлов, в которых будет производится замена. Если у Вас есть еще и кастомизированые скрипты - заставте сервер отрабатывать их в том числле:

```bash
AddOutputFilterByType SUBSTITUTE text/javascript
```


В случае возникновения проблем, проверьте [настройки сайта в Apache](/configure-vhosts-apache2/). Обратите внимание на:

```bash
AllowOverride All
```


`Substitute` бывает чувствительным к заголовку Accept-Ranges. В случае проблем попробуйте добавить следущее в конструкцию `Substitute` в `.htaccess` файле:

```bash
Header set Accept-Ranges "none"
```
