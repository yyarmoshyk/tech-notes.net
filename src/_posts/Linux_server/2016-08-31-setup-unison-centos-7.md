---
id: 3404
title: Установка Unison на CentOS 7
date: 2016-08-31T11:06:55+00:00
author: admin

guid: http://www.tech-notes.net/?p=3404
permalink: /setup-unison-centos-7/
image: /wp-content/uploads/2016/08/unison.png
categories:
  - Linux server
---
`Unison` - одна из утилит, которая используется для репликации файлов между серверами. Большим достоинством Unison является поддержка master-master репликации.

До недавнего времени Unison был доступен в репозитории `Epel`, но по незвестным причинам его там больше нету, поэтому предлагается его скомпилить из пакета с исходным кодом. Для этого нам понадобятся некие пакеты:

```bash
yum install ocaml ocaml-camlp4-devel ctags ctags-etags
```

Скачиваем `Unison`:

```bash
cd /usr/src  
wget http://www.seas.upenn.edu/~bcpierce/unison//download/releases/stable/unison-2.48.4.tar.gz  
tar xvfz unison-2.48.4.tar.gz  
cd src  
make
```

```bash
sudo cp -v unison /usr/local/sbin/  
sudo cp -v unison /usr/bin
```

Это не ошибка и не опечатка. Если бинарника не будет в папке /usr/bin - может выскочить следующая ошибка:

```bash
Contacting server ...
bash: unison: command not found  
Fatal error: Lost connection with the server
```

Создаем папку с конфигами:

```bash
mkdir ~/.unison/  
cd ~/.unison/
```

Создаем в ней конфигурационный файл для синхнонизации с сервером web2:

```bash
vim sync-web2.prf
```

Содержимой файла следующее:

```bash
# Reasonable defaults
auto=true
confirmbigdeletes=true
contactquietly=true
group=true
maxthreads=20
numericids=true
owner=true
times=true

# Skip confirmation
batch=true

# Suppress output (sets batch=true)
silent=true

# Run in a loop, repeating every X seconds (sort of daemon mode)
#repeat=60

# Log all sync operations
log=true
logfile=/var/log/unison.log

# Backup deleted files
backup=Name *
backuplocation=central
backupdir=/var/www/unison-backups/
maxbackups=2

# Local root
root=<strong>/var/www/vhosts/website_name</strong>/

# Remote root (the double forward-slash between IP and remote path is correct)
root=ssh://<strong>web2_ip_address/var/www/vhosts/website_name</strong>/

# Resolve conflicts in favor of local root
prefer=newer

# Don't sync (can specify multiple ignore lines)
#ignore=Path */var/cache
ignore=Path anon_ftp
ignore=Path bin
ignore=Path conf
ignore=Path error_docs
ignore=Path httpsdocs
ignore=Path statistics
ignore=Path subdomains
ignore=Path web_users
ignore=Path tmp/session
ignore=Path tmp/cache    
ignore=Path tmp/page_parse_time.log
ignore=Path tmp/sessionsadmin
ignore=Path rewrite.log
```


Для синхронизации выполните следующее:

```bash
unison sync-web2
```

Рекомендуется запланировать выполнение с определенным интервалом с помощью cron задачи:

```bash
crontab -e  
*/10 * * * * unison sync-web2 2>&1 > /dev/null
```

[https://www.digitalocean.com/community/questions/install-unison-in-centos-7](https://www.digitalocean.com/community/questions/install-unison-in-centos-7)
