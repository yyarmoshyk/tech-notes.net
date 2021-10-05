---
id: 3575
title: Проблемы с ttf-mscorefonts-installer на Ubuntu 16.04
date: 2017-01-13T00:58:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=3575
permalink: /ttf-mscorefonts-installer-ubuntu-16-04/
image: /wp-content/uploads/2014/07/ubuntu_circle.png
categories:
  - Ubuntu Linux
tags:
  - ttf-mscorefonts-installer
---
Сегодня меня в конец достало назойливое уведомление о том, что `ttf-mscorefonts-installer` не смог установить все, что ему нужно.

Это окошко появлялось несколько раз за день  
<img src="/wp-content/uploads/2016/12/Screenshot-from-2016-12-12-00-46-18.png" alt="screenshot-from-2016-12-12-00-46-18" width="549" height="439" class="aligncenter size-full wp-image-3577" />

Каждый раз, когда я кликал кнопку `Run this action now` ничего хорошего не происходило. Утилита пыталась скачать установщики шрифтов с `downloads.sourceforge.net` и каждый раз терпела неудачу.

Попытки переутановить `ttf-mscorefonts-installer` разбивались о все те же скалы:

```bash
sudo apt-get install --reinstall ttf-mscorefonts-installer
```
В консольном выводе я получал вот такую ошибку:

```bash
Err:1 http://downloads.sourceforge.net/corefonts/andale32.exe
  404  Not Found
```


Или вот такую:

```bash
Protocol "http" not supported or disabled in libcurl
```


Все ссылки, на скачиваеи файлов установки шрифтов, хранятся в следующем файле:

  * `/usr/share/package-data-downloads/ttf-mscorefonts-installer`

Оказывается `curl` умирает по таймауту, пока [sourceforge.net](http://sourceforge.net) ищет живое зеркало с которого можно было бы скачать файл. Если поменять http на https и прописать живое зеркало в файл-список, то установка срабатывает на ура:

```bash
src=`http://downloads.sourceforge.net/corefonts/`  
rep=`https://netcologne.dl.sourceforge.net/project/corefonts/the%20fonts/final/`  
sudo sed -i -e `s#$src#$rep#g` /usr/share/package-data-downloads/ttf-mscorefonts-installer
```

Как определить рабочее зеркало? — В консоли выполняем:
```bash
wget http://downloads.sourceforge.net/project/corefonts/the%20fonts/final/andale32.exe?r=\&ts=1483087183\&use_mirror=netcologne
```


В результате получаем следующий вывод (подсвечено рабочее зеркало):  
<img src="/wp-content/uploads/2016/12/Screenshot-from-2016-12-30-00-42-50.png" alt="screenshot-from-2016-12-30-00-42-50" width="956" height="189" class="aligncenter size-full wp-image-3614" />

После этого выполняем одну из следующих команд:

```bash
sudo /usr/lib/update-notifier/package-data-downloader
```

или

```bash
sudo apt-get install -reinstall ttf-mscorefonts-installer
```

В случае успешного выполнения вы получите следующий вывод по каждому из шрифтов:  
<img src="/wp-content/uploads/2016/12/Screenshot-from-2016-12-12-00-48-00.png" alt="screenshot-from-2016-12-12-00-48-00" width="318" height="122" class="aligncenter size-full wp-image-3576" />
