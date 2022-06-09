---
id: 604
title: Скрипт PowerShell для импорта в лес Active Directory и создания файла с пользователями
date: 2014-02-27T13:44:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=604
permalink: /powershell-import-script-for-active-directory/
image: /wp-content/uploads/2014/02/powershell_logo.png
categories:
  - Active Directory
tags:
  - FromHabrSandbox
  - powershell
---
Сегодня хабрапользователь `посланец Гая Светония Транквилла` хотел бы с Вами поделиться скриптом для импорта пользователей в Active Directory. Его начальник сказал, что пора поднимать домен, а так же добавить в него около 2000 пользователей. Домен до этого он делал, но вот с импортом пользователей пришлось повозиться, так как делал это впервые. В данном посте он хотел бы рассказать как он это реализовывал

Сначала установил и настроил WS 2012R2 как DC и после этого встал вопрос как добавлять пользователей в него. Список сотрудников у него был в xls файле и тогда он решил, чтобы не забивать пользователей вручную, оптимизировать это с помощью PowerShell.

В интернете много примеров, но они мало чем подходили для его решения, некоторые были кусками кода, другие вовсе не работали с WS2012R2, а третьи добавляли пользователей в определенные каталоги, а ему необходимо было раскидать пользователей в более чем 70 каталогов. Так же встала задача как сделать CSV — файл для PowerShell в соответствии с его стандартами.

[<img class="aligncenter size-full wp-image-605" alt="Screenshot from 2014-02-27 08:34:15" src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-083415.png" width="974" height="98" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-083415.png 974w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-27-083415-300x30.png 300w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-27-083415-660x66.png 660w" sizes="(max-width: 974px) 100vw, 974px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-27-083415.png)

В первую очередь необходимо разделить ФИО на разные столбцы и оказалось, что в MS Excel 2013 есть достаточно интересный инструмент для этого под названием «Текст по столбцам» который находится во вкладке ДАННЫЕ.

После этого был принят формат логинов для пользователей и было принято решение, что это будут первые буквы от имени и отчества и после нижнего подчеркивания полностью фамилия (например: aa_petrov). Для этого пришлось транслитерировать их с помощью VB-скрипта.

Скрипт транслит - скрипта для Excel\`я:

```bash
Function Translit(Txt As String) As String

  Dim Rus As Variant
  Rus = Array("а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", _
  "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", _
  "щ", "ъ", "ы", "ь", "э", "ю", "я", "А", "Б", "В", "Г", "Д", "Е", _
  "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", _
  "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь", "Э", "Ю", "Я")

  Dim Eng As Variant
  Eng = Array("a", "b", "v", "g", "d", "e", "jo", "zh", "z", "i", "j", _
  "k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "f", "h", "c", "ch", _
  "sh", "sch", "", "y", "", "e", "yu", "ya", "A", "B", "V", "G", "D", _
  "E", "Jo", "Zh", "Z", "I", "J", "K", "L", "M", "N", "O", "P", "R", _
  "S", "T", "U", "F", "H", "C", "Ch", "Sh", "Sch", "", "Y", "", "E", "Yu", "Ya")

  For I = 1 To Len(Txt)
    с = Mid(Txt, I, 1)

    flag = 0
    For J = 0 To 65
      If Rus(J) = с Then
        outchr = Eng(J)
        flag = 1
        Exit For
      End If
    Next J
    If flag Then outstr = outstr & outchr Else outstr = outstr & с
  Next I

  Translit = outstr

End Function
```

А также добавлена функция для генерации данных логинов:
`=СТРОЧН(ЛЕВСИМВ(Translit(ЛЕВСИМВ(D2)))&ЛЕВСИМВ(Translit(ЛЕВСИМВ(E2)))&"_"&Translit(C2))`

Пароли были сгенерированны с помощью фразы и набора случайных символов:
`="trololo"&СЛУЧМЕЖДУ(1000;9999)`

После этого сохранил файл в .csv с 6 заголовками Login; Password; LastName; FirstName; MiddleName; OU; JobTitle и изменил кодировку файла в Unicode, так как с ANSI часто бывают проблемы.

Затем написал следующий скрипт PS:

```powershell
Import-Module ActiveDirectory
$Users = Import-Csv -Delimiter ";" -Path "C:\Users\Администратор\Desktop\user.csv"
$allou = Get-ADOrganizationalUnit -Filter * -SearchBase "OU=Forest,DC=habr,DC=ru"
foreach ($User in $Users)  
{
  $ou = $allou | Where {$_.Name -eq $User.OU}

  if ($ou) {
    $OU = $ou.DistinguishedName
  }
  else {
    $OU = "OU=Others,DC=habr,DC=ru"  &lt;#Если каталог с таким именем не найден отправляем в OU other#>
  }

  $Password = $User.Password
  $Detailedname = $User.LastName + " " + $User.FirstName + " " + $User.MiddleName
  $UserFirstname = $User.FirstName
  $UserLastName = $User.LastName
  $JobTitle = $User.JobTitle
  $SAM= $User.Login + "@habr.ru"
  New-ADUser -Name $Detailedname -SamAccountName $User.Login -UserPrincipalName $SAM -DisplayName $Detailedname -GivenName $User.FirstName -Surname  $User.LastName -Title $JobTitle  -AccountPassword  (ConvertTo-SecureString -AsPlainText "H@brHabr" -Force) -Enabled $true -Path $OU
}
```

Данный скрипт позволяет раскидать пользователей по своим каталогам, а тех у кого их нет отправить в каталог Other.

Большое спасибо хабрапользователю `посланец Гая Светония Транквилла` (сменю на ссылку к профилю, если получит инвайт).

<a href="http://habrahabr.ru/sandbox/79235/" target="_blank">Оригинал статьи</a>
