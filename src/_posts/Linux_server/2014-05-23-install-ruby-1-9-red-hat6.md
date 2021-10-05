---
id: 933
title: 'Установка  Ruby 1.9.3 на RedHat 6'
date: 2014-05-23T15:44:41+00:00
author: admin

guid: http://www.tech-notes.net/?p=933
permalink: /install-ruby-1-9-red-hat6/
image: /wp-content/uploads/2014/05/rvm-logo-e1399477663405.png
categories:
  - Linux server
tags:
  - Ruby 1.9
  - ruby 1.9 Red Hat
  - rvm
---
Ruby 1.9 не доступно через yum в Red Hat Enterprise Linux 6 согласно сообщению на вот этой странице:  
[https://access.redhat.com/site/solutions/131923](https://access.redhat.com/site/solutions/131923)

Не надо печалиться. Рубиновый язык можно всунуть в красную шапочку используя rvm (Ruby Version Manager).  
Для начала нужно немного подготовиться:

```bash
yum -y install gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison iconv-devel
```

Дальше качаем стабильные релиз:

```bash
curl -L get.rvm.io | bash -s stable
```

Втягиваем переменные в рабочее окружение:

```bash
source /etc/profile.d/rvm.sh
```

Ставим Ruby:

```bash
rvm install 1.9.3
```

```bash
rvm gemset use global
```

Если у Вас до этого была установлена предыдущая версия (в репозиториях доступна `1.8.5`), тогда говорим какую использовать по умолчанию в системе:

```bash
rvm use 1.9.3 -default
```

В ответ должны получить:

```bash
Using /usr/local/rvm/gems/ruby-1.9.3-p545
```

Проверяем:

```bash
ruby -v
```

В ответ должны получить:

```bash
ruby 1.9.3p545 (2014-02-24 revision 45159) [x86_64-linux]
```

На этом все.
