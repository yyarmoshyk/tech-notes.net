---
id: 3315
title: Создание учетной записи WHM/cPanel из командной строки
date: 2016-06-16T12:01:17+00:00
author: admin

guid: http://www.tech-notes.net/?p=3315
permalink: /create-whm-cpanel-account-from-shell/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM/cPanel
---
WHM предоставляет очень дружелюбный интерфейс для управлениясайтами, пользователями и базами даных на сервере. Иной раз приходится создать несколько сотен учеток для разных клиентов (допустим миграция с обычного сервера на WHM). В таком случае можно очень долго кликать в web-интерфейсе.

В таком случае в разы легче создавать учетные записи используя заготовленые shell скрипты WHM. В конкретно этом случае нам поможет `wwwacct`.

Для создания учетной записи `account` с паролем `password` для сайта `websitename.com` воспользуйтесь следующей командой:

```bash
/scripts/wwwacct **websitename.com** **account** **password** 0 x3 n n n 0 0 0 0 0 0
```

Создаем базу в консоли `mysql`:

```bash
create database account_dbname;  
grant all privileges on **account_dbname**.* to **account_dbuser**@localhost identified by '**password**';
```

Линкуем базу и пользователя с недавно созданной учетной записью:

```bash
/usr/local/cpanel/bin/dbmaptool **account** -type mysql -dbs '**account_dbname**'  
/usr/local/cpanel/bin/dbmaptool **account** -type mysql -dbusers '**account_dbuser**'
```

Все, что нужно поменять я выделил жирным шрифтом.
