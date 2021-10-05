---
id: 2746
title: 'Puppet - точка входа'
date: 2015-07-31T13:02:30+00:00
author: admin

guid: http://www.tech-notes.net/?p=2746
permalink: /puppet-entrypoint/
image: /wp-content/uploads/2015/07/puppet-logo.png
categories:
  - Puppet
tags:
  - Puppet
---
Puppet - это комплекс утилит, написанных на Ruby, которые позволяют управлять большим количеством серверов с одной точки. Он позволяет описать необходимое состояние для каждого сервера в Вашей инфраструктуре. Создание новых серверов больше не требует кнопкокликания, заготовок/темплейтов и т.д.

Разработчики предоставили <a href="https://puppetlabs.com/download-learning-vm" target="_blank">прикольную виртуалку</a>, с помощью которой можно ознакомиться с фичами puppet. Собственно я только что закончил квэсты и хочу суммировать ключевые моменты.

Всем, кто ищет точку входа в puppet, рекомендую сначала ознакомиться с материалами предоставленными в `<a href="https://puppetlabs.com/download-learning-vm" target="_blank">Learning VM</a>` и вернуться назад.

### Немного теории

**Манифест** - текстовый файл с расширением `.pp`. В манифестах описываются классы.  
**Класс** - именованный блок кода. Как правило класс определяет тип ресурсов, которые относятся к той или иной функции или компоненту системы. При описании классов используются ресурсы.  
**Ресурсы** - это базовые единицы для создания конфигурации, каждый из которых описывает определенную часть системы. Ресурсы описаны в коде Puppet c помощью специфического языка на базе Ruby - DSL (&#8216;Domain Specific Language&#8217;). Разработчики и маркетологи особо не заморачивались с названием.

Манифест состоит из классов. В описании классов используются ресурсы. В манифестах и класах можно использовать переменные, условные операторы, передавать им аргументы.

Получить список всех ресурсов можно с помощью следующей команды:

> puppet resource -types

Посмотреть информацию о ресурсе (ресурс `user` со значением `root`):

> puppet resource user root

Получить описание ресурса:

> puppet describe user |less

**Модуль** - это то, что позволяет Вам организовывать код Puppet в отдельные единицы конфигурации для последующего использования. Большинство модулей находятся в каталоге, который указан как `modulepath` в файле `/etc/puppetlabs/puppet/puppet.conf`

`Modulepath` можно узнать выполнив следующую команду:

> puppet agent -configprint modulepath

`Puppet` ищет модули сначала в папке `/etc/puppetlabs/puppet/environments/production/modules`, потом в папке `/etc/puppetlabs/puppet/modules`, и в конце в папке `/opt/puppet/share/puppet/modules`

Установить модуль можно с помощью следующей команды:

> puppet module install puppetlabs-apache

### Суть работы с puppet заключается в создании модулей с манифестами.

Простенькие примеры манифестов рассматриваются в квэстах &#8216;Learning VM&#8217;.

Чтобы ознакомиться со структурой модуля выполните:

> tree -L 2 -d /etc/puppetlabs/puppet/environments/production/modules/apache

Можете более подробно ознакомиться с содержимым. 

Классы описываются в следующем файле (это уже манифест):

> manifests/init.pp

Проверить манифест можно с помощью следующей команды:

> puppet apply -noop manifests/init.pp

Без ключа `--noop` манифест будет включен в конфигурацию Puppet.

После этого класс станет доступен в вэб-морде Puppet, где можно определить к какому серверу применяется тот или иной класс. На основе этого к серверу будет применен (или не будет) тот или иной конфиг.

Самый главный манифест находится:

> /etc/puppetlabs/puppet/environments/production/manifests/site.pp

В этом файле описаны классы и переменные, которые относятся ко всем серверам в Вашем парке. Например, для ssh доступа ко всем серверам вы используете пользователя `opsadmin` c ключом (`id_rsa`). Было бы логично подключить класс, который создает этого пользователя в &#8216;Самый главный манифест&#8217;, чтобы не приходилось добавлять этот класс руками в вэб-морде puppet к каждому новому серверу. 

То же самое относится к настройкам ssh. С большой вероятностью они будут одинаковыми для всех серверов. 

### Пример создания манифеста

Пример ssh скопирую с Learning VM.

Создаем папки модуля:

> mkdir -p /etc/puppetlabs/puppet/environments/production/modules/sshd/{manifests,files}

Создаем манифест:

> vim /etc/puppetlabs/puppet/environments/production/modules/sshd/manifests/init.pp

```bash
class sshd {

  package {'openssh-server':
    ensure => present,
    before => File["/etc/ssh/sshd_config"],
  }

  file { '/etc/ssh/sshd_config':
    ensure => file,
    mode => 600,
    source => 'puppet:///modules/sshd/files/sshd_config',
  }

  service {'sshd':
    ensure => running,
    enable => true,
    subscribe => File['/etc/ssh/sshd_config'],
  }
}
```


Создаем конфиг, который будет использоваться на всех Ваших серверах:

> vim /etc/puppetlabs/puppet/environments/production/modules/sshd/files/sshd_config

Содержание я приводить не стану. Каждый использует настройки, которые соответствуют политике компании.

Открываем главный манифест:

> vim /etc/puppetlabs/puppet/environments/production/manifests/site.pp

Ищем секцию:

```bash
node default {
				...
}
```


Добавляем в нее:

```bash
include sshd
```


Проверяем:

> puppet apply -noop /etc/puppetlabs/puppet/environments/production/manifests/site.pp

Если все ОК - повторяем предыдущую команду без ключа `--noop`.

Что касается распространения изменений по существующим серверам, то они происходят раз в 30 минут по расписанию. Для ускорения этого процесса можно дернуть puppet agent:

> puppet agent -t

### Условный оператор:

В манифестах puppet допускается использование слудющих условных операторов:

  * if
  * case
  * switch

Использование условий нужно хотя бы потому что в Вашем парке могут быть сервера под Ubuntu и Centos. В виртуалке (&#8216;Learning VM&#8217;) рассмартивается пример добавления пользователей в разные группы, в зависимости от операционной системы. 

Что же использовать в условных операторах? - Значения переменных. Чтобы получить список переменных значений от которых можно отталкиваться воспользуйтесь утилитой `facter`

Выполните:

> facter -p | less

Рассмотрите подробнее результаты выполнения. Там есть много чего полезного.

В данном примере нас интересуют значения `operatingsystem` или же `osfamily`.

В коде манифестов их можно определить следующи образом:

```bash
$::operatingsystem == 'centos'
$::osfamily = 'RedHat'

```


### Пример №2

Давайте создадим манифест, согласно которого будет создаваться пользователь `opsadmin`, с публичным ключем для доступа по ssh. Пользователь будет добавлен в группу `wheel` на серверах с `CentOS`, а на серверах с `Ubuntu` - в группу `admin`

Создаем папки модуля:

> mkdir -p /etc/puppetlabs/puppet/environments/production/modules/accounts/{manifests,files}

Создаем манифест:

> vim /etc/puppetlabs/puppet/environments/production/modules/accounts/manifests/init.pp

```bash
class accounts ($name) {
  if $::operatingsystem == 'centos' {
    $groups = 'wheel'
  }
  elsif $::operatingsystem == 'debian' {
    $groups = 'admin'
  }

  user { $name:
    ensure => 'present',
    home => "/home/${name}",
    groups => $groups,
  }

  file { '/home/${name}/.ssh/authotized_keys':
    ensure => file,
    mode => 600,
    source => 'puppet:///modules/accounts/${name}-authotized_keys',
  }
}
```


Создаем файл, содержащий публичыный ключь пользователя `opsadmin` 

> /etc/puppetlabs/puppet/environments/production/modules/accounts/files/opsadmin-authotized_keys

Открываем главный манифест:

> vim /etc/puppetlabs/puppet/environments/production/manifests/site.pp

Ищем секцию:

```bash
node default {
				...
}
```


Добавляем в нее:

```bash
class {'accounts':
  name => 'opsadmin',
}
```


Проверяем:

> puppet apply -noop /etc/puppetlabs/puppet/environments/production/manifests/site.pp

Если все ОК - повторяем предыдущую команду без ключа `--noop`.

В общем манифест получился универсальным, поскольку позволяет добавлять много пользователей с правами sudo. По аналогии можно добавлять пользователей в другие группы. К примеру команду разработчиков добавить в группу `developers`. Ключи пользователей нужно складывать в следующую папку:

> /etc/puppetlabs/puppet/environments/production/modules/accounts/files/

Имя файлов должно начинаться с имени пользователя.

### Заключение:

В рамках приведенных примеров не сложно понять приимущества использования Puppet. Представте, что у Вас есть команда разработчиков из 20-ти людей, которые работают с проэктами на 40-ка серверах. При появлении навого человека нужно ддобавить его на все сервера. С помощью Puppet это можно сделать за считанные минуты. Столько же времени уйдет на то, что бы добавить человека на 400 серверов.

Изменение конфига ssh не нужно применять на всех серверах, в случае смены политики шифрования или еще чего-то.

Дальше я продолжу играться с манифестами по мере наличия свободного времени и буду их выкладывать в отдельных статьях.

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>