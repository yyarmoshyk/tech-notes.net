---
id: 1378
title: Magento залипла на реиндескации данных
date: 2014-08-13T19:21:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=1378
permalink: /magento-stuck-at-data-reindex/
image: /wp-content/uploads/2014/02/magento_logo_3533.gif
categories:
  - Other CMS
tags:
  - Magento
---
Обратился ко мне человек с просьбой посмотреть что не так с сайтом. Говорит, что не работает.

Зашел в хостинг панель, вижу что сервер включен. Посмотрел доступные порты с помощью nmap - все нужные порты доступны. Главная страница сайта не открывается. Вернее открывается очень долго и безрезультатно, не выдавая никаких сообщений. При этом доступна админ панель magento.

Захожу и вижу такую картину:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324.png" alt="Screenshot from 2014-08-13 14:43:24" width="1862" height="338" class="aligncenter size-full wp-image-1380" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324.png 1862w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324-170x30.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324-300x54.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324-1024x185.png 1024w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324-660x119.png 660w" sizes="(max-width: 1862px) 100vw, 1862px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-144324.png)

Понимаю, что ре-индексация `Category Products` залочила базу.

С помощью stackoverflow.com и какой-то матери удалось вернуть сайт в наш мир.

Для начала останавливаю nginx и php-fpm.

Дальше подключаюсь к базе, которая вертится на амазоновском инстансе, к которому доступа нету, кроме как через mysql клиент. Ввожу:

```bash
SHOW ENGINE INNODB STATUS \G;
```

И вижу кучу, вернее бесконечную череду сообщений о всяких там процессах, которые выполняются или ждут выполнения. Нахожу сектор, похожий на :

> -TRANSACTION 11357017, ACTIVE 6768 sec  
> MySQL thread id **5201363**, OS thread handle 0x7f2982e91700, query id 882213399 xxxIPxxx xx.xx.xxx.x user cleaning up


И начинаю гасить все процессы, которые попались под руку командой KILL:

```bash
KILL **5201363**;
```

После каждого KILL смотрю не изменилась ли картина с помощью:

```bash
SHOW ENGINE INNODB STATUS \G;
```

В какой-то момент она изменилась все-таки. Я вздохнул с облегчением и вернулся на сервер, где в свою очередь перешел в папку `/var/www/magento_home/shell` (у Вас она может отличаться) и запустил ре-индексацию всего с помощью следующей команды:

```bash
php indexer.php reindexall
```

В этом случае скрипт выполняется с помощью `cli` версии `php` и его можно обломать в любой момент.

К моему счастью все закончилось успешно и запустив nginx и php-fpm я увидел следующую картину в админке (Index management):  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739.png" alt="Screenshot from 2014-08-13 15:17:39" width="1403" height="342" class="aligncenter size-full wp-image-1381" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739.png 1403w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739-170x41.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739-300x73.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739-1024x249.png 1024w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739-660x160.png 660w" sizes="(max-width: 1403px) 100vw, 1403px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-13-151739.png)

Сайт при этом стал доступен.
