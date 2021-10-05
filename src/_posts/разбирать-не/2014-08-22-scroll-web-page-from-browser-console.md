---
id: 1424
title: Полезное баловство, используем консоль браузера
date: 2014-08-22T12:08:16+00:00
author: admin

guid: http://www.tech-notes.net/?p=1424
permalink: /scroll-web-page-from-browser-console/
image: /wp-content/uploads/2014/08/Javascript.png
categories:
  - Javascript
tags:
  - FromHabrSandbox
---
Некоторые задачи решаются через консоль браузера (F12), и имеют высокий КПД.  
Правда, когда я это происходит, то меня не покидает ощущение того, что я занимаюсь каким-то баловством.

Мое сегодняшнее баловство — это скрипт, который делает одну простую вещь — скроллит страницу вниз.  
Особенность его в том, что при достижении самого низа, он ждет, и если подгрузился дополнительный контент, продолжает листать страницу вниз.  
Интервал, т количество попыток подобраны методом проб и ошибок.

```Javascript
var attempts = 100,
scrollInterval = setInterval(function(){
     scrolled = window.innerHeight+window.scrollY;
     window.scroll(0,scrolled);

    if(scrolled == document.body.clientHeight){
       if(!attempts--){
           clearInterval(scrollInterval);
       }
   }
},200);
```


Остановить это все просто —

```Javascript
clearInterval(scrollInterval);
```


Когда это может быть полезно?

1. Когда нужно быстро до листать до конца страницы, а колесико крутить лень. (Это как раз мой случай, нужно было пролистать список из 1000 подписок в твиттере, чтобы потом эмулировать событие щелчка на всех кнопках «Отписаться»)  
2. Когда нужно до листать свою ленту на несколько лет назад.

<a href="http://habrahabr.ru/sandbox/86123/" target="_blank">Лжедмитрий 2.0</a>
