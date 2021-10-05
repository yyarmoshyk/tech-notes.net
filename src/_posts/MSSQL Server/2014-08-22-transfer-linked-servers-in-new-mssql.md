---
id: 1427
title: Подключение Linked Серверов в новом MSSQL
date: 2014-08-22T19:08:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=1427
permalink: /transfer-linked-servers-in-new-mssql/
image: /wp-content/uploads/2014/08/mssql_logo-240x180.gif
categories:
  - MSSQL Server
---
Настраивал второй MSSQL сервер для клиента и столкнулся с проблемой настройки Linked Servers на нем. На первом сервере имелось два линкованых инстанса MSSQL. Для подключения использовалась учетная запись 'sa'.

В принцы пе нету ничего сложного в том, что бы вывести инфу об этих серверах в окно запроса. Смотри скриншот:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430.png" alt="Screenshot from 2014-08-22 14:44:30" width="670" height="215" class="aligncenter size-full wp-image-1428" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430.png 670w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430-170x54.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430-300x96.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430-660x211.png 660w" sizes="(max-width: 670px) 100vw, 670px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-144430.png)

Думаю последовательность действий в Management Studio понятна и нету необходимости расписывать все по шагам.

Основная падлянка кроется в том, что пароли пользователей буду представлены в виде '######', о чем свидетельствует вот такое сообщение в самом верху окна запроса:

```sql
/* For security reasons the linked server remote logins password is changed with ######## */
```

И действительно строка с пользователем выглядит вот так:

```sql
EXEC master.dbo.sp_addlinkedsrvlogin @rmtsrvname=N'_mssqlserver.net_',@useself=N'False',@locallogin=NULL,@rmtuser=N'sa',@rmtpassword='**########**'
```

Для того что бы раздобыть пароли, воспользуемся вот [этим Powershell скриптом](https://github.com/NetSPI/Powershell-Modules/blob/master/Get-MSSQLLinkPasswords.psm1)

Как вариант можно скачать готовый файл [тут](/wp-content/uploads/2014/08/Get-MSSQLLinkPasswords.psm1_.zip)

**Не закрываем SQL Management Studio.**

Заливаем файл на первый сервер. (распаковываем, если нужно).

Запускаем PowerShell с правами администратора  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145711.png" alt="Screenshot from 2014-08-22 14:57:11" width="386" height="440" class="aligncenter size-full wp-image-1430" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145711.png 386w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145711-149x170.png 149w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145711-263x300.png 263w" sizes="(max-width: 386px) 100vw, 386px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145711.png)

В консоли вводим:

```sql
Set-executionpolicy unrestricted
```

Получаем бяку в ответ:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814.png" alt="Screenshot from 2014-08-22 14:58:14" width="795" height="88" class="aligncenter size-full wp-image-1431" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814.png 795w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814-170x18.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814-300x33.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814-660x73.png 660w" sizes="(max-width: 795px) 100vw, 795px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-22-145814.png)

Жмем `Enter` глядя ей в глаза.

Дальше импортируем загруженный скрипт:

```sql
import-module C:\Get-MSSQLLinkPasswords.psm1
```

Выполняем функцию:

```sql
Get-MSSQLLinkPasswords
```

В ответ получаем табличку с линкованными серверами, пользователями и паролями.

Возвращаемся в SQL Management Studio, копируем содержимое окна `Query Editor`. Подключаемся ко второму серверу с помощью Management Studio. Выбрав второй сервер, создаем новое окно запроса и вставляем в него содержимое содержимое из буфера обмена.

Находим строку похожую на эту:

```sql
EXEC master.dbo.sp_addlinkedsrvlogin @rmtsrvname=N'_mssqlserver.net_',@useself=N'False',@locallogin=NULL,@rmtuser=N'sa',@rmtpassword='**########**'
```

Меняем **########** на пароль нужного пользователя. Жмем `Execute`.

Датам: новый сервер появится в списке.
