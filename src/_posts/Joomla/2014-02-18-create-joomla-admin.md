---
id: 508
title: Как создать админ пользователя в Joomla с помощью mysql
date: 2014-02-18T13:27:59+00:00
author: admin

guid: http://www.tech-notes.net/?p=508
permalink: /create-joomla-admin/
image: /wp-content/uploads/2014/02/joomla-logo-vert-color.png
categories:
  - Joomla
tags:
  - joomla admin mysql
---
Бывает нужно позарез попасть в админку CMS Joomla, но нету информации о пользователях, которые уже были созданы.  
При этом мы имеем доступ к базе данных сайта. Можно создать себе пользователя, используя несколько mysql команд.

Для начала нужно посмотреть префикс таблицы в файле configuration.php (в моем случае это jom25_).

**Joomla 2.5:**

```bash
INSERT INTO `jom25_users` (`name`, `username`, `password`) VALUES ('TempAdmin', 'tempadmin', md5('password'));
INSERT INTO `jom25_user_usergroup_map` (`user_id`,`group_id`) VALUES (LAST_INSERT_ID(),'8');
```


**Joomla 1.5:**

```bash
INSERT INTO `jom15_users` (`name`, `username`, `password`, `usertype`, `gid`) VALUES ('TempAdmin', 'tempadmin', md5('password'), 'Super Administrator', 25);
INSERT INTO `jom15_core_acl_aro` VALUES (NULL, 'users', LAST_INSERT_ID(), 0, 'TempAdmin', 0);
INSERT INTO `jom15_core_acl_groups_aro_map` VALUES (25, '', LAST_INSERT_ID());
```


Дальше заходим на страницу администратора и логинимся используя:  
Имя пользователя: tempadmin  
Пароль: password
