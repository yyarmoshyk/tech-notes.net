---
id: 2956
title: Иcпользование циклов в командной строке Windows
date: 2015-11-10T16:16:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=2956
permalink: /loops-in-windows-cmd/
image: /wp-content/uploads/2015/11/Windows-Command-icon.png
categories:
  - Windows
tags:
  - findstr
  - for
  - windows cmd
---
После годов работы в консоли linux очень тяжело выполнять задачи на windows серверах.

Иногда бывает нужно обработать список файлов (открыть, удалить, переименовать, и т.д.), но руками это делать очень трудозатратно.

Следующий цыкл читает текстовый файл и позволяет что-то сделать с результатами:

```cmd
for %A in (myfile.txt) do [действие] %A
```

С помозью следующей конструкции можно найти текст во всех файлав в текущем каталоге (рекурсивно) и открыть найденные файлы в Notepad++:

```cmd
set _find_cmd=findstr /M /P /S /R /I 10.10.10.10 *  
for /f `tokens=1` %f IN ('%_find_cmd%') DO 'C:\Program Files (x86)\Notepad++\notepad++.exe' %f
```

`findstr` - аналог linuxового grep'а в Windows.

Надеюсь, что буду дописывать эту заметку по мере появления новых примеров.
