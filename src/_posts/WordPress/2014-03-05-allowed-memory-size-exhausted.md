---
id: 629
title: Нехватка памяти на сервере для WordPress или как быть с php memory_limit
date: 2014-03-05T14:45:12+00:00
author: admin

guid: http://www.tech-notes.net/?p=629
permalink: /allowed-memory-size-exhausted/
image: /wp-content/uploads/2014/03/wordpress_logo.png
categories:
  - WordPress
tags:
  - Allowed memory size
  - memory_limit
  - WP_MEMORY_LIMIT
---
Сегодня при входе в админку блога получил пот такую вот ошибку:

```bash
Allowed memory size 67108864 bytes exhausted (tried to allocate 139650 bytes) ../class.wp-scripts.php on line 154
```

Сам блог работает, а вот в админку не попасть. По скольку он (блог) размещен на shared хостинге, при чем в бесплатном аккаунте, я немного расстроился. Поскольку подозреваю, что увеличить лимит памяти для php у меня не получится.

Есть несколько вариантов как поступать в таких ситуациях:  
1. Увеличить php_memory_limit в `.htaccess`:  
```bash
php_value memory_limit 128M
```

К сожалению это может не сработать, если в настройках apache Вашего хостера прописано `AllowOwerride none`

2. Увеличить `php_memory_limit` средствами php. Для этого можно добавить вот такую строку в `index.php`:  
```bash
ini_set('memory_limit', '128M');
```

Обидно то, что если у Вашего хостера в настройках php включен `safe_mode`, то предложенный вариант не поможет.

3. **Добавляем следующее в файл wp-config.php**:  
```bash
define( 'WP_MEMORY_LIMIT', '128M' );
```

Заходим в админку и радуемся жизни. Можно отключить пару плагинов.
