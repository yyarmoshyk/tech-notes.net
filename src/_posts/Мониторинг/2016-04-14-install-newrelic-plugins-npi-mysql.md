---
id: 3277
title: Установка плагинов NewRelic с помощью NPI на примере MySQL
date: 2016-04-14T08:50:18+00:00
author: admin

guid: http://www.tech-notes.net/?p=3277
permalink: /install-newrelic-plugins-npi-mysql/
image: /wp-content/uploads/2016/04/Screenshot-from-2016-04-14-044239.png
categories:
  - мониторинг
tags:
  - mysql
  - newrelic
  - npi
---
Многим известен [newrelic.com](http://newrelic.com/) - сервис отслеживания состояния и производительности приложений. Этот сервис очень динамично развивается и разрабочики постоянно расширяют функцинал добавляя новые плагины для продвинутого мониторинга приложений и серверов.

Естественно в такой динмике им нужно было придумать как же упростить установку плагинов на сервера их пользователей (тоесть нас). И они придумали [npi](https://docs.newrelic.com/docs/plugins/developing-plugins/sharing-your-plugin/using-new-relic-platform-installer-npi-utility) - newrelic plugin installer.

Установить его довольно просто:

```bash
wget https://download.newrelic.com/npi/release/install-npi-linux-redhat-x64.sh  
sudo bash install-npi-linux-redhat-x64.sh
```

Во время установки может вылететь следующая ошибка:

```bash
FATAL ERROR: v8::Context::New() V8 is no longer usable
```

Связана она с ограничениями на использование памяти и лечится следующим образом:

```bash
ulimit -v unlimited
```

По окончанию установки Вам отобразится сообщения, что выполнять `npi` нужно в папке `/root/newrelic-npi`.

Полный список доступных плагинов можно найти на вкладке `Plugins` в [личном кабинете Newrelic](https://rpm.newrelic.com/accounts/):  
<img src="/wp-content/uploads/2016/04/Screenshot-from-2016-04-14-043235.png" alt="Screenshot from 2016-04-14 04:32:35" width="790" height="178" class="aligncenter size-full wp-image-3279" srcset="/wp-content/uploads/2016/04/Screenshot-from-2016-04-14-043235.png 790w, /wp-content/uploads/2016/04/Screenshot-from-2016-04-14-043235-170x38.png 170w, /wp-content/uploads/2016/04/Screenshot-from-2016-04-14-043235-300x68.png 300w, /wp-content/uploads/2016/04/Screenshot-from-2016-04-14-043235-768x173.png 768w" sizes="(max-width: 790px) 100vw, 790px" />

Другой способ - с помощью npi:

```bash
cd /root/newrelic-npi  
./npi available
```

У каждого плагина есть свои тредования. Так плагину для мониторинга MySQL нужна a `Java (JRE) v.1.6`, `MySQL v.5.0` и выше.

В среде `CentOS Linux` выполните следующее для установки `Java 1.7 OpenJDK`:

```bash
sudo yum install -y java-1.7.0-openjdk
```

Подготовьте имя пользователя и пароль для доступа к MySQL. Эта информация потребуется по время установки.

Устанавливаем плагин:

```bash
cd /root/newrelic-npi  
sudo ./npi install com.newrelic.plugins.mysql.instance
```

В время установки Вам будет предложено отредактировать файл конфигурации плагина. Не стоит расстраиваться, если у Вас нету достаточной информации (логин/пароль для доступа к MySQL) или Вы выбрали неподходящее название для mysql (Localhost).

Файл конфигурации можно отредактировать и позже - вот он:

```bash
/root/newrelic-npi/plugins/com.newrelic.plugins.mysql.instance/newrelic_mysql_plugin-2.0.0/config/plugin.json
```

Ставим демон плагина на автозагрузку и запускаем:

```bash
chkconfig newrelic_plugin_com.newrelic.plugins.mysql.instance on  
/etc/init.d/newrelic_plugin_com.newrelic.plugins.mysql.instance restart
```

Учтите, что MySQL сервер появится в списке NewRelic только тогда когда появится нагрузка. 
