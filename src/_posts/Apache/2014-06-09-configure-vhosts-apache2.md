---
id: 1022
title: Настройка сайтов в Apache2
date: 2014-06-09T13:04:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=1022
permalink: /configure-vhosts-apache2/
image: /wp-content/uploads/2014/05/apache_logo.jpg
categories:
  - Apache
---
Данный пример содержит конфигурационный файл сервера `Apache2` для сайта `tech-notes.net`:  

```bash
<VirtualHost *:80>
  ServerName tech-notes.net
  ServerAlias www.tech-notes.net
  DocumentRoot /var/www/tech-notes

  LogLevel warn
  ErrorLog /var/log/httpd/tech-notes_error.log
  CustomLog /var/log/httpd/tech-notes_access.log combined

  <Directory /var/www/tech-notes>
    Options +ExecCGI Indexes FollowSymLinks MultiViews
    AllowOverride All
    Order allow,deny
    allow from all
  </Directory>
</VirtualHost>
```


Пояснения:  
**ServerName** - имя сайта.  
**ServerAlias** - дополнительное имя сайта. Можно указывать несколько  
**DocumentRoot** - папка в которой лежат файлы сайта  
**LogLevel** - определяет количество сообщений, которые будут записываться в лог файлю Доступные значения: `debug, info, notice, warn, error, crit, alert, emerg.`  
В случае использования debug log файл будет содержать наибольшее количество записей с информацией о запросах, emerg - наименьшее количество записей/информации.  
**ErrorLog** - путь к логу с ошибками. Если не указан - все ошибки будут записаны в стандартный файл (`/var/log/httpd/error_log` или `/var/log/apache2/error.log`).  
**CustomLog** - лог по требованию. Принимает два аргумента - путь к файлу и тип лога (в примере combined - можно использовать для статистики посещения)

Со старта в конфиге апача объявлены следующие форматы лог файлов:

```bash
LogFormat "%v:%p %h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" vhost_combined
LogFormat "%h %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\"" combined
LogFormat "%h %l %u %t \"%r\" %>s %O" common
LogFormat "%{Referer}i -> %U" referer
LogFormat "%{User-agent}i" agent
```


Можно создавать свои.

Между тэгами **<Directory>** и **</Directory>** можно указать параметры, специфические для конкретного каталога (в примере - /var/www/tech-notes)  
* **Options** - опции. Знак `+` - включает принудительно, `-` отключает:  
* **ExecCGI** - Разрешает выполнение `cgi` скриптов. Должно быть включено, если php выполняется в режиме cgi.  
* **Indexes** - дает дополнительные возможности для индексирования каталога (не путуть с индексированием поисковыми машинами).  
* **FollowSymLinks** - включает поддержку `symbolic links` в каталоге.  
* **MultiViews** - опциональный параметр. Его примочка в том что, если приходит запрос к каталогу `/some/dir/foo`, а `MultiViews` включено для `/some/dir`, и каталог `/some/dir/foo` не существует, тогда сервер будет искать файлы с именем `foo.*` в каталоге `/some/dir/`.

Используя директиву `Alias` можно к сайту подключить каталог, который не находится в домашнем каталоге сайта. К примеру `phpmyadmin`:

```bash
Alias /phpmyadmin /usr/share/phpmyadmin
```

Если в конфиге хоста присутствует эта строчка то при открытии http://www.tech-notes.net/phpmyadmin бы попали бы в интерфейс управления базами данных.

Это пример настроек `https/ssl` хоста на сервере с `CentOS`:

```bash
<VirtualHost *:443>
	ServerName tech-notes.net
	ServerAlias www.tech-notes.net
	DocumentRoot /var/www/tech-notes

	SSLEngine on
	SSLCertificateKeyFile /etc/ssl/private/tech-notes.key
	SSLCertificateFile    /etc/ssl/certs/tech-notes.crt
	SSLCACertificateFile /etc/ssl/private/ca-bundle.crt

	LogLevel warn
	ErrorLog /var/log/httpd/tech-notes_ssl_error.log
	CustomLog /var/log/httpd/tech-notes_ssl_access.log combined

	<Directory /var/www/tech-notes>
		Options +ExecCGI Indexes FollowSymLinks MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
	</Directory>
</VirtualHost>
```


В случае с Debian/Ubuntu настройки ssl хоста рекомендует размещать между тэгами `<IfModule mod_ssl.c>` и `</IfModule>`

Если у Вас на одном ip адресе вертится несколько сайтов - нужно добавить следующее в `ports.conf` или `httpd.conf` (`apache2.conf`):

```bash
NameVirtualHost *:80
NameVirtualHost *:443
```
