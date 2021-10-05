---
id: 503
title: Настройка Fail2Ban
date: 2014-02-17T21:24:35+00:00
author: admin

guid: http://www.tech-notes.net/?p=503
permalink: /fail2ban-configuration/
image: /wp-content/uploads/2014/02/Screenshot-from-2014-02-17-145443.png
categories:
  - Linux server
tags:
  - linux
  - настройка fail2ban
---
Fail2Ban - это тузовина, написана на Python, которая предназначена для предотвращения атак на сервер. Она читает лог файлы ssh,ftp, apache и, в зависимости от настроек, блокирует ip адреса путем добавления DROP правил в iptables.

Бывает очень полезно блокировать к чертовой бабушке ip адреса потенциальных ботов, брутфорсеров и прочих негодяев, которые пытаются незаконно, вопреки Вашему желанию, заполучить контроль над Вашим детищем.

Итак, все дальнейшие шаги проделывались на Linux CentOS v.5.8.  
Устанавливаем:

```bash
yum install fail2ban
```

Все файлы конфигурации находятся в папке /etc/fail2ban. Файл, который будем ковырять - /etc/fail2ban/jail.conf.  
Исключения:

```bash
ignoreip = 127.0.0.1 10.0.0.0/8 **%ваш_ip_адрес%**
```

Время бана (1 час)

```bash
bantime = 3600
```

По умолчанию сразу после установки включена работа с ssh демоном. Секция выглядит вот так:

```bash
[ssh-iptables]  
enabled = true  
filter = sshd  
action = iptables[name=SSH, port=ssh, protocol=tcp]  
sendmail-whois[name=SSH, dest=root, sender=fail2ban@example.com, sendername=Fail2Ban]  
logpath = /var/log/secure  
maxretry = 5
```

**enabled** - принимает true или false. Соответственно включена `тюрьма` (не нравится мне перевод) или нет.  
**filter** - фильтр, применяемый для лог файла. Фильтры находятся в папке /etc/fail2ban/filter.d  
**action** - что делать в с нарушителем покоя системы. Все действия находятся в папке /etc/fail2ban/action.d.  
Конкретно в этом случае включено два действия:
  * `iptables` (`/etc/fail2ban/action.d/iptables.conf`) создаст в фаерволе цепочку с названием fail2ban-ssh и будет в нее вкидывать ipишники нарушителей.
  * `sendmail-whois` (`/etc/fail2ban/action.d/sendmail-whois.conf`)- отправит Вам на почту информацию о заблокированном ip адресе.

Рекомендую sendmail-whois поменять на sendmail.

**logpath** - лог файл, с которым нужно работать. В зависимости от конфигурации системы может отличаться. Впишите сюда путь к файлу, в который ssh записывает неудачные логины. Это может быть:
  * /var/log/secure
  * /var/log/messages
  * /var/log/auth.log
  * что-то другое

**maxretry** - количество неудачных попыток авторизации. Рекомендую поставить на 3.

Так же есть заготовки-описания для vsftpd, pro-ftpd. По сути отличаются они только значением filter. Можно посмотреть для примера любой и на основе его создать свой фильтр для кастомного приложения.

Лично мне не нравится получать уведомления при перезапуске fail2ban. Для того что бы их отключить - закомментируйте все, что связано с actionstart и actionstop в файле /etc/fail2ban/action.d/sendmail-whois.conf, или /etc/fail2ban/action.d/sendmail.conf, если Вы сменили значение action на sendmail. По вкусу можно подкорректировать уведомление.

Хочу немного остановиться на фильтрах. Как я уже говорил, находятся они в папке /etc/fail2ban/filter.d. Основное в них - значение failregex. Это описание маски неудавшегося логина в систему. При чем описано их несколько, что бы уж наверняка. Пример для SSH:

```bash
^%(__prefix_line)s(?:error: PAM: )?[aA]uthentication (?:failure|error) for .* from <HOST>( via \S+)?\s*$  
^%(__prefix_line)s(?:error: PAM: )?User not known to the underlying authentication module for .* from <HOST>\s*$  
^%(__prefix_line)sFailed \S+ for .*? from <HOST>(?: port \d\*)?(?: ssh\d\*)?(: (ruser .\*|(\S+ ID \S+ \(serial \d+\) CA )?\S+ %(__md5hex)s(, client user `.\*`, client host `.\*`)?))?\s\*$  
^%(__prefix_line)sROOT LOGIN REFUSED.* FROM <HOST>\s*$  
^%(__prefix_line)s\[iI\](?:llegal|nvalid) user .* from <HOST>\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because not listed in AllowUsers\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because listed in DenyUsers\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because not in any group\s*$  
^%(__prefix_line)srefused connect from \S+ \(<HOST>\)\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because a group is listed in DenyGroups\s*$  
^%(__prefix_line)sUser .+ from <HOST> not allowed because none of user's groups are listed in AllowGroups\s*$
```

Кто хоть раз читал логи, тот сразу увидит как можно их кастомизировать и создавать свои.

Полезные ссылки по теме:  
* <a href="http://www.fail2ban.org/wiki/index.php/HOWTO_fail2ban_with_ModSecurity2.5" target="_blank">Fail2Ban + mod_security</a>
