---
id: 1354
title: Конвертируем контейнер Parallels Virtuozzo в виртуалку Parallels Bare Metal Server
date: 2014-08-11T13:29:59+00:00
author: admin

guid: http://www.tech-notes.net/?p=1354
permalink: /convert-parallels-virtuozzo-container-to-pbsm/
image: /wp-content/uploads/2014/08/logo_para.jpg
categories:
  - Linux server
tags:
  - Parallels Virtuozzo
---
`Virtuozzo` и `Bare Metal Server` - два коммерческих продукта для виртуализации от компании `Parallels`. Они используют разные подходы к хранению данных виртуальных машин.

В рамках `Parallels Virtuozzo` не существует понятия полноценной операционной системы для контенера. Как правило контейнер - это некий `chroot`, который доступен в виде папки на диске, а операционной системой является ОС гипервизора. Правда каждый контейнер может иметь свой набор установленных программ. Я буду рассматривать перенос `Virtuozzo` контейнера Linux.

К нашей радости команда `Parallels` придумала утилиты, которые позволяют импортировать контейнеры в другие продукты.

Итак, для начала нужно установить `Parallels Transporter For Containers` на сервер `Virtuozzo`:

Скачиваем и распаковываем:

```bash
wget /wp-content/uploads/2014/08/parallels-transporter-for-containers-parallels-en_US-13253.694417.run.zip  
unzip parallels-transporter-for-containers-parallels-en_US-13253.694417.run.zip
```

Меняем флаги и запускаем:

```bash
chmod +x parallels-transporter-for-containers-parallels-en_US-13253.694417.run  
./parallels-transporter-for-containers-parallels-en_US-13253.694417.run
```

Получаем список запущенных контейнеров

```bash
vzlist -a
```

В полученном списке находим нужный нам контейнер. Нас интересует его CTID (первая колонка)

Дальше подключаемся к серверу PBMS и импортируем контейнер использую утилиту

```bash
pmigrate c root:%password%@%virtuozzo_IP%/%CTID% v %NEW_VM_NAME%
```

Начался трансфер. По окончанию вывода сообщений, новая виртуальная машина станет доступyа на консоли управления BareMetal:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803.png" alt="Screenshot from 2014-08-05 14:48:03" width="807" height="209" class="aligncenter size-full wp-image-1356" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803.png 807w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803-170x44.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803-300x77.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803-660x170.png 660w" sizes="(max-width: 807px) 100vw, 807px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-05-144803.png)
