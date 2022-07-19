---
id: 2448
title: Using ClamAV (clamscan) on a Linux server
date: 2015-03-01T12:12:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=2448
permalink: /use-clamav-clamscan-to-scan-linux-server/
image: /wp-content/uploads/2015/03/clamav-trademark.png
categories:
  - Linux server
  - Security
---
`ClamAV` is an open source antivirus that allows you to detect trojans, rootkits and other nasty things.
`Clamscan` is a scanning module.

It can be installed from software repositories. In the case of RedHat/CentOS you need to [enable Epel.](epel-remi-atrpms-rhel-centos/)
```bash
yum install clamav clamav-clamav-update clamav-scanner
```

The release history is available at [http://pkgs.repoforge.org/clamav/](http://pkgs.repoforge.org/clamav/)

After installation you need to update it:
```bash
freshclam
```

The scan module has a bunch of options. You can check them with:
```bash
clamscan-help
```

Scanning is performed by the following command:
```bash
clamscan
```

If you want to scan files in a specific directory:
```bash
clamscan -r /home/
```

To write a log file:
```bash
clamscan -r /home/ -log=/var/log/clamscan.log
```

By default the module will display information about all files that it has scanned. It is quite convenient to use the `-i` switch and get information only about infected files.

Infected files can be copied or moved to the specified location on the server. For example:
```bash
clamscan -i -copy=/var/suspicious -r /home/ -log=/var/log/clamscan.log
```

or
```bash
clamscan -i -move=/var/infected -r /home/ -log=/var/log/clamscan.log
```

The `/var/infected` and `/var/suspicious` folders must exist.

Clamscan can be used to [check files uploaded via ftp.](/pureftpd-check-file-uploads-with-clamav/)