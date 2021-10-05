---
id: 2738
title: Проблема с utf8mb4_unicode_ci
date: 2016-01-06T08:40:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=2738
permalink: /utf8mb4_unicode_ci-issue-mysql/
image: /wp-content/uploads/2014/09/thinknook-new-logo3.png
categories:
  - MySQL
---
Во время восстановления дампа базы `mysql` выскакивает вот такая ошибка:

```bash
ERROR 1273 (HY000) at line ###: Unknown collation: 'utf8mb4_unicode_ci'  
ERROR 1115 (42000) at line ###: Unknown character set: 'utf8mb4'
```

Для корректного восстановления нужно немного подредактировать дамп, который собираетесь восстановить, а именно заменить `utf8mb4_unicode_ci` на `utf8_general_ci`.

В среде `bash` очень удобно воспользоваться `sed`:

```bash
sed -i 's/CHARSET=utf8mb4\ COLLATE\=utf8mb4_unicode_ci/CHARSET=utf8\ COLLATE=utf8_general_ci/g' имя_базы.sql  
sed -i 's/COLLATE\ utf8mb4_unicode_ci/COLLATE\ utf8_general_ci/g' имя_базы.sql  
sed -i 's/CHARACTER\ SET\ utf8mb4\ COLLATE\ utf8mb4_bin/CHARACTER\ SET\ utf8\ COLLATE\ utf8_general_ci/g' имя_базы.sql
```

После этого можно спокойно восстанавливать базу.
