# 加密集合管理

> 注意:
> Queryable Encryption 处于公共预览阶段，可用于评估目的。不建议将公共预览版用于生产部署，因为可能会引入重大更改。要了解有关预览版的更多信息，请参阅[可查询加密预览](https://www.mongodb.com/blog/post/mongodb-releases-queryable-encryption-preview/)博客文章。

在本指南中，您可以了解如何管理加密集合，以及可查询加密的存储和写入成本。

## 概述

可查询加密引入了使用随机加密对文档中的敏感字段进行加密的功能，同时仍然能够查询加密字段。

使用可查询加密，给定的明文值总是加密为不同的密文，同时仍然保持可查询。为了启用此功能，可查询加密使用四种数据结构：

* 三个元数据集合
* 加密集合中每个文档中的一个字段称为`__safeContent__`

> 重要的:
>
> 重要的是这些数据结构不能被修改或删除，否则查询结果**将不**正确。

## 元数据集合

当您使用可查询加密创建加密集合时，MongoDB 会创建三个元数据集合：

- `enxcol_.<collectionName>.esc`， 称为是`ESC`
- `enxcol_.<collectionName>.ecc`， 称为是`ECC`
- `enxcol_.<collectionName>.ecoc`， 称为是`ECOC`

> 例子:
>
> 如果您创建一个名为“patients”的集合，MongoDB 会创建以下元数据集合：
>
> - `enxcol_.patients.esc`
> - `enxcol_.patients.ecc`
> - `enxcol_.patients.ecoc`

当您插入包含您希望查询的加密字段的文档时，MongoDB 会更新元数据集合以维护一个使您能够查询的索引。MongoDB 将此称为“索引字段”。这是以存储和写入速度为代价的。

## 存储成本

存储和写入成本根据每个文档的索引字段数而增加。

> 重要的:
>
> **技术预览**
>
> MongoDB 在技术预览期间的指导是预期可查询加密集合和相关元数据集合的存储需求是其两到三倍。例如，一个 1 GB 的集合可能需要 2-3 GB 的存储空间来存储关联的元数据集合。
>
> 该指南将在未来的版本中进行调整。

## 写入成本

### 插入操作

插入文档时，每个索引字段都需要两次写入元数据集合。

- 一个写给`ESC`
- 一个写给`ECOC`

> 例子:
>
> 插入具有两个索引字段的文档需要：
>
> - 一个写入加密集合。
> - 四次写入元数据集合。

### 更新操作

更新文档时，每个索引字段需要四次写入元数据集合。

- 一个写给`ESC`
- 一个写给`ECC`
- 两次写入`ECOC`

> 例子:
>
> 更新具有两个索引字段的文档需要：
>
> - 一个写入加密集合。
> - 八次写入元数据集合。

### 删除操作

删除文档时，每个索引字段都需要两次写入元数据集合。

- 一个写给`ECC`
- 一个写给`ECOC`

> 例子:
>
> 删除具有两个索引字段的文档需要：
>
> - 一个写入加密集合。
> - 四次写入元数据集合。

## 索引压缩

> 重要的:
>
> **技术预览**
>
> 您需要在技术预览期间运行索引压缩。MongoDB 计划在未来的版本中自动运行索引压缩。

当您插入、更新和删除文档时，元数据集合会发生变化和增长。索引压缩是一个修剪元数据集合并减小其大小的过程。

当大小`ECOC`超过 1 GB 时，您应该运行索引压缩。

您可以使用检查集合的大小[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 并发出`db.collection.totalSize()`命令。

>例子:
>
>在这个例子中，加密的集合被命名为“patients”。
>
>```
>db.enxcol_.patients.ecoc.totalSize()
>```

> 重要的:
>
> 您必须为可查询加密配置您的客户端以运行索引压缩。

要运行索引压缩，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)并运行 `db.collection.compactStructuredEncryptionData()`命令以减少元数据集合的大小。

> 例子:
>
> ```shell
> const eDB = "encryption"
> const eKV = "__keyVault"
> const secretDB = "records"
> const secretCollection = "patients"
> const localKey = fs.readFileSync("master-key.txt")
> const localKeyProvider = { key: localKey }
> const queryableEncryptionOpts = {
>   kmsProviders: { local: localKeyProvider },
>   keyVaultNamespace: `${eDB}.${eKV}`,
> }
> const encryptedClient = Mongo("localhost:27017", queryableEncryptionOpts)
> const encryptedDB = encryptedClient.getDB(secretDB)
> const encryptedCollection = encryptedDB.getCollection(secretCollection)
> encryptedCollection.compactStructuredEncryptionData()
> ```









译者：韩鹏帅

原文：[Encrypted Collection Management](https://www.mongodb.com/docs/manual/core/queryable-encryption/fundamentals/manage-collections/)