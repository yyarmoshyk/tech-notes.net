---
id: 3230
title: How to configure Exim to use SendGrid to send mail
date: 2016-03-01T13:26:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=3230
permalink: /configure-exim-to-use-sendgrid/
image: /wp-content/uploads/2016/03/exim-logo.png
categories:
  - Email
tags:
  - Exim
  - Sendgrid
  - WHM
---
I continue my series of articles about email services until the inspiration from the recently solved problems wears off.

I have already described how to [configure PostFix to send mail via MailGun](http://www.tech-notes.net/configure-postfix-use-mailgun/).

This article will discuss how to configure `Exim` to use the [SendGrid](https://sendgrid.com/) mail delivery service.

The description of setting up different mail services on different mail daemons coincides very well.

I have a server with WHM + Exim panel. I signed up for a free account with SendGrid.

First, in the WHM panel, find `Exim Configuration Manager`
<img src="/wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938.png" alt="Screenshot from 2016-03-01 13:59:38" width="412 " height="301" class="aligncenter size-full wp-image-3232" srcset="/wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938.png 412w, /wp -content/uploads/2016/03/Screenshot-from-2016-03-01-135938-170x124.png 170w, /wp-content/uploads/2016/03/Screenshot-from-2016-03-01-135938-300x219 .png 300w" sizes="(max-width: 412px) 100vw, 412px" />

Go to the ``Advanced Editor`` tab and look for the ``Section: AUTH`` section. In the text field you need to insert information for authorization in sendgrid:

```bash
sendgrid_login:
   driver = plaintext
   public_name = LOGIN
   client_send = : login@email.com : %password%
```


Next we look for the section ``Section: ROUTERSTART``. We insert the following into it:

```bash
send_via_sendgrid:
   driver=manualroute
   domains = ! +local_domains
   transport = sendgrid_smtp
   route_list = "* smtp.sendgrid.net::587 byname"
   host_find_failed = defer
   no_more
```


All that remains is to specify the transport. To do this, find ``Section: TRANSPORTSTART`` and enter the following in the text field:
```bash
sendgrid_smtp:
   driver = smtp
   hosts = smtp.sendgrid.net
   hosts_require_auth = smtp.sendgrid.net
   hosts_require_tls = smtp.sendgrid.net

```


If you want to [use DKIM](http://www.tech-notes.net/use-dkim-to-sign-outgoing-mail/) then `TRANSPORTSTART` is exactly the place to add the configuration:

```bash
DKIM_CANON = relaxed
DKIM_SELECTOR = key1
DKIM_DOMAIN = example.com
DKIM_FILE = /etc/ssl/private/example.com-private.pem
```