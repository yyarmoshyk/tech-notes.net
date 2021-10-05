---
id: 2919
title: Проблемы с git в Jenkins
date: 2015-10-09T16:25:50+00:00
author: admin

guid: http://www.tech-notes.net/?p=2919
permalink: '/%d0%bf%d1%80%d0%be%d0%b1%d0%bb%d0%b5%d0%bc%d1%8b-%d1%81-git-%d0%b2-jenkins/'
image: /wp-content/uploads/2015/10/jenkins-logo.jpg
categories:
  - Jenkins
---
В ходе подключения git репозитория к Jenkins получил следующуу ошибку:

```bash
Failed to connect to repository : Command 'git config -local credential.username username' returned status code 129:  
stdout:  
stderr: error: unknown option 'local'  
usage: git config [options]
```

Ошибка вызвана тем, что Jenkins требует git версии 1.8+, а в репах CentOS 6.5 доступен только 1.7. Где-то на [просторах интернета](http://stackoverflow.com/questions/21820715/how-to-install-latest-version-of-git-on-centos-6-x-7-x) пишут, что в репе `rpmforge-extras` есть новая версия. Проверил - нету.

Я решил долго не мучаться и собрать git из исходников.

Подготовка:

```bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker -y
```

Сам процесс:

```bash
wget https://www.kernel.org/pub/software/scm/git/git-2.6.1.tar.xz  
tar xf git-2.6.1.tar.xz  
cd git-2.6.1
```

Собираем:

```bash
make prefix=/usr/local/git all
```

Устанавливаем:

```bash
make prefix=/usr/local/git install
```

Добавляем `/usr/local/git/bin` в переменное окружение PATH и применяем изменения:

```bash
echo 'export PATH=$PATH:/usr/local/git/bin' >> /etc/bashrc  
source /etc/bashrc
```

Проверить версию git можно следующей командой:

```bash
git -version
```

Осталось подкрутить настройки Jenkins. В web-интерфейсе переходим в `Manage Jenkins -> Configure System`  
[<img src="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-123224.png" alt="Screenshot from 2015-10-09 12:32:24" width="875" height="221" class="aligncenter size-full wp-image-2925" srcset="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-123224.png 875w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-123224-170x43.png 170w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-123224-300x76.png 300w" sizes="(max-width: 875px) 100vw, 875px" />](/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-123224.png)

Ищем секцию `Git` и устанавливаем нормальное значение для `Path to Git executable` (/usr/local/git/bin/git)  
[<img src="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126.png" alt="Screenshot from 2015-10-09 12:41:26" width="1523" height="221" class="aligncenter size-full wp-image-2928" srcset="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126.png 1523w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126-170x25.png 170w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126-300x44.png 300w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126-1024x149.png 1024w" sizes="(max-width: 1523px) 100vw, 1523px" />](/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-124126.png)
