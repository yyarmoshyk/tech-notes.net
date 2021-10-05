---
id: 1641
title: Perl Dancer + mysql + memcached
date: 2014-11-17T20:12:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=1641
permalink: /perl-dancer-mysql-memcached/
image: /wp-content/uploads/2014/09/Perl-Dancer-logo.jpg
categories:
  - Perl
tags:
  - FromHabrSandbox
  - Perl Dancer
---
Наверняка, подавляющее большинство программистов на Perl слышали о замечательном микро-фрэймворке Perl Dancer. Но использовали ли они его дальше, чем просто сгенерить проект, написать роут с 'Hello world' и запустить его?

А, тем временем, этот вэб-фреймворк вполне функционален и быстр. Сессии, база данных, кэширование, отправка почты, маршруты, макет и шаблоны — что еще надо для того, чтобы быстро запустить небольшой проект?  
Итак, создать новый, почти пустой, проект просто:

```bash
dancer -a AppName
```

После чего появится каталог ./AppName с нашим приложением, которое можно запустить так:

```bash
cd AppName  
bin/app.pl
```

После чего наше приложение будет доступно по http://0.0.0.0:3000  
В заголовок поста я вынес не только сам Dancer, но и MySQL с Memcached. Так давайте попробуем подружить их.  
Подключение к базе данных у нас будет в конфигурационном файлу ./config.yml в разделе Plugins — Database:

```perl
plugins:
  Database:
    driver: 'mysql'
    database: 'basename'
    host: 'localhost'
    port: 3306
    username: 'user'
    password: 'userPassword'
```


Тут же, и настройка подключения к memcached:

```perl
Memcached:
    servers:
      - "127.0.0.1:11211"
    default_timeout: 10
```


Определить, где будут храниться cookie можно тоже тут:

```perl
session: "cookie"
session_cookie_key: "m5M7gM3rH4BFOd782fPo3iiom33W77P5ytE1zHqJijG3GqxL"
```


<center>
  <div id="gads">
  </div>
</center>

Итак, теперь мы можем использовать все это добро у нас в приложении:

```perl
package App;
use Dancer ':syntax';
use Dancer::Plugin::Database;
use Dancer::Plugin::Memcached;

get '/' => sub {
  my $m_root = memcached_get('page-root');
  unless ($m_root) {
    my $data;
    my $m_data = memcached_get('root-page-select');
    unless ($m_data) {
      $data = database->quick_select('table', { col => 'variable' }, { limit => 20 });
    } else {
      $data = $m_data;
    }
    # код
    memcached_store 'root-page', \@rootPage;
  } else {
    @rootPage = @{$m_root};
  }
  template 'templateName', { var => \@rootPage };
};
```


Как-то вот так. В данном куске кода я привел два случая кэширования — целиком всех переменных для передачи их шаблонизатору и кэширование только запроса. Выбирайте то, что вам нужно в конкретной ситуации.

Кстати, с Dancer'ом я использую шаблонизатор TemplateToolkit, но после того, как попробовал Sinatra/Haml — стал относиться к нему совсем иначе.
