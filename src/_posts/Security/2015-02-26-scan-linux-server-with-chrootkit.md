---
id: 2438
title: Scan server with Chkrootkit
date: 2015-02-26T10:52:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=2438
permalink: /scan-linux-server-with-chrootkit/
image: /wp-content/uploads/2015/02/linux_penguin_icon.jpg
categories:
  - Linux server
  - Security
---
A `rootkit` is a hidden type of software. Usually it allows you to hide the existence of certain processes or programs from conventional detection methods or allow remote access to a computer.

[<img src="/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg" alt="chkrootkit_rootkit" width="500" height="323" class="aligncenter size-full wp-image-2439" srcset ="/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg 500w, /wp-content/uploads/2015/02/chkrootkit_rootkit-170x110.jpg 170w, /wp-content/uploads/2015/02/chkrootkit_rootkit-300x194 .jpg 300w" sizes="(max-width: 500px) 100vw, 500px" />](/wp-content/uploads/2015/02/chkrootkit_rootkit.jpg)

`Chkrootkit` provides a set of utilities for scanning and detecting rootkits on a server.
`Chkrootkit` can be installed from the software repositories. In the case of RedHat/CentOS you need to [enable Epel.](http://www.tech-notes.net/epel-remi-atrpms-rhel-centos/)

The release history is available at [http://pkgs.repoforge.org/chkrootkit/](http://pkgs.repoforge.org/chkrootkit/)

You can start a scan by running:
```bash
chkrootkit
```

or
```bash
chkrootkit -r /var/www
```

It is recommended to run the scan in the screen, so that if you disconnect from the server, you will not lose progress. To do this, before starting, run:
```bash
screen
```

To return to the active screen in case of disconnection with the server, run:
```bash
screen-list
screen -r %screen_id%
```