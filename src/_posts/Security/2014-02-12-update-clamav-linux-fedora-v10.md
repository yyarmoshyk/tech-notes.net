---
id: 466
title: clamav update on Linux Fedora v.10
date: 2014-02-12T15:16:52+00:00
author: admin

guid: http://www.tech-notes.net/?p=466
permalink: /update-clamav-linux-fedora-v10/
categories:
   - Security
---
I got the folllwoing message in Fedora Linux while running `freshclam`:

```bash
ERROR: Please edit the example config file /etc/clamav/freshclam.conf
ERROR: Can't open/parse the config file /etc/clamav.conf
```

In order for the updater to work, you need to remove the word `Example` from the file:
`/etc/clamav/freshclam.conf`