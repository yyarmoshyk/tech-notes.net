---
id: 1865
title: Виртуальные пользователи в Pure-Ftp
date: 2014-10-08T14:43:23+00:00
author: admin

guid: http://www.tech-notes.net/?p=1865
permalink: /pure-ftpd-virtual-users/
image: /wp-content/uploads/2014/10/pure-ftpd-logo.png
categories:
  - FTP
tags:
  - Pure-Ftp
---
Хочу рассмотреть вариант использования виртуальных пользователей в `pure-ftpd`.

Предполагаю, что Pure-Ftp у Вас установлен.

Если же нет выполните следующую команду:

```bash
apt-get install pure-ftpd-common pure-ftpd
```

или

```bash
yum install pure-ftpd
```

Нужно подредактировать конфигурационный файл (`/etc/pure-ftpd/pure-ftpd.conf`) и удостовериться, что следующие параметры не закоментированы и выставлены должным образом:

```bash
ChrootEveryone yes  
PureDB /etc/pure-ftpd/pureftpd.pdb  
PAMAuthentication yes  
PassivePortRange 30000 50000
```

Добавляются виртуальные пользователи следующей командой:

```bash
pure-pw useradd **username** -u **ftpuser** -d /home/ftpusers/username
```

С этого места хотелось бы описать подробнее. В приведенном мною примере виртуальный пользователь **username** будет иметь доступ к файлам и папкам, к которым имеет пользователь **ftpuser**. Выходит этакий алиас пользователя **ftpuser**. Вместо **ftpuser** можно использовать имена других пользователей и указывать домашний каталог соответственно.

На пример, в системе есть пользователь techuser, его домашний каталог - `/home/techuser`. В этом каталоге есть какая-то папка, который мы хотим поделиться. Пускай это будет `/home/techuser/documents/shared_docs`.

```bash
pure-pw useradd ftptechuser -u techuser -d /home/techuser/documents/shared_docs
```

Другой пример, который является более практичным: нужно организовать доступ к файлом сайта, которые принадлежат пользователю `www-data` (`apache`) и хранятся в папке `/var/www/html`. Нужно что бы после заливки через фтп новые файлы принадлежали пользователю `www-data` (`apache`).  
Создайте вот такого виртуального пользователя:

```bash
pure-pw useradd ftpapache -u www-data -d /var/www/html
```

Естественно никакой пользователь не сможет подключиться к серверу без пароля. Пароли устанавливаются вот так:

```bash
pure-pw passwd **username**
```

Пароли виртуальных юзерОв хранятся в файле `/etc/pure-ftpd/pureftpd.passwd`

Обновляется файл следующей командой:

```bash
pure-pw mkdb
```

Посмотреть информацию о виртуальном пользователе можно вот так:

```bash
pure-pw show **username**
```

Посмотреть, какие пользователи существуют в конфиге можно с помощью:

```bash
pure-pw list
```

В CenoS обязательно обратите внимание на id пользователя на которого линкуется виртуальный юзер `pure-ftpd`. Значение должно быть больше 1000. Раньше можно было подредактировать `/etc/pure-ftpd/pure-ftpd.conf` и сменить в нем значения `MinUID` и `TrustedGID` с 100 на 48, в случае с пользователем `apache`.

В последних версиях `pure-ftpd` отказывается кушать эту таблетку и настойчиво продолжает выдавать следующую ошибку в `/var/log/messages`:

```bash
[INFO] New connection from 109.123.120.187  
[WARNING] Can't login as [user]: account disabled  
[INFO] Logout.
```

Выполните следующую команду для получения id системного пользователя:

```bash
id www-data
```

В стандартном варианте получите 48. Следующая комбинация моканд Вам поможет:

```bash
usermod -u 1021 -p -U www-data  
groupmod -g 1021 www-data  
sed -i 's/48/1021/g' /etc/pure-ftpd/pureftpd.passwd  
pure-pw mkdb
```

В Ununtu/Debian все ровно. Просто подредактируйте следующий файл idшником системного пользователя www-data (обычно это 33):

```bash
/etc/pure-ftpd/conf/MinUID
```

Учтите, что после таких действий системный пользователь `www-data` перестанет быть владельцем тех файлов, которые ему принадлежали раньше.

**Не забудьте обновить права доступа с помощью команды `chown`**

В Ubuntu столкнулся с такими ошибками в `/var/log/auth.log`

```bash
pure-ftpd: pam_unix(pure-ftpd:auth): authentication failure; logname= uid=0 euid=0 tty=pure-ftpd ruser=username rhost= user=username
```

и такими в `/var/log/syslog`

```bash
Jun 19 14:48:43 pure-ftpd: (?@1xx.xx.xxx.x7) [INFO] PAM_RHOST enabled. Getting the peer address  
Jun 19 14:48:48 pure-ftpd: (?@1xx.xx.xxx.x7) [WARNING] Authentication failed for user
```

Конфигурация pure-ftpd отличается в Ubuntu от CentOS. Что бы заработали виртуальные пользователи выполните следующие команды:

```bash
sudo echo 'no' > /etc/pure-ftpd/conf/PAMAuthentication  
sudo echo 'no' > /etc/pure-ftpd/conf/UnixAuthentication  
sudo echo '/etc/pure-ftpd/pureftpd.pdb' > /etc/pure-ftpd/conf/PureDB  
sudo ln -s /etc/pure-ftpd/conf/PureDB /etc/pure-ftpd/auth/50pure
```

Не забываем про порты для пасивного режима:

```bash
iptables -A INPUT -p tcp -m tcp -sport 1024: -dport 1024: -m conntrack -ctstate ESTABLISHED -j ACCEPT -m comment -comment 'Allow passive inbound connections'  
iptables -A OUTPUT -p tcp -m tcp -sport 1024: -dport 1024: -m conntrack -ctstate ESTABLISHED,RELATED -j ACCEPT -m comment -comment 'Allow passive inbound connections'
```

В случае с CentOS 7:

```bash
firewall-cmd -permanent -zone=public -add-service=ftp  
firewall-cmd -permanent -add-port=30000-50000/tcp  
firewall-cmd -reload
```
