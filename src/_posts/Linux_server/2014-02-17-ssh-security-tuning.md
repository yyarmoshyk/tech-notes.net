---
id: 498
title: Security tunning of SSH server
date: 2014-02-17T19:53:49+00:00
author: admin

guid: http://www.tech-notes.net/?p=498
permalink: /ssh-security-tuning/
image: /wp-content/uploads/2014/02/ssh_logo.png
categories:
  - Linux server
tags:
  - Security
  - cipher
  - ssh
---
SSH is a secure terminal server (secure shell) that provides remote access to the linux system. Why safe? Because all traffic between the client and the server is encrypted. 

When a connection is established, the server and the client agree among themselves how information will be exchanged. In this case the server offers the client to choose from the messaging algorithm and the cipher itself.

The message exchange algorithm, or MAC ([message authentication code](http://en.wikipedia.org/wiki/Message_authentication_code)) is designed to authorize commands/messages.

And the encryption method itself which is called `Cipher` in the configuration file determines how data will be encoded between the client and the server.

Recently weaknesses have been found in some messaging algorithms and encryption methods. All online security scanners have started reporting **MD5** and **96bit** MAC algorithms as insecure and abandon the encryption methods from **CBC** group.

Of course I have little idea how to break into an encrypted SSH channel but I'd like to share how this can be turned off into the favour of the  `secure` MACs and ciphers.

You can get the list of MACs and Ciphers, your server is working with, by running the following:
```bash
man sshd_config
```

My server had the following list of MACs:
```bash
hmac-md5,hmac-sha1,umac-64@openssh.com,  
hmac-ripemd160,hmac-sha1-96,hmac-md5-96
```

And the following list of Ciphers:

```bash
aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,  
aes128-cbc,3des-cbc,blowfish-cbc,cast128-cbc,aes192-cbc,  
aes256-cbc,arcfour
```

Pay attention to everything that has **MD5**, **96­bit** and **CBC** in the name.

Next let's edit the config file `/etc/ssh/ssd_config` with the following:
```bash
MACs hmac-md5,hmac-sha1,hmac-ripemd160  
Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,arcfour
```

I want to draw your attention to the fact that if you have **Match** expressions described then the above lines must be added before these blocks (**Match** expressions blocks)  otherwise you will get these errors when restarting the ssh server:
```bash
Starting sshd: /etc/ssh/sshd_config line 139: Directive 'MACs' is not allowed within a Match block  
Starting sshd: /etc/ssh/sshd_config line 140: Directive 'Ciphers' is not allowed within a Match block
```

Restart ssh server. Please note that even if it does not start your session will remain active so you'll be able to see the error and fix the configuration. **It is important to restart ssh daemon only with reliable internet**.

The following command can be used to check which encryption method is used:
```bash
ssh -vv root@server.com 2>&1 |grep --color "kex:"
```

In my case the output was the following:

[<img src="/wp-content/uploads/2014/02/Screenshot-from-2014-02-17-144518.png" alt="Screenshot from 2014-02-17 14:45:18" width="526" height="52" class="aligncenter size-full wp-image-501" srcset="/wp-content/uploads/2014/02/Screenshot-from-2014-02-17-144518.png 526w, /wp-content/uploads/2014/02/Screenshot-from-2014-02-17-144518-300x29.png 300w" sizes="(max-width: 526px) 100vw, 526px" />](/wp-content/uploads/2014/02/Screenshot-from-2014-02-17-144518.png)

The best way to secure your server is to switch everyone to key-based authorization and disable PAM authorization altogether. No one will be able to modify the authorization package and modify the ssh handshake.

For some reason everyone thinks that for security purposes SSH should be moved to a non-standard port (any except 22). This port can be easily probed using the same `Nmap` so this is not a single gram of a security stub.

A good shim is [Fail2Ban](http://www.tech-notes.net/fail2ban-configuration/) which can be set on a log file into which ssh writes notes about failed authorizations and cut all intruders using `iptables`.