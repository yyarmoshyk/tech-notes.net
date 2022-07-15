---
id: 1905
title: 'Backup webiste to Dropbox'
date: 2014-10-10T13:55:37+00:00
author: admin

guid: http://www.tech-notes.net/?p=1905
permalink: /backup-website-with-upload-to-dropbox/
image: /wp-content/uploads/2014/10/backup.jpg
categories:
  - Linux server
tags:
  - backup
  - Backup to Dropbox
---
The other day I was wondering about the correct backup of several WordPress sites and then uploading them to some free storage. I would like it to be done without additional plugins.

The [Dropbox](https://db.tt/6rZRpi2U) was selected as a storage. By default you are provided with 2Gb of space as part of a free account. If you need more space than you can buy it for relatively little money. As a rule the disk space is quite cheap from hosting providers.

For my needs 2Gb is more than enough. There are several plugins for CMS WordPress that can do everything themselves but I didn’t like any of them because I kept archives in the site folder while each next backup increased by the size of the previous one and the site size quickly exceeded the allowable quota.

I decided to implement backup by myself. Moreover I had to archive several sites.

**Step 1**: Register on [Dropbox](https://db.tt/6rZRpi2U)
**Step 2**: Download the file upload script from [github.com](https://github.com/andreafabrizi/Dropbox-Uploader)

```bash
curl `https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh` -o dropbox_uploader
```

Make the file executable:
```bash
chmod +x dropbox_uploader
```

Run and follow the instructions (everything is quite simple):
```bash
./dropbox_uploader
```

It remains a mystery to me why DropDox was unable to deliver the account verification email to the Gmail inbox.

**Step 3:** We set up a script that will do a direct backup and pull `dropbox_uploader` to upload data.

The script will make a [backup of all mysql databases](/backup-restore-all-mysql-databases/), compress all site folders with `tar`, fill it all in `DropBox`, send an email notification and delete old backups from DropBox.

My strategy was the following:
* Backup starts at midnight on Monday, Wednesday and Friday
* backups are kept for 7 days, then deleted (replaced by new ones)
* backup created on the 30th of the month is stored forever

Script:
* calculates that folders with sites are stored in /var/www;
* uses the mail utility to send a report to the mail;
* Temporary files located in /var/backup/server;
* Application in DropBox is called _backup_;

If something is different in your case - edit the script accordingly.

First, make sure you have mailutils installed:
```bash
apt-get install mailutils
```

Then create folders:
```bash
mkdir -p /var/backups/server/files/
mkdir -p /var/backups/server/databases/
```

Downloading the script:
```bash
wget http://www.tech-notes.net/wp-content/uploads/2014/10/backup
```

Making the file executable:
```bash
chmod +x backup
```

You can open the file and enter your email in the second line to receive notifications about the successful completion of the operation.
```bash
mail='your@mail.com'
```

It remains to schedule the periodic execution of the script using crontab:
```bash
crontab -e
```

I backup on Mondays, Wednesdays and Fridays, so in my case it's:
```bash
0 0 \* \* 1,3,5 /root/backup
```

That's all.