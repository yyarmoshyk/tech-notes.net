---
id: 3608
title: Configure RabbitMQ failover cluster
date: 2016-12-29T16:55:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=3608
permalink: /configure-rabbitmq-cluster/
image: /wp-content/uploads/2016/12/rabbitmq-logo.png
categories:
  - Linux server
tags:
  - RabbitMQ
---
RabbitMQ is a universal bus to be used to exchange messages between the applications. There are other solutions like Kafka, AWS SQS, Google Pubsub, etc. If you are here then I suppose you already know what RabbitMQ is and I will not go deep into details.

This article describes the installation and configuration of the RabbitMQ in CentOS v7. 

The key trick in RabbitMQ is in fact that there is no such thing as global cluster. The master role is being dedicated to one of the ervers within the scope of a single event in the queue. The outage of one server doesn't cuse the downtime and you don't need to care about doing something manually when it is back.

Nex't I'll provide step by step instructions how to configure failover cluster for rabbitMQ that consists of 3 servers.

## Run on all servers
Enable EPEL
```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-8.noarch.rpm
```
Install needed libraries:
```bash
yum install -y vim net-tools wget git zip unip openssh-server openssh logrotate socat
```

### Install `Erlang`. 
There are 3 options
  * Install `Eplang` as is from Epel - I was getting errrors when one of the servers was falling out of cluster.сервера из кластера
  * Download and install the latest Erlang from developers - RabbitMQ could not get installed with this one.
  * Compile `Erlang`, that is optimized for Rabbit and includes only required components is a log way but it is the most reliable

You'll need docker to build the `Erlang` rpm package. It is more efficient to build it locally and than copy to all the servers.
```bash
git clone https://github.com/rabbitmq/erlang-rpm.git  
сd erlang-rpm/docker/  
sed -i 's/-i\ -t/-tty/g' build-rpm-in-docker.sh  
bash build-image-and-rpm.sh latest
```

Upon completion the rpm files will be located in the following folder:
```bash
build-dir-latest/RPMS/x86_64/
```

Install `Erlang`
```bash
yum install -y build-dir-latest/RPMS/x86_64/erlang-19.2.0-1.el7.centos.x86_64.rpm  
yum install -y build-dir-latest/RPMS/x86_64/erlang-debuginfo-19.2.0-1.el7.centos.x86_64.rpm
```
### Install `RabbitMQ`
The latest version of `RabbitMQ` as of today is v3.6.6.
```bash
wget -O /tmp/rabbitmq-server-3.6.6-1.el7.noarch.rpm https://www.rabbitmq.com/releases/rabbitmq-server/v3.6.6/rabbitmq-server-3.6.6-1.el7.noarch.rpm -no-check-certificate  
rpm -import http://www.rabbitmq.com/rabbitmq-release-signing-key.asc  
yum install -y /tmp/rabbitmq-server-3.6.6-1.el7.noarch.rpm
```

<center>
  <div id="gads">
  </div>
</center>

RabbitMQ has a nice web UI that can be very helpfull in every day usage. It is disabled by default. Run the following in order to enabpe it:
```bash
rabbitmq-plugins enable rabbitmq_management
```

`RabbitMQ` will prompt to be restarted and after it the UI will be available on the 15672 port. Use the server IP address to access it `http://%server_ip_address%:15672/`

Standard user:
  * login: guest
  * password: guest

On the first page you'll see the state of the cluster (there is only one server in it so far)

The following can be used to get the data from the cli:
```bash
rabbitmqctl cluster_status
```

Sample output:
```bash
[root@cd27271cd9ff /]# rabbitmqctl cluster_status
Cluster status of node rabbit@cd27271cd9ff ...
[{nodes,[{disc,[rabbit@cd27271cd9ff]}]},
 {running_nodes,[rabbit@cd27271cd9ff]},
 {cluster_name,<<"rabbit@cd27271cd9ff">>},
 {partitions,[]},
 {alarms,[{rabbit@cd27271cd9ff,[]}]}]
```

## Connect all servers into a cluster
First make sure that the value of the `Erlang cookie` is identical on all servers (you can copy it from the active server to all others)
The value can be read at `/var/lib/rabbitmq/.erlang.cookie`

This file has to be owned by `rabbitmq` user and have 600 permissions on all servers

RabbitMQ daemon needs to be restarted after the changes

Next select any server to be the first one in cluster. You can use the current one. In my example it is `rabbit@cd27271cd9ff`.
Run the following on all servers in the cluster:
```bash
rabbitmqctl stop_app  
rabbitmqctl reset  
rabbitmqctl join_cluster rabbit@cd27271cd9ff
rabbitmqctl start_app
```
After this the output of the `cluster_status` and web UI on all servers will desplay tthe list of all servers in your cluster
You can use [HA-Proxy](/use-ha-proxy-rabbitmq/) to distribute the load between the servers i the cluster

The server-sde of the configuration is finished at this step

## Examples to create users, hosts and queues
You can use cli to create users, hosts and message queues.
Since all the commands are to be executed in bash you can create a set of variables that will repeat from server to server
```bash
user=username
password=password
vhost=name_of_the_vhost
queue_name=name_of_the_queue
exchange=the_name_of_exchange
```

Create vhost:
```bash
rabbitmqadmin declare vhost name=${vhost}
```

Create a user to access the vhost
```bash
rabbitmqadmin declare user name=${user} password=${password} tags=administrator  
rabbitmqadmin declare permission vhost=${vhost} user=${user} configure=`.\*` write=`.\*` read=`.*`
```

Create exchange buffer:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare exchange name=${exchange} type=fanout
```

Create message queue:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare queue name=${queue_name} durable=true
```

Create exchange buffer and a queue:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare binding source=${exchange} destination_type=queue destination=${queue_name}
```

Define HA policies for the cluster:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare policy name=ha_all pattern=`.*` definition='{`ha-mode`:`all`,`ha-sync-mode`:`automatic`}' apply-to=all
```

Usefull links:
  * [rabbitmqctl manual](https://www.rabbitmq.com/man/rabbitmqctl.1.man.html)
  * [WEB api manual](https://raw.githack.com/rabbitmq/rabbitmq-management/rabbitmq_v3_6_6/priv/www/api/index.html)
  * [Use Ha-Proxy for RabbitMQ](http://haproxy.tech-notes.net/use-ha-proxy-rabbitmq/)
