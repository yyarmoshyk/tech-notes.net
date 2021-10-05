---
id: 2505
title: Mysqldump средствами php
date: 2015-04-10T13:25:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=2505
permalink: /mysqldump-with-php/
image: /wp-content/uploads/2015/04/wddtshirt.jpg
categories:
  - MySQL
  - PHP
tags:
  - mysqldump
---
Я неоднократно сталкивался с ситуацией, когда нужно стянуть образ большой базы с хостинга, но к движку `mysql` нету удаленного доступа. `PhpMyAdmin` может не справиться с этим заданием, если размер базы составляет несколько сотен мегабайт. Как же быть?

Можно получить образ базы средствами `php`, без `shell_exec`. Тоесть сам бинарник `mysqldump` не выполняется.

Все исходники доступны в [репозитории на GitHub](https://github.com/ifsnop/mysqldump-php)

Основным файлом является [src/Ifsnop/Mysqldump/mysqldump.php](https://github.com/ifsnop/mysqldump-php/blob/master/src/Ifsnop/Mysqldump/Mysqldump.php)

Для упрощения процедуры я собрал моленький архив.

Его нужно скачать и распаковать

```bash
wget http://www.tech-notes.net/wp-content/uploads/2015/04/php-mysqldump.zip  
unzip php-mysqldump.zip
```

После этого заливаем папку `mysqldump` по фтп на сервер в папку сайта и открываем:  
http://www.имя_сайта/mysqldump

Индекс файл выводит форму, в которую нужно забить параметры соединения.
  * dbname
  * dbuser
  * password
  * dbhost

<center>
  <div id="gads">
  </div>
</center>

Так же его можно дернуть с помощью `curl`, предовставив все параметры соединения:

```bash
curl -X POST http://www.имя_сайта/mysqldump/index.php?dbname=database\&dbuser=mysql_user\&password=mysql_password\&dbhost=host_address
```

После выполнения, образ базы будет лежать в папке `files` и будет иметь имя `database.sql`

Этот файл можно скачивать и заворачивать на новом сервере:

```bash
wget http://www.имя_сайта/mysqldump/files/database.sql
```
