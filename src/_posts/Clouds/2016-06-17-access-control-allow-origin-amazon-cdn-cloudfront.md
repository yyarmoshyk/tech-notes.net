---
id: 3381
title: 'Amazon CloudFront и ошибка с Access-Control-Allow-Origin'
date: 2016-06-17T19:42:39+00:00
author: admin

guid: http://www.tech-notes.net/?p=3381
permalink: /access-control-allow-origin-amazon-cdn-cloudfront/
image: /wp-content/uploads/2016/06/cloudfrontlogo.jpg
categories:
  - Clouds
  - AWS
tags:
  - cloudfront
---
На днях развернули в клауде амазона магазин на базе Megento. И все бы ничего, но в консоли браузера насточиво появляется следующая ошибка

```bash
Font from origin 'https://blablabla.cloudfront.net' has been blocked from loading by Cross-Origin Resource Sharing policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://blablabla.com' is therefore not allowed access.
```

Добавленую конструкцию в конфиг `nginx`-а браузер успешно игнорил.

```bash
location ~* \.(eot|ttf|woff)$ {
    add_header Access-Control-Allow-Origin *;
}
```

Как оказалось позже, залоговок `Access-Control-Allow-Origin` просто на просто резался из объектов хранимых в `CloudFont`. Сам же `CloudFont` убирал все заголовки из кешированых файлов. Нужные заголовки нужно добавить в разрешенный список в настройках CDN.

Для этого в консоли AWS перейдите в раздел `CloudFront Global Content Delivery Network`, виберите нужный дистрибутив, перейдите на вкладку Behaviours:  
<img src="/wp-content/uploads/2016/06/Screenshot-from-2016-06-17-153247.png" alt="Screenshot from 2016-06-17 15:32:47" width="858" height="205" class="aligncenter size-full wp-image-3382" />

Дальше выберите то, что есть в списке и нажмите кнопку `Edit`, которая станет активной.

На новой странице из выпадающего списка возле `Forward Headers` выберите `Whitelist`  
<img src="/wp-content/uploads/2016/06/Screenshot-from-2016-06-17-153443.png" alt="Screenshot from 2016-06-17 15:34:43" width="787" height="224" class="aligncenter size-full wp-image-3383" />

Появится два поля, а между ними кнопки. Вам нужно найти в левом поле слово `Origin`, вибрать его и нажать кнопку `Add`  
<img src="/wp-content/uploads/2016/06/Screenshot-from-2016-06-17-153522.png" alt="Screenshot from 2016-06-17 15:35:22" width="976" height="255" class="aligncenter size-full wp-image-3384" />

Соглано документам Amazon, в таком случае служюа CDN будет добавлять заголовок с изначальным именем домена ко всем объектам в кеше.

Список использованой литературы:

  * [docs.aws.amazon.com](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/forward-custom-headers.html)
  * [http://blog.celingest.com/en/2014/10/02/tutorial-using-cors-with-cloudfront-and-s3/](http://blog.celingest.com/en/2014/10/02/tutorial-using-cors-with-cloudfront-and-s3/)
