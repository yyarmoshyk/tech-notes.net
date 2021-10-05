---
id: 2913
title: Запускаем Jenkins в Tomcat6 на CentOS 6.5
date: 2015-10-09T15:10:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=2913
permalink: /jenkins-tomcat6-centos6/
image: /wp-content/uploads/2015/10/tomcat-jenkins-200x200.png
categories:
  - Jenkins
---
Быстрая заметка о том, как заставить Jenkins работать на CentOS сервере и показывать web морду в Tomcat6.

Для начала добавим нужные репозитрии и установим сам jenkins:

```bash
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo  
sudo rpm -import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key  
yum install jenkins -y
```

Дальше устанавливаем tomcat6:

```bash
yum install tomcat6 -y
```

В чистую систему оно затянет 100+ мегабайт зависимостей.

Ставим Tomcat и jenkins на автозагрузку:

```bash
chkconfig jenkins on  
chkconfig tomcat6 on
```

Нужно подредактировать пару конфигов Tomcat. Находятся они в папке /usr/share/tomcat6/conf

```bash
cd /usr/share/tomcat6/conf
```

Редактируем файл с контекстами:

```bash
vim context.xml
```

Добавляем в него следующую строку:

```bash
<Environment name="JENKINS_HOME" value="/usr/lib/jenkins/" type="java.lang.String"/>
```


Редактируем общий конфиг:

```bash
vim tomcat6.conf
```

Задаем в нем дополнительные параметры каталине, а именно JENKINS_HOME:

```bash
CATALINA_OPTS="-DJENKINS_HOME=/usr/lib/jenkins/ -Xmx512m"
```


Создаем пользователя для доступа к интерфейсу Jenkins:

```bash
vim tomcat-users.xml
```

Добавте следующее в файл:

```bash
<role rolename="admin"/>
<user username="jenkins-admin" password="secret" roles="admin"/>
```


Перезапустите tomcat что бы изменения вступили в силу:

```bash
/etc/init.d/tomcat6 restart
```

Web-интерфейс Jenkins будет доступен по адресу: http://**localhost**:8080/

[<img src="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-105822.png" alt="Screenshot from 2015-10-09 10:58:22" width="679" height="509" class="aligncenter size-full wp-image-2916" srcset="/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-105822.png 679w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-105822-170x127.png 170w, /wp-content/uploads/2015/10/Screenshot-from-2015-10-09-105822-300x225.png 300w" sizes="(max-width: 679px) 100vw, 679px" />](/wp-content/uploads/2015/10/Screenshot-from-2015-10-09-105822.png)
