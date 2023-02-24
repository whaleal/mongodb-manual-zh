# 将4.2独立降级到4.0

## 降级路径

在尝试降级之前，请熟悉本文档的内容。 

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.2降级，请降级到4.0的最新补丁版本。

> 提示：
>
> 如果您降级，
>
> - 在Windows上，降级到4.0.12或更高版本。您无法降级到4.0.11或更低版本。
> - 在Linux/macOS上，如果您正在运行更改流，并希望无缝[恢复更改流](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)，请降级到4.0.7或更高版本。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 访问控制

如果您的部署启用了访问控制，则降级用户特权必须包括跨数据库列出和管理索引的特权。具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色的用户具有所需的特权。

## 先决条件

要从4.2降级到4.0，您必须删除持久存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

### 1.降级功能兼容性版本（fCV）

要降级独立`featureCompatibilityVersion`：

1. 将mongo shell连接到 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

2. 降级`featureCompatibilityVersion`为`"4.0"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.0"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未能成功完成，请在[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例上重试该命令。

### 2.删除FCV 4.2持久功能

只有当fCV被设置为`"4.2"`时，以下步骤才是必要的。

删除所有[与4.0不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)的持久4.2功能。这些包括：

#### 2a。索引键大小[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/#2a.-index-key-size)

从MongoDB 4.2开始，对于设置为`"4.2"`或更高的`featureCompatibilityVersion`（fCV），MongoDB删除了[索引密钥限制](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)。对于设置为`"4.0"`fCV，该限制仍然适用。

如果fCV设置为“4.0”后，索引的键超过了索引键限制，请考虑将索引更改为散列索引或索引计算值。您还可以在解决问题之前暂时将 [`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong)设置为false。但是，如果将 [`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong)设置为false，则使用这些索引的查询可能返回不完整的结果。

#### 2b。索引名称长度

从MongoDB 4.2开始，对于设置为`"4.2"`或更高的`featureCompatibilityVersion`（fCV），MongoDB删除了[索引名称长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Name-Length)。对于设置为`"4.0"`的fCV，该限制仍然适用。

如果您的索引名称在fCV设置为`"4.0"`后超过[索引名称长度，请](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Name-Length)删除并使用较短的名称重新创建索引。

```
db.collection.dropIndex( <name | index specification> )

db.collection.createIndex(
   { <index specification> },
   { name: <shorter name> }
}
```

> 参见：
>
> - [`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)
> - [`db.collection.createIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)

#### 2c。独特的索引版本

对于`featureCompatibilityVersion`（fCV）`“4.2”`，MongoDB为唯一索引使用一种新的内部格式，该格式与MongoDB 4. 0不兼容。新的内部格式既适用于现有的唯一索引，也适用于新建/重建的唯一索引。

如果fCV曾设置为`"4.2"`请使用以下脚本删除并重新创建所有唯一索引。

> 提示：
>
> 在您解决任何问题后执行此操作[索引键大小](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/#std-label-4.2-downgrade-index-key-standalone)和[索引名称长度](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/#std-label-4.2-downgrade-index-name-standalone)问题首先。

### 脚本

```
// A script to rebuild unique indexes after downgrading fcv 4.2 to 4.0.
// Run this script to drop and recreate unique indexes
// for backwards compatibility with 4.0.

db.adminCommand("listDatabases").databases.forEach(function(d){
   let mdb = db.getSiblingDB(d.name);

   mdb.getCollectionInfos( { type: "collection" } ).forEach(function(c){
      let currentCollection = mdb.getCollection(c.name);

      currentCollection.getIndexes().forEach(function(idx){
         if (idx.unique){
            print("Dropping and recreating the following index:" + tojson(idx))

            assert.commandWorked(mdb.runCommand({dropIndexes: c.name, index: idx.name}));

            let res = mdb.runCommand({ createIndexes: c.name, indexes: [idx] });
            if (res.ok !== 1)
               assert.commandWorked(res);
         }
      });
   });
});
```

#### 2d。删除`user_1_db_1`系统唯一索引

此外，如果您启用了[访问控制](https://www.mongodb.com/docs/upcoming/tutorial/enable-authentication/)，您还必须删除`admin.system.users`集合上的systemunique索引`user_1_db_1`。

如果fCV曾设置为`"4.2"`请使用以下命令删除`user_1_db_1`系统唯一索引：

```
db.getSiblingDB("admin").getCollection("system.users").dropIndex("user_1_db_1")
```

在以下过程中使用4.0二进制文件启动服务器时，`user_1_db_1`索引将自动重建。

#### 2e。删除通配符索引

对于设置为`"4.2"``featureCompatibilityVersion`（fCV），MongoDB支持创建[通配符索引](https://www.mongodb.com/docs/upcoming/core/index-wildcard/)。在降级到fCV`"4.0"`之前，您必须删除所有通配符索引。

使用以下脚本删除并重新创建所有通配符索引：

```
// A script to drop wildcard indexes before downgrading fcv 4.2 to 4.0.
// Run this script to drop wildcard indexes
// for backwards compatibility with 4.0.

db.adminCommand("listDatabases").databases.forEach(function(d){
   let mdb = db.getSiblingDB(d.name);
   mdb.getCollectionInfos({ type: "collection" }).forEach(function(c){
      let currentCollection = mdb.getCollection(c.name);
      currentCollection.getIndexes().forEach(function(idx){

         var key = Object.keys(idx.key);
         if (key[0].includes("$**")) {

           print("Dropping index: " + idx.name + " from " + idx.ns);

           let res = mdb.runCommand({dropIndexes: currentCollection, index: idx.name});
           assert.commandWorked(res);

         }

      });
   });
});
```

> 重要：
>
> 在进行中的通配符索引构建期间降级到fCV`"4.0"`*不会*自动删除或终止索引构建。索引构建可以在降级到fcv`"4.0"`后完成，从而在集合上生成有效的通配符索引。针对该数据目录启动4.0二进制文件将导致启动失败。
>
> 使用[`db.currentOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.currentOp/#mongodb-method-db.currentOp)检查是否有任何正在进行的通配符索引构建。一旦任何正在进行的通配符索引构建完成，请运行脚本将其删除，*然后再*降级到fCV`"4.0"`

#### 2f。查看包含4.2个运算符的定义/集合验证定义

在降级二进制文件之前，请修改包含[4.2运算符](https://www.mongodb.com/docs/upcoming/release-notes/4.2/#std-label-4.2-agg)的[只读视图](https://www.mongodb.com/docs/upcoming/core/views/)定义和[集合验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-query-expression-rules/#std-label-schema-validation-query-expression)定义，例如[`$set`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set)、[`$unset`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)、[`$replaceWith`。](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)

* 对于[`$set`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set)阶段，请使用[`$addFields`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields)阶段。
* 对于[`$replaceWith`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)阶段，请使用[`$replaceRoot`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/replaceRoot/#mongodb-pipeline-pipe.-replaceRoot)阶段。
* 对于[`$unset`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)阶段，请使用[`$project`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project)阶段。

您可以通过以下方式修改视图：

- 删除视图（[`db.myview.drop()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)方法）并重新创建视图（[`db.createView()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createView/#mongodb-method-db.createView)方法）或
- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令。

您可以通过以下方式修改colleciton验证表达式：

- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令。

### 3.更新`tls`前缀配置

从MongoDB 4.2开始，MongoDB添加了“tls”前缀选项作为“ssl”前缀选项的别名。

如果您的部署或客户端使用“tls”前缀选项，请替换为mongod、mongos以及mongo shell和驱动程序的相应“ssl”前缀选项。

### 4.准备从`zstd`压缩降级

#### `zstd`数据压缩

[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库从4.2版本开始可用。

如果您的独立设备有任何使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩的数据：

> 提示：
>
> 在完成所有其他先决条件步骤后，执行此步骤。

1. 停止对实例的所有写入。

2. 创建一个[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)在开始降级之前，您的数据库；[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)输出未压缩的数据。

   ```
   mongodump --host=<myhost> --port=<port> --out=mystandalone.uncompressed.fcv4.0
   ```

   如果您的独立执行访问控制，请包含任何其他选项，例如`--username`、`--password`和`--authenticationDatabase`。

3. 为[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例创建一个新的空[`data directory`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)。此目录将在下面的降级过程中使用。

   >重要：
   >
   >确保运行[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的用户帐户具有新目录的读写权限。

4. 如果您使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新该文件以为降级过程做好准备：

   * Deletestorage[`storage.wiredTiger.collectionConfig.blockCompressor`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.collectionConfig.blockCompressor)使用默认压缩器（`snappy`）或设置为另一个支持4.0的压缩机。

   * 将[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)到新的数据目录。

     如果您改用命令行选项，则必须更新以下规程中的选项。

#### `zstd`日志压缩

从4.2版本开始，[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库可用于日志数据压缩。

如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)库作为其日志压缩机：

- 如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，删除[`storage.wiredTiger.engineConfig.journalCompressor`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.journalCompressor)使用默认压缩器（`snappy`）或设置为另一个支持4.0的压缩机。
- 如果改用命令行选项，则必须更新以下规程中的选项。

> 笔记：
>
> 如果您在降级过程中遇到[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的不干净关机，因此您需要使用日志文件进行恢复，请使用4.2 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)恢复实例，然后重试实例的降级。

#### `zstd`网络压缩

从4.2版本开始，[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库可用于网络消息压缩。

为准备降级：

1. 对于使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)进行网络消息压缩并使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例，请更新[`net.compression.compressors`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.compression.compressors)设置，为降级过程中的重新启动做准备。

   如果您改用命令行选项，则必须更新以下规程中的选项。

2. 对于在其[`URI connection string`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.compressors)中指定`zstd`的任何客户端，请更新以从列表中删除`zstd`。

3. 对于任何在其--networkMessageCompressors中指定zstd的mongo shell，更新以从列表中删除zstd。

> 重要：
>
> 当双方启用网络压缩时，消息会被压缩。否则，双方之间的消息将被解压缩。

### 5.删除客户端字段级加密文档验证关键字

> 重要：
>
> 在降级服务器*之前*，删除应用程序中的客户端字段级加密代码。

MongoDB 4.2增加了对[执行客户端字段级加密](https://www.mongodb.com/docs/upcoming/core/csfle/reference/server-side-schema/#std-label-field-level-encryption-enforce-schema)的支持，作为集合的[指定JSON模式验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-json-schema/#std-label-schema-validation-json)文档验证的一部分。具体来说，[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)对象支持[`encrypt`](https://www.mongodb.com/docs/upcoming/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)和[`encryptMetadata`](https://www.mongodb.com/docs/upcoming/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)关键字。MongoDB 4.0**不**支持这些关键字，如果任何集合将这些关键字指定为其验证[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)的一部分，则无法启动[。](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)

在每个数据库上使用[`db.getCollectionInfos()`](https://www.mongodb.com/docs/upcoming/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)来识别指定自动字段级加密规则的集合，作为[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)验证器的一部分。要准备降级，请使用4.0不兼容的关键字对每个集合执行以下操作之一：

- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)修改集合的[`validator`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-collflag-validator)，并将[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)替换为仅包含[4.0兼容的文档验证语法：](https://www.mongodb.com/docs/v4.0/reference/operator/query/jsonSchema/#available-keywords)

  ```
  db.runCommand({
    "collMod" : "<collection>",
    "validator" : {
      "$jsonSchema" : { <4.0-compatible schema object> }
    }
  })
  ```

  -*或*-

- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)完全删除[`validator`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-collflag-validator)对象：

  ```
  db.runComand({ "collMod" : "<collection>", "validator" : {} })
  ```

## 程序

> 警告：
>
> 在继续进行降级程序之前，请确保已完成先决条件。

### 1、下载最新的4.0二进制文件

使用软件包管理器或手动下载，获取4.0系列的最新版本。如果使用软件包管理器，请为4.0二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.2降级，请降级到4.0的最新补丁版本。

### 2、使用最新的4.0 `mongod`实例重新启动

1. 关闭你的mongod副本。要安全地终止mongod进程，您可以将mongo shell连接到实例并运行：

   ```
   db.adminCommand( { shutdown: 1 } )
   ```

   有关安全终止mongod实例的其他方法，请参见[Stop `mongod` Processes.](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes)。

2. 将4.2二进制文件替换为下载的4.0[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，然后重新启动。

   > 笔记：
   >
   > 如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
   >
   > - 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
   > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
   >   - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
   >   - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩机（或者显式设置为4.0支持的压缩机）。
   > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
   >   - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩机（或者，显式设置为4.0支持的压缩机）。
   > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包含`zstd`网络消息压缩，
   >   - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，明确指定压缩机。

   ### 3、如果从`zstd`压缩切换，请恢复数据。

   如果您尚未从使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩的独立降级，请跳过此步骤。

   如果您已从使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)的独立版降级，则已将数据转储为[先决条件](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/#std-label-downgrade-standalone-prereq-zstd)。使用[`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)将该数据恢复到您的4.0独立数据。

   ```
   mongorestore --host=<myhost> --port=<port>  mystandalone.uncompressed.fcv4.0
   ```

   



原文 - [Downgrade 4.2 Standalone to 4.0]( https://docs.mongodb.com/manual/release-notes/4.2-downgrade-standalone/ )

