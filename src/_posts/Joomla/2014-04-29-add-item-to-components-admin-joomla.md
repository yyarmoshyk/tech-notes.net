---
id: 858
title: Добавить пункт в меню компонентов в админке Joomla!
date: 2014-04-29T13:42:58+00:00
author: admin

guid: http://www.tech-notes.net/?p=858
permalink: /add-item-to-components-admin-joomla/
image: /wp-content/uploads/2014/02/joomla-logo-vert-color.png
categories:
  - Joomla
tags:
  - joomla
  - админка
  - меню компонентов
---
После неудачного обновления плагина, или любого другого компонента Joomla!, случается неприятная ситуация - пропадает значек в меню. Его можно легко вернуть назад или добавить за ново.

Для этого нам понадобится следующая информация:

  * имя базы данных
  * префикс базы данных (у меня - **jml,** у Вас может отличаться)
  * имя пользователя и пароль

Всю эту информацию можно получить из файла `configuration.php`.

Дальше заходим в админку и проверяем доступен ли компонент админки по следующей ссылке:

`http:///www.<strong>your_site.com</strong>/administrator/index.php?option=com_<strong>component_name</strong>`

Дальше подключаемся к базе данных. Узнаем последний id  в таблице меню:

```bash
select id from <strong>jml</strong>_menu order by id desc limit 1;
```


Это нужно для того,что бы не перезаписать уже существующий элемент. При добавлении записи нужно увеличить это значение на 1. В моем случае последним был 323, мой компонент пойдет в базу с id 324.

Дальше вставляем нужную информацию в таблицу:

```sql
INSERT INTO `<strong>jml</strong>_menu` (`id`, `menutype`, `title`, `alias`, `note`,`path`, `link`, `type`, `published`, `parent_id`, `level`, `component_id`, `ordering`, `checked_out`, `checked_out_time`, `browserNav`, `access`, `img`, `template_style_id`, `params`, `lft`, `rgt`, `home`, `language`, `client_id`) VALUES (<strong>324</strong>, 'main', 'COM_<strong>COMPONENT_NAME</strong>', 'com-<strong>component_name</strong>', '', 'com-<strong>component_name</strong>', 'index.php?option=com_<strong>component_name</strong>', 'component', 0, 1, 1, 10034, 0, 0, '0000-00-00 00:00:00', 0, 1, '../media/com_<strong>component_name</strong>/icons/<strong>component_name</strong>.png', 0, '', 425, 426, 0, '', 1);
```

Убедитесь что иконка компонента существует в папке медиа. При необходимости подправте путь:
`media/com_<strong>component_name</strong>/icons/<strong>component_name</strong>.png`

Заходим в админку, смотрим меню компонентов.
