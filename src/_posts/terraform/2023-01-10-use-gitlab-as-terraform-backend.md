---
title: Use gitlab to store terraform state file
date: 2023-01-10T00:00:00+00:00
author: Yaroslav Yarmoshyk
attitude_sidebarlayout:
  - default
categories:
  - Terraform
tags:
  - terraform
  - gitlab
---
This is a short note about the way to configure your GitlabCI to store the Terraform state file.
Terraform backend configuration remains pretty simple:
```terraform
terraform {
  backend "http" {
    skip_cert_verification = true
  }
}
```

The following variables need to be defined in your `.gitlab-ci.yml` file:
```yaml
variables:
  TF_HTTP_ADDRESS: "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/terraform/state/statefilename"
  TF_HTTP_LOCK_ADDRESS: "${TF_HTTP_ADDRESS}/lock"
  TF_HTTP_UNLOCK_ADDRESS: "${TF_HTTP_ADDRESS}/lock"
  TF_HTTP_USERNAME: "gitlab-ci-token"
  TF_HTTP_PASSWORD: "${CI_JOB_TOKEN}"
  TF_HTTP_LOCK_METHOD: "POST"
  TF_HTTP_UNLOCK_METHOD: "DELETE"
```
Basically this will work. You don't need to modify anything.

However you might want to use different state files for every environment. In this case you can replace the `statefilename` in the `TF_HTTP_ADDRESS` with the `$CI_ENVIRONMENT_SLUG` which is the pre-defined variable that contains the name of your environment. Please note that this variable will eist only if you have thefollowing block in you per-environment jobs:
```yaml
environment:
    name: dev
```