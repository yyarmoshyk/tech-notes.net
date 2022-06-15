---
id: 57
title: What is SSL and how it works
date: 2013-12-13T20:08:03+00:00
author: admin

guid: http://wp38.local/?p=57
permalink: /ssl-tutorial/
lazy_seo_meta_key:
  - ssl
lazy_seo_meta_key_geo:
  - geo1
image: /wp-content/uploads/2014/01/download.jpg
categories:
  - SSL
  - Security
---
[<img class="size-full wp-image-57 aligncenter" alt="download" src="/wp-content/uploads/2013/11/download.jpg" width="276" height="183" />](/wp-content/uploads/2013/11/download.jpg)

**SSL** (`Secure Sockets Layer` - the level of secure sockets) is a cryptographic protocol. It was designed to encrypt data when exchanging information between network devices. SSL was originally developed by `Netscape Communications` to add HTTPS to its `Netscape Navigator` web browser. Subsequentl based on the SSL 3.0 protocol the RFC standard was developed and adopted which received the name `TLS`.

More materials are available in [wikipedia article](http://ru.wikipedia.org/wiki/SSL). I will not go into all the details but I will describe its application to websites as simply as possible.

So the most frequent use of the SSL protocol led to the formation of the HTTPS (`Hypertext Transfer Protocol Secure`) protocol which supports encryption. Data that is transmitted over the HTTPS protocol is “packaged” in the SSL or TLS cryptographic protocol thereby ensuring the protection of this data. This method of protection is widely used in the Web world for applications where connection security is important such as payment systems. HTTPS uses TCP port 443 by default.

<center>
  <div id="gads">
  </div>
</center>

When considering an ssl connection you need to understand what a `private` or `server key` or `server private key` is, a `certificate signing request` or , a `public key`, a `Security Certificate`, a `cipher` or encryption algorithm and a `certificate authority`.

**Private or server key** - the beginning of the life of any certificate. This is a text file that contains a set of incomprehensible characters resembling abracadabra. This abracadabra is the key on the basis of which the outgoing data is encrypted and the incoming data is decrypted on the server side. Based on this key file a certificate signing request or CSR is generated.

**Certificate Signing Request or CSR** is the same encoded gibberish as the key. This abracadabra is generated based on the server key and contains information that will be included in the certificate. This is is the information about your organization (`organization name`), the name of the web site where the certificate will be installed (`common name`), organizational unit, location or city (`locality`) and country (`country`). All these questions are asked by the generator at the stage of creating a request. It also contains the public key, which will also be included in the certificate.

**Certification Authority or Certification Authority** - a party (department, organization) whose honesty is undeniable and the public key is widely known. The task of the certification authority is to authenticate encryption keys using electronic signature certificates. In other words this is an organisation trusted by all browsers. It is a place whereyou send your CSR in order for your site to be checked for authenticity, ownership by you and for some money, based on your key and your CSR, they provide you a security certificate.

**Security certificate** -  is an encrypted file that contains information about your organization, website and everything that was specified during the CSR generation stage. Also a genuine security certificate contains the signature of the `Certification Authority` that it was checked and confirmed that you are who you are, your website is what it declares to be and you can be friends with it. If such a certificate is attached to the site when accessing it over the `https` protocol the beginning of the address bar will turn into a pleasant green and the browser will consider such a connection safe and very positive in all respects.

[<img class="size-full wp-image-55 aligncenter" alt="Screenshot from 2013-11-19 11:22:47" src="/wp-content/uploads/2013/11/Screenshot-from-2013-11-19-112247.png" width="520" height="33" />](/wp-content/uploads/2013/11/Screenshot-from-2013-11-19-112247.png)


It is necessary to mention the **self-signed certificate** - this is the same security certificate as the previous one with one important disadvantage: it does not contain a digital signature of the `certification authority`. Usually, when accessing such sites the screen turns red and the browser strongly recommends that you refuse to establish a secure connection to the server.

## What happens when we make a request to the server using https instead of http?
The SSL client and server agree to establish communication using the SSL HandShake procedure. During the handshake the client and server agree on how they will ensure secure data transfer:

1. The client sends the client's SSL version number, encrypted parameters to the server to communicate with the client using SSL.
2. The server does the same. The server also sends its certificate, which requires client authentication. Once authenticated the server requests a client certificate.
3. The client uses the information sent by the server to authenticate. If the server cannot be verified then the user is warned that there is a problem and that connection encryption and authentication cannot be established. If the server successfully passed the test then the client proceeds to the next step.
4. Using all the data received so far from the handshake procedure the client (in cooperation with the server) creates a pre-secret of the session, depending on the cipher used from the server, encrypts it using the `server's public key` (obtained from the server's certificate sent to 2 -th step) and then sends it to the server.
5. The server attempts to authenticate the client. If the client cannot authenticate, the session ends. If the client can be successfully authenticated then the server uses its `private key` to decrypt the `pre-secret` and then a `master secret` is generated on the server and on the client.
6. Both the client and server use the secret to generate `session keys` which are symmetric keys used to encrypt and decrypt information exchanged during an SSL session.
7. The client sends a message to the server informing it that future messages from the client will be encrypted with the session key. It then sends a separate encrypted message that the handshake part is over.
8. Finally, the server sends a message to the client informing it that future messages from the server will be encrypted with the session key. It then sends a separate, encrypted message that the handshake part is over.

This completes the handshake and begins a secure connection which is encrypted and decrypted using key data.

The advantages of using secure ssl connections are the following:
- Confidence that the data is transmitted in a secure manner. If the sent packet is intercepted the attacker will not be able to open/read/change it since it does not have an encryption key that is unique for each session.
- a beautiful address bar in the browser.
- proof to everyone how cool your website is.

It is clear that the main advantage is the first point.

The disadvantages of using ssl include:
- money. Yes, you need to pay for certificates to offices that are called `certification authorities`. Very respected certificate authorities charge very good money for signing your certificate.
- money again? Yes. Https connections are more gluttonous in terms of system resources. A more powerful server may be required. That is why it is not recommended to use https for the entire web site. I don't think this is a problem is 2022.

Links:
1. [SSL wikipedia](http://ru.wikipedia.org/wiki/SSL)  
2. [SslShopper FAQs](http://www.sslshopper.com/ssl-faq.html)  

