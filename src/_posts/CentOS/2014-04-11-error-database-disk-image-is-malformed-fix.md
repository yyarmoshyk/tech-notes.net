---
id: 806
title: 'Error: database disk image is malformed'
date: 2014-04-11T18:49:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=806
permalink: /error-database-disk-image-is-malformed-fix/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - CentOS
tags:
  - database disk image is malformed
---
Для того что бы в CentOS yum заработал после вот такой ошибки:

```bash
Error: database disk image is malformed
```

нужно почистить кэш пакетов вот такой командой:

```bash
yum clean dbcache
```

или вот такой:

```bash
yum clean all
```

<center>
  <div id="gads">
  </div>
</center>
