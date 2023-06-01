# 在分片集群中合并块

## 概述

该`mergeChunks`命令允许您将同一分片上的连续块组合成一个块。本教程解释了如何合并分片集群中的相邻块。

## 程序

>## 笔记
>
>此过程中的示例使用`test` 数据库中的 `members` 集合，使用`username`字段作为 分片键。



### 识别块范围

在`mongosh`中，使用以下操作识别块范围：

```shell
sh.status()
```



在输出中，块范围出现在每个分片集合的块计数之后，如以下示例所示：

```shell
--- Sharding Status ---
  sharding version: {
     "_id" : 1,
     "minCompatibleVersion" : 5,
     "currentVersion" : 6,
     "clusterId" : ObjectId("5ebf0bfd3eeb6037ec7cbba9")
  }
  shards:
        {  "_id" : "shardA",  "host" : "shardA/shardA-m1.example.net:27018,shardA-m2.example.net:27018,shardA-m3.example.net:27018",  "state" : 1 }
        {  "_id" : "shardB",  "host" : "shardB/shardB-m1.example.net:27018,shardB-m2.example.net:27018,shardB-m3.example.net:27018",  "state" : 1 }
  active mongoses:
        "4.4.0" : 1
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  0
        Migration Results for the last 24 hours:
                519 : Success
  databases:
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
                config.system.sessions
                        shard key: { "_id" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shardA   512
                                shardB   512
                        too many chunks to print, use verbose if you want to force print
        {  "_id" : "test",  "primary" : "shardA",  "partitioned" : true,  "version" : {  "uuid" : UUID("22c042fc-7e3d-4c6d-992d-f3d714759781"),  "lastMod" : 1 } }
                test.members
                        shard key: { "username" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shardA   7
                                shardB   7
                        { "username" : { "$minKey" : 1 } } -->> { "username" : "user16643" } on : shardB Timestamp(13, 0)
                        { "username" : "user16643" } -->> { "username" : "user2329" } on : shardB Timestamp(16, 0)
                        { "username" : "user2329" } -->> { "username" : "user29937" } on : shardB Timestamp(17, 0)
                        { "username" : "user29937" } -->> { "username" : "user36583" } on : shardB Timestamp(18, 0)
                        { "username" : "user36583" } -->> { "username" : "user43229" } on : shardB Timestamp(19, 0)
                        { "username" : "user43229" } -->> { "username" : "user49877" } on : shardB Timestamp(20, 0)
                        { "username" : "user49877" } -->> { "username" : "user56522" } on : shardB Timestamp(21, 0)
                        { "username" : "user56522" } -->> { "username" : "user63169" } on : shardA Timestamp(21, 1)
                        { "username" : "user63169" } -->> { "username" : "user69816" } on : shardA Timestamp(10, 1)
                        { "username" : "user69816" } -->> { "username" : "user76462" } on : shardA Timestamp(11, 1)
                        { "username" : "user76462" } -->> { "username" : "user83108" } on : shardA Timestamp(12, 1)
                        { "username" : "user83108" } -->> { "username" : "user89756" } on : shardA Timestamp(14, 1)
                        { "username" : "user89756" } -->> { "username" : "user96401" } on : shardA Timestamp(15, 1)
                        { "username" : "user96401" } -->> { "username" : { "$maxKey" : 1 } } on : shardA Timestamp(15, 2)
```



块范围出现在每个分片集合的块计数之后。例如，以下是 `test.members`集合的块范围：

```shell
{ "username" : { "$minKey" : 1 } } -->> { "username" : "user16643" } on : shardB Timestamp(13, 0)
{ "username" : "user16643" } -->> { "username" : "user2329" } on : shardB Timestamp(16, 0)
{ "username" : "user2329" } -->> { "username" : "user29937" } on : shardB Timestamp(17, 0)
{ "username" : "user29937" } -->> { "username" : "user36583" } on : shardB Timestamp(18, 0)
{ "username" : "user36583" } -->> { "username" : "user43229" } on : shardB Timestamp(19, 0)
{ "username" : "user43229" } -->> { "username" : "user49877" } on : shardB Timestamp(20, 0)
{ "username" : "user49877" } -->> { "username" : "user56522" } on : shardB Timestamp(21, 0)
{ "username" : "user56522" } -->> { "username" : "user63169" } on : shardA Timestamp(21, 1)
{ "username" : "user63169" } -->> { "username" : "user69816" } on : shardA Timestamp(10, 1)
{ "username" : "user69816" } -->> { "username" : "user76462" } on : shardA Timestamp(11, 1)
{ "username" : "user76462" } -->> { "username" : "user83108" } on : shardA Timestamp(12, 1)
{ "username" : "user83108" } -->> { "username" : "user89756" } on : shardA Timestamp(14, 1)
{ "username" : "user89756" } -->> { "username" : "user96401" } on : shardA Timestamp(15, 1)
{ "username" : "user96401" } -->> { "username" : { "$maxKey" : 1 } } on : shardA Timestamp(15, 2)
```



### 合并块

合并同一分片上的连续块

例如，考虑`shardA`上的以下块范围：

>## 笔记
>
>要合并的块突出显示。

```shell
{ "username" : "user56522" } -->> { "username" : "user63169" } on : shardA Timestamp(21, 1)
{ "username" : "user63169" } -->> { "username" : "user69816" } on : shardA Timestamp(10, 1)
{ "username" : "user69816" } -->> { "username" : "user76462" } on : shardA Timestamp(11, 1)
{ "username" : "user76462" } -->> { "username" : "user83108" } on : shardA Timestamp(12, 1)
{ "username" : "user83108" } -->> { "username" : "user89756" } on : shardA Timestamp(14, 1)
{ "username" : "user89756" } -->> { "username" : "user96401" } on : shardA Timestamp(15, 1)
{ "username" : "user96401" } -->> { "username" : { "$maxKey" : 1 } } on : shardA Timestamp(15, 2)
```

要合并突出显示的连续块，请 对`admin`数据库发出`mergeChunks`命令：

```shell
db.adminCommand( {
   mergeChunks: "test.members",
   bounds: [ { "username" : "user69816" },
             { "username" : "user96401" } ]
} )
```



成功时，`mergeChunks`产生以下输出：

```shell
{
   "ok" : 1,
   "operationTime" : Timestamp(1589580356, 14),
   "$clusterTime" : {
      "clusterTime" : Timestamp(1589580356, 14),
      "signature" : {
         "hash" : BinData(0,"up5VKd49G/uPCq1iger2nOtfIHw="),
         "keyId" : NumberLong("6827188741371592725")
      }
   }
}
```



在任何失败情况下，mergeChunks返回`ok`字段值为`0`的文档。

### 查看合并的块范围

合并识别出的chunk后，确认新的chunk，如下：

```shell
sh.status()
```



`sh.status()`的输出应类似于：

```shell
--- Sharding Status ---
  sharding version: {
     "_id" : 1,
     "minCompatibleVersion" : 5,
     "currentVersion" : 6,
     "clusterId" : ObjectId("5ebef5447fa151d4bd79dd72")
  }
  shards:
        {  "_id" : "shardA",  "host" : "shardA/shardA-m1.example.net:27018,shardA-m2.example.net:27018,shardA-m3.example.net:27018",  "state" : 1 }
        {  "_id" : "shardB",  "host" : "shardB/shardB-m1.example.net:27018,shardB-m2.example.net:27018,shardB-m3.example.net:27018",  "state" : 1 }
  active mongoses:
        "4.4.0" : 1
  autosplit:
        Currently enabled: yes
  balancer:
        Currently enabled:  yes
        Currently running:  no
        Failed balancer rounds in last 5 attempts:  0
        Migration Results for the last 24 hours:
                519 : Success
  databases:
        {  "_id" : "config",  "primary" : "config",  "partitioned" : true }
                config.system.sessions
                        shard key: { "_id" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shardA   512
                                shardB   512
                       too many chunks to print, use verbose if you want to force print
        {  "_id" : "test",  "primary" : "shardA",  "partitioned" : true,  "version" : {  "uuid" : UUID("22c042fc-7e3d-4c6d-992d-f3d714759781"),  "lastMod" : 1 } }
                test.members
                        shard key: { "username" : 1 }
                        unique: false
                        balancing: true
                        chunks:
                                shardA       5
                                shardB       6
                        { "username" : { "$minKey" : 1 } } -->> { "username" : "user16643" } on : shardA Timestamp(22, 0)
                        { "username" : "user16643" } -->> { "username" : "user2329" } on : shardB Timestamp(22, 1)
                        { "username" : "user2329" } -->> { "username" : "user29937" } on : shardB Timestamp(17, 0)
                        { "username" : "user29937" } -->> { "username" : "user36583" } on : shardB Timestamp(18, 0)
                        { "username" : "user36583" } -->> { "username" : "user43229" } on : shardB Timestamp(19, 0)
                        { "username" : "user43229" } -->> { "username" : "user49877" } on : shardB Timestamp(20, 0)
                        { "username" : "user49877" } -->> { "username" : "user56522" } on : shardB Timestamp(21, 0)
                        { "username" : "user56522" } -->> { "username" : "user63169" } on : shardA Timestamp(21, 1)
                        { "username" : "user63169" } -->> { "username" : "user69816" } on : shardA Timestamp(10, 1)
                        { "username" : "user69816" } -->> { "username" : "user96401" } on : shardA Timestamp(21, 2)
                        { "username" : "user96401" } -->> { "username" : { "$maxKey" : 1 } } on : shardA Timestamp(15, 2)
```



合并后，平衡器可能会跨分片迁移块，以确保更均匀地分布块。

原文 - https://docs.mongodb.com/manual/tutorial/merge-chunks-in-sharded-cluster/ 

译者：陆文龙
