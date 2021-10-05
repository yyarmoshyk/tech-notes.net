---
id: 926
title: Установка Apache Passenger для Ruby
date: 2014-05-07T14:27:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=926
permalink: /install-apache-passenger-ruby-centos/
image: /wp-content/uploads/2014/05/ruby-logo.jpg
categories:
  - Apache
tags:
  - Ruby
  - Apache Passenger
---
Небольшая заметка о том, как установить `Apache passenger` на `CentOS` для работы с `Ruby`. Полагаю, что следующие пакеты у Вас установлены:
  * ruby-mysql
  * rubygems
  * ruby-libs
  * ruby-irb
  * ruby

Ruby Passenger ставится вот так:  
```bash
gem install passenger --version 3.0.12
```

Опционально версию можно убрать.Тогда установится последняя доступная версия пакета.

Если у Вас не установлены `devel` пакеты, `gem` установщик выплюнет вот такую ошибку:
```bash
mkmf.rb can\'t find header files for ruby at /usr/lib/ruby/ruby.h
```

Выполняем:  
```bash
yum -y install gcc mysql-devel ruby-devel
```

Возвращаемся на шаг назад.

Для установки модуля Apache выполним вот такую команду:  
```bash
passenger-install-apache2-module
```

В самом начале он проверяет присутствуют ли в системе нужные библиотеки. В результате получаете вот такое сообщение:  
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png" alt="Screenshot from 2014-05-07 10:11:29" width="700" height="339" class="aligncenter size-full wp-image-927" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png 700w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129-300x145.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129-660x319.png 660w" sizes="(max-width: 700px) 100vw, 700px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png)

Жмем `Enter` и получаем предполагаемые фиксы:  
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png" alt="Screenshot from 2014-05-07 10:11:42" width="729" height="418" class="aligncenter size-full wp-image-928" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png 729w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142-300x172.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142-660x378.png 660w" sizes="(max-width: 729px) 100vw, 729px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png)

Ставим недостающие пакеты:  
```bash
yum -y install gcc-c++ curl-devel zlib-devel httpd-devel apr-devel apr-util-devel
```

Снова запускаем:  
```bash
passenger-install-apache2-module
```

В концу получаем вот такое сообщение:  
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png" alt="Screenshot from 2014-05-07 10:15:03" width="973" height="262" class="aligncenter size-full wp-image-929" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png 973w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503-300x80.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503-660x177.png 660w" sizes="(max-width: 973px) 100vw, 973px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png)

Теперь создаем файл `/etc/httpd/conf.d/ruby-passenger.conf` со следующим содержанием (имя файла можно выбрать на свое усмотрение) :  
```bash
LoadModule passenger_module /usr/lib/ruby/gems/1.8/gems/passenger-3.0.12/ext/apache2/mod_passenger.so
PassengerRoot /usr/lib/ruby/gems/1.8/gems/passenger-3.0.12
PassengerRuby /usr/bin/ruby
```
