var store = [{
        "title": "Обход вопросов безопасности WHM/cPanel",
        "excerpt":"   Иногда бывает, что есть ssh/shell доступ к серверу на котором установлена WHM/cPanel но в саму панель вход прегражден подобным окошком с четырьмя вопросами. Нужно обойти вопросы безопасности WHM.   Для того чтобы это безобразие не лицезреть, можно добавить свой ip адрес в следующий файл:  /var/cpanel/userhomes/cpanel/.cpanel/securitypolicy/iplist/root   При обновлении страницы вопросы уберутся.  ","categories": ["Control Panels","WHM/cPanel"],
        "tags": ["cpanel","WHM"],
        "url": "/bypass-whm-cpanel-security-questions/",
        "teaser":null},{
        "title": "Список почтовых ящиков WHM/cPanel",
        "excerpt":"Всем известный Plesk хранит записи о почтовых ящиком в базе mysql. В то же время получить список почтовых ящиков в WHM cPanel можнос использованием следующего скрипта: #!/bin/bash for f in $(ls |grep -v \"^\\.\\|virtfs\\|lost+found\\|cpeasyapache\\|quota.user\"); do f2=$(echo $f |sed 's/\\/$//g'); for box in $(ls \"$f\"/mail/ |grep -v \"^\\.\\|new\\|cur\\|sent\\|tmp\" ); do m=$(ls...","categories": ["WHM/cPanel"],
        "tags": [],
        "url": "/list-mailboxes-whm-cpanel/",
        "teaser":null},{
        "title": "Перенос MailEnable на новый сервер",
        "excerpt":"MailEnable - почтовая система с множеством плюшек. Случается так, что ее нужно перенести на другой сервер по разным причинам. Первое что нужно знать: Enterprise лицензия выдается/покупается в соответствии с количеством процессорных ядер на сервере. То есть нужно покупать или расширять лицензию если у нас на исходном и конечном серверах разное...","categories": ["Почта"],
        "tags": [],
        "url": "/mailenable-migration/",
        "teaser":null},{
        "title": "Просмотр всех FTP акаунтов созданых в Plesk на Linux сервере через mysql",
        "excerpt":"Случается так, что вэбморда Plesk становится недоступной по той или иной причине. Либо у нас есть набор файлов со старого сервера и нужно восстановить всех ftp пользователей на новом основываясь на информации из mysql базы Plesk. По умолчанию Plesk работает с базой psa. В ней он хранит все данные об...","categories": ["Plesk"],
        "tags": ["ftp plesk mysql","ftp пользователи plesk"],
        "url": "/list-plesk-ftp-accounts-from-mysql/",
        "teaser":null},{
        "title": "DNS MX запись",
        "excerpt":"Что такое MX запись и с чем ее кушают? Простыми словами - это комбинация букв и цифр определяющий маршрут которым ходит почта для конкретного web домена. Она состоит из IP адреса и приоритета для записи. Приоритет - это просто число, которое определяет какой сервер будет использован как назначение для доставки...","categories": ["DNS"],
        "tags": [],
        "url": "/dns-mx-record/",
        "teaser":null},{
        "title": "Что такое SSL и с чем его кушать",
        "excerpt":"SSL (англ. Secure Sockets Layer — уровень защищённых сокетов) — криптографический протокол. Предназначен для шифрования данных при обмене информацией между сетевыми устройствами. SSL изначально разработан компанией Netscape Communications для добавления протокола HTTPS в свой веб-браузер Netscape Navigator. Впоследствии, на основании протокола SSL 3.0 был разработан и принят стандарт RFC, получивший...","categories": ["SSL","Безопасность"],
        "tags": [],
        "url": "/ssl-tutorial/",
        "teaser":null},{
        "title": "Несколько SSL (https) сайтов на одном ip адресе с использиванием технологии SNI",
        "excerpt":"При использовании схемы Каждому сайту - отдельный ip адрес таких проблем не возникает. Но что же делать в мире с ограниченным количеством ip адресов если нету возможности купить один сертификат для всех своих сайтов? При использовании именованных виртуальных хостов (NameVirtualHosts) при безопасном (SSL/HTTPS) соединении проблемой является то, что вэб сервер...","categories": ["Apache"],
        "tags": ["SSL","SNI"],
        "url": "/ssl-https-name-vhosts-sni/",
        "teaser":null},{
        "title": "Мониторинг сайтов на коленке (bash script)",
        "excerpt":"По роду деятельности мне приходится иметь дело с большим количеством сайтов. В виду специфики проектов приходится некоторое время следить за доступностью вэб ресурсов после окончания проекта. Пришла мне мысль упростить это дело. Возиться с Nagios или Zabbix, ради такой простой задачи, не хотелось. В итоге получился вот такой вот скрипт,...","categories": ["мониторинг"],
        "tags": ["bash"],
        "url": "/simple-web-checker/",
        "teaser":null},{
        "title": "Skype4py скрипт для отправки сообщений в Skype из консоли Linux Ubuntu",
        "excerpt":"Небольшая заметка на тему, как заставить Bash скрипты отправлять сообщения в Skype. Для начала нужно скачать библиотеку Skype4py. Распаковываем, заходим в папку и запускаем setup.py: sudo python setup.py Дальше нужно создать скрипт которым мы будем отправлять сообщения. Очень хорошо было бы ложить его в папку, которая входит в переменное окружение...","categories": ["Python"],
        "tags": ["bash","python","skype","Skype4py","отправка сообщений","скайп"],
        "url": "/skype4py-send-skype-messages-from-bash/",
        "teaser":null},{
        "title": "Настройка Awstats для Apache",
        "excerpt":"Awstats - бесплатный анализатор логов написанный на Perl. Позволяет строить красивые графики отчетов посещений Вашего сайта, на основе информации из лог файлов. Настройку буду рассматривать на примере Linux Ubuntu. Для CentOS особого различия нету. Для начала нужно установить нужные пакеты: apt-get install awstats libapache2-mod-perl2 После этого Awstats будет установлен в...","categories": ["мониторинг"],
        "tags": ["Apache","анализ логов","awstats","статитстика"],
        "url": "/awstats-configuration-for-apache/",
        "teaser":null},{
        "title": "Настройка Awstats для Nginx",
        "excerpt":"В этой статье я хочу рассмотреть пример того, как можно заставить Awstats работать корректно с лог файлами сервера Nginx. Все мои записки строились на базе Linux Ubuntu. Если вы используете CentOS, RedHat или OpenSuse, то принципиальных различий не встретите, кроме названий пакетов и местонахождения конфигурационных файлов. Итак, для начала нужно...","categories": ["мониторинг"],
        "tags": ["Nginx","awstats"],
        "url": "/awstats-for-nginx/",
        "teaser":null},{
        "title": "Проблема при запуске Squid",
        "excerpt":"Столкнулся с проблемой старта Squid на RedHad Linux v.6.4. Squid просто не запускался. При попытке запуска бинарника squid вот такой командой: /usr/sbin/squid -N Проявляется корень зла: /usr/sbin/squid: relocation error: /usr/sbin/squid: symbol private_MD5_Init, version libcrypto.so.10 not defined in file libcrypto.so.10 with link time reference Проверить кто предоставляет нужную библиотеку можно вот...","categories": ["Linux server"],
        "tags": ["squid"],
        "url": "/squid-start-problem-red-hat/",
        "teaser":null},{
        "title": "Мониторинг Squid с помощью скрипта SqStat",
        "excerpt":"Наверняка каждому системному администратору приходилось отвечать на вопросы пользователей почему тормозит интернет, словами что кто-то забил канал своими бесконечными скачиваниями музыки и видео.  Способов выяснить, кто это делает в Linux вагон и маленькая тележка.   Подробнее .  ","categories": ["мониторинг"],
        "tags": [],
        "url": "/sqstat-for-squid/",
        "teaser":null},{
        "title": "Перенос SmarterMail на новый сервер",
        "excerpt":"В любой момент, по той или иной причине, может стать вопрос о переезде SmarterMail на новый сервер. Причины на то могут быть разные и их я рассматривать не буду, дабы не лить воду. Что такое SmarterMail я описывать тоже не буду. Если Вы читаете эту статью, значит уже знакомы с...","categories": ["Почта"],
        "tags": ["SmarterMail","миграция SmarterMail","перезд SmarterMail"],
        "url": "/smartermail-migration/",
        "teaser":null},{
        "title": "GeoIP для Nginx",
        "excerpt":"Расширение GeoIP позволяет определить местоположение клиента в зависимости от его IP адрес. Определяется Город, область, страна, долгота, широта, и другая информация. Очень удобно использовать на сайтах, которые переведены на несколько языков и переадресовывать клиентов из разных стран на страницы с их родным языком. Итак для начала нужно убедиться что Nginx...","categories": ["Nginx"],
        "tags": ["GeoIP Nginx"],
        "url": "/geoip-for-nginx/",
        "teaser":null},{
        "title": "Настройка Nginx + php-fcgi",
        "excerpt":"Полагаю, что nginx у Вас уже установлен. Осталось настроить обработку php. Все описанные действия проводились на CentOS Linux. По аналогии их можно повторить и для Linux Ubuntu. Для CentOS Вам потребуется добавить Epel репозитарий: Centos 5.x: wget http://dl.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm rpm -Uvh epel-release-5*.rpm Centos 6.x: wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm rpm -Uvh epel-release-6*.rpm Дальше ставим...","categories": ["Nginx"],
        "tags": ["nginx","php-fcgi"],
        "url": "/nginx-php-fcgi/",
        "teaser":null},{
        "title": "Запуск terminal несколькими вкладками в Linux Ubuntu",
        "excerpt":"Небольшая заметка о том, как запустить terminal с несколькими вкладками в Linux Ubuntu: gnome-terminal --tab -e \"cmd1\" --tab -e \"cmd2\" Эта команда запустит в новом окне несколько вкладок terminal и выполнит cmd1 и cmd2 в них. Соответственно cmd1 и cmd2 нужно заменить на команды. Вкусняшки: maximize - развернет окно на...","categories": ["Ubuntu Linux"],
        "tags": ["tabs","terminal","ubuntu","вкладки"],
        "url": "/terminal-with-multiple-tabs-linux-ubuntu/",
        "teaser":null},{
        "title": "Создание своих модулей проверки для Nagios на примере mysql и apache2",
        "excerpt":"Nagios - клиент-серверная платформа мониторинга компьютерных систем и сетей с открытым кодом. Предназначена для наблюдения, контроля состояния вычислительных узлов и служб, оповещает администратора в том случае, если какие-то из служб прекращают (или возобновляют) свою работу.(c)Wikipedia Подробную установку расписывать не буду - благо, существует множество интернет ресурсов, где это уже сделано....","categories": ["мониторинг"],
        "tags": ["Apache","mysql","Nagios"],
        "url": "/nagios-custom-checks-mysql-apache/",
        "teaser":null},{
        "title": "Сказ о том, как установить OpenSSH 6 из исходников на удаленный сервер с CentOS 5.8",
        "excerpt":"Многим известен консервативный подход разработчиков RadHat и CentOS к обновлению пакетов. Но, как известно, в старых версиях ПО находят новые дыры в безопасности, что совершенно недопустимо для серверов. В CentOS 5.x установлен OpenSSH версии 4.3. Наша задача - обновить его до последней доступной версии. Можно попробовать найти нужный rpm пакет,...","categories": ["Linux server"],
        "tags": ["centos","openssh","source"],
        "url": "/compile-openssh-from-sources-centos-5-8/",
        "teaser":null},{
        "title": "Magento: как убрать последний слэш из URL сайта",
        "excerpt":"Заметка о том, как как убрать слэш в конце URL, не навредив работе магазина. Для чего это нужно: Для сервера mydomain.com/category и mydomain.com/category/ это одно и то же. Но для поисковых систем это две разные страницы с одинаковым контентом. И это не есть хорошо. Те сайты, которые уличены в такой,...","categories": ["Apache","FromHabrSandbox","Magento"],
        "tags": ["magento","url trailing slash"],
        "url": "/magento-remove-trailing-slash-from-url/",
        "teaser":null},{
        "title": "Обновление clamav на Linux Fedora v.10",
        "excerpt":"При запуске freshclam на Fedora Linux выпало сообщение:   ERROR: Please edit the example config file /etc/clamav/freshclam.conf   ERROR: Can't open/parse the config file /etc/clamav.conf   Для того что бы обновлялказаработала нужно убрать слово Example из файла:  /etc/clamav/freshclam.conf  ","categories": ["Безопасность"],
        "tags": [],
        "url": "/update-clamav-linux-fedora-v10/",
        "teaser":null},{
        "title": "Как включить спящий режим (hibernate) на Linux Ubuntu",
        "excerpt":"На некоторых ноутбуках после установки в Linux Ubuntu (в моем случае 12.04 LTS) отключен спящий режим. Связано это, по видимому, с тем, что такие устройства официально не поддерживаются. Все таки удобно, когда при закрытии крышки ноутбук уходил в спящий режим, а не выключался. Вернуть его можно в 3 шага: Проверяем...","categories": ["Ubuntu Linux"],
        "tags": ["hibernation","ubuntu","спящий режим"],
        "url": "/enable-hibernate-linux-ubuntu/",
        "teaser":null},{
        "title": "Sendmail не принимает входящие соединения",
        "excerpt":"Нашел в логах вот такую ошибку и решил создать заметку на эту тему: sendmail[]: rejecting connections on daemon MTA: load average: Сервер всегда работает со значением `LoadAverage` больше `3`, что в принципе нормально для сервера под нагрузкой, при чем запас хода есть. Но вот ровно в полночь запускается `backup` и...","categories": ["Почта"],
        "tags": ["sendmail"],
        "url": "/sendmail-rejecting-connections/",
        "teaser":null},{
        "title": "Улучшаем безопасность SSH сервера",
        "excerpt":"SSH - это ссш и этим все сказано. Даже школьники знают что это - безопасный сервер терминалов (secure shell), предоставляющий удаленный доступ к системе linux. Почему безопасный? Потому что весь трафик между клиентом и сервером шифруется. Об этом и продолжу разглагольствовать. При установке соединения сервер и клиент договариваются между собой...","categories": ["Linux server"],
        "tags": ["Безопасность","cipher","MACs","ssh"],
        "url": "/ssh-security-tuning/",
        "teaser":null},{
        "title": "Настройка Fail2Ban",
        "excerpt":"Fail2Ban - это тузовина, написана на Python, которая предназначена для предотвращения атак на сервер. Она читает лог файлы ssh,ftp, apache и, в зависимости от настроек, блокирует ip адреса путем добавления DROP правил в iptables. Бывает очень полезно блокировать к чертовой бабушке ip адреса потенциальных ботов, брутфорсеров и прочих негодяев, которые...","categories": ["Linux server"],
        "tags": ["linux","настройка fail2ban"],
        "url": "/fail2ban-configuration/",
        "teaser":null},{
        "title": "Как создать админ пользователя в Joomla с помощью mysql",
        "excerpt":"Бывает нужно позарез попасть в админку CMS Joomla, но нету информации о пользователях, которые уже были созданы. При этом мы имеем доступ к базе данных сайта. Можно создать себе пользователя, используя несколько mysql команд. Для начала нужно посмотреть префикс таблицы в файле configuration.php (в моем случае это jom25_). Joomla 2.5:...","categories": ["Joomla"],
        "tags": ["joomla admin mysql"],
        "url": "/create-joomla-admin/",
        "teaser":null},{
        "title": "Управление процессами в bash Linux",
        "excerpt":"Что бы отправить запущенный процесс в фон, нужно его приостановить: Ctrl-z Получить номер приостановленного процесса: jobs -l затем отправить в фон командой bg: bg %jobnum Вернуть процесс на передовую можно командой fg: fg %jobnum Для того, что бы процесс не прерывался после окончания терминальной сессии, нужно запускать его в скрине...","categories": ["bash"],
        "tags": [],
        "url": "/manage-bash-processes-linux/",
        "teaser":null},{
        "title": "Перенос SmarterStats на новый сервер",
        "excerpt":"SmarterStat переносятся в 5 шагов. Устанавливаем SmarterStats на новый сервер. Останавливаем SmarterStats на обоих серверах (что бы убрать read/write блокировку с папок и файлов) Переносим следующие папки и файлы на новый сервер: * C:\\Program Files\\SmarterTools\\SmarterStats\\MRS\\App_Data\\Config*.xml * C:\\Program Files\\SmarterTools\\SmarterStats\\MRS\\App_Data\\Config\\Sites*.xml * C:\\Program Files\\SmarterTools\\SmarterStats\\Service\\Sitelist.dat * C:\\SmarterLogs *Расположение SmarterLog. Может отличаться в зависимости от конфигурации конкретного...","categories": ["Почта"],
        "tags": [],
        "url": "/smarterstats-migration/",
        "teaser":null},{
        "title": "Настройка NFS сервера и его клиентов на базе CentOS",
        "excerpt":"NFS очень полезная штука, в тех случаях, когда у нас есть несколько серверов, и нужно организовать совместный доступ к конкретному хранилищу с каждого из них. NFS позволяет делать доступными папки и файлы по сети для других серверов. Итак рассмотрю следующий пример: Имеется несколько 2 сервера: web01, ip: 10.0.0.10 web02, ip:...","categories": ["Linux server"],
        "tags": ["CentOS","nfs"],
        "url": "/configure-nfs-server-and-client-centos/",
        "teaser":null},{
        "title": "Скрипт PowerShell для импорта в лес Active Directory и создания файла с пользователями",
        "excerpt":"Сегодня хабрапользователь посланец Гая Светония Транквилла хотел бы с Вами поделиться скриптом для импорта пользователей в Active Directory. Его начальник сказал, что пора поднимать домен, а так же добавить в него около 2000 пользователей. Домен до этого он делал, но вот с импортом пользователей пришлось повозиться, так как делал это...","categories": ["Active Directory"],
        "tags": ["FromHabrSandbox","powershell"],
        "url": "/powershell-import-script-for-active-directory/",
        "teaser":null},{
        "title": "Использование кастомного порта ssh для rsync",
        "excerpt":"Rsync - удобная утилита для синхронизации данных между серверами.   По умолчанию использует 22-й порт для подключения. Но бывает так, что ssh сервер настроен принимать соединения на другом порту. При этом rsync можно использовать вот так:   rsync -Hav -e \"ssh -p 2222\" someserver.com:/remote/server/path /local/server/path  ","categories": ["Linux server"],
        "tags": ["rsync","порт ssh"],
        "url": "/use-rsync-custom-ssh-port/",
        "teaser":null},{
        "title": "IIS, PHP, OpenSource CMS и зайцы",
        "excerpt":"Лично я считаю хостинг open-source проектов на Windows Server кощунством, глупостью и моральной неполноценностью. Но случается проект, в котором у клиента основной сайт написан на .NET а параллельно с ним лежит небольшой блог на WordPress или другой CMS. Соответственно все это обслуживает набор Win2008+PHP+ASP.NET+MSSQL+MySql+IIS7. Сегодня столкнулся вот такой проблемой: Иду...","categories": ["IIS","Windows Server","WordPress"],
        "tags": ["ApplicationPoolIdentity","iis","NetworkService","php","upload_tmp_dir","wordpress","загрузка файлов"],
        "url": "/iis-php-opensource-cms-uploads/",
        "teaser":null},{
        "title": "Нехватка памяти на сервере для WordPress или как быть с php memory_limit",
        "excerpt":"Сегодня при входе в админку блога получил пот такую вот ошибку: Allowed memory size 67108864 bytes exhausted (tried to allocate 139650 bytes) ../class.wp-scripts.php on line 154 Сам блог работает, а вот в админку не попасть. По скольку он (блог) размещен на shared хостинге, при чем в бесплатном аккаунте, я немного...","categories": ["WordPress"],
        "tags": ["Allowed memory size","memory_limit","WP_MEMORY_LIMIT"],
        "url": "/allowed-memory-size-exhausted/",
        "teaser":null},{
        "title": "Шпаргалка по .htaccess",
        "excerpt":"Представляю Вашему вниманию подборку интересных и не очень возможностей .htaccess файлов, и того, что с ними можно сделать. Большинство описаного относится к категории must have. Тестер правил rewrite: htaccess.madewithlove.be Для тестирование регулярных выражений можно воспользоваться www.regex101.com Еще один тестер правил rewrite: martinmelin.se/rewrite-rule-tester/ 1. Базовая авторизация: Бывает так, что нужно закрыть...","categories": ["Apache"],
        "tags": [".htaccess","RewriteCond","rewriterule"],
        "url": "/htaccess-notes/",
        "teaser":null},{
        "title": "Краткое описание директив Apache mod_rewrite",
        "excerpt":"Краткий ликбез о директивах, которые предоставляет mod_rewrite Синтаксис регулярных выражений ^ Начало строки $ Конец строки . Любой одиночный символ (a|b) «a» или «b» (…) Группа [abc] «a» или «b» или «c» [^abc] Не «a», не «b» и не «c» \\s Пробел a? 0 или 1 символ «a» a* 0 или больше «a» a*? 0 или больше «a», не жадный a+ 1 или больше «a» a+? 1 или больше «a», не жадный a{3} Ровно 3 символа «a» a{3,} 3...","categories": ["Apache"],
        "tags": [],
        "url": "/mod_rerwrite-directives/",
        "teaser":null},{
        "title": "Очистка кэша Varnish через Браузер с помощью PHP",
        "excerpt":"Приветствую тебя, дорогой читатель. В этой заметке я хочу поведать тебе, как можно элегантно чистить кэш Varnish. Данная статья описывает, как можно удалять страницы=объекты из кэша, используя их URL адреса. Итак для начала нужно описать ACL в настройках нашего хоста, чтобы разрешить очистку кэша с определенных ip адресов. Для этого...","categories": ["Varnish"],
        "tags": ["flush varnish cache","varnish cache","очистка кэша varnish"],
        "url": "/flush-varnish-cache-browser-php/",
        "teaser":null},{
        "title": "Создаем безопасный web-сервер",
        "excerpt":"Для создания максимально защищенного web-сервера нам нужно: Создать chroot «песочницу» с помощью debootstrap становить в песочнице apache2, php5, mysql становить и настроить mod-security2, а также отредактировать необходимые директивы конфигурационных файлов apache и php. За основу берем дистрибьютив Ubuntu. Создаем сhroot песочницу. Для начала нужно добавить новый репозиторий в sources.list и...","categories": ["Apache"],
        "tags": ["Безопасность","FromHabrSandbox","Apache","chroot","debootstrap","mod-security"],
        "url": "/create-secure-web-server/",
        "teaser":null},{
        "title": "Балансировка нагрузки с помощью NginX",
        "excerpt":"Приветствую тебя, дорогой читатель. В этой статье я хочу описать настройку NginX для балансировки нагрузки на несколько back-end серверов, допустим Apache. Итак предлагается следующая схема (картинка кликабельна): В этом довольно простом деле нам помогут две директивы NginX: upstream - директива, которая поставляется с модулем HttpUpstream и позволяет балансировать нагрузку на...","categories": ["Nginx"],
        "tags": ["load balancing","nginx","балансировка нагрузки"],
        "url": "/load-balancing-nginx/",
        "teaser":null},{
        "title": "Установка Plesk migration manager",
        "excerpt":"Для установки дополнительных компонентов Plesk можно воспользоваться следующей утилитой: /usr/local/psa/admin/bin/autoinstaller Запускается с командной строки. Сразу после запуска она выдает несколько сообщений в консоле, на 5-м шагу предлагается выбрать пакеты для установки. Цифрами говорим ему что ставить и жмем кнопку Enter. После того, как все закончится можно заходить в вэб морду...","categories": ["Plesk"],
        "tags": ["Plesk migration manager","установка"],
        "url": "/install-plesk-migration-manager/",
        "teaser":null},{
        "title": "Как скомпилировать php v.5.5.10 из исходников",
        "excerpt":"Эта заметка расскажет как можно установить PHP последней версии на свой сервер из исходного кода, на примере PHP 5.5.10 + CentOS 6.5. Для начала скачиваем исходный код с официального зеркала. Я живу в Украине и для меня php.net предложил вот такой вот список зеркал. Можно перейти по этой ссылке, и...","categories": ["PHP"],
        "tags": ["Apache","скомпилировать php"],
        "url": "/compile-php-5-5-10-from-sources/",
        "teaser":null},{
        "title": "Проблема загрузки файлов через формы php в Apache",
        "excerpt":"Сегодня столкнулся с проблемой загрузки файлов, которые явно не превышают лимит post_max_size и upload_max_filesize. На выходе вот такая ошибка: Request Entity Too Large The requested resource media-new.php does not allow request data with POST requests ... Вот картинка: Это сообщение о ошибке не относится к настройкам php. Это - ограничение...","categories": ["Apache"],
        "tags": ["Request Entity Too Large"],
        "url": "/request-entity-too-large-php-apache/",
        "teaser":null},{
        "title": "Как заставить работать Search Engine Friendly (SEF) URLs в Joomla! на Nginx",
        "excerpt":"Search engine friendly (SEF) URLs - это ссылки на статьи Вашего сайта в удобной для глаза форме. Они хотя бы частично раскрывают суть конечного поста на Вашем сайте. Если эта опция включена, тогда все ссылки на Ваши посты/статьи из абракадабры превращаются в линки на html страницы. Для того что бы...","categories": ["Joomla","Nginx"],
        "tags": ["joomla","Ngnx","Search engine friendly в Joomla","SEF"],
        "url": "/enabling-search-engine-friendly-sef-urls-on-nginx-joomla/",
        "teaser":null},{
        "title": "Как запустить несколько версий Skype в Ubuntu",
        "excerpt":"В этой заметке хочу поведать как можно запустить несколько процессов Skype в Linux Ubuntu. У меня запущено 2 - рабочий и личный. Для начала оговорюсь, что все launcherы находятся в папке /usr/share/applications/. Стандартный запускатель скайпа - /usr/share/applications/skype.desktop По умолчанию Skype хранит свои файлы в папке ~/.Skype. Иконка - /usr/share/icons/skype.png Итак,...","categories": ["Ubuntu Linux"],
        "tags": ["skype","еще один скайп","несколько skype","несколько Skype в Ubuntu"],
        "url": "/multiple-skypes-in-ubuntu/",
        "teaser":null},{
        "title": "Проблема файла поддержки языка в osCommerce",
        "excerpt":"При работе с магазином на osCommerce периодически вылетает ошибка ‘503 Server Error’. В логах обнаружил вот такие сообщения: PHP Warning: require(includes/languages/.php): failed to open stream: No such file or directory &amp;#8230; PHP Fatal error: require(): Failed opening required 'includes/languages/.php' Для того что бы все завелось нужно немного подредактировать файл: includes/application_top.php...","categories": ["Other CMS"],
        "tags": ["osCommerce","failed to open stream osCommerce"],
        "url": "/issue-with-language-oscommerce/",
        "teaser":null},{
        "title": "Error: database disk image is malformed",
        "excerpt":"Для того что бы в CentOS yum заработал после вот такой ошибки:   Error: database disk image is malformed   нужно почистить кэш пакетов вот такой командой:   yum clean dbcache   или вот такой:   yum clean all           ","categories": ["CentOS"],
        "tags": ["database disk image is malformed"],
        "url": "/error-database-disk-image-is-malformed-fix/",
        "teaser":null},{
        "title": "Установка whm/cpanel и использование удаленного MySQL сервера",
        "excerpt":"Появилась задачка: установить WHM/cPanel на сервер. Вроде ничего сложного, да вот все дело в том, что имеется два сервера: 1 - web сервер. 2 - сервер баз данных MySQL. Итак приступим. Для начала скачиваем установщик WHM и запускаем его: wget -N http://httpupdate.cpanel.net/latest sh latest По экрану побежали цифры и буквы....","categories": ["WHM/cPanel"],
        "tags": ["whm/cpanel","удаленный MySQL сервера"],
        "url": "/install-whm-cpanel-remote-mysql-db-server/",
        "teaser":null},{
        "title": "404 ошибки в ColdFusion10",
        "excerpt":"После переезда с сервера IIS6+ColdFusion8 на сервер с IIS7+Coldfusion10 я не долго радовался тому, что все стартовые страницы сайтов открываются. Облом ждал меня очень близко. При переходе по любым ссылкам сайтов - 404 ошибка. Странная шайтан-штука. Для того, что бы все заработало, нужно было добавить виртуальный каталог с именем jakarta...","categories": ["IIS"],
        "tags": ["404 ошибки в ColdFusion","ColdFusion"],
        "url": "/404-coldfusion10-iis/",
        "teaser":null},{
        "title": "Отправка писем используя telnet к smtp серверу",
        "excerpt":"Telnet - классная утилита, которая позволяет установить сетевое соединение с любой службой, указывая порт для подключения. Telnet входит в стандартный набор утилит любой операционной системы, так что команды будут одинаково работать для linux и для Windows. Запускается она из командной строки/терминала. В этой заметке хочу поведать как с помощью telnet...","categories": ["Почта"],
        "tags": ["smtp","telnet"],
        "url": "/send-email-via-telnet/",
        "teaser":null},{
        "title": "Делаем заглавной первую букву каждой строки в выводе Bash скрипта",
        "excerpt":"В этой заметке хочу рассмотреть варианты вывода списков в bash с изменением первой буквы/символа на заглавную. Буду использовать пример вывода установленных версий Postfix и Dovecot в CentOS: Пример №1: Циклы for. В этом примере создается новая переменная $newf, которая состоит из 2-х частей. В первой части с помощью утилиты tr...","categories": ["bash"],
        "tags": [],
        "url": "/lower-to-upper-bash-scripts/",
        "teaser":null},{
        "title": "Установка Asp.Net на Linux (nginx+mono+xsp)",
        "excerpt":"В этой статье я покажу, как настроить простую связку nginx + Asp.Net. Под простой надо понимать, что какие-то специфические особенности проектов, разграничение прав пользователей, высокие нагрузки и т.п. нужно настраивать отдельно (особенно это касается Asp.Net). Статья написана хабраюзером gouranga. В свое время озадачившись проблемой хостинга маленьких Asp.Net-проектов я осознал одну...","categories": ["FromHabrSandbox","Nginx","Ubuntu Linux"],
        "tags": ["Asp.Net на Linux","mono","nginx","xsp"],
        "url": "/asp-net-install-nginx-mono-xsp/",
        "teaser":null},{
        "title": "Добавить пункт в меню компонентов в админке Joomla!",
        "excerpt":"После неудачного обновления плагина, или любого другого компонента Joomla!, случается неприятная ситуация - пропадает значек в меню. Его можно легко вернуть назад или добавить за ново. Для этого нам понадобится следующая информация: имя базы данных префикс базы данных (у меня - jml, у Вас может отличаться) имя пользователя и пароль Всю эту...","categories": ["Joomla"],
        "tags": ["joomla","админка","меню компонентов"],
        "url": "/add-item-to-components-admin-joomla/",
        "teaser":null},{
        "title": "Устанавливаем Drush руками.",
        "excerpt":"Drush - это cli для Drupal. В этой статье спешу поведать о том, как установить его без участия pear. В подробности таких телодвижений вдаваться не стану. Как ни странно ничего компилить не нужно. Переходим в домашний каталог пользователя, под которым обычно работаем на сервере и понеслась. Делай раз: wget http://ftp.drupal.org/files/projects/drush-7.x-5.8.tar.gz...","categories": ["Other CMS"],
        "tags": ["Drupal","Drush"],
        "url": "/install-drush-without-pear/",
        "teaser":null},{
        "title": "Перенос контроллера домена ActiveDirectory  на новый сервер",
        "excerpt":"В этой статье хочу рассмотреть процесс переноса контролера домена ActiveDirectory c Windows 2003 на Windows Server 2008. Перед началом работы рекомендуется ввести новый сервер в домен. Вообще это не принципиально, но будет на много удобнее. Дальше необходимо удостовериться, что пользователь под которым мы будем все переносить состоит в следующих группах: Enterprise admins Schema...","categories": ["Active Directory"],
        "tags": [],
        "url": "/transfer-activedirectory-to-the-new-server/",
        "teaser":null},{
        "title": "Перенос конфига RADIUS с Windows 2003 IAS на Windows 2008 NPS",
        "excerpt":"В рамках предыдущей статьи появились заметки о том как перенести настройки RADIUS на новый сервер, включая сертификаты и прочий хлам. Дело в том, что функционал RADIUS на Windows Server 2008 реализован в рамках NPS (Network Policies Server). Для того что бы все завести на более новой версии ОС нужно воспользоваться...","categories": ["Active Directory"],
        "tags": [],
        "url": "/%D0%BF%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81-%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D0%B0-radius-%D1%81-windows-2003-ias-%D0%BD%D0%B0-windows-2008-nps/",
        "teaser":null},{
        "title": "Postfix: Изменить адрес отправителя",
        "excerpt":"Если у Вас на сервере выполняется рассылка писем, и Вы не хотите чтобы письма доставлялись не от root@srv01.some-bla-bla-bla.net, тогда можно изменить адрес отправителя. В php.ini приводим значение sendmail_path к вот такому виду: sendmail_path = /usr/sbin/sendmail.postfix -t -i -F \"no-reply\" Перезапускаем apache: /etc/init.d/httpd restart или /etc/init.d/apache2 restart Альтернативой может быть изменение настроек postfix. Для...","categories": ["Почта"],
        "tags": ["PHP","postfix","изменить адрес отправителя"],
        "url": "/change-sender-address-postfix-php/",
        "teaser":null},{
        "title": "Bash: Сохранение конфигурации отдельного виртуального хоста Apache",
        "excerpt":"Начинаю цикл статей с интересными задачками по Bash. Задачка о том, как вырезать часть файла конфигурации apache. Задача: Известно, что на сервере Apache2, который работает в CentOS v.6, настроено около 50 сайтов. Дальше опциональное условие: все они описаны минимум в трех конфигурационных файлах (их расположение не известно). Нужно написать Bash...","categories": ["bash"],
        "tags": ["головоломки bash","задачи bash"],
        "url": "/bash-show-configs-for-apache-vhosts/",
        "teaser":null},{
        "title": "Балансировка нагрузки с помощью Apache",
        "excerpt":"Приветствую тебя, дорогой читатель. В этой статье я хочу описать настройку Apache для балансировки нагрузки на несколько back-end серверов. Для корректной работы понадобятся два модуля: mod_proxy mod_proxy_balancer Пример конфигурации хоста: &lt;VirtualHost *:80&gt; ServerName mywebsite.com ProxyRequests On ProxyVia On &lt;Proxy balancer://mycluster&gt; BalancerMember http://192.168.1.50:80 BalancerMember http://192.168.1.51:80 BalancerMember http://192.168.1.51:80 &lt;/Proxy&gt; ProxyPass / balancer://mycluster...","categories": ["Apache"],
        "tags": ["Apache","балансировка нагрузки"],
        "url": "/load-balancing-with-apache/",
        "teaser":null},{
        "title": "Как настроить ClamAV на сканирование файлов загружаемых по FTP (PureFTPd)",
        "excerpt":"В этой заметке хочу рассказать, как настроить антивирус ClamAV сканировать файлы, которые заливаются на сервер через PureFTPD. Пример приводится для Linux Ubuntu. Для CentOS особых различий не будет. Для начала ставим clam, обновляем и запускаем: apt-get install clamav clamav-daemon clamav-data freshclam service clamav-daemon start Дальше нужно разрешить выполнение скриптов при...","categories": ["FTP"],
        "tags": ["Безопасность","clamav","PureFTPd"],
        "url": "/pureftpd-check-file-uploads-with-clamav/",
        "teaser":null},{
        "title": "Получение списка установленных пакетов программ в Linux",
        "excerpt":"Получить список установленных пакетов в Linux Ubuntu можно вот такой командой: dpkg -get-selections | grep -v deinstall Получить список установленных пакетов в CentOS Linux можно вот такой командой: rpm -qa Если нужно получить список модулей php, можно воспользоваться одной из следующих команд: dpkg -get-selections | grep -v deinstall |grep **php**...","categories": ["Linux server"],
        "tags": ["bash","dpkg","yum"],
        "url": "/list-installed-packages-linux/",
        "teaser":null},{
        "title": "Bash скрипт для бэкапа и восстановления всех баз и пользователей в mysql",
        "excerpt":"Эта заметка о том, как можно быстро сдампить все базы MySql в отдельные файлы в среде bash: Backup: for db in $(echo \"show databases;\" |mysql |grep -v \"Database\\|^mysql$\\|information_schema\\|performance_schema\\|^test\"); do mysqldump --routines --opt $db |gzip &gt; \"$db\".sql.gz; echo \"done with $db\"; done Restore: for db in $(ls |cut -d \".\" -f...","categories": ["bash"],
        "tags": ["mysql"],
        "url": "/backup-restore-all-mysql-databases/",
        "teaser":null},{
        "title": "Симуляция https (ssl) сессии средствами rewrite модуля",
        "excerpt":"Многие сталкивались с балансировкой нагрузки. В этой статье хочу затронуть тему балансировки нагрузки https соединений. Затрону только поверхностно, поскольку делаю маленькую заметку. Большинство балансировщиков нагрузки поддерживают так называемое ssl termination. В этом случае клиент устанавливает защищенную сессию с балансировщиком нагрузки, на самом же балансировщике происходит ssl handshake и с него...","categories": ["Apache"],
        "tags": ["rewrite https","SSL"],
        "url": "/simulate-https-or-ssl-session-with-mod-rewrite/",
        "teaser":null},{
        "title": "Plesk: Просмотр всех почтовый ящиков на сервере",
        "excerpt":"Для начала подключаемся к mysql: mysql -uadmin -p`cat /etc/psa/.psa.shadow` psa Вот такой mysql запрос выведет информацию о всех почтовых ящиках, которые существуют на сервере с Plesk панелью SELECT CONCAT_WS('@',mail.mail_name,domains.name),mail.redir_addr, mail.redirect ,accounts.password FROM domains,mail,accounts WHERE domains.id=mail.dom_id AND accounts.id=mail.account_id ORDER BY domains.name ASC,mail.mail_name ASC; Результаты будут содержать так называемые ‘email forwarders’ -...","categories": ["Plesk"],
        "tags": ["Plesk"],
        "url": "/list-email-accounts-plesk/",
        "teaser":null},{
        "title": "Установка Apache Passenger для Ruby",
        "excerpt":"Небольшая заметка о том, как установить Apache passenger на CentOS для работы с Ruby. Полагаю, что следующие пакеты у Вас установлены: ruby-mysql rubygems ruby-libs ruby-irb ruby Ruby Passenger ставится вот так: gem install passenger --version 3.0.12 Опционально версию можно убрать.Тогда установится последняя доступная версия пакета. Если у Вас не установлены...","categories": ["Apache"],
        "tags": ["Ruby","Apache Passenger"],
        "url": "/install-apache-passenger-ruby-centos/",
        "teaser":null},{
        "title": "Папка WinSxS в Windows Server",
        "excerpt":"Хранилище компонентов Windows (C:\\Windows\\winsxs) используется при так называемых сервисных операциях во время установки ПО. К этим операциям относятся обновление Windows, установка сервис паков и хотфиксов. Хранилище компонентов Windows содержит все файлы которые требуются для установки компонентов Windows. Обновления компонентов тоже валяются в этой папке. Поэтому винда и кушает столько, сколько...","categories": ["Windows Server"],
        "tags": [],
        "url": "/winsxs-windows-server-2003/",
        "teaser":null},{
        "title": "Uptime в мониторинге Cacti",
        "excerpt":"Cacti хоть и получает SNMP-Uptime от устройств, но вот выводит его только в странице самого устройства, а когда таких устройств хотя бы больше 100, открывать страницу каждого становится неудобно. Надо свести их в единую таблицу. Получить uptime сервера с помощью snmpwalk можно следующим образом: snmpget -v2c -c public localhost 1.3.6.1.2.1.1.3.0...","categories": ["мониторинг"],
        "tags": ["FromHabrSandbox","cacti","uptime"],
        "url": "/check-servers-uptime-in-cacti/",
        "teaser":null},{
        "title": "Перенос почты с одного сервера на другой с помощью Larch",
        "excerpt":"Larch - утилита, написана на ruby, которая может очень сильно пригодиться при переносе почты с одного почтового сервиса на другой. То есть если Вы меняете почтового провайдера, но сохраняете полное имя почтового ящика, тогда невозможно настроить пересылку со старого на новый адрес. Для того что бы перенести почту читайте дальше....","categories": ["Почта"],
        "tags": ["Larch"],
        "url": "/transfer-mail-with-larch/",
        "teaser":null},{
        "title": "Список сайтов в IIS6",
        "excerpt":"Для того что бы получить список сайтов в IIS6 нужно в командной строке запустить вот такую команду: @FOR /F \"delims=[]\" %A IN ('@cscript //nologo %SystemDrive%\\Inetpub\\AdminScripts\\adsutil.vbs ENUM /P /w3svc') DO @FOR /F delims^=^\"^ tokens^=2 %B IN ('@cscript //nologo %SystemDrive%\\Inetpub\\AdminScripts\\adsutil.vbs GET %A/ServerComment') DO @FOR /F delims^=^\"^ tokens^=2 %C IN ('@cscript %SystemDrive%\\Inetpub\\AdminScripts\\adsutil.vbs //nologo...","categories": ["IIS"],
        "tags": [],
        "url": "/list-iis6-sites/",
        "teaser":null},{
        "title": "Internal Zend error wp-cache-base.php",
        "excerpt":"Если Вы наблюдаете вот такую ошибку при работе Вашего WordPress блога:   Fatal error: Internal Zend error - Missing class information for in /var/www/html/wp-content/plugins/wp-super-cache/wp-cache-base.php on line 5   Самое время подредактировать файлик /etc/php.d/apc.ini вот такими строчками:  apc.filters = wp-cache-config apc.include_once_override = 0  ","categories": ["WordPress"],
        "tags": ["Internal Zend error","wp-cache-base.php"],
        "url": "/internal-zend-error-wp-cache-base-php/",
        "teaser":null},{
        "title": "Установка  Ruby 1.9.3 на RedHat 6",
        "excerpt":"Ruby 1.9 не доступно через yum в Red Hat Enterprise Linux 6 согласно сообщению на вот этой странице: https://access.redhat.com/site/solutions/131923 Не надо печалиться. Рубиновый язык можно всунуть в красную шапочку используя rvm (Ruby Version Manager). Для начала нужно немного подготовиться: yum -y install gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel...","categories": ["Linux server"],
        "tags": ["Ruby 1.9","ruby 1.9 Red Hat","rvm"],
        "url": "/install-ruby-1-9-red-hat6/",
        "teaser":null},{
        "title": "Устанавливаем ionCube Loader для PHP",
        "excerpt":"ionCube Loader нужен для запуска на Вашем сервере платных компонентов, которые используются в работе сайта. Как правило эти компоненты имеют обфусцированный код, что делает их недоступными для php. Если Вы откроете такой файл - увидите набор крякозябликов, соответственно браузер будет выдавать сообщение об ошибке, а функционал CMS системы будет неполным....","categories": ["PHP"],
        "tags": ["ionCube Loader","установка ionCube Loader"],
        "url": "/install-ioncube-loader/",
        "teaser":null},{
        "title": "Настройка паралельной доставки (Dual Delivery) почты в Postfix",
        "excerpt":"Эта заметка рассказывает как с помощью Postfix организовать параллельную доставку почты на несколько почтовых серверов в рамках одно доменного имени, без использования общеизвестной пересылки или сборщика писем. В данном случае письма для почтового ящика someuser@example.com будут доставляться на несколько почтовых серверов, где именно этот почтовый ящик и настроен. В роли вторичного...","categories": ["Почта"],
        "tags": ["Postfix","Dual Delivery Postfix","DualDelivery Postfix","паралельная доставка почты Postfix"],
        "url": "/configure-dual-delivery-postfix/",
        "teaser":null},{
        "title": "Установка PostfixAdmin и RoundCube",
        "excerpt":"Эта заметка поведает о том, как установить инструмент управления почтовыми ящиками - PostfixAdmin, и удобный интерфейс для чтения почты - RoundCube, на сервер под управлением CentOS Linux. Первая статья: Установка и Настройка Postfix Вторая статья: Установка и настройка службы imap/pop3 на базе Dovecot Настоятельно рекомендую ознакомиться с ними. Для начала...","categories": ["Почта"],
        "tags": ["PostfixAdmin","RoundCube"],
        "url": "/install-postfixadmin-and-roundcube/",
        "teaser":null},{
        "title": "Установка и настройка службы imap/pop3 на базе  Dovecot",
        "excerpt":"Это вторая статья цикла посвященного почтовому серверу на базе ОС CentOS Linux. В ней речь пойдет о том, как же дать людям доступ ко входящим письмам по средствам imap/pop3 c помощью Dovecot. Первая статья: Установка и Настройка Postfix Настоятельно рекомендую начинать настройку сервера с нее. Для начала установи нужные части...","categories": ["Почта"],
        "tags": ["Dovecot","mysql"],
        "url": "/install-dovecot-centos/",
        "teaser":null},{
        "title": "Установка и Настройка Postfix",
        "excerpt":"Эта статья открывает цикл статей о настройке почтового сервера. Весь рассказ начнется с настройки так называемого mail transfer agent (MTA). Святая святых и основная служба, которая будет отправлять почту с сервера, принимать входящую почту и класть ее в нужные места. Рассмотрю настройку Postfix c Mysql на CentOS. Для начала установим...","categories": ["Почта"],
        "tags": ["postfix","dovecot"],
        "url": "/install-configure-postfix/",
        "teaser":null},{
        "title": "Проксирование запросов в Apache c ProxyPass",
        "excerpt":"По разным причинам может понадобиться отображать информацию с одного сервера на другом. В причины вдаваться не буду. Приведу пример как это можно реализовать средствами mod_rewrite и mod_proxy web-сервера Apache2. В этом примере я буду проксировать запросы на админку WordPress с одного сервера на второй. Используя mod_proxy: ProxyRequests On ProxyPass /wp-admin...","categories": ["Apache"],
        "tags": ["Балансировка нагрузки","ProxyPass"],
        "url": "/proxypass-requests-with-apache/",
        "teaser":null},{
        "title": "Установка modsecurity для Nginx",
        "excerpt":"ModSecurity - своеобразный фаервол для Apache, Nginx и IIS. Это модуль, предоставляющий набор правил для фильтрации трафика. Это модуль из разряда must have для любого сервера. 19 Декабря 2013 года была выпущена версия 2.7.7. Она является наиболее актуальной на момент написания этой заметки. Собирать будем из исходников и настраивать для...","categories": ["Nginx","Безопасность"],
        "tags": ["ModSecurity"],
        "url": "/install-modsecurity-for-nginx/",
        "teaser":null},{
        "title": "Настройка сайтов в Apache2",
        "excerpt":"Данный пример содержит конфигурационный файл сервера Apache2 для сайта tech-notes.net: &lt;VirtualHost *:80&gt; ServerName tech-notes.net ServerAlias www.tech-notes.net DocumentRoot /var/www/tech-notes LogLevel warn ErrorLog /var/log/httpd/tech-notes_error.log CustomLog /var/log/httpd/tech-notes_access.log combined &lt;Directory /var/www/tech-notes&gt; Options +ExecCGI Indexes FollowSymLinks MultiViews AllowOverride All Order allow,deny allow from all &lt;/Directory&gt; &lt;/VirtualHost&gt; Пояснения: ServerName - имя сайта. ServerAlias - дополнительное имя...","categories": ["Apache"],
        "tags": [],
        "url": "/configure-vhosts-apache2/",
        "teaser":null},{
        "title": "Переименование пользователя AD и изменение домашней папки PowerShell",
        "excerpt":"Задача была сделать следующее: Было: Имя: Иван Иванович; Фамилия: Иванов Надо: Имя: Иван; Фамилия: Иванов; Отчество: Иван. (4 первых символа отчества + .) А так же за одно, необходимо создать каждому пользователю домашнюю папку и дать ему туда полные права. Для решения первой задачи в итоге написан следующий скрипт: Import-Module...","categories": ["Active Directory"],
        "tags": ["FromHabrSandbox"],
        "url": "/rename-user-in-active-directory/",
        "teaser":null},{
        "title": "Автоматический прием Яндекс.Денег на сайте на php",
        "excerpt":"На самом деле не нужны никакие библиотеки для обычного прием Яндекс.Денег на сайте. А вся интеграция укладывается в три этапа. Этап 1: Настройка на стороне Яндекс.Деньги Заходим сюда и: — вводим адрес, по которому система Яндекс.Деньги должна стучаться, когда поступит платеж на ваш кошелек. — смотрим секрет и записываем его...","categories": ["FromHabrSandbox","PHP"],
        "tags": ["прием Яндекс.Денег"],
        "url": "/accept-yandex-money-on-the-website-with-php/",
        "teaser":null},{
        "title": "Как запретить доступ к конкретных папками на сервере в Apache",
        "excerpt":"Запретить доступ к определенным папкам можно с помощью следующей конструкции. Закидывать ее можно в настройки виртуального хоста Apache, httpd.conf или создать отдельный файл с настройками: &lt;DirectoryMatch \"\\.(git|svn|hg)\"&gt; Order allow,deny deny from all &lt;/DirectoryMatch&gt; В этом примере я запрещаю доступ к папкам .git, .svn и .hg. Вместо них можно использовать другие...","categories": ["Apache","Безопасность"],
        "tags": [],
        "url": "/forbid-access-to-definite-folders-in-apache/",
        "teaser":null},{
        "title": "Как ограничить разрешенные http методы в Apache",
        "excerpt":"Приведенная ниже конструкция позволяет запретить в Apache все методы http запросов, кроме GET, POST и HEAD:     &lt;Directory /var/www/html/&gt; \t&lt;LimitExcept POST GET HEAD&gt; \t\tOrder allow,deny \t\tdeny from all \t&lt;/LimitExcept&gt;  \tOptions Indexes FollowSymLinks MultiViews \tAllowOverride All  \t&lt;Limit POST GET HEAD&gt; \t\tOrder allow,deny \t\tallow from all \t&lt;/Limit&gt; &lt;/Directory&gt;  ","categories": ["Apache","Безопасность"],
        "tags": [],
        "url": "/limit-http-methods-apache/",
        "teaser":null},{
        "title": "Как выключить php safe_mod в Plesk",
        "excerpt":"Для начала логинимся в Plesk. Переходим на страницу subscriptions и выбираем нужный сайт. Дальше на вкладке Websites&amp;Domains раскрываем Advanced Operations и выбираем Website Scripting and Security, как показано на скриншоте (кликабельно): Дальше переходим на вкладку Php settings, прокручиваем экран немного вниз и выбираем нужное значение из выпадающего списка safe_mode, как...","categories": ["Plesk"],
        "tags": [],
        "url": "/disable-php-safe_mod-plesk/",
        "teaser":null},{
        "title": "Передача данных из Windows CMD в Microsoft Jscript",
        "excerpt":"Столкнулся с очередной задачкой: Нужно с помощью Microsoft Jscript получить набор данных о сервере. Опять спотыкаюсь о косяки Windows 2008 Server. Ну очень уж неудобно мне работать с ним. Документацию на MSDN читать - в больничке лечиться. Тупым перебором параметров удалось завести все. Вот оставлю тут небольшую заметку о том,...","categories": ["Windows server"],
        "tags": ["Microsoft Jscript"],
        "url": "/forward-data-from-windows-comandprompt-to-microsoft-jscript-variable/",
        "teaser":null},{
        "title": "Ошибка пула IP адресов в Plesk",
        "excerpt":"Случается так, что при работе с Plesk версии 10 вылетает ошибка пула ip адресов: Error: There is no IP address x.x.x.x in the pool Появляется она в том случае, когда ip адрес абонемента (subscription) меняется через Websites &amp; Domains &gt; Web Hosting Access. При этом пул IP адресов абонемента очищается....","categories": ["Plesk"],
        "tags": ["IP address pool","Plesk"],
        "url": "/plesk-ip-address-in-the-pool/",
        "teaser":null},{
        "title": "Считаем DNS зоны в Windows Server 2008/2012 с помощью Microsoft Jscript",
        "excerpt":"Пришлось мне как-то раз автоматизировать процесс получения информации и DNS зонах, которые находятся на абстрактном сервере под управлением Windows. Опять мой мозг режет мысль о том, что пишу заметку про окна, когда изначально блог задумывался о задачах, связанных с Linux. Итак задача ясна. Выбор инструмента пал на Jscript, поскольку тело...","categories": ["Windows Server"],
        "tags": ["Microsoft Jscript"],
        "url": "/list-dns-zones-in-windows-server-20082012-with-microsoft-jscript/",
        "teaser":null},{
        "title": "Список пользователей и паролей ColdFusion DataSources",
        "excerpt":"В настройках ColdFusion соединение с базами данных можно описать в админке в разделе DataSources. Но что же делать, если пароли нескольких или всех пользователей были утрачены? Как ни странно сам CF вам и поможет из декодировать из того, что в нем имеется. Вашему вниманию предлагается скрипт, который выдаст вам на...","categories": ["Windows server"],
        "tags": ["ColdFusion"],
        "url": "/decrypt-coldfusion-datasources-passwords/",
        "teaser":null},{
        "title": "Добавляем пункт в меню редактора TinyMCE WordPress",
        "excerpt":"Вчера добавил поддержку спойлеров в блог используя материалы из этой статьи Спойлеры получились красивые и выглядят вот так: Йа спойлер Эта статья писалась под `WordPress`, но сейчас сайт вертится на [Jekyll](https://jekyllrb.com/). Кому интересно как я сделал тут спойлер - пишите на почту. Вот только не удобно каждый раз набирать сочетание...","categories": ["WordPress"],
        "tags": [],
        "url": "/add-button-to-tinymce-wordpress/",
        "teaser":null},{
        "title": "Как узнать версию WordPress из командной строки",
        "excerpt":"Узнать версию установленного WordPress можно на главной странице админки, но в админку можно не иметь доступа. В этом случае выполните вот такую команду:  grep wp_version /var/www/html/wp-includes/version.php |grep -v \"*\"      Предполагаю, что WordPress находится в папке /var/www/html  ","categories": ["WordPress"],
        "tags": [],
        "url": "/get-wordpress-version-from-shell/",
        "teaser":null},{
        "title": "Установка php-mcrypt на CentOS 6",
        "excerpt":"Для того, что бы установить php-mcrypt на CentOS Linux нужно включить дополнительные репозитарии:   wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm   wget http://rpms.famillecollet.com/enterprise/remi-release-6.rpm   rpm -Uhv epel-release-6-8.noarch.rpm remi-release-6.rpm   Дальше установить сам php-mcrypt:   yum -y install php-mcrypt  ","categories": ["Linux server"],
        "tags": ["PHP"],
        "url": "/install-php-mcrypt-centos/",
        "teaser":null},{
        "title": "Удаляем лишние пробелы из строк в Microsoft Jscript",
        "excerpt":"MS Jscript имеет очень много функций и методов от VisualBasic и Microsoft C/C++. В них входит функция trim, которая позволяет убрать лишние символы пробелов в начале и в конце строки. Но что же делать, если существуют лишние пробелы между словами в строке? Предлагаю следующую функцию на Ваше усмотрение. Основная задумка:...","categories": ["Windows server"],
        "tags": ["Microsoft Jscript"],
        "url": "/remove-extra-spaces-from-microsoft-jscript/",
        "teaser":null},{
        "title": "Форма обратной связи для WordPress без плагинов",
        "excerpt":"Есть разные плагины для организации обратной связи для WordPress. Почему-то ни один из них корректно не сработал в моем блоге. Зная некоторые базовые основы WordPress и php, я подумал, что можно обойтись и без плагина. Предлагаю Вашему вниманию шаблон страницы для отправки почты: &lt;?php /** * Template Name: Contact Form...","categories": ["WordPress"],
        "tags": ["wordpress","без плагина","обратная связь"],
        "url": "/wordpress-contact-form/",
        "teaser":null},{
        "title": "Отображение информации phpinfo в WordPress без ftp доступа к серверу",
        "excerpt":"Если Вы столкнулись с такой же проблемой как и я - добро пожаловать. Обратился человек, говорит Все пропало. Доступа к серверу нету, имена, пароли, явки сменены. Нужно увезти сайт от плохих дядек. Тонкости описывать не буду - юзаем любой плагин для бэкапа. Нужно было получить некоторые данные о сервере, которые...","categories": ["WordPress"],
        "tags": ["phpinfo","wordpress"],
        "url": "/show-phpinfo-on-wordpress-page/",
        "teaser":null},{
        "title": "Что такое grep и с чем его едят",
        "excerpt":"Намедни хабраюзер simpleadmin выложил довольно полезную заметку про grep. Дальше от автора: Поэтому… Лето… Пятница… Немного поговорим о grep. Зная местную публику и дабы не возникало излишних инсинуаций сообщаю, что всё нижеизложенное справедливо для # grep -version | grep grep grep (GNU grep) 2.5.1-FreeBSD Это важно в связи с #...","categories": ["bash"],
        "tags": ["FromHabrSandbox"],
        "url": "/whatsup-with-grep/",
        "teaser":null},{
        "title": "Интересные приемы программирования на Bash",
        "excerpt":"Эти приемы были описаны во внутреннем проекте компании Google «Testing on the Toilet» (Тестируем в туалете — распространение листовок в туалетах, что бы напоминать разработчикам о тестах). В данной статье они были пересмотрены и дополнены. Безопасность Я начинаю каждый скрипт со следующих строк #!/bin/bash set -o nounset set -o errexit...","categories": ["bash"],
        "tags": ["FromHabrSandbox","функции bash"],
        "url": "/bash-progarming-examples/",
        "teaser":null},{
        "title": "Создание SSL сертификата в Linux.",
        "excerpt":"В продолжение линейки статей про SSL, хотелось бы описать шаги появления сертификатов. Я не буду повторяться в терминологии. Теоретическая часть изложена в статье Что такое SSL и с чем его кушать Дальнейшие действия справедливы в среде Linux c использованием функционала пакета Openssl. Итак для начала генерируем ключ безопасности. Очень важно...","categories": ["SSL","Безопасность"],
        "tags": ["certificate","linux","ssl","ssl сертификат","мультидоменный сертификат","самозаверенный сертификат linux","самоподписаный сертификат"],
        "url": "/create-ssl-certificate/",
        "teaser":null},{
        "title": "Настройка базовой авторизации в Nginx",
        "excerpt":"Рассмотрю пример настройки базовой авторизации в Nginx для сайта на базе WordPress. Мне нужно что бы окно авторизации выпрыгивало для следующих страниц: http://www.tech-notes.net/wp-admin http://www.tech-notes.net/wp-login.php Для этого для начала нужно установить apache2-utils. На сервере установлена Linux Ubuntu: apt-get install apache2-utils В случае с CentOS: yum install httpd-tools Этот набор утилит нужен...","categories": ["Nginx","Безопасность"],
        "tags": [],
        "url": "/basic-auth-nginx/",
        "teaser":null},{
        "title": "Обзор конфигурации Varnish",
        "excerpt":"Существует множество статей о том, как можно настроить Varnish. Спешу сообщить, что единого подхода к настройке не существует. Чем больше опций Вы укажете в файле конфигурации, тем больше может появиться непредвиденных обстоятельств. В этой статье хочу провести обзор языка VCL, который используется при настройке Varnish и рассмотреть варианты настройки. Спешу...","categories": ["Varnish"],
        "tags": [],
        "url": "/varnish-configuration-rewiev/",
        "teaser":null},{
        "title": "Изменение формата ведения логов в NginX",
        "excerpt":"Многим известен logformat в настройках сервера Apache. То же самое существует и для Nginx. Для того что бы использовать значение X-Forwarded-For вместо $remote_addr в логах, внесите следующие изменения в файл /etc/nginx/nginx.conf: log_format forwarded '\"$http_x_forwarded_for\" - $remote_user [$time_local] $status ' '\"$request\" $body_bytes_sent \"$http_referer\" ' '\"$http_user_agent\"'; Дальше укажите формат для стандартного лог-файла...","categories": ["Nginx"],
        "tags": [],
        "url": "/nginx-logformat/",
        "teaser":null},{
        "title": "Как редактировать виджет МЕТА в WordPress",
        "excerpt":"Вопрос о том, нужна ли регистрация на сайте, вызывает много споров. С одной стороны, улучшается так называемый пользовательский фактор, посетитель больше времени проводит на сайте, есть возможность заинтересовать читателя с помощью скрытого текста, который видят только зарегистрированные пользователи, ну и так далее. С другой стороны, требование зарегистрироваться, чтобы читать информацию,...","categories": ["WordPress"],
        "tags": ["WordPress"],
        "url": "/edit-wpmeta-field-items/",
        "teaser":null},{
        "title": "Понимание статистики производительности MySQL исходя из вывода команды SHOW STATUS",
        "excerpt":"Вывод команды \"SHOW STATUS;\" в MySQL возвращает большое количество технических данных, на основе которых можно определить использование памяти, производительность кэша и распределения ресурсов. Хочу поведать о том, как интерпретировать эти статистические данные. Open_tables, Opened_tables: Open_tables показывают количество таблиц, открытых в данный момент, в то время как значение Opened_tables показывает количество...","categories": ["MySQL"],
        "tags": [],
        "url": "/understanding-the-performance-statistics-from-mysqls-show-status-command/",
        "teaser":null},{
        "title": "Включаем страницу статистики в NginX",
        "excerpt":"Для того, что бы включить страницу статистики NginX нужно добавить вот такие строки в файл настроек nginx.conf или в файл, в котором описаны сайты. Изменения нужно вносить в секцию server { ... }: location /statistics { # Turn on nginx stats stub_status on; # I do not need logs for...","categories": ["Nginx"],
        "tags": [],
        "url": "/enable-status-page-nginx/",
        "teaser":null},{
        "title": "Оптимизация изображений для сайта на сервере с Linux",
        "excerpt":"Многие из нас сталкивались не раз с тем, что всякого рода тестировщики скорости работы сайта ругались на неоптимизованые картинки. Многие из нас игнорировали эти сообщения и довольствовались высокой скоростью отгрузки страниц. Для тех, кто хочет видеть высокие балы на подобных speadtest’ах, предлагаю сжать/оптимизировать свой картинки. Для этого нам понадобится всего...","categories": ["bash"],
        "tags": [],
        "url": "/optimize-images/",
        "teaser":null},{
        "title": "Проблема установки програм в Ubuntu 12.04",
        "excerpt":"Хоть Ubuntu 12.04 и выпускалась с лэйбой LTS (long term support), да видно этот long term закончился. Многие уже столкнулись с проблемами при установке пакетов. У меня выпадало вот такое сообщение: Err http://us.archive.ubuntu.com/ubuntu/ quantal-updates/main 404 Not Found [IP: 91.189.91.13 80] Failed to fetch http://us.archive.ubuntu.com/ubuntu/pool/main/ 404 Not Found [IP: 91.189.91.13 80]...","categories": ["Ubuntu Linux"],
        "tags": ["apt"],
        "url": "/issues-wit-apt-ubuntu-12-04/",
        "teaser":null},{
        "title": "Как узнать версию Joomla! из командной строки",
        "excerpt":"Версию CMS Joomla можно узнать из командной строки, если нету доступа в админку. Для этого выполните следующую команду, находясь в папке сайта:   grep '$RELEASE' libraries/cms/version/version.php   В зависимости от версии, может сработать следующая   grep '$RELEASE' libraries/joomla/version/version.php   В результате получите версию:   public $RELEASE = '2.5';  ","categories": ["Joomla"],
        "tags": [],
        "url": "/get-joomla-version-from-shell/",
        "teaser":null},{
        "title": "Использование lftp для обмена файлами с ftp сервером в Linux",
        "excerpt":"lftp - утилита командной строки, которая позволяет обмениваться данными с ftp и http серверами. lftp имеет функционал зеркалирования, который позволяет загружать или рекурсивно обновлять дерево каталогов. Она также имеет функционал обратного зеркалирования (mirror -R), который позволяет рекурсивно обновлять обновлять дерево каталогов на удаленном сервере. Зеркалирование также позволяет синхронизировать папки между...","categories": ["FTP"],
        "tags": ["lftp"],
        "url": "/use-lftp-for-file-exchange/",
        "teaser":null},{
        "title": "Как записать образ на флэшку из командной стороки",
        "excerpt":"Бывает нужно создать загрузочную флэшку с образом дистрибутива операционной системы или чего-нибудь другого.   Поможет в этом утилита командной строки linux под названием dd   Пример создания загрузочной флэкши из образа диска CentOS:   sudo dd if=CentOS-6.2-i386-bin-DVD1.iso of=/dev/sdb   /dev/sdb - идентификатор вашей флэхи.   Перед началом манипуляций ее нужно отмонтировать:   sudo umount /dev/sdb  ","categories": ["Linux server"],
        "tags": [],
        "url": "/write-iso-to-flash-stick/",
        "teaser":null},{
        "title": "Конвертируем контейнер Parallels Virtuozzo в виртуалку Parallels Bare Metal Server",
        "excerpt":"Virtuozzo и Bare Metal Server - два коммерческих продукта для виртуализации от компании Parallels. Они используют разные подходы к хранению данных виртуальных машин. В рамках Parallels Virtuozzo не существует понятия полноценной операционной системы для контенера. Как правило контейнер - это некий chroot, который доступен в виде папки на диске, а...","categories": ["Linux server"],
        "tags": ["Parallels Virtuozzo"],
        "url": "/convert-parallels-virtuozzo-container-to-pbsm/",
        "teaser":null},{
        "title": "Размышления о кластеризации. Часть 1 - Понятие `кластер`",
        "excerpt":"Понятие кластер, подразумевает использование нескольких серверов при работе целостного приложения. Каждый из серверов в этом случае выполняет отведенную ему роль. Этой статьей я начинаю цикл о кластерах, их настройке и возможностях. Всем известно, что можно взять выделенный сервер и развернуть на нем web-сайт. Установить web-сервер типа Apache или NginX. Залить...","categories": ["Clusters"],
        "tags": [],
        "url": "/notes-about-clusters/",
        "teaser":null},{
        "title": "Как я проверял Moodle на прочность",
        "excerpt":"Появилась задачка проверить сколько одновременных пользователей выдержит сайт на базе moodle. Вернее даже так Выдержит ли Moodle 1000 одновременных пользовательских сессий Тема про нагрузочное тестирование довольно популярна в современном мире, поскольку каждый хозяин интернет ресурса желает знать предел его возможностей, и, по возможности, расширить этот предел. Сценарий поведения был такой:...","categories": ["Other CMS"],
        "tags": ["Moodle","Нагрузочное тестирование"],
        "url": "/moodle-load-test/",
        "teaser":null},{
        "title": "Magento залипла на реиндескации данных",
        "excerpt":"Обратился ко мне человек с просьбой посмотреть что не так с сайтом. Говорит, что не работает. Зашел в хостинг панель, вижу что сервер включен. Посмотрел доступные порты с помощью nmap - все нужные порты доступны. Главная страница сайта не открывается. Вернее открывается очень долго и безрезультатно, не выдавая никаких сообщений....","categories": ["Other CMS"],
        "tags": ["Magento"],
        "url": "/magento-stuck-at-data-reindex/",
        "teaser":null},{
        "title": "То что, возможно, Вы не знали про Insert в MySQL",
        "excerpt":"Каждый, кто в программировании работает с базами данных MySQL, сталкивался с оператором INSERT. Но оказывается не все, даже самые опытные разработчики, знают и умеют использовать его функционал полностью. На примере двух распространенных задач я хочу вам рассказать о тонкостях работы insert. Задача 1. Необходимо сделать счетчик посещаемости по IP адресам....","categories": ["MySQL"],
        "tags": [],
        "url": "/mysql-insert-trolo/",
        "teaser":null},{
        "title": "Размышления о кластеризации: Часть 2 - Раздача Статики",
        "excerpt":"Долго думал как продолжить цикл статей о кластерах. В предыдущей статье &lt;a href=\"http://www.tech-notes.net/notes-about-clusters/\" title=\"Размышления о кластеризации. Часть 1\" target=\"_blank\"&gt;Размышления о кластеризации. Часть 1&lt;/a&gt; я рассмотрел вариант разнесения базы данных и вэб сервера на разные ноды/головы. Во второй статье я хотел рассмотреть вариант добавления дополнительных вэб серверов, потом понял что в...","categories": ["Clusters"],
        "tags": [],
        "url": "/notes-about-clusters-part2/",
        "teaser":null},{
        "title": "Использование NginX за балансировщиком нагрузки и правильные ip адреса в логах",
        "excerpt":"Если у Вас на сервере установлен Varnish + NginX, то в логах NginX все посетители будут с одним ip адресом - 127.0.0.1. Есть два варианта: Изменить формат ведения логов Заставить NginX сразу обрабатывать правильный ip адрес Для начала нужно заставить Varnish отправлять этот ip адрес бэкэнду. Для этого добавьте следующие...","categories": ["Nginx"],
        "tags": [],
        "url": "/nginx-realip-in-logs/",
        "teaser":null},{
        "title": "Делаем BackUp всех баз даных в MSSQL Server 2008",
        "excerpt":"Бывает нужно сделать разовый бэкап всех баз данных (all databases) для того что бы их куда-то перенести или согнать в отдельном хранилище. Для того что бы сделать бэкап всех баз данных нужно: Подключиться к Database Engine, воспользовавшись SQL Management Studio. Дальше разворачиваем Management в Object Explorer’e и находим Maintenance Plans....","categories": ["Windows server"],
        "tags": ["MSSQL Server"],
        "url": "/backup-all-dbs-mssql-server-2008/",
        "teaser":null},{
        "title": "Полезное баловство, используем консоль браузера",
        "excerpt":"Некоторые задачи решаются через консоль браузера (F12), и имеют высокий КПД. Правда, когда я это происходит, то меня не покидает ощущение того, что я занимаюсь каким-то баловством. Мое сегодняшнее баловство — это скрипт, который делает одну простую вещь — скроллит страницу вниз. Особенность его в том, что при достижении самого...","categories": ["Javascript"],
        "tags": ["FromHabrSandbox"],
        "url": "/scroll-web-page-from-browser-console/",
        "teaser":null},{
        "title": "Подключение Linked Серверов в новом MSSQL",
        "excerpt":"Настраивал второй MSSQL сервер для клиента и столкнулся с проблемой настройки Linked Servers на нем. На первом сервере имелось два линкованых инстанса MSSQL. Для подключения использовалась учетная запись ‘sa’. В принцы пе нету ничего сложного в том, что бы вывести инфу об этих серверах в окно запроса. Смотри скриншот: Думаю...","categories": ["MSSQL Server"],
        "tags": [],
        "url": "/transfer-linked-servers-in-new-mssql/",
        "teaser":null},{
        "title": "Автоматизируем перенос баз данных между серверами MSSQL 2008",
        "excerpt":"И снова плююсь на проекты связанные с виндовыми серверами. Намедни столкнулся с задачей - нужно перенести несколько сотен БД с одного сервера на другой. Руками можно сделать бэкап одной базы и скопировать ее на новый сервер. Но представьте сколько времени и кнопкокликанья уйдет на перенос двух или трех сотен баз....","categories": ["Windows server"],
        "tags": ["MSSQL Server","tsql"],
        "url": "/mssql-databases-backup/",
        "teaser":null},{
        "title": "Копируем контейнер Parallels Virtuozzo на новый гипервизор",
        "excerpt":"В этой заметке хочу поведать о том, каким образом можно скопировать/мигрировать контейнер Parallels Virtuozzo, с в KVM/VMware ESX/VirtualBox. Основной проблемой подобных действий является то, что понятия полноценной операционной системы отсутствует в рамках контенера Virtuozzo. Как правило контейнер - это некий chroot, который доступен в виде папки на диске. Я буду...","categories": ["Linux server"],
        "tags": ["Parallels Virtuozzo"],
        "url": "/move-parallels-virtuozzo-container/",
        "teaser":null},{
        "title": "Несколько полезных трюков для файла функций темы в WordPress",
        "excerpt":"WordPress является великолепной платформой, предлагая надежную разработку и бесконечные настройки. Используя данную cms, я узнал несколько полезных трюков, которыми хочу поделиться с Вами: 1. Удаляем поле URL в форме комментариев. add_filter('comment_form_default_fields', 'my_remove_url'); function my_remove_url($arg) { $arg['url'] = ''; return $arg; } 2. В административной части блога показываем автору только его...","categories": ["WordPress"],
        "tags": ["FromHabrSandbox"],
        "url": "/multiple-tricks-for-wordpress-theme-functions/",
        "teaser":null},{
        "title": "Установка Munin на CentOS",
        "excerpt":"Munin является инструментом для мониторинга сетевых устройств с возможностью сохранения истории производительности этих устройств. Графики производительности можно смотреть в браузере. С помощью Munin можно контролировать работу серверов, приложений, мониторить погоду в Сибири или того, что придет Вам на ум. На основе графиков производительности определить, в какой момент с сервером пошло...","categories": ["мониторинг"],
        "tags": ["munin mysql","установка munin"],
        "url": "/install-munin-centos-6/",
        "teaser":null},{
        "title": "Обходим сообщение `The server principal already exists`",
        "excerpt":"В ходе переноса пользователей MSSQL получил вот такое сообщение: Server principal 'username' already exists. Засада была в том, что такого пользователя не было в списке пользователей базы. Для того, что бы обойти ее открываем новое окно запроса и выполняем: USE master GO DROP login **username** Возвращаемся во вкладку с запросом,...","categories": ["MSSQL Server"],
        "tags": [],
        "url": "/the-server-principal-already-exists/",
        "teaser":null},{
        "title": "MySql: Настройка репликации",
        "excerpt":"Ок. Это не оригинальная статья. Таких, как эта - полным полно в интернете. Она мне нужна для того, что бы не приходилось каждый раз гуглить когда нужна шпаргалка. Для начала рекомендую подредактировать фалйл /etc/hosts следующими строками на обоих серверах: mysql.master 192.168.10.10 mysql.slave 192.168.10.20 Ip дареса серверов поменяйте на свои. Для...","categories": ["MySQL"],
        "tags": ["репликация mysql"],
        "url": "/mysql-master-slave-replication/",
        "teaser":null},{
        "title": "Размышления о кластеризации: Часть 3 - Varnish кэш",
        "excerpt":"Собрался в конце концов с мыслями для того что бы продолжить демагогию о том, как же еще усложнить себе жизнь и уменьшить нагрузку на сервер. Предыдущие статьи: Размышления о кластеризации: Часть 1 Размышления о кластеризации: Часть 2 В этой статье я хочу поговорить про кэш. Varnish - замечательный инструмент для...","categories": ["Clusters","Varnish"],
        "tags": [],
        "url": "/notes-about-clusters-part3-varnish/",
        "teaser":null},{
        "title": "Как удалить приложение и его зависимости из CentOS/RHEL",
        "excerpt":"Как правило комнда yum remove удаляет только выбраный пакет. Для того что бы удалить всю бяку, которая была установлена с ним вмете нужно воспользоваться функционалом пакета yum-plugin-remove-with-leaves Устанавливаем его: yum install yum-plugin-remove-with-leaves Теперь можно грохнуть ненужное апликуху используя ключь -remove-leaves yum remove package_name -remove-leaves Для того что бы yum уносил...","categories": ["Linux server"],
        "tags": ["yum"],
        "url": "/yum-remove-dependencies/",
        "teaser":null},{
        "title": "Невозможно добавить сервис в автозагрузку CentOS/RHEL",
        "excerpt":"При выполнении очередной задачи столкнулся с тем, что не могу поставить на автозагрузку кастомный сервис. Решил сразу же накрапать заметку. При выполнении команды: chkconfig service_name on или chkconfig -add service_name Выпадает вот такая ошибка: service service_name does not support chkconfig Для того что бы все-таки добавить нужный Вам сервис service_name...","categories": ["Linux server"],
        "tags": ["CentOS"],
        "url": "/service-does-not-support-chkconfig/",
        "teaser":null},{
        "title": "cPanel (WHM): Установка на чистый сервер",
        "excerpt":"Для начала хочу оговориться, что для установки любой панели управления рекомендуется использовать чистый сервер. В противном случае сервер может слететь после установки панели. Если у Вас имеется в наличии чистый сервер, тогда можете читать дальше. Если нет - найдите чистый сервер. С недавнего времмени лицензии WHM начали привязывать к ip...","categories": ["WHM/cPanel"],
        "tags": ["установка cpanel","установка whm"],
        "url": "/install-whm-cpanel/",
        "teaser":null},{
        "title": "Использование виртуальных пользователей в Vsftpd",
        "excerpt":"Эта заметка поведает о том, как создать виртуальных пользователей в vsftpd. Для начала сделаем резервную копию конфигурационного файла: cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.bak$(date +%m-%d-%Y) Теперь редактиреум /etc/vsftpd/vsftpd.conf. Вам нужно удостоваериться, что следующие директивы выставлены верно: chown_uploads=YES chown_username=apache guest_username=apache connect_from_port_20=YES dirmessage_enable=YES listen_ipv6=YES listen=NO local_umask=022 nopriv_user=apache syslog_enable=YES tcp_wrappers=YES userlist_enable=YES xferlog_enable=YES xferlog_std_format=YES anonymous_enable=NO local_enable=YES guest_enable=YES...","categories": ["FTP"],
        "tags": ["vsftpd"],
        "url": "/create-virtual-users-in-vsftpd/",
        "teaser":null},{
        "title": "Использование cPanel (WHM) для управления кластером",
        "excerpt":"WHM - неплохой инструмент управления сервером. Хоть он и платный, но разработчки постарались на славу. Довольно распространенным является установка WHM/cPanel на один сервер, который будет содержать и базы данных, и файлы сайтов, и учетные записи пользователей. Но что же делать, если у Вас есть несколько серверов и отдельный сервер для...","categories": ["WHM/cPanel"],
        "tags": ["cpanel кластер","WHM","whm кластер"],
        "url": "/whm-cpanel-for-clusters/",
        "teaser":null},{
        "title": "Debian clone или как сделать копию уже существующей установки Debian",
        "excerpt":"В общей сложности стало необходимо установить систему на два десятка компьютеров. Пришлось столкнуться с копированием уже готовой системы и причиной тому было несколько удобств, а именно: одна и таже система на всех компьютерах (их около 2-х десятков); та самая система уже настроена после установки/копирования. Как оказалось, для таких вещей (по...","categories": ["Linux server"],
        "tags": ["FromHabrSandbox"],
        "url": "/debian-clone-or-copy-existing-vm/",
        "teaser":null},{
        "title": "Добавляем в WordPress meta теги",
        "excerpt":"По умолчанию WordPress не выводит в коде страницы информации ометках, которые вы поставили посту. Согласно этой статье поддержка meta тегов была убрана из WordPress. Я не силен в SEO, но считается, что наличие meta тегов очень нравится поисковым роботам, что повышает рейтинг ресурса. Немного поковырявшись я все-таки добавл эту фичу...","categories": ["WordPress"],
        "tags": ["meta теги wordpress","meta теги worpdress без плагина"],
        "url": "/wordpress-meta-tags/",
        "teaser":null},{
        "title": "Настройка High Availability кластера с помощью Heartbeat на Centos",
        "excerpt":"В этой заметке хочу рассмотреть использование heatbeat на примере двух серверов. В даном примере у меня есть два сервера, на которых вертится mysql. Сайты устанавливают соединение с ip адресом 192.168.1.150. Я настрою hartbeat таким образом, что бы сетевой интерфейс с этим ip адресом поднимался на втором сервере, если первый выключается...","categories": ["CentOS","Clusters","Linux server"],
        "tags": ["heartbeat IPaddr","настройка heartbeat","настройка heartbeat centos"],
        "url": "/configure-heartbeat-centos/",
        "teaser":null},{
        "title": "Запрет удаления писем в Dovecot из почтового клиента",
        "excerpt":"Выдалась интересная задача. Нужно сделать так, чтобы даже если у пользователя стоит в почтовом ПО удалять письма с сервера — они все равно оставались на сервере — т.е не удалялись. Это относилось, как к входящим, так и к исходящим письмам. ПО: dovecot 2.2.13. Ставим dovecot через любой менеджер пакетов. OC:...","categories": ["Почта"],
        "tags": ["Dovecot","FromHabrSandbox"],
        "url": "/disallow-delete-emails-dovecot/",
        "teaser":null},{
        "title": "Проверка сервера на уязвимость bash shellshock",
        "excerpt":"Для того что бы узнать уязвим ли Ваш сервер перед shellshock выполните одну из следующих команд: curl https://shellshocker.net/shellshock_test.sh bash или curl /wp-content/uploads/2014/10/shellshock_test.sh bash В резудьтате получаем что-то такое: Для устранение проблемы нужно обновить bash. Для начала нужно узнать какая версия установлена. На основе этой статьи выполняем: rpm -qa grep bash...","categories": ["bash","Linux server","Безопасность"],
        "tags": [],
        "url": "/shellshock-test/",
        "teaser":null},{
        "title": "Виртуальные пользователи в Pure-Ftp",
        "excerpt":"Хочу рассмотреть вариант использования виртуальных пользователей в pure-ftpd. Предполагаю, что Pure-Ftp у Вас установлен. Если же нет выполните следующую команду: apt-get install pure-ftpd-common pure-ftpd или yum install pure-ftpd Нужно подредактировать конфигурационный файл (/etc/pure-ftpd/pure-ftpd.conf) и удостовериться, что следующие параметры не закоментированы и выставлены должным образом: ChrootEveryone yes PureDB /etc/pure-ftpd/pureftpd.pdb PAMAuthentication yes...","categories": ["FTP"],
        "tags": ["Pure-Ftp"],
        "url": "/pure-ftpd-virtual-users/",
        "teaser":null},{
        "title": "WHM(cPanel): Failed to create the account",
        "excerpt":"Если при использовании WHM(cPanel) Transfer tool Вы получаете следующее сообщение об ошибке: Account Failed to create the account: This system already has a database owner named “xxxxx”. Removing copied archive “/home/cpmove-aroundph.tar.gz.part00001” from the local server … Failed: Account Restore Failed: “Account failure: Failed to create the account: This system already...","categories": ["WHM/cPanel"],
        "tags": [],
        "url": "/cpanel-failed-to-create-the-account/",
        "teaser":null},{
        "title": "WHM (cPanel): Как убить зависший transfer",
        "excerpt":"Пришло мне сегодня переносить учетные записи между серверами. Естественно использовал WHM Transfer tool. Один из батчей залип в процесе работы. К сожалению кнопки terminate не предусмотрено разработчиками. Итак, что же делать в таком случае? В окне активного трансфера есть запись: You may close this window and view the transfer on...","categories": ["WHM/cPanel"],
        "tags": ["cpanel","transfer tool","WHM"],
        "url": "/whm-cpanel-kill-transfer/",
        "teaser":null},{
        "title": "Mcrypt на WHM/cPanel",
        "excerpt":"Для того чтобы включить поддержку mcrypt в WHM нужно воспользоваться модулем EasyApache. Он доступен в разделе Software: Жмем шестеренку в колонке Actions и настраиваем профиль, который использовался для последнего билда: В принципе на всех экранах можно жать кнопку Next Step, если кроме mcrypt никаких изменений не нужно. На странице Short...","categories": ["WHM/cPanel"],
        "tags": ["EasyApache","mcrypt cpanel","Mcrypt whm"],
        "url": "/mcrypt-on-whm-cpanel/",
        "teaser":null},{
        "title": "Backup to Dropbox: Backup сайта с заливкой в DropBox",
        "excerpt":"Задался на днях мыслью о корректном backup’е нескольких WordPress сайтов с последующей заливкой их на какой-то бесплатное хранилище. Как всегда хотелось что бы это выполнялось без дополнительных плагинов. Выбор хранилища пал на Dropbox. По умолчанию Вам предоставляется 2Gb места в рамках бесплатной учетной записи. Если нужно больше места - его...","categories": ["Linux server"],
        "tags": ["backup","Backup to Dropbox"],
        "url": "/backup-website-with-upload-to-dropbox/",
        "teaser":null},{
        "title": "Mysql-Proxy: Установка и настройка на CentOS7",
        "excerpt":"Балансировка mysql запросов - важная вещь, если мы используете несколько mysql серверов. Если у Вас настроена master-slave репликация баз даных, то есть смысл распределить нагрузку на несколько серверов. Отправлять update, insert запросы на master сервер, а select запросы распределять между двумя, тремя и более серверами. Для этого можно воспользоваться утилитой...","categories": ["Linux server"],
        "tags": ["mysql-proxy","Балансировка нагрузки"],
        "url": "/mysql-proxy-intall-configure-in-centos7/",
        "teaser":null},{
        "title": "Что такое LVM и с чем его едят",
        "excerpt":"LVM - logical volume manager или мэнэджер логических дисков. С его помощью можно объединить несколько физических дисков в один логический и оперировать новым девайсом как единым диском. Примерно выглядит вот так: Для того что бы создать volume groupe на существующих дисках незамонтированных в корень файловой системы нужно из сначала обнулить:...","categories": ["Linux server"],
        "tags": ["logical volume manager","logical volume создать","lvm создать","volume group добавить диск","volume group создать"],
        "url": "/lvm-configuration-ad-volumes-management/",
        "teaser":null},{
        "title": "Установка Solr + Tomcat6 на CentOS",
        "excerpt":"Solr не нуждается в tomcat’е для работы. Можно использовать встроенный функционал для запуска его на порту 8983. Если же Вам нужно, что бы Solr работал как апликуха в томкате - читайте дальше. Для начала нужно установить tomcat и java: yum install tomcat6 java-1.7.0-openjdk wget Поставим Tomcat на автозагрузку: chkconfig tomcat6...","categories": ["CentOS","Linux server","Tomcat"],
        "tags": ["solr tomcat","установка solr"],
        "url": "/install-solr-tomcat-centos/",
        "teaser":null},{
        "title": "Подключение репозиториев Epel, Remi, Atrpms в RHEL/CentOS",
        "excerpt":"Ни для кого не секрет, что CentOS и другие ему подобрные RedHat системы идут со стандартным набором репозитариев. К сожалению многи необходимы пакеты в них отсутствуют. Распространенной практикой является подключение дополнительных хранилищ софтины, таких как Epel, Remi, Atrpms. Epel (Extra Packages for Enterprise Linux): RHEL/CentOS 7 64-Bit: rpm -ivh http://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-7-11.noarch.rpm...","categories": ["CentOS"],
        "tags": ["atrpms","epel","remi","rpmforge"],
        "url": "/epel-remi-atrpms-rhel-centos/",
        "teaser":null},{
        "title": "Краткий обзор возможностей HaProxy",
        "excerpt":"HaProxy - чудодивный и очень гибкий инструмент для балансировки трафика. Имеет целую кучу опций и вариантов настройки, а также имеет свои причуды. Мне будет очень тяжело изложить содержание всех моих черновиков на эту тему в рамках этой статьи, поскольку она получится большой и тяжелой для усваивания, но я постараюсь дать...","categories": ["Clusters","Балансировка нагрузки"],
        "tags": ["HaProxy"],
        "url": "/haproxy-configuration-overview/",
        "teaser":null},{
        "title": "Как в PHP подключиться по ssh к серверу",
        "excerpt":"Оставлю небошьшую заметку о том, как можно подключиться к удаленному серверу в php, вызвать команду и отобразить результаты на экране. В приведенном примере используется авторизация с помощью приватного ключа: function ssh_exec($ip, $command) { $connection = ssh2_connect($ip, 22); if (ssh2_auth_pubkey_file($connection, 'remote_user', '/home/remote_user/.ssh/id_rsa.pub', '/home/remote_user/.ssh/id_rsa')) { $stream = ssh2_exec($connection, $command); stream_set_blocking($stream, true); $stream_out...","categories": ["PHP"],
        "tags": ["ssh php"],
        "url": "/connect-to-server-shell-from-php/",
        "teaser":null},{
        "title": "Шпаргалка по T-SQL - Часть 1",
        "excerpt":"В этой статье я предоставлен базовый набор t-sql скриптов, предоставляющих информацию о метаданных MSSQL. Если вы когда-нибудь пытались получить часть этой информации, с помощью GUI, я думаю вы будете приятно удивлены количеством той информации, которую можно получить мнгновенно. Изучаем сервера Начнём с запросов, предоставляющих информацию о ваших серверах. Имена сервера...","categories": ["SQL Server"],
        "tags": ["t-sql","MSSQL"],
        "url": "/use-t-sql-for-mssql-part1/",
        "teaser":null},{
        "title": "Смена движка для MySQL таблиц с MyISAM на InnoDB",
        "excerpt":"Смена движка для MySQL таблиц с MyIsam на InnoDB происходит в два этапа: Создаем запрос на основе существующих данных Выполняем новый запрос. В консоли mysql выполнять эти шаги не удобно, поскольку результаты Вы получите строки с пайпами (символ | ) в начале и конце строки. Для баз данных с 100+...","categories": ["MySQL"],
        "tags": [],
        "url": "/change-myisam-to-innodb/",
        "teaser":null},{
        "title": "Примеры настройки HaProxy",
        "excerpt":"В догонку за первой статьей в этой я хочу рассмотреть несколько примеров настройки HaProxy для балансировки трафика. Вся конфигурация HaProxy хранится в файле /etc/haproxy/haproxy.cfg Стандартный конфиг имеет несколько примеров описания backend, frontend и listen секций. Также он содержит секцию **Global**, в которой описаны опции, которые являются глобальными. Опять же все...","categories": ["HaProxy"],
        "tags": ["Балансировка нагрузки"],
        "url": "/haproxy-configuration-examples/",
        "teaser":null},{
        "title": "Как настроить лог для HaProxy",
        "excerpt":"Для того, что бы включить логирование HaProxy отредактируйте /etc/sysconfig/rsyslog - приведите едиственную строку к следующему виду: SYSLOGD_OPTIONS=\"-c 2 -r\" По факту, нужно добавить ключ -r в опции демона rsyslog что бы разрешить ему принимать события на ip сокете. Дальше редактируем файл /etc/rsyslog.conf: Сначала нраскоментируем следующие строки: # Provides UDP syslog...","categories": ["HaProxy"],
        "tags": ["логирование HaProxy"],
        "url": "/haproxy-configure-logs/",
        "teaser":null},{
        "title": "Страница статистики HaProxy",
        "excerpt":"HaProxy предоставляет удобный инструмент отображения статистики в реальном времени. Для коректного отображения статистики рекомендуется создать отдельный listen и повесить его на отдельный порт в режиме http: listen stats *:8080 mode http stats enable stats realm LoadBalancer_statistics stats scope http-web stats scope https-web stats scope http-app stats scope mysql-proxy stats auth...","categories": ["HaProxy"],
        "tags": ["HaProxy","haproxy stats"],
        "url": "/haproxy-stats-page/",
        "teaser":null},{
        "title": "Конвертируем Outlook pst в формат Thunderbird",
        "excerpt":"Если Вы решились переехать с Windows на Linux и столкнулись с проблемой импорта почты с Outlook в Thunderbird, прошу читать дальше. Следующий скрипт поможет импотрировать письма. ############################################################################################### ###### This script will help to convert the Microsoft outlook PST file ########## ###### into Thunderbird/Evolution compatible format ########## ###### Script created by...","categories": ["Ubuntu Linux"],
        "tags": ["pst в Thunderbird"],
        "url": "/convert-outlook-pst-into-thunderbird/",
        "teaser":null},{
        "title": "Настройка репликации с помощью lsync",
        "excerpt":"Для репликации даных между серверам ине всегда есть смысл пользоваться функционалом NFS. Если Вам нужно что бы на нескольких серверах было одинаковое содержимое двух каталогов, тогда можно воспользоваться lsync. Я рассмотрю репликацию файлов на примере папок DNS сервера Bind. Нужно что бы первый/главный сервер мог соединяться со вторым/зависмым сервером без...","categories": ["Linux server"],
        "tags": ["CentOS","lsync"],
        "url": "/lsync-to-replicate-data/",
        "teaser":null},{
        "title": "FFmpeg с поддержкой libaacplus и fdk-aac на CentOS",
        "excerpt":"В ходе работы над проэктом для одного из клиента появилась необходимость расширить функционал ffmpeg и добавить в него пару плюшек, которых в нем нету из коробки. Нужно было включить дополнительные кодэки aac. В папке пользователя root я создал папку src и в ней делал всю магию. mkdir /root/src &amp;&amp; cd...","categories": ["Linux server"],
        "tags": ["CentOS","FFmpeg","libaacplus"],
        "url": "/ffmpeg-with-libaacplus-fdk-aac/",
        "teaser":null},{
        "title": "Статистика для Upstream NginX",
        "excerpt":"При использовании NginX в качестве балансировщика нагрузки появляется вопрос о корректном ведении статистики доставки трафика к серверам из секции Upstream. К сожалению у Nginx нету встроенного функционала на манер HaProxy. Также этот функционал нельзя добавить путем установки дополнительного модуля с помощью yum или apt-get. Для того что бы в NginX...","categories": ["Nginx"],
        "tags": ["Балансировка нагрузки"],
        "url": "/upstream-nginx-stats-page/",
        "teaser":null},{
        "title": "Добавить блок рекламы Adsense WordPress (Sidebar)",
        "excerpt":"Adsense является, пожалуй, одним из самых распространенных сервисов контекстной рекламы. Для CMS WordPress существует целый набор плагинов для установки кода рекламы. В этой статье приведу пример самого простого и быстрого способа установки рекламного кода Adsense в сайдбар (sidebar) вашего блога без использования дополнительных плагинов. Для этого не потребуется никаких плагинов....","categories": ["WordPress"],
        "tags": ["Adsense"],
        "url": "/adsense-in-wordpress-sidebar/",
        "teaser":null},{
        "title": "IpTables NAT в 3 шагa",
        "excerpt":"NAT - Network address translation или преобразование (трансляция) сетевых адресов, это хорошая фича любого фаервола, позволяющий преобразовывать IP-адреса транзитных пакетов. Рассмотрю пример проброса трафика с одного VPN соединения в другое. VPN1: tap0 VPN2: ppp0 никакой привязки в ip адресам Для начала разрешаем перенаправление ipадресов: echo 1 &gt; /proc/sys/net/ipv4/ip_forward Создаем правила...","categories": ["Linux server"],
        "tags": ["iptables"],
        "url": "/iptables-nat-3-steps/",
        "teaser":null},{
        "title": "Perl Dancer + mysql + memcached",
        "excerpt":"Наверняка, подавляющее большинство программистов на Perl слышали о замечательном микро-фрэймворке Perl Dancer. Но использовали ли они его дальше, чем просто сгенерить проект, написать роут с ‘Hello world’ и запустить его? А, тем временем, этот вэб-фреймворк вполне функционален и быстр. Сессии, база данных, кэширование, отправка почты, маршруты, макет и шаблоны —...","categories": ["Perl"],
        "tags": ["FromHabrSandbox","Perl Dancer"],
        "url": "/perl-dancer-mysql-memcached/",
        "teaser":null},{
        "title": "Как добавить AdSense в WordPress - functions.php",
        "excerpt":"В догонку за первой статьей предлагаю Вашему вниманию альтернативный вариант, как еще можно добавить AdSense в WordPress без использования плагинов Этот подход подразумевает создание функции, которая в свою очередь будет возвращать рекламный код в нужном месте. Преимущества этого метода: рекламу можно будет вставлять в статьи используя short-тэг функцию можно вызывать...","categories": ["WordPress"],
        "tags": ["adsense wordpress","без плагинов"],
        "url": "/plugin-free-adsense-in-wordpress-part-2/",
        "teaser":null},{
        "title": "Adsense в динамической боковой панели WordPress",
        "excerpt":"Блок контекстной рекламы Adsense у меня довольно давно находится в боковой панели. Не так давно до меня дошло, что панель имеет динамический размер (22% от тела страницы) и в зависимости от расширения экрана (и размера окна браузера) блок рекламы 250х250 px немного портит внешний вид страницы. Закономерно нарисовалась задачка: Как...","categories": ["WordPress"],
        "tags": ["Adsense"],
        "url": "/adsense-in-dinamic-sidebar-wordpress/",
        "teaser":null},{
        "title": "Шпаргалка по T-SQL - Часть 2",
        "excerpt":"В продолжение первой части: Углубляемся в модель данных Ранее, мы использовали скрипты, которые дали нам представление о «верхнем уровне» объектов, составляющих нашу базу данных. Столбцы Следующий скрипт описывает таблицы и столбцы из всей базы данных. SELECT @@Servername AS Server , DB_NAME() AS DBName , isc.Table_Name AS TableName , isc.Table_Schema AS...","categories": ["MSSQL Server"],
        "tags": ["FromHabrSandbox","tsql"],
        "url": "/use-t-sql-for-mssql-part2/",
        "teaser":null},{
        "title": "Настройка Linux сервера для WordPress/Drupal/Joomla",
        "excerpt":"Эта статья - реальное пособие как настроить сервер для максимальной производительности при работе с одной из блоговых CMS систем WordPress, Drupal или Joomla. Буду рассматривать настройку сервера на базе Linux Ubuntu. Нам понадобятся Nginx, PHP, MySQL и Varnish. 1. MySQL Начну с конца. Меня вполне устраивают стандартные настройки MySQL, поэтому...","categories": ["Linux_server"],
        "tags": ["mysql","nginx","php","varnish","drupal","joomla","wordpress"],
        "url": "/configure-linux-server-wordpress-drupal-joomla/",
        "teaser":null},{
        "title": "Отображение размера баз даных в MySQL",
        "excerpt":"Для того что бы узнать размер баз даных, воспользуйтесь следующим запросом: SELECT table_schema \"Data Base Name\", sum( data_length + index_length ) / 1024 / 1024 \"Data Base Size in MB\", sum( data_free )/ 1024 / 1024 \"Free Space in MB\" FROM information_schema.TABLES GROUP BY table_schema ; Отображение размер таблиц в...","categories": ["MySQL"],
        "tags": [],
        "url": "/mysql-database-size/",
        "teaser":null},{
        "title": "Статистика по дням в AwStats",
        "excerpt":"AwStats - парсер лог файлов, написанный на perl, с помощью которого можно вести статистику посещений сайта на основе информации из лог файлов. Как правило awstats отображает общую информаци за неделю, месяц. Но что же делать, если нужно отображать информацию о посещении сайта за конкретный день. О подобном трюке дальше и...","categories": ["Apache"],
        "tags": ["awstats"],
        "url": "/daily-stats-awstats/",
        "teaser":null},{
        "title": "Настройка ETags в IIS7",
        "excerpt":"Entity tags (ETags) - это механизм, с помощью которого web сервера и браузеры определяют соответствует ли эллемент в кэше браузера объекту на сервере. Поскольку ETags, как правило, построены с использованием атрибутов, которые делают их уникальными для конкретного сервера, на котором размещается сайт, теги не будут совпадать, когда браузер получает оригинальный...","categories": ["IIS"],
        "tags": ["etags","iis","web.config"],
        "url": "/configure-etags-iis7/",
        "teaser":null},{
        "title": "Шпаргалка по sed",
        "excerpt":"Sed является потоковым редактором в UNIX-подобных операционных системах, которий используется для фильтрации и преобразования текста. Sed можно использовать как для редактирования файлов, так и стандартного вывода програм/операций в stdout. Стандарнтный синтаксис: sed [опции] команды [имя файла] Ниже приведены примеры использования sed в различных ситуациях. Замена слова (root на Admin): sed...","categories": ["bash"],
        "tags": ["sed"],
        "url": "/sed-examples/",
        "teaser":null},{
        "title": "Индэкс в таблицах MySQL",
        "excerpt":"Для того что бы создать уникальный индэкс для таблицы MySQL, выпоните следующую команду: ALTER IGNORE TABLE `имя_таблицы` ADD UNIQUE INDEX (`имя_колонки`); Для того что бы удалить дублирующиеся записи в таблице: DELETE FROM имя_таблицы WHERE id IN (SELECT * FROM (SELECT id FROM имя_таблицы GROUP BY имя_колонки HAVING (COUNT(*) &gt; 1)...","categories": ["MySQL"],
        "tags": ["mysql","индэкс"],
        "url": "/mysql-tables-uniq-index/",
        "teaser":null},{
        "title": "Непонятные страницы входа в Yandex.Metrika",
        "excerpt":"Не так давно появились у меня в Yandex.Metrika непонятные страници входа. Были переходы с erot.co, lumbia.co, ilovevitaly.ru и т.д. В резальтате недолгих поисков была найдена тема на форуме searchengines.guru о том, что я не один такой. Оказалось, что благодаря таким людям я, и многие другие пользователи начали получать рэфспам в...","categories": ["Безопасность"],
        "tags": ["refspam yandex metrika","непонятные переходы в Yandex метрике","Непонятные страницы входа в Yandex Метрике"],
        "url": "/refspam-in-yandex-metrika/",
        "teaser":null},{
        "title": "Как установить Java JRE на Linux Ubuntu",
        "excerpt":"Дальше речь пойдет о том, как установить самую последнюю версию Java JRE на Linux Ubuntu. Для начала переходим по следующей ссылке: http://www.oracle.com/technetwork/java/javase/downloads/index.html принимаем условия лицензионного соглашения и скачиваем архив с Java JRE: Создадим папку для Java и распакуем в нее содержимое архива: sudo mkdir -p /usr/local/java У меня архив сохранился...","categories": ["Ubuntu Linux"],
        "tags": ["java jre","установка java ubuntu"],
        "url": "/install-java-jre-linux-ubuntu/",
        "teaser":null},{
        "title": "Установка Mysql-Proxy на RedHat 6.4",
        "excerpt":"Вот такой он Linux. При работе с CentOS я не столкнулся с проблемами при установке Mysql-Proxy. В случае с RedHad 6.4 этот подход не сработал. Поэтому вторая версия того, как можно установить mysql-proxy. Для начала скачиваем нужну версию: wget http://dev.mysql.com/get/Downloads/MySQL-Proxy/mysql-proxy-0.8.5-linux-el6-x86-64bit.tar.gz Распаковываем её: tar xf mysql-proxy-0.8.5-linux-el6-x86-64bit.tar.gz Перемещаем в папку opt^ mv...","categories": ["Linux server"],
        "tags": ["mysql-proxy","Балансировка нагрузки"],
        "url": "/install-mysql-proxy-redhat-6-4/",
        "teaser":null},{
        "title": "Получаем IP-адреса HTTPS-клиентов с HAProxy (frontend) на Nginx (backend) в режимах HTTP и TCP-балансировки",
        "excerpt":"Предисловие Я просто не мог пройти мимо этой статьи на habrahabr.ru Содержание Довольно часто требуется балансировать нагрузку между несколькими веб-серверами. При этом, как правило, необходимо, чтобы веб-приложения получали реальные IP-адреса клиентов, а не IP балансировщика. В случае балансировки и терминации HTTP(S)-трафика на HAProxy (Layer 7 [1]), данная задача легко решается...","categories": ["Nginx","HaProxy"],
        "tags": ["Балансировка нагрузки","FromHabrSandbox"],
        "url": "/%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B0%D0%B5%D0%BC-ip-%D0%B0%D0%B4%D1%80%D0%B5%D1%81%D0%B0-https-%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D1%81-haproxy-frontend-%D0%BD%D0%B0-nginx-backend/",
        "teaser":null},{
        "title": "Создание дочерней темы в WordPress",
        "excerpt":"Вдохновленный статьей на хабре, решил создать свою версию про создание дочерней темы в WordPress, поскольку на хабре много текста и объяснений. Я, как человек не считающий себя большим профи в програмировании на WordPress, постараюсь рассказать все коротко и по сути. Если вы второй раз смотрите на WordPress и третий раз...","categories": ["WordPress"],
        "tags": ["Дочерние темы в WordPress"],
        "url": "/wordpress-child-themes/",
        "teaser":null},{
        "title": "Математика в BASH с помощью bc",
        "excerpt":"bc - это язык, который поддерживает числа произвольной точности с интерактивным исполнения отчетности. Безусловно, bc - один из аутсайдеров, когда дело доходит до расчетов по командной строке. Главным достоинством bc является обработка чисел с запятой (float). В среде bash можно проводить обычные операции (сложение, вычитание, деление и умножение) с целыми...","categories": ["bash"],
        "tags": ["bash","Алгебраические функции bc","возведения в степень bc","Использование bc","Округление bc","Тригонометри́ческие функции bc"],
        "url": "/use-bc-in-bash-calculations/",
        "teaser":null},{
        "title": "Ошибка верификации сертификата в Lftp",
        "excerpt":"Сегодня столкнулся с таким сообщением при обычной работе с lftp: ls: Fatal error: Certificate verification: Not trusted Устраняется она на скорую руку так: запускаем консоль lftp: lftp Отключаем верификацию сертификатов: set ssl:verify-certificate no Подключаемся к серверу: open user@ip_address Для того, что бы закрепить пройденый материал и больше к нему не...","categories": ["FTP"],
        "tags": [],
        "url": "/lftp-certificate-verification-error/",
        "teaser":null},{
        "title": "Как получить/изменить пароль админа в Plesk из командной строки",
        "excerpt":"В случае использования панели Plesk admin и root - разные пользователи, и их пароли могут отличаться. Тоесть вы можете иметь ssh доступ к серверу используя учетную запись root, но в саму панель попасть нельзя. Есть два варианта как узнать пароль админа: 1. Файл .psa.shadow. Выполните следующую команду в консоли: cat...","categories": ["Plesk"],
        "tags": ["plesk admin","пароль админа plesk"],
        "url": "/reset-admin-password-plesk/",
        "teaser":null},{
        "title": "Bash: Как посчитать количество вхождений символа в строке",
        "excerpt":"Для того что бы в bash скрипте посчитать количество вхождений символа (баквы, цифры, знака) в строке можно воспользоваться функционалом grep и wc: grep -o `/` &lt;&lt;&lt; $string |wc -l В этом примере $string - произвольная строка / - разделитель Очень удобно использовать этот симбиоз, если Вам нужно обработать список, который...","categories": ["bash"],
        "tags": [],
        "url": "/bash-count-occurrences-of-char-in-string/",
        "teaser":null},{
        "title": "Простые и легкие вкладки на jQuery",
        "excerpt":"Хабрапользователя Лжедмитрия не устроили найденые в интернете варианты горизонтальных текстовых вкладок. Как результат, в течении 15 минут родился несложный jQuery плагин, удовлетворяющий его запросам. Он решил поделиться, а я решил, что для истории будет полезно сохранить - авось где применю. Количество вкладок не ограничено, так же я попытался сделать структуру...","categories": ["jQuery"],
        "tags": ["FromHabrSandbox","вкладки на jQuery"],
        "url": "/tabs-with-jquery/",
        "teaser":null},{
        "title": "Знакомство с Django",
        "excerpt":"Django - это web фрэймвор написанный на Python, который предоставляет базовый набор компонентов для создания сайта. В этой статье речь пойдет именно о нем. Я рассмотрю настройку сервера, установку Django и создание первого сайта с импользованием этого фрэймворка. Рассматривать буду на примере Centos 6.5. 1. Python Для начала убедимся, что...","categories": ["Other CMS"],
        "tags": ["Django"],
        "url": "/meet-django/",
        "teaser":null},{
        "title": "Устранение ошибок MODX Revolution на php v.5.4.13",
        "excerpt":"В ходе развертывания MODX Revolution на сервере с php v.5.4.13 столкнулся с неработающей админкой и поиском. В логе апача обнаружил следующую ошибку: PHP Fatal error: Call to a member function setCacheable() on a non-object in core/cache/includes/elements/modsnippet/31.include.cache.php on line 31 Поиски в тырнетах не дали результата. Все советуют переустановить ModX, очистить...","categories": ["Other CMS"],
        "tags": ["ModX"],
        "url": "/fix-modx-php-5-4-13/",
        "teaser":null},{
        "title": "Установка последней верисии Python на Centos 6.5",
        "excerpt":"Последней версией Python на сегодняшний день является 3.4.2. Для установки последней верси python нужно сначала установить нужные пакеты: yum install wget gcc openssl-devel httpd sqlite-devel mysql-devel -y Теперь можно скачать и установить сам python: wget https://www.python.org/ftp/python/3.4.2/Python-3.4.2.tgz tar -xf Python-3.4.2.tgz cd Python-3.4.2 ./configure -enable-shared make make altinstall Все ОК, если в...","categories": ["Linux server"],
        "tags": ["Centos"],
        "url": "/install-python-centos6-5/",
        "teaser":null},{
        "title": "Устанавливаем PostgreSQL 9.4 на Centos 6.5",
        "excerpt":"Статья повествует о том, как установить PostgreSQL 9.4 на Centos 6.5. Для начала редактируем файл /etc/yum.repos.d/CentOS-Base.repo и добавляем следующую строку в секции [base] и [updates] exclude=postgresql* Включаем дополнительный репозиторий: yum localinstall http://yum.postgresql.org/9.4/redhat/rhel-6-x86_64/pgdg-centos94-9.4-1.noarch.rpm -y Ставим PostgreSQL: yum install postgresql94-server postgresql94-contrib postgresql-devel -y После завершения установки - добавляем в автозапуск и стартуем:...","categories": ["Linux server"],
        "tags": ["CentOS","PostgreSQL"],
        "url": "/postgresql-9-4-on-centos-6-5/",
        "teaser":null},{
        "title": "Установка pecl на CentOS 6.5",
        "excerpt":"PECL - это хранилище расширений PHP. Он обеспечивает доступ к каталогу всех известных расширений, а также средства для загрузки и установки расширений PHP. В стандартных репозиториях он отсутсвует. Для начала подключите Epel Как ни странно, но pecl поставляется в пакете php-pear. Для работы ему требуется утилита phpize, которая поставляется в...","categories": ["Linux server"],
        "tags": ["CentOS"],
        "url": "/install-pecl-centos-6-5/",
        "teaser":null},{
        "title": "Настройка Apache для работы с Python 3.4 в CentOS 6.5",
        "excerpt":"Для установки последей версии Python 3.4 на CentOS 6.5 можно воспользоваться предыдущей статьей. Для работы с python 3.4 вэб сервер apache требует модуль wsgi. Если у Вас в системе имеется два питона (2.7 и 3.4), тогда этот модуль нужно собрать из исходинков. Я предполагаю, что для работы сайта нужна именно...","categories": ["Apache"],
        "tags": ["wscgi"],
        "url": "/configure-apache-wscgi-for-python3-4-centos-6-5/",
        "teaser":null},{
        "title": "Mysql-Proxy: Error while loading shared libraries",
        "excerpt":"Если Вы читаете эту заметку - значит Вы использовали произвольный мануал по установке mysql-proxy. Если бы Вы воспользовались этим или этим руководством, то все работало бы как часы. Необходимые библиотеки не слинкованы, если Вы видите одну из следующих ошибок: mysql-proxy: error while loading shared libraries: libmysql-chassis.so.0: cannot open shared object...","categories": ["Linux server"],
        "tags": ["mysql-proxy","Балансировка нагрузки"],
        "url": "/mysql-proxy-error-while-loading-shared-libraries/",
        "teaser":null},{
        "title": "Включаем поддержку геоданных в Apache или mod_geoip из исходников",
        "excerpt":"В ходе работы с WHM сервером столкнулся со следующей проблемой при установке mod_geoip: mod_geoip-1.2.7-1.el5.x86_64 from epel has depsolving problems --&gt; Missing Dependency: httpd-mmn = 20051115 is needed by package mod_geoip-1.2.7-1.el5.x86_64 (epel) You could try using --skip-broken to work around the problem You could try running: package-cleanup --problems package-cleanup --dupes rpm...","categories": ["Apache","WHM/cPanel"],
        "tags": ["geoip_module","mod_geoip"],
        "url": "/mod_geoip-from-sources-apache/",
        "teaser":null},{
        "title": "Восстановление пароля пользователя root в linux",
        "excerpt":"Всякое в жизни случается, и пароли rootа теряются. Что же делать, если нужно попасть в систему, а пароль пользователя утерян? Собственно вопрос: как восстановить пароль root в linux? В первую очередь не паниковать, а искать LiveCD установленной системы. В случае с сервером на хостинге, нужно в панели администрирования искать пункт...","categories": ["Linux server"],
        "tags": ["root"],
        "url": "/restore-root-password-linux/",
        "teaser":null},{
        "title": "Сканирование сервера с помощью Chkrootkit",
        "excerpt":"Руткит (rootkit) - это скрытый тип программного обеспечения, как правило, который позволяет скрыть существование определенных процессов или программ от обычных методов обнаружения или разрешить удаленный доступ к компьютеру. Chkrootkit предоставляет набор утиллит для сканирования и выявления руткитов на сервере. Устанавливается Chkrootkit из репозиториев програмного опебспечения. В случае с RedHat/CentOS нужно...","categories": ["Linux server","Безопасность"],
        "tags": [],
        "url": "/scan-linux-server-with-chrootkit/",
        "teaser":null},{
        "title": "Использование ClamAV (clamscan) на Linux сервере",
        "excerpt":"ClamAV - это антивирус с открытым исходным кодом, который позволяет убнаруживать трояны, руткиты и прочую гадость. Clamscan - модуль сканивания. Устанавливается из репозиториев програмного опебспечения. В случае с RedHat/CentOS нужно подключить Epel. yum install clamav clamavclamav-update clamav-scanner История релизов доступна по адресу http://pkgs.repoforge.org/clamav/ После установки нужно его обновить: freshclam У...","categories": ["Linux server","Безопасность"],
        "tags": [],
        "url": "/use-clamav-clamscan-to-scan-linux-server/",
        "teaser":null},{
        "title": "PHP: Вывод результатов bash команды построчно в браузере",
        "excerpt":"Для того что бы в коде php дернуть какую-то bash команду и вывести результаты, можно воспользоваться shell_exec(), но что делать если нужно видеть в реальном времени весь вывод по мере выполнения скрипта. На днях задался вопросом, как выполнить скрипт или команду на linux сервере, которая генерирует много сообщений и наблюдать...","categories": ["PHP"],
        "tags": [],
        "url": "/php-output-realtime-bash-results/",
        "teaser":null},{
        "title": "Работа с отказоустойчивыми NFS серверами",
        "excerpt":"Значит понадобилось мне рассмотреть варианты работы 2-х серверов, с которых одна папка монтировалась с использованием NFS на несколько других серверов. Тоесть имеется 3 web сервера и 1 app сервер на котором лежат файлы. Между web серверами и app сервером настоен шаринг папки /var/www по средствам NFS. Статья о том, как...","categories": ["Linux server"],
        "tags": ["NFS"],
        "url": "/nfs-failover/",
        "teaser":null},{
        "title": "FireWall в CentOS7",
        "excerpt":"В CentOS7 обычные правила фаервола iptables больше нельзя редактировать привычным способом. Сам iptables остался, но стал обернут в firewalld. Для разрешения трафика используется утилита firewall-cmd Можно воспользоваться утилитой firewall-cmd для добавления правил, на пример: firewall-cmd -zone=public -add-port=http/tcp firewall-cmd -zone=public -add-port=http/tcp -permanent Вторая команда нужна для того что бы правило применялось...","categories": ["Linux server"],
        "tags": ["firewall-cmd"],
        "url": "/firewall-cmd-in-centos7/",
        "teaser":null},{
        "title": "Использование expect  в bash скриптах",
        "excerpt":"Expect - это оболочка предоставляющая возможность програмировать диалог с интерактивными програмами. Под интерактивными програмами подразумеваются приложения, которые требуют ввода дополнительной информации в ходе работы. Тяжело объяснить без примера. О примерах использвания expect дальше и пойдет речь. Планируется сборная статья, которая будет пополнятся разнообразными примерами использования expect. Есть два варианта, по...","categories": ["bash"],
        "tags": ["expect"],
        "url": "/use-expect-in-bash/",
        "teaser":null},{
        "title": "Размышления о кластеризации: Часть 4 - Нужно больше WEB&#8217;a",
        "excerpt":"После продолжительного затишья решил продолжить повествование о разветвлении серверной линейки. Фраза получилась невнятной. По ходу дела она обретет смысл. В предыдущих статьях о рассмотрел варианты конфигурации отдельных серевров для баз данных, сервера для раздичи статики и сервера для кеширования. Предыдущие статьи: Размышления о кластеризации: Часть 1 Размышления о кластеризации: Часть...","categories": ["Clusters"],
        "tags": ["горизонтальное скалирование кластера"],
        "url": "/notes-about-clusters-part4/",
        "teaser":null},{
        "title": "Автоматическая настройка сайтов в NginX",
        "excerpt":"Простая жизнь простых сайтов на сервере с NginX. После того как apache отказался запускаться 1000+ сайтов, было решено переключиться на nginx и проделать с ним подобное. Условия те же: клиенту было предложено заливать сайты на сервер по фтп называть папки полными именами сайтов. Со стороны сервера был настроен pure-ftpd с...","categories": ["bash"],
        "tags": [],
        "url": "/auto-configure-webhosts-nginx/",
        "teaser":null},{
        "title": "Автоматическая настройка сайтов в Apache",
        "excerpt":"Простая жизнь простых сайтов на сервере с Apache. Пришлось мне недлать клеинту сервер на котором размещается 1000+ маленькх сайтов. Сайт представляет собой маленькую html страницу с iframe, но нужно автоматизировать процесс настройки виртуальных хостов в Apache. Клиенту было предложено заливать сайты на сервер по фтп называть папки полными именами сайтов....","categories": ["bash"],
        "tags": [],
        "url": "/auto-configure-webhosts-apache/",
        "teaser":null},{
        "title": "Mysqldump средствами php",
        "excerpt":"Я неоднократно сталкивался с ситуацией, когда нужно стянуть образ большой базы с хостинга, но к движку mysql нету удаленного доступа. PhpMyAdmin может не справиться с этим заданием, если размер базы составляет несколько сотен мегабайт. Как же быть? Можно получить образ базы средствами php, без shell_exec. Тоесть сам бинарник mysqldump не...","categories": ["MySQL","PHP"],
        "tags": ["mysqldump"],
        "url": "/mysqldump-with-php/",
        "teaser":null},{
        "title": "Автоматическое развертывание Yii в Docker контейнере",
        "excerpt":"Вот и у меня дошли руки до этой софтварины. Разработчики нормально так развернули идею контейнеров, которые уже 100 лет работают в виде OpenVZ и/или Parallels Virtuozzo. Но не могу не согласиться - отправить doсker контейнер с дэмо-сайтом клиенту на много легче, чем контейнер OpenVZ/Virtuozzo. Дальше буду рассказывать что я делал...","categories": ["Docker"],
        "tags": ["Yii"],
        "url": "/auto-configure-yii-in-docker/",
        "teaser":null},{
        "title": "Импорт записей с WordPress в Yii",
        "excerpt":"На волне предыдущей статьи решил поиграться с Yii и попробовать портировать этот сайт со всеми статьями и страницами на Yii. Итак имеем MySQL сервер с двумя базами: wordpress yii Задача: перенести все статьи из базы WordPress в базу Yii. Выполняется с помощью следующего запроса: insert into yii.article (id, title, body,...","categories": ["WordPress"],
        "tags": ["wordpress","yii"],
        "url": "/migrate-posts-from-wordpress-to-yii/",
        "teaser":null},{
        "title": "Удаляем Perl модули из cpan",
        "excerpt":"В установке любого Perl модуля Вам поможет утилита cpan. Дело в том, что cpan скачивает архивы с исходным кодом, компилирует их и устанавливает. Проблема появляется, когда такой модуль нужно удалить. Следующий скрипт поможет Вам в удалении ненужны модулей: # uninstall_perl_module.pl from PerlTricks.com use 5.14.2; use ExtUtils::Installed; use ExtUtils::Packlist; # Exit...","categories": ["Perl"],
        "tags": [],
        "url": "/remove-perl-cpan-modules/",
        "teaser":null},{
        "title": "NginX и X-Forwarded-Proto:HTTPS за балансировщиком нагрузки",
        "excerpt":"Быстрая заметка о https трафике за кривыми балансировщиками нагрузки. Мы имеем Настройка Nginx + php-fcgi за балансировщиком нагрузки. Балансировщик, как женщина, которую никто так не понимает, как она сама себя не понимает. Тоесть балансировщик нагрузки (он же БН, он же LB) обрабатывает либо https, либо http трафик. SSL Termination можно...","categories": ["Nginx"],
        "tags": ["SSL","Балансировка нагрузки","X-Forwarded-Proto"],
        "url": "/x-forwarded-proto-https-nginx/",
        "teaser":null},{
        "title": "Создаем учетную запись administrator в OpenX из MySQL",
        "excerpt":"Как создать админа из админки - задача не из сложных. Но что делать, если доступа в админку нету, а есть доступ к базе mysql? В OpenX существует несколько видов пользователей: ADMIN MANAGER ADVERTISER TRAFFICKER Значения id в таблице accounts соответствует номеру в списке. Пользовтели хранятся в таблице users. Также нужно...","categories": ["Other CMS"],
        "tags": ["OpenX"],
        "url": "/administrator-openx-mysql/",
        "teaser":null},{
        "title": "Использование mod_substitute в Apache",
        "excerpt":"Для это штуки решил сделать отдельную заметку. Суть работы этого mod_substitute заключается в замене текста в теле ответа от вэб сервера. Тоесть можно сменить, на принмер, ссылки на один домен ссылками на другой домен без вмешательства в код сайта. Проверить загружен ли модуль можно так: /usr/sbin/apachectl -t -D DUMP_MODULES 2&gt;&amp;1|grep...","categories": ["Apache"],
        "tags": ["mod_substitute"],
        "url": "/use-mod_substitute-in-apache2/",
        "teaser":null},{
        "title": "Сервер не отображается в NewRelic",
        "excerpt":"Это не статья, а именно заметка в блог обычного технаря. В своей практике часто выполняю нагрузочное тестирование для сайтов клиентов. В большенстве случаев - ничего особенного о таких вещах рассказать не могу. Всего одну статью написал о том, что было не похоже на другие случаи. В ходе нагрузочного тестирования, естественно,...","categories": ["мониторинг"],
        "tags": ["NewRelic"],
        "url": "/%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%D0%BD%D0%B5-%D0%BE%D1%82%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B0%D0%B5%D1%82%D1%81%D1%8F-%D0%B2-newrelic/",
        "teaser":null},{
        "title": "Как определить какой скрипт рассылает спам через postfix",
        "excerpt":"Если вы обнаружили, что ваш postfix сервер рассылает спам (spam), сами понимает - вас ломанули. Довольно противное состояние. Как правило спам рассылка запускается каким-то скриптом. Не расстраивайтесь. Определить какой именно скрипт инициализирует рассылку можно. Для этого переключитесь в учетную запись суперпользователя: sudo su Проверьте очередь рассылки: mailq |less less позволит...","categories": ["Почта","Безопасность"],
        "tags": ["Postfix"],
        "url": "/postfix-sends-spam/",
        "teaser":null},{
        "title": "Настройки fail2ban в Plesk",
        "excerpt":"Plesk предоставляет возможность крутить настройки всего, что есть на сервере, ну или практически всего. Настройки fail2ban находятся в Plesk на странице Tools &amp; Settings. Нужно выбрать пункт IP Address Banning (Fail2Ban) На вкладке jails можно увидеть что там активировано в конфиге: SSH Jail так и называется: Что бы изменть настройки...","categories": ["Plesk"],
        "tags": ["fail2ban"],
        "url": "/configure-fail2ban-in-plesk/",
        "teaser":null},{
        "title": "Упорядочить Процессы по Используемой Памяти в Linux",
        "excerpt":"Следующуя команда вернет список процессов, наиболее активно использующих память, в мегабайтах:   ps axo rss,comm,pid | awk '{ proc_list[$2] += $1; } END \\   { for (proc in proc_list) { printf(`%d\\t%s\\n`, proc_list[proc],proc); }}' \\   | sort -n | tail -n 10 | sort -rn | awk '{$1/=1024;printf `%.0fMB\\t`,$1}{print $2}'  ","categories": ["Linux server"],
        "tags": [],
        "url": "/ram-swap-processlist-linux/",
        "teaser":null},{
        "title": "Проверка скорости интернет соединения в консоли Linux",
        "excerpt":"Сайт speedtest.net известен многим. Он очень помогает проверить Вашу скорость интернета, но как быть с linux серверами у которых нету графической оболочки, а есть только bash консоль. Для таких случаев Matt Martz написал утилиту на питоне, которую можно прямо качать и запускать. Последовательность действий: Скачиваем wget -O /usr/local/bin/speedtest-cli https://raw.github.com/sivel/speedtest-cli/master/speedtest_cli.py chmod...","categories": ["Linux server"],
        "tags": [],
        "url": "/speedtest-cli-linux/",
        "teaser":null},{
        "title": "Установка monit в Debian/Ubuntu",
        "excerpt":"Monit — программа для проверки состояния сервисов на и поддержки их на плаву, которая умеет слать уведомления в случае каких либо отклонений, софтина работает под linux, bsd и других unix-системах. Используется как средство мониторинга и перезапуска каких либо сервисов. Гибкие настройки и функционал делают программу очень даже привлекательной! Рекомендую к...","categories": ["Мониторинг"],
        "tags": ["Ubuntu Linux","monit"],
        "url": "/use-monit-debial-ubuntu/",
        "teaser":null},{
        "title": "Настройка SFTP и Chroot на Ubuntu 14.04",
        "excerpt":"В этой статье рассматривается настройка sftp сервера и изоляция пользователей в их домашних каталогах (chroot) на базе Linux Ubuntu 14.04. Sftp - протокол обмена файлами через безопасное сетевое соединение. Chroot - изолированая среда. Для начала создадим группу с пользователями: groupadd sftpusers Поскольку sftp - подсистема ssh, то и настройки е...","categories": ["Linux server"],
        "tags": ["chroot","sftp"],
        "url": "/configure-sftp-chroot-on-ubuntu-14-04/",
        "teaser":null},{
        "title": "Настройка suexec в Apache2 на Ubuntu 14.04",
        "excerpt":"Механизм suexec позволяет выполнять CGI скрипты от имени разных пользователей системы. В этой статье я рассмотрю пример настройки suexec на базе Linux Ubuntu 14.04. Использовать suexec очень удобно если у вас есть несколько сайтов на сервере, доступ к которым организован через sftp. В таком случае вы не столкнетесь с проблемой...","categories": ["Apache"],
        "tags": ["Ubuntu","Apache2","cgi","php-cgi","suexec"],
        "url": "/configure-suexec-apache-ubuntu-14-04/",
        "teaser":null},{
        "title": "Парсинг web-страниц на php",
        "excerpt":"В этом нелегком деле нам поможет PHP Simple HTML DOM Parser. Самая последняя версия доступна на sourceforge.net. На сегодняшний день последней является версия 1.5. Её и будем скачивать: wget -O simplehtmldom_1_5.zip http://downloads.sourceforge.net/project/simplehtmldom/simplehtmldom/1.5/simplehtmldom_1_5.zip?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fsimplehtmldom%2Ffiles%2Fsimplehtmldom%2F1.5%2F\\&amp;ts=1433252429\\&amp;use_mirror=softlayer-ams Скачали, распаковываем в папку, которая доступна по вэбу, допустим /var/www/html/webparser: mkdir /var/www/html/webparser mv simplehtmldom_1_5.zip /var/www/html/webparser/ cd /var/www/html/webparser unzip...","categories": ["PHP"],
        "tags": [],
        "url": "/parse-web-pages-in-php/",
        "teaser":null},{
        "title": "Простая установка mod_security на CentOS 5.8",
        "excerpt":"В этой статье я буду устанавливать mod_security из того, что доступна в Epel репозитарии для CentOS 5.8. Уже есть такая статья. Она более обширная и предусматривает установку mod_security самой последней версии испульзуя исходный код. Как Вы, наверное, поняли, для начала нужно подключить репу Epel. Приступаем к установке: yum install mod_log_post...","categories": ["Apache","Безопасность"],
        "tags": ["mod_security"],
        "url": "/install-mod_security-centos-5-8/",
        "teaser":null},{
        "title": "Перенос сайта из GoogleSites",
        "excerpt":"Сегодня хабрапользователь ‘лорд Брабазон Вир-де-Вир’ хотел бы поделиться своим методом переноса сайта с GoogleSites на отдельный хостинг. Основной скрипт трансфера выглядит следующим образом: &lt;?php include \"_config.php\"; error_reporting(0); $param=$_GET[\"param\"]; if($param==$_index_page OR $param==$_index_page.'/'){ $param=''; } $url = strtolower('https://sites.google.com/site/'.$_google_sites_sitename.'/'.$param); if (file_get_contents($url)){ $content = file_get_contents($url); include '_parser.php'; include '_header.php'; echo $content; $file_info = new...","categories": ["PHP"],
        "tags": ["GoogleSites","миграция"],
        "url": "/googlesites-escape/",
        "teaser":null},{
        "title": "Шпаргалка по Yum",
        "excerpt":"Шпаргалка по работе с пакетным менеджером Yum (Yellowdog Updater, Modified), который используется в популярных Linux дистрибутивах: RedHat, CentOS, Scientific Linux (и других). В целях экономии места вывод команд не представлен. Оглавление Команды Опции Yum Пакет Yum-Utils Конфигурационные файлы Плагины Работа через прокси отображение команд и опций yum help список названий...","categories": ["Linux server"],
        "tags": ["CentOS","FromHabrSandbox","yum"],
        "url": "/yum-notes/",
        "teaser":null},{
        "title": "Netstat не найден Fedora",
        "excerpt":"Сегодня при первичной настройке сервера с Fedora 20 получил вот такую ошибку: bash: netstat: command not found Во время кризиса статей любая заметка сгодится, лишь бы поисковики не считали, что блог заброшен. В общем найти нужный пакет можно с помощью yum: yum provides netstat В ответ получаем следующее: net-tools-2.0-0.15.20131119git.fc20.x86_64 :...","categories": ["Linux server"],
        "tags": ["Fedora","Netstat"],
        "url": "/netstat-not-found-fedora/",
        "teaser":null},{
        "title": "Ошибка max_allowed_packet при восстановлении базы MySQL",
        "excerpt":"Если Вы читаете эту заметку, значит вы столкнулись со следующей ошибкой при восстановлении базы MySQL: Got a packet bigger than 'max_allowed_packet' Побороть ее можно несколькими способами. Самый простой - передать размер max_allowed_packet аргументом к mysql: mysql -uroot -p -max_allowed_packet=100M **база** &lt; **дамп**.sql Если не сработает, тогда подключаемся к консоли: mysql...","categories": ["MySQL"],
        "tags": [],
        "url": "/max_allowed_packet-issue-mysql/",
        "teaser":null},{
        "title": "Проблема с местом на диске в Linux",
        "excerpt":"Бывает, что на диске есть достаточно много свободного места, но файлы упорно не создаются. В некоторых случаях выскакивает ошбка о том, что на диске закончилось свободное место. Вы упорно вводите: df -ha И не понимаете, что же не так: на диске еще сотня гиг свободно, а файл создать нельзя. Ключ...","categories": ["Linux server"],
        "tags": ["inode","инод"],
        "url": "/issue-with-disk-space-linux/",
        "teaser":null},{
        "title": "RackSpace Cloud API - получение токена и точки входа",
        "excerpt":"RackSpace - американский хостинг с несколькими дата центрами, который предоставляет большое количество хостинговых решений. Одним из продуктов является cloud hosting, со своим набором дополнительных сервисов, таких как резервное копирование, автоматическое скалирование, CDN и т.д. Управлять всем этим добром можно через API, авторизация в котором происходит на основе имени пользователя и...","categories": ["Clouds","RackSpace"],
        "tags": ["RackSpace"],
        "url": "/rackspace-cloud-api-token-endpoint/",
        "teaser":null},{
        "title": "RackSpace CloudFIles - загружаем файлы",
        "excerpt":"Для загрузки файлов в хранилище CloudFIles можно воспользоваться SDK для PHP. Поддерживаются и другие языки програмирования. Полное описание установки можно почитать на следующей странице: https://developer.rackspace.com/sdks/ Я решил дальше играться с php. Установки SDK php-opencloud воспользуемся утилитой composer: composer require rackspace/php-opencloud Чтобы установить composer выполните следующую команду: curl -sS https://getcomposer.org/installer |...","categories": ["Clouds","RackSpace"],
        "tags": [],
        "url": "/rackspace-cloud-uploads-to-cloudfiles/",
        "teaser":null},{
        "title": "Puppet - точка входа",
        "excerpt":"Puppet - это комплекс утилит, написанных на Ruby, которые позволяют управлять большим количеством серверов с одной точки. Он позволяет описать необходимое состояние для каждого сервера в Вашей инфраструктуре. Создание новых серверов больше не требует кнопкокликания, заготовок/темплейтов и т.д. Разработчики предоставили прикольную виртуалку, с помощью которой можно ознакомиться с фичами puppet....","categories": ["Puppet"],
        "tags": ["Puppet"],
        "url": "/puppet-entrypoint/",
        "teaser":null},{
        "title": "Полный апгрэйд: NginX1.9 + PHP7 + MySQL 5.6 на Ubuntu 14.04",
        "excerpt":"Уж лето близится к концу и хостинговый год у амазона начинается заново. Решил создать навый сервер со всем самым новым. На момент написания первой версии этой статьи компилятор PHP 7-й версии был всего лишь бэтой, но на сегодняшний день это полноценный релиз. Nginx версии 1.9.3 тоже был выпущен пуквально пару...","categories": ["Linux server"],
        "tags": ["mysql 5.6","nginx 1.9.3","php7"],
        "url": "/nginx-1-9-php7-ubuntu-14-04-mysql-5-6/",
        "teaser":null},{
        "title": "Почта доставляется через plesk_virtual service",
        "excerpt":"По умолчанию при создании учетной записи в Plesk для этой записи включается локальная доставка почты. Сколько бы вы не указывали ему, чтобы почта ходила согласно DNS MX записи, он все равно упорно будет доставлять почту для домена локально. В результате в лог файле postfix (/usr/local/psa/var/log/maillog) появляются следующие записи: postfix/pipe[19101]: 4986B18E20FE:...","categories": ["Plesk"],
        "tags": ["plesk_virtual"],
        "url": "/mail-delivered-plesk_virtual-service/",
        "teaser":null},{
        "title": "Проблемы с визуальным редактором в WordPress",
        "excerpt":"Сегодня столкнулся с проблемой на одном из сайтов с которым работал. Суть проблемы заключалась в том, что визуальный редактор (Visual editor) TinyMCE не работал и показывал пустое поле. В консоли браузера отображались ошибки о том, что невозможно подгрузить стили и скрипты. Картина была следующая: Все нужные файлы находились в папке...","categories": ["WordPress"],
        "tags": [],
        "url": "/visual-editor-wordpress-nextgen/",
        "teaser":null},{
        "title": "Лечим инфицированный сайт/сервер",
        "excerpt":"Раз Вы читаете эту статью, значит Ваш сайт взломали. Вы увидели, что с с Вашего сервера рассылается спам(spam) и никак не можете определить что же с ним делать. Важно не паниковать, а строго следовать инструкциям: Просканировать Ваш сервер с помощью следующих утилит: ClamAV Chkrootkit MalDetect Lynis (бывший rkhunter) Удостовериться что...","categories": ["Linux Server","Безопасность"],
        "tags": [],
        "url": "/fix-compromized-server/",
        "teaser":null},{
        "title": "Настраиваем Postfix на отправку писем через MailGun",
        "excerpt":"В этой статье пойдет речь о том, как настроить ваш Linux сервер отправлять почту через сервис MailGun. Для начала нужно удостовериться что с Вашей учетной записью все в порядке. Для этого можно воспользоваться утилитой curl и отправить письмо через API: curl -s -user 'api:ВАШ_API_КЛЮЧЬ' \\ https://api.mailgun.net/v3/домен/messages \\ -F from='Excited User...","categories": ["Почта"],
        "tags": ["MailGun","postfix"],
        "url": "/configure-postfix-use-mailgun/",
        "teaser":null},{
        "title": "Перенос блога между инсталляциями WordPress multisite",
        "excerpt":"В интернете полно статей, которые описывают процедуру переноса блоги из multisite в отдельный WordPress. В этой статье я опишу, как можно перенести блог/подсайт из одной инсталляции WordPress multisite в другую. Я предполагаю, что новый мультисайт у Вас уже настроен, поэтому саму настройку рассматривать здесь не буду. Процесс включает в себя...","categories": ["WordPress"],
        "tags": ["migrate","WordPress multisite"],
        "url": "/move-data-to-worgpress-multisite/",
        "teaser":null},{
        "title": "Запускаем Jenkins в Tomcat6 на CentOS 6.5",
        "excerpt":"Быстрая заметка о том, как заставить Jenkins работать на CentOS сервере и показывать web морду в Tomcat6. Для начала добавим нужные репозитрии и установим сам jenkins: sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat/jenkins.repo sudo rpm -import http://pkg.jenkins-ci.org/redhat/jenkins-ci.org.key yum install jenkins -y Дальше устанавливаем tomcat6: yum install tomcat6 -y В чистую систему оно...","categories": ["Jenkins"],
        "tags": [],
        "url": "/jenkins-tomcat6-centos6/",
        "teaser":null},{
        "title": "Error: xz compression not available",
        "excerpt":"Если при попытке установить любой пакет с помощью yum вы получете следующее сообщение, значит Вы ошиблись в выборе пакета репозитория при установке: Error: xz compression not available С большой вероятностью Вы установили Epel 7-й версии на CentOS 6.5 Чтобы устранить проблему нужно: Удалить кэш репозитория: rm -rf /var/cache/yum/x86_64/6/epel Удалить сам...","categories": ["Linux server"],
        "tags": ["CentOS","Red Hat"],
        "url": "/error-xz-compression-not-available/",
        "teaser":null},{
        "title": "Проблемы с git в Jenkins",
        "excerpt":"В ходе подключения git репозитория к Jenkins получил следующуу ошибку: Failed to connect to repository : Command 'git config -local credential.username username' returned status code 129: stdout: stderr: error: unknown option 'local' usage: git config [options] Ошибка вызвана тем, что Jenkins требует git версии 1.8+, а в репах CentOS 6.5...","categories": ["Jenkins"],
        "tags": [],
        "url": "/%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D1%8B-%D1%81-git-%D0%B2-jenkins/",
        "teaser":null},{
        "title": "Отображение ServerVariables в IIS",
        "excerpt":"Многие админы пользуются функцией phpinfo для дэбага заголоков, которые получает сервер при обращении к сайту. Подобную шутуку можно проделать, когда у Вас нету php на виндовом сервере. В ASP это называется ServerVariables. Создайте в корне сайта файл с расширением asp со следующим содержанием: &lt;% for each x in Request.ServerVariables response.write(\"&lt;b&gt;\"...","categories": ["IIS"],
        "tags": ["iis","ServerVariables"],
        "url": "/display-servervariables-iis/",
        "teaser":null},{
        "title": "Создаем backup всех баз даных в MSSQL 2008/2012",
        "excerpt":"Для того что бы сделать резервные копии всех баз даных в Вашем MSSQL сервере 2008/2012 года, можно воспользоавться SQL следующим запросом: DECLARE @name VARCHAR(50) -- database name DECLARE @path VARCHAR(256) -- path for backup files DECLARE @fileName VARCHAR(256) -- filename for backup DECLARE @fileDate VARCHAR(20) -- used for file name...","categories": ["MSSQL Server"],
        "tags": ["backup","mssql"],
        "url": "/backup-databases-mssql-2008-2012/",
        "teaser":null},{
        "title": "Использование WebDeploy для переноса сайтов IIS между серверами",
        "excerpt":"Использование WebDeploy очень облегчает задаче переноса конфигов и контэтна сайтов между Windows серверами. WebDeploy незаменима при работе с большим количеством сайтов (100+). Она не включена в в пакете IIS и устанавливается отдельно. Самый простой способ - использование Microsoft Web Platform Installer Находим и устанавливаем: WebDeploy должен быть установлен на оба...","categories": ["IIS"],
        "tags": ["msdeploy","webdeploy"],
        "url": "/use-webdeploy-to-move-configs-iis/",
        "teaser":null},{
        "title": "Как восстановить 100 баз из бэкапов в MSSQL",
        "excerpt":"Переноc баз даных между серверами включеет в себя создание резервной копии/бэкапа на старом сервере и разворачивание этого бэкапа на новом сервере. С одной-двумя базами мороки не много, но что делать если у Вас больше сотни баз? Пальци отвалятся столько раз кнопки жать. Как сделать бэкап большого количества баз MSSQL я...","categories": ["MSSQL Server"],
        "tags": [],
        "url": "/%D0%BA%D0%B0%D0%BA-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C-100-%D0%B1%D0%B0%D0%B7-%D0%B8%D0%B7-%D0%B1%D1%8D%D0%BA%D0%B0%D0%BF%D0%BE%D0%B2-%D0%B2-mssql/",
        "teaser":null},{
        "title": "Иcпользование циклов в командной строке Windows",
        "excerpt":"После годов работы в консоли linux очень тяжело выполнять задачи на windows серверах. Иногда бывает нужно обработать список файлов (открыть, удалить, переименовать, и т.д.), но руками это делать очень трудозатратно. Следующий цыкл читает текстовый файл и позволяет что-то сделать с результатами: for %A in (myfile.txt) do [действие] %A С помозью...","categories": ["Windows"],
        "tags": ["findstr","for","windows cmd"],
        "url": "/loops-in-windows-cmd/",
        "teaser":null},{
        "title": "Ошибка MySQL клиетна",
        "excerpt":"Сегодня столкнулся со следующей ошибкой при вызове клиента mysql: /usr/bin/mysql: relocation error: /usr/bin/mysql: symbol strmov, version libmysqlclient_16 not defined in file libmysqlclient.so.16 with link time reference Как оказаловь позже на сервере были установлены библиотеки от Percona вместо стандартных mysql-libs. Для устранения даной неприятности нужно сначала удостовериться, что репозитарии percona выключены....","categories": ["MySQL"],
        "tags": [],
        "url": "/mysql-symbol-strmov-version-libmysqlclient_16-not-defined/",
        "teaser":null},{
        "title": "Undefined subroutine &#038;Symbol::gensym",
        "excerpt":"Сегодня получил следующую ошибку при попытке установки Perl модуля Apache2::Reload через cpan: Undefined subroutine &amp;Symbol::gensym called at Makefile.PL line 91. Модуля Symbol::gensym не существует. Результаты поиска в Google ничего не дали. Оставлю заметку на будущее - может кому пригодится. Потом посмотрю в статистике посещений. Выполните в консоли cpan следующую команду...","categories": ["Perl"],
        "tags": [],
        "url": "/undefined-subroutine-symbolgensym/",
        "teaser":null},{
        "title": "Бэкап хранимых процедур, функций и триггеров MySQL",
        "excerpt":"MySQL 5 ввел некоторые новые интересные функции, такие как хранимые процедуры и триггеры. Я покажу в этой маленькой заметке, как можнозабэкапить и восстановить эти компоненты с использованием mysqldump. По умолчанию утилита mysqldump забэкапит все триггеры, но НЕ хранимые процедуры/функций. Есть 2 параметра, которые говорят MySQLDump что делать: routines - FALSE...","categories": ["MySQL"],
        "tags": [],
        "url": "/mysql-routines-functions-triggers-and-stored-procedures/",
        "teaser":null},{
        "title": "Apache 2.2.31 OpenSSL 1.0.1q на CentOS 6.7",
        "excerpt":"В последнее время все чаще стал сталкиваться с тем, что на серверах нужно каким-то образом обновлять openssl до последней версии. К сожалению от библиотек OpenSSL зависит очень многое на сервере, поэтому глобально его заменить не получится. Вернее получится, но это приведет к плачевным результатам. Мне как-то удалось собрать rpm пакет...","categories": ["Apache"],
        "tags": ["SSL","Apache","centos","openssl"],
        "url": "/apache-2-2-31-openssl-1-0-1q-centos-6-7/",
        "teaser":null},{
        "title": "Diffie-Hellman Modulus vsFTPD",
        "excerpt":"Нигде не смог найти, как отключить в vsFTPD TLS шифрование с помощью Diffie-Hellman. PCi compliance сканер отказывался пропускать этот сервер, пока мы не пофиксили конфиг vsftp сервера: Автор weakdh.org расписал как отключить Diffie-Hellman и для Lighttpd, и для Nginx, и для Tomcat, но только не для vsFTPD. Собственно сюда я...","categories": ["SSL"],
        "tags": ["FTP","vsftpd"],
        "url": "/diffie-hellman-modulus-vsftpd/",
        "teaser":null},{
        "title": "Установка modsecurity для Apache",
        "excerpt":"ModSecurity - своеобразный фаервол для Apache, Nginx и IIS. Это модуль, предоставляющий набор правил для фильтрации трафика. Это модуль из разряда must have для любого сервера. 12 Февраля 2015 года была выпущена версия 2.9.0. Она является наиболее актуальной на момент написания этой заметки. Даже четвертого января 2016 года эта версия...","categories": ["Apache","Безопасность"],
        "tags": [],
        "url": "/install-modsecurity-for-apache/",
        "teaser":null},{
        "title": "Проблема с utf8mb4_unicode_ci",
        "excerpt":"Во время восстановления дампа базы mysql выскакивает вот такая ошибка: ERROR 1273 (HY000) at line ###: Unknown collation: 'utf8mb4_unicode_ci' ERROR 1115 (42000) at line ###: Unknown character set: 'utf8mb4' Для корректного восстановления нужно немного подредактировать дамп, который собираетесь восстановить, а именно заменить utf8mb4_unicode_ci на utf8_general_ci. В среде bash очень удобно...","categories": ["MySQL"],
        "tags": [],
        "url": "/utf8mb4_unicode_ci-issue-mysql/",
        "teaser":null},{
        "title": "Затыкаем слабые места в настройках SSL Apache",
        "excerpt":"В протоколе SSL, который позволяет обмениваться шифрованным трафиком между сервером и клиентом, периодически находят слабые места. Собственно предполагается, что злоумышленники могут тем или иным образом дешифровать ssl трафик. Паниковать не стоит, но тем не менее лучше не рисковать. Эту статью я обновляю по мере появления новых уязвиимостей. Дальше речь пойдет...","categories": ["Apache"],
        "tags": ["SSL","Forward Secrecy","Poodle","RC4","SSLCompression"],
        "url": "/forward-secrecy-rc4-poodle-sslcompression/",
        "teaser":null},{
        "title": "Обрабатываем почтовую очередь в Qmail",
        "excerpt":"Qmail не является последним словом в технологии доставки почты, но этот smtp демон до сих пор очень распространен. В частности многие сервера с Plesk панелью используют именно Qmail. Для того что бы посмотреть список сообщений ожидающих отправки (посмотреть очередь доставки) можно воспользоваться следующей утилитой: /var/qmail/bin/qmail-qread Посчитать количество сообщений в очереди...","categories": ["Почта"],
        "tags": ["qmail"],
        "url": "/qmail-mail-queue-tools/",
        "teaser":null},{
        "title": "Быстрое создание rpm пакета в CentOS с помощью Checkinstall",
        "excerpt":"Для того, чтобы создать RPM пакет используя исходный код приложения вам понадобится Checkinstall. Это самый простой и быстрый способ создания RPM пакетов. Готовый пакет можно устанавливать на другие сервера без необходимости компилировать его каждый раз. Установите обработчики rpm пакетов: yum install -y rpm-build rpmdevtools После установки выполните следующую команду. Она...","categories": ["Linux Server"],
        "tags": ["CentOS","Checkinstall"],
        "url": "/checkinstall-create-a-rpm-package-in-centos/",
        "teaser":null},{
        "title": "Сборка NginX v.1.9.10 из исходника",
        "excerpt":"Установка любого ПО по средствам компиляции пакета с исходным кодом - лучший способ использовать последние версии. Я буду собирать NginX с поддержкой mod_security, geoip и srcache. Srcache позволяет NginX использовать Memcache для хранения кэша. На сегодняшний день последней версией является NginX v.1.9.10, его и будем устанавливать. Возимся с GeoIP. Процесс...","categories": ["Nginx"],
        "tags": ["nginx 1.9.10"],
        "url": "/compile-latest-nginx-from-source/",
        "teaser":null},{
        "title": "Добавление сайтов в IIS7 из командной строки",
        "excerpt":"Быстрая заметка о том, как создать сайт в IIS7 из командной строки (cmd.exe). Это очень удобно, если Вам нужно создать 100+ сайтов. Запускаем cmd.exe от имени администратора и переходим следующий каталог: cd %windir%\\system32\\inetsrv Без этого система не увидит appcmd и Вы получите следующую ошибку: 'appcmd.exe' is not recognized as an...","categories": ["IIS"],
        "tags": ["appcmd.exe","cmd.exe","iis7"],
        "url": "/add-website-iis7-from-cmd/",
        "teaser":null},{
        "title": "Переклчаем PHP в режим CGI для одной папки",
        "excerpt":"На днях столкнулся с проблемой: phpmyadmin ругался на отсутствие модуля mcrypt в php. Странность заключалась в том, что в консольном выводе php -i модуль mcrypt присутствовал: php -m |grep mcrypt Я немного потупил, и до меня дошло, что на сервере было 2 инсталляции php, обе собраны из исходников, при этом...","categories": ["Apache","PHP"],
        "tags": ["php-cgi"],
        "url": "/configure-php-cgi/",
        "teaser":null},{
        "title": "Настройка Nginx + perl-fcgi",
        "excerpt":"Nginx все очень хвалят за его производительность. Но никто не учитывает тот факт, что он так шустро работает из-за отсутствия всех тех модулей, которые расширяют функционал Apache. Для Nginx нельзя установить модуль обработки perl или python файлов через обычный установщик пакетов. Nginx больше всего похож на универсальный фронт-энд. В этой...","categories": ["Nginx"],
        "tags": ["perl nginx"],
        "url": "/configure-nginx-perl-fcgi/",
        "teaser":null},{
        "title": "Сканирование сервера с помощью Lynis",
        "excerpt":"Lynis (ранее RkHunter) является инструментом аудита безопасности для систем Linux и BSD. Он выполняет подробный аудит многих аспектов безопасности и конфигурации вашей системы. Загрузите последние источники Lynis из https://cisofy.com/download/lynis/ Lynis не требует установки, достаточно его проcто скачать и распаковать: cd /tmp wget -no-check-certificate https://cisofy.com/files/lynis-2.2.0.tar.gz tar xvfz lynis-2.2.0.tar.gz mv lynis /usr/local/...","categories": ["Linux Server","Безопасность"],
        "tags": ["Lynis","rkhunter"],
        "url": "/scan-linux-server-with-lynis/",
        "teaser":null},{
        "title": "Сортируем записи в таблице с помощью jQuery",
        "excerpt":"Добустим у нас есть следующая таблица на странице и Вам нужно ее отсортировать по алфавиту: &lt;table&gt; &lt;tr&gt;&lt;td&gt;Beta&lt;/td&gt;&lt;td&gt;2&lt;/td&gt;&lt;/tr&gt; &lt;tr&gt;&lt;td&gt;Omega&lt;/td&gt;&lt;td&gt;4&lt;/td&gt;&lt;/tr&gt; &lt;tr&gt;&lt;td&gt;Aplha&lt;/td&gt;&lt;td&gt;1&lt;/td&gt;&lt;/tr&gt; &lt;tr&gt;&lt;td&gt;Gamma&lt;/td&gt;&lt;td&gt;3&lt;/td&gt;&lt;/tr&gt; &lt;/table&gt; Для этого можно возпользоваться следующиим скриптом на jQuery: $(document).ready( function () { tbody = $('table').find('tbody'); tbody.find('tr').sort(function(a, b) { return $('td:first', a).text().localeCompare($('td:first', b).text()); }).appendTo(tbody); }); Не забудьте добавить сам jQuery...","categories": ["jQuery"],
        "tags": [],
        "url": "/sort-table-with-jquery/",
        "teaser":null},{
        "title": "Использование maldetect для сканирования Linux Сервера",
        "excerpt":"Malware Detect (LMD) утилита сканирования Linux систем на наличие вредоносных файлов (malware). Распространяется под лицензией GNU GPLv2. MalDetect может использовать даные от систем обнаружения атак что бы извлечь вредоносный код (malware). Также может использовать антифирусную базу других сканеров, таких как ClamAV. MalDetect недоступен в репозитория ПО, так что его нужно...","categories": ["Linux server","Безопасность"],
        "tags": ["maldet","maldetect"],
        "url": "/use-maldetect-to-scan-linux-server/",
        "teaser":null},{
        "title": "Установка Apache mod_evasive.",
        "excerpt":"Mod_evasive, ранее известный как mod_dosevasive, помогает защититься от атак DoS, DDoS (распределенный отказ в обслуживании), и атак типа brute force на веб-сервере Apache. Это может обеспечить отвлекающее действие во время атаки и сообщать о атаке по электронной почте. Модуль работает путем создания встроенной динамической таблицы IP-адресов и URI, а также...","categories": ["Apache"],
        "tags": [],
        "url": "/apache-mod_evasive/",
        "teaser":null},{
        "title": "Используем DKIM подпись для исходящей почты",
        "excerpt":"Было заработано несколько систем для защиты почты от спуфинга. По сути любой человек моет отправить письмо от любого домена (в том числе и tech-notes.net) используя подход описанный в этой статье Самыми эффективными, пока что, являются DKIM. SPF - это просто DNS запись типа TXT, со списком ip адресов или доменных...","categories": ["Почта"],
        "tags": ["dkim","exim","postfix"],
        "url": "/use-dkim-to-sign-outgoing-mail/",
        "teaser":null},{
        "title": "Как настроить Exim использовать SendGrid для отправки почты",
        "excerpt":"Продолжаю линейку статей о почтовых сервисах пока не улетучилось вдохновление от недавно решенных проблем. Я уже описывал как настроить PostFix отправлять почту через MailGun. В этой статье речь пойдет о настройке Exim для ипользования сервиса доставки почты SendGrid. Очень удачно совпадает описание настройки разных почтовых сервисов на разных почтовых демонах....","categories": ["Почта"],
        "tags": ["Exim","Sendgrid","WHM"],
        "url": "/configure-exim-to-use-sendgrid/",
        "teaser":null},{
        "title": "Как обойтись без sed в командной строке Windows",
        "excerpt":"Сегодня столкнулся с необходимостью поменять текстовку в сотне файлов на сервере вод управлением Windows. В среде linux такие задачи решаются просто с помощью sed и ключа ‘-i’, но в среде Windows аналогов sed нету. Пришлось изощряться. Для начала создал файл C:\\repl.vbs со следующим содержанием: Const ForReading = 1 Const ForWriting...","categories": ["Windows Server"],
        "tags": [],
        "url": "/inline-replace-windows-cmd/",
        "teaser":null},{
        "title": "Установка плагинов NewRelic с помощью NPI на примере MySQL",
        "excerpt":"Многим известен newrelic.com - сервис отслеживания состояния и производительности приложений. Этот сервис очень динамично развивается и разрабочики постоянно расширяют функцинал добавляя новые плагины для продвинутого мониторинга приложений и серверов. Естественно в такой динмике им нужно было придумать как же упростить установку плагинов на сервера их пользователей (тоесть нас). И они...","categories": ["мониторинг"],
        "tags": ["mysql","newrelic","npi"],
        "url": "/install-newrelic-plugins-npi-mysql/",
        "teaser":null},{
        "title": "Настройка SELinux для Apache в CentOS",
        "excerpt":"SELinux это модуль ядра Linux, который предоставляет дополнительный механизм определения прав доступа к папкам и файлам. Иногда он создает немалые проблемы при расположении файлов сайта и логов в нестандартных папках. Особым успехом эти грабли пользуются у новоиспеченных админов и разработчиков, которые не понимают, почему сайт возвращает 404-ю ошибку, при том,...","categories": ["Apache","Безопасность"],
        "tags": ["selinux"],
        "url": "/configure-selinux-apache-centos/",
        "teaser":null},{
        "title": "OSSEC клиент-серверная установка",
        "excerpt":"OSSEC - это система выявления и предотвращения атак и открытым исходным кодом. Его можно настроить следить не только за событиями в лог файлах, но и за изменением файлов и запущенных демонов, служб и сервисов. Страница на GitHUB: http://ossec.github.io/ В дальнейшем речь пойдет не просто об установке OSSEC, но и о...","categories": ["Linux server","Безопасность"],
        "tags": ["oosec"],
        "url": "/ossec-client-server/",
        "teaser":null},{
        "title": "Создание учетной записи WHM/cPanel из командной строки",
        "excerpt":"WHM предоставляет очень дружелюбный интерфейс для управлениясайтами, пользователями и базами даных на сервере. Иной раз приходится создать несколько сотен учеток для разных клиентов (допустим миграция с обычного сервера на WHM). В таком случае можно очень долго кликать в web-интерфейсе. В таком случае в разы легче создавать учетные записи используя заготовленые...","categories": ["WHM/cPanel"],
        "tags": [],
        "url": "/create-whm-cpanel-account-from-shell/",
        "teaser":null},{
        "title": "Использование шаблонного текста при создании записи в WordPress",
        "excerpt":"В ходе работы над новым ресурсом, было решено использовать единый шаблон для публикации записей определенного типа. Предложение выглядит немного бредовым. Целью сайта securepulse.online является информирование подписчиков о выходе новых версий ПО, патчей и выявленных уязвимостях в тех или иных продуктов. Все новости из этого разряда имеют тип SecurityNews (для типизации...","categories": ["WordPress"],
        "tags": [],
        "url": "/use-mockup-wordpress-new-post/",
        "teaser":null},{
        "title": "Postfix меняем домен отправителя",
        "excerpt":"Как правило сразу после установки postfix отправляет письма используя домен, который возвращает команда uname -n При этом отправителем является системный пользователь от которого выполняется скрипт или идет отправка. Пример может быть www-data@localhost.localdomain. Для того что бы изменить домен, который будет значиться в отправленных письмах, и имя пользователя, от которого осуществляется...","categories": ["Почта"],
        "tags": ["postfix"],
        "url": "/postfix-change-sender-domain/",
        "teaser":null},{
        "title": "Amazon CloudFront и ошибка с Access-Control-Allow-Origin",
        "excerpt":"На днях развернули в клауде амазона магазин на базе Megento. И все бы ничего, но в консоли браузера насточиво появляется следующая ошибка Font from origin 'https://blablabla.cloudfront.net' has been blocked from loading by Cross-Origin Resource Sharing policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://blablabla.com' is therefore not...","categories": ["Clouds","AWS"],
        "tags": ["cloudfront"],
        "url": "/access-control-allow-origin-amazon-cdn-cloudfront/",
        "teaser":null},{
        "title": "Синхронизация файлов между двумя Windows серверами",
        "excerpt":"Обычно для синхронизации файлов между Windows серверами люди используют robocopy. В принцыпе robocopy отлично с этой задачей справляется, но только до тех пор пока Ваши сервера находсятся в одной подсети. Команда выглядит следующим образом: robocopy \\\\IP_сервера\\Имя_Папки Имя_диска:\\\\Путь\\к\\папке /MIR /Z /XA:H /W:5 Или наоборот: robocopy Имя_диска:\\\\Путь\\к\\папке \\\\IP_сервера\\Имя_Папки /MIR /Z /XA:H /W:5...","categories": ["Windows Server"],
        "tags": [],
        "url": "/synchronize-files-between-windows-servers/",
        "teaser":null},{
        "title": "Манипуляции с php-handlers в Plesk",
        "excerpt":"Просмотр списка php режимов из командной строки: /usr/local/psa/admin/sbin/php_handlers_control -list Из Mysql: select * from psa.ServiceNodeEnvironment where section=&amp;#8217;phphandlers&amp;#8217; Выбрать из базы режим php в соответсвии с доменом и каталогом сайта: select h.php_handler_id,d.name, h.www_root from hosting h join domains d on h.dom_id = d.id Другой вариант: mysql -uadmin -p$(cat /etc/psa/.psa.shadow) psa -e...","categories": ["Plesk"],
        "tags": [],
        "url": "/manage-php-handlers-plesk/",
        "teaser":null},{
        "title": "Установка Unison на CentOS 7",
        "excerpt":"Unison - одна из утилит, которая используется для репликации файлов между серверами. Большим достоинством Unison является поддержка master-master репликации. До недавнего времени Unison был доступен в репозитории Epel, но по незвестным причинам его там больше нету, поэтому предлагается его скомпилить из пакета с исходным кодом. Для этого нам понадобятся некие...","categories": ["Linux server"],
        "tags": [],
        "url": "/setup-unison-centos-7/",
        "teaser":null},{
        "title": "Безпарольный sudo для выполнения одной команды",
        "excerpt":"Допустим понадобилось нам разрешить одному пользователю в системе выполнить приложение, требующее sudo без ввода пароля. Для этого нужно отредактировать файл /etc/sudoers соответсвенно: имя_пользователя ALL = (ALL) NOPASSWD: /path/to/binary После этого пользователь сможет выполнить binary без ввода пароля следующим образом: sudo /path/to/binary Небольшой хак для того, чтобы и sudo вводить не...","categories": ["Linux server"],
        "tags": [],
        "url": "/passwordless-sudo-for-one-command/",
        "teaser":null},{
        "title": "Проблемы с повторным логином в Jenkins",
        "excerpt":"Сегодня столкнулся с проблемой повторного логина в Jenkins. После разрыва сессии в результате рестарта демона Tomcat мне предлагалось залогиниться по новой, вот только логины были неудачными. Виной всему была кука - JSESSIONID, которую нужно было удалять руками каждый раз перед повторным логином: для того чтобы все заработало нужно отредактировать конфиг...","categories": ["Jenkins"],
        "tags": [],
        "url": "/jenkins-login-issue-jsessionid/",
        "teaser":null},{
        "title": "Как выставить umask для файлов в одной только папке",
        "excerpt":"Umask в Linux - это шаблон прав доступа для создаваемых файлов. Как правило указывается глобально в файле /etc/profile или для каждого пользователя в файлах .bashrc в домашнем каталоге. Но что же делать, если umask выставлен 022 (файлы создаются с правами rw-r-r (0644), а папки создаются с rwx-rx-rx (0755)), но в...","categories": ["Linux server"],
        "tags": ["acl","umask"],
        "url": "/umask-per-folder-with-acl/",
        "teaser":null},{
        "title": "Проблема с авторизацией Vagrant при выполнении kitchen create в Chef",
        "excerpt":"Выполняя команду kitchen create при тестировании поваренной книги в Chef можно получить следующую ошибку при работе с Vagrant 1.8.5: default: Warning: Authentication failure. Retrying... Полный текст ошибки следующий: kitchen create -----&gt; Starting Kitchen (v1.11.1) -----&gt; Creating ... Bringing machine 'default' up with 'virtualbox' provider... ==&gt; default: Checking if box 'bento/centos-7.2'...","categories": ["Chef","Vagrant"],
        "tags": [],
        "url": "/vagrant-kitchen-create-chef/",
        "teaser":null},{
        "title": "Ошибка `not a TTY` при выполнении `docker exec`",
        "excerpt":"Я упущу предысторию как я столкнулся с этой проблемой, но самого факта это не меняет. Один из ansible playbook’ов, который недавно попал ко мне на ревизию, содержал несколько шагов, в которых с помощью shell модуля выполнялись операции в докер контейнерах с помощью docker exec. После обновления до последнего docker и...","categories": ["Docker"],
        "tags": [],
        "url": "/not-a-tty-docker-exec/",
        "teaser":null},{
        "title": "Настройка отказоустойчивого кластера для RabbitMQ",
        "excerpt":"RabbitMQ представляет собой универсальный способ обмена сообщениями между предложениями. Если Вы попали на эту страницу, значит Вы уже знаете что такое RabbitMQ, поэтому я не буду вдаваться в полемику. Эта статья описывает настройку кластера RabbitMQ на базе серверов Linux CentOS v.7. Фишка кластера в том, что в нем нету понятия...","categories": ["Linux server","Failover"],
        "tags": ["RabbitMQ"],
        "url": "/configure-rabbitmq-cluster/",
        "teaser":null},{
        "title": "Проблемы с ttf-mscorefonts-installer на Ubuntu 16.04",
        "excerpt":"Сегодня меня в конец достало назойливое уведомление о том, что ttf-mscorefonts-installer не смог установить все, что ему нужно. Это окошко появлялось несколько раз за день Каждый раз, когда я кликал кнопку Run this action now ничего хорошего не происходило. Утилита пыталась скачать установщики шрифтов с downloads.sourceforge.net и каждый раз терпела...","categories": ["Ubuntu Linux"],
        "tags": ["ttf-mscorefonts-installer"],
        "url": "/ttf-mscorefonts-installer-ubuntu-16-04/",
        "teaser":null},{
        "title": "Установка WireShark на Ubuntu 16.04/14.04",
        "excerpt":"WireShark предоставляет удобный функционал для анализа сетевого трафика.   Для Linux он доступен в виде пакета с исходным кодом, который можно скачать по следующей ссылке:     https://1.na.dl.wireshark.org/src/wireshark-2.2.5.tar.bz2   На много удобнее устанавливать уже готовый пакет. Для этого достаточно выполнить всего 2 шага:  sudo add-apt-repository ppa:wireshark-dev/stable apt-get update apt-get install wireshark  ","categories": ["Ubuntu Linux"],
        "tags": ["WireShark Ubuntu"],
        "url": "/install-wireshark-ubuntu-16-0414-04/",
        "teaser":null},{
        "title": "Уникальные IP адреса в access.log Apache",
        "excerpt":"Получить список уникальных IP адресов в лог файле вэбсервера Apache можно с помощью: cat access.log | awk '{print $1}' | sort -n | uniq -c | sort -nr | head -20 Она же сработает и для логов вэбсервера Nginx, носколько в обоих фарматах IP адрес посетителя является первым полем каждой...","categories": ["bash"],
        "tags": ["Apache","Nginx","logfile"],
        "url": "/unique-records-in-access-log-apache/",
        "teaser":null},{
        "title": "Установка nginx из исходников",
        "excerpt":"В разных случаях приходится компилировать ПО имея его исходники. Опять же хочу разводить демагогию на эту тему. Хочу рассказать как собрать nginx последней версии на CentOS v.6.3. Итак идем на nginx.org и скачиваем последнюю версию. (в моем случае это 1.9.9) wget http://nginx.org/download/nginx-1.9.9.tar.gz Распаковываем архив: tar xf nginx-1.9.9.tar.gz &amp;&amp; cd nginx-1.9.9...","categories": ["Nginx"],
        "tags": ["nginx from sources","установка nginx из исходного"],
        "url": "/install-nginx-from-sources/",
        "teaser":null},{
        "title": "Copy the Jenkins job",
        "excerpt":"Для начала вам нужно будет скопировать jenkins-cli.jar к себе на компьютер. Получаем список плагинов: java -jar ~/Downloads/jenkins-cli.jar -auth &lt;username&gt;:&lt;password&gt; -s https://&lt;jenkins_server_address&gt;/ list-jobs Находим в списке имя билда, который нас интересует и получаем сведенья о нем: java -jar ~/Downloads/jenkins-cli.jar -auth &lt;username&gt;:&lt;password&gt; -s https://&lt;jenkins_server_address&gt;/ get-job \"Build name\" |pbcopy pbpaste | java -jar...","categories": ["Jenkins"],
        "tags": ["Jenkins"],
        "url": "/copy-jenkins-jobs/",
        "teaser":null},{
        "title": "Jenkins auth over AWS Cognito",
        "excerpt":"Recently I had a case where I had to enforce the following options for Jenkins: Password policy (length, secial characters) MFA None of the plugins supports this but AWS Cognito does. Unfortunately there is no native Jenkins Cognito plugin so I stated to dig into OpenId Connect Authentication jenkins plugin...","categories": ["Jenkins","AWS"],
        "tags": ["Jenkins","Cognito"],
        "url": "/jenkins-login-with-cognito-in-aws/",
        "teaser":null}]
