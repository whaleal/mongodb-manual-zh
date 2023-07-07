# 2.6 更改日志

### 2.6.12 更改日志

#### 安全

[服务器-19284](https://jira.mongodb.org/browse/SERVER-19284)不应该能够创建与内置角色同名的角色

#### 分片

- [服务器-17886](https://jira.mongodb.org/browse/SERVER-17886)dbKillCursors op在日志级别3时断言mongos
- [服务器-19266](https://jira.mongodb.org/browse/SERVER-19266)返回一个错误文档，并设置结果
- [服务器-20191](https://jira.mongodb.org/browse/SERVER-20191)多更新/删除可以连续查询跳过碎片版本检查
- [服务器-20839](https://jira.mongodb.org/browse/SERVER-20839)trace_missing_docs_test.js使用mongo shell中的<运算符比较时间戳实例

#### 查询

- [服务器-2454](https://jira.mongodb.org/browse/SERVER-2454)在生成期间被杀死的查询应向用户返回错误，而不是部分结果集
- [服务器-16042](https://jira.mongodb.org/browse/SERVER-16042)优化$all/$，并选择最小的子集作为初始索引边界
- [服务器-19725](https://jira.mongodb.org/browse/SERVER-19725)QueryPlanner::plan with $near运算符中的NULL指针崩溃
- [服务器-20083](https://jira.mongodb.org/browse/SERVER-20083)在默认日志级别添加日志语句，用于何时成功设置或清除索引过滤器
- [服务器-20829](https://jira.mongodb.org/browse/SERVER-20829)RUNNER_DEAD在_id更新期间删除文档或查找_id
- [服务器-21227](https://jira.mongodb.org/browse/SERVER-21227)MultiPlanStage::invalidate()不应标记和删除无效的WorkingSetMembers
- [服务器-21602](https://jira.mongodb.org/browse/SERVER-21602)减少cursor_timeout.js的执行时间
- [服务器-22195](https://jira.mongodb.org/browse/SERVER-22195)queryoptimizer3.js在2.6上失败
- [服务器-22535](https://jira.mongodb.org/browse/SERVER-22535)在活动迁移期间收集的一些索引操作（删除索引、中止索引构建、更新TTL配置）可能会导致迁移跳过文档

#### 写入操作

[服务器-21647](https://jira.mongodb.org/browse/SERVER-21647)$rename更改字段排序

#### 储存

[服务器-21543](https://jira.mongodb.org/browse/SERVER-21543)在删除旧日志文件之前延长延迟

#### MMAP

- [服务器-22261](https://jira.mongodb.org/browse/SERVER-22261)MMAPv1 LSNFile可能会在同步到数据文件之前更新

#### 运营

[服务器-13985](https://jira.mongodb.org/browse/SERVER-13985)printShardingStatus使用组/JS

#### 构建和包装

- [服务器-18432](https://jira.mongodb.org/browse/SERVER-18432)发送未使用的变量到scons时发出警报
- [服务器-18793](https://jira.mongodb.org/browse/SERVER-18793)企业RPM构建问题
- [服务器-19509](https://jira.mongodb.org/browse/SERVER-19509)nproc ulimits在不同软件包之间是不同的
- [服务器-20583](https://jira.mongodb.org/browse/SERVER-20583)在常青中迁移所有windows-64 vs2010构建器，以使用新版本的发行版
- [服务器-20830](https://jira.mongodb.org/browse/SERVER-20830)设置推送和docs_tickets任务不可用补丁测试
- [服务器-21864](https://jira.mongodb.org/browse/SERVER-21864)简化工件签名程序，以支持连贯的发布过程

#### 内部人员

- [服务器-20121](https://jira.mongodb.org/browse/SERVER-20121)XorShift PRNG应该使用无符号算术
- [服务器-20401](https://jira.mongodb.org/browse/SERVER-20401)公开公开net.ssl.disabled协议

### 2.6.11 - 更改

#### 查询

- [服务器-19553](https://jira.mongodb.org/browse/SERVER-19553) [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)不应该使用`sayPiggyBack`发送`killCursor`消息
- [服务器-18620](https://jira.mongodb.org/browse/SERVER-18620)减少“`staticYield can't unlock`”日志消息的频率
- [服务器-18461](https://jira.mongodb.org/browse/SERVER-18461)应涵盖与BinData值比较的范围谓词，但不在2.6中
- [服务器-17815](https://jira.mongodb.org/browse/SERVER-17815)计划排名平局断路器计算不正确
- [服务器-16265](https://jira.mongodb.org/browse/SERVER-16265)在分析器中添加查询详细信息以获取更多条目，并[`db.currentOp()`](https://www.mongodb.com/docs/upcoming/reference/method/db.currentOp/#mongodb-method-db.currentOp)
- [服务器-15217](https://jira.mongodb.org/browse/SERVER-15217)v2.6查询计划排名测试“`NonCoveredIxisectFetchesLess`”依赖于已删除的记录列表的顺序
- [服务器-14070](https://jira.mongodb.org/browse/SERVER-14070)如果在排序字段上给出等式谓词，复合索引不提供排序

#### 复制                                                                                  

- [服务器-18280](https://jira.mongodb.org/browse/SERVER-18280) `ReplicaSetMonitor`应该使用`electionId`来避免与旧的初选交谈
- [服务器-18795](https://jira.mongodb.org/browse/SERVER-18795)[`db.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/db.printSlaveReplicationInfo/#mongodb-method-db.printSlaveReplicationInfo)/[`rs.printSlaveReplicationInfo()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.printSlaveReplicationInfo/#mongodb-method-rs.printSlaveReplicationInfo)无法使用`ARBITER`角色

#### 分片

- [服务器-19464](https://jira.mongodb.org/browse/SERVER-19464) [`$sort`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)聚合阶段不调用作用域连接完成（）
- [服务器-18955](https://jira.mongodb.org/browse/SERVER-18955) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)如果先执行，则不会在 getMore 上设置批处理大小（并保留旧的，0）`_cursor->more()`

#### 索引

- [服务器-19559](https://jira.mongodb.org/browse/SERVER-19559)“密钥太大”文档的文档增长使其从索引中消失
- [服务器-16348](https://jira.mongodb.org/browse/SERVER-16348)`Assertion failure n >= 0 && n < static_cast<int>(_files.size()) src/mongo/db/storage/extent_manager.cpp 109`
- [服务器-13875](https://jira.mongodb.org/browse/SERVER-13875) [`ensureIndex()`](https://www.mongodb.com/docs/upcoming/reference/method/db.collection.ensureIndex/#mongodb-method-db.collection.ensureIndex)`2dsphere`索引在升级到2.6后中断（使用新的`createIndex`命令）

#### 网络

[服务器-19389](https://jira.mongodb.org/browse/SERVER-19389)移除电线水平端度检查

#### 构建和测试

- [服务器-18097](https://jira.mongodb.org/browse/SERVER-18097)从`evergreen.yml`
- [服务器-18068](https://jira.mongodb.org/browse/SERVER-18068)覆盖率分析缺陷72413：资源泄漏
- [服务器-18371](https://jira.mongodb.org/browse/SERVER-18371)添加SSL库配置检测

### 2.6.10 - 更改

#### 安全

- [服务器-18312](https://jira.mongodb.org/browse/SERVER-18312)将PCRE升级到最新版本
- [服务器-17812](https://jira.mongodb.org/browse/SERVER-17812)LockPinger有与审计相关的GLE故障
- [服务器-17647](https://jira.mongodb.org/browse/SERVER-17647)在v8中计算BinData长度
- [服务器-17591](https://jira.mongodb.org/browse/SERVER-17591)添加SSL标志以选择支持的协议
- [服务器-16849](https://jira.mongodb.org/browse/SERVER-16849)在mongos上，即使没有更改用户定义，我们总是使用户缓存无效一次
- [服务器-11980](https://jira.mongodb.org/browse/SERVER-11980)改进了mongos上的用户缓存无效执行

#### 查询

- [服务器-18364](https://jira.mongodb.org/browse/SERVER-18364)确保选择非负谓词而不是多键索引边界构造的否定谓词
- [服务器-17815](https://jira.mongodb.org/browse/SERVER-17815)计划排名平局断路器计算不正确
- [服务器-16256](https://jira.mongodb.org/browse/SERVER-16256)带有elemMatch的$all子句使用比需要更广泛的界限

#### 复制

- [服务器-18211](https://jira.mongodb.org/browse/SERVER-18211)MongoDB未能正确回滚集合创建
- [服务器-17771](https://jira.mongodb.org/browse/SERVER-17771)重新配置副本集以删除节点会导致2.6.8上的分割错误
- [服务器-13542](https://jira.mongodb.org/browse/SERVER-13542)在伊斯马斯特的初选中公开选举ID

#### 分片

- [服务器-17812](https://jira.mongodb.org/browse/SERVER-17812)LockPinger有与审计相关的GLE故障
- [服务器-17805](https://jira.mongodb.org/browse/SERVER-17805)logOp / OperationObserver应始终检查shardversion
- [服务器-17749](https://jira.mongodb.org/browse/SERVER-17749) [`collMod`](https://www.mongodb.com/docs/upcoming/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod) `usePowerOf2Sizes`失败了[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)
- [服务器-11980](https://jira.mongodb.org/browse/SERVER-11980)改进用户缓存无效执行[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)

#### 储存

- [服务器-18211](https://jira.mongodb.org/browse/SERVER-18211)MongoDB未能正确回滚集合创建
- [服务器-17653](https://jira.mongodb.org/browse/SERVER-17653)错误：套接字XXX高于1023；2.6不支持。*

#### 索引

[服务器-17018](https://jira.mongodb.org/browse/SERVER-17018) Assertion failure false`src/mongo/db/structure/btree/key.cpp` Line 433 on remove operation

#### 写操作

- [服务器-18111](https://jira.mongodb.org/browse/SERVER-18111) [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)允许用户插入`system.profile`集合
- [服务器-13542](https://jira.mongodb.org/browse/SERVER-13542)在初选中曝光`electionId``isMaster`

#### 网络

- [服务器-18096](https://jira.mongodb.org/browse/SERVER-18096)分片主服务器在放弃和重新选择后错误地重复使用封闭的套接字
- [服务器-17591](https://jira.mongodb.org/browse/SERVER-17591)添加SSL标志以选择支持的协议

#### 构建和包装

- [服务器-18344](https://jira.mongodb.org/browse/SERVER-18344)日志应发送到更新的日志管理器服务器
- [服务器-18082](https://jira.mongodb.org/browse/SERVER-18082)将soke.py buildlogger命令行选项更改为环境变量
- [服务器-18312](https://jira.mongodb.org/browse/SERVER-18312)将PCRE升级到最新版本
- [服务器-17780](https://jira.mongodb.org/browse/SERVER-17780)与文档相比，Init脚本将进程限制设置为不同的值
- [服务器-16563](https://jira.mongodb.org/browse/SERVER-16563)Debian repo组件不匹配 - mongodb/10gen

#### shell

[服务器-17951](https://jira.mongodb.org/browse/SERVER-17951)db.currentOp()在读取首选项设置下失败

#### 测试

- [服务器-18262](https://jira.mongodb.org/browse/SERVER-18262)setup_multiversion_mongodb应该在超时重试链接下载
- [服务器-18229](https://jira.mongodb.org/browse/SERVER-18229) `smoke.py`使用PyMongo 3.0.1无法运行某些测试
- [服务器-18073](https://jira.mongodb.org/browse/SERVER-18073)修复`smoke.py`与PyMongo 3.0配合使用

### 2.6.9 - 更改

#### 安全

[服务器-16073](https://jira.mongodb.org/browse/SERVER-16073)创建隐藏的`net.ssl.sslCipherConfig`标志

#### 查询

- [服务器-14723](https://jira.mongodb.org/browse/SERVER-14723)具有多个`2dsphere`索引的`geoNear`命令查询规划期间的崩溃
- [服务器-14071](https://jira.mongodb.org/browse/SERVER-14071)对于使用[`sort()`](https://www.mongodb.com/docs/upcoming/reference/method/cursor.sort/#mongodb-method-cursor.sort)的查询，如果结果为零，则可以缓存糟糕的非阻塞计划
- [服务器-8188](https://jira.mongodb.org/browse/SERVER-8188)可配置的空闲光标超时

#### 复制和分片

- [服务器-17429](https://jira.mongodb.org/browse/SERVER-17429)由于数据陈旧而更改同步目标时记录的消息应以一致的方式格式化OpTimes
- [服务器-17441](https://jira.mongodb.org/browse/SERVER-17441) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)在“不是主”错误后立即崩溃

#### 储存

[服务器-15907](https://jira.mongodb.org/browse/SERVER-15907)运行时使用`ftruncate`而不是`fallocate``tmpfs`

#### 聚合框架

- [服务器-17426](https://jira.mongodb.org/browse/SERVER-17426)`_id`的聚合框架查询在分片集群（孤儿文档）中返回重复项
- [服务器-17224](https://jira.mongodb.org/browse/SERVER-17224)具有64MB文档的聚合管道可以终止服务器

#### 构建和平台

- [服务器-17484](https://jira.mongodb.org/browse/SERVER-17484)将服务器MCI配置迁移到服务器回购协议
- [服务器-17252](https://jira.mongodb.org/browse/SERVER-17252)将PCRE版本从8.30升级到最新版本

#### 诊断和内部代码

- [服务器-17226](https://jira.mongodb.org/browse/SERVER-17226) [`top`](https://www.mongodb.com/docs/upcoming/reference/command/top/#mongodb-dbcommand-dbcmd.top)具有64MB结果文档的命令可以终止服务器
- [服务器-17338](https://jira.mongodb.org/browse/SERVER-17338)在对降级2.6主运行`copydb`时，NULL指针崩溃
- [服务器-14992](https://jira.mongodb.org/browse/SERVER-14992)查询Windows 7文件分配修复和其他修复程序

### 2.6.8 - 更改

#### 安全性和联网

- [服务器-17278](https://jira.mongodb.org/browse/SERVER-17278)BSON BinData验证执行
- [服务器-17022](https://jira.mongodb.org/browse/SERVER-17022)不得尊重任何SSL会话缓存
- [服务器-17264](https://jira.mongodb.org/browse/SERVER-17264)改进bson验证

#### 查询和聚合

- [服务器-16655](https://jira.mongodb.org/browse/SERVER-16655)如果地理谓词是[`$or`](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)子句的根，则无法使用复合2dsphere索引
- [服务器-16527](https://jira.mongodb.org/browse/SERVER-16527) `2dsphere`解释`nscanned`的报告“工作”&`nscannedObjects`
- [服务器-15802](https://jira.mongodb.org/browse/SERVER-15802)查询优化器应始终使用相等谓词而不是唯一索引
- [服务器-14044](https://jira.mongodb.org/browse/SERVER-14044)聚合[`$sort`](https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort)错误消息中的`{$meta: 'text'}`引用不正确

#### 复制

- [服务器-16599](https://jira.mongodb.org/browse/SERVER-16599) `copydb`如果主步骤关闭，`clone`命令可能会崩溃服务器
- [服务器-16315](https://jira.mongodb.org/browse/SERVER-16315)复制集节点不应威胁要否决配置版本高于其自身的节点
- [服务器-16274](https://jira.mongodb.org/browse/SERVER-16274) secondary `fasserts` trying to replicate an index
- [服务器-15471](https://jira.mongodb.org/browse/SERVER-15471)当找不到副本时，更好的错误消息`GhostSync::associateSlave`

#### 分片

- [服务器-17191](https://jira.mongodb.org/browse/SERVER-17191)分片集群升级期间的虚假警告
- [服务器-17163](https://jira.mongodb.org/browse/SERVER-17163)致命错误“logOp但不是主要”`MigrateStatus::go`
- [服务器-16984](https://jira.mongodb.org/browse/SERVER-16984) `UpdateLifecycleImpl`即使`ns`被分片，也可以返回空`collectionMetadata`
- [服务器-10904](https://jira.mongodb.org/browse/SERVER-10904)即使使用主读取pref，`_master`和`_slaveConn`也可能指向不同的连接

#### 储存

- [服务器-17087](https://jira.mongodb.org/browse/SERVER-17087)将listCollections命令功能添加到2.6 shell和客户端
- [服务器-14572](https://jira.mongodb.org/browse/SERVER-14572)增加C运行时stdio文件限制

#### 工具

- [服务器-17216](https://jira.mongodb.org/browse/SERVER-17216)2.6[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat)不能与3.0一起使用[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)
- [服务器-14190](https://jira.mongodb.org/browse/SERVER-14190) [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore) `parseMetadataFile`将非空终止字符串传递给'`fromjson`'

#### 构建和包装

- [服务器-14803](https://jira.mongodb.org/browse/SERVER-14803)支持非Linux版本的静态libstdc++构建
- [服务器-15400](https://jira.mongodb.org/browse/SERVER-15400)使用vcredist和依赖的dll创建Windows企业zip文件

#### 可用性

[服务器-14756](https://jira.mongodb.org/browse/SERVER-14756)找不到YAML `storage.quota.enforced`选项

#### 测试

[服务器-16421](https://jira.mongodb.org/browse/SERVER-16421) `sharding_rs2.js`应该清理所有副本的数据

### 2.6.7 - 更改

#### 稳定

- [服务器-16237](https://jira.mongodb.org/browse/SERVER-16237)如果主服务器停机，请不要检查碎片版本

#### 查询

- [服务器-16408](https://jira.mongodb.org/browse/SERVER-16408) `max_time_ms.js`不应在并行套件中运行。

#### 复制

- [服务器-16732](https://jira.mongodb.org/browse/SERVER-16732) `SyncSourceFeedback::replHandshake()`在某些情况下，可能会从`std::map`中非法擦除

#### 分片

- [服务器-16683](https://jira.mongodb.org/browse/SERVER-16683)当碎片有多个标签时，减少mongos的内存占用
- [服务器-15766](https://jira.mongodb.org/browse/SERVER-15766)prefix_shard_key.js取决于对特定碎片的主分配
- [服务器-14306](https://jira.mongodb.org/browse/SERVER-14306) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)通过请求超过需要的结果，可能会导致碎片达到内存排序限制。

#### 包装

- [服务器-16081](https://jira.mongodb.org/browse/SERVER-16081) `/etc/init.d/mongod`启动脚本失败，带有dirname消息

### 2.6.6 - 更改

#### 安全

- [服务器-15673](https://jira.mongodb.org/browse/SERVER-15673)禁用SSLv3密码
- [服务器-15515](https://jira.mongodb.org/browse/SERVER-15515)混合版本replSet的新测试，2.4主，用户更新
- [服务器-15500](https://jira.mongodb.org/browse/SERVER-15500)system.user操作的新测试

#### 稳定

- [服务器-12061](https://jira.mongodb.org/browse/SERVER-12061)同步副本集节点时，不要默默忽略读取错误
- [服务器-12058](https://jira.mongodb.org/browse/SERVER-12058)如果在编写操作日志时遇到问题，主部分应该中止

#### 查询

- [服务器-16291](https://jira.mongodb.org/browse/SERVER-16291)无法在辅助上设置/列出/清除索引过滤器
- [服务器-15958](https://jira.mongodb.org/browse/SERVER-15958)聚合解释计划输出中的“isMultiKey”值不正确
- [服务器-15899](https://jira.mongodb.org/browse/SERVER-15899)在包含带有嵌套数组的长子文档数组的文档中对路径进行查询会导致堆栈溢出
- [服务器-15696](https://jira.mongodb.org/browse/SERVER-15696) [`$regex`](https://www.mongodb.com/docs/upcoming/reference/operator/query/regex/#mongodb-query-op.-regex)，[`$in`](https://www.mongodb.com/docs/upcoming/reference/operator/query/in/#mongodb-query-op.-in)和[`$sort`](https://www.mongodb.com/docs/upcoming/reference/operator/update/sort/#mongodb-update-up.-sort)与索引返回的结果太多
- [服务器-15639](https://jira.mongodb.org/browse/SERVER-15639)当在同一文本索引前缀字段上给出多个谓词时，文本查询可能会返回错误的结果并泄漏内存
- [服务器-15580](https://jira.mongodb.org/browse/SERVER-15580)在同一集合上并发写入评估候选查询计划可能会崩溃[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)
- [服务器-15528](https://jira.mongodb.org/browse/SERVER-15528)不同的查询可以扫描许多索引键，而不会产生读取锁
- [服务器-15485](https://jira.mongodb.org/browse/SERVER-15485)CanonicalQuery::canonicalize可以泄露LiteParsedQuery
- [服务器-15403](https://jira.mongodb.org/browse/SERVER-15403) `$min`和`$max`等于2.6的误差，但2.4中的误差不等
- [服务器-15233](https://jira.mongodb.org/browse/SERVER-15233)无法在辅助上运行`planCacheListQueryShapes`
- [服务器-14799](https://jira.mongodb.org/browse/SERVER-14799) [`count`](https://www.mongodb.com/docs/upcoming/reference/command/count/#mongodb-dbcommand-dbcmd.count)当提示是文档时，提示不起作用

#### 复制

- [服务器-16107](https://jira.mongodb.org/browse/SERVER-16107)2.6 当添加到具有>= 12个节点的2.8副本集中时，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)会与segfault一起崩溃。
- [服务器-15994](https://jira.mongodb.org/browse/SERVER-15994) `listIndexes`和`listCollections`可以在没有s slaveOk位的次要服务器上运行
- [服务器-15849](https://jira.mongodb.org/browse/SERVER-15849)对于不再是副本集一部分的节点，不要转发复制进度
- [服务器-15491](https://jira.mongodb.org/browse/SERVER-15491) `SyncSourceFeedback`可能会因aSocketException而崩溃`authenticateInternalUser`

#### 分片

- [服务器-15318](https://jira.mongodb.org/browse/SERVER-15318) `copydb`使用时不应使用排气标志[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)
- [服务器-14728](https://jira.mongodb.org/browse/SERVER-14728)碎片取决于副本集连接字符串的字符串比较
- [服务器-14506](https://jira.mongodb.org/browse/SERVER-14506)特殊的顶部块逻辑可以将最大块移动到标签不兼容的碎片上
- [服务器-14299](https://jira.mongodb.org/browse/SERVER-14299)对于带有排序的分片limit=N查询，mongos可以从shard请求>N结果
- [服务器-14080](https://jira.mongodb.org/browse/SERVER-14080)在更改日志中正确报告迁移结果
- [服务器-12472](https://jira.mongodb.org/browse/SERVER-12472)如果TO碎片上需要索引并且存在数据，则无法移动Chunk

#### 储存

- [服务器-16283](https://jira.mongodb.org/browse/SERVER-16283)无法在数据目录中使用日志文件或配置文件启动新的Wiredtiger节点-错误检测旧`mmapv1`文件
- [服务器-15986](https://jira.mongodb.org/browse/SERVER-15986)从同一dbpath中的不同存储引擎开始，应该会出错/警告
- [服务器-14057](https://jira.mongodb.org/browse/SERVER-14057)使用collMod更改TTL到期时间无法正确更新索引定义

#### 索引和写入操作

- [服务器-14287](https://jira.mongodb.org/browse/SERVER-14287)确保索引可以中止重新索引并丢失索引
- [服务器-14886](https://jira.mongodb.org/browse/SERVER-14886)根据由数组索引符号和位置运算符组成的路径的更新失败并出错

#### 数据聚合

[服务器-15552](https://jira.mongodb.org/browse/SERVER-15552)在[`mapReduce`](https://www.mongodb.com/docs/upcoming/reference/command/mapReduce/#mongodb-dbcommand-dbcmd.mapReduce)命令执行期间写入临时集合时出错应该是致命的

#### 构建和包装

- [服务器-14184](https://jira.mongodb.org/browse/SERVER-14184)OS X Yosemite上s2冲突中未使用的预处理器宏
- [服务器-14015](https://jira.mongodb.org/browse/SERVER-14015)S2关于GCC 4.9/Solaris的汇编失败
- [服务器-16017](https://jira.mongodb.org/browse/SERVER-16017)由于未满足的依赖项，Suse11企业软件包失败
- [服务器-15598](https://jira.mongodb.org/browse/SERVER-15598)Ubuntu 14.04 企业软件包依赖于不可用的libsnmp15软件包
- [服务器-13595](https://jira.mongodb.org/browse/SERVER-13595)Red Hat init.d脚本错误：YAML配置文件解析

#### 记录和诊断

- [服务器-13471](https://jira.mongodb.org/browse/SERVER-13471)提高地图/减少中“did reduceInMemory”消息的日志级别
- [服务器-16324](https://jira.mongodb.org/browse/SERVER-16324)命令执行日志行显示“`query not recording (too large)`”而不是缩写的命令对象
- [服务器-10069](https://jira.mongodb.org/browse/SERVER-10069)改进errorcodes.py，以便捕获多行消息

#### 测试和内部

- [服务器-15632](https://jira.mongodb.org/browse/SERVER-15632)`MultiHostQueryOp::PendingQueryContext::doBlockingQuery`可以泄漏光标对象
- [服务器-15629](https://jira.mongodb.org/browse/SERVER-15629) `GeoParser::parseMulti{Line|Polygon}`不会清除out参数所拥有的对象
- [服务器-16316](https://jira.mongodb.org/browse/SERVER-16316)删除shard3.js中不受支持的行为
- [服务器-14763](https://jira.mongodb.org/browse/SERVER-14763)更新 jstests/sharding/split_large_key.js
- [服务器-14249](https://jira.mongodb.org/browse/SERVER-14249)使用--dbpath通过mongodump添加查询oplog的测试
- [服务器-13726](https://jira.mongodb.org/browse/SERVER-13726)indexbg_drop.js

### 2.6.5 - 更改

#### 安全

* [服务器-15465](https://jira.mongodb.org/browse/SERVER-15465)OpenSSL在降级时崩溃

- [服务器-15360](https://jira.mongodb.org/browse/SERVER-15360)对2.4主文档进行更改并复制到2.6次要文档，不要使2.6次要使其用户缓存无效
- [服务器-14887](https://jira.mongodb.org/browse/SERVER-14887)允许用户对2.4主文档所做的更改复制到2.6次要
- [服务器-14727](https://jira.mongodb.org/browse/SERVER-14727)SASL故障的详细信息没有记录
- [服务器-12551](https://jira.mongodb.org/browse/SERVER-12551)审计DML/CRUD操作

#### 稳定

[服务器-9032](https://jira.mongodb.org/browse/SERVER-9032)mongod在配置错误的区域设置下启动时失败

#### 查询

- [服务器-15287](https://jira.mongodb.org/browse/SERVER-15287)查询规划器排序分析错误地允许索引键模式插件字段提供排序
- [服务器-15286](https://jira.mongodb.org/browse/SERVER-15286)当相反方向排序和双“或”过滤时，日期索引中的断言
- [服务器-15279](https://jira.mongodb.org/browse/SERVER-15279)默认情况下禁用基于哈希的索引交集（AND_HASH）
- [服务器-15152](https://jira.mongodb.org/browse/SERVER-15152)在评估计划时，一些索引候选人会导致完整的索引扫描
- [服务器-15015](https://jira.mongodb.org/browse/SERVER-15015)结合`$max`和`$min`以及反向索引扫描时断言失败
- [服务器-15012](https://jira.mongodb.org/browse/SERVER-15012)服务器在索引根$或使用2d索引的查询上崩溃
- [服务器-14969](https://jira.mongodb.org/browse/SERVER-14969)在活动聚合操作期间删除索引可能会崩溃服务器
- [服务器-14961](https://jira.mongodb.org/browse/SERVER-14961)如果谓词生成空范围索引扫描，Plan ranker倾向于交叉计划
- [服务器-14892](https://jira.mongodb.org/browse/SERVER-14892)无效`{$elemMatch: {$where}}`查询导致内存泄漏
- [服务器-14706](https://jira.mongodb.org/browse/SERVER-14706)当该字段上存在索引时，在字段上使用否定的$type谓词的查询可能会返回不完整的结果
- [服务器-13104](https://jira.mongodb.org/browse/SERVER-13104)计划枚举器不会枚举嵌套的所有可能性[`$or`](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)
- [服务器-14984](https://jira.mongodb.org/browse/SERVER-14984)`NaN`半径运行[`$centerSphere`](https://www.mongodb.com/docs/upcoming/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere)查询时服务器中止
- [服务器-14981](https://jira.mongodb.org/browse/SERVER-14981)在对`2dsphere`索引进行查询时，服务器中止`coarsestIndexedLevel:0`
- [服务器-14831](https://jira.mongodb.org/browse/SERVER-14831)当仅使用`textIndexVersion=1`中仅支持默认语言时，文本搜索会触发断言

#### 复制

- [服务器-15038](https://jira.mongodb.org/browse/SERVER-15038)多个后台索引构建可能不会在次要命令上干净地中断
- [服务器-14887](https://jira.mongodb.org/browse/SERVER-14887)允许用户对2.4主文档所做的更改复制到2.6次要
- [服务器-14805](https://jira.mongodb.org/browse/SERVER-14805)在初始同步期间使用多线程操作日志重播

#### 分片

- [服务器-15056](https://jira.mongodb.org/browse/SERVER-15056)设置错误上的分片连接清理可能会崩溃mongos
- [服务器-13702](https://jira.mongodb.org/browse/SERVER-13702)没有可选查询的命令可能会针对mongos上的错误碎片
- [服务器-15156](https://jira.mongodb.org/browse/SERVER-15156)MongoDB升级2.4至2.6检查返回错误`config.changelog collection`

#### 储存

- [服务器-15369](https://jira.mongodb.org/browse/SERVER-15369)创建时显式零.ns文件
- [服务器-15319](https://jira.mongodb.org/browse/SERVER-15319)验证2.8自由名单是否升级-降级安全，2.6
- [服务器-15111](https://jira.mongodb.org/browse/SERVER-15111)部分写入的日记最后一节导致恢复失败

#### 索引

- [服务器-14848](https://jira.mongodb.org/browse/SERVER-14848)将`index_id_desc.js`端口到v2.6和主分支
- [服务器-14205](https://jira.mongodb.org/browse/SERVER-14205)确保索引故障报告`ok: 1`关于一些故障

#### 写入操作

- [服务器-15106](https://jira.mongodb.org/browse/SERVER-15106)2.6.4分析器或缓慢查询日志中idhack更新的nscanned和nscannedObjects不正确
- [服务器-15029](https://jira.mongodb.org/browse/SERVER-15029)[`$rename`](https://www.mongodb.com/docs/upcoming/reference/operator/update/rename/#mongodb-update-up.-rename)修饰符使用错误的虚线源路径
- [服务器-14829](https://jira.mongodb.org/browse/SERVER-14829) `UpdateIndexData::clear()`应该重置所有成员变量

#### 数据聚合

- [服务器-15087](https://jira.mongodb.org/browse/SERVER-15087)运行并发mapReduce和dropDatabase命令时服务器崩溃
- [服务器-14969](https://jira.mongodb.org/browse/SERVER-14969)在活动聚合操作期间删除索引可能会崩溃服务器
- [服务器-14168](https://jira.mongodb.org/browse/SERVER-14168)当增量MR集合在次要集合上失败时记录的警告

#### 包装

- [服务器-14679](https://jira.mongodb.org/browse/SERVER-14679)（CentOS 7/RHEL 7）如果`pid`文件丢失，`init.d`脚本应为其创建目录
- [服务器-14023](https://jira.mongodb.org/browse/SERVER-14023)支持RHEL 7 Enterprise `.rpm`软件包
- [服务器-13243](https://jira.mongodb.org/browse/SERVER-13243)支持Ubuntu 14“Trusty”企业`.deb`软件包
- [服务器-11077](https://jira.mongodb.org/browse/SERVER-11077)支持Debian 7 Enterprise `.deb`软件包
- [服务器-10642](https://jira.mongodb.org/browse/SERVER-10642)为SUSE 11生成社区和企业软件包

#### 记录和诊

* [服务器-14964](https://jira.mongodb.org/browse/SERVER-14964)nscaned不会写入logLevel 1的日志，除非超过慢毫秒数或启用了性能分析

- [服务器-12551](https://jira.mongodb.org/browse/SERVER-12551)审计DML/CRUD操作
- [服务器-14904](https://jira.mongodb.org/browse/SERVER-14904)在`tool/exportimport_date.js`中调整日期，以考虑不同的时区

#### 内部代码和测试

- [服务器-13770](https://jira.mongodb.org/browse/SERVER-13770) `Helpers::removeRange`应该检查所有跑步状态
- [服务器-14284](https://jira.mongodb.org/browse/SERVER-14284)jstests不应在测试运行结束时启用分析器
- [服务器-14076](https://jira.mongodb.org/browse/SERVER-14076)删除测试`replset_remove_node.js`
- [服务器-14778](https://jira.mongodb.org/browse/SERVER-14778)为原生注入的v8函数隐藏函数和数据指针

### 2.6.4 - 更改

#### 安全

- [服务器-14701](https://jira.mongodb.org/browse/SERVER-14701)“备份”身份验证角色应允许为所有资源运行“collstats”命令
- [服务器-14518](https://jira.mongodb.org/browse/SERVER-14518)允许禁用SSL的主机名验证
- [服务器-14268](https://jira.mongodb.org/browse/SERVER-14268)潜在的信息泄露
- [服务器-14170](https://jira.mongodb.org/browse/SERVER-14170)如果在分片集群中同时启用审计和身份验证，则无法从辅助读取
- [服务器-13833](https://jira.mongodb.org/browse/SERVER-13833)userAdminAnyDatabase角色应该能够在admin.system.users和admin.system.roles上创建索引
- [服务器-12512](https://jira.mongodb.org/browse/SERVER-12512)添加基于角色的选择性审计日志记录。
- [服务器-9482](https://jira.mongodb.org/browse/SERVER-9482)为sslFIPSMode添加构建标志

#### 查询

- [服务器-14625](https://jira.mongodb.org/browse/SERVER-14625)查询规划器可以在$elemMatch中为否定构建不正确的边界
- [服务器-14607](https://jira.mongodb.org/browse/SERVER-14607)获取和非获取数据的哈希交集可以丢弃结果中的数据
- [服务器-14532](https://jira.mongodb.org/browse/SERVER-14532)改善计划兰克关系的日志记录
- [服务器-14350](https://jira.mongodb.org/browse/SERVER-14350)当$centerSphere具有非正半径时，服务器崩溃
- [服务器-14317](https://jira.mongodb.org/browse/SERVER-14317)IDHackRunner中的死代码::applyProjection
- [服务器-14311](https://jira.mongodb.org/browse/SERVER-14311)跳过索引键在索引扫描阶段的计划排名中没有考虑
- [服务器-14123](https://jira.mongodb.org/browse/SERVER-14123)一些操作可以创建大于16MB限制的BSON对象
- [服务器-14034](https://jira.mongodb.org/browse/SERVER-14034)具有大量元素的排序$in查询无法使用合并排序
- [服务器-13994](https://jira.mongodb.org/browse/SERVER-13994)不要积极地预取并行CollectionScan的数据

#### 复制

- [服务器-14665](https://jira.mongodb.org/browse/SERVER-14665)由于访问违规读取_me，在 closeall.js 中为 v2.6 构建失败
- [服务器-14505](https://jira.mongodb.org/browse/SERVER-14505)当索引构建进行断言失败时，无法删除AllIndexes
- [服务器-14494](https://jira.mongodb.org/browse/SERVER-14494)在活动背景索引期间删除收集，构建在辅助触发器segfault上
- [服务器-13822](https://jira.mongodb.org/browse/SERVER-13822)在加载replset配置之前运行resync可能会崩溃[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)
- [服务器-11776](https://jira.mongodb.org/browse/SERVER-11776)复制“自我”检查应允许映射端口

#### 分片

- [服务器-14551](https://jira.mongodb.org/browse/SERVER-14551)迁移清理期间的跑步者产量（removeRange）导致法塞特
- [服务器-14431](https://jira.mongodb.org/browse/SERVER-14431)在太大的密钥上拆分后，块数据无效
- [服务器-14261](https://jira.mongodb.org/browse/SERVER-14261)在迁移范围删除期间降级可以中止[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)
- [服务器-14032](https://jira.mongodb.org/browse/SERVER-14032)v2.6 [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)无法验证配置服务器上端存在_id
- [服务器-13648](https://jira.mongodb.org/browse/SERVER-13648)来自移民清理的更好统计数据
- [服务器-12750](https://jira.mongodb.org/browse/SERVER-12750) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)不应接受设置“排气”标志的初始查询
- [服务器-9788](https://jira.mongodb.org/browse/SERVER-9788) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)一旦选择了有效的副本集成员，不会重新评估读取首选项
- [服务器-9526](https://jira.mongodb.org/browse/SERVER-9526)当碎片密钥类型为BinData时，有关块的日志消息信息不是很大

#### 储存

- [服务器-14198](https://jira.mongodb.org/browse/SERVER-14198)Std::set<pointer>和Windows堆分配重用产生非确定性结果
- [服务器-13975](https://jira.mongodb.org/browse/SERVER-13975)在名为“系统”的集合上创建索引可能会导致服务器中止
- [服务器-13729](https://jira.mongodb.org/browse/SERVER-13729)在Windows上分配数据文件期间，读写被阻止
- [服务器-13681](https://jira.mongodb.org/browse/SERVER-13681) [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)在Windows上背景刷新时B失速

#### 索引

[服务器-14494](https://jira.mongodb.org/browse/SERVER-14494)在活动背景索引期间删除收集，构建在辅助触发器segfault上

#### 写操作

- [服务器-14257](https://jira.mongodb.org/browse/SERVER-14257)如果启用了分析，“删除”命令可能会通过抛出未处理的异常来导致进程终止
- [服务器-14024](https://jira.mongodb.org/browse/SERVER-14024)当查询包含DBRef的一部分并导致插入时，更新失败（upsert:true）
- [服务器-13764](https://jira.mongodb.org/browse/SERVER-13764)调试机制报告不正确的nscanned / nscannedObjects进行更新

#### 网络

[服务器-13734](https://jira.mongodb.org/browse/SERVER-13734)从手柄中取下捕获物（...）IncomingMsg

#### 地理

- [服务器-14039](https://jira.mongodb.org/browse/SERVER-14039)带有2d索引、跳过和限制的$nearSphere查询返回不完整的结果
- [服务器-13701](https://jira.mongodb.org/browse/SERVER-13701)使用2d索引的查询在使用exper()时抛出异常

#### 文本搜索

- [服务器-14738](https://jira.mongodb.org/browse/SERVER-14738)更新带有文本索引字段的文档可能会导致错误的条目
- [服务器-14027](https://jira.mongodb.org/browse/SERVER-14027)如果存在通配符文本索引，在同一数据库中重命名集合将失败

#### 工具

- [服务器-14212](https://jira.mongodb.org/browse/SERVER-14212) [`mongorestore`](https://www.mongodb.com/docs/database-tools/mongorestore/#mongodb-binary-bin.mongorestore)可能会放弃系统用户和角色
- [服务器-14048](https://jira.mongodb.org/browse/SERVER-14048) [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)针对[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)不能将转储发送到标准输出

#### 管理

- [服务器-14556](https://jira.mongodb.org/browse/SERVER-14556) Default dbpath for [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) [`--configsvr`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#std-option-mongod.--configsvr) changes in 2.6
- [服务器-14355](https://jira.mongodb.org/browse/SERVER-14355)允许dbAdmin角色手动创建system.profile集合

#### 包装

[服务器-14283](https://jira.mongodb.org/browse/SERVER-14283)已安装配置文件中的参数已过时

#### JavaScript

- [服务器-14254](https://jira.mongodb.org/browse/SERVER-14254)不要将本机函数指针存储为函数原型中的属性
- [服务器-13798](https://jira.mongodb.org/browse/SERVER-13798)由于DBClient和光标对象的独立生命周期，v8垃圾收集可能会导致崩溃
- [服务器-13707](https://jira.mongodb.org/browse/SERVER-13707)转换无效正则表达式时，mongo shell可能会崩溃

#### shell

- [服务器-14341](https://jira.mongodb.org/browse/SERVER-14341)serverStatus中的负操作计数器值
- [服务器-14107](https://jira.mongodb.org/browse/SERVER-14107)查询包含Javascript或JavascriptWithScope类型值的文档会崩溃shell

#### 可用性

[服务器-13833](https://jira.mongodb.org/browse/SERVER-13833)userAdminAnyDatabase角色应该能够在admin.system.users和admin.system.roles上创建索引

#### 记录和诊断

- [服务器-12512](https://jira.mongodb.org/browse/SERVER-12512)添加基于角色的选择性审计日志记录。
- [服务器-14341](https://jira.mongodb.org/browse/SERVER-14341)serverStatus中的负操作计数器值

#### 测试

- [服务器-14731](https://jira.mongodb.org/browse/SERVER-14731)plan_cache_ties.js有时会失败
- [服务器-14147](https://jira.mongodb.org/browse/SERVER-14147)让index_multi.js重试连接失败
- [服务器-13615](https://jira.mongodb.org/browse/SERVER-13615)由于依赖操作柜台，sharding_rs2.js间歇性故障

### 2.6.3 - 更改

- [服务器-14302](https://jira.mongodb.org/browse/SERVER-14302)修复：“带有投影的`_id`上的平等查询可能不会在分片集合上返回任何结果”
- [服务器-14304](https://jira.mongodb.org/browse/SERVER-14304)修复：“在_id上使用投影对_id进行等式查询可能会在分片集合上返回孤立文档”

### 2.6.2 - 更改

*  [`backup`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-backup)授权角色现在包括运行[`collStats`](https://www.mongodb.com/docs/upcoming/reference/command/collStats/#mongodb-dbcommand-dbcmd.collStats) 命令的权限。
* [服务器-13804](https://jira.mongodb.org/browse/SERVER-13804)内置角色[`restore`](https://www.mongodb.com/docs/upcoming/reference/built-in-roles/#mongodb-authrole-restore)现在具有[`admin.system.roles`](https://www.mongodb.com/docs/upcoming/reference/system-collections/#mongodb-data-admin.system.roles)集合的特权。
* [服务器-13612](https://jira.mongodb.org/browse/SERVER-13612)修复了：“启用SSL的服务器似乎没有向客户端发送受支持的证书发行人列表”
* [服务器-13753](https://jira.mongodb.org/browse/SERVER-13753)修复：“如果x.509身份验证证书无效，[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)可能会终止”
* [服务器-13945](https://jira.mongodb.org/browse/SERVER-13945)对于[副本集/分片集群成员身份验证](https://www.mongodb.com/docs/upcoming/tutorial/configure-x509-member-authentication/#std-label-x509-internal-authentication)，现在按属性而不是子字符串比较匹配x.509集群证书。
* [服务器-13868](https://jira.mongodb.org/browse/SERVER-13868)现在将V1用户标记为没有代理用户文档的数据库。
* [服务器-13850](https://jira.mongodb.org/browse/SERVER-13850)现在，在使用它来确定用户在[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)上的用户管理命令中的角色之前，请确保用户缓存条目是最新的[。](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)
* [服务器-13588](https://jira.mongodb.org/browse/SERVER-13588)修复了：“启用时，Shell 会打印启动警告”

#### 查询

- [服务器-13731](https://jira.mongodb.org/browse/SERVER-13731)修复了：“解析深度嵌套[`$not`](https://www.mongodb.com/docs/upcoming/reference/operator/query/not/#mongodb-query-op.-not)查询时堆栈溢出”
- [服务器-13890](https://jira.mongodb.org/browse/SERVER-13890)修复：“索引边界构建器为[`$or`](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)加入的多个否定构建无效绑定[”](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)
- [服务器-13752](https://jira.mongodb.org/browse/SERVER-13752)验证了空[`$in`](https://www.mongodb.com/docs/upcoming/reference/operator/query/in/#mongodb-query-op.-in)子句的断言，并在复合索引中的第二个字段上排序。
- [服务器-13337](https://jira.mongodb.org/browse/SERVER-13337)为带有投影的查询重新启用`idhack`。
- [服务器-13715](https://jira.mongodb.org/browse/SERVER-13715)修复：“聚合管道执行在$or和阻止排序中可能会失败”
- [服务器-13714](https://jira.mongodb.org/browse/SERVER-13714)修复：“非顶级可索引[`$not`](https://www.mongodb.com/docs/upcoming/reference/operator/query/not/#mongodb-query-op.-not)触发查询规划错误”
- [服务器-13769](https://jira.mongodb.org/browse/SERVER-13769)修复了：“带有地理谓词的索引字段上的[`distinct`](https://www.mongodb.com/docs/upcoming/reference/command/distinct/#mongodb-dbcommand-dbcmd.distinct)命令无法执行”
- [服务器-13675](https://jira.mongodb.org/browse/SERVER-13675)修复了“性能不同的计划可以绑定计划排名”
- [服务器-13899](https://jira.mongodb.org/browse/SERVER-13899)修复：“‘整个索引扫描’查询解决方案可以使用不兼容的索引，返回错误的结果”
- [服务器-13852](https://jira.mongodb.org/browse/SERVER-13852)修复了“IndexBounds::endKeyInclusive未由构造函数初始化”
- [服务器-14073](https://jira.mongodb.org/browse/SERVER-14073)planSummary不再截断为255个字符
- [服务器-14174](https://jira.mongodb.org/browse/SERVER-14174)修复：“如果ntoreturn是一个限制（而不是批次大小），则在计划排名期间，额外的数据会受到缓冲”
- [服务器-13789](https://jira.mongodb.org/browse/SERVER-13789)一些嵌套查询不再触发断言错误
- [服务器-14064](https://jira.mongodb.org/browse/SERVER-14064)添加了[`count`](https://www.mongodb.com/docs/upcoming/reference/command/count/#mongodb-dbcommand-dbcmd.count)日志消息的计划摘要信息。
- [服务器-13960](https://jira.mongodb.org/browse/SERVER-13960)如果多个子句使用相同的索引，则包含[`$or`](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)不再错过结果的查询。
- [服务器-14180](https://jira.mongodb.org/browse/SERVER-14180)修复：“与'和'子句、[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)和嵌套[`$mod`](https://www.mongodb.com/docs/upcoming/reference/operator/query/mod/#mongodb-query-op.-mod)或正则表达式的崩溃”
- [服务器-14176](https://jira.mongodb.org/browse/SERVER-14176)如果指定了查询，自然顺序排序规范将不再被忽略。
- [服务器-13754](https://jira.mongodb.org/browse/SERVER-13754)对于[`$or`](https://www.mongodb.com/docs/upcoming/reference/operator/query/or/#mongodb-query-op.-or)可以使用合并排序的查询，边界不再组合。

#### 地理空间

[服务器-13687](https://jira.mongodb.org/browse/SERVER-13687)复合多键2dsphere索引的[`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)查询结果现在按距离排序。

#### 写入操作

[服务器-13802](https://jira.mongodb.org/browse/SERVER-13802)插入字段验证不再在firstTimestamp`Timestamp()`字段停止。

#### 复制

- [服务器-13993](https://jira.mongodb.org/browse/SERVER-13993)修复：“当`shouldChangeSyncTarget()`认为节点应该更改同步目标时，记录一条消息”
- [服务器-13976](https://jira.mongodb.org/browse/SERVER-13976)修复了：“克隆人需要检测到创建集合失败”

#### 分片

- [服务器-13616](https://jira.mongodb.org/browse/SERVER-13616)已解决：“首次获取分布式锁时出现‘类型 7’ (OID) 错误”
- [服务器-13812](https://jira.mongodb.org/browse/SERVER-13812)现在捕获由`getShardsForQuery`抛出的地理查询异常。
- [服务器-14138](https://jira.mongodb.org/browse/SERVER-14138) [`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)现在将正确定位嵌套字段碎片键谓词的多个碎片。
- [服务器-11332](https://jira.mongodb.org/browse/SERVER-11332)修复了：“如果firstconfig服务器无响应，身份验证请求延迟”

#### 映射/缩小

- [服务器-14186](https://jira.mongodb.org/browse/SERVER-14186) Resolved: "[`rs.stepDown()`](https://www.mongodb.com/docs/upcoming/reference/method/rs.stepDown/#mongodb-method-rs.stepDown) during mapReduce causes fassert in logOp"
- [服务器-13981](https://jira.mongodb.org/browse/SERVER-13981)临时地图/减少集合现在被正确复制到次要集合。

#### 储存

- [服务器-13750](https://jira.mongodb.org/browse/SERVER-13750) [`convertToCapped`](https://www.mongodb.com/docs/upcoming/reference/command/convertToCapped/#mongodb-dbcommand-dbcmd.convertToCapped)在空集合上，不`invariant()`失败后不再中止。
- [服务器-14056](https://jira.mongodb.org/browse/SERVER-14056)使用renameCollection在数据库中移动大量集合不再触发致命断言。
- [服务器-14082](https://jira.mongodb.org/browse/SERVER-14082)修复：“MaxBucket的自由名单扫描过高”
- [服务器-13737](https://jira.mongodb.org/browse/SERVER-13737)如果值非数字，CollectionOptions解析器现在跳过“大小”/“最大”元素的非数字。

#### 构建和包装

- [服务器-13950](https://jira.mongodb.org/browse/SERVER-13950)MongoDB Enterprise现在包括必需的依赖项列表。
- [服务器-13862](https://jira.mongodb.org/browse/SERVER-13862)通过RPM支持mongodb-org-server在RHEL5上安装2.6.1-1。
- [服务器-13724](https://jira.mongodb.org/browse/SERVER-13724)添加了SCons标志，以覆盖将所有警告视为错误。

#### 诊断学

- [服务器-13587](https://jira.mongodb.org/browse/SERVER-13587)已解决：“在`system.profile`文档中[`ndeleted`](https://www.mongodb.com/docs/upcoming/reference/database-profiler/#mongodb-data-system.profile.ndeleted)，报告1删除的文档太少”
- [服务器-13368](https://jira.mongodb.org/browse/SERVER-13368)改进了时序信息的曝光[。](https://www.mongodb.com/docs/upcoming/reference/command/currentOp/#mongodb-dbcommand-dbcmd.currentOp)

#### 管理

[服务器-13954](https://jira.mongodb.org/browse/SERVER-13954) [`security.javascriptEnabled`](https://www.mongodb.com/docs/upcoming/reference/configuration-options/#mongodb-setting-security.javascriptEnabled)选项现在在YAML配置文件中可用。

#### 工具

- [服务器-10464](https://jira.mongodb.org/browse/SERVER-10464) [`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump) can now query `oplog.$main` and `oplog.rs` when using `--dbpath`.
- [服务器-13760](https://jira.mongodb.org/browse/SERVER-13760) [`mongoexport`](https://www.mongodb.com/docs/database-tools/mongoexport/#mongodb-binary-bin.mongoexport)现在可以在Windows上处理大时间戳。

#### Shell

* [服务器-13865](https://jira.mongodb.org/browse/SERVER-13865)对于在_id字段上使用非OID相等谓词的兼容模式upsert，Shell现在返回正确的WriteResult。
* [服务器-13037](https://jira.mongodb.org/browse/SERVER-13037)修复了“兼容性模式”错误消息中的错别字。

#### 内部代码

- [服务器-13794](https://jira.mongodb.org/browse/SERVER-13794)修复了：“未使用的快照历史记录消耗大量堆空间”
- [服务器-13446](https://jira.mongodb.org/browse/SERVER-13446)删除了Solaris构建对ILLUMOS libc的依赖关系。
- [服务器-14092](https://jira.mongodb.org/browse/SERVER-14092)MongoDB升级2.4到2.6检查不再返回内部集合中的错误。
- [服务器-14000](https://jira.mongodb.org/browse/SERVER-14000)为Debian 7.1添加了新的lsb文件位置

#### 测试

- [服务器-13723](https://jira.mongodb.org/browse/SERVER-13723)在移植到使用写入命令时更改超时后，稳定了`tags.js`。
- [服务器-13494](https://jira.mongodb.org/browse/SERVER-13494)修复了：“`setup_multiversion_mongodb.py`由于非数字版本排序而无法下载2.4.10”
- [服务器-13603](https://jira.mongodb.org/browse/SERVER-13603)修复：“使用`--nopreallocj`运行时，带有选项测试的测试套件失败”
- [服务器-13948](https://jira.mongodb.org/browse/SERVER-13948)修复：“`awaitReplication()`与从主服务器获取配置版本相关的故障导致测试失败”
- [服务器-13839](https://jira.mongodb.org/browse/SERVER-13839)修复了`sync2.js`故障。
- [服务器-13972](https://jira.mongodb.org/browse/SERVER-13972) Fixed `connections_opened.js` failure.
- [服务器-13712](https://jira.mongodb.org/browse/SERVER-13712)减少了测试套件的峰值磁盘使用。
- [服务器-14249](https://jira.mongodb.org/browse/SERVER-14249)添加了通过[`mongodump`](https://www.mongodb.com/docs/database-tools/mongodump/#mongodb-binary-bin.mongodump)使用`--dbpath`
- [服务器-10462](https://jira.mongodb.org/browse/SERVER-10462)修复：“Windows文件锁定相关的构建机器人故障”

### 2.6.1 - 更改

#### 稳定

[服务器-13739](https://jira.mongodb.org/browse/SERVER-13739)修复数据库失败可以删除数据库文件

#### 构建和包装

- [服务器-13287](https://jira.mongodb.org/browse/SERVER-13287)调试符号的添加使编译时间翻了一番
- [服务器-13563](https://jira.mongodb.org/browse/SERVER-13563) Upgrading from 2.4.x to 2.6.0 via `yum` clobbers configuration file
- [服务器-13691](https://jira.mongodb.org/browse/SERVER-13691)yum和apt“稳定”存储库包含候选版本2.6.1-rc0软件包
- [服务器-13515](https://jira.mongodb.org/browse/SERVER-13515)无法在Windows上将MongoDB安装为服务

#### 查询

- [服务器-13066](https://jira.mongodb.org/browse/SERVER-13066)多键字段的否定不使用索引
- [服务器-13495](https://jira.mongodb.org/browse/SERVER-13495)并发`GETMORE`和`KILLCURSORS`操作可能导致比赛条件和服务器崩溃
- [服务器-13503](https://jira.mongodb.org/browse/SERVER-13503)[`$where`](https://www.mongodb.com/docs/upcoming/reference/operator/query/where/#mongodb-query-op.-where)运营商不应该被允许[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)
- [服务器-13537](https://jira.mongodb.org/browse/SERVER-13537)大跳过和限制值可能会导致在阻塞排序阶段崩溃
- [服务器-13557](https://jira.mongodb.org/browse/SERVER-13557)2.6中$elemMatch值的错误否定
- [服务器-13562](https://jira.mongodb.org/browse/SERVER-13562)如果应用skip()，使用可尾光标的查询不会流式传输结果
- [服务器-13566](https://jira.mongodb.org/browse/SERVER-13566)将OplogReplay标志与额外的谓词一起使用可能会产生不正确的结果
- [服务器-13611](https://jira.mongodb.org/browse/SERVER-13611)缺少复合索引的排序顺序会导致不必要的内存排序
- [服务器-13618](https://jira.mongodb.org/browse/SERVER-13618)未应用于反向排序顺序的排序$in查询的优化
- [服务器-13661](https://jira.mongodb.org/browse/SERVER-13661)增加查询对象的最大允许深度
- [服务器-13664](https://jira.mongodb.org/browse/SERVER-13664)使用复合多键索引使用[`$elemMatch`](https://www.mongodb.com/docs/upcoming/reference/operator/query/elemMatch/#mongodb-query-op.-elemMatch)查询可能会产生不正确的结果
- [服务器-13677](https://jira.mongodb.org/browse/SERVER-13677)查询规划器在处理$elemMatch对象谓词时应该遍历$all
- [服务器-13766](https://jira.mongodb.org/browse/SERVER-13766)当$或查询产生时，删除索引或集合会触发致命断言

#### 地理空间

- [服务器-13666](https://jira.mongodb.org/browse/SERVER-13666) [`$near`](https://www.mongodb.com/docs/upcoming/reference/operator/query/near/#mongodb-query-op.-near)具有传统格式的越界点查询可能导致崩溃
- [服务器-13540](https://jira.mongodb.org/browse/SERVER-13540)`geoNear`命令不再返回弧度的距离作为遗留点
- [服务器-13486](https://jira.mongodb.org/browse/SERVER-13486)：`geoNear`命令可以创建太大的BSON对象进行聚合。

#### 复制

- [服务器-13500](https://jira.mongodb.org/browse/SERVER-13500)更改副本集配置可能会崩溃运行成员
- [服务器-13589](https://jira.mongodb.org/browse/SERVER-13589)背景索引从2.4.x次要未能完成的2.6.0主索引构建
- [服务器-13620](https://jira.mongodb.org/browse/SERVER-13620)在后台索引构建期间，复制的数据定义命令将在次调时失败
- [服务器-13496](https://jira.mongodb.org/browse/SERVER-13496)在混合版本副本集中创建具有相同名称但不同规格的索引可能会中止复制

#### 分片

- [服务器-12638](https://jira.mongodb.org/browse/SERVER-12638)使用散列碎片键进行初始分片可能会导致重复的拆分点
- [服务器-13518](https://jira.mongodb.org/browse/SERVER-13518)丢失时，[`mongos`](https://www.mongodb.com/docs/upcoming/reference/program/mongos/#mongodb-binary-bin.mongos)不再自动生成`_id`字段
- [服务器-13777](https://jira.mongodb.org/browse/SERVER-13777)等待删除的迁移范围不会报告光标仍然打开

#### 安全

- [服务器-9358](https://jira.mongodb.org/browse/SERVER-9358)日志轮换可以覆盖以前的日志文件
- [服务器-13644](https://jira.mongodb.org/browse/SERVER-13644)启动选项中的敏感凭据不会被编辑，可能会被暴露
- [服务器-13441](https://jira.mongodb.org/browse/SERVER-13441)用户管理shell助手中的错误处理不一致

#### 写入操作

- [服务器-13466](https://jira.mongodb.org/browse/SERVER-13466)集合创建失败中的错误消息包含错误的命名空间
- [服务器-13499](https://jira.mongodb.org/browse/SERVER-13499)批次插入的收益率政策应与批次更新/删除的收益率政策相同
- [服务器-13516](https://jira.mongodb.org/browse/SERVER-13516)具有超过128个BSON元素的文档的数组更新可能会崩溃[`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod)



 参见

原文 - [2.6 Changelog]( https://docs.mongodb.com/manual/release-notes/2.6-changelog/ )

