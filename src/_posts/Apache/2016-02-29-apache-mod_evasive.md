---
id: 602
title: Install Apache mod_evasive.
date: 2016-02-29T09:09:38+00:00
author: yaroslav.yarmoshyk

guid: http://www.tech-notes.net/?p=602
permalink: /apache-mod_evasive/
image: /wp-content/uploads/2016/02/images.jpg
categories:
  - Apache
---
## Description
`Mod_evasive`, formerly known as `mod_dosevasive`, helps to safeguard your `Apache` web server against `DoS`, `DDoS` (Distributed Denial of Service), and brute force attacks. It's designed to take action during an attack and even alert you via email.

The module works by creating an internal dynamic table of IP addresses and URIs, as well as blocking IP addresses based on the following actions:
* Requesting the same page more than a few times per second.
* Creating more than 50 concurrent requests to the same child per second.
* Making any requests while temporarily blacklisted.

## Installation
To install mod_evasive on RHEL/CentOS systems, use the following command:
```bash
yum install mod_evasive
```

If you're using Debian/Ubuntu, you can install mod_evasive with the following command
```bash
apt-get install libapache2-mod-evasive
```

## Configuration
The configuration file for mod_evasive is named mod_evasive.conf and can be found in your web server's configuration directory. For instance:

```bash
/etc/httpd/conf.d/mod_evasive.conf
```

Here's an example of the configuration settings:
```bash
<ifmodule mod_evasive20.c>
  DOSHashTableSize 3097
  DOSPageCount 5
  DOSSiteCount 50
  DOSPageInterval 1
  DOSSiteInterval 1
  DOSBlockingPeriod 90
  DOSLogDir /var/log/apache2/mod_evasive
  DOSWhitelist 127.0.0.1
</ifmodule>
```


Explanation of Configuration Parameters
* **DOSHashTableSize**: This sets the size of the hash table used to store IP addresses and URIs.
* **DOSPageCount**: Defines the maximum number of requests allowed from a single IP to a single page within a specific time interval.
* **DOSPageInterval**: The time interval considered for DOSPageCount.
* **DOSSiteCount**: Specifies the maximum number of requests allowed from a single IP to the entire site within a specific time interval.
* **DOSSiteInterval**: The time interval considered for DOSSiteCount.
* **DOSBlockingPeriod**: This determines the time duration an attacking IP is blocked.
* **DOSEmailNotify**: You can set an email address here to receive notifications about attacks.
* **DOSLogDir**: This is the directory where logs will be stored.
* **DOSWhitelist**: You can provide a list of IP addresses that are exempt from these protective measures.

## Testing
To assess the effectiveness of mod_dosevasive, you can use the `Perl` script provided below:
```perl
#!/usr/bin/perl
# test.pl: small script to test mod_dosevasive's effectiveness  
use IO::Socket; use strict;  
for(0..100) {
  my($response);
  my($SOCKET) = new IO::Socket::INET( Proto ="tcp", PeerAddr=> "127.0.0.1:80");
  if (! defined $SOCKET) {
    die $!;
  }
  print $SOCKET "GET /?$_ HTTP/1.0\n\n";
  $response = <$SOCKET>;
  print $response;
  close($SOCKET);
}
```
This script simulates a series of requests to evaluate how the module reacts to them.