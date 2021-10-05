---
id: 487
title: Как заставить работать Search Engine Friendly (SEF) URLs в Joomla! на Nginx
date: 2014-03-24T13:57:57+00:00
author: admin

guid: http://www.tech-notes.net/?p=487
permalink: /enabling-search-engine-friendly-sef-urls-on-nginx-joomla/
image: /wp-content/uploads/2014/02/joomla-logo-vert-color.png
categories:
  - Joomla
  - Nginx
tags:
  - joomla
  - Ngnx
  - Search engine friendly в Joomla
  - SEF
---
`Search engine friendly` (SEF) URLs - это ссылки на статьи Вашего сайта в удобной для глаза форме. Они хотя бы частично раскрывают суть конечного поста на Вашем сайте. Если эта опция включена, тогда все ссылки на Ваши посты/статьи из абракадабры превращаются в линки на html страницы.

Для того что бы это заработало в `Joomla` на сервере с `Nginx`, нужно добавить вот такие строки в конфигурационный файл Вашего сайта и перезапустить Nginx для того, что бы изменения вступили в силу:  
```bash
location / {
	try_files $uri $uri/ /index.php?q=$request_uri;
}
```

Дальше логинимся в админку, переходим в раздел `Global Configuration` и ставим галочку возле `Search Engine Friendly URLs`

Опционально можно включить опцию `Add suffix to URLs` и сменить суффикс, который будет добавляться к ссылкам. По умолчанию значение суффикса - `.html`.

Если у Вас нету доступа в админку - эти параметры можно выставить в файле configuration.php или временно [сбросить пароль админа](http://www.tech-notes.net/%d0%ba%d0%b0%d0%ba-%d1%81%d0%be%d0%b7%d0%b4%d0%b0%d1%82%d1%8c-%d0%b0%d0%b4%d0%bc%d0%b8%d0%bd-%d0%bf%d0%be%d0%bb%d1%8c%d0%b7%d0%be%d0%b2%d0%b0%d1%82%d0%b5%d0%bb%d1%8f-%d0%b2-joomla-%d1%81-%d0%bf%d0%be/ "Как создать админ пользователя в Joomla с помощью mysql").

[Enabling Search Engine Friendly (SEF) URLs on Nginx - Joomla! Documentation](http://docs.joomla.org/Enabling_Search_Engine_Friendly_(SEF)_URLs_on_Nginx).
