---
id: 3337
title: Postfix change sender domain
date: 2016-06-17T08:10:03+00:00
author: admin

guid: http://www.tech-notes.net/?p=3337
permalink: /postfix-change-sender-domain/
image: /wp-content/uploads/2014/05/managing-postfix.jpg
categories:
  - Email
tags:
  - postfix
---
Out of the box `postfix` is sending emails using the domain name that is returned by the following command in the linux shell:
```bash
uname -n
```

In this case, the sender is the system user that runs the script.

An example could be `www-data@localhost.localdomain`.

In order to change the domain that will appear in sent letters and the name of the user from whom the sending is made, you need to edit the file `/etc/postfix/main.cf` with the following line:

```bash
smtp_generic_maps = hash:/etc/postfix/generic
```

After that, edit the file `/etc/postfix/generic`

```bash
www-data@localhost.localdomain info@domain.com
```

Then run the following:

```bash
postmap /etc/postfix/generic
```

And restart postfix for the changes to take effect:
```bash
service postfix restart
```