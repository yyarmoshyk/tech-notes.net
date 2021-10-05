---
id: 1412
title: Делаем BackUp всех баз даных в MSSQL Server 2008
date: 2014-08-21T20:57:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=1412
permalink: /backup-all-dbs-mssql-server-2008/
image: /wp-content/uploads/2014/08/mssql_logo.jpg
categories:
  - Windows server
tags:
  - MSSQL Server
---
Бывает нужно сделать разовый бэкап всех баз данных (all databases) для того что бы их куда-то перенести или согнать в отдельном хранилище.

Для того что бы сделать бэкап всех баз данных нужно:  
1. Подключиться к Database Engine, воспользовавшись SQL Management Studio.  
2. Дальше разворачиваем `Management` в Object Explorer'e и находим `Maintenance Plans`.  
3. Жмем правой кнопкой мыши и выбираем пункт `New maintenance plan`

[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-163310.png" alt="Screenshot from 2014-08-21 16:33:10" width="356" height="301" class="aligncenter size-full wp-image-1413" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-163310.png 356w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-163310-170x143.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-163310-300x253.png 300w" sizes="(max-width: 356px) 100vw, 356px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-163310.png)

4. Даем ему произвольное название (типа `backup_all_dbs`).  
5. После этого у Вас должен появиться Toolbox сразу под Object Explorer'ом.  
6. Хватаем пункт `Backup Database Task` и тянем вправо  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026.png" alt="Screenshot from 2014-08-21 16:40:26" width="788" height="434" class="aligncenter size-full wp-image-1414" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026.png 788w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026-170x93.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026-300x165.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026-660x363.png 660w" sizes="(max-width: 788px) 100vw, 788px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164026.png)

7. Появился SubPlan с задачей бэкапа. Жмем правой кнопкой на нем и выбираем пункт в самом верху `Edit`[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164057.png" alt="Screenshot from 2014-08-21 16:40:57" width="287" height="429" class="aligncenter size-full wp-image-1415" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164057.png 287w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164057-113x170.png 113w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164057-200x300.png 200w" sizes="(max-width: 287px) 100vw, 287px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164057.png)

8. В выпадающем меню на против `Databases` можно выбрать что именно бэкапить. Для того чтобы сделать резервную копию всех баз за исключением системных - выберите пункт, отмеченный на скриншоте. Также можно выбрать руками какие базы Вам нужны:

[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164249.png" alt="Screenshot from 2014-08-21 16:42:49" width="577" height="238" class="aligncenter size-full wp-image-1416" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164249.png 577w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164249-170x70.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164249-300x123.png 300w" sizes="(max-width: 577px) 100vw, 577px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164249.png)

9. Немного ниже можно выбрать, куда именно сохранить файлы. Можно создать отдельные каталоги для каждой базы.  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164445.png" alt="Screenshot from 2014-08-21 16:44:45" width="586" height="148" class="aligncenter size-full wp-image-1417" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164445.png 586w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164445-170x42.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164445-300x75.png 300w" sizes="(max-width: 586px) 100vw, 586px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164445.png)

10. После того, как вы закончили свои дела, выбрали базы для бэкапа, хранилище жмем кнопку `OK` для сохранения и попадаем на предыдущий экран. Жмем кнопку `Save` (синяя дискета) вверху и наш план появляется в списке.

Уже сейчас можно нажать на нем правой кнопкой мышки и выбрать пункт `Execute` и он побежит-пошуршит:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164855.png" alt="Screenshot from 2014-08-21 16:48:55" width="341" height="329" class="aligncenter size-full wp-image-1418" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164855.png 341w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164855-170x164.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164855-300x289.png 300w" sizes="(max-width: 341px) 100vw, 341px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164855.png)

11. Если же Вам нужно выполнять этот кастомный бэкап периодически найдите в дизайнере иконку, похожую на календарик и нажмите на нее (последняя правая колонка) - появится окно, в котором можно настроить расписание для периодического выполнения.  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164953.png" alt="Screenshot from 2014-08-21 16:49:53" width="485" height="183" class="aligncenter size-full wp-image-1419" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164953.png 485w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164953-170x64.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164953-300x113.png 300w" sizes="(max-width: 485px) 100vw, 485px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-21-164953.png)
