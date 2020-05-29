---
title: Scan and Query in DynamoDB
date: "2020-05-25"
---

![car racing](./assets/racing.jpg)
Photo by [Ralph Blvmberg](https://unsplash.com/@rblvmberg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com)

## Scan vs. Query
In order to get data from a DynamoDB table, you could either use *scan* or *query*.

### Query
Query finds items by their *primary key* or *secondary index*. An item's primary key could be *partition key* alone or a combination of *partition key* and *sort key*. I explained this in greater details in [previous part](https://blog.vinhlee.com/dynamo-db-1/) of this blog.

### Scan
Scan on the other hand return items by going through all items in the table. It first dumps the entire table and then filtering outputs by *primary key* or *secondary index*, just like query.

However, scanning process is slower and less efficient than query. It takes an extra step of dumping the whole database and going through *all* items.

We could improve scan performance by [pagination](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html#Scan.Pagination) as well as [parallel scan](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html#Scan.ParallelScan). Nonetheless, it is still recommended to use query or [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.BatchOperations) over scan.

## Secondary index
### A different data structure
DynamoDB by nature queries and scans by items' primary key. However, it allows more sufficient access to data from other attributes by secondary index. Essentially, you need to specify attributes that could be secondary indexes and run query or scan against them. End of story! 🥂

It is important to understand that secondary index is a data structure. It is associated with one and only base table where it gets data from.

This data is primarily a subset of attributes and an alternate key to support query and scan operations. We explicitly define which attributes will be projected (copied) from base table to the index as well as alternate key.

After an index is created, we could query or scan it similar to a typical table. DynamoDB actively maintains its secondary index. This synchronization happens when we modify (create, remove, update) items in *base table*.

### Local vs. Global
There are 2 types of indexes that DynamoDB supports: **local** and **global** secondary indexes. Local secondary index has the same partition key and different sort key with its base table while global index has different sort key *and* different partition key. That's how *local* is different from *global* one in a nutshell.

As global secondary index has different partition key. Its data is stored in a different partition away from the base table while local secondary index shares the same partition with its base. Query in global index therefore could span across partitions, unlike in local one.

### When to use what
Generally, it is [recommended](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html) to use global secondary index rather than local one. One exception is when you need *strongly consistent read* for your index. Local secondary index supports this consistency model while global one does not.

### Indexing strategy
Secondary indexes consume storage and provisioned throughput. Thus, a good practice is to keep indexes minimal and could be done by:
* Project only *necessary attributes* that your queries or scans really need
* Attributes that are expected to be frequently fetched should all be secondary indexes to improve performance and save database resources.
* Be aware of [item collection size limit](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html#LSI.ItemCollections.SizeLimit) if you are using local secondary index. In brief, size of all items in base table and its local indexes cannot exceed 10 GB.

AWS also provides a [general guideline](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html) that is worth looking into.

## TL;DR
* To get data from a DynamoDB table, it is recommended to use query over scan for better performance.
* Secondary index is a data structure. It copies attributes of items from base table and handles queries just like the base table does. Base table keeps secondary index in sync by updating the index when table data changes.
* We could use *local* or *global secondary index*. The former shares same partition key with base table while the latter has different partition key *and* sort key.
* Secondary index consumes database's storage and throughput. Therefore, good practices should be done to archieve better performance while keeping item collection size under limit.

## Resources
[Best Practices for Querying and Scanning Data - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html)

[Improving Data Access with Secondary Indexes - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html)

[General Guidelines for Secondary Indexes in DynamoDB - Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes-general.html)

[indexing - Difference between local and global indexes in DynamoDB - Stack Overflow](https://stackoverflow.com/questions/21381744/difference-between-local-and-global-indexes-in-dynamodb)