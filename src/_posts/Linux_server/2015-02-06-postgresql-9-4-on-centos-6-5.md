---
id: 2374
title: Устанавливаем PostgreSQL 9.4 на Centos 6.5
date: 2015-02-06T14:02:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=2374
permalink: /postgresql-9-4-on-centos-6-5/
image: /wp-content/uploads/2015/02/Postgresql-Logo.png
categories:
  - Linux server
tags:
  - CentOS
  - PostgreSQL
---
Статья повествует о том, как установить PostgreSQL 9.4 на Centos 6.5.

Для начала редактируем файл `/etc/yum.repos.d/CentOS-Base.repo` и добавляем следующую строку в секции `[base]` и `[updates]`

```bash
exclude=postgresql*
```

Включаем дополнительный репозиторий:

```bash
yum localinstall http://yum.postgresql.org/9.4/redhat/rhel-6-x86_64/pgdg-centos94-9.4-1.noarch.rpm -y
```

Ставим PostgreSQL:

```bash
yum install postgresql94-server postgresql94-contrib postgresql-devel -y
```

После завершения установки - добавляем в автозапуск и стартуем:

```bash
chkconfig postgresql-9.4 on  
service postgresql-9.4 initdb  
service postgresql-9.4 start
```

<center>
  <div id="gads">
  </div>
</center>

Теперь нужно создать пользователя и базу даных в PostgreSQL.  
Меняем активного пользователя на postgres и подключаемся в консоль:

```bash
su - postgres  
psql
```

Создаем базу и разрешаем пользователю с ней работать:

```bash
CREATE DATABASE **dbname**;  
CREATE USER **dbuser** WITH PASSWORD '**myPassword**';  
GRANT ALL PRIVILEGES ON DATABASE **dbname** to **dbuser**;  
```

Нажимаем Ctrl+D что бы вернуться назад в сессию пользователя root.

Что бы удостовериться что пользователь создан нормально выполните:

```bash
psql -U**dbuser** -d**dbname** -hlocalhost -W
```

С большой вероятностью Вам выдаст следующую ошибку:

```bash
psql: FATAL: Ident authentication failed for user `djangodbuser`
```

Для того что бы ее устранить откройте для редактирования файл `/var/lib/pgsql/9.4/data/pg_hba.conf`, найдите в нем следующие строки и замените `ident` на `password`:

```bash
host    all             all             127.0.0.1/32            ident
host    all             all             ::1/128                 ident
```


После сохранения файла перезапустите PostgreSQL:

```bash
service postgresql-9.4 restart
```

Можно повторить:

```bash
psql -U**dbuser** -d**dbname** -hlocalhost -W
```

Все должно работать. Если не работает - оставьте коментарий.

<center>
  <div id="gads">
  </div>
</center>

### Драйвер PostgreSQL для PHP

[Устанавливается через pecl](http://www.tech-notes.net/install-pecl-centos-6-5/" title="Установка pecl на CentOS 6.5):

```bash
pecl install pdo_pgsql
```

Слудущая ошибка при установке - не смертельна:

```bash
configure: error: Cannot find libpq-fe.h. Please specify correct PostgreSQL installation path  
configure: error: Cannot find libpq.so. Please specify correct PostgreSQL installation path
```

Фиксы:

```bash
ln -s /usr/pgsql-9.4/include/libpq-fe.h /usr/local/include/libpq-fe.h  
ln -s /usr/pgsql-9.4/lib/libpq.so /usr/local/lib/libpq.so
```

Следующей ошибкой может выскочить:

```bash
/var/tmp/PDO_PGSQL/php_pdo_pgsql_int.h:27:28: error: libpq/libpq-fs.h: No such file or directory  
/usr/local/include/libpq-fe.h:29:26: error: postgres_ext.h: No such file or directory
```

И вообще оно будет плеваться, что не может найти то или другое. Устраняется:

```bash
for f in $(ls /usr/pgsql-9.4/include/); do  
  ln -s /usr/pgsql-9.4/include/$f /usr/local/include/$f;
done
```

### Драйвер PostgreSQL для python:

```bash
pip install psycopg2
```

Слудущая ошибка при установке - не смертельна:

```bash
Error: pg_config executable not found.
```

Фикс:

```bash
ln -s /usr/pgsql-9.4/bin/pg_config /usr/local/sbin/pg_config
```
