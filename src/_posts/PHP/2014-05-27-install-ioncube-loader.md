---
id: 964
title: Устанавливаем ionCube Loader для PHP
date: 2014-05-27T14:46:13+00:00
author: admin

guid: http://www.tech-notes.net/?p=964
permalink: /install-ioncube-loader/
image: /wp-content/uploads/2014/05/ioncube-250x150.jpg
categories:
  - PHP
tags:
  - ionCube Loader
  - установка ionCube Loader
---
`ionCube` Loader нужен для запуска на Вашем сервере платных компонентов, которые используются в работе сайта. Как правило эти компоненты имеют обфусцированный код, что делает их недоступными для `php`. Если Вы откроете такой файл - увидите набор крякозябликов, соответственно браузер будет выдавать сообщение об ошибке, а функционал `CMS` системы будет неполным.

Страница с доступными с доступными загрузчиками: [http://www.ioncube.com/loaders.php](http://www.ioncube.com/loaders.php)

В зависимости от версии `php`, ОС Вашего сервера, а также ее архитектуры, можно выбрать нужный файл для загрузки.

Я рассмотрю установку ionCube Loader на CentOS linux x64.

Узнать версию linux можно выполнив вот такую команду:

```bash
cat /etc/issue
```

Версия php будет отображена после выполнения вот такой команды:

```bash
php -v
```

Архитектура ОС:

```bash
uname -i
```

В моем случае:
  * php 5.4.6
  * CentOS 5
  * x86_64

Я буду скачивать tar архив для Linux (64 bits) версия `4.6.1`:

```bash
wget http://downloads3.ioncube.com/loader_downloads/ioncube_loaders_lin_x86-64.tar.gz  
tar xf ioncube_loaders_lin_x86-64.tar.gz  
cd ioncube
```

В папке iocube будет список файлов - расширения для разных версий `php`. Для версии `5.4.6` нужен `ioncube_loader_lin_5.4.so`

Узнаем папку, где хранятся расширения php:

```bash
php -i |grep extension_dir
```

В моем случае это `/usr/lib/php5/20100525`

Копируем нужный файл в нее:

```bash
cp ioncube_loader_lin_5.4.so /usr/lib/php5/20100525/
```

Вносим изменения в php.ini.

```bash
echo `zend_extension = /usr/lib/php5/20100525/ioncube_loader_lin_5.4.so` >> /etc/php.ini
```

Перезапускаем apache.
