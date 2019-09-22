---
title: "Enable Epel, Remi, Atrpms in RHEL/CentOS"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "How to enable additional repos in CentOS/RHEL."
last_modified_at: 2014-10-14T00:00:00-00:00
toc: false
categories:
  - CentOS
tags:
  - centos
  - epel
  - remi
  - atrpms
redirect_from:
  - /epel-remi-atrpms-rhel-centos/
---
CentOS and other RHEL-based systems are being shipped with the default configuration for `yum` package manager. The default (official) repositories often don't contain the required software or the latest versions of the perticular packages are not avaialble in these repositories.

In order to extend yum capabilities the additional repositories can be enabled. Next you can find the complete instructions ho to enable each of them with additional explanations about the purpose of each repository.

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
rpm -ivh https://archives.fedoraproject.org/pub/archive/epel/5/i386/epel-release-5-4.noarch.rpm
```

`noarch` meens that the package is insensitive to the system architecture (`x86_64` or `i386`)

## REMI
Contains the latest `php` and `mysql` versions. Depends on `Epel`

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
rpm -ivh http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el5.rf.x86_64.rpm
```
### RHEL/CentOS 5 32-Bit
```bash
rpm -ivh http://packages.sw.be/rpmforge-release/rpmforge-release-0.5.3-1.el5.rf.i386.rpm
```

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

## Sources
* [unixmen.com](http://www.unixmen.com/install-remi-repository-rhel-centos-scientific-linux-76-x5-x-fedora-201918/)
* [wiki.centos.org](http://wiki.centos.org/AdditionalResources/Repositories)
* [tecmint.com](http://www.tecmint.com/how-to-enable-epel-repository-for-rhel-centos-6-5/)
