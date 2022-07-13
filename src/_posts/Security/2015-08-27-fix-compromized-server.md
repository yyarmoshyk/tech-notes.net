---
id: 2828
title: Recover compromized Linux server
date: 2015-08-27T14:03:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=2828
permalink: /fix-compromized-server/
image: /wp-content/uploads/2015/08/Peter-Griffin-Thumbs-up-2.png
categories:
  - Linux Server
  - Security
---
If you are reading this article than your site has been hacked. You have seen that spam is being sent from your server and you can't figure out what to do with it.

[<img src="/wp-content/uploads/2015/08/everything_is_horrible.jpg" alt="everything_is_horrible" width="380" height="133" class="aligncenter size-full wp-image-2849" srcset ="/wp-content/uploads/2015/08/everything_is_horrible.jpg 380w, /wp-content/uploads/2015/08/everything_is_horrible-170x60.jpg 170w, /wp-content/uploads/2015/08/everything_is_horrible-300x105 .jpg 300w" sizes="(max-width: 380px) 100vw, 380px" />](/wp-content/uploads/2015/08/everything_is_horrible.jpg)

It is important not to panic, but strictly follow the instructions:
1. Scan your server using the following utilities:
  * [ClamAV](http://www.tech-notes.net/use-clamav-clamscan-to-scan-linux-server/)
  * [Chkrootkit](http://www.tech-notes.net/scan-linux-server-with-chrootkit/)
  * [MalDetect](http://www.tech-notes.net/use-maldetect-to-scan-linux-server/)
  * [Lynis (ex-rkhunter)](http://www.tech-notes.net/scan-linux-server-with-lynis/)
2. Make sure that [spam is sent from your server](http://www.tech-notes.net/postfix-sends-spam/)

Deleting a couple of dozen files does not mean that everything is over because the utilities will only find what they know about and what they know far from everything.

You need to fiddle a little with your hands. Go to the folder with the site files and put everything in `read-only` mode:
```bash
find. -type f -exec chmod 444 {} \;
find. -type d -exec chmod 555 {} \;
```

Next we start looking for the use of the `eval` function:
```bash
grep 'eval(\|assert(\|gzinflate(' * -RI |cut -d `:` -f 1|grep -color '\.php' |sort -u
grep 'eval (\|assert (\|gzinflate (' * -RI |cut -d `:` -f 1|grep -color '\.php' |sort -u
grep "@.\*\$GLOBALS\['" \* -RI |cut -d `:` -f 1 |sort -u
```

But I encountered the reverse of the `eval` and `base64_encode` functions just today:
```bash
grep 'edoced_46esab\|lave' * -RI |grep 'strrev' |sort -u
```

As a result, you get a list of files. You need to open each and see what's in it.

Even if you are not an experienced administrator or coder you will be able to distinguish between normal code and malicious code.
Here is the first example:
[<img src="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png" alt="Screenshot from 2015-08-24 16:36:53" width=" 996" height="374" class="aligncenter size-full wp-image-2829" srcset="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png 996w, / wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653-170x64.png 170w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653- 300x113.png 300w" sizes="(max-width: 996px) 100vw, 996px" />](/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png)

Here is a second example:
[<img src="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png" alt="Screenshot from 2015-08-24 16:39:07" width=" 939" height="657" class="aligncenter size-full wp-image-2830" srcset="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png 939w, / wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907-170x119.png 170w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907- 300x210.png 300w" sizes="(max-width: 939px) 100vw, 939px" />](/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png)

<center>
  <div id="gads">
  </div>
</center>

The hardest part is finding the so-called 'backdoors'. As a rule they are being hidden in the huge file in the form of quite ordinary code so it is difficult to find it.

### _To catch a criminal you have to think like a criminal._

[<img src="/wp-content/uploads/2015/08/136187719736.jpg" alt="136187719736" width="400" height="533" class="aligncenter size-full wp-image-2850" srcset ="/wp-content/uploads/2015/08/136187719736.jpg 400w .jpg 225w" sizes="(max-width: 400px) 100vw, 400px" />](/wp-content/uploads/2015/08/136187719736.jpg)

<center>
  <div id="gads">
  </div>
</center>

If I were writing a backdoor I would not want my script to write any errors to the logs. Otherwise a smart admin would quickly see them. To do this I would turn off logging using the php `error_reporting` function

You can search for it:
```bash
grep `error_reporting \*(.\*0.\*)` \* -RI |cut -d `:` -f 1 |grep php
```

Just in case I would remove the value of `error_log` using `ini_set`:
```bash
grep "\@ini_set('error_log'" * -RI |cut -d ":" -f 1 |grep php
```

In order to get the path to the current directory I would use the `getcwd()` function:
```bash
grep "\@getcwd\(\)" * -RI |cut -d ":" -f 1 |grep php
```

As a result of executing each command you'll get a list of files and you need to open each of them and see the contents.

Delete the malicious code, rename the files and reate a new empty file with the same name and forbid its editing. The safest way to do this is with the `chattr` utility:
```bash
chattr +i **/path/to/file**.php
```

It is recommended to disable the following functions in php.ini:
* passthru
* system
* shell_exec
* exec
* popen
* proc_open
* curl_multi_exec
* parse_ini_file
* show_source
* pcntl_exec
* getenv
* getmygid
* extract
* parse_str

Find the line `disable_functions` in the `php.ini` file and list them separated by commas. Don't forget to restart apache after applying the changes.

In the case of `Shared Hosting` you can usually edit `php.ini` directly from the control panel. Unfortunately functions can only be disabled in `php.ini`. You won't be able to put them in `.htaccess`.

**Attention:** After such changes, problems may begin with your site. Test it carefully and make sure that disabling features did not cause problems. 
In order to fix problems look for patches and updates for the modules of your site. Look for replacement functions at [php.net](http://php.net). The fewer features you turn back on the less likely the problem will recur.

Immediately in the folder where the files are uploaded (uploads, media, files) I recommend to create an `.htaccess` with the following content:
```bash
<FilesMatch ”\.php$”>
    Deny from all
</FilesMatch>
```

This will prevent access to the php files in the folders that are intended to be used for media. Even if you make the downloads folder writable nothing malicious can be launched from it.

Then we monitor the server for several days/nights/weeks. In case of resumption of problems - we read the logs we try to determine how the new worm appeared in the site folders. We search for it again and delete it.

Next you got to consider options for moving to a new server and updating everything that is possible (php, apache, nginx, plugins, site CMS).

Just in case you can use the following utilities to check your website:
* [unmaskparasites.com](http://www.unmaskparasites.com/)
* [quttera.com](http://quttera.com/website-malware-scanner)
* [sitecheck.sucuri.net](https://sitecheck.sucuri.net/)
