# 降级4.2到4.0

下一页总结了降级到的各种注意事项 4.0。有关部署类型的具体说明，请参阅：

[降级4.2 独立到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)

[降级4.2 复制副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)

[降级4.2 分割群集到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集 成员正在运行。否则，升级或降级将不会 完成，直到启动所有成员。

如果您需要从 4.2，降级到最新版本 修补程序发布 4.0。

> 提示：
>
> 如果您降级，
>
> - 在Windows上，降级到4.0.12或更高版本。您无法降级到4.0.11或更低版本。
> - 在Linux/macOS上，如果您正在运行更改流，并希望无缝[恢复更改流](https://www.mongodb.com/docs/upcoming/changeStreams/#std-label-change-stream-resume-token)，请降级到4.0.7或更高版本。

## 复本集和分片集群的注意事项

从MongoDB 4.2开始，无论[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持如何，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)都是可用的；也就是说，读取关注`majority`支持可以启用（默认）或[禁用以](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#std-label-disable-read-concern-majority)使用更改流。

在MongoDB 4.0及更低版本中，只有当启用[`"majority"`](https://www.mongodb.com/docs/upcoming/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-)读取关注支持（默认）时，[更改流](https://www.mongodb.com/docs/upcoming/changeStreams/)才可用。

如果您禁用了read concern`"majority"`在您降级到4.0系列后，更改流将被禁用。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 先决条件

要从4.2降级到4.0，您必须删除持久存在的不兼容功能和/或更新不兼容的配置设置。这些包括：

### 降级功能兼容性版本（fCV）

在降级二进制文件之前，您必须将`featureCompatibilityVersion`（fCV）降级为“4.0”，并删除所有[与4.0不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)的持久fCV 4.2功能，例如：

- 名称超过[索引名称长度](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Name-Length)限制的索引。
- 键超过[索引键限制](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)的索引[。](https://www.mongodb.com/docs/upcoming/reference/limits/#mongodb-limit-Index-Key-Limit)
- 具有新内部格式的独特索引。
- [通配符索引。](https://www.mongodb.com/docs/upcoming/core/index-wildcard/)
- 包含4.2运算符的[只读视图](https://www.mongodb.com/docs/upcoming/core/views/#std-label-views-landing-page)定义和[集合验证](https://www.mongodb.com/docs/upcoming/core/schema-validation/specify-query-expression-rules/#std-label-schema-validation-query-expression)定义。

有关降级fCV并删除这些功能的具体说明，请参阅：

- [将4.2独立降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)
- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

### `zstd`压缩

使用[zstd](https://www.mongodb.com/docs/upcoming/reference/glossary/#std-term-zstd)进行数据压缩、日志压缩或网络消息需要对降级进行额外的考虑。

有关适合您部署类型的详细说明，请参阅：

- [将4.2独立降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)
- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

### `tls`前缀配置

在降级二进制文件之前，请更新`tls`前缀的配置选项，以获取`ssl`前缀别名。

有关适合您部署类型的详细说明，请参阅：

- [将4.2独立降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)
- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

### 删除客户端字段级别加密文档验证关键字

在降级二进制文件之前，请从集合[`$jsonSchema`](https://www.mongodb.com/docs/upcoming/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)验证对象中删除任何[自动加密规则关键字](https://www.mongodb.com/docs/upcoming/core/csfle/reference/encryption-schemas/#std-label-field-level-encryption-json-schema)。

有关适合您部署类型的详细说明，请参阅：

- [将4.2独立降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)
- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)

## 程序

- [将4.2独立降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-standalone/)
- [将4.2副本设置为4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-replica-set/)
- [将4.2分片集群降级到4.0。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-downgrade-sharded-cluster/)





原文 - [Downgrade 4.2 to 4.0]( https://docs.mongodb.com/manual/release-notes/4.2-downgrade/ )

