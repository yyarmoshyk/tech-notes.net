---
id: 3178
title: Scan server with Lynis
date: 2016-02-15T14:18:30+00:00
author: admin

guid: http://www.tech-notes.net/?p=3178
permalink: /scan-linux-server-with-lynis/
image: /wp-content/uploads/2015/02/1435.png
categories:
  - Linux Server
  - Security
tags:
  - Lynis
  - rkhunter
---
`Lynis` (formerly `RkHunter`) is a security auditing tool for Linux and BSD systems. It performs a detailed audit of many aspects of your system's security and configuration. Download the latest Lynis sources from [https://cisofy.com/download/lynis/](https://cisofy.com/download/lynis/)

Lynis does not require installation, just download and unzip it:
```bash
cd /tmp
wget -no-check-certificate https://cisofy.com/files/lynis-2.2.0.tar.gz
tar xvfz lynis-2.2.0.tar.gz
mv lynis /usr/local/
ln -s /usr/local/lynis/lynis /usr/local/bin/lynis
```

Checking for new versions:
```bash
lynis update info
```

Run the following command to run a system audit:
```bash
lynis audit system
```

In this mode, Lynis will wait until you see the scan results for each block and press the `Enter` key

To be able to drink coffee while Lynis is running, start it with the `-quick` switch
```bash
lynis-quick
```

And of course, you can create a `cron` task to perform a scan every day:
```bash
0 3 \* \* * /usr/local/bin/lynis -quick 2>&1 | mail -s `lynis output of my server` you@yourdomain.com
```