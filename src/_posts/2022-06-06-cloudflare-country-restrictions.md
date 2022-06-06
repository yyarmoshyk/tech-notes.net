---
id: 458
title: 'Cloudflare: restrict access to your website for a country'
date: 2022-06-06T00:00:00+00:00
author: admin

guid: http://www.tech-notes.net/?p=458
permalink: /cloudflare-country-restrictions/
categories:
  - cloudflare
tags:
  - cloudflare
---
Today I woke up and suddenly realised that most of the articles in this blog were written in russian language and the major visitors come from russian-speeking countries.
Almost 80% of traffic came to my website from russia. Here is the data for last Friday:<br>
<center><img src="/wp-content/uploads/2022/tech-notes-traffic-stats.png" alt="drawing" width="30%" height="30%"/></center>

I need to prevent these guys from using my background in their work so no more traffic from russia (I wrote from small letter for purpose). I don't care about the numbers becuase this is non-profitable website.

I use [jekyll](https://jekyllrb.com/) to organize the website content and [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html) to store the files so I don't much options how to restrict access to it. But I also use [CloudFlare](https://www.cloudflare.com/) as a CDN for it and I found a cool thing in it that can help me to acheive what I need.

Restricting access to your website with CloudFlare for a particular country is fairy simple. You need WAF section that is available even in the free tier account.
You got to create new firewall rule as shown at the screenshot below
![cloudflare_country_block!](/wp-content/uploads/2022/cloudflare_country_block.png "cloudflare_country_block")
