# 配置一个隐藏的副本集成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#configure-a-hidden-replica-set-member)

隐藏成员是[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的一部分，但不能成为 [主要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员，并且对客户端应用程序不可见。隐藏成员可以在[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)中投票。有关隐藏成员及其用途的更多信息，请参阅 [隐藏副本集成员。](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/)

## 注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#considerations)

隐藏节点最常见的用途是支持[延迟成员](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)。如果您只需要防止成员成为主要成员，请配置[优先级为 0 的成员。](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/)

如果[`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)设置允许辅助成员从其他辅助成员同步，则默认情况下，MongoDB 在选择同步目标时优先选择非隐藏成员而不是隐藏成员。MongoDB 只会选择隐藏成员作为最后的手段。如果您希望辅助从隐藏成员同步，请使用 [`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom)数据库命令覆盖默认同步目标。[`replSetSyncFrom`](https://www.mongodb.com/docs/manual/reference/command/replSetSyncFrom/#mongodb-dbcommand-dbcmd.replSetSyncFrom) 使用该命令前请参阅文档。

>## 提示
>
>### 也可以看看：
>
>[管理链式复制](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/)

## 

>

## 例子[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#examples)

### 会员配置文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#member-configuration-document)

要将次要成员配置为隐藏，请将其 [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)值`0`设置为并在其成员配置中将其[`members[n\].hidden`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.hidden)值 设置为：`true`

```
{
  "_id" : <num>
  "host" : <hostname:port>,
  "priority" : 0,
  "hidden" : true
}
```





### 配置步骤[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#configuration-procedure)

以下示例隐藏当前位于数组索引处的次要 `0`成员[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)。要配置[隐藏成员](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-hidden-member)，请在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到主会话的会话，指定要通过其在数组中的数组索引进行配置的成员 [`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)：

```
cfg = rs.conf()
cfg.members[0].priority = 0
cfg.members[0].hidden = true
rs.reconfig(cfg)
```



重新配置集合后，该次要成员的优先级为 ， `0`因此它无法成为主要成员并被隐藏。集合中的其他成员不会在 [`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)命令或[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)方法输出中通告隐藏成员。

更新副本配置对象时，使用**数组索引**[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)访问数组 中的副本集成员。数组索引以. 不要将此索引值与数组中每个文档中的 **字段**值混淆。`0`[`members[n\]._id`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-._id)[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)

>## 警告
>
>- shell 方法可以强制当前[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)primary 下台，从而导致[选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。当主要步骤关闭时， [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)关闭所有客户端连接。虽然这通常需要 10-20 秒，但请尝试在计划的维护期间进行这些更改。
>- 避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。

## 相关文件[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/#related-documents)

- [副本集重新配置](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)
- [副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/)
- [阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference)

←  [防止次要成为主要](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/)[配置延迟副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/) →

原文链接 -  https://docs.mongodb.com/manual/tutorial/configure-a-hidden-replica-set-member/

译者：陆文龙

