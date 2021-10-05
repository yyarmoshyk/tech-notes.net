---
id: 2651
title: Настройка SFTP и Chroot на Ubuntu 14.04
date: 2015-06-02T12:41:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=2651
permalink: /configure-sftp-chroot-on-ubuntu-14-04/
image: /wp-content/uploads/2015/06/sftpnew.png
categories:
  - Linux server
tags:
  - chroot
  - sftp
---
В этой статье рассматривается настройка sftp сервера и изоляция пользователей в их домашних каталогах (chroot) на базе Linux Ubuntu 14.04.  

Sftp - протокол обмена файлами через безопасное сетевое соединение.  
Chroot - изолированая среда.

Для начала создадим группу с пользователями:

```bash
groupadd sftpusers
```

Поскольку sftp - подсистема ssh, то и настройки е находятся в файле sshd_config. Его и нужно подредактировать:

```bash
nano /etc/ssh/sshd_config
```

Находим и коментируем строку:

```bash
#Subsystem sftp /usr/lib/openssh/sftp-server
```

Добавляем прямо под ней строку:

```bash
Subsystem sftp internal-sftp
```

Добавляем следующее в конец документа:

```bash
Match Group sftpusers
        X11Forwarding no
        AllowTcpForwarding no
        ChrootDirectory %h
        ForceCommand internal-sftp
        PasswordAuthentication yes

```


Перезапускаем демон ssh что бы изменения вступили в силу:

```bash
initctl restart ssh
```

Теперь можно и пользователя создать:

```bash
useradd -g sftpusers -d /home/**username** -m -s /bin/false **username**
```

На самом деле оболочка `/bin/false` отсутствует в файле `/etc/shells`, но это не вызывает проблем с логином через sftp. На всякий случай ее лучше добавить:

```bash
echo `/bin/false` >> /etc/shells
```

Важным шагом является изменение собственника папки пользователя. Пользователям нельзя писать в свои домашние каталоги:

```bash
chown root:root /home/**username**
```

Если Вам нужно создать папку с правом на запись:

```bash
mkdir /home/**username**/upload  
chown **username**:sftpusers /home/**username**/upload
```
