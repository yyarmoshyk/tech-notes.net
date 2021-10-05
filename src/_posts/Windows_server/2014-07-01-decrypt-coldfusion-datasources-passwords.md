---
id: 819
title: Список пользователей и паролей ColdFusion DataSources
date: 2014-07-01T10:18:36+00:00
author: admin

guid: http://www.tech-notes.net/?p=819
permalink: /decrypt-coldfusion-datasources-passwords/
image: /wp-content/uploads/2014/04/Coldfusionmx7hosting.gif
categories:
  - Windows server
tags:
  - ColdFusion
---
В настройках ColdFusion соединение с базами данных можно описать в админке в разделе `DataSources`. Но что же делать, если пароли нескольких или всех пользователей были утрачены?

[<img src="/wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2-300x187.jpg" alt="2f6f31b946b74db396749c297545dee2" width="300" height="187" class="aligncenter size-medium wp-image-825" srcset="/wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2-300x187.jpg 300w, /wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2.jpg 600w" sizes="(max-width: 300px) 100vw, 300px" />](/wp-content/uploads/2014/04/2f6f31b946b74db396749c297545dee2.jpg)

Как ни странно сам CF вам и поможет из декодировать из того, что в нем имеется.

Вашему вниманию предлагается скрипт, который выдаст вам на блюдечке, то есть в табличке, список всех пользователей и их пароли.

Для этого можно в папке папке `C:\inetpub\wwwroot\CFIDE` создать файл `decrypt.cfm` c вот таким содержанием:
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="/assets/js/spoiler.js" type="text/javascript">
<div class="spoiler-wrap">
  <div class="spoiler-head folded">
    Тело скрипта
  </div>
  <div class="spoiler-body">
  <pre>
  <cfset objDS = createobject("java","coldfusion.server.ServiceFactory")
  .getDatasourceService().getDatasources() />
  <cfoutput>
    <table border="1" cellpadding="3" cellspacing="0" width="50%">
    <tr>
      <th><b>DataSource</b></th>
      <th><b>Username</b></th>
      <th><b>Password</b></th>
    </tr>
    <cfloop collection="#objDS#" item="Key">
    <cfif len(objDS[Key]["password"])>
    <cfset password = Decrypt(objDS[Key]["password"],generate3DesKey("0yJ!@1$r8p0L@r1$6yJ!@1rj"), "DESede","Base64") />
    <tr>
      <td>#objDS[key].name#</td>
      <td>#objDS[key].username#</td>
      <td>#password#</td>
    </tr>
    </cfif>
    </cfloop>
    </table>
  </cfoutput>
  </pre>
  </div>
</div>

Дальше заходим по ссылке следующего типа и смотрим:
http://ip_адрес_вашего_сервера/CFIDE/decrypt.cfm
