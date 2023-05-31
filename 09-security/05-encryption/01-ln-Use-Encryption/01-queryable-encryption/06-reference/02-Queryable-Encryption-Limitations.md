# 可查询加密限制

> 注意:
>
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

## 预览特定限制

> 笔记:
>
> 以下限制适用于可查询加密的技术预览。

### 竞争因素

争用因素是一种有助于根据并发连接数调整性能的设置。

竞争因子是不可变的，只能在指定字段进行加密时设置。默认值为`0`。

### 手动数据密钥创建

您必须为要加密的每个字段手动创建唯一的数据加密密钥。在未来的版本中，您将能够`keyId` 从您的字段中省略该字段`encryptedFieldsMap`，并且可查询加密兼容的驱动程序将 自动创建DEK 。

### 手动压缩

当您的元数据集合在技术预览期间超过 1 GB 时，您将需要手动运行[索引压缩。](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-collections/#std-label-qe-index-compaction)在未来的版本中，当元数据集合超过定义的大小时，压缩将自动运行。

压缩是一个减少与加密字段关联的元数据集合大小并提高性能的过程。

### `encryptedFieldsMap`修改

不要在技术预览期间`encryptedFieldsMap`修改传递给您的。`MongoClient`这样做会导致查询时出现意外和不正确的行为。

## 读写操作支持

[mongod](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 仅存储加密的 [BinData](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json-v1/#mongodb-bsontype-data_binary) 并应用任何聚合表达式或查询运算符指定针对 `BinData` 值的加密字段。虽然表达式或运算符可能支持 `BinData` 字段，但与针对解密值发出相同的表达式或运算符相比，结果值可能不正确或意外。如果表达式或运算符不支持 `BinData` 值，`mongod` 会抛出错误。

## 拓扑支持

- 支持副本集和分片集群
- 不支持独立部署
- 不支持二次读取

## 分片

- 元数据集合不得分片
- 分片键不能是加密字段

## 增删改查

- 可查询加密不支持批量操作。不支持以下操作： - [`db.collection.insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany) - [`db.collection.updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany) -[`db.collection.deleteMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/#mongodb-method-db.collection.deleteMany)
- 可查询加密限制[`db.collection.findAndModify()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)参数。-`fields`不允许 -`new`必须为假

## Collections

- 可查询加密仅支持新集合。您不能向现有集合添加或删除可查询加密。
- 如果包含 关键字 ，则在创建可查询加密集合时不能指定`jsonSchema`to 。您不能在同一个集合上使用客户端字段级加密和可查询加密。[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)`jsonSchema``encrypt`
- 只要您的[jsonSchema](https://www.mongodb.com/docs/manual/core/schema-validation/#std-label-schema-validation-overview) 不包含对加密字段的验证，您就可以同时指定`encryptedFields`和`jsonSchema`to 。[`db.createCollection()`](https://www.mongodb.com/docs/manual/reference/method/db.createCollection/#mongodb-method-db.createCollection)
- 可查询加密不支持从未加密的集合自动迁移。您必须逐一导入文件。
- 可查询加密不支持从使用客户端字段级加密加密的集合迁移。您必须解密您的文件并逐一导入。
- 可查询加密不支持[视图](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)、 [时间序列集合](https://www.mongodb.com/docs/manual/core/timeseries-collections/#std-label-manual-timeseries-collection)或[上限集合。](https://www.mongodb.com/docs/manual/core/capped-collections/#std-label-manual-capped-collection)
- 可查询加密不支持[TTL 索引](https://www.mongodb.com/docs/manual/core/index-ttl/#std-label-index-feature-ttl)或[唯一索引。](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)
- 您不能重命名具有加密字段的集合。
- 您不能禁用`jsonSchema`验证。
  * `encryptedFields`收集信息中存在时自动加密文档验证。
  * 您不能设置`validationLevel`为`none`。
  * 您不能设置`validationAction`为`warn`。

### Drop Collection

* `MongoClient`从未配置为可查询加密的 集合中删除集合*不会*删除关联的元数据集合。如果在删除元数据集合之前删除具有加密字段的集合，``mongod`` 会记录警告。

> 提示:
>
> 可查询加密兼容驱动程序在使用为可查询加密配置的集合时删除元数据集合`MongoClient`。

### 创建集合

您应该始终显式创建用于可查询加密的集合。使用隐式集合创建不会创建必要的索引和元数据集合，从而导致查询性能不佳。

## 查询类型

在其中创建集合时为字段指定的查询类型 `encryptedFieldsMap`是不可变的。您不能向现有字段添加新的查询类型，也不能更改现有的查询类型。

## 加密字段名称

加密的字段名称是不可变的。例如，如果您指定`ssn` 要加密的字段，则不能[`$rename`](https://www.mongodb.com/docs/manual/reference/operator/update/rename/#mongodb-update-up.-rename)将字段名称改为 `taxPayerID`.

## Views

应用程序不能依赖自动加密验证来防止对具有加密字段的集合的视图进行不受支持的查询。

如果底层视图聚合管道*或查询引用加密字段，则针对包含使用可查询*[加密](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)加密的值的集合的视图的查询可能会返回意外或不正确的结果。如果在包含使用可查询加密加密的值的集合上创建视图，请避免对加密字段进行操作以降低意外或不正确结果的风险。

有关视图的更多信息，请参阅[视图。](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)

## 校对

可查询加密忽略用户指定的排序规则或集合默认排序规则。加密会隐藏字段值并阻止正常的整理行为。针对加密字段的排序规则敏感查询可能会返回意外或不正确的结果。

有关归类的更多信息，请参阅[归类文档。](https://www.mongodb.com/docs/manual/reference/collation/#std-label-collation-document-fields)

虽然为自动加密配置的 MongoDB 版本 6.0 或更高版本的兼容驱动程序支持自动加密[操作](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/supported-operations/#std-label-qe-reference-automatic-encryption-supported-operations)，但对于不支持的读写操作，底层支持库无法自省集合目录来识别默认排序规则。因此，应用程序不能依赖可查询加密验证来防止查询具有排序规则默认值的加密字段。

## 唯一索引

如果索引键指定任何加密字段，则[唯一索引](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)*不能保证唯一性。*

可查询加密*总是*在给定特定输入的情况下产生不同的加密值。服务器认为每个加密值都是唯一的，即使解密后的值可能不是唯一的。因此，该集合可能包含多个文档，这些文档对于具有索引强制唯一约束的字段具有重复的明文值。

虽然为自动加密配置的 MongoDB 版本 6.0 或更高版本的兼容驱动程序支持[对不受支持的读写操作进行自动加密的操作](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/supported-operations/#std-label-qe-reference-automatic-encryption-supported-operations) ，但底层支持库无法自省索引目录以将给定字段标识为唯一。应用程序不能依赖自动加密验证来防止随机加密字段上的唯一约束违规。

## _id 字段

您不能指示 Queryable Encryption 加密该`_id`字段，因为它依赖于 MongoDB 自动生成的值。

## 读/写查询支持

自动加密支持命令、查询运算符、更新运算符、聚合阶段和聚合表达式的子集。有关完整文档，请参阅[自动加密支持的操作。](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/supported-operations/#std-label-qe-reference-automatic-encryption-supported-operations)









译者：韩鹏帅

原文：[Queryable Encryption Limitations](https://www.mongodb.com/docs/manual/core/queryable-encryption/reference/limitations/)
