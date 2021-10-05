---
id: 671
title: Балансировка нагрузки с помощью NginX
date: 2014-03-14T18:07:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=671
permalink: /load-balancing-nginx/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - load balancing
  - nginx
  - балансировка нагрузки
---
Приветствую тебя, дорогой читатель. В этой статье я хочу описать настройку `NginX` для балансировки нагрузки на несколько back-end серверов, допустим Apache.

Итак предлагается следующая схема (картинка кликабельна):  
[<img src="/wp-content/uploads/2014/03/12479dbe099929c17bf1cb19795557e0-279x300.jpg" alt="12479dbe099929c17bf1cb19795557e0" width="279" height="300" class="aligncenter size-medium wp-image-672" srcset="/wp-content/uploads/2014/03/12479dbe099929c17bf1cb19795557e0-279x300.jpg 279w, /wp-content/uploads/2014/03/12479dbe099929c17bf1cb19795557e0.jpg 632w" sizes="(max-width: 279px) 100vw, 279px" />](/wp-content/uploads/2014/03/12479dbe099929c17bf1cb19795557e0.jpg)

В этом довольно простом деле нам помогут две директивы NginX:

  * **upstream** - директива, которая поставляется с модулем [HttpUpstream](http://wiki.nginx.org/HttpUpstreamModule) и позволяет балансировать нагрузку на несколько серверов.
  * **proxypass** - директива, которая поставляется с модулем [HttpProxy](http://wiki.nginx.org/HttpProxyModule). Она позволяет корректно отправлять/проксировать запросы на сервера за балансировщиком.

Итак рассмотрим пример. Имеются 3 вэб-головы, на которых крутится один и тот же сайт. :

```bash
Apapche#1:  
ip: 192.168.10.10
Apapche#2  
ip: 192.168.10.20
Apapche#3  
ip: 192.168.10.30
```

В любимом текстовом редакторе создаем конфигурационный файл nginx и вносим в него следующие строки. Лично я люблю, когда настройки сайтов хранятся в отдельных файлах.

```bash
upstream http {
	server 192.168.10.10 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.20 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.30 weight=2 max_fails=2 fail_timeout=2s;
}
```
  * 		_weight_ - определяет значимость сервера в кластере. В данном примере все сервера - одинаковы и могут обслужить одинаковое количество запросов. Если в кластере 1 сервер значительно мощнее остальных - можно указать для него высшее значение этого параметра и NginX будет слать ему больше запросов, чем другим.
  * 		_max_fails_ - определяет количество неудачных попыток соединения с backend сервером.
  * 		_fail_timeout_ - промежуток между неудачными соединениями.

В данном примере после 2-х неудачных соединений на протяжении 4-х секунд, сервер будет помечен как недоступный и запросы к нему не будут отправляться, пока NginX не удостоверится, что с сервером все в порядке.

<center>
  <div id="gads">
  </div>
</center>

Методы балансировки нагрузки (описываются в начале секции upstream):
  * 		_ip_hash_ - согласно этому методу запросы от одного и того же клиента будут всегда отправляться на один и тот же backend сервер на основе информации об ip адресе клиента. **Не совместим с параметром weight.**
  * 		_least_conn_ - запросы будут отправляться на сервер с наименьшим количеством активных соединений.
  * 		_round-robin_ - режим по умолчанию. То есть если вы не задали ни один из вышеупомянутых способов балансировки - запросы будут доставляться по очереди на все сервера в равной степени.

Итак сервера с сайтом описали. Дальше нужно сказать NginX'у что с ними делать. Для этого описываем секцию location с параметрами проксирования запросов:

```bash
location / {
	proxy_read_timeout 1200;
	proxy_connect_timeout 1200;
	proxy_pass http://http/;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```


Итак полный конфиг для кластера выглядит следующим образом:

```bash
upstream http {
	server 192.168.10.10:80 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.20:80 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.30:80 weight=2 max_fails=2 fail_timeout=2s;
}

server {

servername mywebsite.com www.mywebsite.com;
listen 80;

location / {
	proxy_read_timeout 1200;
	proxy_connect_timeout 1200;
	proxy_pass http://http/;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```


<center>
  <div id="gads">
  </div>
</center>

Большой прелестью балансировки нагрузки с помощью NginX является поддержка SSL Termination. То есть защищенные сессии устанавливаются с самим балансировщиком, и от него же клиенты получают ответ. Есть два варианта настройки:

1. По аналогии с предыдущим примером настраиваем балансировку https сессий. При этом ssl хосты должны быть описаны и на Apache серверах. В этом случае https соединения будут устанавливаться с NginX'ом, дальше он будет формировать новый пакет, устанавливать защищенное соединение с Apache серверами, получать такой же защищенный пакет в ответ, распаковывать его, формировать новый и отправлять конечный результат клиенту в защищенном виде. Довольно трудоемкий процесс, согласитесь. В отношении производительности ооочень ресурсо-затратный.

В этом случае наш конфиг будет выглядеть следующим образом:

```bash
upstream https {
	server 192.168.10.10:443 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.20:443 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.30:443 weight=2 max_fails=2 fail_timeout=2s;
}

server {
servername mywebsite.com www.mywebsite.com;
listen 443;

ssl on;
ssl_certificate /etc/nginx/SSL/hostname.pem;
ssl_certificate_key /etc/nginx/SSL/server.key;

location / {
	proxy_read_timeout 1200;
	proxy_connect_timeout 1200;
	proxy_pass https://https/;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```


<center>
  <div id="gads">
  </div>
</center>

2. Настраиваем https хост в NginX'e, описываем http (без `S`) соединения в upstream списке. Немного лирики: многие CMS системы имеют встроенные проверки наличия безопасных сессий и принудительно переадресовывают клиентов на безопасное соединение на страницах ввода конфиденциальной информации (авторизации пользователей, страницы оплаты услуг). Как правило это производится на основе наличия HTTPS хэдэра со значением `on` в переменном окружении SERVER. Можно просто добавлять этот хэдэр в запросы к серверам Apache и не создавать лишней нагрузки. Если этот способ не срабатывает - смотрите пункт 1.

В этом случае наш конфиг будет выглядеть следующим образом:

```bash
upstream https {
	server 192.168.10.10:80 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.20:80 weight=2 max_fails=2 fail_timeout=2s;
	server 192.168.10.30:80 weight=2 max_fails=2 fail_timeout=2s;
}

server {
servername mywebsite.com www.mywebsite.com;
listen 443;

ssl on;
ssl_certificate /etc/nginx/SSL/hostname.pem;
ssl_certificate_key /etc/nginx/SSL/server.key;

location / {
	proxy_read_timeout 1200;
	proxy_connect_timeout 1200;
	proxy_pass http://https/;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	<strong>proxy_set_header HTTPS on;</strong>
}
```


Еще больше можно помочь нашим Apache серверами и снять с них ненужную нагрузку, раздавая статические файлы с помощью NginX. Для этого все папки со статическим контентом нужно скопировать (сохраняя дерево каталогов) на сам балансировщик нагрузки (я бы разместил в /var/www/html) и описать раздачу из с помощью NginX прямо перед секцией `location /` в описании каждого хоста:

```bash
location ~* \.(ico|gif|jpeg|jpg|png|eot|ttf|swf|woff)$ {
	root /var/www/html;
	expires 30d;
	access_log off;
}
location ~* \.(css|js)$ {
	root /var/www/html;
	expires 1d;
	access_log off;
}
```


Для того чтобы статический контент нормально обновлялся при загрузке через web, можно <a href="http://www.tech-notes.net/configure-nfs-server-and-client-centos/" title="Настройка NFS сервера и его клиентов на базе CentOS" target="_blank">примонтировать соответствующие папки на сервера с помощью NFS</a>.

Как-то так.
