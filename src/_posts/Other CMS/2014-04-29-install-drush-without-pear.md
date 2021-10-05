---
id: 861
title: Устанавливаем Drush руками.
date: 2014-04-29T17:48:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=861
permalink: /install-drush-without-pear/
image: /wp-content/uploads/2014/04/drupal-logo-primary.jpg
categories:
  - Other CMS
tags:
  - Drupal
  - Drush
---
`Drush` - это cli для Drupal. В этой статье спешу поведать о том, как установить его без участия `pear`. В подробности таких телодвижений вдаваться не стану.

Как ни странно ничего компилить не нужно.

Переходим в домашний каталог пользователя, под которым обычно работаем на сервере и понеслась.

Делай раз:

```bash
wget http://ftp.drupal.org/files/projects/drush-7.x-5.8.tar.gz
```

Делай два:

```bash
tar xf drush-7.x-5.8.tar.gz 
```

Делай три:

```bash
chmod u+x drush/drush
```

Редактируем файл `~/.bashrc` вот такими строчками:

```bash
alias drush='~/drush/drush'
```


Дальше делаем незамысловато так:

```bash
source ~/.bashrc
```

Заходим в папку с друпалом и вуаля:

```bash
drush cc all
```
