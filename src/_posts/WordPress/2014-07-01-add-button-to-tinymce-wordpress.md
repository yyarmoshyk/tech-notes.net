---
id: 1105
title: Добавляем пункт в меню редактора TinyMCE WordPress
date: 2014-07-01T14:51:40+00:00
author: admin

guid: http://www.tech-notes.net/?p=1105
permalink: /add-button-to-tinymce-wordpress/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
---
Вчера добавил поддержку спойлеров в блог используя материалы из [этой статьи](http://webliberty.ru/spoyler-na-wordpress-bez-plaginov/)

Спойлеры получились красивые и выглядят вот так:
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Йа спойлер
  </div>

  <div class="spoiler-body">
    Эта статья писалась под `WordPress`, но сейчас сайт вертится на [Jekyll](https://jekyllrb.com/). Кому интересно как я сделал тут спойлер - пишите на почту.
  </div>
</div>

Вот только не удобно каждый раз набирать сочетание
```html
<spoiler name="Йа спойлер"></spoiler>
```

Начал ковырять wordpress с целью найти, как добавить кнопку сего чудо-тэга в панель редактора TinyMCE. В результатах поиска в google и yadex не нашел, а может плохо вопрос задавал. Пока удалось добавить только в панель текстового (не визуального) редактора.

Для этого нужно подредактировать файл `wp-includes/js/quicktags.min.js` и вставить в самый конец вот такие строки:

```js
edButtons[140]=new a.TagButton("Spoiler","Spoiler","<spoiler\ name=\"\">","</spoiler>","t")
```


Самый конец - символы `}();`. Соответственно цифра 140 определяет положение кнопки в панели. В моем случае я увеличил ее для последней кнопки (закрыть теги) до 150 и назначил кнопке спойлера id равный 140.

На выходе получил вот такое:

[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804.png" alt="Screenshot from 2014-07-01 10:18:04" width="1412" height="107" class="aligncenter size-full wp-image-1108" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804.png 1412w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804-170x12.png 170w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804-300x22.png 300w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804-1024x77.png 1024w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804-660x50.png 660w" sizes="(max-width: 1412px) 100vw, 1412px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-01-101804.png)
