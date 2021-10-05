---
id: 650
title: Очистка кэша Varnish через Браузер с помощью PHP
date: 2014-03-13T14:57:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=650
permalink: /flush-varnish-cache-browser-php/
image: /wp-content/uploads/2014/03/varnish_logo.jpg
categories:
  - Varnish
tags:
  - flush varnish cache
  - varnish cache
  - очистка кэша varnish
---
Приветствую тебя, дорогой читатель. В этой заметке я хочу поведать тебе, как можно элегантно чистить кэш Varnish. Данная статья описывает, как можно удалять страницы=объекты из кэша, используя их URL адреса.

Итак для начала нужно описать ACL в настройках нашего хоста, чтобы разрешить очистку кэша с определенных ip адресов. Для этого добавим следующее в файл `/etc/varnish/default.vcl`. (имя файла может отличаться в зависимости от настройки Вашего сервера)

```bash
acl purge { "localhost"; "public_ip_address";}
```


Дальше добавим следующие строки в описание vcl_recv:

```bash
if (req.request == "PURGE") {
	if (!client.ip ~ purge) {
		error 405 "Not allowed.";
	} else {
		purge_url(req.url);
		error 200 "Purged. Everything is fine";
	}
}
```


Это нужно для того, чтобы запретить очистку кэша с внешней стороны.  
Для того чтобы Varnish не кэшировал саму страницу очистки кэша, нужно добавить следующие строки в vcl_fetch:

```bash
if (req.http.host == "www.your_site.com" && req.url == "^/varadm/.*\.(html|php)$") {
		    return (pass);
}
```


Для того чтобы исключить из кэширования POST запросы, удостовертесь что в vcl_recv есть вот такие строчки:

```bash
if (req.request == "POST") {
		          return (pass);
    }
```


Отключаем кеширование для запросов basic авторизации (vcl_recv):

```bash
if (req.http.Authorization || req.http.Authenticate)
    {
		     	return (pass);
    }
```


Для того, чтобы не выводить кучу не нужной информации, я для себя очистил стандартный вывод страницы ошибки:  
В принципе этого можно не делать:

```bash
sub vcl_error {
		set obj.http.Content-Type = "text/html; charset=utf-8";
		synthetic {"
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
</head>
<body>
</body>
</html>
"};
		return (deliver);
}
```


Дальше создаем папку, где будут храниться нужные файлы и переходим в неё. В моем случае это - `/var/www/varadm`.  
Уже в папке создаем несколько файлов. Первый из них - index.php, со следующим содержанием:

```bash
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>Purge Varnish cache</title>
</head>

<style type="text/css">
body {
font-size: 10px;
}
h1 {
				font-weight: bold;
				color: #000000;
				border-bottom: 1px solid #C6EC8C;
				margin-bottom: 2em;
}
label {
				font-size: 160%;
				float: left;
				text-align: right;
				margin-right: 0.5em;
				display: block
}
input[type="text"] {
				width: 500px;
}
.submit input {
				margin-left: 0em;
				margin-bottom: 1em;
}
</style>

<body>

<h1>Makes Varnish purge the supplied URL from its cache</h1>

<form action="purge.php" method="post">
<p><label>URL</label> <input type="text" name="url"></p>
<p><label>HOST</label> <input type="text" name="host" value="<?php echo $_SERVER["HTTP_HOST"] ?>"></p>
<p class="submit"><input value="Submit" type="submit"></p>
</form>

</body>
</html>
```


Следующий - purge.php с вот таким содержанием:

```bash
<?php
$fp = fsockopen("127.0.0.1", "80", $errno, $errstr, 2);
$string = $_POST['url'];
$host = $_POST['host'];
$url = str_replace($host, '', $string);
#$url = $_POST['url'];
echo "<center>";
if (!$fp) {
				echo "$errstr ($errno)<br />\n";
} else {
				$out = "PURGE /$url HTTP/1.0\r\n";
				$out .= "Host: $host\r\n";
				$out .= "Connection: Close\r\n\r\n";
				fwrite($fp, $out);
				while (!feof($fp)) {
								echo fgets($fp, 128);
								echo "<br>";
				}
				fclose($fp);
echo "<b>" . $host . $url . " was purged </b><br><br>";
echo "<a href=\"/varadm\">Return to varnish admin page<a>";
}
echo "</center>";
?>
```


Создаем настройки для нашей папки в каталоге Apache: /etc/httpd/conf.d/varadm.conf

```bash
Alias /varadm /var/www/varadm
<Directory /var/www/varadm>
				DirectoryIndex index.html
				Options -Indexes +Includes

				Order allow,deny
				AuthType Basic
				AuthUserFile /var/www/varadm/.ok_user
				AuthGroupFile /dev/null
				AuthName "Enter username/password"
				Require valid-user
				Satisfy any
				Deny from all
</Directory>
```


Осталось создать пользователя для базовой авторизации и сгенерировать для него пароль:

> htpasswd -cmb /var/www/varadm/.ok_user user password

Теперь можно заходить на свой сайт, указывая location /varadm:  
`http://www.your_site.com/varadm`

В форме будет два поля. Одно - URL, второе принимает значение www.your_site.com. В поле URL вставляем адрес объекта, который нужно удалить из кэша и жмем `Submit`. Все. Объект удален.

Как ни странно, Varnish кэширует отдельно html код страниц, и отдельно создает объекты кэша для статических файлов. То есть, если Вы сменили код генерации станицы и удалили ее объект из кэша, это еще не значит что кэш очистился для всех статических объектов, которые присутствуют на этой странице. Получается довольно круто: не нужно очищать кэш для тяжелых страниц при смене одной картинки. Можно грохнуть объект кэша именно для этой картинки.

При создании статьи использовались следующие материалы:  
<a href="https://www.varnish-cache.org/docs/2.1/reference/vcl.html" title="Varnish vcl reference" target="_blank">Varnish vcl reference</a>  
<a href="http://felipeferreira.net/?p=1373" target="_blank">Script to purge varnish cache</a>  
<a href="http://giantdorks.org/alain/exploring-methods-to-purge-varnish-cache/" title="exploring methods to purge varnish cache" target="_blank">Exploring methods to purge varnish cache</a>

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->

  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>
