# 强制成员成为主节点

## 概述

[您可以通过为副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)节点提供比集合中任何其他节点更高的[`members[n].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值来强制其成为[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。

或者，您也可以通过将成员的[`members[n].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值设置为0 来强制成员永不成为主节点，这意味着该节点永远不能[竞选](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)为主节点。有关详细信息，请参阅 [优先级 0 副本集节点。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#std-label-replica-set-secondary-only-members)

有关优先级的更多信息，请参阅 [`members[n\].priority`。](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)

## 考虑

副本集的大多数已配置成员*必须*对集合可用，才能重新配置集合或选举主节点。有关详细信息，请参阅 [副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)。

## 程序



>## NOTE
>
>*在4.0.2版更改*：如果参数[`enableElectionHandoff`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableElectionHandoff)为 true（默认），当主节点从[`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) （或[`replSetStepDown`](https://www.mongodb.com/docs/manual/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)不带 的命令`force: true`）下台时，已下台的主节点会提名一个符合条件的从节点立即进行选举。否则，副手可以等到 直到[`settings.electionTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)召集选举。降级的主节点不会等待切换的效果。有关详细信息，请参阅 [`enableElectionHandoff`。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableElectionHandoff)

### 通过将其优先级调高来强制成员成为主节点

此过程假定您当前的[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)是 `m1.example.net`并且您希望改为`m3.example.net`主要。该过程还假设您有一个具有以下配置的三节点[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set),有关配置的更多信息，请参阅[副本集配置使用](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)。

此过程采用以下配置：

```
{
    "_id" : "rs",
    "version" : 7,
    "members" : [
        {
            "_id" : 0,
            "host" : "m1.example.net:27017"
        },
        {
            "_id" : 1,
            "host" : "m2.example.net:27017"
        },
        {
            "_id" : 2,
            "host" : "m3.example.net:27017"
        }
    ]
}
```



1. 在一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到主服务器的会话，使用以下操作序列来创建`m3.example.net` 主服务器：

   ```
   cfg = rs.conf()
   cfg.members[0].priority = 0.5
   cfg.members[1].priority = 0.5
   cfg.members[2].priority = 1
   rs.reconfig(cfg)
   ```

   

   最后一条语句调用[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)修改后的配置文档以配置`m3.example.net`为具有 [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)比其他 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例更高的值。

   发生以下事件序列：

   - `m3.example.net`并`m2.example.net`同步 `m1.example.net`（通常在 10 秒内）。
   - `m1.example.net`看到它不再具有最高优先级，并且在大多数情况下会下台。如果同步远远落后，`m1.example.net` *则不会*下台。`m3.example.net`在这种情况下， `m1.example.net`等到`m3.example.net`它的运行时间在 10 秒以内，然后下台。这最大限度地减少了没有主要后续故障转移的时间。
   - 下台迫使选举`m3.example.net` 成为主要根据其 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)设置。

2. 可选地，如果`m3.example.net`比 `m1.example.net`optime 晚了 10 秒以上，并且如果您不需要在 10 秒内指定主节点，则可以`m1.example.net`通过运行强制退出：

   ```
   db.adminCommand({replSetStepDown: 86400, force: 1})
   ```

   

   这可以防止`m1.example.net`在 86,400 秒（24 小时）内成为主节点，即使没有其他节点可以成为主节点。当`m3.example.net`赶上`m1.example.net`它时，它将成为主节点。

   如果您稍后想`m1.example.net` 在等待`m3.example.net`赶上时再次成为主节点，请发出以下命令`m1.example.net`再次进行选举：

   ```
   rs.freeze()
   ```

   

   [`rs.freeze()`](https://www.mongodb.com/docs/manual/reference/method/rs.freeze/#mongodb-method-rs.freeze)提供了一个围绕 [`replSetFreeze`](https://www.mongodb.com/docs/manual/reference/command/replSetFreeze/#mongodb-dbcommand-dbcmd.replSetFreeze)数据库命令的包装器。



### 使用数据库命令强制节点为节点

考虑具有以下节点的[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)：

- `mdb0.example.net`- 当前的[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。
- `mdb1.example.net`-[从节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)。
- `mdb2.example.net`- 次要的。

要强制成员成为主节点，请使用以下过程：

1. 在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh), 运行[`rs.status()`](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)以确保您的副本集按预期运行。

2. 在一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到在 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上运行的实例的会话`mdb2.example.net`，冻结`mdb2.example.net`以便它在 120 秒内不会尝试成为主实例。

   ```
   rs.freeze(120)
   ```

   

3. 在一个[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)正在运行的会话，将在 120 秒内没有资格成为主`mdb0.example.net`实例的实例降级：[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)

   ```
   rs.stepDown(120)
   ```

   

   `mdb1.example.net`成为主节点。

   >## NOTE
   >
   >在过渡期间，有一个短暂的窗口，其中集没有主节点。

   

有关更多信息，请考虑包装 and命令的[`rs.freeze()`](https://www.mongodb.com/docs/manual/reference/method/rs.freeze/#mongodb-method-rs.freeze)and 方法。[`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)[`replSetFreeze`](https://www.mongodb.com/docs/manual/reference/command/replSetFreeze/#mongodb-dbcommand-dbcmd.replSetFreeze)[`replSetStepDown`](https://www.mongodb.com/docs/manual/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)

←  [对副本集成员执行维护](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/)[重新同步副本集的成员](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/force-member-to-be-primary/ 

译者：陆文龙

