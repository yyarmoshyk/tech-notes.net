---
id: 602
title: Установка Apache mod_evasive.
date: 2016-02-29T09:09:38+00:00
author: admin

guid: http://www.tech-notes.net/?p=602
permalink: /apache-mod_evasive/
image: /wp-content/uploads/2016/02/images.jpg
categories:
  - Apache
---
`Mod_evasive`, ранее известный как `mod_dosevasive`, помогает защититься от атак `DoS`, `DDoS` (распределенный отказ в обслуживании), и атак типа `brute force` на веб-сервере `Apache`. Это может обеспечить отвлекающее действие во время атаки и сообщать о атаке по электронной почте. Модуль работает путем создания встроенной динамической таблицы IP-адресов и URI, а также блокировку IP-адреса из в случае выполнения следующих действий:
  * Запрашивающая ту же страницу больше, чем несколько раз в секунду
  * Создание более 50 одновременных запросов на того же ребенка в секунду
  * Внесение каких-либо запросов в то время как временно занесен в черный список

Для установки в среде RHEL/CentOS воспользуйтесь yum:

```bash
yum install mod_evasive
```
Для установки в среде Debian/Ubuntu воспользуйтесь apt:

```bash
apt-get install libapache2-mod-evasive
```

Конфигурационный файл (mod_evasive.conf) находится в папке web сервера, на пример:

```bash
/etc/httpd/conf.d/mod_evasive.conf
```
Выглядит следующим образом:

```bash
<ifmodule mod_evasive20.c>
  DOSHashTableSize 3097
  DOSPageCount 5
  DOSSiteCount 50
  DOSPageInterval 1
  DOSSiteInterval 1
  DOSBlockingPeriod 90
  DOSLogDir /var/log/apache2/mod_evasive
  DOSWhitelist 127.0.0.1
</ifmodule>
```


Немного поянений:
  * **DOSHashTableSize** - размер хэш таблыцы, который указывает максимальное количество нод для каждой дочерней таблицы. Увеличение этого значения приведет к приросту производительности, поскольку уменьшится количество итераций для поиска нужной записи, но при этом увеличится выделение памяти.
  * **DOSPageCount** - максимально допустимое количество запросов к одной странице с одного ip за заданый промежуток времени.
  * **DOSPageInterval** - интервал времени для DOSPageCount. По умолчанию 1 секунда.
  * **DOSSiteCount** - максимально допустимое количество запросов к сайту с одного ip за заданый промежуток времени.
  * **DOSSiteInterval**- интервал времени для DOSSiteCount. По умолчанию 1 секунда.
  * **DOSBlockingPeriod** - время, на которое блокируется атакующий ip.
  * **DOSEmailNotify** - куда слать уведомления.
  * **DOSLogDir** - куда писать логи
  * **DOSWhitelist** - список исключенных ip адресов.

Для проверки воспользуемся скриптом, который предоставляется с исходниками:
```perl
#!/usr/bin/perl
# test.pl: small script to test mod_dosevasive's effectiveness  
use IO::Socket; use strict;  
for(0..100) {
  my($response);
  my($SOCKET) = new IO::Socket::INET( Proto ="tcp", PeerAddr=> "127.0.0.1:80");
  if (! defined $SOCKET) {
    die $!;
  }
  print $SOCKET "GET /?$_ HTTP/1.0\n\n";
  $response = <$SOCKET>;
  print $response;
  close($SOCKET);
}
```
