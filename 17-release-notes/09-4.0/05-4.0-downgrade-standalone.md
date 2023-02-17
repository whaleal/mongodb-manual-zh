# 将 4.0 独立产品降级至 3.6

在尝试降级之前，请熟悉本文档的内容。

## 降级路径

一旦升级到4.0，如果您需要降级，我们建议您降级到最新的3.6补丁版本。

## 创建备份

*可选但推荐。*创建数据库的备份。

## 先决条件

在降级二进制文件之前，您必须降级功能兼容性版本，并删除与3.6版本[不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/#std-label-4.0-compatibility-enabled)的任何4.0功能，如下所述。只有当`featureCompatibilityVersion`被设置为`"4.0"`时，这些步骤才是必要的。

### 1、降级功能兼容性版本

1. 将mongo shell连接到mongod实例。

2. 降级`featureCompatibilityVersion`为`"3.6"`

   ```
   db.adminCommand({setFeatureCompatibilityVersion: "3.6"})
   ```

   [`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/upcoming/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令执行对内部系统集合的写入，并且是幂等的。如果由于任何原因命令未能成功完成，请在[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例上重试该命令。

### 2、移除向后不兼容的持久功能

删除所有与4.0[不兼容](https://www.mongodb.com/docs/upcoming/release-notes/4.0-compatibility/#std-label-4.0-compatibility-enabled)的持久功能。例如，如果您定义了使用4.0查询功能（如[聚合转换运算符）](https://www.mongodb.com/docs/upcoming/release-notes/4.0/#std-label-4.0-agg-type-conversion)的任何视图定义、文档验证器和部分索引过滤器，则必须删除它们。

如果您的用户只有`SCRAM-SHA-256`凭据，您应该在降级之前为这些用户创建`SCRAM-SHA-1`凭据。要更新仅具有`SCRAM-SHA-256`凭据的用户，请运行[`db.updateUser()`](https://www.mongodb.com/docs/upcoming/reference/method/db.updateUser/#mongodb-method-db.updateUser)，其`mechanisms`仅为`SCRAM-SHA-1`，并将`pwd`设置为密码：

```
db.updateUser(
   "reportUser256",
   {
     mechanisms: [ "SCRAM-SHA-1" ],
     pwd: <newpwd>
   }
)
```

## 程序

> 笔记：
>
> 如果您使用包含`SCRAM-SHA-256`[`authenticationMechanisms`](https://www.mongodb.com/docs/upcoming/reference/parameters/#mongodb-parameter-param.authenticationMechanisms)运行MongoDB 4.0，请使用3.6二进制文件重新启动时省略`SCRAM-SHA-256`。

### 1、下载最新的3.6二进制文件。

使用软件包管理器或手动下载，获取3.6系列的最新版本。如果使用软件包管理器，请为3.6二进制文件添加一个新存储库，然后执行实际的降级过程。

一旦升级到4.0，如果您需要降级，我们建议您降级到最新的3.6补丁版本。

### 2、使用最新的3.6 `mongod`实例重新启动。

关闭您的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)实例。将现有的二进制文件替换为下载的[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)二进制文件，然后重新启动。







 参见

原文 - [Downgrade 4.0 Standalone to 3.6]( https://docs.mongodb.com/manual/release-notes/4.0-downgrade-standalone/ )

