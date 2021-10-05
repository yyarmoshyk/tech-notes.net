---
id: 100
title: Несколько SSL (https) сайтов на одном ip адресе с использиванием технологии SNI
date: 2014-01-27T21:47:24+00:00
author: admin

guid: http://wp38.local/?p=100
permalink: /ssl-https-name-vhosts-sni/
lazy_seo_meta_key:
  - ssl
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Apache
tags:
  - SSL
  - SNI
---
При использовании схемы `Каждому сайту - отдельный ip адрес` таких проблем не возникает. Но что же делать в мире с ограниченным количеством ip адресов если нету возможности купить один сертификат для всех своих сайтов?

При использовании именованных виртуальных хостов (NameVirtualHosts) при безопасном (SSL/HTTPS) соединении проблемой является то, что вэб сервер не не может знать какому сайту адресовано соединение до тех пор, пока оно не установлено. По умолчанию ВэбСервер принимает защищенное соединение используя информацию из первого в списке виртуального хоста (обычно это `default`). После этого он (вэб-сервер) получает информацию и может отправить пакет куда нужно. Да вот незадача - с большой вероятностью он уже предоставил неверный сертификат и клиент увидел уведомление о том, что соединение не безопасно (не совпадает имя сайта с информацией из сертификата).

Решением стало расширение протокола SSL, которое назвали Server Name Indication (SNI). Оно позволяет клиенту добавить имя запрашиваемого сайта в первое сообщение процедуры рукопожатия (ssl handshake). Именно эта информация позволяет серверу определить для какого сайта предназначено соединение и подсунуть его сертификат клиенту.

К сожалению старые версии серверного ПО и браузеров не поддерживают SNI.  
Поддержка SNI включена в Apache начиная с версии 2.2.12 и OpenSSL v0.9.8j. Часто сталкиваюсь с проблемой версий на RedHat linux v.5. Обычно в системе установлен Apache v.2.2.0. Можно на свой страх и риск найти rpm пакет для CentOS и установить его. Либо скачиваем исходники с официального сайта и компили ручками. То же самое касается и OpenSSL.

Касательно браузеров, то и здесь не без урода. Угадаете кто не поддерживает SNI? InternetExplorer 6 и InternetExplorer 7 под управлением Windows XP. Остальные браузеры успешно обновляются.

Просто для сводки, браузеры, которые поддерживают SNI:

  * Internet Explorer моложе 7
  * Firefox моложе v.2
  * Opera 8 с включенной поддержкой TLS 1.1
  * Google Chrome 6 + Windows XP
  * Google Chrome на всем, что новее WinXP.
  * Chrome Version 5.0.342.0 на OS X 10.5.7
  * Safari 2.1 and later OS X 10.5.6 and later или Windows Vista and later

Мобильные браузеры, поддерживающие SNI:

  * Mobile Safari for iOS 4.0
  * Android 3.0 (Honeycomb)
  * Windows Phone 7

Пример двух сайтов в конфиге Apache:

```bash
<NameVirtualHost *:443>

 <VirtualHost *:443>  
 ServerName www.yoursite.com  
 DocumentRoot /var/www/site  
 SSLEngine on  
 SSLCertificateFile /path/to/www_yoursite_com.crt  
 SSLCertificateKeyFile /path/to/www_yoursite_com.key  
 SSLCertificateChainFile /path/to/DigiCertCA.crt  
 </VirtualHost>

 <VirtualHost *:443>  
 ServerName www.yoursite2.com  
 DocumentRoot /var/www/site2  
 SSLEngine on  
 SSLCertificateFile /path/to/www_yoursite2_com.crt  
 SSLCertificateKeyFile /path/to/www_yoursite2_com.key  
 SSLCertificateChainFile /path/to/DigiCertCA.crt  
 </VirtualHost>
```

По материалам:  
* [digicert.com](http://www.digicert.com/ssl-support/apache-secure-multiple-sites-sni.htm)
* [wiki.apache.org](http://wiki.apache.org/httpd/NameBasedSSLVHostsWithSNI)
* [Wikipedia](http://en.wikipedia.org/wiki/Server_Name_Indication)
