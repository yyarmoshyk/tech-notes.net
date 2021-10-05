---
id: 1325
title: Использование lftp для обмена файлами с ftp сервером в Linux
date: 2014-07-29T09:09:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=1325
permalink: /use-lftp-for-file-exchange/
image: /wp-content/uploads/2014/07/ftp-logo_thumb2.jpg
categories:
  - FTP
tags:
  - lftp
---
`lftp` - утилита командной строки, которая позволяет обмениваться данными с ftp и http серверами. lftp имеет функционал зеркалирования, который позволяет загружать или рекурсивно обновлять дерево каталогов. Она также имеет функционал обратного зеркалирования (mirror -R), который позволяет рекурсивно обновлять обновлять дерево каталогов на удаленном сервере. Зеркалирование также позволяет синхронизировать папки между двумя удаленными серверами.

Синтакс использования:

```bash
mirror  
mirror options  
mirror -c  
mirror -R
```

На пример: Как загрузить все файлы с удаленного сервера?

Для начала устанавливаем соединение с сервером:

```bash
lftp ftp.server.com
```

Вводим имя пользователя и пароль:

```bash
lftp ftp.server.com:~> user username@ftp.server.com  
Password:
```

В результате получаем:

```bash
lftp username@ftp.server.com:~>  
Type ls command to see a list of files:
```

Вводим `ls` для просмотра содержимого каталога:

```bash
lftp ftp.server.com:~> ls
```

В результате получаем листинг каталога:

```bash
-rw-r-r- 1 80 www 36809419 Jun 24 23:59 file1.ext  
-rw-r-r- 1 80 www 100912271 Jun 25 23:59 file2.ext  
-rw-r-r- 1 80 www 102926055 Jun 26 23:59 file3.ext
```

Для того что бы скопировать все файлы к себе в текущий каталог введите `mirror`:

```bash
lftp ftp.server.com:~> mirror
```

Вы можете указать исходный каталог и папку, в которой нужно разместить скачанные файлы (каталог назначения). Если каталог назначения заканчивается символом `/` (слэш), тогда к нему будет дописано имя исходного каталога.

```bash
lftp ftp.server.com:~> mirror source target
```

или

```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs
```

В этом случае все файлы из папки `logs` на исходном сервере будут скопированы в папку `/data/wwwlogs` на текущем.  
При использовании следующего синтаксиса, все файлы из папки `logs` будут скопированы в папку `/data/wwwlogs/logs`

```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs/
```

Рекомендуется использовать mirror с включенной опцией продолжения загрузки, в этом случае не придется заново загружать все файлы в случае разрыва соединения или прерывания трансфера данных:

```bash
lftp ftp.server.com:~> mirror -c source target
```

или

```bash
lftp ftp.server.com:~> mirror -continue
```

Для того что бы скачать только новые/обновленные файлы используем ключ `only-newer`:

```bash
lftp ftp.server.com:~> mirror -only-newer
```

или

```bash
lftp ftp.server.com:~> mirror -n
```

Можно ускорить операцию зеркалирования, включив параллельную загрузку или загрузку файлов в несколько потоков:

```bash
lftp ftp.server.com:~> mirror -P
```

Для того что бы загрузить параллельно 10 файлов можно воспользоваться следующей командой:

```bash
lftp ftp.server.com:~> mirror -parallel=10
```

Для того что бы загрузить только новые файлы с сервера в 10 потоков:

```bash
mirror -continue -only-newer -parallel=5 имя_папки имя_папки
```

Пример 2: Как загрузить локальные файлы на удаленный сервер?

Для заливки файлов на сервер нужно использовать ключ -R или -reverse

Для начала устанавливаем соединение с сервером:

```bash
lftp ftp.server.com
```

Вводим имя пользователя и пароль:

```bash
lftp ftp.server.com:~> user username@ftp.server.com  
Password:
```

В результате получаем:

```bash
lftp username@ftp.server.com:~>  
Type ls command to see a list of files:
```

Переходим в папку /home/project/website/version5/:

```bash
lftp ftp.server.com:~> lcd /home/project/website/version5/
```

Вывод:

```bash
lcd ok, local cwd=/home/project/website/version5
```

Для того, что бы загрузить файлы на сервер, используйте следующий синтаксис:

```bash
lftp ftp.server.com:~> mirror -R
```

Можно указать локальный и удаленный каталог:

```bash
lftp ftp.server.com~> mirror -R /home/user/projects/website /var/www/html
```

Одной командой:

```bash
lftp -e 'mirror -parallel=10 -R /home/user/projects/website /var/www/html' -u логин,пароль адрес_сервера
```

Если в ходе работы с удаленным сервером вы получили следующую ошибку:

```bash
521 Data connection cannot be opened with this PROT setting.
```

Тогда выполните следующие команды и повторите последнюю операцию:

```bash
set ftp:ssl-force true  
set ftp:ssl-protect-data true
```
