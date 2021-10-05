---
id: 947
title: Uptime в мониторинге Cacti
date: 2014-05-13T08:10:22+00:00
author: admin

guid: http://www.tech-notes.net/?p=947
permalink: /check-servers-uptime-in-cacti/
image: /wp-content/uploads/2014/05/images-1.jpg
categories:
  - мониторинг
tags:
  - FromHabrSandbox
  - cacti
  - uptime
---
Cacti хоть и получает `SNMP-Uptime` от устройств, но вот выводит его только в странице самого устройства, а когда таких устройств хотя бы больше 100, открывать страницу каждого становится неудобно. Надо свести их в единую таблицу.

Получить `uptime` сервера с помощью `snmpwalk` можно следующим образом:

```bash
snmpget -v2c -c public localhost 1.3.6.1.2.1.1.3.0
```

или таким:

```bash
snmpget -v2c -c public **localhost** sysUpTime.0
```

**localhost** нужно поменять на ip адрес интересующего сервера.

Для `Cacti` нам понадобится плагин [monitor_uptime](http://forums.cacti.net/viewtopic.php?t=13510).

Код плагина написан на PHP, потому особых сложностей в редактировании не представляет. Для получения данных с оборудования были использованы стандартные PHP функции `snmpget` и `snmp2_get`, которым в качество аргументов передаются параметры хоста из БД Cacti, OID аптайма и таймаут ожидания. В итоге код получения аптайма вышел такой:

```php
$snmp_uptime = " N\A";
include("../../include/config.php");
mysql_connect($database_hostname,$database_username,$database_password) OR DIE(mysql_error());
mysql_select_db($database_default) OR DIE(mysql_error());
$sql="SELECT * FROM `host` where `id`=$id";
$sql_res=mysql_query($sql) OR DIE(mysql_error());
while ($host=mysql_fetch_array($sql_res)){
	if ($host["snmp_version"] == '1'){
		$snmp_uptime = snmpget($host["hostname"],$host["snmp_community"],".1.3.6.1.2.1.1.3.0",55000);
  }
	else if ($host["snmp_version"] == '2'){
		$snmp_uptime =snmp2_get($host["hostname"],$host["snmp_community"],".1.3.6.1.2.1.1.3.0",55000);
  }
$str=strpos($snmp_uptime, ")");
$snmp_uptime = substr($snmp_uptime,$str+1);}
```


Также в саму таблицу добавим строку

```html
<tr bgcolor='#eeeeee'>
  <td><strong>Uptime:</strong></td>
  <td><strong>$snmp_uptime</strong></td>
</tr><
```


После этого сохраняем, открываем Cacti и да здравствует uptime в реальном времени и удобном отображении

[<img src="/wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d.jpg" alt="81ec955bcd6245128a7fadcbbaae881d" width="938" height="613" class="aligncenter size-full wp-image-948" srcset="/wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d.jpg 938w, /wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d-170x111.jpg 170w, /wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d-300x196.jpg 300w, /wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d-660x431.jpg 660w" sizes="(max-width: 938px) 100vw, 938px" />](/wp-content/uploads/2014/05/81ec955bcd6245128a7fadcbbaae881d.jpg)

[оригинал](http://habrahabr.ru/sandbox/82399/)
