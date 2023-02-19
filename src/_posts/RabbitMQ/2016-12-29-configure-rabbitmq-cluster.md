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

The most officient way to do this is to run it in Docker containers. 

## Run on all servers
So you got to have docker and docker-compose installed on all 3 servers
1. Docker install [instructions for Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
1. Docker install [instructions for Centos](https://docs.docker.com/engine/install/centos/)
1. docker-compose install [instructions for Linux](https://docs.docker.com/compose/install/other/#on-linux) on all the servers.

RabbitMQ cluster is using the erlang cookie to authorize nodes in the cluster. You can generate any random string for this.

Run the following on all servers:
```bash
mkdir -p /opt/rabbitmq/{data,logs}
echo ${ERLANG_COOKIE} > /opt/rabbitmq/data/.erlang.cookie

chmod 600 /opt/rabbitmq/data/.erlang.cookie
chmod 777 /opt/rabbitmq/log/
```

Servers inside the cluster need to be able to resolve each other with the short DNS names. For this you'll need to update the `/etc/hosts` file on all servers:
```bash
echo """
1.1.1.1 server-1
2.2.2.2 server-2
3.3.3.3 server-3
""" >> /etc/hosts
```
Create `docker-compose.yaml`
```bash
cat <<EOF > /opt/rabbitmq/docker-compose.yaml
version: '2'
services:
  rabbitmq:        
    image: rabbitmq:3.10-management
    container_name: '$(uname -n)'
    environment:
        - RABBITMQ_NODENAME=rabbit@$(uname -n)
    ports:
        - 4369:4369
        - 5672:5672
        - 15672:15672
        - 25672:25672
    volumes:
        - /opt/rabbitmq/data/:/var/lib/rabbitmq/
        - /opt/rabbitmq/log/:/var/log/rabbitmq
EOF
```

Start containers:
```bash
docker-compose -f /opt/rabbitmq/docker-compose.yaml up -d 
```
<center>
  <div id="gads">
  </div>
</center>

## Connect all servers into a cluster
The following commands should be executed on the slave nodes. You can use server-1 as master and run the following on `server-2` and `server-3`:
```bash
docker exec --tty $(uname -n) rabbitmqctl stop_app
docker exec --tty $(uname -n) rabbitmqctl reset
docker exec --tty $(uname -n) rabbitmqctl join_cluster rabbit@server-1
docker exec --tty $(uname -n) rabbitmqctl start_app
```

The following can be used to get the data from the cli:
```bash
rabbitmqctl cluster_status
```

Sample output:
```bash
docker exec --tty $(uname -n) rabbitmqctl cluster_status
Cluster status of node rabbit@cd27271cd9ff ...
[{nodes,[{disc,[rabbit@cd27271cd9ff]}]},
 {running_nodes,[rabbit@cd27271cd9ff]},
 {cluster_name,<<"rabbit@cd27271cd9ff">>},
 {partitions,[]},
 {alarms,[{rabbit@cd27271cd9ff,[]}]}]
```

<center>
  <div id="gads">
  </div>
</center>

## UI
RabbitMQ has a nice web UI that can be very helpfull in every day usage. It is disabled by default. Run the following in order to enabpe it:
```bash
rabbitmq-plugins enable rabbitmq_management
```

`RabbitMQ` will prompt to be restarted and after it the UI will be available on the 15672 port. Use the server IP address to access it `http://%server_ip_address%:15672/`

Standard user:
  * login: guest
  * password: guest

On the first page you'll see the state of the cluster (there is only one server in it so far)

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
The following commands can be executed on any node in the cluster inside the docker container:
```bash
docker exec --tty $(uname -n) 
```
Or attach to the container console by running the following:
```bash
docker exec -it $(uname -n) bash
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
