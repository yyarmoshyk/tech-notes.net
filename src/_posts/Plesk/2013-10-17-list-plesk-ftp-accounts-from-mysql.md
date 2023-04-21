---
id: 44
title: View all FTP accounts created in Plesk on a Linux server via mysql
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
  - ftp users plesk
---
It happens that the Plesk WebUI becomes unavailable for any reason. Or we have a set of files from the old server and we need to restore all ftp users on the new one based on information from the Plesk `mysql` database.

By default Plesk works with the `psa` database. Plesk stores all the data about the accounts that were created on the server in it. We will get the information from this database.

Connecting to the database:
```bash
mysql -uadmin -p$(cat /etc/psa/.psa.shadow)
```

Switch to Plesk database:
```bash
use psa;
```

Here is the mysql query that will return the list of the FTP users in Plesk:
```sql
SELECT REPLACE(sys_users.home,'/home/httpd/vhosts/','') AS domain, sys_users.login,accounts.password
FROM sys_users LEFT JOIN accounts on sys_users.account_id=accounts.id
ORDER BY sys_users.home ASC;
```
