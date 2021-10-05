---
title: "Copy the Jenkins job"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "Copy the Jenkins job"
last_modified_at: 2020-04-06T00:00:00-00:00
toc: false
categories:
  - Jenkins
tags:
  - Jenkins
---
Для начала вам нужно будет скопировать jenkins-cli.jar к себе на компьютер.
<img src="assets/images/JenkinsCLIMenu.png">

Получаем список плагинов:
```bash
java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<jenkins_server_address>/ list-jobs
```

Находим в списке имя билда, который нас интересует и получаем сведенья о нем:
```bash
java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<jenkins_server_address>/ get-job "Build name" |pbcopy
pbpaste | java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<jenkins_server_address>/ create-job "Build name"
```
