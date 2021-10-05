---
id: 2572
title: 'Создаем учетную запись administrator в OpenX из MySQL'
date: 2015-05-11T20:56:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=2572
permalink: /administrator-openx-mysql/
image: /wp-content/uploads/2015/05/openx.jpg
categories:
  - Other CMS
tags:
  - OpenX
---
Как создать админа из админки - задача не из сложных. Но что делать, если доступа в админку нету, а есть доступ к базе mysql?

В OpenX существует несколько видов пользователей:
  1. ADMIN
  2. MANAGER
  3. ADVERTISER
  4. TRAFFICKER

Значения `id` в таблице `accounts` соответствует номеру в списке.

Пользовтели хранятся в таблице `users`. Также нужно учесть, что пароль хэшируется с помощью `md5`

Опираясь на все вышеизложенное, mysql запрос для создания пользователя выглядит следующим образом:

```sql
insert into users (contact_name,email_address,username,password,language,default_account_id,active)
values ('User Name', 'email@address.com', 'userlogin', md5('password'), 'en', 1, 1);
```

Не забывайте, что в базе даных `mysql` может использоваться префикс к таблицам.
