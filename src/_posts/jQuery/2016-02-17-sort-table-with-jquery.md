---
id: 3191
title: Сортируем записи в таблице с помощью jQuery
date: 2016-02-17T16:35:47+00:00
author: admin

guid: http://www.tech-notes.net/?p=3191
permalink: /sort-table-with-jquery/
image: /wp-content/uploads/2015/02/jQuery_logo.jpg
categories:
  - jQuery
---
Добустим у нас есть следующая таблица на странице и Вам нужно ее отсортировать по алфавиту:

```bash
<table>
  <tr><td>Beta</td><td>2</td></tr>
  <tr><td>Omega</td><td>4</td></tr>
  <tr><td>Aplha</td><td>1</td></tr>
  <tr><td>Gamma</td><td>3</td></tr>
</table>

```


Для этого можно возпользоваться следующиим скриптом на jQuery:

```js
$(document).ready( function () {
    tbody = $('table').find('tbody');

    tbody.find('tr').sort(function(a, b) {
       return $('td:first', a).text().localeCompare($('td:first', b).text());
    }).appendTo(tbody);
});
```


Не забудьте добавить сам `jQuery` в код страницы:  
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
```

Посмотреть результаты работы можно тут:  
<a href="https://jsfiddle.net/1uo687yn/" target="_blank">https://jsfiddle.net/1uo687yn/</a>
