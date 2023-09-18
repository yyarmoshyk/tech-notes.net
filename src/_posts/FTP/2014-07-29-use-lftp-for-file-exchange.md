---
id: 1325
title: Usage of lftp to work with files on ftp server from Linux
date: 2014-07-29T09:09:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=1325
permalink: /use-lftp-for-file-exchange/
image: /wp-content/uploads/2014/07/ftp-logo_thumb2.jpg
categories:
  - FTP
tags:
  - lftp
---
`lftp` is a command line utility that allows you to exchange data with ftp and http servers. `lftp` has mirroring functionality that allows you to load or recursively update a directory tree. It also has reverse mirroring functionality (`mirror -R`), which allows you to recursively update a directory tree on a remote server. Mirroring also allows you to synchronize folders between two remote servers.

Usage syntax:
```bash
mirror  
mirror options  
mirror -c  
mirror -R
```

## For example: How to download all files from a remote server?

Establish connection:
```bash
lftp ftp.server.com
```

Enter login and password:
```bash
lftp ftp.server.com:~> user username@ftp.server.com  
Password:
```

The expected responce from the server is the following:
```bash
lftp username@ftp.server.com:~>  
Type ls command to see a list of files:
```

Use `ls` to list the contexts of the current catalogue:
```bash
lftp ftp.server.com:~> ls
```

Expected response:
```bash
-rw-r-r- 1 80 www 36809419 Jun 24 23:59 file1.ext  
-rw-r-r- 1 80 www 100912271 Jun 25 23:59 file2.ext  
-rw-r-r- 1 80 www 102926055 Jun 26 23:59 file3.ext
```

Use `mirror` to download all files to the current folder:
```bash
lftp ftp.server.com:~> mirror
```

You can specify the source directory and the folder where you want to place the downloaded files (destination directory). If the destination directory ends with a `/` (slash) character, then the name of the source directory will be appended to it.
```bash
lftp ftp.server.com:~> mirror source target
```

or
```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs
```

In this case, all files from the `logs` folder on the source server will be copied to the `/data/wwwlogs` folder on the current one.

With the following syntax all files from the `logs` folder will be copied to the `/data/wwwlogs/logs` folder
```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs/
```

## Resume download
It is recommended to use mirror with the resume download option enabled, in this case you will not have to re-download all files if the connection is lost or the data transfer is interrupted:
```bash
lftp ftp.server.com:~> mirror -c source target
```

or
```bash
lftp ftp.server.com:~> mirror -continue
```

## Download only new/updated files
In order to download only new/updated files, use the `only-newer` key:
```bash
lftp ftp.server.com:~> mirror -only-newer
```

or
```bash
lftp ftp.server.com:~> mirror -n
```

## Parallel downloads
You can speed up the mirroring operation by enabling parallel downloads or downloading files into multiple threads:
```bash
lftp ftp.server.com:~> mirror -P
```

Parallel download of 10 files:
```bash
lftp ftp.server.com:~> mirror -parallel=10
```


## Publish/upload files to remote

Use the key `-R` or `-reverse`

Go to desired folder (in this example it is `/home/project/website/version5/`):

```bash
lftp ftp.server.com:~> lcd /home/project/website/version5/
```

Expected output is the following:
```bash
lcd ok, local cwd=/home/project/website/version5
```

Upload syntax:
```bash
lftp ftp.server.com:~> mirror -R
```

You can specify local and remote folder:

```bash
lftp ftp.server.com~> mirror -R /home/user/projects/website /var/www/html
```

Oneliner command in bash:
```bash
lftp -e 'mirror -parallel=10 -R /home/user/projects/website /var/www/html' -u логин,пароль адрес_сервера
```

If you receive the following error while working with a remote server
```bash
521 Data connection cannot be opened with this PROT setting.
```

Than do the following and re-try the operation:
```bash
set ftp:ssl-force true  
set ftp:ssl-protect-data true
```
