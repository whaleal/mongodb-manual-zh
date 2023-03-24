# 管理分片集群平衡器

*在版本6.0中更改*。

此页面描述了与平衡相关的常见管理程序。有关平衡的介绍，请参阅 Sharded Cluster Balancer。有关平衡的较低级别信息，请参阅 Balancer Internals 。

平衡器进程已从`mongos`实例移至配置服务器副本集的主节点。

## 检查平衡器状态

`sh.getBalancerState()`检查平衡器是否启用（即允许平衡器运行）。

 `sh.getBalancerState()`不检查平衡器是否正在主动迁移数据。

要查看分片集群中是否启用了平衡器，请发出以下命令，该命令返回一个布尔值：

```shell
sh.getBalancerState()
```



您还可以使用`sh.status()`查看是否启用了平衡器。该`currently-enabled`字段指示平衡器是否启用，而该 `currently-running`字段指示平衡器当前是否正在运行。



## 检查平衡器是否正在运行

查看集群中的平衡器进程是否处于活动状态：

1. 使用以下命令连接到`mongos`集群中的 任何一个`mongosh` shell。

2. 使用以下操作来确定平衡器是否正在运行：

   ```shell
   sh.isBalancerRunning()
   ```

   

## 配置默认范围大小

分片集群的默认范围大小为 128 兆字节。在大多数情况下，默认大小适用于拆分和迁移块。有关范围大小如何影响部署的信息，请参阅详细信息，请参阅Range Size。

更改默认范围大小会影响在迁移和自动拆分期间处理的范围，但不会追溯影响所有范围。

更改默认块大小会影响在迁移和自动拆分期间处理的块，但不会追溯影响所有块。

从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

要配置默认范围大小，请参阅修改分片集群中的范围大小。



## 安排平衡窗口

在某些情况下，特别是当您的数据集增长缓慢并且迁移会影响性能时，确保平衡器仅在特定时间处于活动状态非常有用。以下过程指定了`activeWindow`，这是平衡器能够迁移块的时间范围：



### 使用`mongosh`连接到`mongos`.

您可以连接到`mongos`集群中的任何一个。



### 切换到配置数据库。

发出以下命令以切换到配置数据库。

```shell
use config
```



### 确保平衡器不在`stopped`。

平衡器不会在该`stopped`状态下激活。要确保平衡器不是`stopped`，请使用`sh.startBalancer()`，如下所示：

```shell
sh.startBalancer()
```



如果您在时间范围之外，平衡器将不会启动`activeWindow`。

从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

在 MongoDB 6.0 之前的版本中，`sh.startBalancer()`还启用了分片集群的自动拆分。



### 修改平衡器的窗口。

使用 `updateOne()`设置`activeWindow`，如下所示：

```shell
db.settings.updateOne(
   { _id: "balancer" },
   { $set: { activeWindow : { start : "<start-time>", stop : "<stop-time>" } } },
   { upsert: true }
)
```



使用指定平衡窗口的开始和结束边界的两位数小时和分钟值（即）将`<start-time>`和替换为时间值。`<end-time>``HH:MM`

- 对于`HH`值，使用范围从`00`- `23`的小时值。
- 对于`MM`值，使用范围从`00`- `59`的分钟值。

MongoDB 评估相对于在配置服务器副本集中充当节点的时区的开始和停止时间。



>## 笔记
>
>平衡器窗口必须足以*完成*白天插入的所有数据的迁移。
>
>由于数据插入率会根据活动和使用模式而变化，因此确保您选择的平衡窗口足以支持您的部署需求非常重要。



## 删除平衡窗口时间表

如果你有设置平衡窗口并希望删除时间表以便平衡器始终运行，使用`$unset`清除`activeWindow`，如下所示：

```shell
use config
db.settings.updateOne( { _id : "balancer" }, { $unset : { activeWindow : true } } )
```



## 禁用平衡器

默认情况下，平衡器可以随时运行并且只根据需要移动块。要在短时间内禁用平衡器并阻止所有迁移，请使用以下过程：

1. 使用`mongosh` shell 用以下命令连接到集群中的 任何一个`mongos`。

2. 发出以下操作以禁用平衡器：

   ```shell
   sh.stopBalancer()
   ```

   如果正在进行迁移，系统将在停止之前完成正在进行的迁移。

   从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

   在 MongoDB 6.0 之前的版本中，`sh.stopBalancer()`还禁用分片集群的自动拆分。

3. 要验证平衡器是否不会启动，请发出以下命令，`false`如果平衡器被禁用，该命令将返回：

   ```shell
   sh.getBalancerState()
   ```

   

   或者，要验证禁用后没有正在进行的迁移，`mongosh` shell中运行：

   ```shell
   use config
   while( sh.isBalancerRunning() ) {
             print("waiting...");
             sleep(1000);
   }
   ```

   

>## 笔记
>
>要从驱动程序中禁用平衡器，请对`admin`数据库使用**balancerStop**命令，如下所示：
>
>```shell
>db.adminCommand( { balancerStop: 1 } )
>```



## 启用平衡器

如果您已禁用平衡器并准备重新启用它，请使用此过程：

1. `mongosh` shell使用 以下命令连接到集群中的任何一个`mongos`。

2. 发出以下操作之一以启用平衡器：

   在`mongosh` shell，使用：

   ```shell
   sh.startBalancer()
   ```

   

   >## 笔记
   >
   >要从驱动程序启用平衡器，请对`admin`数据库使用**balancerStart**命令，如下所示：
   >
   >```js
   >db.adminCommand( { balancerStart: 1 } )
   >```

   

   从 MongoDB 6.0.3 开始，不执行自动分块。这是因为平衡政策的改进。自动拆分命令仍然存在，但不执行操作。有关详细信息，请参阅 平衡策略更改。

   在 MongoDB 6.0 之前的版本中，`sh.startBalancer()`还启用了分片集群的自动拆分。

## 在备份期间禁用平衡

>## 笔记
>
>**只有在手动**进行备份时才需要禁用平衡器，可以通过调用`mongodump`或安排在特定时间调用`mongodump`的任务 。
>
>使用协调的备份和恢复过程时，您不必**禁用**平衡器：
>
>- MongoDB 地图集
>- MongoDB 云管理器
>- MongoDB 运营经理



如果 MongoDB在备份期间迁移了一个块，您可能会以不一致的分片集群快照结束。永远不要在平衡器处于活动状态时运行备份。确保平衡器在备份操作期间处于非活动状态：

- 设置平衡窗口以便平衡器在备份期间处于非活动状态。确保在禁用平衡器时备份可以完成。
- 手动禁用平衡器 在备份过程期间。

如果您在平衡器处于平衡轮的中间时关闭平衡器，则不会立即关闭。平衡器完成正在进行的块移动，然后停止所有进一步的平衡轮次。

在开始备份操作之前，确认平衡器未处于活动状态。您可以使用以下命令来确定平衡器是否处于活动状态：

```js
!sh.getBalancerState() && !sh.isBalancerRunning()
```



备份过程完成后，您可以重新激活平衡器进程。

## 禁用集合的平衡

您可以使用该方法禁用特定集合的平衡 `sh.disableBalancing()`。您可能希望禁用特定集合的平衡器以支持维护操作或非典型工作负载，例如，在数据摄取或数据导出期间。

当您在集合上禁用平衡时，MongoDB 不会中断正在进行的迁移。

要禁用集合的平衡，请使用`mongosh`shell 连接`mongos`并调用该 `sh.disableBalancing()`方法。

例如：

```js
sh.disableBalancing("students.grades")
```



`sh.disableBalancing()`方法接受集合的完整命名空间作为其参数。

## 在集合上启用平衡

您可以使用`sh.enableBalancing()`方法为特定集合启用平衡 。

当您为集合启用平衡时，MongoDB 不会立即开始平衡数据。但是，如果您的分片集合中的数据不平衡，MongoDB 将能够开始更均匀地分布数据。

要在集合上启用平衡，请使用`mongosh` shell 连接`mongos` 到并调用该 `sh.enableBalancing()`方法。

例如：

```js
sh.enableBalancing("students.grades")
```



`sh.enableBalancing()`方法接受集合的完整命名空间作为其参数。

## 确认平衡已启用或禁用

要确认集合的平衡是启用还是禁用，请在`config`数据库中查询`collections`集合的集合命名空间并检查该`noBalance`字段。例如：

```js
db.getSiblingDB("config").collections.findOne({_id : "students.grades"}).noBalance;
```



此操作将返回空错误、`true`、`false`或无输出：

- 空错误表示集合命名空间不正确。
- 如果结果为`true`，则禁用平衡。
- 如果结果为`false`，则平衡当前已启用，但过去已为收集禁用。此集合的平衡将在下次平衡器运行时开始。
- 如果该操作没有返回任何输出，则当前已启用平衡，并且过去从未为此集合禁用过。此集合的平衡将在下次平衡器运行时开始。

您还可以使用`sh.status()`查看是否启用了平衡器。该`currently-enabled`字段指示平衡器是否已启用。



## 更改块迁移的复制行为

### Secondary Throttle

在块迁移期间，该`_secondaryThrottle`值确定迁移何时继续处理块中的下一个文档。

在`config.settings`集合中：

- 如果平衡器的设置设置为写关注，则块迁移期间的每个文档移动都必须在继续下一个文档之前收到请求的确认。

- 如果平衡器的`_secondaryThrottle`设置设置为 `true`，则在迁移继续处理块中的下一个文档之前，块迁移期间的每个文档移动都必须从至少一个辅助节点接收确认。这相当于 的写关注`{ w: 2 }`。

- 如果未设置`_secondaryThrottle`，则迁移过程不会等待复制到辅助文件，而是继续下一个文档。

  从 MongoDB 3.4 开始默认WiredTiger。

要更改`_secondaryThrottle`设置，请连接到 `mongos`实例并直接在配置数据库集合更新`_secondaryThrottle`中的值。例如，使用mo ngo shell 连接到mongos，发出以下命令：

```js
use config
db.settings.updateOne(
   { "_id" : "balancer" },
   { $set : { "_secondaryThrottle" : { "w": "majority" }  } },
   { upsert : true }
)
```



更改设置的效果`_secondaryThrottle`可能不会立竿见影。为确保立即生效，请停止并重新启动平衡器以启用所选的 值`_secondaryThrottle`。

有关块迁移各个步骤期间复制行为的更多信息，请参阅范围迁移和复制。

- 使用`moveRange`命令的`secondaryThrottle`和 `writeConcern`选项指定命令期间的行为。
- 使用`moveChunk`命令的`_secondaryThrottle`和 `writeConcern`选项指定命令期间的行为。

有关详细信息，请参阅`moveRange`和`moveChunk`。



### Wait for Delete

平衡器的`_waitForDelete`设置和`moveChunk`命令会影响平衡器如何从分片迁移多个块。同样，平衡器的`_waitForDelete`设置和`moveRange`命令也会影响平衡器如何从分片迁移多个块。默认情况下，平衡器在开始下一个块迁移之前不会等待正在进行的迁移的删除阶段完成。要让删除阶段**阻止**下一个块迁移的开始，您可以将`_waitForDelete`设置 为 true。

有关块迁移的详细信息，请参阅范围迁移。有关块迁移排队行为的详细信息，请参阅 异步范围迁移清理。

通常`_waitForDelete`用于内部测试目的。要更改平衡器的`_waitForDelete`值：

1. 连接到`mongos`实例。

2. 更新配置`settings`数据库集合`_waitForDelete`中的值。例如：

   ```js
   use config
   db.settings.updateOne(
      { "_id" : "balancer" },
      { $set : { "_waitForDelete" : true } },
      { upsert : true }
   )
   ```

   

一旦设置为`true`，恢复默认行为：

1. 连接到`mongos`实例。

2. 更新或取消设置配置数据库`settings`集合`_waitForDelete`中的字段 ：

   ```js
   use config
   db.settings.updateOne(
      { "_id" : "balancer", "_waitForDelete": true },
      { $unset : { "_waitForDelete" : "" } }
   )
   ```

   



### 超出大小限制的平衡范围

默认情况下，如果范围内的文档数大于配置范围大小除以平均文档大小的结果的 2 倍，则 MongoDB 无法移动范围。

从 MongoDB 4.4 开始，通过将平衡器设置指定 `attemptToBalanceJumboChunks`为`true`，平衡器可以迁移这些大范围，只要它们没有被标记为 jumbo 。

要设置平衡器的`attemptToBalanceJumboChunks`设置，请连接到一`mongos`实例并直接更新 `config.settings`集合。例如，从 `mongosh` shell 连接到`mongos` 实例，发出以下命令：

```js
db.getSiblingDB("config").settings.updateOne(
   { _id: "balancer" },
   { $set: { attemptToBalanceJumboChunks : true } },
   { upsert: true }
)
```



当平衡器尝试移动范围时，如果修改正在迁移的任何文档的写入队列超过 500MB 内存，则迁移将失败。有关迁移过程的详细信息，请参阅 范围迁移过程。

如果您要移动的范围被标记为`jumbo`，您可以手动清除巨型标志以使平衡器尝试迁移范围。

您还可以使用以下任一方法手动迁移超过大小限制（带或不带标签`jumbo`）的范围：

- `moveRange`带有 forceJumbo: true选项的命令
- `moveChunk`带有 forceJumbo: true选项的命令

但是，当`forceJumbo: true`时您运行`moveRange`或`moveChunk` ，对集合的写入操作可能会在迁移过程中阻塞很长时间。



## 更改给定分片的最大存储大小

默认情况下，分片在存储大小方面没有限制。但是，您可以为分片集群中的给定分片设置最大存储大小。选择潜在目标分片时，平衡器会忽略迁移超过配置的最大存储大小的分片。

配置数据库中`shards`的集合存储与分片相关的配置数据。

```js
{ "_id" : "shard0000", "host" : "shard1.example.com:27100" }
{ "_id" : "shard0001", "host" : "shard2.example.com:27200" }
```



要限制给定分片的存储大小，请使用 `db.collection.updateOne()`带有`$set`运算符的方法来创建`maxSize`字段并为其分配一个`integer`值。该 `maxSize`字段表示 中分片的最大存储大小 `megabytes`。

以下操作将分片的最大大小设置为`1024 megabytes`：

```shell
config = db.getSiblingDB("config")
config.shards.updateOne( { "_id" : "<shard>"}, { $set : { "maxSize" : 1024 } } )
```



该值包括分片上*所有*数据文件的映射大小，包括`local`和`admin`数据库。

默认情况下，`maxSize`未指定，允许分片在必要时消耗其机器上的可用空间总量。

您也可以`maxSize`在添加分片时设置。

要`maxSize`在添加分片时进行设置，请将`addShard`命令的`maxSize`参数设置为`megabytes`中的最大大小。下面的命令运行在`mongosh` shell添加一个最大大小为 125 兆字节的分片：

```shell
config = db.getSiblingDB("config")
config.runCommand( { addshard : "example.net:34008", maxSize : 125 } )
```





原文 - https://docs.mongodb.com/manual/tutorial/manage-sharded-cluster-balancer/

译者：陆文龙

