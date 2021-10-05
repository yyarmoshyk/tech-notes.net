---
id: 3561
title: Проблема с авторизацией Vagrant при выполнении kitchen create в Chef
date: 2016-11-29T05:30:26+00:00
author: admin

guid: http://www.tech-notes.net/?p=3561
permalink: /vagrant-kitchen-create-chef/
image: /wp-content/uploads/2016/11/using-vagrant-and-chef.png
categories:
  - Chef
  - Vagrant
---
Выполняя команду `kitchen create` при тестировании поваренной книги в Chef можно получить следующую ошибку при работе с Vagrant 1.8.5:

```bash
default: Warning: Authentication failure. Retrying...
```

Полный текст ошибки следующий:

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


Оказывается файл `authorized_keys` имеет неправильные права доступа в тестовой среде `vagrant`. Для временного решения нужно залогиниться в виртуальную машину используя консоль в интерфейсе virtualbox со следующими деталями:
  * логин: vagrant
  * пароль: vagrant

<img src="/wp-content/uploads/2016/11/kitchen-console-open.png" alt="kitchen-console-open" width="769" height="603" class="aligncenter size-full wp-image-3562" />

Далее нужно выполнить следующую команду:

```bash
chmod 644 /home/vagrant/.ssh/authorized_keys
```

Такое решение не совсем подходит, так как Вам придется выполнять лишние шаги при создании новых тестовых машин. Я бы рекомендовал установить предыдущую версию Vagrant (v.1.8.4).

Согласно обсуждению на по следующей ссылке, разработчики знают об этой проблемы и планируют устранить ее в следующих релизах Vagrant:
  * [https://github.com/mitchellh/vagrant/issues/7627](https://github.com/mitchellh/vagrant/issues/7627)

Архив релизов Vagrant доступен по следующей ссылке:
  * [https://releases.hashicorp.com/vagrant/1.8.4/](https://releases.hashicorp.com/vagrant/1.8.4/)
