---
id: 2828
title: Лечим инфицированный сайт/сервер
date: 2015-08-27T14:03:21+00:00
author: admin

guid: http://www.tech-notes.net/?p=2828
permalink: /fix-compromized-server/
image: /wp-content/uploads/2015/08/Peter-Griffin-Thumbs-up-2.png
categories:
  - Linux Server
  - Безопасность
---
Раз Вы читаете эту статью, значит Ваш сайт взломали. Вы увидели, что с с Вашего сервера рассылается спам(spam) и никак не можете определить что же с ним делать.

[<img src="/wp-content/uploads/2015/08/everything_is_horrible.jpg" alt="everything_is_horrible" width="380" height="133" class="aligncenter size-full wp-image-2849" srcset="/wp-content/uploads/2015/08/everything_is_horrible.jpg 380w, /wp-content/uploads/2015/08/everything_is_horrible-170x60.jpg 170w, /wp-content/uploads/2015/08/everything_is_horrible-300x105.jpg 300w" sizes="(max-width: 380px) 100vw, 380px" />](/wp-content/uploads/2015/08/everything_is_horrible.jpg)

Важно не паниковать, а строго следовать инструкциям:

  1. Просканировать Ваш сервер с помощью следующих утилит:
      * [ClamAV](http://www.tech-notes.net/use-clamav-clamscan-to-scan-linux-server/)
      * [Chkrootkit](http://www.tech-notes.net/scan-linux-server-with-chrootkit/)
      * [MalDetect](http://www.tech-notes.net/use-maldetect-to-scan-linux-server/)
      * [Lynis (бывший rkhunter)](http://www.tech-notes.net/scan-linux-server-with-lynis/)
  2. Удостовериться что [с вашего сервера разлетается спам](http://www.tech-notes.net/postfix-sends-spam/)

Удалить пару десятков файлов не означает, что уже все закончилось, поскольку утилиты найдут только то, о чем знают, а знают они далеко не все.

Нужно немного поковыряться руками. Переходим в папку с файлами сайта и ставим все в режим `только чтение`:

```bash
find . -type f -exec chmod 444 {} \;  
find . -type d -exec chmod 555 {} \;
```

Дальше начинаем искать использование функции `eval`:

```bash
grep 'eval(\|assert(\|gzinflate(' * -RI |cut -d `:` -f 1|grep -color '\.php' |sort -u  
grep 'eval (\|assert (\|gzinflate (' * -RI |cut -d `:` -f 1|grep -color '\.php' |sort -u  
grep "@.\*\$GLOBALS\['" \* -RI |cut -d `:` -f 1 |sort -u
```

А вот с реверсом функций eval и base64_encode столкнулся буквально сегодня:

```bash
grep 'edoced_46esab\|lave' * -RI |grep 'strrev' |sort -u
```

В результате Вы получаете список файлов. Нужно открыть каждый и посмотреть что в нем.

Даже не являясь бывалым админом или кодером Вы сможете отличить нормальный код от вредоносного.  
Вот первый пример:  
[<img src="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png" alt="Screenshot from 2015-08-24 16:36:53" width="996" height="374" class="aligncenter size-full wp-image-2829" srcset="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png 996w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653-170x64.png 170w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653-300x113.png 300w" sizes="(max-width: 996px) 100vw, 996px" />](/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163653.png)

Вот второй пример:  
[<img src="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png" alt="Screenshot from 2015-08-24 16:39:07" width="939" height="657" class="aligncenter size-full wp-image-2830" srcset="/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png 939w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907-170x119.png 170w, /wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907-300x210.png 300w" sizes="(max-width: 939px) 100vw, 939px" />](/wp-content/uploads/2015/08/Screenshot-from-2015-08-24-163907.png)

<center>
  <div id="gads">
  </div>
</center>

Самым тяжелым является поиск так называемого 'backdoor' или черного хода. Как правило он прячется к каком-то огромном файле в виде совсем обычного кода, поэтому его трудно найти.

### _Чтобы поймать преступника, нужно думать, как преступник._

[<img src="/wp-content/uploads/2015/08/136187719736.jpg" alt="136187719736" width="400" height="533" class="aligncenter size-full wp-image-2850" srcset="/wp-content/uploads/2015/08/136187719736.jpg 400w, /wp-content/uploads/2015/08/136187719736-128x170.jpg 128w, /wp-content/uploads/2015/08/136187719736-225x300.jpg 225w" sizes="(max-width: 400px) 100vw, 400px" />](/wp-content/uploads/2015/08/136187719736.jpg)

<center>
  <div id="gads">
  </div>
</center>

Если бы я писал бэкдор, то не хотел бы что бы мой скрипт писал какие-либо ошибки в логи. В противном случае умный админ его быстро увидит их. Для этого я выключил бы логирование с помощью php функции `error_reporting`

Её и можно поискать:

```bash
grep `error_reporting \*(.\*0.\*)` \* -RI |cut -d `:` -f 1 |grep php
```

На всякий случай убрал бы значение `error_log` с помощью `ini_set`:

```bash
grep "\@ini_set('error_log'" * -RI |cut -d ":" -f 1 |grep php
```

Для того что бы получить путь к текущему каталогу, я бы воспользовался функцией `getcwd()`:

```bash
grep "\@getcwd\(\)" * -RI |cut -d ":" -f 1 |grep php
```

В результате выполнения каждой из команды Вы получаете список файлов, каждый из которых нужно открыть и посмотреть содержимое.  
Вредоносный код удаляем, файлы переименуем. Создаем новый пустой файл с тем же именем и запрещаем его редактирование. Надежнее всего это делать с помощью утилиты `chattr`:

```bash
chattr +i **/путь/к/файлу**.php
```

Рекомендуется запретить следующие функции в php.ini:
  * passthru
  * system
  * shell_exec
  * exec
  * popen
  * proc_open
  * curl_multi_exec
  * parse_ini_file
  * show_source
  * pcntl_exec
  * getenv
  * getmygid
  * extract
  * parse_str

Находим в файле `php.ini` строку `disable_functions` и перечисляем их через запятую. После применения изменений не забудьте перезапустить apache.

В случае с 'Shared Hosting', как правило, можно подредактировать php.ini прямо в панели управления. К сожалению отключить функции можно только в php.ini. В .htaccess их засунуть не удастся.

**Внимание :** После таких изменений с Вашим сайтом могут начаться проблемы. Внимательно протестируйте его и убедитесь, что отключение функций не вызвало проблем. Что бы устранить проблемы ищите патчи и обновления для модулей Вашего сайта. Поищите замену функций на [php.net](http://php.net). Чем меньше функций Вы включите назад, тем меньше вероятность повторения проблем.

Сразу же в папке, в которую загружаются файлы (uploads, media, files) , рекомендую создать .htaccess со следующим содержанием:

```bash
<FilesMatch ”\.php$”>
    Deny from all
</FilesMatch>
```


В результате доступ к php файлам в папке будет запрещен. Даже если Вы сделаете папку загрузок доступной для записи, из нее нельзя будет запустить ничего вредоносного.

Дальше наблюдаем за сервером несколько дней/ночей/недель. В случае возобновления проблем - читаем логи, пытаемся определить каким образом новая бяка появилась в папках сайта. Ищем ее заново и удаляем.

Сразу же рассматриваем варианты переезда на новый сервер и обновления всего чего только можно (php, apache, nginx, плагины, CMS сайта).

На всякий случай можно поганять сайт следующими утилитами:

  * [unmaskparasites.com](http://www.unmaskparasites.com/)
  * [quttera.com](http://quttera.com/website-malware-scanner)
  * [sitecheck.sucuri.net](https://sitecheck.sucuri.net/)
