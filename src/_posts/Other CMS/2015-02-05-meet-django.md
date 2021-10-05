---
id: 2352
title: Знакомство с Django
date: 2015-02-05T16:16:39+00:00
author: admin

guid: http://www.tech-notes.net/?p=2352
permalink: /meet-django/
image: /wp-content/uploads/2015/02/python-django.png
categories:
  - Other CMS
tags:
  - Django
---
`Django` - это web фрэймвор написанный на `Python`, который предоставляет базовый набор компонентов для создания сайта. В этой статье речь пойдет именно о нем. Я рассмотрю настройку сервера, установку Django и создание первого сайта с импользованием этого фрэймворка.

Рассматривать буду на примере Centos 6.5.

### 1. Python

Для начала убедимся, что на сервере установена последняя версия python:

```bash
python -version
```

Последней версией на сегодняшний день является 3.4.2. Для установки последней верси python воспользуйтесь статьей  
[Установка последней верисии Python на Centos 6.5](/install-python-centos6-5/)`

### 2. [Устанавливаем PostgreSQL 9.4](http://www.tech-notes.net/postgresql-9-4-on-centos-6-5/)

Учтите, что в нашем случае мы использует pip3.4 для установки драйвера для Python:

```bash
pip3.4 install psycopg2
```

### 3. Устанавливаем Django и Создаем первый вэбсайт:

Выполните следующую команду для установки Django:

```bash
pip3.4 install django
```

Создаем сайт:

```bash
python3.4 /usr/local/bin/django-admin.py startproject website
```

Правим настройки:

```bash
nano website/website/settings.py
```

Находим секцию DATABASES и правим ее соответсвующим образом:

```bash
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME':'djangodb',
    'USER': 'djangodbuser',
      'PASSWORD': 'myPassword',
      'HOST': 'localhost',                      
      'PORT': '',
  }
}
```


После этого выполняем:

```bash
python3.4 website/manage.py migrate
```

Если вы работаете в изолированнй среде - в процессе выполнения оно спросит о создании суперпользователя для `django` (не root). Лучше создать.

По окончанию запускаем минисервер:

```bash
python3.4 website/manage.py runserver
```

В результате получаем:

```bash
Performing system checks ...

System check identified no issues (0 silenced).  
February 05, 2015 - 09:45:27  
Django version 1.7.4, using settings 'website.settings'  
Starting development server at http://127.0.0.1:8000/  
Quit the server with CONTROL-C.
```

Это означает, что минисервер запустился на порту 8000 и доступен только на 127.0.0.1.

### 4. [Настраиваем Apache](http://www.tech-notes.net/configure-apache-for-python-3-4-centos-6-5/)

Теперь попробуйте натравить браузер на ip адресс Вашего сервера. Должны увидеть стартовую страницу пустого Django:  
[<img src="/wp-content/uploads/2015/02/Screenshot-from-2015-02-05-110211.png" alt="Screenshot from 2015-02-05 11:02:11" width="921" height="207" class="aligncenter size-full wp-image-2359" srcset="/wp-content/uploads/2015/02/Screenshot-from-2015-02-05-110211.png 921w, /wp-content/uploads/2015/02/Screenshot-from-2015-02-05-110211-170x38.png 170w, /wp-content/uploads/2015/02/Screenshot-from-2015-02-05-110211-300x67.png 300w" sizes="(max-width: 921px) 100vw, 921px" />](/wp-content/uploads/2015/02/Screenshot-from-2015-02-05-110211.png)

Полезным будет сайт с шаблонами:  
<a href="http://mezzanine.jupo.org/" target="_blank">http://mezzanine.jupo.org/</a>

Список использованной литературы:  
<a href="http://techarena51.com/index.php/install-django-1-7-on-linux/" target="_blank">techarena51.com</a>  
<a href="http://www.cyberciti.biz/faq/howto-add-postgresql-user-account/" target="_blank">cyberciti.biz</a>  
<a href="https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/modwsgi/" target="_blank">docs.djangoproject.com</a>  
<a href="http://thecodeship.com/deployment/deploy-django-apache-virtualenv-and-mod_wsgi/" target="_blank">thecodeship.com</a>
