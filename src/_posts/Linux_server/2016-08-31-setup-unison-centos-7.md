---
id: 3404
title: Setup Unison in CentOS 7
date: 2016-08-31T11:06:55+00:00
author: "Yaroslav Yarmoshyk"

guid: http://www.tech-notes.net/?p=3404
permalink: /setup-unison-centos-7/
image: /wp-content/uploads/2016/08/unison.png
categories:
  - Linux server
tags:
  - unison
  - master-master file replication
---
`Unison` is one of the utilities that is used to replicate files between servers. A big advantage of Unison is its support for master-master replication.

Until recently, Unison was available in the `Epel` repository, but for unknown reasons it is no longer there, so it is suggested to compile it from the source.

Prepare first:
```bash
yum install ocaml ocaml-camlp4-devel ctags ctags-etags
```

Download and make `Unison`:

```bash
cd /usr/src  
wget http://www.seas.upenn.edu/~bcpierce/unison//download/releases/stable/unison-2.48.4.tar.gz  
tar xvfz unison-2.48.4.tar.gz  
cd src  
make
```

```bash
sudo cp -v unison /usr/local/sbin/  
sudo cp -v unison /usr/bin
```

You got to do the steps above to copy the binary into one of the `$PATH` folders to avoid the following error:
```bash
Contacting server ...
bash: unison: command not found  
Fatal error: Lost connection with the server
```

Create configuration folder:
```bash
mkdir ~/.unison/  
cd ~/.unison/
```

Create configuration file to sync with server `web2`:
```bash
vim sync-web2.prf
```

<center>
  <div id="gads">
  </div>
</center>


File contents:
```bash
# Reasonable defaults
auto=true
confirmbigdeletes=true
contactquietly=true
group=true
maxthreads=20
numericids=true
owner=true
times=true

# Skip confirmation
batch=true

# Suppress output (sets batch=true)
silent=true

# Run in a loop, repeating every X seconds (sort of daemon mode)
#repeat=60

# Log all sync operations
log=true
logfile=/var/log/unison.log

# Backup deleted files
backup=Name *
backuplocation=central
backupdir=/var/www/unison-backups/
maxbackups=2

# Local root
root=/var/www/vhosts/website_name/

# Remote root (the double forward-slash between IP and remote path is correct)
root=ssh://web2_ip_address/var/www/vhosts/website_name/

# Resolve conflicts in favor of local root
prefer=newer

# Don't sync (can specify multiple ignore lines)
#ignore=Path */var/cache
ignore=Path anon_ftp
ignore=Path bin
ignore=Path conf
ignore=Path error_docs
ignore=Path httpsdocs
ignore=Path statistics
ignore=Path subdomains
ignore=Path web_users
ignore=Path tmp/session
ignore=Path tmp/cache    
ignore=Path tmp/page_parse_time.log
ignore=Path tmp/sessionsadmin
ignore=Path rewrite.log
```
You got to customize the following values:
* Local root
* Remote root

Run the following to sync:
```bash
unison sync-web2
```

Create cron task to run the sync periodically (every 10 minutes)
```bash
crontab -e  
*/10 * * * * unison sync-web2 2>&1 > /dev/null
```

or even more often (every minute):
```
* * * * * unison sync-web2 2>&1 > /dev/null
```

[https://www.digitalocean.com/community/questions/install-unison-in-centos-7](https://www.digitalocean.com/community/questions/install-unison-in-centos-7)
