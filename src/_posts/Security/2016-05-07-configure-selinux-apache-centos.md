---
id: 3294
title: Configure SELinux for Apache on CentOS
date: 2016-05-07T14:13:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=3294
permalink: /configure-selinux-apache-centos/
image: /wp-content/uploads/2016/05/selinux.jpg
categories:
  - Apache
  - Security
tags:
  - selinux
---
`SELinux` is a Linux kernel module that provides an additional mechanism to determine folder and file permissions. Sometimes it creates considerable problems when locating site files and logs in non-standard folders.

This rake is especially popular with new admins and developers who do not understand why the site returns a 404 error despite the fact that the user `apache` or `www-data` is the owner of the folder with the site files.

The most popular way to solve the problem is to disable `selinux`. Even admins from the second line of popular hosting support use this method of solving the problem.
As a matter of fact selinux determines what and which daemon can do (read files, edit files). It is not related to files' and folders' permissions. 

It often happens that websites get compromised over vulnerabilities in CMS sites. In this case the attacker gains access to folders and files that the web server has access.

Using `selinux` you can even run a web server as `root` without having to worry about it. It not recommended.

You can check the status of `selinux` in `CentOS/RedHat` with the following command:
```bash
getenforce
```

To manage the rules, we need additional utilities:
```bash
yum install -y policycoreutils-python setroubleshooting
```

`Selinux` is similar in configuration structure to `iptables`. It has its own file access tables. 

In order for selinux to allow the apache process to write to a certain directory you need to include this directory in the `httpd_sys_rw_content_t` selinux table, the folder with logs must be added to ``httpd_log_t``, etc.

The following commands are given as an example or a cheat sheet. In this case, the site folders are in `/home/webapps`.

Allow apache to **read** files in the `/home/webapps` directory and subdirectories (`httpd_sys_content_t`):
```bash
semanage fcontext -a -t httpd_sys_content_t '/home/webapps(/.*)?'
```

We allow `apache` to write logs in a non-standard place (`httpd_log_t`):
```bash
semanage fcontext -a -t httpd_log_t '/home/webapps/logs(/.*)?'
```

A separate directive in `selinux` is reserved for `mod_cache`. If your server needs to use custom cache storage than add it to `httpd_cache_t`:
```bash
semanage fcontext -a -t httpd_cache_t '/home/webapps/cache(/.*)?'
```

In order to allow write access add the path to the folder into `httpd_sys_rw_content_t`:
```bash
semanage fcontext -a -t httpd_sys_rw_content_t '/home/webapps/\*/public_html/uploads(/.\*)?'
```

To apply the changes, run the following command:
```bash
restorecon -Rv /home/webapps
```

At this point apache can work with the directories of all sites that will be created in `/home/webapps/` and write files to the uploads directories of each site.

External links:
* [https://en.wikipedia.org/wiki/Security-Enhanced_Linux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux)
* [http://www.serverlab.ca/tutorials/linux/web-servers-linux/configuring-selinux-policies-for-apache-web-servers](http://www.serverlab.ca/tutorials/linux /web-servers-linux/configuring-selinux-policies-for-apache-web-servers)