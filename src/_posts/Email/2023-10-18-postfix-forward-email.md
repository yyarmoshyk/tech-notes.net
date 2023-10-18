---
id: 3337
title: Configuring Postfix Mail Forwarding Domains
date: 2016-06-17T08:10:03+00:00
author: 

guid: http://www.tech-notes.net/?p=3337
permalink: /postfix-forward-email-to-domain/
categories:
  - Email
tags:
  - postfix
---
## Introduction
Configuring Postfix mail forwarding domains is a practical solution for situations where local mailboxes are not available, and the server is not serving as an MX backup. This article guides you through the process of setting up mail forwarding domains, with a focus on forwarding emails to designated destinations. Please note that this guide should not be used if you have relay_domains configured through SQL mapping or virtual mapping.

## Setting Up a Mail Forwarding Domain
To establish a mail forwarding domain, let's take the example of configuring tech-notes.net for mail forwarding. Follow these steps:

Edit the `/etc/postfix/main.cf` file and ensure that the following two lines exist in it:

```bash
virtual_alias_domains = tech-notes.net
virtual_alias_maps = hash:/etc/postfix/virtual
```
You can specify more values for `virtual_alias_domains` separating them by space.

Edit the `/etc/postfix/virtual` file and set up email forwarding for `admin@tech-notes.net` to `username@gmail.com` as follows:
```bash
admin@tech-notes.net   username@gmail.com
```

If you need to implement a catch-all address for emails sent to `username1@domain.com` and `username2@domain.com`, forward them to `catch-all@another_domain.com` like this:
```bash
@domain.com         catch-all@another_domain.com
```
Save and close the `/etc/postfix/virtual` file.

Run the following command to update the virtual mapping:
```bash
postmap /etc/postfix/virtual
```

Restart the Postfix to apply the change
```bash
service postfix reload
```

By following these steps, you can easily configure Postfix to forward emails to specific destinations or catch-all addresses, depending on your server's requirements.




