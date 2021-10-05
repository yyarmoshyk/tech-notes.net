---
id: 489
title: Как включить спящий режим (hibernate) на Linux Ubuntu
date: 2014-02-14T10:02:54+00:00
author: admin

guid: http://www.tech-notes.net/?p=489
permalink: /enable-hibernate-linux-ubuntu/
image: /wp-content/uploads/2014/02/hibernate.png
categories:
  - Ubuntu Linux
tags:
  - hibernation
  - ubuntu
  - спящий режим
---
На некоторых ноутбуках после установки в Linux Ubuntu (в моем случае 12.04 LTS) отключен спящий режим. Связано это, по видимому, с тем, что такие устройства официально не поддерживаются.

Все таки удобно, когда при закрытии крышки ноутбук уходил в спящий режим, а не выключался.

Вернуть его можно в 3 шага:

1. Проверяем или hibernate работает корректно. Для этого в консоли запускаем:

```bash
sudo pm-hibernate
```

Ждем пока девайс уснет. Потом будим его что бы удостовериться что hibernate работает корректно.

Если все ОК - идем дальше.

2. Создаем файл `/etc/polkit-1/localauthority/50-local.d/com.ubuntu.enable-hibernate.pkla` со следующим содержанием:

```bash
[Re-enable hibernate by default]
Identity=unix-user:*
Action=org.freedesktop.upower.hibernate
ResultActive=yes
```

3. На всякие случай обновляем grub:

```bash
sudo update-grub
```

После перезагрузки hibernate будет доступен. В моем случае она не понадобилась.

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-14-050226-300x81.png" alt="Screenshot from 2014-02-14 05:02:26" width="300" height="81" class="aligncenter size-medium wp-image-491" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-14-050226-300x81.png 300w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-14-050226.png 554w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-14-050226.png)
