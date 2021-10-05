---
id: 2932
title: Отображение ServerVariables в IIS
date: 2015-10-21T21:06:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=2932
permalink: /display-servervariables-iis/
image: /wp-content/uploads/2015/10/logo_iis8.png
categories:
  - IIS
tags:
  - iis
  - ServerVariables
---
Многие админы пользуются функцией `phpinfo` для дэбага заголоков, которые получает сервер при обращении к сайту.

Подобную шутуку можно проделать, когда у Вас нету `php` на виндовом сервере.

В `ASP` это называется `ServerVariables`.

Создайте в корне сайта файл с расширением `asp` со следующим содержанием:

```bash
<%
for each x in Request.ServerVariables
  response.write("<b>" & x & "</b> : " & Request.ServerVariables(x) & "<br>")
next
%>
```


При обращении к этому файлу вы уидите все переменные в окружении Server.

Источники мыслей:  
* <a href="http://www.w3schools.com/asp/coll_servervariables.asp" target="_blank">http://www.w3schools.com/asp/coll_servervariables.asp</a>  
* <a href="https://msdn.microsoft.com/en-gb/library/ms524602(v=vs.90).aspx" target="_blank">https://msdn.microsoft.com/en-gb/library/ms524602(v=vs.90).aspx</a>
