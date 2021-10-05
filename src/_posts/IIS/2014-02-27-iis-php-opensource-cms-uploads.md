---
id: 615
title: IIS, PHP, OpenSource CMS и зайцы
date: 2014-02-27T21:36:05+00:00
author: admin

guid: http://www.tech-notes.net/?p=615
permalink: /iis-php-opensource-cms-uploads/
image: /wp-content/uploads/2014/02/wp+iis.png
categories:
  - IIS
  - Windows Server
  - WordPress
tags:
  - ApplicationPoolIdentity
  - iis
  - NetworkService
  - php
  - upload_tmp_dir
  - wordpress
  - загрузка файлов
---
Лично я считаю хостинг open-source проектов на Windows Server кощунством, глупостью и моральной неполноценностью. Но случается проект, в котором у клиента основной сайт написан на .NET а параллельно с ним лежит небольшой блог на WordPress или другой CMS.

Соответственно все это обслуживает набор Win2008+PHP+ASP.NET+MSSQL+MySql+IIS7.

Сегодня столкнулся вот такой проблемой:  
Иду в админку WordPress, создаю новую запись, добавляю в нее медиа файл, выбираю размер изображения `Полный` и.. Изображение не отображается. Уменьшенные изображения работают, а вот полное - нет. При переходе по прямой ссылке на изображение - 500-я ошибка.

[<img src="/wp-content/uploads/2014/02/500_error_iis.png" alt="500_error_iis" width="519" height="169" class="aligncenter size-full wp-image-618" srcset="/wp-content/uploads/2014/02/500_error_iis.png 519w, /wp-content/uploads/2014/02/500_error_iis-300x97.png 300w" sizes="(max-width: 519px) 100vw, 519px" />](/wp-content/uploads/2014/02/500_error_iis.png)

Оказывается, когда мы загружаем файл через php форму, то сначала он (файл) отправляется в папку C:\Windows\Temp (таким по умолчания установлено значение php.upload_tmp_dir). Потом из этого каталога загруженный файл отправляется в нужное место (типа /wp-content/uploads/2014/2). При этом файл унаследует права папки C:\Windows\Temp. Уменьшенные варианты изображения создаются уже в конечной папке, они отображаются без ошибок потому что пользователь IIS (AppPool user) имеет все права на них.

Для того, что бы исправить это недоразумение, нужно дать IIS пользователю право модифицировать (достаточно даже чтения) на папку C:\Windows\Temp.

Нужно для начала посмотреть под кем выполняется ApplicationPool сайта:  
Запускаем IIS Manager -> Application Pools. Жмем правой кнопкой на нужном пуле и выбираем `Advanced Settings` из выпавшего меню:

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162326.png" alt="Screenshot from 2014-02-27 16:23:26" width="498" height="361" class="aligncenter size-full wp-image-616" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162326.png 498w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162326-300x217.png 300w" sizes="(max-width: 498px) 100vw, 498px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162326.png)

В разделе `Process Model` смотрим на Identity.

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162505.png" alt="Screenshot from 2014-02-27 16:25:05" width="433" height="54" class="aligncenter size-full wp-image-617" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162505.png 433w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162505-300x37.png 300w" sizes="(max-width: 433px) 100vw, 433px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-162505.png)

Если пул выполняется под ApplicationPoolIdentity - нужно давать права группе IIS_IUSRS или пользователю IIS_IUSR на папку C:\Windows\Temp.

Если у Вас там написано NetworkService - соответственно даем права группе NetworkService.

После таких преобразований все ново-загруженные файлы будут работать корректно.

Для уже загруженных файлов нужно выставить права вручную. Можно просто пере-применить права доступа на родительский каталог. Все подкаталоги и файлы унаследуют права от родителя.

ps: не думал, что у меня появится рубрика IIS 🙁
