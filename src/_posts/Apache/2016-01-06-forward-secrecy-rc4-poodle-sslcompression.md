---
id: 2810
title: Затыкаем слабые места в настройках SSL Apache
date: 2016-01-06T13:48:54+00:00
author: admin

guid: http://www.tech-notes.net/?p=2810
permalink: /forward-secrecy-rc4-poodle-sslcompression/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Apache
tags:
  - SSL
  - Forward Secrecy
  - Poodle
  - RC4
  - SSLCompression
---
В протоколе SSL, который позволяет обмениваться шифрованным трафиком между сервером и клиентом, периодически находят слабые места. Собственно предполагается, что злоумышленники могут тем или иным образом дешифровать ssl трафик. Паниковать не стоит, но тем не менее лучше не рисковать.

Эту статью я обновляю по мере появления новых уязвиимостей.

Дальше речь пойдет о том, что и куда нужно вписать, что бы защитить сервер.

Для начала предлагаю воспользоваться утилитой [SslTest от SslLabs](https://www.ssllabs.com/ssltest) и проверить на сколько Ваш сервер подвержен уязвимостям.

На первом проходе я получил следующую картину:  
[<img src="/wp-content/uploads/2015/08/before_ssl_update.png" alt="before_ssl_update" width="916" height="643" class="aligncenter size-full wp-image-2811" srcset="/wp-content/uploads/2015/08/before_ssl_update.png 916w, /wp-content/uploads/2015/08/before_ssl_update-170x119.png 170w, /wp-content/uploads/2015/08/before_ssl_update-300x211.png 300w" sizes="(max-width: 916px) 100vw, 916px" />](/wp-content/uploads/2015/08/before_ssl_update.png)

Дальше открываем файл с настройками openssl для Apache и начинаем его редактировать:

```bash
vim /etc/httpd/conf.d/ssl.conf
```

## Poodle
Уязвимость **Poodle** устраняется отключением поддержки протокола шифрования SSL v.3. С недавнего времени уязвимым считается все, кроме TLSv1.1 и TLSv1.2:

```bash
SSLProtocol -ALL +TLSv1.1 +TLSv1.2
```

## Forward Secrecy
Поддержка **Forward Secrecy** включается приоритизированием шифра `kEDH`. Шифр '**RC4**' уже сто лет считается дырой, и его нужно выключать. Также не рекомендуется использование `Diffie-Hellman`:

```bash
SSLHonorCipherOrder on  
SSLCipherSuite kEDH:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:EECDH+ECDSA+AESGCM:EECDH+aRSA+AESGCM:EECDH+ECDSA+SHA384:EECDH+ECDSA+SHA256:EECDH+aRSA+SHA384:EECDH+aRSA+SHA256:EECDH+AESGCM:EECDH:EDH+AESGCM:EDH+aRSA:HIGH:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!DHE-RSA-SEED-SHA:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA:!DH+3DES:!DHE-RSA-AES256-GCM-SHA384:!DHE-RSA-AES256-SHA256:!DHE-RSA-AES256-SHA:!DHE-RSA-CAMELLIA256-SHA:!DHE-RSA-DES-CBC3-SHA:!DHE-RSA-AES128-GCM-SHA256:!DHE-RSA-AES128-SHA256:!DHE-RSA-AES128-SHA:!DHE-RSA-CAMELLIA128-SHA:!RC4
```

## CRIME: Attack SSL/TLS  
Признаться честно, я слабо представляю как работает сжатие ssl данных, но считается, что злоумышленник может внедрить вредоносный код в пакет до сжатия и отправки клиенту. Именно поэтому сжатие данных нужно отключать. На современных осях это делается следующей строчкой в конфиге:

```bash
SSLCompression off
```
Если же у Вас установлен `apache 2.2` и `OpenSSL` какой-то бородатой версии, тогда вы увидите следующую ошибку при перезапуске apache:

```bash
Invalid command 'SSLCompression', perhaps misspelled or defined by a module not included in the server configuration
```
В Linux системах семейства RedHat нужно отредактировать `/etc/sysconfig/httpd` файл следующими строками:

```bash
export OPENSSL_NO_DEFAULT_ZLIB=1
```

Теперь можно перезапускать apache и возвращаться в [SslTest от SslLabs](https://www.ssllabs.com/ssltest)

```bash
service httpd restart
```

При повторном выполнении теста Вы должны увидеть красивую зеленку:  
[<img src="/wp-content/uploads/2015/08/after_ssl_update.png" alt="after_ssl_update" width="899" height="510" class="aligncenter size-full wp-image-2812" srcset="/wp-content/uploads/2015/08/after_ssl_update.png 899w, /wp-content/uploads/2015/08/after_ssl_update-170x96.png 170w, /wp-content/uploads/2015/08/after_ssl_update-300x170.png 300w" sizes="(max-width: 899px) 100vw, 899px" />](/wp-content/uploads/2015/08/after_ssl_update.png)

Упоминания по теме:  
* [ivoras.net/perfect-forward-secrecy-pfs.html](http://ivoras.net/blog/tree/2013-10-21.apache-2.2-and-perfect-forward-secrecy-pfs.html)
* [serverfault.com/disable-sslcompression-on-apache](http://serverfault.com/questions/455450/how-to-disable-sslcompression-on-apache-httpd-2-2-15-defense-against-crime-bea)
