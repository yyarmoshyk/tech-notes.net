---
id: 1962
title: Подключение репозиториев Epel, Remi, Atrpms в RHEL/CentOS
date: 2014-10-20T15:05:11+00:00
author: admin

guid: http://www.tech-notes.net/?p=1962
permalink: /epel-remi-atrpms-rhel-centos/
panels_data:
  - 'a:0:{}'
image: /wp-content/uploads/2014/10/cydia-tabella121-300x300.png
categories:
  - CentOS
tags:
  - atrpms
  - epel
  - remi
  - rpmforge
---
Ни для кого не секрет, что `CentOS` и другие ему подобрные RedHat системы идут со стандартным набором репозитариев. К сожалению многи необходимы пакеты в них отсутствуют.

Распространенной практикой является подключение дополнительных хранилищ софтины, таких как Epel, Remi, Atrpms.

## Epel (Extra Packages for Enterprise Linux):

### RHEL/CentOS 7 64-Bit:

```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm
```

### RHEL/CentOS 6 32/64-Bit

```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/6/x86_64/Packages/e/epel-release-6-8.noarch.rpm
```

### RHEL/CentOS 5 32/64-Bit

```bash
wget http://download.fedoraproject.org/pub/epel/5/i386/epel-release-5-4.noarch.rpm  
```
```bash
rpm -ivh epel-release-5-4.noarch.rpm
```

noarch означает, что архитертура для них не имеет роли.

<center>
  <div id="gads">
  </div>
</center>

## REMI

Содержит самые последние версии `php` и `mysql`. Зависит от `Epel`.

### RHEL/CentOS 7 32/64-Bit:

```bash
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm
```

### RHEL/CentOS 6 32/64-Bit

```bash
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
```

### RHEL/CentOS 5 32/64-Bit

```bash
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-5.rpm
```

<center>
  <div id="gads">
  </div>
</center>

## RPMForge

### RHEL/CentOS 6 64-Bit:

```bash
rpm -ivh http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
```

### RHEL/CentOS 6 32-Bit:

```bash
rpm -ivh http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el6.rf.i686.rpm
```

### RHEL/CentOS 5 64-Bit

```bash
wget http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el5.rf.x86_64.rpm  
```
```bash
rpm -ivh rpmforge-release-0.5.2-2.el5.rf.x86_64.rpm
```

### RHEL/CentOS 5 32-Bit

```bash
wget http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el5.rf.i386.rpm  
```
```bash
rpm -ivh rpmforge-release-0.5.2-2.el5.rf.i386.rpm
```

<center>
  <div id="gads">
  </div>
</center>

## ELRepo

### RHEL/CentOS 7 32/64-Bit:

```bash
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
```

### RHEL/CentOS 6 32/64-Bit:

```bash
rpm -Uvh http://www.elrepo.org/elrepo-release-6-6.el6.elrepo.noarch.rpm
```

### RHEL/CentOS 6 32/64-Bit:

```bash
rpm -Uvh http://www.elrepo.org/elrepo-release-5-5.el5.elrepo.noarch.rpm
```

Для того тчо бы включить эти репозитории нужно подредактировать соответсвенно один из следующих файлов:
  * /etc/yum.repos.d/epel.repo
  * /etc/yum.repos.d/remi.repo
  * /etc/yum.repos.d/atrpms.repo
  * /etc/yum.repos.d/rpmforge.repo

Значение параметра `ENABLED` определяет включен он (1) или выключен (0).

В случае с RedHat рекомендуется отключать неиспользуемые репозитории.

Источники информации:
  * <a href="http://www.unixmen.com/install-remi-repository-rhel-centos-scientific-linux-76-x5-x-fedora-201918/" target="_blank">unixmen.com</a>
  * <a href="http://wiki.centos.org/AdditionalResources/Repositories" target="_blank">centos.org</a>
  * <a href="http://www.tecmint.com/how-to-enable-epel-repository-for-rhel-centos-6-5/" target="_blank">tecmint.com</a>
