---
id: 2940
title: Использование WebDeploy для переноса сайтов IIS между серверами
date: 2015-10-22T19:34:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=2940
permalink: /use-webdeploy-to-move-configs-iis/
image: /wp-content/uploads/2015/10/webdeploy-logo.png
categories:
  - IIS
tags:
  - msdeploy
  - webdeploy
---
Использование `WebDeploy` очень облегчает задаче переноса конфигов и контэтна сайтов между Windows серверами. `WebDeploy` незаменима при работе с большим количеством сайтов (100+).

Она не включена в в пакете IIS и устанавливается отдельно. Самый простой способ - использование <a href="http://www.microsoft.com/web/downloads/platform.aspx" target="_blank">Microsoft Web Platform Installer</a>

Находим и устанавливаем:  
[<img src="/wp-content/uploads/2015/10/Screenshot-from-2015-10-22-151923.png" alt="Screenshot from 2015-10-22 15:19:23" width="908" height="617" class="aligncenter size-full wp-image-2941" srcset="/wp-content/uploads/2015/10/Screenshot-from-2015-10-22-151923.png 908w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-22-151923-170x116.png 170w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-22-151923-300x204.png 300w" sizes="(max-width: 908px) 100vw, 908px" />](/wp-content/uploads/2015/10/Screenshot-from-2015-10-22-151923.png)

WebDeploy должен быть установлен на оба сервера - старый и новый. При подключении к серверу должна использоваться только учетная запись стандартного админа. Другие пользователи с админской групы не работают из-за бага, который никто исправлять не хочет/не собирается/не умеет.

Вот пример команды, которая перенесет все настройки IIS на новый сервер:

```bash
msdeploy.exe -verb:sync -source:webServer, -dest:webServer,computername=**IP_адрес**,userName=**Administrator**,password=**пароль** -enableLink:apppoolextension -disableLink:content
```

Сам exe-шник находится в папке `C:\Program Files\IIS\Microsoft Web Deploy` при чем трех версий

Опция `-disableLink:content` отключает трансфер контента. Ее можно не отключать, но эффективнее и быстрее будет перенести файлы сайтов через ftp протокол с помощью FileZilla в несколько параллельных потоков.

В большинстве случаев после такого трансфера на новом сервере что-то сломается, поэтому нужно быть максимально аккуратным при работе с production серверами.

Вот тут приведена крутая таблица ошибок WebDeploy с описанием (естественно на английском):  
<a href="http://webdeploywiki.com/Common%20Web%20Deploy%20problems%20and%20how%20to%20troubleshoot%20them.ashx" target="_blank">http://webdeploywiki.com/Common%20Web%20Deploy%20problems%20and%20how%20to%20troubleshoot%20them.ashx</a>
