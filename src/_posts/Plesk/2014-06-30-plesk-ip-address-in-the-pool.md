---
id: 1084
title: Ошибка пула IP адресов в Plesk
date: 2014-06-30T14:00:18+00:00
author: admin

guid: http://www.tech-notes.net/?p=1084
permalink: /plesk-ip-address-in-the-pool/
image: /wp-content/uploads/2014/02/sp-logo-plesk.png
categories:
  - Plesk
tags:
  - IP address pool
  - Plesk
---
Случается так, что при работе с Plesk версии 10 вылетает ошибка пула ip адресов:

```bash
Error: There is no IP address x.x.x.x in the pool
```

Появляется она в том случае, когда ip адрес абонемента (subscription) меняется через `Websites & Domains > Web Hosting Access`. При этом пул IP адресов абонемента очищается. Проблема существует в Plesk 10.4.4 в случае если включена опция `Open hosting operations` в панели администрирования `Tools & Settings > Interface Management.`

Фикситься через базу данных. Для начала учтем, что Plesk работает с базой `psa` и сделаем запасную копию:  
```bash
mysqldump -uadmin -p`cat /etc/psa/.psa.shadow ` psa > psa.sql
```

Дальше подключаемся к БД:  
```bash
mysql -uadmin -p`cat /etc/psa/.psa.shadow ` psa
```

И выполняем следующий запрос. В результате получаем список пулов, у которых нету значения pool_id:  
```sql
select distinct c.id, c.pname from clients c, domains d where d.cl_id = c.id and c.pool_id = 0;
```

[<img src="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095031.png" alt="Screenshot from 2014-06-30 09:50:31" width="315" height="123" class="aligncenter size-full wp-image-1085" srcset="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095031.png 315w, /wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095031-170x66.png 170w, /wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095031-300x117.png 300w" sizes="(max-width: 315px) 100vw, 315px" />](/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095031.png)

Дальше нужно узнать какой ip адрес был назначен клиенту с нашим idшником. Обратите внимание, что в значение **c.id** я подставил id с первого вывода:  
```sql
select distinct ip.id, ip.ip_address from domains d, clients c, dom_param dp, IP_Addresses ip where ip.id = dp.val and dp.param = 'ip_addr_id' and dp.dom_id = d.id and d.cl_id = c.id and c.id = 94;
```
[<img src="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095041.png" alt="Screenshot from 2014-06-30 09:50:41" width="235" height="111" class="aligncenter size-full wp-image-1086" srcset="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095041.png 235w, /wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095041-170x80.png 170w" sizes="(max-width: 235px) 100vw, 235px" />](/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095041.png)

Теперь тип пула в котором значится наш ip адрес:  
```sql
select type from ip_pool where id = (select pool_id from clients where type = 'admin') and ip_address_id = 6;
```
[<img src="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095513.png" alt="Screenshot from 2014-06-30 09:55:13" width="247" height="115" class="aligncenter size-full wp-image-1087" srcset="/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095513.png 247w, /wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095513-170x79.png 170w" sizes="(max-width: 247px) 100vw, 247px" />](/wp-content/uploads/2014/06/Screenshot-from-2014-06-30-095513.png)

Узнаем значение последней записи в таблице ip_pool и прибавляем к ней единицу:  
```sql
select max(id) + 1 from ip_pool;
```

Вставляем нужные значения в таблицу `ip_pool`. При этом учитываем номер последней записи в этой таблице, id ip адреса, который был назначен клиенту и тип ip адреса:  
```sql
insert into ip_pool (id, ip_address_id, type) values (101, 6, 'shared');
```

Обновляем таблицу clients:  
```sql
update clients set pool_id = 101 where id = 94;
```

<a href="http://kb.parallels.com/en/116060" target="_blank">http://kb.parallels.com/en/116060</a>
