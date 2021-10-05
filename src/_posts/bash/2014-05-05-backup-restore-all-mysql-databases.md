---
id: 528
title: Bash скрипт для бэкапа и восстановления всех баз и пользователей в mysql
date: 2014-05-05T09:31:47+00:00
author: admin

guid: http://www.tech-notes.net/?p=528
permalink: /backup-restore-all-mysql-databases/
image: /wp-content/uploads/2014/02/bash_shell.jpg
categories:
  - bash
tags:
  - mysql
---
Эта заметка о том, как можно быстро сдампить все базы MySql в отдельные файлы в среде bash:  
**Backup**:

```bash
for db in $(echo "show databases;" |mysql |grep -v "Database\|^mysql$\|information_schema\|performance_schema\|^test");
do
	 mysqldump --routines --opt $db |gzip > "$db".sql.gz;
	 echo "done with $db";
done
```


**Restore**:

```bash
for db in $(ls |cut -d "." -f 1);
do
  mysql $db < "$db".sql;
  echo "done with $db";
done
```


Если нужно при восстановлении еще и **создать новые базы**:

```bash
for db in $(ls |cut -d "." -f 1);
do
	 echo "create database \`$db\`;" |mysql;
	 mysql $db < "$db".sql;
	 echo "done with $db";
done
```


Все это можно просто скопировать и вставить в терминал.  
Я делаю вывод "done with $db", что бы знать, какие базы уже обработаны.

А вот таким образом можно получить всех mysql пользователей с паролями и правами на базы:

```bash
for user in $(echo "select concat(user,'@',host) from mysql.user;" |mysql |grep -v concat);
do
  echo "show grants for $(echo $user|sed -e "s|@|'@'|g" -e "s|^|'|g" -e "s|$|'|g");" |mysql |grep -v "^Grants for\|root" |sed 's/$/;/g';
done
```

Полученный вывод можно скопировать и ставить в консоле mysql на новом сервере, или сохранить в файл.  
Исключаем пользователя root, что бы при восстановлении на новом сервере, не затереть существующего.
