---
id: 3498
title: Sudo without password in linux to run a single command
date: 2016-11-14T09:55:18+00:00
author: admin

guid: http://www.tech-notes.net/?p=3498
permalink: /passwordless-sudo-for-one-command/
image: /wp-content/uploads/2014/10/shellshocker.png
categories:
  - Linux server
  - sudo
---
Suppose we needed to allow one user on the system to execute an application that requires sudo without entering a password. 
In order to do this you need to edit the `/etc/sudoers` file accordingly:
```bash
username ALL = (ALL) NOPASSWD: /path/to/binary
```

The user will then be able to execute binary without entering a password as follows:
```bash
sudo /path/to/binary
```

A small hack so that you don't have to enter `sudo` either. `Docker` fits the example very well. By default, all docker commands are to be ran under `root`. 
For a regular user on the system to be able to execute docker commands without having to enter `sudo` and password each time you must first edit `/etc/sudoers` with the following line:
```bash
username ALL = (ALL) NOPASSWD: /usr/bin/docker
```

Nex update the `.bashrc` file in the user home folder with the following:
```bash
docker () {
	sudo docker "$@"
}
```


In order to apply the cnages in the active shell run the following under the user:
```bash
source ~/.bashrc
```

Additionally you can specify this globally in `/etc/profile`
