---
id: 1947
title: Установка Solr + Tomcat6 на CentOS
date: 2014-10-18T16:02:02+00:00
author: admin

guid: http://www.tech-notes.net/?p=1947
permalink: /install-solr-tomcat-centos/
panels_data:
  - 'a:0:{}'
image: /wp-content/uploads/2014/10/solr.png
categories:
  - CentOS
  - Linux server
  - Tomcat
tags:
  - solr tomcat
  - установка solr
---
Solr не нуждается в tomcat&#8217;е для работы. Можно использовать встроенный функционал для запуска его на порту 8983.

Если же Вам нужно, что бы Solr работал как апликуха в томкате - читайте дальше.  
<!--more-->

Для начала нужно установить tomcat и java:

> yum install tomcat6 java-1.7.0-openjdk wget

Поставим Tomcat на автозагрузку:

> chkconfig tomcat6 on

Теперь скачиваем Solr. Размещать его рекомендую в папке opt:

> cd /opt  
> wget http://apache.spinellicreations.com/lucene/solr/6.2.1/solr-6.2.1.zip  
> unzip solr-6.2.1.zip  
> chown -R tomcat solr-6.2.1

Теперь нужно скопировать war файл из папки Solr в папку приложений tomcat:

> cp /opt/solr-6.2.1/dist/solr-6.2.1.war /usr/share/tomcat6/webapps/solr.war

Копируем дополнительные модули в папку с библиотеками tomcat:

> cp /opt/solr-6.2.1/example/lib/ext/* /usr/share/tomcat6/lib/

Перезапускаем tomcat для того что бы создать окружение приложения Solr:

> service tomcat6 restart

Открываем для редактирования файл приложения:

> nano /usr/share/tomcat6/webapps/solr/WEB-INF/web.xml

```bash
&lt;env-entry>
       &lt;env-entry-name&gt;solr/home&lt;/env-entry-name&gt;
       &lt;env-entry-value&gt;/put/your/solr/home/here&lt;/env-entry-value&gt;
       &lt;env-entry-type&gt;java.lang.String&lt;/env-entry-type&gt;
    &gt;/env-entry&gt;

```


Эта секция будет закомментирована. Убираем маркеры комментария до (<!-) и после (->) нее.  
Меняем `/put/your/solr/home/here` на `/opt/solr-6.2.1/example/solr`

Осталось немного подкрутить настройки tomcat:

> nano /usr/share/tomcat6/conf/tomcat6.conf

Установим значение переменного окружения JAVA_HOME:

> JAVA_HOME=`/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.71.x86_64&#8243;

Добавим дополнительные опции:

> JAVA_OPTS=`-Xmx5000m`

Удостовертесь, что пользователь выставлен следующим образом:

> TOMCAT_USER=`tomcat`

<center>
  <div id="gads">
  </div>
</center>

Перезапускаем tomcat для того что бы изменения вступили в силу:

> service tomcat6 restart

После Solr станет доступен по следующей ссылке:

```bash
http://ip_сервера:8080/solr/
```


<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>