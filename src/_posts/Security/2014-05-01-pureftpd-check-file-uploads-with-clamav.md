---
id: 904
title: Configure ClamAV to scan files uploaded via FTP (PureFTPd)
date: 2014-05-01T17:32:56+00:00
author: admin

guid: http://www.tech-notes.net/?p=904
permalink: /pureftpd-check-file-uploads-with-clamav/
image: /wp-content/uploads/2014/05/ftp_logo.jpg
categories:
  - FTP
  - Security
tags:
  - clamav
  - PureFTPd
---
In this note I want to tell you how to configure the `ClamAV` antivirus to scan files that are uploaded to the server via `PureFTPD`.

The example is for `Linux Ubuntu`. For `CentOS` there won't be much difference.

First install `clamav`, update it and run:
```bash
apt-get install clamav clamav-daemon clamav-data
freshclam
service clamav-daemon start
```

Next you need to allow scripts to be executed when uploading files in the `PureFTPd` settings:
```bash
echo yes > /etc/pure-ftpd/conf/CallUploadScript
```

Now we create the script itself:
```bash
/etc/pure-ftpd/clam-checker
```

Here is the content:
```bash
#!/bin/sh
/usr/bin/clamdscan --remove --quiet --no-summary "$1"
```

Making it executable:
```bash
chmod +x /etc/pure-ftpd/clam-checker
```

Now open the file `/etc/default/pure-ftpd-common` in your favorite editor.
Find the `UPLOADSCRIPT` section in it and add the following line to it:
```bash
UPLOADSCRIPT=/etc/pure-ftpd/clam-checker
```

Restart `PureFTPD` and enjoy life:
```bash
/etc/init.d/pure-ftpd restart
```