---
id: 3512
title: Problems with re-login into Jenkins
date: 2016-11-16T16:13:01+00:00
author: admin

guid: http://www.tech-notes.net/?p=3512
permalink: /jenkins-login-issue-jsessionid/
image: /wp-content/uploads/2015/10/tomcat-jenkins-200x200.png
categories:
  - Jenkins
---
Today I ran into a problem with re-login in Jenkins. After the session was broken as a result of restarting the Tomcat daemon, I was asked to log in with a new one, but the logins were unsuccessful.

The culprit was the cookie - `JSESSIONID` which had to be deleted manually each time before re-login:
<img src="/wp-content/uploads/2016/11/Screenshot-from-2016-11-16-08-01-14.png" alt="screenshot-from-2016-11-16-08-01-14" width="1149" height="314" class="aligncenter size-full wp-image-3516" />

in order for everything to work, you need to edit the Tomcat config `/usr/share/tomcat/conf/server.xml` and add `session="false"` to the appropriate section.

An example of a complete section is shown below:
```bash
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
               URIEncoding="UTF-8"
               session="false" />
```
