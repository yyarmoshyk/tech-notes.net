---
id: 2346
title: Простые и легкие вкладки на jQuery
date: 2015-02-03T17:50:01+00:00
author: admin

guid: http://www.tech-notes.net/?p=2346
permalink: /tabs-with-jquery/
image: /wp-content/uploads/2015/02/jQuery_logo.jpg
categories:
  - jQuery
tags:
  - FromHabrSandbox
  - вкладки на jQuery
---
Хабрапользователя Лжедмитрия не устроили найденые в интернете варианты горизонтальных текстовых вкладок. Как результат, в течении 15 минут родился несложный jQuery плагин, удовлетворяющий его запросам. Он решил поделиться, а я решил, что для истории будет полезно сохранить - авось где применю.

Количество вкладок не ограничено, так же я попытался сделать структуру максимально простой, так как в его случае есть необходимость, чтобы заказчик без трудностей с ней разобрался и добавлял новые вкладки.

HTML структура:

```html
<div class="tabs">
    <ul>
        <li>Первая вкладка</li>
        <li>Вторая вкладка</li>
        <li>Третья вкладка</li>
    </ul>
    <div>
        <div>Первое содержимое</div>
        <div>Второе содержимое</div>
        <div>Третье содержимое</div>
    </div>            
</div>
```


### CSS стили:

```css
.tabs{
    display:inline-block;
}
.tabs > div{
    padding-top:10px;
}
.tabs ul{
    margin:0px;
    padding:0px;
}
.tabs ul:after{
    content:"";
    display:block;
    clear:both;
    height:5px;
    background:#46c765;
}
.tabs ul li{
    margin:0px;
    padding:0px;
    cursor:pointer;
    display:block;
    float:left;
    padding:10px 15px;
    background:#e9eaeb;
    color:#707070;
}
.tabs ul li.active, .tabs ul li.active:hover{
    background:#46c765;
    color:#fff;
}
.tabs ul li:hover{
    background:#d6d6d7;
}
```


### Подключаем плагин:

```js
$(document).ready(function(){
  $(".tabs").lightTabs();
});
```


### Сам код плагина:

```js
(function($){				
  jQuery.fn.lightTabs = function(options){

    var createTabs = function(){
      tabs = this;
      i = 0;

      showPage = function(i){
        $(tabs).children("div").children("div").hide();
        $(tabs).children("div").children("div").eq(i).show();
        $(tabs).children("ul").children("li").removeClass("active");
        $(tabs).children("ul").children("li").eq(i).addClass("active");
      }

      showPage(0);				

      $(tabs).children("ul").children("li").each(function(index, element){
        $(element).attr("data-page", i);
        i++;                        
      });

      $(tabs).children("ul").children("li").click(function(){
        showPage(parseInt($(this).attr("data-page")));
      });				
    };		
    return this.each(createTabs);
  };
})(jQuery);
```

Демку можно посмотреть тут: [jsfiddle.net/du9cbd9j](http://jsfiddle.net/du9cbd9j)  
Оригинал статьи можно почитать тут: <a href="http://habrahabr.ru/sandbox/91471/" target="_blank">habrahabr.ru/sandbox/91471/</a>
