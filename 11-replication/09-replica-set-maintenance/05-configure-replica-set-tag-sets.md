# 配置副本集标签集

一个或多个副本集成员可以配置为 [`tags`：](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)

```
{ "<tag1>": "<string1>", "<tag2>": "<string2>",... }
```

对于读取操作，您可以在[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference)中指定一个标签集，以帮助将读取操作定向到具有特定标签的成员。

对于写入操作，您可以使用标签创建自定义 [写安全](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)。



## 在阅读首选项中使用标签集

如果一个或多个副本集节点与[`tags`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)关联 ，您可以在[读取首选项](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-read-preference)中指定一个标记集来定位这些节点。标签集是文档数组，其中每个文档都包含标签和值对。将按顺序尝试指定，直到找到匹配为止。一旦找到，该规范将用于查找所有符合条件的匹配节点。



## NOTE

指定读取首选项模式时不能指定标签集 [`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)。

例如，副本集具有以下[副本集配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/#std-label-replica-set-configuration-document)（为简洁起见，省略了一些字段）：

```
{
   "_id" : "rs0",
   "version" : 1,
   "protocolVersion" : NumberLong(1),
   "writeConcernMajorityJournalDefault" : true,
   "members" : [
       { "_id" : 0, "host" : "mongodb0.example.net:27017", ...,  "tags": { }, ... },
       { "_id" : 1, "host" : "mongodb1.example.net:27017", ...,  "tags": { }, ... },
       { "_id" : 2, "host" : "mongodb2.example.net:27017", ...,  "tags": { }, ... }
   ],
   "settings" : {
      ...
   }
}
```



1. **为成员添加标签。**

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到副本集并用于 [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)向成员添加标签：

   ```
   conf = rs.conf();
   conf.members[0].tags = { "dc": "east", "usage": "production" };
   conf.members[1].tags = { "dc": "east", "usage": "reporting" };
   conf.members[2].tags = { "dc": "west", "usage": "production" };
   rs.reconfig(conf);
   ```

   

2. **验证副本集配置。**

   运行[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)以验证副本集配置（为简洁起见，省略了一些字段）。[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)返回类似于以下内容的文档：

   ```
   {
      "_id" : "rs0",
      "version" : 2,
      "protocolVersion" : NumberLong(1),
      "writeConcernMajorityJournalDefault" : true,
      "members" : [
         {
             "_id" : 0,
             "host" : "mongodb0.example.net:27017",
             ...
             "tags" : {
                 "dc": "east",
                 "usage": "production"
             },
             ...
         },
         {
             "_id" : 1,
             "host" : "mongodb1.example.net:27017",
             ...
             "tags" : {
                 "dc": "east",
                 "usage": "reporting"
             },
             ...
          },
         {
             "_id" : 2,
             "host" : "mongodb2.example.net:27017",
             ...
             "tags" : {
                 "dc": "west",
                 "usage": "production"
             },
             ...
         }
      ],
      "settings" : {
         ...
      }
   }
   ```

   

3. **在阅读首选项中指定标签集。**

   要将读取操作定向到标记有特定标签的从节点，在[`mongo`](https://www.mongodb.com/docs/manual/reference/mongo/#mongodb-binary-bin.mongo)连接到副本集的 shell 中，您可以使用该[`readPref()`](https://www.mongodb.com/docs/manual/reference/method/cursor.readPref/#mongodb-method-cursor.readPref)方法指定 [读取首选项模式](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-read-pref-modes-summary)和[标签集](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)。例如，

   - 要将读取操作定向到标记有 和 的从节点*，* `"dc": "east"`请`"usage": "production"`包括以下标记集：

     ```
     db.collection.find({}).readPref( "secondary", [ { "dc": "east", "usage": "production" } ] )
     ```

     

   - 要将读取操作定向到标记为的从节点`"dc": "east"`，如果未找到，则定向到标记为的从节点 `"usage": "production"`，包括以下标记集：

     ```
     db.collection.find({}).readPref( "secondary", [ { "dc": "east"}, { "usage": "production" } ] )
     ```

     

   

   ## 提示

   ### 也可以看看：

   [`Mongo.setReadPref()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.setReadPref/#mongodb-method-Mongo.setReadPref)



## 自定义多数据中心写入问题

如果一个或多个副本集节点与[`tags`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)关联，您可以配置副本集的 [`settings.getLastErrorModes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorModes)设置以创建自定义写入问题。

给定一个包含两个数据中心成员的五节点副本集：

1. 设施`VA`标记`dc_va`
2. 设施`CA`标记`dc_ca`

```
{
   "_id" : "rs0",
   "version" : 1,
   "protocolVersion" : NumberLong(1),
   "writeConcernMajorityJournalDefault" : true,
   "members" : [
       { "_id" : 0, "host" : "mongodb0.example.net:27017", ...,  "tags": { }, ... },
       { "_id" : 1, "host" : "mongodb1.example.net:27017", ...,  "tags": { }, ... },
       { "_id" : 2, "host" : "mongodb2.example.net:27017", ...,  "tags": { }, ... }
       { "_id" : 3, "host" : "mongodb3.example.net:27017", ...,  "tags": { }, ... }
       { "_id" : 4, "host" : "mongodb4.example.net:27017", ...,  "tags": { }, ... }
   ],
   "settings" : {
      ...
   }
}
```



1. **为副本集节点添加标签。**

   连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到副本集并用于 [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)向节点添加标签：

   ```
   conf = rs.conf();
   conf.members[0].tags = { "dc_va": "rack1"};
   conf.members[1].tags = { "dc_va": "rack2"};
   conf.members[2].tags = { "dc_ca": "rack1"};
   conf.members[3].tags = { "dc_ca": "rack2"};
   conf.members[4].tags = { "dc_va": "rack1"};
   rs.reconfig(conf);
   ```

   

2. **创建自定义写入问题。**

   在副本集配置中，在设置中定义一个自定义写安全[`settings.getLastErrorModes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorModes)。例如，以下定义了自定义写安全`MultipleDC`，它要求写入传播到两个具有*不同* `dc_va`标签值的成员和一个具有任何`dc_ca`标签值的成员。

   ```
   conf = rs.conf();
   conf.settings = { getLastErrorModes: { MultipleDC : { "dc_va": 2, "dc_ca": 1 } } };
   rs.reconfig(conf);
   ```

   

   

   ## NOTE

   如果写入传播到具有相同标签的`MultipleDC`两个节点，则不满足写入问题。`"dc_va"`例如，如果写入仅传播到`members[0]`和 `members[4]`，`"dc_va": 2`则不满足，因为它们具有相同的标记值`"rack1"`。

3. **使用自定义写安全。**

   要使用自定义写安全，请将写入关注名称传递给写安全中的[`w`选项](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)：

   ```
   db.collection.insertOne(
      { id: "xyz", status: "A" },
      { writeConcern: { w: "MultipleDC" } }
   )
   ```

   

←  [重新同步副本集的节点](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)。           [使用不可用节点重新配置副本集](https://www.mongodb.com/docs/manual/tutorial/reconfigure-replica-set-with-unavailable-members/) →

原文链接 -https://docs.mongodb.com/manual/tutorial/configure-replica-set-tag-sets/ 

译者：陆文龙

