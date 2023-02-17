---
title: List items should be accessed using square brackets
date: 2023-02-17T00:00:00+00:00
author: Yaroslav Yarmoshyk
attitude_sidebarlayout:
  - default
categories:
  - Terraform
tags:
  - terraform
  - tflint
---
This is a note about the following error that is produced by `tflint`
```bash
Warning: List items should be accessed using square brackets (terraform_deprecated_index)
  on ec2.tf line 182:
 182:   target_id        = aws_instance.ec2.*.id[count.index]
Reference: https://github.com/terraform-linters/tflint-ruleset-terraform/blob/v0.2.2/docs/rules/terraform_deprecated_index.md
```

I decided to make this not becuase the explanation at [github.com/terraform-linters](https://github.com/terraform-linters/tflint-ruleset-terraform/blob/v0.2.2/docs/rules/terraform_deprecated_index.md) is not very clear.
<br>
The fix is the to replace all occurances of `aws_instance.ec2.*.id[count.index]` with `aws_instance.ec2.[count.index].id`