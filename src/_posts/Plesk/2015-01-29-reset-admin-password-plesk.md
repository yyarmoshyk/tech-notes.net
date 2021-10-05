---
id: 2334
title: Как получить/изменить пароль админа в Plesk из командной строки
date: 2015-01-29T14:29:24+00:00
author: admin

guid: http://www.tech-notes.net/?p=2334
permalink: /reset-admin-password-plesk/
image: /wp-content/uploads/2014/02/sp-logo-plesk.png
categories:
  - Plesk
tags:
  - plesk admin
  - пароль админа plesk
---
В случае использования панели Plesk admin и root - разные пользователи, и их пароли могут отличаться. Тоесть вы можете иметь ssh доступ к серверу используя учетную запись root, но в саму панель попасть нельзя.

Есть два варианта как узнать пароль админа:

### 1. Файл .psa.shadow.

Выполните следующую команду в консоли:

```bash
cat /etc/psa/.psa.shadow
```

На старых версиях Вы с большой вероятностью получите пароль админа. В новых же версиях он шифруется с помощью флгоритма AES-128. В результате чего вы получите абракадабру.

В любом случае с ней можно подключиться к mysql:

```bash
mysql -uadmin -p`cat /etc/psa/.psa.shadow`
```

### 2. Утилиты Plesk:

С вероятностью в 100% следующая команда вернет Вам текущий пароль админа панели:

```bash
/usr/local/psa/bin/admin -show-password
```

Если пароль Вам не нравится - можете его сбросить:

```bash
/usr/local/psa/bin/init_conf -u -passwd **new_password**
```
