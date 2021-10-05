---
id: 1663
title: Невозможно добавить сервис в автозагрузку CentOS/RHEL
date: 2014-09-11T14:20:37+00:00
author: admin

guid: http://www.tech-notes.net/?p=1663
permalink: /service-does-not-support-chkconfig/
image: /wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2.jpg
categories:
  - Linux server
tags:
  - CentOS
---
При выполнении очередной задачи столкнулся с тем, что не могу поставить на автозагрузку кастомный сервис.  
Решил сразу же накрапать заметку.  

При выполнении команды:

```bash
chkconfig service_name on
```

или

```bash
chkconfig -add service_name
```

Выпадает вот такая ошибка:

```bash
service service_name does not support chkconfig
```

Для того что бы все-таки добавить нужный Вам сервис service_name в автозагрузку, отредактируйте init.d скрипт:

```bash
nano /etc/init.d/service_name
```

Добавляем сразу же после первой строки:

```bash
# chkconfig: 2345 95 20
# description: service description
# processname: service_name
```
