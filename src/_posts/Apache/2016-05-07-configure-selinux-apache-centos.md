---
id: 3294
title: Настройка SELinux для Apache в CentOS
date: 2016-05-07T14:13:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=3294
permalink: /configure-selinux-apache-centos/
image: /wp-content/uploads/2016/05/selinux.jpg
categories:
  - Apache
  - Безопасность
tags:
  - selinux
---
`SELinux` это модуль ядра Linux, который предоставляет дополнительный механизм определения прав доступа к папкам и файлам. Иногда он создает немалые проблемы при расположении файлов сайта и логов в нестандартных папках.

Особым успехом эти грабли пользуются у новоиспеченных админов и разработчиков, которые не понимают, почему сайт возвращает 404-ю ошибку, при том, что пользователь `apache` или `www-data` является владельцем папки с файлами сайта.

Самым популярным способом проблемы является отключение `selinux`, что не совсем правильно. Даже админы из второй линии поддержки популярных хостингов пользуются этим способом решения проблемы, что, как минимум, странно.

Дело в том, что selinux определяет не столько права доступа к файлам, сколько что и какому демону можно делать (читать файлы, редактировать файлы). Очень часто сервера ломают используя уязвимости в CMS сайтов. При этом злоумышленник получает доступ к папкам и файлам, к которым имеет доступ web-сервер.

Используя `selinux`, можно запускать web-сервер хоть от имени пользователя `root`, но при этом быть спокойным.

Проверить состояние `selinux` в `CentOS/RedHat` можно с помощью следующей команды:

```bash
getenforce
```

Для управления правилами нам понадобятся дополнительные утилиты:

```bash
yum install -y policycoreutils-python setroubleshooting
```

`Selinux` по структуре конфига напоминает `iptables`. У него имеются свои таблицы доступа к файла. Для того что бы selinux разрешил процессу apache запись в определенный каталог - нужно этот каталог включить в `таблицу` `httpd_sys_rw_content_t`, папку с логами нужно добавить в ``httpd_log_t`` и т.д.

Следующие команды приводятся как пример или шпаргалка. В этом случае папки сайтов лежат в `/home/webapps`.

Разрешаем apache **читать** файлы в каталоге и подкаталогах /home/webapps (`httpd_sys_content_t`):

```bash
semanage fcontext -a -t httpd_sys_content_t '/home/webapps(/.*)?'
```

Разрешаем `apache` писать логи нестандартном месте (`httpd_log_t`):

```bash
semanage fcontext -a -t httpd_log_t '/home/webapps/logs(/.*)?'
```

Отдельная директива в `selinux` отведена для `mod_cache`. Если Вашему серверу нужно использовать произвольное хранилище для кэша - добавьте его в `httpd_cache_t`:

```bash
semanage fcontext -a -t httpd_cache_t '/home/webapps/cache(/.*)?'
```

Для того что бы разрешить запись - добавте путь к папке в `httpd_sys_rw_content_t`:

```bash
semanage fcontext -a -t httpd_sys_rw_content_t '/home/webapps/\*/public_html/uploads(/.\*)?'
```

Для применения изменений выполните следующую команду:

```bash
restorecon -Rv /home/webapps
```

На этом этапе apache может работать с каталогами всех сайтов, которые буду созданы в /home/webapps/ и писать файлы в каталоги uploads каждого сайта.

Список использованой литературы:

  * [https://en.wikipedia.org/wiki/Security-Enhanced_Linux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)
  * [http://www.serverlab.ca/tutorials/linux/web-servers-linux/configuring-selinux-policies-for-apache-web-servers](http://www.serverlab.ca/tutorials/linux/web-servers-linux/configuring-selinux-policies-for-apache-web-servers)
