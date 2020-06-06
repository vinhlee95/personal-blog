---
title: Learn EC2 by deploying a NodeJS application
date: "2020-06-05"
---

## What is EC2
Elastic Compute Cloud (EC2) is an AWS's service providing compute capacity in the cloud. To make it simple, EC2 is the environment where your front-end, back-end,... applications live and run.

We are all aware that each application has different architectures and yours may run in a container one like Docker. However, at the end of the day, your Docker application will be run on an EC2 instance even if you might host your docker image in Elastic Container Repository (ECR) and use Elastic Container Service (ECS) to deploy and manage it.

Similarly, a static front-end React application, a server side NodeJS application could run on EC2 instances (S3 may be a better and simpler place for hosting static front-end apps). In AWS ecosystem, you will get to know more resources and services that *make it easier* deploying your application. However, EC2 is the popular final destination that those services deploy applications to.

### What is an EC2 instance?
An EC2 instance is a virtual server that could run an application program in Amazon's EC2 computing environment. You could create an EC2 instance via AWS console, CLI or templates. In this blog, I will show you how to do it via a CloudFormation template.






