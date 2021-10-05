---
id: 667
title: Создаем безопасный web-сервер
date: 2014-03-14T15:49:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=667
permalink: /create-secure-web-server/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Apache
tags:
  - Безопасность
  - FromHabrSandbox
  - Apache
  - chroot
  - debootstrap
  - mod-security
---
Для создания максимально защищенного web-сервера нам нужно:
  * Создать chroot «песочницу» с помощью debootstrap
  * становить в песочнице apache2, php5, mysql
  * становить и настроить mod-security2, а также отредактировать необходимые директивы конфигурационных файлов apache и php.

За основу берем дистрибьютив Ubuntu.

**Создаем сhroot песочницу**.  
Для начала нужно добавить новый репозиторий в sources.list и обновить список пакетов.

```bash
echo 'deb ubuntu.mirror.cambrium.nl/ubuntu/ lucid main universe' >> /etc/apt/sources.list
apt-get update
```


Устанавливаем сам debootstrap и создаем вложенную ОС — chroot песочницу:

```bash
apt-get install debootstrap
```


Если установка прошла успешно — запустим утилиту:

```bash
debootstrap --variant=buildd --arch i386 lucid /home/chroot archive.ubuntu.com/ubuntu/
```


В аргументах к утилите мы указали:
  * архитектуру будущей системы,
  * дистрибьютив,
  * непосредственно директорию, которая будет нам служить chroot песочницей
  * репозиторий из которого утилита должна скачать дистрибьютив.

**Установим mysql**.  
Все дело в том, что мускул отказывается корректно работать в песочнице.Можна сделать проще.Устанавливаем mysql в основную ОС:

```bash
apt-get install mysql-server mysql-client
```


Затем редактируем конфиг (/etc/mysql/my.cnf) и меняем `bind_address` c `127.0.0.1` на `127.0.0.1`

После этих действий mysql будет доступен внутри песочницы, однако в качестве хоста mysql нужно указывать не localhost, а 127.0.0.1

**Настроим chroot.**  
Для начала нужно настроить резолвер и список репозиториев для chroot. Выполним команды:

```bash
cp /etc/resolv.conf /home/chroot/etc/resolv.conf
cp /etc/apt/sources.list /home/chroot/etc/apt/sources.list
```


Пробрасываем в chroot окружение системные файловые системы. Для этого в любимом редакторе открываем файл /etc/fstab и вносим в него следующие строки:

```bash
/proc /home/chroot/proc none rbind 0 0
/dev /home/chroot/dev none rbind 0 0
/sys /home/chroot/sys none rbind 0 0
```


Сохраняем и монтируем:

```bash
mount -a
```


На этом работа в основной ОС закончена. Выполним последнюю команду в основном терминале, чтобы перейти в ОС chroot-песочницы:

```bash
chroot /home/chroot
```


Настроим ОС внутри chroot.выполняем уже знакомые команды:

```bash
echo 'deb ubuntu.mirror.cambrium.nl/ubuntu/ lucid main universe' >> /etc/apt/sources.list
apt-get update
```


Переходим к установке apache2 и php внутри chroot.Установка ничем не отличается от обыденной установки, поэтому подробно останавливаться на этом не буду, каждый выберет сам для себя необходимые модули. (модуль libapache2-mod-security2 обязателен к установке):

```bash
apt-get install apache2 apache2-doc apache2-mpm-prefork apache2-utils libexpat1 ssl-cert libapache2-mod-security2
apt-get install libapache2-mod-php5 libapache2-mod-ruby php5 php5-common php5-curl php5-dev php5-gd php5-idn php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-mhash php5-ming php5-mysql php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl
```


**Заключительный этап.**  
Конфигурация apache2, php, libapache2-mod-security2.Создаем пользователя apache и пользовательского каталога:

```bash
cd /; mkdir -m 755 web
useradd dot -b /web -m -U -s /bin/false
chmod 754 /web/dot
mkdir -p -m 754 /web/dot/public_html/www
mkdir -p -m 777 /web/dot/tmp
chmod +t /web/dot/tmp
chown -R dot:dot /web/dot/
```


Итак, мы создали пользователя, отключили ему шел, создали домашнюю директорию, создали веб директорию, создали персональную временную директорию и рекурсивно сменили хозяина директорий.

Редактируем дефолтного виртуального хоста под нашего юзера:

```bash
nano /etc/apache2/sites-enabled/000-default
```


Содержимое:

```bash
<VirtualHost *:80>
DocumentRoot "/web/dot/public_html/www/"
ServerName dot
ErrorLog /web/dot/error_log
CustomLog /web/dot/access_log combined
```


Меняем дефолтного пользователя и группу, от которого будет работать apache. Для этого редактируем конфигурационный файл apache2:

```bash
nano /etc/apache2/apache2.conf
```


```bash
User www-data
Group dot
```


Добавляем несколько директив в конец файла:

```bash
# Отключаем подпись внизу служебных страниц apache (страница 404 ошибки и т.п.)
ServerSignature Off
# Ответ сервера в заголовке (значение Prod выведет только название софта — Apache)
ServerTokens Prod
#отключаем запуск CGI-скриптов, запрещаем следовать по символьным ссылкам, запрещаем просмотр каталогов, запрещаем SSI
Options -ExecCGI -FollowSymLinks -Indexes -Includes
```


Редактируем конфигурационный файл php.ini:

```bash
nano /etc/php5/apache2/php.ini
```


Изменяем значение следующих директив:

```bash
expose_php = Off
magic_quotes_gpc = On
register_globals = Off
disable_functions = popen,exec,system,passthru,proc_open,shell_exec,in i_restore,dl,symlink,chgrp,ini_set,putenv,extensio n_loaded,getmyuid, posix_setuid,posix_setsid,posix_setpgid,posix_kill ,apache_child_terminate,chmod,chdir,phpinfo
safe_mode = On
safe_mode_gid = On
open_basedir = "/web/dot/"
```


**Настраиваем mod-security2**  
Для начала создадим необходимые каталоги и файлы:

```bash
mkdir /etc/apache2/conf.d/modsec
mkdir /var/log/apache2/modsec
touch /etc/apache2/conf.d/modsec/modsecurity_crs_10_config.conf
touch /etc/apache2/conf.d/modsec/modsecurity_crs_15_customrules.conf
```


Далее отредактируем созданные файлы:  
modsecurity_crs_10_config.conf — файл с основными настройками модуля  
modsecurity_crs_15_customrules.conf — файл с правилами для модуля

```bash
nano /etc/apache2/conf.d/modsec/modsecurity_crs_10_config.conf
```


Содержимое:

```bash
# Включить движок фильтра
SecRuleEngine On
# Вести лог только для подозрительных запросов:
SecAuditEngine RelevantOnly
# Имя файла лога
SecAuditLog /var/log/apache2/modsec/audit_log
# Вывод отладочной информации
SecDebugLog /var/log/apache2/modsec/debug_log
SecDebugLogLevel 1
# Для подозрительных запросов по умолчанию писать в лог:
# и возвращать HTTP ответ с кодом 403
SecDefaultAction log,auditlog,deny,status:403,phase:2
```


Второй файл:

```bash
nano /etc/apache2/conf.d/modsec/modsecurity_crs_15_customrules.conf
```


Содержимое:

```bash
# Защита от LFI\read file
SecRule ARGS "\.\./"
SecRule ARGS "/etc.+passwd" «t:lowercase»
SecRule ARGS "/proc/.+" «t:lowercase»
# Защита от SQL-injections
SecRule ARGS «delete.+from» «t:lowercase»
SecRule ARGS «insert.+into» «t:lowercase»
SecRule ARGS «select.+from» «t:lowercase»
SecRule ARGS «union.+select» «t:lowercase»
SecRule ARGS «group_concat» «t:lowercase»
SecRule ARGS «information_schema» «t:lowercase»
SecRule ARGS «benchmark» «t:lowercase»
# Изменяем ответ сервера, софт теперь у нас не apache
SecServerSignature «Guess»
```


Вышеуказанные правила для модуля рабочие, хотя и требуют доработки, приведены для примера.

Эта статья была взята с песочницы ресурса <a href="http://habrahabr.ru/" target="_blank">Habrahabr</a>. Оригинальный вариант доступен по ниже указанной ссылке:  
<a href="http://habrahabr.ru/sandbox/34788/" target="_blank">Создаем безопасный web-сервер</a>

Огромное спасибо хабрапользователю **Абитура**
