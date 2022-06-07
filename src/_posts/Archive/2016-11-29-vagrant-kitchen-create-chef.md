---
id: 3561
title: Vagrant authorization issue when executing kitchen create in Chef
date: 2016-11-29T05:30:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=3561
permalink: /vagrant-kitchen-create-chef/
image: /wp-content/uploads/2016/11/using-vagrant-and-chef.png
categories:
  - Archive
tags:
  - Chef
  - Vagrant
---
Выполняя команду `kitchen create` при тестировании поваренной книги в Chef можно получить следующую ошибку при работе с Vagrant 1.8.5:
Chef can fail with the following error running `kitchen create` command if you have `Vagrant 1.8.5`:

```bash
default: Warning: Authentication failure. Retrying...
```

The full text of the error is the following:
```bash
kitchen create
-----> Starting Kitchen (v1.11.1)
-----> Creating ...
       Bringing machine 'default' up with 'virtualbox' provider...
       ==> default: Checking if box 'bento/centos-7.2' is up to date...
       ==> default: Clearing any previously set forwarded ports...
       ==> default: Clearing any previously set network interfaces...
       ==> default: Preparing network interfaces based on configuration...
           default: Adapter 1: nat
       ==> default: Forwarding ports...
           default: 22 (guest) => 2222 (host) (adapter 1)
       ==> default: Running 'pre-boot' VM customizations...
       ==> default: Booting VM...
       ==> default: Waiting for machine to boot. This may take a few minutes...
           default: SSH address: 127.0.0.1:2222
           default: SSH username: vagrant
           default: SSH auth method: private key
           default: Warning: Remote connection disconnect. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
           default: Warning: Authentication failure. Retrying...
```


It turns out that the `authorized_keys` file has the wrong permissions in the `vagrant` test environment. The workaround is to log into the virtual machine using the console in the virtualbox interface with the following details:
   * login: vagrant
   * password: vagrant

<img src="/wp-content/uploads/2016/11/kitchen-console-open.png" alt="kitchen-console-open" width="769" height="603" class="aligncenter size-full wp-image-3562" />

Next, you need to run the following command:
```bash
chmod 644 /home/vagrant/.ssh/authorized_keys
```

This solution is not entirely suitable, since you will have to perform extra steps when creating new test machines. I would recommend installing a previous version of Vagrant (v.1.8.4).

According to the discussion at the following link, the developers are aware of this issue and plan to fix it in the next Vagrant releases:
  * [https://github.com/mitchellh/vagrant/issues/7627](https://github.com/mitchellh/vagrant/issues/7627)

The Vagrant release archive is available at the following link:
  * [https://releases.hashicorp.com/vagrant/1.8.4/](https://releases.hashicorp.com/vagrant/1.8.4/)
