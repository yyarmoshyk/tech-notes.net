---
id: 1080
title: Передача данных из Windows CMD в Microsoft Jscript
date: 2014-06-27T19:58:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=1080
permalink: /forward-data-from-windows-comandprompt-to-microsoft-jscript-variable/
image: /wp-content/uploads/2014/06/microsoft.jpg
categories:
  - Windows server
tags:
  - Microsoft Jscript
---
Столкнулся с очередной задачкой: Нужно с помощью Microsoft `Jscript` получить набор данных о сервере. Опять спотыкаюсь о косяки `Windows 2008 Server`. Ну очень уж неудобно мне работать с ним.

Документацию на `MSDN` читать - в больничке лечиться. Тупым перебором параметров удалось завести все. Вот оставлю тут небольшую заметку о том, как выполнить что-то в командной строке, а результат выполнения - закинуть в переменную в `Jscript`.

```bash
// Объявим переменную, которая будет содержать команду для cmd.exe
var shellcommand = "dir c:"
// инициализируем shell
var WshShell = WScript.CreateObject("WScript.Shell");
var oExec = WshShell.Exec("%comspec% /c "+shellcommand);
// переменная с результатами
var result = oExec.StdOut.ReadAll();</p>
<p>//Дополнительные плюшки:
//статус выполнения - oExec.Status
WScript.Echo("Status "+oExec.Status);
// если для выполнения процесса нужно много времени - хорошо бы знать его pid - oExec.ProcessID
WScript.Echo("ProcessID "+oExec.ProcessID);
// так получаем код завершения - oExec.ExitCode
WScript.Echo("ExitCode "+oExec.ExitCode);
// так выводим результаты
WScript.Echo("Result: \""+result+"\"");
```

На сколько я понял переменная result принимает тип string. Не массив это точно. Но MSDN не нашел точной информации, поэтому каждый в праве верить во что ему нужно.
