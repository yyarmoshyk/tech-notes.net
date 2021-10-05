---
id: 2251
title: Настройка ETags в IIS7
date: 2014-12-02T21:22:43+00:00
author: admin

guid: http://www.tech-notes.net/?p=2251
permalink: /configure-etags-iis7/
image: /wp-content/uploads/2014/12/iis7-logo.jpg
categories:
  - IIS
tags:
  - etags
  - iis
  - web.config
---
Entity tags (ETags) - это механизм, с помощью которого web сервера и браузеры определяют соответствует ли эллемент в кэше браузера объекту на сервере.

Поскольку ETags, как правило, построены с использованием атрибутов, которые делают их уникальными для конкретного сервера, на котором размещается сайт, теги не будут совпадать, когда браузер получает оригинальный компонент с одного сервера, а затем пытается проверить этот компонент на другом сервере.

Настраиваются ETags в мэнэджере Internet Information Services (IIS).

Так как ETags добавляется к заголокам, которые сервер отправляет клиента (Response headers), нас интересует соответствующий пункт:  
[<img src="/wp-content/uploads/2014/12/IIS-Configure-ETags-01s.jpg" alt="IIS-Configure-ETags-01s" width="600" height="564" class="aligncenter size-full wp-image-2252" srcset="/wp-content/uploads/2014/12/IIS-Configure-ETags-01s.jpg 600w, /wp-content/uploads/2014/12/IIS-Configure-ETags-01s-170x159.jpg 170w, /wp-content/uploads/2014/12/IIS-Configure-ETags-01s-300x282.jpg 300w" sizes="(max-width: 600px) 100vw, 600px" />](/wp-content/uploads/2014/12/IIS-Configure-ETags-01s.jpg)

Создаем новый header:  
[<img src="/wp-content/uploads/2014/12/IIS-Configure-ETags-02s.jpg" alt="IIS-Configure-ETags-02s" width="600" height="290" class="aligncenter size-full wp-image-2253" srcset="/wp-content/uploads/2014/12/IIS-Configure-ETags-02s.jpg 600w, /wp-content/uploads/2014/12/IIS-Configure-ETags-02s-170x82.jpg 170w, /wp-content/uploads/2014/12/IIS-Configure-ETags-02s-300x145.jpg 300w" sizes="(max-width: 600px) 100vw, 600px" />](/wp-content/uploads/2014/12/IIS-Configure-ETags-02s.jpg)

Называем его ETags:  
[<img src="/wp-content/uploads/2014/12/IIS-Configure-ETags-03s.jpg" alt="IIS-Configure-ETags-03s" width="600" height="464" class="aligncenter size-full wp-image-2254" srcset="/wp-content/uploads/2014/12/IIS-Configure-ETags-03s.jpg 600w, /wp-content/uploads/2014/12/IIS-Configure-ETags-03s-170x131.jpg 170w, /wp-content/uploads/2014/12/IIS-Configure-ETags-03s-300x232.jpg 300w" sizes="(max-width: 600px) 100vw, 600px" />](/wp-content/uploads/2014/12/IIS-Configure-ETags-03s.jpg)

Как вариант можно добавить их прямо в `web.config` в секцию `system.webServer`:

```bash
<system.webServer>
   ...
        <httpProtocol>
            <customHeaders>
                <add name="ETag" value="""" />
            </customHeaders>
        </httpProtocol>
   ...
</system.webServer>
```


На этом все. ETags появится в заголовках.
