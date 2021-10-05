---
id: 1304
title: Оптимизация изображений для сайта на сервере с Linux
date: 2014-07-23T14:42:49+00:00
author: admin

guid: http://www.tech-notes.net/?p=1304
permalink: /optimize-images/
image: /wp-content/uploads/2014/07/performances-web.png
categories:
  - bash
---
Многие из нас сталкивались не раз с тем, что всякого рода тестировщики скорости работы сайта ругались на неоптимизованые картинки. Многие из нас игнорировали эти сообщения и довольствовались высокой скоростью отгрузки страниц.

Для тех, кто хочет видеть высокие балы на подобных speadtest'ах, предлагаю сжать/оптимизировать свой картинки. Для этого нам понадобится всего несколько утилит.  
Для CentOS:

```bash
yum install optipng jpegoptim pngtools
```

Для Ubuntu:

```bash
apt-get install jpegoptim optipng pngtools
```

<center>
  <div id="gads">
  </div>
</center>

Дальше делаем, на всякий случай резервную копию сайта и переходим в папку, где он (сайт) хранится. Для оптимизации всeх jpg, jpeg и png файлов можно использовать следующие маленькие скрипты-циклы:

```bash
for f in $(find . -type f -name `*.png`);do optipng $f;done
```

```bash
for f in $(find . -type f -name `\*.jp\*g`);do jpegoptim -m70 $f;done
```

[<img src="/wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936.png" alt="Screenshot from 2014-08-20 08:19:36" width="1217" height="456" class="aligncenter size-full wp-image-1404" srcset="/wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936.png 1217w, /wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936-170x63.png 170w, /wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936-300x112.png 300w, /wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936-1024x383.png 1024w, /wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936-660x247.png 660w" sizes="(max-width: 1217px) 100vw, 1217px" />](/wp-content/uploads/2014/07/Screenshot-from-2014-08-20-081936.png)
