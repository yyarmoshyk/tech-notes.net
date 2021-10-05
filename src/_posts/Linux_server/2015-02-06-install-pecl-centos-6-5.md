---
id: 2380
title: Установка pecl на CentOS 6.5
date: 2015-02-06T14:21:41+00:00
author: admin

guid: http://www.tech-notes.net/?p=2380
permalink: /install-pecl-centos-6-5/
image: /wp-content/uploads/2015/02/peclsmall.gif
categories:
  - Linux server
tags:
  - CentOS
---
[PECL](http://pecl.php.net/) - это хранилище расширений PHP. Он обеспечивает доступ к каталогу всех известных расширений, а также средства для загрузки и установки расширений PHP.

В стандартных репозиториях он отсутсвует. Для начала [подключите Epel](/epel-remi-atrpms-rhel-centos/)

Как ни странно, но pecl поставляется в пакете php-pear. Для работы ему требуется утилита phpize, которая поставляется в составе php-devel

```bash
yum install php-pear php-devel
```

Обновляем содержимое:

```bash
pecl channel-update pecl.php.net
```

Собственно для установки любого расширения, в системе должен присутсвовать devel пакет `материнского пакета`. На пример для установки драйвера `postgres` (`pdo_pgsql`) нужен [postgres-devel](/postgresql-9-4-on-centos-6-5/).
