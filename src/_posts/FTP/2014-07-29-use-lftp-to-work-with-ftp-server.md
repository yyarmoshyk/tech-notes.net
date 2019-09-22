---
title: "Use lftp to work with files on ftp server in Linux"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "Usefull tips about lftp usage"
last_modified_at: 2014-07-29T00:00:00-00:00
toc: false
categories:
  - FTP
tags:
  - lftp
  - ftp
  - bash
redirect_from:
  - /use-lftp-for-file-exchange/
---

`Lftp` - is a CLI tool that allows to exchange files with ftp and http server. `Lftp` supports mirroring that allows to upload/download files recursively. It also supports backward mirroring (`mirror -R`) that allows to upload our update the folder recursively. Mirorring allows to synchronize the particular folder between 2 remote servers.

The syntax is the following:
```bash
mirror
mirror options
mirror -c
mirror -R

```

### Download all files from remote server
Make connection to the server:
```bash
lftp <strong>ftp.server.com</strong>
```

Enter username and password:

```bash
lftp ftp.server.com:~> user username@ftp.server.com
Password:
```

The result should look like the following:
```bash
lftp username@ftp.server.com:~>
Type ls command to see a list of files:

```

Enter `ls` to list the files:
```bash
lftp ftp.server.com:~> ls
```

The output will look like the following:

```bash
-rw-r--r--    1 80       www      36809419   Jun 24 23:59 file1.ext
-rw-r--r--    1 80       www      100912271 Jun 25 23:59 file2.ext
-rw-r--r--    1 80       www      102926055 Jun 26 23:59 file3.ext
```

In order to download all files to the local PC use  `mirror`:
```bash
lftp ftp.server.com:~> mirror
```

You can specify the source (origin of the files on the remote server) and target (local folder where you'd like to locate files) folders:
```bash
lftp ftp.server.com:~> mirror source target
```
or
```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs
```

In this case all files from `logs` folder on the remote server will be copied int `/data/wwwlogs` folder on the current PC.

Please note that using trailing slash (`/`) will copy all files from `logs` folder to `/data/wwwlogs/logs`
```bash
lftp ftp.server.com:~> mirror logs/ /data/wwwlogs/
```

It is recommended to use `mirror` with enabled option to continue download. In this case you will not need to re-transfer all files if connection gets interrupted.

```bash
lftp ftp.server.com:~> mirror -c source target
```

or

```bash
lftp ftp.server.com:~> mirror --continue
```

If you need to download only new files than use `--only-newer` key:
```bash
lftp ftp.server.com:~> mirror --only-newer
```

or
```bash
lftp ftp.server.com:~> mirror -n
```

You can increase the mirroring speed by enabling parallel transfer:
```bash
lftp ftp.server.com:~> mirror -P
```

The following command will run mirroring in 10 parallel processes:

```bash
lftp ftp.server.com:~> mirror --parallel=10
```

Mirror only new files from the remote server in 10 parallel threads:
```bash
mirror --continue --only-newer --parallel=5 source target
```

### Upload local files to the remote server with lftp
The `-R` or `--reverse` key should be used to upload files from the local storage to the remote server
First login to the remote ftp server
```bash
lftp <strong>ftp.server.com</strong>
lftp ftp.server.com:~> user username@ftp.server.com
Password:
```

Lead to the desired folder (in this example I'm using `/home/project/website/version5/`):

```bash
lftp ftp.server.com:~> lcd /home/project/website/version5/
```

The sample output:
```bash
lcd ok, local cwd=/home/project/website/version5
```

The following can be used to upload files to the remote ftp server:
```bash
lftp ftp.server.com:~> mirror -R
```

You can specify local and remote catalog (in this example `/home/user/projects/website` => `/var/www/html`)
```bash
lftp ftp.server.com~> mirror -R /home/user/projects/website /var/www/html
```

Single command:
```bash
lftp -e 'mirror --parallel=10 -R /home/user/projects/website /var/www/html' -u login,password ftp.example.com
```

The following problem:
```bash
 521 Data connection cannot be opened with this PROT setting.
```

Can be resolved by running the following set of commands:
```bash
set ftp:ssl-force true
set ftp:ssl-protect-data true
```
