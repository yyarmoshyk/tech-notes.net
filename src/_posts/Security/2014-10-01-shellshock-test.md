---
id: 1841
title: Server check for bash shellshock vulnerability
date: 2014-10-01T14:10:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=1841
permalink: /shellshock-test/
image: /wp-content/uploads/2014/10/shellshocker.png
categories:
  - Linux server
  - Security
---
To find out if your server is vulnerable to shellshock, run one of the following commands:
```bash
curl https://shellshocker.net/shellshock_test.sh | bash
```

or
```bash
curl https://www.tech-notes.net/wp-content/uploads/2014/10/shellshock_test.sh |bash
```

As a result we get something like this:
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095203-1024x132.png" alt="Screenshot from 2014-10-01 09:52:03" width ="665" height="85" class="aligncenter size-large wp-image-1842" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095203-1024x132. png 1024w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095203-170x22.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10- 01-095203-300x38.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095203-660x85.png 660w, /wp-content/uploads/2014/10/Screenshot- from-2014-10-01-095203.png 1542w" sizes="(max-width: 665px) 100vw, 665px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10- 01-095203.png)

In order to fix the problem you need to update bash.

First you need to find out which version is installed. Based on <a href="http://www.tech-notes.net/list-installed-packages-linux/" title="Getting a list of installed software packages on Linux" target="_blank">of this article</a > execute:
```bash
rpm -qa |grep bash
```

as a result we get something like this:
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095954.png" alt="Screenshot from 2014-10-01 09:59:54" width=" 416" height="42" class="aligncenter size-full wp-image-1843" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095954.png 416w, / wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095954-170x17.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095954- 300x30.png 300w" sizes="(max-width: 416px) 100vw, 416px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-095954.png)

or do:

```bash
bash-version
```

as a result we get something like this:
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130.png" alt="Screenshot from 2014-10-01 10:01:30" width=" 736" height="88" class="aligncenter size-full wp-image-1844" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130.png 736w, / wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130-170x20.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130- 300x35.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130-660x78.png 660w" sizes="(max-width: 736px) 100vw, 736px" />] (/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100130.png)

To eliminate all misunderstandings we perform:
```bash
yum update bash -y
```
or
```bash
apt-get update; apt-get install -only-upgrade bash
```

After that the picture looks completely different:
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449.png" alt="Screenshot from 2014-10-01 10:04:49" width=" 914" height="198" class="aligncenter size-full wp-image-1845" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449.png 914w, / wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449-170x36.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449- 300x64.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449-660x142.png 660w" sizes="(max-width: 914px) 100vw, 914px" />] (/wp-content/uploads/2014/10/Screenshot-from-2014-10-01-100449.png)

You can also you the [host-tracker.com](http://www.host-tracker.com/) site:
[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906-1024x139.png" alt="Screenshot from 2014-10-07 08:09:06" width="665" height="90" class="aligncenter size-large wp-image-1862" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906-1024x139.png 1024w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906-170x23.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906-300x40.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906-660x89.png 660w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906.png 1336w" sizes="(max-width: 665px) 100vw, 665px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080906.png)

[<img src="/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731.png" alt="Screenshot from 2014-10-07 08:07:31" width="832" height="267" class="aligncenter size-full wp-image-1863" srcset="/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731.png 832w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731-170x54.png 170w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731-300x96.png 300w, /wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731-660x211.png 660w" sizes="(max-width: 832px) 100vw, 832px" />](/wp-content/uploads/2014/10/Screenshot-from-2014-10-07-080731.png)