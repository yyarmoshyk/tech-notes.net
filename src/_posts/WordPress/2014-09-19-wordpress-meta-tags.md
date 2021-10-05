---
id: 1720
title: Добавляем в WordPress meta теги
date: 2014-09-19T19:37:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=1720
permalink: /wordpress-meta-tags/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - meta теги wordpress
  - meta теги worpdress без плагина
---
По умолчанию WordPress не выводит в коде страницы информации ометках, которые вы поставили посту. Согласно [этой статье](http://codex.wordpress.org/%D0%A2%D0%B5%D0%B3_Meta_%D0%B2_WordPress) поддержка meta тегов была убрана из WordPress.

Я не силен в SEO, но считается, что наличие meta тегов очень нравится поисковым роботам, что повышает рейтинг ресурса. Немного поковырявшись я все-таки добавл эту фичу в блог. Добавить в WordPress meta теги можно следующим образом:

1. Редактируем файл functions.php в папке темы. Добавляем в него следующую функцию:

```bash
function tags2meta() {
    $posttags = get_the_tags();
    foreach((array)$posttags as $tag) {
         $tags4meta .= $tag-&gt;name . ',';
    }
     if (!is_single()) { ?&gt;глобальные,метки,для,статей&lt;?php }
    echo "$tags4meta";
}

```


2. Вызываем эту функцию в хэдэре. Для этого редактирем header.php в папке темы. Находим первое вхождение `<meta` и вставлем следующее после него:

```bash
&lt;meta name="keywords" content="&lt;?php echo tags2meta(); ?&gt;" /&gt;
```


Теперь можно увидеть метки поста в теге мета в исходном коде страницы  
[<img src="/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537.png" alt="Screenshot from 2014-09-19 15:35:37" width="762" height="56" class="aligncenter size-full wp-image-1727" srcset="/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537.png 762w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537-170x12.png 170w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537-300x22.png 300w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537-660x48.png 660w" sizes="(max-width: 762px) 100vw, 762px" />](/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153537.png)

А так они выглядят на странице:

[<img src="/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153521.png" alt="Screenshot from 2014-09-19 15:35:21" width="579" height="79" class="aligncenter size-full wp-image-1726" srcset="/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153521.png 579w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153521-170x23.png 170w, /wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153521-300x40.png 300w" sizes="(max-width: 579px) 100vw, 579px" />](/wp-content/uploads/2014/09/Screenshot-from-2014-09-19-153521.png)

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>