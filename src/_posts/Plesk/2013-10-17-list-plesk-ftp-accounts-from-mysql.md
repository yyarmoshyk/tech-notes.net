---
id: 44
title: Просмотр всех FTP акаунтов созданых в Plesk на Linux сервере через mysql
date: 2013-10-17T19:37:14+00:00
author: admin

guid: http://wp38.local/?p=44
permalink: /list-plesk-ftp-accounts-from-mysql/
attitude_sidebarlayout:
  - default
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
categories:
  - Plesk
tags:
  - ftp plesk mysql
  - ftp пользователи plesk
---
Случается так, что вэбморда Plesk становится недоступной по той или иной причине. Либо у нас есть набор файлов со старого сервера и нужно восстановить всех ftp пользователей на новом основываясь на информации из mysql базы Plesk.

По умолчанию Plesk работает с базой `psa`. В ней он хранит все данные об аккаунтах, которые были созданы на сервере. От туда и будем выковыривать информацию.

Подключаемся к базе данных:

```bash
mysql -uadmin -p$(cat /etc/psa/.psa.shadow)
```

Именно в этом файле хранится пароль пользователя базы у Plesk.  
Подключаемся к базе Plesk:
```bash
use psa;
```

Следующий запрос вернет нам список всех пользователей и паролей:

```sql
SELECT REPLACE(sys_users.home,'/home/httpd/vhosts/','') AS domain, sys_users.login,accounts.password
FROM sys_users LEFT JOIN accounts on sys_users.account_id=accounts.id
ORDER BY sys_users.home ASC;
```
