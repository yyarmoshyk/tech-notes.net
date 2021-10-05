---
id: 1870
title: 'WHM(cPanel): Failed to create the account'
date: 2014-10-08T19:22:49+00:00
author: admin

guid: http://www.tech-notes.net/?p=1870
permalink: /cpanel-failed-to-create-the-account/
image: /wp-content/uploads/2014/04/whm_logo.jpg
categories:
  - WHM/cPanel
---
Если при использовании WHM(cPanel) Transfer tool Вы получаете следующее сообщение об ошибке:

```bash
Account  
Failed to create the account: This system already has a database owner named “xxxxx”.  
Removing copied archive “/home/cpmove-aroundph.tar.gz.part00001” from the local server …  
Failed: Account Restore Failed: “Account failure: Failed to create the account: This system already has a database owner named
```

[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316-300x41.png" alt="Screenshot from 2014-10-08 16:03:16" width="300" height="41" class="aligncenter size-medium wp-image-1896" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316-300x41.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316-170x23.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316-660x91.png 660w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316.png 1002w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-08-160316.png)

Удалите пользователя `xxxxx` из файла `/etc/dbowners`
