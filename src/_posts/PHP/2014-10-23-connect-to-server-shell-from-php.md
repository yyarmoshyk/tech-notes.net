---
id: 2006
title: Как в PHP подключиться по ssh к серверу
date: 2014-10-23T18:09:01+00:00
author: admin

guid: http://www.tech-notes.net/?p=2006
permalink: /connect-to-server-shell-from-php/
image: /wp-content/uploads/2014/03/Screenshot-from-2014-03-18-150809.png
categories:
  - PHP
tags:
  - ssh php
---
Оставлю небошьшую заметку о том, как можно подключиться к удаленному серверу в php, вызвать команду и отобразить результаты на экране.

В приведенном примере используется авторизация с помощью приватного ключа:

```php
function ssh_exec($ip, $command) {
$connection = ssh2_connect($ip, 22);
if (ssh2_auth_pubkey_file($connection, 'remote_user', '/home/remote_user/.ssh/id_rsa.pub', '/home/remote_user/.ssh/id_rsa')) {
     $stream = ssh2_exec($connection, $command);
     stream_set_blocking($stream, true);
     $stream_out = ssh2_fetch_stream($stream, SSH2_STREAM_STDIO);
     echo "<pre>Results :\n";
     echo stream_get_contents($stream_out)."</pre>";
     fclose($stream);
  } else {
     die('Public Key Authentication Failed');
  }
}
```


Для авторизации с паролем используйте:

```bash
ssh2_auth_password($connection, 'remote_user', 'password');
```


Вызывается эта функия вот так:

```php
<?php
ssh_exec('192.168.1.19', 'df -h');
?>
```
