---
id: 2281
title: Как установить Java JRE на Linux Ubuntu
date: 2014-12-15T08:45:42+00:00
author: admin

guid: http://www.tech-notes.net/?p=2281
permalink: /install-java-jre-linux-ubuntu/
image: /wp-content/uploads/2014/12/xah_java_logo_1.png
categories:
  - Ubuntu Linux
tags:
  - java jre
  - установка java ubuntu
---
Дальше речь пойдет о том, как установить самую последнюю версию Java JRE на Linux Ubuntu.

Для начала переходим по следующей ссылке:  
<a href="http://www.oracle.com/technetwork/java/javase/downloads/index.html" target="_blank">http://www.oracle.com/technetwork/java/javase/downloads/index.html</a>

принимаем условия лицензионного соглашения и скачиваем архив с Java JRE:  
[<img src="/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144315.png" alt="Screenshot from 2014-12-12 14:43:15" width="566" height="292" class="aligncenter size-full wp-image-2282" srcset="/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144315.png 566w, /wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144315-170x87.png 170w, /wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144315-300x154.png 300w" sizes="(max-width: 566px) 100vw, 566px" />](/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144315.png)

Создадим папку для Java и распакуем в нее содержимое архива:

```bash
sudo mkdir -p /usr/local/java
```

У меня архив сохранился в папку Downloads. Куда бы он не сохранился у Вас - переместите его в папку /usr/local/java:

```bash
sudo mv ~/Downloads/jre-8u25-linux-x64.tar.gz /usr/local/java  
sudo cd /usr/local/java  
sudo tar xf jre-8u25-linux-x64.tar.gz
```

Отредактируйте файл `/etc/profile` следующими строками:

```bash
JAVA_HOME=/usr/local/java/jre1.8.0_25
PATH=$PATH:$HOME/bin:$JAVA_HOME/bin
export JAVA_HOME
export PATH
```


Дальше выполните в консоли следующую последовательность команд. Обратите внимание на, выделенною жирным, имя папки **jre1.8.0_25**. В вашем случае оно может отличаться, и чем больше времени прошло с момента публикации, тем сильнее будет отличаться версия Java и имя папки, соответственно:

```bash
sudo update-alternatives -install `/usr/bin/java` `java` `/usr/local/java/**jre1.8.0_25**/bin/java` 1  
sudo update-alternatives -install `/usr/bin/javaws` `javaws` `/usr/local/java/**jre1.8.0_25**/bin/javaws` 1  
sudo update-alternatives -set java /usr/local/java/**jre1.8.0_25**/bin/java  
sudo update-alternatives -set java /usr/local/java/**jre1.8.0_25**/bin/javaws  
sudo update-alternatives -set javaws /usr/local/java/**jre1.8.0_25**/bin/javaws
```

Теперь применяем содержимое файла profile в рамках активной сессии (после перезагрузки они сами вступают в силу):

```bash
source /etc/profile
```

Теперь в результате выполнения следующей команды:

```bash
java -version
```

Вы получите следующий вывод:  
[<img src="/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144519.png" alt="Screenshot from 2014-12-12 14:45:19" width="581" height="59" class="aligncenter size-full wp-image-2283" srcset="/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144519.png 581w, /wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144519-170x17.png 170w, /wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144519-300x30.png 300w" sizes="(max-width: 581px) 100vw, 581px" />](/wp-content/uploads/2014/12/Screenshot-from-2014-12-12-144519.png)
