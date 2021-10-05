---
id: 3079
title: Обрабатываем почтовую очередь в Qmail
date: 2016-01-06T20:02:15+00:00
author: admin

guid: http://www.tech-notes.net/?p=3079
permalink: /qmail-mail-queue-tools/
image: /wp-content/uploads/2016/01/qmail-logo.png
categories:
  - Почта
tags:
  - qmail
---
`Qmail` не является последним словом в технологии доставки почты, но этот smtp демон до сих пор очень распространен. В частности многие сервера с Plesk панелью используют именно Qmail.

Для того что бы посмотреть список сообщений ожидающих отправки (посмотреть очередь доставки) можно воспользоваться следующей утилитой:

```bash
/var/qmail/bin/qmail-qread
```

Посчитать количество сообщений в очереди поможет следующий скрипт:

```bash
/var/qmail/bin/qmail-qstat
```

Все немного сложнее с чтением содержания писем. Дело в том, что письмо распределено по трем файлам в следующих папках:
  * /var/qmail/queue/info/
  * /var/qmail/queue/remote/
  * /var/qmail/queue/mess/

Именем файла является id сообщения. ID сообщений выводится в результатах выполнения первой команды. Как правило она возвращает что-то в стиле:

```bash
6 Jan 2016 09:18:13 GMT #**10817428** 642 <somebox@somemail.com>  
remote somebox@somemail.com
```

ID сообщения выделен жирным.

Прочитать содержимое письма можно с помощью дополнительных телодвижений:

```bash
find /var/qmail/queue -name NNNN -exec cat {} \; | less
```

NNNN - это и есть id сообщения.

Следующий цикл выведет список скриптов которые инициализировали отправку писем в очереди:

```bash
for f in $(/var/qmail/bin/qmail-qread |cut -d "#" -f 2 |awk '{print $1}' |sort -u);
do
   find /var/qmail/queue -name $f |xargs grep "X-PHP-Originating-Script";
done |cut -d ":" -f 4 |sort -u
```
