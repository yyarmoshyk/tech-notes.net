---
id: 3371
title: Использование шаблонного текста при создании записи в WordPress
date: 2016-06-16T12:23:05+00:00
author: admin

guid: http://www.tech-notes.net/?p=3371
permalink: /use-mockup-wordpress-new-post/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
---
В ходе работы над [новым ресурсом](http://securepulse.online/), было решено использовать единый шаблон для публикации записей определенного типа.

Предложение выглядит немного бредовым. Целью сайта [securepulse.online](http://securepulse.online) является информирование подписчиков о выходе новых версий ПО, патчей и выявленных уязвимостях в тех или иных продуктов. Все новости из этого разряда имеют тип `SecurityNews` (для типизации постов испольузется плагин [Toolset Types](https://wordpress.org/plugins/types/))

В ходе долгих обсуждение были отобраны следующие секции для всех новостей:

  * Описание новости (Decription)
  * Изменения (Changes)
  * Версии ПО к которым относится новость (Affected versions)
  * Рекомендуемое действие (Recommended action)
  * Ссылки на новость и сопутствующие ресурсы (Origin URLs)

Собственно редактор текста должен содержать эти разделы в момент создания записи.

Достигается это с помощью следующего кода в файле `wp-admin/edit-form-advanced.php`.

Находит строку:

```php
<?php wp_editor( $post->post_content, 'content', array(
```


И добавляем перед ней следующее:

```php
<?php if ($post_type == '<strong>securitynews</strong>' && $action != '<code>edit</code>') {
  $template = "<strong>Decription: </strong>\n\n";
  $template .= "<strong>Changes: </strong>\n\n";
  $template .= "<strong>Affected versions: </strong>\n\n";
  $template .= "<strong>Recommended action: </strong>\n\n";
  $template .= "<strong>Origin URLs: </strong>\n\n";
}
?>
```


Саму же строку приводим к ледующему виду:

```php
<?php wp_editor( $post->post_content.''.$template, 'content', array()
```


Код нужно добавлять в секцию `Fires after the title field`, как показано на скриншоте:  
<img src="/wp-content/uploads/2016/06/Screenshot-from-2016-12-18-162840.png" alt="screenshot-from-2016-12-18-162840" width="665" height="319" class="aligncenter size-full wp-image-3590" />

Здесь условиями выполнения является тип поста `securitynews` и действие редактирования.

В результате рисуется следующая картинка:  
<img src="/wp-content/uploads/2016/06/Screenshot-from-2016-06-16-081102.png" alt="Screenshot from 2016-06-16 08:11:02" width="867" height="404" class="aligncenter size-full wp-image-3372" />
