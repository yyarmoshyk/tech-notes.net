---
id: 309
title: 'Bash: Сохранение конфигурации отдельного виртуального хоста Apache'
date: 2014-04-30T18:41:28+00:00
author: admin

guid: http://www.tech-notes.net/?p=309
permalink: /bash-show-configs-for-apache-vhosts/
image: /wp-content/uploads/2014/02/bash.jpg
categories:
  - bash
tags:
  - головоломки bash
  - задачи bash
---
Начинаю цикл статей с интересными задачками по Bash.

Задачка о том, как вырезать часть файла конфигурации apache.  
<!--more-->


**Задача**: Известно, что на сервере Apache2, который работает в CentOS v.6, настроено около 50 сайтов. Дальше опциональное условие: все они описаны минимум в трех конфигурационных файлах (их расположение не известно). Нужно написать Bash скрипт, который получит из трех конфигурационных файлов, настройки для 4-х сайтов и сохранит их в отдельные файлы или в один отдельный файл. Список сайтов:

  * website1.com
  * website2.net
  * website3.info
  * website4.org

Полагаю, что может быть два типа читателей:  
1. Тот, кто ищет головоломку.  
2. Тот, кто ищет решение.

Для второго типа читателей выкладываю дальнейший скрипт:  
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript">

<div class="spoiler-wrap">
  <div class="spoiler-head folded">Раскрой меня</div>
    <div class="spoiler-body" style="display: none;">
<div class="language-bash highlighter-rouge">
# Объявляем список сайтов
sites=(website1.com website2.net website3.info website4.org);
# Создаем цикл проходки по списку сайтов
for website in $sites;
do
# Получаем информацию о конфиге, в котором описан хост
    config=$(apachectl -S 2>&1 |grep "80 namevhost $website" |cut -d "(" -f 2 |cut -d ":" -f1);
    if [[ $config != "" ]];
        then
        # Описание начала конфига
        start=$(apachectl -S 2>&1 |grep "80 namevhost $website" |cut -d ":" -f 2 |cut -d ")" -f 1);
        # Описание конца конфига
        eof=$(cat $config |wc -l)
        end=$(cat -n $config |sed -n "$start,$eof"p |grep "</Virtual.ost>" |sed -n '1p' |awk '{print $1}');
        # Вырезаем настройки хоста из конфига
        sed -n "$start","$end"p $config >> extracted_hosts.conf;
        echo "" >> extracted_hosts.conf;
     else
        echo "check $website";
     fi;
done
# Создаем цикл проходки по списку ssl сайтов
for website in $sites;
do
# Получаем информацию о конфиге, в котором описан хост
    config=$(apachectl -S 2>&1 |grep "443 namevhost $website" |cut -d "(" -f 2 |cut -d ":" -f1);
    if [[ $config != "" ]];
        then
        # Описание начала конфига
        start=$(apachectl -S 2>&1 |grep "443 namevhost $website" |cut -d ":" -f 2 |cut -d ")" -f 1);
        # Описание конца конфига
        eof=$(cat $config |wc -l)
        end=$(cat -n $config |sed -n "$start,$eof"p |grep "</Virtual.ost>" |sed -n '1p' |awk '{print $1}');
        # Вырезаем настройки хоста из конфига
        sed -n "$start","$end"p $config >> extracted_hosts.conf;
        echo "" >> extracted_ssl_hosts.conf;
     else
        echo "check $website";
     fi;
done
</div>
    </div>
</div>
<br><br>
Если изменить имя файла `extracted_host.conf` на `$website.conf`, тогда конфиг каждого сайта будет сохранен в отдельный файл.
