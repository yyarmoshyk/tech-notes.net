---
id: 552
title: Перенос SmarterStats на новый сервер
date: 2014-02-24T18:25:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=552
permalink: /smarterstats-migration/
image: /wp-content/uploads/2014/02/SmarterStats.jpg
categories:
  - Почта
---
SmarterStat переносятся в 5 шагов.

  1. Устанавливаем SmarterStats на новый сервер.
  1. Останавливаем SmarterStats на обоих серверах (что бы убрать read/write блокировку с папок и файлов)
  1. Переносим следующие папки и файлы на новый сервер:
    * C:\Program Files\SmarterTools\SmarterStats\MRS\App_Data\Config\*.xml
    * C:\Program Files\SmarterTools\SmarterStats\MRS\App_Data\Config\Sites\*.xml
    * C:\Program Files\SmarterTools\SmarterStats\Service\Sitelist.dat
    * C:\SmarterLogs
  *Расположение SmarterLog. Может отличаться в зависимости от конфигурации конкретного сервера
  *Если у Вас система с архитектурой x64, тогда папку SmarterTools нужно искать в `C:\Program Files (x86)`
  1. Запускаем SmarterStats на новом сервере.  
