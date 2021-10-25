---
title: "Parrallel stages in Jenkins Groovy pipeline"
excerpt: "Parrallel stages in Jenkins Groovy pipeline"
last_modified_at: 2021-10-25T00:00:00-00:00
toc: false
categories:
  - Jenkins
tags:
  - groovy pipelines
---
Obviously you are looking for a way how to run multiple jobs in your pipeline in parallel. For example you have multiple folders in your project and want to run something in each of them (ex. docker build) that takes a while and you'd like to save time and run all jobs in parallel.

Here is groovy code to go this:
```groovy
stage ("Parallel stages") {
  def folderlist = ["folder1","folder2","folder3"]
  def stageJobs = [:]
    folderlist.each { item ->
      stageJobs[item] = {
        stage("Stage ${item}") {
          dir("${item}") {
            .......
          }
        }
      }
    }
    parallel stageJobs
}
```
