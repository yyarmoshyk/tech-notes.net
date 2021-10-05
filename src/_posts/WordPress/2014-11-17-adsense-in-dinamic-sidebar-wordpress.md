---
id: 2149
title: Adsense в динамической боковой панели WordPress
date: 2014-11-17T21:42:52+00:00
author: admin

guid: http://www.tech-notes.net/?p=2149
permalink: /adsense-in-dinamic-sidebar-wordpress/
image: /wp-content/uploads/2014/11/Home_Original.jpg
categories:
  - WordPress
tags:
  - Adsense
---
Блок контекстной рекламы Adsense у меня довольно давно находится в боковой панели. Не так давно до меня дошло, что панель имеет динамический размер (22% от тела страницы) и в зависимости от расширения экрана (и размера окна браузера) блок рекламы 250х250 px немного портит внешний вид страницы.

Закономерно нарисовалась задачка: `Как отображать рекламные блоки Adsense разной ширины в зависимости от расширения экрана посетителя?`

К сожалению с помощью php нельзя определить расширение экрана, поскольку php выполняется на сервере и ни один параметр запроса не передает ширину экрана клиента. Поэтому [подход с functions.php](http://www.tech-notes.net/plugin-free-adsense-in-wordpress-part-2/ "Как добавить AdSense в WordPress — functions.php") отпадает.

В свою очередь javascript выполняется на стороне клиента и с помощью его можно определить какой же ширины конечное изображение у клиента.

Разбор рекламного кода я проводил в [первой статье](http://www.tech-notes.net/adsense-in-wordpress-sidebar/)

Нас интересует серединка этого всего, а именно `class="adsbygoogle"`, так как для каждого блока он будет разный.

Дальше переходим в свою учетную запись AdSense и включаем рекламные блоки нужных размеров. В моем случае это:

  * 125х125
  * 180х150
  * 200х200
  * 250х250
  * 300х250

И на основе секции, в которой описано `class="adsbygoogle"` создаем нужный скрипт:

```html
<script>
width = window.innerWidth;
window_percentage = (window.innerWidth/100)*95;
sidebar_percentage = Math.round((window_percentage/100)*22);

if ((sidebar_percentage > 125)&&(sidebar_percentage <= 180)) {
    document.write('<ins class="adsbygoogle" ');
    document.write('style="display:inline-block;width:125px;height:125px" ');
    document.write('data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>" ');
    document.write('data-ad-slot="<strong>xxxxxxxxxx</strong>"></ins> ');
} else if ((sidebar_percentage > 180)&&(sidebar_percentage <= 202)) {
    document.write('<ins class="adsbygoogle" ');
    document.write('style="display:inline-block;width:180px;height:150px" ');
    document.write('data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>" ');
    document.write('data-ad-slot="<strong>xxxxxxxxxx</strong>"></ins> ');
} else if ((sidebar_percentage > 202)&&(sidebar_percentage <= 250)) {
    document.write('<ins class="adsbygoogle" ');
    document.write('style="display:inline-block;width:200px;height:200px" ');
    document.write('data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>" ');
    document.write('data-ad-slot="<strong>xxxxxxxxxx</strong>"></ins> ');
} else if ((sidebar_percentage > 251)&&(sidebar_percentage <= 301)) {
    document.write('<ins class="adsbygoogle" ');
    document.write('style="display:inline-block;width:250px;height:250px" ');
    document.write('data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>" ');
    document.write('data-ad-slot="<strong>xxxxxxxxxx</strong>"></ins> ');
} else if ((sidebar_percentage > 301)&&(sidebar_percentage <= 402)) {
    document.write('<ins class="adsbygoogle" ');
    document.write('style="display:inline-block;width:300px;height:250px" ');
    document.write('data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>" ');
    document.write('data-ad-slot="<strong>xxxxxxxxxx</strong>"></ins> ');
}
</script>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</center>
```


В моем случае размер основного тела занимает 95% от ширины страницы:

```html
window_percentage = (window.innerWidth/100)*95
```


От него 22% - ширина боковой панели:

```html
sidebar_percentage = Math.round((window_percentage/100)*22)
```


Дальше идет простой перебор условий и отображение необходимого блока, в зависимости от ширины экрана.

Теперь блок рекламы в сайдбаре не портит внешний вид страниц. Провозился пол дня, зато какой эффект.

Этот подход применим и другим рекламным и не рекламным блокам.
