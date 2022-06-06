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
Almost 80% of traffic came to my website from russia. Here is the tada for last Friday:
![tech-notes-traffic-stats!](/wp-content/uploads/2022/tech-notes-traffic-stats.png "tech-notes-traffic-stats")

I need to prevent these guys from using my background in their work so no more traffic from russia (I wrote from small letter for purpose). I don't care about the numbers becuase this is non-profitable website.

I use jekyll to organize the website content and AWS S3 to store the files so I don't much options how to restrict access to it. But I also use CloudFlare as a CDN for it and I found a cool thing in it that can help me to acheive what I need.

Restricting access to your website with CloudFlare for a particular country is fairy simple. You need WAF section that is available even in the free tier account.
You got to create new firewall rule as shown at the screenshot below
![cloudflare_country_block!](/wp-content/uploads/2022/cloudflare_country_block.png "cloudflare_country_block")
