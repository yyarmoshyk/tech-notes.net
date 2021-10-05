---
id: 1051
title: Автоматический прием Яндекс.Денег на сайте на php
date: 2014-06-11T14:41:45+00:00
author: admin

guid: http://www.tech-notes.net/?p=1051
permalink: /accept-yandex-money-on-the-website-with-php/
image: /wp-content/uploads/2014/06/yandex_money.png
categories:
  - FromHabrSandbox
  - PHP
tags:
  - прием Яндекс.Денег
---
На самом деле не нужны никакие библиотеки для обычного прием Яндекс.Денег на сайте. А вся интеграция укладывается в три этапа.

### Этап 1: Настройка на стороне Яндекс.Деньги

Заходим <a href="https://sp-money.yandex.ru/myservices/online.xml" target="_blank">сюда</a> и:  
— вводим адрес, по которому система Яндекс.Деньги должна стучаться, когда поступит платеж на ваш кошелек.  
— смотрим секрет и записываем его в свой скрипт для приема (ниже есть пример).  
— ставим галочку «Отправлять уведомления»  
— нажимаем сохранить.

Все. Настройка со стороны яндекс окончена.

### Этап 2: Генерация формы оплаты для вашего сайта

Заходим <a href="https://money.yandex.ru/embed/quickpay/shop.xml" target="_blank">сюда</a> и генерируем любую понравившуюся Вам форму. Можно также использовать кнопку-приниматель и для благотворителей. Все они по своей сути абсолютно одинаковые. Получим код вида:

```bash
&lt;iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/shop.xml?account=00000000000&quickpay=shop&payment-type-choice=on&writer=seller&targets=1&targets-hint=&default-sum=&button-text=01" width="450" height="200"&gt;&lt;/iframe&gt;
```


При выводе формы оплаты на вашем сайте добавляем в get-параметры фрейма параметр label, в котором указываем, например id пользователя, которому хотим пополнить баланс на вашем сайте (**добавили параметр label=1**):

```bash
&lt;iframe frameborder="0" allowtransparency="true" scrolling="no" src="https://money.yandex.ru/embed/shop.xml?account=00000000000&quickpay=shop&payment-type-choice=on&writer=seller&targets=1&targets-hint=&default-sum=&button-text=01&label=1" width="450" height="200"&gt;&lt;/iframe&gt;
```


Размещаем форму у себя на сайте. Все. На этом второй этап завершен.

<center>
  <div id="gads">
  </div>
</center>

### Этап 3: Настройка на вашем сайте

По адресу, который Вы указали в настройках яндекса должен размещаться скрипт, который обрабатывает информацию, получаемую от сервиса яндекс.Деньги.

<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Скрипт для приема:
  </div>
  
  <div class="spoiler-body">
    </p> 
    
    ```bash
&lt;?php
$secret = '000000000000000000000'; // секрет, который мы получили в первом шаге от яндекс.
// получение данных.
$r = array(
			    // p2p-incoming / card-incoming - с кошелька / с карты
			    'notification_type' => $_POST['notification_type'], 
			    // Идентификатор операции в истории счета получателя.
			    'operation_id'      => $_POST['operation_id'],   
			    // Сумма, которая зачислена на счет получателя.   
			    'amount'            => $_POST['amount'], 
			    // Сумма, которая списана со счета отправителя.           
			    'withdraw_amount'   => $_POST['withdraw_amount'],   
			    // Код валюты — всегда 643 (рубль РФ согласно ISO 4217).
			    'currency'          => $_POST['currency'],            
			    // Дата и время совершения перевода.
			    'datetime'          => $_POST['datetime'],          
			    // Для переводов из кошелька — номер счета отправителя. 
			    // Для переводов с произвольной карты — параметр содержит пустую строку.
			    'sender'            => $_POST['sender'],            
			    // Для переводов из кошелька — перевод защищен кодом протекции. 
			    // Для переводов с произвольной карты — всегда false.
			    'codepro'           => $_POST['codepro'],           
			    // Метка платежа. Если ее нет, параметр содержит пустую строку.
			    'label'             => $_POST['label'],             
			    // SHA-1 hash параметров уведомления.
			    'sha1_hash'         => $_POST['sha1_hash']          
);

// проверка хеш
if (sha1($r['notification_type'].'&'.
			         $r['operation_id'].'&'.
			         $r['amount'].'&'.
			         $r['currency'].'&'.
			         $r['datetime'].'&'.
			         $r['sender'].'&'.
			         $r['codepro'].'&'.
			         $secret.'&'.
			         $r['label']) != $r['sha1_hash']) {
			    // останавливаем скрипт. у вас тут может быть свой код.
			    exit('Верификация не пройдена. SHA1_HASH не совпадает.'); 
}

// обработаем данные. нас интересует основной параметр label и withdraw_amount 
// для получения денег без комиссии для пользователя.
// либо если вы хотите обременить пользователя комиссией - amount, 
// но при этом надо учесть, что яндекс на странице платежа будет писать "без комиссии".
$r['amount']          = floatval($r['amount']);
$r['withdraw_amount'] = floatval($r['withdraw_amount']);
 // здесь я у себя передаю id юзера, который пополняет счет на моем сайте. поэтому обрабатываю его intval
$r['label']           = intval($r['label']);

// дальше ваш код для обновления баланса пользователя 
// для вставки полученного платежа в историю платежей, например:
// ваш запрос в базу
db_query('INSERT INTO payments (user_id, amount) VALUES('.$r['label'].', ',$r['amount']')'); 
?&gt;
```

    
    <p>
      </div> </div> 
      
      <p>
        Вот и все. Три простых шага, и Вы спокойно принимаете денежки от ваших пользователей на вашем сайте с оповещением на сайт. Код php принципиально не содержит никаких проверок, так как я просто хотел показать как именно оно все работает.
      </p>
      
      <p>
        <a href="http://habrahabr.ru/sandbox/83253/" target="_blank">Оригинал статьи</a>
      </p>
      
      <div style="padding-bottom:20px; padding-top:10px;" class="hupso-share-buttons">
        <!-- Hupso Share Buttons - http://www.hupso.com/share/ -->
        
        <a class="hupso_pop" href="http://www.hupso.com/share/"><img src="http://static.hupso.com/share/buttons/button120x28.png" style="border:0px; width:120; height: 28; " alt="Share Button" /></a><!-- Hupso Share Buttons -->
      </div>