---
id: 638
title: Contact form for WordPress website without additional plugins
date: 2014-07-11T07:14:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=638
permalink: /wordpress-contact-form/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - wordpress
  - contact form
---

There are different plugins that enable contact form for WordPress websites. For some reason none of them worked correctly on my blog.
Knowing some basic WordPress and php basics I thought that I could do without a plugin. I bring to your attention a page template for sending mail:
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
		echo '<center><b>The message has been sent.</b><br><br>';
  	}
?>

<body>
<form action="<?php $_SERVER['PHP_SELF'] ?>" method="post">

<div>
<center><table style="width:40%;">
<tr> <td>E-mail address *:</td><td><input type="text" name="frommail" /></td></tr>
<tr><td>Your Name *:</td><td><input type="text" name="fromname" /></td></tr>
<tr><td>Subject *:</td><td><input type="text" name="subject" /></td></tr>
<tr><td>ВашеYour message *:</td><td><textarea rows="4" cols="23" name="msg"></textarea></td></tr>
<tr><td colspan="2"> <input type="submit" value="Send" /></td></tr>
</table></center>

<?php get_footer(); ?>
```


It has to be saved into the `%theme_folder%/page-templates/contact-form.php`.

Дальше заходим в админку, создаем еще одну страницу. Название выберите на Ваше усмотрение. Прокручиваем страницу вниз в правой части экрана в разделе `Атрибуты страницы` выбираем шаблон `Contact Form`. Сохраняем. Радуемся.

Next go to the admin panel and create new page. Scroll down the page on the right side of the screen in the `Page Attributes` section, select the `Contact Form` template. Hit save.

[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-12-031118.png" alt="Screenshot from 2014-03-12 03:11:18" width="283" height="180" class="aligncenter size-full wp-image-640" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-12-031118.png)

Don't forget to change **your@mail.com** to your email address.

Result looks like the following:
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png" alt="Screenshot from 2014-07-11 16:07:28" width="591" height="397" class="aligncenter size-full wp-image-1215" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png 591w, /wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728-170x114.png 170w, /wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728-300x201.png 300w" sizes="(max-width: 591px) 100vw, 591px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-07-11-160728.png)
