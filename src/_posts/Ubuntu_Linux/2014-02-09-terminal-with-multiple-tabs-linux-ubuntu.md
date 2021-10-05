---
id: 377
title: Запуск terminal несколькими вкладками в Linux Ubuntu
date: 2014-02-09T20:02:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=377
permalink: /terminal-with-multiple-tabs-linux-ubuntu/
categories:
  - Ubuntu Linux
tags:
  - tabs
  - terminal
  - ubuntu
  - вкладки
---
Небольшая заметка о том, как запустить terminal с несколькими вкладками в Linux Ubuntu:  

```bash
gnome-terminal --tab -e "cmd1" --tab -e "cmd2"
```

Эта команда запустит в новом окне несколько вкладок terminal и выполнит cmd1 и cmd2 в них. Соответственно cmd1 и cmd2 нужно заменить на команды.

Вкусняшки:  
* *maximize* - развернет окно на весь экран  
* *title* - установить имя/заголовок вкладки.
