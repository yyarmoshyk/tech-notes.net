---
id: 1089
title: Считаем DNS зоны в Windows Server 2008/2012 с помощью Microsoft Jscript
date: 2014-06-30T19:37:59+00:00
author: admin

guid: http://www.tech-notes.net/?p=1089
permalink: /list-dns-zones-in-windows-server-20082012-with-microsoft-jscript/
image: /wp-content/uploads/2014/06/dns.jpg
categories:
  - Windows Server
tags:
  - Microsoft Jscript
---
Пришлось мне как-то раз автоматизировать процесс получения информации и DNS зонах, которые находятся на абстрактном сервере под управлением `Windows`. Опять мой мозг режет мысль о том, что пишу заметку про окна, когда изначально блог задумывался о задачах, связанных с `Linux`.

Итак задача ясна. Выбор инструмента пал на `Jscript`, поскольку тело основного модуля написано на нем, писать вторую часть на PowerShell - не комильфо. Решил: `Буду считать файлы с расширением *.dns в папке C:\Windows\System32\dns, убирать у них расширение, считать их количество`

Объявляем изначальные переменные, инициализируем работу с shell:

```bash
var env = new ActiveXObject("WScript.Shell").Environment("Process");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var path = env("WINDIR") + '\\System32\\dns';

```


В обязательном порядке нужно удостовериться, что папка существует и зоны в ней тоже есть, иначе скрипт будет выпадать с ошибкой. Добавляем условие существования объекта `fso` (file system object):  
`if (fso.FolderExists(path) == true){`

Дальше читаем содержимое папки, убираем путь к ней, и записываем получение данные в массив dnsfiles

```bash
var folder = fso.GetFolder(path);
var myEnum = new Enumerator(myFolder.Files);

myEnum.moveFirst();
while(!myEnum.atEnd()){
	var re =new RegExp('[^\\\\]*dns$', "gi");
	var file = re.exec(myEnum.item());
	if ((file != null) && (file != "cache.dns") && (file != "CACHE.DNS")){
		var dnsrecord = new RegExp("\.dns", "i");
		dnsrecord.exec(file);
	}
	myEnum.moveNext();
}

```


Этот же принцип можно использовать для листинга содержимого других каталогов.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Полный скрипт:
  </div>

  <div class="spoiler-body">
<pre>
var env = new ActiveXObject("WScript.Shell").Environment("Process");
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path = env("WINDIR") + '\\System32\\dns';

	if (fso.FolderExists(path) == true){

  	var myFolder = fso.GetFolder(path);
  	var myEnum = new Enumerator(myFolder.Files);
  	var nn = 1;

  	WScript.Echo("");
  	WScript.Echo("System DNS zones: ");

  	myEnum.moveFirst();

  	while(!myEnum.atEnd()){
  		var re =new RegExp('[^\\\\]*dns$', "gi");
  		var file = re.exec(myEnum.item());
  		if ((file != null) && (file != "cache.dns") && (file != "CACHE.DNS")){
 				var dnsrecord = new RegExp("\.dns", "i");
 				dnsrecord.exec(file)
 				WScript.Echo(nn+': '+RegExp.leftContext);
 				num += nn;
  		}
  		myEnum.moveNext();
  	}
  }
</pre>
</div></div>


Ссылки на MSDN:
* [msdn.microsoft.com/en-us/library/f1xtf7ta(v=vs.84).aspx](http://msdn.microsoft.com/en-us/library/f1xtf7ta(v=vs.84).aspx)
* [msdn.microsoft.com/en-us/library/z89sx3bt(v=vs.90).aspx](http://msdn.microsoft.com/en-us/library/z89sx3bt(v=vs.90).aspx)
* [msdn.microsoft.com/en-us/library/9bz1415h(v=vs.90).aspx](http://msdn.microsoft.com/en-us/library/9bz1415h(v=vs.90).aspx)
* [msdn.microsoft.com/en-us/library/vstudio/8x66t8c7(v=vs.100).aspx](http://msdn.microsoft.com/en-us/library/vstudio/8x66t8c7(v=vs.100).aspx)
* [msdn.microsoft.com/en-us/library/vstudio/zbbyez9z(v=vs.100).aspx](http://msdn.microsoft.com/en-us/library/vstudio/zbbyez9z(v=vs.100).aspx)
* [msdn.microsoft.com/en-us/library/6ch9zb09(v=vs.84).aspx](http://msdn.microsoft.com/en-us/library/6ch9zb09(v=vs.84).aspx)
