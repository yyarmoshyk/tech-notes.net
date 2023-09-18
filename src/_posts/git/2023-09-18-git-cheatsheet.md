---
id: 1325
title: GIT cheatsheet
date: 2023-09-18T00:00:00+00:00
author: admin

permalink: /git-cheatsheet/
categories:
  - git
tags:
  - git
---
This is one of the cheetsheets I have at this website. The primary purpose of this one is to collect all usefull commands you might need in your daily work.
It is worth to note that current changes are being applied to local git repo and need to be published to remote.

I will publish it as is and will extend with additional notes as I have more examples.

## Reset not commited changes
```
git reset --hard
```

## Reset changes in the selected file:
```bash
git checkout -- file
```

## Get commit history
```bash
git log --oneline
```
Get commit history for the specified file:
```bash
git log --follow -- **filename**
```

## Revert to the previous sate (commit sha)
find the commit sha from the previous command:
```bash
git checkout **COMMIT_SHA**
```