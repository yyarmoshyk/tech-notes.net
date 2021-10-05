---
id: 596
title: Настройка NFS сервера и его клиентов на базе CentOS
date: 2014-02-26T17:21:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=596
permalink: /configure-nfs-server-and-client-centos/
image: /wp-content/uploads/2014/02/nfs_mount.png
categories:
  - Linux server
tags:
  - CentOS
  - nfs
---
NFS очень полезная штука, в тех случаях, когда у нас есть несколько серверов, и нужно организовать совместный доступ к конкретному хранилищу с каждого из них.  
NFS позволяет делать доступными папки и файлы по сети для других серверов.

Итак рассмотрю следующий пример:  
Имеется несколько 2 сервера:  
web01, ip: 10.0.0.10  
web02, ip: 10.0.0.20  
На нах находится 2 сайта. Один сайт сделан на WordPress, второй - Joomla.  
Мне нужно, что следующий папки были одинаковы на обоих серверах и содержали одинаковый контент:

  * /var/www/html/wordpress-site.com/wp-content/uploads
  * /var/www/html/joomla-site.com/cache
  * /var/www/html/joomla-site.com/media

Я буду настраивать шаринг этих папок с web01 на web02.

Итак приступаем. Подключаемся на **web01** и ставим нужные пакеты:

```bash
yum install nfs-utils nfs-utils-lib
```

Ставим nfs на автозагрузку и запускаем:

```bash
chkconfig nfs on  
/etc/init.d/nfs start
```

Запустите rpcbind если при этом получаете вот такую ошибку:

```bash
Starting NFS daemon: rpc.nfsd: writing fd to kernel failed: errno 111 (Connection refused)
```

Еще лучше поставить его на автозагрузку:

```bash
chkconfig rpcbind on  
/etc/init.d/rpcbind start
```

Открываем любимым редактором файл `/etc/exports` и вставляем в него следующие строки:

```bash
/var/www/html/wp-site.com/wp-content/uploads  	10.0.0.20(rw,sync,no_root_squash,no_subtree_check)
/var/www/html/joomla-site.com/cache           	10.0.0.20(rw,sync,no_root_squash,no_subtree_check)
/var/www/html/joomla-site.com/media           	10.0.0.20(rw,sync,no_root_squash,no_subtree_check)
```


Пример для подсети:

```bash
/var/www 10.10.0.0/16(rw,sync,no_root_squash,no_subtree_check)
```


Не буду вдаваться в подробности на счет опций. Вся информация доступна [здесь](http://linux.die.net/man/5/exports)

Сохраняем файл и закрываем. Для применения изменений делаем выполняем:

```bash
exportfs -a
```

Переходим на второй сервер **web02** и ставим нужные пакеты:

```bash
yum install nfs-utils nfs-utils-lib
```

Ставим nfs на автозагрузку и запускаем:

```bash
chkconfig nfs on  
/etc/init.d/nfs start
```

Дальше нужно подредактировать файл fstab для того что бы наши папки монтировались при старте сервера.  
Открываем любимым редактором файл `/etc/fstab`

```bash
10.0.0.10:/var/www/html/wp-site.com/wp-content  /var/www/html/wp-site.com/wp-content   nfs      rw,sync,hard,intr  0     0
10.0.0.10:/var/www/html/joomla-site.com/cache   /var/www/html/joomla-site.com/cache    nfs      rw,sync,hard,intr  0     0
10.0.0.10:/var/www/html/joomla-site.com/media   /var/www/html/joomla-site.com/media    nfs      rw,sync,hard,intr  0     0
```


Сохраняем. Закрываем. Выполняем:

```bash
mount -a
```

Если папки уже существуют - ничего страшного. Их можно переименовать на всякий случай или очистить. Можно ничего с ними не делать - новые папки будут смонтированы поверх старых.

Для проверки можно на сервере web01 создать тестовые файлы в папках и посмотреть появились ли они на web02.
