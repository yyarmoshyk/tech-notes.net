---
id: 49
title: DNS MX record
date: 2013-12-13T20:05:36+00:00
author: admin

guid: http://wp38.local/?p=49
permalink: /dns-mx-record/
attitude_sidebarlayout:
  - default
image: /wp-content/uploads/2013/10/dns_control.jpg
categories:
  - DNS MX
---
**What is an MX record and what does it stand for?**

This is a combination of letters and numbers that determines the route that mail goes to for a particular web domain.

It consists of the target (an IP address or the destination mail server dns) and a priority for the entry.

Priority is a number that determines which server will be used as the mail delivery destination in case multiple servers/records are used. The highest priority is determined by the lowest value. If there are two server records where the first one has a priority of 10 and the second one has a priority of 20 then at first any mailer will deliver email to the server with a priority of 10.

If there is no MX record for the domain then mail is delivered according to the A record in DNS.

<center>
  <div id="gads">
  </div>
</center>

**What is it for?**

Let's say your site is hosted somewhere on shared hosting by `GoDaddy`. At the same time, you have a cool mail account on some of the mail services (let's say gmail). The mere existence of a mailbox containing your domain name does not imply delivery of mail to it. In order for this to work you need to create the appropriate MX records for the mail service.

Second example: there is mail on the server along with the web site. It is planned to move to another hosting or tariff plan and change the ip address. The mail is very important. The DNS zone describes an MX record for the first (source) server or mail account with a priority of 10. During the DNS switch to a new server, some mail may be lost during the so-called `DNS propagation`. A day before the move, you can add a second MX record to the DNS zone with the ip address of the new server and priority 20. In this case, after switching DNS to the new server all mailers will know about the second mail server and those before which DNS changes about the first record have not yet reached will deliver mail to the second server. In this case, the mail service on the source server must be stopped, or mail accounts must be disabled in the control panel.