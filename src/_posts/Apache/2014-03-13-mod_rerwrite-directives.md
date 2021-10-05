---
id: 647
title: Краткое описание директив Apache mod_rewrite
date: 2014-03-13T09:47:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=647
permalink: /mod_rerwrite-directives/
image: /wp-content/uploads/2014/03/rewrite-small.png
categories:
  - Apache
---
Краткий ликбез о директивах, которые предоставляет `mod_rewrite`

**Синтаксис регулярных выражений**
^ Начало строки  
$ Конец строки  
. Любой одиночный символ  
(a|b) «a» или «b»  
(...) Группа  
[abc] «a» или «b» или «c»  
[^abc] Не «a», не «b» и не «c»  
\s Пробел  
a? 0 или 1 символ «a»  
a* 0 или больше «a»  
a*? 0 или больше «a», не жадный  
a+ 1 или больше «a»  
a+? 1 или больше «a», не жадный  
a{3} Ровно 3 символа «a»  
a{3,} 3 или больше «a»  
a{3,6} от 3 до 6 «a»  
a{3,6}? от 3 до 6 «a», не жадный  
!(...) Префикс «не». Правило действу

---
**Флаги RewriteRule**  
R[=code] Перенаправить на новый URL,  
опционально с кодом (см. ниже)  
F Доступ запрещен  
(посылает 403 заголовок)  
G «Мертвая» страница (удалена)  
P Прокси  
L Последнее правило  
N Следующий круг (перезапуск правил)  
C Цепочка  
T=mime-type Установить MIME-тип  
NS Пропустить внутренний подзапрос  
NC Не учитывать регистр  
QSA Добавить строку запроса  
NE Не экранировать при выводе  
PT Пропустить через следующий  
S=x Пропустить следующие x правил  
E=var:value Установить переменную окружения
---
**Флаги RewriteCond**  
NC Не учитывать регистр  
OR Комбинировать по принципу «или»
---
**Коды заголовков перенаправления**  
301 Перенесен постоянно  
302 Перенесен временно  
403 Доступ запрещен  
404 Страница не найдена  
410 «Мертвая» страница
---
**Переменные: HTTP заголовки**  
%{HTTP_USER_AGENT}  
%{HTTP_REFERER}  
%{HTTP_COOKIE}  
%{HTTP_FORWARDED}  
%{HTTP_HOST}  
%{HTTP_PROXY_CONNECTION}  
%{HTTP_ACCEPT}
---
**Переменные: запрос**  
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
**Переменные: сервер**  
%{DOCUMENT_ROOT}  
%{SERVER_ADMIN}  
%{SERVER_NAME}  
%{SERVER_ADDR}  
%{SERVER_PORT}  
%{SERVER_PROTOCOL}  
%{SERVER_SOFTWARE}
---
**Переменные: время**  
%{TIME_YEAR}  
%{TIME_MON}  
%{TIME_DAY}  
%{TIME_HOUR}  
%{TIME_MIN}  
%{TIME_SEC}  
%{TIME_WDAY}  
%{TIME}
---
**Переменные: специальные**  
%{API_VERSION}  
%{THE_REQUEST}  
%{REQUEST_URI}  
%{REQUEST_FILENAME}  
%{IS_SUBREQ}
---
**Директивы**  
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
**Пример: новый домен**  
```bash
# domain.com to domain2.com  
RewriteCond  %{HTTP_HOST}  ^www\.domain\.com$  [NC]  
RewriteRule  ^(.*)$  http://www.domain2.com/$1  [R=301,L]
```

**Пример: страница временно перенесена**  
```bash
# domain.com/page.htm to domain.com/new_page.htm  
RewriteRule  ^page.htm$  new_page.htm  [R,NC,L]
```
**Пример: человеко-понятные URL** (без строки запроса)  
```bash
# domain.com/category-name/ to domain.com/categories.php?name=category-name  
RewriteRule  ^([A-Za-z0-9-]+)/?$  categories.php?name=$1  [L]
```
**Пример: блокировать ссылочный спам**  
(если URL содержит «viagra» или «xxx»)  
```bash
RewriteCond  %{HTTP_REFERER}  (viagra)  [NC,OR]  
RewriteCond  %{HTTP_REFERER}  (xxx)  [NC]  
RewriteRule  .*  -  [F]
```
<a href="http://www.tech-notes.net/htaccess-notes/" title="Шпаргалка по .htaccess" target="_blank">Больше примеров</a>
