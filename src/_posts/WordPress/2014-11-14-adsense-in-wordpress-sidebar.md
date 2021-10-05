---
id: 2152
title: Добавить блок рекламы Adsense WordPress (Sidebar)
date: 2014-11-14T21:39:42+00:00
author: admin

guid: http://www.tech-notes.net/?p=2152
permalink: /adsense-in-wordpress-sidebar/
image: /wp-content/uploads/2014/11/adsense-logo-1.jpg
categories:
  - WordPress
tags:
  - Adsense
---
Adsense является, пожалуй, одним из самых распространенных сервисов контекстной рекламы. Для CMS WordPress существует целый набор плагинов для установки кода рекламы.

В этой статье приведу пример самого простого и быстрого способа установки рекламного кода Adsense в сайдбар (sidebar) вашего блога без использования дополнительных плагинов. Для этого не потребуется никаких плагинов.

Для начала выберите квадратный блок рекламы в вашей панели Adsense. Рассмотрите код подробнее:  
Подключается внешняя библиотека:

```html
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```


Коментарий, указывающий размер блока:

```html
<!-- 250x250 -->
```


Объявляется класс adsbygoogle:

```html
<ins class="adsbygoogle"
     style="display:inline-block;width:250px;height:250px"
     data-ad-client="ca-pub-<strong>xxxxxxxxxxxxxxxx</strong>"
     data-ad-slot="<strong>xxxxxxxxxx</strong>">
</ins>

```


`xxxxxxxxxx` - идентификаторы рекламного блока с привязкой к Вашей учетной записи

Сам вывод картинки с результатами:

```html
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
```


Естественно система предлагает Вам разместить это все сплошным блоком на своем сайте.

Секцию загрузки внешнего скрипта `adsbygoogle.js` настоятельно рекомендовано внести в `footer.php` в папке темы. Шаг не обязательный, но в таком случае javascript будет загружаться после основного контента, что положительно скажется на user appereance Вашего ресурса.

Отредактировать `footer.php` можно прямо в админке WordPress. Для этого из меню `Внешний вид` выберите пункт `Редактор` (картинка кликабельна)  
[<img src="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-179x300.png" alt="Screenshot from 2014-11-14 15:39:23" width="179" height="300" class="aligncenter size-medium wp-image-2153" srcset="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-179x300.png 179w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923-101x170.png 101w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923.png 330w" sizes="(max-width: 179px) 100vw, 179px" />](/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-153923.png)

В появившемся окне найдите файл `Подвал` или `footer.php`.  
[<img src="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162236.png" alt="Screenshot from 2014-11-14 16:22:36" width="254" height="158" class="aligncenter size-full wp-image-2154" srcset="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162236.png 254w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162236-170x105.png 170w" sizes="(max-width: 254px) 100vw, 254px" />](/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162236.png)

Перед закрывающим тэгом `</body>` вставьте:

```html
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```


Возвращаемся к меню `Внешний вид`. На этот раз нас интересует пункты `Виджеты`  
[<img src="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162422-201x300.png" alt="Screenshot from 2014-11-14 16:24:22" width="201" height="300" class="aligncenter size-medium wp-image-2155" srcset="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162422-201x300.png 201w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162422-114x170.png 114w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162422.png 331w" sizes="(max-width: 201px) 100vw, 201px" />](/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162422.png)

Выбираем виджет `Текст` перетягиваем его в нужное место в сайдбаре.  
В появившемся окне вводите оставшуюся часть кода рекламного блока, как показано на снимке:  
[<img src="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162722-247x300.png" alt="Screenshot from 2014-11-14 16:27:22" width="247" height="300" class="aligncenter size-medium wp-image-2156" srcset="/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162722-247x300.png 247w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162722-140x170.png 140w, /wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162722.png 431w" sizes="(max-width: 247px) 100vw, 247px" />](/wp-content/uploads/2014/11/Screenshot-from-2014-11-14-162722.png)

Жмем кнопку `Сохранить` и переходим на сайт.

Реклама сразу же не появится. Можно сделать чаю, пока система adsense проверяет установку кода и генерирует рекламные блоки.
