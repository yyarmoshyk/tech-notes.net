---
id: 883
title: Перенос конфига RADIUS с Windows 2003 IAS на Windows 2008 NPS
date: 2014-04-30T15:34:40+00:00
author: admin

guid: http://www.tech-notes.net/?p=883
permalink: '/%d0%bf%d0%b5%d1%80%d0%b5%d0%bd%d0%be%d1%81-%d0%ba%d0%be%d0%bd%d1%84%d0%b8%d0%b3%d0%b0-radius-%d1%81-windows-2003-ias-%d0%bd%d0%b0-windows-2008-nps/'
image: /wp-content/uploads/2014/04/radiusad01-115x115.jpg
categories:
  - Active Directory
---
<p style="color: #636467;">
  В рамках предыдущей статьи появились заметки о том как перенести настройки RADIUS на новый сервер, включая сертификаты и прочий хлам. Дело в том, что функционал RADIUS на Windows Server 2008 реализован в рамках NPS (Network Policies Server).
</p>

<p style="color: #636467;">
  Для того что бы все завести на более новой версии ОС нужно воспользоваться утилитой<strong> iasmigreader.exe.</strong> Она входит в состав инструментов Windows 2008 R2 и более поздних версий. Это утилита командной строки, которая может вытянуть конфиги IAS с машины под управлением Windows Server 2003 в отдельный файл - <strong>Ias.txt</strong>. Дальше информацию с этого файла можно втянуть (импортировать) в NPS сервер на Windows Server 2008 используя <strong>netsh nps import. </strong>Правда прикольно?
</p>

  1. Для начала нужно найти exe файл. Валяется он где-то в папке `<em>C:\Windows\winsxs\. </em>`Можно воспользоваться поиском файлов в этой папке и найти **iasmigreader.exe**
  2. Дальше копируем его на сервер с Win2003 и запускаем из командной строки. Дожидаемся завершения выполнения.
  3. Как я уже говорил эта утилита экспортирует настройки RAIUS в отдельный текстовый файл `<strong>ias.txt</strong>`. Его можно найти в папке  `C:\Windows\system32\ias`. Если у Вас x64 система, тогда текстовый файл будет лежать в папке `C:\Windows\syswow64\ias`
  4. Скопирует этот файл на новый сервер с Windows 2008 и NPS.
  5. Импортируйте настройки вот такой командой:

<p style="color: #636467;">
  <p style="color: rgb(99, 100, 103); padding-left: 30px;">
    <code>netsh nps import ias.txt</code>
  </p>

  <p style="color: #636467;">
    Вот и все. Теперь можете смело открывать консоль управления NPS и Вы уведите все настройки с исходного сервера.
  </p>
