---
id: 1362
title: Как я проверял Moodle на прочность
date: 2014-08-12T18:50:10+00:00
author: admin

guid: http://www.tech-notes.net/?p=1362
permalink: /moodle-load-test/
image: /wp-content/uploads/2014/08/moodle_logo.jpg
categories:
  - Other CMS
tags:
  - Moodle
  - Нагрузочное тестирование
---
Появилась задачка проверить сколько одновременных пользователей выдержит сайт на базе moodle.

Вернее даже так `Выдержит ли Moodle 1000 одновременных пользовательских сессий`

Тема про нагрузочное тестирование довольно популярна в современном мире, поскольку каждый хозяин интернет ресурса желает знать предел его возможностей, и, по возможности, расширить этот предел.

Сценарий поведения был такой:  
1. Заходим на сайт.  
2. Логинимся.  
3. Переходим на страницу c опросом/экзаменационным билетом (quiz)  
4. Жмем кнопку `Attempt quiz`  
5. Заполняем форму и сабмитим ее.  
6. Подтверждаем свои ответы.

В качестве генератора трафика использовался продукт [LoadStorm](http://loadstorm.com/).

По ходу выполнения сценария нужно учитывать следующие факты:  
1. Пользователь/студент не может одновременно заполнять один и тот же quiz несколько раз. Поэтому нужно сгенерировать нужное количество пользователей и импортировать его в moodle. В LoadStorm этих же пользователей нужно тоже добавить. Вот только файлы будут отличаться.  
2. Кнопка в четвертом пункте не может быть вызвана кликом на странице. Это функция отправки формы со значением `Attempt quiz now`. Если пользователь/студент уже попробовал пройти quiz, значение функции меняется на `re-attempt quiz`.

Для начала сгенерируем csv файл для импорта в базу пользователей moodle. Можно сделать с помощью табличного процессора типа Exel,Libre Office Calc или создать таблицу в GoogleDrive. Вот только у меня не получилось сгенерировать уникальные email адреса по типу user1@mail.com, user2@mail.com ... user1000@mail.com.

Поэтому я воспользовался маленьким циклом в bash.

Для начала создадим файл и внесем в него обязательные поля:

```bash
echo `username,password,firstname,lastname,email` >> mdl_users.csv
```

Затем заполним этот файл нужной информацией:

```bash
i=0 && while [ $i -le 1000 ]; do echo `user$i,password$i,user$i,user$i,user$i@tempmail.com` >> mdl_users.csv; let `i = $i + 1`; done
```

**Не забудьте сделать резервную копию базы данных moodle**

Теперь импортируем пользователей в moodle. Для этого заходим на сайт используя учетную запись администратора. Дальше, как показано на скриншоте, разворачиваем `Site administration -> Users -> Accounts`  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-135801.png" alt="Screenshot from 2014-08-12 13:58:01" width="386" height="360" class="aligncenter size-full wp-image-1363" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-135801.png 386w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-135801-170x158.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-135801-300x279.png 300w" sizes="(max-width: 386px) 100vw, 386px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-135801.png)

<center>
  <div id="gads">
  </div>
</center>

Выбираем пункт `Upload Users` и получаем вот такую форму. Можно просто перетащить csv файл в нужную область:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000.png" alt="Screenshot from 2014-08-12 14:00:00" width="1221" height="612" class="aligncenter size-full wp-image-1364" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000.png 1221w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000-170x85.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000-300x150.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000-1024x513.png 1024w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000-660x330.png 660w" sizes="(max-width: 1221px) 100vw, 1221px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140000.png)

Дальше все логически понятно. Не буду заострять на этом внимание.

Также логически понятно, почему пользователи не имеют доступа к нужному опроснику (quiz'у) - их попросту нету в списке разрешенных пользователей.

Для этого в секции administration переходим в `Cource administration -> Users` и жмем `Enrollment methods`:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140407.png" alt="Screenshot from 2014-08-12 14:04:07" width="383" height="347" class="aligncenter size-full wp-image-1366" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140407.png 383w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140407-170x154.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140407-300x271.png 300w" sizes="(max-width: 383px) 100vw, 383px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140407.png)

К сожалению я не нашел как это проделать с помощью mysql запроса. Поэтому 1000 пользователей руками добавлял в курс. В столбце под словом `Edit` есть маленький символ человека со знаком `+` (плюс). Его и нажимаем:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539.png" alt="Screenshot from 2014-08-12 14:05:39" width="1031" height="265" class="aligncenter size-full wp-image-1367" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539.png 1031w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539-170x43.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539-300x77.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539-1024x263.png 1024w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539-660x169.png 660w" sizes="(max-width: 1031px) 100vw, 1031px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-140539.png)

В новом окне Вы увидите два поля. Правое будет утверждать, что не может отобразить всех пользователей и предлагать использовать поиск. Искал пользователей я по принципу:  
				0. user100  
				0.1. user10  
				0.2. user1  
				1.0. user20  
				1.1. user2  
				2.0. user30  
				2.1. user3  
				и т.д.

После этого переходим к манипуляциям с LoadStorm. Для начала сгенерируем файл с логинами и паролями:

```bash
echo `username,password` >> mdl_load_storm_users.csv
```

Затем заполним этот файл нужной информацией:

```bash
i=0 && while [ $i -le 1000 ]; do echo `user$i,password$i` >> mdl_load_storm_users.csv; let `i = $i + 1`; done
```

В это же случае можно воспользоваться табличными процессорами, о которых я упоминал ранее.

<center>
  <div id="gads">
  </div>
</center>

Далее создаем учетную запись в LoadStorm. Логинимся в нее. Добавляем свой сервер. Верифицируем его. Я не буду приводить скриншоты по каждому из шагов.

В разделе `Form Data Sets` жмем кнопку `Upload data` и загружаем файл с названием mdl_load_storm_users.csv и даем ему название в соответствующем поле.

Дальше создаем план теста. В нем создаем сценарий. На странице создания сценария выбираем название загруженного нами файла mdl_load_storm_users.csv из выпадающего меню `Form Data set`.

Ставим галочки на против `Download and execute javascript` и `Download images`. Жмем кнопку `Save`.

Система должна открыть страницу с вашим сценарием. Внизу будет пустая таблица, в которой со временем будут отображаться созданные Вами шаги теста.

Для создания шага нажмите кнопку `Add step`. На новой странице выберите свой сервер из выпадающего меню и отметьте опцию `Open page`, в текстовое поле введите адрес страницы для логина и нажмите Save:  
`/login/index.php`

В результате Вы увидите страницу о том, как LoadStorm видит Ваш сайт:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130.png" alt="Screenshot from 2014-08-12 14:31:30" width="989" height="477" class="aligncenter size-full wp-image-1368" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130.png 989w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130-170x81.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130-300x144.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130-660x318.png 660w" sizes="(max-width: 989px) 100vw, 989px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143130.png)

Жмем `New step`. В новом окне выбираем пункт `Submit form` и приводим его к следующему виду:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143253.png" alt="Screenshot from 2014-08-12 14:32:53" width="645" height="301" class="aligncenter size-full wp-image-1369" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143253.png 645w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143253-170x79.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143253-300x140.png 300w" sizes="(max-width: 645px) 100vw, 645px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143253.png)

Жмем `New step`. Выбираем `Open page` и вводим адрес нужного quiz'а:  
`/mod/quiz/view.php?id=1`

Жмем `New step`. Выбираем пункт `Submit form` и приводим его к следующему виду:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143530.png" alt="Screenshot from 2014-08-12 14:35:30" width="427" height="139" class="aligncenter size-full wp-image-1370" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143530.png 427w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143530-170x55.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143530-300x97.png 300w" sizes="(max-width: 427px) 100vw, 427px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-143530.png)

В этот момент на сервере я запустил скрипт, который очищает таблицу с попытками прохождения опросов/quiz'ов, потому что значение для отправки формы меняется после первого прохождения опроса и LoadStorm больше не сможет обработать эту форму. Скрипт выглядит вот так:

```bash
while true; do echo `delete from **moodle**.**mdl_**quiz_attempts where quiz = **1**;` |mysql; echo `Flushed`; sleep 5; done
```

где:  
moodle - имя базы данных  
mdl_ - префикс таблиц базы данных  
1 - idшник нужного quiz'a.

получить список quiz'ов можно вот таким sql запросом:

```bash
select * from moodle1.mdl_quiz \mG;
```

или

```bash
select id,name,intro from moodle1.mdl_quiz;
```

<center>
  <div id="gads">
  </div>
</center>

Жмем `New step`. Получаем форму опросника с кучей полей. Если не получили - выберите пункт `Submit form`. Пробовал проставить галочки на всех, но по какой-то причине форма отправляется в пустом виде. Можно не заморачиваться и приступать к следующему шагу. Прокручиваем страницу вниз, находим и отмечаем следующий пункт:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144217.png" alt="Screenshot from 2014-08-12 14:42:17" width="431" height="154" class="aligncenter size-full wp-image-1371" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144217.png 431w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144217-170x60.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144217-300x107.png 300w" sizes="(max-width: 431px) 100vw, 431px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144217.png)

Жмем `New step`. Выбираем пункт `Submit form` и приводим его к следующему виду:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144309.png" alt="Screenshot from 2014-08-12 14:43:09" width="446" height="141" class="aligncenter size-full wp-image-1372" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144309.png 446w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144309-170x53.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144309-300x94.png 300w" sizes="(max-width: 446px) 100vw, 446px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144309.png)

По окончанию жмем `Save`. Сценарий готов. Можно приступать к тестированию.

На странице сценариев можно нажать кнопку `Run steps` что бы удостовериться в том, что все шаги работают. Получите вывод:  
[<img src="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544.png" alt="Screenshot from 2014-08-12 14:45:44" width="987" height="238" class="aligncenter size-full wp-image-1373" srcset="/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544.png 987w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544-170x40.png 170w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544-300x72.png 300w, /wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544-660x159.png 660w" sizes="(max-width: 987px) 100vw, 987px" />](/wp-content/uploads/2014/08/Screenshot-from-2014-08-12-144544.png)

Если что-то не так - убедитесь что на сервере выполняется скрипт для очистки таблицы с попытками прохождения опросов/quiz'ов.

На этом рассмотрение подхода к нагрузочному тестированию Moodle закончено. Как запустить тест - можно легко разобраться, благо дело интерфейс очень дружелюбный.
