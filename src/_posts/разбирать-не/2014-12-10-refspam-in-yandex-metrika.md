---
id: 2273
title: Непонятные страницы входа в Yandex.Metrika
date: 2014-12-10T14:38:31+00:00
author: admin

guid: http://www.tech-notes.net/?p=2273
permalink: /refspam-in-yandex-metrika/
image: /wp-content/uploads/2014/12/Yandex-Metrica.jpg
categories:
  - Безопасность
tags:
  - refspam yandex metrika
  - непонятные переходы в Yandex метрике
  - Непонятные страницы входа в Yandex Метрике
---
Не так давно появились у меня в Yandex.Metrika непонятные страници входа. Были переходы с erot.co, lumbia.co, ilovevitaly.ru и т.д. В резальтате недолгих поисков была найдена <a href="http://searchengines.guru/showthread.php?t=874562" title="http://searchengines.guru/showthread.php?t=874562" target="_blank">тема на форуме searchengines.guru</a> о том, что я не один такой. 

Оказалось, что благодаря <a href="http://searchengines.guru/showthread.php?t=866350" target="_blank">таким </a>людям я, и многие другие пользователи начали получать рэфспам в Yandex.Metrika.

Естественно тот факт, что мне досаждает какой-то прыщавый подросток, именуемый себя програмистом, меня раздосадовал. Неужели человек может подумать, что кто-то из вэб мастеров действительно станет переходить по ссылкам, которые у него появляются в Yandex.Metrika? При посещаемости в 10 человек/день, конечно можно нажать пару ссылок, но не больше одного раза. На второй день, как правило, соображающие люди начнут искать в интернете причину появления этого хлама в статистике. На этом эффективность подобной ерунды падает на 100%.

Казалось бы: `Чего тут такого? - Добавил пару фильтров в настройки метрики и живи дальше`. Собственно так я и сделал. Но через неделю посыпались и другие каки-бяки.

Человек создал утилиту, которая парсит рунэт и витягивает из сайтов idшники Yandex.Metrika. Большенство людей эту информацию размещают прямо в коде страниц сайтов и idшник можно увидеть в исходном коде.

Потом второй скритп бомбит Yandex.Metrika информацией о фиктивных посещениях сайтов с idшиками, которые удалось напарсить в рунэте.

<center>
  <div id="gads">
  </div>
</center>

### Рецепт спасения

Я удалил старый сайт из Yandex.Metrika и создал новую запись, тем самым получил новый id. Для меня не критична история посещений моих сайтов за последние пол года.

После этого я удалил из исходного кода информацию о Yandex.Metrika и создал js файл, который и подгружается в футере сайта.

Примерное содержимое файла:

```bash
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter<strong>id_сайта_в_метрике</strong> = new Ya.Metrika({id:<strong>id_сайта_в_метрике</strong>,
                    webvisor:true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true});
        } catch(e) { }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
```


Файл сохраняется в папке сайта на сервере, на пример `/var/www/html/js/metrika.js`

Теперь редактируем странцы сайта и добавляем следующее в конец, прямо перед закрытием тэга `</body>` (для WordPress - это footer.php в папке темы):

```bash
&lt;script type="text/javascript" src="/js/metrika.js"&gt;&lt;/script&gt;
```


Старый код можно удалить - он больше не нужен.

После этого Yandex.Metrika бадет работать, но id сайта не будет отображаться в исходном коде страницы.

Остается небольшая засада. Этот файл все равно можно считать и получить id сайта, прямым запросом URL типа:  
http://www.website.net/js/metrika.js

Осталось запретить доступ к файлам js, если referrer - не Ваш сайт.

### NginX:

Добавте в конфиг сайта следующие строки:

```bash
location ~* \.(js)$ {
        if ($http_referer !~* (website.net|www.website.net)){
            return 444;
        }
        root /var/www/html;
        expires 7h;
        access_log off;
    }
```


### Apache2:

Следающие строки можно добавлять как в конфиг сайта (секция Directory) так и в <a href="http://www.tech-notes.net/htaccess-notes/" title="Шпаргалка по .htaccess" target="_blank">.htaccess</a> прямо в корне:

```bash
RewriteEngine on
RewriteCond %{HTTP_REFERER} !(.*)website.net [NC]
RewriteCond %{REQUEST_FILENAME} \.js -f
RewriteRule .* - [F]
```


После этого попробуйте открыть файл metrika.js в браузере. Должно поругаться и ничего не вернуть.

Не скоро прыщавый злоумышленным сможет найти нужный js фал и тем более открыть его с целью получения id вашего счетчика в metrika.

После этого непонятные переходы в Yandex.Metrika не должны появляться еще очень долго.

<div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
  <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
  
  <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
</div>