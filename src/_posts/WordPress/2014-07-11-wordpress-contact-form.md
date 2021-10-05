---
id: 638
title: Форма обратной связи для WordPress без плагинов
date: 2014-07-11T07:14:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=638
permalink: /wordpress-contact-form/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - wordpress
  - без плагина
  - обратная связь
---
Есть разные плагины для организации обратной связи для WordPress. Почему-то ни один из них корректно не сработал в моем блоге.  
Зная некоторые базовые основы WordPress и php, я подумал, что можно обойтись и без плагина. Предлагаю Вашему вниманию шаблон страницы для отправки почты:

```php
<?php
/**
* Template Name: Contact Form
*/
get_header();
?>
<?php
  if( ($_POST['frommail'] != '') && ($_POST['subject'] != '') && ($_POST['msg'] != '') && ($_POST['fromname'] != '') ){
  	$to = "<strong>your@mail.com</strong>";
  	$subjectfrom = $_POST['fromname'];
  	$subjectdata = $_POST['subject'];
  	$subject = "[Contact form reply] " . $subjectdata;
  	$msg = $_POST['msg'];
  	$from = $_POST['frommail'];
  	$msg .= " \r\n";
  	$msg .= "\r\n От $subjectfrom";
  	$headers = "From: $from";

		mail($to,$subject,$msg,$headers);
		echo '<center><b>Спасибо за Ваш отзыв! Письмо было отправлено.</b><br><br>';
  	}
?>

<body>
<form action="<?php $_SERVER['PHP_SELF'] ?>" method="post">

<div>
<center><table style="width:40%;">
<tr> <td>E-mail адрес *:</td><td><input type="text" name="frommail" /></td></tr>
<tr><td>Имя *:</td><td><input type="text" name="fromname" /></td></tr>
<tr><td>Тема *:</td><td><input type="text" name="subject" /></td></tr>
<tr><td>Ваше сообщение *:</td><td><textarea rows="4" cols="23" name="msg"></textarea></td></tr>
<tr><td colspan="2"> <input type="submit" value="Отправить" /></td></tr>
</table></center>

<?php get_footer(); ?>
```


Этот код нужно сохранить `%папка_темы%/page-templates/contact-form.php`.

Дальше заходим в админку, создаем еще одну страницу. Название выберите на Ваше усмотрение. Прокручиваем страницу вниз в правой части экрана в разделе `Атрибуты страницы` выбираем шаблон `Contact Form`. Сохраняем. Радуемся.

[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-12-031118.png" alt="Screenshot from 2014-03-12 03:11:18" width="283" height="180" class="aligncenter size-full wp-image-640" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-12-031118.png)

Не забудьте поменять **your@mail.com** на адрес Вашего почтового ящика.

На выходе получаем вот такую форму, с помощью которой люди могут войти в контакт с Вами:  
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png" alt="Screenshot from 2014-07-11 16:07:28" width="591" height="397" class="aligncenter size-full wp-image-1215" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png 591w, /wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728-170x114.png 170w, /wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728-300x201.png 300w" sizes="(max-width: 591px) 100vw, 591px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png)
