---
id: 3108
title: Быстрое создание rpm пакета в CentOS с помощью Checkinstall
date: 2016-01-10T10:59:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=3108
permalink: /checkinstall-create-a-rpm-package-in-centos/
image: /wp-content/uploads/2016/01/tar-gz.png
categories:
  - Linux Server
tags:
  - CentOS
  - Checkinstall
---
Для того, чтобы создать RPM пакет используя исходный код приложения вам понадобится `Checkinstall`.

Это самый простой и быстрый способ создания RPM пакетов. Готовый пакет можно устанавливать на другие сервера без необходимости компилировать его каждый раз.

Установите обработчики rpm пакетов:

```bash
yum install -y rpm-build rpmdevtools
```

После установки выполните следующую команду. Она создаст зависимости rpm пакетов:

```bash
rpmdev-setuptree
```

К сожалению Checkinstall недоступен в репозитариях CentOS. Солный список rpm пакетов доступен на следующей странице:  
[http://rpm.pbone.net/index.php3?stat=3&search=checkinstall&srodzaj=3](http://rpm.pbone.net/index.php3?stat=3&#038;search=checkinstall&#038;srodzaj=3)

Его нужно скачать и установить:

```bash
wget -no-check-certificate https://filebox.ece.vt.edu/~mclint/puppet/files/checkinstall-1.6.2-3.el6.1.x86_64.rpm  
rpm -i checkinstall-1.6.2-3.el6.1.x86_64.rpm
```

Раньше использовалась другая ссылка и когда она перестала работать я чуть не пришел у ужас. В общем нашел другую, скачал и разместил у себя на сервере:

```bash
wget /wp-content/uploads/2016/04/01/checkinstall-1.6.2-3.el6.1.x86_64.rpm
```

После этого checkinstall готов к использованию. Используйте его вместо `make install` при сборке пакетов.

Следующая конструкция не будет устанавливать приложение, а подготовит пакет готовый к установке и покажет его местонахождение:

```bash
checkinstall -install=no
```

Например:

```bash
**********************************************************************

 Done. The new package has been saved to

 /root/rpmbuild/RPMS/x86_64/httpd-2.2.31-1.x86_64.rpm
 You can install it in your system anytime using:

      rpm -i httpd-2.2.31-1.x86_64.rpm

**********************************************************************
```


Готовый пакет можно установить следующей командой:

```bash
rpm -i /root/rpmbuild/RPMS/x86_64/httpd-2.2.31-1.x86_64.rpm
```

Если же Вы собрали пакет для обновления существующего в системе, тогда используйте:

```bash
rpm -U /root/rpmbuild/RPMS/x86_64/httpd-2.2.31-1.x86_64.rpm
```
