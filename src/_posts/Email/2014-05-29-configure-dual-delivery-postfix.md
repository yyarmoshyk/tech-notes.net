---
id: 973
title: Настройка паралельной доставки (Dual Delivery) почты в Postfix
date: 2014-05-29T08:51:17+00:00
author: admin

guid: http://www.tech-notes.net/?p=973
permalink: /configure-dual-delivery-postfix/
image: /wp-content/uploads/2014/05/MailRelay_Icon.jpg
categories:
  - Почта
tags:
  - Postfix
  - Dual Delivery Postfix
  - DualDelivery Postfix
  - паралельная доставка почты Postfix
---
Эта заметка рассказывает как с помощью Postfix организовать параллельную доставку почты на несколько почтовых серверов в рамках одно доменного имени, без использования общеизвестной пересылки или сборщика писем. В данном случае письма для почтового ящика someuser@example.com будут доставляться на несколько почтовых серверов, где именно этот почтовый ящик и настроен.

В роли вторичного сервера я буду использовать бизнес аккаунт на mail.ru. Почтовый сервер mx.mail.ru

В своем распоряжении я имел CentOS сервер с предустановленным стэком  Postfix+Dovecot. Виртуальные почтовые ящики хранились в базе MySQL.

Если у Вас нету такого счастья - можете ознакомиться со статьей:  [Установка и Настройка Postfix](http://www.tech-notes.net/install-configure-postfix/ "Установка и Настройка Postfix")

Для начала нужно установить доставщик почты - msmtp:

```bash
yum install msmtp
```

Если ничего не нашлось - включите Epel репозитарий и повторите предыдущий шаг:

```bash
wget http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm  
rpm -ihv epel-release-6-8.noarch.rpm
```

Создаем общедоступную папку на сервере:

```bash
mkdir /opt/smtpdd
```

Дальше нужно скачать скрипт доставки:

```bash
wget -O /opt/smtpdd/smtpdd.sh /wp-content/uploads/2014/05/smtpdd.sh
```

Создаем папку для временного хранилища очереди доставки:

```bash
mkdir /var/spool/smtpdd
```

Создадим пользователя под которым будет работать скрипт:

```bash
useradd smtpdd  
chown -R smtpdd:smtpdd /opt/smtpdd  
chown -R smtpdd:smtpdd /var/spool/smtpdd
```

Дальше в любимом редакторе откройте файл `/etc/postfix/master.cf` и внесите в него вот такую запись.:

```bash
dualdelivery unix - n n - 5 pipe  
	user=vmail argv=/opt/smtpdd/smtpdd.sh /var/spool/smtpdd ${sender} ${recipient} localhost:10026:q mx.mail.ru:25:q
```

Не забудьте заменить `mx.mail.ru` адресом Вашего второго сервера.

Теперь создаем дополнительный фильтр для доставки почты на себя:

```bash
localhost:10026 inet n - n - - smtpd  
	-o content_filter=  
	-o receive_override_options=no_unknown_recipient_checks,no_header_body_checks,no_milters
```

Осталось включить фильтр dualdelivery для smtp сервиса. Этот сервис, как правило, описан в первой незакомментированной строке master.cf. Приводим ее к следующему виду:

```bash
smtp inet n - n - - smtpd  
	-o content_filter=dualdelivery
```

Теперь нужно удостовериться что один из следующих параметров объявлен в `/etc/postfix/main.cf:`

```bash
- relay_domains = yourdomain.com  
- virtual_mailbox_domains = mysql:$config_directory/virtual_domains.cf
```

Все. Можно перезапускать postfix и проверять все ли работает.
