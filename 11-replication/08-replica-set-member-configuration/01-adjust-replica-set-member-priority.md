# 调整副本集成员的优先级[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#adjust-priority-for-replica-set-member)

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#overview)

副本集成员的`priority`设置会影响主要[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)的时间和结果。优先级高的成员更有可能发起选举，也更有可能获胜。使用此设置可确保某些成员更有可能成为主要成员，而其他成员永远不会成为主要成员。

成员 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)设置的值决定了成员的[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)参选。数字越大，优先级越高。

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#considerations)

要修改优先级，请更新[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members) 副本配置对象中的数组。数组索引以 `0`. 不要将此索引值与数组中副本集成员字段的值**混淆**[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)。

的值可以是和[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)之间的任意浮点数（即十进制）。该字段的默认值为。`0``1000``priority``1`

要阻止成员寻求选举为主要成员，请为其分配优先级`0`。[隐藏成员](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#std-label-replica-set-hidden-members)和 [延迟成员](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/#std-label-replica-set-delayed-members)已 `priority`设置为`0`。

仲裁者优先`0`。

在计划的维护窗口期间调整优先级设置。重新配置优先级可以强制当前的主要节点下台，从而导致选举。在选举之前，主要关闭所有打开的 [客户端](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-client)连接。

### 优先权和投票[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#priority-and-votes)

[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)并且[`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 有如下关系：

- 无投票权（即[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)is `0`）的成员必须有 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)0 个。
- [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)大于 0 的成员不能有 0 [`votes`。](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)

因此，增加非投票成员*需要*设置并增加投票副本集成员的数量。在增加无投票权成员的优先级之前，请考虑以下事项：[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) [`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)`1`

- MongoDB 副本集最多可以有 [7 个有投票权的成员](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Number-of-Voting-Members-of-a-Replica-Set)。如果副本集已经有 7 个投票成员，则不能将副本集中任何剩余成员的优先级修改为大于`0`。
- 从 MongoDB 4.4 开始，副本重新配置一次只能添加或删除*一个*投票成员。要将多个非投票成员的优先级更改为大于`0`，请发出一系列[`replSetReconfig`](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#mongodb-dbcommand-dbcmd.replSetReconfig)or[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig) 操作以一次修改一个成员。有关详细信息，请参阅 [重新配置一次最多只能添加或删除一个投票成员](https://www.mongodb.com/docs/manual/reference/command/replSetReconfig/#std-label-replSetReconfig-cmd-single-node)。

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#procedure)

>## 警告
>
>- shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而导致[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。当主要步骤关闭时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。

1个

### 将副本集配置复制到一个变量。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#copy-the-replica-set-configuration-to-a-variable)

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，用于[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)检索副本集配置并将其分配给变量。例如：

```
cfg = rs.conf()
```



2个

### 更改每个成员的优先级值。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#change-each-member-s-priority-value)

按照数组中的配置更改每个成员的[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 值。[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

```
cfg.members[0].priority = 0.5
cfg.members[1].priority = 2
cfg.members[2].priority = 2
```



此操作序列修改 的值以设置数组`cfg`中定义的前三个成员的优先级 。[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

3个

### 为副本集分配新配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/#assign-the-replica-set-the-new-configuration)

用于[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)应用新配置。

```
rs.reconfig(cfg)
```



此操作使用 的值定义的配置更新副本集的配置`cfg`。

←  [Member Configuration Tutorials](https://www.mongodb.com/docs/manual/administration/replica-set-member-configuration/)[Prevent Secondary from Becoming Primary](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/adjust-replica-set-member-priority/

译者：陆文龙

