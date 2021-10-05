---
id: 2673
title: Простая установка mod_security на CentOS 5.8
date: 2015-06-09T17:14:58+00:00
author: admin

guid: /?p=2673
permalink: /install-mod_security-centos-5-8/
image: /wp-content/uploads/2015/02/mod-security.png
categories:
  - Apache
  - Безопасность
tags:
  - mod_security
---
В этой статье я буду устанавливать mod_security из того, что доступна в Epel репозитарии для CentOS 5.8.

Уже есть такая [статья](/install-modsecurity-for-apache/). Она более обширная и предусматривает установку `mod_security` самой последней версии испульзуя исходный код.

Как Вы, наверное, поняли, для начала нужно [подключить репу Epel.](/epel-remi-atrpms-rhel-centos/)

Приступаем к установке:

```bash
yum install mod_log_post mod_security mod_security_crs mod_security_crs-extras
```

Сразу после этого все уже будет везде прописано, добавлено и включено.

Для скрытия версии апача, отключения Trace метода можно внести следующие строки в `/etc/httpd/conf.d/modsecurity.conf`:

```bash
ServerSignature Off  
ServerTokens Prod  
TraceEnable Off
```

В конфиге больше ничего менять, в принцыпе, не нужно.

Рекомендую удалить слудющие правила, поскольку они могут нарушить функциональность Вашего сайта:

```bash
rm /etc/httpd/modsecurity.d/activated_rules/modsecurity_crs_35_bad_robots.conf  
rm /etc/httpd/modsecurity.d/activated_rules/modsecurity_crs_41_sql_injection_attacks.conf  
rm /etc/httpd/modsecurity.d/activated_rules/modsecurity_crs_21_protocol_anomalies.conf
```

Рестартуем демон Apache что бы изменения вступили в силу:

```bash
service httpd restart
```
