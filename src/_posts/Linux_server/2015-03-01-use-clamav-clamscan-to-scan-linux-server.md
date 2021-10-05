---
id: 2448
title: Использование ClamAV (clamscan) на Linux сервере
date: 2015-03-01T12:12:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=2448
permalink: /use-clamav-clamscan-to-scan-linux-server/
image: /wp-content/uploads/2015/03/clamav-trademark.png
categories:
  - Linux server
  - Безопасность
---
ClamAV - это антивирус с открытым исходным кодом, который позволяет убнаруживать трояны, руткиты и прочую гадость.  
Clamscan - модуль сканивания.

Устанавливается из репозиториев програмного опебспечения. В случае с RedHat/CentOS нужно [подключить Epel.](epel-remi-atrpms-rhel-centos/)

```bash
yum install clamav clamavclamav-update clamav-scanner
```

История релизов доступна по адресу [http://pkgs.repoforge.org/clamav/](http://pkgs.repoforge.org/clamav/)

После установки нужно его обновить:

```bash
freshclam
```

У модуля сканирования есть куча опций. Проверить их можно с помощью:

```bash
clamscan -help
```

Сканирование выполняется следующей командой:

```bash
clamscan
```

Если Вы хотите просканировать файлы в конкретном каталоге:

```bash
clamscan -r /home/
```

Для того что бы писать лог файл:

```bash
clamscan -r /home/ -log=/var/log/clamscan.log
```

По умолчанию модуль будет выводить информацию о всех файлах, которые он отсканировал. Довольно удобно воспользоваться ключем `-i` и получать информацию только о инфецированых файлах.

Инфицированые файлы можно копировать либо перемещать в указаной место на сервере. На пример:

```bash
clamscan -i -copy=/var/suspicious -r /home/ -log=/var/log/clamscan.log
```

или

```bash
clamscan -i -move=/var/infected -r /home/ -log=/var/log/clamscan.log
```

Папки /var/infected и /var/suspicious должны существовать.

Сlamscan можно использовать для [проверки файлов, загружаемых по ftp.](/pureftpd-check-file-uploads-with-clamav/)
