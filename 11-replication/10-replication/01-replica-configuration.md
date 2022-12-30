#### 副本集配置

您可以使用rs.conf()方法或replSetGetConfig命令访问副本集的配置。

要修改副本集的配置，请使用rs.reconfig()方法传递配置文档。更多信息请参见rs.reconfig()。

>⚠️注意
>
>避免重新配置包含不同MongoDB版本成员的副本集，因为不同MongoDB版本的验证规则可能不同。

#### 副本集配置文档示例

下面的文档提供了副本集配置文档的样例。你的节点配置文档可能只包含样例文档的部分配置：

```
{
  _id: <string>,
  version: <int>,
  term: <int>,
  protocolVersion: <number>,
  writeConcernMajorityJournalDefault: <boolean>,
  configsvr: <boolean>,
  members: [
    {
      _id: <int>,
      host: <string>,
      arbiterOnly: <boolean>,
      buildIndexes: <boolean>,
      hidden: <boolean>,
      priority: <number>,
      tags: <document>,
      secondaryDelaySecs: <int>,
      votes: <number>
    },
    ...
  ],
  settings: {
    chainingAllowed : <boolean>,
    heartbeatIntervalMillis : <int>,
    heartbeatTimeoutSecs: <int>,
    electionTimeoutMillis : <int>,
    catchUpTimeoutMillis : <int>,
    getLastErrorModes : <document>,
    getLastErrorDefaults : <document>,
    replicaSetId: <ObjectId>
  }
}
```

#### 副本集配置参数

##### _id

​	*Type*: string

​	复制集的名称。

​	_id必须与副本相同，或者在命令行用--replSet命令指定mongod的replSetName值

##### version

​	*Type*: int

​	用一个递增的数字来区分副本集配置文档的修订与配置的先前迭代。

​	*相对版本4.4中的修改*：副本集成员使用term和version在“最新”副本配置上达成共识。当成员比	较副本配置文档时，具有较大术语的配置文档被认为是“最新的”。如果term相同或不存在，则较	大版本的配置文档视为“最新”。

**term**

*Type*: int

4.4新版功能仅在[featureCompatibilityVersion (fCV)](https://www.mongodb.com/docs/manual/reference/command/setFeatureCompatibilityVersion/#std-label-view-fcv)中可用“4.4”或更高版本。

用一个递增的数字来区分副本集配置文档的修订与配置的先前迭代，配置文档的term与执行重新配置的复制集主的term匹配，初选获胜后，每任期一次，它的任期就会增加。如果在replSetReconfig操作中显式设置，主服务器将忽略term字段。

强制重新配置将删除术语字段，不强制发出replSetReconfig时，它将该term设置为自己的term。

副本集成员使用term和version在“最新”副本配置上达成共识，当副本集成员比较副本配置文档时，具有较大term的配置文档被认为是“最新的”，如果term相同或不存在，则较大版本的配置文档视为“最新”。



**configsvr**

*Type*: boolean

*Default*: false

表明复制集是否用于分片集群的配置服务器，如果副本集用于分片集群的配置服务器，则设置为true。

>💡提示
>
>​	参考：[Sharded Cluster Enhancements](https://www.mongodb.com/docs/manual/release-notes/3.2/#std-label-3.2-rel-notes-sharded-cluster)

**protocolVersion**

*Type*: number

*Default*: 1

从4.0开始，MongoDB只支持protocolVersion: 1，不再支持protocolVersion: 0。

>💡提示
>
>​	参考：[Replica Set Protocol Version](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

**writeConcernMajorityJournalDefault**

*Type*: boolean

*Default*: true

如果写关注点没有显式指定日志选项j，则确定{w: "majority"}写关注点的行为。

下表列出了writeConcernMajorityJournalDefault值和相关的{w: "majority"}行为:

| Value | `{ w: "majority" }` Behavior                                 |
| :---- | :----------------------------------------------------------- |
| true  | MongoDB在大多数投票成员写入磁盘上的日志后承认写入操作。当writeConcernMajorityJournalDefault为true时，复制集的所有投票成员必须运行日志记录。如果复制集的任何投票成员使用内存中存储引擎，则必须设置writeConcernMajorityJournalDefault为false。如果复制集的任何投票成员使用内存存储引擎和writeConcernMajorityJournalDefault为true，多数写操作可能失败。这些操作包括固有地使用“majority”写关注的操作，如replSetStepDown命令，或默认使用“majority”写关注的各种mongosh方法，如用户管理方法和角色管理方法。从版本4.2(以及4.0.13和3.6.14)开始，如果一个副本集成员使用内存中存储引擎(有投票或无投票)，但副本集有writeConcernMajorityJournalDefault设置为true时，副本集成员记录启动警告。 |
| false | MongoDB在大多数投票成员在内存中应用了写操作后才会认可写操作。如果复制集的任何投票成员使用内存中存储引擎，则必须设置writeConcernMajorityJournalDefault为false。从版本4.2(以及4.0.13和3.6.14)开始，如果一个副本集成员使用内存中存储引擎(有投票或无投票)，但副本集有writeConcernMajorityJournalDefault设置为true时，副本集成员记录启动警告。 |

>💡提示
>
>​	参考：
>
>- [Acknowledgment Behavior](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-ack-behavior)
>- [Replica Set Protocol Version](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

**members**

*Type*: array

成员配置文档数组，副本集的每个成员对应一个。members数组是一个零索引数组。

每个特定于成员的配置文档可以包含以下字段:

**members[n]._id**

*Type*: integer

复制集中成员的整数标识符，在所有成员中惟一。从MongoDB 5.0开始，这个值可以是大于或等于0的任何整数值，之前这个值只能为0到255之间的整数。

每个副本集成员必须有唯一的_id。避免重复使用_id值，即使当前配置中没有成员[n]项使用该_id。

一旦设置，就不能更改成员的_id。

>NOTE
>
>对象中的副本集成员,使用数组索引创建数组成员。数组索引从0开始。不要将这个索引值与成员[n]的值混淆。成员数组中每个文档中的_id字段。
>
>

`members[n].host`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.host)

*Type*: string

集合成员的主机名和端口号(如果指定的话)。

复制集中的每个主机的主机名必须是可解析的。

>⚠️警告
>
>[n] .host成员不能保留解析到本地主机或本地接口的值，除非该集合的所有成员都位于解析到本地主机的主机上。
>
>

`members[n].arbiterOnly`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.arbiterOnly)

*可选*.

*Type*: boolean

*Default*: false

值为true表示该成员是仲裁者

当使用rs.addArb()方法添加仲裁器时，该方法会自动设置members[n].arbiterOnly的值为true。

以下MongoDB版本，对于带仲裁器的副本集，pv1与pv0 (MongoDB 4.0+不再支持)相比，增加了w:1回滚的可能性:

- MongoDB 3.4.1
- MongoDB 3.4.0
- MongoDB 3.2.11 或者更早版本

See [Replica Set Protocol Version.](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)

`members[n].buildIndexes`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes)

*Optional*.

*Type*: boolean

*Default*: true

一个布尔值，指示[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 是否在该成员上构建 [indexes](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-index) ，你只能在向复制集添加成员时设置此值，而无法改变

members[n].buildIndexes字段中已添加的成员。要添加成员，请参见[`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add) 和  [`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)

对于从客户端接收查询的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例，不要设置为false。

如果以下所有条件都满足，将buildIndexes设置为false可能有用:

- 您只使用此实例执行使用的备份[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)
- 此成员将不会接收任何查询
- 创建和维护索引会使主机系统负担过重

即使设置为false，二级服务器也会在_id字段上建立索引，以方便复制所需的操作。

>⚠️警告
>
>如果你设置 [`members[n\].buildIndexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes) 若为假，也必须设置 [`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 为0。如果[`members[n\].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 
>
>如果不是0,MongoDB在尝试添加成员时将返回错误 [`members[n\].buildIndexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes) 等于false。
>
>为确保成员不接收查询，应隐藏所有未构建索引的实例。
>
>其他辅助服务器无法从其中的成员进行复制  [`members[n\].buildIndexes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.buildIndexes) 为false。

**members[n].hidden**

*Optional*.

*Type*: boolean

*Default*: false

当此值为true时，复制集将隐藏该实例，并且在 [`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)或[`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello).的输出中不包括该成员，这可以防止读操作(即查询)通过次要读优先级到达这个主机。

隐藏成员可以确认由写关注发出的写操作。对于带有“[多数](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)”[Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)的写操作，成员必须是有表决权的成员(即[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 大于0)。

Hidden members can acknowledge write operations issued with [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern). For write operations issued with [`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) write concern, the member must also be a voting member (i.e. [`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) is greater than `0`).

>💡小贴士
>
>参考：
>
>[Hidden Replica Set Members](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#std-label-replica-set-hidden-members)

`members[n].priority`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)

在3.6版更改:从MongoDB 3.6开始，仲裁器的优先级为0。如果一个仲裁器的优先级为1,MongoDB 3.6将仲裁器的优先级重新配置为0。

*Optional*.

*Type*: 0到1000之间的数字为主要/次要；0或1为仲裁者。

*Default*: 主/辅助1.0;0表示仲裁者。

数字的值表示成员是否成为[primary.](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)的判断条件。

指定成员的数值改变成员成为 [primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)的相对资格，（数值越高资格等级越高，反之亦然），[`members[n].priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)数值为0则不能成为 [primary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)。

优先级大于0的成员不能拥有0票。

改变副本集中优先级的平衡将触发一个或多个选举。如果一个较低优先级的次要成员比一个较高优先级的次要成员当选，副本集成员将继续调用选举，直到最高优先级可用成员成为主要成员。



 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)为0的成员可以确认由写关注发出的写操作。对于带有"[`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-)  [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)的写操作，成员必须是有表决权的成员(即[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 大于0)。

Members with [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) of `0` can acknowledge write operations issued with [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern). For write operations issued with [`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) write concern, the member must also be a voting member (i.e. [`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) is greater than `0`).



>💡提示
>
>参考：
>
>[Replica Set Elections.](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)

`members[n].tags`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)

*Optional*.

*Type*: document

*Default*: none

标记文档包含用于复制集成员的用户定义标记字段和值对。

```
{ "<tag1>": "<string1>", "<tag2>": "<string2>",... }
```

- 对于读操作，您可以在[read preference](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-replica-set-read-preference-tag-sets)中指定一个标记集，将操作引导到具有指定标记的复制集成员。
- 对于写操作，可以使用设置创建自定义[write concern](https://www.mongodb.com/docs/manual/reference/write-concern/) 。[`settings.getLastErrorModes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorModes) 和 [`settings.getLastErrorDefaults`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults)

更多信息请参考 [Configure Replica Set Tag Sets.](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)

`members[n].secondaryDelaySecs`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.secondaryDelaySecs)

*Optional*.

*Type*: integer

*Default*: 0

这个复制集成员“滞后”于主节点的秒数。

使用此选项可创建 [delayed members](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/#std-label-replica-set-delayed-members)。延迟成员维护数据的副本，该副本反映了数据在过去某个时间的状态。

延迟的成员可以帮助确认由写关注发出的 [Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern). 

延迟的成员可以帮助确认由写关注发出的写操作。但是，它们返回写确认不早于配置的延迟值。

对于带有 [`"majority"`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.-majority-) 写关系的写操作，成员必须是有表决权的成员(即:[`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes) 大于0)。

>💡提示
>
>参考：[Delayed Replica Set Members](https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/)

`members[n].votes`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)

*Optional*.

*Type*: integer

*Default*: 1

服务器将在 [replica set election](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)中投出的票数。 每个成员拥有的票数要么是 1，要么是 0， [arbiters](https://www.mongodb.com/docs/manual/core/replica-set-members/#std-label-replica-set-arbiters) 总是恰好有 1 票。

 [`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority) 大于 0 的成员不能有 0  [`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)。

一个副本集最多可以有  [50 members](https://www.mongodb.com/docs/manual/reference/limits/#mongodb-limit-Number-of-Members-of-a-Replica-Set)，但只有 7 个有投票权的成员。 如果在一个副本集中需要超过 7 个成员，请设置[`members[n].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)对于额外的无投票权成员为 0。

无投票权（即 [`votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)为 0）的成员的[`priority`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)必须为 0。从 MongoDB 5.0 开始，新添加的辅助成员不算作投票成员，并且在达到 [`SECONDARY`](https://www.mongodb.com/docs/manual/reference/replica-states/#mongodb-replstate-replstate.SECONDARY) 状态之前不能被选举。非投票成员不能确认以“多数”写关注发出的写操作。

>💡提示
>
>参考：
>
>- [`replSetGetStatus.votingMembersCount`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.votingMembersCount)
>- [`replSetGetStatus.writableVotingMembersCount`](https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/#mongodb-data-replSetGetStatus.writableVotingMembersCount)

### `settings`

**settings**

*Optional*.

*Type*: document

包含适用于整个副本集的配置选项的文档。

 [`settings`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings) 文档包含以下字段：

- `settings.chainingAllowed`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed)

  *Optional*.

  *Type*: boolean

  *Default*: true

  在 MongoDB 5.0.1、4.2.15、4.4.7 和更早版本中, 如果 [`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed) 是:

  - `true`,副本集[secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary) 成员可以从其他次要成员复制数据。
  - `false`, secondary成员只能从 [primary.](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)复制数据。

  从 MongoDB 5.0.2、4.2.16 和 4.4.8 开始：

  - 副本集 [secondary](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员可以从其他次要成员复制数据，即使[`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed) 为`false`。
  - 覆盖 [`settings.chainingAllowed`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.chainingAllowed), 设置 [`enableOverrideClusterChainingSetting`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableOverrideClusterChainingSetting) 服务器参数为 `true`.
  -  [`enableOverrideClusterChainingSetting`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableOverrideClusterChainingSetting) 默认值为 `false`.

  >💡提示
  >
  >参考：
  >
  >[Manage Chained Replication](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/)

`settings.getLastErrorDefaults`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults)

*Optional*.

*Type*: document

从 MongoDB 5.0 开始不可用。

>🏁重点
>
>从 MongoDB 5.0 开始，您不能指定默认的写关注[`settings.getLastErrorDefaults`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorDefaults) 除了默认值 { w: 1, wtimeout: 0 } 。 相反，使用  [`setDefaultRWConcern`](https://www.mongodb.com/docs/manual/reference/command/setDefaultRWConcern/#mongodb-dbcommand-dbcmd.setDefaultRWConcern) 命令为副本集或分片集群设置默认的读取或写入关注配置。



`settings.getLastErrorModes`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorModes)

*Optional*.

*Type*: document

用于通过使用定义自定义[write concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern) 的文档 [`members[n].tags`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags). 自定义写入关注点可以提供[data-center awareness.](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-data-center-awareness)。

```
{ getLastErrorModes: {
   <name of write concern> : { <tag1>: <number>, .... },
   ...
} }
```

指`<number>`的是满足写入关注点所需的不同标签值的数量。例如，以下 [`settings.getLastErrorModes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.getLastErrorModes)定义一个名为的写关注点`datacenter`，它要求写入传播到两个`dc`标签值不同的成员。

```
{ getLastErrorModes: { datacenter: { "dc": 2 } } }
```



要使用自定义写入关注，请将写入关注名称传递给[`w`Option](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-wc-w)，例如

```
{ w: "datacenter" }
```



有关更多信息和示例，请参阅[配置副本集标记集。](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)

`settings.heartbeatTimeoutSecs`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.heartbeatTimeoutSecs)

*可选*。

*类型*：整数

*默认值*：10

副本集成员等待彼此成功心跳的秒数。如果一个成员没有及时响应，其他成员会将这个拖欠的成员标记为不可访问。

>笔记
>
>为了[`pv1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion), [`settings.electionTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)对次要议员是否要求选举的影响大于[`settings.heartbeatTimeoutSecs`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.heartbeatTimeoutSecs)
>
>

`settings.electionTimeoutMillis`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)

*可选*。

*类型*：整数

*默认值*：10000（10 秒）

以毫秒为单位的时间限制，用于检测何时无法访问副本集的主节点：

- 较高的值会导致较慢的故障转移，但会降低对主节点或网络缓慢或不稳定的敏感度。
- 较低的值会导致更快的故障转移，但会增加对主节点或网络缓慢或不稳定的敏感度。

该设置仅在使用时适用[`protocolVersion: 1`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)

>笔记
>
>*在4.0.2版更改*：如果参数为 true（默认），当主节点从 （或不带 的命令）[`enableElectionHandoff`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableElectionHandoff)下台时，已下台的主节点会提名一个符合条件的从节点立即进行选举。否则，副手可以等到直到 召集选举。降级的主节点不会等待切换的效果。有关详细信息，请参阅 [。](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableElectionHandoff)[`rs.stepDown()`](https://www.mongodb.com/docs/manual/reference/method/rs.stepDown/#mongodb-method-rs.stepDown)[`replSetStepDown`](https://www.mongodb.com/docs/manual/reference/command/replSetStepDown/#mongodb-dbcommand-dbcmd.replSetStepDown)`force: true`[`settings.electionTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.electionTimeoutMillis)[`enableElectionHandoff`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.enableElectionHandoff)

`settings.catchUpTimeoutMillis`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)

*可选*。

*类型*：整数

*在3.6版中更改*：

*默认值*：-1，无限追赶时间。

新选出的主节点与可能具有更新的写入的其他副本集成员同步（赶上）的时间限制（以毫秒为单位）。无限或高时间限制可能会减少其他成员在选举后需要回滚的数据量，但可能会增加故障转移时间。

新当选的节点一旦完全赶上其他节点，就会提前结束选举期。. 在选举期间，新选出的主节点不可用于客户端的写入。用于[`replSetAbortPrimaryCatchUp`](https://www.mongodb.com/docs/manual/reference/command/replSetAbortPrimaryCatchUp/#mongodb-dbcommand-dbcmd.replSetAbortPrimaryCatchUp) 中止选举，然后完成向主节点的过渡。

该设置仅在使用时适用 [`protocolVersion: 1`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.protocolVersion)

>笔记
>
>要将 3.6 版本启动的副本集降级到 3.4，请将`catchUpTimeoutMillis`from更改`-1`为正数。未能将此值更改为正数会导致运行 3.4 版的节点既不重启也不加入副本集。

`settings.catchUpTakeoverDelayMillis`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTakeoverDelayMillis)

*可选*。

*类型*：整数

*默认值*：30000（30 秒）

节点在确定它领先于当前 [主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)后等待启动 *追赶接管的*时间（以毫秒为单位） 。在追赶接管期间，当前主节点之前的节点发起选举[以成为](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election)[副本](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)集的新主节点[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)

发起接管的节点确定它领先于当前[主节点](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)后，它会等待指定的毫秒数，然后验证以下内容：

1. 它仍然领先于当前的主节点，
2. 它是所有可用节点中最新的节点，
3. 目前的主节点目前正在赶上它。

一旦确定所有这些条件都满足，发起接管的节点立即进行选举。

有关副本集选举的更多信息，请参阅[副本集选举。](https://www.mongodb.com/docs/manual/core/replica-set-elections/)

>笔记
>
>设置`catchUpTakeoverDelayMillis`为`-1`禁用追赶接管。
>
>环境[`catchUpTimeoutMillis`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.catchUpTimeoutMillis)禁用 *主追赶*`0`并因此也禁用追赶接管。

- `settings.heartbeatIntervalMillis`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.heartbeatIntervalMillis)

  *仅限内部使用*。心跳的频率（以毫秒为单位）。

- `settings.replicaSetId`[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.replicaSetId)

  *类型*：ObjectId[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)与副本集关联并在或 期间自动创建的 ObjectId [`replSetInitiate`](https://www.mongodb.com/docs/manual/reference/command/replSetInitiate/#mongodb-dbcommand-dbcmd.replSetInitiate)。你不能改变 [`replicaSetId`.](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.settings.replicaSetId)

 [复制参考](https://www.mongodb.com/docs/manual/reference/replication/)

[副本集协议版本](https://www.mongodb.com/docs/manual/reference/replica-set-protocol-versions/)





原文链接： https://docs.mongodb.com/manual/reference/replica-configuration/

译者：陆文龙

