---
id: 2659
title: Парсинг web-страниц на php
date: 2015-06-02T14:45:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=2659
permalink: /parse-web-pages-in-php/
image: /wp-content/uploads/2015/06/html_parser.jpg
categories:
  - PHP
---
В этом нелегком деле нам поможет [PHP Simple HTML DOM Parser](http://simplehtmldom.sourceforge.net/).

Самая последняя версия доступна на [sourceforge.net](http://sourceforge.net/projects/simplehtmldom/files/).

На сегодняшний день последней является версия 1.5. Её и будем скачивать:

```bash
wget -O simplehtmldom_1_5.zip http://downloads.sourceforge.net/project/simplehtmldom/simplehtmldom/1.5/simplehtmldom_1_5.zip?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fsimplehtmldom%2Ffiles%2Fsimplehtmldom%2F1.5%2F\&ts=1433252429\&use_mirror=softlayer-ams
```

Скачали, распаковываем в папку, которая доступна по вэбу, допустим `/var/www/html/webparser`:

```bash
mkdir /var/www/html/webparser  
mv simplehtmldom_1_5.zip /var/www/html/webparser/  
cd /var/www/html/webparser  
unzip simplehtmldom_1_5.zip
```

Исходя из примера на странице парсера при вызове файла со следующим содержанием будут выведены все объекты `img` на главной странице `mysite.com`

```php
<?php
include('simple_html_dom.php');
$html = file_get_html('http://www.mysite.com/');

foreach($html->find('img') as $element)
  echo $element->src . '<br>';
?>
```

При вызове файла со следующим содержанием будут выведены все сслыки с главной страницы сайта `mysite.com`

```php
<?php
include('simple_html_dom.php');

$html = file_get_html('http://www.mysite.com/');

foreach($html->find('a') as $element)
   echo $element->href . '<br>';
?>
```


Даже не пробуйте делать `var_dump($element)`, поскольку это приведет в зависанию вашего компьютера и/или сервера, на котором Вы развернули парсер.

Вооружившись тестовыми данными я решил попарсить [песочницу хабра](http://habrahabr.ru/sandbox/). Следующий код выведет первые десять постов:
```php
<?php
include('simple_html_dom.php');

$html = file_get_html('http://habrahabr.ru/sandbox/');

$cnt = 10;
foreach($html->find('.post') as $post) {
  foreach($post->find('h1') as $header) {
    echo str_replace('a href="','a href="http://habrahabr.ru',$header->find('a')[0]) . '<br>';
    $cnt--;
  }
  if ($cnt <= 0){
    break;
  }
}
?>
```

Обработка ссылок с тэгом `h2` на примере [tecmint.com](http://www.tecmint.com/):
```php
<?php
include('simple_html_dom.php');

$html = file_get_html('http://www.tecmint.com/');

foreach($html->find('h2') as $post)
  echo $post->find('a')[0] . '<br>';
?>
```
