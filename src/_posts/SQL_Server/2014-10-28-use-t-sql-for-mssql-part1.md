---
id: 2021
title: 'Шпаргалка по T-SQL - Часть 1'
date: 2014-10-28T17:42:57+00:00
author: admin

guid: http://www.tech-notes.net/?p=2021
permalink: /use-t-sql-for-mssql-part1/
image: /wp-content/uploads/2014/08/mssql_logo.jpg
categories:
  - SQL Server
tags:
  - t-sql
  - MSSQL
---
В этой статье я предоставлен базовый набор `t-sql` скриптов, предоставляющих информацию о метаданных `MSSQL`.
Если вы когда-нибудь пытались получить часть этой информации, с помощью `GUI`, я думаю вы будете приятно удивлены количеством той информации, которую можно получить мнгновенно.

### Изучаем сервера

Начнём с запросов, предоставляющих информацию о ваших серверах.

**Имена сервера и экземпляра**

```sql
Select @@SERVERNAME as [Server\Instance];
```


**версия SQL Server**

```sql
Select @@VERSION as SQLServerVersion;
```


**экземпляр SQL Server**

```sql
Select @@ServiceName AS ServiceInstance;
```


**Текущая БД** (БД, в контексте которой выполняется запрос)

```sql
Select DB_NAME() AS CurrentDB_Name;
```


Как долго ваш SQL Server работает после последнего перезапуска? Помните, что системная база данных tempdb пересоздаётся при каждом перезапуске SQL Server. Вот один из методов определения времени последнего перезапуска сервера.

```sql
Select  @@Servername AS ServerName ,
        create_date AS  ServerStarted ,
        DATEDIFF(s, create_date, GETDATE()) / 86400.0 AS DaysRunning ,
        DATEDIFF(s, create_date, GETDATE()) AS SecondsRunnig
FROM    sys.databases
WHERE   name = 'tempdb';

GO
```


### Связанные сервера

Связанные сервера – это соединения, позволяющие SQL Server’у обращаться к другим серверам с данными. Распределённые запросы могут быть запущенны на разных связанных серверах. Полезно знать – является ли ваш сервер баз данных изолированным от других, или он связан с другими серверами.

```sql
EXEC sp_helpserver;

--OR

EXEC sp_linkedservers;

--OR

SELECT  @@SERVERNAME AS Server ,
        Server_Id AS  LinkedServerID ,
        name AS LinkedServer ,
        Product ,
        Provider ,
        Data_Source ,
        Modify_Date
FROM    sys.servers
ORDER BY name;

GO
```


### Список всех баз данных

Во-первых, получим список всех баз данных на сервере. Помните, что на любом сервере есть системные базы данных (master, model, msdb, tempdb и distribution, если вы пользуетесь репликацией). Вы, вероятно, захотите исключить эти базы в следующих запросах.

Есть несколько путей для получения списка всех БД на T-SQL и ниже вы увидите некоторые из них. Каждый метод возвращает похожий результат, но с некоторыми отличиями.

```sql
EXEC sp_helpdb;

--OR

EXEC sp_Databases;

--OR

SELECT  @@SERVERNAME AS Server ,
        name AS DBName ,
        recovery_model_Desc AS RecoveryModel ,
        Compatibility_level AS CompatiblityLevel ,
        create_date ,
        state_desc
FROM    sys.databases
ORDER BY Name;

--OR

SELECT  @@SERVERNAME AS Server ,
        d.name AS DBName ,
        create_date ,
        compatibility_level ,
        m.physical_name AS FileName
FROM    sys.databases d
        JOIN sys.master_files m ON d.database_id = m.database_id
WHERE   m.[type] = 0 -- data files only
ORDER BY d.name;

GO
```


### Последний бэкап?

Каждый хороший dba должен узнать есть ли у него свежий бэкап.

```sql
Select  @@Servername AS ServerName ,
        d.Name AS DBName ,
        MAX(b.backup_finish_date) AS LastBackupCompleted
FROM    sys.databases d
        LEFT OUTER JOIN msdb..backupset b
                    ON b.database_name = d.name
                       AND b.[type] = 'D'
GROUP BY d.Name
ORDER BY d.Name;
```


Путь к файлу с последним бэкапом.

```sql
SELECT  @@Servername AS ServerName ,
        d.Name AS DBName ,
        b.Backup_finish_date ,
        bmf.Physical_Device_name
FROM    sys.databases d
        INNER JOIN msdb..backupset b ON b.database_name = d.name
                                        AND b.[type] = 'D'
        INNER JOIN msdb.dbo.backupmediafamily bmf ON b.media_set_id = bmf.media_set_id
ORDER BY d.NAME ,
        b.Backup_finish_date DESC;

GO
```


## Активные пользовательские соединения

это будет работать только в `SQL Server 2012` и выше, в предыдущих редакциях, в dmv sys.dm_exec_sessions отсутствовал столбец database_id. Чтобы узнать в каких БД в данный момент работают пользователи, можно воспользоваться sp_who.

```sql
SELECT  @@Servername AS Server ,
        DB_NAME(database_id) AS DatabaseName ,
        COUNT(database_id) AS Connections ,
        Login_name AS  LoginName ,
        MIN(Login_Time) AS Login_Time ,
        MIN(COALESCE(last_request_end_time, last_request_start_time))
                                                         AS  Last_Batch
FROM    sys.dm_exec_sessions
WHERE   database_id > 0
        AND DB_NAME(database_id) NOT IN ( 'master', 'msdb' )
GROUP BY database_id ,
         login_name
ORDER BY DatabaseName;
```


### Изучаем базы данных

Большинство из запросов, представленных в этом разделе, смотрят «внутрь» только одной БД, поэтому не забывайте выбирать нужную БД в SSMS или с помощью команды use database. Также помните, что вы всегда можете посмотреть в контексте какой БД будет выполнен запрос, с помощью select db_name().

Системная таблица sys.objects одна из ключевых для сбора информации об объектах, составляющих вашу модель данных.  
В примере **U** - таблицы. Попробуйте подставить другие значения type в WHERE

```sql
USE MyDatabase;
GO

SELECT  *
FROM    sys.objects
WHERE   type = 'U';
```


Ниже представлен список типов объектов, информацию о которых мы можем получить (смотрите документацию на `sys.objects` в [MSDN](http://msdn.microsoft.com/ru-ru/library/ms190324.aspx))  
* AF = статистическая функция (среда CLR);
* C = ограничение CHECK;
* D = DEFAULT (ограничение или изолированный);
* F = ограничение FOREIGN KEY;
* PK = ограничение PRIMARY KEY;
* P = хранимая процедура SQL;
* PC = хранимая процедура сборки (среда CLR);
* FN = скалярная функция SQL;
* FS = скалярная функция сборки (среда CLR);
* FT = возвращающая табличное значение функция сборки (среда CLR);
* R = правило (старый стиль, изолированный);
* RF = процедура фильтра репликации;
* S = системная базовая таблица;
* SN = синоним;
* SQ = очередь обслуживания;
* TA = триггер DML сборки (среда CLR);
* TR = триггер DML SQL;
* IF = встроенная возвращающая табличное значение функция SQL;
* TF = возвращающая табличное значение функция SQL;
* U = таблица (пользовательская);
* UQ = ограничение UNIQUE;
* V = представление;
* X = расширенная хранимая процедура;
* IT = внутренняя таблица.


## Расположение файлов баз данных
Физическое расположение выбранной БД, включая основной файл данных (mdf), и файл журнала транзакций (ldf), могут быть получены с помощью этих запросов.

```sql
EXEC sp_Helpfile;

--OR

SELECT  @@Servername AS Server ,
        DB_NAME() AS DB_Name ,
        File_id ,
        Type_desc ,
        Name ,
        LEFT(Physical_Name, 1) AS Drive ,
        Physical_Name ,
        RIGHT(physical_name, 3) AS Ext ,
        Size ,
        Growth
FROM    sys.database_files
ORDER BY File_id;

GO
```


## Таблицы

Конечно, Object Explorer в SSMS показывает полный список таблиц в выбранной БД, но часть информации с помощью GUI получить сложнее, чем с помощью скриптов. Стандарт ANSI предполагает обращение к представлениям INFORMATION_SCHEMA, но они не предоставят информацию об объектах, которые не являются частью стандарта (такие как триггеры, extended procedures и т.д.), поэтому лучше использовать представления каталога SQL Server.

```sql
EXEC sp_tables; -- Помните, что этот метод вернёт и таблицы, и представления

--OR

SELECT  @@Servername AS ServerName ,
        TABLE_CATALOG ,
        TABLE_SCHEMA ,
        TABLE_NAME
FROM     INFORMATION_SCHEMA.TABLES
WHERE   TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME ;

--OR

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        o.name AS 'TableName' ,
        o.[Type] ,
        o.create_date
FROM    sys.objects o
WHERE   o.Type = 'U' -- User table
ORDER BY o.name;

--OR

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        t.Name AS TableName,
        t.[Type],
        t.create_date
FROM    sys.tables t
ORDER BY t.Name;

GO
```


**Количество записей в таблице**

Таблицы с огромным количеством записей чаще оказывают серьёзное влияние на производительность.

В SSMS мы можем нажать правой кнопкой мыши на любую таблицу, открыть свойства на вкладке Storage и увидеть количество записей в таблице.  
[<img src="/wp-content/uploads/2014/10/257359db136270410f807ac89dea1c81.jpg" alt="257359db136270410f807ac89dea1c81" width="500" height="372" class="aligncenter size-full wp-image-2022" srcset="/wp-content/uploads/2014/10/257359db136270410f807ac89dea1c81.jpg 500w, /wp-content/uploads/2014/10/257359db136270410f807ac89dea1c81-170x126.jpg 170w, /wp-content/uploads/2014/10/257359db136270410f807ac89dea1c81-300x223.jpg 300w" sizes="(max-width: 500px) 100vw, 500px" />](/wp-content/uploads/2014/10/257359db136270410f807ac89dea1c81.jpg)

Довольно тяжело собрать вручную эту информацию обо всех таблицах. Опять же, если мы будем писать `SELECT COUNT(*) FROM TABLENAME` для каждой таблицы, нам придётся очень много печатать.

Скрипт, приведённый ниже, сгенерирует набор инструкций T-SQL для получения количества строк в каждой таблице текущей базы данных.

```sql
Select  'Select ''' + DB_NAME() + '.' + SCHEMA_NAME(SCHEMA_ID) + '.'
        + LEFT(o.name, 128) + ''' as DBName, count(*) as Count From ' + SCHEMA_NAME(SCHEMA_ID) + '.' + o.name
        + ';' AS ' Script generator to get counts for all tables'
FROM    sys.objects o
WHERE   o.[type] = 'U'
ORDER BY o.name;
```


**sp_msForEachTable** это недокументированная функция, которая «проходит» по всем таблицам в БД и выполняет запрос, подставляя вместо ‘?’ имя текущей таблицы. Так же существует похожая функция sp_msforeachdb, работающая на уровне баз данных.

```sql
CREATE TABLE #rowcount
    ( Tablename VARCHAR(128) ,
      Rowcnt INT );

EXEC sp_MSforeachtable 'insert into #rowcount select ''?'', count(*) from ?'

SELECT  *
FROM    #rowcount
ORDER BY Tablename ,
        Rowcnt;

DROP TABLE #rowcount;
```


**Самый быстрый способ получения количества записей – кластерный индекс**

```sql
Select  @@ServerName AS Server ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(p.object_id) AS SchemaName ,
        OBJECT_NAME(p.object_id) AS TableName ,
        i.Type_Desc ,
        i.Name AS IndexUsedForCounts ,
        SUM(p.Rows) AS Rows
FROM    sys.partitions p
        JOIN sys.indexes i ON i.object_id = p.object_id
                              AND i.index_id = p.index_id
WHERE   i.type_desc IN ( 'CLUSTERED', 'HEAP' )
                             -- This is key (1 index per table)
        AND OBJECT_SCHEMA_NAME(p.object_id) &lt;> 'sys'
GROUP BY p.object_id ,
        i.type_desc ,
        i.Name
ORDER BY SchemaName ,
        TableName;

-- OR

-- Похожий метод получения количества записей, но с использованием DMV dm_db_partition_stats
SELECT  @@ServerName AS ServerName ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(ddps.object_id) AS SchemaName ,
        OBJECT_NAME(ddps.object_id) AS TableName ,
        i.Type_Desc ,
        i.Name AS IndexUsedForCounts ,
        SUM(ddps.row_count) AS Rows
FROM    sys.dm_db_partition_stats ddps
        JOIN sys.indexes i ON i.object_id = ddps.object_id
                              AND i.index_id = ddps.index_id
WHERE   i.type_desc IN ( 'CLUSTERED', 'HEAP' )
                              -- This is key (1 index per table)
        AND OBJECT_SCHEMA_NAME(ddps.object_id) &lt;> 'sys'
GROUP BY ddps.object_id ,
        i.type_desc ,
        i.Name
ORDER BY SchemaName ,
        TableName;

GO
```


**Поиск куч** (таблиц без кластерных индексов)  
Работа с кучами – это как работа с плоским файлом, вместо базы данных. Если вы хотите гарантированно получать полное сканирование таблицы при выполнении любого запроса, используйте кучи. Рекомендуется добавлять primary key ко всем таблицам-кучам.  
**Метод 1**:

```sql
Select  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        t.Name AS HeapTable ,
        t.Create_Date
FROM    sys.tables t
        INNER JOIN sys.indexes i ON t.object_id = i.object_id
                                    AND i.type_desc = 'HEAP'
ORDER BY t.Name
```


**Метод 2**:

```sql
Select  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        t.Name AS HeapTable ,
        t.Create_Date
FROM    sys.tables t
WHERE    OBJECTPROPERTY(OBJECT_ID, 'TableHasClustIndex') = 0
ORDER BY t.Name;
```


**Метод 3** + количество записей:

```sql
Select  @@ServerName AS Server ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(ddps.object_id) AS SchemaName ,
        OBJECT_NAME(ddps.object_id) AS TableName ,
        i.Type_Desc ,
        SUM(ddps.row_count) AS Rows
FROM    sys.dm_db_partition_stats AS ddps
        JOIN sys.indexes i ON i.object_id = ddps.object_id
                              AND i.index_id = ddps.index_id
WHERE   i.type_desc = 'HEAP'
        AND OBJECT_SCHEMA_NAME(ddps.object_id) &lt;> 'sys'
GROUP BY ddps.object_id ,
        i.type_desc
ORDER BY TableName;
```


### Разбираемся с активностью в таблице

При работах по оптимизации производительности, очень важно знать какие таблицы активно читаются, а в какие идёт активная запись. Ранее мы узнали сколько записей в наших таблицах, сейчас посмотрим как часто в них пишут и читают.

**Чтение/запись таблицы**:

  * Кучи не рассматриваются, у них нет индексов
  * Обрабатываются только те таблицы, к которым обращались после запуска SQL Server

```sql
Select  @@ServerName AS ServerName ,
        DB_NAME() AS DBName ,
        OBJECT_NAME(ddius.object_id) AS TableName ,
        SUM(ddius.user_seeks + ddius.user_scans + ddius.user_lookups)
                                                               AS  Reads ,
        SUM(ddius.user_updates) AS Writes ,
        SUM(ddius.user_seeks + ddius.user_scans + ddius.user_lookups
            + ddius.user_updates) AS [Reads&Writes] ,
        ( SELECT    DATEDIFF(s, create_date, GETDATE()) / 86400.0
          FROM      master.sys.databases
          WHERE     name = 'tempdb'
        ) AS SampleDays ,
        ( SELECT    DATEDIFF(s, create_date, GETDATE()) AS SecoundsRunnig
          FROM      master.sys.databases
          WHERE     name = 'tempdb'
        ) AS SampleSeconds
FROM    sys.dm_db_index_usage_stats ddius
        INNER JOIN sys.indexes i ON ddius.object_id = i.object_id
                                     AND i.index_id = ddius.index_id
WHERE    OBJECTPROPERTY(ddius.object_id, 'IsUserTable') = 1
        AND ddius.database_id = DB_ID()
GROUP BY OBJECT_NAME(ddius.object_id)
ORDER BY [Reads&Writes] DESC;

GO
```


Намного более продвинутая версия этого запроса представлена курсором, собирающим информацию по всем таблицам всех баз данных на сервере.

Операции чтения и записи  
Кучи пропущены, у них нет индексов

  * Только таблицы, использовавшиеся после перезапуска SQL Server
  * В запросе используется курсор для получения информации во всех БД
  * Единый отчёт, хранится в tempdb

```sql
DECLARE DBNameCursor CURSOR
FOR
    SELECT  Name
    FROM    sys.databases
    WHERE    Name NOT IN ( 'master', 'model', 'msdb', 'tempdb',
                            'distribution' )
    ORDER BY Name;

DECLARE @DBName NVARCHAR(128)

DECLARE @cmd VARCHAR(4000)

IF OBJECT_ID(N'tempdb..TempResults') IS NOT NULL
    BEGIN
        DROP TABLE tempdb..TempResults
    END

CREATE TABLE tempdb..TempResults
    (
      ServerName NVARCHAR(128) ,
      DBName NVARCHAR(128) ,
      TableName NVARCHAR(128) ,
      Reads INT ,
      Writes INT ,
      ReadsWrites INT ,
      SampleDays DECIMAL(18, 8) ,
      SampleSeconds INT
    )

OPEN DBNameCursor

FETCH NEXT FROM DBNameCursor INTO @DBName
WHILE @@fetch_status = 0
    BEGIN

----------------------------------------------------
-- Print @DBName

        SELECT   @cmd = 'Use ' + @DBName + '; '
        SELECT   @cmd = @cmd + ' Insert Into tempdb..TempResults
SELECT @@ServerName AS ServerName,
DB_NAME() AS DBName,
object_name(ddius.object_id) AS TableName ,
SUM(ddius.user_seeks
+ ddius.user_scans
+ ddius.user_lookups) AS Reads,
SUM(ddius.user_updates) as Writes,
SUM(ddius.user_seeks
+ ddius.user_scans
+ ddius.user_lookups
+ ddius.user_updates) as ReadsWrites,
(SELECT datediff(s,create_date, GETDATE()) / 86400.0
FROM sys.databases WHERE name = ''tempdb'') AS SampleDays,
(SELECT datediff(s,create_date, GETDATE())
FROM sys.databases WHERE name = ''tempdb'') as SampleSeconds
FROM sys.dm_db_index_usage_stats ddius
INNER JOIN sys.indexes i
ON ddius.object_id = i.object_id
AND i.index_id = ddius.index_id
WHERE objectproperty(ddius.object_id,''IsUserTable'') = 1 --True
AND ddius.database_id = db_id()
GROUP BY object_name(ddius.object_id)
ORDER BY ReadsWrites DESC;'

--PRINT @cmd
        EXECUTE (@cmd)

-----------------------------------------------------

        FETCH NEXT FROM DBNameCursor INTO @DBName
    END

CLOSE DBNameCursor

DEALLOCATE DBNameCursor

SELECT  *
FROM    tempdb..TempResults
ORDER BY DBName ,
        TableName;
--DROP TABLE tempdb..TempResults;
```


**Примечание:** курсор не отработает, если у вас в списке есть базы данных с состоянием, отличным от ONLINE.

### Представления

Представления – это, условно говоря, запросы, хранящиеся в БД. Вы можете думать о них, как о виртуальных таблицах. Данные не хранятся в представлениях, но в наших запросах мы ссылаемся на них точно так же, как и на таблицы.

```sql
Select  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        o.name AS ViewName ,
        o.[Type] ,
        o.create_date
FROM    sys.objects o
WHERE   o.[Type] = 'V' -- View
ORDER BY o.NAME  

--OR

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        Name AS ViewName ,
        create_date
FROM    sys.Views
ORDER BY Name

--OR

SELECT  @@Servername AS ServerName ,
        TABLE_CATALOG ,
        TABLE_SCHEMA ,
        TABLE_NAME ,
        TABLE_TYPE
FROM     INFORMATION_SCHEMA.TABLES
WHERE   TABLE_TYPE = 'VIEW'
ORDER BY TABLE_NAME

--OR

-- CREATE VIEW Code
SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        o.name AS 'ViewName' ,
        o.Type ,
        o.create_date ,
        sm.[DEFINITION] AS 'View script'
FROM    sys.objects o
        INNER JOIN sys.sql_modules sm ON o.object_id = sm.OBJECT_ID
WHERE   o.Type = 'V' -- View
ORDER BY o.NAME;

GO
```


### Синонимы

Использование синонимов – это редкость, но разбирательства могут вызвать определённые затруднения, если вы к ним не готовы.

```sql
Select  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        o.name AS ViewName ,
        o.Type ,
        o.create_date
FROM    sys.objects o
WHERE   o.[Type] = 'SN' -- Synonym
ORDER BY o.NAME;

--OR
-- дополнительная информация о синонимах

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        s.name AS synonyms ,
        s.create_date ,
        s.base_object_name
FROM    sys.synonyms s
ORDER BY s.name;

GO
```


### Хранимые процедуры

(Stored Procedures)  
Хранимые процедуры – это группа скриптов, которые компилируются в единственный план выполнения.

```sql
-- Хранимые процедуры
SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        o.name AS StoredProcedureName ,
        o.[Type] ,
        o.create_date
FROM    sys.objects o
WHERE   o.[Type] = 'P' -- Stored Procedures
ORDER BY o.name

--OR
-- Дополнительная информация о ХП

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        o.name AS 'ViewName' ,
        o.[type] ,
        o.Create_date ,
        sm.[definition] AS 'Stored Procedure script'
FROM    sys.objects o
        INNER JOIN sys.sql_modules sm ON o.object_id = sm.object_id
WHERE   o.[type] = 'P' -- Stored Procedures
        -- AND sm.[definition] LIKE '%insert%'
        -- AND sm.[definition] LIKE '%update%'
        -- AND sm.[definition] LIKE '%delete%'
        -- AND sm.[definition] LIKE '%tablename%'
ORDER BY o.name;

GO
```


Добавив простое условие в WHERE мы можем получить информацию только о тех хранимых процедурах, которые, например, выполняют операции INSERT.

```sql
WHERE   o.[type]  = 'P' -- Stored Procedures
        AND sm.definition LIKE '%insert%'
ORDER BY o.name
…
```


Немного модифицировав условие в WHERE, можно собрать информацию о ХП, производящих обновление, удаление или же обращающихся к определённым таблицам.

### Функции

Функции хранятся в SQL Server, принимают какие-либо параметры и выполняют определённые действия, либо вычисления, после чего возвращают результат.

```sql
-- Функции

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        o.name AS 'Functions' ,
        o.[Type] ,
        o.create_date
FROM    sys.objects o
WHERE   o.Type = 'FN' -- Function
ORDER BY o.NAME;

--OR
-- Дополнительная информация о функциях

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        o.name AS 'FunctionName' ,
        o.[type] ,
        o.create_date ,
        sm.[DEFINITION] AS 'Function script'
FROM    sys.objects o
        INNER JOIN sys.sql_modules sm ON o.object_id = sm.OBJECT_ID
WHERE   o.[Type] = 'FN' -- Function
ORDER BY o.NAME;

GO
```


### Триггеры

Триггер – это что-то вроде хранимой процедуры, которая выполняется в ответ на определённые действия с той таблицей, которой этот триггер принадлежит.

```sql
Select  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        parent.name AS TableName ,
        o.name AS TriggerName ,
        o.[Type] ,
        o.create_date
FROM    sys.objects o
        INNER JOIN sys.objects parent ON o.parent_object_id = parent.object_id
WHERE   o.Type = 'TR' -- Triggers
ORDER BY parent.name ,
        o.NAME

--OR

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        Parent_id ,
        name AS TriggerName ,
        create_date
FROM    sys.triggers
WHERE   parent_class = 1
ORDER BY name;

--OR
-- Дополнительная информация о триггерах

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        OBJECT_NAME(Parent_object_id) AS TableName ,
        o.name AS 'TriggerName' ,
        o.Type ,
        o.create_date ,
        sm.[DEFINITION] AS 'Trigger script'
FROM    sys.objects o
        INNER JOIN sys.sql_modules sm ON o.object_id = sm.OBJECT_ID
WHERE   o.Type = 'TR' -- Triggers
ORDER BY o.NAME;

GO
```
