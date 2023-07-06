# 6.1 更改日志

## 6.1.1 更改日志

### 安全

[服务器-70559](https://jira.mongodb.org/browse/SERVER-70559)标签FLE2测试，使它们不会与降级套件一起运行

### 分片

- [服务器-64730](https://jira.mongodb.org/browse/SERVER-64730)“forceShardFilteringMetadataRefresh”方法不同步
- [服务器-67891](https://jira.mongodb.org/browse/SERVER-67891)实现$shardedDataDistribution阶段的基本结构
- [服务器-68249](https://jira.mongodb.org/browse/SERVER-68249)在$shardedDataDistribution聚合阶段添加所需的权限
- [服务器-68361](https://jira.mongodb.org/browse/SERVER-68361)LogTransactionOperationsForShardingHandler::commit错过了从已准备和非准备的交易中传输文档，更改文档的分片密钥值
- [服务器-68932](https://jira.mongodb.org/browse/SERVER-68932)更新关于写入的分段关键部分指标
- [服务器-69134](https://jira.mongodb.org/browse/SERVER-69134)丢弃分片集合并不能摆脱CSS条目
- [服务器-69429](https://jira.mongodb.org/browse/SERVER-69429)collMod中缺少碎片密钥和唯一索引的检查
- [服务器-69444](https://jira.mongodb.org/browse/SERVER-69444)使并发关键部分的连接和刷新在DSS和CSS之间看起来相同
- [服务器-69575](https://jira.mongodb.org/browse/SERVER-69575)ShardingDataTransformInstanceMetrics单元测试套件不涵盖与累积指标的交互
- [服务器-69756](https://jira.mongodb.org/browse/SERVER-69756)中止时的分割故障ReshardCollection在reshardCollection cmd之后发布
- [服务器-69874](https://jira.mongodb.org/browse/SERVER-69874)记录或可能缓解碎片最终具有不同准备的独特和唯一索引设置的场景
- [服务器-70364](https://jira.mongodb.org/browse/SERVER-70364)重试网络错误的configureFailPoint命令（resharding_coordinator_recovers_abort_decision.js）
- [服务器-70793](https://jira.mongodb.org/browse/SERVER-70793)在进行X锁之前，先刷新数据库元数据，首先检查IS锁下的新元数据

### 查询

- [服务器-70190](https://jira.mongodb.org/browse/SERVER-70190)ExpressionSwitch::optimize()可以将表达式树置于无效状态，导致不变失败
- [服务器-70381](https://jira.mongodb.org/browse/SERVER-70381)_internalSearchIdLookup阶段违反了getOwnershipFilter函数的5.0先决条件

### 运营

[服务器-68548](https://jira.mongodb.org/browse/SERVER-68548)mongo shell版本4.4.15记录asio消息，尽管--安静的旗帜

### 构建和包装

- [服务器-48203](https://jira.mongodb.org/browse/SERVER-48203)支持Ninja构建的安装操作
- [服务器-69507](https://jira.mongodb.org/browse/SERVER-69507)Rpath只应在动态构建上设置

### 内部构件

- [服务器-63104](https://jira.mongodb.org/browse/SERVER-63104)使用带有功能标志标记的测试，使在本地重新运行jsCore变得容易
- [服务器-63811](https://jira.mongodb.org/browse/SERVER-63811)如果数据库不存在，mongos不会返回$文档的结果
- [服务器-64181](https://jira.mongodb.org/browse/SERVER-64181)删除SERVER-46669中列出的TODO
- [服务器-65575](https://jira.mongodb.org/browse/SERVER-65575)将buildscripts/clang_tidy.sh转换为python脚本
- [服务器-66834](https://jira.mongodb.org/browse/SERVER-66834)由defragmentation_util.js创建的区域必须始终与块对齐
- [服务器-66972](https://jira.mongodb.org/browse/SERVER-66972)数据库关键部分不会随着持续刷新而序列化
- [服务器-67681](https://jira.mongodb.org/browse/SERVER-67681)为编译命令创建特定目标
- [服务器-67898](https://jira.mongodb.org/browse/SERVER-67898)BalancerCollectionStatus返回会话集合的块大小错误
- [服务器-67926](https://jira.mongodb.org/browse/SERVER-67926)删除不存在的垃圾可收集租户迁移数据不应导致冲突进展错误
- [服务器-68157](https://jira.mongodb.org/browse/SERVER-68157)AuditEncryptionCompressionManager::encryptAndEncode应该会发出大BSON
- [服务器-68541](https://jira.mongodb.org/browse/SERVER-68541)并发删除碎片和移动Primary可能会删除未分片集合
- [服务器-68854](https://jira.mongodb.org/browse/SERVER-68854)修复调度票持有人中的死锁
- [服务器-68866](https://jira.mongodb.org/browse/SERVER-68866)drop_connections_replset需要等待配置传播。
- [服务器-68901](https://jira.mongodb.org/browse/SERVER-68901)如果文档包含2个具有相同名称的不同字段，则mongocryptd中的$elemMatch查询分析不正确
- [服务器-68921](https://jira.mongodb.org/browse/SERVER-68921)在timeeries_collmod.js中返回“InvalidNamespace”错误时处理多版本场景
- [服务器-69006](https://jira.mongodb.org/browse/SERVER-69006)为对冲读取添加更多跟踪以进行基本插入/更新/替换
- [服务器-69037](https://jira.mongodb.org/browse/SERVER-69037)SBE计划缓存大小计算略有偏差
- [服务器-69069](https://jira.mongodb.org/browse/SERVER-69069)InTel希望能够在数据大小的分发API中指定集合的子集
- [服务器-69108](https://jira.mongodb.org/browse/SERVER-69108)SCCL可以立即返回配置和管理元数据，而无需触发刷新
- [服务器-69109](https://jira.mongodb.org/browse/SERVER-69109)修复登录 random_moveChunk_index_operations FSM 测试
- [服务器-69133](https://jira.mongodb.org/browse/SERVER-69133)删除硬链接安装操作的冗余设置
- [服务器-69136](https://jira.mongodb.org/browse/SERVER-69136)测试应考虑平衡器收集状态可能会过早报告平衡器合规
- [服务器-69224](https://jira.mongodb.org/browse/SERVER-69224)SkipAuditEncCompManagerTest.EncryptAndEncodeLargePayloadSucceeds 当不支持GCM时
- [服务器-69281](https://jira.mongodb.org/browse/SERVER-69281)强制最小忍者版本
- [服务器-69348](https://jira.mongodb.org/browse/SERVER-69348)命令必须声明空的身份验证检查是通用可调用的
- [服务器-69353](https://jira.mongodb.org/browse/SERVER-69353)单独生成burn_in任务
- [服务器-69446](https://jira.mongodb.org/browse/SERVER-69446)增加选举TimeoutMillis injstests/replsets/dbcheck_write_concern.js
- [服务器-69465](https://jira.mongodb.org/browse/SERVER-69465)接受与$collStats相同的$_internalAllCollectionStats规格
- [SERVER-69590](https://jira.mongodb.org/browse/SERVER-69590)clang arm平台上的libunwind警告
- [服务器-69603](https://jira.mongodb.org/browse/SERVER-69603)不要将投放事件报告为shardCollection的一部分
- [服务器-69748](https://jira.mongodb.org/browse/SERVER-69748)在CurOp中错误地跟踪了“管道UsesLookup”字段
- [服务器-69765](https://jira.mongodb.org/browse/SERVER-69765)在darwin平台上关闭默认分裂矮星
- [服务器-69784](https://jira.mongodb.org/browse/SERVER-69784)修复签名字符误用的实例
- [服务器-69868](https://jira.mongodb.org/browse/SERVER-69868)启动关机的TransportLayer时返回错误
- [服务器-69877](https://jira.mongodb.org/browse/SERVER-69877)在启动恢复期间重新启动未完成的索引构建时，删除未盖章的目录写入
- [服务器-69898](https://jira.mongodb.org/browse/SERVER-69898)在刷新DB版本之前，请等待关键部分的追赶阶段
- [服务器-69912](https://jira.mongodb.org/browse/SERVER-69912)SConstruct可以错误地执行
- [服务器-69926](https://jira.mongodb.org/browse/SERVER-69926)errorcodes.py在MONGO_UNREACHABLE_TASSERT中检测不到重复错误
- [服务器-69930](https://jira.mongodb.org/browse/SERVER-69930)日志中试图刷新已删除数据库版本的意外错误消息
- [服务器-69944](https://jira.mongodb.org/browse/SERVER-69944)Resmoke的globstar.py在**之前没有正确解析*
- [服务器-70062](https://jira.mongodb.org/browse/SERVER-70062)在oplog滚动恢复失败中记录有关操作日志条目的相关信息
- [服务器-70181](https://jira.mongodb.org/browse/SERVER-70181)Ubuntu和Debian软件包测试在服务器主服务器中失败
- [服务器-70231](https://jira.mongodb.org/browse/SERVER-70231)覆盖率分析缺陷122778：使用移动物体
- [服务器-70274](https://jira.mongodb.org/browse/SERVER-70274)通过利用EOF过滤器提高更改流图像前清除作业的性能
- [服务器-70314](https://jira.mongodb.org/browse/SERVER-70314)调整时间序列扩展范围测试，以考虑日志保留限制
- [服务器-70348](https://jira.mongodb.org/browse/SERVER-70348)删除可查询WT的EAGAIN，并在内部重试
- [服务器-70361](https://jira.mongodb.org/browse/SERVER-70361)操作上下文等待应处理超出范围的持续时间
- [服务器-70436](https://jira.mongodb.org/browse/SERVER-70436)限制 isCoveredNullQuery 可以应用的情况
- [服务器-70469](https://jira.mongodb.org/browse/SERVER-70469)在看门狗测试中使用虚拟env python
- [服务器-70483](https://jira.mongodb.org/browse/SERVER-70483)更新Resmoke，将“evergreen_execution”传递给日志管理员。
- [服务器-70484](https://jira.mongodb.org/browse/SERVER-70484)从perf.yml和sys_perf.yml中删除信号处理模块
- [服务器-70602](https://jira.mongodb.org/browse/SERVER-70602)通过等待一些无操作平衡轮来处理错误的平衡器合规的报告
- [服务器-70657](https://jira.mongodb.org/browse/SERVER-70657)将NOMAS功能标志版本更新到6.0
- [服务器-70725](https://jira.mongodb.org/browse/SERVER-70725)如果获取路由信息失败，集群聚合可能会错误地导致CollectionUUIDM不匹配
- [服务器-70773](https://jira.mongodb.org/browse/SERVER-70773)在租户迁移收件人测试中跳过关于升级的重建实例
- [服务器-70774](https://jira.mongodb.org/browse/SERVER-70774)向发布项目添加定期构建
- [服务器-70834](https://jira.mongodb.org/browse/SERVER-70834)修复不使用scons缓存报告失败的任务
- [服务器-70864](https://jira.mongodb.org/browse/SERVER-70864)摆脱细粒度范围删除器锁
- [服务器-70879](https://jira.mongodb.org/browse/SERVER-70879)修复多个线程同时转动索引多键的竞赛
- [服务器-70893](https://jira.mongodb.org/browse/SERVER-70893)樱桃拾取上游SCons性能改进
- [服务器-71055](https://jira.mongodb.org/browse/SERVER-71055)OplogOrder测试在回滚oplog条目后可以读取陈旧的all_durable时间戳
- [服务器-71167](https://jira.mongodb.org/browse/SERVER-71167)txn_index_catalog_changes.js会话垃圾收集可以在一致性检查中使用fsync锁定死锁
- [服务器-71191](https://jira.mongodb.org/browse/SERVER-71191)索引构建设置、准备交易和降级之间的僵局
- [服务器-71424](https://jira.mongodb.org/browse/SERVER-71424)修复lint_fuzzer_sanity中的故障
- [服务器-71471](https://jira.mongodb.org/browse/SERVER-71471)改进jstestfuzz部署，以配合新的节点运行/安装
- [服务器-71473](https://jira.mongodb.org/browse/SERVER-71473)开始使用新的测试统计位置
- [服务器-71477](https://jira.mongodb.org/browse/SERVER-71477) Check '_internalAllCollectionStatsSpec.getStats()' exists (boost::optional) before calling 'makeStatsForNs' in 'document_source_internal_all_collection_stats.cpp'
- [服务器-71683](https://jira.mongodb.org/browse/SERVER-71683)租户迁移期间无界记忆增长
- [服务器-72021](https://jira.mongodb.org/browse/SERVER-72021)修复企业SLES 12 crypt_create_lib Evergreen故障
- [WT-9926](https://jira.mongodb.org/browse/WT-9926)从备份启动期间崩溃可能会丢失元数据
- [WT-10030](https://jira.mongodb.org/browse/WT-10030)具有快速截断儿童的内部页面不会主动释放
- [WT-10064](https://jira.mongodb.org/browse/WT-10064)不要驱逐非全局可见的已删除页面的内部页面，用于非独立构建
- [WT-10172](https://jira.mongodb.org/browse/WT-10172)mongodb-6.1上的标签RHEL PPC常青建筑商





原文：[6.1Changelog](https://www.mongodb.com/docs/upcoming/release-notes/6.1-changelog/)

