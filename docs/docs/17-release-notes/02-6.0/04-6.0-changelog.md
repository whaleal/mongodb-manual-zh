# 6.0 更改日志

## 6.0.3 更改日志

### 安全

- [服务器-68371](https://jira.mongodb.org/browse/SERVER-68371)在MongoClient中启用CSFLE会导致Atlas搜索失败
- [服务器-70559](https://jira.mongodb.org/browse/SERVER-70559)标签FLE2测试，使它们不会与降级套件一起运行

### 分片

- [服务器-63668](https://jira.mongodb.org/browse/SERVER-63668)守卫不再自动分体功能标志后面的分块器
- [服务器-66916](https://jira.mongodb.org/browse/SERVER-66916)范围删除器配置参数不可动态更改
- [服务器-67466](https://jira.mongodb.org/browse/SERVER-67466)当外部OperationContext中断时，内部事务API可能内存不安全
- [服务器-67891](https://jira.mongodb.org/browse/SERVER-67891)实现$shardedDataDistribution阶段的基本结构
- [服务器-68139](https://jira.mongodb.org/browse/SERVER-68139)如果投影排序大于100MB，则重新分片命令失败
- [服务器-68249](https://jira.mongodb.org/browse/SERVER-68249) Add required privileges on the $shardedDataDistribution aggregation stage
- [服务器-68869](https://jira.mongodb.org/browse/SERVER-68869)_configSvrReshardCollection的重试可能会成功导致resharding_coordinator_recovers_abort_decision.js失败
- [服务器-69134](https://jira.mongodb.org/browse/SERVER-69134)丢弃分片集合并不能摆脱CSS条目
- [服务器-69429](https://jira.mongodb.org/browse/SERVER-69429)collMod中缺少碎片密钥和唯一索引的检查
- [服务器-69444](https://jira.mongodb.org/browse/SERVER-69444)使并发关键部分的连接和刷新在DSS和CSS之间看起来相同
- [服务器-69700](https://jira.mongodb.org/browse/SERVER-69700)复制回滚失败sresharding_coordinator_recovers_abort_decision.js
- [服务器-69756](https://jira.mongodb.org/browse/SERVER-69756)中止时的分割故障ReshardCollection在reshardCollection cmd之后发布
- [服务器-69897](https://jira.mongodb.org/browse/SERVER-69897)从concurrency_simultaneous_replication*.yml测试套件中排除internal_transactions_setFCV.js FSM工作负载
- [服务器-70364](https://jira.mongodb.org/browse/SERVER-70364)重试网络错误的configureFailPoint命令（resharding_coordinator_recovers_abort_decision.js）
- [服务器-70373](https://jira.mongodb.org/browse/SERVER-70373)如果不恢复分片指标，则不变失败
- [服务器-70793](https://jira.mongodb.org/browse/SERVER-70793)在进行X锁之前，先在IS锁下检查newmetadata，先刷新数据库元数据
- [服务器-70852](https://jira.mongodb.org/browse/SERVER-70852)在v6.0上重新提交SERVER-66716
- [服务器-71092](https://jira.mongodb.org/browse/SERVER-71092)shard_id_test.cpp依赖于std::string::compare函数的纯行为

### 复制

[服务器-69861](https://jira.mongodb.org/browse/SERVER-69861)选举中不间断的锁卫导致FCBIS被绞死

### 查询

- [服务器-60141](https://jira.mongodb.org/browse/SERVER-60141)将时间lib升级到2021.09或更高版本
- [服务器-66289](https://jira.mongodb.org/browse/SERVER-66289)$out错误地在v5.0.8上抛出BSONObj大小错误
- [服务器-70190](https://jira.mongodb.org/browse/SERVER-70190)ExpressionSwitch::optimize()可以将表达式树置于无效状态，导致不变失败
- [服务器-70381](https://jira.mongodb.org/browse/SERVER-70381)_internalSearchIdLookup阶段违反了getOwnershipFilter函数的5.0先决条件

### 运营

[服务器-67793](https://jira.mongodb.org/browse/SERVER-67793)init.d中的log_progress_msg不会打印消息

### 构建和包装

- [服务器-48203](https://jira.mongodb.org/browse/SERVER-48203)支持Ninja构建的安装操作
- [服务器-67715](https://jira.mongodb.org/browse/SERVER-67715)更改流阅读器需要双转义正则表达式
- [服务器-69507](https://jira.mongodb.org/browse/SERVER-69507)Rpath只应在动态构建上设置

### 内部人员

- [服务器-57417](https://jira.mongodb.org/browse/SERVER-57417)启用NoMoreAutoSplitter功能标志
- [服务器-60753](https://jira.mongodb.org/browse/SERVER-60753)从'config.system.indexBuilds'中删除索引构建条目可以进行混合模式写入
- [服务器-60829](https://jira.mongodb.org/browse/SERVER-60829)租户捐赠者在撰写提交决定时不应使用donAbortMigrationcancellation令牌
- [服务器-62300](https://jira.mongodb.org/browse/SERVER-62300)平台支持：添加对Ubuntu 22.04 x86的支持
- [服务器-62302](https://jira.mongodb.org/browse/SERVER-62302)平台支持：添加对RHEL9 x86的支持
- [服务器-62760](https://jira.mongodb.org/browse/SERVER-62760)向查询日志行添加信息，指示何时使用新的优化器
- [服务器-63811](https://jira.mongodb.org/browse/SERVER-63811) mongos returns no results for $documents if the database doesn't exist
- [服务器-64319](https://jira.mongodb.org/browse/SERVER-64319)覆盖分析缺陷121642：解析警告
- [服务器-65191](https://jira.mongodb.org/browse/SERVER-65191)使用有线虎运行StorageEngineRepairTest
- [服务器-65816](https://jira.mongodb.org/browse/SERVER-65816)更改平衡器策略，以平衡数据大小而不是块数
- [服务器-66078](https://jira.mongodb.org/browse/SERVER-66078)调整会话收集平衡策略以适应数据大小感知平衡
- [服务器-66208](https://jira.mongodb.org/browse/SERVER-66208)删除现有数据的碎片收集的块创建
- [服务器-66378](https://jira.mongodb.org/browse/SERVER-66378)启用featureFlagBalanceAccordingToDataSize时跳过适应测试
- [服务器-66525](https://jira.mongodb.org/browse/SERVER-66525)errexit阻止捕获pip安装日志
- [服务器-66614](https://jira.mongodb.org/browse/SERVER-66614)在macOS上加快单元测试速度
- [服务器-66747](https://jira.mongodb.org/browse/SERVER-66747)增加等待平衡injstests/sharding/authCommands.js的截止日期
- [服务器-66753](https://jira.mongodb.org/browse/SERVER-66753) Change BalancerPolicy::_getLeastLoadedReceiverShard currentMin type
- [服务器-66781](https://jira.mongodb.org/browse/SERVER-66781)启用BalanceAccordingToDataSize功能标志
- [服务器-66827](https://jira.mongodb.org/browse/SERVER-66827)如果上次随机选择的集合禁用了平衡，平衡器可能会跳过一轮
- [服务器-66834](https://jira.mongodb.org/browse/SERVER-66834)由defragmentation_util.js创建的区域必须始终与块对齐
- [服务器-66835](https://jira.mongodb.org/browse/SERVER-66835)[仅限测试错误]比较块数 inbalancing_based_on_size.js
- [服务器-66913](https://jira.mongodb.org/browse/SERVER-66913)当无法处理请求的集合时，configureCollectionBalancing()应该返回NamespaceNotSharded
- [服务器-66972](https://jira.mongodb.org/browse/SERVER-66972)数据库关键部分不会随着持续刷新而序列化
- [服务器-67231](https://jira.mongodb.org/browse/SERVER-67231) Use assert.adminCommandWorkedAllowingNetworkError in fcbis_fails_if_backup_cursor_is_already_open_on_sync_source.js
- [服务器-67301](https://jira.mongodb.org/browse/SERVER-67301)平衡器可能会为完全平衡的集合执行一次不必要的迁移
- [服务器-67346](https://jira.mongodb.org/browse/SERVER-67346)升级集群时禁用config.system.sessions上的自动拆分，以避免碎片原语崩溃
- [服务器-67619](https://jira.mongodb.org/browse/SERVER-67619)增加s390x变体的构建频率
- [服务器-67681](https://jira.mongodb.org/browse/SERVER-67681)为编译命令创建特定目标
- [服务器-67733](https://jira.mongodb.org/browse/SERVER-67733)ShardingTest::awaitBalancerRound()在CSRS下台的情况下不起作用
- [服务器-67739](https://jira.mongodb.org/browse/SERVER-67739)tenant_migration_donor_retry.js州文档可以在对它们提出断言之前进行清理
- [服务器-67809](https://jira.mongodb.org/browse/SERVER-67809)在stepdown套件中执行insert_with_data_size_aware_balancing.js
- [服务器-67813](https://jira.mongodb.org/browse/SERVER-67813)当数据大小感知平衡在v6.0中时，请查看“requires_fcv_61”标签
- [服务器-67898](https://jira.mongodb.org/browse/SERVER-67898)BalancerCollectionStatus返回会话集合的块大小错误
- [服务器-68115](https://jira.mongodb.org/browse/SERVER-68115)修复了“elemMatchRootLength > 0”不变触发器的错误
- [服务器-68157](https://jira.mongodb.org/browse/SERVER-68157)AuditEncryptionCompressionManager::encryptAndEncode应该会发出大BSON
- [服务器-68233](https://jira.mongodb.org/browse/SERVER-68233)MongoShellnumberDecimalsAlmostEqual(NumberDecimal(0), NumberDecimal(0)) 返回 false
- [服务器-68394](https://jira.mongodb.org/browse/SERVER-68394) Ensure we do not yield strong locks upon startup recovery when _id index is missing
- [服务器-68484](https://jira.mongodb.org/browse/SERVER-68484)提高阈值，以考虑在balancing_based_on_size.js中平衡的集合
- [服务器-68541](https://jira.mongodb.org/browse/SERVER-68541)并发删除碎片和移动Primary可能会删除未分片集合
- [服务器-68893](https://jira.mongodb.org/browse/SERVER-68893)移除不必要的持票人基准
- [服务器-69001](https://jira.mongodb.org/browse/SERVER-69001)初始同步应将minValid文档设置为“stopTimestamp”
- [服务器-69037](https://jira.mongodb.org/browse/SERVER-69037)SBE计划缓存大小计算略有偏差
- [服务器-69069](https://jira.mongodb.org/browse/SERVER-69069)InTel希望能够在数据大小的分发API中指定集合的子集
- [服务器-69133](https://jira.mongodb.org/browse/SERVER-69133)删除硬链接安装操作的冗余设置
- [服务器-69136](https://jira.mongodb.org/browse/SERVER-69136)测试应考虑平衡器收集状态可能会过早报告平衡器合规
- [服务器-69160](https://jira.mongodb.org/browse/SERVER-69160)让ShardingTest等待FCV初始化，然后再运行 getClusterParameter测试
- [服务器-69224](https://jira.mongodb.org/browse/SERVER-69224)SkipAuditEncCompManagerTest.EncryptAndEncodeLargePayloadSucceeds 当不支持GCM时
- [服务器-69281](https://jira.mongodb.org/browse/SERVER-69281)强制最小忍者版本
- [服务器-69348](https://jira.mongodb.org/browse/SERVER-69348)命令必须声明空的身份验证检查才能普遍调用
- [服务器-69353](https://jira.mongodb.org/browse/SERVER-69353)单独生成burn_in任务
- [服务器-69380](https://jira.mongodb.org/browse/SERVER-69380)如果包含预测已被吸收，$_internalUnpackBucket阶段可能会错误地与$项目交换
- [服务器-69389](https://jira.mongodb.org/browse/SERVER-69389)命令checkAuthorization可能会为现有集合抛出ErrorCodes::NamespaceNotFound，同时尝试在节点关闭时将UUID重新解析为命名空间。
- [服务器-69446](https://jira.mongodb.org/browse/SERVER-69446)增加选举TimeoutMillis injstests/replsets/dbcheck_write_concern.js
- [服务器-69447](https://jira.mongodb.org/browse/SERVER-69447)添加查询旋钮来控制成本模型系数的版本
- [服务器-69465](https://jira.mongodb.org/browse/SERVER-69465)接受与$collStats相同的$_internalAllCollectionStats规格
- [服务器-69603](https://jira.mongodb.org/browse/SERVER-69603)不要将投放事件报告为shardCollection的一部分
- [服务器-69784](https://jira.mongodb.org/browse/SERVER-69784)修复签名字符误用的实例
- [服务器-69793](https://jira.mongodb.org/browse/SERVER-69793)在查询系统中禁用内存下流检查
- [服务器-69849](https://jira.mongodb.org/browse/SERVER-69849)[v6.0]删除FifoBasicMetrics单元测试
- [服务器-69868](https://jira.mongodb.org/browse/SERVER-69868)启动关机的TransportLayer时返回错误
- [服务器-69898](https://jira.mongodb.org/browse/SERVER-69898)在刷新DB版本之前，请等待关键部分的追赶阶段
- [服务器-69912](https://jira.mongodb.org/browse/SERVER-69912)SConstruct可以错误地执行
- [服务器-69917](https://jira.mongodb.org/browse/SERVER-69917)实现_clusterWriteWithoutShardKey命令
- [服务器-69926](https://jira.mongodb.org/browse/SERVER-69926)errorcodes.py在MONGO_UNREACHABLE_TASSERT中检测不到重复错误
- [服务器-69929](https://jira.mongodb.org/browse/SERVER-69929)如果未启用所需的功能标志，请跳过严格的API测试
- [服务器-69930](https://jira.mongodb.org/browse/SERVER-69930)日志中试图刷新已删除数据库版本的意外错误消息
- [服务器-70062](https://jira.mongodb.org/browse/SERVER-70062)在oplog滚动恢复失败中记录有关操作日志条目的相关信息
- [服务器-70170](https://jira.mongodb.org/browse/SERVER-70170)更新 ssl_helpers.js for Amazon 2022
- [服务器-70181](https://jira.mongodb.org/browse/SERVER-70181)Ubuntu和Debian软件包测试在服务器主服务器中失败
- [服务器-70209](https://jira.mongodb.org/browse/SERVER-70209)在第三方组件中列出新的时间lib库
- [服务器-70211](https://jira.mongodb.org/browse/SERVER-70211)删除在CostModelManager中应用覆盖样板代码
- [服务器-70226](https://jira.mongodb.org/browse/SERVER-70226)rhel9 支持YUM出版
- [服务器-70274](https://jira.mongodb.org/browse/SERVER-70274)通过利用EOF过滤器提高更改流图像前清除作业的性能
- [服务器-70299](https://jira.mongodb.org/browse/SERVER-70299)删除JSON.send命令用法
- [服务器-70314](https://jira.mongodb.org/browse/SERVER-70314)调整时间序列扩展范围测试，以考虑日志保留限制
- [服务器-70348](https://jira.mongodb.org/browse/SERVER-70348)删除可查询WT的EAGAIN，并在内部重试
- [服务器-70361](https://jira.mongodb.org/browse/SERVER-70361)操作上下文等待应该处理超出范围的持续时间
- [服务器-70436](https://jira.mongodb.org/browse/SERVER-70436)限制 isCoveredNullQuery 可以应用的情况
- [服务器-70469](https://jira.mongodb.org/browse/SERVER-70469)在看门狗测试中使用虚拟env python
- [服务器-70475](https://jira.mongodb.org/browse/SERVER-70475)修复旧提升线程库中的有符号整数比较问题
- [服务器-70483](https://jira.mongodb.org/browse/SERVER-70483)更新Resmoke，将“evergreen_execution”传递给日志管理员。
- [服务器-70484](https://jira.mongodb.org/browse/SERVER-70484)从perf.yml和sys_perf.yml中删除信号处理模块
- [服务器-70602](https://jira.mongodb.org/browse/SERVER-70602)通过等待一些无操作平衡轮来处理错误的平衡器合规的报告
- [服务器-70725](https://jira.mongodb.org/browse/SERVER-70725)如果获取路由信息失败，集群聚合可能会错误地导致CollectionUUIDM不匹配
- [服务器-70814](https://jira.mongodb.org/browse/SERVER-70814)在_createCmdObj() methodsignature中删除const限定符
- [服务器-70834](https://jira.mongodb.org/browse/SERVER-70834)修复不使用scons缓存报告失败的任务
- [服务器-70864](https://jira.mongodb.org/browse/SERVER-70864)摆脱细粒度范围删除器锁
- [服务器-70879](https://jira.mongodb.org/browse/SERVER-70879)修复多个线程同时转动索引多键的竞赛
- [服务器-71112](https://jira.mongodb.org/browse/SERVER-71112)修复分片接收方单元测试中重新分片错误的计数
- [WT-9792](https://jira.mongodb.org/browse/WT-9792)修复RTS从历史存储中删除数据存储更新的全局可见更新
- [WT-9926](https://jira.mongodb.org/browse/WT-9926)从备份启动期间崩溃可能会丢失元数据



## 6.0.2 更改日志

### 安全

[服务器-66554](https://jira.mongodb.org/browse/SERVER-66554)使FLE2套件与stepdown和kill_primary套件配合使用

### 分片

- [服务器-61035](https://jira.mongodb.org/browse/SERVER-61035)将'resharding_large_number_of_initial_chunks.js'中的区域增加到175,000
- [服务器-61985](https://jira.mongodb.org/browse/SERVER-61985)resharding_coordinator_recovers_abort_decision.js可能会报告由于主碎片重试_configsvrReshardCollection并运行第二个分片操作而成功
- [服务器-66331](https://jira.mongodb.org/browse/SERVER-66331)额外的$searchMeta测试覆盖范围
- [服务器-67193](https://jira.mongodb.org/browse/SERVER-67193)确保协调员在setfcv_reshard_collection.js中的setFCV之前开始重新分片
- [服务器-68094](https://jira.mongodb.org/browse/SERVER-68094)使用自定义生成的_id重新分片失败并出现投影错误
- [服务器-68139](https://jira.mongodb.org/browse/SERVER-68139)如果投影排序大于100MB，则重新分片命令失败
- [服务器-68495](https://jira.mongodb.org/browse/SERVER-68495)重新分片配置了大量区域的集合可能会在配置服务器主服务器上无限期停滞
- [服务器-68628](https://jira.mongodb.org/browse/SERVER-68628)在主故障转移后重试失败的分片操作可能会导致服务器崩溃或写入丢失
- [服务器-68728](https://jira.mongodb.org/browse/SERVER-68728)添加中断的附加激活条件BeforeProcessingPrePostImageOriginatingOp故障点
- [服务器-68869](https://jira.mongodb.org/browse/SERVER-68869)_configSvrReshardCollection的重试可能会成功导致resharding_coordinator_recovers_abort_decision.js失败
- [服务器-68890](https://jira.mongodb.org/browse/SERVER-68890)删除MigrationSourceManager提交路径中的错误代码转换
- [服务器-69220](https://jira.mongodb.org/browse/SERVER-69220)refineCollectionShardKey允许在基于范围和散列之间切换当前碎片密钥字段，导致数据不一致
- [服务器-69700](https://jira.mongodb.org/browse/SERVER-69700)复制回滚失败 resharding_coordinator_recovers_abort_decision.js

### 运营

[服务器-68548](https://jira.mongodb.org/browse/SERVER-68548)mongo shell版本4.4.15记录asio消息，尽管--安静的旗帜

### 内部人员

- [服务器-60551](https://jira.mongodb.org/browse/SERVER-60551)连接时偶尔会收到“初始电线规格”
- [服务器-61281](https://jira.mongodb.org/browse/SERVER-61281)修复在查询内存跟踪器中考虑文档大小时的下流问题
- [服务器-63191](https://jira.mongodb.org/browse/SERVER-63191)创建更早生成版本元数据的任务
- [服务器-63843](https://jira.mongodb.org/browse/SERVER-63843)不允许在同步信号处理程序中进行递归doLog
- [服务器-63852](https://jira.mongodb.org/browse/SERVER-63852)getThreadName()不应该崩溃
- [服务器-65317](https://jira.mongodb.org/browse/SERVER-65317)mongod在运行简单的$search查询后从连接池中删除连接
- [服务器-65382](https://jira.mongodb.org/browse/SERVER-65382)AutoSplitVector不应使用clientReadable对碎片键字段进行重新排序
- [服务器-65435](https://jira.mongodb.org/browse/SERVER-65435)配置模糊器可以将驱逐触发器设置为低于单个操作可能生成的肮脏数据量
- [服务器-65781](https://jira.mongodb.org/browse/SERVER-65781)让外壳夹具成为符号
- [服务器-66436](https://jira.mongodb.org/browse/SERVER-66436)修复DConcurrencyTest基准测试中的初始化错误
- [服务器-66613](https://jira.mongodb.org/browse/SERVER-66613)将二进制版本而不是常青版本发送到符号化器服务
- [服务器-66726](https://jira.mongodb.org/browse/SERVER-66726)修复killAllSessionsByPattern中的序列化
- [服务器-66794](https://jira.mongodb.org/browse/SERVER-66794)为日期在1970-2038年以外的TS收藏添加记忆旗
- [服务器-66804](https://jira.mongodb.org/browse/SERVER-66804)从测试设置中删除check_binary_version
- [服务器-66841](https://jira.mongodb.org/browse/SERVER-66841)LOGV2：在反斜杠字符发生截断时无效的JSON
- [服务器-67126](https://jira.mongodb.org/browse/SERVER-67126)从printStackTrace no-LOGV2代码路径中删除LOGV2调用
- [服务器-67239](https://jira.mongodb.org/browse/SERVER-67239)改进set_audit_config测试中的超时处理
- [服务器-67280](https://jira.mongodb.org/browse/SERVER-67280)确保HealthObserver::periodicCheckImpl()实现处理异常，并在发生异常时返回适当的失败运行状况检查状态
- [服务器-67296](https://jira.mongodb.org/browse/SERVER-67296)将用于提交块相关DDL操作的configsvr命令的OpCtx标记为可中断
- [服务器-67385](https://jira.mongodb.org/browse/SERVER-67385)在对碎片主服务器上正在进行的范围完成查询之前，范围删除任务可能会被错误地安排
- [服务器-67402](https://jira.mongodb.org/browse/SERVER-67402)线性读数偶尔可能会使用错误的读取源读取
- [服务器-67538](https://jira.mongodb.org/browse/SERVER-67538)如果在旧的、不兼容的快照上，多文档事务应该会失败
- [服务器-67605](https://jira.mongodb.org/browse/SERVER-67605)使retryable_findAndModify_commit_and_abort_prepared_txns_after_failover_and_restart.js不要使用1节点碎片测试重新启动
- [服务器-67650](https://jira.mongodb.org/browse/SERVER-67650)当操作日志应用程序尚未赶上oplog fetcher时，分片收件人可以返回剩余的OperationTimeEstimatedSecs=0
- [服务器-67653](https://jira.mongodb.org/browse/SERVER-67653)分段协调员可能会错误地得出结论，它可以启动关键部分，尽管在一个收件人上，oplog应用程序没有赶上oplog fetcher
- [服务器-67666](https://jira.mongodb.org/browse/SERVER-67666)允许在完整的集群更改流中观看system.buckets集合
- [服务器-67679](https://jira.mongodb.org/browse/SERVER-67679)并发集合删除可以返回NamespaceNotFound，而不是CollectionUUIDMismatch
- [服务器-67725](https://jira.mongodb.org/browse/SERVER-67725)检查碎片上的目录一致性作为重命名的先决条件
- [服务器-67728](https://jira.mongodb.org/browse/SERVER-67728)在时间序列jstests中使用FeatureFlagUtil
- [服务器-67787](https://jira.mongodb.org/browse/SERVER-67787)在auth并发测试中重试突变操作
- [服务器-67814](https://jira.mongodb.org/browse/SERVER-67814)在服务器状态中跟踪日期在1970-2038年以外的时间序列集合数量
- [服务器-67846](https://jira.mongodb.org/browse/SERVER-67846)依赖于t featureFlagCollModIndexUnique的测试应该检查FCV 60
- [服务器-67909](https://jira.mongodb.org/browse/SERVER-67909)跳过在紧凑的协调员中删除不存在的临时ECOC集合
- [服务器-67916](https://jira.mongodb.org/browse/SERVER-67916)降级时的比赛可以在ReshardingMetrics中触发不变
- [服务器-67939](https://jira.mongodb.org/browse/SERVER-67939)run_dbcheck_background.js应该对CappedPositionLost有弹性
- [服务器-68003](https://jira.mongodb.org/browse/SERVER-68003)使expitment_unified_ninja.vars成为默认值
- [服务器-68126](https://jira.mongodb.org/browse/SERVER-68126)在AutoSplitVector中检查负maxChunkSize输入值
- [服务器-68207](https://jira.mongodb.org/browse/SERVER-68207)将系统集合的collStats添加到clusterMonitor角色
- [服务器-68399](https://jira.mongodb.org/browse/SERVER-68399)修复在blackduck_hub.py中解析安全版本号的问题
- [服务器-68441](https://jira.mongodb.org/browse/SERVER-68441)collection_uuid_index_commands.js对故障转移不稳健
- [服务器-68461](https://jira.mongodb.org/browse/SERVER-68461)在预6.1兼容的压实协调器中坚持doCompactOperation的结果
- [服务器-68465](https://jira.mongodb.org/browse/SERVER-68465)由于journal.enabled参数，selinux测试失败
- [服务器-68475](https://jira.mongodb.org/browse/SERVER-68475)寻找静态构建中搬迁溢出的解决方案
- [服务器-68477](https://jira.mongodb.org/browse/SERVER-68477)改进过期后TTL索引参数的NaN处理
- [服务器-68479](https://jira.mongodb.org/browse/SERVER-68479)collMod coordiantor V2必须阻止桶nss上的迁移
- [服务器-68521](https://jira.mongodb.org/browse/SERVER-68521)在awaitdata_getmore.js中恢复超时
- [服务器-68540](https://jira.mongodb.org/browse/SERVER-68540)为jscore测试添加docker_incompatible标签
- [服务器-68568](https://jira.mongodb.org/browse/SERVER-68568)future_git_tag应该覆盖MONGO_VERSION
- [服务器-68637](https://jira.mongodb.org/browse/SERVER-68637)将scons缓存添加到企业-rhel-72-s390x-编译构建器
- [服务器-68694](https://jira.mongodb.org/browse/SERVER-68694)调查紧凑型命令周围的锁定
- [服务器-68766](https://jira.mongodb.org/browse/SERVER-68766)添加重新启用单值MapReduce优化的选项
- [服务器-68790](https://jira.mongodb.org/browse/SERVER-68790)修复依赖于重新命名的innalQueryFrameworkControl旋钮的多版本测试
- [服务器-68886](https://jira.mongodb.org/browse/SERVER-68886)删除内部事务中addEagerlyReapedSession的额外调用reap服务单元测试
- [服务器-68905](https://jira.mongodb.org/browse/SERVER-68905)将append_oplog_note_mongos.js添加到backports_required_for_multiversion_tests.yml
- [服务器-68925](https://jira.mongodb.org/browse/SERVER-68925)在启动时重新引入检查表日志记录设置（恢复SERVER-43664）
- [服务器-68937](https://jira.mongodb.org/browse/SERVER-68937)根据历史测试运行时改进任务分割
- [服务器-68950](https://jira.mongodb.org/browse/SERVER-68950)更新 ssl_helpers.js for Ubuntu 22.04
- [服务器-68951](https://jira.mongodb.org/browse/SERVER-68951)在Ubuntu 22.04上修复kerberos_tool.js和ldap_authz_authn.js
- [服务器-69006](https://jira.mongodb.org/browse/SERVER-69006)为对冲读取添加更多跟踪以进行基本插入/更新/替换
- [服务器-69052](https://jira.mongodb.org/browse/SERVER-69052)在检查延长范围时，请确保存储桶收集有效
- [服务器-69103](https://jira.mongodb.org/browse/SERVER-69103)在DocumentSourceLookup的内部禁用SBE
- [服务器-69108](https://jira.mongodb.org/browse/SERVER-69108)SCCL可以立即返回配置和管理元数据，而无需触发刷新
- [服务器-69118](https://jira.mongodb.org/browse/SERVER-69118)让可重试的findAndModify故障转移内部事务测试，直到故障转移后恢复最后一个CommittedOpTime
- [服务器-69141](https://jira.mongodb.org/browse/SERVER-69141)[6.1] 前进固定TSBS版本
- [服务器-69167](https://jira.mongodb.org/browse/SERVER-69167)在setClusterParameter和 getClusterParameter中执行功能标志检查之前，检查FCV是否已初始化
- [服务器-69175](https://jira.mongodb.org/browse/SERVER-69175)添加传输::SocketOption模板，用于制作ASIO风格的sockopt类型
- [服务器-69207](https://jira.mongodb.org/browse/SERVER-69207)覆盖率分析缺陷122696：使用移动物体
- [服务器-69265](https://jira.mongodb.org/browse/SERVER-69265)增加config_fuzzer_replica_sets_jscore_passthrough超时
- [服务器-69284](https://jira.mongodb.org/browse/SERVER-69284)移除FifoTicketHolder
- [服务器-69290](https://jira.mongodb.org/browse/SERVER-69290)在6.0中禁用分片/细化基本测试
- [服务器-69376](https://jira.mongodb.org/browse/SERVER-69376)在macos变体上增加replica_sets_jscore_passthrough的超时
- [服务器-69475](https://jira.mongodb.org/browse/SERVER-69475)删除未使用的更新ConcurrentTotalTransactions()方法
- [服务器-69569](https://jira.mongodb.org/browse/SERVER-69569)Python脚本在Evergreen任务中失败
- [服务器-69611](https://jira.mongodb.org/browse/SERVER-69611)默认情况下设置-ffp-contract=off编译器选项
- [服务器-69693](https://jira.mongodb.org/browse/SERVER-69693)在分片协调员中使用lambda而不是重复代码
- [服务器-69707](https://jira.mongodb.org/browse/SERVER-69707)[SBE]带有$cond / $switch / $ifNull表达式的$group的未定义插槽错误
- [服务器-69785](https://jira.mongodb.org/browse/SERVER-69785)robustify change_streams_per_shard_cursor.js
- [服务器-69793](https://jira.mongodb.org/browse/SERVER-69793)在查询系统中禁用内存下流检查
- [服务器-69849](https://jira.mongodb.org/browse/SERVER-69849)[v6.0]删除FifoBasicMetrics单元测试
- [WT-9323](https://jira.mongodb.org/browse/WT-9323)修复比赛跟踪，树木在检查站后是否有更新
- [WT-9599](https://jira.mongodb.org/browse/WT-9599)获取热备份锁以调用块中的fallocate
- [WT-9763](https://jira.mongodb.org/browse/WT-9763)如果插入记录的时间窗口与历史记录存储时间窗口不匹配，请返回EBUSY
- [WT-9870](https://jira.mongodb.org/browse/WT-9870)修复在恢复期间更新旧时间戳时更新固定时间戳的问题



## 6.0.1 更改日志

### 分片

- [服务器-57519](https://jira.mongodb.org/browse/SERVER-57519)让ARS使用因果一致的ShardRegistry::getShard()函数
- [服务器-64340](https://jira.mongodb.org/browse/SERVER-64340)如果在排干碎片时平衡器被禁用，请警告
- [服务器-67457](https://jira.mongodb.org/browse/SERVER-67457)在联系参与者过程中中止的重新分片操作可能会在配置服务器主服务器上无限期停滞
- [服务器-67477](https://jira.mongodb.org/browse/SERVER-67477)确保在addShard上创建范围删除索引（仅限6.0）
- [服务器-67492](https://jira.mongodb.org/browse/SERVER-67492)失败的块迁移可能导致接收者碎片在主和次要之间有不同的config.transactions记录
- [服务器-67535](https://jira.mongodb.org/browse/SERVER-67535)move_chunk_large_chunk_map_workloads不再报告由于服务器日志记录更改而块迁移的定时分解
- [服务器-68431](https://jira.mongodb.org/browse/SERVER-68431)resharding_test_fixture不会为配置服务器的所有节点配置故障点

### 查询

- [服务器-63049](https://jira.mongodb.org/browse/SERVER-63049)跟踪ag蓄能器的使用情况
- [服务器-66072](https://jira.mongodb.org/browse/SERVER-66072)$匹配采样和$group聚合奇怪行为

### 集合

[服务器-68062](https://jira.mongodb.org/browse/SERVER-68062)使用$geoNear的多阶段聚合可能会违反约束。

### 构建和包装

[服务器-66808](https://jira.mongodb.org/browse/SERVER-66808)从更改流错误中删除未记录的字段

### 内部人员

- [服务器-61481](https://jira.mongodb.org/browse/SERVER-61481)删除dropIndexes命令的签到，一旦kLastLTS为6.0，集合没有进行索引构建
- [服务器-62857](https://jira.mongodb.org/browse/SERVER-62857)在多次降级时处理收件人的同迁移恢复
- [服务器-62969](https://jira.mongodb.org/browse/SERVER-62969)修复ocsp_unable_to_staple_log.js等待连接问题
- [服务器-64112](https://jira.mongodb.org/browse/SERVER-64112)一旦发布为EOL，立即停止运行适用的多版本测试
- [服务器-64242](https://jira.mongodb.org/browse/SERVER-64242)让collStats聚合阶段从BalancerStatisticsRegistry检索孤儿
- [服务器-64416](https://jira.mongodb.org/browse/SERVER-64416)让视图创建返回与集合创建相同的错误
- [服务器-65006](https://jira.mongodb.org/browse/SERVER-65006)commitIndexBuild oplog条目插入上的写入冲突可能导致无法设置多密钥
- [服务器-65262](https://jira.mongodb.org/browse/SERVER-65262)扩展使用WT数字时间戳API
- [服务器-65385](https://jira.mongodb.org/browse/SERVER-65385)在DEBUG/消毒器变体上禁用谷歌微基标的信号处理
- [服务器-65454](https://jira.mongodb.org/browse/SERVER-65454)重制的findAndModify请求可能会将日志/配置文件缓慢地记录到错误的命名空间
- [服务器-65657](https://jira.mongodb.org/browse/SERVER-65657)减少对oplog的cappedInsertNotifier的调用
- [服务器-65884](https://jira.mongodb.org/browse/SERVER-65884)来自时间序列的$lookup可以在相关$匹配后放置$sequentialCache
- [服务器-66023](https://jira.mongodb.org/browse/SERVER-66023)不要不断重置选举和活力计时器
- [服务器-66027](https://jira.mongodb.org/browse/SERVER-66027)加快租户迁移JS测试
- [服务器-66034](https://jira.mongodb.org/browse/SERVER-66034)backports_required_for_multiversion_tests.yml不会将租户迁移测试列入在多版本测试套件上运行的黑名单
- [服务器-66246](https://jira.mongodb.org/browse/SERVER-66246)优化租户迁移并发测试运行时
- [服务器-66247](https://jira.mongodb.org/browse/SERVER-66247)重构api_version jstests以将视图名称传递给assertViewSucceedsWithAPIStrict帮助程序
- [服务器-66308](https://jira.mongodb.org/browse/SERVER-66308)恢复“sbe”命令的视图测试，以满足多版本测试
- [服务器-66310](https://jira.mongodb.org/browse/SERVER-66310)让ExpressionSetUnion::isCommutative()整理意识到
- [服务器-66348](https://jira.mongodb.org/browse/SERVER-66348)添加kill_sessions标签以排除并发同时复制套件中的测试
- [服务器-66461](https://jira.mongodb.org/browse/SERVER-66461)在构建过程中更早地运行公证
- [服务器-66508](https://jira.mongodb.org/browse/SERVER-66508)解释csfle和mongocryptd之间的处理方式一致
- [服务器-66529](https://jira.mongodb.org/browse/SERVER-66529)更新oplogReadTimestamp的oplog管理器线程可以使用cappedTruncate进行比赛，操作后直接更新oplogReadTimestamp
- [服务器-66548](https://jira.mongodb.org/browse/SERVER-66548)$lookup顺序缓存可能会错误地将$facet视为无关
- [服务器-66651](https://jira.mongodb.org/browse/SERVER-66651)角色“恢复”不足以进行蒙古恢复 --preserveUUID
- [服务器-66658](https://jira.mongodb.org/browse/SERVER-66658)初始化前可以访问碎片注册表
- [服务器-66938](https://jira.mongodb.org/browse/SERVER-66938)大幅简化命令以生成忍者文件
- [服务器-66943](https://jira.mongodb.org/browse/SERVER-66943)不要对oplog.rs运行对collstats的孤儿聚合
- [服务器-66958](https://jira.mongodb.org/browse/SERVER-66958)在升级时处理潜在的多个“处理”范围删除
- [服务器-66970](https://jira.mongodb.org/browse/SERVER-66970)将EOL'd发布信息添加到mongo repo中
- [服务器-67006](https://jira.mongodb.org/browse/SERVER-67006)在 replsets/profile.js 中增加 DEBUG 断言消息的日志 vebosity
- [服务器-67122](https://jira.mongodb.org/browse/SERVER-67122)使用--module=ninja构建时添加警告，提示它被弃用
- [服务器-67188](https://jira.mongodb.org/browse/SERVER-67188)在Windows上将-large实例用于replica_sets_jscore_passthrough
- [服务器-67227](https://jira.mongodb.org/browse/SERVER-67227)如果collect collectionUUIDMismatch命令失败，UUID可以隐式创建集合
- [服务器-67259](https://jira.mongodb.org/browse/SERVER-67259)在ttl_deletes_not_targeting_orphaned_documents.js中更改 assert.soon的睡眠
- [服务器-67305](https://jira.mongodb.org/browse/SERVER-67305)无锁读取设置应验证设置快照之前和之后允许的写入。
- [服务器-67377](https://jira.mongodb.org/browse/SERVER-67377)检查混合版本集群中主碎片上的$lookup俯卧撑功能是否可用
- [服务器-67390](https://jira.mongodb.org/browse/SERVER-67390)backup_restore.js应该检查代码-SIGINT，因为SIGINT不干净
- [服务器-67395](https://jira.mongodb.org/browse/SERVER-67395)在macos-arm64上将sharding_update_v1_oplog_jscore_passthrough任务的超时增加到2.5小时
- [服务器-67408](https://jira.mongodb.org/browse/SERVER-67408)如果数据库不存在，CollectionUUIDM不匹配错误可以被隐藏
- [服务器-67418](https://jira.mongodb.org/browse/SERVER-67418)重试 SSLManagerApple 全局初始化
- [服务器-67422](https://jira.mongodb.org/browse/SERVER-67422)让所有RemovalFuturesForCoordinatorsForInternalTransactions等待TransactionCoordinator目录恢复
- [服务器-67428](https://jira.mongodb.org/browse/SERVER-67428)secondary_dryrun_vote_timeout.js应该在辅助上等待“投票支持导入收藏”日志消息
- [服务器-67430](https://jira.mongodb.org/browse/SERVER-67430)在fle2测试中修复标签并改进标签解析器
- [服务器-67462](https://jira.mongodb.org/browse/SERVER-67462)如果客户端具有正确的权限，则支持重命名加密集合
- [服务器-67486](https://jira.mongodb.org/browse/SERVER-67486)目录碎片POC中的“命令因配置过时而失败”失败
- [服务器-67523](https://jira.mongodb.org/browse/SERVER-67523)在延迟_timeout_callback中，必须清除_nextCall
- [服务器-67527](https://jira.mongodb.org/browse/SERVER-67527)将kills_random_sessions添加到concurrency_replication_for_export_import.yml
- [服务器-67532](https://jira.mongodb.org/browse/SERVER-67532)在OplogServerStatusSection中失败更少
- [服务器-67625](https://jira.mongodb.org/browse/SERVER-67625)Spike OIDC SASL机制谈判
- [服务器-67648](https://jira.mongodb.org/browse/SERVER-67648)[v6.0] 标记 timeseries_delete_hint.js 和 timeseries_update_hint.js with require_fcv_60
- [服务器-67683](https://jira.mongodb.org/browse/SERVER-67683)在快速和选择构建中更改一些模式
- [服务器-67690](https://jira.mongodb.org/browse/SERVER-67690)使用随机化测试顺序的mongo-task生成器
- [服务器-67700](https://jira.mongodb.org/browse/SERVER-67700)在搜索查询中，限制不会被推送到碎片
- [服务器-67717](https://jira.mongodb.org/browse/SERVER-67717)${suffix}未在推送任务中设置
- [服务器-67723](https://jira.mongodb.org/browse/SERVER-67723)SessionCatalogMongoD收割者可以中断仍在使用的可重试写入过期的内部事务会话
- [服务器-67800](https://jira.mongodb.org/browse/SERVER-67800)[6.0]从多版本套件中排除clustered_collection_*.js
- [服务器-67801](https://jira.mongodb.org/browse/SERVER-67801)createIndexes应该在config.transactions上处理空索引规格
- [服务器-67802](https://jira.mongodb.org/browse/SERVER-67802)蒙古计数不处理跳过的大值
- [服务器-67804](https://jira.mongodb.org/browse/SERVER-67804)[6.0]从多版本套件中排除dbstats.js
- [服务器-67845](https://jira.mongodb.org/browse/SERVER-67845)仅当目标未分片时，才在重命名“检查先决条件”阶段获取关键部分
- [服务器-67885](https://jira.mongodb.org/browse/SERVER-67885)在带上限集合上UUID不匹配的碎片收集将首先在无效选项中失败
- [服务器-67911](https://jira.mongodb.org/browse/SERVER-67911)累积器_fix_last_[continuous|lts].js中测试数据的随机分布可能会导致偶尔的测试失败
- [服务器-67917](https://jira.mongodb.org/browse/SERVER-67917)在FLE计数代码路径中使用DBDirectClient
- [服务器-67992](https://jira.mongodb.org/browse/SERVER-67992)在fle mongos crud处理中使用操作计时器跟踪器
- [服务器-68016](https://jira.mongodb.org/browse/SERVER-68016)使用小端子反序列化BufBuilder序列化的数据
- [服务器-68041](https://jira.mongodb.org/browse/SERVER-68041)Robustify merge_write_concern.js并添加诊断日志
- [服务器-68130](https://jira.mongodb.org/browse/SERVER-68130)AutoSplitVector可以生成比BSONObjMaxUserSize更大的响应
- [服务器-68158](https://jira.mongodb.org/browse/SERVER-68158)serverstatus_indexbulkbuilder.js应在创建索引后在主服务器上运行listIndexes
- [服务器-68184](https://jira.mongodb.org/browse/SERVER-68184)在checkWritesOfCommittedTxns中索引时使用Number而不是NumberLong
- [服务器-68193](https://jira.mongodb.org/browse/SERVER-68193)分层DDL协调员可以将自己锁定在distlock重试循环中
- [服务器-68196](https://jira.mongodb.org/browse/SERVER-68196)在排序然后分组时，BoundedSorter的内存使用无效。
- [服务器-68201](https://jira.mongodb.org/browse/SERVER-68201)将提交队列变体添加到发布分支的常青配置中
- [服务器-68209](https://jira.mongodb.org/browse/SERVER-68209)删除防止config.image_collection条目无效的uassert
- [服务器-68330](https://jira.mongodb.org/browse/SERVER-68330)[6.0]允许混合模式在config.transactions上写入
- [服务器-68354](https://jira.mongodb.org/browse/SERVER-68354)将范围删除任务标记为处理时，将 whenToClean 设置为现在
- [服务器-68363](https://jira.mongodb.org/browse/SERVER-68363)将5.3标记为EOL
- [服务器-68405](https://jira.mongodb.org/browse/SERVER-68405)在$group SBE阶段构建器中，$group的_id表达式中的任何内容都不应转换为空
- [服务器-68443](https://jira.mongodb.org/browse/SERVER-68443)InternalTransactionChunkMigrationTest和RetryableInternalTransactionTest夹具应重试所有瞬态错误的内部事务
- [服务器-68463](https://jira.mongodb.org/browse/SERVER-68463)[6.0] replsets/profile.js无法在 replica_sets_multiversion 套件中设置日志级别
- [服务器-68487](https://jira.mongodb.org/browse/SERVER-68487)添加BSONElement方法来检查NaN字段值
- [服务器-68511](https://jira.mongodb.org/browse/SERVER-68511)movePrimary可能会在MongoDB 5.0+中引入分片元数据不一致
- [服务器-68513](https://jira.mongodb.org/browse/SERVER-68513)_configsvrRunRestore命令应该使用未分片集合恢复数据库
- [服务器-68526](https://jira.mongodb.org/browse/SERVER-68526)使用mongo-task-generator为Windows、MacOS、Linux发行版组单独生成任务
- [服务器-68574](https://jira.mongodb.org/browse/SERVER-68574)切换到新的日志保存人集群
- [服务器-68653](https://jira.mongodb.org/browse/SERVER-68653)修复gcc上的编译
- [WT-9302](https://jira.mongodb.org/browse/WT-9302)在api_data.py中不建议使用object_target_size作为配置
- [WT-9311](https://jira.mongodb.org/browse/WT-9311)确保日志消息清楚地识别存储硬件损坏
- [WT-9432](https://jira.mongodb.org/browse/WT-9432)确保Evergreen构建版本有调试信息





原文：[6.0 Changelog](6.0 Changelog[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/6.0-changelog/#6.0-changelog))