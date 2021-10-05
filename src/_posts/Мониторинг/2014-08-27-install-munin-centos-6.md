---
id: 1453
title: Установка Munin на CentOS
date: 2014-08-27T16:09:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=1453
permalink: /install-munin-centos-6/
image: /wp-content/uploads/2014/08/logo-munin-webserver-monitoring.jpg
categories:
  - мониторинг
tags:
  - munin mysql
  - установка munin
---
Munin является инструментом для мониторинга сетевых устройств с возможностью сохранения истории производительности этих устройств. Графики производительности можно смотреть в браузере.

С помощью Munin можно контролировать работу серверов, приложений, мониторить погоду в Сибири или того, что придет Вам на ум. На основе графиков производительности определить, в какой момент с сервером пошло что-то не так (на пример увеличилось потребление памяти)

Для установки [подключите Epel репозиторий](http://www.tech-notes.net/epel-remi-atrpms-rhel-centos/):  
**5.4:**

```bash
sudo rpm -Uvh http://dl.fedoraproject.org/pub/epel/5/i386/epel-release-5-4.noarch.rpm
```

**6.8:**

```bash
sudo rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
```

Установка агента/клиента:

```bash
yum install munin-node
```

Установка сервера:

```bash
yum install munin
```

### Настройки клиентской части
Конфигурация находятся в файле `/etc/munin/munin.conf`  
Можете изменить стандартное расположение каталогов и файлов, с помощью следующих директив в файле:

```bash
dbdir /var/lib/munin  
htmldir /var/www/html/munin  
logdir /var/log/munin  
rundir /var/run/munin
```

Сразу после установки в сервере будет доступен только localhost. Для того, что бы добавить дополнительные сервера, найдите следующие строки:

```bash
# a simple host tree  
[localhost]  
address 127.0.0.1  
use_node_name yes
```

Добавьте необходимые сервера с помощью следующего шаблона:

```bash
[server_name]  
address 12.34.56.78
use_node_name yes
```

Учтите, что если Вы поменяли значение `htmldir` в файле `/etc/munin/munin.conf`, тогда эту папку нужно создать самому и скопировать в нее все файлы с `/var/www/html/munin`

После этого нужно подредактировать файл настроек для Apache (`/etc/httpd/conf.d/munin.conf`)

```bash
Alias /munin /**путь_к_htmldir**/munin
```

Теги `directory` нужно подредактировать соответствующим образом.

Дальше генерируем пароль для авторизации на странице `munin`:

```bash
htpasswd -cmb /etc/munin/munin-htpasswd munin_user munin_password
```

### Настройки клиентской части

находятся в файле `/etc/munin/munin-node.conf`  
Нас интересуют строки, позволяющие подключаться к агенту, на основе ip адресов. Сразу после установки в файле разрешено подключаться только с адреса 127.0.0.1.

```bash
allow ^127\.0\.0\.1$
```

Думаю понятно, что сюда нужно добавить ip адрес сервер с демоном munin, что бы разрешить ему собирать информацию.

Ставим munin на автозагрузку

```bash
chkconfig -add munin-node
```

Запускаем

```bash
/etc/init.d/munin-node start
```

По умолчанию munin будет опрашивать все сервера 1 раз в 5 минут. Соответсвенно шаг на всех графиках будет равен 5 минутам. Для того, что бы получать более точную информацию нужно подредактировать следующий файл:

```bash
/etc/cron.d/munin
```

И сменить 5 минут на 1.

В браузере открываем `http://<strong>ip_адрес_вашего_сервера</strong>/munin/`

[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-27-120441.png" alt="Screenshot from 2014-08-27 12:04:41" width="307" height="343" class="aligncenter size-full wp-image-1455" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-27-120441.png 307w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-27-120441-152x170.png 152w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-27-120441-268x300.png 268w" sizes="(max-width: 307px) 100vw, 307px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-27-120441.png)

### Мониторим MySQL:

Нужно отредаткировать плагин и внести в него имя пользователя и пароль для доступа к mysql:

```bash
vim /usr/share/munin/plugins/mysql_
```

Находим секцию `%config`  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2015-04-23-144332.png" alt="Screenshot from 2015-04-23 14:43:32" width="714" height="215" class="aligncenter size-full wp-image-2544" srcset="/wp-content/uploads/2014/08/Screenshot-from-2015-04-23-144332.png 714w, /wp-content/uploads/2014/08/Screenshot-from-2015-04-23-144332-170x51.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2015-04-23-144332-300x90.png 300w" sizes="(max-width: 714px) 100vw, 714px" />](/wp-content/uploads/2014/08/Screenshot-from-2015-04-23-144332.png)

Дальше все понятно - на против `mysqlpassword` нужно поставить пароль админа. При необходимости изменить имя пользователя.

Осталось включить плагин:

```bash
cd /etc/munin/plugins  
ln -sf /usr/share/munin/plugins/mysql_ mysql_
```

Следующая команда выводит список графиков, которые можно получить с помощью плагина:

```bash
/usr/share/munin/plugins/mysql_ suggest
```

Для того, что бы включить все предложеные плагины выполните:

```bash
for i in \`./mysql_ suggest\`; do ln -sf /usr/share/munin/plugins/mysql_ $i; done
```

Для применения изменений перезапустите демон:

```bash
service munin-node restart
```

### Обнуляем данные:

Бывает так, что какой-то из серверов приходится удалить, а его графики остаются. Или вы обнаружили, что что-то настроено неправильно и хотите очистить все в munin и начать с чистого листа.

Munin хранит информацию в двух папках. Их-то и нужно очистить:

```bash
rm -rf /var/www/html/munin/*  
rm -rf /var/lib/munin/*
```

Дальше нужно руками запустить `munin-cron`

```bash
su - munin -shell=/bin/bash  
/usr/bin/munin-cron
```

**Включаем мониторинг Apache2**:  
Для начала удостоверимя, что `status_module` установлен и включен в конфигурации `Apache2:`

```bash
apachectl -t -D DUMP_MODULES 2>&1|grep status_module
```

Если все ОК - содаем конфигурационный файл

```bash
nano /etc/httpd/conf.d/status.conf
```

Со следующим содержанием:

```bash
<IfModule mod_status.c>

ExtendedStatus On
<Location /server-status>
  SetHandler server-status
  Order deny,allow
  Deny from all
  Allow from localhost ip6-localhost
  Allow from 127.0.0.1
  Allow from 192.168.100.0/24
</Location>

</IfModule>
```


Включаем плагины munin:

```bash
sudo ln -s /usr/share/munin/plugins/apache_processes /etc/munin/plugins/apache_processes  
sudo ln -s /usr/share/munin/plugins/apache_accesses /etc/munin/plugins/apache_accesses  
sudo ln -s /usr/share/munin/plugins/apache_volume /etc/munin/plugins/apache_volume
```
