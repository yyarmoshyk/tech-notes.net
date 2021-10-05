---
id: 3243
title: Как обойтись без sed в командной строке Windows
date: 2016-03-15T14:41:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=3243
permalink: /inline-replace-windows-cmd/
image: /wp-content/uploads/2014/02/powershell_logo.png
categories:
  - Windows Server
---
Сегодня столкнулся с необходимостью поменять текстовку в сотне файлов на сервере вод управлением `Windows`.  
В среде `linux` такие задачи решаются просто с помощью `sed` и ключа '-i', но в среде Windows аналогов sed нету.

Пришлось изощряться. Для начала создал файл `C:\repl.vbs` со следующим содержанием:

```bash
Const ForReading = 1
Const ForWriting = 2

strFileName = Wscript.Arguments(0)
strOldText = Wscript.Arguments(1)
strNewText = Wscript.Arguments(2)

Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objFile = objFSO.OpenTextFile(strFileName, ForReading)

strText = objFile.ReadAll
objFile.Close
strNewText = Replace(strText, strOldText, strNewText)

Set objFile = objFSO.OpenTextFile(strFileName, ForWriting)
objFile.Write strNewText
objFile.Close
```


Пользоваться им нужно в командной строке следующим образом:

```bash
cscript C:\repl.vbs `c:\**имя_файла**.txt` `FOO` `BAR`
```

Даная конструкция меняет FOO на BAR в файле c:\имя_файла.txt

Вооружившись [этой статьей](/loops-in-windows-cmd/) обрабатываем все файлы - ищем `FOO` и меняем на `BAR`:

```bash
set _find_cmd=findstr /M /P /S /R /I `FOO` *  
for /f `tokens=*` %f IN ('%_find_cmd%') DO cscript c:\repl.vbs `%f` `FOO` `BAR`
```
