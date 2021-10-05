---
id: 2769
title: 'RackSpace CloudFIles - загружаем файлы'
date: 2015-07-30T18:12:41+00:00
author: admin

guid: http://www.tech-notes.net/?p=2769
permalink: /rackspace-cloud-uploads-to-cloudfiles/
image: /wp-content/uploads/2015/07/cloud-files.jpg
categories:
  - Clouds
  - RackSpace
---
Для загрузки файлов в хранилище `CloudFIles` можно воспользоваться SDK для PHP. Поддерживаются и другие языки програмирования. Полное описание установки можно почитать на следующей странице:  
[https://developer.rackspace.com/sdks/](https://developer.rackspace.com/sdks/)

Я решил дальше играться с php. Установки SDK `php-opencloud` воспользуемся утилитой `composer`:

```bash
composer require rackspace/php-opencloud
```

Чтобы установить composer выполните следующую команду:

```bash
curl -sS https://getcomposer.org/installer | php  
cp composer.phar /usr/local/bin/composer
```

Если по каким-либо причинам composer у Вас не работает - склонируйте git репозиторий:

```bash
git clone https://github.com/rackspace/php-opencloud.git
```

В текущем каталоге создаем файл upload.php со следующим содержанием:

```bash
<?php
require 'vendor/autoload.php';
use OpenCloudRackspace;

$username='имя пользователя';
$apiKey='api-ключь';
$region='регион датацентра';

if( isset($argv[1]) && isset($argv[2])) {
   $filename  = $argv[1];
   $containerName = $argv[2];

   $client = new Rackspace(Rackspace::US_IDENTITY_ENDPOINT, array(
      'username' => $username,
      'apiKey'   => $apiKey,
   ));

   $objectStoreService = $client->objectStoreService(null, $region);
   $container = $objectStoreService->getContainer($containerName);

   $handle = fopen($filename, 'r');
   $object = $container->uploadObject($filename, $handle);
} else {
   echo 'No files provided';
}
?>
```

Не нужно [ковыряться с токеном](http://www.tech-notes.net/rackspace-cloud-api-token-endpoint/), так как opencloud sdk сделает все за Вас.

Скрипту нужно передать имя файла, который хотите загрузить в клауд b имя конейнера, как второй аргумент.

[Quickstart for Cloud Files](https://developer.rackspace.com/docs/cloud-files/getting-started/?lang=php)  
[API operations for storage services](http://docs.rackspace.com/files/api/v1/cf-devguide/content/API_Operations_d1e000.html)
