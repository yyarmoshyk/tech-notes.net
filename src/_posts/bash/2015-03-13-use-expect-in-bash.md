---
id: 2470
title: 'Using expect in bash scripts'
date: 2015-03-13T20:00:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=2470
permalink: /use-expect-in-bash/
image: /wp-content/uploads/2015/03/expect-200x200.png
categories:
  - bash
tags:
  - expect
---
`Expect` is a wrapper that provides the ability to program the input for interactive programs. Interactive programs are applications that require the input of additional information in the course of execution.

It's hard to explain without an example. Examples of using expect will be discussed further. 
There are two options similar to `perl/python`:
1. Create a script file and run it like this:  
```bash
expect -f script.exp
```
1. Execute `expect` with commands as parameters:  
```bash
expect -c '...do something...\r'
```

`"\r"` at the end of the line means to send the command (pressing the Enter key).

The main scrip structure:
```bash
#!/usr/bin/expect
spawn #executable application or command
expect #determines in response to which question the following data should be sent
send #what to send in response to the previous question
```

If you want to pass some parameters to the script and use them in your work, use the `set` directive:
```bash
set var1 [lindex $argv 0] #the first parameter passed to the script
set var2 [lindex $argv 1] #the second parameter passed to the script
```

Use `interact` at the end if the session should remain active after all sends have completed. Convenient for automation when working with ssh.

### Example 1: SSH

A standard Linux `ssh client` can take the username and server ip address as arguments but the password cannot be passed to it. The following script takes a username and password as arguments, then connects with them to the server `192.168.1.10` and executes `cat /etc/issue` there
```bash
#!/usr/bin/expect
log_file expect_log
set login [lindex $argv 0]
set pw [lindex $argv 1]

spawn ssh $login@192.168.1.10
expect "$login@192.168.1.10\'s password:"
send "$pw\r"
expect "$login@"
send "cat /etc/issue\r"
```


Can be executed as the following:
```bash
expect -f script.exp user password
```

The second option is to run everything directly in bash:
```bash
expect -c 'spawn ssh user@192.168.1.10; expect `Password:` {send - `%%password%%\r`}; expect `user@` {send `cat /etc/issue\r`};'
```

This is super usefull if you have a list of servers with passwords and logins. You can generate a batch and automate the execution of a certain command on all servers.

All output can be written to the log using the following construct at the beginning of the file:
```bash
log_file expect_log
```


The execution time is important. I don't remember the default, but it's a good practice to set a timeout on execution:
```bash
set timeout 86000
```


<center>
  <div id="gads">
  </div>
</center>

### Example 2: FTP

Let's say you need to upload the contents of 10 ftp servers to one directory on the server. Imagine using 10 combinations of logins, passwords and addresses in [lftp](/use-lftp-for-file-exchange/). Represented? Scary?

I got out of the situation like this:

1. Created a file with the following content:
```bash
#!/bin/bash
expect -c 'set timeout 86000; spawn lftp '"$1"'; expect "Password:" {send -- "'"$2"'\r"}; expect ">" {send "mirror -c --parallel=10\r"}; expect "/>" {send "exit\r"};'
```
1. Next you got to do some magic to build the inventory file in which the first column is the user@ip_server, the second is the password like the following
```bash
user1@server1 password1  
user1@server2 password2  
user1@server3 password3  
...  
user1@serverN passwordN
```
1. The following bash script can be used to process all servers in the file (you can paste it directly into the shell - no need to save into the .sh file):
```bash
i=1;
end=$(cat file.txt |wc -l);
while [ $i -le $end ];do 
  cmd=$(sed -n `$i`p file.txt |awk '{print $1}'); 
  pwd=$(sed -n `$i`p file.txt |awk '{print $2}'); 
  bash get_src $cmd $pwd; 
  let `i = $i + 1`;
done
```

### Download selected folders form the server using rsync

On the server with `Plesk`, the site files are located in the `/var/www/vhosts/site_name/httpdocs` folders.
We have a list of sites:
   * website1.com
   * website2.com
   * website3.com
   * website4.com
   * website5.com
   * website6.com
   * website7.com
   * website8.com
   * website9.com

We need to pull the folders of these sites to a new server.

In cases like this, I initialize a list in bash called list:
```bash
list="website1.com
website2.com
website3.com
website4.com
website5.com
website6.com
website7.com
website8.com
website9.com"
```

**Hint**: Type `list="` first, then paste from clipboard, then close the list with double quotes `"`

Next loop over the list elements. Don't forget to replace `%%password%%` with your value:
```bash
for f in $list;do  
mkdir -p /var/www/vhosts/$f;  
expect -c 'spawn rsync -Hvga root@ip_address:/var/www/vhosts/$f/httpdocs /var/www/vhosts/$f/; expect `password:` {send - `%%password%%\r`};interact';  
done
```
