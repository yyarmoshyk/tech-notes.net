---
id: 1313
title: Проблема установки програм в Ubuntu 12.04
date: 2014-07-24T13:00:13+00:00
author: admin

guid: http://www.tech-notes.net/?p=1313
permalink: /issues-wit-apt-ubuntu-12-04/
image: /wp-content/uploads/2014/07/ubuntu_circle.png
categories:
  - Ubuntu Linux
tags:
  - apt
  -
---
Хоть Ubuntu 12.04 и выпускалась с лэйбой LTS (long term support), да видно этот long term закончился. Многие уже столкнулись с проблемами при установке пакетов. У меня выпадало вот такое сообщение:

```bash
Err http://us.archive.ubuntu.com/ubuntu/ quantal-updates/main  
404 Not Found [IP: 91.189.91.13 80]  
Failed to fetch http://us.archive.ubuntu.com/ubuntu/pool/main/  
404 Not Found [IP: 91.189.91.13 80]  
E: Unable to fetch some archives, maybe run apt-get update or try with -fix-missing?
```

Оказывается многие репозитории были отключены в пользу 14-й версии ОС. Если Вам, как мне, некогда проводить обновление до 14-й версии, предлагаю быстрый солюшн:

Переходим в папку apt:

```bash
cd /etc/apt
```

Переименовуем файл со списком репозиториев:

```bash
sudo mv sources.list sources.list.old
```

Получаем список активных в данный момент источников ПО и создаем на его основе новый sources.list:

```bash
sudo cat sources.list.old |grep quantal |grep -v `#` |sed 's|**us.archive**.|**old-releases**.|g' >> sources.list
```

В нашем случае меняем `us.archive` на `old-releases` в адресах активных репозиториев.

В принципе на этом этапе уже можно выполнить:

```bash
sudo apt-get update
```

И попробовать установить нужный пакет. Если же Ваша система откажется делать то, что Вам нужно, выполните следующую последовательность команд:

```bash
cd /var/lib/apt  
sudo mv lists lists.old  
sudo mkdir -p lists/partial  
sudo apt-get clean  
sudo apt-get update
```
