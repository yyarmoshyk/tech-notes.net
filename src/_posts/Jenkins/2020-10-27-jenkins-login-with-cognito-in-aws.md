---
title: "Jenkins auth over AWS Cognito"
#permalink: /docs/unique-ips-from-apache-log.html
excerpt: "Jenkins auth over AWS Cognito"
last_modified_at: 2020-10-27T00:00:00-00:00
author: admin
toc: false
categories:
  - Jenkins
  - AWS
tags:
  - Jenkins
  - Cognito
---
Recently I had a case where I had to enforce the following options for Jenkins:
1. Password policy (length, secial characters)
2. MFA

None of the plugins supports this but AWS Cognito does. Unfortunately there is no native Jenkins Cognito plugin so I stated to dig into [OpenId Connect Authentication](https://plugins.jenkins.io/oic-auth/) jenkins plugin and it worked.

Next I'm going to describe the steps it took me to configure the cognito-jenkins connection.

## Cognito configuration
1. In AWS console find the "Cognito" section, select "Manage userpools" and select "Create a userpool".
2. In the initial screen specify the name of the pool and select "Step through settings"
3. On the second screen make sure to select the following options:
   1. Which standard attributes are required:
      - email
      - phone_number
4. On the next screen:
   1. Specify the desired password options (length, require numbers, etc.) according to the security policy of your organization.
   2. In our case we don't want to allow users sign up for jenkins access so select "Only allow administrators to create users"
5. On the next screen make sure to select the following options:
   1. Do you want to enable Multi-Factor Authentication?:
      - required
   2. Which second factors do you want to enable:
      - SMS text message
      - Time-based One-time Password
   2. How will a user be able to recover their account?:
      - Email only
   3. Which attributes do you want to verify?:
      - Phone number
   4. You must provide a role to allow Amazon Cognito to send SMS messages:
      - this is either existing role or the name of the IAM role to be created for you.
6. On the next screen you can customize notifications at you desire. I will not describe it. I'll focus on hte items we need to select for this setup:
   1. Do you want to send emails through your Amazon SES Configuration:
      - No - Use Cognito (Default)
7. On the next screen you can add tags to the userpool according to your organisation needs.
8. Do you want to remember your user's devices:
   - User Opt In
9. On the next screen you can add the application client that will be working with this pool. Click "Add an app client":
   - Specify App client name (it will be jenkins in our case)
   - Select "Enable username password based authentication (ALLOW_USER_PASSWORD_AUTH)"
   - Uncheck "Enable lambda trigger based custom authentication (ALLOW_CUSTOM_AUTH)"
   Click "Create app client" button on the bottom of the screen.
10. Triggers page can be skipped.
11. On the review page click "Create pool" button on the bottom.
12. You'll be redirected to the recently created userpool page.
13. Find the "Domain name" section
    - On this page you'll need to specify the unique domain name prefix. It can be verified by clicking the "Check availability button". I'd recommend to use "jenkins-${company_name}-${some_random_string}". Click "Save changes" when done.
14. Go to "App clients" and click "Show details." Note the values of the following:
    - App client id
    - App client secret
15. Go to "App client settings":
    1. Enabled Identity Providers
       - "Select all"
    2. Callback URL(s):
       - https://${jenkins-url}/securityRealm/finishLogin
    3. Sign out URL(s)
       - https://${jenkins-url}/OicLogout, https://${jenkins-url}/securityRealm/finishLogin
    1. Allowed OAuth Flows:
       - Authorization code grant
    1. Allowed OAuth Scopes:
       - email
       - openid
       - profile

## Jenkins configuration
1. Go to "Manage Jenkins->Plugins" and install the [OpenId Connect Authentication](https://plugins.jenkins.io/oic-auth/) plugin
2. Go to "Manage Jenkins->Configure Global Security"
3. In the "Security Realm" section select "Login with Openid Connect"
4. Specify the "Client id" "Client secret" by using the values read in step #14 from the previous list
5. Select "Manual configuration". You'll need the value of the cognito domain that was created at step #13 in the cognito section. It should look like the following:
```
https://jenkins-${company_name}-${some_random_string}.${aws_region}.amazoncognito.com
```
Specify the following values:
   1. Token server url:
      - https://jenkins-${company_name}-${some_random_string}.${aws_region}.amazoncognito.com/oauth2/token
   1. Authorization server url:
      - https://jenkins-${company_name}-${some_random_string}.${aws_region}.amazoncognito.com/oauth2/authorize
   1. UserInfo server url:
      - https://jenkins-${company_name}-${some_random_string}.${aws_region}.amazoncognito.com/oauth2/userInfo
   1. Scopes:
      - openid email profile
   1. Select "Logout from OpenID Provider"
   1. End session URL for OpenID Provider:
      - https://jenkins-${company_name}-${some_random_string}.${aws_region}.amazoncognito.com/logout?client_id=${client_id}&logout_uri=https://${jenkins-url}
   1. Click "Advanced button"
      1. Specify "User name field name" = username
      2. "Email field "name = email
   1. Scroll down a bit and find the "Configure 'escape hatch' for when the OpenID Provider is unavailable" checkbox.
      1. Specify the username and passowrd to be used to access jenkins bypassing the cognito auth. To use the functionally goto '/login' using the username and secret as username and password resp.

Now you can add the user into the pool with the valid email and the phone number. Jenkins login page will regirect you to the cognito auth page.

Source links:
- [Amazon Cognito API References](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-reference.html)
- [OpenId Connect Authentication](https://plugins.jenkins.io/oic-auth/)
- [OpenID Connect Authorization Code Flow with AWS Cognito](https://medium.com/@robert.broeckelmann/openid-connect-authorization-code-flow-with-aws-cognito-246997abd11a)
