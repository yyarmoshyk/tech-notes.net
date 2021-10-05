---
id: 2623
title: Как определить какой скрипт рассылает спам через postfix
date: 2015-05-22T10:29:23+00:00
author: admin

guid: http://www.tech-notes.net/?p=2623
permalink: /postfix-sends-spam/
image: /wp-content/uploads/2014/05/managing-postfix.jpg
categories:
  - Почта
  - Безопасность
tags:
  - Postfix
---
Если вы обнаружили, что ваш `postfix` сервер рассылает спам (spam), сами понимает - вас ломанули. Довольно противное состояние.

Как правило спам рассылка запускается каким-то скриптом.

Не расстраивайтесь. Определить какой именно скрипт инициализирует рассылку можно.

Для этого переключитесь в учетную запись суперпользователя:

```bash
sudo su
```

Проверьте очередь рассылки:

```bash
mailq |less
```

> `less` позволит вам просмотреть всю очередь, если вывод команды не вмещается на экран. Для выхода нажмите `q`.

Первая колонка будет содержать ID сообщений в очереди на отправку.

<center>
  <div id="gads">
  </div>
</center>

Посмотреть содержимое письма можно с помощью:

```bash
postcat -q <ID>
```

Ищем что-то похожее на `X-PHP-Originating-Script` или `X-Originating-Script`.

Остается удалить скрипты и очистить очередь рассылки:

```bash
for m in $(/usr/bin/mailq 2&gt;&1 |grep -v postqueue |grep -i "^[1-9]\|^[A-Z]\|^0" |awk '{print $1}');
do
  if (/usr/sbin/postcat -q $m |grep X-PHP-Originating-Script |grep -q eval); then
		/usr/sbin/postsuper -d $m;
  fi;
done
```


Кстати этот скрипт является очень хорошим костылем если запланировать его выполнение каждую минуту. В таком случае очередь отправки будет постоянно мониториться и очищаться.

Полностью очистить очередь можно следующей командой:

```bash
postsuper -d ALL
```

К сожалению, на этом беды не заканчиваются. Осталось определить как же бяка попала на сервер. Для этого просмотрите логи apache и системные логи. Пересмотреть запланированые задачи (cron jobs).

Полезными также могут быть следующие статьи:

  1. [Лечим инфицированный сайт/сервер](http://www.tech-notes.net/fix-compromized-server/)
  2. [Сканирование сервера с помощью Rkhunter](http://www.tech-notes.net/scan-linux-server-with-rkhunter/)
  3. [Сканирование сервера с помощью Chkrootkit](http://www.tech-notes.net/scan-linux-server-with-chrootkit/)

Настоятельно рекондуется обновить все, что только можно (движек сайта, php, apache).

Предотвратить дальшейние вмешательства может [fail2ban](http://www.tech-notes.net/fail2ban-configuration/) и [mod_security](http://www.tech-notes.net/install-modsecurity-for-apache/)

Всем добра и успешных проэктов!
