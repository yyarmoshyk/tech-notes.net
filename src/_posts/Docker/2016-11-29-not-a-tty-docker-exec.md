---
id: 3567
title: 'Error `not a TTY` on `docker exec` in ansible'
date: 2016-11-29T10:41:10+00:00
author: admin

guid: http://www.tech-notes.net/?p=3567
permalink: /not-a-tty-docker-exec/
image: /wp-content/uploads/2016/11/good-luck-docker-chan.png
categories:
  - Docker

---
One of the ansible playbooks that I was refactoring recently had a multiple `shell` steps with `docker exec` in them.
After updating to the latest docker the playbook started to fail with the following errors:
```bash
fatal: [servername.network]: FAILED! => {"changed": true, "cmd": ["docker", "exec", "-it", "somecommand here to run in docker container"],
"delta": "0:00:00.019926", "end": "2016-11-29 02:01:31.597629", "failed": true, "rc": 1,
"start": "2016-11-29 02:01:31.577703",
"stderr": "the input device is not a TTY", "stdout": "", "stdout_lines": [], "warnings": []}
```
The solution was to change from ``docker exec -it`` to ``docker exec --tty`` or short ``docker exec -t``

It was left to re-write it into `docker+command` but that is another story in the backlog
  * <a href="https://github.com/mitchellh/vagrant/issues/7597" target="_blank">https://github.com/mitchellh/vagrant/issues/7597</a>
