---
id: 2438
title: Сканирование сервера с помощью Chkrootkit
date: 2015-02-26T10:52:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=2438
permalink: /scan-linux-server-with-chrootkit/
image: /wp-content/uploads/2015/02/linux_penguin_icon.jpg
categories:
  - Linux server
  - Безопасность
---
Руткит (rootkit) - это скрытый тип программного обеспечения, как правило, который позволяет скрыть существование определенных процессов или программ от обычных методов обнаружения или разрешить удаленный доступ к компьютеру.

[<img src="/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg" alt="chkrootkit_rootkit" width="500" height="323" class="aligncenter size-full wp-image-2439" srcset="/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg 500w, /wp-content/uploads/2015/02/chkrootkit_rootkit-170x110.jpg 170w, /wp-content/uploads/2015/02/chkrootkit_rootkit-300x194.jpg 300w" sizes="(max-width: 500px) 100vw, 500px" />](/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg)

Chkrootkit предоставляет набор утиллит для сканирования и выявления руткитов на сервере.

Устанавливается Chkrootkit из репозиториев програмного опебспечения. В случае с RedHat/CentOS нужно [подключить Epel.](http://www.tech-notes.net/epel-remi-atrpms-rhel-centos/)

История релизов доступна по адресу [http://pkgs.repoforge.org/chkrootkit/](http://pkgs.repoforge.org/chkrootkit/)

Запустить сканирование можно выполнив:

```bash
chkrootkit
```

или

```bash
chkrootkit -r /var/www
```

Рекомендуется запускать сканирование в скрине, для того что бы в случае отключения от сервера не потерять прогрес. Для этого перед запуском выполните:

```bash
screen
```

Для возвращения к активному скрину в случае разрыва связи с сервером выполните:

```bash
screen -list  
screen -r %идентификатор_скрина%
```
