---
id: 1673
title: 'cPanel (WHM): Установка на чистый сервер'
date: 2014-09-11T16:51:57+00:00
author: admin

guid: http://www.tech-notes.net/?p=1673
permalink: /install-whm-cpanel/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM/cPanel
tags:
  - установка cpanel
  - установка whm
---
Для начала хочу оговориться, что для установки любой панели управления рекомендуется использовать чистый сервер. В противном случае сервер может слететь после установки панели.

Если у Вас имеется в наличии чистый сервер, тогда можете читать дальше. Если нет - найдите чистый сервер.  

С недавнего времмени лицензии WHM начали привязывать к ip адресам серверов. Перед началом установки нужно удостовериться, что необходимая лицензия существует. Для этого можно воспользоваться страницей:  
<a href="http://verify.cpanel.net/index.cgi" target="_blank">http://verify.cpanel.net/index.cgi</a>

В результате должны получить вот такую картинку:  
[<img src="/wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241.png" alt="Screenshot from 2014-09-11 12:42:41" width="1008" height="293" class="aligncenter size-full wp-image-1674" srcset="/wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241.png 1008w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241-170x49.png 170w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241-300x87.png 300w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241-660x191.png 660w" sizes="(max-width: 1008px) 100vw, 1008px" />](/wp-content/uploads/2014/09/Screenshot-from-2014-09-11-124241.png)

Теперь подключаемся к серверу по ssh. У Вас должны быть права суперпользователя (root) для того что бы установить WHM.

На сервере переходим в папку /home:

```bash
cd /home
```

Скачиваем установщик:

```bash
wget -N http://httpupdate.cpanel.net/latest
```

Запускаем:

```bash
sh latest
```

Следуем инструкциям.

ПО окончанию установки в браузере открываем страницу с ip адресом вашего сервера:  
`https://ip_вашего_сервера:2087`

Для входа используйте имя и пароль пользователя root.
