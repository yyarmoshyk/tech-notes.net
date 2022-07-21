---
id: 926
title: Install Apache Passenger for Ruby
date: 2014-05-07T14:27:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=926
permalink: /install-apache-passenger-ruby-centos/
image: /wp-content/uploads/2014/05/ruby-logo.jpg
categories:
  - Apache
tags:
  - Ruby
  - Apache Passenger
---
A small note on how to install `Apache passenger` on `CentOS` to work with `Ruby`. I assume you have the following packages installed:
* ruby-mysql
* rubygems
* ruby-libs
* ruby-irb
* ruby

Ruby Passenger is being installed like this:
```bash
gem install passenger --version 3.0.12
```

Optionally the version can be removed. Then the latest available version of the package will be installed.

If you don't have `devel` packages installed the `gem` installer will pop out with the following error:
```bash
mkmf.rb can\'t find header files for ruby ​​at /usr/lib/ruby/ruby.h
```

We do:
```bash
yum -y install gcc mysql-devel ruby-devel
```

Let's go back one step.

To install the Apache module, run the following command:
```bash
passenger-install-apache2-module
```

At the very beginning, it checks whether the necessary libraries are present in the system. As a result, you get the following message:
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png" alt="Screenshot from 2014-05-07 10:11:29" width=" 700" height="339" class="aligncenter size-full wp-image-927" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png 700w, / wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129-300x145.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129- 660x319.png 660w" sizes="(max-width: 700px) 100vw, 700px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101129.png)

Press `Enter` and get the expected fixes:
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png" alt="Screenshot from 2014-05-07 10:11:42" width=" 729" height="418" class="aligncenter size-full wp-image-928" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png 729w, / wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142-300x172.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142- 660x378.png 660w" sizes="(max-width: 729px) 100vw, 729px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101142.png)

Install the missing packages:
```bash
yum -y install gcc-c++ curl-devel zlib-devel httpd-devel apr-devel apr-util-devel
```

We start again:
```bash
passenger-install-apache2-module
```

At the end we get the following message:
[<img src="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png" alt="Screenshot from 2014-05-07 10:15:03" width=" 973" height="262" class="aligncenter size-full wp-image-929" srcset="/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png 973w, / wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503-300x80.png 300w, /wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503- 660x177.png 660w" sizes="(max-width: 973px) 100vw, 973px" />](/wp-content/uploads/2014/05/Screenshot-from-2014-05-07-101503.png)

Now we need to create a file `/etc/httpd/conf.d/ruby-passenger.conf` with the following contexts:
```bash
LoadModule passenger_module /usr/lib/ruby/gems/1.8/gems/passenger-3.0.12/ext/apache2/mod_passenger.so
PassengerRoot /usr/lib/ruby/gems/1.8/gems/passenger-3.0.12
PassengerRuby /usr/bin/ruby
```