---
id: 36
title: Перенос MailEnable на новый сервер
date: 2013-10-17T19:00:33+00:00
author: admin

guid: http://wp38.local/?p=36
permalink: /mailenable-migration/
attitude_sidebarlayout:
  - default
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2013/09/image001.gif
categories:
  - Почта
---
[<img class="alignnone size-full wp-image-37 aligncenter" alt="image001" src="/wp-content/uploads/2013/09/image001.gif" width="224" height="278" />](/wp-content/uploads/2013/09/image001.gif)

MailEnable - почтовая система с множеством плюшек. Случается так, что ее нужно перенести на другой сервер по разным причинам. Первое что нужно знать: **Enterprise лицензия выдается/покупается в соответствии с количеством процессорных ядер на сервере**. То есть нужно покупать или расширять лицензию если у нас на исходном и конечном серверах разное количество ядер процессора.

Перед началом миграции нужно установить MailEnable на новый сервер. Убедиться что версии совпадают. <!--more-->

Если с лицензиями разобрались можно приступать к самому процессу. MailEnable хранит свой `мусор` в нескольких местах:

- системный реестр;

- папка программы.

	

Процесс переноса включает копирование всего мусора с одного сервера на другой.

1.  Экспортируем данные из реестра:  
  1. Открываем regedit с правами администратора  
  2.  Для **32-х** битной версии системы идем в HKEY_LOCAL_MACHINE\SOFTWARE\Mail Enable  
  3. Для **64-х** битной системы: HKEY_LOCAL_MACHINE\Software\Wow6432Node\Mail Enable  
  4. С помощью меню `Файл` экспортируем содержимое ветки `Mail Enable` в файл с расширением `reg`.  
  5. То же самое делаем на всякий случай на новом сервере.  
2. На новом сервере останавливаем все службы MailEnable и копируем следующие папки:
  * C:\Program Files\Mail Enable\Dictionaries (Опционально - используется в Professional и Enterprise)  
  * C:\Program Files\Mail Enable\Config (Обязательно - содержит настройки и прочую конфигурационную информацию)  
  * C:\Program Files\Mail Enable\Postoffices (Обязательно - содержит postoffices и сообщения)  
  * C:\Program Files\Mail Enable\Bad Mail (Опционально - содержит почту помеченную как спам)  
  * C:\Program Files\Mail Enable\Logging (Опционально - содержит логи)  
  * C:\Program Files\Mail Enable\Queues (Опционально - содержит очередь доставки)

Если в своей работе MailEnable использует базу данных, тогда ее тоже нужно перенести:

1. Делаем бэкап базы на старом сервере.
2. Переносим и разворачиваем базу на новом сервере.
3. Запускаем migration тулл и настраиваем MailEnable на работу с новой базой.

После того как все файлы успешно перенесены нужно выставить правильные права доступа на них:

```cmd
CACLS "C:\Program Files\Mail Enable\Config" /t /e /g IME_ADMIN:F
CACLS "C:\Program Files\Mail Enable\Queues" /t /e /g IME_ADMIN:F
CACLS "C:\Program Files\Mail Enable\Postoffices" /t /e /g IME_ADMIN:F
CACLS "C:\Program Files\Mail Enable\Queues" /t /e /g IME_SYSTEM:F
CACLS "C:\Program Files\Mail Enable\Logging" /t /e /g IME_SYSTEM:F
CACLS "C:\Program Files\Mail Enable\Bad Mail" /t /e /g IME_SYSTEM:F
CACLS "C:\Program Files\Mail Enable\Backup" /t /e /g IME_SYSTEM:F
CACLS "C:\Program Files\Mail Enable\Bin" /t /e /g IME_SYSTEM:R
CACLS "C:\Program Files\Mail Enable\Config" /t /e /g IME_SYSTEM:F
CACLS "C:\Program Files\Mail Enable\Post Offices" /t /e /g IME_STORE_GROUP:F
```

Дальше запускаем все сервисы MailEnable и идем менять DNS MX записи для нашего домена.

Пока идет распространение изменений можно периодически копировать файлы со старого сервера на новый.

Примерное местоположение `C:\Program Files\Mail Enable\Queues\SMTP\Inbound`
