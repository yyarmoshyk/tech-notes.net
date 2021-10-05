---
id: 2602
title: Настройки fail2ban в Plesk
date: 2015-05-22T12:26:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=2602
permalink: /configure-fail2ban-in-plesk/
image: /wp-content/uploads/2014/02/sp-logo-plesk.png
categories:
  - Plesk
tags:
  - fail2ban
---
Plesk предоставляет возможность крутить настройки всего, что есть на сервере, ну или практически всего.

Настройки `fail2ban` находятся в Plesk на странице `Tools & Settings`. Нужно выбрать пункт ``IP Address Banning (Fail2Ban)``

[<img class="aligncenter size-full wp-image-2601" src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111201.png" alt="Screenshot from 2015-05-15 11:12:01" width="393" height="292" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111201.png 393w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111201-170x126.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111201-300x223.png 300w" sizes="(max-width: 393px) 100vw, 393px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111201.png)

На вкладке `jails` можно увидеть что там активировано в конфиге:  
[<img class="aligncenter size-full wp-image-2600" src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111208.png" alt="Screenshot from 2015-05-15 11:12:08" width="670" height="262" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111208.png 670w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111208-170x66.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111208-300x117.png 300w" sizes="(max-width: 670px) 100vw, 670px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111208.png)

SSH Jail так и называется:  
[<img class="aligncenter size-full wp-image-2598" src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111230.png" alt="Screenshot from 2015-05-15 11:12:30" width="913" height="42" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111230.png 913w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111230-170x8.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111230-300x14.png 300w" sizes="(max-width: 913px) 100vw, 913px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111230.png)

Что бы изменть настройки выберите пункт `Change settings`  
[<img class="aligncenter size-full wp-image-2597" src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111239.png" alt="Screenshot from 2015-05-15 11:12:39" width="902" height="381" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111239.png 902w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111239-170x72.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111239-300x127.png 300w" sizes="(max-width: 902px) 100vw, 902px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111239.png)

Можно подредактировать настройки:  
[<img class="aligncenter size-full wp-image-2596" src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111251.png" alt="Screenshot from 2015-05-15 11:12:51" width="800" height="315" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111251.png 800w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111251-170x67.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111251-300x118.png 300w" sizes="(max-width: 800px) 100vw, 800px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-15-111251.png)

Для более точной настройки можно опираться на <a href="http://www.tech-notes.net/fail2ban-configuration/" title="Настройка Fail2Ban" target="_blank">соответсвующую статью.</a>
