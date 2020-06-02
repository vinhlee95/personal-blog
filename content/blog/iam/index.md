---
title: AWS IAM 101
date: "2020-06-01"
---

## What is IAM
IAM is an essential gate-keeper of Amazon Web Service (AWS). This is the place where we would administer authentication and authorisation for AWS's environments and services.

Let's imagine an use case where we want to develop a Cloud application using AWS's infrastructure. In order to interact with AWS's API (via command line tool CLI, for instance). We would first need to create a new IAM user. The user then needs to be granted permissions to access to certain resources. How? By attaching specific IAM policies. If we want 2 services communicating to each other, such as EC2 and DynamoDB. We then need to have a valid IAM role, specifically cover those services.

That single, simple example alone can already tell how important IAM is in AWS ecosystem. In fact, IAM is *everywhere*. We will see, interact and configure it all across phases in development, security as well as monitoring.

IAM is universal and does not apply to regions at the moment. This means we could use *global* IAM entities to adminster resources throughout all AWS supported regions.

## Building blocks
IAM consists of users, groups, roles and policy documents.

### Users

Each IAM **user** has defined permissions to access and control specific AWS resources. When you first created an AWS account, AWS gives you *root* account. This user is in "god mode" so it has complete control over everything.

Is root account the only user we need? Absolutely **NO**. It is highly recommended to have different users for different applications and more importantly, *limit access control* for individual users. Besides, there is a rule of thumb to interact and configure AWS's services through IAM users and never hard-code security credentials such as assess key and secret key.

For example, a developer in a team should be given accesses only to EC2, S3 and CodeCommit, **definitely not** Administrator access. Our applications will be more secure that way as no one could cause any harm, unintentionally or deliberately.

When creating a brand new user (not root user in the first time), we can tell AWS which authentication credentials we want to obtain. There are 2 types:
* AWS Management Console access: a password that the user will use, along with user name and AWS's account ID, to sign in to AWS Console. The user will then interact with services via AWS's GUI.
* Programmatic access: an access key and a secret key. The user will use those 2 to talk to services via CLI. These keys, especially secret key, are very important and *could only be downloaded once* right after creation. It should be therefore saved securely in your local machine.

#### Configure IAM user locally
Let's have a tour setting up an IAM user in your local machine. This is one-time process and your interaction with AWS's CLI later on will use this credential. If you want to configure a different user, repeat following steps with that user's keys.

* Create AWS's config folder in root directory
```bash
mkdir ~/.aws
cd ~/.aws
```

* Create `credential` file for storing access key and secret key
```bash
touch credential
vim credential
```

Here is what you need to save to this file:
```
[<YOUR_USER_NAME>]
aws_access_key_id=<ACCESS_KEY>
aws_secret_access_key=<SECRET_KEY>
```

* Create `config` file for `output` and `region` configurations
```bash
touch config
vim config
```

Then add your configuration in the same manner as:
```
[profile <YOUR_USER_NAME>]
region=<YOUR_REGION>
output=json
```

Note that specified region here will be used to determine where AWS locates your application's resources. For example, if my region is `eu-north-1` and later on I use this configuration to create a S3 bucket via CLI, the bucket will be located in Stockholm. You could go [here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) to see a list of regions that is being supported.

### Groups
A group is a collection of IAM users. Group is useful when we want to manage permissions for a group of user. Without group, listing permissions for every single user will be a huge hassle. We could grant permissions to a group and then add users to that group. Those added users will then automatically have all of their group's permissions.

Another point to note is that group is born only to make it simpler to manage user permissions. A group thus does not have security credentials as well as cannot access and manage AWS's resources.

### Roles
An IAM role is an entity that defines a list of permissions to allow a *trusted entity* to interact with other AWS's services. That entity could be a service like EC2, Lambda or an AWS's account.

Creating a new role is similar to delegate access permissions to those trusted entities without having to share access keys. A role cannot make direct requests to AWS services, but the entity it attached to. Keep in mind that you could use IAM roles to delegate access to a *different AWS account*.

### Policies
A policy is the mean to assign permissions to IAM entities(users, groups and roles) so that they could access to AWS services. In other words, an user cannot access an AWS's resource until we attach a valid policy to that user.

There are 3 types of policies:
* AWS Managed Policies: created and administered by AWS. Managed policies could be reused between IAM entities and *cannot be modified*.
* Customer Managed Policies: created and used by own users and are reusable across entities similar to the previous one.
* Inline policies: created by user and embded directly to *individual* user, group or role. Inline policies cannot be reused in different IAM entities as it emphasises direct 1-1 relationship between entity and the policy itself. Once the entity is deleted, inline policies attached to it get removed as well.

The best practice is to use customer managed policies over others. Because we could assure greatest security by only granting utmos required permissions for the entity to handle specific tasks. Inline policies are least recommended due to its unreusable nature, unless your scenario requires. AWS managed policies are ready-made and easy to use. However, it usually provide broad administrative for general usage and thus is not tailored for specific needs.

For selecting an AWS managed policy, it is as simple as select 1 item in the list, as long as you know exactly what type of permission you are looking for. For customer managed policies, you need to be aware of 2 things:
* Policies are written in IAM policy language. They are essentially JSON files with a list of *statements*. Each statement specifies if an *action* is *allowed* or *denied* for a particular *resource*.
* You could use either visual editor in AWS console or writting policy JSON file [on your own](https://aws.amazon.com/blogs/security/back-to-school-understanding-the-iam-policy-grammar/) and attach it via CLI.

## TL;DR
* IAM manages authentication and authorisation for AWS management console and AWS resources.
* Users, groups, roles and policies are different IAM entities.
* An IAM user could make requests to AWS services directly and has long-term access keys and credentials.
* A group is essentially a management convenience to manage a similar permission set for multiple users.
* An IAM role is a mean to delegate AWS resources's accesses to trusted entities such as AWS services like EC2, Lambda and even a different AWS account.
* To grant specific permissions to an IAM entity, you need to attach a policy to that entity. A policy is a JSON file describes permissions. You could either write your own - customer managed policies, or use pre-made AWS managed policies. The former is recommended as the best practice.

## Resources
[AWS IAM FAQs](https://aws.amazon.com/iam/faqs/)

[Regions, Availability Zones, and Local Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)

[Creating IAM Policies - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)

[Back to School: Understanding the IAM Policy Grammar | AWS Security Blog](https://aws.amazon.com/blogs/security/back-to-school-understanding-the-iam-policy-grammar/)