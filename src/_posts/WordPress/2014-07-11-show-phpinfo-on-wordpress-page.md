---
id: 1184
title: Отображение информации phpinfo в WordPress без ftp доступа к серверу
date: 2014-07-11T14:52:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=1184
permalink: /show-phpinfo-on-wordpress-page/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - phpinfo
  - wordpress
---
Если Вы столкнулись с такой же проблемой как и я - добро пожаловать. Обратился человек, говорит `Все пропало`. Доступа к серверу нету, имена, пароли, явки сменены. Нужно увезти сайт от плохих дядек. Тонкости описывать не буду - юзаем любой плагин для бэкапа.

Нужно было получить некоторые данные о сервере, которые как правило выводятся функцией `phpinfo`. Всем знакомая, добрая, да вот только без доступа к серверу нельзя создать php файл и вкинуть ее туда.

Благо дела админка WordPress дает возможность редактировать файлы темы. `Создам функцию, которая возвращает результаты phphinfo, и вызову ее на любой из страниц сайта`, - подумал я. Для получения информации не нужно даже сохранять изменения. Все можно увидеть на экране предварительного просмотра.

Итак логинимся в WordPress. Переходим в меню `Внешний вид -> Редактор`  
[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103459.png" alt="Screenshot from 2014-07-11 10:34:59" width="210" height="502" class="aligncenter size-full wp-image-1185" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103459.png 210w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103459-71x170.png 71w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103459-125x300.png 125w" sizes="(max-width: 210px) 100vw, 210px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103459.png)

Дальше в правой колонке под названием `Шаблоны` ищем файл `functions.php`:  
[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103508.png" alt="Screenshot from 2014-07-11 10:35:08" width="241" height="560" class="aligncenter size-full wp-image-1186" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103508.png 241w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103508-73x170.png 73w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103508-129x300.png 129w" sizes="(max-width: 241px) 100vw, 241px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103508.png)

Выбираем его и код появляется в поле редактора. Тянем бегунок в самый конец и вкидываем туда вот такие строки:

```php
function serverinfo() {
	return phpinfo();
}
add_shortcode('serverinfo', 'serverinfo');
```


Получается вот так:  
[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103533.png" alt="Screenshot from 2014-07-11 10:35:33" width="533" height="279" class="aligncenter size-full wp-image-1187" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103533.png 533w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103533-170x88.png 170w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103533-300x157.png 300w" sizes="(max-width: 533px) 100vw, 533px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-103533.png)

Жмем обновить файл.

Дальше переходим к существующим страницам, выбираем любую из них (**лучше главную не выбирать**) и пишем в любом месте (лучше самое начало или самый конец):

```php
[serverinfo][/serverinfo]
```


В правом верхнем углу страницы жмем кнопку `Просмотреть`.

[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-104931.png" alt="Screenshot from 2014-07-11 10:49:31" width="291" height="246" class="aligncenter size-full wp-image-1188" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-104931.png 291w, /wp-content/uploads/2014/07/Screenshot-from-2014-07-11-104931-170x143.png 170w" sizes="(max-width: 291px) 100vw, 291px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-07-11-104931.png)

В результате таких рукоблудных махинаций открывается страница с результатами phpinfo&#40;&#41;, соответственно с примененными стилями активной темы.
