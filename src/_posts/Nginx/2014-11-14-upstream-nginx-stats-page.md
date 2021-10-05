---
id: 2141
title: Статистика для Upstream NginX
date: 2014-11-14T10:19:50+00:00
author: admin

guid: http://www.tech-notes.net/?p=2141
permalink: /upstream-nginx-stats-page/
image: /wp-content/uploads/2014/10/statpic1.jpeg
categories:
  - Nginx
tags:
  - Балансировка нагрузки
---
При использовании [NginX в качестве балансировщика нагрузки](http://www.tech-notes.net/load-balancing-nginx/) появляется вопрос о корректном ведении статистики доставки трафика к серверам из секции Upstream.

К сожалению у Nginx нету встроенного функционала на манер [HaProxy](http://www.tech-notes.net/haproxy-stats-page/). Также этот функционал нельзя добавить путем установки дополнительного модуля с помощью yum или apt-get.

Для того что бы в NginX появилось [компилировать из исходников](http://www.tech-notes.net/haproxy-stats-page/" title="Страница статистики HaProxy" target="_blank">что-то подобное</a>, его прийдется <a href="http://www.tech-notes.net/install-nginx-from-sources/) и в ходе компиляции включать сторонний модуль upstream-stats.

Этот модуль совместим с `nginx-1.2.2`. Последнюю версию `NginX` мне собрать не удалось.  
Скачиваем `NginX` и распаковываем его:
```bash
wget http://nginx.org/download/**nginx-1.2.2**.tar.gz  
tar xf nginx-1.2.2.tar.gz
```

Скачиваем upstream-stats и распаковываем его:

```bash
wget /wp-content/uploads/2014/11/ustats.tgz  
tar xf ustats.tgz
```

<center>
  <div id="gads">
  </div>
</center>

Копируем файлы в папки `NginX`

```bash
cp -r ustats-read-only/ustats nginx-1.2.2/src/http/modules/  
cp ustats-read-only/nginx.patch nginx-1.2.2/
```

Осталось применить патч и можно переходить к сборке NginX

```bash
cd nginx-1.2.2/  
patch -p1 -i nginx.patch
```

Базовая строка конфигурирования выглядит следующим образом:

```bash
./configure -prefix=/etc/nginx -user=nginx -group=nginx -with-http_ssl_module **-add-module=src/http/modules/ustats** -http-log-path=/var/log/nginx/
```

Если Вам нужны дополнительные опции - прочитайте [эту статью](http://www.tech-notes.net/install-nginx-from-sources/). В ней же приводится пример init.d скрипта и список нужных для компиляции пакетов.

Для того что бы статистика заработала - добавьте следующие строки в секцию server любого сайта:

```bash
location /ustats {
  ustats memsize=1m;
  ustats_refresh_interval 6000;
  ustats_html_table_width 95;
  ustats_html_table_height 95;
}
```


[<img src="/wp-content/uploads/2014/11/shot1-300x166.png" alt="shot1" width="300" height="166" class="aligncenter size-medium wp-image-2142" srcset="/wp-content/uploads/2014/11/shot1-300x166.png 300w, /wp-content/uploads/2014/11/shot1-170x94.png 170w, /wp-content/uploads/2014/11/shot1.png 1002w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/11/shot1.png)
