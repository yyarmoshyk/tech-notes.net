---
id: 2722
title: 'Полный апгрэйд: NginX1.9 + PHP7 + MySQL 5.6 на Ubuntu 14.04'
date: 2015-08-07T14:26:42+00:00
author: admin

guid: http://www.tech-notes.net/?p=2722
permalink: /nginx-1-9-php7-ubuntu-14-04-mysql-5-6/
image: /wp-content/uploads/2015/08/upgrade-logo.gif
categories:
  - Linux server
tags:
  - mysql 5.6
  - nginx 1.9.3
  - php7
---
Уж лето близится к концу и хостинговый год у амазона начинается заново.  
Решил создать навый сервер со всем самым новым.

На момент написания первой версии этой статьи <a href="http://php.net/archive/2015.php#id2015-07-24-1" target="_blank">компилятор PHP 7-й версии был всего лишь бэтой</a>, но на сегодняшний день это <a href="https://secure.php.net/archive/2015.php#id2015-12-03-1" target="_blank">полноценный релиз</a>.

Nginx версии 1.9.3 тоже был выпущен пуквально пару недель назад. <a href="http://dev.mysql.com/tech-resources/articles/whats-new-in-mysql-5.6.html" target="_blank">MySQL сервер вышел версии 5.6</a>, который по заявлениям разработчиков работает круче и быстрее, чем предыдущая версия.

И захотелось мне все полностью обновить и запустить свои WordPressы по новому кругу на последней софтваре. Одно печально - в списке ОС для EC2 Amazon AWS нету Ubuntu 15.04. Поэтому буду играться с Ubuntu 14.04.

Вторая засада - не все это добро доступно в репозитариях, поэтому прийдется компилить из исходников. Несколько лет назад я скептически относился к установке ПО на продакшн сервера из исходников, по с течением времени все больше и больше сталкиваюсь с разными неприятностями в готовом ПО. В таком случае собраное из исходников работает намного стабильнее.

### ModSecurity:

Для того, что бы мне спокойнее спалось ночью, хочу обезапасить свои сайты, поэтому <a href="http://www.tech-notes.net/install-modsecurity-for-nginx/" target="_blank">nginx буду собирать с поддержкой mod_security</a>. Да и все равно nginx будет собираться из исходников.

Установим нужное:

```bash
 apt-get install libxml2 libxml2-dev apache2-dev libcurl4-openssl-dev
```

Буду работать в папке:

```bash
 cd /usr/local/src
```

Скачиваем и распаковываем:

```bash
 wget https://www.modsecurity.org/tarball/2.9.0/modsecurity-2.9.0.tar.gz  
 tar xf modsecurity-2.9.0.tar.gz  
 cd modsecurity-2.9.0
```

Собираем:

```bash
 ./configure -enable-standalone-module  
 make
```

### PHP 7

**Перед началом установки, нужно оговориться, что NewRelic еще не поддерживает PHP 7-й версии.**

Устанавливаем нужные пакеты:

```bash
 apt-get install libpng++-dev libpng12-dev libmcrypt-dev spawn-fcgi -y
```

Скачиваем архив и распаковываем:

```bash
 cd /usr/local/src  
 wget -O php-7.0.0.tar.gz http://us1.php.net/get/php-7.0.0.tar.gz/from/this/mirror  
 tar xf php-7.0.0.tar.gz  
 cd php-7*
```

Собираем и устанавливаем. Параметры конфигурирования не сильно отличаются от <a href="http://www.tech-notes.net/compile-php-5-5-10-from-sources/" target="_blank">предыдущих версий</a>

```bash
 ./configure -bindir=/usr/bin -with-config-file-path=/etc -with-curl -with-mhash -enable-mysqlnd -with-mysqli -with-gd -with-pdo-mysql -with-mcrypt -enable-mbstring -with-openssl -with-pcre-regex -enable-soap -with-zlib  
 make -j 2  
 make install
```

В папке с исходниками лежат два файла конфигурации:

  * php.ini-development
  * php.ini-production

Скопируйте один из них в папку etc и измените имя на php.ini:

```bash
 cp php.ini-development /etc/php.ini
```

Создаем скрипт для запуска cgi:

```bash
 vim /etc/init.d/php-fastcgi
```

Обратите внимание на групу и пользователя, от имени которых должен выполняться php. Я выделил их жирным шрифтом.

```bash
PHP_SCRIPT=/usr/bin/php-fastcgi
FASTCGI_USER=<strong>nginx</strong>
FASTCGI_GROUP=<strong>nginx</strong>
PID_DIR=/tmp/
PID_FILE=/tmp/php-fastcgi.pid
RET_VAL=0

case "$1" in
    start)
      if [[ ! -d $PID_DIR ]]
      then
        mkdir $PID_DIR
        chown $FASTCGI_USER:$FASTCGI_GROUP $PID_DIR
        chmod 0770 $PID_DIR
      fi
      if [[ -r $PID_FILE ]]
      then
        echo "php-fastcgi already running with PID `cat $PID_FILE`"
        RET_VAL=1
      else
        $PHP_SCRIPT
        RET_VAL=$?
      fi
  ;;
    stop)
      if [[ -r $PID_FILE ]]
      then
        kill -9 $(cat $PID_FILE)
        rm $PID_FILE
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE"
        RET_VAL=1
      fi
  ;;
    restart)
      if [[ -r $PID_FILE ]]
      then
        kill -9 $(cat $PID_FILE)
        rm $PID_FILE
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE"
      fi
      $PHP_SCRIPT
      RET_VAL=$?
  ;;
    status)
      if [[ -r $PID_FILE ]]
      then
        echo "php-fastcgi running with PID `cat $PID_FILE`"
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE, php-fastcgi does not appear to be running"
      fi
  ;;
    *)
      echo "Usage: php-fastcgi {start|stop|restart|status}"
      RET_VAL=1
  ;;
esac
exit $RET_VAL
```

```
<p>
  Второй скрипт:
</p>

```bash
    vim /usr/bin/php-fastcgi
  ```

```bash
FASTCGI_USER=nginx
FASTCGI_GROUP=nginx
ADDRESS=127.0.0.1
PORT=9000
PIDFILE=/tmp/php-fastcgi.pid
CHILDREN=10
PHP5=/usr/bin/php-cgi

/usr/bin/spawn-fcgi -a $ADDRESS -p $PORT -P $PIDFILE -C $CHILDREN -u $FASTCGI_USER -g $FASTCGI_GROUP -f $PHP5
```

```

<p>
  Деаем их исполняемыми:
</p>

```bash
    chmod +x /usr/bin/php-fastcgi<br /> chmod +x /etc/init.d/php-fastcgi
```

<p>
  Ставим на автозагрузку:
</p>

```bash
    /usr/sbin/update-rc.d -f php-fastcgi defaults
```

### Nginx:

<p>
  Для установки NginX я подготовил отдельную статью:<br /> <a href="http://www.tech-notes.net/compile-latest-nginx-from-source/" target="_blank">Сборка NginX v.1.9.10 из исходника</a>
</p>

<h3>
  MySQL
</h3>

<p>
  Последнее дело за MySQL. Благо дело команда MySQL подготовила пакет для Ubuntu 14.04. Доступен для скачивания на следующей странице:<br /> <a href="http://dev.mysql.com/downloads/mysql/" target="_blank">http://dev.mysql.com/downloads/mysql/</a>
</p>

<p>
  Готовимся:
</p>

```bash
    apt-get install man-db libaio1
  ```

<p>
  Скачиваем bundle пакет и распаковываем его его:
</p>

```bash
    mkdir /usr/local/src/mysql<br /> cd /usr/local/src/mysql<br /> wget http://dev.mysql.com/get/Downloads/MySQL-5.6/mysql-server_5.6.26-1ubuntu14.04_amd64.deb-bundle.tar<br /> tar xf mysql-server_5.6.26-1ubuntu14.04_amd64.deb-bundle.tar
  ```

<p>
  Дальше устанавливаем по-порядку:
</p>

```bash
    dpkg -i mysql-common_5.6.26-1ubuntu14.04_amd64.deb
  ```

<p>
  Клиент зависит от <code>mysql-community-client</code> :
</p>

```bash
    dpkg -i mysql-community-client_5.6.26-1ubuntu14.04_amd64.deb<br /> dpkg -i mysql-client_5.6.26-1ubuntu14.04_amd64.deb
  ```

<p>
  Сам сервер который зависит от mysql-community-server:
</p>

```bash
    dpkg -i mysql-community-server_5.6.26-1ubuntu14.04_amd64.deb<br /> dpkg -i mysql-server_5.6.26-1ubuntu14.04_amd64.deb
  ```

<p>
  Так же рекомендую установить пакет с исходниками - мало ли что Вам понадобится собирать в будущем:
</p>

```bash
    dpkg -i mysql-community-source_5.6.26-1ubuntu14.04_amd64.deb
  ```

<p>
  Ставим на автозагрузку:
</p>

```bash
    /usr/sbin/update-rc.d -f mysql defaults
  ```

<p>
  На этом все. Настройку Varnish я не планировал рассматривать в рамках этой статьи. Можно заливать контэнт и радоваться.
</p>

<p>
  Полезные статьи:
</p>

<ul>
  <li>
    <a href="http://www.tech-notes.net/install-modsecurity-for-nginx/" target="_blank">Установка modsecurity для Nginx</a>
  </li>
  <li>
    <a href="http://www.tech-notes.net/configure-linux-server-wordpress-drupal-joomla/" target="_blank">Настройка Linux сервера для WordPress/Drupal/Joomla</a>
  </li>
  <li>
    <a href="http://www.tech-notes.net/compile-php-5-5-10-from-sources/" target="_blank">Как скомпилировать php v.5.5.10 из исходников</a>
  </li>
  <li>
    <a href="http://www.tech-notes.net/nginx-php-fcgi/" target="_blank">Настройка Nginx + php-fcgi</a>
  </li>
</ul>

<p>
  Подсматривал:<br />
  * <a href="http://sharadchhetri.com/2015/02/21/install-nginx-source-code-ubuntu-14-04-lts/" target="_blank">http://sharadchhetri.com/2015/02/21/install-nginx-source-code-ubuntu-14-04-lts/</a>
</p>
