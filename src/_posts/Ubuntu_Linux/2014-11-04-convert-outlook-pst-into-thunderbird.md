---
id: 757
title: Конвертируем Outlook pst в формат Thunderbird
date: 2014-11-04T08:47:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=757
permalink: /convert-outlook-pst-into-thunderbird/
image: /wp-content/uploads/2014/09/thinknook-new-logo3.png
categories:
  - Ubuntu Linux
tags:
  - pst в Thunderbird
---
Если Вы решились переехать с Windows на Linux и столкнулись с проблемой импорта почты с Outlook в Thunderbird, прошу читать дальше.

Следующий скрипт поможет импотрировать письма.  

<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Скрипт импорта
  </div>

  <div class="spoiler-body"> -->
```bash
###############################################################################################
######          This script will help to convert the Microsoft outlook PST file      ##########
######                    into Thunderbird/Evolution compatible format               ##########
######                         Script created by Srijan Kishore                      ##########
###############################################################################################
###############################################################################################
###############################################################################################   

#check user
if [ "$USER" = 'root' ]
    then
        echo "User check passed"
    else        gdialog --title "User Check" --msgbox "User is not Root. Please run the script as root user." 200 150
        echo "User is not Root. Please run the script as root user."
        exit 1
fi

#OS check
cat /etc/debian_version > /dev/null
if [ $? != 0 ]; then

gdialog --title "OS check" --msgbox "You are not using Debian/Ubuntu, Install readpst package from http://www.five-ten-sg.com/libpst/rn01re01.html" 200 150

else

readpst -V > /dev/null
          if [ $? != 0 ]; then

    apt-get update
    apt-get -y install readpst
    fi
fi

mkdir    ~/home/outlook

#File selection
readpst  -o  ~/home/outlook  -r  `zenity --file-selection`

find ~/home/outlook -type d | tac | grep -v '^~/home/outlook$' | xargs -d '\n' -I{} mv {} {}.sbd

find ~/home/outlook.sbd -name mbox -type f | xargs -d '\n' -I{} echo '"{}" "{}"' | sed -e 's/\.sbd\/mbox"$/"/' | xargs -L 1 mv


#Script Completion
find ~/home/outlook.sbd -empty -type d | xargs -d '\n' rmdir
gdialog --title "Pst Conversion complete" --msgbox "Your pst conversion is complete,just paste the folder ~/home/outlook.sbd in Local Folder in Thunderbird/Evolution and you can use the folders there" 200 150
```
<!-- </div> -->

Для запуска сделаем его исполняемым:
```bash
chmod +x script.sh
```

Теперь выполним от имени пользователя root:
```bash
sudo ./script.sh
```

<a href="http://www.howtoforge.com/convert_outlook_pst_files_to_thunderbird_and_evolution_on_linux">howtoforge.com</a>
