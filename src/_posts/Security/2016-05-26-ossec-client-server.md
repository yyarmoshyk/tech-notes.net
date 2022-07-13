---
id: 3325
title: OSSEC client-server installation
date: 2016-05-26T12:01:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=3325
permalink: /ossec-client-server/
image: /wp-content/uploads/2016/05/ossec_logo.jpg
categories:
  - Linux server
  - Security
tags:
  - oosec
---
`OSSEC` is an open source attack detection and prevention system. It can be configured to monitor not only events in log files but also changes to files and running daemons services and services.

Page on GitHUB: [http://ossec.github.io/](http://ossec.github.io/)

In the future we will talk not just about installing OSSEC but also about setting up a client-server system in which several clients report events to one server.

## Part 1: Installing OSSEC

Installing the server part is no different from the client part, except for the corresponding question at the installation stage. Therefore, all steps can be done in parallel on the server and on the clients.

Install the required packages:
```bash
yum install build-essential inotify-tools php-cli php php-imap php-gd php-xml httpd php-pear mysql-libs httpd-tools php-pdo php-mysql php-mbstring php-common mysql mysql-server
```

Today the most recent version is `OSSEC v.2.8.1`. And we will install it:
```bash
cd /usr/local/src/  
wget -U ossec http://www.ossec.net/files/ossec-hids-2.8.1.tar.gz  
tar xf ossec-hids-2.8.1.tar.gz  
cd ossec-hids-2.8.1
./install
```

All questions in the installer are quite simple and clear. You can hit the enter accepting the default settings.

The first question deserves special attention:
```bash
What kind of installation do you want?
```

Enter `server` if installing the server part, `agent` on clients.

I recommend that you specify your email to receive notifications and your public IP address when the script asks for white lists.
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

## Part 2: Setting up the server
Edit the config file `/var/ossec/etc/ossec.conf`

### Email Notifications:
If you choose to send email notifications then OSSEC will send you 12 emails per hour. It is worth twisting the section:
```bash
<email_maxperhour>1</email_maxperhour>
```
It is also highly recommended to edit and enter a normal domain there so that letters at least get into the spam folder:
```bash
<email_from>ossecm@ossec-server.com</email_from>
```
<div class="spoiler-wrap">
<div class="spoiler-head folded">
  full section
</div>
<div class="spoiler-body">
<pre>
<global>
    <email_notification>yes</email_notification>
    <email_to>admin@domain.com</email_to>
    <smtp_server>localhost</smtp_server>
    <email_from>ossecm@ossec-server.com</email_from>
</global>
</pre>
</div> </div>

### Turn on notifications about new files.
To do this find the following section:
```bash
<syscheck>
    <!-- Frequency that syscheck is executed - default to every 22 hours -->
    <frequency>79200</frequency>
```
Add the following into it:
```bash
<alert_new_files>yes</alert_new_files>
```

### Setup tracking folders and files.
The next step is to specify what OSSEC should monitor. Finding the next section
```bash
<!-- Directories to check  (perform all possible verifications) -->
<directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories check_all="yes">/bin,/sbin</directories>
```
To enable realtime notifications add `report_changes="yes" realtime="yes"` to each directory description. The following example makes it clearer:
```bash
<!-- Directories to check  (perform all possible verifications) -->
<directories report_changes="yes" realtime="yes" check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/bin,/sbin</directories>
```
The next line in this section will watch for new files with the given extensions in the `/home` and `/var/www` folders:
```bash
<directories report_changes="yes" realtime="yes" restrict=".php|.js|.py|.sh|.html|.pl" check_all="yes">/home/,/var/www</directories>

```
### Whitelists
Along the way, OSSEC will block access to the server for IP addresses if it suspects them of illegal actions (based on its logic). Therefore, I strongly recommend that you specify all the IP addresses of your subnet in the next section, by analogy with `127.0.0.1`
```bash
  <global>
    <white_list>127.0.0.1</white_list>
```

This completes the basic setup and you can start the daemon itself:
```bash
/var/ossec/bin/ossec-control start
```

### Adding clients to the server

The final step is to add agents to the OSSEC server. This is done using `manage_agents`.

Full path to the utility:
```bash
/var/ossec/bin/manage_agents
```

Add all the necessary agents (A). After that, export the keys (E). The next step is to import these keys on the servers that are the clients. On clients you also need to use `manage_agents`.

The dialog for adding an agent to the server is quite simple:
```bash
****************************************
* OSSEC HIDS v2.8 Agent manager.     *
* The following options are available: *
****************************************
(A)dd an agent (A).
(E)xtract key for an agent (E).
(L)ist already added agents (L).
(R)emove an agent (R).
(Q)uit.
Choose your action: A,E,L,R or Q: A

- Adding a new agent (use '\q' to return to the main menu).
Please provide the following:
* A name for the new agent: server-01-name.localnet
* The IP Address of the new agent: 10.10.10.101
* An ID for the new agent[001]:
Agent information:
ID:001
Name: server-01-name.localnet
IP Address: 10.10.10.101

Confirm adding it?(y/n): y
Agent added.
```

The final step in this section is to allow traffic in iptables. To do this on each agent allow access to UDP port 1514 using the following command:
```bash
iptables -A INPUT -p UDP -dport 1514 -s %SERVER_IP_ADDRESS% -j ACCEPT
```

On the OSSEC server, respectively, we allow access for each agent:
```bash
iptables -A INPUT -p UDP -dport 1514 -s %CLIENT_IP_ADDRESS% -j ACCEPT
```
## Part 4: Web Interface
It is convenient to be able to see what is happening there in OSSEC via the web interface. It must be installed on the server:

```bash
curl -O http://www.ossec.net/files/ossec-wui-0.3.tar.gz
tar -zxvf ossec-wui-0.3.tar.gz
mv ossec-wui-0.3 /usr/local/share/ossec
chown -R apache:apache /usr/local/share/ossec
```

In order to make this directory available on the web, create an apache config with the following content:
```bash
Alias /ossec /usr/local/share/ossec
<Directory /usr/local/share/ossec>
  Order allow,deny
  AuthType Basic
  AuthUserFile /usr/local/share/ossec/.htpasswd
  AuthGroupFile /dev/null
  AuthName "Enter username/password"
  Require valid-user
  Satisfy any
  Deny from all
</Directory>
```

Generating a password for basic authorization:
```bash
htpasswd -cmb /usr/local/share/ossec/.htpasswd ossecadmin password
```

Restart apache to apply changes. After that, you can go to the OSSEC web interface at:
[http://server_ip/ossec](http://server_ip/ossec)

External links:
* [https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ossec-security-notifications-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ossec-security-notifications-on-ubuntu-14-04)
* [https://www.digitalocean.com/community/tutorials/how-to-monitor-ossec-agents-using-an-ossec-server-on-ubuntu-14-04](https://www.digitalocean.com/community/tutorials/how-to-monitor-ossec-agents-using-an-ossec-server-on-ubuntu-14-04)
* [http://www.ossec.net/wiki/index.php/OSSECWUI:Install](http://www.ossec.net/wiki/index.php/OSSECWUI:Install)
