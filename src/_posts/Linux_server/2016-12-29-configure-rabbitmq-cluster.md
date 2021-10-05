---
id: 3608
title: Настройка отказоустойчивого кластера для RabbitMQ
date: 2016-12-29T16:55:34+00:00
author: admin

guid: http://www.tech-notes.net/?p=3608
permalink: /configure-rabbitmq-cluster/
image: /wp-content/uploads/2016/12/rabbitmq-logo.png
categories:
  - Linux server
  - Failover
tags:
  - RabbitMQ
---
RabbitMQ представляет собой универсальный способ обмена сообщениями между предложениями. Если Вы попали на эту страницу, значит Вы уже знаете что такое RabbitMQ, поэтому я не буду вдаваться в полемику.

Эта статья описывает настройку кластера RabbitMQ на базе серверов Linux CentOS v.7. Фишка кластера в том, что в нем нету понятия глобального мастера. Роль мастера отводится какому-либо серверу только в рамках одного события в очереди сообщений. Отключение одного сервера не валит всю систему, а после возвращения его в строй Вам не нужно думать о синхронизации данных - RabbitMQ сделает это сам.  

Итак по порядку. На каждом сервере в кластере выполняем следующие шаги:

Включаем EPEL

```bash
rpm -ivh http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-8.noarch.rpm
```

Устанавливаем нужные библиотеки:

```bash
yum install -y vim net-tools wget git zip unip openssh-server openssh logrotate socat
```

RabbitMQ требует `Erlang`. Есть 3 варианта
  * Установить Eplang какой есть в Epel - у меня с этой версией сыпались ошибки при исключении сервера из кластера
  * Скачать и установить последнюю версию Erlang с сайта разработчиков - RabbitMQ вообще не смог установиться используя этот пакет
  * Собрать Erlang, который оптимизирован под Rabbit и включает только нужные RabbitMQ компоненты - долгий путь, но именно он и является самым надежным

Создаем `rpm` пакет `Erlang`. Для этого Вам понадобится `Docker`. Его можно установить на сервер выполнять все удаленно. Второй вариант - установить `Docker` локально (на компьютер с Linux), собрать пакет и залить его потом на сервер. Естественно нету смысла собирать RPM пакет на каждом сервере отдельно. Будет эффективнее создать его один раз и скопировать на все сервера в кластере.

Клонируем репозиторий

```bash
git clone https://github.com/rabbitmq/erlang-rpm.git  
сd erlang-rpm/docker/  
sed -i 's/-i\ -t/-tty/g' build-rpm-in-docker.sh  
bash build-image-and-rpm.sh latest
```

По окончанию выполнения скрипта rpm файлы будут лежать в папке:

```bash
build-dir-latest/RPMS/x86_64/
```

Можно устанавливать `Erlang`

```bash
yum install -y build-dir-latest/RPMS/x86_64/erlang-19.2.0-1.el7.centos.x86_64.rpm  
yum install -y build-dir-latest/RPMS/x86_64/erlang-debuginfo-19.2.0-1.el7.centos.x86_64.rpm
```

Последняя версия `RabbitMQ` на сегодняшний день это v.3.6.6.

```bash
wget -O /tmp/rabbitmq-server-3.6.6-1.el7.noarch.rpm https://www.rabbitmq.com/releases/rabbitmq-server/v3.6.6/rabbitmq-server-3.6.6-1.el7.noarch.rpm -no-check-certificate  
rpm -import http://www.rabbitmq.com/rabbitmq-release-signing-key.asc  
yum install -y /tmp/rabbitmq-server-3.6.6-1.el7.noarch.rpm
```

<center>
  <div id="gads">
  </div>
</center>

У RabbitMQ есть web интерфейс и WebAPI, которое очень полезно в ежедневном использовании. По умолчанию оно выключено. Включается плагином:

```bash
rabbitmq-plugins enable rabbitmq_management
```

Вам будет предложено перезапустить RabbitMQ. После этого WEB интерфейс будет доступен на 15672-м порту.:  
http://ip_адрес_сервера:15672/

Стандартный пользователь:
  * логин: guest
  * пароль: guest

На первой-же странице Вы увидите состояние кластера. (пока только один сервер)

Для получения сведений из консоли - выполните:

```bash
rabbitmqctl cluster_status
```

В результате Вы получите что-то в стиле:

```bash
[root@cd27271cd9ff /]# rabbitmqctl cluster_status
Cluster status of node rabbit@cd27271cd9ff ...
[{nodes,[{disc,[rabbit@cd27271cd9ff]}]},
 {running_nodes,[rabbit@cd27271cd9ff]},
 {cluster_name,<<"rabbit@cd27271cd9ff">>},
 {partitions,[]},
 {alarms,[{rabbit@cd27271cd9ff,[]}]}]
```


До этого момента Вы видите только один сервер. Осталось объединить все Ваши сервера в один кластер. Для этого Вам понадобится 2 вещи:
1. Значение Erlang cookie - оно должно быть одинаковым на всех серверах. Его можно получить из следущего файла:
  * `/var/lib/rabbitmq/.erlang.cookie`
Этот файл должен быть одинаковым на всех серверах, принадлежать пользователю rabbitmq и иметь права доступа 600.  
После изменения файла нужно перезапустить демон rabbitmq</li>
  * Имя сервера, который будет считаться первым в кластере (не мастером, а просто первым в кластере)</ol>

1. Дальше выберите один из серверов (первый в вашем списке) в результатах вывода `cluster_status`. В этом примере - `rabbit@cd27271cd9ff`. Копируем в буфер обмена с первого сервера и выполняем следующее на всех остальных серверах:
```bash
rabbitmqctl stop_app  
rabbitmqctl reset  
rabbitmqctl join_cluster rabbit@cd27271cd9ff
rabbitmqctl start_app
```
После этого вывод `cluster_status` и WEB интерфейс на любом из серверов кластера будут содержать имена всех серверов.

Для распределения запросов между серверами можно [воспользоваться HA-Proxy](http://haproxy.tech-notes.net/use-ha-proxy-rabbitmq/).

На этом серверная часть настройки закончена. Ниэже я привожу пример того, как можно создать хосты, пользователей и очереди сообщений. Эти действия можно выполнять на одном сервере.

Поскольку все команды выполняются в bash, рекомендую объявить несколько переменных, которые будут повторяться в дальнейших командах
```bash
user=`имя_пользователя`  
password=`пароль_пользователя`  
vhost=`имя_виртуального_хоста`  
queue_name=`название_очереди_сообщений`  
exchange=`имя_для_обменника`
```

Создаем виртуальны хост:
```bash
rabbitmqadmin declare vhost name=${vhost}
```

Создаем пользователя для доступа к хосту:
```bash
rabbitmqadmin declare user name=${user} password=${password} tags=administrator  
rabbitmqadmin declare permission vhost=${vhost} user=${user} configure=`.\*` write=`.\*` read=`.*`
```

Создаем буфер обмена:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare exchange name=${exchange} type=fanout
```

Создаем очередь сообщений:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare queue name=${queue_name} durable=true
```

Связываем буфер обмена с очередью сообщений:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare binding source=${exchange} destination_type=queue destination=${queue_name}
```

Определяем HA (high availability) политики для кластера:
```bash
rabbitmqadmin -V ${vhost} -u ${user} -p ${password} declare policy name=ha_all pattern=`.*` definition='{`ha-mode`:`all`,`ha-sync-mode`:`automatic`}' apply-to=all
```

Полезные ресурсы:
  * [Инструкция к rabbitmqctl](https://www.rabbitmq.com/man/rabbitmqctl.1.man.html)
  * [Инструкция к WEB api](https://raw.githack.com/rabbitmq/rabbitmq-management/rabbitmq_v3_6_6/priv/www/api/index.html)
  * [Использование Ha-Proxy для RabbitMQ](http://haproxy.tech-notes.net/use-ha-proxy-rabbitmq/)
