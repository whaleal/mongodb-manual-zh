# 降级4.4至4.2 

下一页总结了降级到4.2的各种注意事项。有关部署类型的具体说明，请参阅：

- [将4.4独立评级降至4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-standalone/)
- [将4.4副本设置为4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-replica-set/)
- [将4.4分片集群降级到4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-sharded-cluster/)

## 降级路径

> 重要：
>
> 在升级或降级副本集之前，请确保所有副本集成员都在运行。如果您不这样做，在开始所有成员之前，升级或降级将不会完成。

如果您需要从4.4降级，请降级到4.2的最新补丁版本。

MongoDB仅支持单版本降级。您不能降级到当前版本后多个版本的版本。您可以将4.4系列降级为4.2系列部署，但是，不支持进一步降级4.2系列部署到4.0系列部署。

> 警告：
>
> **降级**
>
> 如果您需要从4.4版本降级，请降级到4.2.6或更高版本。您无法降级到4.2.5或更早的版本。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 降级功能兼容性版本（fCV）

在对二进制文件降级之前，您必须将`featureCompatibilityVersion`（fCV）降级为`"4.2"`

## 向后删除不兼容的功能

在降级二进制文件之前，请删除所有[与4.2不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)的持久4.4功能[。](https://www.mongodb.com/docs/upcoming/release-notes/4.2-compatibility/#std-label-4.2-compatibility-enabled)

## 程序[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade/#procedures)

- [将4.4独立评级降至4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-standalone/)
- [将4.4副本设置为4.2。](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-replica-set/)
- [将4.4分片集群降级到4.2](https://www.mongodb.com/docs/upcoming/release-notes/4.4-downgrade-sharded-cluster/)。





原文 - [Downgrade 4.4 to 4.2]( https://docs.mongodb.com/manual/release-notes/4.4-downgrade/ )

