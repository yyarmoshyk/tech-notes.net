---
id: 3559
title: Change default umask for files in custom folder
date: 2016-11-29T05:04:27+00:00
author: "Yaroslav Yarmoshyk"

guid: http://www.tech-notes.net/?p=3559
permalink: /umask-per-folder-with-acl/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - Linux server
tags:
  - acl
  - umask
  - setfacl
---
`Umask` in Linux is a pattern of permissions for created files. Typically specified globally in `/etc/profile` or on a per-user basis in `.bashrc` files in the home directory.

But what if the umask is set to 022 (files are created with `rw-r-r (0644)` permissions, and folders are created with `rwx-rx-rx (0755)`), but in one particular folder you need files to be accessible to reads and writes to all (`rw-rw-rw (666)`)?

In this case, you can use the `setfacl` utility. You can change the ACL for existing files with the following command:
```bash
setfacl -R -m u::rwx -m g::rwx -m o::rwx **folder_name**
```

After executing the following command, all files in the folder created in the folder whose name you specify will be writable by all users of the system:
```bash
setfacl -m default:u::rwx -m default:g::rw -m default:o::rw **folder_name**
```