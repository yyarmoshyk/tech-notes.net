---
id: 2344
title: 'Bash: Как посчитать количество вхождений символа в строке'
date: 2015-02-03T15:01:11+00:00
author: admin

guid: http://www.tech-notes.net/?p=2344
permalink: /bash-count-occurrences-of-char-in-string/
image: /wp-content/uploads/2014/02/bash_shell.jpg
categories:
  - bash
---
Для того что бы в bash скрипте посчитать количество вхождений символа (баквы, цифры, знака) в строке можно воспользоваться функционалом `grep` и `wc`:

```bash
grep -o `/` <<< $string |wc -l
```

В этом примере

  * $string - произвольная строка
  * `/` - разделитель

Очень удобно использовать этот `симбиоз`, если Вам нужно обработать список, который состоит из строк произвольной длинны, с однотипными разделителями. И вот нужно из такого списка вырезать одно-два слова.

Если в строке Вам нужно отсечь 5-ю `колонку` или каждое пятое поле после разделителя - очень просто это делается с помощью утилит `cut` или `awk`.

На пример, у нас есть вот такой набор строк, оюъеденных в список:

```bash
list=`'asd|fgh|jkl  
qwe|rty|uio  
zxc|vbn|nm<`'
```

Выводим второй элемент каждой строки:

```bash
for f in $list; do echo $f |awk -F`|` '{print $2}';done
```

или

```bash
for f in $list; do echo $f |cut -d `|` -f 2;done
```

В результате получаем:

```bash
fgh  
rty  
vbn
```

Все бы ничего, но что делать, если длинна строк разная и нужно вывести последний элемент кадой строки?

Для примера буду использовать вот такой список:

```bash
list=`'asd|fgh|jkl|123  
qwe|rty|uio|p[]|<?.|456  
zxc|vbn|789`'
```

Нужно получить цифры.

<center>
  <div id="gads">
  </div>
</center>

В таком случае есть тва трюка:  
1. С [помощью sed добавить](/sed-examples/) еще один разделитель в конец каждой строки и отрезать предпоследний элемент  
2. С [помощью bc добавить 1](/use-bc-in-bash-calculations/) к значению количества вхождений и отобразить этот эллемент.

**Первый вариант**:

```bash
for f in $list;
do
  echo $f |cut -d "|" -f $(echo $f |sed 's/$/\|/g' |grep -o "|" |wc -l)
done
```


В примере:  
`echo $f |sed 's/$/\|/g' |grep -o "|" |wc -l` - делает сразу все: добавляет `|` в конец строки и считает количество вхождений.

**Второй вариант**:

```bash
for f in $list;
do
  echo $f |cut -d "|" -f $(bc <<< $(grep -o "|" <<< $f |wc -l)+1);
done
```


В примере:
  * `grep -o "|" <<< $f |wc -l` - считает количество вхождений разделителя "|" в каждую из строк
  * `bc <<< $(grep ...)+1` - добавляет единицу
