---
id: 1749
title: Запрет удаления писем в Dovecot из почтового клиента
date: 2014-09-23T12:19:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=1749
permalink: /disallow-delete-emails-dovecot/
image: /wp-content/uploads/2014/05/dovecot.jpg
categories:
  - Почта
tags:
  - Dovecot
  - FromHabrSandbox
---
Выдалась интересная задача. Нужно сделать так, чтобы даже если у пользователя стоит в почтовом ПО удалять письма с сервера — они все равно оставались на сервере — т.е не удалялись. Это относилось, как к входящим, так и к исходящим письмам.  

ПО: dovecot 2.2.13. Ставим dovecot через любой менеджер пакетов.  
OC: Debian 7.x

После чего необходимо будет отредактировать несколько файлов. Первое, что нам нужно сделать, это создать папку global-acls в директории `/etc/dovecot` и создать там 2 файла: INBOX и Sent со следующим содержанием:

```bash
owner lrwsipka authenticated lrwsipka
```


После этого зайти в директорию `conf.d` и отредактировать два файла `20-imap.conf` и `20-pop3.conf`

Приводим строки с mail_plugins к следующему виду:

```bash
imap:mail_plugins = $mail_plugins quota imap_quota acl
pop3:mail_plugins = $mail_plugins quota acl

```

Так же отредактируем `10-mail.conf`, чтобы у нас были папки: Sent, Trash и тп и тд.

```bash
namespace inbox {
  inbox = yes mailbox Drafts {
    auto = subscribe special_use = \Drafts
  }
  mailbox Junk {
    special_use = \Junk
  }
  mailbox Sent {
    auto = subscribe special_use = \Sent
  }
  mailbox "Sent Messages" {
    auto = subscribe special_use = \Sent
  }
  mailbox Trash {
    auto = subscribe special_use = \Trash
  }
}
```


Перезапускаем dovecot и проверяем. В веб-клиенте (`roundcube`) при попытке удалить письмо выйдет ошибка: Доступ запрещен. С программами типа OutLook необходимо настроить синхронизацию IMAP каталогов, чтобы все корректно работало.

(С) <a href="http://habrahabr.ru/sandbox/87419/" target="_blank">Отто Юльевич Шмидт</a>
