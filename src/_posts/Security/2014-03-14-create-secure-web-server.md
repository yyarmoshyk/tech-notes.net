---
id: 667
title: Building a secure web server
date: 2014-03-14T15:49:44+00:00
author: admin

guid: http://www.tech-notes.net/?p=667
permalink: /create-secure-web-server/
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - Apache
  - Security
tags:
  - Apache
  - chroot
  - mod_security
---
To create the most secure web server we need the following:
  * Create a sandbox chroot with debootstrap
  * sandbox apache2, php5, mysql
  * install and configure mod-security2, as well as edit the necessary directives in the apache and php configuration files.

We take the Ubuntu distribution as a basis.

**Create a chroot sandbox**.
First you need to add a new repository to sources.list and update the list of packages.

```bash
echo 'deb ubuntu.mirror.cambrium.nl/ubuntu/lucid main universe' >> /etc/apt/sources.list
apt-get update
```

Install debootstrap itself and create a nested OS - chroot sandbox:
```bash
apt-get install debootstrap
```


If the installation was successful then run the tool:
```bash
debootstrap --variant=buildd --arch i386 lucid /home/chroot archive.ubuntu.com/ubuntu/
```

Arguments are the following:
* architecture of the future system,
* distributor,
* directly to the directory that will serve as our chroot sandbox
* repository from which the utility should download the distribution.

**Install mysql**.
The tricky thing is that the MySQL refuses to work correctly in the sandbox. You can do it easier. Install mysql in the main OS:
```bash
apt-get install mysql-server mysql-client
```

Then we edit the config (`/etc/mysql/my.cnf`) and change `bind_address` from `127.0.0.1` to `127.0.0.1`

After these steps mysql will be available inside the sandbox, however, instead of localhost, you need to specify `127.0.0.1` as the mysql host.

**Configure chroot.**
First you need to configure the resolver and the list of repositories for the chroot. Let's execute the commands:
```bash
cp /etc/resolv.conf /home/chroot/etc/resolv.conf
cp /etc/apt/sources.list /home/chroot/etc/apt/sources.list
```

We forward system file systems into the chroot environment. To do this open the `/etc/fstab` file in your favorite editor and add the following lines to it:
```bash
/proc /home/chroot/proc none rbind 0 0
/dev /home/chroot/dev none rbind 0 0
/sys /home/chroot/sys none rbind 0 0
```

Save and mount:
```bash
mount -a
```

We are done in the main OS. Let's run the last command in the main terminal to get into the chroot sandbox OS:
```bash
chroot /home/chroot
```

Let's configure the OS inside the chroot. Run the familiar commands:
```bash
echo 'deb ubuntu.mirror.cambrium.nl/ubuntu/lucid main universe' >> /etc/apt/sources.list
apt-get update
```

Let's move on to installing apache2 and php inside the chroot. The installation is not different from a regular installation, so I won't dwell on this in detail (the libapache2-mod-security2 module is required to be installed):
```bash
apt-get install apache2 apache2-doc apache2-mpm-prefork apache2-utils libexpat1 ssl-cert libapache2-mod-security2
apt-get install libapache2-mod-php5 libapache2-mod-ruby php5 php5-common php5-curl php5-dev php5-gd php5-idn php-pear php5-imagick php5-imap php5-mcrypt php5-memcache php5-mhash php5- ming php5-mysql php5-pspell php5-recode php5-snmp php5-sqlite php5-tidy php5-xmlrpc php5-xsl
```

**The final stage.**
apache2 configuration, php, libapache2-mod-security2. Create an apache user and user directory:

```bash
cd/; mkdir -m 755 web
useradd dot -b /web -m -U -s /bin/false
chmod 754 /web/dot
mkdir -p -m 754 /web/dot/public_html/www
mkdir -p -m 777 /web/dot/tmp
chmod +t /web/dot/tmp
chown -R dot:dot /web/dot/
```

So we've created a user, disabled it, created a home directory, created a web directory, created a personal temporary directory and recursively changed the directory's owner.

Got to edit the default virtual host for our user:
```bash
nano /etc/apache2/sites-enabled/000-default
```

Context:
```bash
<VirtualHost *:80>
DocumentRoot "/web/dot/public_html/www/"
ServerName dot
ErrorLog /web/dot/error_log
CustomLog /web/dot/access_log combined
```

We change the default user and group from which apache will run. To do this, edit the apache2 configuration file:
```bash
nano /etc/apache2/apache2.conf
```

```bash
User www-data
group dot
```

Add some directives to the end of the file:
```bash
# Disable the signature at the bottom of the apache service pages (404 error page, etc.)
ServerSignature Off
# Server response in the header (Prod value will display only the name of the software - Apache)
ServerTokensProd
#disable CGI scripts, disable symbolic links, disable directory browsing, disable SSI
Options -ExecCGI -FollowSymLinks -Indexes -Includes
```

Edit the `php.ini` configuration file:
```bash
nano /etc/php5/apache2/php.ini
```

Change the value of the following directives:
```bash
expose_php = Off
magic_quotes_gpc = On
register_globals = Off
disable_functions = popen,exec,system,passthru,proc_open,shell_exec,in i_restore,dl,symlink,chgrp,ini_set,putenv,extensio n_loaded,getmyuid, posix_setuid,posix_setsid,posix_setpgid,posix_kill ,apache_child_terminate,chmod,chdir,phpinfo
safe_mode = On
safe_mode_gid = On
open_basedir = "/web/dot/"
```


**Configuring mod-security2**
First, let's create the necessary directories and files:
```bash
mkdir /etc/apache2/conf.d/modsec
mkdir /var/log/apache2/modsec
touch /etc/apache2/conf.d/modsec/modsecurity_crs_10_config.conf
touch /etc/apache2/conf.d/modsec/modsecurity_crs_15_customrules.conf
```

Next, edit the created files:
* `modsecurity_crs_10_config.conf` - file with basic module settings
* `modsecurity_crs_15_customrules.conf` - file with rules for the module

```bash
nano /etc/apache2/conf.d/modsec/modsecurity_crs_10_config.conf
```


Contexts:
```bash
# Enable filter engine
SecRuleEngine On
# Log only suspicious requests:
SecAuditEngine RelevantOnly
# Log file name
SecAuditLog /var/log/apache2/modsec/audit_log
# Output debug information
SecDebugLog /var/log/apache2/modsec/debug_log
SecDebugLogLevel 1
# For suspicious requests, write to the log by default:
# and return an HTTP response with a 403 code
SecDefaultAction log,auditlog,deny,status:403,phase:2
```

Second file:
```bash
nano /etc/apache2/conf.d/modsec/modsecurity_crs_15_customrules.conf
```

Contexts:
```bash
# Protection against LFI\read file
SecRule ARGS "\.\./"
SecRule ARGS "/etc.+passwd" "t:lowercase"
SecRule ARGS "/proc/.+" "t:lowercase"
# Protection against SQL injections
SecRule ARGS "delete.+from" "t:lowercase"
SecRule ARGS "insert.+into" "t:lowercase"
SecRule ARGS "select.+from" "t:lowercase"
SecRule ARGS "union.+select" "t:lowercase"
SecRule ARGS "group_concat" "t:lowercase"
SecRule ARGS "information_schema" "t:lowercase"
SecRule ARGS "benchmark" "t:lowercase"
# Change the server response, the software is now not apache
SecServerSignature "Guess"
```

The above rules for the module are working, although they need to be improved, they are given as an example.