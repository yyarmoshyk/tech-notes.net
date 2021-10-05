---
id: 154
title: Skype4py скрипт для отправки сообщений в Skype из консоли Linux Ubuntu
date: 2014-01-29T20:28:56+00:00
author: admin

guid: http://wp38.local/?p=154
permalink: /skype4py-send-skype-messages-from-bash/
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2014/01/MIL55.jpg
categories:
  - Python
tags:
  - bash
  - python
  - skype
  - Skype4py
  - отправка сообщений
  - скайп
---
Небольшая заметка на тему, как заставить Bash скрипты отправлять сообщения в Skype.

Для начала нужно скачать библиотеку <a href="https://github.com/awahlig/skype4py" target="_blank">Skype4py</a>.

Распаковываем, заходим в папку и запускаем setup.py:

```bash
sudo python setup.py
```

Дальше нужно создать скрипт которым мы будем отправлять сообщения. Очень хорошо было бы ложить его в папку, которая входит в переменное окружение $PATH - это позволит вызывать скрипт из любого каталога системы без полного пути к нему.  
Проверить $PATH можно так:

```bash
echo $PATH
```

Мне выдало вот такое:
```bash
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/java/jre1.7.0_15/bin
```

Желательно делать это с правами пользователя, под которым планируется использование скрипта.

Берем первую, попавшуюся под руки папку (`/usr/local/sbin`) и создаем в ней файл `send_message.py`:

```python
#!/usr/bin/python
#
# This script allows to sent messages to skype
# using skype API for python
  import Skype4Py
  import sys
    client = Skype4Py.Skype()
    client.Attach()
    user = sys.argv[1]
    message = sys.argv[2]
    client.SendMessage(user, message)
```


Проблема этой схемы заключается в том, что Skype4Py работает с инстансом запущенного в системе приложения Skype и берет информацию из него. Подключение осуществляется банальной функцией client.Attach. Если в системе запущено несколько приложений Skype, тогда client.Attach присоединится к тому, которое было запущено последним.

### Использование:

```bash
./send_message.py contact_user.Handle "message"
```

<p>
  Получение имени под которым Вы залогинены в Skype (можно использовать для определение приложения Skype, с которым работает Skype4Py):
</p>

```bash
python -c 'import Skype4Py; client = Skype4Py.Skype(); client.Attach(); print client.CurrentUser.FullName, "(", client.CurrentUser.Handle, ")"'
```

Отображение списка контактов:
```bash
python -c 'import Skype4Py; client = Skype4Py.Skype(); client.Attach();
for user in client.Friends: print user.Handle, "(", user.FullName, ")";'
```
