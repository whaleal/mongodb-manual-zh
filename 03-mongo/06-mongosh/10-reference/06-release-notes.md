# 发行说明

## v1.8.0

*2023 年 2 月 28 日发布*

自动完成建议完成数据库级聚合阶段。

### 兼容性变化

- `EJSON.stringify`不再接受一个`{{strict}}`选项。
- 这些方法被删除：
  * ObjectId.prototype.generate
  * ObjectId.prototype.getInc
  * ObjectId.prototype.get_inc
  * ObjectId.getInc
- 代码对象在其属性中存储一个字符串`.code`。代码对象不在其`.code`属性中存储 JavaScript 函数。
- 如果对象将键传递给数据库函数，`mongosh`则只将对象自己的键发送到服务器。`mongosh`不会将继承的可枚举密钥发送到服务器。

### 1.8.0 中的更新

- [MONGOSH-1358](https://jira.mongodb.org/browse/MONGOSH-1358)5.1.0 的更新[Node.js 驱动程序。](https://www.mongodb.com/docs/drivers/node/)
- [MONGOSH-1336](https://jira.mongodb.org/browse/MONGOSH-1336)一些用例的性能改进包括`--version`和`--build-info`标志。
- [MONGOSH-1316](https://jira.mongodb.org/browse/MONGOSH-1316)显示`createEncryptedCollection` 辅助方法。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=35534)

## v1.7.1

*2023 年 2 月 16 日发布*

- [MONGOSH-1378](https://jira.mongodb.org/browse/MONGOSH-1378)`mongosh`修复了使用 Homebrew 安装时的连接问题。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=35548)

## v1.7.0

*2023 年 2 月 10 日发布*

- [MONGOSH-57](https://jira.mongodb.org/browse/MONGOSH-57)连接到模拟 MongoDB 的数据库时显示警告。
- [MONGOSH-545](https://jira.mongodb.org/browse/MONGOSH-545)要获取当前连接字符串，请使用 `db.getMongo().getURI()`.

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=35363)

## v1.6.2

*2023 年 1 月 9 日发布*

- 缩短`mongosh`启动时间。
- `mongosh`现在使用[Node.js 驱动程序 4.13.0 。](https://github.com//mongodb/node-mongodb-native/releases/tag/v4.13.0)
- 改进错误消息。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?version=35137&projectId=17381)

## v1.6.1

*2022 年 12 月 1 日发布*

- [MONGOSH-1320](https://jira.mongodb.org/browse/MONGOSH-1320)：修复了与 Docker 和类似环境相关的启动错误。
- [MONGOSH-1050](https://jira.mongodb.org/browse/MONGOSH-1050)：添加对 `convertShardKeyToHashed()`辅助方法的支持。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=34525)

## v1.6.0

*2022 年 9 月 20 日发布*

- [MONGOSH-1299](https://jira.mongodb.org/browse/MONGOSH-1299):`mongosh`现在使用[Node.js 驱动程序 4.10.0 。](https://github.com//mongodb/node-mongodb-native/releases/tag/v4.10.0)
- [MONGOSH-1254](https://jira.mongodb.org/browse/MONGOSH-1254): 添加`sh.getShardedDataDistribution()` 辅助方法。此方法运行`$shardedDataDistribution` 聚合阶段并返回结果的游标。
- [MONGOSH-1266](https://jira.mongodb.org/browse/MONGOSH-1266): 密钥库[`getKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKey/#mongodb-method-KeyVault.getKey)和 [`getKeyByAltName()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.getKeyByAltName/#mongodb-method-KeyVault.getKeyByAltName)方法现在返回文档。
- [MONGOSH-1249](https://jira.mongodb.org/browse/MONGOSH-1249)：添加`--json`用于 `--eval`命令的标志。
- [MONGOSH-1287](https://jira.mongodb.org/browse/MONGOSH-1287):`cursor.count()`现已弃用。相反，使用[`countDocuments()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/#mongodb-method-db.collection.countDocuments)和 [`estimatedDocumentCount()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/#mongodb-method-db.collection.estimatedDocumentCount)

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=34315)

## v1.5.4

*2022 年 7 月 31 日发布*

修复了一个潜在的数据损坏错误 [`KeyVault.rewrapManyDataKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.rewrapManyDataKey/#mongodb-method-KeyVault.rewrapManyDataKey)在轮换由 Azure 或 GCP 密钥服务支持的加密数据加密密钥时。

在以前的版本中`mongosh`，当重新包装 Azure 支持或 GCP 支持的数据加密密钥需要获取访问令牌以解密数据加密密钥时，就会出现此错误。

由于这个错误，所有被重新包装的数据加密密钥都被新的随机生成的材料所取代，从而破坏了原始密钥材料。

为了减轻潜在的数据损坏，请`mongosh`在使用前升级到 v1.5.4 或更高版本[`KeyVault.rewrapManyDataKey()`](https://www.mongodb.com/docs/manual/reference/method/KeyVault.rewrapManyDataKey/#mongodb-method-KeyVault.rewrapManyDataKey)轮换 Azure 支持或 GCP 支持的数据加密密钥。在密钥轮换之前，您应该始终创建密钥保管库集合的备份。

## v1.5.3

*2022 年 7 月 29 日发布*

更新遥测内部结构。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?version=34298&projectId=17381)

## v1.5.2

*2022 年 7 月 27 日发布*

`mongosh`现在使用[Node.js 驱动程序 4.8.1 。](https://github.com//mongodb/node-mongodb-native/releases/tag/v4.8.1)

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=34143)

## v1.5.1

*2022 年 7 月 14 日发布*

- [MONGOSH-1194](https://jira.mongodb.org/browse/MONGOSH-1194)-`mongosh`支持多个[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)参数。
- `mongosh`现在使用[Node.js 驱动程序 4.8.0 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.8.0)

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?version=33699&projectId=17381)

## v1.5.0

*2022 年 6 月 2 日发布*

- [MONGOSH-1138](https://jira.mongodb.org/browse/MONGOSH-1138)–`mongosh`现在支持可查询加密。
- [MONGOSH-1169](https://jira.mongodb.org/browse/MONGOSH-1169)–`mongosh`现在支持 FIPS 兼容模式。
- `mongosh`现在使用 Node.js 版本 16.x。
- `mongosh`不再提供每个发行版的`mongosh`linux 包。您仍然可以通过包管理器获取 .rpm、.deb 和 .tgz 包，但命名约定可能会略有变化。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=33985)

## v1.4.2

*2022 年 5 月 17 日发布*

- [MONGOSH-1139](https://jira.mongodb.org/browse/MONGOSH-1139)- 添加了 Debian 11 对`mongosh`.
- [MONGOSH-1183](https://jira.mongodb.org/browse/MONGOSH-1183)-`cursor.allowDiskUse()`现在接受`true` or `false`。
- [MONGOSH-1204](https://jira.mongodb.org/browse/MONGOSH-1204)- 为可查询加密集合添加视觉标识符`show collections`。
- [MONGOSH-1207](https://jira.mongodb.org/browse/MONGOSH-1207)- 添加可查询加密助手。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=33637)

## v1.4.1

*2022 年 5 月 12 日发布*

- [MONGOSH-1118](https://jira.mongodb.org/browse/MONGOSH-1118)- 捆绑并使用 CSFLE 共享库代替`mongocryptd`.
- [MONGOSH-1217](https://jira.mongodb.org/browse/MONGOSH-1217)- 引入了对可查询加密的部分支持。
- [MONGOSH-1178](https://jira.mongodb.org/browse/MONGOSH-1178)- 用途[Node.js 驱动程序 4.6.0 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.6.0)

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=33226)

## v1.3.1

*2022 年 3 月 21 日发布*

- [MONGOSH-1163](https://jira.mongodb.org/browse/MONGOSH-1163)-`mongosh`现在使用 Node.js 14.19.1。Node 14.19.1 包含一个 OpenSSL 版本，可解决 [CVE-2022-0778 。](https://www.openssl.org/news/secadv/20220315.txt)

## v1.3.0

*2022 年 3 月 17 日发布*

- [MONGOSH-856](https://jira.mongodb.org/browse/MONGOSH-856)- Kerberos 与旧版 shell 的功能奇偶校验现已完成，最后一个命令行选项现在也像在旧版 shell 中一样工作。
- [MONGOSH-1013](https://jira.mongodb.org/browse/MONGOSH-1013)- 对 CSFLE 的 KMIP 支持。更具体地说，您现在可以在创建支持 CSFLE 的连接时提供每个 KMS 提供商的 TLS 选项。
- [MONGOSH-1151](https://jira.mongodb.org/browse/MONGOSH-1151)- 支持快照读取，现在也在 mongosh 中。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=33190)

## v1.2.3

*2022 年 3 月 10 日发布*

- [MONGOSH-1121](https://jira.mongodb.org/browse/MONGOSH-1121)- 支持`commitQuorum`参数为 [`createIndexes()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndexes/#mongodb-method-db.collection.createIndexes)方法。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32989)

## v1.2.2

*2022 年 2 月 25 日发布*

- [MONGOSH-1134](https://jira.mongodb.org/browse/MONGOSH-1134)- 重新启用 Homebrew 安装所需的内部错误修复。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32988)

## v1.2.1

*2022 年 2 月 24 日发布*

- [MONGOSH-1063](https://jira.mongodb.org/browse/MONGOSH-1063)- 您现在可以创建全局`monogosh` [配置文件。](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/#std-label-mongosh-shell-settings)
- [MONGOSH-959](https://jira.mongodb.org/browse/MONGOSH-959)– 您现在可以使用[config.reset](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-example-reset-setting)方法将配置设置重置为默认值。
- [MONGOSH-1133](https://jira.mongodb.org/browse/MONGOSH-1133)–`mongosh`添加一个[`--tlsUseSystemCA`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsUseSystemCA) 选项，导致`mongosh`尝试加载系统证书以及内置证书。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32780)

## v1.1.9

*2022 年 1 月 18 日发布*

此版本中的新功能：

- [MONGOSH-1015](https://jira.mongodb.org/browse/MONGOSH-1015)–如果它存在于连接字符串中，则`mongosh`不再覆盖。`appName`
- [MONGOSH-1073](https://jira.mongodb.org/browse/MONGOSH-1073)– 您现在可以将 BSON 数字对象传递给旧版 BSON 数字构造函数。例如， `NumberInt(NumberInt(n))`现在就像在旧版 shell 中一样工作。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32728)

## v1.1.8

*2022 年 1 月 11 日发布*

此版本中的新功能：

- `mongosh`现在使用[Node.js 驱动程序 4.3.0 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.3.0)
- 为上传的压缩包提供 PGP 签名。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32594)

## v1.1.7

*2021 年 12 月 14 日发布*

- `mongosh`现在使用[Node.js 驱动程序 4.2.2 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.2.2)
- 修正了一些小错误。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32512)

## v1.1.6

*2021 年 12 月 2 日发布*

此版本中的新功能：

- `mongosh`现在使用[Node.js 驱动程序 4.2.1 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.2.1)

此版本中的错误修复：

- 如果块中没有抛出异常，则修复`try`, `catch`, 的工作方式。`finally``try`

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32498)

## v1.1.5

*2021 年 12 月 1 日发布*

修正了一些小错误。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32485)

## v1.1.4

*2021 年 11 月 24 日发布*

修正了一些小错误。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32336)

## v1.1.2

*2021 年 11 月 5 日发布*

此版本中的新功能：

- `mongosh`现在使用以下驱动程序版本：
  - [Node.js 驱动程序 4.1.4 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.1.4)
  - [Node.js BSON 包 4.5.4 。](https://github.com/mongodb/js-bson/releases/tag/v4.5.4)
- `mongosh`发布压缩包现在包括联机帮助页。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32313)

## v1.1.1

*2021 年 10 月 28 日发布*

- 为额外的聚合阶段提供自动完成。
- 修正了一些小错误。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32226)

## v1.1.0

*2021 年 10 月 7 日发布*

此版本中的新功能：

- `edit`添加对命令和变量的支持`$EDITOR`。
- 数据库和集合的自动完成现在不区分大小写。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=32095)

## v1.0.7

*2021 年 9 月 22 日发布*

此版本中的新功能：

`mongosh`现在使用以下驱动程序版本：

- [Node.js 驱动程序 4.1.2 。](https://github.com/mongodb/node-mongodb-native/releases/tag/v4.1.2)
- [Node.js BSON 包 4.5.2 。](https://github.com/mongodb/js-bson/releases/tag/v4.5.2)
- [Node.js BSON 扩展 4.0.1 。](https://github.com/mongodb-js/bson-ext/releases/tag/v4.0.1)
- [Node.js 驱动程序 Kerberos 插件 1.1.7 。](https://github.com/mongodb-js/kerberos/releases/tag/v1.1.7)
- [Node.js 驱动程序 CSFLE 插件 1.2.7 。](https://github.com/mongodb/libmongocrypt/releases/tag/node-v1.2.7)

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?version=32032&projectId=17381)

## v1.0.6

*2021 年 9 月 14 日发布*

此版本中的新功能：

- 你现在可以运行[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)未连接到 a 时 `mongos`，例如连接到 a 时 [配置服务器。](https://www.mongodb.com/docs/manual/core/sharded-cluster-config-servers/)
- `db.setSecondaryOk()`、`mongo.setSecondaryOk()`和 `rs.secondaryOk()`方法重新引入但**弃用了**。这些方法别名为`mongo.setReadPref()`.
- 当您在 shell 中输入多行输入时，单行 `// comments`现在会像`/* comments */`在历史条目中一样被保留下来。
- 这[聚合管道](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/#std-label-aggregation-pipeline)参数现在是可选的 [`db.collection.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.watch/#mongodb-method-db.collection.watch),[`db.watch()`](https://www.mongodb.com/docs/manual/reference/method/db.watch/#mongodb-method-db.watch)， 和 [`Mongo.watch()`.](https://www.mongodb.com/docs/manual/reference/method/Mongo.watch/#mongodb-method-Mongo.watch)

此版本中的错误修复：

- `mongosh`现在运行聚合[`$out`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out)或者 [`$merge`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge)立即，而不是在访问聚合结果后延迟。
- 使用旧`NumberLong()`方法不再截断 32 位范围之外的数字。

[JIRA 上提供完整的发行说明。](https://jira.mongodb.org/secure/ReleaseNote.jspa?projectId=17381&version=31793)

## v1.0.5

*2021 年 8 月 12 日发布*

此版本中的新功能：

- 您可以使用它来设置操作的`config.set('maxTimeMS', <number>)`默认 值。指定以毫秒为单位的时间限制，操作必须在该时间限制内完成。`maxTimeMS``maxTimeMS`

  > 笔记：
  >
  > `config`设置跨会话持续存在

- 在 Windows 上，您可以`mongosh`通过双击该 `.exe`文件开始。当您这样做时，`mongosh`系统会提示您输入连接字符串以连接到您的部署。

- 创建的日志文件遵循、或`mongosh`的格式 。这意味着，日志文件是用换行符分隔的 JSON，具有服务器使用的相同字段集。`mongod``mongos``mongocryptd`

## v1.0.4

*2021 年 8 月 4 日发布*

此版本中的新功能：

- `mongosh`现在使用`4.1.0`Node.js 驱动程序版本，完全支持连接到负载均衡器和 MongoDB Atlas [无服务器实例。](https://www.mongodb.com/docs/atlas/tutorial/create-new-serverless-instance/)

此版本中的错误修复：

- `Timestamp()`与以前的版本相比，参数顺序现在颠倒了`mongosh`。

## v1.0.3

*2021 年 7 月 29 日发布*

此版本中的错误修复：

- 将退出代码传递给`quit()`它就像在旧版 shell 中一样工作。
- 当在循环中使用`MaxListenersExceededWarning`类似的方法时，不再发出实例。`console.log()`
- 当发生内部错误时`mongosh`，错误消息会将您指向当前`mongosh`会话的日志文件。
- 打印集合名称时（例如响应 `db.coll`），数据库名称包含在输出中。

## v1.0.1

*2021 年 7 月 21 日发布*

此版本中的新功能：

- 添加对标志的完全支持`--host`。
- 添加`--build-info`提供有关`mongosh`版本的详细信息的标志。
- 使用 Kerberos 时，`mongosh`现在将使用仍然有效的令牌。使用有效令牌时，您不再需要指定密码。

此版本中的错误修复：

- `AcquireCredentialsHandle` 偶尔导致Kerberos 错误的问题已得到修复。
- 杂项其他改进。

## v1.0

*2021 年 7 月 9 日发布*

此版本中的新功能：

- Node.js 驱动程序 BSON 类的所有静态方法现在都可用。具体来说，您可以使用 `ObjectId.createFromTime(unixTimestampSeconds)`而不是旧版 shell 的`ObjectId.fromDate(dateObj)`.
- 连接到 Atlas 部署时，`mongosh`将显示默认提示`Atlas`而不是`Enterprise`.
- 这[光标](https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/)在重新分配或 调用/`it`时清除使用时引用的内容。`db``db.auth()``db.logout()`
- 小错误修复和改进。

## v0.15.4

*2021 年 7 月 1 日发布*

此版本中的新功能：

- `mongosh`现在颜色坐标匹配括号。

## v0.15.3

*2021 年 6 月 25 日发布*

此版本中的新功能：

- `mongosh`现在默认在提示中显示当前数据库名称。

## v0.15.1

*2021 年 6 月 22 日发布*

此版本中的新功能：

- `.tar`和`.zip` `mongosh`下载档案现在包括一个父目录。
- 自动完成现在知道该`--apiStrict`标志。时 `--apiStrict`，`true`自动完成仅完成适用于您定义的 API 版本的方法。有关详细信息，请参阅 [稳定的 API 。](https://www.mongodb.com/docs/manual/reference/stable-api/)
- [片段](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)。允许用户创建自定义 shell 扩展的实验性功能。

此版本中的错误修复：

- `mongosh`现在可以连接到包含不健康节点的副本集。

## v0.14.0

*2021 年 5 月 28 日发布*

此版本中的新功能：

- 运行时`show collections`，集合的类型显示在输出中。
- 添加`sh.reshardCollection()`重新分片支持。
- `inspectCompact`向 [配置 API](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/#std-label-mongosh-shell-settings)添加选项以在其自己的行上打印每个文档字段。

## v0.13.1

*2021 年 5 月 18 日发布*

此版本中的新功能：

- 当您使用`Ctrl+C`中断操作时，您会中断正在服务器上运行的操作，而不仅仅是本地 JavaScript 的执行。
- [.editor](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/#std-label-mdb-shell-multi-line)会话被聚合到 shell 历史记录中的一个项目中。
- 在当前 MongoDB 5.0 服务器支持矩阵中为所有平台构建和发布包。
- 将 Windows MSI 发布到下载中心。
- `prompt`使用（或您的 [.mongoshrc.js](https://www.mongodb.com/docs/mongodb-shell/mongoshrc/#std-label-mongoshrc-js)文件）添加可自定义的 REPL 提示。
- 针对 MongoDB 5.0 部署运行时，显示文档验证失败的原因。
- 添加对标志的基本支持`--apiStrict`。
- 新的连接方式：
  - [`Mongo.getDBNames()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.getDBNames/#mongodb-method-Mongo.getDBNames)返回数据库列表。
  - [`Mongo.getDBs()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.getDBs/#mongodb-method-Mongo.getDBs)返回包含数据库和元数据列表的文档。

## v0.12.1

*2021 年 4 月 30 日发布*

此版本中的新功能：

- 添加对[`db.hello()`](https://www.mongodb.com/docs/manual/reference/method/db.hello/#mongodb-method-db.hello)外壳方法和 [`hello`](https://www.mongodb.com/docs/manual/reference/command/hello/#mongodb-dbcommand-dbcmd.hello)数据库命令。使用这些命令代替 `isMaster`.
- 扩展 shell 自定义 API 以允许控制日志详细程度。
- 为`show`和`use`命令添加自动完成。例如， `show collections`和`use test`。

此版本中的错误修复：

- [`collStats`](https://www.mongodb.com/docs/manual/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats)现在可以在分片集合上正常工作。

## v0.12.0

*2021 年 4 月 23 日发布*

- 新的异步重写器，允许在 shell 中使用更广泛的 JavaScript 功能。
- 如果认为连接不太可能成功，连接失败响应现在会更加迅速。
- 添加用于 shell 自定义的新 API。

## v0.11.0

*2021 年 4 月 8 日发布*

内部改进和各种错误修复。

## v0.10.1

*2021 年 4 月 1 日发布*

内部改进。

## v0.10.0

*2021 年 3 月 31 日发布*

此版本中的新功能：

- 支持`.mongoshrc.js`在启动时加载文件。使用此文件通过自定义和扩展功能引导 shell。
- 能够从命令行加载脚本。
- 支持[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)选项。
- 支持 [`--tlsCertificateSelector`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tlsCertificateSelector) Windows 和 macOS。

此版本中的错误修复：

- 中的对象[解释输出](https://www.mongodb.com/docs/manual/reference/explain-results/)现在适当扩大。

## v0.9.0

*2021 年 3 月 10 日发布*

此版本中的新功能：

- 支持[load()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-load)方法。
- 支持 AWS IAM 身份验证。

此版本中的错误修复：

- 连接到辅助节点时自动完成工作正常。
- [`db.createUser()`](https://www.mongodb.com/docs/manual/reference/method/db.createUser/#mongodb-method-db.createUser)on`$external`数据库现在可以正确处理密码。
- 杂项其他改进。

## v0.8.2

*2021 年 2 月 24 日发布*

小的内部改进和错误修复。

## v0.8.1

*2021 年 2 月 22 日发布*

小的内部改进和错误修复。

## v0.8.0

*2021 年 2 月 17 日发布*

此版本中的新功能：

- 支持[客户端字段级加密。](https://www.mongodb.com/docs/mongodb-shell/field-level-encryption/)

此版本中的错误修复：

- 跑步`setReadConcern`不再倒退[`db.auth()`](https://www.mongodb.com/docs/manual/reference/method/db.auth/#mongodb-method-db.auth) 认证操作。
- 在密码提示中按退格键不再添加星号，现在的行为符合预期。
- `UUID()`在没有值的情况下运行现在会生成一个随机 UUID。

## v0.7.7

*2021 年 2 月 3 日发布*

此版本中的新功能：

- [`explain()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)支持以下方法：
  - [`count()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.count/#mongodb-method-db.collection.count)
  - [`distinct()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/#mongodb-method-db.collection.distinct)
  - [`findAndModify()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/#mongodb-method-db.collection.findAndModify)
  - [`remove()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.remove/#mongodb-method-db.collection.remove)
  - [`update()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.update/#mongodb-method-db.collection.update)
- 支持指定`cursor.batchSize()`，输入`it`更多。
- 自动完成集合名称。

此版本中的错误修复：

- `mongosh`连接到状态中的节点时不再失败 `STARTUP2`。
- `mongosh`现在可以正确显示启动警告。
- [`explain()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.explain/#mongodb-method-db.collection.explain)on 聚合现在返回准确和完整的结果。

## v0.6.1

*2020 年 11 月 30 日发布*

此版本中的新功能：

- 支持[阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/) 方法。
- 支持[会话对象](https://www.mongodb.com/docs/manual/reference/method/Session/) 和相关的会话对象方法。
- 支持[交易](https://www.mongodb.com/docs/manual/core/transactions/)方法。

此版本中的错误修复和其他更新：

- 删除对已弃用的 3.6 CRUD 方法（`insert()`、 `remove()`、`save()`和`update()`）的支持。
- 修复将 JavaScript 文件加载到`mongosh`.
- 修复了通过 for 循环插入多个文档时，循环会在所有文档插入之前中止的问题。
- 修复打印光标结果时的输出问题。
- 更新 Node REPL 以使用 Node 版本 14。

## v0.5.2

*2020 年 11 月 11 日发布*

- 连接到 MongoDB 4.4.1 部署时，自动完成现在可以正常工作。
- 这[`sh.status()`](https://www.mongodb.com/docs/manual/reference/method/sh.status/#mongodb-method-sh.status)方法现在可以在浏览器 shell 中正确输出。

## v0.5.0

*2020 年 10 月 12 日发布*

- 添加对副本集管理方法的支持。
- 添加对分片集群管理方法的支持。

## v0.4.2

*2020 年 10 月 1 日发布*

- 添加对带点的集合名称的支持。例如，要查询名为 的集合`my.collection`，您可以运行：

  ```
  db.my.collection.findOne()
  ```

  

## v0.4.0

*2020 年 9 月 15 日发布*

- 添加对以下方法的支持：
  - [`db.collection.mapReduce()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce)
  - [`db.collection.validate()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.validate/#mongodb-method-db.collection.validate)
- 添加对`maxAwaitTimeMS`游标的支持。

## v0.3.1

*2020 年 9 月 14 日发布*

### 改进

此版本增加了对以下内容的支持：

- 新`cursor`方法
- 查询`planCache`方法
- 错误辅助方法
- 以下帮助命令：
  - `show users`
  - `show profile`
  - `show logs`
  - `show log[<name>]`

此版本包含一个`.rpm`工件，可以从[MongoDB 下载中心。](https://www.mongodb.com/download-center/community?jmp=docs)

### 行为更新

每当命令的输出包含 时`{ ok: 0 }`，`mongosh`抛出异常并且不从服务器返回原始输出。

命令之间的遗留`mongo`shell 错误处理不一致。`mongosh`标准化面向用户的行为以获得更一致的体验。

### Bug修复

- [MONGOSH-323](https://jira.mongodb.org/browse/MONGOSH-323): getUser() userId 字段以二进制形式输出。

- [MONGOSH-337](https://jira.mongodb.org/browse/MONGOSH-337): Linux tarball 没有 gzip 压缩。

- [MONGOSH-341](https://jira.mongodb.org/browse/MONGOSH-341): 数字 > Number.MAX_SAFE_INTEGER 的 NumberLong 值错误。作为此修复的结果，传递给`NumberLong`并且`NumberDecimal`必须是字符串的值。

  >重要的:
  >
  >的修复[MONGOSH-341](https://jira.mongodb.org/browse/MONGOSH-341)与遗留 shell 中的行为相比，这是一个重大变化`mongo`

- [MONGOSH-346](https://jira.mongodb.org/browse/MONGOSH-346):`Ctrl+C`不会终止 shell 中当前正在运行的命令。

  >笔记:
  >
  >`Ctrl+C`终止 shell 中的进程，但不会终止 MongoDB 服务器上的进程。

## v0.2.2

*2020 年 8 月 31 日发布*

### API 添加

此版本增加了对以下 API 的支持：

- 管理命令，例如[`db.killOp()`](https://www.mongodb.com/docs/manual/reference/method/db.killOp/#mongodb-method-db.killOp)和 [`db.currentOp()`](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/#mongodb-method-db.currentOp). 更多细节在 [蒙戈什-307 。](https://jira.mongodb.org/browse/MONGOSH-307)
- 免费监控命令如[`db.enableFreeMonitoring()`](https://www.mongodb.com/docs/manual/reference/method/db.enableFreeMonitoring/#mongodb-method-db.enableFreeMonitoring). 更多细节在 [蒙哥什-300 。](https://jira.mongodb.org/browse/MONGOSH-300)
- 记录和分析辅助方法实现（例如，[`db.setLogLevel()`](https://www.mongodb.com/docs/manual/reference/method/db.setLogLevel/#mongodb-method-db.setLogLevel)). 更多细节在[蒙戈什-299 。](https://jira.mongodb.org/browse/MONGOSH-299)
- 原始命令执行方法助手（例如 [`db.listCommands()`](https://www.mongodb.com/docs/manual/reference/method/db.listCommands/#mongodb-method-db.listCommands)). 更多细节在 [蒙戈什-301 。](https://jira.mongodb.org/browse/MONGOSH-301)
- 服务器统计命令，例如[`db.serverBuildInfo()`](https://www.mongodb.com/docs/manual/reference/method/db.serverBuildInfo/#mongodb-method-db.serverBuildInfo)和 [`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus). 更多细节在 [蒙戈什-304 。](https://jira.mongodb.org/browse/MONGOSH-304)
- 批量 API 支持。详情在[蒙哥什-296 。](https://jira.mongodb.org/browse/MONGOSH-296)

### Bug修复

- 凭据现在已在日志记录和历史记录中正确编辑。

## 过去的版本

有关过去版本的信息，请参阅 [GitHub 上的 mongosh 版本。](https://github.com/mongodb-js/mongosh/releases)







翻译：韩鹏帅

原文：[Release Notes](https://www.mongodb.com/docs/mongodb-shell/changelog/)