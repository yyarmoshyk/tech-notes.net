---
id: 2639
title: Проверка скорости интернет соединения в консоли Linux
date: 2015-05-29T18:44:12+00:00
author: admin

guid: http://www.tech-notes.net/?p=2639
permalink: /speedtest-cli-linux/
image: /wp-content/uploads/2015/05/speedtest.jpg
categories:
  - Linux server
---
Сайт [speedtest.net](http://www.speedtest.net/) известен многим. Он очень помогает проверить Вашу скорость интернета, но как быть с linux серверами у которых нету графической оболочки, а есть только bash консоль.

Для таких случаев [Matt Martz](https://github.com/sivel/) написал утилиту на питоне, которую можно прямо качать и запускать.

Последовательность действий:
1. Скачиваем
```bash
wget -O /usr/local/bin/speedtest-cli https://raw.github.com/sivel/speedtest-cli/master/speedtest_cli.py
chmod +x /usr/local/bin/speedtest-cli
speedtest_cli</del>
```
1. Устанавливаем:
```bash
pip install speedtest-cli
```
1. Выполняем:
```bash
chmod +x speedtest-cli
speedtest-cli
```

На выходе получаем вот такую картину:  
[<img src="/wp-content/uploads/2015/05/Screenshot-from-2015-05-29-143109.png" alt="Screenshot from 2015-05-29 14:31:09" width="653" height="184" class="aligncenter size-full wp-image-2713" srcset="/wp-content/uploads/2015/05/Screenshot-from-2015-05-29-143109.png 653w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-29-143109-170x48.png 170w, /wp-content/uploads/2015/05/Screenshot-from-2015-05-29-143109-300x85.png 300w" sizes="(max-width: 653px) 100vw, 653px" />](/wp-content/uploads/2015/05/Screenshot-from-2015-05-29-143109.png)

[github.com/sivel/speedtest-cli](https://github.com/sivel/speedtest-cli)
