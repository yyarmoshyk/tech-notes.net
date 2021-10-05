---
id: 2524
title: Импорт записей с WordPress в Yii
date: 2015-04-17T12:42:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=2524
permalink: /migrate-posts-from-wordpress-to-yii/
image: /wp-content/uploads/2015/04/yii-framework-logo.jpg
categories:
  - WordPress
tags:
  - wordpress
  - yii
---
На волне предыдущей статьи решил поиграться с Yii и попробовать портировать этот сайт со всеми статьями и страницами на Yii.

Итак имеем MySQL сервер с двумя базами:

  * wordpress
  * yii

Задача: перенести все статьи из базы WordPress в базу Yii.

Выполняется с помощью следующего запроса:

```sql
insert into yii.article (id, title, body, slug, created_at, updated_at, published_at, author_id, status)
select ID,post_title,post_content,post_name,unix_timestamp(post_date),unix_timestamp(post_modified),unix_timestamp(post_date),1,1
from wordpress.wp_posts where post_status = 'publish' and post_type = 'post';
```


В результате можно увидеть все посты из блога уже в оформлении Yii:  
[<img src="/wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026-1024x578.png" alt="Screenshot from 2015-04-17 08:30:26" width="640" height="361" class="aligncenter size-large wp-image-2525" srcset="/wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026-1024x578.png 1024w, /wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026-170x96.png 170w, /wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026-300x169.png 300w, /wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026.png 1245w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2015/04/Screenshot-from-2015-04-17-083026.png)

Осталось подредактировать файл `frontend/views/article/view.php` и обновить вывод текста статей. Для этого находим строчку::

```bash
<?php echo $model->body ?>
```


И приводим ее к следующему виду:

```bash
<?php echo preg_replace('/\n(\s*\n)/','<p>',$model->body) ?>
```
