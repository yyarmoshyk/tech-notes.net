---
id: 2128
title: FFmpeg с поддержкой libaacplus и fdk-aac на CentOS
date: 2014-11-06T19:37:51+00:00
author: admin

guid: http://www.tech-notes.net/?p=2128
permalink: /ffmpeg-with-libaacplus-fdk-aac/
image: /wp-content/uploads/2014/11/ffmpeg.png
categories:
  - Linux server
tags:
  - CentOS
  - FFmpeg
  - libaacplus
---
В ходе работы над проэктом для одного из клиента появилась необходимость расширить функционал `ffmpeg` и добавить в него пару плюшек, которых в нем нету из коробки. Нужно было включить дополнительные кодэки `aac`.

В папке пользователя `root` я создал папку `src` и в ней делал всю магию.

```bash
mkdir /root/src && cd /root/src
```

Для правильной сборки понадобятся пару пакетов:

```bash
yum install yasm yasm-devel gcc-c++ autoconf automake libtool git unzip
```

Приступаем к установке кодеков:

### Fdk-AAC

Все довольно просто:

```bash
wget -O fdk-aac.zip https://github.com/mstorsjo/fdk-aac/zipball/master  
unzip fdk-aac.zip  
cd mstorsjo-fdk-aac-9a32340  
autoreconf -fiv  
./configure  
make && make install
```

Линкуем библиотеку:

```bash
ln -s /usr/local/lib/libfdk-aac.so.0.0.4 /usr/lib64/libfdk-aac.so.0
```

### libaacplus

Так же просто:

```bash
wget http://ffmpeg.gusari.org/uploads/libaacplus-2.0.2.tar.gz  
tar xf libaacplus-2.0.2.tar.gz  
cd libaacplus-2.0.2  
./autogen.sh -enable-shared -enable-static  
make && make install
```

Линкуем библиотеку:

```bash
ln -s /usr/local/lib/libaacplus.so.2.0.2 /usr/lib64/libaacplus.so.2
```

### Ffmpeg

```bash
git clone git://source.ffmpeg.org/ffmpeg.git  
cd ffmpeg/  
./configure -enable-gpl -enable-nonfree -enable-libaacplus -enable-libfdk_aac  
make && make install
```

Сборка ffmpeg занимает немного времени.

По завершению останестся слинковать бинарник:

```bash
ln -s /usr/local/bin/ffmpeg /usr/bin/ffmpeg
```

Проверить как оно работает можно вот так

```bash
ffmpeg -i input.wav -c:a libfaac -b:a 192k output.m4a
```

или вот так:
```bash
ffmpeg -i input.wav -c:a libfdk_aac -vbr 3 output.m4a
```
