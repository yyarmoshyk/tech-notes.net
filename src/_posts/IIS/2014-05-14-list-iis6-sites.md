---
id: 954
title: Список сайтов в IIS6
date: 2014-05-14T18:15:37+00:00
author: admin

guid: http://www.tech-notes.net/?p=954
permalink: /list-iis6-sites/
categories:
  - IIS
---
Для того что бы получить список сайтов в IIS6 нужно <!--more-->

в командной строке запустить вот такую команду:

```bash
@FOR /F "delims=[]" %A IN ('@cscript //nologo %SystemDrive%\Inetpub\AdminScripts\adsutil.vbs ENUM /P /w3svc') DO @FOR /F delims^=^"^ tokens^=2 %B IN ('@cscript //nologo %SystemDrive%\Inetpub\AdminScripts\adsutil.vbs GET %A/ServerComment') DO @FOR /F delims^=^"^ tokens^=2 %C IN ('@cscript %SystemDrive%\Inetpub\AdminScripts\adsutil.vbs //nologo GET %A/Root/Path') DO @ECHO %A %B "%C"
```
