---
id: 3402
title: Манипуляции с php-handlers в Plesk
date: 2016-08-30T11:58:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=3402
permalink: /manage-php-handlers-plesk/
image: /wp-content/uploads/2014/08/logo_para.jpg
categories:
  - Plesk
---
Просмотр списка php режимов из командной строки:

```bash
/usr/local/psa/admin/sbin/php_handlers_control -list
```

Из Mysql:

```sql
select * from psa.ServiceNodeEnvironment where section=&#8217;phphandlers&#8217;
```

Выбрать из базы режим php в соответсвии с доменом и каталогом сайта:

```sql
select h.php_handler_id,d.name, h.www_root from hosting h join domains d on h.dom_id = d.id
```

Другой вариант:

```bash
mysql -uadmin -p$(cat /etc/psa/.psa.shadow) psa -e "select dom_id,www_root,php_handler_id,php from hosting;" | while read HOSTING; do
  DOMAIN=$(echo ${HOSTING} | awk '{print $2}' | awk -F'/' '{print $5}');
  HANDLERID=$(echo ${HOSTING} | awk '{print $3}');
  PHPVERSION=$(/usr/local/psa/bin/php_handler --list | grep ${HANDLERID} | awk "{if (\$1 == \"${HANDLERID}\") {print \$3}}");
  echo "${DOMAIN} - ${HANDLERID} - ${PHPVERSION}";
done
```

Асайним handler домену:

```bash
/usr/local/psa/bin/domain -u **имя_домена** -php_handler_id plesk-php54-fpm
```

Добавить новый

```bash
/usr/local/psa/bin/php_handler --add -displayname <NN> -path <path to php cgi> -clipath <path to php-cli> -phpini <path to php.ini> -type <php handler> -id <NN-custom>
```

  * **displayname <NN>** is the PHP version name that will be shown in the Plesk interface. We recommend you to include the version number in the displayname. For example, you could name the version `5.6.3-custom`.
  * **path <path/to/php/cgi>** is the location of the PHP CGI binary file. You can find this in the output of the `make install`command in the `Installing PHP CGI binary` line. For example, if you see the following in the `Installing PHP CGI binary` line: /usr/local/php563-cgi/bin/, the location you need to specify is /usr/local/php563-cgi/bin/php-cgi. Learn more at the Official PHP web Site.
  * `clipath <path to php-cli>` is the location of the php file, for example, /usr/local/php563-cgi/bin/php
  * `phpini <path/to/php.ini>` is the location of the php.ini file, for example, /usr/local/php563-cgi/etc/php.ini .
  * *type <php handler>* is the type of PHP handler associated with this version. It can be either &#8216;cgi&#8217; or &#8216;fastcgi&#8217;.
  * *id <NN-custom>* is the identifier you will use when referring to this PHP version (for example, when adjusting or removing it).

Пример:

```bash
/usr/local/psa/bin/php_handler -add -displayname php-5.6.3 -path /usr/local/php563-cgi/bin/php-cgi -clipath /usr/local/php563-cgi/bin/php -phpini /usr/local/php563-cgi/etc/php.ini -type fastcgi -id 2
```

Перечитать handlerы:

```bash
/usr/local/psa/admin/sbin/php_handlers_control -reread
```

Источники:
  * <a href="https://kb.plesk.com/en/116801" target="_blank">https://kb.plesk.com/en/116801</a>
  * <a href="https://kb.plesk.com/en/118378" target="_blank">https://kb.plesk.com/en/118378</a>
  * <a href="http://www.howdididothat.info/2015/08/27/plesk-12-list-all-domains-php-handler-ids-and-php-versions/#comment-100873" target="_blank">http://www.howdididothat.info/2015/08/27/plesk-12-list-all-domains-php-handler-ids-and-php-versions/#comment-100873</a>
