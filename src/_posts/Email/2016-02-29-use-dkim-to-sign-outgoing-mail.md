---
id: 3213
title: Use DKIM signature for outgoing emails
date: 2016-02-29T11:39:38+00:00
author: admin

guid: http://www.tech-notes.net/?p=3213
permalink: /use-dkim-to-sign-outgoing-mail/
image: /wp-content/uploads/2016/02/dkim-logo.png
categories:
  - Email
tags:
  - dkim
  - exim
  - postfix
---
[Email spoofing](https://en.wikipedia.org/wiki/Email_spoofing) is the creation of email messages with a forged sender address. There are many services that provide protection from spoofing.

To be short it is possible to send email from any domain (including tech-notes.net) using the approach from [this article](/wordpress-contact-form/)

Today the most effective way to ensure the safety of the emails that originate under your domain is to use the combination of [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail) and [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework) DNS records.

**SPF** - is a [DNS record](https://en.wikipedia.org/wiki/Sender_Policy_Framework#Implementation) of the `TXT` type with the list of IP addresses or the domain names which are allowed to send outgoing emails form your domain

**DKIM** is using a way more fancy flow what includes encryption of your emails with the private key that is located on your relay server and decription of that emails by the target mails server using the public RSA certificate from the corresponding DNS record:
  * Public key for your domain is located in DNS
  * Private RSA key is located on the mail server

## How does it work DKIM?
As you know every letter has a set of headers. 
The origin mail daemon (sender) hashes these headers and signs them using a private RSA key for every email that is being sent. 
The destination mail server (receiver) checks whether the signature hash matches the hash of the public key in the DNS zone. Next receiver either accepts the email ot acts according to the configured settings (reject, drop, mark as spam).

### Why you should not ignore DKIM/SPF?
Email delivery is very important for online shops. If order confirmation emails are not delivered to customers then people may simply refuse to purchase from your store.
Also continious greylisting affects the delivery of promo newsletters that reduces the amount of sales.

## What should I do?
DKIM configuration includes the following steps:
1. Create a pair of RSA keys that will be used to sign and validate outgoing mail.
1. Create a DNS record containing the public key
1. Configure the email daemon to use a private key to sign outgoing mail

### 1. Create a pair of RSA keys
Use `openssl` in linux:

```bash
openssl genrsa -out /etc/ssl/private/**example.com**-private.pem 1024 -outform PEM  
openssl rsa -in /etc/ssl/private/**example.com**-private.pem -out /etc/ssl/certs/**example.com**-public.pem -pubout -outform PEM
```

Alternatively you can use any [online generator.](https://www.port25.com/support/domainkeysdkim-wizard/)

You'll end up with two files:
1. **/etc/ssl/private/example.com-private.pem** - private key
2. **/etc/ssl/certs/example.com-public.pem** - public key

### 2. Create a DNS record
Read the public key
```bash
cat /etc/ssl/certs/example.com-public.pem
```

It looks like the following:
```bash
--BEGIN PUBLIC KEY--  
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6MA3nwnUY9xdxftjSezCw0qgF  
8D2dwroEwc5fB/eI3JPdN3c9vAW37e6WpWEao9MEczGzMOj78SLQSKlXyQEtM4N2  
/Fld/fRve+iZJzT481jK9U34vZGYTUxWe2wHlUQHV8Vc1yDASF/1zpZg1ePMOCc7  
N+ocXzhSTQxo0c8jqwIDAQAB  
--END PUBLIC KEY--
```

We need tha part between the tags:
```bash
--BEGIN PUBLIC KEY--  
...
--END PUBLIC KEY--
```

This will be used as a value for the TXT DNS record
Next create the DNS record with it
1. **emailrelay**: _key1_._domainkey.example.com  
  You can use anything as a value for _key1_. Possible options are the following:
      * name of the server
      * current date
      * your pet name
2. **Type**: TXT
3. **Value**:`"k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6MA3nwnUY9xdxftjSezCw0qgF8D2dwroEwc5fB/eI3JPdN3c9vAW37e6WpWEao9MEczGzMOj78SLQSKlXyQEtM4N2/Fld/fRve+iZJzT481jK9U34vZGYTUxWe2wHlUQHV8Vc1yDASF/1zpZg1ePMOCc7N+ocXzhSTQxo0c8jqwIDAQAB"`  

You'll need to give it a while for changes to propagate across the world. THe following website can be used to check the DNS propagation:
[https://www.whatsmydns.net/#TXT/](https://www.whatsmydns.net/#TXT/)

### 3. Configure the email daemon to use a private key to sign outgoing mail.

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Exim
  </div>
  <div class="spoiler-body">
  Create file `/etc/exim4/conf.d/main/00_local_macros` with the following contexts:
  <pre>    DKIM_CANON = relaxed
    DKIM_SELECTOR = key1
    DKIM_DOMAIN = example.com
    DKIM_FILE = /etc/ssl/private/example.com-private.pem</pre>
  Pay attention to `DKIM_SELECTOR`.
  Run the following to apply the changes:
  <pre>
    update-exim4.conf
    service exim4 restart
  </pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Postfix
  </div>
  <div class="spoiler-body">

  Install `opendkim`
  <pre>
    apt-get install opendkim opendkim-tools
  </pre>

  Edit config file `/etc/opendkim.conf`:

  <pre>
    Domain example.com
    KeyFile /etc/ssl/private/example.com-private.pem
    Selector key1
    SOCKET inet:8891@localhost
  </pre>

  If your server sends mail on behalf of several domains then they must be described in the same file otherwise `opendkim` will ignore them.
  It is not a problem to use one key for all domains on your server

  Edit `/etc/default/opendkim` file. You need to change the default socket. Add the following at the end of the line:

  <pre>
    SOCKET=`inet:8891@localhost`
  </pre>

  Edit Postfix config file (`/etc/postfix/main.cf`):

  <pre>
    # DKIM
    milter_default_action = accept
    milter_protocol = 2
    smtpd_milters = inet:localhost:8891
    non_smtpd_milters = inet:localhost:8891
  </pre>

  <pre>
    chmod 600 /etc/ssl/private/example.com-private.pem
  </pre>

  Next restart `postfix` and `opendkim` to apply the changes.

  <pre>
    service opendkim restart
    service postfix restart
  </pre>

  There is a good article at [HoToForge how to install OpenDkim from the source code](https://www.howtoforge.com/set-up-dkim-domainkeys-identified-mail-working-with-postfix-on-centos-using-opendkim).
  </div>
</div>

At the end the email headers look like the following:
<img src="/wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815.png" alt="Screenshot from 2016-03-01 11:48:15" width="693" height="537" class="aligncenter size-full wp-image-3226" srcset="/wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815.png 693w, /wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815-170x132.png 170w, /wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815-300x232.png 300w" sizes="(max-width: 693px) 100vw, 693px" />

External links:
<ol>
  <li>
    <a href="https://www.debian-administration.org/article/718/DKIM-signing_outgoing_mail_with_exim4">debian-administration.org/DKIM-signing_outgoing_mail_with_exim4</a>
  </li>
  <li>
    a href="http://mikepultz.com/2010/02/using-dkim-in-exim/">mikepultz.com/using-dkim-in-exim</a>
  </li>
  <li>
    <a href="https://easyengine.io/tutorials/mail/dkim-postfix-ubuntu/">easyengine.ios/dkim-postfix-ubuntu</a>
  </li>
</ol>
