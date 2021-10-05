---
id: 2371
title: Установка последней верисии Python на Centos 6.5
date: 2015-02-06T13:59:08+00:00
author: admin

guid: http://www.tech-notes.net/?p=2371
permalink: /install-python-centos6-5/
image: /wp-content/uploads/2015/02/python-logo.png
categories:
  - Linux server
tags:
  - Centos
---
Последней версией `Python` на сегодняшний день является `3.4.2`. Для установки последней верси python нужно сначала установить нужные пакеты:

```bash
yum install wget gcc openssl-devel httpd sqlite-devel mysql-devel -y
```

Теперь можно скачать и установить сам python:

```bash
wget https://www.python.org/ftp/python/3.4.2/Python-3.4.2.tgz  
tar -xf Python-3.4.2.tgz  
cd Python-3.4.2  
./configure -enable-shared  
make  
make altinstall
```

Все ОК, если в результате бесконечного потока символов Вы увидели следующее сообщение:

```bash
Ignoring indexes: https://pypi.python.org/simple/  
Downloading/unpacking setuptools  
Downloading/unpacking pip  
Installing collected packages: setuptools, pip  
Successfully installed setuptools pip
```

После этого бинарники будут находится в папке `/usr/local/bin/`. Проверить можно так:

```bash
ls -la /usr/local/bin/p*
```

После этого можно использовать:

```bash
pip3.4  
python3.4  
pydoc3.4  
pyvenv-3.4
```

Создадим необходимые симлинки:

```bash
ln -s /usr/local/lib/libpython3.so /usr/lib64/libpython3.4.so  
ln -s /usr/local/lib/libpython3.4m.so.1.0 /usr/lib64/libpython3.4m.so.1.0  
cp /usr/local/lib/libpython3.4m.so /usr/lib/
```

Теперь проверьте установленную версию:

```bash
python3.4 -version
```

В результате видим заветный аутпут:

```bash
Python 3.4.2
```
