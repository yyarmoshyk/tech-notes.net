---
id: 3137
title: Добавление сайтов в IIS7 из командной строки
date: 2016-02-01T15:33:32+00:00
author: admin

guid: http://www.tech-notes.net/?p=3137
permalink: /add-website-iis7-from-cmd/
image: /wp-content/uploads/2014/12/iis7-logo.jpg
categories:
  - IIS
tags:
  - appcmd.exe
  - cmd.exe
  - iis7
---
Быстрая заметка о том, как создать сайт в IIS7 из командной строки (cmd.exe). Это очень удобно, если Вам нужно создать 100+ сайтов.

Запускаем cmd.exe от имени администратора и переходим следующий каталог:

```bash
cd %windir%\system32\inetsrv
```

Без этого система не увидит appcmd и Вы получите следующую ошибку:

```bash
'appcmd.exe' is not recognized as an internal or external command
operable program or batch file.
```

Синтаксис создания сайта следующий:

```bash
appcmd add site /name:www.имя_сайта /bindings:http://www.имя_сайта:80,http://имя_сайта:80 /physicalPath:C:\inetpub\wwwroot\www.имя_сайта
```

С помощью следующей команды можно сменить домашний каталог сайта. Для меня остается загадкой почему нужно использовать '`vdir`' а не '`site`':

```bash
appcmd.exe set vdir "имя_сайта/" -physicalPath:"C:\inetpub\wwwroot\имя_папки"
```

Полезные статьи по теме:
  1. <a href="http://www.tech-notes.net/list-iis6-sites/" target="_blank">Список сайтов в IIS6</a>
