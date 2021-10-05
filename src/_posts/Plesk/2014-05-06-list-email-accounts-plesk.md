---
id: 798
title: 'Plesk: Просмотр всех почтовый ящиков на сервере'
date: 2014-05-06T14:31:47+00:00
author: admin

guid: http://www.tech-notes.net/?p=798
permalink: /list-email-accounts-plesk/
image: /wp-content/uploads/2014/02/sp-logo-plesk.png
categories:
  - Plesk
tags:
  - Plesk
---
Для начала подключаемся к mysql:  
```bash
mysql -uadmin -p`cat /etc/psa/.psa.shadow` psa
```

Вот такой mysql запрос выведет информацию о всех почтовых ящиках, которые существуют на сервере с Plesk панелью

```sql
SELECT CONCAT_WS('@',mail.mail_name,domains.name),mail.redir_addr, mail.redirect ,accounts.password
FROM domains,mail,accounts WHERE domains.id=mail.dom_id AND accounts.id=mail.account_id
ORDER BY domains.name ASC,mail.mail_name ASC;
```

Результаты будут содержать так называемые 'email forwarders' - адреса на которые пересылается почта для конкретного ящика.

Если это информация не нужна, можно использовать вот такой запрос:
```sql
SELECT CONCAT_WS('@',mail.mail_name,domains.name),accounts.password FROM domains,mail,accounts WHERE domains.id=mail.dom_id AND accounts.id=mail.account_id ORDER BY domains.name ASC,mail.mail_name ASC;
```

Выборка почтовых ящиков, включая имя системного пользователя Plesk:
```sql
SELECT domains.name, sys_users.login, mail.mail_name from domains,hosting, sys_users, mail WHERE domains.id=hosting.dom_id AND hosting.sys_user_id=sys_users.id and domains.id=mail.dom_id;
```

Можно создать батч файл для трансфера почтовых файлов на WHM сервер:
```bash
echo "use psa; SELECT concat('/',domains.name, '/', mail.mail_name), concat('/home/',sys_users.login,'/mail/',domains.name, '/')  from domains,hosting, sys_users, mail WHERE domains.id=hosting.dom_id AND hosting.sys_user_id=sys_users.id and domains.id=mail.dom_id " |mysql |awk '{print "rsync -Hogva /var/qmail/mailnames"$1" root@server_ip:"$2}'
```
