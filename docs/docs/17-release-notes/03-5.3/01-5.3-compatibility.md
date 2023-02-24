# MongoDB 5.3中的兼容性更改

> 重要：
>
> MongoDB 6.1是一个快速发行版，仅支持 MongoDB地图集。不支持使用MongoDB 6.1 内部部署。有关详细信息，请参见 [MongoDB版本控制。](https://www.mongodb.com/docs/upcoming/reference/versioning/#std-label-release-version-numbers)

此页面正在进行中，将随更改而更新 在5.3中引入，可能会影响与旧版本的兼容性 MongoDB.

## dsphere文档索引键

为了防止内存不足错误，[`indexMaxNumGeneratedKeysPerDocument`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)限制了为单个文档生成的[2dsphere索引密钥](https://www.mongodb.com/docs/upcoming/geospatial-queries/#std-label-geo-2dsphere)的最大数量。

请参阅[`indexMaxNumGeneratedKeysPerDocument`。](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.indexMaxNumGeneratedKeysPerDocument)

## 更改流和孤立文档

从MongoDB 5.3开始，在[范围迁移期间](https://www.mongodb.com/docs/upcoming/core/sharding-balancer-administration/#std-label-range-migration-procedure)，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-changeStreams) 不为孤立文档的更新生成事件[。](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-orphaned-document)

## 群集内身份验证

从MongoDB 5.3开始，[SCRAM-SHA-1](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram-sha-1) 不能用于群集内身份验证。仅限 [支持SCRAM-SHA-256](https://www.mongodb.com/docs/upcoming/core/security-scram/#std-label-authentication-scram-sha-256)。

在以前的MongoDB版本中，SCRAM-SHA-1和SCRAM-SHA-256都可以 用于群集内身份验证，即使SCRAM未明确 启用。

## 多个仲裁者

从MongoDB 5.3开始，对副本集中多个仲裁器的支持是 默认情况下禁用。要启用对多个仲裁器的支持，请启动每个仲裁器 具有 [`allowMultipleArbiters`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.allowMultipleArbiters) 参数的节点。

## 默认db.stat（）设置

从MongoDB 5.3.0、5.2.1和5.0.6开始，[`数据库统计`](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#mongodb-dbcommand-dbcmd.dbStats) 命令和 [`db.stats（）`](https://www.mongodb.com/docs/upcoming/reference/method/db.stats/#mongodb-method-db.stats)方法只报告可用空间 如果 [freeStorage](https://www.mongodb.com/docs/upcoming/reference/command/dbStats/#std-label-dbStats-freeStorage) 参数设置为1。

## 降级注意事项

以下各节提供有关删除的信息 部署中的向后不兼容功能。如果你是 从MongoDB 5.3降级到更早的版本，请查看 以下各节以确保部署成功运行 降级后。

### 群集集合

从MongoDB5.3开始，如果您正在使用[集群集合](https://www.mongodb.com/docs/upcoming/core/clustered-collections/#std-label-clustered-collections)，那么必须先删除这些集合，然后才能 降级到较早的MongoDB版本。

### 时间序列集合

在将MongoDB 5.3降级到之前，必须删除时间序列集合 MongoDB 5.0.5或更早版本。

请参见[时间序列集合。](https://www.mongodb.com/docs/upcoming/core/timeseries-collections/#std-label-manual-timeseries-collection)



原文：[Compatibility Changes in MongoDB 5.3](https://www.mongodb.com/docs/upcoming/release-notes/5.3-compatibility/)
