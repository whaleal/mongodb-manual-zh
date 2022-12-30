# 防止次要成为主要[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#prevent-secondary-from-becoming-primary)

## 概述[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#overview)

在副本集中，默认情况下所有[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员都有资格通过选举过程成为主要成员。您可以 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)通过使一些成员更有可能成为主要成员而其他成员不太可能或不能成为主要成员来影响这些选举的结果。

无法成为主要节点的次要节点也无法触发选举。在所有其他方面，这些次级与其他次级相同。

为了防止[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员 在[故障转移](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-failover)中成为[主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员，请为次要成员分配优先级，如此处所述。有关仅次要成员及其用途的详细说明，请参阅[Priority 0 Replica Set Members ](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)[。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)`0`

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#considerations)

更新副本配置对象时，使用**数组索引**[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)访问数组 中的副本集成员。数组索引以. 不要将此索引值与数组中每个文档中的 **字段**值混淆。`0`[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

>## 笔记
>
>MongoDB 不允许当前[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)节点的优先级为`0`. 为防止当前主节点再次成为主节点，您必须首先使用 降级当前主节点 [`rs.stepDown()`。](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)

## 程序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#procedure)

本教程使用具有 5 个成员的示例副本集。

>## 警告
>
>- shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而导致[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。当主要步骤关闭时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。

1个

### 检索当前副本集配置。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#retrieve-the-current-replica-set-configuration)

该[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)方法返回一个[副本集配置文档](https://www.mongodb.com/docs/manual/reference/replica-configuration/)，其中包含副本集的当前配置。

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，当连接到主节点时，运行该 [`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf)方法并将结果分配给变量：

```
cfg = rs.conf()
```



返回的文档包含一个 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)字段，该字段包含一组成员配置文档，副本集的每个成员一个文档。

2个

### 分配优先级值`0`。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#assign-priority-value-of-0)

为防止次要成员成为主要成员，请将次要成员的更新[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 为`0`.

要为副本集的成员分配优先级值，请使用数组索引访问成员配置文档。在本教程中，要更改的次要成员对应于在`2`数组 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)位置找到的配置文件。

```
cfg.members[2].priority = 0
```



在重新配置副本集之前，配置更改不会生效。

3个

### 重新配置副本集。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#reconfigure-the-replica-set)

使用[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)方法使用更新的副本集配置文档重新配置副本集。

将`cfg`变量传递给[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)方法：

```
rs.reconfig(cfg)
```



## 相关文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/#related-documents)

- [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)
- [调整副本集成员的优先级](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/)
- [副本集重新配置](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)
- [副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

←  [调整副本集成员的优先级](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/)[配置一个隐藏的副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/configure-secondary-only-replica-set-member/

译者：陆文龙

