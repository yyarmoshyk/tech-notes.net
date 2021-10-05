---
id: 2261
title: Индэкс в таблицах MySQL
date: 2014-12-04T13:21:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=2261
permalink: /mysql-tables-uniq-index/
image: /wp-content/uploads/2014/09/thinknook-new-logo3.png
categories:
  - MySQL
tags:
  - mysql
  - индэкс
---
Для того что бы создать уникальный индэкс для таблицы `MySQL`, выпоните следующую команду:

```sql
ALTER IGNORE TABLE `имя_таблицы` ADD UNIQUE INDEX (`имя_колонки`);
```


Для того что бы удалить дублирующиеся записи в таблице:
```bash
DELETE FROM имя_таблицы  
WHERE id IN (SELECT *
  FROM (SELECT id FROM имя_таблицы
    GROUP BY имя_колонки HAVING (COUNT(*) > 1)
  ) AS A
);
```
