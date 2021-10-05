---
id: 1934
title: Что такое LVM и с чем его едят
date: 2014-10-17T18:46:15+00:00
author: admin

guid: http://www.tech-notes.net/?p=1934
permalink: /lvm-configuration-ad-volumes-management/
image: /wp-content/uploads/2014/10/lvm_logo_small.jpg
categories:
  - Linux server
tags:
  - logical volume manager
  - logical volume создать
  - lvm создать
  - volume group добавить диск
  - volume group создать
---
LVM - logical volume manager или мэнэджер логических дисков. С его помощью можно объединить несколько физических дисков в один логический и оперировать новым девайсом как единым диском.  

Примерно выглядит вот так:  
[<img src="/wp-content/uploads/2014/10/lvm-300x165.jpg" alt="lvm" width="300" height="165" class="aligncenter size-medium wp-image-1936" srcset="/wp-content/uploads/2014/10/lvm-300x165.jpg 300w, /wp-content/uploads/2014/10/lvm-170x93.jpg 170w, /wp-content/uploads/2014/10/lvm.jpg 303w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/10/lvm.jpg)

Для того что бы создать volume groupe на существующих дисках незамонтированных в корень файловой системы нужно из сначала обнулить:

```bash
dd if=/dev/zero of=/dev/sdd bs=512 count=1  
dd if=/dev/zero of=/dev/sde bs=512 count=1
```

Потом создаем физические разделы:

```bash
pvcreate /dev/sdd  
pvcreate /dev/sde
```

Создаем групу разделов (volume group):

```bash
vgcreate vg_storage /dev/sdd
```

Добавляем в нее еще один диск (по факту - расширяем volume group):

```bash
vgextend vg_storage /dev/sde
```

Создаем логический раздел (logical volume):

```bash
lvcreate -L 1G -n lv_var_www_html vg_storage
```

Если промахнулись с местом - добавьте еще:

```bash
lvextend -L +19.99G /dev/mapper/vg_storage-lv_var_www_html  
resize2fs /dev/mapper/vg_storage-lv_var_www_html
```

Удостоверимся что новый раздел был создан:

```bash
ls -la /dev/mapper/
```

или

```bash
lvdisplay
```

Создаем на нем файловую систему:

```bash
mkfs -t ext4 /dev/mapper/vg_storage-lv_var_www_html
```

Редактируем `/etc/fstab`:

```bash
/dev/mapper/vg_storage-lv_var_www_html /var/www/html ext4 defaults 0 0
```

Перед тем как монтировать нужно создать точку монтирования:

```bash
mkdir -p /var/www/html
```

Монтируем

```bash
mount -a
```

Увеличить размер logical voluma можно `на лету` (on-fly):

```bash
lvextend -L +19.99G /dev/mapper/vg_storage-lv_var_www_html  
resize2fs /dev/mapper/vg_storage-lv_var_www_html
```

Естественно рекомендуется перед этим отмонтировать раздел, но у меня всегда и так работало.

На всякий случай:

```bash
umount /dev/mapper/vg_storage-lv_var_www_html
```

### Подведем итоги:
Функционал LVM позволяет обединить физические диски (pv - physical volume) в единое `облако` или `дисковое пространство` (vg - volume group) которое можно раздить на разделы (lv - logical volume).

[<img src="/wp-content/uploads/2014/10/lvm_logo.jpg" alt="lvm_logo" width="232" height="217" class="aligncenter size-medium wp-image-1938" srcset="/wp-content/uploads/2014/10/lvm_logo.jpg 232w, /wp-content/uploads/2014/10/lvm_logo-170x159.jpg 170w" sizes="(max-width: 232px) 100vw, 232px" />](/wp-content/uploads/2014/10/lvm_logo.jpg)

Черпал вдохновление со следующих сайтов:  
* <a href="http://swaeku.github.io/blog/2013/09/03/create-lvm-partitions-on-a-used-disk/" target="_blank">swaeku.github.io</a>  
* <a href="http://ampedup.wordpress.com/2013/06/10/pvcreate-not-detecting-harddrives-device-devabc-not-found-or-ignored-by-filtering/"  target="_blank">ampedup.wordpress.com</a>  
* <a href="http://linuxconfig.org/linux-lvm-logical-volume-manager#h7-edit-etc-fstab" target="_blank">linuxconfig.org</a>  
* <a href="http://www.howtogeek.com/howto/40702/how-to-manage-and-use-lvm-logical-volume-management-in-ubuntu/" target="_blank">howtogeek.com</a>
