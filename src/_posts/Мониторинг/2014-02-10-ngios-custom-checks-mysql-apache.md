---
id: 415
title: Создание своих модулей проверки для Nagios на примере mysql и apache2
date: 2014-02-10T08:09:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=415
permalink: /nagios-custom-checks-mysql-apache/
image: /wp-content/uploads/2014/02/nagios-150x1502.png
redirect_from:
  - /ngios-custom-checks-mysql-apache/
categories:
  - мониторинг
tags:
  - Apache
  - mysql
  - Nagios
---
[Nagios](http://www.nagios.org/) - клиент-серверная платформа мониторинга компьютерных систем и сетей с открытым кодом. Предназначена для наблюдения, контроля состояния вычислительных узлов и служб, оповещает администратора в том случае, если какие-то из служб прекращают (или возобновляют) свою работу.[(c)Wikipedia](http://ru.wikipedia.org/wiki/Nagios)

Подробную установку расписывать не буду - благо, существует множество интернет ресурсов, где это уже сделано.

[Nagios](http://www.nagios.org/) - это невероятно гибкая система мониторинга. Для nagios существоет большое множество плагинов, которые поставляются в пакетах nagio-plugins, но бывает так, что плагины из коробки не подходят по той или иной причине. Либо они выдают много не нужноq информации, либо не выдают ничего (просто не работают в конкретной системе). Мне обычно жалко ставить целый пакет с десятком плагинов ради проверки однго значения системы.

Большим плюсом `nagios` является то, что `nagios-checks`, или проверочные скрипты, можно написать на чем угодно: `bash`, `python`, `perl` или `powershell`. По моему даже обычный bat файл можно использовать для проверки здоровья Windows систем. Как говорил один мой товарищ: `С помощью Nagios можно мониторить кофе в чашке`

Итак хочу рассмотреть создание своих проверочных скриптов на примере проверки статуса Mysql-Server и Apache.

Для начала создадим пользователя, с которым проверочный скрипт (checker) будет подключаться к mysql. Конечно же можно использовать учетную запись root, но от греха по-дальше рекомендую создать отдельного пользователя:  
```sql
grant select on *.* to nagios@localhost identified by 'nagios4mysql';
```

Дальше в папке с плагинами (`/usr/lib/nagios/plugins/`) создаем файл `custom_mysql_check` со следующим содержанием:

```bash
#!/bin/bash
user="nagios";
password="nagios4mysql";
info=$(echo "SHOW STATUS;" |mysql -u$user -p$password |grep "Open_tables\|Uptime\|Threads_run" |grep -v "flush"|awk '{printf $1":"$2", "}');
if ($info); then
	echo "OK: Service is running. $info";
	exit 0
else
	echo "Service is down";
	exit 2
fi
```

Этот скрипт использует стандартную функцию mysql для получения нужной информации и отображает количество открытых таблиц, uptime и количество инстансов mysql. Можете более детально ознакомиться с выводом функции `SHOW STATUS` и включить дополнительную информацию. Изначальная цель этой проверки - удостовериться, что mysql server запущен и отвечает на запросы (exit 0). Если же mysql недоступен - скрипт вернет код выхода = 2, что станет сигналом для nagiosa о том, что у сервера проблемы.

Осталось дело за малым - описать этот custom check на сервере нагиоса. Это можно сделать по аналогии с уже существующими чеками. И не забыть прописать этот же чек в файле `/etc/nagios/nrpe_local.cfg`:
```bash
command[custom_mysql_check]=/usr/lib/nagios/plugins/custom_mysql_check
```

Пример bash скрипта для проверки apache http server:

```bash
#!/bin/bash
let "number = $(ps aux|grep apache2 |wc -l) -2 "
if [ -f /var/run/apache2.pid ]
then
	echo "OK: Service is up. Running $number child processes";
	exit 0
else
	echo "Service is down";
	exit 2
fi
```

Скрипт проверяет наличие пид-файла и считает количество запущенных дочерних процессов `apache`. В принципе как условие можно использовать значение переменной $number:  
```bash
if [ $number -gt "0" ]
```

При создании этого чека нужно его тоже объявить в файле `/etc/nagios/nrpe_local.cfg`
