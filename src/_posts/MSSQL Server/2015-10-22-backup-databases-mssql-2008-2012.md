---
id: 2937
title: Создаем backup всех баз даных в MSSQL 2008/2012
date: 2015-10-22T15:12:30+00:00
author: admin

guid: http://www.tech-notes.net/?p=2937
permalink: /backup-databases-mssql-2008-2012/
image: /wp-content/uploads/2014/08/mssql_logo.jpg
categories:
  - MSSQL Server
tags:
  - backup
  - mssql
---
Для того что бы сделать резервные копии всех баз даных в Вашем MSSQL сервере 2008/2012 года, можно воспользоавться SQL следующим запросом:

```sql
DECLARE @name VARCHAR(50) -- database name
DECLARE @path VARCHAR(256) -- path for backup files
DECLARE @fileName VARCHAR(256) -- filename for backup
DECLARE @fileDate VARCHAR(20) -- used for file name

SET @path = 'c:\db-backup\'
SELECT @fileDate = CONVERT(VARCHAR(20),GETDATE(),112)

DECLARE db_cursor CURSOR FOR
SELECT name
FROM master.dbo.sysdatabases
WHERE name NOT IN ('master','model','msdb','tempdb')

OPEN db_cursor
FETCH NEXT FROM db_cursor INTO @name

WHILE @@FETCH_STATUS = 0
BEGIN
SET @fileName = @path + @name + '_' + @fileDate + '.BAK'
BACKUP DATABASE @name TO DISK = @fileName

FETCH NEXT FROM db_cursor INTO @name
END

CLOSE db_cursor
DEALLOCATE db_cursor

```


В результате выполнения запроса, резервная копия каждой базы будет лежать в отдельном файле в папке c:\db-backup\. Естественно, перед началом нужно эту папку создать, иначе выполнение запроса закончится ошибкой.
