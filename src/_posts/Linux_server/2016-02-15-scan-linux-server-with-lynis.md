---
id: 3178
title: Сканирование сервера с помощью Lynis
date: 2016-02-15T14:18:30+00:00
author: admin

guid: http://www.tech-notes.net/?p=3178
permalink: /scan-linux-server-with-lynis/
image: /wp-content/uploads/2015/02/1435.png
categories:
  - Linux Server
  - Безопасность
tags:
  - Lynis
  - rkhunter
---
`Lynis` (ранее `RkHunter`) является инструментом аудита безопасности для систем Linux и BSD. Он выполняет подробный аудит многих аспектов безопасности и конфигурации вашей системы. Загрузите последние источники Lynis из [https://cisofy.com/download/lynis/](https://cisofy.com/download/lynis/)

Lynis не требует установки, достаточно его проcто скачать и распаковать:

```bash
cd /tmp  
wget -no-check-certificate https://cisofy.com/files/lynis-2.2.0.tar.gz  
tar xvfz lynis-2.2.0.tar.gz  
mv lynis /usr/local/  
ln -s /usr/local/lynis/lynis /usr/local/bin/lynis
```

Провряем новые версии:

```bash
lynis update info
```

Для запуска аудита системы выполните следующую команду:

```bash
lynis audit system
```

В таком режиме Lynis будет ожидать пока вы ознакомитесь с результатами сканирования для каждого блока и нажмете клавишу `Enter`

Что бы можно было выпить кофе пока Lynis работает, запустите его с ключом `-quick`

```bash
lynis -quick
```

Ну и конечно можно создать `cron` задачу, что бы выполнять сканирование каждый день:

```bash
0 3 \* \* * /usr/local/bin/lynis -quick 2>&1 | mail -s `lynis output of my server` you@yourdomain.com
```
