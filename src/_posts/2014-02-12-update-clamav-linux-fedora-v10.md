---
id: 466
title: Обновление clamav на Linux Fedora v.10
date: 2014-02-12T15:16:52+00:00
author: admin

guid: http://www.tech-notes.net/?p=466
permalink: /update-clamav-linux-fedora-v10/
categories:
  - Безопасность
---
При запуске freshclam на Fedora Linux выпало сообщение:

```bash
ERROR: Please edit the example config file /etc/clamav/freshclam.conf  
ERROR: Can't open/parse the config file /etc/clamav.conf
```

Для того что бы обновлялказаработала нужно убрать слово `Example` из файла:  
`/etc/clamav/freshclam.conf`
