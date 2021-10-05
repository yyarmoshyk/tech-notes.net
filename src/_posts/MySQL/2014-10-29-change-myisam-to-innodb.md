---
id: 2027
title: Смена движка для MySQL таблиц с MyISAM на InnoDB
date: 2014-10-29T18:51:47+00:00
author: admin

guid: http://www.tech-notes.net/?p=2027
permalink: /change-myisam-to-innodb/
image: /wp-content/uploads/2014/10/myisam-innodb.jpg
categories:
  - MySQL
---
Смена движка для MySQL таблиц с `MyIsam` на `InnoDB` происходит в два этапа:
  1. Создаем запрос на основе существующих данных
  1. Выполняем новый запрос.

В консоли `mysql` выполнять эти шаги не удобно, поскольку результаты Вы получите строки с `пайпами` (символ `|` ) в начале и конце строки. Для баз данных с 100+ таблиц это очень не удобно.

Выполните следующий запрос в PhpMyAdmin:

```sql
SET @DATABASE_NAME = 'имя_бд';

SELECT  CONCAT('ALTER TABLE ', table_name, ' ENGINE=InnoDB;') AS sql_statements
FROM    information_schema.tables AS tb
WHERE   table_schema = @DATABASE_NAME
AND     `ENGINE` = 'MyISAM'
AND     `TABLE_TYPE` = 'BASE TABLE'
ORDER BY table_name DESC;
```

Результат копируем и вставляем в новый запрос, желательно между тэгами:

```bash
begin transaction;
результат вставить сюда
commit transaction;
```
