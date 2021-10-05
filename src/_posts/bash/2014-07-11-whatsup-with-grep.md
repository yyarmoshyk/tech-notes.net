---
id: 1200
title: Что такое grep и с чем его едят
date: 2014-07-11T18:44:17+00:00
author: admin

guid: http://www.tech-notes.net/?p=1200
permalink: /whatsup-with-grep/
image: /wp-content/uploads/2014/07/grep.gif
categories:
  - bash
tags:
  - FromHabrSandbox
---
Намедни хабраюзер [simpleadmin](http://habrahabr.ru/users/simpleadmin/) выложил довольно полезную заметку про `grep`. Дальше от автора:

Поэтому… Лето… Пятница… Немного поговорим о grep.

Зная местную публику и дабы не возникало излишних инсинуаций сообщаю, что всё нижеизложенное справедливо для

```bash
# grep -version | grep grep  
grep (GNU grep) 2.5.1-FreeBSD
```

Это важно в связи с

```bash
# man grep | grep -iB 2 freebsd  
  -P, -perl-regexp Interpret PATTERN as a Perl regular expression. This option is not supported in FreeBSD.
```

Для начала о том как мы обычно grep'аем файлы.  
Используя cat:

```bash
root@nm3:/ # cat /var/run/dmesg.boot | grep CPU:  
CPU: Intel(R) Core(TM)2 Quad CPU Q9550 @ 2.83GHz (2833.07-MHz K8-class CPU)
```

Но зачем? Ведь можно и так:

```bash
root@nm3:/ # grep CPU: /var/run/dmesg.boot  
CPU: Intel(R) Core(TM)2 Quad CPU Q9550 @ 2.83GHz (2833.07-MHz K8-class CPU)
```

Или вот так (ненавижу такую конструкцию):

```bash
root@nm3:/ # </var/run/dmesg.boot grep CPU: CPU: Intel(R) Core(TM)2 Quad CPU Q9550 @ 2.83GHz (2833.07-MHz K8-class CPU)
```

Зачем-то считаем отобранные строки с помощью wc:

```bash
root@nm3:/ # grep WARNING /var/run/dmesg.boot | wc -l  
3
```

Хотя можно:

```bash
root@nm3:/ # grep WARNING /var/run/dmesg.boot -c  
3
```

Сделаем тестовый файлик:  
```text
one two three
seven eight one eight three
thirteen fourteen fifteen
sixteen seventeen eighteen seven
sixteen seventeen eighteen
twenty seven
one 504 one
one 503 one
one 504 one
one 504 one
#comment UP
twentyseven
#comment down
twenty1
twenty3
twenty5
twenty7
```

И приступим к поискам:
Опция -w позволяет искать по слову целиком:


```bash
root@nm3:/ # grep -w 'seven' test.txt
seven eight one eight three
sixteen seventeen eighteen seven
twenty seven
```
А если нужно по началу или концу слова?

```bash
root@nm3:/ # grep 'seven\>' test.txt
seven eight one eight three
sixteen seventeen eighteen seven
twenty seven
twentyseven
```
Стоящие в начале или конце строки?


```bash
root@nm3:/ # grep '^seven' test.txt
seven eight one eight three
root@nm3:/ # grep 'seven$' test.txt
sixteen seventeen eighteen seven
twenty seven
twentyseven
```
Хотите увидеть строки в в окрестности искомой?

```bash
root@nm3:/ # grep -C 1 twentyseven test.txt
#comment UP
twentyseven
#comment down
```

Только снизу или сверху?
```bash
root@nm3:/ # grep -A 1 twentyseven test.txt
twentyseven
#comment down
```
```bash
root@nm3:/ # grep -B 1 twentyseven test.txt
#comment UP
twentyseven
```
А ещё мы умеем так


```bash
root@nm3:/ # grep `twenty[1-4]` test.txt
twenty1
twenty3
```
И наоборот исключая эти


```bash
root@nm3:/ # grep `twenty[^1-4]` test.txt
twenty seven
twentyseven
twenty5
twenty7
```
Разумеется grep поддерживает и прочие базовые квантификаторы, метасимволы и другие прелести регулярок
Пару практических примеров:


```bash
root@nm3:/ # cat /etc/resolv.conf
#options edns0
#nameserver 127.0.0.1
nameserver 8.8.8.8
nameserver 77.88.8.8
nameserver 8.8.4.4
```
Отбираем только строки с ip:


```bash
root@nm3:/ # grep -E `[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}` /etc/resolv.conf
#nameserver 127.0.0.1
nameserver 8.8.8.8
nameserver 77.88.8.8
nameserver 8.8.4.4
```
Работает, но так симпатичнее:


```bash
root@nm3:/ # grep -E '\b[0-9]{1,3}(\.[0-9]{1,3}){3}\b' /etc/resolv.conf
#nameserver 127.0.0.1
nameserver 8.8.8.8
nameserver 77.88.8.8
nameserver 8.8.4.4
```
Уберём строку с комментарием?


```bash
root@nm3:/ # grep -E '\b[0-9]{1,3}(\.[0-9]{1,3}){3}\b' /etc/resolv.conf | grep -v #
nameserver 8.8.8.8
nameserver 77.88.8.8
nameserver 8.8.4.4
```
А теперь выберем только сами ip


```bash
root@nm3:/ # grep -oE '\b[0-9]{1,3}(\.[0-9]{1,3}){3}\b' /etc/resolv.conf | grep -v #
127.0.0.1
8.8.8.8
77.88.8.8
8.8.4.4
```
Вот незадача… Закомментированная строка вернулась. Это связано с особенностью обработки шаблонов. Как быть? Вот так:


```bash
root@nm3:/ # grep -v # /etc/resolv.conf | grep -oE '\b[0-9]{1,3}(\.[0-9]{1,3}){3}\b'
8.8.8.8
77.88.8.8
8.8.4.4
```
Здесь остановимся на инвертировании поиска ключом -v
Допустим нам нужно выполнить «ps -afx | grep ttyv»


```bash
root@nm3:/ # ps -afx | grep ttyv
1269 v1 Is+ 0:00.00 /usr/libexec/getty Pc ttyv1
1270 v2 Is+ 0:00.00 /usr/libexec/getty Pc ttyv2
1271 v3 Is+ 0:00.00 /usr/libexec/getty Pc ttyv3
1272 v4 Is+ 0:00.00 /usr/libexec/getty Pc ttyv4
1273 v5 Is+ 0:00.00 /usr/libexec/getty Pc ttyv5
1274 v6 Is+ 0:00.00 /usr/libexec/getty Pc ttyv6
1275 v7 Is+ 0:00.00 /usr/libexec/getty Pc ttyv7
48798 2 S+ 0:00.00 grep ttyv
```
Всё бы ничего, но строка «48798 2 S+ 0:00.00 grep ttyv» нам не нужна. Используем -v


```bash
root@nm3:/ # ps -afx | grep ttyv | grep -v grep
1269 v1 Is+ 0:00.00 /usr/libexec/getty Pc ttyv1
1270 v2 Is+ 0:00.00 /usr/libexec/getty Pc ttyv2
1271 v3 Is+ 0:00.00 /usr/libexec/getty Pc ttyv3
1272 v4 Is+ 0:00.00 /usr/libexec/getty Pc ttyv4
1273 v5 Is+ 0:00.00 /usr/libexec/getty Pc ttyv5
1274 v6 Is+ 0:00.00 /usr/libexec/getty Pc ttyv6
1275 v7 Is+ 0:00.00 /usr/libexec/getty Pc ttyv7
```
Некрасивая конструкция? Потрюкачим немного:


```bash
root@nm3:/ # ps -afx | grep `[t]tyv`
1269 v1 Is+ 0:00.00 /usr/libexec/getty Pc ttyv1
1270 v2 Is+ 0:00.00 /usr/libexec/getty Pc ttyv2
1271 v3 Is+ 0:00.00 /usr/libexec/getty Pc ttyv3
1272 v4 Is+ 0:00.00 /usr/libexec/getty Pc ttyv4
1273 v5 Is+ 0:00.00 /usr/libexec/getty Pc ttyv5
1274 v6 Is+ 0:00.00 /usr/libexec/getty Pc ttyv6
1275 v7 Is+ 0:00.00 /usr/libexec/getty Pc ttyv7
```
Также не забываем про | (ИЛИ)


```bash
root@nm3:/ # vmstat -z | grep -E `(sock|ITEM)`
ITEM SIZE LIMIT USED FREE REQ FAIL SLEEP
socket: 696, 130295, 30, 65, 43764, 0, 0
```
ну и тоже самое, иначе:


```bash
root@nm3:/ # vmstat -z | grep `sock\|ITEM`
ITEM SIZE LIMIT USED FREE REQ FAIL SLEEP
socket: 696, 130295, 30, 65, 43825, 0, 0
```
Ну и если о использовании регулярок в grep'e помнят многие, то об использовании POSIX классов как-то забывают, а это тоже иногда удобно.
POSIX
Отберём строки с заглавными символами:


```bash
root@nm3:/ # grep `[[:upper:]]` test.txt
#comment UP
```
Ну и ещё пару трюков для затравки.
Первый скорее академичный. За лет 15 ни разу его не использовал:
Нужно из нашего тестового файла выбрать строки содержащие six или seven или eight:
Пока всё просто:


```bash
root@nm3:/ # grep -E `(six|seven|eight)` test.txt
seven eight one eight three
sixteen seventeen eighteen seven
sixteen seventeen eighteen
twenty seven
twentyseven
```
А теперь только те строки в которых six или seven или eight встречаются несколько раз. Эта фишка именуется Backreferences


```bash
root@nm3:/ # grep -E `(six|seven|eight).*\1` test.txt
seven eight one eight three
sixteen seventeen eighteen seven
```
Ну и второй трюк, куда более полезный. Необходимо вывести строки в которых 504 с обеих сторон ограничено табуляцией.
Ох как тут не хватает поддержки PCRE…
Использование POSIX-классов не спасает:


```bash
root@nm3:/ # grep `[[:blank:]]504[[:blank:]]` test.txt
one 504 one
one 504 one
one 504 one
```
На помощь приходит конструкция [CTRL+V][TAB]:


```bash
root@nm3:/ # grep ` 504 ` test.txt
one 504 one
```
Что ещё не сказал? Разумеется, grep умеет искать в файлах/каталогах и, разумеется, рекурсивно. Найдём в исходниках код, где разрешается использование Intel'ом сторонних SFP-шек. Как пишется allow_unsupported_sfp или unsupported_allow_sfp не помню. Ну да и ладно — это проблемы grep'а:


```bash
root@nm3:/ # grep -rni allow /usr/src/sys/dev/ | grep unsupp
/usr/src/sys/dev/ixgbe/README:75:of unsupported modules by setting the static variable 'allow_unsupported_sfp'
/usr/src/sys/dev/ixgbe/ixgbe.c:322:static int allow_unsupported_sfp = TRUE;
/usr/src/sys/dev/ixgbe/ixgbe.c:323:TUNABLE_INT(`hw.ixgbe.unsupported_sfp`, &allow_unsupported_sfp);
/usr/src/sys/dev/ixgbe/ixgbe.c:542: hw->allow_unsupported_sfp = allow_unsupported_sfp;
/usr/src/sys/dev/ixgbe/ixgbe_type.h:3249: bool allow_unsupported_sfp;
/usr/src/sys/dev/ixgbe/ixgbe_phy.c:1228: if (hw->allow_unsupported_sfp == TRUE) {
```
Надеюсь не утомил. И это была только вершина айсберга grep. Приятного Вам чтения, а мне аппетита на шашлыках!
Ну и удачного Вам grep'a!


<a href="http://habrahabr.ru/post/229501/" title="оригинал статьи" target="_blank">оригинал статьи</a>
