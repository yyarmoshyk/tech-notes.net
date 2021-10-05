---
id: 853
title: 'Перенос контроллера домена ActiveDirectory  на новый сервер'
date: 2014-04-30T14:36:11+00:00
author: admin

guid: http://www.tech-notes.net/?p=853
permalink: /transfer-activedirectory-to-the-new-server/
image: /wp-content/uploads/2014/04/windows.active.directory.png
categories:
  - Active Directory
---
В этой статье хочу рассмотреть процесс переноса контролера домена ActiveDirectory c Windows 2003 на Windows Server 2008.

Перед началом работы рекомендуется ввести новый сервер в домен. Вообще это не принципиально, но будет на много удобнее.

Дальше необходимо удостовериться, что пользователь под которым мы будем все переносить состоит в следующих группах:

  * Enterprise admins
  * Schema Admins
  * Domain Admins

Дальше берем с установочного диска Windows 2008 папку support, находим в ней папку adprep и переходим в нее на исходнос сервере. При миграции с 2003 на 2008 нужно брать adprep с 2008-й винды.

Подготавливаем все к миграции:

```bash
adprep32.exe /forestprep
adprep32.exe /domainprep /gpprep
```

Если исходный сервер имеет операционку x64, тогда используем вот такие команды. Первая может выполняться довольно долго:

```bash
adprep.exe /forestprep
adprep.exe /domainprep /gpprep
```

[<img class="aligncenter size-full wp-image-871" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png" alt="Screenshot from 2014-04-24 10:45:50" width="681" height="78" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png 681w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550-300x34.png 300w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550-660x75.png 660w" sizes="(max-width: 681px) 100vw, 681px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png)

Так же рекомендуется выполнить вот такую команду. <span style="color: #2a2a2a;">Даже если вы и не собираетесь использовать в вашей сети контроллеры домена только для чтения (Read Only Domain Controller — RODC), она уберет ненужные сообщения об ошибках в журнале событий.</span>

```bash
adprep /rodcprep
```

С исходным севером все готово. Подключаемся к серверу №2 - тот на который переезжаем. Запускаем консоль от и выполняем:

```bash
dcpromo
```

Это открывает окно установки  AD. Жмем `Next`.

[<img class="aligncenter size-full wp-image-872" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png" alt="Screenshot from 2014-04-24 10:47:55" width="497" height="470" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png 497w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755-300x283.png 300w" sizes="(max-width: 497px) 100vw, 497px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png)

Я добавлял контроллер в уже существующий лес, поэтому выбрал соответствующий пункт.

[<img class="aligncenter size-full wp-image-873" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png" alt="Screenshot from 2014-04-24 10:48:22" width="501" height="473" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png 501w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822-300x283.png 300w" sizes="(max-width: 501px) 100vw, 501px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png)

Дальше установщик предложит имя домена и имя пользователя от которого устанавливается служба.

[<img class="aligncenter size-full wp-image-874" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png" alt="Screenshot from 2014-04-24 10:50:01" width="496" height="472" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png 496w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001-300x285.png 300w" sizes="(max-width: 496px) 100vw, 496px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png)

Дальше Вы получите возможность выбрать сайт в который должен быть добавлен контролер. Менеджер установки сам предложит это на основе ip адреса, в зависимости от того к какому из сайтов относится подсеть.

[<img class="aligncenter size-full wp-image-875" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png" alt="Screenshot from 2014-04-24 11:31:01" width="499" height="473" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png 499w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101-300x284.png 300w" sizes="(max-width: 499px) 100vw, 499px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png)

Дальше-Дальше-Дальше.

В принципе все очень логично понятно. Дожидаемся окончания работы мастера и перезагружаем новый контролер домена.

Осталось перенести роли `FSMO` на новый сервер. Для Этого нужно запустить консоль под названием `<b style="color: #444444;">Active Directory Schema</b>`. Для этого переходим в меню Пуск/Start и выбираем пункт Запуск/Run. В появившееся окно вводим mmc.exe и жмем `OK`.

В появившемся окне из меню File выбираем пункт Add/Remove Snap-In:

[<img class="aligncenter size-full wp-image-876" src="/wp-content/uploads/2014/04/scheme3a.png" alt="scheme3a" width="640" height="489" srcset="/wp-content/uploads/2014/04/scheme3a.png 640w, /wp-content/uploads/2014/04/scheme3a-300x229.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/scheme3a.png)

Из списка в левой колонке выбираем `Active Directory Schema` жмем кнопку `Add->` потом `OK`.

[<img class="aligncenter size-full wp-image-877" src="/wp-content/uploads/2014/04/mmc.png" alt="mmc" width="640" height="460" srcset="/wp-content/uploads/2014/04/mmc.png 640w, /wp-content/uploads/2014/04/mmc-300x215.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/mmc.png)

В результате таких телодвижений в левой колонке консоли появится элемент `Active Directory Schema`. Жмем правой кнопкой и выбираем `Change Active Directory Domain Controller`.

В появившемся окошке выбираем контролер домена на котором крутятся роли FSMO:

[<img class="aligncenter size-full wp-image-878" src="/wp-content/uploads/2014/04/schema2.png" alt="schema2" width="631" height="425" srcset="/wp-content/uploads/2014/04/schema2.png 631w, /wp-content/uploads/2014/04/schema2-300x202.png 300w" sizes="(max-width: 631px) 100vw, 631px" />](/wp-content/uploads/2014/04/schema2.png)

С выбором трудно ошибиться. Если Вы выберете КД который не управляет FSMO, получить вот такую ошибку:

[<img class="aligncenter size-full wp-image-879" src="/wp-content/uploads/2014/04/schema3.png" alt="schema3" width="400" height="160" srcset="/wp-content/uploads/2014/04/schema3.png 400w, /wp-content/uploads/2014/04/schema3-300x120.png 300w" sizes="(max-width: 400px) 100vw, 400px" />](/wp-content/uploads/2014/04/schema3.png)

Теперь мы подключены к главному держателю ролей. Жмем правой кнопкой на `Active Directory Schema` и выбираем пункт `Operations Master`:

[<img class="aligncenter size-full wp-image-880" src="/wp-content/uploads/2014/04/scheme4a.png" alt="scheme4a" width="640" height="491" srcset="/wp-content/uploads/2014/04/scheme4a.png 640w, /wp-content/uploads/2014/04/scheme4a-300x230.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/scheme4a.png)

В окошке выбираем куда перенести FSMO и жмем ОК.

Для переноса ролей RID, PDC и Infrastructure Master запускаем `Active Directory Users and Computers` (Пуск/Start->Панель Управления/Control Panel->Администрирование/Admin tools). Дальше по аналогии с предыдущим шагом подключаемся к исходному серверу. Правой кнопкой мыши жмем на `Active Directory Users and Computers` и выбираем пункт `Operations Master`. В появившемся окне переходим на нужную вкладку RID, PDC или Infrastructure и выбираем новый серсер для роли.

Для того, что бы перенести роль DNS нужно запустить консоль `Active Directory Domains and Trusts`. Дальше по аналогии с предыдущим шагом подключаемся к исходному серверу. Правой кнопкой мыши жмем на `Active Directory Domains and Trusts` и выбираем пункт `Operations Master`. В появившемся окне выбираем новый серсер для роли.

При написании статьи использовались следующие материалы:
* [support.microsoft.com](http://support.microsoft.com/kb/255690)
* [techunboxed.com](http://www.techunboxed.com/2012/07/how-to-transfer-fsmo-roles-in-windows.html)
