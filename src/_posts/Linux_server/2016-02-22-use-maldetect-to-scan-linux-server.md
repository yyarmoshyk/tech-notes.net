---
id: 3199
title: Использование maldetect для сканирования Linux Сервера
date: 2016-02-22T18:35:37+00:00
author: admin

guid: http://www.tech-notes.net/?p=3199
permalink: /use-maldetect-to-scan-linux-server/
image: /wp-content/uploads/2016/02/malware.png
categories:
  - Linux server
  - Безопасность
tags:
  - maldet
  - maldetect
---
Malware Detect (LMD) утилита сканирования Linux систем на наличие вредоносных файлов (malware). Распространяется под лицензией GNU GPLv2.

MalDetect может использовать даные от систем обнаружения атак что бы извлечь вредоносный код (malware). Также может использовать антифирусную базу других сканеров, таких как ClamAV.

MalDetect недоступен в репозитория ПО, так что его нужно скачть и установить руками:

```bash
cd /usr/local/src; wget http://www.rfxn.com/downloads/maldetect-current.tar.gz  
tar -xzf maldetect-current.tar.gz; cd maldetect-*  
sh ./install.sh; cd ../  
rm -rf maldetect-*
```

После установки обновляем:

```bash
maldet -update-ver  
maldet -update
```

Сканирование выполняется следующим образом:

```bash
maldet -a /home?/?/public_html
```

или так:

```bash
maldet -a /var/www/
```

Каждому сканированию присвается уникальнй ID.

`MalDetect` не удаляет файлы во время сканирования. По окончанию каждого сканирования вы будете полчать команду с помощью которой можно просмотреть лог сканирования.

Что-то в стиле:

```bash
maldet -report %report.ID%
```

Для того что бы удалить обнаруженные файлы, нужно выполнить следующую команду:

```bash
maldet -q %report.ID%
```
