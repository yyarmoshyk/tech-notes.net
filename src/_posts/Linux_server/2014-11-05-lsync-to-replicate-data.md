---
id: 2106
title: Настройка репликации с помощью lsync
date: 2014-11-05T17:18:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=2106
permalink: /lsync-to-replicate-data/
image: /wp-content/uploads/2014/11/goodsync.jpg
categories:
  - Linux server
tags:
  - CentOS
  - lsync
---
Для репликации даных между серверам ине всегда есть смысл пользоваться функционалом [NFS](/configure-nfs-server-and-client-centos/ ). Если Вам нужно что бы на нескольких серверах было одинаковое содержимое двух каталогов, тогда можно воспользоваться lsync.

Я рассмотрю репликацию файлов на примере папок DNS сервера Bind.

Нужно что бы первый/главный сервер мог соединяться со вторым/зависмым сервером без пароля. Для этого воспользуемся ключами для ssh:

```bash
ssh-keygen
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```
Сам файл `authorized_keys2` нужно скопировать на удаленные сервер и положить в папку `/root/.ssh`.

Устанавливаем все нужное:

```bash
yum -y install lua lua-devel pkgconfig gcc asciidoc lsyncd
```

Ставим `lsync` на автозагрузку:

```bash
chkconfig lsyncd on
```

Логи синхронизации буду расти не по дням а по часам, поэтому нужно их периодически архивировать. Для этого cоздадим файл `/etc/logrotate.d/lsyncd` со следующим содержанием:

```bash
/var/log/lsyncd/*log {
  rotate daily
  missingok
  notifempty
  compress
  sharedscripts
  postrotate
  if [ -f /var/lock/lsyncd ]; then
    /sbin/service lsyncd restart > /dev/null 2>/dev/null || true
  fi
  endscript
}
```


<center>
  <div id="gads">
  </div>
</center>

Теперь редактируем файл конфигурации и настраиваем синхронизацию:

```bash
sync {
  default.rsyncssh,
  host="ip_второго_сервера",
  source="/var/named/",
  targetdir="/var/named/",
  rsync = {
  compress = true,
    group = true,
    owner = true,
    rsh = "/usr/bin/ssh -p 22 -o StrictHostKeyChecking=no"
  }
}
```

Если у Вас каталог обновляется динамично, тогда есть смысл синхронизироваться с определенной задержкой, что бы каждую секунду не дергать синхронизацию.

Для этого добавьте следующую строку в секцию sync:

```bash
statusInterval = 20
```

Так же можно включить дополнительные опции rsync.

После перезапуска демона `lsyncd` проверьте содержимое каталога `/var/named/` на втором сервере.
