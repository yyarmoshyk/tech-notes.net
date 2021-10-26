---
title: "Copy the Jenkins job"
excerpt: "Copy the Jenkins job"
last_modified_at: 2020-04-06T00:00:00-00:00
toc: false
categories:
  - Jenkins
tags:
  - Jenkins
---
First of all you'll need to copy `jenkins-cli.jar` to your PC.
<img src="/assets/images/JenkinsCLIMenu.png" width="1149" height="314" class="aligncenter size-full wp-image-3516">

You'll need to have java installed. In modern world it makes more sence to run docker container with jre:
```bash
docker run -v /Users/myuser/Downloads/:/Downloads -it openjdk:8u312-jre bash
```

Install `xclip` and `xsel`
```
apt install xclip xsel
echo "alias pbcopy='xclip -selection clipboard'" >> ~/.bashrc
echo "alias pbpaste='xclip -selection clipboard -o'" >> ~/.bashrc
source ~/.bashrc
```

List the jobs:
```bash
java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<jenkins_server_address>/ list-jobs
```

Copy the desired build name from one server into other:
```bash
java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<source_jenkins_server_address>/ get-job "Build name" |pbcopy
pbpaste | java -jar ~/Downloads/jenkins-cli.jar -auth <username>:<password> -s https://<target_jenkins_server_address>/ create-job "Build name"
```
