---
id: 1886
title: Mcrypt на WHM/cPanel
date: 2014-10-08T20:22:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=1886
permalink: /mcrypt-on-whm-cpanel/
image: /wp-content/uploads/2014/10/mcrypt-logo.jpg
categories:
  - WHM/cPanel
tags:
  - EasyApache
  - mcrypt cpanel
  - Mcrypt whm
---
Для того чтобы включить поддержку `mcrypt` в WHM нужно воспользоваться модулем EasyApache.  

Он доступен в разделе Software:  
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161032.png" alt="Screenshot from 2014-10-08 16:10:32" width="227" height="292" class="aligncenter size-full wp-image-1887" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161032.png 227w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161032-132x170.png 132w" sizes="(max-width: 227px) 100vw, 227px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161032.png)

Жмем шестеренку в колонке `Actions` и настраиваем профиль, который использовался для последнего билда:  
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306-1024x145.png" alt="Screenshot from 2014-10-08 16:13:06" width="665" height="94" class="aligncenter size-large wp-image-1889" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306-1024x145.png 1024w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306-170x24.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306-300x42.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306-660x93.png 660w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306.png 1241w" sizes="(max-width: 665px) 100vw, 665px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161306.png)

В принципе на всех экранах можно жать кнопку `Next Step`, если кроме mcrypt никаких изменений не нужно.

На странице `Short Options List` (которая относится к php) нужно выбрать `Exhaustive Options List`.

С помощью сочетания клавиш Ctrl+F находим mcrypt и ставим на против него галочку.  
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161643.png" alt="Screenshot from 2014-10-08 16:16:43" width="248" height="145" class="aligncenter size-full wp-image-1890" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161643.png 248w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161643-170x99.png 170w" sizes="(max-width: 248px) 100vw, 248px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-161643.png)

Кнопка `Save and Build` находится внизу страницы.

Подобным образом добавляются другие модули. Учтите, что apache будет при этом перекомпилирован, что может сказаться на доступности сайтов.
