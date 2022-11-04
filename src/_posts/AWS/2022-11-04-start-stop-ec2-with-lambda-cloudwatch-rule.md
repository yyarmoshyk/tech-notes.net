---
id: 73
title: Start and Stop Ec2 Instances with CloudWatch Event rule and Lambda
date: 2022-11-04T00:00:00+00:00
author: Yaroslav Yarmoshyk

permalink: /start-stop-ec2-with-lambda-cloudwatch-rule/
image: /wp-content/uploads/2013/09/person-typing2.jpg
categories:
  - AWS
tags:
  - Lambda
  - EC2
---
This note can be usefull for those of you who needs to hav EC2 instance running during the certain period of time during the day and awoid spending money when the instance is not needed.
I use the [bmwitcher.medium.com](https://bmwitcher.medium.com/using-lambda-cloudwatch-events-to-start-and-stop-ec2-instances-48e31ff0daf2) article but with a small changes:
1. There is only one lambda function
2. The cloudwatch event rules have custom contraint in json format to be forwarded as event to the lambda

## Steps are the following
1. Create lambda function with the code specified below
```python
import boto3
region = 'us-east-1'
ec2 = boto3.client('ec2', region_name=region)
def lambda_handler(event, context):
    if event["action"] == "stop":
        ec2.stop_instances(InstanceIds=[event["instance_id"]])
    if event["action"] == "start":
        ec2.start_instances(InstanceIds=[event["instance_id"]])
```

2. Create the following IAM policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "ec2:DescribeInstances"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow",
            "Condition": {}
        },
        {
            "Action": [
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": [
                "arn:aws:ec2:::instance/*"
            ],
            "Effect": "Allow",
            "Condition": {}
        }
    ]
}
```

3. Attach this policy to the lambda execution IAM role. The role name can be found on the lambda configuration tab
![lambda execution role](/wp-content/uploads/2022/lambda_execution_role.png "lambda execution role")

4. Create 2 separarte CloudWatch rules to stop and start instances at the spcified schedule
![CloudWatch create event rule](/wp-content/uploads/2022/cw_create_rule.png "CloudWatch create event rule")

## Links
* [bmwitcher.medium.com](https://bmwitcher.medium.com/using-lambda-cloudwatch-events-to-start-and-stop-ec2-instances-48e31ff0daf2)
