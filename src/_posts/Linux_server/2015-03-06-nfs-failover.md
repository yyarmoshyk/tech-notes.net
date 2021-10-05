---
id: 2459
title: Работа с отказоустойчивыми NFS серверами
date: 2015-03-06T22:13:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=2459
permalink: /nfs-failover/
image: /wp-content/uploads/2014/02/nfs_mount.png
categories:
  - Linux server
tags:
  - NFS
---
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

Значит понадобилось мне рассмотреть варианты работы 2-х серверов, с которых одна папка монтировалась с использованием NFS на несколько других серверов.

Тоесть имеется 3 web сервера и 1 app сервер на котором лежат файлы. Между web серверами и app сервером настоен шаринг папки /var/www по средствам NFS.

[Статья о том, как установить и настроить NFS.](/configure-nfs-server-and-client-centos/)

Один app сервер - довольно слабо для отказоустойчивого кластера, поэтому возникла идея сделать еще один и настроить [синхронизацию контанта с помощью lsync](/lsync-to-replicate-data/)

Осталось подружить web сервера со вторым app сервером в автоматическом режиме.

Понадобилось сделать велосипед, который автоматически монтировал бы папку со второго сервера, если первый выключен.  
Собственно этот велосипед должен применяться на каждом web сервере.

На Web сервера нужно установить nmap:

```bash
yum install nmap -y
```

На всех серверах нужно отредактировать файл `/etc/sysconfig/nfs` и раскоментировать следующую строку:

```bash
MOUNTD_PORT=892
```

Дальше, для удобства, правим файл `/etc/hosts`:

```bash
192.168.1.134 nfs1  
192.168.1.168 nfs2
```

Дальше я буду использовать имена серверов вместо их ip адресов.

Я решил разместить все в папке `/etc/nfs`

```bash
mkdir /etc/nfs
```

Содержимое файла `/etc/nfs/nfs`  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    /etc/nfs/nfs
  </div>

  <div class="spoiler-body">

<pre>
#!/bin/bash

usage() {
    echo "usage: $0 (nf1|nf2)"
    exit 1
}

mn1() {
    umount /var/www/html/media
    /sbin/mount.nfs nfs1:/var/www/html/media /var/www/html/media
}

mn2() {
    umount /var/www/html/media
    /sbin/mount.nfs nfs2:/var/www/html/media /var/www/html/media
}

case "$1" in
mn1)
    mn1
    ;;
mn2)
    mn2
    ;;
</pre>
</div>
</div>


### Примсотритесь к коду скрипта. Возможно Вам нужно отредактировать пути.

Делаем скрипт исполняемым:

```bash
chmod +x /etc/nfs/nfs
```

Осталось сделать проверялку. Содержимое файла <code>/etc/nfs/checker</code> - в спойлере:

<div class="spoiler-wrap">
<div class="spoiler-head folded">
/etc/nfs/checker
</div>

<div class="spoiler-body">

<pre>
#!/bin/bash
nfs1_state="active";
nfs2_state="inactive";

while true; do
  #check if nfs1 server is avaialble
  live_nfs1=$(nmap -p 892 nfs1 |grep open |awk '{print $2}');
  live_nfs2=$(nmap -p 892 nfs2 |grep open |awk '{print $2}');

  #Proceed if server is avaialble
  if [[ "$live_nfs1" = "open" ]]; then
    if [[ "$nfs1_state" = "inactive" ]]; then
      /etc/nfs/nfs mn1;
      nfs1_state="active";
      nfs2_state="inactive";
    fi
  sleep 3;
  elif [[ "$live_nfs2" = "open" ]]; then
    nfs1_state="inactive";
    if  [[ "$nfs2_state" = "inactive" ]]; then
      nfs2_state="active";
      /etc/nfs/nfs mn2;
    fi
  sleep 3;
  else
    nfs2_state="inactive";
    sleep 3;
  fi

  echo -e "NFS1: $nfs1_state \nNFS2: $nfs2_state \n";
</pre>
</div> </div>

Делаем скрипт исполняемым:

```bash
chmod +x /etc/nfs/checker
```

На всякий случай `/etc/init.d/nfs-check` скрипт, который будет стартовать при загрузке системы:

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
  /etc/init.d/nfs-check
  </div>

<div class="spoiler-body">
<pre>
#!/bin/bash

### BEGIN INIT INFO
# Should-Start:      
# Should-Stop:       
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
### END INIT INFO

# Author: TechNoter

NAME="NFS Checker"
DAEMON="/etc/nfs/checker"

start_nfs_checker() {
  if [ $(ps aux |grep $DAEMON |wc -l) -gt 1 ]; then
    echo "$NAME is running"
  else
    $DAEMON 2>&1 >> /var/log/nfs_checker.log &
    echo "$NAME Started"
  fi
}
stop_nfs_checker() {
  if [ $(ps aux |grep $DAEMON |wc -l) -gt 1 ]; then
    kill -9 $(ps aux |grep $DAEMON | sed -n '1p' |awk '{print $2}')
    echo "Done";
  else
    echo "$NAME not running";
  fi
}

status_nfs_checker() {
  if [ $(ps aux |grep $DAEMON |wc -l) -gt 1 ]
  then
    echo "$NAME is running"
  else
    echo "$NAME not running";
  fi
}

case "$1" in
  start)
    start_nfs_checker
  ;;
  stop)
    stop_nfs_checker
  ;;
  restart)
    stop_nfs_checker && sleep 2 && start_nfs_checker
  ;;
  status)
    status_nfs_checker
  ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
esac
</pre>
</div> </div>

Делаем скрипт исполняемым и ставим на автозагрузку:

```bash
chmod +x /etc/init.d/nfs-check chkconfig nfs-check on
```

Предложеный чекер будет проверять какой из серверов жив и будет монтировать с него нажную папку.
