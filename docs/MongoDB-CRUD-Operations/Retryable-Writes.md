
## Retryable Writes（可重试写入）
**在本页面**

* [Prerequisites](#prerequisites)(前提条件)<br />

* [Retryable Writes and Multi-Document Transactions](#transactions)(可重试写入和多文档交易)<br />

* [Enabling Retryable Writes](#enabling)(启用可重试写入)<br />

* [Retryable Write Operations](#write)(可重试的写操作)<br />

* [Behavior](#behavior)(行为)<br />

*3.6版的新功能*<br />可重试写入允许MongoDB驱动程序在遇到网络错误或在副本集或分片群集中找不到正常的主操作时，一次自动重试某些写入操作。 

#### <span id="prerequisites">前提条件</span>

可重试写入具有以下要求：<br />

**支持的部署拓扑**<br />可重试写入需要副本集或分片群集，并且不支持独立实例。<br />**支持的存储引擎**<br />可重试写入需要支持文档级锁定的存储引擎，例如WiredTiger或内存中存储引擎。<br />**3.6+ MongoDB驱动程序**<br />客户端需要为MongoDB 3.6或更高版本更新的MongoDB驱动程序：

| Java 3.6+<br />Python 3.6+<br />C 1.9+ | C# 2.5+<br />Node 3.0+<br />Ruby 2.5+ | Perl 2.0+<br />PHPC 1.4+<br />Scala 2.2+ |
| -------------------------------------- | ------------------------------------- | ---------------------------------------- |
|                                        |                                       |                                          |


**MongoDB版本**<br />集群中每个节点的MongoDB版本必须为**3.6**或更高，集群中每个节点的**featureCompatibilityVersion**必须为**3.6**或更高。有关**featureCompatibilityVersion**标志的更多信息，请参见[setFeatureCompatibilityVersion](https://docs.mongodb.com/manual/reference/command/setFeatureCompatibilityVersion/#dbcmd.setFeatureCompatibilityVersion)。<br />**写确认书**<br />使用“**写关注**”为**0**的写入操作不可重试。

#### <span id="transactions">可重试写入和多文档交易</span>

*版本4.0中的新功能*<br />事务提交和中止操作是可重试的写操作。如果提交操作或中止操作遇到错误，则无论retryWrites是否设置为**false**，MongoDB驱动程序都会重试该操作一次。<br />不管[retryWrites](https://docs.mongodb.com/manual/reference/connection-string/#urioption.retryWrites)的值如何，事务内的写操作都不能单独重试。<br />有关交易的更多信息，请参见交易（[Transactions](https://docs.mongodb.com/manual/core/transactions/)）。

#### <span id="enabling">启用可重试写入</span>

**MongoDB驱动程序**<br />需要与MongoDB 3.6和4.0兼容的官方驱动程序，必须在连接字符串中包含**retryWrites = true**选项，才能为该连接启用可重试的写入。<br />官方兼容MongoDB 4.2的驱动程序默认情况下启用可重试写入。升级到需要可重试写入的4.2兼容驱动程序的应用程序可以省略**retryWrites = true**选项。升级到需要禁用可重试写入功能的4.2兼容驱动程序的应用程序必须在连接字符串中包含**retryWrites = false**。<br /> <br />**Mongo shell**<br />要在mongo shell中启用可重试写入，请使用[--retryWrites](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-retrywrites)命令行选项：

```shell
mongo --retryWrites
```

#### <span id="write">可重试的写操作</span>

当发出已确认的写入问题时，以下写入操作可以重试； 例如，[Write Concern](https://docs.mongodb.com/manual/reference/write-concern/)不能为**{w：0}**。

> 注意<br />事务内的写操作不可单独重试

| **Methods（方法）** | **Descriptions（说明）** |
| --- | --- |
| [db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)<br />[db.collection.insert()](https://docs.mongodb.com/manual/reference/method/db.collection.insert/#db.collection.insert)<br />[db.collection.insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany) | 插入操作 |
| [db.collection.updateOne()](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)<br />[db.collection.replaceOne()](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)<br />[db.collection.save()](https://docs.mongodb.com/manual/reference/method/db.collection.save/#db.collection.save)<br />[db.collection.update()](https://docs.mongodb.com/manual/reference/method/db.collection.update/#db.collection.update) where `multi` is `false` | 单文档更新操作。 |
| [db.collection.deleteOne()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)<br />[db.collection.remove()](https://docs.mongodb.com/manual/reference/method/db.collection.remove/#db.collection.remove) where justOne is true | 单个文档删除操作 |
| [db.collection.findAndModify()](https://docs.mongodb.com/manual/reference/method/db.collection.findAndModify/#db.collection.findAndModify)<br />[db.collection.findOneAndDelete()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndDelete/#db.collection.findOneAndDelete)<br />[db.collection.findOneAndReplace()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndReplace/#db.collection.findOneAndReplace)<br />[db.collection.findOneAndUpdate()](https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/#db.collection.findOneAndUpdate) | 查找和定义操作。所有查找定义操作都是单个文档操作。 |
| <br /> [db.collection.bulkWrite()](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkWrite) 具有以下写操作：<br />. [insertOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-insertone)<br />. [updateOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-updateonemany)<br />. [replaceOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-replaceone)<br />. [deleteOne](https://docs.mongodb.com/manual/reference/method/db.collection.bulkWrite/#bulkwrite-write-operations-deleteonemany)<br /> | 仅由单文档写操作组成的批量写操作。可重试的批量操作可以包括指定写操作的任何组合，但不能包括任何多文档写操作，例如updateMany。 |
| [Bulk](https://docs.mongodb.com/manual/reference/method/Bulk/#Bulk) operations for:<br />. [Bulk.find.removeOne()](https://docs.mongodb.com/manual/reference/method/Bulk.find.removeOne/#Bulk.find.removeOne)<br />. [Bulk.find.replaceOne()](https://docs.mongodb.com/manual/reference/method/Bulk.find.replaceOne/#Bulk.find.replaceOne)<br />. [Bulk.find.replaceOne()](https://docs.mongodb.com/manual/reference/method/Bulk.find.replaceOne/#Bulk.find.replaceOne)<br /> | 仅由单文档写操作组成的批量写操作。可重试的批量操作可以包括指定写操作的任何组合，但不能包括任何多文档写操作，例如update，它为multi选项指定true。 |

> **分片键值更新**<br />从MongoDB 4.2开始，您可以通过发布可重试写入或事务处理中的单文档**update / findAndModify**操作来更新文档的分片键值（除非分片键字段是不可变的**_id**字段）。 有关详细信息，请参见更改文档的分片键值。<br />

* MongoDB 4.2将重试遇到重复密钥异常的某些单文档upsert（更新使用**upsert：true**和**multi：false**）。 有关条件，请参阅Upsert上的重复键错误。<br />
* 在MongoDB 4.2之前，MongoDB不会重试遇到重复键错误的upsert操作。

#### <span id="behavior">行为</span>

**持续的网络错误**<br />MongoDB可重试写入仅进行一次重试尝试。 这有助于解决瞬态网络错误和副本集选择，但不能解决持久性网络错误。<br />**故障转移期**<br />如果驱动程序在目标副本集或分片的群集分片中找不到正常的主数据库，则驱动程序将等待[serverSelectionTimeoutMS](https://docs.mongodb.com/manual/reference/connection-string/#urioption.serverSelectionTimeoutMS)毫秒确定新的主数据库，然后重试。 可重试的写操作不会解决故障转移时间超过[serverSelectionTimeoutMS](https://docs.mongodb.com/manual/reference/connection-string/#urioption.serverSelectionTimeoutMS)的实例。

> <p style="background-color:#FAE6E5"><span style="color:red">警告</span><br />如果客户端应用程序<a href="https://docs.mongodb.com/manual/reference/parameters/#param.localLogicalSessionTimeoutMinutes">localLogicalSessionTimeoutMinutes</a>在发出写操作之后变得暂时不响应，而不是发出更多响应，则有可能当客户端应用程序开始响应（不重新启动）时，可以重试并再次应用写操作。<br /></p>

**Upsert上的重复键错误**<br />仅当操作满足以下所有条件时，MongoDB 4.2才会重试由于重复键错误而失败的单文档upsert操作(即:**upsert : true**和**multi : false**):

* 目标集合具有导致重复键错误的唯一索引。<br />
* 更新匹配条件为：
  * 单个相等谓词<br />**{ "fieldA" : "valueA" }**，<br />or<br />
  * 相等谓词的逻辑与<br />**{ "fieldA" : "valueA", "fieldB" : "valueB" }**<br />
* 唯一索引键模式中的字段集与更新查询谓词中的字段集匹配。<br />
* 更新操作不会修改查询谓词中的任何字段。<br />下表包含服务器可以或不能在重复键错误时重试的upsert操作示例：

| **唯一索引键模式**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| **更新操作**&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | **可重试** |
| ---- | --- | --- |
| {  _id  ： **1**  } | db.collName.updateOne(  <br />      { _id : ObjectId("**1aa1c1efb123f14aaa167aaa**") },  <br/>      { $set : { fieldA : **25** } },  <br />      { upsert : **true** } <br />) | 是 |
| {  fieldA  ： **1**  } | db.collName.updateOne(  <br />        { fieldA : { $in : [ **25** ] } },  <br />        { $set : { fieldB : "**someValue**" } }, <br />        { upsert : **true** } <br />) | 是 |
| {<br />       fieldA：**1**，<br />  fieldB  ：**1**<br />} | db.collName.updateOne(  <br />      { fieldA : **25**, fieldB : "**someValue**" },  <br />      { $set : { fieldC : **false** } },  <br />      { upsert : **true** } <br />) | 是 |
| {  fieldA  ： **1**  } | db.collName.updateOne(  <br />      { fieldA : { $lte : **25** } }, <br />      { $set : { fieldC : **true** } },  <br />      { upsert : **true** } <br />) | 没有<br />查询谓词**fieldA**不等于 |
| {  fieldA  ： **1**  } | db.collName.updateOne(  <br />      { fieldA : { $in : [ **25** ] } },   <br />      { $set : { fieldA : **20** } }, <br />      { upsert : **true** } <br />) | 没有<br />更新操作修改查询谓词中指定的字段。 |
| {  _id  ： **1**  } | db.collName.updateOne(  <br />       { fieldA : { $in : [ **25** ] } }, <br />       { $set : { fieldA : **20** } },  <br />       { upsert : **true** } <br />) | 没有<br />查询谓词字段集（**fieldA**）与索引关键字字段集（）不匹配**_id**。 |
| {  fieldA  ： **1**  } | db.collName.updateOne( <br />       { fieldA : 25, fieldC : **true** }, <br />       { $set : { fieldD : **false** } }, <br />       { upsert : **true** } <br />) | 没有<br />这组查询谓词的字段（**fieldA**，**fieldC**）不匹配组索引键的字段（**fieldA**） |

**诊断程序**

*版本3.6.3中的新功能*

**serverStatus**命令及其mongo shell帮助程序[db.serverStatus()](#)在**Transactions**节中包含有关可重试写入的统计信息。<br />

**针对本地数据库的可重试写入**

官方的MongoDB 4.2系列驱动程序默认情况下启用重试写入。 除非明确禁止重试写入，否则写入本地数据库的应用程序在升级到4.2系列驱动程序时将遇到写入错误。<br />要禁用可重试写入，请在MongoDB集群的连接字符串([connection string](https://docs.mongodb.com/manual/reference/connection-string/#mongodb-uri) )中指定**retryWrites = false**。
<a name="k4vrB"></a>