---
id: 2623
title: How to find the script that is spamming via postfix
date: 2015-05-22T10:29:23+00:00
author: admin

guid: http://www.tech-notes.net/?p=2623
permalink: /postfix-sends-spam/
image: /wp-content/uploads/2014/05/managing-postfix.jpg
categories:
  - Mail
  - Security
tags:
  - postfix
---
If you find that your `postfix` server keeps sending and you understand that you have been scammed. Pretty disgusting state of affairs.

Usually the spam mailing is launched by some kind of script.

Dont be upset. You can determine which script initializes the mailing list.

To do this, switch to the superuser account:
```bash
sudo su
```

Check the distribution queue:
```bash
mailq|less
```

> `less` will allow you to view the entire queue if the output of the command does not fit on the screen. Press `q` to exit.

The first column will contain the ID of the messages in the queue to be sent.

<center>
  <div id="gads">
  </div>
</center>

You can view the contents of the email with:
```bash
postcat -q <ID>
```

Looking for something similar to `X-PHP-Originating-Script` or `X-Originating-Script`.

It has left to remove the scripts and clear the mailing queue:
```bash
for m in $(/usr/bin/mailq 2&gt;&1 |grep -v postqueue |grep -i "^[1-9]\|^[A-Z]\|^0" |awk '{print $1}') ;
do
  if (/usr/sbin/postcat -q $m |grep X-PHP-Originating-Script |grep -q eval); then
/usr/sbin/postsuper -d $m;
  fi;
done
```

By the way, this script is a very good crutch if you schedule it to run every minute. In this case the send queue will be constantly monitored and cleared.

You can completely clear the queue with the following command:
```bash
postsuper -d ALL
```

Unfortunately the troubles don't end there. Now you need to determine how the malware got onto the server. To do this look at the apache logs and system logs. Review scheduled tasks (cron jobs).

The following articles may also be helpful:
  1. [Cure an infected site/server](http://www.tech-notes.net/fix-compromized-server/)
  2. [Scanning a Server with Rkhunter](http://www.tech-notes.net/scan-linux-server-with-rkhunter/)
  3. [Scanning a Server with Chkrootkit](http://www.tech-notes.net/scan-linux-server-with-chrootkit/)

It is strongly recommended to update everything that is possible (website engines, php, apache).

[fail2ban](http://www.tech-notes.net/fail2ban-configuration/) and [mod_security](http://www.tech-notes.net/install-modsecurity-for-apache/ )

All the best and successful projects!