---
id: 1049
title: Переименование пользователя AD и изменение домашней папки PowerShell
date: 2014-06-11T14:29:40+00:00
author: admin

guid: http://www.tech-notes.net/?p=1049
permalink: /rename-user-in-active-directory/
image: /wp-content/uploads/2014/04/windows.active.directory.png
categories:
  - Active Directory
tags:
  - FromHabrSandbox
---
Задача была сделать следующее:  
Было: Имя: Иван Иванович; Фамилия: Иванов  
Надо: Имя: Иван; Фамилия: Иванов; Отчество: Иван. (4 первых символа отчества + `.`)  
А так же за одно, необходимо создать каждому пользователю домашнюю папку и дать ему туда полные права.

Для решения первой задачи в итоге написан следующий скрипт:

```bash
Import-Module ActiveDirectory
#Получаем в переменную $Users пользователей для которых необходимо провести модификацию
$Users = Get-ADUser -Filter * -Server tul-dc01.pol.corp.kuzholding.ru -SearchBase "OU=users,"DC=corp,DC=domen,DC=ru"
foreach ($User in $Users) {
	# Складываем каждый необходимый параметр в переменную
	$UserName = $User.GivenName
	$UserSAM = $User.sAMAccountName
	$UserSurn = $User.Surname
	#Если существует в имени пробел
	if ($UserName.Contains(" ")){
		#Удалить то что после пробела и поместить в $GUserName
		$GUserName = $UserName -replace " \D*"
		#Поместить в $IUserName 4 символа после пробела и поставить точку.
		$IUserName = ($UserName -replace "\D* ").Substring(0,4) + "."
		#Изменить имя, фамилию и инициалы
		Set-ADUser -Server dc01.corp.domen.ru -Identity $UserSAM -GivenName $GUserName -Initials $IUserName -DisplayName $UserSurn" "$GUserName
		#Переименовать объект AD
		Rename-ADObject -Server dc01.corp.domen.ru -Identity $User -NewName $UserSurn' '$GUserName
  }
}
```


Добавляем домашнюю папку следующим скриптом:

```bash
Import-Module ActiveDirectory
#Указываем общий сетевой ресурс
$Dir = "\\file.corp.domen.ru\common\"
#Получаем в переменную $Users пользователей для которых необходимо провести модификацию
$Users = Get-ADUser -Filter * -SearchBase "OU=users,"DC=corp,DC=domen,DC=ru" -Server dc01.corp.domen.ru
#Указываем имя домена
$Domen = "corp\"
foreach ($User in $Users) {
			# Складываем каждый необходимый параметр в переменную
			$User = $User.sAMAccountName
			#Создаем директорию с именем пользователя
			$Path = New-Item -ItemType Directory -Path $Dir -Name $User
			#Устанавливаем права на папку
			$ACL = Get-Acl $Path
			$Settings = "$Domen$User","Modify, Synchronize, FullControl", "ContainerInherit, ObjectInherit", "None", "Allow"
			$AccessRule = new-object System.Security.AccessControl.FileSystemAccessRule $Settings
			$ACL.SetAccessRule($AccessRule)
			Set-Acl -Path $Path -AclObject $ACL
			#Применяем все изменения на пользователей
			Set-ADUser -Identity $User -HomeDrive "M:" -HomeDirectory "$Path" -Server dc01.corp.domen.ru
}
```


<a href="http://habrahabr.ru/sandbox/83385/" target="_blank">Оригинал статьи</a>

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->

  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>
