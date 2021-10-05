---
id: 1681
title: Использование cPanel (WHM) для управления кластером
date: 2014-09-16T10:23:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=1681
permalink: /whm-cpanel-for-clusters/
image: /wp-content/uploads/2014/09/cluster_whm1.png
categories:
  - WHM/cPanel
tags:
  - cpanel кластер
  - WHM
  - whm кластер
---
WHM - неплохой инструмент управления сервером. Хоть он и платный, но разработчки постарались на славу. Довольно распространенным является установка WHM/cPanel на один сервер, который будет содержать и базы данных, и файлы сайтов, и учетные записи пользователей. Но что же делать, если у Вас есть несколько серверов и отдельный сервер для баз данных?  
На первый взгляд все до безобразия просто - поставить WHM/cPanel на несколько серверов и радоваться жизни. Но это только на первый взгляд.В этой статье хочу описать подход к настройке кластера серверов, в котором используется WHM/cPanel для управления конфигурацией.  

## На первом /главном сервере:  
* [Устанавливаем cPanel](/install-whm-cpanel/) на главный сервер.  
* Настраиваем на нем [nfs server](/configure-nfs-server-and-client-centos/)
* Монтируем папки home и `/usr/local/apache/conf` на второй сервер.

Генерируем ключи ssh на первом сервере для пользователя root используя `ssh-keygen`

Копируем его публичную часть на второй сервер:

```bash
scp ~/.ssh/id_rsa.pub root@**remote_ip**:~/.ssh/
```

Теперь наш главный сервер может подключаться ко второму без пароля.

Теперь нужно подправить шаблон хоста для apache на первом/главном сервере:

```bash
nano /var/cpanel/templates/apache2_2/vhost.default  
nano /var/cpanel/templates/apache2_2/ssl_vhost.default
```

В самой первой строке добавляем следующее сразу же после `[% ipblock.ip %]:[% ipblock.port %]`

```bash
*:[% ipblock.port %]
```


В результате первая строка файла будет выглядеть следующим образом:

```bash
<VirtualHost[% FOREACH ipblock IN vhost.ips %] [% ipblock.ip %]:[% ipblock.port %] *:[% ipblock.port %][% END %]>
```


Копируем файлы на второй сервер

```bash
rsync -Hogva /opt/* root@**remote_ip**:/opt/  
rsync -Hogva /usr/local/cpanel root@**remote_ip**:/usr/local/  
rsync -Hogva /var/cpanel root@**remote_ip**:/var/  
rsync -Hogva /usr/local/apache root@**remote_ip**:/usr/local/  
scp /etc/init.d/httpd root@**remote_ip**:/etc/init.d/  
scp /usr/bin/php* root@**remote_ip**:/usr/bin/
```

Создаем файлы `/usr/local/cpanel/scripts/postkillacct` и `/usr/local/cpanel/scripts/postwwwacctuser` со следующим содержанием:

```bash
#!/bin/bash
scp /etc/passwd root@<strong>remote_ip</strong>:/etc/
scp /etc/group root@<strong>remote_ip</strong>:/etc/

ssh root@remote_ip '/etc/init.d/httpd restart'
```


Делаем их исполняемыми:

```bash
chmod +x /usr/local/cpanel/scripts/postwwwacctuser  
chmod +x /usr/local/cpanel/scripts/postkillacct
```

Создаем хук, который будет запускаться перед выполнениеь easyapache:

```bash
nano /usr/local/cpanel/scripts/preeasyapache
```

Вносим в него следующие строки:

```bash
#!/bin/bash
cp /etc/init.d/httpd /root/httpd_$(date %d-%m-%Y).bak
```


Создаем хук, который будет запускаться после выполнения easyapache:

```bash
nano /usr/local/cpanel/scripts/posteasyapache
```

Вносим в него следующие строки:

```bash
#!/bin/bash
rsync -Hogva /opt root@<strong>remote_ip</strong>:/
rsync -Hogva /usr/local/cpanel root@<strong>remote_ip</strong>:/usr/local/
rsync -Hogva /var/cpanel root@<strong>remote_ip</strong>:/var/
rsync -Hogva /usr/local/apache --exclude=conf --exclude=conf.d --exclude=logs --exclude=domlogs root@<strong>remote_ip</strong>:/usr/local/
scp /usr/bin/php* root@<strong>remote_ip</strong>:/usr/bin/
mv /root/httpd_$(date %d-%m-%Y).bak /etc/init.d/httpd
```


Делаем их исполняемыми:

```bash
chmod +x /usr/local/cpanel/scripts/posteasyapache  
chmod +x /usr/local/cpanel/scripts/preeasyapache
```

Осталось создать кастомный хук, который будет дергать апач на удаленном сервере (я решил сильно не заморачиваться. Буду тупо перезапускать его):

```bash
nano /usr/local/cpanel/scripts/postrestartsrv_httpd
```

```bash
#!/bin/bash
ssh root@<strong>remote_ip </strong>'/etc/init.d/httpd restart'
```


Ставим флаг Х:

```bash
сhmod +x /usr/local/cpanel/scripts/postrestartsrv_httpd
```

Осталось сказать WHMу, что этот хук нужно выполнять. Редактируем /usr/local/cpanel/scripts/restartsrv_apache следующей строкой:

```bash
exec '/usr/local/cpanel/scripts/postrestartsrv_httpd'
```


Нужно добавить ip адреса всех серверов в список дополнительных хостов mysql  
[<img src="/wp-content/uploads/2014/09/Screenshot-from-2014-09-12-150902.png" alt="Screenshot from 2014-09-12 15:09:02" width="241" height="495" class="aligncenter size-full wp-image-1686" srcset="/wp-content/uploads/2014/09/Screenshot-from-2014-09-12-150902.png 241w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-12-150902-146x300.png 146w" sizes="(max-width: 241px) 100vw, 241px" />](/wp-content/uploads/2014/09/Screenshot-from-2014-09-12-150902.png)

## На втором сервере
Создаем симлинки:

```bash
ln -s /usr/lib64/mysql/libmysqlclient.so.16.0.0 /usr/lib64/libmysqlclient.so.18  
ln -s /usr/local/apache/bin/apachectl /usr/sbin/apachectl
```

Устанавливаем нужные пакеты:

```bash
yum install libtool-ltdl mysql mysql-libs remote_ip libXpm libpng libjpeg-turbo freetype aspell
```

Если используете ImageMagic:

```bash
yum install lcms-libs
```

```bash
ln -s /usr/local/cpanel/3rdparty/bin/convert /usr/local/bin/convert
```

Перезапускаем apache. На этом все. Добавление 3-го, 4-го и т.д серверов делается по аналогии. Довольно важно подредактировать все хуки, что бы при внесении изменений на главном сервере, они реплицировались на зависимые.
