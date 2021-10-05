---
id: 2494
title: Автоматическая настройка сайтов в NginX
date: 2015-03-30T18:13:17+00:00
author: admin

guid: http://www.tech-notes.net/?p=2494
permalink: /auto-configure-webhosts-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - bash
---
Простая жизнь простых сайтов на сервере с NginX.

После того как apache отказался запускаться 1000+ сайтов, было решено переключиться на nginx и проделать с ним [подобное.](http://www.tech-notes.net/auto-configure-webhosts-apache/)

Условия те же: клиенту было предложено заливать сайты на сервер по фтп называть папки полными именами сайтов. Со стороны сервера был настроен [pure-ftpd с виртуальных пользователем](http://www.tech-notes.net/pure-ftpd-virtual-users/). После логина клиент попадает в папку `/var/www/html`, где ему предстоит создать папку с именем сайта и залить в эту папку файлы.

После чего срабатывает новая серверная магия и сайт становится доступен по велению волшебного basha.

Для этого в папке `/etc/nginx` был созад шаблон:  
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /etc/nginx/templatenginx
  </div>

  <div class="spoiler-body">

<pre>
server {
  listen 80;
  server_name websiterepl www.websiterepl;

  root /var/www/html/websiterepl;

  index index.php;

  if ($host ~ !^(websiterepl|www.websiterepl)$) {
    rewrite ^ http://www.websiterepl$request_uri? permanent;
  }

  # Limit methods, allowed on server to GET, HEAD and POST
  if ($request_method !~ ^(GET|HEAD|POST)$ ) {
    return 444;
  }

  location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
    root /var/www/html/websiterepl;
    expires 30d;
    access_log off;
  }

  location ~* \.(css|js)$ {
    root /var/www/html/websiterepl;
    expires 7h;
    access_log off;
  }

  location / {
    try_files $uri $uri/ /index.php;
  }

  location ~ \.(php|html)$ {
    root /var/www/html/websiterepl;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
  }
}
</pre>
</div> </div>

После чего следующий скрипт обрабатывает содержание `/var/www/html/` и создает для всех папок виртуальные хосты в конфиге nginx.

      <div class="spoiler-wrap">
        <div class="spoiler-head folded">
          /usr/local/bin/make_vhosts_nginx
        </div>

        <div class="spoiler-body">
<pre>
#!/bin/bash
do_websites () {
for f in $(ls /var/www/html/);
do
    sed 's/websiterepl/'"$f"'/g' /etc/nginx/templatenginx &gt;&gt; /etc/nginx/conf.d/websites.conf
    echo "" &gt;&gt; /etc/nginx/conf.d/websites.conf
done
}

if [ "$1" == "force" ]
then
    echo "[Forced] Building new websites' configuration";
    rm -f /etc/nginx/conf.d/websites.conf
    do_websites
    /bin/systemctl restart nginx.service
else

servernames=$(grep server_name /etc/nginx/conf.d/websites.conf |wc -l);
folders=$(ls /var/www/html |wc -l);

if [ "$folders" != "$servernames" ]
then
    echo "[General] Building new websites' configuration";
    rm -f /etc/nginx/conf.d/websites.conf
    do_websites
    /bin/systemctl restart nginx.service
else
    echo "No new websites found";
fi
fi

</pre>
</div> </div>

С помощью `crontab` заставляет скрипт выполняться каждые 15 минут.

```bash
*/15 * * * * /usr/local/bin/make_vhosts_nginx 2>&1 >> /dev/null
```

В принцыпе в сам скрипт зашита проверка количества виртуальных хостов и сравнение их с количеством папок в /var/www/html, поэтому можно выполнять его и каждые 5 минут.

Скрипт можно запустить принудительно используя ключь `force`.
