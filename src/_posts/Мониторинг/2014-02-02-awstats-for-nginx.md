---
id: 273
title: Настройка Awstats для Nginx
date: 2014-02-02T18:24:08+00:00
author: admin

guid: /?p=273
permalink: /awstats-for-nginx/
image: /wp-content/uploads/2014/02/awstats_logo1.png
categories:
  - мониторинг
tags:
  - Nginx
  - awstats
---
В этой статье я хочу рассмотреть пример того, как можно заставить Awstats работать корректно с лог файлами сервера Nginx.

Все мои записки строились на базе Linux Ubuntu. Если вы используете CentOS, RedHat или OpenSuse, то принципиальных различий не встретите, кроме названий пакетов и местонахождения конфигурационных файлов.

Итак, для начала нужно установить Awstats и [настроить nginx на работу с perl](/configure-nginx-perl-fcgi/).

```bash
apt-get install awstats
```

Дальше нужно добавить вот такие строки в файл с конфигурацией виртуального хоста Nginx.
```bash
location /awstats/ {
  root   /usr/lib/cgi-bin;
  index  index.html index.htm index.pl;
}
location /awstatsclasses/ {
  alias /usr/share/awstats/lib/;
}
location /awstats-icon/ {
  alias /usr/share/awstats/icon/;
}
location /awstatscss {
  alias /usr/share/doc/awstats/examples/css/;
}
```

Дальше натравим awstats на логи nginx. Приступаем к настройке парсера:  
```bash
cp /etc/awstats/awstats.conf /etc/awstats/awstats.my_cool_site.com.conf
```

Если у Вас на одном сервере находится больше одного сайта, тогда лучше создавать для них отдельные конфигурационные файлы. Дальше приступаем к редактированию ново созданного файла:  
```bash
/etc/awstats/awstats.my_cool_site.com.conf
```

Откройте его в Вашем любимом редакторе, затем найдите и отредактируйте следующие значения согласно конфигурации сервера:  
```bash
LogFile="/var/log/nginx/site_access.log" #path to logfile;
LogFormat=1 #for full statistics;
SiteDomain="my_cool_site.com" #domainname;
HostAliases="www.my_cool_site.com my_cool_site.org" #site aliases
```

Следующим шагом является создание задачи в crontab для регулярного парсинга лог файлов. Естественно хорошо было бы выполнять ее с правами суперпользователя (root) :  
```bash
*/20 * * * * /usr/lib/cgi-bin/awstats.pl -config=my_cool_site.com -update > /dev/null
```

Теперь лог файл с информацией о доступе к сайту будет парсится каждые **20** минут. Можно увеличить интервал, но в таком случае для парсинга потребуется больше времени и ресурсов. Awstats имеет свое хранилище метаданных, куда он сохраняет информацию об обработанных логах. То есть на каждой проходке парсер продолжает обработку с того места, где закончил в прошлый раз.

Для получения статистики через web, ссылка будет выглядеть вот так:
http://**my_cool_site.com**/awstats/awstats.pl?config=**my_cool_site.com**

Настоятельно рекомендую прикрыть страницу статиcтики какой-нибудь логин формой. Для этого возвращаемся к конфигурационному файлу Nginx, в который вносились строки, необходимые для работы Awstats и приводим секцию `location /awstats/` к следующему виду:

```bash
location /awstats/ {
  auth_basic            "Restricted";
  auth_basic_user_file  /etc/nginx/auth/htpasswd;
    root   /usr/lib/cgi-bin;
    index  index.html index.htm index.pl;
}
```

Создаем папку /etc/nginx/auth/ и генерируем файл htpasswd:  
```bash
mkdir /etc/nginx/auth/
htpasswd -cmb /etc/nginx/auth/htpasswd username password
```

На всякий случай делаем проверку конфигуции `Nginx` и перезапускаем его.

Переходим по адресу и смотрим статистику. :
http://**my_cool_site.com**/awstats/awstats.pl?config=**my_cool_site.com**

Учтите, пожалуйста, что формат в котором Ваш Nginx пишет логи может отличаться от того в котором писал мой. В том случае если статистика будет пустой, Вам придется вернуться на этап редактирования файла:  
`/etc/awstats/awstats.**my_cool_site.com**.conf`

И поиграться со значение LogType ну либо подогнать формат логов Вашего Nginx под формат в котором пишет логи Apache
