---
id: 3213
title: Используем DKIM подпись для исходящей почты
date: 2016-02-29T11:39:38+00:00
author: admin

guid: http://www.tech-notes.net/?p=3213
permalink: /use-dkim-to-sign-outgoing-mail/
image: /wp-content/uploads/2016/02/dkim-logo.png
categories:
  - Почта
tags:
  - dkim
  - exim
  - postfix
---
Было заработано несколько систем для защиты [почты от спуфинга](https://en.wikipedia.org/wiki/Email_spoofing). По сути любой человек моет отправить письмо от любого домена (в том числе и tech-notes.net) используя подход описанный в [этой статье](/wordpress-contact-form/)

Самыми эффективными, пока что, являются [DKIM](https://en.wikipedia.org/wiki/Sender_Policy_Framework" target="_blank">SPF</a> и <a href="https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail).

**SPF** - это просто DNS запись типа TXT, со списком ip адресов или доменных имен серверов, которым разрешено отправлять почту от имени домена.

**DKIM** использует более продвинутый механизм, которой предусматривает использование RSA ключей для подписи и верификации почты. Сам принцип похож на GPG, только со следующим отличием:

  * Публичный ключ для домена хранится в DNS
  * Приватный колюч для каждого домена хранится на сервере

**Как работает DKIM?**  
Как известно каждое письмо содержит набор заголовков. Я не буду отдельно останавливаться на этом. Так вот при отправке письма, почтовый демон хэширует эти заголовки и подписывает их с помощью приватного RSA кюча. Почтовый сервер, принимающий почту, проверяет совпадает ли хэш подписи с хешем публичного ключа в DNS зоне. Если совпадает - все ОК, если нет - действует согласно настройкам спамфильтра.

Популярные почтовики такие как Gmail и AOL/Yahoo в последнее время стали не только класть такие письма в папку `SPAM`, а просто отказываются из доставлять, возвращая отправителю.

**Чем опасно игнорирование DKIM/SPF?**  
Доставка почтовых уведомление очень важна для интернет магазинов. Если письма с подтверждением заказа не будут доставляться клиентам, то люди просто могут отказаться от покупки в Вашем магазине.

**Что же делать?**  
Настройка DKIM включает следующие шаги:
  1. Созднаие пары ключей RSA, которые будут использованы для подписи и валидации отправляемой почты.
  1. Создать DNS запись, содержащую публичный ключ.
  1. Настройка почтового демона на использование приватного ключа для подписи исходящей почты

**1. Создаем пару ключей RSA**  
В среде Linux воспользуемся функционалом `openssl`

```bash
openssl genrsa -out /etc/ssl/private/**example.com**-private.pem 1024 -outform PEM  
openssl rsa -in /etc/ssl/private/**example.com**-private.pem -out /etc/ssl/certs/**example.com**-public.pem -pubout -outform PEM
```

Если У вас нету под рукой системы Linux - воспользуйтесь любым онлайн генератором. Мне очень помог следующий ресурс:  
[https://www.port25.com/support/domainkeysdkim-wizard/](https://www.port25.com/support/domainkeysdkim-wizard/)

В случае с онлайн генераторами, дочитайте статью до конца, что бы иметь общее представление что с чем кушать.

На выходе у вас будет два файла:
  1. **/etc/ssl/private/example.com-private.pem** - приватный ключ, который будет использоваться для подписи заголовков писем
  2. **/etc/ssl/certs/example.com-public.pem** - публичный ключ, который будет находится в DNS зоне и будет использоваться для валидации входящих писем почтовыми сервисами

**2. Создаем DNS запись с публичным ключом.**  
Для этого Вам понадобится содержимое файла публичного ключа:

```bash
cat /etc/ssl/certs/example.com-public.pem
```

Выглядит он следующим образом:

```bash
--BEGIN PUBLIC KEY--  
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6MA3nwnUY9xdxftjSezCw0qgF  
8D2dwroEwc5fB/eI3JPdN3c9vAW37e6WpWEao9MEczGzMOj78SLQSKlXyQEtM4N2  
/Fld/fRve+iZJzT481jK9U34vZGYTUxWe2wHlUQHV8Vc1yDASF/1zpZg1ePMOCc7  
N+ocXzhSTQxo0c8jqwIDAQAB  
--END PUBLIC KEY--
```

Нас интересует все, что находится между тегами:

```bash
--BEGIN PUBLIC KEY--  
...
--END PUBLIC KEY--
```

Именно эта абракадабра будет использоваться в значении поля TXT записи в DNS зоне.

Переходим в панель управления DNS зоной Вашего сайта и создаем запись согласно следующим параметрам:

  1. **Домен**: _key1_._domainkey.example.com  
    Вместо _key1_ можно использовать что угодно. Варианты:      * имя сервера
      * сегодняшнюю дату
      * имя домашнего питомца
  2. **Тип**: TXT
  3. **Значение (Value)**:`"k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD6MA3nwnUY9xdxftjSezCw0qgF8D2dwroEwc5fB/eI3JPdN3c9vAW37e6WpWEao9MEczGzMOj78SLQSKlXyQEtM4N2/Fld/fRve+iZJzT481jK9U34vZGYTUxWe2wHlUQHV8Vc1yDASF/1zpZg1ePMOCc7N+ocXzhSTQxo0c8jqwIDAQAB"`  

Вот эта длинная абракадабра и есть публичный ключ, который сгенерировали пару минут назад.

После сохранения изменений нужно выждать некоторое время что бы они распространились по миру. Проверить скорость распространения можно с помощью следующего ресурса:  
[https://www.whatsmydns.net/#TXT/](https://www.whatsmydns.net/#TXT/)

**3. Настройка почтового демона на использование приватного ключа для подписи исходящей почты.**  
Осталось дело за малым. Я постараюсь расширить эту статью возможными настройкой DKIM для всех популярных почтовых серверов  

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript"></script>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Exim
  </div>
  <div class="spoiler-body">
  Создайте файл `/etc/exim4/conf.d/main/00_local_macros` со следущим содержанием:
  <pre>    DKIM_CANON = relaxed
    DKIM_SELECTOR = key1
    DKIM_DOMAIN = example.com
    DKIM_FILE = /etc/ssl/private/example.com-private.pem</pre>
  Обратите внимание на `DKIM_SELECTOR`.
  Выполните следующие команды, что бы изменения вступили в силу:
  <pre>
    update-exim4.conf
    service exim4 restart
  </pre>
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Postfix
  </div>
  <div class="spoiler-body">

  Установите `opendkim`
  <pre>
    apt-get install opendkim opendkim-tools
  </pre>

  Отрадектируйте конфигурационный файл `/etc/opendkim.conf` следующими строками:

  <pre>
    Domain example.com
    KeyFile /etc/ssl/private/example.com-private.pem
    Selector key1
    SOCKET inet:8891@localhost
  </pre>

  Если Ваш сервер отпрявляет почту от имени нескольких доменов, то их нужно описать в этом же файле иначе `opendkim` будет их игнорировать.

  Вообще нету ничего страшного в том, что бы использовать один ключ для все доменв на Вашем сервере.

  Отредактируйте файл `/etc/default/opendkim`. Нужно изменить сокет по умолчанию. Для этого добавте в конец следующую строку:

  <pre>
    SOCKET=`inet:8891@localhost`
  </pre>

  Редактируем главный конфиг Postfix (`/etc/postfix/main.cf`) следующими строками:

  <pre>
    # DKIM
    milter_default_action = accept
    milter_protocol = 2
    smtpd_milters = inet:localhost:8891
    non_smtpd_milters = inet:localhost:8891
  </pre>

  Нужно перезапустить демоны `postfix` и `opendkim` что бы все заработало.

  Хочу обратить внимание на то что `opendkim` откажется запускаться, если ему не понравятся права выставленные для файла `example.com-private.pem`. Выполните следующую команду, что бы уж на верняка:

  <pre>
    chmod 600 /etc/ssl/private/example.com-private.pem
  </pre>

  Теперь перезапускаем:

  <pre>
    service opendkim restart
    service postfix restart
  </pre>

  Хорошая статья привдена на [HoToForge](https://www.howtoforge.com/set-up-dkim-domainkeys-identified-mail-working-with-postfix-on-centos-using-opendkim). В ней рассматривается установка OpenDKIM из исходника.
  </div>
</div>

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Qmail
  </div>

  <div class="spoiler-body">
  Врятли здесь что-то появится, поскольку примерно не представлю когда предвидится настраивать `Qmail`.
  </div>
</div>

В результате заголовки выглядят следующим образом:
<img src="/wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815.png" alt="Screenshot from 2016-03-01 11:48:15" width="693" height="537" class="aligncenter size-full wp-image-3226" srcset="/wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815.png 693w, /wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815-170x132.png 170w, /wp-content/uploads/2016/02/Screenshot-from-2016-03-01-114815-300x232.png 300w" sizes="(max-width: 693px) 100vw, 693px" />

Список литературы:
<ol>
  <li>
    <a href="https://www.debian-administration.org/article/718/DKIM-signing_outgoing_mail_with_exim4">debian-administration.org/DKIM-signing_outgoing_mail_with_exim4</a>
  </li>
  <li>
    a href="http://mikepultz.com/2010/02/using-dkim-in-exim/">mikepultz.com/using-dkim-in-exim</a>
  </li>
  <li>
    <a href="https://easyengine.io/tutorials/mail/dkim-postfix-ubuntu/">easyengine.ios/dkim-postfix-ubuntu</a>
  </li>
</ol>
