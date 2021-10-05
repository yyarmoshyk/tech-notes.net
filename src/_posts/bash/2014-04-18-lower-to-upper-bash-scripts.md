---
id: 753
title: Делаем заглавной первую букву каждой строки в выводе Bash скрипта
date: 2014-04-18T13:09:33+00:00
author: admin

guid: http://www.tech-notes.net/?p=753
permalink: /lower-to-upper-bash-scripts/
image: /wp-content/uploads/2014/02/bash_shell.jpg
categories:
  - bash
---
В этой заметке хочу рассмотреть варианты вывода списков в bash с изменением первой буквы/символа на заглавную.

Буду использовать пример вывода установленных версий Postfix и Dovecot в CentOS:

### Пример №1: Циклы for.

В этом примере создается новая переменная $newf, которая состоит из 2-х частей. В первой части с помощью утилиты tr меняется отрезок с 0-го символа по первый с нижнего регистра на верхний.

```bash
for f in $(rpm -qa |grep "dovecot\|postfix" |sed 's/-/\ v\./g' |awk '{print $1"_"$2}');
do
	newf=$(tr '[:lower:]' '[:upper:]' <<< ${f:0:1})${f:1};
	echo $newf |sed 's/_v/ v/g';
done
```


Немного видоизмененный:

```bash
for f in $(rpm -qa |grep "dovecot\|postfix");
do
	tf=$(echo $f |sed 's/-/\ v\./g' |awk '{print $1" "$2}')
	newf=$(tr '[:lower:]' '[:upper:]' <<< ${tf:0:1})${tf:1};
	echo $newf |sed 's/_v/ v/g';
done
```


<center>
  <div id="gads">
  </div>
</center>

### Пример №2: Цикл while.

Та же логика что и в первом примере, только цикл другой.

```bash
while read -r line;
do
	f=$(printf '%s\n' "$line");
	newf=$(tr '[:lower:]' '[:upper:]' <<< ${f:0:1})${f:1}; echo $newf;
done <<< "$(rpm -qa |grep "dovecot\|postfix" |sed 's/-/\ v\./g'|awk '{print $1" "$2}')"
```
