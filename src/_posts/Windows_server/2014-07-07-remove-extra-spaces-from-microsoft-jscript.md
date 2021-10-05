---
id: 1148
title: Удаляем лишние пробелы из строк в Microsoft Jscript
date: 2014-07-07T19:07:53+00:00
author: admin

guid: http://www.tech-notes.net/?p=1148
permalink: /remove-extra-spaces-from-microsoft-jscript/
image: /wp-content/uploads/2014/07/string-words-logo-blue.small_1.jpg
categories:
  - Windows server
tags:
  - Microsoft Jscript
---
`MS Jscript` имеет очень много функций и методов от `VisualBasic` и `Microsoft C/C++.` В них входит функция `trim`, которая позволяет убрать лишние символы пробелов в начале и в конце строки. Но что же делать, если существуют лишние пробелы между словами в строке?

Предлагаю следующую функцию на Ваше усмотрение. Основная задумка: разбить строку и загнать ее в массив. Дальше пройтись по элемента массива и создать новую строку, проигнорировав все элементы массива, которые являются пробелами. Эта строка и будет возвращена в результате.

Для создания массива будем использовать функцию `split`.

```bash
function TrimInner(Str)
{
  var WordArray = Str.split(/ +/);
  Str = "";

  for (i = 0; i < WordArray.length; i++) {
  	if (WordArray[i] != ' '){
  		Str += (WordArray[i]+ " ")
  	}
  };
  return Str;
}
```


Передаем ей нужную строку, как аргумент, а в результате получаем строку без лишних пробелов.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Эта функция убирает все пробелы
  </div>

  <div class="spoiler-body">
<pre>function TrimInner(Str)
{
  var WordArray = Str.split(/ +/);
  Str = "";

  for (i = 0; i < WordArray.length; i++) {
  	if (WordArray[i] != ' '){
			    		Str += (WordArray[i])
  	}
  };

  return Str;
}</pre>
</div> </div>
