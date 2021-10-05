---
id: 2634
title: Установка monit в Debian/Ubuntu
date: 2015-05-29T18:58:28+00:00
author: admin

guid: http://www.tech-notes.net/?p=2634
permalink: /use-monit-debial-ubuntu/
image: /wp-content/uploads/2015/05/monitoring_logo.jpg
categories:
  - Мониторинг
tags:
  - Ubuntu Linux
  - monit
---
Monit — программа для проверки состояния сервисов на и поддержки их на плаву, которая умеет слать уведомления в случае каких либо отклонений, софтина работает под linux, bsd и других unix-системах. Используется как средство мониторинга и перезапуска каких либо сервисов. Гибкие настройки и функционал делают программу очень даже привлекательной! Рекомендую к употреблению и добро пожаловать под кат.  

Monit умеет проверять:

  * Существование процесса по PID.
  * Работу определенного порта (TCP/UDP).
  * Ответ определенного протокола по порту (SMTP, SSH, HTTP,MYSQL…).
  * Ресурсы, занимаемые процессом (CPU/RAM).
  * Объем и свободное пространство в файловой системе.
  * Права доступа к файлу или каталогу.

В случае отклонений monit может:

  * Остановить, стартовать или перезапустить сервис.
  * Подождать определенное время.
  * Послать уведомление.
  * Примонтировать, отмонтировать файловую систему
  * Запустить отдельный скрипт и передать ему определенные параметры.

Как видите функционал довольно таки серьезный, софтина есть практически во всех распространенных дистрибутивах Debian, CentOS, FreeBSD. Устанавливать в Debian будем из портов:

```bash
aptitude install monit
```

Готово? идем конфигугрировать, но перед этим я немного схитрю, поставилась у нас не самая свежая версия а мы хотим свежую с полным функционалом, идем на [официальный сайт](http://mmonit.com/monit/download/) и качаем под свою ОС.

Берем из архива исполняемый файл monit и кладем его к себе в `/usr/bin/monit` с заменой =)

Теперь можно настроить конфиг, [документация](http://mmonit.com/monit/documentation/)

```bash
nano /etc/monit/monitrc
```

Например можно настроить как то так:

```bash
###############################################################################  
## Monit конфигурационный файл  
###############################################################################  
## Запустить monit как депон и проверять процесс с интервалом 1 минута  
set daemon 60  
# Использовать syslog регистрирующий со средством &#8216;демона&#8217;.  
set logfile syslog facility log_daemon  
## Список mailservers для доставки оповещения.По умолчанию это 25 порт.  
set mailserver localhost # primary mailserver  
set eventqueue  
basedir /var/log/monit # путь к каталогу, где будут храниться оповещения  
slots 100 # лимит  
## Вы можете самостоятельно задать формат письма  
set mail-format { from: system-alert@host.com }  
#set alert sis@host.com # все оповещения  
set mmonit http://monit:password@IP:PORT/collector  
set httpd port 2800 and  
use address IP-SERVER  
allow admin:admin
```

Состояние сервера в целом

```bash
check system serv.host.com  
group server  
if loadavg (15min) > 10 then alert  
if loadavg (5min) > 30 then alert  
if memory usage > 90% then alert
```

Проверка apache2

```bash
check process apache2 with pidfile /var/run/apache2.pid  
group www  
start program = `/etc/init.d/apache2 start`  
stop program = `/etc/init.d/apache2 stop`  
if cpu > 50% for 3 cycles then alert # если загрузка cpu > 50% в течение 5 (проверок) послать предупреждение.  
if cpu > 90% for 3 cycles then restart # если загрузка cpu > 90% в течение 3 циклов то послать перезапустить процесс.  
if totalmem > 4000.0 MB for 3 cycles then restart # если юзается больше 600 MB мозгов то перезапустить процесс.  
if children > 200 then restart # если число дочерних процессов > 50 то перезапустить процесс.  
if failed host IP_ADDR port 80 protocol HTTP then restart # передернуть если не отвечает.  
if 5 restarts within 5 cycles then timeout # если 5 раз уже перезапускали процесс то сделать timeout.
```

Проверка nginx

```bash
check process nginx with pidfile /var/run/nginx.pid  
group www  
start program = `/etc/init.d/nginx start`  
stop program = `/etc/init.d/nginx stop`  
if cpu > 50% for 3 cycles then alert # если загрузка cpu > 50% в течение 3 (проверок) послать предупреждение.  
if cpu > 90% for 5 cycles then restart # если загрузка cpu > 80% 6 циклов то послать перезапустить процесс.  
if totalmem > 1200.0 MB for 3 cycles then restart # если юзается больше 200 MB мозгов то перезапустить процесс.  
if children > 10 then restart # если число дочерних процессов > 5 то перезапустить процесс.
```

Проверка dovecot

```bash
check process dovecot with pidfile /var/run/dovecot/master.pid  
start program = `/etc/init.d/dovecot start`  
stop program = `/etc/init.d/dovecot stop`  
if cpu > 50% for 3 cycles then alert  
if cpu > 90% for 5 cycles then restart  
if totalmem > 400.0 MB for 5 cycles then restart  
if children > 40 then restart  
if failed port 110 type TCP protocol POP then restart  
if 5 restarts within 5 cycles then timeout
```

Проверка exim

```bash
check process exim with pidfile /var/run/exim4/exim.pid  
start program = `/etc/init.d/exim4 start`  
stop program = `/etc/init.d/exim4 stop`  
if cpu > 50% for 3 cycles then alert  
if cpu > 90% for 5 cycles then restart  
if children > 30 then restart  
#if failed port 25 protocol smtp then restart  
if 5 restarts within 5 cycles then timeout
```

Проверка mysql

```bash
check process mysql with pidfile /var/run/mysqld/mysqld.pid  
group www  
start program = `/etc/init.d/mysql start`  
stop program = `/etc/init.d/mysql stop`  
if failed unixsocket /var/run/mysqld/mysqld.sock then restart  
#if failed host 127.0.0.1 port 3306 protocol mysql then restart  
if 5 restarts within 5 cycles then timeout
```

Проверка SSH

```bash
check process sshd with pidfile /var/run/sshd.pid  
start program `/etc/init.d/ssh start`  
stop program `/etc/init.d/ssh stop`  
if failed host IP_ADDR port 22 protocol ssh then restart  
if 5 restarts within 5 cycles then timeout
```

Проверяем устройство по точке монтирования.

```bash
check device rootfs with path /  
if failed permission 755 then alert  
if space usage > 90% for 5 times within 10 cycles then alert  
if inode usage > 90% for 5 times within 10 cycles then alert  
group server
```

А вот так можно проверять свои сервера по вебу:

```bash
#host1  
check host имя_сервера with address имя_сервера.ру  
group host  
if failed port 80 protocol http and request `/status.php` for 2 cycles then alert  
#host2  
check host имя_сервера2 with address имя_сервера2.ру  
group host  
if failed port 80 protocol http and request `/status.php` for 2 cycles then alert
```

Аналогично но + поиск строки в ответе

```bash
check host host with address host3.com  
group host  
CONTENT != `The page you are looking for is temporarily unavailable`  
timeout 60 seconds 3 cycles  
then alert
```
