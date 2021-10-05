---
id: 3567
title: 'Ошибка `not a TTY` при выполнении `docker exec`'
date: 2016-11-29T10:41:10+00:00
author: admin

guid: http://www.tech-notes.net/?p=3567
permalink: /not-a-tty-docker-exec/
image: /wp-content/uploads/2016/11/good-luck-docker-chan.png
categories:
  - Docker

---
Я упущу предысторию как я столкнулся с этой проблемой, но самого факта это не меняет.

Один из `ansible` playbook'ов, который недавно попал ко мне на ревизию, содержал несколько шагов, в которых с помощью `shell` модуля выполнялись операции в докер контейнерах с помощью `docker exec`. После обновления до последнего `docker` и `ansible` начали сыпаться следующие ошибки при выполнении этого playbook'а:

```bash
fatal: [servername.network]: FAILED! => {"changed": true, "cmd": ["docker", "exec", "-it", "somecommand here to run in docker container"],
"delta": "0:00:00.019926", "end": "2016-11-29 02:01:31.597629", "failed": true, "rc": 1,
"start": "2016-11-29 02:01:31.577703",
"stderr": "the input device is not a TTY", "stdout": "", "stdout_lines": [], "warnings": []}
```

Решение проблемы оказалось тривиально простым - нужно все ``docker exec -it`` поменять на ``docker exec --tty``. После таких правок `playbook` сработал на ура.

Осталось переписать его на использование `docker+command`, но это уже другая история.
  * <a href="https://github.com/mitchellh/vagrant/issues/7597" target="_blank">https://github.com/mitchellh/vagrant/issues/7597</a>
