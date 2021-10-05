---
id: 2991
title: Ошибка MySQL клиетна
date: 2015-12-02T20:19:42+00:00
author: admin

guid: http://www.tech-notes.net/?p=2991
permalink: /mysql-symbol-strmov-version-libmysqlclient_16-not-defined/
image: /wp-content/uploads/2014/02/MYSQL_Color_3.png
categories:
  - MySQL
---
Сегодня столкнулся со следующей ошибкой при вызове клиента mysql:

```bash
/usr/bin/mysql: relocation error: /usr/bin/mysql: symbol strmov, version libmysqlclient_16 not defined in file libmysqlclient.so.16 with link time reference
```

Как оказаловь позже на сервере были установлены библиотеки от `Percona` вместо стандартных `mysql-libs`.

Для устранения даной неприятности нужно сначала удостовериться, что репозитарии `percona` выключены. Можно переименовать/удалить файл `percona.repo` из `/etc/yum.repos.d/`, или отредактировать его и выставить `enable` в ноль для всех репозиториев внутри соответствующего файла.

Дальше находим нужный нам пакет:

```bash
rpm -qa |grep -i Percona
```

И удаляем его:

```bash
rpm -e -nodeps Percona-Server-shared-51
```

Использовать yum не получится потомучто он захочет грохнуть кучу зависимых пакетов.

Дальше устанавливаем нужные библиотеки:

```bash
yum install mysql-libs
```

Устраняем неполадки с системными таблицами mysql:

```bash
mysql_install_db -user=mysql -basedir=/usr/ -ldata=/var/lib/mysql/
```

Теперь демон `MySQL` должен запускаться без проблем.
