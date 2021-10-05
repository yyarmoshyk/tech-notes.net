---
id: 136
title: Мониторинг сайтов на коленке (bash script)
date: 2014-01-29T17:49:22+00:00
author: admin

guid: http://wp38.local/?p=136
permalink: /simple-web-checker/
lazy_seo_meta_key:
  - ""
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2014/01/5602646-check-mark-computer-generated-illustration-for-disign.jpg
categories:
  - мониторинг
tags:
  - bash
---
По роду деятельности мне приходится иметь дело с большим количеством сайтов. В виду специфики проектов приходится некоторое время следить за доступностью вэб ресурсов после окончания проекта.

Пришла мне мысль упростить это дело. Возиться с Nagios или Zabbix, ради такой простой задачи, не хотелось. В итоге получился вот такой вот скрипт, который выполняется на моем компьютере:

```bash
#/bin/bash
html=/var/www/servers_state.html
while true; do
	echo "<br><br><br>" > $html
	echo '<center><table width="40%" border="1" cellspacing="0" cellpadding="5" >' >> $html
	echo "<tr><td></td><td><b>HOST</b></td><td><b>State</b></td></tr>" >> $html
	i=1
	serverlist=(website1.com website2.com website3.com website4.com website4.com)
	for web in "${serverlist[@]}";do
		state=$(HEAD -t 8 $web |sed -n 1p)
		echo "<tr><td>$i</td><td>$ip</td><td>$state</td></tr>" >> $html
		if [ "$state" != "200 OK" ]
		then
						echo "Something is wrong with $ip" |mail -s "Invalid responce from $web" \ yourmail@domain.com
		fi
	let "i = $i +1"
done
echo "</table>" >> $html
echo "<br>" >> $html
echo "<p>Last updated at $(date +%H:%M:%S)</p>" >> $html
echo "</center>" >> $html
sleep 30
done
```


Переменная `serverlist` содержит список сайтов, которые нужно проверять.  

Скрипт каждые 30 секунд бросает HEAD запрос каждому сайту из списка `serverlist` и проверяет код ответа. Вся эта информация записывается в файл servers_state.html. Если код ответа отличается от `200` - скрипт шлет уведомление мне на почту.  
В итоге я имею табличку с состоянием сайтов на момент предыдущей прогонки скрипта по адресу

```bash
http://localhost/servers_state.html
```


А в почте имею информацию о недоступности ресурсов с точностью до 30 секунд.

На самом деле схему уведомления я немного упростил. На практике уведомления можно отправлять не на почту, а, скажем, в [Skype.](/skype4py-send-skype-messages-from-bash/)
