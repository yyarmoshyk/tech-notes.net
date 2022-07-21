---
id: 920
title: Simulate https (ssl) session using the rewrite module
date: 2014-05-05T18:49:17+00:00
author: admin

guid: http://www.tech-notes.net/?p=920
permalink: /simulate-https-or-ssl-session-with-mod-rewrite/
image: /wp-content/uploads/2014/03/rewrite-small.png
categories:
  - Apache
tags:
  - rewrite https
  - SSL
---
In this article I want to touch on the topic of load balancing https connections.

Most load balancers support the so-called `ssl termination`. In this case, the client establishes a secure session with the load balancer and an ssl handshake occurs on the load balancer itself. The ssl certificate is sent from load balancer to the client. Next the balancer establishes a session with the server itself and receives content from it. A new packet is formed from the received data and sent to the client.

SSL or https connections to create bigger load on the server itself comparing to http. It would seem that in order to remove unnecessary load from the server you can specify the http address of the server in the balancer settings as a back-end for the ssl session and everything will be great.

Yes that's bad luck: most of the cms systems (wordpress, joomla, magento, etc.) have a checks for secure connections. If an insecure session is detected the site will redirect the visitor to https. The load balancer will again deliver it to the http port and the browser will display a message to the client that the page cannot be processed because of an endless redirect.

PHP applications check for the presence of an HTTPS variable with a value of `on` in the `SERVER` environment. The value of `SERVER_PORT` can also be checked. In order to deceive the application you can manually create this variable.

To do this, open the config of the virtual https host. I recommend describing it separately.
Change the value of `SSLEngine` from ``on`` to ``off``.

Now paste the following lines into the configuration file:

```bash
Rewrite Engine on
RewriteRule .* - [E=HTTPS:on]
```

If that doesn't help, add the following line:
```bash
RewriteRule .* - [E=SERVER_PORT:443]
```

Or:
```bash
SetEnvIf X-Forwarded-Proto https HTTPS=on
```

This will make the CMS system think that all requests comming to it are secure hsttps) and will skip redirect.