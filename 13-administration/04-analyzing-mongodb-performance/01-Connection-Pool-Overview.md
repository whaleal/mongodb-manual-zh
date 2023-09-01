### 连接池概述

本文档介绍如何使用连接池来管理应用程序和MongoDB实例之间的连接。

### 什么是连接池？

#### 定义

[连接池](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/#std-label-connection-pool-overview)（Connection Pool）是由数据库[驱动](https://www.mongodb.com/docs/drivers/)程序维护的一组已经打开且准备就绪的数据库连接的缓存。你的应用程序可以从连接池中无缝获取连接，执行操作，然后将连接返回到连接池中。连接池是线程安全的。

**连接池的好处**

连接池有助于减少应用程序延迟和创建新连接的次数。

连接池在启动时创建连接。应用程序不需要手动将连接返回到池中。相反，连接会自动返回到池中。

有些连接处于活动状态，有些连接处于非活动状态但可用。如果您的应用程序请求连接并且池中有可用连接，则不需要创建新连接。

### 创建和使用连接池

#### `MongoClient`使用驱动程序对象的实例

大多数驱动程序提供了一个类型为 `MongoClient` 的对象。

每个应用程序使用一个`MongoClient`实例，除非该应用程序连接到许多单独的集群。每个 `MongoClient`实例管理自己到创建时指定的 MongoDB 集群或节点的连接池`MongoClient`。 `MongoClient`对象在大多数驱动程序中都是线程安全的

> 笔记
>
> 将您的实例存储`MongoClient`在应用程序可全局访问的位置。

#### 验证

要将连接池与 LDAP 结合使用，请参阅 [LDAP 连接池行为。](https://www.mongodb.com/docs/manual/core/security-ldap-external/#std-label-ldap-connection-pool-behavior)

#### 分片集群连接池

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)路由器为集群中的每个节点都有连接池。分片集群中各个节点的连接可用性会影响延迟。操作必须等待连接建立。

### 连接池配置设置

要配置连接池，请设置选项：

- 通过[MongoDB URI ](https://www.mongodb.com/docs/manual/reference/connection-string/#std-label-mongodb-uri)
- 在构建`MongoClient`实例时以编程方式，或者
- 在应用程序框架的配置文件中。

#### 设置

| 设置                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [`maxPoolSize`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.maxPoolSize) | 池中打开的最大连接数。当连接池达到最大连接数时，新连接会等待，直到达到 的值 [`waitQueueTimeoutMS`。](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.waitQueueTimeoutMS)*默认：* `100` |
| [`minPoolSize`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.minPoolSize) | 池中打开的最小连接数。的值[`minPoolSize`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.minPoolSize)必须小于 的值[`maxPoolSize`。](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.maxPoolSize)*默认*：`0` |
| [`connectTimeoutMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.connectTimeoutMS) | 大多数驱动程序默认为永不超时。某些版本的 Java 驱动程序（例如版本 3.7）默认为`10`.*默认值：* `0`适用于大多数驱动程序。看你的[司机](https://www.mongodb.com/docs/drivers/) 文档。 |
| [`socketTimeoutMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.socketTimeoutMS) | TCP 连接超时之前等待的毫秒数。请勿*用作*防止长时间运行的[`socketTimeoutMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.socketTimeoutMS)服务器操作的机制。设置较低的套接字超时可能会导致操作在服务器响应之前出错。*默认值*：`0`，表示没有超时。看你的 [司机](https://www.mongodb.com/docs/drivers/)文档。 |
| [`maxIdleTimeMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.maxIdleTimeMS) | 连接在被删除和关闭之前可以在池中保持空闲状态的最大毫秒数。*默认：*查看您的[司机](https://www.mongodb.com/docs/drivers/)文档。 |
| [`waitQueueTimeoutMS`](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.waitQueueTimeoutMS) | Can 线程等待连接变为可用的最大等待时间（以毫秒为单位）。值表示`0`没有限制。*默认*：`0`. 看你的[司机](https://www.mongodb.com/docs/drivers/)文档。 |
| [`ShardingTaskExecutorPoolMinSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMinSize) | 每个 TaskExecutor 连接池可以向任何给定实例打开的最小出站连接数[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 。*默认*：`1`. 见 [`ShardingTaskExecutorPoolMinSize`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMinSize)该参数仅适用于分片部署。 |
| [`ShardingTaskExecutorPoolMinSizeForConfigServers`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMinSizeForConfigServers) | 用于设置每个 TaskExecutor 连接池可以打开到配置服务器的最小出站连接数 [`ShardingTaskExecutorPoolMinSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMinSize)的[可选](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)覆盖[。](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)当设置为：`-1`，[`ShardingTaskExecutorPoolMinSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMinSize)被使用。这是默认设置。大于 的整数值`-1`将覆盖 每个 TaskExecutor 连接池可以向配置服务器打开的最小出站连接数。该参数仅适用于分片部署。*默认*：`-1`*6.0版本中的新内容*。 |
| [`ShardingTaskExecutorPoolMaxSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMaxSize) | 每个 TaskExecutor 连接池可以向任何给定实例打开的最大出站连接数[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 。*默认值*：2 64 - 1。请参阅 [`ShardingTaskExecutorPoolMaxSize`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMaxSize)该参数仅适用于分片部署。 |
| [`ShardingTaskExecutorPoolMaxSizeForConfigServers`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMaxSizeForConfigServers) | 用于设置每个 TaskExecutor 连接池可以打开到配置服务器的最大出站连接数 [`ShardingTaskExecutorPoolMaxSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMaxSize)的[可选](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)覆盖[。](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/#std-label-sharding-config-server)当设置为：`-1`，[`ShardingTaskExecutorPoolMaxSize`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.ShardingTaskExecutorPoolMaxSize)被使用。这是默认设置。大于 的整数值`-1`会覆盖 每个 TaskExecutor 连接池可以向配置服务器打开的最大出站连接数。该参数仅适用于分片部署。*默认*：`-1`*6.0版本中的新内容*。 |

