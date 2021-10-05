---
id: 3559
title: Как выставить umask для файлов в одной только папке
date: 2016-11-29T05:04:27+00:00
author: admin

guid: http://www.tech-notes.net/?p=3559
permalink: /umask-per-folder-with-acl/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - Linux server
tags:
  - acl
  - umask
---
`Umask` в Linux - это шаблон прав доступа для создаваемых файлов. Как правило указывается глобально в файле `/etc/profile` или для каждого пользователя в файлах `.bashrc` в домашнем каталоге.  

Но что же делать, если umask выставлен 022 (файлы создаются с правами `rw-r-r (0644)`, а папки создаются с `rwx-rx-rx (0755)`), но в одной конкретной папке нужно чтобы файлы были доступны для чтения и записи всем (`rw-rw-rw (666)`)?

В этом случае можно воспользоваться утилитой setfacl. Изменить ACL для существующих файлов можно с помощью следующей команды:

```bash
setfacl -R -m u::rwx -m g::rwx -m o::rwx **имя_папки**
```

После выполнения следующей команды, все файлы в папке созданные в папке, имя которой Вы укажете, будут доступны всем пользователям системы для записи:

```bash
setfacl -m default:u::rwx -m default:g::rw -m default:o::rw **имя_папки**
```
