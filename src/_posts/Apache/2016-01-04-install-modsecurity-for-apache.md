---
id: 558
title: Установка modsecurity для Apache
date: 2016-01-04T08:28:46+00:00
author: admin

guid: http://www.tech-notes.net/?p=558
permalink: /install-modsecurity-for-apache/
image: /wp-content/uploads/2015/02/mod-security.png
categories:
  - Apache
  - Безопасность
---
ModSecurity - своеобразный фаервол для Apache, Nginx и IIS. Это модуль, предоставляющий набор правил для фильтрации трафика. Это модуль из разряда must have для любого сервера.

12 Февраля 2015 года была выпущена версия 2.9.0. Она является наиболее актуальной на момент написания этой заметки.

Даже четвертого января 2016 года эта версия является самой актуальной.

Собирать будем из исходников и настраивать для вэб сервера Apache.

Для нормальной компиляции этой версии необходим `libxml2` версии `2.6.29`. Первым шагом нужно удостовериться, что он доступен для ОС Вашего сервера:

```bash
yum info libxml2
```

Или:

```bash
apt-cache showpkg libxml2
```

Если необходимый пакет доступен для установки - можете продолжать.

Удостоверьтесь, что у Вас установлены следующие пакеты:  
**RedHat/Centos:**

```bash
apt-get install gcc automake libxml2 libxml2-dev apache2-threaded-dev libcurl4-openssl-dev libpcre3-dev
```

**Ubuntu/Debian:**

```bash
apt-get install gcc automake libxml2 libxml2-dev apache2-threaded-dev libcurl-dev pcre-dev
```

Я буду работать в папке /usr/local/src.

```bash
cd /usr/local/src
```

Скачиваем нужный архив:

```bash
wget -no-check-certificate https://www.modsecurity.org/tarball/2.9.0/modsecurity-2.9.0.tar.gz
```

Распаковываем и переходим в каталог:

```bash
tar xf modsecurity-2.9.0.tar.gz && cd modsecurity*
```

Стандартная установка:

```bash
./configure  
make && make install
```

Модуль будет установлен в папку `/usr/local/modsecurity/lib`. Бинарники будут лежать в папке /usr/local/modsecurity/bin.

Дальше нужно добавить вот такте строчки в файл конфигурации Apache (/etc/httpd/conf/httpd.conf)

```bash
LoadModule security2_module /usr/local/modsecurity/lib/mod_security2.so
```

И раскомментировать:

```bash
LoadModule unique_id_module modules/mod_unique_id.so
```

Дальше берем рекомендуемую конфигурацию модуля и копируем в папку conf.d Apache:

```bash
cp modsecurity.conf-recommended /etc/httpd/conf.d/modsecurity.conf
```

Можно открыть этот фал и подредактировать путь к логу аудита - SecAuditLog.

При проверке конфигурации может выдать вот такую ошибку:

```bash
Syntax error on line 212 of /etc/httpd/conf.d/modsecurity.conf:  
Could not open unicode map file `/etc/httpd/conf.d/unicode.mapping`: No such file or directory
```

Для фикса копируем нужный файл:

```bash
cp unicode.mapping /etc/httpd/conf.d/
```

На этом все. Установка закончена. Даже с базовым набором параметров, сервер стал дышать свободнее.

Для скрытия версии апача, отключения Trace метода можно внести следующие строки в `/etc/httpd/conf.d/modsecurity.conf`:

```bash
ServerSignature Off  
ServerTokens Prod  
TraceEnable Off
```

Более подробную информацию о всех параметрах настройки можно почитать [здесь](https://github.com/SpiderLabs/ModSecurity/wiki/Reference-Manual#wiki-Configuration_Directives)

Поскольку mod_security -это фаервол, то для него существуют наборы правил, которые нужно включить для того, что бы mod_security начал приносить пользу.

Список беcплатных правил доступен на [GitHub](https://github.com/SpiderLabs/owasp-modsecurity-crs):

Его и скачиваем и распаковываем:

```bash
wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/master.zip  
unzip master.zip
```

Создаем папку в которую мы сложим конфиги для правил, которые нам нужно включить и копируем нужные нам наборы правил:

```bash
mkdir /etc/modsecurity/activated_rules  
cp owasp-modsecurity-crs-master/base_rules/* /etc/modsecurity/activated_rules/
```

Следующие наборы правил приносили больше зла, чем пользы, поэтому их лучше выключить:

```bash
rm /etc/modsecurity/activated_rules/modsecurity_crs_35_bad_robots.conf  
rm /etc/modsecurity/activated_rules/modsecurity_crs_41_sql_injection_attacks.conf  
rm /etc/modsecurity/activated_rules/modsecurity_crs_21_protocol_anomalies.conf
```

Дополниттельного внимания заслыживает следующая папка, так как в ней находятся рекомендованые правила для популярных CMS систем:

```bash
owasp-modsecurity-crs-master/slr_rules
```

Скопируйте нужные Вам файлы с расширениями `.conf` и `.data` в папку `/etc/modsecurity/activated_rules/`

Отредактируйте файл `/etc/httpd/conf.d/modsecurity.conf` следующей строкой что бы все заработало:

```bash
Include /etc/modsecurity/activated_rules/*.conf
```
