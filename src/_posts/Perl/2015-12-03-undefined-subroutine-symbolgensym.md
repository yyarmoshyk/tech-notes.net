---
id: 2994
title: 'Undefined subroutine &#038;Symbol::gensym'
date: 2015-12-03T16:44:00+00:00
author: admin

guid: http://www.tech-notes.net/?p=2994
permalink: /undefined-subroutine-symbolgensym/
image: /wp-content/uploads/2015/04/perl_logo.jpg
categories:
  - Perl
---
Сегодня получил следующую ошибку при попытке установки Perl модуля `Apache2::Reload` через `cpan`:

```bash
Undefined subroutine &Symbol::gensym called at Makefile.PL line 91.
```

Модуля ``Symbol::gensym`` не существует. Результаты поиска в Google ничего не дали.

Оставлю заметку на будущее - может кому пригодится. Потом посмотрю в статистике посещений.

Выполните в консоли `cpan` следующую команду и будет Вам счастье:

```bash
install ModPerl:MM
```

Кстати, оно автоматически установит `Apache2::Reload`:  
[<img src="/wp-content/uploads/2015/12/Screenshot-from-2015-12-03-114721.png" alt="Screenshot from 2015-12-03 11:47:21" width="568" height="310" class="aligncenter size-full wp-image-2996" srcset="/wp-content/uploads/2015/12/Screenshot-from-2015-12-03-114721.png 568w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-03-114721-170x93.png 170w, /wp-content/uploads/2015/12/Screenshot-from-2015-12-03-114721-300x164.png 300w" sizes="(max-width: 568px) 100vw, 568px" />](/wp-content/uploads/2015/12/Screenshot-from-2015-12-03-114721.png)
