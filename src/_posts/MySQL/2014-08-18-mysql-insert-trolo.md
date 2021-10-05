---
id: 1388
title: То что, возможно, Вы не знали про Insert в MySQL
date: 2014-08-18T13:38:18+00:00
author: admin

guid: http://www.tech-notes.net/?p=1388
permalink: /mysql-insert-trolo/
image: /wp-content/uploads/2014/02/MYSQL_Color_3.png
categories:
  - MySQL
---
Каждый, кто в программировании работает с базами данных `MySQL`, сталкивался с оператором `INSERT`. Но оказывается не все, даже самые опытные разработчики, знают и умеют использовать его функционал полностью. На примере двух распространенных задач я хочу вам рассказать о тонкостях работы `insert`.

**Задача 1.**

Необходимо сделать счетчик посещаемости по IP адресам. Если в таблице IP адреса еще нету, его нужно добавить, а если есть - увеличить количество просмотренных страниц. Структура таблицы будет следующая:

```sql
CREATE TABLE IF NOT EXISTS 'statTable' (
'ip' varchar(15) NOT NULL,
'visits' int(11) unsigned NOT NULL,
UNIQUE KEY 'ip' ('ip')
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
```

Большинство разработчиков задачу будут решать следующим образом:

```php
$obj=$ourMysqli->query("select ip from statTable where ip='$ip'");
If ($obj->num_rows)
    $ourMysqli ->query("update statTable set visits=visits+1 where ip='$ip'");
else
   $ourMysqli ->query("insert into statTable (ip,visits) values('$ip',1)");
```


Если не выполнить предварительную проверку наличия записи в таблице и выполнить сразу `Insert` это приведет к возникновению ошибки `"duplicate value in a UNIQUE index or PRIMARY KEY"`, а `update` без предварительной проверки на наличие ряда может привести к тому что новая запись в таблице не появится.

Решает эту проблему в один запрос конструкция ON DUPLICATE KEY UPDATE. Используем ее следующим образом:

```php
$ourMysqli ->query("insert into statTable (ip,visits) values('$ip',1) on duplicate key update visits=visits+1");
```


`MySQL` выполняет операции последовательно. Прежде он пытается выполнить вставку нового ряда. Если поле с автоинкрементальным или уникальным индексом уже есть, тогда выполняется обновление ряда. `Update statTable set visits=visits+1 where ip='$ip'`

В этой конструкции есть два подводных камня. Давайте рассмотрим их.

**Особенность 1:**  
Изменим структуру таблицы следующим образом:

```sql
CREATE TABLE IF NOT EXISTS `ipstat` (
  `ip` varchar(15) NOT NULL,
  `ref` varchar(100) NOT NULL,
  `visits` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ref`),
  UNIQUE KEY `ip` (`ip`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
```


В результате у нас таблица имеет два уникальных индекса ip и ref. При выполнении запроса

```php
$ourMysqli ->query("insert into statTable (ip,visits,ref) values('$ip',1,'$ref') on duplicate key update visits=visits+1");
```

Обновление примет следующий вид:
```sql
update statTable set visits=visits+1 where ip='$ip' or ref='$ref' limit 1
```


Обратите внимание на то что изменение будет сделано только над первой найденной строкой, отвечающей условию `ip='$ip' or ref='$ref'`

**Особенность 2:**

Таблица имеет следующий вид:

```sql
CREATE TABLE IF NOT EXISTS `statTable` (
  `Id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ip` varchar(15) NOT NULL,
  `visits` int(11) unsigned NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `ip` (`ip`),
  KEY `Id` (`Id`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251 AUTO_INCREMENT=1;
```

К нашему уникальному индексу IP мы еще добавили первичный ключ, автоинкремент Id. Запрос остается без изменений.

```php
$ourMysqli ->query("insert into statTable (ip,visits) values('$ip',1) on duplicate key update visits=visits+1");
```

Если выполнить в консоли этот запрос, мы получим сообщение о том, что было изменено два ряда, а не один.

Причина такого, казалось бы странного поведения `MySQL`, проста. Сначала он пытается выполнить `Insert` и предварительно увеличивает `auto_increment` на единицу. Поскольку вставка не получается, выполняется `update`, но значение счетчика автоинкремента уже увеличено на единицу.

Эта особенно плохо, если проект высоко нагружен, поскольку значения автоинкремента будут исчерпаны в два раза быстрей.

**Задача 2.**

Необходимо в таблицу имеющую индекс `UNIQUE` или `PRIMARY KEY` добавить ряд, только в том случае, если строки с таким уникальным значением еще не нету.

Обычный алгоритм работы будет выглядеть так:

```php
$obj=$ourMysqli->query("select ip from statTable where ip='$ip'");
If (!$obj->num_rows)
   $ourMysqli ->query("insert into statTable set ip='$ip'");
```


Если предварительно не сделать проверку, на наличие строки с уникальным значением в таблице, выполнение скрипта будет остановлено, поскольку `Insert` приведет к ошибке `duplicate value in a UNIQUE index or PRIMARY KEY`.

Для решения этой проблемы можно использовать конструкцию INSERT IGNORE. В результате получится вот так:

```php
$ourMysqli ->query("insert ignore into statTable set ip='$ip'");
```


MySQL все делает за нас 🙂

[Оригинал](http://freehost.com.ua/faq/articles/to-chto-vozmozhno-vi-ne-znali-pro-insert-v-mysql/)
