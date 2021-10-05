---
id: 1999
title: Краткий обзор возможностей HaProxy
date: 2014-10-23T12:55:11+00:00
author: admin

guid: http://www.tech-notes.net/?p=1999
permalink: /haproxy-configuration-overview/
image: /wp-content/uploads/2014/10/160x160-haproxy_logo.png
categories:
  - Clusters
  - Балансировка нагрузки
tags:
  - HaProxy
---
HaProxy - чудодивный и очень гибкий инструмент для балансировки трафика. Имеет целую кучу опций и вариантов настройки, а также имеет свои причуды. Мне будет очень тяжело изложить содержание всех моих черновиков на эту тему в рамках этой статьи, поскольку она получится большой и тяжелой для усваивания, но я постараюсь дать обзор базовых принципов настройки.  
<!--more-->

На момент написания статьи вышел стабильный релиз 1.5.3 с поддержкой балансировки SSL соединений. В те времена, когда мне приходилось работать с Haproxy, доставка SSL трафика к конечному серверу производилась обычным форвардингом соединения на 443 порт.

К сожалению в репозитариях CentOS и Ubuntu последняя версия еще не доступна. Поэтому ее не буду рассматривать. О том, как установить и настроить HaProxy из исходников будет отдельная статья.

Устанавливается оно с помощью обычно мэнэджера пакетов. Дальше буду работать с CentOS:

> yum install haproxy

После установки файл настроек сохраняется в `/etc/haproxy`

По умолчанию в этом файле можно описать все настройки. Есть общие настройки haproxy и настройки так называемых бэк-эндов (back-ends).

Общие настройки из секции `global`, как правило не требуют изменений.

Конфигурацию бэк-эндов я рассмотрю подробнее. Бэк-эндом (BackEnd) называется сервер, который находится за балансировщиком нагрузки, многие их называют головами или вэб головами (web heads). Есть два подхода к описанию кластеров серверов, находящихся за балансировщиком нагрузки:

**1. Простой метод `listen->servers`** используется в том случае, если у Вас есть несколько вэб серверов (допустим 3), их параметры одинаковы (CPU/RAM) и весь трафик равномерно распределяется между ними. В функционале серверов нету разницы. Каждый из них в равной степени может обрабатывать все входящие запросы. В таком случае

```bash
listen listener_mane
bind <strong>ip_address</strong>:80
option &lt;option1&gt;
option &lt;option2&gt;
....................
option &lt;optionN&lt;
server server1 192.168.1.10:80 &lt;option1&gt; &lt;option2&gt; ... &lt;option N>
server server2 192.168.1.20:80 &lt;option1&gt; &lt;option2&gt; ... &lt;option N>
server server3 192.168.1.30:80 &lt;option1&gt; &lt;option2&gt; ... &lt;option N>
```


<center>
  <div id="gads">
  </div>
</center>

2. **Более тонкий метод `frontend->backend->servers`**. В этом случае сервера групируются в так называемые backend, которые по сути представляют собой подобие секции `listen`, описанной в предыдущем пункте. Backendы в свою очередь объединятся в гллобальный frontend. 

```bash
frontend &lt;instance_name&gt;
bind &lt;ip_address:port&gt;
mode &lt;layer mode&gt;
option &lt;option1&gt;
option &lt;option2&gt;
…
option &lt;optionN&gt;
acl &lt;acl_name1&gt; &lt;acl_type&gt; &lt;acl_definition&gt;

use_backend &lt;backend_name&gt; if &lt;acl_name1&gt; 
default_backend &lt;backend_name&gt;

backend static &lt;backend_name&gt;
balance &lt;ballance method&gt;
option &lt;option1&gt;
option &lt;option2&gt;
…
option &lt;optionN&gt;
server &lt;server_name1&gt; &lt;nod_ip_address&gt;:&lt;port&gt; &lt;option1&gt; &lt;option2&gt; … &lt;option N&gt;
server &lt;server_name2&gt; &lt;nod_ip_address&gt;:&lt;port&gt; &lt;option1&gt; &lt;option2&gt; … &lt;option N&gt;

backend web&lt;backend_name&gt; server &lt;server_name2&gt; &lt;nod_ip_address&gt;:&lt;port&gt; &lt;option1&gt; &lt;option2&gt; … &lt;option N&gt;
backend backoffice &lt;backend_name&gt; server &lt;server_name2&gt; &lt;nod_ip_address&gt;:&lt;port&gt; &lt;option1&gt; &lt;option2&gt; … &lt;option N&gt;
```


**bind** - определяет ip адрес и порт, на котором будет создан ip сокет для входящих соединений.

Что же качается режимов <a href="http://haproxy.tech-notes.net/balancing-modes/" target="_blank">балансироваки нагрузки</a> (**mode <layer mode>**), то их всего два:

  * **http** - используется исключительно для балансировки http трафика (уровень 7 OSI). Позволяет использовать возможности манипуляции с заголовками, куками и т.д.
  * **tcp** - универсальный режим. Можно использовать для балансироваки любого трафика (https, mysql, smtp, и т.д.)

**option** - с помощью этой директив можно включить дополнительные плюшки для необходимой секции. Все опции можно посмотреть <a href="http://haproxy.tech-notes.net/5-1-bind-options/" target="_blank">здесь.</a>

**Практические примеры по настройке** можно почитать [здесь](http://www.tech-notes.net/haproxy-configuration-examples/ "Примеры настройки HaProxy").

Описание всех опций секции seerver можно найти по адресу <a href="http://haproxy.tech-notes.net/5-2-server-and-default-server-options/" target="_blank">http://haproxy.tech-notes.net/5-2-server-and-default-server-options/</a>

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>