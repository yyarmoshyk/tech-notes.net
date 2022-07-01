---
id: 503
title: Fail2Ban configuration
date: 2014-02-17T21:24:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=503
permalink: /fail2ban-configuration/
image: /wp-content/uploads/2014/02/Screenshot-from-2014-02-17-145443.png
categories:
  - Linux server
tags:
  - linux
  - fail2ban
---
Fail2Ban is a software written in Python which is designed to prevent attacks on the server. It reads ssh, ftp, apache log files and blocks ip addresses by adding DROP rules into iptables depending on the settings.

It can be very useful to block the hell out of ip addresses of potential bots, brute forcers and other villains who are trying to gain control over your server illegally and against your will.

So, all further steps were done on Linux CentOS v.5.8.

Install:
```bash
yum install fail2ban
```

All configuration files are located in the `/etc/fail2ban` folder. The file that we will pick is `/etc/fail2ban/jail.conf`.
Exceptions:
```bash
ignoreip = 127.0.0.1 10.0.0.0/8 %your_ip_address%
```

Ban time = 1 hour

```bash
bantime = 3600
```

The ssh daemon protection is enabled by default from the box. The secton looks like the following:
```bash
[ssh-iptables]  
enabled = true  
filter = sshd  
action = iptables[name=SSH, port=ssh, protocol=tcp]  
sendmail-whois[name=SSH, dest=root, sender=fail2ban@example.com, sendername=Fail2Ban]  
logpath = /var/log/secure  
maxretry = 5
```
Details: 
* **enabled** - accepts true or false. Accordingly, `prison` is enabled or not.
* **filter** - filter applied to the log file. Filters are located in `/etc/fail2ban/filter.d`
* **action** - what to do with the system disturber. All actions are located in the `/etc/fail2ban/action.d` folder.
In this particular case, two actions are included:
  * `iptables` (`/etc/fail2ban/action.d/iptables.conf`) will create a chain in the firewall called `fail2ban-ssh` and will throw the ip addresses of violators into it.
  * `sendmail-whois` (`/etc/fail2ban/action.d/sendmail-whois.conf`) - will send you information about the blocked ip address by mail.
I recommend changing `sendmail-whois` to `sendmail`.
* **logpath** - log file to work with. May vary depending on system configuration. Enter here the path to the file where ssh writes failed logins. Possible options are the following:
  * /var/log/secure
  * /var/log/messages
  * /var/log/auth.log
  * что-то другое
* **maxretry** - number of failed login attempts. I recommend setting it to 3.

There are also blank descriptions for `vsftpd`, `pro-ftpd`. In fact they differ only in the value of filter. You can look at any example and create your own filter for a custom application.

Personally I don't like being notified when fail2ban is restarted. In order to disable them comment out everything related to `actionstart` and `actionstop` in the file `/etc/fail2ban/action.d/sendmail-whois.conf` or `/etc/fail2ban/action.d/sendmail.conf` if you changed action value on `sendmail`. You can customize the notice to your liking.

I want to stop a little on filters. As I said they are located in the `/etc/fail2ban/filter.d` folder. The main thing in them is the value of failregex. This is a description of the failed login mask. At what it is described them a little that for certain. Example for SSH:

```bash
^%(__prefix_line)s(?:error: PAM: )?[aA]uthentication (?:failure|error) for .* from <HOST>( via \S+)?\s*$  
^%(__prefix_line)s(?:error: PAM: )?User not known to the underlying authentication module for .* from <HOST>\s*$  
^%(__prefix_line)sFailed \S+ for .*? from <HOST>(?: port \d\*)?(?: ssh\d\*)?(: (ruser .\*|(\S+ ID \S+ \(serial \d+\) CA )?\S+ %(__md5hex)s(, client user `.\*`, client host `.\*`)?))?\s\*$  
^%(__prefix_line)sROOT LOGIN REFUSED.* FROM <HOST>\s*$  
^%(__prefix_line)s\[iI\](?:llegal|nvalid) user .* from <HOST>\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because not listed in AllowUsers\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because listed in DenyUsers\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because not in any group\s*$  
^%(__prefix_line)srefused connect from \S+ \(<HOST>\)\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because a group is listed in DenyGroups\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because none of user's groups are listed in AllowGroups\s*$
```

Anyone who has ever read the logs will immediately see how you can customize them and create your own.

Useful related links:
* <a href="http://www.fail2ban.org/wiki/index.php/HOWTO_fail2ban_with_ModSecurity2.5" target="_blank">Fail2Ban + mod_security</a>
