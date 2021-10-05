---
id: 26
title: Обход вопросов безопасности WHM/cPanel
date: 2013-09-25T20:38:19+00:00
author: admin

guid: http://wp38.local/?p=26
permalink: /bypass-whm-cpanel-security-questions/
attitude_sidebarlayout:
  - default
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2013/09/Screenshot-from-2013-09-25-163448.png
categories:
  - Control Panels
  - WHM/cPanel
tags:
  - cpanel
  - WHM
---
[<img class="size-medium wp-image-27 aligncenter" alt="Screenshot from 2013-09-25 16:34:48" src="/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-163448-300x240.png" width="300" height="240" srcset="/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-163448-300x240.png 300w, /wp-content/uploads/2013/09/Screenshot-from-2013-09-25-163448.png 470w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2013/09/Screenshot-from-2013-09-25-163448.png)

Иногда бывает, что есть ssh/shell доступ к серверу на котором установлена WHM/cPanel но в саму панель вход прегражден подобным окошком с четырьмя вопросами. Нужно обойти вопросы безопасности WHM.

Для того чтобы это безобразие не лицезреть, можно добавить свой ip адрес в следующий файл:  
`/var/cpanel/userhomes/cpanel/.cpanel/securitypolicy/iplist/root`

При обновлении страницы вопросы уберутся.
