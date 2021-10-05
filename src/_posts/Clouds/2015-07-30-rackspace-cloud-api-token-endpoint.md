---
id: 2763
title: 'RackSpace Cloud API - получение токена и точки входа'
date: 2015-07-30T17:31:19+00:00
author: admin

guid: http://www.tech-notes.net/?p=2763
permalink: /rackspace-cloud-api-token-endpoint/
image: /wp-content/uploads/2015/07/rackspac-logo.jpg
categories:
  - Clouds
  - RackSpace
tags:
  - RackSpace
---
`RackSpace` - американский хостинг с несколькими дата центрами, который предоставляет большое количество хостинговых решений. Одним из продуктов является cloud hosting, со своим набором дополнительных сервисов, таких как резервное копирование, автоматическое скалирование, CDN и т.д.

Управлять всем этим добром можно через API, авторизация в котором происходит на основе имени пользователя и токена. Токен является валидным только 1 день, поэтому каждый скрипт работы с API должен начинаться с получения валидного токена.

Общий запрос выглядит следующим образом:

```bash
curl -s -X POST https://identity.api.rackspacecloud.com/v2.0/tokens \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "RAX-KSKEY:apiKeyCredentials": {
        "username": "<strong>лоин</strong>",
        "apiKey": "<strong>api-ключь</strong>"
      }
    }
  }' | python -m json.tool
```


**лоин** - Ваш логин в RackSPace cloud  
**api-ключь** монжо найти на странице настроек учетной записи, как показано на скриншоте:  
[<img src="/wp-content/uploads/2015/07/Screenshot-from-2015-07-30-125952.png" alt="Screenshot from 2015-07-30 12:59:52" width="560" height="338" class="aligncenter size-full wp-image-2764" srcset="/wp-content/uploads/2015/07/Screenshot-from-2015-07-30-125952.png 560w, /wp-content/uploads/2015/07/Screenshot-from-2015-07-30-125952-170x103.png 170w, /wp-content/uploads/2015/07/Screenshot-from-2015-07-30-125952-300x181.png 300w" sizes="(max-width: 560px) 100vw, 560px" />](/wp-content/uploads/2015/07/Screenshot-from-2015-07-30-125952.png)

Ответ приходит в формате `json`. К сожалению средствами `bash` очень неудобно парсить `json`, то ли дело php.

Следующая функция принимает имя пользователя и api-ключь в виде аргументов и возвращает token:

```bash
<?php
function get_cloud_token($username,$apiKey) {
	$url="https://identity.api.rackspacecloud.com/v2.0/tokens";
	$post_string = '{"auth": { "RAX-KSKEY:apiKeyCredentials": { "username": "'.$username.'", "apiKey": "'.$apiKey.'" } } }';

	$curl_connection = curl_init($url);
	curl_setopt($curl_connection, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl_connection, CURLOPT_POSTFIELDS, $post_string);
	curl_setopt($curl_connection, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Accept: application/json'));
	$result = curl_exec($curl_connection);
	$data = json_decode($result);

    $token = $data->access->token->id;

    return $token;
}
?>
```


Полученый в результате первого запроса json так же содержит точки входа для разных сервисов:
  * cloudFilesCDN
  * cloudFiles
  * cloudBlockStorage
  * cloudImages
  * cloudQueues
  * cloudBigData
  * cloudOrchestration
  * cloudServersOpenStack
  * autoscale
  * cloudDatabases
  * cloudBackup
  * cloudNetworks
  * cloudMetrics
  * cloudLoadBalancers
  * cloudFeeds
  * cloudSites
  * cloudMonitoring
  * cloudDNS
  * cloudServers
  * rackCDN

Точка входа (endpoint) - это адрес сервера в зависимости от датацентра и сервиса, к которому нужно обратиться.

Следующая функция принимает в виде аргументов имя пользователя, api-ключь, датацентр и имя сервиса. Возвращает точку входа (endpoint) для других запросов:

```php
<?php
function get_endpoint($username,$apiKey,$datacenter,$service) {
	$url="https://identity.api.rackspacecloud.com/v2.0/tokens";
	$post_string = '{"auth": { "RAX-KSKEY:apiKeyCredentials": { "username": "'.$username.'", "apiKey": "'.$apiKey.'" } } }';

	$curl_connection = curl_init($url);
	curl_setopt($curl_connection, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl_connection, CURLOPT_POSTFIELDS, $post_string);
	curl_setopt($curl_connection, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Accept: application/json'));
	$result = curl_exec($curl_connection);
	$data = json_decode($result);

	foreach ($data->access->serviceCatalog as $service) {
		if ($service->name == $service) {
			foreach ($service->endpoints as $endpoint) {
				if ($endpoint->region == $datacenter) {
					$endpointURL =  $endpoint->publicURL;
				}
			}
		}
	}

    return $endpointURL;
}
?>
```


Всего есть 6 датацентров:
  * ORD - Chicago
  * DFW - Dallas/Ft. Worth
  * HKG - Hong Kong
  * LON - London
  * IAD - Northern Virginia
  * SYD - Sydney

Оригинальная документация:  
* [Retrieving the authentication token](http://docs.rackspace.com/files/api/v1/cf-devguide/content/Retrieving_Auth_Token.html)  
* [Service access endpoints](http://docs.rackspace.com/files/api/v1/cf-devguide/content/Service-Access-Endpoints-d1e003.html)
