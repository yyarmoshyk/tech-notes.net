---
id: 109
title: Create SSL certificate in Linux.
date: 2014-07-14T19:18:04+00:00
author: admin
permalink: /create-ssl-certificate/
image: /wp-content/uploads/2014/01/ssl_certificate_003_400_x_400.png
categories:
  - SSL
  - Security
tags:
  - certificate
  - linux
  - ssl
  - ssl certificate
  - multi-domain certificate
  - self-signed linux certificate
  - self-signed certificate
---
In continuation of the series of articles about SSL I would like to describe the steps for the appearance of certificates.
I will not repeat the terminology. The theoretical part is presented in the article [What is SSL and what to eat with it](/ssl-tutorial/)

Further actions are valid in the Linux environment using the functionality of the Openssl package.
So first we generate a security key. It is very important to copy this file to a safe place as the certificate will not work without it.
```bash
openssl genrsa -out server.key 2048
```

Next we generate a file for a certificate request:
```bash
openssl req -new -key server.key -out %your_website%.csr
```

During the request generation process you will be asked the following questions. Most of them may remain unanswered. Only <strong>Common Name</strong> is important - the name of your site. If you make a mistake in it then the certificate will not work:
```bash
Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:
Email Address[]:
A challenge password[]:
An optional company name[]:
```

Unfortunately the Common Name only accepts one value meaning you can generate a certificate only for a domain with www or only for a domain without www. 

In order to include multiple domains into your certificate request you need to be prepared for the fact that a certificate for 2 domains will cost more than 1.

The second example would be saving money. The point is in fact that one certificate for 3 domains costs less than 3 separate certificates. As you guessed further we will talk about generating certificates for several domains or about <strong>multi-domain certificates</strong>.

In order to generate a certificate request for multiple domains, you need to edit the file `/etc/ssl/openssl.cnf`:
Uncomment the line:
```bash
req_extensions = v3_req
```

Next, you need to find the `[ v3_req ]` section. It will contain the following lines:
```bash
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
```

Immediately below them, you need to write the following construction
```bash
subjectAltName = @alt_names
[alt_names]
DNS.1 = www.%your_website%.com
DNS.2 = www.%your_website%.org
DNS.3 = %your_website%.org
```

The <strong>alt_names</strong> array will contain the alternative domain names that will be included in the certificate. What you don't need can be removed, what you need can be added.
After this operation, you need to go back 3 steps, generate server.key and CSR.

Unfortunately there is no such function in IIS so multi-domain certificates are generated exclusively in the Linux environment.

As a result you will receive a CSR file (certificate request) which will contain all the domains you need.

You can read the contents of the CSR file with the following command:
```bash
openssl req -in %your_website%.csr -noout -text
```

After making sure that our request contains all the data you need, you can safely go to [search for certificate authorities] (http://lmgtfy.com/?q=ssl+certificate) (for those who have not read the article at the link at the beginning, these are organizations that will make your certificate valid with their digital signature for your money)
I recommend once again making sure that the server.key file is securely stored in several places. Without it the certificate will not work. If the `server.key` file is lost then you will have to repeat all the steps and buy a new certificate.

After filling in the necessary forms and payment you will be provided with several ways to verify your site. Usually this is either creating a text file in the root of the site or adding a txt record to the DNS zone. The first option is more convenient because it takes the least time.

The whole procedure should not take more than an hour. At the end you'll get a certificate. Now you just need to add it to the server.

Finally, you can create a <strong>self-signed certificate</strong> like this:
```bash
openssl x509 -req -extensions v3_req -days 365 -in %your_website%.csr -signkey server.key -out %your_website%.crt
```