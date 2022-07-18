---
title: "Refresh Jenkins job properties"
excerpt: "Refresh Jenkins job properties"
last_modified_at: 2022-07-18T00:00:00-00:00
toc: false
categories:
  - Jenkins
tags:
  - groovy pipelines
---
When you are dialing with groovy pipelines in Jenkins sometimes you might need to add new parameters. The tricky thing is in fact that job parameters are being updated only after the execution. With this in mind you can add a dummy stage to be used to run in jenkins after you add new job parameters into the jenkins file.

The step with condition looks like the following:
```groovy
if (Refresh) {
    currentBuild.result = 'ABORTED'
    error('Stopping early…')
}
```

Here is the example of pipeline that has it. There is a bolean parameter `refresh` that is going to be represented as a checkbox on the pipeline build screen. 
The stage above will be executed when the checkbox is selected (`refresh == True`). The stage will not do enything except loading jenkins file and exiting the pipeline with the status = ABORTED. In the jenkins UI the build will be colored in grey.
```groovy
pipeline {
  agent any
  parameters { 
        booleanParam(name: 'refresh', defaultValue: false, description: 'Refresh pipeline properties') 
    }
  stages {
    stage('Refresh properties') {
        if (Refresh) {
            currentBuild.result = 'ABORTED'
            error('Stopping early…')
        }
    }
  }
}
```