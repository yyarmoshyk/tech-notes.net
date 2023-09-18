---
id: 2330
title: Certificate verification error in Lftp
date: 2015-01-28T14:29:39+00:00
author: admin

canonical_url: 'https://www.tech-notes.net/lftp-certificate-verification-error/'

permalink: /lftp-certificate-verification-error/
image: /wp-content/uploads/2014/09/thinknook-new-logo3.png
categories:
   - FTP
---
Today I encountered the following message while working normally with lftp:
```bash
ls: Fatal error: Certificate verification: Not trusted
```

It can be quickly fixed like this:
1. launch the lftp console:
```bash
lftp
```
1. Disable certificate verification:
```bash
set ssl:verify-certificate no
```
1. Connect to the server:
```bash
open user@ip_address
```

In order to consolidate the material you have covered and not return to it again, create a folder `~/.lftp/`
```bash
mkdir ~/.lftp/
```

Create a file in the folder:
```bash
nano ~/.lftp/rc
```

File contents:
```bash
set ssl:verify-certificate no
```