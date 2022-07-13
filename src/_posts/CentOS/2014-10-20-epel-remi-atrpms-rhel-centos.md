---
id: 1962
title: Enable Epel, Remi, Atrpms in RHEL/CentOS
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
It's no secret that `CentOS` and other RedHat-like systems come with a standard set of repositories. Unfortunately, many required packages are missing.

A common practice is to connect additional software repositories, such as Epel, Remi, Atrpms.

## Epel (Extra Packages for Enterprise Linux):

### CentOS 8 64-Bit:
```bash
rpm -ivh https://dl.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/e/epel-release-8-16.el8.noarch.rpm
```

### RHEL/CentOS 7 64-Bit:

```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-14.noarch.rpm
```

### RHEL/CentOS 6 32/64-Bit

```bash
rpm -ivh https://archives.fedoraproject.org/pub/archive/epel/6/x86_64/Packages/e/epel-release-6-8.noarch.rpm
```

### RHEL/CentOS 5 32/64-Bit

```bash
wget https://archives.fedoraproject.org/pub/archive/epel/5/x86_64/epel-release-5-4.noarch.rpm
rpm -ivh epel-release-5-4.noarch.rpm
```

noarch means that the architecture has no role for them.

<center>
  <div id="gads">
  </div>
</center>

## REMI

Contains the latest versions of `php` and `mysql`. Requires `Epel`.
### CentOS 8 64-Bit:
```bash
rpm -ivh http://rpms.famillecollet.com/enterprise/remi-release-8.rpm
```

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
rpm -ivh https://rpmfind.net/linux/dag/redhat/el6/en/x86_64/dag/RPMS/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
```

### RHEL/CentOS 6 32-Bit:

```bash
rpm -ivh https://rpmfind.net/linux/dag/redhat/el6/en/x86_64/dag/RPMS/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
```

### RHEL/CentOS 5 64-Bit

```bash
wget https://rpmfind.net/linux/dag/redhat/el6/en/x86_64/dag/RPMS/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
rpm -ivh rpmforge-release-0.5.2-2.el5.rf.x86_64.rpm
```

### RHEL/CentOS 5 32-Bit

```bash
wget https://rpmfind.net/linux/dag/redhat/el6/en/x86_64/dag/RPMS/rpmforge-release-0.5.3-1.el6.rf.x86_64.rpm
rpm -ivh rpmforge-release-0.5.2-2.el5.rf.i386.rpm
```

<center>
  <div id="gads">
  </div>
</center>

## ELRepo
### RHEL/CentOS 8 32/64-Bit:
```bash
rpm -Uvh https://rpmfind.net/linux/centos/8-stream/extras/ppc64le/os/Packages/elrepo-release-8.1-1.el8.elrepo.noarch.rpm
```

### RHEL/CentOS 7 32/64-Bit:
```bash
glibc = 2.17 is needed by elrepo-release-7.0-4.el7.elrepo.noarch
```
fix:
```bash
yum install -y glibc
```

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

In order to enable these repositories, you need to edit one of the following files accordingly:
  * /etc/yum.repos.d/epel.repo
  * /etc/yum.repos.d/remi.repo
  * /etc/yum.repos.d/atrpms.repo
  * /etc/yum.repos.d/rpmforge.repo

The value of the `ENABLED` parameter determines whether it is enabled (1) or disabled (0).

In the case of RedHat, it is recommended to disable unused repositories.

Sources of information:
* <a href="http://www.unixmen.com/install-remi-repository-rhel-centos-scientific-linux-76-x5-x-fedora-201918/" target="_blank">unixmen.com </a>
* <a href="http://wiki.centos.org/AdditionalResources/Repositories" target="_blank">centos.org</a>
* <a href="http://www.tecmint.com/how-to-enable-epel-repository-for-rhel-centos-6-5/" target="_blank">tecmint.com</a>