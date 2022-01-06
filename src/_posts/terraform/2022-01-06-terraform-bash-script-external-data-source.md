---
title: Use bash script as data source in terrafform
date: 2022-01-06T00:00:00+00:00
author: Yaroslav Yarmoshyk
attitude_sidebarlayout:
  - default
categories:
  - Terraform
tags:
  - terraform
---
I was for a multiple times when I had to extract some data with bash script and next re-use the result in terraform resource provisioning.
I'd like to share this for future refference.

Terraform has the [external data source](https://registry.terraform.io/providers/hashicorp/external/latest/docs/data-sources/data_source) that allows to run external program and handle it's outputs in further infrastructure code.
Next you can find the example of the bash script. The most important part in it is crafting the proper result to be returned into terraform.
It consists of three functions:
1. `error_exit` to be used to return proper error message.
![error message example!](/wp-content/uploads/2022/jq-not-found.png "jq-not-found")
1. `check_deps` - to be used to check whether all required binaries are present. In this particular example I'm checking whether jq and curl binaries are available. JQ will always remain in the list becuase it is needed to craft the responce.
1. `extract_data` - to actually get the required data and return responce. In this example I'm reading the public IP address of the machine where terraform is being executed using the external website ifconfig.me

```bash
#!/usr/bin/env bash
function error_exit() {
  echo "$1" 1>&2
  exit 1
}

function check_deps() {
  jq_test=$(which jq)
  curl_test=$(which curl)
  if [[ -z $jq_test ]]; then error_exit "JQ binary not found"; fi
  if [[ -z $curl_test ]]; then error_exit "curl binary not found"; fi
}

function extract_data() {
  my_ip=$(curl -q https://ifconfig.me/ip)
  jq -n --arg my_ip "$my_ip" '{"my_ip":"'$my_ip'"}'
}

check_deps
extract_data
```
This script needs to be save in the folder where your module code is located. I use separate subfolders for scripts. Also this file needs to be executable
```bash
chmod +x extract_ip.sh
```

The definition of the external data source looks like the following:
```tcl
data "external" "external_ip" {
  program   = [
    "/bin/bash", "${path.module}/scripts/extract_ip.sh"
  ]
}
```

The resutls can be refferenced in your code as the following:
```
module "some-name" {
    ...
    my_ip = data.external.external_ip.result.my_ip
    ...
}
```

I prepared the separate [github repo](https://github.com/yyarmoshyk/terraform-bash-external-datasource) with this example.