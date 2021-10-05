---
id: 564
title: Настройка Nginx + perl-fcgi
date: 2016-02-12T02:00:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=564
permalink: /configure-nginx-perl-fcgi/
image: /wp-content/uploads/2014/02/nginx1-660x378.gif
categories:
  - Nginx
tags:
  - perl nginx
---
Nginx все очень хвалят за его производительность. Но никто не учитывает тот факт, что он так шустро работает из-за отсутствия всех тех модулей, которые расширяют функционал Apache. Для Nginx нельзя установить модуль обработки perl или python файлов через обычный установщик пакетов.

Nginx больше всего похож на универсальный фронт-энд.

В этой статье я хочу рассмотреть пример того, как можно настроить Nginx на работу с perl скриптами.

Все мои записки строились на базе Linux Ubuntu. Если вы используете CentOS, RedHat или OpenSuse, то принципиальных различий не встретите, кроме названий пакетов и местонахождения конфигурационных файлов. Если у Вас возникнут трудности — обращайтесь через форму обратной связи.

Итак, для начала нужно установить FCGI библиотеки для Perl.

```bash
apt-get install libfcgi-perl
```

Дальше качаем wraper и скрипт для его запуска:

```bash
wget http://nginxlibrary.com/downloads/perl-fcgi/fastcgi-wrapper -O /usr/bin/fastcgi-wrapper.pl  
wget http://nginxlibrary.com/downloads/perl-fcgi/perl-fcgi -O /etc/init.d/perl-fcgi
```

Если ссылки не работают можете воспользоваться вот этими:

```bash
wget http://tech-notes.tk/wp-content/uploads/2014/02/fastcgi-wrapper -O /usr/bin/fastcgi-wrapper.pl  
wget http://tech-notes.tk/wp-content/uploads/2014/02/perl-fcgi -O /etc/init.d/perl-fcgi
```

Выставляем правильные права доступа на файлы (делаем их исполняемыми):

```bash
chmod +x /usr/bin/fastcgi-wrapper.pl  
chmod +x /etc/init.d/perl-fcgi
```

`Init.d` скрипт нужно немного подредактировать:
  * поменять su - на sudo -u
  * убрать -c из строки выполнения

Для этого выполните следующуую команду в bash^

```bash
sed -i -e 's/su\ -/sudo\ -u/g' -e '/sudo/s/-c\ //g' /etc/init.d/perl-fcgi
```

Ставим на загрузку и запускаем перловый сервер:

```bash
update-rc.d perl-fcgi defaults  
/etc/init.d/perl-fcgi start
```

По умолчанию сервер perl-fcgi запустится на 8999 порту. Конечно это лучше проверить:

```bash
netstat -anp |grep -i perl
```

Дальше нужно научить Nginx проксировать запросы в perl. Добавляем вот такие строки в файл с конфигурацией виртуального хоста Nginx.

```bash
location ~ \.pl$ {
  try_files $uri =404;
  gzip off;
  fastcgi_pass  127.0.0.1:8999;
  fastcgi_index index.pl;
  fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
  include fastcgi_params;
}
```


<center>
  <div id="gads">
  </div>
</center>

Теперь наш Nginx умеет работать с perl.  
Можно выполнить проверку конфигурации nginx и перезапустить его, чтобы изменения вступили в силу:

```bash
nginx -t  
/etc/init.d/nginx restart
```

Для проверки можно созддать файл info.pl в корневом каталоге сайта и открыть этот скрипт в браузере.  


<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    info.pl
  </div>

  <div class="spoiler-body">
    </p>

<pre>
#!/usr/bin/perl
# test.cgi by Bill Weinman [http://bw.org/]
# Copyright 1995-2008 The BearHeart Group, LLC
# Free Software: Use and distribution under the same terms as perl.

use strict;
use warnings;
use CGI;

print foreach (
    "Content-Type: text/plain\n\n",
    "BW Test version 5.0\n",
    "Copyright 1995-2008 The BearHeart Group, LLC\n\n",
    "Versions:\n=================\n",
    "perl: $]\n",
    "CGI: $CGI::VERSION\n"
);

my $q = CGI::Vars();
print "\nCGI Values:\n=================\n";
foreach my $k ( sort keys %$q ) {
    print "$k [$q->{$k}]\n";
}

print "\nEnvironment Variables:\n=================\n";
foreach my $k ( sort keys %ENV ) {
    print "$k [$ENV{$k}]\n";
}

</pre>
</div> </div>
