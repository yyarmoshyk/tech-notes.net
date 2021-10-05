---
id: 437
title: Сказ о том, как установить OpenSSH 6 из исходников на удаленный сервер с CentOS 5.8
date: 2014-02-10T17:00:40+00:00
author: admin

guid: http://www.tech-notes.net/?p=437
permalink: /compile-openssh-from-sources-centos-5-8/
image: /wp-content/uploads/2014/02/ssh_logo.png
categories:
  - Linux server
tags:
  - centos
  - openssh
  - source
---
Многим известен консервативный подход разработчиков RadHat и CentOS к обновлению пакетов. Но, как известно, в старых версиях ПО находят новые дыры в безопасности, что совершенно недопустимо для серверов. В CentOS 5.x установлен OpenSSH версии 4.3. Наша задача - обновить его до последней доступной версии.

Можно попробовать найти нужный rpm пакет, но в таком случае, с большой вероятностью, возможности версии Вашей ОС не удовлетворят запросы паке. Обновиться до последней версии можно только собирая пакет руками.

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-091350-300x25.png" alt="Screenshot from 2014-02-10 09:13:50" width="300" height="25" class="aligncenter size-medium wp-image-438" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-091350-300x25.png 300w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-10-091350.png 515w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-091350.png)

Для начала нам потребуются несколько пакетов:

```bash
yum install gcc make openssl-devel pam-devel screen
```

Дальше скачиваем пакет для установки, распаковываем его:

```bash
wget ftp://ftp3.usa.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-6.6p1.tar.gz  
tar xvf openssh-6.4*.gz  
cd openssh-6.4p1
```

Перед сборкой я бы советовал скачать доступную версию OpenSSH из репозитариев. Для этого нужно доставить необходимый пакет:

```bash
yum -y install yum-utils.noarch
```

Скачать OpenSSH server:

```bash
yumdownloader openssh-server
```

Для себя я выбрал вот такие параметры конфигурации:

  * конфигурационные файлы будут храниться в /etc/sshd/
  * бинарники будут лежать в /usr/bin/
  * по умолчанию включаю поддержку ipv4
  * так же нужна поддержка кэшированых паролей и pam авторизация
```bash
./configure -sysconfdir=/etc/sshd/ -bindir=/usr/bin/ -sbindir=/usr/sbin/ -with-ipv4-default -with-md5-passwords -with-pam
```

Удаляем текущую версию OpenSSH. С этого места активная ssh сессия - единственная соломинка, которая связывает Вас и Ваш сервер. Если что-то пойдет не так - подключиться к серверу Вы не сможете. Хорошо, если есть сапорт в который можно позвонить.

```bash
yum remove openssh-server
```

Компилим и ставим OpenSSH:

```bash
make
make install
```

Копируем скрипт запуска в нужное место:

```bash
cp contrib/redhat/sshd.init /etc/init.d/sshd
```

Если Вы подключитесь к серверу под именем root, тогда включите эту опцию принудительно в конфигурационном файле: (раскомментировать `PermitRootLogin yes` в `/etc/sshd/sshd_config`)

При запуске sshd ругается на отсутствие файла сертификата. Для этого нужно в init.d скрипте (`/etc/init.d/sshd`) закомментировать следующую строчку

```bash
/etc/ssh/ssh_host_ecdsa_key.pub
```

Уносим в сторону старую папку ssh и делам симлинк с новой:

```bash
mv /etc/ssh /etc/ssh.bak && ln -s /etc/sshd /etc/ssh
```

Ставим демон на автозагрузку:

```bash
chkconfig sshd -add  
chkconfig sshd on
```

Вам уже чешутся руки запустить новый ssh? Я рекомендую остановить его и запустить за ново, вместо команды `restart`.  

Когда я сделал `/etc/init.d/sshd restart` - моя сессия с сервером разорвалась и ssh не запустился. В логах ошибки я не нашел, но подключившись к серверу на прямую ssh я завел без проблем. Он поругался только на сертификат, который мы уже закомментировали в init.d скрипте. Собственно поэтому и закомментировали.

На всякий случай выполнять будем в скрине:

```bash
screen  
/etc/init.d/sshd stop && /etc/init.d/sshd start
```

В этот момент связь с сервером обрывается.

Если Вы работаете в ОС Linux тогда, для того что бы подключиться к серверу назад, Вам нужно удалить старые сведенья о сервере из файла known_hosts:

```bash
ssh-keygen -f `~/.ssh/known_hosts` -R %server_ip%
```

Теперь можно подключаться к серверу.

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-115649-300x31.png" alt="Screenshot from 2014-02-10 11:56:49" width="300" height="31" class="aligncenter size-medium wp-image-439" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-115649-300x31.png 300w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-10-115649.png 516w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-115649.png)

Если в ходе компиляции Вам выпало вот такое сообщение:

```
configure: error: PAM headers not found
```

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-090703-300x30.png" alt="Screenshot from 2014-02-10 09:07:03" width="300" height="30" class="aligncenter size-medium wp-image-440" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-090703-300x30.png 300w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-10-090703.png 543w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-10-090703.png)  

Установите недостающий пакет:  
```bash
yum install pam-devel
```
