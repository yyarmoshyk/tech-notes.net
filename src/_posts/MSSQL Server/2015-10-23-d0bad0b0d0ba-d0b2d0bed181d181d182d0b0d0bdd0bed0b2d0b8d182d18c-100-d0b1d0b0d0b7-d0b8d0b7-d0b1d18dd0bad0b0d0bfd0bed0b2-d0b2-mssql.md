---
id: 2945
title: Как восстановить 100 баз из бэкапов в MSSQL
date: 2015-10-23T20:07:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=2945
permalink: '/%d0%ba%d0%b0%d0%ba-%d0%b2%d0%be%d1%81%d1%81%d1%82%d0%b0%d0%bd%d0%be%d0%b2%d0%b8%d1%82%d1%8c-100-%d0%b1%d0%b0%d0%b7-%d0%b8%d0%b7-%d0%b1%d1%8d%d0%ba%d0%b0%d0%bf%d0%be%d0%b2-%d0%b2-mssql/'
image: /wp-content/uploads/2014/08/mssql_logo.jpg
categories:
  - MSSQL Server
---
Переноc баз даных между серверами включеет в себя создание резервной копии/бэкапа на старом сервере и разворачивание этого бэкапа на новом сервере. С одной-двумя базами мороки не много, но что делать если у Вас больше сотни баз? Пальци отвалятся столько раз кнопки жать.

[Как сделать бэкап большого количества баз MSSQL](http://www.tech-notes.net/backup-databases-mssql-2008-2012/) я уже писал. Дальше речь пойдет о автоматизации развертывания баз.

Создаем StoredProcedure. Для этого нужно выполнить следующий запрос в окне `NewQuery`

```sql
IF OBJECT_ID ('restoreDB') IS NOT NULL
 DROP PROCEDURE restoreDB
GO
CREATE PROC [dbo].[restoreDB]
   @p_strDBNameTo SYSNAME,
   @p_strFQPathTo VARCHAR(255),
   @p_strFQNRestoreFileName VARCHAR(255)
AS
   DECLARE
		@p_strDBNameFrom SYSNAME,
       @v_strDBFilename VARCHAR(100),
       @v_strDBLogFilename VARCHAR(100),
       @v_strDBDataFile VARCHAR(100),
       @v_strDBLogFile VARCHAR(100),
       @v_strExecSQL NVARCHAR(1000),
       @v_strExecSQL1 NVARCHAR(1000),
       @v_strMoveSQL NVARCHAR(4000),
       @v_strREPLACE NVARCHAR(50),
       @v_strTEMP NVARCHAR(1000),
       @v_strListSQL NVARCHAR(4000),
       @v_strServerVersion NVARCHAR(20)

	SET @p_strDBNameFrom  = @p_strDBNameTo	-- 'DB name From' = 'DB Name To'
   IF exists (select name from sys.databases where name = @p_strDBNameTo)
       SET @v_strREPLACE = ', REPLACE'
--    IF (EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '##FILE_LIST'))
--    BEGIN
     DROP TABLE ##FILE_LIST
--    END

   SET @v_strListSQL = ''
    SET @v_strListSQL = @v_strListSQL + 'IF (EXISTS (SELECT * FROM [tempdb].INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ''##FILE_LIST''))'
    SET @v_strListSQL = @v_strListSQL + 'BEGIN'
    SET @v_strListSQL = @v_strListSQL + '   DROP TABLE [tempdb].##FILE_LIST '
    SET @v_strListSQL = @v_strListSQL + 'END '
   SET @v_strListSQL = @v_strListSQL + 'CREATE TABLE ##FILE_LIST ('
   SET @v_strListSQL = @v_strListSQL + '   LogicalName VARCHAR(64),'
   SET @v_strListSQL = @v_strListSQL + '   PhysicalName VARCHAR(130),'
   SET @v_strListSQL = @v_strListSQL + '   [Type] VARCHAR(1),'
   SET @v_strListSQL = @v_strListSQL + '   FileGroupName VARCHAR(64),'
   SET @v_strListSQL = @v_strListSQL + '   Size DECIMAL(20, 0),'
   SET @v_strListSQL = @v_strListSQL + '   MaxSize DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   FileID bigint,'
   SET @v_strListSQL = @v_strListSQL + '   CreateLSN DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   DropLSN DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   UniqueID UNIQUEIDENTIFIER,'
   SET @v_strListSQL = @v_strListSQL + '   ReadOnlyLSN DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   ReadWriteLSN DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   BackupSizeInBytes DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   SourceBlockSize INT,'
   SET @v_strListSQL = @v_strListSQL + '   filegroupid INT,'
   SET @v_strListSQL = @v_strListSQL + '   loggroupguid UNIQUEIDENTIFIER,'
   SET @v_strListSQL = @v_strListSQL + '   differentialbaseLSN DECIMAL(25,0),'
   SET @v_strListSQL = @v_strListSQL + '   differentialbaseGUID UNIQUEIDENTIFIER,'
   SET @v_strListSQL = @v_strListSQL + '   isreadonly BIT,'
   SET @v_strListSQL = @v_strListSQL + '   ispresent BIT'

   SELECT @v_strServerVersion = CAST(SERVERPROPERTY ('PRODUCTVERSION') AS NVARCHAR)

   IF @v_strServerVersion LIKE '10.0%' or @v_strServerVersion LIKE '11.0%'
       BEGIN
           SET @v_strListSQL = @v_strListSQL + ', TDEThumbpr DECIMAL'
           --PRINT 'Verson’ + @v_strServerVersion
       END

   SET @v_strListSQL = @v_strListSQL + ')'
--	print 'EXECUTING QUERY:' + @v_strListSQL	C:\Program Files (x86)\Microsoft SQL Server\MSSQL.1\MSSQL\Data
   EXEC (@v_strListSQL)


   INSERT INTO ##FILE_LIST EXEC ('RESTORE FILELISTONLY FROM DISK = ''' + @p_strFQNRestoreFileName + '''')

   DECLARE curFileLIst CURSOR FOR
--        SELECT 'MOVE N''' + LogicalName + ''' TO N''' + replace(PhysicalName, @p_strDBNameFrom, @p_strDBNameTo) + ''''
       SELECT 'MOVE N''' + LogicalName + ''' TO N''' + @p_strFQPathTo + substring(PhysicalName, (len(PhysicalName)-charindex('\', reverse(PhysicalName))+1), 200) + ''''
         FROM ##FILE_LIST

   SET @v_strMoveSQL = ''

   OPEN curFileList
   FETCH NEXT FROM curFileList into @v_strTEMP
   WHILE @@Fetch_Status = 0
   BEGIN
       SET @v_strMoveSQL = @v_strMoveSQL + @v_strTEMP + ', '
       FETCH NEXT FROM curFileList into @v_strTEMP
   END

   CLOSE curFileList
   DEALLOCATE curFileList

   PRINT 'Killing active connections to the "' + @p_strDBNameTo + '" database'

   -- Create the sql to kill the active database connections
   SET @v_strExecSQL = ''
   SELECT   @v_strExecSQL = @v_strExecSQL + 'kill ' + CONVERT(CHAR(10), spid) + ' '
   FROM     master.dbo.sysprocesses
   WHERE    DB_NAME(dbid) = @p_strDBNameTo AND DBID &lt;> 0 AND spid &lt;> @@spid

   EXEC (@v_strExecSQL)

   PRINT 'Restoring "' + @p_strDBNameTo + '" database'
   PRINT 'from dbname @p_strDBNameFrom "' + @p_strDBNameFrom + '" database'
	PRINT ' from (p_strFQNRestoreFileName) "' + @p_strFQNRestoreFileName + '" with '
   PRINT ' data file "' + @v_strDBDataFile  + '"'
	PRINT ' located at (v_strDBFilename)"' + @v_strDBFilename + '"'
   PRINT ' log file (v_strDBLogFile)"' + @v_strDBLogFile + '"'
	PRINT ' located at (v_strDBLogFilename)"' + @v_strDBLogFilename + '"'
	PRINT ' @v_strMoveSQL = ' + @v_strMoveSQL

   SET @v_strExecSQL = 'RESTORE DATABASE [' + @p_strDBNameTo + ']'
   SET @v_strExecSQL = @v_strExecSQL + ' FROM DISK = ''' + @p_strFQNRestoreFileName + ''''
   SET @v_strExecSQL = @v_strExecSQL + ' WITH FILE = 1,'
   SET @v_strExecSQL = @v_strExecSQL + @v_strMoveSQL
   SET @v_strExecSQL = @v_strExecSQL + ' NOREWIND, '
   SET @v_strExecSQL = @v_strExecSQL + ' NOUNLOAD '
   SET @v_strExecSQL = @v_strExecSQL + ', REPLACE '
--    SET @v_strExecSQL = @v_strExecSQL + @v_strREPLACE


   PRINT '---------------------------'
   PRINT @v_strExecSQL
   PRINT '---------------------------'

   EXEC sp_executesql @v_strExecSQL
```


После того, как вы увидели сообщение `Command(s) completed successfully.`, можно восстанавливать базы с помощью следующей команды:

```bash
exec restoreDB 'имя_базы', 'C:\Program Files (x86)\Microsoft SQL Server\MSSQL.1\MSSQL\Data', 'c:\имя_папки\имя_базы.BAK'
```

В случае с 2012 сервером нужно изменить путь к папке DATA:

```bash
exec restoreDB 'имя_базы', 'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA', 'c:\имя_папки\имя_базы.BAK'
```

Теперь самый геморой - в недружелюбной командной строке винды сделать батч для восстановления сотни баз:  
Переходим в папку, где находятся бэкапы баз (c:\имя_папки\) и выполняем следующую команду:

```bash
for /r %f in (*.bak); do echo exec restoreDB '%~nf', 'C:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\DATA', 'c:\имя_папки\%~nf.BAK' >> c:\\db_restore.txt
```

В результате выполнения файл `c:\\db_restore.txt` будет содержать набор команд. При необходимости можно все подредактировать. Это все же легче, чем набивать 100 раз востановление разнчх баз.

Возвращаемся в SQL Management Studio и выполняем огромный запрос из текстового файла.
