---
id: 2740
title: 'Ошибка max_allowed_packet при восстановлении базы MySQL'
date: 2015-07-27T15:20:08+00:00
author: admin

guid: http://www.tech-notes.net/?p=2740
permalink: /max_allowed_packet-issue-mysql/
image: /wp-content/uploads/2014/02/MYSQL_Color_3.png
categories:
  - MySQL
---
Если Вы читаете эту заметку, значит вы столкнулись со следующей ошибкой при восстановлении базы MySQL:

```bash
Got a packet bigger than 'max_allowed_packet'
```

Побороть ее можно несколькими способами. Самый простой - передать размер `max_allowed_packet` аргументом к mysql:

```bash
mysql -uroot -p -max_allowed_packet=100M **база** < **дамп**.sql
```

Если не сработает, тогда подключаемся к консоли:

```bash
mysql -uroot
```

Обновляем глобальное значение `max_allowed_packet`:
```bash
set global max_allowed_packet=1000000000;
```

<center>
  <div id="gads">
  </div>
</center>

Это значение будет активно в рамках вашей сессии в консоли mysql. Как только вы разорвете соединение с mysql оно обнулится к стандартному значению. Поэтому базу нужно восстанавливать в рамках этой же сесии:

```bash
use база  
source дамп.sql
```

Для закрепления настроек стоит обновить конфиг mysql (`/etc/my.cnf`). Добавте следующее в секцию `[server]`:

```bash
max_allowed_packet=100M
```
