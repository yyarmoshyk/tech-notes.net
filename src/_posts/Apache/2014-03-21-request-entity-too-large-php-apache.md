---
id: 726
title: Problem uploading files over php forms in Apache
date: 2014-03-21T17:59:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=726
permalink: /request-entity-too-large-php-apache/
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-design.jpg
categories:
  - Apache
tags:
  - Request Entity Too Large
---
Today I encountered the problem of uploading files that clearly do not exceed the `post_max_size` and `upload_max_filesize` limits.
The following error appears:
```bash
Request Entity Too Large
The requested resource media-new.php does not allow request data with POST requests ...
```

Here is the picture:
[<img src="/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png" alt="Screenshot from 2014-03-21 13:21:16" width=" 738" height="101" class="aligncenter size-full wp-image-727" srcset="/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png 738w, / wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116-300x41.png 300w, /wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116- 660x90.png 660w" sizes="(max-width: 738px) 100vw, 738px" />](/wp-content/uploads/2014/03/Screenshot-from-2014-03-21-132116.png)

This error message is not related to php settings. This is a limitation in the Apache server in `mod-security` section.

<center>
  <div id="gads">
  </div>
</center>

In order to fix it, you need to add the following lines to `.htaccess`:
```bash
<IfModule mod_security.c>
  <Files media-new.php>
    #4Mb
    LimitRequestBody 4096000
  </Files>
</IfModule>
```

Thus, for the `media-new.php` file, a limit of `4Mb` is set on the size of the request body.