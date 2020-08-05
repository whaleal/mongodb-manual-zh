# Retryable Reads


**在本页面**

*   [Prerequisites](#prerequisites)(前提条件)
*   [Enabling Retryable Reads](#enabling-retryable-reads)(启用可重试读取)
*   [Retryable Read Operations](#retryable-read-operations)(可重试的读取操作)
*   [Behavior](#behavior)(行为)

可重试读取允许MongoDB驱动程序在遇到某些网络或服务器错误时，可以一次自动重试某些读取操作。

#### <span id="prerequisites">前提条件</span>

**最低驱动程序版本**

​		与MongoDB Server 4.2及更高版本兼容的官方MongoDB驱动程序支持可重试读取。

​		有关官方MongoDB驱动程序的更多信息，请参阅 [MongoDB驱动程序](https://docs.mongodb.com/drivers/)。

**最低服务器版本**

​		如果连接到MongoDB Server 3.6或更高版本，驱动程序只能重试读取操作。


#### <span id="enabling-retryable-reads">启用可重试读取</span>

与MongoDB Server 4.2及更高版本兼容的官方MongoDB驱动程序默认情况下启用重试读取。要显式禁用可重试读取，请[`retryReads=false`](https://docs.mongodb.com/manual/reference/connection-string/#urioption.retryReads)在部署的 [连接字符串中](https://docs.mongodb.com/manual/reference/connection-string/#mongodb-uri)指定。

在[`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo)外壳不支持重试读取。


#### <span id="retryable-read-operations">可重试的读取操作</span>

MongoDB驱动程序支持重试以下读取操作。该列表引用了每种方法的一般描述。有关特定的语法和用法，请参阅该方法的驱动程序文档。

| 方法                                                         | 内容描述          |
| ------------------------------------------------------------ | ----------------- |
| Collection.aggregate<br /> Collection.count <br />Collection.countDocuments<br /> Collection.distinct<br /> Collection.estimatedDocumentCount <br />Collection.find <br />Database.aggregate | CRUD API读取操作. |

对于`Collection.aggregate`和`Database.aggregate`，驱动程序只能重试不包括写阶段的聚合管道，如[$out](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)或[$merge](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge)。

|                                                              |                    |
| ------------------------------------------------------------ | ------------------ |
| Collection.watch<br /> Database.watch <br />MongoClient.watch | 更改流操作         |
| MongoClient.listDatabases<br /> Database.listCollections<br /> Collection.listIndexes | 枚举操作           |
| GridFS操作由`Collection.find` （<br />例如`GridFSBucket.openDownloadStream`）支持 | GridFS文件下载操作 |

MongoDB驱动程序*可能*包括对其他操作的*可*重试支持，例如辅助方法或包装可重试读操作的方法。根据[驱动程序文档](https://docs.mongodb.com/drivers/) 确定方法是否显式支持可重试的读取。

也可以看看

可重试读取规范：[支持的读取操作](https://github.com/mongodb/specifications/blob/master/source/retryable-reads/retryable-reads.rst#supported-read-operations)

##### 不支持的读取操作

以下操作*不*支持可重试的读取：

*   [db.collection.mapReduce()](https://docs.mongodb.com/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce)
*   [getMore](https://docs.mongodb.com/manual/reference/command/getMore/#dbcmd.getMore)
*   传递给通用**Database.runCommand**帮助程序的任何读取命令，都与读取或写入命令无关。

#### <span id="behavior">行为</span>

##### 持久性网络错误

MongoDB可重试读取仅进行**一次**重试。这有助于解决瞬态网络错误或 [副本集选择](https://docs.mongodb.com/manual/core/replica-set-elections/#replica-set-elections)，但不能解决持久性网络错误。
##### 故障转移期间

在重试读取操作之前，驱动程序将使用读取命令的原始[读取首选项](https://docs.mongodb.com/manual/core/read-preference/#read-preference)执行[服务器选择](https://docs.mongodb.com/manual/core/read-preference-mechanics/#replica-set-read-preference-behavior)。如果驱动程序无法使用原始读取首选项选择服务器进行重试，则驱动程序将返回原始错误。

驱动程序[serverSelectionTimeoutMS](https://docs.mongodb.com/manual/reference/connection-string/#urioption.serverSelectionTimeoutMS)在执行服务器选择之前会等待毫秒。可重试读取不能解决等待后不存在合格服务器的实例 [serverSelectionTimeoutMS](https://docs.mongodb.com/manual/reference/connection-string/#urioption.serverSelectionTimeoutMS)。

