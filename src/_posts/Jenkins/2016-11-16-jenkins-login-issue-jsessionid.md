---
id: 3512
title: Проблемы с повторным логином в Jenkins
date: 2016-11-16T16:13:01+00:00
author: admin

guid: http://www.tech-notes.net/?p=3512
permalink: /jenkins-login-issue-jsessionid/
image: /wp-content/uploads/2015/10/tomcat-jenkins-200x200.png
categories:
  - Jenkins
---
Сегодня столкнулся с проблемой повторного логина в Jenkins. После разрыва сессии в результате рестарта демона Tomcat мне предлагалось залогиниться по новой, вот только логины были неудачными.

Виной всему была кука - `JSESSIONID`, которую нужно было удалять руками каждый раз перед повторным логином:  
<img src="/wp-content/uploads/2016/11/Screenshot-from-2016-11-16-08-01-14.png" alt="screenshot-from-2016-11-16-08-01-14" width="1149" height="314" class="aligncenter size-full wp-image-3516" />

для того чтобы все заработало нужно отредактировать конфиг Tomcat `/usr/share/tomcat/conf/server.xml` и добавить `session="false"` в соответствующую секцию.

Пример полной секции приведен ниже:

```bash
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               URIEncoding="UTF-8"
               session="false" />
```
