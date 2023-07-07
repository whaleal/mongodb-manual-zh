# 将4.2分片集群降级到4.0

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

>重要：
>
>在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.2降级，请降级到4.0的最新补丁版本。

> 提示：
>
> 如果您降级，
>
> - 在Windows上，降级到4.0.12或更高版本。您无法降级到4.0.11或更低版本。
> - 在Linux/macOS上，如果您正在运行更改流，并希望无缝[恢复更改流](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)，请降级到4.0.7或更高版本。

## 注意事项

从MongoDB 4.2开始，无论[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持如何，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)都是可用的；也就是说，读取关注`majority`支持可以启用（默认）或[禁用以](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)使用更改流。

在MongoDB 4.0及更低版本中，只有当启用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持（默认）时，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)才可用。

一旦您降级到4.0系列，如果您禁用了读取关注`"majority"`更改流将被禁用。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 访问控制

如果您的分片集群启用了访问控制，则降级用户特权必须包括管理`config`数据库索引的其他特权。

```shell
db.getSiblingDB("admin").createRole({
     role: "configIndexRole",
     privileges: [
        {
          resource: { db: "config", collection: "" },
          actions: [ "find", "dropIndex", "createIndex", "listIndexes" ]
        }
     ],
     roles: [  ]
});
```

将新创建的角色添加到降级用户中。例如，如果您在`admin`数据库中有一个用户`myDowngradeUser`已经具有[`root`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-root)角色，请使用[`db.grantRolesToUser()`](https://www.mongodb.com/docs/upcoming/reference/method/db.grantRolesToUser/#mongodb-method-db.grantRolesToUser)授予附加角色：

```shell
db.getSiblingDB("admin").grantRolesToUser( "myDowngradeUser",
   [ { role: "configIndexRole", db: "admin" } ],
   {  w: "majority", wtimeout: 4000 }
);
```

## 先前条件

要从4.2降级到4.0，您必须删除持久存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

### 1、降级功能兼容性版本（fCV）

要降级分片集群`featureCompatibilityVersion`：

1. 将mongo shell连接到 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例。

2. 降级`featureCompatibilityVersion`为`"4.0"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "4.0"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未能成功完成，请在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例上重试该命令。

3. 为了确保分片集群的所有成员都反映更新的`featureCompatibilityVersion`，请连接到每个碎片副本集成员和每个配置服务器副本集成员，并检查`featureCompatibilityVersion`：

   > 提示：
   >
   > 对于启用了访问控制的分片集群，要对碎片副本集成员运行以下命令，您必须以[碎片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)的身份连接到该成员[。](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)

   ```
   db.adminCommand( { getParameter: 1, featureCompatibilityVersion: 1 } )
   ```

   所有成员都应返回一个结果，其中包括:

   ```
   "featureCompatibilityVersion" : { "version" : "4.0" }
   ```

   如果任何成员返回的featureCompatibilityVersion为“4. 2”，请等待该成员反映版本“4. 0”后再继续。

   > 笔记：
   >
   > 仲裁员不会复制[`admin.system.version`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data-admin.system.version)集合。因此，仲裁员总是有一个与二进制文件降级版本相等的功能兼容性版本，无论副本集的FCV值如何。
   >
   > 例如，MongoDB 4.2集群中的仲裁器的FCV值为4.0。

   有关返回的`featureCompatibilityVersion`值的详细信息，请参阅 [Get FeatureCompatibilityVersion.](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)

### 2.删除FCV 4.2持久功能

只有当fCV被设置为`"4.2"`时，以下步骤才是必要的。

删除所有[与4.0不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)的持久4.2功能。这些包括：

#### 2a。索引键大小

从MongoDB 4.2开始，对于设置为`"4.2"`或更高的`featureCompatibilityVersion`（fCV），MongoDB删除了[索引密钥限制](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)。对于设置为`"4.0"`fCV，该限制仍然适用。

如果fCV设置为“4.0”后，索引的键超过了索引键限制，请考虑将索引更改为散列索引或索引计算值。您还可以在解决问题之前暂时将 [`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong)设置为false。但是，如果将[`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong)设置为false，则使用这些索引的查询可能返回不完整的结果。

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

> 提示：
>
> ### 参见：
>
> - [`db.collection.dropIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.dropIndex/#mongodb-method-db.collection.dropIndex)
> - [`db.collection.createIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.createIndex/#mongodb-method-db.collection.createIndex)

#### 2c。独特的索引版本

对于`featureCompatibilityVersion（fCV）“4.2”`，MongoDB为唯一索引使用一种新的内部格式，该格式与MongoDB 4. 0不兼容。新的内部格式既适用于现有的唯一索引，也适用于新建/重建的唯一索引。

如果fCV曾设置为`"4.2"`请使用以下脚本删除并重新创建所有唯一索引。

**运行的脚本`mongos`**

```shell
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

**在分片上运行的脚本**

[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上运行脚本后，如果您创建了[碎片本地用户](https://www.mongodb.com/docs/upcoming/core/security-users/#std-label-shard-local-users)，则需要检查单个碎片。也就是说，如果您直接在碎片上而不是通过[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)创建维护用户，请在碎片的主要成员上运行脚本。

```shell
// A script to rebuild unique indexes after downgrading fcv 4.2 to 4.0.
// Run this script on shards to drop and recreate unique indexes
// for backwards compatibility with 4.0.

let mdb = db.getSiblingDB('admin');

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

```shell
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

- 对于[`$set`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set)阶段，请使用[`$addFields`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields)阶段。
- 对于[`$replaceWith`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/replaceWith/#mongodb-pipeline-pipe.-replaceWith)阶段，请使用[`$replaceRoot`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/replaceRoot/#mongodb-pipeline-pipe.-replaceRoot)阶段。
- 对于[`$unset`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)阶段，请使用[`$project`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project)阶段。

您可以通过以下方式修改视图：

- 删除视图（[`db.myview.drop()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.drop/#mongodb-method-db.collection.drop)方法）并重新创建视图（[`db.createView()`](https://www.mongodb.com/docs/upcoming/reference/method/db.createView/#mongodb-method-db.createView)方法）或
- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令。

您可以通过以下方式修改colleciton验证表达式：

- 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)命令。

### 3.更新`tls`前缀配置

从MongoDB 4.2开始，MongoDB添加了“tls”前缀选项作为“ssl”前缀选项的别名。

如果您的部署或客户端使用“tls”前缀选项，请替换为mongod、mongos以及mongo shell和驱动程序的相应“ssl”前缀选项。

### 4.准备从`zstd`压缩降级

#### `zstd`日志压缩[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/#zstd-journal-compression)

从4.2版本开始，[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库可用于日志数据压缩。

对于任何使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)库作为其日志压缩机的碎片或配置服务器成员：

**如果成员使用`zstd`进行日志压缩和[`zstd`数据压缩](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/#std-label-downgrade-sharded-cluster-prereq-zstd)，**

* 如果使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，删除[`storage.wiredTiger.engineConfig.journalCompressor`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.journalCompressor)使用默认压缩器（`snappy`）或设置为另一个支持4.0的压缩器。
* 如果使用命令行选项，则必须更新以下过程中的选项。

**如果成员仅将`zstd`用于日志压缩，则**

> 笔记：
>
> 以下过程涉及在没有日志的情况下以独立身份重新启动副本成员。

1. 对[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例进行干净的关机：

   ```
   db.getSiblingDB('admin').shutdownServer()
   ```

2. 更新[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，以准备以独立方式重新启动：

   - 将`storage.journal.enabled`设置为`false`。
   - 将参数[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)设置为true。
   - [`setParameter`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-setParameter)部分中将参数`disableLogicalSessionCacheRefresh`设置为`true`。
   - 注释您部署的[复制](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-replication-options)设置。
   - 评论[`sharding.clusterRole`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)设置。
   - 如果未显式设置，请将[`net.port`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.port)设置为成员的当前端口。

   例如：

   ``` 
   storage:
      journal:
         enabled: false
   setParameter:
      skipShardingConfigurationChecks: true
      disableLogicalSessionCacheRefresh: true
   #replication:
   #   replSetName: shardA
   #sharding:
   #   clusterRole: shardsvr
   net:
     port: 27218
   ```

   如果您使用命令行选项而不是配置文件，则必须在重新启动期间更新命令行选项。

3. 重新启动[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例：

   * 如果您使用的是配置文件：

     ```
     mongod -f <path/to/myconfig.conf>
     ```

   * 如果您使用的是命令行选项而不是配置文件：

     - 包括`--nojournal`选项。
     - 将参数[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)设置为true。
     - Set parameter `disableLogicalSessionCacheRefresh` to`true` in the [`--setParameter`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--setParameter) option.
     - 删除任何[复制命令行选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-cli-mongod-replica-set)（例如[`--replSet`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--replSet)）。
     - 删除[`--shardsvr`/](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)选项。
     - 显式包含[`--port`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--port)设置为实例的当前端口。

     ```
     mongod --nojournal --setParameter skipShardingConfigurationChecks=true --setParameter disableLogicalSessionCacheRefresh=true --port <samePort> ...
     ```

4. 对[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例进行干净的关机：

   ```
   db.getSiblingDB('admin').shutdownServer()
   ```

   确认该进程已不再运行。

5. 更新配置文件，准备使用新的日志压缩机重新启动：

   - 删除`storage.journal.enabled`设置。
   - 删除[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)参数设置。
   - 删除`disableLogicalSessionCacheRefresh`参数集。
   - 取消对部署的[复制](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#std-label-replication-options)设置进行评论。
   - 取消评论[`sharding.clusterRole`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-sharding.clusterRole)设置。
   - Removestorage[`storage.wiredTiger.engineConfig.journalCompressor`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.journalCompressor)设置以使用默认日志压缩器或指定新值。

   例如：

   ```
   storage:
      wiredTiger:
         engineConfig:
            journalCompressor: <newValue>
   replication:
      replSetName: shardA
   sharding:
      clusterRole: shardsvr
   net:
     port: 27218
   ```

   如果您使用命令行选项而不是配置文件，则必须在下面的重新启动期间更新命令行选项。

6. 将[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例作为副本集成员重新启动：

   * 如果您使用的是配置文件：

     ```
     mongod -f <path/to/myconfig.conf>
     ```

   * 如果您使用的是命令行选项而不是配置文件：

     * 删除`--nojournal`选项。
     * 删除[`skipShardingConfigurationChecks`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.skipShardingConfigurationChecks)参数设置。
     * 删除`disableLogicalSessionCacheRefresh`参数设置。
     * 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)命令行选项，以使用默认日志压缩器或更新到新值。
     * 包括[`--shardsvr`/](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--shardsvr)[`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr)选项。
     * 包括您的[复制命令行选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-cli-mongod-replica-set)以及副本集成员的任何其他选项。

     ```
     mongod --shardsvr --wiredTigerJournalCompressor <differentCompressor|none> --replSet ...
     ```

> 笔记：
>
> 如果您在降级过程中遇到[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的不干净关机，因此您需要使用日志文件进行恢复，请使用4.2 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)恢复实例，然后重试实例的降级。

#### `zstd`数据压缩

> 重要：
>
> 如果您也使用[`zstd`日志压缩](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/#std-label-downgrade-sharded-cluster-prereq-zstd-journal)，*在*您执行[日志压缩机的先决条件步骤。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/#std-label-downgrade-sharded-cluster-prereq-zstd-journal)

[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库从4.2版本开始可用。对于任何使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩存储数据的配置服务器成员或碎片成员，降级过程将要求对该成员进行初始同步。准备：

1. 为[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例创建一个新的空[`data directory`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)。此目录将在下面的降级过程中使用。

   > 重要：
   >
   > 确保运行[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的用户帐户具有新目录的读写权限。

2. 如果您使用[配置文件](https://www.mongodb.com/docs/upcoming/reference/configuration-options/)，请更新该文件以为降级过程做好准备：

   * Deletestorage[`storage.wiredTiger.collectionConfig.blockCompressor`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.wiredTiger.collectionConfig.blockCompressor)使用默认压缩器（`snappy`）或设置为另一个支持4.0的压缩器。
   * 将[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)到新的数据目录。

   如果您改用命令行选项，则必须更新以下规程中的选项。

对使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩的任何其他成员重复。

#### `zstd`网络压缩

从4.2版本开始，[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)压缩库可用于网络消息压缩。

为准备降级：

1. 对于任何使用zstd进行网络消息压缩并使用配置文件的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) / [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos) 实例，请更新[`net.compression.compressors`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.compression.compressors)设置，以便为降级过程中的重新启动做好准备。

   如果您改用命令行选项，则必须更新以下规程中的选项

2. 对于在其[`URI connection string`](https://www.mongodb.com/docs/upcoming/reference/connection-string/#mongodb-urioption-urioption.compressors)中指定`zstd`的任何客户端，请更新以从列表中删除`zstd`。

3. 对于任何在其`--networkMessageCompressors`中指定zstd的mongo shell，更新以从列表中删除zstd。

> 重要：
>
> 当双方启用网络压缩时，消息会被压缩。否则，双方之间的消息将被解压缩。

### 5.删除客户端字段级加密文档验证关键字

> 重要：
>
> 在降级服务器*之前*，删除应用程序中的客户端字段级加密代码。

MongoDB 4.2增加了对[执行客户端字段级加密](https://www.mongodb.com/docs/upcoming/core/csfle/reference/server-side-schema/#std-label-field-level-encryption-enforce-schema)的支持，作为集合的[指定JSON模式验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-json-schema/#std-label-schema-validation-json)文档验证的一部分。具体来说，[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)对象支持[`encrypt`](https://www.mongodb.com/docs/upcoming/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)和[`encryptMetadata`](https://www.mongodb.com/docs/upcoming/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)关键字。MongoDB 4.0**不**支持这些关键字，如果任何集合将这些关键字指定为其验证[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)的一部分，则无法启动[。](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)

在每个数据库上使用[`db.getCollectionInfos()`](https://www.mongodb.com/docs/upcoming/reference/method/db.getCollectionInfos/#mongodb-method-db.getCollectionInfos)来识别指定自动字段级加密规则的集合，作为[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)验证器的一部分。要准备降级，请连接到集群[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)，并使用4.0不兼容的关键字对每个集合执行以下操作之一：

* 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)修改集合的[`validator`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-collflag-validator)，并将[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)替换为仅包含[4.0兼容的文档验证语法：](https://www.mongodb.com/docs/v4.0/reference/operator/query/jsonSchema/#available-keywords)

  ```
  db.runCommand({
    "collMod" : "<collection>",
    "validator" : {
      "$jsonSchema" : { <4.0-compatible schema object> }
    }
  })
  ```

  或

* 使用[`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod)完全删除[`validator`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-collflag-validator)对象：

  ```
  db.runComand({ "collMod" : "<collection>", "validator" : {} })
  ```

## 程序

### 降级分片集群

> 警告：
>
> 在继续下调程序之前，请确保所有成员，包括分片集群中的延迟副本集成员，反映先决条件更改。也就是说，在降级之前，检查`featureCompatibilityVersion`并删除每个节点的不兼容功能。

### 1、下载最新的4.0二进制文件。

使用软件包管理器或手动下载，获取4.0系列的最新版本。如果使用软件包管理器，请为4.0二进制文件添加一个新存储库，然后执行实际的降级过程。

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.2降级，请降级到4.0的最新补丁版本。

### 2、停用平衡器。

将mongo shell连接到分片集群中的 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例，并运行[`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)禁用均衡器：

```
sh.stopBalancer()
```

> 笔记：
>
> 如果迁移正在进行中，系统将在停止平衡器之前完成正在进行的迁移。您可以runsh[`sh.isBalancerRunning()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.isBalancerRunning/#mongodb-method-sh.isBalancerRunning)来检查平衡器的当前状态。

```
sh.getBalancerState()
```

从MongoDB 6.1开始，不执行自动分割块。这是因为平衡了政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅[平衡策略更改。](https://www.mongodb.com/docs/upcoming/release-notes/6.1/#std-label-release-notes-6.1-balancing-policy-changes)

在6.1之前的MongoDB版本中，[`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)还禁用了分片集群的自动拆分。

有关禁用平衡器的更多信息，请参阅[禁用平衡器。](https://www.mongodb.com/docs/upcoming/tutorial/manage-sharded-cluster-balancer/#std-label-sharding-balancing-disable-temporarily)

### 3、降级`mongos`实例。

降级二进制文件并重新启动。

> 笔记：
>
> 如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
>
> - 如果您的[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-tls-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-label-mongos-ssl-options)选项。
> - 如果[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)实例包含`zstd`网络消息压缩，请删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#std-option-mongos.--networkMessageCompressors)以使用默认的`snappy,zlib`压缩器。或者，指定要使用的压缩机列表。

### 4、降级每个分片，一次一个

一次降级一个碎片

1. 一次降级碎片的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 将4.2二进制文件替换为4.0二进制文件并重新启动。

     >笔记：
     >
     >如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
     >
     >- 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
     >  - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
     >  - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩机（或者显式设置为4.0支持的压缩器）。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
     >  - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩机（或者，显式设置为4.0支持的压缩器）。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包含`zstd`网络消息压缩，
     >  - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，明确指定压缩器。

   * 请等待成员恢复到SECONDARY状态，然后再降级下一个辅助成员。要检查成员的状态，请将mongo shell连接到shard并运行 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

     重复对每个辅助成员降级。

2. 降级碎片[仲裁器](https://www.mongodb.com/docs/upcoming/core/replica-set-arbiter/#std-label-replica-set-arbiter-configuration)（如果有的话）。

   如果副本集不包括仲裁器，请跳过此步骤。

   * 关掉 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)。有关安全 [Stop `mongod` Processes](https://www.mongodb.com/docs/upcoming/tutorial/manage-mongodb-processes/#std-label-terminate-mongod-processes) 的其他方法，请参见停止 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)进程。

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 删除仲裁器数据目录内容。[`storage.dbPath`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-storage.dbPath)配置设置或[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)命令行选项指定仲裁器[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)的数据目录[。](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)

     ```
     rm -rf /path/to/mongodb/datafiles/*
     ```

   * 将4.2二进制文件替换为4.0二进制文件并重新启动。

     > 笔记：
     >
     > 如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
     >
     > - 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
     >   - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
     >   - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩器（或者显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
     >   - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩器（或者显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包含`zstd`网络消息压缩，
     >   - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，明确指定压缩器。

   * 等待成员恢复到仲裁器状态。要检查成员的状态，请将mongo shell连接到成员并运行 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

3. 把分片的主系统降级。

   * 从碎片的主通道下来。将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

     ```
     rs.stepDown()
     ```

   * 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下级，而其他成员已处于`PRIMARY`状态时，请降级降级初选：

   * 关闭降级初选。

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 将4.2二进制文件替换为4.0二进制文件并重新启动。

     >笔记：
     >
     >如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
     >
     >- 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
     >  - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
     >  - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩机（或者显式设置为4.0支持的压缩器）。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
     >  - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩器（或者显式设置为4.0支持的压缩器）。
     >- 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包括`zstd`网络消息压缩，
     >  - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，显式指定压缩器。

   对剩余的碎片重复。

   

### 5、降级配置服务器

1. 一次降级配置服务器副本集（CSRS）的[辅助](https://www.mongodb.com/docs/upcoming/core/replica-set-members/#std-label-replica-set-secondary-members)成员：

   * 关闭[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

     ```
     db.adminCommand( { shutdown: 1 } )
     ```

   * 将4.2二进制文件替换为4.0二进制文件并重新启动。

     > 笔记：
     >
     > 如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
     >
     > - 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
     >   - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
     >   - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩机（或者显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
     >   - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩器（或者，显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包含`zstd`网络消息压缩，
     >   - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，明确指定压缩器。

   * 请等待成员恢复到SECONDARY状态，然后再降级下一个辅助成员。要检查成员的状态，请将mongo shell连接到shard并运行 [`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)方法。

2. 逐步降低配置服务器主服务器。

   * 将一个mongo shell连接到主服务器，并使用[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)将主服务器降级，强制选举一个新的主服务器：

     ```
     rs.stepDown()
     ```

   * 当[`rs.status()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.status/#mongodb-method-rs.status)显示初选已下级，而其他成员已处于`PRIMARY`状态时，请降级降级初选：

   * 关闭降级初选。

     ``` 
     db.adminCommand( { shutdown: 1 } )
     ```

   * 将4.2二进制文件替换为4.0二进制文件并重新启动。

     > 笔记：
     >
     > 如果您使用命令行选项而不是配置文件，请在重新启动期间酌情更新命令行选项。
     >
     > - 如果您的命令行选项包含[“tls”前缀选项](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-tls-mongod-options)，请更新为[“ssl”前缀](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-label-ssl-mongod-options)选项。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`数据压缩，
     >   - 将[`--dbpath`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--dbpath)更新到新目录（在先决条件期间创建）。
     >   - Remove[`--wiredTigerCollectionBlockCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerCollectionBlockCompressor)使用默认的`snappy`压缩机（或者显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例使用`zstd`日志压缩，
     >   - 删除[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)以使用默认的`snappy`压缩器（或者显式设置为4.0支持的压缩器）。
     > - 如果[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例包含`zstd`网络消息压缩，
     >   - 删除[`--networkMessageCompressors`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--networkMessageCompressors)，使用默认的`snappy,zlib`压缩器启用消息压缩。或者，明确指定压缩器。

#### 6、重新启用平衡器。

分片集群组件的降级完成后，连接到[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)并重新启动平衡器。

```
sh.startBalancer();
```

要验证平衡器是否已启用，请运行[`sh.getBalancerState()`：](https://www.mongodb.com/docs/upcoming/reference/method/sh.getBalancerState/#mongodb-method-sh.getBalancerState)

```
sh.getBalancerState()
```

如果启用了平衡器，则该方法返回true。

### 7、重新启用自动拆分

当作为降级过程的一部分停止平衡器时，[`sh.stopBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.stopBalancer/#mongodb-method-sh.stopBalancer)方法也禁用了自动拆分。

一旦降级到MongoDB 4.0，[`sh.startBalancer()`](https://www.mongodb.com/docs/upcoming/reference/method/sh.startBalancer/#mongodb-method-sh.startBalancer)将无法重新启用自动拆分。如果您想重新启用自动拆分，runsh[`sh.enableAutoSplit()`）：](https://www.mongodb.com/docs/upcoming/reference/method/sh.enableAutoSplit/#mongodb-method-sh.enableAutoSplit)

```
sh.enableAutoSplit()
```



原文 - [Downgrade 4.2 Sharded Cluster to 4.0]( https://docs.mongodb.com/manual/release-notes/4.2-downgrade-sharded-cluster/ )

