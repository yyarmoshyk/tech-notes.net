---
id: 773
title: Как запустить несколько версий Skype в Ubuntu
date: 2014-04-04T17:49:27+00:00
author: admin

guid: http://www.tech-notes.net/?p=773
permalink: /multiple-skypes-in-ubuntu/
image: /wp-content/uploads/2014/04/skype.png
categories:
  - Ubuntu Linux
tags:
  - skype
  - еще один скайп
  - несколько skype
  - несколько Skype в Ubuntu
---
В этой заметке хочу поведать как можно запустить несколько процессов Skype в Linux Ubuntu. У меня запущено 2 - рабочий и личный.

Для начала оговорюсь, что все launcherы находятся в папке `/usr/share/applications/`. Стандартный `запускатель` скайпа - `/usr/share/applications/skype.desktop`

По умолчанию Skype хранит свои файлы в папке `~/.Skype`.

Иконка - `/usr/share/icons/skype.png`

Итак, вооружившись этими знаниями, делаем возможность запуска второго скайпа в системе.

1. Создаем папку в домашнем каталоге:

```bash
mkdir ~/.Skype2
```

2. Создаем launcher:

```bash
nano /usr/share/applications/skype2.desktop
```

3. Вставляем в него вот такие строки:

```bash
[Desktop Entry]
Name=<strong>Additional Skype</strong>
Comment=Skype Internet Telephony
Exec=<strong>skype --dbpath=~/.Skype2</strong>
Icon=skype.png
Terminal=false
Type=Application
Encoding=UTF-8
Categories=Network;Application;
MimeType=x-scheme-handler/skype;
X-KDE-Protocols=skype
```

Обратите внимание на значения Name и Exec. Name - определяет имя иконки запуска в системном меню. Exec определяет команду запуска.

Если нужно временно запустить скайп из консоли, можно создать папку `~/.Skype_temp` и выполнить:

```bash
skype -dbpath=~/.Skype2_temp
```

4. Сохраняем файл и ищем иконку запуска в меню системы.
