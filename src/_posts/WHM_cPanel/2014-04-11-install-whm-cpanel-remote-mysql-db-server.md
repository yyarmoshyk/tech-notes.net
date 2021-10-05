---
id: 803
title: Установка whm/cpanel и использование удаленного MySQL сервера
date: 2014-04-11T19:47:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=803
permalink: /install-whm-cpanel-remote-mysql-db-server/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM/cPanel
tags:
  - whm/cpanel
  - удаленный MySQL сервера
---
Появилась задачка: установить WHM/cPanel на сервер. Вроде ничего сложного, да вот все дело в том, что имеется два сервера:  
1 - web сервер.  
2 - сервер баз данных MySQL.

Итак приступим. Для начала скачиваем установщик WHM и запускаем его:  
```bash
wget -N http://httpupdate.cpanel.net/latest
sh latest
```

По экрану побежали цифры и буквы. Установщик затянет, установит и настроит все нужные пакеты. По умолчанию будет установлен Apache 2.2 и PHP 5.4. После установки это можно будет изменить в самой панели (раздел EasyApache).

При установке будет ругаться на предустановленый Mysql сервер, но вот если на Вашем сервере был установлен апач - его установщик легко снесет.

По окончанию установки скрипт выдаст информацию о том, как можно залогиниться в панель. По умолчанию она доступна по HTTPS на 2087 порту. То есть:  
`https://<your_ip_address>:2087`

Для логина используем имя root и пароль.

Дальше переходим в раздел ``SQL Services`` и выбираем ``Setup Remote MySQL Server``

В поле `Remote server address (IP address or FQDN):` вписываем ip адрес удаленного mysql сервера.

Выбираем тип авторизации. Дальше генерируем ключ или вводим пароль root пользователя к серверу баз данных. Жмем `Save`. Все.

[<img src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058-1024x128.png" alt="Screenshot from 2014-04-11 15:30:58" width="665" height="83" class="aligncenter size-large wp-image-815" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058-1024x128.png 1024w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058-300x37.png 300w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058-660x83.png 660w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058.png 1175w" sizes="(max-width: 665px) 100vw, 665px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-11-153058.png)

В ходе выполнения мне выдало вот такое сообщение:

```bash
The eximstats transfer cannot continue. The transfer will have to be done manualy.
```

Я его успешно проигнорировал, поскольку нечего было переносить - чистый сервер.
