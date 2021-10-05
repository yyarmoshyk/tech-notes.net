---
id: 1347
title: Копируем контейнер Parallels Virtuozzo на новый гипервизор
date: 2014-08-22T20:41:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=1347
permalink: /move-parallels-virtuozzo-container/
image: /wp-content/uploads/2014/08/virtuozzo_logo.png
categories:
  - Linux server
tags:
  - Parallels Virtuozzo
---
В этой заметке хочу поведать о том, каким образом можно скопировать/мигрировать контейнер `Parallels Virtuozzo`, с в `KVM/VMware ESX/VirtualBox`.  

Основной проблемой подобных действий является то, что понятия полноценной операционной системы отсутствует в рамках контенера `Virtuozzo`. Как правило контейнер - это некий chroot, который доступен в виде папки на диске. Я буду рассматривать перенос контейнера Linux.

Есть два подхода:  
1. Тупо скопировать все файлы с контенера в готовую виртуальную машину.  
2. [Создать образ используя промежуточное звено в виде продукта Parallels Bare Metal Server (PBMS)](/convert-parallels-virtuozzo-container-to-pbsm/)

У каждого способа есть свои преимущества и недостатки. Так в случай с первым методом нужно что бы версии операционных систем совпадали на 100%. Есть риск возникновения проблем в работе новой виртуальной машины.

Для того что бы скопировать виртуалку на прямую нужно:  
1. Подключиться к серверу Virtuozzo и посмотреть или запущена машина:

```bash
vzlist -a
```

В ответ получаем список контейнером и их статусы:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-11-085831.png" alt="Screenshot from 2014-08-11 08:58:31" width="625" height="58" class="aligncenter size-full wp-image-1352" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-11-085831.png 625w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-11-085831-170x15.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-11-085831-300x27.png 300w" sizes="(max-width: 625px) 100vw, 625px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-11-085831.png)

Если нужный Вам контейнер остановлен, нужно его замонтировать (запускать не обязательно):

```bash
vzctl mount 69540
```

Дальше подключаемся к новому виртуальному серверу и копируем в него всю информацию из контейнера:

```bash
rsync -arzv root@**%Parallels_Server_IP%**%:/vz/root/69540/ -exclude /boot -exclude /proc -exclude /sys -exclude /dev/pts -exclude /dev/shm -exclude /dev -exclude /lib/firmware -exclude /lib/modules -exclude /lib/udev -exclude /lib/udev/rules.d /mnt
```

Удаляем пару файлов и перезапускаем виртуальную машину:

```bash
rm -rf /mnt/etc/sysconfig/network-scripts/* && rm -rf /mnt/var/cache/yum/*
```

Этот туториал относится к разряду `Как делать не нужно`. Мне он не нравится, потому что работает 50х50. `Parallels Virtuozzo` - коммерческий продукт и использовать подход юного натуралиста не рекомендуется.

Для грамотной конвертации, все же лучше получить временную лицензию на BareMetal, которая дается на 30 дней и воспользоваться [статьей о конвертации контейнера](/convert-parallels-virtuozzo-container-to-pbsm/)
