---
title: DevOps CoE Best practices
date: 2022-01-05T00:00:00+00:00
author: Yaroslav Yarmoshyk
attitude_sidebarlayout:
  - default
categories:
  - DevOps
tags:
  - DevOps CoE
---
DevOps Center of Exelence (CoE) is a new trend in team work when DevOps team is no longer concentrated on the single project. It is more a service team inside enterprise organization that works with multiple projects semultaniously. There is a logical separation inside the team but in general it can be imagined as a pool of people with different tallents and background, different career interrests. Every engineer can be dedicated to a single streem for a definite period of time (ex. 1-2 months) but he is still a member of the big team where he can get asnwers on his questions, share experience and get support from other team members and the team lead.

From generic team leadership principles I understand that there are multiple areas that need to be covered. For example I need to hire people first, next get them onboarded into the organization. I need to build some team spirit and friendly relationhips inside the team (I'll write a separate article about doing it in remote mode). Next I need to assign people to either R&D projects or make them work on devops initiatives.

## Core resources
You need to outline the list of core tools like build system, automation tools, cloud, etc. You need to outline owners for each resource (either team or individuals).

## Standartization
While leading DevOps work for the R&D projects I noticed the following problems
* often people tend to build the custom solutions in the way they are going to use it. This ended up into the situation when 2 devops engineers on 2 different sreems were writing the same terraform modules or jenkinsfiles.
* different R&D teams would like to follow different git branching strategies. Any branching strategy was called gitflow but the vision was different. Somethies this was causing frustration in the early days when developers didn't understand what needs to be done.
* differet teams had different vision on CI/CD pipelines and build artefacts. For exmple one team  wanted to build jar file, publish it into artifactory next fetch it during the docker build. The second team wanted to build the jar file in the stage of docker build as a separate RUN command in dockerfile but use JDK as a primary docker image.
* different points about testing and usage of lower environments. For example treat `Dev` as `sandbox` and do debuging in `Staging`.

The aswer on solving it all is **standartization** of toolset and approaches. People should not re-do the work of each other and team should focus on building the re-usable libraries that will be global for all projects.

## Cross Function Skills (testing, cloud, automation, operations, etc.)
While working on different streems I noticed that some statement which is obvious to one is not clear to other. This helped me realise that different people have different background and experience. Some team members came from fintech while others came from media or healthcare projects. The differences in previous arears lead to differences in perception even though all team members were storng enough in key devops areas like aws, docker/kubernetes, helm/terraform/ansible, jenkins/groovy. 
It is obvious that different engineers were focused on different areas in their previous work: one was primarily focused on cloud operations and infrastructure automation, other was focused on supporting Jenkins and writing groovy pipelines, the third had outstanding handson experience with kubernetes.

It is was wery important conclusion: you can't hire universal soldiers.
You will get extra benefits having people with different background and use their strong skills to achieve the business goals efficiently and advance their competence with callalnges in other areas.

## Focus on culture 
Culture is applicable to any team. You need to understand what is important for your product and try to realise what kind of people you need to join the team. Obviously if 90% of work consists of support, than *continious learning* and *passion to innovation* are not the key values for the people in your team. People with these values will leave your team becuase they will not find a way to satisfy their passion. You need process oriented people with many years of experience who are tired to learn.

On the other hand if you are working with cutting edge technologies and need to adopt early-bird technologies than you need people that *love to learn* new, *experiment* and *share knowledge*. You need *result-oriented* people with an ability to *see the big picture* (global thinking) and know when to stop. One can endlessly go deep into investigation without understanding the actual value of his research.

In CoE we have many freedom: there is always something innovative and there are always support tasks. The key value for me is result-oriented people becuase I don't want them to drown in endless request from the R&D.

I'll prepare a separate article with matrix of questions that allow you to identify these values in candidates.

## Passion to automation
DevOps is all about the efficient value stream. The key focus here is on automation. Obviously you don't need people who llike to do something manually. This should be the key value for the people in your team.

## Immutable infrastructure
I noticed that some people who switched from system administration tend to update/patch/tweak existing system rather than provision updated system aside and switch traffic to it.

From reliability perspective it is way safer to provision new servers with updated services rather than updating existing.

## Environments consistency
[Continious integration](https://en.wikipedia.org/wiki/Continuous_integration#Workflows) approach demand testing. It is a questin of common sence to test your code before making it available to end-users (run in production). 
We all use intermediate environments for different kinds of tests. The most common lay out is dev -> staging  -> production.

It is important to follow the same approach to provision resources for dev and stage environments. These environments need to look like rpoduction as much as possible to make sure that we catch all bugs and identify performance issues beofre the new version of your microsiervices reach production.

You can reach the [Continious Deployment](https://en.wikipedia.org/wiki/Continuous_deployment) if your testing is automated before prod and you can really on it.

## Version Controll everything
You need to track the history of all changes in git scm. No matter if this is infrastructure or Dockerfiles. With this you can always track back the history of changes and roll back to the previous state in case of need.

There is an outstanding approach called GitOps where you use the SCM to orkestrate your environment (apply configuration changes, provision resources, etc.) 
Obviously you need to locate everything in git to use it.


## Self service
There is alwyas a lag between the reqeust created by developer and the time when he gets the requested from devops team. You need to focus on statement "development first" and narrow to stop your team being the bottleneck in SDLC. You need to focus on creating some king of self-service portal to allow developers provision dev environments for their needs or any other areas at your convinience.  Dev team should not wait for ops team to provision something.

# Conclusion
## Teamlead working areas
1. Hiring and onboarding
1. Building the team relationships
1. Working on R&D projects
1. Working on DevOps projects

## Practices
1. Core resources
1. Standartisation
1. Cross Function Skills
1. Focus on culture
1. Passion to automation
1. Immutable infrastructure
1. Consistent environments
1. Version Controll everything
1. Self service