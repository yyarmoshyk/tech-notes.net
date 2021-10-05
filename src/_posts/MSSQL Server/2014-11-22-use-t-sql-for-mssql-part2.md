---
id: 2025
title: 'Шпаргалка по T-SQL - Часть 2'
date: 2014-11-22T09:28:03+00:00
author: admin

guid: http://www.tech-notes.net/?p=2025
permalink: /use-t-sql-for-mssql-part2/
image: /wp-content/uploads/2014/08/mssql_logo.jpg
categories:
  - MSSQL Server
tags:
  - FromHabrSandbox
  - tsql
---
В продолжение [первой части](/use-t-sql-for-mssql-part1/):

### Углубляемся в модель данных

Ранее, мы использовали скрипты, которые дали нам представление о «верхнем уровне» объектов, составляющих нашу базу данных.

### Столбцы

### Следующий скрипт описывает таблицы и столбцы из всей базы данных.

```sql
SELECT  @@Servername AS Server ,
        DB_NAME() AS DBName ,
        isc.Table_Name AS TableName ,
        isc.Table_Schema AS SchemaName ,
        Ordinal_Position AS  Ord ,
        Column_Name ,
        Data_Type ,
        Numeric_Precision AS  Prec ,
        Numeric_Scale AS  Scale ,
        Character_Maximum_Length AS LEN , -- -1 means MAX like Varchar(MAX)
        Is_Nullable ,
        Column_Default ,
        Table_Type
FROM     INFORMATION_SCHEMA.COLUMNS isc
        INNER JOIN  information_schema.tables ist
              ON isc.table_name = ist.table_name
--      WHERE Table_Type = 'BASE TABLE' -- 'Base Table' or 'View'
ORDER BY DBName ,
        TableName ,
        SchemaName ,
        Ordinal_position;  

-- Имена столбцов и количество повторов
-- Используется для поиска одноимённых столбцов с разными типами данных/длиной

SELECT  @@Servername AS Server ,
        DB_NAME() AS DBName ,
        Column_Name ,
        Data_Type ,
        Numeric_Precision AS  Prec ,
        Numeric_Scale AS  Scale ,
        Character_Maximum_Length ,
        COUNT(*) AS Count
FROM     information_schema.columns isc
        INNER JOIN  information_schema.tables ist
               ON isc.table_name = ist.table_name
WHERE   Table_type = 'BASE TABLE'
GROUP BY Column_Name ,
        Data_Type ,
        Numeric_Precision ,
        Numeric_Scale ,
        Character_Maximum_Length;

-- Информация по используемым типам данных

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        Data_Type ,
        Numeric_Precision AS  Prec ,
        Numeric_Scale AS  Scale ,
        Character_Maximum_Length AS [Length] ,
        COUNT(*) AS COUNT
FROM     information_schema.columns isc
        INNER JOIN  information_schema.tables ist
               ON isc.table_name = ist.table_name
WHERE   Table_type = 'BASE TABLE'
GROUP BY Data_Type ,
        Numeric_Precision ,
        Numeric_Scale ,
        Character_Maximum_Length
ORDER BY Data_Type ,
        Numeric_Precision ,
        Numeric_Scale ,
        Character_Maximum_Length  

-- Large object data types or Binary Large Objects(BLOBs)
-- Помните, что индексы по этим таблицам не могут быть перестроены в режиме "online"

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        isc.Table_Name ,
        Ordinal_Position AS  Ord ,
        Column_Name ,
        Data_Type AS  BLOB_Data_Type ,
        Numeric_Precision AS  Prec ,
        Numeric_Scale AS  Scale ,
        Character_Maximum_Length AS [Length]
FROM     information_schema.columns isc
        INNER JOIN  information_schema.tables ist
               ON isc.table_name = ist.table_name
WHERE   Table_type = 'BASE TABLE'
        AND ( Data_Type IN ( 'text', 'ntext', 'image', 'XML' )
              OR ( Data_Type IN ( 'varchar', 'nvarchar', 'varbinary' )
                   AND Character_Maximum_Length = -1
                 )
            ) -- varchar(max), nvarchar(max), varbinary(max)
ORDER BY isc.Table_Name ,
        Ordinal_position;
```


### Значения по умолчанию

Значение по умолчанию – это значение, которое будет сохранено, если никакого значения для столбца не будет задано при вставке. Зачастую, для столбцов хранящих дату ставят get_date(). Также, значения по умолчанию используются для аудита – вставляется system_user для определения учётной записи пользователя, совершившего определённое действие.

```sql
-- Table Defaults

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        parent.name AS TableName ,
        o.name AS Defaults ,
        o.[Type] ,
        o.Create_date
FROM    sys.objects o
        INNER JOIN sys.objects parent
               ON o.parent_object_id = parent.object_id
WHERE   o.[Type] = 'D' -- Defaults
ORDER BY parent.name ,
        o.NAME

--OR
-- Column Defaults

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        OBJECT_SCHEMA_NAME(parent_object_id) AS SchemaName ,
        OBJECT_NAME(parent_object_id) AS TableName ,
        parent_column_id AS  Column_NBR ,
        Name AS DefaultName ,
        [type] ,
        type_desc ,
        create_date ,
        OBJECT_DEFINITION(object_id) AS Defaults
FROM    sys.default_constraints
ORDER BY TableName ,
        Column_NBR

--OR
-- Column Defaults

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        OBJECT_SCHEMA_NAME(t.object_id) AS SchemaName ,
        t.Name AS TableName ,
        c.Column_ID AS Ord ,
        c.Name AS Column_Name ,
        OBJECT_NAME(default_object_id) AS DefaultName ,
        OBJECT_DEFINITION(default_object_id) AS Defaults
FROM    sys.Tables t
        INNER JOIN sys.columns c ON t.object_id = c.object_id
WHERE    default_object_id &lt;> 0
ORDER BY TableName ,
        SchemaName ,
        c.Column_ID

GO
```


### Вычисляемые столбцы

Вычисляемые столбцы – это столбцы, значения в которых вычисляются на основании, как правило, значений в других столбцах таблицы.

```sql
SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(object_id) AS SchemaName ,
        OBJECT_NAME(object_id) AS Tablename ,
        Column_id ,
        Name AS  Computed_Column ,
        [Definition] ,
        is_persisted
FROM    sys.computed_columns
ORDER BY SchemaName ,
        Tablename ,
        [Definition];

--Or
-- Computed Columns

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(t.object_id) AS SchemaName,
        t.Name AS TableName ,
        c.Column_ID AS Ord ,
        c.Name AS Computed_Column
FROM    sys.Tables t
        INNER JOIN sys.Columns c ON t.object_id = c.object_id
WHERE   is_computed = 1
ORDER BY t.Name ,
        SchemaName ,
        c.Column_ID

GO
```


### Столбцы identity

Столбцы IDENTITY автоматически заполняются системой уникальными значениями. Обычно используются для хранения порядкового номера записи в таблице.

```sql
SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DBName ,
        OBJECT_SCHEMA_NAME(object_id) AS SchemaName ,
        OBJECT_NAME(object_id) AS TableName ,
        Column_id ,
        Name AS  IdentityColumn ,
        Seed_Value ,
        Last_Value
FROM    sys.identity_columns
ORDER BY SchemaName ,
        TableName ,
        Column_id;

GO
```


### Ключи и индексы

Наличие первичного ключа и соответствующего индекса у таблицы – это одна из best practice. Ещё одна best practice заключается в том, что внешние ключи так же должны иметь индекс, построенный по столбцам, входящим во внешний ключ. Индексы, построенные «по внешним ключам» отлично подходят для соединения таблиц. Эти индексы так же хорошо сказываются на производительности при удалении записей.

### Какие индексы у нас есть?

Скрипт для поиска всех индексов во всех таблицах текущей БД.

```sql
SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        o.Name AS TableName ,
        i.Name AS IndexName
FROM    sys.objects o
        INNER JOIN sys.indexes i ON o.object_id = i.object_id
WHERE   o.Type = 'U' -- User table
        AND LEFT(i.Name, 1) &lt;> '_' -- Remove hypothetical indexes
ORDER BY o.NAME ,
        i.name;

GO
```


### Каких индексов не хватает?

На основании ранее исполнявшихся запросов, SQL Server предоставляет информацию об отсутствующих индексах в БД, создание которых может увеличить производительность.

Не добавляйте эти индексы вслепую. Я бы подумал о каждом из предложенных индексов. Использование включенных столбцов, например, может аукнуться серьёзным увеличением объёмов.

```sql
-- Отсутствующие индексы из DMV

SELECT  @@ServerName AS ServerName ,
        DB_NAME() AS DBName ,
        t.name AS 'Affected_table' ,
        ( LEN(ISNULL(ddmid.equality_columns, N'')
              + CASE WHEN ddmid.equality_columns IS NOT NULL
                          AND ddmid.inequality_columns IS NOT NULL THEN ','
                     ELSE ''
                END) - LEN(REPLACE(ISNULL(ddmid.equality_columns, N'')
                                   + CASE WHEN ddmid.equality_columns
                                                             IS NOT NULL
                                               AND ddmid.inequality_columns
                                                             IS NOT NULL
                                          THEN ','
                                          ELSE ''
                                     END, ',', '')) ) + 1 AS K ,
        COALESCE(ddmid.equality_columns, '')
        + CASE WHEN ddmid.equality_columns IS NOT NULL
                    AND ddmid.inequality_columns IS NOT NULL THEN ','
               ELSE ''
          END + COALESCE(ddmid.inequality_columns, '') AS Keys ,
        COALESCE(ddmid.included_columns, '') AS [include] ,
        'Create NonClustered Index IX_' + t.name + '_missing_'
        + CAST(ddmid.index_handle AS VARCHAR(20))
        + ' On ' + ddmid.[statement] COLLATE database_default
        + ' (' + ISNULL(ddmid.equality_columns, '')
        + CASE WHEN ddmid.equality_columns IS NOT NULL
                    AND ddmid.inequality_columns IS NOT NULL THEN ','
               ELSE ''
          END + ISNULL(ddmid.inequality_columns, '') + ')'
        + ISNULL(' Include (' + ddmid.included_columns + ');', ';')
                                                  AS sql_statement ,
        ddmigs.user_seeks ,
        ddmigs.user_scans ,
        CAST(( ddmigs.user_seeks + ddmigs.user_scans )
        * ddmigs.avg_user_impact AS BIGINT) AS 'est_impact' ,
        avg_user_impact ,
        ddmigs.last_user_seek ,
        ( SELECT    DATEDIFF(Second, create_date, GETDATE()) Seconds
          FROM      sys.databases
          WHERE     name = 'tempdb'
        ) SecondsUptime
FROM    sys.dm_db_missing_index_groups ddmig
        INNER JOIN sys.dm_db_missing_index_group_stats ddmigs
               ON ddmigs.group_handle = ddmig.index_group_handle
        INNER JOIN sys.dm_db_missing_index_details ddmid
               ON ddmig.index_handle = ddmid.index_handle
        INNER JOIN sys.tables t ON ddmid.OBJECT_ID = t.OBJECT_ID
WHERE   ddmid.database_id = DB_ID()
ORDER BY est_impact DESC;

GO
```


### Внешние ключи

Внешние ключи определяют связь между таблицами и используются для контроля ссылочной целостности. На диаграмме сущность-связь линии между таблицами обозначают внешние ключи.

```sql
-- Foreign Keys

SELECT  @@Servername AS ServerName ,
        DB_NAME() AS DB_Name ,
        parent.name AS 'TableName' ,
        o.name AS 'ForeignKey' ,
        o.[Type] ,
        o.Create_date
FROM    sys.objects o
        INNER JOIN sys.objects parent ON o.parent_object_id = parent.object_id
WHERE   o.[Type] = 'F' -- Foreign Keys
ORDER BY parent.name ,
        o.name

--OR

SELECT  f.name AS ForeignKey ,
        SCHEMA_NAME(f.SCHEMA_ID) AS SchemaName ,
        OBJECT_NAME(f.parent_object_id) AS TableName ,
        COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName ,
        SCHEMA_NAME(o.SCHEMA_ID) ReferenceSchemaName ,
        OBJECT_NAME(f.referenced_object_id) AS ReferenceTableName ,
        COL_NAME(fc.referenced_object_id, fc.referenced_column_id)
                                              AS ReferenceColumnName
FROM    sys.foreign_keys AS f
        INNER JOIN sys.foreign_key_columns AS fc
               ON f.OBJECT_ID = fc.constraint_object_id
        INNER JOIN sys.objects AS o ON o.OBJECT_ID = fc.referenced_object_id
ORDER BY TableName ,
        ReferenceTableName;

GO
```


### Пропущенные индексы по внешним ключам

Желательно иметь индекс, построенный по столбцам, входящим во внешний ключ. Это значительно ускоряет соединения таблиц, которые, обычно, всё равно соединяются по внешнему ключу. Эти индексы так же значительно ускоряют операции удаления. Если такого индекса нет, SQL Server будет производить table scan связанной таблицы, при каждом удалении записи из «первой» таблицы.

```sql
-- Foreign Keys missing indexes
-- Помните, что этот скрипт работает только для создания индексов по одному столбцу
-- Внешние ключи, состоящие более чем из одного столбца, не отслеживаются

SELECT  DB_NAME() AS DBName ,
        rc.Constraint_Name AS FK_Constraint ,
-- rc.Constraint_Catalog AS FK_Database,
-- rc.Constraint_Schema AS FKSch,
        ccu.Table_Name AS FK_Table ,
        ccu.Column_Name AS FK_Column ,
        ccu2.Table_Name AS ParentTable ,
        ccu2.Column_Name AS ParentColumn ,
        I.Name AS IndexName ,
        CASE WHEN I.Name IS NULL
             THEN 'IF NOT EXISTS (SELECT * FROM sys.indexes
                                    WHERE object_id = OBJECT_ID(N'''
                  + RC.Constraint_Schema + '.' + ccu.Table_Name
                  + ''') AND name = N''IX_' + ccu.Table_Name + '_'
                  + ccu.Column_Name + ''') '
                  + 'CREATE NONCLUSTERED INDEX IX_' + ccu.Table_Name + '_'
                  + ccu.Column_Name + ' ON ' + rc.Constraint_Schema + '.'
                  + ccu.Table_Name + '( ' + ccu.Column_Name
                  + ' ASC ) WITH (PAD_INDEX = OFF,
                                   STATISTICS_NORECOMPUTE = OFF,
                                   SORT_IN_TEMPDB = ON, IGNORE_DUP_KEY = OFF,
                                   DROP_EXISTING = OFF, ONLINE = ON);'
             ELSE ''
        END AS SQL
FROM     information_schema.referential_constraints RC
        JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
         ON rc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
        JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu2
         ON rc.UNIQUE_CONSTRAINT_NAME = ccu2.CONSTRAINT_NAME
        LEFT JOIN sys.columns c ON ccu.Column_Name = C.name
                                AND ccu.Table_Name = OBJECT_NAME(C.OBJECT_ID)
        LEFT JOIN sys.index_columns ic ON C.OBJECT_ID = IC.OBJECT_ID
                                          AND c.column_id = ic.column_id
                                          AND index_column_id  = 1

                                           -- index found has the foreign key
                                          --  as the first column

        LEFT JOIN sys.indexes i ON IC.OBJECT_ID = i.OBJECT_ID
                                   AND ic.index_Id = i.index_Id
WHERE   I.name IS NULL
ORDER BY FK_table ,
        ParentTable ,
        ParentColumn;

GO
```


### Зависимости

Рассмотривается три разных метода для «реверс-инжиниринга» зависимостей в БД. Первый метода – использовать хранимую процедуру sp_msdependecies. Второй – системные таблицы, связанные со внешними ключами. Третий метод – использовать CTE.

**Sp_msdependencies** – это недокументированная хранимая процедура, которая может быть очень полезна для разбора сложных взаимозависимостей таблиц.

```sql
EXEC sp_msdependencies '?' -- Displays Help

sp_MSobject_dependencies name = NULL, type = NULL, flags = 0x01fd
  name:  name or null (all objects of type)
  type:  type number (see below) or null
         if both null, get all objects in database
  flags is a bitmask of the following values:
         0x10000  = return multiple parent/child rows per object
         0x20000  = descending return order
         0x40000  = return children instead of parents
         0x80000  = Include input object in output result set
         0x100000 = return only firstlevel (immediate) parents/children
         0x200000 = return only DRI dependencies
         power(2, object type number(s))  to return in results set:
                0 (1        - 0x0001)     - UDF
                1 (2        - 0x0002)     - system tables or MS-internal objects
                2 (4        - 0x0004)     - view
                3 (8        - 0x0008)     - user table
                4 (16       - 0x0010)     - procedure
                5 (32       - 0x0020)     - log
                6 (64       - 0x0040)     - default
                7 (128      - 0x0080)     - rule
                8 (256      - 0x0100)     - trigger
                12 (1024     - 0x0400) - uddt
         shortcuts:
                29   (0x011c) - trig, view, user table, procedure
                448  (0x00c1) - rule, default, datatype
                4606 (0x11fd) - all but systables/objects
                4607 (0x11ff) – all
```


Если мы выведем все зависимости, используя sp_msdependencies, мы получим четыре столбца: Type, ObjName, Owner(Schema), Sequence.

Обратите внимание на номер последовательности (Sequence) – он начинается с 1 и последовательно увеличивается. Sequence – это «порядковый номер» зависимости.

Я несколько раз использовал этот метод, когда мне нужно было выполнить архивирование или удаление на очень большой БД. Если вы знаете зависимости таблицы, значит у вас есть «дорожная карта» — в каком порядке вам нужно архивировать или удалять данные. Начните с таблицы с самым большим значение в столбце Sequence и двигайтесь от него в обратном порядке – от большего к меньшему. Таблицы с одинаковым значением Sequence могут быть удалены одновременно. Этот метод не нарушает ни одного из ограничений внешних ключей и позволяет перенести/удалить записи без временного удаления и перестроения ограничений (constraints).

```sql
EXEC sp_msdependencies NULL    -- Все зависимости в БД

EXEC sp_msdependencies NULL, 3 -- Зависимости определённой таблицы
```


[<img src="/wp-content/uploads/2014/11/781a25647b48498e9aeeb4b87875991c.jpg" alt="781a25647b48498e9aeeb4b87875991c" width="420" height="121" class="aligncenter size-full wp-image-2209" srcset="/wp-content/uploads/2014/11/781a25647b48498e9aeeb4b87875991c.jpg 420w, /wp-content/uploads/2014/11/781a25647b48498e9aeeb4b87875991c-170x48.jpg 170w, /wp-content/uploads/2014/11/781a25647b48498e9aeeb4b87875991c-300x86.jpg 300w" sizes="(max-width: 420px) 100vw, 420px" />](/wp-content/uploads/2014/11/781a25647b48498e9aeeb4b87875991c.jpg)

В SSMS, если вы нажмёте правой кнопкой мыши на имя таблицы, вы сможете выбрать «View Dependencies» и «Объекты, которые зависят от TABLENAME»:

[<img src="/wp-content/uploads/2014/11/fcb75633a56c080feb852572736cc737.jpg" alt="fcb75633a56c080feb852572736cc737" width="400" height="201" class="aligncenter size-full wp-image-2210" srcset="/wp-content/uploads/2014/11/fcb75633a56c080feb852572736cc737.jpg 400w, /wp-content/uploads/2014/11/fcb75633a56c080feb852572736cc737-170x85.jpg 170w, /wp-content/uploads/2014/11/fcb75633a56c080feb852572736cc737-300x150.jpg 300w" sizes="(max-width: 400px) 100vw, 400px" />](/wp-content/uploads/2014/11/fcb75633a56c080feb852572736cc737.jpg)

Мы также можем получить эту информацию следующим способом:

```sql
-- sp_MSdependencies — Только верхний уровень
-- Объекты, которые зависят от указанного объекта

EXEC sp_msdependencies N'Sales.Customer',null, 1315327 -- Change Table Name
```


[<img src="/wp-content/uploads/2014/11/54335c18ec0f9b53729074e3dcdf5066.jpg" alt="54335c18ec0f9b53729074e3dcdf5066" width="420" height="103" class="aligncenter size-full wp-image-2211" srcset="/wp-content/uploads/2014/11/54335c18ec0f9b53729074e3dcdf5066.jpg 420w, /wp-content/uploads/2014/11/54335c18ec0f9b53729074e3dcdf5066-170x41.jpg 170w, /wp-content/uploads/2014/11/54335c18ec0f9b53729074e3dcdf5066-300x73.jpg 300w" sizes="(max-width: 420px) 100vw, 420px" />](/wp-content/uploads/2014/11/54335c18ec0f9b53729074e3dcdf5066.jpg)

Если в SSMS, в окне просмотра зависимостей, выбрать «Объекты которые зависят от TABLENAME», а затем раскрыть все уровни, мы увидим следующее:

[<img src="/wp-content/uploads/2014/11/1e20565058080a57348253da87daf6c7.jpg" alt="1e20565058080a57348253da87daf6c7" width="450" height="291" class="aligncenter size-full wp-image-2212" srcset="/wp-content/uploads/2014/11/1e20565058080a57348253da87daf6c7.jpg 450w, /wp-content/uploads/2014/11/1e20565058080a57348253da87daf6c7-170x109.jpg 170w, /wp-content/uploads/2014/11/1e20565058080a57348253da87daf6c7-300x194.jpg 300w" sizes="(max-width: 450px) 100vw, 450px" />](/wp-content/uploads/2014/11/1e20565058080a57348253da87daf6c7.jpg)

Ту же самую информацию вернёт sp_msdependencies.

```sql
-- sp_MSdependencies - Все уровни
-- Объекты, которые зависят от указанного объекта

EXEC sp_MSdependencies N'Sales.Customer', NULL, 266751 -- Change Table Name
```


[<img src="/wp-content/uploads/2014/11/005c5aaf7f96ce3306ca5b32727a7689.jpg" alt="005c5aaf7f96ce3306ca5b32727a7689" width="450" height="176" class="aligncenter size-full wp-image-2213" srcset="/wp-content/uploads/2014/11/005c5aaf7f96ce3306ca5b32727a7689.jpg 450w, /wp-content/uploads/2014/11/005c5aaf7f96ce3306ca5b32727a7689-170x66.jpg 170w, /wp-content/uploads/2014/11/005c5aaf7f96ce3306ca5b32727a7689-300x117.jpg 300w" sizes="(max-width: 450px) 100vw, 450px" />](/wp-content/uploads/2014/11/005c5aaf7f96ce3306ca5b32727a7689.jpg)

Так же, в SSMS, мы можем увидеть от каких объектов зависит выбранная таблица.

[<img src="/wp-content/uploads/2014/11/d67feae26b257f588297ded44cf97bac.jpg" alt="d67feae26b257f588297ded44cf97bac" width="450" height="218" class="aligncenter size-full wp-image-2214" srcset="/wp-content/uploads/2014/11/d67feae26b257f588297ded44cf97bac.jpg 450w, /wp-content/uploads/2014/11/d67feae26b257f588297ded44cf97bac-170x82.jpg 170w, /wp-content/uploads/2014/11/d67feae26b257f588297ded44cf97bac-300x145.jpg 300w" sizes="(max-width: 450px) 100vw, 450px" />](/wp-content/uploads/2014/11/d67feae26b257f588297ded44cf97bac.jpg)

Если вы хотите получить список зависимостей таблиц, вы можете использовать временную таблицу, чтобы отфильтровать зависимости по типу.

```sql
CREATE TABLE #TempTable1
    (
      Type INT ,
      ObjName VARCHAR(256) ,
      Owner VARCHAR(25) ,
      Sequence INT
    );

INSERT  INTO #TempTable1
        EXEC sp_MSdependencies NULL

SELECT  *
FROM     #TempTable1
WHERE   Type = 8 --Tables
ORDER BY Sequence ,
        ObjName

DROP TABLE #TempTable1;
```


### Запросы к системным представлениям каталога

Второй метод «реверс-инжиниринга» зависимостей в вашей БД – это запросы к системным представлениям каталога, связанным со внешними ключами.

```sql
--Independent tables

SELECT  Name AS InDependentTables
FROM    sys.tables
WHERE   object_id NOT IN ( SELECT  referenced_object_id
                             FROM   sys.foreign_key_columns )
                                                -- Check for parents
        AND object_id NOT IN ( SELECT parent_object_id
                                 FROM   sys.foreign_key_columns )
                                               -- Check for Dependents
ORDER BY Name

-- Tables with dependencies.

SELECT DISTINCT
        OBJECT_NAME(referenced_object_id) AS ParentTable ,
        OBJECT_NAME(parent_object_id) AS DependentTable ,
        OBJECT_NAME(constraint_object_id) AS ForeignKeyName
FROM    sys.foreign_key_columns
ORDER BY ParentTable ,
        DependentTable

-- Top level of the pyramid tables. Tables with no parents.

SELECT DISTINCT
        OBJECT_NAME(referenced_object_id) AS TablesWithNoParent
FROM    sys.foreign_key_columns
WHERE    referenced_object_id NOT IN ( SELECT  parent_object_id
                                        FROM    sys.foreign_key_columns )
ORDER BY 1

-- Bottom level of the pyramid tables.
-- Tables with no dependents. (These are the leaves on a tree.)

SELECT DISTINCT
        OBJECT_NAME(parent_object_id) AS TablesWithNoDependents
FROM    sys.foreign_key_columns
WHERE   parent_object_id NOT IN ( SELECT  referenced_object_id
                                    FROM    sys.foreign_key_columns )
ORDER BY 1

-- Tables with both parents and dependents.
-- Tables in the middle of the hierarchy

SELECT DISTINCT
        OBJECT_NAME(referenced_object_id) AS MiddleTables
FROM    sys.foreign_key_columns
WHERE    referenced_object_id IN ( SELECT  parent_object_id
                                    FROM    sys.foreign_key_columns )
        AND parent_object_id  NOT IN ( SELECT   referenced_object_id
                                        FROM    sys.foreign_key_columns )
ORDER BY 1;

-- in rare cases, you might find a self-referencing dependent table.
-- Recursive (self) referencing table dependencies.

SELECT DISTINCT
        OBJECT_NAME(referenced_object_id) AS ParentTable ,
        OBJECT_NAME(parent_object_id) AS ChildTable ,
        OBJECT_NAME(constraint_object_id) AS ForeignKeyName
FROM    sys.foreign_key_columns
WHERE    referenced_object_id = parent_object_id
ORDER BY 1 ,
        2;
```


### Использование CTE

Третий метод, для получения иерархии зависимостей – использование рекурсивного CTE.

```sql
-- How to find the hierarchical dependencies
-- Solve recursive queries using Common Table Expressions (CTE)

WITH     TableHierarchy (  ParentTable, DependentTable, Level )
          AS (

-- Anchor member definition (First level group to start the process)
               SELECT DISTINCT
                        CAST(NULL AS  INT) AS ParentTable ,
                        e.referenced_object_id AS DependentTable ,
                        0 AS Level
               FROM     sys.foreign_key_columns AS e
               WHERE    e.referenced_object_id NOT IN (
                        SELECT  parent_object_id
                        FROM    sys.foreign_key_columns )

-- Add filter dependents of only one parent table
-- AND Object_Name(e.referenced_object_id) = 'User'

               UNION ALL

-- Recursive member definition (Find all the layers of dependents)
               SELECT --Distinct
                        e.referenced_object_id AS ParentTable ,
                        e.parent_object_id AS DependentTable ,
                        Level + 1
               FROM     sys.foreign_key_columns AS e
                        INNER JOIN TableHierarchy AS d
                               ON ( e.referenced_object_id ) =
                                                      d.DependentTable
             )

    -- Statement that executes the CTE

SELECT DISTINCT
        OBJECT_NAME(ParentTable) AS ParentTable ,
        OBJECT_NAME(DependentTable) AS DependentTable ,
        Level
FROM     TableHierarchy
ORDER BY Level ,
        ParentTable ,
        DependentTable;
```


### Заключение

Таким образом, за час или два, можно получить неплохое представление о внутренностях любой базы данных, используя методы «реверс-инжиниринга», описанные выше.

<a href="http://habrahabr.ru/post/241079/" target="_blank">Источник</a>
