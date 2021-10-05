---
id: 2242
title: Отображение размера баз даных в MySQL
date: 2014-11-28T08:41:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=2242
permalink: /mysql-database-size/
image: /wp-content/uploads/2014/10/myisam-innodb.jpg
categories:
  - MySQL
---
Для того что бы узнать размер баз даных, воспользуйтесь следующим запросом:

```sql
SELECT table_schema "Data Base Name",
sum( data_length + index_length ) / 1024 / 1024 "Data Base Size in MB",
sum( data_free )/ 1024 / 1024 "Free Space in MB"
FROM information_schema.TABLES GROUP BY table_schema ;
```


Отображение размер таблиц в базе данных:

```sql
SELECT table_name AS `Table`,
round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB`
FROM information_schema.TABLES
where table_schema = 'имя_базы' ORDER BY (data_length + index_length) DESC;
```


Информация о месте на диске, занимаемом базами `mysql` (выполняется в bash):
```bash
mysql -e 'SELECT table_schema `Data Base Name`, sum( data_length + index_length ) `Data Base Size in B` FROM information_schema.TABLES GROUP BY table_schema' |grep -v `^Data` |awk '{print $2}' |paste -sd+ |bc
```
