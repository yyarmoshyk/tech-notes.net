---
id: 3315
title: Create account in WHM/cPanel from cli
date: 2016-06-16T12:01:17+00:00
author: "Yaroslav Yarmoshyk"

guid: http://www.tech-notes.net/?p=3315
permalink: /create-whm-cpanel-account-from-shell/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM
  - cPanel
---
WHM provides a very friendly interface for managing sites, users and databases on the server. Sometimes you have to create several hundreds of accounts for different clients (for example, migrating from a regular server to WHM). In this case you can spend weeks on mouse clicks in the web interface.

In this case it is much easier to create accounts using prepared WHM shell scripts. In this particular case `wwwacct` will help us.

To create an account `account` with password `password` for the site `websitename.com`, use the following command:

```bash
/scripts/wwwacct **websitename.com** **account** **password**
```

Create database in `mysql` console:
```bash
create database account_dbname;
grant all privileges on **account_dbname**.* to **account_dbuser**@localhost identified by '**password**';
```

Link the mysql database and the user with the newly created account:
```bash
/usr/local/cpanel/bin/dbmaptool **account** -type mysql -dbs '**account_dbname**'
/usr/local/cpanel/bin/dbmaptool **account** -type mysql -dbusers '**account_dbuser**'
```