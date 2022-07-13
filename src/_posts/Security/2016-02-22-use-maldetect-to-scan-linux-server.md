---
id: 3199
title: Scan Linux server with maldetect
date: 2016-02-22T18:35:37+00:00
author: admin

guid: http://www.tech-notes.net/?p=3199
permalink: /use-maldetect-to-scan-linux-server/
image: /wp-content/uploads/2016/02/malware.png
categories:
  - Linux server
  - Security
tags:
  - maldet
  - maldetect
---
`Malware Detect` (LMD) is a utility that scans Linux systems for malicious files (malware). Distributed under the GNU GPLv2 license.

`MalDetect` can use data from intrusion detection systems to extract malicious code (malware). It can also use the anti-virus base of other scanners, such as `ClamAV`.

MalDetect is not available in the software repository, so you need to download and install it manually:

```bash
cd /usr/local/src; wget http://www.rfxn.com/downloads/maldetect-current.tar.gz
tar -xzf maldetect-current.tar.gz; cd maldetect-*
sh ./install.sh; cd../
rm -rf maldetect -*
```

Update after installation:
```bash
maldet-update-ver
maldet-update
```

Scanning is performed as follows:
```bash
maldet -a /home?/?/public_html
```

or like this:
```bash
maldet -a /var/www/
```

Each scan is assigned a unique ID.

`MalDetect` does not delete files during a scan. At the end of each scan, you will receive a command with which you can view the scan log.

Something in the style:

```bash
maldet -report %report.ID%
```

In order to remove the detected files, you need to run the following command:

```bash
maldet -q %report.ID%
```