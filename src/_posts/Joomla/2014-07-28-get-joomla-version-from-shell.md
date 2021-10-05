---
id: 1320
title: Как узнать версию Joomla! из командной строки
date: 2014-07-28T12:50:29+00:00
author: admin

guid: http://www.tech-notes.net/?p=1320
permalink: /get-joomla-version-from-shell/
image: /wp-content/uploads/2014/02/joomla-logo-vert-color.png
categories:
  - Joomla
---
Версию CMS Joomla можно узнать из командной строки, если нету доступа в админку. Для этого выполните следующую команду, находясь в папке сайта:

```bash
grep '$RELEASE' libraries/cms/version/version.php
```

В зависимости от версии, может сработать следующая

```bash
grep '$RELEASE' libraries/joomla/version/version.php
```

В результате получите версию:

```bash
public $RELEASE = '2.5';
```
