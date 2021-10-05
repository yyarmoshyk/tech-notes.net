---
id: 1255
title: Обзор конфигурации Varnish
date: 2014-07-17T16:57:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=1255
permalink: /varnish-configuration-rewiev/
image: /wp-content/uploads/2014/03/varnish_logo.jpg
categories:
  - Varnish
---
Существует множество статей о том, как можно настроить Varnish. Спешу сообщить, что единого подхода к настройке не существует. Чем больше опций Вы укажете в файле конфигурации, тем больше может появиться непредвиденных обстоятельств.

В этой статье хочу провести обзор языка VCL, который используется при настройке Varnish и рассмотреть варианты настройки. Спешу обратить Ваше внимание на то, что Varnish не поддерживает SSL.

Итак, конфигурация Varnish описывается в двух файлах:
  * `/etc/default/varnish` для Debian/Ubuntu (`/etc/sysconfig/varnish` для RedHat/CentOS)
  * `/etc/varnish/default.vcl`

Первый содержит описание конфигурации демона `Varnish`. Можно установить следующие параметры:
```bash
START=yes
INSTANCE=$(uname -n)
```

Ключевой секцией в нем является раздел `DAEMON_OPTS`:

```bash
DAEMON_OPTS="-a публичный_ip_адрес:порт \
  -f путь_к_файлу_vcl \
  -T ip_адрес_для_админки:порт_для_админки \
  -t значение_ttl \
  -w минимальное_количество_процессов_varnish,максимальное_количество_процессов_varnish,время_жизни_процесса \
  -s хранилище_кэша"
```
Ниже приведен пример секции DAEMON_OPTS. В данном случае Varnish будет работать с файлом `/etc/varnish/default.vcl`. Кэш объектов будет храниться в файле размером 1Gb, расположенном на диске `/var/lib/varnish/$(uname -n)/varnish_storage.bin`:

```bash
DAEMON_OPTS="-a :80 \
 -T localhost:6082 \
 -t 120 \
 -w 10,30,50\
 -f /etc/varnish/default.vcl \
 -S /etc/varnish/secret \
 -s file,/var/lib/varnish/$INSTANCE/varnish_storage.bin,1G"
```
Ниже приведен пример секции DAEMON_OPTS. В данном случае Varnish будет работать с файлом `/etc/varnish/website.vcl`. Кэш объектов будет храниться в оперативной памяти (malloc) и под него будет отводиться 256Mb.

```bash
DAEMON_OPTS="-a :80 \
 -T localhost:6082 \
 -t 120\
 -w 10,30,50\
 -f /etc/varnish/website.vcl \
 -S /etc/varnish/secret \
 -s malloc,256m"
```
Возвращаюсь к утверждению о том, что единого подхода к настройке не существует, хочу заметить, что в зависимости от того кэшируете ли Вы статику (картинки, css файлы и js скрипты) нужно указывать разное хранилище для кэша.

В моей практике были сайты, у которых страницы имели много статических объектов в виде картинок, что существенно увеличивало время отгрузки страниц. Картинки редко менялись. В этом случае можно хранить кэш в файле на локальном диске и кэшировать страницы целиком, включая статические объекты. Скорость отгрузки страниц существенно увеличивалась при таком подходе (3-5 раз).

Этот блог крутится на слабом сервере, страницы легкие и не требуют много ресурсов для отдачи. Varnish настроен таким образом, что бы запросы статики отправлять прямиком на `Nginx`, а остальное кешировать/выдавать с кэша. В данном случае объекты хранятся в оперативной памяти с лимитом в 256 MB. Этого вполне достаточно.

<center>
  <div id="gads">
  </div>
</center>

Рассмотрим файл с расширением vcl в папке `/etc/varnish` и задается ключом `-f` в секции DAEMON_OPTS. Начинается он с описания так называемых бэк-эндов. В этом случае backend - тот самый `Apache` или `NginX`, на котором вертится сайт. Выглядит эта секция вот так:

```bash
backend default {
.host = "127.0.0.1";
.port = "8080";
}
```
Можно добавить проверку жизнеспособности:

```bash
backend default {
  .host = "127.0.0.1";
  .port = "8080";
  .probe = {
.url = "/";
.timeout = 0.3 s;
.window = 8;
.threshold = 3;
.initial = 3;
  }
}
```
Если у Вас несколько серверов и Вы используете Varnish еще и в роли балансировщика нагрузки, тогда можно объявить несколько бэк-эндов и объединить их в директор:

```bash
backend www1 { .host = "192.168.0.10"; .port = "80";}
backend www2 { .host = "192.168.0.20"; .port = "80";}
backend www3 { .host = "192.168.0.30"; .port = "80";}
backend static { .host = "192.168.0.45"; .port = "80";}

director www round-robin {
  { .backend = www1; }
  { .backend = www2; }
  { .backend = www3; }
}
```
Дальше идет описание так называемых `подпрограмм` или `Subroutines`, которые применяются ко всем запросам, проходящим через Varnish.

Стандартные подпрограммы:

  * vcl_recv
  * vcl_pipe
  * vcl_pass
  * vcl_hash
  * vcl_hit
  * vcl_miss
  * vcl_fetch
  * vcl_deliver
  * vcl_error

Общую последовательность работы Varnish можно описать с помощью следующей диаграммы:  
[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348.png" alt="Screenshot from 2014-07-17 10:33:48" width="912" height="619" class="aligncenter size-full wp-image-1266" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348.png 912w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348-170x115.png 170w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348-300x203.png 300w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348-660x447.png 660w" sizes="(max-width: 912px) 100vw, 912px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-17-103348.png)

**1. vcl_recv** отвечает за первоначальную обработку запроса. Дальнейшая судьба обработки запроса определяется именно здесь с помощью функции return(). Можно решить дальнейшую судьба запроса с помощью:

  * pass - отправить запрос в vcl_pass.
  * pipe отправить запрос в vcl_pipe.
  * lookup - искать запрошенный объект в хранилище кэша

Для того что бы отключить использование кэша для всех запросов кроме типа GET, добавьте следующие строки в эту секцию:

```bash
if (req.request != "GET") { return (pass); }
```
Для того что бы отключить использование кэша для форм авторизации (Basic auth), добавьте следующие строки в эту секцию:

```bash
if (req.http.Authorization || req.request == "POST")
{
  return (pass);
}
```
Следующая конструкция отключит использование кэша для админки блога WordPress. Соответственно wp-admin можно поменять на нужное Вам значение:

```bash
if (req.url == "^/wp-admin") {
  return (pass);
}
```
Для того что бы отключить использование кэша для статических файлов и убрать информацию о cookie из запросов, добавьте следующие строки в эту секцию:

```bash
if (req.url ~ "^/(/wp-content|media|images|**ваш_вариант**/.*\.(css|js|ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
   unset req.http.Cookie;
   return (pass);
}
```
Аналогично можно отправить все запросы статических файлов на отдельный бэк-энд,если он у Вас предусмотрен для этих целей:

```bash
if (req.url ~ "^/(/wp-content|media|images|**ваш_вариант**/.*\.(css|js|ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
 unset req.http.Cookie;
 set req.backend = static;
}
```
<center>
  <div id="gads">
  </div>
</center>

Можно использовать конкретный бэкэнд в зависимости от значения HOST в заголовках запроса. Допустим у Вас есть dev версия сайта и лежит она на одном из описанных бэк-эндов (допустим www2):

```bash
if (req.http.host ~ "dev.website.com") {set req.backend = www2 ;}
else if (req.http.host ~ "www.website.com") {set req.backend = www; }
```
Полезной может быть нормализация кодирования:

```bash
if (req.http.Accept-Encoding) {
  if (req.http.Accept-Encoding ~ "gzip") {
set req.http.Accept-Encoding = "gzip";
  }
  elsif (req.http.Accept-Encoding ~ "deflate") {
set req.http.Accept-Encoding = "deflate";
  }
  else {
remove req.http.Accept-Encoding;
  }
}
```
Закрывается секция функцией return (), с аргументом pass, pipe или lookup.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
Пример секции
  </div>

  <div class="spoiler-body">

<pre>
sub vcl_recv {
if (req.request != "GET") { return (pass); }
if (req.url == "^/wp-admin") {
  return (pass);
}

if (req.url ~ "^/(/wp-content|media|images|ваш_вариант/.*\.(css|js|ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$") {
 unset req.http.Cookie;
 set req.backend = static;
}

if (req.http.Accept-Encoding) {
  if (req.http.Accept-Encoding ~ "gzip") {
set req.http.Accept-Encoding = "gzip";
  }
  elsif (req.http.Accept-Encoding ~ "deflate") {
set req.http.Accept-Encoding = "deflate";
  }
  else {
remove req.http.Accept-Encoding;
  }
}

return (lookup);

 }
</pre>
</div> </div>
**2.** При попадании запроса в **vcl_pass** он доставляется на прямую бэк-энду, минуя кэш.
**3.** При попадании запроса в **vcl_pipe** происходит своеобразное замыкание клиента на бэк-энд. Varnish курит в сторонке или обрабатывает другие запросы. Если честно большой разницы между vcl_pass и vcl_pipe я не вижу.
**4. vcl_hash** отвечает за создание хэш-слепка объекта в хранилище кэша. Дополнительных опций не имеет.
**5. vcl_miss** срабатывает, если запрашиваемый объект не был найден в хранилище кэша. По умолчанию отправляет объект на обработку vcl_fetch.
**6. vcl_hit** срабатывает, если запрашиваемый объект был найден в хранилище кэша. По умолчанию отправляет объект на обработку vcl_deliver.
**7. vcl_fetch** срабатывает, когда запрашиваемый объект был получен от бэк-энда.

Если для Вас критично, что бы в логи бэк-энд серверов попадали реальные значения ip адресов посетителей, добавьте следующие строки в эту секцию:
```bash
  remove req.http.X-Forwarded-For;
  set req.http.X-Forwarded-For = client.ip;
```

Для того, что бы задать время жизни объекта в хранилище кэша, нужно сначала убрать заголовок, обозначающий время жизни объекта:
```bash
  unset beresp.http.expires;
```

А потом указать время жизни объекта в хранилище (в секундах):
```bash
  set beresp.ttl = 86400 s;
```

В конце секции:
```bash
return (deliver);
```
<div class="spoiler-wrap">
<div class="spoiler-head folded">
  Пример секции
</div>

<div class="spoiler-body">
<pre>
sub vcl_fetch {
  remove req.http.X-Forwarded-For;
  set req.http.X-Forwarded-For = client.ip;
  set beresp.ttl = 86400 s;
   return (deliver);
}
</pre>
</div> </div>
**8. vcl_deliver** срабатывает перед доставкой объекта с хранилища кэша клиенту. Здесь можно либо добавить, либо убрать нужные заголовки (headers) в http ответе:
```bash
  remove resp.http.X-Varnish;
  remove resp.http.Via;
  remove resp.http.Age;
  remove resp.http.X-Purge-URL;
  remove resp.http.X-Purge-Host;
  remove resp.http.X-CF-Powered-By;

  set resp.http.X-Custom-name custom-value
```
<div class="spoiler-wrap">
<div class="spoiler-head folded">
  Пример секции
</div>

<div class="spoiler-body">
<pre>
sub vcl_deliver {
  remove resp.http.X-Varnish;
  remove resp.http.Via;
  remove resp.http.Age;
  remove resp.http.X-Purge-URL;
  remove resp.http.X-Purge-Host;
  remove resp.http.X-CF-Powered-By;

  return (deliver);
}
</pre>
</div> </div>

Так же обратите внимание на статью [Очистка кэша Varnish](http://www.tech-notes.net/flush-varnish-cache-browser-php/) и [Размышления о кластеризации: Часть 3 — Varnish кэш](http://www.tech-notes.net/notes-about-clusters-part3-varnish/)
