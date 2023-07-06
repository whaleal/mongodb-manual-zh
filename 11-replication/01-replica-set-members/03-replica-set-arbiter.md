# 副本集仲裁者

在某些情况下（例如当您有一个主节点和一个从节点，但成本限制禁止添加另一从节点时），您可以选择向您的副本集添加一个仲裁器。一个仲裁者参与了[ 主节点的选举，](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)但是仲裁者没有 **数据**集的副本，**因此不能**成为主节点。

仲裁者恰好拥有`1`个选举投票权。默认情况下，仲裁器具有优先权`0`。



## IMPORTANT

不要在同时托管副本集的主要或次要成员的系统上运行仲裁程序。

要添加仲裁器，请参阅将仲裁器[添加到副本集。](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/)

## 发布版本注意事项

[季度快速发布](https://www.mongodb.com/docs/manual/reference/versioning/#std-label-release-version-numbers)版本不支持 [仲裁](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-arbiters)器。如果您的部署包括仲裁程序，请仅使用 LTS版本。

## PSA 副本集的性能问题

如果您使用的是三成员主从仲裁器 (PSA) 架构，请考虑以下事项：

- [`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)如果从节点不可用或滞后，写入问题可能会导致性能问题。有关如何缓解这些问题的建议，请参阅 [缓解 PSA 副本集的性能问题。](https://www.mongodb.com/docs/manual/tutorial/mitigate-psa-performance-issues/#std-label-performance-issues-psa)
- 如果您使用的是全局默认值[`"majority"`](https://www.mongodb.com/docs/manual/reference/read-concern-majority/#mongodb-readconcern-readconcern.-majority-) 并且写入问题小于majority的大小，则您的查询可能会返回陈旧（未完全复制）的数据。

## 副本集协议版本和仲裁者

对于以下 MongoDB 版本，与具有仲裁器的副本集相比 （MongoDB 4.0+ 不再支持）`pv1`增加了回滚的可能性：[`w:1`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-number-)`pv0`

- MongoDB 3.4.1
- MongoDB 3.4.0
- MongoDB 3.2.11 或更早版本

请参阅[副本集协议版本。](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

有关详细信息，请参阅[`setFeatureCompatibilityVersion`](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#mongodb-dbcommand-dbcmd.setFeatureCompatibilityVersion)命令。

## 功能兼容版本

仲裁者不复制[`admin.system.version`](https://www.mongodb.com/docs/manual/reference/system-collections/#mongodb-data-admin.system.version)集合。因此，无论副本集的 FCV 值如何，仲裁者的功能兼容性版本始终等于二进制文件的降级版本。



## 对多个仲裁者的担忧

使用单个仲裁器来避免数据一致性问题。多个仲裁器会阻止大多数写入问题的可靠使用。

为了确保在主节点发生故障后写入将持续存在，多数写入问题需要大多数节点确认写入操作。仲裁者不存储任何数据，但它们确实有助于复制集中的节点数量。当副本集有多个仲裁者时，大多数数据承载节点在节点故障后可用的可能性较小。



## WARNING

如果从节点落后于主节点，并且集群是 [`reconfigured`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)，则来自多个仲裁者的投票可以选出落后的节点。新的主节点不会有未复制的写入，即使写入可能已由旧配置进行了大部分提交。结果是数据丢失。

为避免这种情况，最多使用一个仲裁器。

*5.3版中的新*功能。

从 MongoDB 5.3 开始，默认情况下禁用对副本集中多个仲裁器的支持。如果您尝试将多个仲裁器添加到副本集，服务器将返回错误：

```
MongoServerError: Multiple arbiters are not allowed unless all nodes
were started with --setParameter 'allowMultipleArbiters=true'
```

要使用 MongoDB 5.3 或更高版本将多个仲裁器添加到副本集，请将每个节点的[`allowMultipleArbiters`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.allowMultipleArbiters)参数设置为`true`：

```
mongod --setParameter allowMultipleArbiters=true
```



## 安全

### 验证

 一起运行[`authorization`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-security.authorization)，仲裁者与该集合的其他成员交换凭据以进行身份验证。MongoDB 对身份验证过程进行加密，并且 MongoDB 身份验证交换是加密安全的。

由于仲裁器不存储数据，因此它们不拥有用于身份验证的用户和角色映射的内部表。因此，登录到具有活动授权的仲裁器的唯一方法是使用[localhost exception 。](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)

### 沟通

仲裁者和其他集合成员之间的唯一通信是：选举期间的投票、心跳和配置数据。这些交换没有加密。

**但是**，如果您的 MongoDB 部署使用 TLS/SSL，MongoDB 将加密 副本集成员之间的*所有*通信。有关详细信息，请参阅 [为 TLS/SSL](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)[配置`mongod`和`mongos`](https://www.mongodb.com/docs/manual/tutorial/configure-ssl/)。

与所有 MongoDB 组件一样，在受信任的网络环境中运行仲裁程序。

## 例子

例如，在以下具有 2 个数据承载成员（主要成员和次要成员）的副本集中，仲裁器允许该集合拥有奇数票数以打破平局：

![由主节点、辅助节点和仲裁节点组成的副本集示意图。](../../images/replica-set-arbiter01.svg)

点击放大

←  [延迟副本集成员](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)[副本集操作日志](https://www.mongodb.com/docs/manual/core/replica-set-oplog/) →

原文链接 - https://docs.mongodb.com/manual/core/replica-set-arbiter/ 

译者：陆文龙

