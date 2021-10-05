---
id: 2303
title: Создание дочерней темы в WordPress
date: 2015-01-21T20:28:41+00:00
author: admin

guid: http://www.tech-notes.net/?p=2303
permalink: /wordpress-child-themes/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - Дочерние темы в WordPress
---
Вдохновленный статьей на хабре, решил создать свою версию про создание дочерней темы в WordPress, поскольку на хабре много текста и объяснений. Я, как человек не считающий себя большим профи в програмировании на WordPress, постараюсь рассказать все коротко и по сути.  

Если вы второй раз смотрите на WordPress и третий раз наступили на грабли с обновлением темы - читайте дальше.

Итак, для чего нужны дочерние темы? Я уже частично ответил на этот вопрос. С определенной периодичностью в ядре WordPress, плагинах и темах обнаруживаются дыры (в плане безопасноти). Как правило толковые ребята, занимающиеся разработкой тем, плагинов и самой CMS, выпускают обновления. Все Ваши кастомизации пропадают в тот момент, когда вы устанавливаете эти обновления. Особенно плохо становится в ситуации с глубоко-модифицированной темой. Очень плачевно - при отсутствии резервной копии.

Для того что бы не терять все свои модификации - лучше не делать их в файлах главной темы.

Мне удалось найти в закромах WordPress со старой версией темы Twenty Twelve. Ее и буду использовать для примера.

1. Создаем папку дочерней темы:

```bash
mkdir /wp-content/themes/twentytwelve-child
```

2. Для работы темы нужно два файла:
  * style.css
  * functions.php

Создадим их:

```bash
touch /wp-content/themes/twentytwelve-child/style.css  
touch /wp-content/themes/twentytwelve-child/fnctions.php
```

3. Имя темы задается в `style.css`. Минимальный набор кода для style.css:

```css
/*
Theme Name: Twenty Twelve Child
Template: twentytwelve
Author: the WordPress team
Version: 1.0
Text Domain: twentytwelve-child
*/

@import url("../twentytwelve/style.css")
```


Последняя строка подгружает стили из материнской темы.

В этот момент тема появляется в списке тем в админке WordPress и выглядит вот так:  
[<img src="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100501.png" alt="Screenshot from 2015-01-21 10:05:01" width="979" height="332" class="aligncenter size-full wp-image-2305" srcset="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100501.png 979w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100501-170x58.png 170w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100501-300x102.png 300w" sizes="(max-width: 979px) 100vw, 979px" />](/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100501.png)

Скопируйте screenshot.png из материнской темы для того что бы появилось изображение. По желанию его можно подредактировать:

```bash
cp /wp-content/themes/twentytwelve/screenshot.png /wp-content/themes/twentytwelve-child/
```

Теперь список тем выглядит вот так:  
[<img src="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100836.png" alt="Screenshot from 2015-01-21 10:08:36" width="944" height="312" class="aligncenter size-full wp-image-2306" srcset="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100836.png 944w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100836-170x56.png 170w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100836-300x99.png 300w" sizes="(max-width: 944px) 100vw, 944px" />](/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-100836.png)

После этого тему можно активировать и она даже заработает.

Осталось сложить все модифицированые файлы в папку дочерней темы. Дело в том, что WordPress приоритизирует скрипты/файлы из папки дочерней темы над файлами/скриптами материнской темы. Если же какой-то из файлов не найден в папке дочерней темы - он берется из материнской.

Стандартная тема выглядит вот так:  
[<img src="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941.png" alt="Screenshot from 2015-01-21 10:19:41" width="1042" height="392" class="aligncenter size-full wp-image-2307" srcset="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941.png 1042w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941-170x64.png 170w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941-300x113.png 300w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941-1024x385.png 1024w" sizes="(max-width: 1042px) 100vw, 1042px" />](/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-101941.png)

Давайте немного моифицируем ее для наглядности. Я скопировал файл header.php из материнской темы, поменял в нем отображение меню (над заголовком) и убрал отображение описания блога. При этом оригинальный header.php остался нетронутым. Получилось вот так:  
[<img src="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712.png" alt="Screenshot from 2015-01-21 10:27:12" width="1042" height="381" class="aligncenter size-full wp-image-2308" srcset="/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712.png 1042w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712-170x62.png 170w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712-300x110.png 300w, /wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712-1024x374.png 1024w" sizes="(max-width: 1042px) 100vw, 1042px" />](/wp-content/uploads/2015/01/Screenshot-from-2015-01-21-102712.png)

Как мы видим сработал `header.php` из папки дочерней темы.

Засада только со стилями. Если Вы объявите новый стиль отображения, на пример, ширину зоны текста в файле `style.css` дочерней темы - он не сработает.

Для того, что бы он сработал нужно создать отдельный файл стилей и подключить его:

```bash
touch /wp-content/themes/twentytwelve-child/custom.css
```

Внесите в него код из спойлера ё:  
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript">


<div class="spoiler-wrap">
  <div class="spoiler-head folded">site</div>
  <div class="spoiler-body">
<pre class="language-css">
.site {
  margin: 0 auto;
  max-width: 90%;
  overflow: hidden;
}
</pre>
    </div>
</div>

К сожалению директива `@import url` работает только один раз в файле `style.css`, поэтому второй файл стилей подключить не удасться.

В `WordPress` стили подключаются функией `wp_enqueue_style()` в файле `functions.php`.

Создаем первую кастомную функцию в `functions.php` дочерней темы, которая будет возвращать папку или uri дочерней темы:

```php
function get_child_template_directory_uri() {
  return dirname( get_bloginfo('stylesheet_url') );
}
```

После этого мы можем смело использовать `get_child_template_directory_uri()` в других кастомных функциях.
Теперь подключаем `custom.css`:
```php
function child_styles() {
  wp_enqueue_style( 'twentytwelve-child-style', get_child_template_directory_uri() . '/custom.css' );
}
add_action( 'wp_enqueue_scripts', 'child_styles',12);

```

При необходимости можно копировать строчку и добавлять другие css файлы. Все будет работать.

Думаю не нужно объяснять, почему файл functions.php должен начинаться с `<?php` и заканчиваться `?>`

Кстати цыфра в add_action() определяет приоритет. 12 - самый крутой action, подразумевается, что стили, которые были подключены с помощью его, будут брать верх над стандартными из материнской темой.

По аналогии со стилями можно добавлять и другие функции, без вариантов их потерять при обновлении.

Дальнейшие разглагольствования вести не буду. В папку сложите все файлы, которые были отредактированы, подключите все необходимые css файлы и обновляйтесь сколько угодно.
