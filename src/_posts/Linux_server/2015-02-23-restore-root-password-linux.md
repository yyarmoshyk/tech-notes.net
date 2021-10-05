---
id: 2402
title: Восстановление пароля пользователя root в linux
date: 2015-02-23T14:13:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=2402
permalink: /restore-root-password-linux/
image: /wp-content/uploads/2014/02/mod_security_logo.jpg
categories:
  - Linux server
tags:
  - root
---
Всякое в жизни случается, и пароли rootа теряются. Что же делать, если нужно попасть в систему, а пароль пользователя утерян?
Собственно вопрос: как восстановить пароль `root` в linux?

В первую очередь не паниковать, а искать `LiveCD` установленной системы. В случае с сервером на хостинге, нужно в панели администрирования искать пункт `rescue boot` или `network boot` или еще что-нибудь, что выглядит, как загрузка вспомогательного ядра.

После того как Вы запустили систему в нужно режиме восстановления, нужно подмонтировать диск с файлами и данными.

1. Смотрим список дисков с помощью `fdisk`
```bash
fdisk -l
```
При выполнении команды можно получить следующую ошибку:
```
WARNING: GPT (GUID Partition Table) detected on '/dev/sda'! The util fdisk doesn't support GPT. Use GNU Parted.
```
В таком случае воспользуйтесь `gdisk`:
```bash
gdisk -l /dev/sda
```
1. Монтируем раздел в папку `/mnt` (в моем случае - `/dev/sda1`. Вы отталкивайтесь от того, что Вам выдал `gdisk` или `fdisk`)
```bash
mount /dev/sda1 /mnt
```
1. Переключаем систему на работу с замонтированым диском:
```bash
chroot /mnt
```
1. Сбрасываем пароль:
```bash
passwd
```
