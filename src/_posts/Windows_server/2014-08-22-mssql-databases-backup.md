---
id: 1410
title: Автоматизируем перенос баз данных между серверами MSSQL 2008
date: 2014-08-22T20:27:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=1410
permalink: /mssql-databases-backup/
image: /wp-content/uploads/2014/08/mssql_logo2.jpg
categories:
  - Windows server
tags:
  - MSSQL Server
  - tsql

---
И снова плююсь на проекты связанные с виндовыми серверами. Намедни столкнулся с задачей - нужно перенести несколько сотен БД с одного сервера на другой.

Руками можно сделать бэкап одной базы и скопировать ее на новый сервер. Но представьте сколько времени и кнопкокликанья уйдет на перенос двух или трех сотен баз. Меня напугали перспективы и я начал искать варианты автоматизации.

В этом случае сделать бэкап всех баз можно двумя способами:  
1. Используя [туториал про Maintetance Plan](/backup-all-dbs-mssql-server-2008/), но у него есть свой недостаток - каждый файл будет иметь какие-то крякозябры в конце имени, типа `_backup_2014_06_11_125043_4220117`, что может усложнить дальнейший импорт.

2. Сгенерировать `tsql` скрипт для бэкапа всех баз. От этого метода и будем плясать.

`T-Sql` синтакс для бэкапа одной базы выглядит следующим образом:

```bash
BACKUP DATABASE [database_name]
TO  DISK = N'D:\databases_backup\database_name.bak'
WITH NOFORMAT, NOINIT,  
NAME = N'database_name_backup',
SKIP, REWIND, NOUNLOAD,  STATS = 10
```


`T-Sql` синтакс для восстановления базы из файла выглядит следующим образом:

```bash
RESTORE DATABASE [database_name] FROM  DISK = N'D:\databases_backup\database_name.bak'
```


Если у Вас, как в моем случае, MSSQL сервер хранит базы и логи не в стандартном хранилище, а на отдельных разделах (в моем случае `E:\MSSQL\Data` и `F:\MSSQL\Log\`), тогда к предыдущая команда удваивается:

```bash
RESTORE DATABASE [database_name]
FROM  DISK = N'D:\databases_backup\database_name.bak'
WITH FILE=1,
MOVE N'database_name' TO N'E:\MSSQL\Data\database_name.mdf',
MOVE N'database_name_log' TO N'F:\MSSQL\Log\database_name_log.ldf'
```


Дело осталось за малым - сгенерировать скрипты для всех Ваших баз. Для того что бы получить список баз, выполните вот такой запрос в Management Studio:

```bash
select name from sys.databases
```


[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152429.png" alt="Screenshot from 2014-08-22 15:24:29" width="566" height="92" class="aligncenter size-full wp-image-1435" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152429.png 566w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152429-170x27.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152429-300x48.png 300w" sizes="(max-width: 566px) 100vw, 566px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152429.png)

Внизу появится список баз.Тыцаем правой кнопкой мышки, сначала выбираем пункт `Select all`, потом `Copy`  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152554.png" alt="Screenshot from 2014-08-22 15:25:54" width="538" height="456" class="aligncenter size-full wp-image-1436" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152554.png 538w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152554-170x144.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152554-300x254.png 300w" sizes="(max-width: 538px) 100vw, 538px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-152554.png)

Дальше я воспользовался bash скриптом, вы можете использовать то, что вам удобно:

```bash
for f in $(cat list_databases.txt);
do
	echo "BACKUP DATABASE [$f] TO  DISK = N'D:\databases_backup\\"$f".bak'
	WITH NOFORMAT, NOINIT,  NAME = N'"$f"_backup', SKIP, REWIND, NOUNLOAD,  STATS = 1";
done >> tsql_data_backup.txt
```


```bash
for f in $(cat list_databases.txt); do
	echo "RESTORE DATABASE [$f] FROM  DISK = N'D:\databases_backup\\"$f"'
	WITH FILE=1, MOVE N'"$f"' TO N'E:\MSSQL\Data\\"$f".mdf', MOVE N'"$f"_log' TO N'F:\MSSQL\Log\\"$f"_log.ldf'";
done >> tsql_data_restore.txt
```


Если Вы сделали бэкап первым методом, сделайте листинг файлов:  
на сервере в командной строке выполните:  
```bash
dir D:\databases_backup\ >> list_databases.txt
```

в `bash` воспользуйтесь скриптом
  ```bash
for f in $(cat list_databases.txt |awk '{print $5}');
do
	db=$(echo $f |cut -d "_" -f 1);
	echo "RESTORE DATABASE [$db] FROM  DISK = N'D:\databases_backup\\"$f"' WITH FILE=1, MOVE N'"$db"' TO N'E:\MSSQL\Data\\"$db".mdf', MOVE N'"$db"_log' TO N'F:\MSSQL\Log\\"$db"_log.ldf'";
done >> tsql_data_restore.txt
```

На выходе Вы имеете два файла:
<ul>
<li>
  tsql_data_backup.txt
</li>
<li>
  tsql_data_restore.txt
</li>
</ul>

Первый заливаем на исходный сервер, второй - на сервер назначения.

На исходном сервере создаем папку <code>D:\databases_backup\</code> и в командной строке выполняем:

```bash
  sqlcmd -S localhost -i d:\tsql_data_backup.txt
```

Нужно что бы пользователь, под которым запущена консоль, имел доступ к SQL серверу с правами sysadmin.

В результате выполнения скрипта вы получите файлы, содержащие бжкапы баз данных в папке <code>D:\databases_backup\</code>.

Копируйте их на новый сервер.

На новом сервере в командной строке выполняем:

```bash
  sqlcmd -S localhost -i d:\tsql_data_restore.txt
```

При необходимости поправmте местонахождение файлов `d:\tsql_data_backup.txt` и `d:\tsql_data_restore.txt`
