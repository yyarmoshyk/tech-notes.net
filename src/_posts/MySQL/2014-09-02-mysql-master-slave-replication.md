---
id: 1605
title: 'MySql: Настройка репликации'
date: 2014-09-02T07:53:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=1605
permalink: /mysql-master-slave-replication/
image: /wp-content/uploads/2014/09/mysql-replication-960x300-660x206.jpg
categories:
  - MySQL
tags:
  - репликация mysql
---
Ок. Это не оригинальная статья. Таких, как эта - полным полно в интернете. Она мне нужна для того, что бы не приходилось каждый раз гуглить когда нужна шпаргалка.

Для начала рекомендую подредактировать фалйл `/etc/hosts` следующими строками на обоих серверах:

```bash
mysql.master 192.168.10.10  
mysql.slave 192.168.10.20
```

Ip дареса серверов поменяйте на свои.

Для того, что бы настроить репликацию баз в MySql нужно сначала подредактировать конфигурационные файлы `/etc/my.cnf` или `/etc/mysql/my.cnf`

### На Master сервере вносим следующие изменения:

```bash
[mysqld]
server-id=1
log-bin=mysql-bin
innodb_flush_log_at_trx_commit=1
sync_binlog=1
```


Перезапускаем mysqld что бы изменеия вступили в силу:

```bash
/etc/init.d/mysqld restart
```

Подключаемся к mysql:

```bash
mysql -u root -p
```

Создаем пользователя для репликации:

```bash
GRANT REPLICATION SLAVE ON \*.\* TO 'repl'@'%' IDENTIFIED BY 'password';
```

Имя пользователя (`repl`) и пароль (`password`) можно сменить на то, что больше нравится.

Репликация в mysql основывается на данных из так называемого бинарного лога (binlog). Он содержит историю транзакций. Грубо говоря, ведомый (slave) сервер повторяет у себя все действия, которые произошли на master сервере и вызвали изменения в базе или базах данных.

[<img src="/wp-content/uploads/2014/09/Delayed_Replication1.jpg" alt="Delayed_Replication1" width="586" height="287" class="aligncenter size-full wp-image-1623" srcset="/wp-content/uploads/2014/09/Delayed_Replication1.jpg 586w, /wp-content/uploads/2014/09/Delayed_Replication1-170x83.jpg 170w, /wp-content/uploads/2014/09/Delayed_Replication1-300x146.jpg 300w" sizes="(max-width: 586px) 100vw, 586px" />](/wp-content/uploads/2014/09/Delayed_Replication1.jpg)

<center>
  <div id="gads">
  </div>
</center>

Нужно сделать некий контрольный срез этого лога, тоесть получить текущую позицию записи. Для этого выполните следующую команду:

```bash
mysql> show master status;
```

В результате получаем что-то вот такое:
```bash
+---------------+-----------+--------------+------------------+
| File          | Position  | Binlog_Do_DB | Binlog_Ignore_DB |
+---------------+-----------+--------------+------------------+
| binlog.000005 | 849349769 |              |                  |
+---------------+-----------+--------------+------------------+
1 row in set (0.00 sec)
```


Нас интересует значение к колонке `Position`. Нужно его запомнить/скопировать/записать. Именно с этого места начнется `дублирование` на новом сервере.

Теперь можно [перенести все базы данных](/backup-restore-all-mysql-databases/) с Master сервера на Slave.

### На Slave сервере вносим следующие изменения в конфигурационный файл `/etc/my.cnf` или `/etc/mysql/my.cnf`:

```bash
[mysqld]
server-id=2
log-bin=mysql-bin
innodb_flush_log_at_trx_commit=1
sync_binlog=1
slave-skip-errors = 1062
```


Последняя строка нужна для того что бы избежать ошибок типа:

```bash
Last_SQL_Errno: 1062
               Last_SQL_Error: Error 'Duplicate entry ... for key 'PRIMARY'' on query.
```


Перезапускаем mysqld что бы изменеия вступили в силу:

```bash
/etc/init.d/mysqld restart
```

Подключаемся к mysql:

```bash
mysql -u root -p
```

Полагаю, что в этот момент все базы данных были восстановлены на этом сервере. Для того что бы установить роль slave выполните следующую команду:

```bash
CHANGE MASTER TO
MASTER_HOST='mysql.master',
MASTER_USER='repl',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='binlog.000005',
MASTER_LOG_POS=849349769;
```


<center>
  <div id="gads">
  </div>
</center>

После этого запускаем slave роль:

```bash
START SLAVE;
```

Проверяем статус slave роли:

```bash
show slave status \G;
```

В выведеной информации находим следующие строки:

```bash
Slave_IO_Running: Yes  
Slave_SQL_Running: Yes
```

Если значения отлличные от `Yes`, значит что-то пропустили или что-то пошло не так. Читайте логи mysql и ищите корень зла.
