# MongoDB 2.6中的兼容性变化

以下2.6更改可能会影响与旧版本MongoDB的兼容性。有关2.6更改的完整列表，请参阅[MongoDB 2.6](https://www.mongodb.com/docs/upcoming/release-notes/2.6/)的[发布说明](https://www.mongodb.com/docs/upcoming/release-notes/2.6/)。

### 索引更改

#### 执行索引键长度限制

##### 描述

MongoDB 2.6对[指数密钥](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)的限制实施了更强有力的执行[。](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)

如果现有文档中的索引键超过限制，创建索引将出错：

- [`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex),[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)、[`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)和`repairDatabase`将出错，不会创建索引。MongoDB的先前版本将创建索引，但不会索引此类文档。
- 由于[`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex)、[`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact)、andrepairDatabase从集合中删除*所有*索引，然后按顺序重新创建它们，因此索引键限制的错误阻止这些操作重建任何剩余的集合索引，在therapairDatabase命令的情况下，阻止它们继续使用该过程的相应者。

插入将错误：

* [`db.collection.insert()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insert/#mongodb-method-db.collection.insert)如果新文档有一个索引字段，其相应索引条目超过限制，则执行插入的其他操作（例如`db.collection.save()`和[`db.collection.update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)带有`upsert`结果插入）将无法插入。MongoDB以前版本将插入但不会索引此类文档。
* [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)和[`mongoimport`](https://www.mongodb.com/docs/database-tools/mongoimport/#mongodb-binary-bin.mongoimport)如果新文档有一个索引字段，其相应的索引条目超过限制，则将无法插入。

更新将出现错误：

* [`db.collection.update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)如果更新的值导致索引条目超过限制，则索引字段上的`db.collection.save()`操作将出错。
* 如果现有文档包含索引输入超过限制的索引字段，则导致文档在磁盘上重新定位的其他字段的更新将出错。

块迁移将失败：

* 对于具有索引字段的文档且索引条目超过限制的块，迁移将失败。
* 如果保持未固定，块将反复失败迁移，从而有效地停止该集合的块平衡。或者，如果在响应迁移失败时发生块分割，这种响应将导致不必要的大量块和过大的配置数据库。

复制集的次要成员将警告：

* 次要者将继续复制带有索引字段的文档，该字段的相应索引条目超过初始同步的限制，但将在日志中打印警告。
* 次要允许索引构建和重建集合上的操作，该集合包含一个索引字段，其相应的索引条目超过限制，但在日志中带有警告。
* 在*混合版本*副本集中，次要版本2.6，主版本是2.4，次要版本将复制在2.4主版本上插入或更新的文档，但如果文档包含相应索引条目超过限制的索引字段，则会在日志中打印错误消息。

##### 解决方案

​	运行[db.upgradeCheckAllDBs（）](https://www.mongodb.com/docs/v2.6/reference/method/db.upgradeCheckAllDBs/)查找违反此限制的当前密钥并进行适当的更正。最好在升级之	前运行测试;例如，将2.6 mongo shell连接到MongoDB2.4数据库并运行该方法。

如果您有现有的数据集，并且希望禁用默认索引键长度验证，以便在解决这些索引问题之前可以进行升级，请使用 [`failIndexKeyTooLong`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.failIndexKeyTooLong) 参数。

#### 索引规范验证字段名称

##### 描述

在MongoDB 2.6中，当indexkey引用空字段时，创建和重新索引操作失败，例如`"a..b" : 1`或字段名称以美元符号（`$`）开头。

- [`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)不会创建具有无效或空密钥名称的新索引。
- [`db.collection.reIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.reIndex/#mongodb-method-db.collection.reIndex), [`compact`](https://www.mongodb.com/docs/upcoming/reference/command/compact/#mongodb-dbcommand-dbcmd.compact), 如果存在具有无效或空键名称的索引，则repairDatabase将出错。
- 如果索引存在无效或空的密钥名称，块迁移将失败。

以前版本的MongoDB允许索引。

##### 解决方案

​	运行 [db.upgradeCheckAllDBs()](https://www.mongodb.com/docs/v2.6/reference/method/db.upgradeCheckAllDBs/)查找违反此限制的当前密钥并进行适当的更正。最好在升级之	前运行测试;例如，将2.6 mongo shell连接到MongoDB2.4数据库并运行该方法。

#### `ensureIndex`和现有指数

##### 描述

[`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)现在错误：

- 如果您尝试创建现有索引，但选项不同；例如，在以下示例中，stdb[`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)将出错。

  ```shell
  db.mycollection.ensureIndex( { x: 1 } )
  db.mycollection.ensureIndex( { x: 1 }, { unique: 1 } )
  ```

- 如果您指定了一个已经存在的索引名称，但键规格不同；例如，在以下示例中，stdb[`db.collection.ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)将出错。

  ```shell
  db.mycollection.ensureIndex( { x: 1 } )
  db.mycollection.ensureIndex( { x: 1 }, { unique: 1 } )
  ```

  以前的版本没有创建索引，但没有出错。

### 写入方法确认

##### 描述

mongo shell写方法[`db.collection.insert()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insert/#mongodb-method-db.collection.insert)、 [`db.collection.update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)、db.collection.save（）和 [`db.collection.remove()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.remove/#mongodb-method-db.collection.remove)现在将写关注点直接集成到方法中，而不是使用单独的getLastError命令来提供确认写入，无论是在mongo shell中交互运行还是在脚本中非交互运行。在以前的版本中，这些方法表现出一种"触发并忘记"的行为。[[1\]](https://www.mongodb.com/docs/upcoming/release-notes/2.6-compatibility/#footnote-mongo-shell-gle-interactive)

* 使用这些方法的mongo shell的现有脚本现在将等待确认，这比以前的“即发即忘”行为花费更长的时间。
* write方法现在返回一个[`WriteResult（）`](https://www.mongodb.com/docs/upcoming/reference/method/WriteResult/#mongodb-method-WriteResult)对象 包含操作的结果，包括任何写入错误 和写入关注错误，并避免了调用 `getLastError`命令获取结果的状态。 参见[`db.collection.insert（）`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.insert/#mongodb-method-db.collection.insert)， [`db.collection.update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)，`db.collection.save（）` 和[`db.collection.remove（）`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.remove/#mongodb-method-db.collection.remove)获取详细信息。
* 在碎片化环境中，[`Mongo`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)不再支持 “开火就忘”的行为。这会限制写入数据时的吞吐量 到碎片簇。

| [[1](https://www.mongodb.com/docs/upcoming/release-notes/2.6-compatibility/#ref-mongo-shell-gle-interactive-id1)] | 在以前的版本中，使用 `mongo` 壳 交互地， `mongo` shell自动调用 `getLastError` 命令，以提供 写入的确认。然而，脚本将遵守“发射和遗忘” 以前版本中的行为，除非脚本包含 **外显** 调用 `getLastError` 命令之后 写入方法。 |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

##### 解决方案

使用这些`mongo` shell方法进行批量写入的脚本 具有“触发并忽略”行为的操作应使用 [`Bulk（）`](https://www.mongodb.com/docs/upcoming/reference/method/Bulk/#mongodb-method-Bulk)方法。

在分片环境中，使用任何驱动程序或 `mongo` shell应该使用[`Bulk（）`](https://www.mongodb.com/docs/upcoming/reference/method/Bulk/#mongodb-method-Bulk)方法来优化 插入或修改文档组时的性能。

例如，代替：

```shell
for (var i = 1; i <= 1000000; i++) {
    db.test.insert( { x : i } );
}
```

在MongoDB 2.6中，替换为[`Bulk（）`](https://www.mongodb.com/docs/upcoming/reference/method/Bulk/#mongodb-method-Bulk)操作：

```shell
var bulk = db.test.initializeUnorderedBulkOp();

for (var i = 1; i <= 1000000; i++) {
    bulk.insert( { x : i} );
}

bulk.execute( { w: 1 } );
```

Bulk方法返回包含以下内容的[`BulkWriteResult（）`](https://www.mongodb.com/docs/upcoming/reference/method/BulkWriteResult/#mongodb-method-BulkWriteResult)对象 操作的结果。

> 另见：
>
> * [新的写入操作协议](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rel-notes-write-operations)
> * [`Bulk()`](https://www.mongodb.com/docs/upcoming/reference/method/Bulk/#mongodb-method-Bulk)
> * [`Bulk.execute()`](https://www.mongodb.com/docs/upcoming/reference/method/Bulk.execute/#mongodb-method-Bulk.execute)
> * [`db.collection.initializeUnorderedBulkOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.initializeUnorderedBulkOp/#mongodb-method-db.collection.initializeUnorderedBulkOp)
> * [`db.collection.initializeOrderedBulkOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.initializeOrderedBulkOp/#mongodb-method-db.collection.initializeOrderedBulkOp)

### `数据库集合聚合（）`更改

##### 说明

mongoshell中的 [`db.collection.aggregate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate)方法默认将游标返回到结果设置。此更改使聚合管道能够返回结果 任何大小的集合，并且需要游标迭代才能访问结果 设置。例如：

```shell
var myCursor = db.orders.aggregate( [
    {
      $group: {
         _id: "$cust_id",
         total: { $sum: "$price" }
      }
    }
] );

myCursor.forEach( function(x) { printjson (x); } );
```

以前的版本返回了一个带有字段`results`文档，其中包含结果集的数组，但受[BSONDocument大小](https://www.mongodb.com/docs/upcoming/reference/limits/#std-label-limit-bson-document-size)限制。访问之前版本的MongoDB中的结果集需要访问`results`字段并迭代数组。例如：

```shell
var returnedDoc = db.orders.aggregate( [
    {
      $group: {
         _id: "$cust_id",
         total: { $sum: "$price" }
      }
    }
] );

var myArray = returnedDoc.result; // access the result field

myArray.forEach( function(x) { printjson (x); } );
```

##### 解决方案

更新目前期望db.collection.aggregate()返回带有results数组的文档以处理光标的脚本。

> 另见：
>
> * [聚合增强功能](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rn-2.6-aggregation-cursor)
> * [`db.collection.aggregate()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.aggregate/#mongodb-method-db.collection.aggregate)

### 写入问题验证

##### 描述

指定包含以下内容的写入关注 `j: true` 到一个 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos) 实例运行 `--nojournal` 选项现在错误。以前的版本将 忽略 `j: true`。

##### 解决方案

或者移除 `j: true` 写入关注点的规范，当 开据 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos) 实例 与 `--nojournal` 或运行 [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) 或 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos) 写日记。

### 安全变更

#### 新的授权模式

##### 描述

MongoDB 2.6授权模型改变了MongoDB存储和管理用户特权信息的方式：

* 在升级之前，MongoDB 2.6在管理数据库中至少需要一个用户。

* 使用旧模型的MongoDB版本无法创建/修改用户或创建用户定义的角色。

##### 解决方案

确保管理数据库中至少存在一个用户。如果管理数据库中不存在用户，请添加用户。然后升级到MongoDB 2.6。最后，升级用户权限模型。请参阅[将MongoDB升级到2.6。](https://www.mongodb.com/docs/upcoming/release-notes/2.6-upgrade/)

> 重要：
>
> 在升级授权模型之前，您应该首先将MongoDB二进制文件升级到2.6。对于分片集群，请确保**所有**集群组件均为2.6。如果任何数据库中有用户，请确保在升级MongoDBbinaries**之前**，使用角色[`userAdminAnyDatabase`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-userAdminAnyDatabase)`admin`数据库中至少有一个用户。

>另见：
>
>[安全改进](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-2.6-relnotes-security)

#### SSL证书主机名验证

##### 描述

SSL证书验证现在检查通用名称（`CN`）和主题替代名称（`SAN`）字段，以确保`CN`或`SAN`条目之一与服务器的主机名匹配。因此，如果您当前使用SSL，并且当前SSL证书的`CN`和

##### 解决方案

为了允许继续使用这些证书，MongoDB提供了[`allowInvalidCertificates`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.allowInvalidCertificates)设置。该设置适用于：

- [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)和[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)绕过集群中其他服务器上SSL证书的验证。
- `mongo`shell、[支持SSL的MongoDB](https://www.mongodb.com/docs/upcoming/tutorial/configure-ssl-clients/#std-label-mongodb-tools-support-ssl)工具和绕过服务器证书验证的C++驱动程序。

当使用[`allowInvalidCertificates`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.allowInvalidCertificates)设置时，MongoDB 将使用无效证书的情况记录为警告。

> 警告：
>
> [`allowInvalidCertificates`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.ssl.allowInvalidCertificates)设置绕过其他证书验证，例如检查过期和有效签名。

### `2dsphere`索引版本2

##### 描述

MongoDB 2.6引入了[2dsphere索引](https://www.mongodb.com/docs/upcoming/core/2dsphere/#std-label-2dsphere-index)的第2版。如果文档缺少`2dsphere`索引字段（或字段为空数组），MongoDB不会将文档的条目添加到`2dsphere`索引中。对于插入，MongoDB插入文档，但不添加到`2dsphere`索引中。

之前的版本不会插入`2dsphere`字段为`null`或空数组的文档。对于缺少`2dsphere`索引字段的文档，以前的版本将插入和索引文档。

##### 解决方案

要恢复到旧行为，请使用`{ "2dsphereIndexVersion" : 1 }`创建`2dsphere`索引以创建版本1索引。然而，版本1索引不能使用新的GeoJSON几何形状。

> 另见：
>
> [版本](https://www.mongodb.com/docs/upcoming/core/2dsphere/#std-label-2dsphere-v2)

### 日志消息

#### 时间戳格式更改

##### 描述

现在，每条消息都以[时间格式更改](https://www.mongodb.com/docs/upcoming/release-notes/2.6-compatibility/#std-label-2.6-time-format-changes)。以前的版本使用`ctime`格式。

##### 解决方案

MongoDB添加了一个新的选项`--timeStampFormat`，该选项支持`ctime`、`iso8601-utc`和`iso8601-local`（新默认值）中的timestamp格式。

### 软件包配置更改

#### RPM/DEB软件包的默认`bindIp`

##### 描述

在RPM（红帽、CentOS、FedoraLinux和衍生品）和DEB（Debian、Ubuntu和衍生品）中的官方MongoDB软件包中，默认[`bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)值*仅*将MongoDB组件附加到本地主机接口。这些软件包在默认配置文件（即`/etc/mongod.conf`.）中设置了此默认值。

##### 解决方案

如果您使用这些软件包之一，并且*没有*修改default`/etc/mongod.conf`文件，则需要在升级之前或升级期间设置[`bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)。

在任何其他官方的MongoDBpackages中都没有默认的[`bindIp`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-net.bindIp)设置。

#### SNMP更改

##### 描述

* MongoDB的IANA企业标识符从37601更改为34601。

* MongoDB将MIB字段名称`globalopcounts`更改为`globalOpcounts`。

##### 解决方案

* SNMP监控的用户必须修改他们的SNMP配置（即MIB）从37601到34601。

* 将`globalopcounts`引用更新为`globalOpcounts`。

### 删除方法签名更改

##### 描述

​	db.collection.remove()需要查询文档作为参数。在之前的版本中，没有查询文档的方法调用删除了集合中的所有文档。

##### 解决方案

​	对于没有查询文档的现有[`db.collection.remove()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.remove/#mongodb-method-db.collection.remove)调用，请修改调用以包含空documentdb[`db.collection.remove()`。](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.remove/#mongodb-method-db.collection.remove)

### 更新运算符语法验证

##### 描述

* [更新运算符（例如$set）](https://www.mongodb.com/docs/upcoming/reference/operator/update/#std-label-update-operators)必须指定非空操作数表达式。例如，以下表达式现在无效：

  ```shell
  { $set: { } }
  ```

* [更新运算符（例如$set）](https://www.mongodb.com/docs/upcoming/reference/operator/update/#std-label-update-operators)不能在更新语句中重复。例如，以下表达式无效：

  ```shell
  { $set: { a: 5 }, $set: { b: 5 } }
  ```

### 更新强制执行字段名称限制

##### 描述

更新不能使用[更新运算符（例如$set）](https://www.mongodb.com/docs/upcoming/reference/operator/update/)来目标字段名称为空的字段（即`""`。更新不再支持保存包含点（`.`）或以美元符号（`$`）开头的字段名的字段名。

##### 解决方案

对于具有空名称为`""`的字段的现有文档，请替换整个文档。有关替换现有文档的详细信息，请参阅[`db.collection.update()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.update/#mongodb-method-db.collection.update)和`db.collection.save()`。对于具有名称包含点（`.`）的字段的现有文档，请替换整个文档或[`unset`](https://www.mongodb.com/docs/upcoming/reference/operator/update/unset/#mongodb-update-up.-unset)字段。要查找名称包含点的字段，请运行[db.upgradeCheckAllDBs（）。](https://www.mongodb.com/docs/v2.6/reference/method/db.upgradeCheckAllDBs/)对于名称以美元符号（`$`）开头的字段的现有文档，请[`unset`](https://www.mongodb.com/docs/upcoming/reference/operator/update/unset/#mongodb-update-up.-unset)或[`rename`](https://www.mongodb.com/docs/upcoming/reference/operator/update/rename/#mongodb-update-up.-rename)这些字段。要查找名称以美元符号开头的字段，请运行[db.upgradeCheckAllDBs（）。](https://www.mongodb.com/docs/v2.6/reference/method/db.upgradeCheckAllDBs/)

有关写入操作协议的更改，请参阅[新写入操作协议](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rel-notes-write-operations)，有关插入[和](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rel-notes-data-modification)更新操作的更改，请参阅[插入](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rel-notes-data-modification)和[更新改进](https://www.mongodb.com/docs/upcoming/release-notes/2.6/#std-label-rel-notes-data-modification)。另请考虑[字段名称限制的](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Restrictions-on-Field-Names)文档[。](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Restrictions-on-Field-Names)

### 查询和排序更改

#### 执行字段名称限制

##### 描述

查询无法在名称以美元符号（`$`）开头的字段上指定条件。

##### 解决方案

[`Unset`](https://www.mongodb.com/docs/upcoming/reference/operator/update/unset/#mongodb-update-up.-unset)或[`rename`](https://www.mongodb.com/docs/upcoming/reference/operator/update/rename/#mongodb-update-up.-rename)名称以美元符号（`$`）开头的现有字段。跑步[db.upgradeCheckAllDBs（）](https://www.mongodb.com/docs/v2.6/reference/method/db.upgradeCheckAllDBs/)查找名称以美元符号开头的字段。

#### 稀疏的索引和不完整的结果

##### 描述

如果[稀疏索引](https://www.mongodb.com/docs/upcoming/core/index-sparse/#std-label-index-type-sparse)导致查询和排序操作的结果集不完整，除非[`hint()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint)明确指定索引，否则MongoDB不会使用该索引。例如，除非明确提示，否则查询`{ x: { $exists: false } }`将不再在`x`字段上使用稀疏索引。

##### 解决方案

要覆盖使用稀疏索引的行为并返回不完整结果，请用[`hint()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint)显式指定索引[。](https://www.mongodb.com/docs/upcoming/reference/method/cursor.hint/#mongodb-method-cursor.hint)

有关详细说明新行为的示例，请参阅[集合上的稀疏索引无法返回完整结果](https://www.mongodb.com/docs/upcoming/core/index-sparse/#std-label-sparse-index-incomplete-results)。

#### `sort()`规格值

##### 描述

[`sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort)方法**只**接受排序键的以下值：

* `1`指定字段的升序，
* `-1`指定字段的降序，或
* [`$meta`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/meta/#mongodb-expression-exp.-meta)表达式，按文本搜索分数指定排序。

任何其他值都将导致错误。

以前的版本也接受`true`或`false`提升。

##### 解决方案

将使用`true`或`false`的排序键值更新为1。

#### `skip()`和`_id`查询

##### 描述

`_id`字段上的平等匹配服从[`skip()`。](https://www.mongodb.com/docs/upcoming/reference/method/cursor.skip/#mongodb-method-cursor.skip)以前的版本在`_id`字段上执行相等匹配时忽略了[`skip()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.skip/#mongodb-method-cursor.skip)。

#### `explain()`保留查询计划缓存

##### 描述

[`explain()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.explain/#mongodb-method-cursor.explain)不再清除缓存为该[查询形状的](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-query-shape)[查询计划](https://www.mongodb.com/docs/upcoming/core/query-plans/)[。](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-query-shape)

在之前的版本中，[`explain()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.explain/#mongodb-method-cursor.explain)将产生清除该查询形状的查询计划缓存的副作用。

> 另见：
>
> [`PlanCache()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.getPlanCache/#mongodb-method-db.collection.getPlanCache)参考。

#### 地理空间变化

##### `$maxDistance`变化

##### 描述

对于GeoJSON数据的[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)查询，如果查询指定a[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)，[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)必须在[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)文档中。在之前的版本中，[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)可以在[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)文档的内部或外部。[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)必须是一个积极的价值。

##### 解决方案

更新GeoJSON数据上任何现有的[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)，这些查询目前在[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)文档之外具有[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)更新[`$maxDistance`](https://www.mongodb.com/docs/upcoming/reference/operator/query/maxDistance/#mongodb-query-op.-maxDistance)为负值的任何现有查询。

##### 不建议使用的`$uniqueDocs`

##### 描述

MongoDB 2.6不建议使用$uniqueDocs，当文档多次匹配查询时，地理空间查询不再返回重复的结果。

##### 更有力地验证地理空间查询

##### 描述

MongoDB 2.6强制对地理空间查询进行更强的验证，例如验证选项或GeoJSON规范，如果地理空间查询无效，则设置错误。以前的版本允许/忽略无效选项。

#### 查询运算符更改

##### `$not`查询行为变更

##### 描述

* 索引字段上带有[`$not`](https://www.mongodb.com/docs/upcoming/reference/operator/query/not/#mongodb-query-op.-not)表达式的查询现在匹配：

  - 缺少索引字段的文档。以前的版本不会使用索引返回这些文档。
  - 索引字段值与指定值类型不同的文档。以前的版本不会使用索引返回这些文档。

  例如，如果收款`orders`包含以下文件：

  ```shell
  { _id: 1, status: "A", cust_id: "123", price: 40 }
  { _id: 2, status: "A", cust_id: "xyz", price: "N/A" }
  { _id: 3, status: "D", cust_id: "xyz" }
  ```

  如果集合在`price`字段上有一个索引：

  ```shell
  db.orders.ensureIndex( { price: 1 } )
  ```

  以下查询使用索引搜索`price`不超过或等于`50`的文档：

  ```shell
  db.orders.find( { price: { $not: { $gte: 50 } } } )
  ```

  在2.6中，查询返回以下文档：

  ```shell
  { "_id" : 3, "status" : "D", "cust_id" : "xyz" }
  { "_id" : 1, "status" : "A", "cust_id" : "123", "price" : 40 }
  { "_id" : 2, "status" : "A", "cust_id" : "xyz", "price" : "N/A" }
  ```

  在之前的版本中，索引计划只会返回字段类型与查询谓词类型匹配的匹配文档：

  ```shell
  { "_id" : 1, "status" : "A", "cust_id" : "123", "price" : 40 }
  ```

  如果使用集合扫描，以前的版本将返回与2.6中相同的结果。

* MongoDB 2.6允许链接[`$not`](https://www.mongodb.com/docs/upcoming/reference/operator/query/not/#mongodb-query-op.-not)表达式。

##### `null`比较查询

##### 描述

- [`$lt`](https://www.mongodb.com/docs/upcoming/reference/operator/query/lt/#mongodb-query-op.-lt)和[`$gt`](https://www.mongodb.com/docs/upcoming/reference/operator/query/gt/#mongodb-query-op.-gt)与`null`的比较不再匹配缺少字段的文档。
- `null`数组元素上的相等条件（例如`"a.b": null`）不再匹配缺少嵌套字段`a.b`的文档（例如`a: [ 2, 3 ]`）。
- `null`平等查询（即`field: null`）现在将字段与`undefined`的值匹配。

##### `$all`操作员行为变更

##### 描述

* [`$all`](https://www.mongodb.com/docs/upcoming/reference/operator/query/all/#mongodb-query-op.-all)运算符现在等价于指定值的[`$and`](https://www.mongodb.com/docs/upcoming/reference/operator/query/and/#mongodb-query-op.-and)运算。当传递单个嵌套数组的数组时，这种行为变化可以允许比以前的版本更多的匹配（例如`[ [ "A" ] ]`）。当传递嵌套数组的数组时，[`$all`](https://www.mongodb.com/docs/upcoming/reference/operator/query/all/#mongodb-query-op.-all)现在可以匹配字段包含嵌套数组作为元素的文档（例如`field: [ [ "A" ], ... ]`），*或者*该字段等于嵌套数组（例如`field: [ "A", "B" ]`）。早期版本只能匹配字段包含嵌套数组的文档。
* 如果数组字段包含嵌套数组（例如`field: [ "a", ["b"] ]`），并且嵌套字段上的[`$all`](https://www.mongodb.com/docs/upcoming/reference/operator/query/all/#mongodb-query-op.-all)是嵌套数组的元素（例如."`"field.1": { $all: [ "b" ] }`），则[`$all`](https://www.mongodb.com/docs/upcoming/reference/operator/query/all/#mongodb-query-op.-all)运算符不返回匹配项。以前的版本将返回匹配项。

##### `$mod`运算符执行严格的语法

##### 描述

[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)运算符现在只接受一个正好有两个元素的数组，当传递元素较少或更多元素的数组时会出现错误。有关详细信息，请参阅[元素不足错误](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#std-label-mod-not-enough-elements)和[元素太多错误](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#std-label-mod-too-many-elements)。

在之前的版本中，如果传递了一个带有一个元素的数组，[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)运算符使用`0`作为第二个元素，如果传递了一个包含两个以上元素的数组，[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)会忽略除前两个元素以外的所有元素。以前的版本在传递空数组时确实会返回错误。

##### 解决方案

确保传递给[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)的数组恰好包含两个元素：

* 如果数组包含单个元素，请添加`0`作为第二个元素。
* 如果数组包含两个以上的元素，请删除外部元素。

##### `$where`必须是顶级的

##### 描述

[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)表达式现在只能处于顶层，不能在另一个表达式中音调，例如[`$elemMatch`。](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)

##### 解决方案

更新嵌套[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)的现有查询[。](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)

#####`$exists`和`notablescan`

如果MongoDB服务器禁用了集合扫描，即[`notablescan`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.notablescan)，那么没有*索引解决方案*的[`$exists`](https://www.mongodb.com/docs/upcoming/reference/operator/query/exists/#mongodb-query-op.-exists)查询将出错。

##### `MinKey`和`MaxKey`查询

##### 描述

`MinKey`或`MaxKey`的平等匹配不再匹配缺少字段的文档。

##### 使用$elemMatch嵌套数组查询

##### 描述

[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)查询运算符不再递归遍历到嵌套数组中。

例如，如果集合`test`包含以下文档：

```shell
{ "_id": 1, "a" : [ [ 1, 2, 5 ] ] }
```

在2.6中，以下[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)查询与文档*不*匹配：

```shell
db.test.find( { a: { $elemMatch: { $gt: 1, $lt: 5 } } } )
```

##### 解决方案

更新依赖于旧行为的现有查询。

#### 文本搜索兼容性

MongoDB不支持在包含2.4和2.6版本碎片的混合分片集群部署中使用[`$text`](https://www.mongodb.com/docs/upcoming/reference/operator/query/text/#mongodb-query-op.-text)查询运算符。有关升级说明，请参阅将[MongoDB升级到2.6](https://www.mongodb.com/docs/upcoming/release-notes/2.6-upgrade/)。

### 复制集/共享集群验证

#### 元数据刷新上的碎片名称检查

##### 描述

对于分片集群，如果碎片名称尚未显式设置，MongoDB 2.6不允许碎片刷新元数据。

对于同时包含2.4版和2.6版碎片的混合碎片集群部署，如果2.6版本碎片名称未知，则此更改可能会在将块**从**2.4版本碎片迁移**到**2.6碎片时导致错误。MongoDB不支持混合分片集群部署中的迁移。

##### 解决方案

将集群的所有组件升级到2.6。请参阅[将MongoDB升级到2.6。](https://www.mongodb.com/docs/upcoming/release-notes/2.6-upgrade/)

#### 副本集投票配置验证

##### 描述

MongoDB现在不建议给任何[复制集](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-replica-set)成员超过一票。在配置期间，[`members[n\].votes`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)对于有投票权的成员，对于无表决权的成员，该值应为0。MongoDB将1或0以外的值视为1的值，并生成警告消息。

##### 解决方案

酌情更新[`members[n\].votes`](https://www.mongodb.com/docs/upcoming/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)值为1或0至1或0以外的值。

### 时间格式更改

MongoDB现在在许多输出中格式化时间数据时使用`iso8601-local`。此格式遵循模板`YYYY-MM-DDTHH:mm:ss.mmm<+/-Offset>`。例如，`2014-03-04T20:13:38.944-0500`。

此更改会影响在*严格模式下*使用[扩展JSON](https://www.mongodb.com/docs/upcoming/reference/mongodb-extended-json/#std-label-mongodb-extended-json-v2)的所有客户端，例如[`mongoexport`。](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)

### 其他资源

- [所有向后不兼容的更改（JIRA）](https://jira.mongodb.org/issues/?jql=project %3D SERVER AND fixVersion in ("2.5.0"%2C "2.5.1"%2C "2.5.2"%2C "2.5.3"%2C "2.5.4"%2C "2.5.5"%2C "2.6.0-rc1"%2C "2.6.0-rc2") AND "Backwards Compatibility" in  ("Major Change"%2C "Minor Change") 
- [MongoDB 2.6的发布说明。](https://www.mongodb.com/docs/upcoming/release-notes/2.6/)
- 在升级过程中将[MongoDB升级到2.6](https://www.mongodb.com/docs/upcoming/release-notes/2.6-upgrade/)。



 参见

原文 - [Compatibility Changes in MongoDB 2.6]( https://docs.mongodb.com/manual/release-notes/2.6-compatibility/ )

