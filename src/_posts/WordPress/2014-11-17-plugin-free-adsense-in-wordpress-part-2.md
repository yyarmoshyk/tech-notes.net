---
id: 2166
title: 'Как добавить AdSense в WordPress - functions.php'
date: 2014-11-17T21:12:21+00:00
author: admin

guid: /?p=2166
permalink: /plugin-free-adsense-in-wordpress-part-2/
image: /wp-content/uploads/2014/11/adsesnse-logo.jpg
categories:
  - WordPress
tags:
  - adsense wordpress
  - без плагинов
---
В догонку за [первой статьей](/adsense-in-wordpress-sidebar/) предлагаю Вашему вниманию альтернативный вариант, как еще можно добавить AdSense в WordPress без использования плагинов

Этот подход подразумевает создание функции, которая в свою очередь будет возвращать рекламный код в нужном месте.

Преимущества этого метода:

  * рекламу можно будет вставлять в статьи используя short-тэг
  * функцию можно вызывать в коде, допустим из content.php или index.php

По аналогии с [первой статьей](adsense-in-wordpress-sidebar/ "Добавить блок рекламы Adsense WordPress (Sidebar)") закидываем функцию загрузки adsbygoogle.js в footer.php

Если она у Вас уже там есть - нету смысла дублировать.

Дальше в админке из меню `Внешний вид` выберите пункт `Редактор` и найдите файл `functions.php`  
[<img src="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-179x300.png" alt="Screenshot from 2014-11-14 15:39:23" width="179" height="300" class="aligncenter size-medium wp-image-2153" srcset="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-179x300.png 179w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-101x170.png 101w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923.png 330w" sizes="(max-width: 179px) 100vw, 179px" />](/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923.png)

В самый конец добавьте следующую функцию (скопируйте код из аккаунта adsense):

```html
function google_ads() {
return '<center><div id="adsenseads"><ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>"
     data-ad-slot="<strong>xxxxxxxxxx</strong>;"></ins>
     <script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div></center>';
}
add_shortcode('gads', 'google_ads');
```


### Вызов функции в тексте

Теперь при использовании конструкции `[gads][/gads]` в тексте записи у Вас будет отображаться рекламный баннер AdSense

Для упрощения жизни - [добавить кнопку в редактор](/add-button-to-tinymce-wordpress/)

### Вызов функции в коде

Для того, что бы рекламные блоки отображались на главной странице после загловка первого поста, добавьте следующую конструкцию в цикл `<?php while ( have_posts() ) : the_post(); ?>` файла `index.php`. Обратите внимание, что нужно редактировать файл в папке вашей темы (`/wp-content/themes/theme-name`). Что бы не промахнуться, воспользуйтесь редактором в админке WordPress:

```html
<?php if ((($count == 0) && ($_SERVER["REQUEST_URI"] == "/")):?>
    <div style="padding:10px;" align="center"><?php google_ads(); ?></div>
<?php endif; $count++; ?>
```


Остальные функции создаются аналогично. Может также быть полезна статья [Несколько полезных трюков для файла функций темы в WordPress](/multiple-tricks-for-wordpress-theme-functions/)
