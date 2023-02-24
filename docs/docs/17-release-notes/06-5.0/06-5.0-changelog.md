# 5.0 更改日志

## 5.0.14 更改日志

### 分片

- [服务器-60143](https://jira.mongodb.org/browse/SERVER-60143)避免在元数据刷新失败后清除过滤元数据
- [服务器-68139](https://jira.mongodb.org/browse/SERVER-68139)如果投影排序大于100MB，则重新分片命令失败
- [服务器-68361](https://jira.mongodb.org/browse/SERVER-68361)LogTransactionOperationsForShardingHandler::commit错过了从更改文档碎片键值的准备和非准备的事务中传输文档
- [服务器-69134](https://jira.mongodb.org/browse/SERVER-69134)丢弃分片集合并不能摆脱CSS条目
- [服务器-69444](https://jira.mongodb.org/browse/SERVER-69444)使并发关键部分的连接和刷新在DSS和CSS之间看起来相同
- [服务器-69700](https://jira.mongodb.org/browse/SERVER-69700)复制回滚失败sresharding_coordinator_recovers_abort_decision.js
- [服务器-69756](https://jira.mongodb.org/browse/SERVER-69756)中止时的分割故障ReshardCollection在reshardCollection cmd之后发布
- [服务器-70364](https://jira.mongodb.org/browse/SERVER-70364)重试网络错误的configureFailPoint命令（resharding_coordinator_recovers_abort_decision.js）
- [服务器-70373](https://jira.mongodb.org/browse/SERVER-70373)如果不恢复分片指标，则不变失败
- [服务器-70793](https://jira.mongodb.org/browse/SERVER-70793)在进行X锁之前，先在IS锁下检查newmetadata，先刷新数据库元数据
- [服务器-71092](https://jira.mongodb.org/browse/SERVER-71092)shard_id_test.cpp依赖于std::string::compare函数的纯行为
- [服务器-71305](https://jira.mongodb.org/browse/SERVER-71305)遗留碎片收集路径等待错误的opTime被多数承诺（5.0及更早）

### 查询

- [服务器-66289](https://jira.mongodb.org/browse/SERVER-66289)$out错误地在v5.0.8上抛出BSONObj大小错误
- [服务器-70381](https://jira.mongodb.org/browse/SERVER-70381)_internalSearchIdLookup阶段违反了getOwnershipFilter函数的5.0先决条件

### 运营

[服务器-67793](https://jira.mongodb.org/browse/SERVER-67793)init.d中的log_progress_msg不会打印消息

### 构建和包装

- [服务器-48203](https://jira.mongodb.org/browse/SERVER-48203)支持Ninja构建的安装操作
- [服务器-64289](https://jira.mongodb.org/browse/SERVER-64289)平台支持：在5.0中添加对RHEL7 PPC的支持。十
- [服务器-69507](https://jira.mongodb.org/browse/SERVER-69507)Rpath只应在动态构建上设置

### 内部人员

- [服务器-54284](https://jira.mongodb.org/browse/SERVER-54284)ExceptionFor<ErrorCodes::WriteConflict>应解析为WriteConflictException
- [服务器-57072](https://jira.mongodb.org/browse/SERVER-57072)探索所有平台上的升级轮。
- [服务器-60016](https://jira.mongodb.org/browse/SERVER-60016)serverStatus和集合统计信息不应阻止RSTL锁
- [服务器-61185](https://jira.mongodb.org/browse/SERVER-61185)使用prefix_search进行唯一的索引查找
- [服务器-63104](https://jira.mongodb.org/browse/SERVER-63104)使用带有功能标志标记的测试，使在本地重新运行jsCore变得容易
- [服务器-63585](https://jira.mongodb.org/browse/SERVER-63585)当删除回滚和另一个事务删除相同的行时，Fastcount会不同步
- [服务器-66525](https://jira.mongodb.org/browse/SERVER-66525)errexit阻止捕获pip安装日志
- [服务器-66972](https://jira.mongodb.org/browse/SERVER-66972)数据库关键部分不会随着持续刷新而序列化
- [服务器-67385](https://jira.mongodb.org/browse/SERVER-67385)在对碎片主服务器上正在进行的范围完成查询之前，范围删除任务可能会被错误地安排
- [服务器-67538](https://jira.mongodb.org/browse/SERVER-67538)如果使用旧的、不兼容的快照，多文档事务应该会失败
- [服务器-67681](https://jira.mongodb.org/browse/SERVER-67681)为编译命令创建特定目标
- [服务器-68115](https://jira.mongodb.org/browse/SERVER-68115)修复了“elemMatchRootLength > 0”不变触发器的错误
- [服务器-68477](https://jira.mongodb.org/browse/SERVER-68477)改进过期后TTL索引参数的NaN处理
- [服务器-68901](https://jira.mongodb.org/browse/SERVER-68901)如果文档包含2个具有相同名称的不同字段，则mongocryptd中的$elemMatch查询分析不正确
- [服务器-69001](https://jira.mongodb.org/browse/SERVER-69001)初始同步应将minValid文档设置为“stopTimestamp”
- [服务器-69133](https://jira.mongodb.org/browse/SERVER-69133)删除硬链接安装操作的冗余设置
- [服务器-69281](https://jira.mongodb.org/browse/SERVER-69281)强制最小忍者版本
- [服务器-69348](https://jira.mongodb.org/browse/SERVER-69348)命令必须声明空的身份验证检查才能普遍调用
- [服务器-69380](https://jira.mongodb.org/browse/SERVER-69380)如果包含预测已被吸收，$_internalUnpackBucket阶段可能会错误地与$项目交换
- [服务器-69389](https://jira.mongodb.org/browse/SERVER-69389)命令checkAuthorization可能会为现有集合抛出ErrorCodes::NamespaceNotFound，同时尝试在节点关闭时将UUID重新解析为命名空间。
- [服务器-69446](https://jira.mongodb.org/browse/SERVER-69446)增加选举TimeoutMillis injstests/replsets/dbcheck_write_concern.js
- [服务器-69569](https://jira.mongodb.org/browse/SERVER-69569)Python脚本在Evergreen任务中失败
- [服务器-69784](https://jira.mongodb.org/browse/SERVER-69784)修复签名字符误用的实例
- [服务器-69868](https://jira.mongodb.org/browse/SERVER-69868)启动关机的TransportLayer时返回错误
- [服务器-69898](https://jira.mongodb.org/browse/SERVER-69898)在刷新DB版本之前，请等待关键部分的追赶阶段
- [服务器-69912](https://jira.mongodb.org/browse/SERVER-69912)SConstruct可以错误地执行
- [服务器-69926](https://jira.mongodb.org/browse/SERVER-69926)errorcodes.py在MONGO_UNREACHABLE_TASSERT中检测不到重复错误
- [服务器-69930](https://jira.mongodb.org/browse/SERVER-69930)日志中试图刷新已删除数据库版本的意外错误消息
- [服务器-70062](https://jira.mongodb.org/browse/SERVER-70062)在oplog滚动恢复失败中记录有关操作日志条目的相关信息
- [服务器-70160](https://jira.mongodb.org/browse/SERVER-70160)在$internalUnpackBucket之前，不要按下需要整个文档的$match
- [服务器-70299](https://jira.mongodb.org/browse/SERVER-70299)删除JSON.send命令用法
- [服务器-70314](https://jira.mongodb.org/browse/SERVER-70314)调整时间序列扩展范围测试，以考虑日志保留限制
- [服务器-70348](https://jira.mongodb.org/browse/SERVER-70348)删除可查询WT的EAGAIN，并在内部重试
- [服务器-70469](https://jira.mongodb.org/browse/SERVER-70469)在看门狗测试中使用虚拟env python
- [服务器-70483](https://jira.mongodb.org/browse/SERVER-70483)更新Resmoke，将“evergreen_execution”传递给日志管理员。
- [服务器-70484](https://jira.mongodb.org/browse/SERVER-70484)从perf.yml和sys_perf.yml中删除信号处理模块
- [服务器-70557](https://jira.mongodb.org/browse/SERVER-70557)在s90x上增加integration_tests_sharded的超时
- [服务器-70633](https://jira.mongodb.org/browse/SERVER-70633)制作每个碎片光标套件实际上在5.0中运行测试
- [服务器-70879](https://jira.mongodb.org/browse/SERVER-70879)修复多个线程同时转动索引多键的竞赛
- [服务器-71055](https://jira.mongodb.org/browse/SERVER-71055)OplogOrder测试在回滚oplog条目后可以读取陈旧的all_durable时间戳
- [WT-8234](https://jira.mongodb.org/browse/WT-8234)防止删除内部页面，同时调节可能引用其记忆的页页
- [WT-9323](https://jira.mongodb.org/browse/WT-9323)修复比赛跟踪，树木在检查站后是否有更新
- [WT-9599](https://jira.mongodb.org/browse/WT-9599)获取热备份锁以调用块管理器中的fallocate
- [WT-9763](https://jira.mongodb.org/browse/WT-9763)如果插入记录的时间窗口与历史记录存储时间窗口不匹配，请返回EBUSY



## 5.0.13 更改日志

### 分片

- [服务器-68094](https://jira.mongodb.org/browse/SERVER-68094)使用自定义生成的_id重新分片失败并出现投影错误
- [服务器-68139](https://jira.mongodb.org/browse/SERVER-68139)如果投影排序大于100MB，则重新分片命令失败
- [服务器-68869](https://jira.mongodb.org/browse/SERVER-68869)_configSvrReshardCollection的重试可能会成功导致resharding_coordinator_recovers_abort_decision.js失败
- [服务器-69142](https://jira.mongodb.org/browse/SERVER-69142)重试_shardsvrReshardCollection可能会导致DuplicateKey错误（resharding_nonblocking_coordinator_rebuild.js）
- [服务器-69220](https://jira.mongodb.org/browse/SERVER-69220)refineCollectionShardKey允许在基于范围和散列之间切换当前碎片密钥字段，导致数据不一致
- [服务器-69384](https://jira.mongodb.org/browse/SERVER-69384)修复implicitCreateIndex参数的v5.0传统碎片收集路径
- [服务器-69700](https://jira.mongodb.org/browse/SERVER-69700)复制回滚失败 resharding_coordinator_recovers_abort_decision.js

### 写入操作

[服务器-50454](https://jira.mongodb.org/browse/SERVER-50454)避免将“keyValue”字段发送给重复密钥错误的驱动程序

### 内部人员

- [服务器-58673](https://jira.mongodb.org/browse/SERVER-58673)启用 featureFlagPerShardCursor
- [服务器-60551](https://jira.mongodb.org/browse/SERVER-60551)连接时偶尔会收到“初始电线规格”
- [服务器-61185](https://jira.mongodb.org/browse/SERVER-61185)使用prefix_search进行唯一的索引查找
- [服务器-62400](https://jira.mongodb.org/browse/SERVER-62400)将$_passthroughToShard参数添加到AggregateCommandRequest
- [服务器-62681](https://jira.mongodb.org/browse/SERVER-62681)根据碎片光标直通套件创建更改流
- [服务器-62738](https://jira.mongodb.org/browse/SERVER-62738)赋予蒙古人通过特定碎片的能力
- [服务器-63772](https://jira.mongodb.org/browse/SERVER-63772)批处理后恢复令牌未从每个碎片光标更改流的初始批次发送
- [服务器-63773](https://jira.mongodb.org/browse/SERVER-63773)Per Shard cursor post batch resume token not set in get更多回复
- [服务器-63774](https://jira.mongodb.org/browse/SERVER-63774)通过可选的dbVersion来运行PipelineOnSpecificShard
- [服务器-63781](https://jira.mongodb.org/browse/SERVER-63781)$sortKey没有从后批处理恢复令牌中筛选出来
- [服务器-65006](https://jira.mongodb.org/browse/SERVER-65006)commitIndexBuild oplog条目插入上的写入冲突可能导致无法设置多密钥
- [服务器-66794](https://jira.mongodb.org/browse/SERVER-66794)为日期在1970-2038年以外的TS收藏添加记忆旗
- [服务器-67402](https://jira.mongodb.org/browse/SERVER-67402)线性读数偶尔可能会使用错误的读取源读取
- [服务器-67538](https://jira.mongodb.org/browse/SERVER-67538)如果在旧的、不兼容的快照上，多文档事务应该会失败
- [服务器-67650](https://jira.mongodb.org/browse/SERVER-67650)当操作日志应用程序尚未赶上oplog fetcher时，分片收件人可以返回剩余的OperationTimeEstimatedSecs=0
- [服务器-67653](https://jira.mongodb.org/browse/SERVER-67653)分段协调员可能会错误地得出结论，它可以启动关键部分，尽管在一个收件人上，oplog应用程序没有赶上oplog fetcher
- [服务器-67725](https://jira.mongodb.org/browse/SERVER-67725)检查碎片上的目录一致性作为重命名的先决条件
- [服务器-67916](https://jira.mongodb.org/browse/SERVER-67916)降级时的比赛可以在ReshardingMetrics中触发不变
- [服务器-68003](https://jira.mongodb.org/browse/SERVER-68003)使expitment_unified_ninja.vars成为默认值
- [服务器-68126](https://jira.mongodb.org/browse/SERVER-68126)在AutoSplitVector中检查负maxChunkSize输入值
- [服务器-68691](https://jira.mongodb.org/browse/SERVER-68691)$graphLookup不会报告“restrictSearchWithMatch”过滤器的变量引用
- [服务器-69002](https://jira.mongodb.org/browse/SERVER-69002)[5.0] backport pm-2419 通过mongos每个碎片光标
- [服务器-69108](https://jira.mongodb.org/browse/SERVER-69108)SCCL可以立即返回配置和管理元数据，而无需触发刷新
- [服务器-69547](https://jira.mongodb.org/browse/SERVER-69547)将multiversion_incompatible标签添加到show_raw_update_description*.js
- [服务器-69590](https://jira.mongodb.org/browse/SERVER-69590)叮当手臂平台上的libunwind警告
- [服务器-69611](https://jira.mongodb.org/browse/SERVER-69611)默认情况下设置-ffp-contract=off编译器选项
- [服务器-69693](https://jira.mongodb.org/browse/SERVER-69693)在分片协调员中使用lambda而不是重复代码
- [服务器-69785](https://jira.mongodb.org/browse/SERVER-69785)robustify change_streams_per_shard_cursor.js
- [WT-9870](https://jira.mongodb.org/browse/WT-9870)修复在恢复期间更新旧时间戳时更新固定时间戳的问题



## 5.0.12 更改日志

### 分片

- [服务器-63732](https://jira.mongodb.org/browse/SERVER-63732)将新的隐式CreateIndex和exlectionUniquenessCheck添加到shardCollection命令
- [服务器-64142](https://jira.mongodb.org/browse/SERVER-64142)添加新的 enforceUniqueness 来 refineCollectionShardKey 命令
- [服务器-68728](https://jira.mongodb.org/browse/SERVER-68728)添加中断的附加激活条件BeforeProcessingPrePostImageOriginatingOp故障点
- [服务器-68869](https://jira.mongodb.org/browse/SERVER-68869)_configSvrReshardCollection的重试可能会成功导致resharding_coordinator_recovers_abort_decision.js失败
- [服务器-69142](https://jira.mongodb.org/browse/SERVER-69142)重试_shardsvrReshardCollection可能会导致DuplicateKey错误（resharding_nonblocking_coordinator_rebuild.js）

### 复制

[服务器-62636](https://jira.mongodb.org/browse/SERVER-62636)setFeatureCompatibilityVersion 4.4在具有具有冲突选项的索引的5.0 binVersion上成功

### 内部人员

- [服务器-58176](https://jira.mongodb.org/browse/SERVER-58176)Mongos无法验证readConcern对插入/更新/删除命令
- [服务器-58966](https://jira.mongodb.org/browse/SERVER-58966)timeseries_granularity.js和timeseries_timestamp_rounding.js在并行套件中的测试命名空间上碰撞
- [服务器-59834](https://jira.mongodb.org/browse/SERVER-59834)带有 allowDiskUse 的 $group 无法清理 _tmp 文件
- [服务器-60958](https://jira.mongodb.org/browse/SERVER-60958)当发生降级事件时，避免服务器挂起块迁移
- [服务器-63843](https://jira.mongodb.org/browse/SERVER-63843)不允许在同步信号处理程序中进行递归doLog
- [服务器-63852](https://jira.mongodb.org/browse/SERVER-63852)getThreadName()不应该崩溃
- [服务器-64573](https://jira.mongodb.org/browse/SERVER-64573)使隐式创建索引和强制执行独特性检查字段可选
- [服务器-64741](https://jira.mongodb.org/browse/SERVER-64741)Create mongos appendOplogNote命令
- [服务器-65006](https://jira.mongodb.org/browse/SERVER-65006)commitIndexBuild oplog条目插入上的写入冲突可能导致无法设置多密钥
- [服务器-65382](https://jira.mongodb.org/browse/SERVER-65382)AutoSplitVector不应使用clientReadable对碎片键字段进行重新排序
- [服务器-66794](https://jira.mongodb.org/browse/SERVER-66794)为日期在1970-2038年以外的TS收藏添加记忆旗
- [服务器-67126](https://jira.mongodb.org/browse/SERVER-67126)从printStackTrace no-LOGV2代码路径中删除LOGV2调用
- [服务器-67280](https://jira.mongodb.org/browse/SERVER-67280)确保HealthObserver::periodicCheckImpl()实现处理异常，并在发生异常时返回适当的失败运行状况检查状态
- [服务器-67725](https://jira.mongodb.org/browse/SERVER-67725)检查碎片上的目录一致性作为重命名的先决条件
- [服务器-67814](https://jira.mongodb.org/browse/SERVER-67814)在服务器状态中跟踪日期在1970-2038年以外的时间序列集合数量
- [服务器-67939](https://jira.mongodb.org/browse/SERVER-67939)run_dbcheck_background.js应该对CappedPositionLost有弹性
- [服务器-68039](https://jira.mongodb.org/browse/SERVER-68039)MongoDB v5.0上的旧pymongo版本3.10.1导致对等体重置连接后不变故障（message.operation() == dbMsg）
- [服务器-68399](https://jira.mongodb.org/browse/SERVER-68399)修复在blackduck_hub.py中解析安全版本号的问题
- [服务器-68482](https://jira.mongodb.org/browse/SERVER-68482)[5.0]将TSAN排除添加到getFlowControlStats中
- [服务器-68538](https://jira.mongodb.org/browse/SERVER-68538)RPM配置中依赖项列表中的错别字强制在amazon linux 1中安装mongodb企业失败
- [服务器-68540](https://jira.mongodb.org/browse/SERVER-68540)为jscore测试添加docker_incompatible标签
- [服务器-68694](https://jira.mongodb.org/browse/SERVER-68694)调查紧凑型命令周围的锁定
- [服务器-68737](https://jira.mongodb.org/browse/SERVER-68737)从debian11 5.0中删除多版本测试
- [服务器-68766](https://jira.mongodb.org/browse/SERVER-68766)添加重新启用单值MapReduce优化的选项
- [服务器-68925](https://jira.mongodb.org/browse/SERVER-68925)在启动时重新引入检查表日志记录设置（恢复SERVER-43664）
- [服务器-69052](https://jira.mongodb.org/browse/SERVER-69052)在检查延长范围时，请确保存储桶收集有效
- [服务器-69141](https://jira.mongodb.org/browse/SERVER-69141)[6.1] 前进固定TSBS版本



## 5.0.11 更改日志

### 分片

- [服务器-56185](https://jira.mongodb.org/browse/SERVER-56185)调查会话迁移和块迁移关键部分的可能改进
- [服务器-61985](https://jira.mongodb.org/browse/SERVER-61985)resharding_coordinator_recovers_abort_decision.js可能会报告由于主碎片重试_configsvrReshardCollection并运行第二个分片操作而成功
- [服务器-64340](https://jira.mongodb.org/browse/SERVER-64340)如果在排干碎片时平衡器被禁用，请警告
- [服务器-67492](https://jira.mongodb.org/browse/SERVER-67492)失败的块迁移可能导致接收者碎片在主和次要之间有不同的config.transactions记录
- [服务器-68431](https://jira.mongodb.org/browse/SERVER-68431)resharding_test_fixture不会为配置服务器的所有节点配置故障点
- [服务器-68495](https://jira.mongodb.org/browse/SERVER-68495)重新分片配置了大量区域的集合可能会在配置服务器主服务器上无限期停滞
- [服务器-68628](https://jira.mongodb.org/browse/SERVER-68628)在主故障转移后重试失败的分片操作可能会导致服务器崩溃或写入丢失
- [服务器-68728](https://jira.mongodb.org/browse/SERVER-68728)添加中断的附加激活条件BeforeProcessingPrePostImageOriginatingOp故障点

### 查询

- [服务器-43155](https://jira.mongodb.org/browse/SERVER-43155)超过maxTimeMS的查询可能会返回NetworkInterfaceExceededTimeLimit
- [服务器-66072](https://jira.mongodb.org/browse/SERVER-66072)$匹配采样和$group聚合奇怪行为

### 构建和包装

- [服务器-61894](https://jira.mongodb.org/browse/SERVER-61894)支持更改流规格中的“showRawUpdateDescription”选项
- [服务器-63159](https://jira.mongodb.org/browse/SERVER-63159)实现$_internalApplyOplogUpdate聚合阶段

### 内部人员

- [服务器-60607](https://jira.mongodb.org/browse/SERVER-60607)改进地理索引版本的大/NaN值的处理
- [服务器-60958](https://jira.mongodb.org/browse/SERVER-60958)当发生降级事件时，避免服务器挂起块迁移
- [服务器-61321](https://jira.mongodb.org/browse/SERVER-61321)改进了文本索引版本对大/NaN值的处理
- [服务器-62747](https://jira.mongodb.org/browse/SERVER-62747)proxy_protocol_connect.js需要使用Docker容器的环回地址
- [服务器-65262](https://jira.mongodb.org/browse/SERVER-65262)扩展使用WT数字时间戳API
- [服务器-65884](https://jira.mongodb.org/browse/SERVER-65884)来自时间序列的$lookup可以在相关$匹配后放置$sequentialCache
- [服务器-66023](https://jira.mongodb.org/browse/SERVER-66023)不要不断重置选举和活力计时器
- [服务器-66310](https://jira.mongodb.org/browse/SERVER-66310)让ExpressionSetUnion::isCommutative()整理意识到
- [服务器-66548](https://jira.mongodb.org/browse/SERVER-66548)$lookup顺序缓存可能会错误地将$facet视为无关
- [服务器-66651](https://jira.mongodb.org/browse/SERVER-66651)角色“恢复”不足以进行蒙古恢复 --preserveUUID
- [服务器-66726](https://jira.mongodb.org/browse/SERVER-66726)修复killAllSessionsByPattern中的序列化
- [服务器-66841](https://jira.mongodb.org/browse/SERVER-66841)LOGV2：在反斜杠字符发生截断时无效的JSON
- [服务器-66938](https://jira.mongodb.org/browse/SERVER-66938)大幅简化命令以生成忍者文件
- [服务器-67122](https://jira.mongodb.org/browse/SERVER-67122)使用--module=ninja构建时添加警告，提示它被弃用
- [服务器-67296](https://jira.mongodb.org/browse/SERVER-67296)将用于提交块相关DDL操作的configsvr命令的OpCtx标记为可中断
- [服务器-67305](https://jira.mongodb.org/browse/SERVER-67305)无锁读取设置应验证设置快照之前和之后允许的写入。
- [服务器-67523](https://jira.mongodb.org/browse/SERVER-67523)在延迟_timeout_callback中，必须清除_nextCall
- [服务器-67532](https://jira.mongodb.org/browse/SERVER-67532)在OplogServerStatusSection中失败更少
- [服务器-67683](https://jira.mongodb.org/browse/SERVER-67683)在快速和选择构建中更改一些模式
- [服务器-67845](https://jira.mongodb.org/browse/SERVER-67845)仅当目标未分片时，才在重命名“检查先决条件”阶段获取关键部分
- [服务器-67939](https://jira.mongodb.org/browse/SERVER-67939)run_dbcheck_background.js应该对CappedPositionLost有弹性
- [服务器-68041](https://jira.mongodb.org/browse/SERVER-68041)Robustify merge_write_concern.js并添加诊断日志
- [服务器-68130](https://jira.mongodb.org/browse/SERVER-68130)AutoSplitVector可以生成比BSONObjMaxUserSize更大的响应
- [服务器-68158](https://jira.mongodb.org/browse/SERVER-68158)serverstatus_indexbulkbuilder.js应在创建索引后在主服务器上运行listIndexes
- [服务器-68184](https://jira.mongodb.org/browse/SERVER-68184)在checkWritesOfCommittedTxns中索引时使用Number而不是NumberLong
- [服务器-68193](https://jira.mongodb.org/browse/SERVER-68193)分层DDL协调员可以将自己锁定在distlock重试循环中
- [服务器-68487](https://jira.mongodb.org/browse/SERVER-68487)添加BSONElement方法来检查NaN字段值
- [服务器-68511](https://jira.mongodb.org/browse/SERVER-68511)movePrimary可能会在MongoDB 5.0+中引入分片元数据不一致
- [服务器-68522](https://jira.mongodb.org/browse/SERVER-68522)防止5.0二进制文件从配置错误的TTL索引的FCV 4.4中启动
- [服务器-68540](https://jira.mongodb.org/browse/SERVER-68540)为jscore测试添加docker_incompatible标签
- [服务器-68574](https://jira.mongodb.org/browse/SERVER-68574)切换到新的日志保存人集群
- [服务器-68737](https://jira.mongodb.org/browse/SERVER-68737)从debian11 5.0中删除多版本测试
- [WT-8847](https://jira.mongodb.org/browse/WT-8847)将墓碑添加到WT_SAVE_UPD，以便在页面恢复时截断更新列表
- [WT-9004](https://jira.mongodb.org/browse/WT-9004)修复更新恢复驱逐中的内存泄漏
- [WT-9302](https://jira.mongodb.org/browse/WT-9302)在api_data.py中不建议使用object_target_size作为配置
- [WT-9311](https://jira.mongodb.org/browse/WT-9311)确保日志消息清楚地识别存储硬件损坏
- [WT-9477](https://jira.mongodb.org/browse/WT-9477)不要允许检查点触发内部页面拆分，这会导致检查站内部页面损坏
- [WT-9500](https://jira.mongodb.org/browse/WT-9500)修复RTS使用单元格时间窗口而不是HS更新的键/值时间戳



## 5.0.10 更改日志

### 分片

- [服务器-57519](https://jira.mongodb.org/browse/SERVER-57519)让ARS使用因果一致的ShardRegistry::getShard()函数
- [服务器-62272](https://jira.mongodb.org/browse/SERVER-62272)向集合中添加模式验证可以防止失败文档的块迁移
- [服务器-62432](https://jira.mongodb.org/browse/SERVER-62432)确保安全访问ShardingDDLCoordinator实例状态文档
- [服务器-62656](https://jira.mongodb.org/browse/SERVER-62656)从mongos到shard-server连接池大小的分组mongos-to-config-server连接池大小
- [服务器-63243](https://jira.mongodb.org/browse/SERVER-63243)范围删除器不得以循环方式清理孤儿范围
- [服务器-64433](https://jira.mongodb.org/browse/SERVER-64433)一个新的拓扑时间可以闲聊，而不会被大多数人承诺
- [服务器-65027](https://jira.mongodb.org/browse/SERVER-65027)重新分片命令允许额外的选项而不返回错误
- [服务器-65821](https://jira.mongodb.org/browse/SERVER-65821)当有准备好的交易没有持续提交/侵权决策时，setFCV期间处于僵局
- [服务器-65925](https://jira.mongodb.org/browse/SERVER-65925)shardsvrCommitReshardCollection在加入时应该检查是否有瞬态错误
- [服务器-65930](https://jira.mongodb.org/browse/SERVER-65930)DDL协调员和重命名参与者初始检查点可能会出现DuplicateKey错误
- [服务器-66046](https://jira.mongodb.org/browse/SERVER-66046)当收件人在应用阶段出现碎片错误时，分片协调员不会自动中止分片操作
- [服务器-66618](https://jira.mongodb.org/browse/SERVER-66618)确保ReshardingCoordinator在resharding_coordinator_recovers_abort_decision.js中止
- [服务器-66866](https://jira.mongodb.org/browse/SERVER-66866)范围删除器在批处理之间等待，同时按住集合IX锁
- [服务器-67457](https://jira.mongodb.org/browse/SERVER-67457)在联系参与者过程中中止的重新分片操作可能会在配置服务器主服务器上无限期停滞

### JavaScript

[服务器-61234](https://jira.mongodb.org/browse/SERVER-61234)当服务器端JS函数直接返回时，基于JS对象的类型没有正确自动序列化

### 构建和包装

[服务器-66627](https://jira.mongodb.org/browse/SERVER-66627)反向移植安装开发核心目标

### 内部人员

- [服务器-57938](https://jira.mongodb.org/browse/SERVER-57938)当查询具有$geoIntersect和2dsphere索引时，跳过存储的GeoJSON的多边形验证
- [服务器-58257](https://jira.mongodb.org/browse/SERVER-58257)向presenable_connpool.js添加更好的诊断
- [服务器-59658](https://jira.mongodb.org/browse/SERVER-59658)改进日志记录，以反映等待复制的分片元数据刷新
- [服务器-61856](https://jira.mongodb.org/browse/SERVER-61856)将libunwind升级到1.6.2+
- [服务器-62386](https://jira.mongodb.org/browse/SERVER-62386)覆盖率分析缺陷121298：解析警告
- [服务器-62716](https://jira.mongodb.org/browse/SERVER-62716)在WaitForMajorityServiceTest中处理虚假完成WaitingForOneOpTime
- [服务器-63271](https://jira.mongodb.org/browse/SERVER-63271)server状态可能会使服务器失败
- [服务器-63493](https://jira.mongodb.org/browse/SERVER-63493)由于事务锁定超时，更新分键测试失败
- [服务器-63971](https://jira.mongodb.org/browse/SERVER-63971)在2PC事务后将服务器参数更改为默认读写行为
- [服务器-64215](https://jira.mongodb.org/browse/SERVER-64215)关闭时中断OplogBufferMock::waitForData
- [服务器-64244](https://jira.mongodb.org/browse/SERVER-64244)RunDBCheckInBackground应该能够抵御中断
- [服务器-64509](https://jira.mongodb.org/browse/SERVER-64509)修复ShardRegistry线程池关闭订单
- [服务器-64627](https://jira.mongodb.org/browse/SERVER-64627)初始同步后需要一般方法来处理内存状态
- [服务器-64628](https://jira.mongodb.org/browse/SERVER-64628)将节点添加到分片集的更多测试
- [服务器-64659](https://jira.mongodb.org/browse/SERVER-64659)在服务器中报告索引构建期间使用的文件描述符数量
- [服务器-64725](https://jira.mongodb.org/browse/SERVER-64725)使ShardRegistry::periodicReloader可中断
- [服务器-64797](https://jira.mongodb.org/browse/SERVER-64797)使用WT的新数字时间戳API
- [服务器-65100](https://jira.mongodb.org/browse/SERVER-65100)增加BSONColumn的内存块大小
- [服务器-65131](https://jira.mongodb.org/browse/SERVER-65131)禁用机会主义阅读定位（对冲读取除外）
- [服务器-65313](https://jira.mongodb.org/browse/SERVER-65313)在启动恢复期间使用BatchedCollectionCatalogWriter
- [服务器-65371](https://jira.mongodb.org/browse/SERVER-65371)在辅助节点上运行的MigrationSourceManager可能会跳闸不变
- [服务器-65399](https://jira.mongodb.org/browse/SERVER-65399)“commitIndexBuild”操作日志条目是未重新启动的未完成索引构建的禁止操作
- [服务器-65723](https://jira.mongodb.org/browse/SERVER-65723)添加可调参数以改善次要的批处理
- [服务器-65777](https://jira.mongodb.org/browse/SERVER-65777)"revokePrivilegesFromRole" param.ns 审计日志中缺少用户对象
- [服务器-65797](https://jira.mongodb.org/browse/SERVER-65797)在解析listIndexes之前，请删除内存中的无效索引规格
- [服务器-66087](https://jira.mongodb.org/browse/SERVER-66087)在启用线程之前调用curl_global_init
- [服务器-66111](https://jira.mongodb.org/browse/SERVER-66111)HTTPClient的Curl实现应尊重默认超时
- [服务器-66319](https://jira.mongodb.org/browse/SERVER-66319)dbcheck_no_history_on_secondary.js过早禁用dbCheck故障点
- [服务器-66379](https://jira.mongodb.org/browse/SERVER-66379)$or to $in 转换有缺陷
- [服务器-66384](https://jira.mongodb.org/browse/SERVER-66384)启用NINJA_BUILDDIR的命令行自定义
- [服务器-66418](https://jira.mongodb.org/browse/SERVER-66418)由于字符串顺序假设，依赖分析期间创建的不良投影
- [服务器-66433](https://jira.mongodb.org/browse/SERVER-66433)后端口截止日期等待重叠范围删除完成到v5.1之前的版本
- [服务器-66461](https://jira.mongodb.org/browse/SERVER-66461)在构建过程中更早地运行公证
- [服务器-66520](https://jira.mongodb.org/browse/SERVER-66520)将索引构建UUID添加到BackgroundOperationInProgress错误消息
- [服务器-66556](https://jira.mongodb.org/browse/SERVER-66556)在关机期间释放光标时防止潜在的竞争
- [服务器-66559](https://jira.mongodb.org/browse/SERVER-66559)将内部QueryMaxAddToSetBytes参数从32位扩展到64位
- [服务器-66658](https://jira.mongodb.org/browse/SERVER-66658)初始化前可以访问碎片注册表
- [服务器-66727](https://jira.mongodb.org/browse/SERVER-66727)可以创建违反最大时间跨度的时间序列桶
- [服务器-66769](https://jira.mongodb.org/browse/SERVER-66769)更新spawnhost设置脚本，通过cygwin支持Windows主机
- [服务器-66799](https://jira.mongodb.org/browse/SERVER-66799)修复ephemeralForTest上的 getParameterWithDetails.js故障
- [服务器-66843](https://jira.mongodb.org/browse/SERVER-66843)在DeadlineFuture析构函数中使用防御性编程
- [服务器-66860](https://jira.mongodb.org/browse/SERVER-66860)密克罗尼西亚联邦测试不应重用相同的数据库名称
- [服务器-66902](https://jira.mongodb.org/browse/SERVER-66902)mongodb-mongo-v5.0 Evergreen项目的多版本设置一直失败
- [服务器-66955](https://jira.mongodb.org/browse/SERVER-66955)删除perf项目中的JSON.send使用情况
- [服务器-67014](https://jira.mongodb.org/browse/SERVER-67014)在5.0中已弃用操作代码的警告消息中说“客户端驱动程序可能需要升级”
- [服务器-67106](https://jira.mongodb.org/browse/SERVER-67106)_flushRoutingTableCacheUpdates()命令也应该能够服务引用集合视图的请求。
- [服务器-67167](https://jira.mongodb.org/browse/SERVER-67167)在并行套件中运行的可Disable or_to_in.js
- [服务器-67220](https://jira.mongodb.org/browse/SERVER-67220)[5.0] set_fcv_prepared_transaction.js无法抵御 StaleConfig 错误
- [服务器-67405](https://jira.mongodb.org/browse/SERVER-67405)处理is_patch常青扩展的空字符串
- [服务器-67513](https://jira.mongodb.org/browse/SERVER-67513)为v5.0的jsCore_compatibility禁用or_to_in
- [WT-8425](https://jira.mongodb.org/browse/WT-8425)在hs_rec.c的out_of_order_ts_updates矢量中推送具有相同提交时间戳的更新。
- [WT-8669](https://jira.mongodb.org/browse/WT-8669)断言时间戳在__hs_insert_record中不是OOO
- [WT-9249](https://jira.mongodb.org/browse/WT-9249)如果开始耐用的时间戳大于oo时间戳，则对其进行比较和修复
- [WT-9251](https://jira.mongodb.org/browse/WT-9251)在元数据检查点之前进行日志刷新



## 5.0.9 更改日志

### 分片

- [服务器-62175](https://jira.mongodb.org/browse/SERVER-62175)Mongos未能为在_parseCommand中断的命令附加RetryableWrite错误标签
- [服务器-62432](https://jira.mongodb.org/browse/SERVER-62432)确保安全访问ShardingDDLCoordinator实例状态文档
- [服务器-64822](https://jira.mongodb.org/browse/SERVER-64822)分清空集合会过早地发布关键部分
- [服务器-66041](https://jira.mongodb.org/browse/SERVER-66041)块克隆器绝不能认为只有一份文件的块太大

### 查询

[服务器-63642](https://jira.mongodb.org/browse/SERVER-63642)添加serverStatus指标来衡量多规划性能

### 构建和包装

- [服务器-42470](https://jira.mongodb.org/browse/SERVER-42470)为libunwind生成其他配置
- [服务器-64332](https://jira.mongodb.org/browse/SERVER-64332)公证MongoDB为macos构建
- [服务器-66386](https://jira.mongodb.org/browse/SERVER-66386)更新AMI图像以进行软件包测试

### 内部人员

- [服务器-57546](https://jira.mongodb.org/browse/SERVER-57546)增加角色锁定获取的特定测试超时
- [服务器-58337](https://jira.mongodb.org/browse/SERVER-58337)收到OP_QUERY命令后，记录弃用警告和颠簸服务器状态计数器
- [服务器-60758](https://jira.mongodb.org/browse/SERVER-60758)防止dbVersion刷新在txn_recover_decision_using_recovery_router.js中失败的事务
- [服务器-61018](https://jira.mongodb.org/browse/SERVER-61018)创建通用直方图类型
- [服务器-61110](https://jira.mongodb.org/browse/SERVER-61110)修复授权中的锁定合同::包含
- [服务器-61460](https://jira.mongodb.org/browse/SERVER-61460)Resmoke应该将config_svr选项与mongod_options合并，而不是覆盖它们
- [服务器-62941](https://jira.mongodb.org/browse/SERVER-62941)更新FTDCServerStatusCommandCollector，以包含来自serverStatus命令的oplog指标
- [服务器-62992](https://jira.mongodb.org/browse/SERVER-62992)消除对resmoke.ini的需求
- [服务器-63254](https://jira.mongodb.org/browse/SERVER-63254)将索引使用指标添加到服务器状态
- [服务器-63796](https://jira.mongodb.org/browse/SERVER-63796)为PM-2750启用功能标志
- [服务器-63850](https://jira.mongodb.org/browse/SERVER-63850)将计数命令添加到API版本1
- [服务器-64664](https://jira.mongodb.org/browse/SERVER-64664)忍者工具不应考虑安装文件生成的源代码
- [服务器-64815](https://jira.mongodb.org/browse/SERVER-64815)防止buildindexes_false_commit_quorum.js在多版本测试中运行
- [服务器-65137](https://jira.mongodb.org/browse/SERVER-65137)屈服后刷新集合时检测命名空间更改
- [服务器-65166](https://jira.mongodb.org/browse/SERVER-65166)在bort_in_progress_transactions_on_step_up.js中使用比较优化
- [服务器-65184](https://jira.mongodb.org/browse/SERVER-65184)在downgrade_default_write_concern_majority.js中避免并发选举和降级
- [服务器-65271](https://jira.mongodb.org/browse/SERVER-65271)serverStatus应该允许细粒度指标排除
- [服务器-65636](https://jira.mongodb.org/browse/SERVER-65636)取消每个主机LDAP连接数量的限制
- [服务器-65861](https://jira.mongodb.org/browse/SERVER-65861)从5.0上的mh_variants中删除企业-rhel-83-s390x
- [服务器-65995](https://jira.mongodb.org/browse/SERVER-65995)减少老树枝上的常青克朗频率
- [服务器-66089](https://jira.mongodb.org/browse/SERVER-66089)初始同步应该与稍后的后ClusterTime一起读取交易表
- [服务器-66117](https://jira.mongodb.org/browse/SERVER-66117)在模拟libkrb5配置中禁用 qualify_shortname
- [WT-8250](https://jira.mongodb.org/browse/WT-8250)在test_wt7989_compact_checkpoint中增加压实后的最大预期可用空间
- [WT-8450](https://jira.mongodb.org/browse/WT-8450)在hs_cleanup_stress中报告统计数据，不要验证它们
- [WT-8481](https://jira.mongodb.org/browse/WT-8481)在测试附近拆分cppsuite搜索并更新其日志记录级别
- [WT-8622](https://jira.mongodb.org/browse/WT-8622)在恢复开始时阅读last_ckpt_base_write_gen
- [WT-8860](https://jira.mongodb.org/browse/WT-8860)在多集合测试中将mongod日志保存为测试工件
- [WT-9019](https://jira.mongodb.org/browse/WT-9019)在5.0上禁用循环复合性测试
- [WT-9029](https://jira.mongodb.org/browse/WT-9029)从WT_SESSION::create中删除object_target_size选项
- [WT-9044](https://jira.mongodb.org/browse/WT-9044)在mongodb-5.0上禁用代码覆盖度测量
- [WT-9054](https://jira.mongodb.org/browse/WT-9054)在format.sh中正确配置拆分应力选项
- [WT-9096](https://jira.mongodb.org/browse/WT-9096)修复了有时在密钥不存在时返回错误的键/值附近的搜索



## 5.0.8 更改日志

### 分片

- [服务器-62690](https://jira.mongodb.org/browse/SERVER-62690)在测试中完成排水之前，碎片正在关闭
- [服务器-65533](https://jira.mongodb.org/browse/SERVER-65533)使用{readConcern:available}的操作不将集合视为未粉碎

### 写入操作

[服务器-65261](https://jira.mongodb.org/browse/SERVER-65261)通过集合扫描报告从上限集合中删除错误删除的文档数量

### 构建和包装

[服务器-44074](https://jira.mongodb.org/browse/SERVER-44074)平台支持：添加企业RHEL 8（zSeries）

### 内部人员

- [服务器-55173](https://jira.mongodb.org/browse/SERVER-55173)WiredTigerSession::releaseCursor中的分割故障
- [服务器-56003](https://jira.mongodb.org/browse/SERVER-56003)忍者+带有不断变化的编译器的冰淇淋不会再生run-icecc.sh
- [服务器-56731](https://jira.mongodb.org/browse/SERVER-56731)考虑在较新的SLES 12服务包上运行服务器测试
- [服务器-58506](https://jira.mongodb.org/browse/SERVER-58506)命令公开服务器参数的可设置性
- [服务器-60105](https://jira.mongodb.org/browse/SERVER-60105)插入时间系列集合无法从任何操作计数器中观察到
- [服务器-60485](https://jira.mongodb.org/browse/SERVER-60485)在MigrationUtilExecutor上运行的任务不得等待关机完成
- [服务器-61032](https://jira.mongodb.org/browse/SERVER-61032)将/opt/mongodbtoolchain/gdb的所有引用转换为版本等效版本
- [服务器-61663](https://jira.mongodb.org/browse/SERVER-61663)动态将concurrency_metrics和concurrency_replication_metrics分解为较小的任务
- [服务器-61879](https://jira.mongodb.org/browse/SERVER-61879)刷新以恢复迁移绝不能加入正在进行的刷新
- [服务器-62205](https://jira.mongodb.org/browse/SERVER-62205)包括[auto]splitVector的最大块大小参数的理智检查
- [服务器-62229](https://jira.mongodb.org/browse/SERVER-62229)修复在re recoverFromOplogAsStandalone=true时应用索引构建条目时的不变问题
- [服务器-62299](https://jira.mongodb.org/browse/SERVER-62299)平台支持：添加对Debian 11的支持
- [服务器-63010](https://jira.mongodb.org/browse/SERVER-63010)确保拆包测量不会覆盖在元数据上计算的推送添加字段
- [服务器-63387](https://jira.mongodb.org/browse/SERVER-63387)StreamingCursor应该按照从WiredTiger备份光标检索的顺序返回备份块
- [服务器-63479](https://jira.mongodb.org/browse/SERVER-63479)在碎片环境中更正$$SEARCH_META禁令
- [服务器-63531](https://jira.mongodb.org/browse/SERVER-63531)commitQuorum错误地包括buildIndexes：false节点和错误消息错误地表示只有投票节点才有资格
- [服务器-63910](https://jira.mongodb.org/browse/SERVER-63910)概括此与关键部分相关的错误消息
- [服务器-64031](https://jira.mongodb.org/browse/SERVER-64031)serverStatus不应使用PBWM锁
- [服务器-64184](https://jira.mongodb.org/browse/SERVER-64184)跟踪 allowDiskUse:true in agg 命令的使用情况
- [服务器-64485](https://jira.mongodb.org/browse/SERVER-64485)使用_id确定extractUpdateType()中的更新类型
- [服务器-64554](https://jira.mongodb.org/browse/SERVER-64554)abortIndexBuild操作日志条目在使用--recoverFromOplogAsStandalone运行时没有效果
- [服务器-64732](https://jira.mongodb.org/browse/SERVER-64732)[v5.0] BSONColumn解压交错数组
- [服务器-64757](https://jira.mongodb.org/browse/SERVER-64757)改进了Windows上scons无法生成忍者时的错误消息
- [服务器-64983](https://jira.mongodb.org/browse/SERVER-64983)在TransactionParticipant::_resetTransactionState中回滚WT事务之前释放客户端锁
- [服务器-65024](https://jira.mongodb.org/browse/SERVER-65024)具有相同_id值的多个文档使reIndex不变
- [服务器-65032](https://jira.mongodb.org/browse/SERVER-65032)Pin python软件包BaseResponse for ocsp套件
- [服务器-65182](https://jira.mongodb.org/browse/SERVER-65182)修复split_horizon_hostname_startup.js在获取replsetconfig时使用assert.soon
- [服务器-65200](https://jira.mongodb.org/browse/SERVER-65200)软件包任务不是作为任务组的一部分运行的
- [服务器-65211](https://jira.mongodb.org/browse/SERVER-65211)使用扩展从当前分支获取二进制文件
- [服务器-65284](https://jira.mongodb.org/browse/SERVER-65284)创建集合协调员应始终对后续执行执行进行清理
- [服务器-65430](https://jira.mongodb.org/browse/SERVER-65430)在ephemeralForTest上禁用capped_deletes.js
- [服务器-65718](https://jira.mongodb.org/browse/SERVER-65718)修复mypy错误
- [WT-7662](https://jira.mongodb.org/browse/WT-7662)准备冲突超时的格式
- [WT-8260](https://jira.mongodb.org/browse/WT-8260)创建一个Python套件测试来验证新的EVENT_HANDLER JSON格式
- [WT-8708](https://jira.mongodb.org/browse/WT-8708)修复测试/检查点中的时间戳使用错误
- [WT-8924](https://jira.mongodb.org/browse/WT-8924)在行存储中检查冲突时，不要在磁盘时间窗口上检查是否有插入列表



## 5.0.7 更改日志

### 分片

- [服务器-60109](https://jira.mongodb.org/browse/SERVER-60109)确保在升级时恢复矢量时钟
- [服务器-61249](https://jira.mongodb.org/browse/SERVER-61249)refine_collection_shard_key_basic.js依赖于尽最大努力的刷新，这在故障转移的情况下可能不会发生
- [服务器-61444](https://jira.mongodb.org/browse/SERVER-61444)bumpCollectionVersionAndChangeMetadataInTxn的重新分片使用不是幂等的
- [服务器-61755](https://jira.mongodb.org/browse/SERVER-61755)迁移恢复应处理精炼的碎片密钥
- [服务器-62072](https://jira.mongodb.org/browse/SERVER-62072)_configsvrReshardCollection可以返回，而无需等待取消设置“reshardingFields”以复制到多数
- [服务器-62521](https://jira.mongodb.org/browse/SERVER-62521)使用DDL协调器时，分布式锁可能不会在特定错误时释放
- [服务器-62761](https://jira.mongodb.org/browse/SERVER-62761)[v5.0] receiveChunkWaitForRangeDeleterTimeoutMS正在4.4个二进制文件上传递
- [服务器-62906](https://jira.mongodb.org/browse/SERVER-62906)在createCollection/shardCollection路径中添加一个勾号，以验证集合名称长度
- [服务器-62907](https://jira.mongodb.org/browse/SERVER-62907)矢量时钟组件必须经受住CSRS非滚动重启
- [服务器-63722](https://jira.mongodb.org/browse/SERVER-63722)重命名集合参与者会遇到与降级/关机不同的错误
- [服务器-63742](https://jira.mongodb.org/browse/SERVER-63742)碎片中的默认拓扑时间可能导致碎片注册表中的无限刷新
- [服务器-64517](https://jira.mongodb.org/browse/SERVER-64517)可恢复关键部分在启动时无法正确恢复
- [服务器-64580](https://jira.mongodb.org/browse/SERVER-64580)在混合二进制文件碎片中分片集合时下台可能会使旧的二进制文件崩溃

### 复制

[服务器-54374](https://jira.mongodb.org/browse/SERVER-54374)signalOplogWaiters和StorageEngine::loadCatalog之间的比赛

### 查询

[服务器-40691](https://jira.mongodb.org/browse/SERVER-40691)$nin:[[],...]查询没有索引

### 运营

[服务器-21070](https://jira.mongodb.org/browse/SERVER-21070)添加收集集合统计信息的选项

### 内部人员

- [服务器-51456](https://jira.mongodb.org/browse/SERVER-51456)当发生写入冲突时，数据库概述器为删除操作输出错误的属性“keysDeleted”值
- [服务器-53993](https://jira.mongodb.org/browse/SERVER-53993)在AsyncCommandExecution测试中发布opCtx之前，先附加客户端链
- [服务器-56300](https://jira.mongodb.org/browse/SERVER-56300)向BSON obj和数组构建器添加附加范围功能
- [服务器-56558](https://jira.mongodb.org/browse/SERVER-56558)Robustify validate_db_metadata_command.js测试
- [服务器-56931](https://jira.mongodb.org/browse/SERVER-56931)仪器ASIO set_option故障更好
- [服务器-57662](https://jira.mongodb.org/browse/SERVER-57662)在刷新逻辑会话缓存之前，等待config.system.sessions集合存在于配置服务器上
- [服务器-58069](https://jira.mongodb.org/browse/SERVER-58069)ASSERT_THAT单元测试匹配器框架
- [服务器-58152](https://jira.mongodb.org/browse/SERVER-58152)为从集群拓扑中删除故障Mongos创建功能标志
- [服务器-58310](https://jira.mongodb.org/browse/SERVER-58310)当任务取消大约在收到排气网络响应的同时发生时，ThreadPoolTaskExecutor内存不安全
- [服务器-58499](https://jira.mongodb.org/browse/SERVER-58499)添加新的错误代码LoadBalancerSupportMismatch
- [服务器-59220](https://jira.mongodb.org/browse/SERVER-59220)ocsp_server_refresh.js中的连接探针应该使用新鲜的外壳
- [服务器-59223](https://jira.mongodb.org/browse/SERVER-59223)提高ecs scp的鲁棒性
- [服务器-59290](https://jira.mongodb.org/browse/SERVER-59290)增量配置版本后重新评估同步源
- [服务器-59356](https://jira.mongodb.org/browse/SERVER-59356)创建虚拟FaultManager单例、FaultStatus枚举和虚拟单元测试
- [服务器-59357](https://jira.mongodb.org/browse/SERVER-59357)为它创建虚拟故障类和虚拟单元测试
- [服务器-59358](https://jira.mongodb.org/browse/SERVER-59358)创建模拟故障的FaultFacet接口、模拟实现和单元测试运行模拟
- [服务器-59360](https://jira.mongodb.org/browse/SERVER-59360)创建HealthObserver接口、模拟实现和单元测试，调用模拟失败的定期检查
- [服务器-59361](https://jira.mongodb.org/browse/SERVER-59361)实施定期运行状况检查线程池
- [服务器-59362](https://jira.mongodb.org/browse/SERVER-59362)设置故障管理器状态机
- [服务器-59364](https://jira.mongodb.org/browse/SERVER-59364)在StartupCheck状态下成功进行一轮健康检查后，应该转移到OK状态
- [服务器-59365](https://jira.mongodb.org/browse/SERVER-59365)如果初始运行状况检查未成功完成，则不应过渡到OK状态
- [服务器-59366](https://jira.mongodb.org/browse/SERVER-59366)定期健康检查的进度监控
- [服务器-59367](https://jira.mongodb.org/browse/SERVER-59367)进入TransientFault状态时应该创建内存故障实例
- [服务器-59370](https://jira.mongodb.org/browse/SERVER-59370)在kActiveFaultDuration的瞬态故障状态下时，应该过渡到ActiveFault状态
- [服务器-59382](https://jira.mongodb.org/browse/SERVER-59382)执行不进入ActiveFault状态的非关键方面
- [服务器-59390](https://jira.mongodb.org/browse/SERVER-59390)应提供对配置服务器进行定期运行状况检查的能力
- [服务器-59397](https://jira.mongodb.org/browse/SERVER-59397)为健康检查期实施随机化
- [服务器-59496](https://jira.mongodb.org/browse/SERVER-59496)故障类应该是活动故障面的容器
- [服务器-59522](https://jira.mongodb.org/browse/SERVER-59522)HealthCheckStatus应该跟踪故障状态和生命周期
- [服务器-59567](https://jira.mongodb.org/browse/SERVER-59567)定期检查应调用观察者，模拟HealthObserver模拟故障
- [服务器-59608](https://jira.mongodb.org/browse/SERVER-59608)覆盖分析缺陷120502：解析警告
- [服务器-59912](https://jira.mongodb.org/browse/SERVER-59912)Ldap健康检查器的初始无操作脚手架
- [服务器-60079](https://jira.mongodb.org/browse/SERVER-60079)包含Ldap观察者通用模式的通用健康观察者代码
- [服务器-60316](https://jira.mongodb.org/browse/SERVER-60316)FaultManager应该从禁用定期检查开始
- [服务器-60412](https://jira.mongodb.org/browse/SERVER-60412)主机内存限制检查不尊重cgroups v2
- [服务器-60587](https://jira.mongodb.org/browse/SERVER-60587)实施FaultFacet
- [服务器-61016](https://jira.mongodb.org/browse/SERVER-61016)吞下在出站连接上创建ASIOSession时收到的与连接重置相关的错误。
- [服务器-61095](https://jira.mongodb.org/browse/SERVER-61095)改进transit_layer_asio_test.cpp
- [服务器-61104](https://jira.mongodb.org/browse/SERVER-61104)Robustify find_and_modify_invalid_query_params.js
- [服务器-61220](https://jira.mongodb.org/browse/SERVER-61220)进度监视器的集成测试
- [服务器-61315](https://jira.mongodb.org/browse/SERVER-61315)Ldap运行状况检查执行器应该支持中止的任务
- [服务器-61368](https://jira.mongodb.org/browse/SERVER-61368)FaultManager测试套件应使用真正的线程池
- [服务器-61438](https://jira.mongodb.org/browse/SERVER-61438)在health_observer_test.cpp中修复比赛
- [服务器-61490](https://jira.mongodb.org/browse/SERVER-61490)transport_layer_test：asio connect race
- [服务器-61592](https://jira.mongodb.org/browse/SERVER-61592)使用ms精度查询不会返回预期结果（TS集合）
- [服务器-61662](https://jira.mongodb.org/browse/SERVER-61662)SCons配置检查应始终以冗差运行
- [服务器-61706](https://jira.mongodb.org/browse/SERVER-61706)确保新配置已到达cluster_x509_rotate中的所有节点
- [服务器-61769](https://jira.mongodb.org/browse/SERVER-61769)尝试在分片集群上的事务中运行$out或$merge的聚合会使空闲光标打开
- [服务器-61871](https://jira.mongodb.org/browse/SERVER-61871)使用tassert进行状态机程序员错误
- [服务器-61872](https://jira.mongodb.org/browse/SERVER-61872)在FaultManager中修复线程池饥饿
- [服务器-61873](https://jira.mongodb.org/browse/SERVER-61873)LDAP运行时参数
- [服务器-61914](https://jira.mongodb.org/browse/SERVER-61914)将故障面详细信息添加到FaultImpl::toBSON
- [服务器-61921](https://jira.mongodb.org/browse/SERVER-61921)FaultManager中noSSL模式下的链接失败
- [服务器-61956](https://jira.mongodb.org/browse/SERVER-61956)修复访问状态机状态时的数据竞赛
- [服务器-61977](https://jira.mongodb.org/browse/SERVER-61977)并发回滚和stepUp可能会导致节点在上次应用之前从时间戳中获取，一旦它下降。
- [服务器-62017](https://jira.mongodb.org/browse/SERVER-62017)默认情况下在sys-perf所有功能标志变体中启用所有功能标志
- [服务器-62084](https://jira.mongodb.org/browse/SERVER-62084)FaultFacetType的序列化器坏了
- [服务器-62085](https://jira.mongodb.org/browse/SERVER-62085)在验证中使用更多位进行hashedMultikeyMetadataPaths
- [服务器-62096](https://jira.mongodb.org/browse/SERVER-62096)/proc/<id>/smaps不可用
- [服务器-62098](https://jira.mongodb.org/browse/SERVER-62098)在 fault_manager.cpp 中具有互斥体的 Guard healthCheckContexts
- [服务器-62192](https://jira.mongodb.org/browse/SERVER-62192)处理因隐式分片访问集合而禁用的功能标志
- [服务器-62242](https://jira.mongodb.org/browse/SERVER-62242)$indexOfArray不适用于数组中的重复值
- [服务器-62285](https://jira.mongodb.org/browse/SERVER-62285)验证缓存添加推送失败调试消息
- [服务器-62368](https://jira.mongodb.org/browse/SERVER-62368)范围删除器必须尊重范围删除器批量延迟MS
- [服务器-62379](https://jira.mongodb.org/browse/SERVER-62379)修复stepUp上的ReplicationCoordinator和BackgroundSync之间的死锁
- [服务器-62466](https://jira.mongodb.org/browse/SERVER-62466)_lastTransitionTime在FaultManager中的统计字段永远不会更改
- [服务器-62511](https://jira.mongodb.org/browse/SERVER-62511)在dbcheck_no_history_on_secondary.js中比赛
- [服务器-62513](https://jira.mongodb.org/browse/SERVER-62513)RunDBCheckInBackground应该重试中断错误
- [服务器-62514](https://jira.mongodb.org/browse/SERVER-62514)dbcheck_write_concern.js应该防止主服务器下台
- [服务器-62569](https://jira.mongodb.org/browse/SERVER-62569)IDL兼容性检查器脚本无法正确处理数组类型
- [服务器-62651](https://jira.mongodb.org/browse/SERVER-62651)默认添加启用所有功能标志，以默认启用所有功能标志到微基标项目。
- [服务器-62668](https://jira.mongodb.org/browse/SERVER-62668)在OperationContext中同步对ImpersonatedUserMetadata的访问。
- [服务器-62680](https://jira.mongodb.org/browse/SERVER-62680)验证缓存制作本地tmp，以确保成功复制
- [服务器-62682](https://jira.mongodb.org/browse/SERVER-62682)PrimaryOnlyService不会调用_rebuildCV.notify_all()，导致无法触发对waitForCondition或Interrupt的调用
- [服务器-62712](https://jira.mongodb.org/browse/SERVER-62712)验证缓存将缓存错误隔离为仅缓存调试日志文件
- [服务器-62876](https://jira.mongodb.org/browse/SERVER-62876)停止测试带有上限集合的租户迁移
- [服务器-62948](https://jira.mongodb.org/browse/SERVER-62948)确保FTDC收集器没有读取时间戳
- [服务器-63010](https://jira.mongodb.org/browse/SERVER-63010)确保拆包测量不会覆盖在元数据上计算的推送添加字段
- [服务器-63073](https://jira.mongodb.org/browse/SERVER-63073)修复shard_removal_triggers_catalog_cache_invalidation.js中的ShardNotFound处理
- [服务器-63079](https://jira.mongodb.org/browse/SERVER-63079)避免在$setWindowFields中使用投影解析器
- [服务器-63097](https://jira.mongodb.org/browse/SERVER-63097)stepdown_race_with_transaction.js应使用“uses_transactions”标签。
- [服务器-63141](https://jira.mongodb.org/browse/SERVER-63141)$lookup/$redact/$let行为与管道优化的差异
- [服务器-63197](https://jira.mongodb.org/browse/SERVER-63197)Pin microbenchmarks genny版本
- [服务器-63201](https://jira.mongodb.org/browse/SERVER-63201)在applyOps命令中放松删除操作的限制。
- [服务器-63203](https://jira.mongodb.org/browse/SERVER-63203)如果发现超过8192个分叉点，分块器永远不会分裂
- [服务器-63214](https://jira.mongodb.org/browse/SERVER-63214)当图像集合之间的集合哈希不匹配时，忽略整个dbs之间的哈希不一致
- [服务器-63234](https://jira.mongodb.org/browse/SERVER-63234)更好的日志记录来解释LDAP健康检查松弛度
- [服务器-63239](https://jira.mongodb.org/browse/SERVER-63239)不要在空范围内在AutoSplitVector中抛出异常
- [服务器-63240](https://jira.mongodb.org/browse/SERVER-63240)clearJumboFlag可能会以错误的格式保留块版本
- [服务器-63250](https://jira.mongodb.org/browse/SERVER-63250)修复隐式分片时间序列集合功能标志检查
- [服务器-63279](https://jira.mongodb.org/browse/SERVER-63279)将谓词推到时间序列上，元字段过去的拆包可能会导致不正确的结果
- [服务器-63288](https://jira.mongodb.org/browse/SERVER-63288)为可查询的http调用添加调试日志消息
- [服务器-63417](https://jira.mongodb.org/browse/SERVER-63417)当已知节点处于停机状态时，Oplog fetcher不应重试
- [服务器-63428](https://jira.mongodb.org/browse/SERVER-63428)Robustify oplog应用代码进行更新操作
- [服务器-63432](https://jira.mongodb.org/browse/SERVER-63432)将大文件传输到回购协议
- [服务器-63471](https://jira.mongodb.org/browse/SERVER-63471)waitForPrimaryOnlyServices在no_disconnect_on_stepdown.js中测试stepDown之前完成重建
- [服务器-63497](https://jira.mongodb.org/browse/SERVER-63497)修复冰淇淋调试
- [服务器-63505](https://jira.mongodb.org/browse/SERVER-63505)确保仲裁员识别rollback_views.js中的主节点
- [服务器-63512](https://jira.mongodb.org/browse/SERVER-63512)在心跳重新配置时使用优化的（无自调用）重新配置
- [服务器-63531](https://jira.mongodb.org/browse/SERVER-63531)commitQuorum错误消息错误地表示只有投票节点才有资格
- [服务器-63646](https://jira.mongodb.org/browse/SERVER-63646)_raise_if_unsafe_exit使用错误的return_code
- [服务器-63859](https://jira.mongodb.org/browse/SERVER-63859)禁止在视图上过期后秒的collMod
- [服务器-63876](https://jira.mongodb.org/browse/SERVER-63876)[5.0]使用index.expireAfterSeconds选项应用collMod时，辅助节点崩溃
- [服务器-63968](https://jira.mongodb.org/browse/SERVER-63968)禁止在$external数据库上列举内置角色
- [服务器-63974](https://jira.mongodb.org/browse/SERVER-63974)其危险python依赖性的别针版本
- [服务器-63986](https://jira.mongodb.org/browse/SERVER-63986)不允许 4.x 运行 update_with_dollar_fields.js
- [服务器-64182](https://jira.mongodb.org/browse/SERVER-64182)重新启用健康检查应检查是否已经安排了另一次待处理检查
- [服务器-64304](https://jira.mongodb.org/browse/SERVER-64304)使用--recoverFromOplogAsStandalone可能会导致索引构建崩溃服务器
- [服务器-64369](https://jira.mongodb.org/browse/SERVER-64369)不得允许从FCV 4.4中的上限集合中删除
- [服务器-64403](https://jira.mongodb.org/browse/SERVER-64403)使用SORT_MERGE整理-编码缺失的排序属性查找查询
- [服务器-64555](https://jira.mongodb.org/browse/SERVER-64555)[5.0]允许存在新的唯一索引数据格式
- [WT-7922](https://jira.mongodb.org/browse/WT-7922)处理丢失的WiredTiger版本文件
- [WT-7954](https://jira.mongodb.org/browse/WT-7954)在test_tiered04中使用更长的flush_tier超时
- [WT-8074](https://jira.mongodb.org/browse/WT-8074)如果将内容插入历史记录失败，则对和解时会惊慌失措
- [WT-8149](https://jira.mongodb.org/browse/WT-8149)更新元数据打捞csuite测试，以处理打捞表元数据，而无需打捞文件元数据
- [WT-8198](https://jira.mongodb.org/browse/WT-8198)将批量负载光标切换到划痕缓冲区
- [WT-8320](https://jira.mongodb.org/browse/WT-8320)选择从历史商店恢复的更新，无论可见性如何
- [WT-8362](https://jira.mongodb.org/browse/WT-8362)当OOO墓碑写入数据存储时，删除或重写密钥的HS条目
- [WT-8417](https://jira.mongodb.org/browse/WT-8417)在01 cpp附近搜索并发性时进行重组断言测试
- [WT-8422](https://jira.mongodb.org/browse/WT-8422)如果磁盘上的单元格已过时，请清除磁盘单元格时间窗口
- [WT-8424](https://jira.mongodb.org/browse/WT-8424)在小端使用一致的工具链
- [WT-8477](https://jira.mongodb.org/browse/WT-8477)在我们的常青测试中强制使用Pymongo 3.12.2
- [WT-8598](https://jira.mongodb.org/browse/WT-8598)避免在关机时始终清理检查站
- [WT-8605](https://jira.mongodb.org/browse/WT-8605)禁用Evergreen中非开发分支的perf测试
- [WT-8649](https://jira.mongodb.org/browse/WT-8649)除非重置或关闭，否则WT_SESSION方法无法释放划痕缓冲区
- [WT-8743](https://jira.mongodb.org/browse/WT-8743)配置hs_cleanup配置以减少缓存的压力
- [WT-8753](https://jira.mongodb.org/browse/WT-8753)回滚内存、准备就绪、对账更新时添加墓碑
- [WT-8799](https://jira.mongodb.org/browse/WT-8799)在mongodb-5.0上禁用文档更新
- [WT-8874](https://jira.mongodb.org/browse/WT-8874)在mongodb-5.0上禁用兼容性测试
- [WT-8879](https://jira.mongodb.org/browse/WT-8879)当所选墓碑全局可见时，设置OOO标志
- [WT-8894](https://jira.mongodb.org/browse/WT-8894)找到通往mongod可执行文件的路径进行多集合测试



## 5.0.6 更改日志

### 分片

- [服务器-45149](https://jira.mongodb.org/browse/SERVER-45149)txn_two_phase_commit_failover.js中的replSetStepDown命令不应超时
- [服务器-56127](https://jira.mongodb.org/browse/SERVER-56127)如果块被迁移，并且分键模式使用嵌套字段，可重试更新可能会执行多次
- [服务器-56227](https://jira.mongodb.org/browse/SERVER-56227)添加面向用户的命令，将分片集合的允许移民设置为false
- [服务器-58622](https://jira.mongodb.org/browse/SERVER-58622)删除协调员文档时，DDL协调员处理写入问题错误
- [服务器-60624](https://jira.mongodb.org/browse/SERVER-60624)txn_commit_optimizations_for_read_only_shards.js暂停在协调员上的复制，并可能使事务卡在准备中
- [服务器-60682](https://jira.mongodb.org/browse/SERVER-60682)事务协调员可能会阻止获取WiredTiger写票以坚持其决定，延长交易处于准备状态
- [服务器-60860](https://jira.mongodb.org/browse/SERVER-60860)ReshardingCollectionCloner在最接近时使用主读取首选项
- [服务器-61003](https://jira.mongodb.org/browse/SERVER-61003)ReadConcernMajorityNotAvailable但必须重审来自ShardRegistry的错误
- [服务器-61105](https://jira.mongodb.org/browse/SERVER-61105)移动期间的会话迁移逻辑Chunk污染了日志
- [服务器-61268](https://jira.mongodb.org/browse/SERVER-61268)修复在次要版本上发布可恢复的关键部分
- [服务器-61416](https://jira.mongodb.org/browse/SERVER-61416)无限期重试重命名协调员中的错误
- [服务器-61459](https://jira.mongodb.org/browse/SERVER-61459)ShardingCatalogManager::assignKeyRangeToZone()在配置服务器主服务器上本地运行时读取过时的CollectionType版本
- [服务器-61461](https://jira.mongodb.org/browse/SERVER-61461)update_shard_key_doc_moves_shards.js因次要虚假刷新而失败
- [服务器-61628](https://jira.mongodb.org/browse/SERVER-61628)当numDeleted < numDocsToRemovePerBatch时，请勿重新安排范围删除任务
- [服务器-61637](https://jira.mongodb.org/browse/SERVER-61637)审查范围删除器批处理策略
- [服务器-61689](https://jira.mongodb.org/browse/SERVER-61689)ActiveMigrationsRegistry::lock方法无法正确处理其异常
- [服务器-61759](https://jira.mongodb.org/browse/SERVER-61759)取消设置允许迁移标志应该中止正在进行的迁移
- [服务器-61816](https://jira.mongodb.org/browse/SERVER-61816)cancel_coordinate_txn_commit_with_tickets_exhausted.js由于交易收割者和事务协调员之间的竞争条件可以永远挂起
- [服务器-61945](https://jira.mongodb.org/browse/SERVER-61945)当“最近”的读取首选项选择次要时，使用NamespaceNotSharded重新分片集合克隆可能会失败
- [服务器-61950](https://jira.mongodb.org/browse/SERVER-61950)ReshardingOplogFetcher不间断地等待网络请求完成，这可能会阻止碎片升级完成
- [服务器-61976](https://jira.mongodb.org/browse/SERVER-61976)[重新分片]碎片在升级后刷新碎片版本时可能会出错，从而阻碍重新分片操作
- [服务器-62065](https://jira.mongodb.org/browse/SERVER-62065)从3.6升级到4.0的路径可以在碎片上留下没有历史记录的大块条目
- [服务器-62171](https://jira.mongodb.org/browse/SERVER-62171)在sharding_statistics_server_status.js中将日志添加到runConcurrentMoveChunk的输出中
- [服务器-62178](https://jira.mongodb.org/browse/SERVER-62178)如果收件人主服务器在创建临时分片集合之前失败，则使用NamespaceNotSharded重新分片可能会失败
- [服务器-62207](https://jira.mongodb.org/browse/SERVER-62207)由于错误的BSON对象寿命不正确，具有小maxTimeMS的ReshardCollection可能会崩溃碎片
- [服务器-62245](https://jira.mongodb.org/browse/SERVER-62245)迁移恢复绝不能假设只需要恢复一次迁移
- [服务器-62296](https://jira.mongodb.org/browse/SERVER-62296)MoveChunk在开始新的迁移之前应该恢复任何未完成的迁移

### 复制

[服务器-59721](https://jira.mongodb.org/browse/SERVER-59721)执行回滚到稳定时间戳后，节点可能无法与其他成员同步

### 查询

* [服务器-57588](https://jira.mongodb.org/browse/SERVER-57588)当值为数组的数组位置被索引时，查询结果不一致

- [服务器-59754](https://jira.mongodb.org/browse/SERVER-59754)对于共享相同$lookup形状的操作，queryHash/planCacheKey的日志记录不正确
- [服务器-62147](https://jira.mongodb.org/browse/SERVER-62147)当需要多个getMore批处理时，使用OP_QUERY协议的排气查询会中断

### 储存

- [服务器-30846](https://jira.mongodb.org/browse/SERVER-30846)在FSM测试中运行dbCheck作为后台工作负载
- [服务器-55483](https://jira.mongodb.org/browse/SERVER-55483)添加一个新的启动参数，跳过验证表日志设置
- [服务器-58409](https://jira.mongodb.org/browse/SERVER-58409)Startup RecordId初始化存在缺陷，具有持久的历史记录和重建准备好的交易

### 运营

[服务器-28953](https://jira.mongodb.org/browse/SERVER-28953)在FTDC中捕获df（磁盘完整）统计数据

### 内部人员

- [服务器-49748](https://jira.mongodb.org/browse/SERVER-49748)初始同步应在任何其他集合之前克隆admin.system.version
- [服务器-54468](https://jira.mongodb.org/browse/SERVER-54468)启用功能标志，以最大限度地支持分片时间序列集合
- [服务器-56167](https://jira.mongodb.org/browse/SERVER-56167)保证悬挂分析仪至少收集碎片集群的核心转储
- [服务器-57037](https://jira.mongodb.org/browse/SERVER-57037)提高操作员计数器的精度
- [服务器-57092](https://jira.mongodb.org/browse/SERVER-57092)使用JS跑步者重新吸烟套件的真实测试名称
- [服务器-57289](https://jira.mongodb.org/browse/SERVER-57289)编辑不应该将BSONArray转换为BSONObj
- [服务器-57312](https://jira.mongodb.org/browse/SERVER-57312)固定传递Python依赖项，并使用固定文件在Evergreen中安装
- [服务器-57772](https://jira.mongodb.org/browse/SERVER-57772)mongos上的故障点在writeConcernError中重写状态更改错误代码
- [服务器-58035](https://jira.mongodb.org/browse/SERVER-58035)从mongo shell中删除db.runCommandWithMetadata
- [服务器-58135](https://jira.mongodb.org/browse/SERVER-58135)ReplSetTest启动在禁用链的复制集中失败
- [服务器-59428](https://jira.mongodb.org/browse/SERVER-59428)在回滚可恢复索引构建夹具中使用更强大的正则表达式匹配
- [服务器-59779](https://jira.mongodb.org/browse/SERVER-59779)在ReplSetTest中replSetFreeze之前调用asCluster()
- [服务器-59781](https://jira.mongodb.org/browse/SERVER-59781)multi_statement_transaction.js不会在StaleConfig上重试事务
- [服务器-60048](https://jira.mongodb.org/browse/SERVER-60048)对于我们预计重新启动后可重试的findAndModify图像不一致的情况，CheckReplDBHash不应该失败
- [服务器-60217](https://jira.mongodb.org/browse/SERVER-60217)[v5.0] enableReconfigRollbackCommittedWritesCheck应应用于4.4
- [服务器-60310](https://jira.mongodb.org/browse/SERVER-60310)OCSP响应验证不应考虑无关证书的状态
- [服务器-60334](https://jira.mongodb.org/browse/SERVER-60334)在回滚到稳定期间暂停WiredTigerSizeStorer
- [服务器-60392](https://jira.mongodb.org/browse/SERVER-60392)修复priority_takeover_two_nodes_equal_priority测试中的时序。
- [服务器-60513](https://jira.mongodb.org/browse/SERVER-60513)在-large distro上运行burn_in_tags编译
- [服务器-60517](https://jira.mongodb.org/browse/SERVER-60517)在模糊器中强制驱逐_dirty_target < eviction_dirty_trigger
- [服务器-60685](https://jira.mongodb.org/browse/SERVER-60685)TransactionCoordinator可能会中断具有非中断错误类别的本地执行更新，导致服务器崩溃
- [服务器-60788](https://jira.mongodb.org/browse/SERVER-60788)merge_causes_infinite_loop.js试图公开一个不再存在的问题
- [服务器-60809](https://jira.mongodb.org/browse/SERVER-60809)在$search后添加不查找功能
- [服务器-60959](https://jira.mongodb.org/browse/SERVER-60959)插入到时间序列获取错误集合错误代码::TimeseriesBucketCleared
- [服务器-61005](https://jira.mongodb.org/browse/SERVER-61005)rs.initiate()在特定启动选项下失败，出现“不变故障”
- [服务器-61012](https://jira.mongodb.org/browse/SERVER-61012)TEMPLATE规则的实例化有时在生成的忍者中有一个命令
- [服务器-61097](https://jira.mongodb.org/browse/SERVER-61097)SizeStorer可能会因缓存删除而死锁
- [服务器-61121](https://jira.mongodb.org/browse/SERVER-61121)让TransactionMetricsObserver支持TxnNumberAndRetryCounter
- [服务器-61122](https://jira.mongodb.org/browse/SERVER-61122)在TransactionParticipant和TransactionRouter中的指标和日志方法中记录TxnNumberAndRetryCounter
- [服务器-61188](https://jira.mongodb.org/browse/SERVER-61188)当storeImageInSideCollection=true时，使用preImageRecordingEnabledForCollection=true收集的预映像noop条目被分配了错误的opTimes
- [服务器-61194](https://jira.mongodb.org/browse/SERVER-61194)防止时间序列桶OID以粗粒度重复使用
- [服务器-61201](https://jira.mongodb.org/browse/SERVER-61201)创建视图可能会导致死锁
- [服务器-61214](https://jira.mongodb.org/browse/SERVER-61214)在创建config.system.sessions时，请确保目录缓存的最新已知条目
- [服务器-61216](https://jira.mongodb.org/browse/SERVER-61216)--cache-disable标志导致python stacktrace
- [服务器-61275](https://jira.mongodb.org/browse/SERVER-61275)在会话缓存关闭后销毁大小存储器
- [服务器-61307](https://jira.mongodb.org/browse/SERVER-61307)通过表达式将上下文添加到$setWindowFields分区的解析错误中
- [服务器-61358](https://jira.mongodb.org/browse/SERVER-61358)验证缓存错误地重新提高无效校验和
- [服务器-61427](https://jira.mongodb.org/browse/SERVER-61427)由于检查许多虚假副本，唯一的索引构建可能会导致提交期间的可用性损失
- [服务器-61479](https://jira.mongodb.org/browse/SERVER-61479)减少后，增加连接到副本集的重试次数
- [服务器-61532](https://jira.mongodb.org/browse/SERVER-61532)需要揭露检测违禁行为的交易对手。
- [服务器-61550](https://jira.mongodb.org/browse/SERVER-61550)在perf.yml中修改auto_workload_path以相对于cwd
- [服务器-61590](https://jira.mongodb.org/browse/SERVER-61590)system.buckets集合的存在不应假设集合是时间序列集合。
- [服务器-61591](https://jira.mongodb.org/browse/SERVER-61591)Robustify currentop_shell.js测试
- [服务器-61602](https://jira.mongodb.org/browse/SERVER-61602)timeseries_min_max.js假设测量按插入顺序返回
- [服务器-61650](https://jira.mongodb.org/browse/SERVER-61650)在 sync_source_selection_ignores_minvalid_after_rollback.js中重新启动复制之前断开节点连接
- [服务器-61681](https://jira.mongodb.org/browse/SERVER-61681)等待replSetGetStatus在replSetGetStatus_member_wall_times.js中更新
- [服务器-61690](https://jira.mongodb.org/browse/SERVER-61690)调整地图集搜索的存储字段协议
- [服务器-61738](https://jira.mongodb.org/browse/SERVER-61738)恢复dbCheck.js，使其具有确定性
- [服务器-61743](https://jira.mongodb.org/browse/SERVER-61743)除x86_64平台外，不应应用-fno-builtin-memcmp标志
- [服务器-61748](https://jira.mongodb.org/browse/SERVER-61748)dbCheck在批处理期间不应保持强大的数据库锁
- [服务器-61754](https://jira.mongodb.org/browse/SERVER-61754)dbCheck在批处理期间不应保持强大的收集锁
- [服务器-61757](https://jira.mongodb.org/browse/SERVER-61757)添加dbCheck命令选项来自定义批处理大小
- [服务器-61791](https://jira.mongodb.org/browse/SERVER-61791)pin pymongo
- [服务器-61805](https://jira.mongodb.org/browse/SERVER-61805)使用端口检查timeseries_retryable_write_downgrade_oplog_rollover.js中的主节点
- [服务器-61846](https://jira.mongodb.org/browse/SERVER-61846)防止编辑抛出BSONObjectTooLarge
- [服务器-61852](https://jira.mongodb.org/browse/SERVER-61852)dbCheck应该尝试用后退锁定集合
- [服务器-61858](https://jira.mongodb.org/browse/SERVER-61858)在同步_source_selection_ignores_minvalid_after_rollback.js中断开连接之前，等待节点成为主节点
- [服务器-61877](https://jira.mongodb.org/browse/SERVER-61877)从dbCheck中删除目录一致性验证
- [服务器-61883](https://jira.mongodb.org/browse/SERVER-61883)[v5.0] 阅读对压缩时间序列存储桶的支持
- [服务器-61910](https://jira.mongodb.org/browse/SERVER-61910)initiate_takes_stable_checkpoint.js不考虑在回滚中关闭连接
- [服务器-61931](https://jira.mongodb.org/browse/SERVER-61931)允许ClusterManager角色对system.buckets.*集合进行操作
- [服务器-61955](https://jira.mongodb.org/browse/SERVER-61955)将dbCheck公开为一个普遍可用的命令
- [服务器-62022](https://jira.mongodb.org/browse/SERVER-62022)减少生产中的dbCheck信息日志记录，日志开始和停止
- [服务器-62023](https://jira.mongodb.org/browse/SERVER-62023)提高dbCheck可观察性
- [服务器-62037](https://jira.mongodb.org/browse/SERVER-62037)修复linux-1-node-15gbwtcache的系统perf yaml文件中的复制集定义
- [服务器-62041](https://jira.mongodb.org/browse/SERVER-62041)向dbCheck添加最大批处理执行时间
- [服务器-62164](https://jira.mongodb.org/browse/SERVER-62164)删除所有稳定分支上的几个过时的构建变体
- [服务器-62210](https://jira.mongodb.org/browse/SERVER-62210)修复db检查掉落和重新创建的集合的进度仪表处理
- [服务器-62212](https://jira.mongodb.org/browse/SERVER-62212)支持写入关注dbCheck
- [服务器-62226](https://jira.mongodb.org/browse/SERVER-62226)在EFT上禁用dbcheck_no_history_on_secondary.js
- [服务器-62243](https://jira.mongodb.org/browse/SERVER-62243)等待矢量时钟文档多数提交，没有超时
- [服务器-62277](https://jira.mongodb.org/browse/SERVER-62277)由于占用磁盘空间计算，dbstats的性能回归
- [服务器-62336](https://jira.mongodb.org/browse/SERVER-62336)容忍SnapshotToodbCheck测试中的旧错误
- [服务器-62380](https://jira.mongodb.org/browse/SERVER-62380)在rollback_set_fcv.js中启动回滚测试之前，等待每个节点上大多数提交点
- [服务器-62382](https://jira.mongodb.org/browse/SERVER-62382)5.0、5.1、5.2和主瀑布上的几个Amazon Linux 2测试没有运行
- [服务器-62419](https://jira.mongodb.org/browse/SERVER-62419)recover_multiple_migrations_on_stepup.js在配置服务器降级套件中执行时失败
- [服务器-62423](https://jira.mongodb.org/browse/SERVER-62423)修复replsetinitiate_works_with_keyfile_profile_verbose_options.js以在ephemeralForTest上工作
- [服务器-62592](https://jira.mongodb.org/browse/SERVER-62592)使timeeries_sharding_admin_commands.js clearJumboFlag测试更具弹性
- [服务器-62706](https://jira.mongodb.org/browse/SERVER-62706)dbcheck.js：处理具有混合调试/发布成员的副本集
- [WT-8395](https://jira.mongodb.org/browse/WT-8395)从4.4.3和4.4.4升级到4.4.8+和5.0.2+后数据不一致
- [WT-8534](https://jira.mongodb.org/browse/WT-8534)允许检索用于备份恢复恢复的检查点快照
- [WT-8576](https://jira.mongodb.org/browse/WT-8576)启用登录测试检查点



## 5.0.5 更改日志

### 分片

- [服务器-51329](https://jira.mongodb.org/browse/SERVER-51329)关闭mongos服务器时意外不可重试错误
- [服务器-55382](https://jira.mongodb.org/browse/SERVER-55382)忽略可重试写入转换为事务的错误，以及该事务在random_moveChunk_update_shard_key.js中失败的错误
- [服务器-56227](https://jira.mongodb.org/browse/SERVER-56227)添加面向用户的命令，将分片集合的允许移民设置为false
- [服务器-57686](https://jira.mongodb.org/browse/SERVER-57686)我们需要测试覆盖，在选举面前进行分片
- [服务器-58343](https://jira.mongodb.org/browse/SERVER-58343)Re-enable reshard_collection_failover_shutdown_basic.js
- [服务器-59719](https://jira.mongodb.org/browse/SERVER-59719)shardsvr{Commit, Abort}ReshardCollection可能会在降级时返回无法恢复的错误，导致配置服务器上的fassert()
- [服务器-59806](https://jira.mongodb.org/browse/SERVER-59806)碎片收集的优化路径在大量块的情况下无法成功
- [服务器-60730](https://jira.mongodb.org/browse/SERVER-60730)shardsvrDrop数据库应始终加入现有协调员
- [服务器-60751](https://jira.mongodb.org/browse/SERVER-60751)move_chunk_critical_section_non_internal_client_abort.js不考虑配置服务器降级
- [服务器-60804](https://jira.mongodb.org/browse/SERVER-60804)从cursor_valid_after_shard_stepdown中删除碎片版本检查
- [服务器-60945](https://jira.mongodb.org/browse/SERVER-60945)增加resharding_large_number_of_initial_chunks.js的分片关键部分超时值
- [服务器-61027](https://jira.mongodb.org/browse/SERVER-61027)港口许可证 移民变更
- [服务器-61066](https://jira.mongodb.org/browse/SERVER-61066)让shardsvr DDL命令在将opCtx标记为可中断后检查主状态
- [服务器-61289](https://jira.mongodb.org/browse/SERVER-61289)使resharding_retryable_writes.js更稳健地计时
- [服务器-61473](https://jira.mongodb.org/browse/SERVER-61473)分页协调员多次调用ReshardingMetrics::onCompletion()进行瞬态错误，导致配置服务器崩溃
- [服务器-61482](https://jira.mongodb.org/browse/SERVER-61482)config.reshardingOperations的更新等待在持有oplog插槽时重建PrimaryOnlyService，无限期地停止在配置服务器上的复制
- [服务器-61483](https://jira.mongodb.org/browse/SERVER-61483)分片协调员未能恢复中止的升级决定，试图将操作视为成功，导致数据不一致
- [服务器-61607](https://jira.mongodb.org/browse/SERVER-61607)在resharding_nonblocking_coordinator_rebuild.js中接受DuplicateKey作为可能的错误
- [服务器-61633](https://jira.mongodb.org/browse/SERVER-61633)Resharding的RecipientStateMachine不会加入ReshardingOplogFetcher的线程池，导致服务器在关机时崩溃

### 复制

- [服务器-54909](https://jira.mongodb.org/browse/SERVER-54909)在replSetGetStatus中，报告所有成员的最后一次耐用和最后一次应用操作墙时间
- [服务器-60946](https://jira.mongodb.org/browse/SERVER-60946)当具有不同优先级的节点启动replset时，replsetprio1.js中的竞争条件

### 集合

[服务器-59924](https://jira.mongodb.org/browse/SERVER-59924)在分片集群上使用“可用”读取关注点执行聚合时出错

### 储存

[服务器-58736](https://jira.mongodb.org/browse/SERVER-58736)避免在许多集合的回滚中出现二次行为

### 内部人员

- [服务器-54776](https://jira.mongodb.org/browse/SERVER-54776)为PM-2191启用功能标志
- [服务器-55535](https://jira.mongodb.org/browse/SERVER-55535)性能测试以进行更改流优化
- [服务器-57131](https://jira.mongodb.org/browse/SERVER-57131)在拓扑学中修复琐碎的比赛_listener_test
- [服务器-57164](https://jira.mongodb.org/browse/SERVER-57164)$逐组变量优化中的不变故障
- [服务器-57171](https://jira.mongodb.org/browse/SERVER-57171)使杀戮测试更具弹性
- [服务器-57486](https://jira.mongodb.org/browse/SERVER-57486)防止在 transactions_stale_shard_version_errors.js 测试中进行定期索引检查
- [服务器-58636](https://jira.mongodb.org/browse/SERVER-58636)在根据辅助同步源计算stopTimestamp时，初始同步节点可能会错过最终的操作日志条目
- [服务器-59329](https://jira.mongodb.org/browse/SERVER-59329)如果节点不再是主节点，请确保使用TemporaryOperationContext抛出错误
- [服务器-59432](https://jira.mongodb.org/browse/SERVER-59432)降级不变，并为系统变量优化组添加额外的策略
- [服务器-59654](https://jira.mongodb.org/browse/SERVER-59654)为时间序列更新模糊器添加常青任务
- [服务器-59662](https://jira.mongodb.org/browse/SERVER-59662)使用时间序列插入和中断生成命令创建并发测试
- [服务器-59858](https://jira.mongodb.org/browse/SERVER-59858)添加反应堆线程上计划的任务的可观测性
- [服务器-59871](https://jira.mongodb.org/browse/SERVER-59871)startup_recovery_for_restore_restarts.js需要确保在故障点后发生检查点
- [服务器-59879](https://jira.mongodb.org/browse/SERVER-59879)调整maxTimeMS值，以便在并行测试套件中实现更慢的执行速度
- [服务器-60393](https://jira.mongodb.org/browse/SERVER-60393)将replica_sets_jscore_passthrough时间限制提高到3小时。
- [服务器-60424](https://jira.mongodb.org/browse/SERVER-60424)TenantOplogFetcher超时重现聚合光标
- [服务器-60632](https://jira.mongodb.org/browse/SERVER-60632)当重命名收集目标已经存在时，mongos上的错误不一致
- [服务器-60670](https://jira.mongodb.org/browse/SERVER-60670)使用单独的分支而不是TPCC的特定提交
- [服务器-60671](https://jira.mongodb.org/browse/SERVER-60671)移除匕首
- [服务器-60756](https://jira.mongodb.org/browse/SERVER-60756)在multi_statement_transaction_atomicity_isolation.js中添加失败更新的其他日志记录
- [服务器-60762](https://jira.mongodb.org/browse/SERVER-60762)$setWindowFields分区数组应该始终出错
- [服务器-61021](https://jira.mongodb.org/browse/SERVER-61021)文档可能会在timeseries_delete.js中按顺序检索
- [服务器-61039](https://jira.mongodb.org/browse/SERVER-61039)分片时间序列列表索引应报告视图的命名空间
- [服务器-61164](https://jira.mongodb.org/browse/SERVER-61164)接受错误代码48（不适当的身份验证）作为LDAP活力检查的有效响应
- [服务器-61178](https://jira.mongodb.org/browse/SERVER-61178)在find_cmd_with_indexes_timeseries.js中使用较少的并发性
- [服务器-61208](https://jira.mongodb.org/browse/SERVER-61208)当平衡器不应该在 transactions_stale_shard_version_errors.js中运行时，它可能会运行
- [服务器-61269](https://jira.mongodb.org/browse/SERVER-61269)将日志添加到awaitdata_getmore_cmd.js
- [服务器-61283](https://jira.mongodb.org/browse/SERVER-61283)[5.0] 将 require_fcv_50 添加到 timeseries_insert_kill_op.js 和 timeseries_insert_idle_bucket_expiration.js
- [服务器-61291](https://jira.mongodb.org/browse/SERVER-61291)修复与checkout_idl_files_from_past_releases.py的前向兼容性
- [服务器-61309](https://jira.mongodb.org/browse/SERVER-61309)修复时间序列存储桶锁重新获取逻辑
- [服务器-61360](https://jira.mongodb.org/browse/SERVER-61360)减少Debian 9变体jlink以防止OOM案例
- [服务器-61405](https://jira.mongodb.org/browse/SERVER-61405)考虑从$$SEARCH_META中删除FCV支票
- [服务器-61597](https://jira.mongodb.org/browse/SERVER-61597)使用确定性顺序进行random_moveChunk_timeseries_inserts.js
- [WT-3445](https://jira.mongodb.org/browse/WT-3445)添加多个表格来格式化测试员。
- [WT-5008](https://jira.mongodb.org/browse/WT-5008)将Jenkins的“wiredtiger-perf-btree”工作迁移到Evergreen
- [WT-5010](https://jira.mongodb.org/browse/WT-5010)将Jenkins的“wiredtiger-perf-checkpoint”工作迁移到Evergreen
- [WT-5011](https://jira.mongodb.org/browse/WT-5011)将Jenkins的“wiredtiger-perf-log-consolidated”工作迁移到Evergreen
- [WT-5012](https://jira.mongodb.org/browse/WT-5012)将有线老虎-perf-驱逐到常青
- [WT-5013](https://jira.mongodb.org/browse/WT-5013)将Jenkins的“wiredtiger-perf-stress”工作迁移到Evergreen
- [WT-5580](https://jira.mongodb.org/browse/WT-5580)在Evergreen wtperf测试中将wtperf命令转储到日志中
- [WT-6001](https://jira.mongodb.org/browse/WT-6001)如果需要重写，请避免将页面读取到缓存中
- [WT-6022](https://jira.mongodb.org/browse/WT-6022)NVRAM缓存
- [WT-6116](https://jira.mongodb.org/browse/WT-6116)重新打开非时间戳测试
- [WT-7694](https://jira.mongodb.org/browse/WT-7694)修复了在对象名称中正确使用存储桶前缀的问题。
- [WT-7820](https://jira.mongodb.org/browse/WT-7820)检索磁盘上耐用的时间戳，以便与更新时间戳进行比较
- [WT-7845](https://jira.mongodb.org/browse/WT-7845)为分层及其元数据添加 oldest_id。
- [WT-7912](https://jira.mongodb.org/browse/WT-7912)修复优化附近的前缀搜索，以处理按键范围跨页面分割的场景。
- [WT-8004](https://jira.mongodb.org/browse/WT-8004)为架构指南创建读取顺序
- [WT-8030](https://jira.mongodb.org/browse/WT-8030)添加与驱逐触发器设置相关的理智检查
- [WT-8046](https://jira.mongodb.org/browse/WT-8046)在test/格式的wiredtiger_open调用之间保持非持久配置设置
- [WT-8065](https://jira.mongodb.org/browse/WT-8065)更新有关光标和prefix_key配置的文档
- [WT-8076](https://jira.mongodb.org/browse/WT-8076)修改tiered_abort csuite测试以使用cmake
- [WT-8114](https://jira.mongodb.org/browse/WT-8114)恢复允许使用汇总准备配置设置小于或等于最新活动读取时间戳的准备时间戳
- [WT-8151](https://jira.mongodb.org/browse/WT-8151)如果stop_ts小于 durable_start_ts，大于start_ts，则使 durable_start_ts 等于 stop_ts
- [WT-8157](https://jira.mongodb.org/browse/WT-8157)修复格式-abort-恢复-压力测试超时条件
- [WT-8163](https://jira.mongodb.org/browse/WT-8163)考虑更多的驱逐场景，以放弃检查站清理
- [WT-8167](https://jira.mongodb.org/browse/WT-8167)从cppsuite代码中删除未使用的获取器
- [WT-8173](https://jira.mongodb.org/browse/WT-8173)修复架构指南图中的行列存储节点
- [WT-8178](https://jira.mongodb.org/browse/WT-8178)将从wtperf_run.py生成的JSON输出推送到Cedar/Evergreen
- [WT-8179](https://jira.mongodb.org/browse/WT-8179)将从wtperf_run.py生成的out.json推送到Atlas
- [WT-8188](https://jira.mongodb.org/browse/WT-8188)在紧凑的相关测试中使用紧凑的进度统计信息
- [WT-8189](https://jira.mongodb.org/browse/WT-8189)在WT详细消息传递中添加用于紧凑分析的有用信息
- [WT-8192](https://jira.mongodb.org/browse/WT-8192)扩展详细API，以支持为每个事件类别分配详细程度级别
- [WT-8194](https://jira.mongodb.org/browse/WT-8194)修复启用tcmalloc时的ASAN泄漏
- [WT-8196](https://jira.mongodb.org/browse/WT-8196)向cppsuite文件添加警告选项
- [WT-8221](https://jira.mongodb.org/browse/WT-8221)比较执行RTS之前的写入生成号
- [WT-8224](https://jira.mongodb.org/browse/WT-8224)修复未使用变量的覆盖性投诉
- [WT-8228](https://jira.mongodb.org/browse/WT-8228)在紧凑型测试中添加可变长度列存储支持
- [WT-8232](https://jira.mongodb.org/browse/WT-8232)修复hs18测试使用发布驱逐光标来驱逐页面
- [WT-8233](https://jira.mongodb.org/browse/WT-8233)修复数据验证-压力测试检查点忽略故障
- [WT-8237](https://jira.mongodb.org/browse/WT-8237)释放后取消将NULL值分配给配置，它将保持未使用状态。
- [WT-8241](https://jira.mongodb.org/browse/WT-8241)跳过最大密钥的价值回报
- [WT-8253](https://jira.mongodb.org/browse/WT-8253)修复检查点应力测试中的磁盘空间问题
- [WT-8254](https://jira.mongodb.org/browse/WT-8254)实现新的WiredTiger内部API，以定义具有相关严重程度的冗长消息
- [WT-8255](https://jira.mongodb.org/browse/WT-8255)创建一个Python套件测试，以断言详细界面的遗留用途仍然可以按预期工作
- [WT-8256](https://jira.mongodb.org/browse/WT-8256)创建新的测试，捕获不同的详细配置场景
- [WT-8270](https://jira.mongodb.org/browse/WT-8270)更新时间窗口清除过时的对账阶段，以正确考虑全局可见性。
- [WT-8271](https://jira.mongodb.org/browse/WT-8271)在perf测试结果输出中捕获git分支并提交状态
- [WT-8275](https://jira.mongodb.org/browse/WT-8275)简化紧凑型统计数据
- [WT-8280](https://jira.mongodb.org/browse/WT-8280)暂时禁用前缀断言
- [WT-8281](https://jira.mongodb.org/browse/WT-8281)使用历史商店停止时间戳修复订单处理
- [WT-8283](https://jira.mongodb.org/browse/WT-8283)在紧凑的文件中使用新的详细API
- [WT-8284](https://jira.mongodb.org/browse/WT-8284)改进需要回滚时交易的详细日志记录
- [WT-8285](https://jira.mongodb.org/browse/WT-8285)简化CMakes对第三方库的使用
- [WT-8286](https://jira.mongodb.org/browse/WT-8286)为前缀搜索创建压力测试
- [WT-8291](https://jira.mongodb.org/browse/WT-8291)在没有执行的情况下调用_exit()而不是exit()
- [WT-8294](https://jira.mongodb.org/browse/WT-8294)将性能测试的结果推送到一个集合
- [WT-8297](https://jira.mongodb.org/browse/WT-8297)在恢复中在登录的表格上触发时间戳订单检查
- [WT-8298](https://jira.mongodb.org/browse/WT-8298)切换Evergreen性能测试以使用ubuntu2004-large实例
- [WT-8314](https://jira.mongodb.org/browse/WT-8314)修复错误表的块缓存返回块
- [WT-8316](https://jira.mongodb.org/browse/WT-8316)格式向后兼容性模式修复
- [WT-8317](https://jira.mongodb.org/browse/WT-8317)切勿将溢出键存储在内部页面上
- [WT-8318](https://jira.mongodb.org/browse/WT-8318)添加格式化.sh对CONFIG文件目录的支持
- [WT-8321](https://jira.mongodb.org/browse/WT-8321)将烟雾测试的超时更新为60分钟
- [WT-8331](https://jira.mongodb.org/browse/WT-8331)更改格式以允许引用字符
- [WT-8335](https://jira.mongodb.org/browse/WT-8335)支持在CMake中编译静态和共享WiredTiger库
- [WT-8336](https://jira.mongodb.org/browse/WT-8336)编译c++文件时禁用不安全循环优化标志
- [WT-8337](https://jira.mongodb.org/browse/WT-8337)格式直接I/O测试无法关闭备份
- [WT-8339](https://jira.mongodb.org/browse/WT-8339)将缺失的逗号添加到wtperf监视器头
- [WT-8342](https://jira.mongodb.org/browse/WT-8342)覆盖范围：CID 121074：src/support/float.c中的UNINTENDED_INTEGER_DIVISION
- [WT-8345](https://jira.mongodb.org/browse/WT-8345)API在会话级别配置cache_max_wait_ms
- [WT-8346](https://jira.mongodb.org/browse/WT-8346)将Jenkins的剩余测试迁移到Evergreen
- [WT-8347](https://jira.mongodb.org/browse/WT-8347)在test_checkpoint中滑动修改更改
- [WT-8349](https://jira.mongodb.org/browse/WT-8349)内存格式运行可以创建具有非法缓存大小的CONFIG
- [WT-8350](https://jira.mongodb.org/browse/WT-8350)修复使用错误类型值来关闭配置值的测试/格式问题
- [WT-8354](https://jira.mongodb.org/browse/WT-8354)兼容性运行中使用的历史格式构建需要之前的语法
- [WT-8355](https://jira.mongodb.org/browse/WT-8355)覆盖率分析缺陷121096：单硝化指针读取
- [WT-8357](https://jira.mongodb.org/browse/WT-8357)在性能测试输出中添加更多常青扩展
- [WT-8358](https://jira.mongodb.org/browse/WT-8358)通过命令行将操作和args字段传递给wtperf
- [WT-8359](https://jira.mongodb.org/browse/WT-8359)将烟雾测试与Evergreen的压力测试分开
- [WT-8363](https://jira.mongodb.org/browse/WT-8363)通过性能测试验证统计数据输出
- [WT-8364](https://jira.mongodb.org/browse/WT-8364)修复使用TCMalloc构建cppsuite时的CMake错误
- [WT-8368](https://jira.mongodb.org/browse/WT-8368)修复'__wt_verbose_multi'生成的详细消息输出
- [WT-8394](https://jira.mongodb.org/browse/WT-8394)通过性能测试恢复验证统计数据输出



## 5.0.4 更改日志

### 分片

- [服务器-40865](https://jira.mongodb.org/browse/SERVER-40865)ShardServerCatalogCacheLoader不会将读取操作与同一集合的其他操作序列化
- [服务器-49897](https://jira.mongodb.org/browse/SERVER-49897)将无操作条目插入操作日志缓冲区集合中进行分片，以便恢复不那么浪费
- [服务器-53335](https://jira.mongodb.org/browse/SERVER-53335)使用非“简单”整理的查询、更新和删除在使用散列分片时可能会丢失文档
- [服务器-54231](https://jira.mongodb.org/browse/SERVER-54231)分片可以将本地收藏留在以前没有任何块的主碎片上
- [服务器-54623](https://jira.mongodb.org/browse/SERVER-54623)减少因果一致性直通套件中的作业数量
- [服务器-55412](https://jira.mongodb.org/browse/SERVER-55412)镜像读取应该传播碎片版本字段
- [服务器-55429](https://jira.mongodb.org/browse/SERVER-55429)当接收器没有清理重叠范围时，提前中止迁移
- [服务器-55557](https://jira.mongodb.org/browse/SERVER-55557)在细化碎片密钥后，中止迁移的范围删除可能会失败
- [服务器-56985](https://jira.mongodb.org/browse/SERVER-56985)SERVER-56500中列出的完整待办事项
- [服务器-57217](https://jira.mongodb.org/browse/SERVER-57217)不要在当前操作时间评估秒中报告剩余的操作时间估计秒，用于为捐助者和协调员重新分片
- [服务器-57266](https://jira.mongodb.org/browse/SERVER-57266)为重新分段度量时间间隔创建IDL表示。
- [服务器-57276](https://jira.mongodb.org/browse/SERVER-57276)捕获提交监视器看到的FTDC指标中的最大/最小完成百分比
- [服务器-57479](https://jira.mongodb.org/browse/SERVER-57479)删除resharding_test_util.js
- [服务器-57654](https://jira.mongodb.org/browse/SERVER-57654)如果管道::getNext()抛出ReshardingCollectionCloner，请调用管道::dispose()
- [服务器-57655](https://jira.mongodb.org/browse/SERVER-57655)如果管道::getNext()扔进ReshardingTxnCloner，请调用管道::dispose()
- [服务器-57665](https://jira.mongodb.org/browse/SERVER-57665)删除未使用的disallowWritesForResharding()方法
- [服务器-57675](https://jira.mongodb.org/browse/SERVER-57675)random_DDL_CRUD_operations.js可能会尝试两次重命名为同一目标ns
- [服务器-57686](https://jira.mongodb.org/browse/SERVER-57686)我们需要测试覆盖，在选举面前进行分片
- [服务器-57760](https://jira.mongodb.org/browse/SERVER-57760)引入专门的类似OpCounters的分片指标，并在ReshardingOplogApplier中使用它们
- [服务器-57761](https://jira.mongodb.org/browse/SERVER-57761)增量插入操作计数器作为分片集合克隆的一部分
- [服务器-58082](https://jira.mongodb.org/browse/SERVER-58082)如果允许，则重分操作失败 碎片化已设置为false
- [服务器-58304](https://jira.mongodb.org/browse/SERVER-58304)分片的捐赠者、收件人和协调员文档中的“指标”字段没有标记为可选
- [服务器-58343](https://jira.mongodb.org/browse/SERVER-58343)Re-enable reshard_collection_failover_shutdown_basic.js
- [服务器-58407](https://jira.mongodb.org/browse/SERVER-58407)当瞄准远程碎片时，分片组件不会在FailedToSatisfyReadPreference上重试，导致服务器崩溃
- [服务器-58433](https://jira.mongodb.org/browse/SERVER-58433)在 bumpCollectionVersionAndChangeMetadataInTxn中重新分片协调员服务事务可能太大了
- [服务器-58592](https://jira.mongodb.org/browse/SERVER-58592)当分片操作接近尾声时，使ReshardingCoordinatorService更强大。
- [服务器-58871](https://jira.mongodb.org/browse/SERVER-58871)在write_concern_basic.js中设置固定的db primary
- [服务器-58914](https://jira.mongodb.org/browse/SERVER-58914)使用函数存根创建ReshardingDonorWriteRouter类
- [服务器-58915](https://jira.mongodb.org/browse/SERVER-58915)实现ReshardingDonorWriteRouter功能以及单元测试
- [服务器-58960](https://jira.mongodb.org/browse/SERVER-58960)在写入代码路径上测量ShardingWriteRouter的开销
- [服务器-58980](https://jira.mongodb.org/browse/SERVER-58980)防止分片协调员StepDownStepUpEachTransition测试在下台和完成之间进行比赛
- [服务器-58990](https://jira.mongodb.org/browse/SERVER-58990)重新分片总是写新的集合时间戳
- [服务器-59023](https://jira.mongodb.org/browse/SERVER-59023)在接收分片上发生主故障转移后，NamespaceNotSharded的重新分片可能会失败
- [服务器-59160](https://jira.mongodb.org/browse/SERVER-59160)在test_stacked_migration_cleanup.js中禁用平衡器
- [服务器-59208](https://jira.mongodb.org/browse/SERVER-59208)允许resharding_replicate_updates_as_insert_delete.js中的可重试写入使用ShardCannotRefreshDueToLocksHeld失败
- [服务器-59500](https://jira.mongodb.org/browse/SERVER-59500)DDL协调员不得在降级时释放dist锁
- [服务器-59585](https://jira.mongodb.org/browse/SERVER-59585)ReshardingOpObserver在配置服务器上执行无效的CollectionShardingRuntime转换
- [服务器-59694](https://jira.mongodb.org/browse/SERVER-59694)重新分片禁止的命令错误地假设了Config.Cache.Collections集合中的一致性
- [服务器-59769](https://jira.mongodb.org/browse/SERVER-59769)平衡器与块迁移测试冲突
- [服务器-59775](https://jira.mongodb.org/browse/SERVER-59775)当Fassert（）在下台后继续在成员国 SECONDARY运行时，ReshardingDonorOplogIterator会触发fassert()
- [服务器-59803](https://jira.mongodb.org/browse/SERVER-59803)为目录缓存刷新聚合设置maxTimeMs
- [服务器-59811](https://jira.mongodb.org/browse/SERVER-59811)ReshardingOplogFetcher在切换同步源时可以看到postBatchResumeToken向后移动，从而停止了分片操作
- [服务器-59812](https://jira.mongodb.org/browse/SERVER-59812)当数据复制组件仍在运行时，调用ReshardingMetrics::onStepDown()，导致不变故障
- [服务器-59849](https://jira.mongodb.org/browse/SERVER-59849)当无法获取预/后图像时，添加测试以验证ReshardingOplogFetcher的行为
- [服务器-59890](https://jira.mongodb.org/browse/SERVER-59890)从config stepdown套件中排除migmig_coordinator_shutdown_in_critical_section.js测试
- [服务器-59903](https://jira.mongodb.org/browse/SERVER-59903)在恢复分片元数据的重命名时，请勿擦除重新命名的标签
- [服务器-59916](https://jira.mongodb.org/browse/SERVER-59916)T{1, 2}Starts{First, Second}AndWins In WriteConflictHelpers不同步提交失败的事务
- [服务器-59923](https://jira.mongodb.org/browse/SERVER-59923)从ReshardingTest夹具中的后台线程重试reshardCollection命令
- [服务器-59927](https://jira.mongodb.org/browse/SERVER-59927)Resharding的RecipientStateMachine::_restoreMetrics()不会重试瞬态错误，导致faassert()降级
- [服务器-59965](https://jira.mongodb.org/browse/SERVER-59965)renameCollection和多碎片事务之间的分布式死锁
- [服务器-60094](https://jira.mongodb.org/browse/SERVER-60094)ReshardingOplogApplicationRules不是所有写入的版本
- [服务器-60142](https://jira.mongodb.org/browse/SERVER-60142)清除过滤元数据后，碎片可以在孤儿身上迁移
- [服务器-60161](https://jira.mongodb.org/browse/SERVER-60161)配置服务器降级和_configsvrRenameCollectionMetadata命令之间的死锁
- [服务器-60220](https://jira.mongodb.org/browse/SERVER-60220)ReshardingCoordinator::installCoordinatorDoc在调用logChange之前应该以内存状态更新
- [服务器-60266](https://jira.mongodb.org/browse/SERVER-60266)重试DDL协调员中的WriteConcern错误异常
- [服务器-60291](https://jira.mongodb.org/browse/SERVER-60291)重新分片禁止的命令不会等待收件人完成
- [服务器-60413](https://jira.mongodb.org/browse/SERVER-60413)修复移动Chunk命令使用的关键部分原因
- [服务器-60508](https://jira.mongodb.org/browse/SERVER-60508)碎片服务器OnReplicationRollback在恢复时间序列集合的关键部分时抛出
- [服务器-60592](https://jira.mongodb.org/browse/SERVER-60592)DDL参与者命令需要确保他们使用txnNumber进行写入
- [服务器-60731](https://jira.mongodb.org/browse/SERVER-60731)在drop数据库协调员中推迟数据库关键部分的发布
- [服务器-60737](https://jira.mongodb.org/browse/SERVER-60737)从ShardServerCatalogCacheLoaderTest中删除不正确的块时间戳检查
- [服务器-60774](https://jira.mongodb.org/browse/SERVER-60774)重新分片可以通过reshardFinalOp应用，而不会过渡到严格的一致性，在重新分片的集合上拖延写入操作，直到关键部分超时
- [服务器-60811](https://jira.mongodb.org/browse/SERVER-60811)下拉数据库可能会在降级后删除新集合
- [服务器-60858](https://jira.mongodb.org/browse/SERVER-60858)加入现有ReshardingCoordinator的_configsvrReshardCollection命令可能会在降级时错过中断
- [服务器-60859](https://jira.mongodb.org/browse/SERVER-60859)ReshardingCoordinator不取消地等待_canEnterCritical未来，这可能会阻止配置服务器主升级完成
- [服务器-60916](https://jira.mongodb.org/browse/SERVER-60916)CPS恢复失败，在reshardingOperation中包含文档的快照
- [服务器-61026](https://jira.mongodb.org/browse/SERVER-61026)接收掉落收集参与者命令的碎片反转顺序
- [服务器-61052](https://jira.mongodb.org/browse/SERVER-61052)分段的捐助者和收件人的协调员文档更新可能会超时等待协调员文档的复制，导致致命的断言
- [服务器-61066](https://jira.mongodb.org/browse/SERVER-61066)让shardsvr DDL命令在将opCtx标记为可中断后检查主状态
- [服务器-61108](https://jira.mongodb.org/browse/SERVER-61108)重新分段CoordinatorService，配置集合删除可以超时等待协调员文档的复制，导致致命断言

### 复制

- [服务器-58988](https://jira.mongodb.org/browse/SERVER-58988)在主要追赶期间避免同步源选择周期。
- [服务器-59170](https://jira.mongodb.org/browse/SERVER-59170)从 tenant_migration_multi_stmt_txn_jscore_passthrough套件中排除max_doc_size.js
- [服务器-59646](https://jira.mongodb.org/browse/SERVER-59646)在nodes_in_primarys_datacenter_dont_sync_across_datacenters.js中评估同步源之前，请检查ping时间的差异是否大于changeSyncSourceThreshold
- [服务器-60153](https://jira.mongodb.org/browse/SERVER-60153)选举期间的更多信息级别日志

### 查询

- [服务器-51806](https://jira.mongodb.org/browse/SERVER-51806)索引构建的批量键插入阶段保持IX锁而不屈服
- [服务器-55516](https://jira.mongodb.org/browse/SERVER-55516)在分片直通中删除时间序列测试的标签
- [服务器-57321](https://jira.mongodb.org/browse/SERVER-57321)$mod匹配表达式错误地处理NaN、Infinity和大值
- [服务器-57376](https://jira.mongodb.org/browse/SERVER-57376)CollectionImpl和IndexCatalogImpl统计数据未初始化，可以写入日志
- [服务器-60586](https://jira.mongodb.org/browse/SERVER-60586)out_max_time_ms.js无法正确启用“maxTimeNeverTimeOut”故障点，导致虚假的测试失败

### 集合

- [服务器-59308](https://jira.mongodb.org/browse/SERVER-59308)匹配$lookup-$unwind未正确应用于$lookup结果后
- [服务器-59613](https://jira.mongodb.org/browse/SERVER-59613)如果超过内存限制，$range表达式应该会出错
- [服务器-59924](https://jira.mongodb.org/browse/SERVER-59924)在分片集群上使用“可用”读取关注点执行聚合时出错

### 储存

- [服务器-58130](https://jira.mongodb.org/browse/SERVER-58130)服务器确认更改时间序列集合验证器，没有错误
- [服务器-59057](https://jira.mongodb.org/browse/SERVER-59057)不要在config.transactions集合的验证命令中强制快速计数

### 运营

- [服务器-53242](https://jira.mongodb.org/browse/SERVER-53242)Always log collmod命令
- [服务器-59883](https://jira.mongodb.org/browse/SERVER-59883)有mongo shell关于使用mongosh尊重--安静的旗帜的信息

### 内部人员

- [服务器-52310](https://jira.mongodb.org/browse/SERVER-52310)为集成工作启用功能标志，以支持新的$search参数
- [服务器-53350](https://jira.mongodb.org/browse/SERVER-53350)公开ReshardingTest夹具上的方法，用于在重新分片运行时将replSetStepUp、SIGTERM和SIGKILL发送到碎片和配置服务器
- [服务器-53351](https://jira.mongodb.org/browse/SERVER-53351)添加重新分片模糊器任务，为碎片启用了升级
- [服务器-53913](https://jira.mongodb.org/browse/SERVER-53913)重新分片DonorService实例，以便在实例化时加载指标状态
- [服务器-54206](https://jira.mongodb.org/browse/SERVER-54206)为Fetcher类创建非阻塞API（或创建备用类）
- [服务器-54726](https://jira.mongodb.org/browse/SERVER-54726)修复“numScannedAferResume”中的错别字
- [服务器-54774](https://jira.mongodb.org/browse/SERVER-54774)PM-2191的架构指南更新
- [服务器-54775](https://jira.mongodb.org/browse/SERVER-54775)为PM-2191创建功能标志
- [服务器-55711](https://jira.mongodb.org/browse/SERVER-55711)覆盖率分析缺陷118014：checkState()中阴影的“状态”变量
- [服务器-56416](https://jira.mongodb.org/browse/SERVER-56416)mongod--版本在M1笔记本电脑上以无关的日志线返回
- [服务器-56602](https://jira.mongodb.org/browse/SERVER-56602)在serverStatus中跟踪匹配表达式的使用情况
- [服务器-56639](https://jira.mongodb.org/browse/SERVER-56639)用于启动恢复的时间戳索引标识掉线
- [服务器-56801](https://jira.mongodb.org/browse/SERVER-56801)更新PSA集中重新配置检查的占位符链接
- [服务器-56813](https://jira.mongodb.org/browse/SERVER-56813)让重新分片[RRFaM]知道
- [服务器-56887](https://jira.mongodb.org/browse/SERVER-56887)setIndexCommitQuorum命令在不存在的索引构建上对mongos运行时返回{ok: 1}
- [服务器-57000](https://jira.mongodb.org/browse/SERVER-57000)修复相关管道与面的处理
- [服务器-57229](https://jira.mongodb.org/browse/SERVER-57229)killOp_against_journal_flusher_thread.js必须确保JournalFlusher在查找opId和运行killOp之间不会重置opCtx
- [服务器-57295](https://jira.mongodb.org/browse/SERVER-57295)启动时旋转审计日志
- [服务器-57315](https://jira.mongodb.org/browse/SERVER-57315)为时间序列集合启用shardCollection命令
- [服务器-57350](https://jira.mongodb.org/browse/SERVER-57350)ShardKeyPattern::parseShardKeyPattern() - NaN表示正在转换为整数
- [服务器-57437](https://jira.mongodb.org/browse/SERVER-57437)为分片时间序列集合实现插入路由
- [服务器-57565](https://jira.mongodb.org/browse/SERVER-57565)确保时间序列测量不会更新碎片集群上的孤儿桶
- [服务器-57566](https://jira.mongodb.org/browse/SERVER-57566)为时间序列集合实现分片管理命令行为
- [服务器-57567](https://jira.mongodb.org/browse/SERVER-57567)更新分段直通套件以处理时间序列集合
- [服务器-57568](https://jira.mongodb.org/browse/SERVER-57568)为分片时间序列集合实现查询路由行为
- [服务器-57570](https://jira.mongodb.org/browse/SERVER-57570)禁用分片时间序列集合的更新粒度
- [服务器-57572](https://jira.mongodb.org/browse/SERVER-57572)为分片时间序列集合重写mongos上的次要索引
- [服务器-57573](https://jira.mongodb.org/browse/SERVER-57573)在分片时间序列集合上实现$sample阶段的孤儿过滤逻辑
- [服务器-57589](https://jira.mongodb.org/browse/SERVER-57589)加强对集群collStats和indexStats命令的测试，以确保顶级的“时间序列”总结工作
- [服务器-57603](https://jira.mongodb.org/browse/SERVER-57603)timeseries::MinMax::minUpdates/maxUpdates在确定更新时，应考虑对时间序列的调用::MinMax::min/max
- [服务器-57605](https://jira.mongodb.org/browse/SERVER-57605)将Decimal128相等比较助手暴露在shell上
- [服务器-57697](https://jira.mongodb.org/browse/SERVER-57697)测量ReshardingOplogApplier::_applyBatch的延迟/吞吐量
- [服务器-57700](https://jira.mongodb.org/browse/SERVER-57700)测量resharding::data_copy::fillBatchForInsert in ReshardingCollectionCloner::doOneBatch的延迟/吞吐量
- [服务器-57717](https://jira.mongodb.org/browse/SERVER-57717)添加时间序列存根以更新命令
- [服务器-57718](https://jira.mongodb.org/browse/SERVER-57718)添加时间序列存根以删除命令
- [服务器-57733](https://jira.mongodb.org/browse/SERVER-57733)确定更新/删除的查询是否仅取决于时间序列集合的元字段
- [服务器-57734](https://jira.mongodb.org/browse/SERVER-57734)确定更新是否仅修改时间序列集合的元字段
- [服务器-57735](https://jira.mongodb.org/browse/SERVER-57735)将时间序列集合的元字段上的单个更新转换为其存储桶集合的更新
- [服务器-57736](https://jira.mongodb.org/browse/SERVER-57736)将时间序列集合的metaField上的删除转换为其存储桶集合上的删除
- [服务器-57742](https://jira.mongodb.org/browse/SERVER-57742)创建OperationLatencyHistogram类的非专业版本
- [服务器-57780](https://jira.mongodb.org/browse/SERVER-57780)改进BlackDuck超时处理
- [服务器-57784](https://jira.mongodb.org/browse/SERVER-57784)TryUntilLoop不同步析构函数和Promise分辨率
- [服务器-58112](https://jira.mongodb.org/browse/SERVER-58112)向TaskExecutor的排气命令承诺添加显式同步
- [服务器-58122](https://jira.mongodb.org/browse/SERVER-58122)在resync_majority_member.js中将不变故障的搜索日志替换为故障点使用
- [服务器-58139](https://jira.mongodb.org/browse/SERVER-58139)避免网络界面测试的泄漏状态::CancelLocally
- [服务器-58148](https://jira.mongodb.org/browse/SERVER-58148)mirrored_reads.js断言不考虑镜像读取失败
- [服务器-58166](https://jira.mongodb.org/browse/SERVER-58166)可恢复索引构建回滚测试可能会耗尽RamLog空间
- [服务器-58170](https://jira.mongodb.org/browse/SERVER-58170)禁止删除system.views，如果存在时间系列集合
- [服务器-58175](https://jira.mongodb.org/browse/SERVER-58175)在将插入碎片时间序列集合之前，循环时间值
- [服务器-58183](https://jira.mongodb.org/browse/SERVER-58183)_applyPrepareTransaction不能确保准备Conflict行为是kIgnoreConflictAccept在重试尝试时写
- [服务器-58203](https://jira.mongodb.org/browse/SERVER-58203)改善$unionWith舞台
- [服务器-58263](https://jira.mongodb.org/browse/SERVER-58263)在TenantMigrationAccessBlockerRegistry中修复absl地图擦除循环
- [服务器-58331](https://jira.mongodb.org/browse/SERVER-58331)多文档事务中时间序列更新和删除失败
- [服务器-58370](https://jira.mongodb.org/browse/SERVER-58370)在RollbackImpl中免费使用StringMap元素
- [服务器-58385](https://jira.mongodb.org/browse/SERVER-58385)恢复操作日志应用程序更新了错误集合的多密钥信息
- [服务器-58386](https://jira.mongodb.org/browse/SERVER-58386)在 null_query_semantics.js 中为测试用例分配唯一的集合名称
- [服务器-58390](https://jira.mongodb.org/browse/SERVER-58390)通过整理测试时间序列元字段仅删除
- [服务器-58393](https://jira.mongodb.org/browse/SERVER-58393)为时间序列元字段专用更新启用“整理”
- [服务器-58394](https://jira.mongodb.org/browse/SERVER-58394)将时间序列集合的元字段上的多个有序更新转换为其存储桶集合的更新
- [服务器-58396](https://jira.mongodb.org/browse/SERVER-58396)将时间序列集合的元字段上的多个无序更新转换为其存储桶集合的更新
- [服务器-58406](https://jira.mongodb.org/browse/SERVER-58406)启用TestingProctor后启用调试日志记录
- [服务器-58412](https://jira.mongodb.org/browse/SERVER-58412)更改settings.chaining在副本集配置中启用应该会影响同步源的更改
- [服务器-58480](https://jira.mongodb.org/browse/SERVER-58480)在ContinuousTenantMigration钩子中添加必要的参数，以便进行适当的瞬态错误重试
- [服务器-58485](https://jira.mongodb.org/browse/SERVER-58485)在api_params_transaction.js中重试瞬态错误的事务
- [服务器-58492](https://jira.mongodb.org/browse/SERVER-58492)测试时间序列metaField仅删除与let
- [服务器-58493](https://jira.mongodb.org/browse/SERVER-58493)测试时间序列元仅限字段删除和提示
- [服务器-58519](https://jira.mongodb.org/browse/SERVER-58519)修复带有并发集合删除的仅元字段时间序列删除
- [服务器-58583](https://jira.mongodb.org/browse/SERVER-58583)mongocryptd的查询分析不处理查找中的表达式投影
- [服务器-58617](https://jira.mongodb.org/browse/SERVER-58617)允许在没有metaField的情况下更新时间序列集合
- [服务器-58721](https://jira.mongodb.org/browse/SERVER-58721)processReplSetInitiate没有设置稳定的时间戳或接受稳定的检查点
- [服务器-58722](https://jira.mongodb.org/browse/SERVER-58722)在mandcard_index_multikey.js中为测试用例分配唯一的集合名称
- [服务器-58739](https://jira.mongodb.org/browse/SERVER-58739)SERVER-58334中列出的完整待办事项
- [服务器-58774](https://jira.mongodb.org/browse/SERVER-58774)清理timeeries_update_delete_util.h并更新对queryOnlyDependsOnMetaField()的引用
- [服务器-58777](https://jira.mongodb.org/browse/SERVER-58777)插入和更新对空子文档是否是嵌套级别存在分歧
- [服务器-58796](https://jira.mongodb.org/browse/SERVER-58796)为时间序列元字段专用更新启用“let”
- [服务器-58797](https://jira.mongodb.org/browse/SERVER-58797)为时间序列元字段专用更新启用“提示”
- [服务器-58798](https://jira.mongodb.org/browse/SERVER-58798)测试“arrayFilters”是否有时间序列元仅限字段的更新
- [服务器-58803](https://jira.mongodb.org/browse/SERVER-58803)测试仅限时间序列的元字段删除关闭内存桶
- [服务器-58804](https://jira.mongodb.org/browse/SERVER-58804)确保时间序列metaField仅更新关闭内存存储桶
- [服务器-58811](https://jira.mongodb.org/browse/SERVER-58811)timeseries_update_delete_util.h中的单元测试查询函数
- [服务器-58861](https://jira.mongodb.org/browse/SERVER-58861)ephemeralForTest排序数据接口在大型终端机器上不起作用
- [服务器-58872](https://jira.mongodb.org/browse/SERVER-58872)为分片时间序列测试添加require_fcv_51标签
- [服务器-58877](https://jira.mongodb.org/browse/SERVER-58877)如果没有可用的存储引擎，则禁止在SpillableCache中溢出到磁盘。
- [服务器-58888](https://jira.mongodb.org/browse/SERVER-58888)$union用模式解释“executionStats”不考虑被推下的阶段
- [服务器-58896](https://jira.mongodb.org/browse/SERVER-58896)修复带有并发集合掉落的仅元字段时间序列更新
- [服务器-58899](https://jira.mongodb.org/browse/SERVER-58899)设置curOp命名空间以查看时间序列更新的集合
- [服务器-58903](https://jira.mongodb.org/browse/SERVER-58903)Blacklist index_many2.js from tenant migration stepdown/kill/终止直通套件
- [服务器-58930](https://jira.mongodb.org/browse/SERVER-58930)mongodb-enterprise-unstable-server与mongodb-enterprise-unstable-shell冲突
- [服务器-58967](https://jira.mongodb.org/browse/SERVER-58967)设置curOp命名空间以查看时间序列删除的集合
- [服务器-59024](https://jira.mongodb.org/browse/SERVER-59024)timeseries_update_delete_util.h中的单元测试更新函数
- [服务器-59036](https://jira.mongodb.org/browse/SERVER-59036)在clustered_index_types.js中使用唯一的存储桶集合名称
- [服务器-59054](https://jira.mongodb.org/browse/SERVER-59054)对生成的模糊器任务强制超时
- [服务器-59067](https://jira.mongodb.org/browse/SERVER-59067)修复TLS比赛条件
- [服务器-59072](https://jira.mongodb.org/browse/SERVER-59072)不允许更新时间序列集合，其中向上插入：true
- [服务器-59074](https://jira.mongodb.org/browse/SERVER-59074)不要仅仅为了设置/等待oplog可见性而获取存储票据
- [服务器-59088](https://jira.mongodb.org/browse/SERVER-59088)创建功能标志，以最大限度地支持分片时间序列集合：更新和删除
- [服务器-59092](https://jira.mongodb.org/browse/SERVER-59092)支持$jsonSchema运算符删除时间序列
- [服务器-59094](https://jira.mongodb.org/browse/SERVER-59094)shardCollection命令应确保正确创建时间序列集合
- [服务器-59104](https://jira.mongodb.org/browse/SERVER-59104)删除findNthChild（）在时间序列更新/删除代码中的用法
- [服务器-59108](https://jira.mongodb.org/browse/SERVER-59108)解决交易操作在下台后不会被杀死的竞争
- [服务器-59110](https://jira.mongodb.org/browse/SERVER-59110)更新电源循环中的连接错误消息
- [服务器-59120](https://jira.mongodb.org/browse/SERVER-59120)为commitChunksMerge创建单元测试
- [服务器-59126](https://jira.mongodb.org/browse/SERVER-59126)在时间序列集合上删除集合应该将底层存储桶集合放在配置服务器上
- [服务器-59140](https://jira.mongodb.org/browse/SERVER-59140)验证时间序列碎片收集命令的碎片键模式
- [服务器-59141](https://jira.mongodb.org/browse/SERVER-59141)查看RPM规范文件是否有潜在错误
- [服务器-59143](https://jira.mongodb.org/browse/SERVER-59143)如果在忍者模块到位的情况下使用“--忍者”工具选项，则很难失败
- [服务器-59150](https://jira.mongodb.org/browse/SERVER-59150)non_durable_writes_on_primary_can_reach_majority.js不会等待辅助时间戳的持久时间戳
- [服务器-59154](https://jira.mongodb.org/browse/SERVER-59154)添加更全面的时间序列更新文档测试用例
- [服务器-59159](https://jira.mongodb.org/browse/SERVER-59159)$min/max窗口函数null语义与它们的累加器语义不同
- [服务器-59164](https://jira.mongodb.org/browse/SERVER-59164)在分片时间序列命名空间上的所有写入命令都应该在mongos上转换为桶命名空间
- [服务器-59173](https://jira.mongodb.org/browse/SERVER-59173)审核时间序列更新和删除的错误消息
- [服务器-59174](https://jira.mongodb.org/browse/SERVER-59174)报告为时间序列更新/删除而更新/删除的文件数量
- [服务器-59180](https://jira.mongodb.org/browse/SERVER-59180)为分片时间序列集合实现更新重写和路由
- [服务器-59181](https://jira.mongodb.org/browse/SERVER-59181)为分片时间序列集合实现删除重写和路由
- [服务器-59184](https://jira.mongodb.org/browse/SERVER-59184)添加测试，以验证块迁移后时间序列索引和存储桶收集的正确性
- [服务器-59190](https://jira.mongodb.org/browse/SERVER-59190)IndexAccessMethod可以在索引构建批量负载产量期间销毁
- [服务器-59191](https://jira.mongodb.org/browse/SERVER-59191)SPIKE：git.get_project无法克隆
- [服务器-59194](https://jira.mongodb.org/browse/SERVER-59194)排除timeeries_update_concurrent.js与其他测试并行运行
- [服务器-59196](https://jira.mongodb.org/browse/SERVER-59196)添加测试，解释分片时间序列集合的命令
- [服务器-59214](https://jira.mongodb.org/browse/SERVER-59214)在oplog_visibility.js断言消息中包含查询结果
- [服务器-59218](https://jira.mongodb.org/browse/SERVER-59218)仅将顶级元字段替换为“元”，用于时间序列更新/删除
- [服务器-59226](https://jira.mongodb.org/browse/SERVER-59226)标记为不间断的配置文件会话下台时陷入僵局
- [服务器-59294](https://jira.mongodb.org/browse/SERVER-59294)检查oidReset的操作类型
- [服务器-59298](https://jira.mongodb.org/browse/SERVER-59298)生成的模糊器任务应使用timeout_secs，而不是exec_timeout_secs
- [服务器-59299](https://jira.mongodb.org/browse/SERVER-59299)改进$匹配阶段
- [服务器-59321](https://jira.mongodb.org/browse/SERVER-59321)在编译扩展中将后缀var更新为v5.0
- [服务器-59409](https://jira.mongodb.org/browse/SERVER-59409)重新配置复制和升级之间的竞争可能导致RSM卡在报告ReplicaSetNoPrimary中
- [服务器-59410](https://jira.mongodb.org/browse/SERVER-59410)清理时间序列更新并删除测试
- [服务器-59413](https://jira.mongodb.org/browse/SERVER-59413)修复 tenant_migration_fetch_committed_transactions_retry.js 中可能的比赛
- [服务器-59425](https://jira.mongodb.org/browse/SERVER-59425)Ninja未能在本地安装存档目标
- [服务器-59445](https://jira.mongodb.org/browse/SERVER-59445)在oplog_sampling.js中增加存储日志的冗短性
- [服务器-59456](https://jira.mongodb.org/browse/SERVER-59456)启动LDAPReaper线程池
- [服务器-59459](https://jira.mongodb.org/browse/SERVER-59459)mongodb无法使用glibc-2.34构建
- [服务器-59476](https://jira.mongodb.org/browse/SERVER-59476)validate_commit_message不允许恢复有线型进口
- [服务器-59483](https://jira.mongodb.org/browse/SERVER-59483)tenant_migration_collection_ttl.js必须考虑收件人克隆人和捐赠者TTL扫描之间的种族
- [服务器-59491](https://jira.mongodb.org/browse/SERVER-59491)将“requires_multi_updates”标签添加到geo_update2.js
- [服务器-59505](https://jira.mongodb.org/browse/SERVER-59505)关于混合嵌套测量的时间序列查询可能会错过一些事件
- [服务器-59515](https://jira.mongodb.org/browse/SERVER-59515)修复MergeAuthzCollection命令中的默认值
- [服务器-59525](https://jira.mongodb.org/browse/SERVER-59525)TenantMigrationRecipientAccessBlocker在恢复时没有正确初始化
- [服务器-59591](https://jira.mongodb.org/browse/SERVER-59591)LockerNoop::isW()总是返回true，允许多个操作认为他们同时持有全局独家锁
- [服务器-59606](https://jira.mongodb.org/browse/SERVER-59606)不要对没有运行时历史记录的测试设置动态超时
- [服务器-59635](https://jira.mongodb.org/browse/SERVER-59635)将ConfigSvrMoveChunkCommand标记为可中断
- [服务器-59649](https://jira.mongodb.org/browse/SERVER-59649)多版本生成的套件文件名应该与正常任务不同
- [服务器-59662](https://jira.mongodb.org/browse/SERVER-59662)使用时间序列插入和中断生成命令创建并发测试
- [服务器-59666](https://jira.mongodb.org/browse/SERVER-59666)重命名系统。应禁止收集桶
- [服务器-59669](https://jira.mongodb.org/browse/SERVER-59669)并发测试中的未受保护变量 TransientSSLParamsStressTestWithManager
- [服务器-59672](https://jira.mongodb.org/browse/SERVER-59672)修复在step_down_during_draining3.js中停止复制的问题
- [服务器-59676](https://jira.mongodb.org/browse/SERVER-59676)DocumentSourceFindAndModifyImageLookup在碎片中使用时可以点击不变
- [服务器-59693](https://jira.mongodb.org/browse/SERVER-59693)ReshardingTest夹具在尝试运行replSetStepUp时必须容纳进入ROLLBACK的节点
- [服务器-59701](https://jira.mongodb.org/browse/SERVER-59701)使用外部时区数据库时处理某些时区时出错
- [服务器-59720](https://jira.mongodb.org/browse/SERVER-59720)在时间序列元字段仅更新中正确处理$rename
- [服务器-59727](https://jira.mongodb.org/browse/SERVER-59727)TenantMigrationAccessBlockerRegistry::_remove在存在两个mtab时不会删除
- [服务器-59765](https://jira.mongodb.org/browse/SERVER-59765)$dateAdd/$dateSubtract不会检测到某些“金额”值的溢出
- [服务器-59778](https://jira.mongodb.org/browse/SERVER-59778)Robustify timeseries_query.js测试
- [服务器-59796](https://jira.mongodb.org/browse/SERVER-59796)在catchup.js中停止在次要复制之前等待复制
- [服务器-59804](https://jira.mongodb.org/browse/SERVER-59804)在system_perf.yml中使用单独的YCSB分支
- [服务器-59805](https://jira.mongodb.org/browse/SERVER-59805)提供一种检查和删除无效索引目录选项的方法
- [服务器-59843](https://jira.mongodb.org/browse/SERVER-59843)SERVER-56639中列出的完整待办事项
- [服务器-59865](https://jira.mongodb.org/browse/SERVER-59865)更新repl拱门指南，以反映新的隐式默认写入问题公式
- [服务器-59866](https://jira.mongodb.org/browse/SERVER-59866)当currentCommittedSnapshot被删除时，阻止FCV等待多数
- [服务器-59867](https://jira.mongodb.org/browse/SERVER-59867)ReplSetConfig/MemberConfig中的拆分地平线映射应该确定性地序列化
- [服务器-59868](https://jira.mongodb.org/browse/SERVER-59868)在 durable_history_index_usage.js中修复索引构建竞赛
- [服务器-59876](https://jira.mongodb.org/browse/SERVER-59876)在建立出口连接时，从libcrypto.so返回的严重延迟
- [服务器-59885](https://jira.mongodb.org/browse/SERVER-59885)在验证集合之前，等待副本集稳定下来
- [服务器-59925](https://jira.mongodb.org/browse/SERVER-59925)压力测试和修复过期闲置桶中的死锁
- [服务器-59934](https://jira.mongodb.org/browse/SERVER-59934)在同一命名空间上删除视图和创建集合可能会被乱复制
- [服务器-59943](https://jira.mongodb.org/browse/SERVER-59943)多版本设置不应从测试分支下载资源
- [服务器-59952](https://jira.mongodb.org/browse/SERVER-59952)修复重新吸烟过程中的多版本burnin_tests错误
- [服务器-59970](https://jira.mongodb.org/browse/SERVER-59970)修复authate命令的返回值
- [服务器-60007](https://jira.mongodb.org/browse/SERVER-60007)如果UUID与预期不同，则执行命令删除集合
- [服务器-60025](https://jira.mongodb.org/browse/SERVER-60025)由于生成无效的运行时对象，队列文档使服务器崩溃
- [服务器-60038](https://jira.mongodb.org/browse/SERVER-60038)使用读取关注快照禁止交易中的setWindowFields
- [服务器-60062](https://jira.mongodb.org/browse/SERVER-60062)修复拓扑描述克隆中发现的重复uuid和服务器描述深度副本
- [服务器-60096](https://jira.mongodb.org/browse/SERVER-60096)将rollbackHangCommonPointBeforeReplCommitPoint failpoint添加到RVR
- [服务器-60145](https://jira.mongodb.org/browse/SERVER-60145)生成的任务resmoke配置文件应基于任务名称
- [服务器-60150](https://jira.mongodb.org/browse/SERVER-60150)使用一些功能标志向5.0添加变体
- [服务器-60201](https://jira.mongodb.org/browse/SERVER-60201)清理时间序列更新并删除实用函数
- [服务器-60218](https://jira.mongodb.org/browse/SERVER-60218)改进$group阶段
- [服务器-60223](https://jira.mongodb.org/browse/SERVER-60223)容器主机应该在/
- [服务器-60228](https://jira.mongodb.org/browse/SERVER-60228)不建议使用RPM外部依赖扫描仪
- [服务器-60259](https://jira.mongodb.org/browse/SERVER-60259)在任务生成中设置require_multiversion
- [服务器-60263](https://jira.mongodb.org/browse/SERVER-60263)stitch_support库因缺少静态初始化器而无法加载
- [服务器-60269](https://jira.mongodb.org/browse/SERVER-60269)启用ShardedTimeSeriesUpdateDelete功能标志
- [服务器-60270](https://jira.mongodb.org/browse/SERVER-60270)向窗口函数添加标签读取关注测试
- [服务器-60283](https://jira.mongodb.org/browse/SERVER-60283)禁用与ephemeralForTest存储引擎不兼容的测试
- [服务器-60285](https://jira.mongodb.org/browse/SERVER-60285)为分片时间序列集合上的删除创建FSM测试
- [服务器-60290](https://jira.mongodb.org/browse/SERVER-60290)更新Windows外部授权测试发行版
- [服务器-60299](https://jira.mongodb.org/browse/SERVER-60299)Bugzilla #2613的Backport PCRE错误修复
- [服务器-60322](https://jira.mongodb.org/browse/SERVER-60322)在dbs之间重命名收集期间，索引构建初始化失败可能无法从集合元数据中清理自己
- [服务器-60326](https://jira.mongodb.org/browse/SERVER-60326)当X509证书的主题名称为空时，Windows Server无法启动
- [服务器-60340](https://jira.mongodb.org/browse/SERVER-60340)不要在动力循环中通过SSH隧道转发mongo端口
- [服务器-60343](https://jira.mongodb.org/browse/SERVER-60343)单相索引构建在中止时执行未盖章的目录写入
- [服务器-60348](https://jira.mongodb.org/browse/SERVER-60348)将 featureFlagTimeseriesUpdatesAndDeletes添加到5.0后端口构建器
- [服务器-60406](https://jira.mongodb.org/browse/SERVER-60406)当没有搜索结果时，$searchMeta在分片集群中的未分片集合上失败
- [服务器-60418](https://jira.mongodb.org/browse/SERVER-60418)drop_sharded_timeseries_collection不支持降级
- [服务器-60420](https://jira.mongodb.org/browse/SERVER-60420)缓慢的“碎片收集”路径在关键部分下执行繁重的工作
- [服务器-60424](https://jira.mongodb.org/browse/SERVER-60424)TenantOplogFetcher超时重现聚合光标
- [服务器-60430](https://jira.mongodb.org/browse/SERVER-60430)[v5.0] tenant_migration_recipient_access_blocker_rollback.js 持有一个故障点，阻止以前的实例完成
- [服务器-60450](https://jira.mongodb.org/browse/SERVER-60450)在否定金额值时添加$dateSubtract的错误检查
- [服务器-60451](https://jira.mongodb.org/browse/SERVER-60451)索引构建代码可以访问无效的BSONObj，因为光标被保存并恢复到较低级别
- [服务器-60452](https://jira.mongodb.org/browse/SERVER-60452)修复集合不存在时的时间序列碎片密钥验证
- [服务器-60456](https://jira.mongodb.org/browse/SERVER-60456)在Windows上严重延迟绑定期间，LDAPBindOptions超出了范围
- [服务器-60469](https://jira.mongodb.org/browse/SERVER-60469)尽管没有捕获预图像，但可重试删除为图像前链保留了两个选项
- [服务器-60495](https://jira.mongodb.org/browse/SERVER-60495)在DDL协调员中重试失败的ToSatisfyReadPreference
- [服务器-60497](https://jira.mongodb.org/browse/SERVER-60497)renameCollectionForApplyOps应该跳过system.buckets重命名检查
- [服务器-60511](https://jira.mongodb.org/browse/SERVER-60511)与固定时间戳相比， getPinnedOplog 返回值应始终为 std::min
- [服务器-60518](https://jira.mongodb.org/browse/SERVER-60518)范围删除器中的最佳努力检查可能会离开孤儿
- [服务器-60523](https://jira.mongodb.org/browse/SERVER-60523)独立夹具错误地处理目录创建异常
- [服务器-60544](https://jira.mongodb.org/browse/SERVER-60544)替换复制系统中对svelay的剩余引用
- [服务器-60548](https://jira.mongodb.org/browse/SERVER-60548)Timeseries插入路径segfault
- [服务器-60550](https://jira.mongodb.org/browse/SERVER-60550)通过sendToRecipient()提交远程命令时，m migration_util函数可能会错过一些响应错误
- [服务器-60554](https://jira.mongodb.org/browse/SERVER-60554)减少电源循环中ssh连接选项中的连接尝试
- [服务器-60588](https://jira.mongodb.org/browse/SERVER-60588)$multiply在某些情况下在经典引擎中错误地抛出错误
- [服务器-60593](https://jira.mongodb.org/browse/SERVER-60593)Robustify sample_timeseries.js测试
- [服务器-60606](https://jira.mongodb.org/browse/SERVER-60606)当索引构建从数据克隆阶段开始时，初始同步期间的比赛条件
- [服务器-60651](https://jira.mongodb.org/browse/SERVER-60651)将autoSplitVector逻辑反向移植到v5.0
- [服务器-60661](https://jira.mongodb.org/browse/SERVER-60661)[5.0]添加测试，以确保在功能标志关闭时分片时间序列集合正常工作
- [服务器-60739](https://jira.mongodb.org/browse/SERVER-60739)在timeseries_balancer.js中更改块大小，以更快地拆分块
- [服务器-60740](https://jira.mongodb.org/browse/SERVER-60740)Robustify timeseries_multiple_mongos.js测试
- [服务器-60762](https://jira.mongodb.org/browse/SERVER-60762)$setWindowFields分区数组应该始终出错
- [服务器-60766](https://jira.mongodb.org/browse/SERVER-60766)为分片时间序列测试添加'does_not_support_transactions'
- [服务器-60801](https://jira.mongodb.org/browse/SERVER-60801)修复日志保存人快照位置
- [服务器-60869](https://jira.mongodb.org/browse/SERVER-60869)重新添加逻辑以在仲裁器上设置功能兼容性版本
- [服务器-60877](https://jira.mongodb.org/browse/SERVER-60877)在replLogUpdate上更正MutableOplogEntry的无意副本
- [服务器-60896](https://jira.mongodb.org/browse/SERVER-60896)在触发过滤事件之前，快速向前审计线轴
- [服务器-60913](https://jira.mongodb.org/browse/SERVER-60913)在某些平台上，软件包测试失败了
- [服务器-60948](https://jira.mongodb.org/browse/SERVER-60948)在mit_id_index.js的新集合中插入文档，以等待在辅助索引上成功构建
- [服务器-60971](https://jira.mongodb.org/browse/SERVER-60971)删除对BF建议服务的来电
- [服务器-61094](https://jira.mongodb.org/browse/SERVER-61094)从MultiIndexBlock生成KeyStrings可能会导致内存限制得不到尊重
- [服务器-61096](https://jira.mongodb.org/browse/SERVER-61096)在Windows上重新创建dbpath时，ResetDbPath有时会出错
- [WT-5009](https://jira.mongodb.org/browse/WT-5009)将剩余的有线tiger-perf-lsm测试迁移到Evergreen
- [WT-5270](https://jira.mongodb.org/browse/WT-5270)为常青创建wtperf脚本
- [WT-5743](https://jira.mongodb.org/browse/WT-5743)当为VLCS清除事务ID时重写单元格
- [WT-5939](https://jira.mongodb.org/browse/WT-5939)修复了test_config06中导致“无法删除目录”错误的命名冲突（仅限OSX）
- [WT-6077](https://jira.mongodb.org/browse/WT-6077)添加新的统计数据来跟踪紧凑的进度
- [WT-6193](https://jira.mongodb.org/browse/WT-6193)在格式测试中重新启用VLCS测试
- [WT-6669](https://jira.mongodb.org/browse/WT-6669)在常青中启用VLCS覆盖和检查点测试
- [WT-6900](https://jira.mongodb.org/browse/WT-6900)为架构指南编写“模式”子页面
- [WT-6903](https://jira.mongodb.org/browse/WT-6903)为建筑指南编写“dhandle/btree”子页面
- [WT-6907](https://jira.mongodb.org/browse/WT-6907)为架构指南编写“快照”子页面
- [WT-6909](https://jira.mongodb.org/browse/WT-6909)驱逐建筑指南
- [WT-6913](https://jira.mongodb.org/browse/WT-6913)文件系统和os接口架构指南
- [WT-7169](https://jira.mongodb.org/browse/WT-7169)提交ts不应小于test_timestamp22.py中最后一个耐用的ts
- [WT-7250](https://jira.mongodb.org/browse/WT-7250)修复测试以执行显式驱逐，而不是依赖低缓存大小
- [WT-7294](https://jira.mongodb.org/browse/WT-7294)重新启用VLCS常绿内生性测试
- [WT-7392](https://jira.mongodb.org/browse/WT-7392)添加了驱逐的旗帜来处理，供会话扫描使用
- [WT-7494](https://jira.mongodb.org/browse/WT-7494)添加Python测试以在恢复期间触发更新恢复驱逐
- [WT-7601](https://jira.mongodb.org/browse/WT-7601)修复操作跟踪文档中的错别字
- [WT-7695](https://jira.mongodb.org/browse/WT-7695)在__cursor_key_order_check_row中发现密钥乱序时，倾倒整棵树
- [WT-7745](https://jira.mongodb.org/browse/WT-7745)添加宏来识别btree对象的uris
- [WT-7757](https://jira.mongodb.org/browse/WT-7757)跳过过时的页，而无需阅读它们
- [WT-7844](https://jira.mongodb.org/browse/WT-7844)为分层存储添加tiered_abort压力测试。
- [WT-7885](https://jira.mongodb.org/browse/WT-7885)确保WiredTiger测试尽可能使用tcmalloc
- [WT-7902](https://jira.mongodb.org/browse/WT-7902)在系统范围的检查点后重试更改命令
- [WT-7914](https://jira.mongodb.org/browse/WT-7914)仅在需要时更新文档
- [WT-7942](https://jira.mongodb.org/browse/WT-7942)当找不到all_durable时间戳时，以测试/格式释放时间戳锁定
- [WT-7949](https://jira.mongodb.org/browse/WT-7949)将本地存储缓存和存储桶目录更改为相对于WT_HOME
- [WT-7957](https://jira.mongodb.org/browse/WT-7957)分层存储应在本地系统中查找对象
- [WT-7959](https://jira.mongodb.org/browse/WT-7959)在test_cursor17中，skipped_pages小于预期_pages_skipped
- [WT-7980](https://jira.mongodb.org/browse/WT-7980)创建“log:”光标的界面，在返回日志文件之前切换日志文件
- [WT-7987](https://jira.mongodb.org/browse/WT-7987)创建单元测试以检查紧凑型不会重写溢出项目
- [WT-7989](https://jira.mongodb.org/browse/WT-7989)Compact在与系统检查点同时运行时退出
- [WT-7992](https://jira.mongodb.org/browse/WT-7992)无论可见性如何，提供API以返回表中的最后一个键
- [WT-7993](https://jira.mongodb.org/browse/WT-7993)如果收集手柄，并且不在攻击性驱逐模式下，请进行驱逐睡眠，让检查站抓住有争议的旋转锁。
- [WT-8001](https://jira.mongodb.org/browse/WT-8001)修复设置全局最古老和稳定的时间戳时的不一致API行为
- [WT-8007](https://jira.mongodb.org/browse/WT-8007)更新脚本以正确生成CPP测试套件框架的新测试
- [WT-8011](https://jira.mongodb.org/browse/WT-8011)添加对随机选择RS或VLCS的格式支持
- [WT-8017](https://jira.mongodb.org/browse/WT-8017)在常青中重新启用VLCS格式压力测试。
- [WT-8019](https://jira.mongodb.org/browse/WT-8019)VLCS快照隔离搜索不匹配
- [WT-8022](https://jira.mongodb.org/browse/WT-8022)验证WT_CURSOR.modify格式测试程序中的返回值
- [WT-8023](https://jira.mongodb.org/browse/WT-8023)使用全局事务信息来评估会话是否有活动交易
- [WT-8024](https://jira.mongodb.org/browse/WT-8024)在《拱门指南》中向交叉引用添加链接文本
- [WT-8026](https://jira.mongodb.org/browse/WT-8026)在Evergreen中运行PPC/zSeries/macOS主线构建的频率较低
- [WT-8034](https://jira.mongodb.org/browse/WT-8034)在PR测试中编译文档时，请使用PR分支
- [WT-8035](https://jira.mongodb.org/browse/WT-8035)处理字符串键格式启用前缀的词典比较
- [WT-8036](https://jira.mongodb.org/browse/WT-8036)在wt_evict_thread_run和_wt_evict_thread_stop的两个断言语句中添加了连接恐慌标志。
- [WT-8039](https://jira.mongodb.org/browse/WT-8039)添加一个新的API标志进行API检查，而不是清除准备好的标志，这可能会错误地迫使回滚
- [WT-8041](https://jira.mongodb.org/browse/WT-8041)反复回滚到稳定的解压值
- [WT-8042](https://jira.mongodb.org/browse/WT-8042)创建一个常青作业来运行测试/检查点变体
- [WT-8043](https://jira.mongodb.org/browse/WT-8043)将“ripcip”参数整理到可见性代码中
- [WT-8044](https://jira.mongodb.org/browse/WT-8044)启用前缀的搜索仅返回匹配的键
- [WT-8048](https://jira.mongodb.org/browse/WT-8048)删除split_8时应力配置
- [WT-8055](https://jira.mongodb.org/browse/WT-8055)修复了紧凑型在与检查站同时运行时退出的问题
- [WT-8057](https://jira.mongodb.org/browse/WT-8057)添加一个测试，以验证更改紧凑型不会导致数据丢失
- [WT-8059](https://jira.mongodb.org/browse/WT-8059)当没有发现溢出项目时，添加一个打捞支票
- [WT-8067](https://jira.mongodb.org/browse/WT-8067)修复确保将最新的历史存储值插入完整更新的代码
- [WT-8068](https://jira.mongodb.org/browse/WT-8068)改进__rollback_row_modify控制流程
- [WT-8069](https://jira.mongodb.org/browse/WT-8069)覆盖率分析缺陷120706：冗余测试
- [WT-8070](https://jira.mongodb.org/browse/WT-8070)消除prefix_key和prefix_search之间的差异
- [WT-8075](https://jira.mongodb.org/browse/WT-8075)覆盖分析缺陷120712：“常量”变量守卫死代码
- [WT-8077](https://jira.mongodb.org/browse/WT-8077)准备好的更新解决后，将页面标记为脏
- [WT-8078](https://jira.mongodb.org/browse/WT-8078)实现分层存储本地保留缓存
- [WT-8079](https://jira.mongodb.org/browse/WT-8079)添加断点以验证错误宏，清理API处理
- [WT-8081](https://jira.mongodb.org/browse/WT-8081)修复分层钩子函数，为配置字符串提供默认值
- [WT-8086](https://jira.mongodb.org/browse/WT-8086)为条目附近的前缀搜索创建cpp测试
- [WT-8092](https://jira.mongodb.org/browse/WT-8092)当插入列表中有按键时，前缀提前退出
- [WT-8094](https://jira.mongodb.org/browse/WT-8094)在csv提取器中免费修复使用
- [WT-8101](https://jira.mongodb.org/browse/WT-8101)在常青中启用CPP测试的诊断模式
- [WT-8103](https://jira.mongodb.org/browse/WT-8103)如果不是树，请跳过处理
- [WT-8104](https://jira.mongodb.org/browse/WT-8104)修复ASAN注意到的内存泄漏
- [WT-8108](https://jira.mongodb.org/browse/WT-8108)使用临时文件并在本地商店中重命名
- [WT-8112](https://jira.mongodb.org/browse/WT-8112)跳过空格检查，每个覆盖率
- [WT-8113](https://jira.mongodb.org/browse/WT-8113)删除死代码，每个覆盖率
- [WT-8115](https://jira.mongodb.org/browse/WT-8115)仅在cpp文件中需要时定义宏
- [WT-8116](https://jira.mongodb.org/browse/WT-8116)修复cpp测试框架中与继承有关的问题
- [WT-8119](https://jira.mongodb.org/browse/WT-8119)将有针对性的紧凑测试添加到现有测试框架中
- [WT-8121](https://jira.mongodb.org/browse/WT-8121)创建一个长期运行的压力测试，在很长一段时间内插入大量数据
- [WT-8125](https://jira.mongodb.org/browse/WT-8125)更新hs_cleanup cppsuite测试以使用新的thread_context逻辑
- [WT-8126](https://jira.mongodb.org/browse/WT-8126)只有在实例化已删除的行商店页页面时，才将btree标记为脏
- [WT-8146](https://jira.mongodb.org/browse/WT-8146)CPP测试结束时停止跟踪组件
- [WT-8147](https://jira.mongodb.org/browse/WT-8147)在cppsuite配置中检测无效语法
- [WT-8148](https://jira.mongodb.org/browse/WT-8148)修复util_verify.c中的评论错别字
- [WT-8161](https://jira.mongodb.org/browse/WT-8161)减少CMake常青烟雾的冗长
- [WT-8162](https://jira.mongodb.org/browse/WT-8162)在'define_c_test'助手中重构烟雾arg的使用
- [WT-8164](https://jira.mongodb.org/browse/WT-8164)在Windows上禁用rollback_to_stable10 python测试
- [WT-8168](https://jira.mongodb.org/browse/WT-8168)修复cpp测试附近搜索中未使用的变量
- [WT-8171](https://jira.mongodb.org/browse/WT-8171)在CPP测试框架中实现C风格测试
- [WT-8193](https://jira.mongodb.org/browse/WT-8193)VLCS回滚到稳定中的错误角落案例
- [WT-8199](https://jira.mongodb.org/browse/WT-8199)让s_all接受符合Python PEP8的换行符
- [WT-8203](https://jira.mongodb.org/browse/WT-8203)修复访问页面时的分层违规行为
- [WT-8204](https://jira.mongodb.org/browse/WT-8204)在“wt7989_compact_checkpoint”CSuite测试中修复可能的比赛条件
- [WT-8214](https://jira.mongodb.org/browse/WT-8214)只发布WiredTiger开发Evergreen项目的文档
- [WT-8225](https://jira.mongodb.org/browse/WT-8225)在zstd获取上下文中修复数据竞赛
- [WT-8226](https://jira.mongodb.org/browse/WT-8226)修复 largest_key 未能考虑已准备好的更新



## 5.0.3 更改日志

### 安全

[服务器-57716](https://jira.mongodb.org/browse/SERVER-57716)PEM中的部分证书链导致OCSP中的验证失败

### 分片

- [服务器-27383](https://jira.mongodb.org/browse/SERVER-27383)需要--replSet与--configsvr
- [服务器-50937](https://jira.mongodb.org/browse/SERVER-50937)让分片协调员支持恢复
- [服务器-55824](https://jira.mongodb.org/browse/SERVER-55824)让ssl_get_more.js将碎片作为副本集开始
- [服务器-57487](https://jira.mongodb.org/browse/SERVER-57487)在setFCV 4.4 «--» 5.0期间更新块不能长时间阻止平衡
- [服务器-57953](https://jira.mongodb.org/browse/SERVER-57953)_flushReshardingStateChange尝试刷新碎片版本，而另一个刷新已经等待，导致不变故障
- [服务器-58081](https://jira.mongodb.org/browse/SERVER-58081)_flushReshardingState从协调员比赛中更改为捐赠者碎片获取关键部分，阻碍了分片操作
- [服务器-58315](https://jira.mongodb.org/browse/SERVER-58315)更改jstests，不要使用独立节点作为碎片或配置服务器
- [服务器-58342](https://jira.mongodb.org/browse/SERVER-58342)允许指定reshardCollection区域为空
- [服务器-58603](https://jira.mongodb.org/browse/SERVER-58603)确保TempReshardingCollectionExistsWithIndexes如果之前删除集合，可能会遇到不变量
- [服务器-58702](https://jira.mongodb.org/browse/SERVER-58702)修复ReshardingDataReplication中的注释并更新其成员声明顺序
- [服务器-58720](https://jira.mongodb.org/browse/SERVER-58720)删除CSRS元数据后，DropDatabaseCoordinator不得重新执行破坏性逻辑
- [服务器-58781](https://jira.mongodb.org/browse/SERVER-58781)如果“捐助者”或“受人”字段为空，则分片协调员观察员不应履行承诺
- [服务器-58868](https://jira.mongodb.org/browse/SERVER-58868)启用/删除注释的moveChunk + AllowMigrations测试
- [服务器-58917](https://jira.mongodb.org/browse/SERVER-58917)等到捐助者/接受者意识到协调员坚持了决定，然后期待resharding_prohibited_commands.js中的collMod、createIndexes和dropIndexes成功
- [服务器-58926](https://jira.mongodb.org/browse/SERVER-58926)如果关键部分已经发布，则重新分片捐赠者不应尝试设置关键部分的停止时间
- [服务器-59114](https://jira.mongodb.org/browse/SERVER-59114)如果远程供体碎片响应中断异常，ReshardingOplogFetcher将停止获取新的oplog条目
- [服务器-59292](https://jira.mongodb.org/browse/SERVER-59292)由于WithAutomaticRetry，完成未来可以设置不止一次

### 复制

- [服务器-58133](https://jira.mongodb.org/browse/SERVER-58133)使用拆分复制任务，因为它们因“多数”隐式默认写入问题而超时
- [服务器-58987](https://jira.mongodb.org/browse/SERVER-58987)修复read_only_test.js，以避免在复制恢复期间超过终点的起点。
- [服务器-59083](https://jira.mongodb.org/browse/SERVER-59083)catchup_takeover_with_higher_config.js需要被排除在多版本套件之外，以进行最后一次连续
- [服务器-59131](https://jira.mongodb.org/browse/SERVER-59131)在implicit_default_write_concern_upgrade_shards.js中将rawMongoProgramOutput搜索包装在 assert.soon中
- [服务器-59212](https://jira.mongodb.org/browse/SERVER-59212)在catchup_takeover_with_higher_config.js中等待追赶接管之前，请确保节点已下台
- [服务器-59478](https://jira.mongodb.org/browse/SERVER-59478)在 catchup_takeover_with_higher_config.js中获取RSTL之前，请移动serverStatus命令

### 查询

- [服务器-54791](https://jira.mongodb.org/browse/SERVER-54791)使用外部排序构建索引期间过度使用文件描述符
- [服务器-57448](https://jira.mongodb.org/browse/SERVER-57448)修复ExpressionParams::parseTwoDParams()以处理越界的关键模式中的int值
- [服务器-57667](https://jira.mongodb.org/browse/SERVER-57667)提高分片收集克隆管道的处理速度

### 储存

[服务器-58744](https://jira.mongodb.org/browse/SERVER-58744)封盖集合上的应用可能会违反多时间戳约束

### 构建和包装

* [WT-7830](https://jira.mongodb.org/browse/WT-7830)迁移python设置脚本以使用cmake

### 内部人员

- [服务器-52007](https://jira.mongodb.org/browse/SERVER-52007)为集成工作创建功能标志，以支持新的$search参数
- [服务器-53001](https://jira.mongodb.org/browse/SERVER-53001)SERVER-47323中列出的完整待办事项
- [服务器-53437](https://jira.mongodb.org/browse/SERVER-53437)更改默认写入关注到多数的架构指南更新
- [服务器-54735](https://jira.mongodb.org/browse/SERVER-54735)执行器关机可能导致AsyncTry-until使用ErrorCodes::BrokenPromise设置其结果
- [服务器-55589](https://jira.mongodb.org/browse/SERVER-55589)replSetMaintenance命令不接受RSTL
- [服务器-55664](https://jira.mongodb.org/browse/SERVER-55664)在ephemeralForTest中支持集群_id索引
- [服务器-55760](https://jira.mongodb.org/browse/SERVER-55760)AsyncTry的取消测试是疯狂的
- [服务器-55966](https://jira.mongodb.org/browse/SERVER-55966)AsyncTry不再处理从直到（）lambda的异常，导致进程崩溃
- [服务器-56235](https://jira.mongodb.org/browse/SERVER-56235)评估依赖于集合不是集群而不是时间序列的索引类型
- [服务器-56492](https://jira.mongodb.org/browse/SERVER-56492)用数组类型规范时间序列元数据
- [服务器-56580](https://jira.mongodb.org/browse/SERVER-56580)提升构建工具=稳定的下一个
- [服务器-56763](https://jira.mongodb.org/browse/SERVER-56763)在$merge不持有DB锁时验证集合纪元
- [服务器-56800](https://jira.mongodb.org/browse/SERVER-56800)如果CWWC不同意集群上的现有CWWC，则失败addShard
- [服务器-56844](https://jira.mongodb.org/browse/SERVER-56844)如果DWCF=w:1并且没有设置CWWC，则启动时使用Fassert碎片服务器
- [服务器-56845](https://jira.mongodb.org/browse/SERVER-56845)如果DWCF=w:1并且没有设置CWWC，则失败addShard
- [服务器-56846](https://jira.mongodb.org/browse/SERVER-56846)如果碎片服务器会更改DWCF并且没有设置CWWC，则无法重新配置碎片服务器
- [服务器-57086](https://jira.mongodb.org/browse/SERVER-57086)不要在v4.4中的hello命令上设置继承的maxTimeMSOpOnly截止日期
- [服务器-57140](https://jira.mongodb.org/browse/SERVER-57140)修复迁移shell脚本中的perl遗迹
- [服务器-57262](https://jira.mongodb.org/browse/SERVER-57262)允许节点投票给配置更高的候选人
- [服务器-57279](https://jira.mongodb.org/browse/SERVER-57279)更新日志管理器快照工作负载中的FCV常量
- [服务器-57360](https://jira.mongodb.org/browse/SERVER-57360)在~LockerImpl中记录“不变（_requests.empty（））；”的额外调试信息
- [服务器-57387](https://jira.mongodb.org/browse/SERVER-57387)create_view_does_not_take_database_X.js应该检查它的插入
- [服务器-57435](https://jira.mongodb.org/browse/SERVER-57435)从causally_consistent测试套件中排除 views_coll_stats.js
- [服务器-57465](https://jira.mongodb.org/browse/SERVER-57465)remove_newly_added_field_after_finishing_initial_sync.js不会等到新配置被复制
- [服务器-57520](https://jira.mongodb.org/browse/SERVER-57520)让set_audit_config.js测试启动碎片为副本集
- [服务器-57575](https://jira.mongodb.org/browse/SERVER-57575)调查Windows上的create_view_does_not_take_database_X.js故障
- [服务器-57585](https://jira.mongodb.org/browse/SERVER-57585)oplog_visibility.js为缺失的oplog条目打印空“下一个”时间戳
- [服务器-57599](https://jira.mongodb.org/browse/SERVER-57599)DocumentSourceBucketAuto在处置时返回eof
- [服务器-57615](https://jira.mongodb.org/browse/SERVER-57615)对于没有创建/停止副本集的测试，将CWWC重置为w:majority
- [服务器-57616](https://jira.mongodb.org/browse/SERVER-57616)等待辅助加载禁用_cluster_time_gossiping_in_unreadable_state.js中的签名键
- [服务器-57617](https://jira.mongodb.org/browse/SERVER-57617)让租户迁移中的OplogFetcher进行聚合查询，而不是查找
- [服务器-57630](https://jira.mongodb.org/browse/SERVER-57630)在Ubuntu 18.04上对OpenSSL 1.1.1运行时启用SSL_OP_NO_RENEGOTIATION
- [服务器-57651](https://jira.mongodb.org/browse/SERVER-57651)在查询规划器解析提示参数时防止整数溢出
- [服务器-57657](https://jira.mongodb.org/browse/SERVER-57657)disable_cluster_time_gossiping_in_unreadable_state.js不应该修改响应的$clusterTime
- [服务器-57700](https://jira.mongodb.org/browse/SERVER-57700)测量resharding::data_copy::fillBatchForInsert in ReshardingCollectionCloner::doOneBatch的延迟/吞吐量
- [服务器-57737](https://jira.mongodb.org/browse/SERVER-57737)索引构建代码路径可以通过调用 abandonSnapshot而不调用保存/恢复光标来抛出WCE并使活动光标无效。
- [服务器-57740](https://jira.mongodb.org/browse/SERVER-57740)ShardingTest也使用X509，首选TLS模式
- [服务器-58051](https://jira.mongodb.org/browse/SERVER-58051)Mongod.exe不会在Windows 10上发布旋转日志的文件句柄
- [服务器-58060](https://jira.mongodb.org/browse/SERVER-58060)添加新的聚合阶段，将RRFaM图像向下转换为oplog条目
- [服务器-58068](https://jira.mongodb.org/browse/SERVER-58068)被租户迁移中断的多重更新应等待迁移完成
- [服务器-58119](https://jira.mongodb.org/browse/SERVER-58119)single_node_set_new_hostname.js需要使用assert.soonNoExcept调用replSetReconfig
- [服务器-58152](https://jira.mongodb.org/browse/SERVER-58152)为从集群拓扑中删除故障Mongos创建功能标志
- [服务器-58160](https://jira.mongodb.org/browse/SERVER-58160)在cluster_x509_roate.js中增加出口超时
- [服务器-58184](https://jira.mongodb.org/browse/SERVER-58184)当在启动时恢复准备好的事务时，检查点线程会导致断言
- [服务器-58264](https://jira.mongodb.org/browse/SERVER-58264)只在主分支上运行Evergreen的cron作业
- [服务器-58293](https://jira.mongodb.org/browse/SERVER-58293)mongocryptd在解释命令响应中不包含服务器API字段
- [服务器-58353](https://jira.mongodb.org/browse/SERVER-58353)修复由于将最新版本更改为5.1而导致多版本套件中禁用的复制测试失败
- [服务器-58392](https://jira.mongodb.org/browse/SERVER-58392)在回滚时解开耐用的历史以重新获取
- [服务器-58399](https://jira.mongodb.org/browse/SERVER-58399)当操作失败文档验证时，在写入错误中复制errInfo字段
- [服务器-58402](https://jira.mongodb.org/browse/SERVER-58402)在 shutdown_primary.js 中增加关机命令的超时
- [服务器-58420](https://jira.mongodb.org/browse/SERVER-58420)优雅地处理umask中数据类型的降级
- [服务器-58432](https://jira.mongodb.org/browse/SERVER-58432)在警告弃用/删除旧操作代码时，在日志行5578800中包含dochub链接
- [服务器-58438](https://jira.mongodb.org/browse/SERVER-58438)租户迁移可重试写预取管道在负载下可能非常缓慢
- [服务器-58464](https://jira.mongodb.org/browse/SERVER-58464)并发关机插入时间序列期间的不变故障
- [服务器-58565](https://jira.mongodb.org/browse/SERVER-58565)调整replica_sets_jscore_passthrough的超时
- [服务器-58581](https://jira.mongodb.org/browse/SERVER-58581)添加从mongot填充的SEARCH_META变量
- [服务器-58582](https://jira.mongodb.org/browse/SERVER-58582)创建$文档阶段并实现无集合unionWith
- [服务器-58588](https://jira.mongodb.org/browse/SERVER-58588)实施$searchMeta阶段
- [服务器-58594](https://jira.mongodb.org/browse/SERVER-58594)ReplicationCoordinatorImpl::handleHeartbeatResponse_forTest在读取_rsConfig时不使用_mutex
- [服务器-58620](https://jira.mongodb.org/browse/SERVER-58620)新收件人主服务器可以在donorentor_migration_resume_collection_cloner_after_rename.js中重命名集合之前完成迁移
- [服务器-58626](https://jira.mongodb.org/browse/SERVER-58626)将capped_max1标记为 tenant_migration_incompatible。
- [服务器-58637](https://jira.mongodb.org/browse/SERVER-58637)从多版本直通中暂时禁用null_query_semantics.js
- [服务器-58669](https://jira.mongodb.org/browse/SERVER-58669)分片操作完成后，createIndexes、dropIndexes和collMod在ReshardCollectionInProgress中仍可能失败
- [服务器-58676](https://jira.mongodb.org/browse/SERVER-58676)禁止在分片集合中设置SEARCH_META变量的管道
- [服务器-58682](https://jira.mongodb.org/browse/SERVER-58682)check_todos.py应该在瀑布里禁止
- [服务器-58698](https://jira.mongodb.org/browse/SERVER-58698)[Linux重复执行构建器]禁用concurrency_replication_multi_stmt_txn
- [服务器-58740](https://jira.mongodb.org/browse/SERVER-58740)使用storeFindAndModifyImagesInSideCollection=true编写可重试的findAndModify时，请保留多个操作日志插槽
- [服务器-58806](https://jira.mongodb.org/browse/SERVER-58806)在企业MacOS上使用replica_sets_jscore_passthrough_gen任务
- [服务器-58812](https://jira.mongodb.org/browse/SERVER-58812)tenant_migration_timeseries_retryable_write_oplog_cloning.js在收集垃圾之前应该获得dondDoc
- [服务器-58815](https://jira.mongodb.org/browse/SERVER-58815)让内部findAndModifyImageLookup将合成操作日志条目设置为findAndModify的时间戳-1
- [服务器-58823](https://jira.mongodb.org/browse/SERVER-58823)refineShardKey命令应在下步/上时将其操作上下文标记为可中断
- [服务器-58855](https://jira.mongodb.org/browse/SERVER-58855)改进/修复out_max_time_ms.js中的比赛条件
- [服务器-58857](https://jira.mongodb.org/browse/SERVER-58857)更改流意外过滤掉reshardCollection的重命名事件[仅限5.0]
- [服务器-58886](https://jira.mongodb.org/browse/SERVER-58886)允许从分片搜索查询返回“vars”结果，但在SEARCH_META访问失败
- [服务器-58898](https://jira.mongodb.org/browse/SERVER-58898)防止写入“本地”db等待写入Concern
- [服务器-58904](https://jira.mongodb.org/browse/SERVER-58904)逃逸或单引号DESTDIR导致.ninja和resmoke.ini畸形
- [服务器-58919](https://jira.mongodb.org/browse/SERVER-58919)sharding_jscore_passthrough_wire_ops_gen需要标记为生成的任务。
- [服务器-58948](https://jira.mongodb.org/browse/SERVER-58948)idl_tool：支持生成的idls
- [服务器-58973](https://jira.mongodb.org/browse/SERVER-58973)使用v5.0 windows调试构建修复deprecated_wire_ops_mongos.js失败
- [服务器-58984](https://jira.mongodb.org/browse/SERVER-58984)由于重新配置，awaitable_hello_fcv_change.js不考虑可等待的hello请求之间的窗口
- [服务器-59000](https://jira.mongodb.org/browse/SERVER-59000)对生成的任务强制依赖项
- [服务器-59025](https://jira.mongodb.org/browse/SERVER-59025)在oplog_slow_sampling_logging.js中增加存储日志冗长
- [服务器-59040](https://jira.mongodb.org/browse/SERVER-59040)将 operations_longer_than_stepdown_interval tag 添加到 background_unique_indexes.js
- [服务器-59044](https://jira.mongodb.org/browse/SERVER-59044)在TrialStage中处理$sample的空时间序列集合
- [服务器-59056](https://jira.mongodb.org/browse/SERVER-59056)[5.0]修复timeseries_retryable_write_downgrade.js中的主检查
- [服务器-59071](https://jira.mongodb.org/browse/SERVER-59071)当直接连接到碎片时，使用$sample可能会触发不变
- [服务器-59091](https://jira.mongodb.org/browse/SERVER-59091)避免从耐用的目录中获取索引构建中插入的每个键的命名空间
- [服务器-59093](https://jira.mongodb.org/browse/SERVER-59093)在常青树上暂时禁用ephemeralForTest的失败jstest套件
- [服务器-59101](https://jira.mongodb.org/browse/SERVER-59101)从管道库中删除不必要的LIBDEPS边缘
- [服务器-59117](https://jira.mongodb.org/browse/SERVER-59117)xcode下一个构建器达到dyld 512库限制
- [服务器-59121](https://jira.mongodb.org/browse/SERVER-59121)动力循环中check_disk命令期间的ssh连接故障应导致ssh故障退出
- [服务器-59135](https://jira.mongodb.org/browse/SERVER-59135)使MSI中的mongocrypted目标依赖于libsasl2
- [服务器-59158](https://jira.mongodb.org/browse/SERVER-59158)支持运行带有mongos连接的checkFCV() shell助手
- [服务器-59188](https://jira.mongodb.org/browse/SERVER-59188)覆盖率分析缺陷120391：单硝化标量场
- [服务器-59197](https://jira.mongodb.org/browse/SERVER-59197)当相应的会话文档被删除时，删除fam图像条目
- [服务器-59203](https://jira.mongodb.org/browse/SERVER-59203)不要依赖模拟来测试构建变体的生成任务
- [服务器-59204](https://jira.mongodb.org/browse/SERVER-59204)存储在PlanCache条目debugInfo中的无有过滤器BSONObj
- [服务器-59217](https://jira.mongodb.org/browse/SERVER-59217)将空格转换为软件包文件的选项卡
- [服务器-59236](https://jira.mongodb.org/browse/SERVER-59236)向遗留shell添加函数以递归复制目录
- [服务器-59242](https://jira.mongodb.org/browse/SERVER-59242)更新到snmp 5.9.1
- [服务器-59291](https://jira.mongodb.org/browse/SERVER-59291)考虑添加“enableSearchMeta”查询旋钮
- [服务器-59324](https://jira.mongodb.org/browse/SERVER-59324)从5.0上的sys-perf中删除功能标志性能变体。
- [服务器-59353](https://jira.mongodb.org/browse/SERVER-59353)启动mongod版本时具有shell strip功能FlagRetryableFindAndModify <= 4.4
- [服务器-59362](https://jira.mongodb.org/browse/SERVER-59362)设置故障管理器状态机
- [服务器-59404](https://jira.mongodb.org/browse/SERVER-59404)避免powercycle_smoke_skip_compile到达任务超时
- [服务器-59431](https://jira.mongodb.org/browse/SERVER-59431)[v5.0]在EFT构建器中禁用并行任务
- [服务器-59516](https://jira.mongodb.org/browse/SERVER-59516)在oplog fetcher中在锁定之外创建opCtx
- [服务器-59573](https://jira.mongodb.org/browse/SERVER-59573)添加setParameter，可用于在会话中恢复不活跃的光标超时
- [服务器-59640](https://jira.mongodb.org/browse/SERVER-59640)[5.0]在views_all_commands.js测试中添加geoSearch命令的覆盖范围
- [WT-6755](https://jira.mongodb.org/browse/WT-6755)文档：填充开发人员术语表
- [WT-6910](https://jira.mongodb.org/browse/WT-6910)为建筑指南编写“历史商店”子页面
- [WT-6911](https://jira.mongodb.org/browse/WT-6911)为架构指南编写“块管理器”子页面
- [WT-6915](https://jira.mongodb.org/browse/WT-6915)为架构指南编写“日志文件”子页面
- [WT-7006](https://jira.mongodb.org/browse/WT-7006)为架构指南编写连接子页面
- [WT-7007](https://jira.mongodb.org/browse/WT-7007)备份架构指南页面
- [WT-7198](https://jira.mongodb.org/browse/WT-7198)修复test_backup15失败与备份不匹配
- [WT-7352](https://jira.mongodb.org/browse/WT-7352)修复光标修改中并发操作之间的test_hs01冲突
- [WT-7363](https://jira.mongodb.org/browse/WT-7363)添加对六角格式转储历史存储输出的支持
- [WT-7521](https://jira.mongodb.org/browse/WT-7521)删除多余的ckplist无效
- [WT-7592](https://jira.mongodb.org/browse/WT-7592)删除log_flush("sync=background")支持
- [WT-7599](https://jira.mongodb.org/browse/WT-7599)根据即将运行以进行兼容性测试的版本更新CONFIG文件
- [WT-7663](https://jira.mongodb.org/browse/WT-7663)更改本地商店扩展，以只允许只读FS操作
- [WT-7673](https://jira.mongodb.org/browse/WT-7673)调查并修复Windows上的许多dbs测试失败
- [WT-7718](https://jira.mongodb.org/browse/WT-7718)重命名'build_cmake'
- [WT-7838](https://jira.mongodb.org/browse/WT-7838)能够使有序时间戳断言比日志消息做更多的事情
- [WT-7842](https://jira.mongodb.org/browse/WT-7842)在多集合测试中删除显式ulimit-n调用
- [WT-7860](https://jira.mongodb.org/browse/WT-7860)改进代码覆盖范围报告
- [WT-7866](https://jira.mongodb.org/browse/WT-7866)更新cppsuite-hs-cleanup-stress中的cache_hs_insert限制
- [WT-7876](https://jira.mongodb.org/browse/WT-7876)更新回滚到稳定测试，以使用正确的布尔值并更新统计检查逻辑
- [WT-7880](https://jira.mongodb.org/browse/WT-7880)修复了准备好更新后的更新在历史记录存储中时的历史商店记录问题
- [WT-7891](https://jira.mongodb.org/browse/WT-7891)删除文档错别字
- [WT-7893](https://jira.mongodb.org/browse/WT-7893)在test_encrypt08中从wiredtiger_open中删除被忽略的消息
- [WT-7895](https://jira.mongodb.org/browse/WT-7895)修复arch-data-file.dox文档构建失败
- [WT-7897](https://jira.mongodb.org/browse/WT-7897)为test_backup15启用详细日志记录，以帮助调试
- [WT-7900](https://jira.mongodb.org/browse/WT-7900)修复了以测试格式插入列存储的新记录的问题
- [WT-7901](https://jira.mongodb.org/browse/WT-7901)测试套件清理
- [WT-7905](https://jira.mongodb.org/browse/WT-7905)修复CMake中构建的不正确内置行为
- [WT-7907](https://jira.mongodb.org/browse/WT-7907)在CMake构建中为swig模块定义添加依赖项
- [WT-7908](https://jira.mongodb.org/browse/WT-7908)通过静态测试使可变长度列存储再次工作
- [WT-7909](https://jira.mongodb.org/browse/WT-7909)在开始回滚到稳定操作之前，创建一个新方法来检查是否正在运行的用户事务
- [WT-7918](https://jira.mongodb.org/browse/WT-7918)支持在当前读取时间戳上设置准备时间戳
- [WT-7928](https://jira.mongodb.org/browse/WT-7928)VLCS检查点和其他测试套件改进
- [WT-7931](https://jira.mongodb.org/browse/WT-7931)驱逐使用test_multiple_older_readers_with_multiple_mixed_mode()中的驱逐光标进行修改，以确保驱逐发生。
- [WT-7934](https://jira.mongodb.org/browse/WT-7934)将多集合测试的perf结果上传到Altas
- [WT-7935](https://jira.mongodb.org/browse/WT-7935)添加rdtsc等效指令的arm64实现
- [WT-7936](https://jira.mongodb.org/browse/WT-7936)更新format.sh脚本以运行恢复测试
- [WT-7937](https://jira.mongodb.org/browse/WT-7937)修复s_docs使用sh，而不是bash语法
- [WT-7938](https://jira.mongodb.org/browse/WT-7938)修复错误时回滚到稳定的内存泄漏
- [WT-7940](https://jira.mongodb.org/browse/WT-7940)更新多考尔测试的mongod路径
- [WT-7941](https://jira.mongodb.org/browse/WT-7941)添加一个常青任务，使用测试/格式测试中止/恢复
- [WT-7943](https://jira.mongodb.org/browse/WT-7943)回滚准备好的交易时，不要断言时间戳
- [WT-7945](https://jira.mongodb.org/browse/WT-7945)将回滚处理移动到cppsuite中的操作层。
- [WT-7947](https://jira.mongodb.org/browse/WT-7947)允许CMake采用特定的Python版本
- [WT-7952](https://jira.mongodb.org/browse/WT-7952)小文档构建修复
- [WT-7953](https://jira.mongodb.org/browse/WT-7953)教s_string不要查看getopt选项列表。
- [WT-7955](https://jira.mongodb.org/browse/WT-7955)使用CMake将format.sh和CONFIG.stress复制到测试/格式构建目录
- [WT-7956](https://jira.mongodb.org/browse/WT-7956)RTS跳过已删除或稳定的RLE单元格
- [WT-7961](https://jira.mongodb.org/browse/WT-7961)有时在timetamp_abort中滞后最古老的时间戳。
- [WT-7964](https://jira.mongodb.org/browse/WT-7964)修复回滚到稳定错误，不要在snap_max上回滚更新
- [WT-7965](https://jira.mongodb.org/browse/WT-7965)更新恢复检查点末尾的连接基写入生成号
- [WT-7968](https://jira.mongodb.org/browse/WT-7968)在timetamp_abort中，当all_durable向后移动时跳过设置时间戳
- [WT-7970](https://jira.mongodb.org/browse/WT-7970)在启动检查计时器和时钟线程之前设置稳定的时间戳
- [WT-7974](https://jira.mongodb.org/browse/WT-7974)更多列店修复和测试
- [WT-7984](https://jira.mongodb.org/browse/WT-7984)修复可能导致检查点省略一页数据的错误
- [WT-7994](https://jira.mongodb.org/browse/WT-7994)将文档编译任务添加到PR测试中
- [WT-7995](https://jira.mongodb.org/browse/WT-7995)修复它不能超出检查点可见性的全球可见性
- [WT-7996](https://jira.mongodb.org/browse/WT-7996)更多专栏店C测试
- [WT-7998](https://jira.mongodb.org/browse/WT-7998)对架构指南缓存子页的小修复
- [WT-7999](https://jira.mongodb.org/browse/WT-7999)修复断言，以在中间处理带有最大停止时间戳的更新
- [WT-8005](https://jira.mongodb.org/browse/WT-8005)修复了可能导致历史记录存储条目未解决的准备提交错误
- [WT-8006](https://jira.mongodb.org/browse/WT-8006)同步/检查点清理代码不适合VLCS



## 5.0.2 更改日志

### 安全

[服务器-57727](https://jira.mongodb.org/browse/SERVER-57727)x509_invalid.js中的比赛条件

### 分片

- [服务器-47372](https://jira.mongodb.org/browse/SERVER-47372)即使收集被删除，config.cache集合也可以保留
- [服务器-48651](https://jira.mongodb.org/browse/SERVER-48651)避免在 refine_collection_shard_key_basic.js 中锁定超时错误
- [服务器-50521](https://jira.mongodb.org/browse/SERVER-50521)创建临时重新分片集合后，写入reshardBegin no-oplog条目
- [服务器-54948](https://jira.mongodb.org/browse/SERVER-54948)在启用后调用shardCollection从不同的MongoS进行分片分割，这在因果上不一致
- [服务器-55574](https://jira.mongodb.org/browse/SERVER-55574)迁移解锁获取无法捕获状态
- [服务器-56647](https://jira.mongodb.org/browse/SERVER-56647)使dropDatabase对网络分区具有弹性
- [服务器-56648](https://jira.mongodb.org/browse/SERVER-56648)使dropCollection对网络分区具有弹性
- [服务器-56649](https://jira.mongodb.org/browse/SERVER-56649)使renameCollection对网络分区具有弹性
- [服务器-56650](https://jira.mongodb.org/browse/SERVER-56650)使createCollection对网络分区具有弹性
- [服务器-57204](https://jira.mongodb.org/browse/SERVER-57204)扩展_configsvrSetAllowMigrations命令，将集合uuid化，使其幂等
- [服务器-57380](https://jira.mongodb.org/browse/SERVER-57380)改进了集群不兼容期间的“无效选项：读取关注级别快照仅在事务中有效”消息
- [服务器-57488](https://jira.mongodb.org/browse/SERVER-57488)创建命令，从config.tags中删除与ns匹配的标签，这些标签可以作为可重试写入运行
- [服务器-57496](https://jira.mongodb.org/browse/SERVER-57496)在删除数据库/收集后主动驱逐缓存条目
- [服务器-57559](https://jira.mongodb.org/browse/SERVER-57559)为DDL协调员实现LSID缓存
- [服务器-57759](https://jira.mongodb.org/browse/SERVER-57759)在ReshardingTest夹具中分片源集合之前，先运行 movePrimary 命令
- [服务器-57850](https://jira.mongodb.org/browse/SERVER-57850)在authCommands.js上等待迁移时增加超时
- [服务器-57870](https://jira.mongodb.org/browse/SERVER-57870)删除数据库碎片FSM不能保证操作会完成
- [服务器-57944](https://jira.mongodb.org/browse/SERVER-57944)在批处理写执行器刷新失败后，目标器没有完全清洁
- [服务器-58021](https://jira.mongodb.org/browse/SERVER-58021)蒙古人应该在从碎片中获取ShardCannotRefreshDueToLocksHeld错误时重试写
- [服务器-58048](https://jira.mongodb.org/browse/SERVER-58048)哈希碎片键的分片初始拆分点与采样值不匹配
- [服务器-58089](https://jira.mongodb.org/browse/SERVER-58089)覆盖率分析缺陷120194：单硝化指针字段
- [服务器-58115](https://jira.mongodb.org/browse/SERVER-58115)集合重命名后，过时的信息可以保留在目录缓存中
- [服务器-58143](https://jira.mongodb.org/browse/SERVER-58143)shardsvrDropCollection参与者在下台时应该是可以杀死的
- [服务器-58167](https://jira.mongodb.org/browse/SERVER-58167)在dropDatabase期间使用范围数据库关键部分
- [服务器-58266](https://jira.mongodb.org/browse/SERVER-58266)停止在块管理器目标器中强制数据库版本刷新
- [服务器-58271](https://jira.mongodb.org/browse/SERVER-58271)停止在块管理器目标器中强制刷新集合版本
- [服务器-58273](https://jira.mongodb.org/browse/SERVER-58273)解决D拉db参与者命令中不间断锁防罩造成的死锁
- [服务器-58321](https://jira.mongodb.org/browse/SERVER-58321)在重新分片中止命令中检查收件人文档的存在，而不是两次供体
- [服务器-58364](https://jira.mongodb.org/browse/SERVER-58364)ShardServerCatalogCacheLoader::waitForCollectionFlush应该可以中断
- [服务器-58465](https://jira.mongodb.org/browse/SERVER-58465)修复重命名操作中路由信息的清理
- [服务器-58535](https://jira.mongodb.org/browse/SERVER-58535)_shardsvrRenameCollection应在下台时中断
- [服务器-58589](https://jira.mongodb.org/browse/SERVER-58589)移除ShardingFullDDLSupportTimestampedVersion功能标志
- [服务器-58624](https://jira.mongodb.org/browse/SERVER-58624)更改reshard_collection_basic.js的分片关键部分超时值
- [服务器-58649](https://jira.mongodb.org/browse/SERVER-58649)不要假设集合总是在ShardServerProcessInterface::checkRoutingInfoEpochOrThrow方法中分片
- [服务器-58747](https://jira.mongodb.org/browse/SERVER-58747)ShardServerCatalogCacheLoader不会在升级时中断正在进行的操作
- [服务器-58749](https://jira.mongodb.org/browse/SERVER-58749)Drop数据库协调员必须获取集合分布式锁
- [服务器-58775](https://jira.mongodb.org/browse/SERVER-58775)将ConfigsvrSetAllowMigrationsCommand的opCtx标记为可击退时可杀死

### 复制

- [服务器-37904](https://jira.mongodb.org/browse/SERVER-37904)允许节点覆盖集群链（启用/禁用）设置
- [服务器-58258](https://jira.mongodb.org/browse/SERVER-58258)等待初始同步以清除状态，然后断言“replSetGetStatus”回复没有“initialSync”字段
- [服务器-58625](https://jira.mongodb.org/browse/SERVER-58625)将multi_update标签添加到geo_update1.js中，以排除在某些直通套件之外

### 查询

- [服务器-54078](https://jira.mongodb.org/browse/SERVER-54078)[SBE]改进bestbuy_agg_merge_wordcount基准套件的性能
- [服务器-58127](https://jira.mongodb.org/browse/SERVER-58127)修复benchRun()内存泄漏，以便在异常下解析benchRun() args
- [服务器-58372](https://jira.mongodb.org/browse/SERVER-58372)Robustify deprecated_wire_ops_mongos.js

### 储存

- [服务器-50287](https://jira.mongodb.org/browse/SERVER-50287)drop_index.js在带有stepdown的直通套件中运行时失败
- [服务器-56019](https://jira.mongodb.org/browse/SERVER-56019)timeseries_index.js挂在burn_in_tests burn_in:replica_sets_initsync_jscore_passthrough子任务
- [服务器-56877](https://jira.mongodb.org/browse/SERVER-56877)中止多键目录更新后，插入操作可能无法将索引设置为多键

### 运营

[服务器-58510](https://jira.mongodb.org/browse/SERVER-58510)修复getExecutorForSimpleDistinct()函数中的“免费使用”问题

### 构建和包装

- [服务器-54729](https://jira.mongodb.org/browse/SERVER-54729)MongoDB Enterprise Debian/Ubuntu软件包应依赖于libsasl2-modules和libsasl2-modules-gssapi-mit
- [服务器-55446](https://jira.mongodb.org/browse/SERVER-55446)在启用Xcode 12的主机上站立Apple Silicon纯编译构建器。

### 内部人员

- [服务器-56446](https://jira.mongodb.org/browse/SERVER-56446)无法在waitForConnect的_auth套件中使用ReplSetTest.restart()：false
- [服务器-56568](https://jira.mongodb.org/browse/SERVER-56568)在动态构建中禁用vptr UBSAN检查并删除LIBDEPS_TYPEINFO
- [服务器-56620](https://jira.mongodb.org/browse/SERVER-56620)节点应明确清除仲裁器 durableOpTimeAndWalltime
- [服务器-56625](https://jira.mongodb.org/browse/SERVER-56625)清理坏缓存文件时验证缓存竞争条件
- [服务器-56980](https://jira.mongodb.org/browse/SERVER-56980)Robustify jstests/core/query_hash_stability.js
- [服务器-57002](https://jira.mongodb.org/browse/SERVER-57002)重构Evergreen任务创建以支持构建多个任务
- [服务器-57003](https://jira.mongodb.org/browse/SERVER-57003)在单个任务中为构建变体生成所有任务
- [服务器-57064](https://jira.mongodb.org/browse/SERVER-57064)在mongos上记录创建索引和dropIndex（es）
- [服务器-57176](https://jira.mongodb.org/browse/SERVER-57176)当节点处于恢复阶段时，“validateFeaturesAsPrimary”标志应设置为false
- [服务器-57268](https://jira.mongodb.org/browse/SERVER-57268)添加多键查询到validate_multikey_restart.js
- [服务器-57302](https://jira.mongodb.org/browse/SERVER-57302)生成隐式多版本测试使用无效名称
- [服务器-57327](https://jira.mongodb.org/browse/SERVER-57327)常青忍者构建者无法复制安装文件
- [服务器-57396](https://jira.mongodb.org/browse/SERVER-57396)在适用的平台上默认启用可见性支持
- [服务器-57425](https://jira.mongodb.org/browse/SERVER-57425)按住SessionCatalog互斥体时避免杀死opCtx
- [服务器-57450](https://jira.mongodb.org/browse/SERVER-57450)新添加的测试不会显示在生成的动态重新烟雾套件中
- [服务器-57474](https://jira.mongodb.org/browse/SERVER-57474)profile_operation_metrics.js不适应查询生成
- [服务器-57521](https://jira.mongodb.org/browse/SERVER-57521)FCV更改无条件关闭尚未完成Hello握手的传出连接
- [服务器-57576](https://jira.mongodb.org/browse/SERVER-57576)validate_cache_dir应该打印stacktrace
- [服务器-57580](https://jira.mongodb.org/browse/SERVER-57580)在vergreen.yml和任务生成中简化多版本处理
- [服务器-57642](https://jira.mongodb.org/browse/SERVER-57642)src/mongo/db/query/plan_yield_policy.cpp 75上的不变故障 | 中止
- [服务器-57650](https://jira.mongodb.org/browse/SERVER-57650)在等待对收件人命令的响应时，使MigrationChunkClonerSource可中断
- [服务器-57676](https://jira.mongodb.org/browse/SERVER-57676)在oplog_rollover.js中发布“hangOplogCapMaintainerThread”之前，请等待检查站
- [服务器-57729](https://jira.mongodb.org/browse/SERVER-57729)如果桶集合不存在，则无法删除时间序列集合
- [服务器-57742](https://jira.mongodb.org/browse/SERVER-57742)创建OperationLatencyHistogram类的非专业版本
- [服务器-57750](https://jira.mongodb.org/browse/SERVER-57750)在quiesce_mode.js中使用更独特的读取命令，以便内部操作不会设置故障点
- [服务器-57756](https://jira.mongodb.org/browse/SERVER-57756)并发降级和应用交易操作日志条目之间的竞争
- [服务器-57771](https://jira.mongodb.org/browse/SERVER-57771)SBE解释没有在“allPlansExecution”部分中报告获胜排序计划的正确试用期统计数据
- [服务器-57790](https://jira.mongodb.org/browse/SERVER-57790)使用大型路由表，最大限度地减少4.4至5.0之间的FCV升级/降级的影响
- [服务器-57798](https://jira.mongodb.org/browse/SERVER-57798)当由于使用./install_compass的连接问题而无法安装MongoDB指南针时，请引导用户访问MongoDB指南针下载页面
- [服务器-57837](https://jira.mongodb.org/browse/SERVER-57837)将TSBS添加到system_perf.yml
- [服务器-57869](https://jira.mongodb.org/browse/SERVER-57869)Shell getShardDistribution助手不会在5.0.0-rc1上累积块计数
- [服务器-57926](https://jira.mongodb.org/browse/SERVER-57926)从常绿scons splunk任务调整日志级别
- [服务器-57928](https://jira.mongodb.org/browse/SERVER-57928)create_collection.js应使用专用数据库名称，并避免删除测试数据库
- [服务器-57951](https://jira.mongodb.org/browse/SERVER-57951)hook_test_archival.py存档的数据文件不正确
- [服务器-57983](https://jira.mongodb.org/browse/SERVER-57983)经典引擎中$range的整数溢出
- [服务器-58020](https://jira.mongodb.org/browse/SERVER-58020)cache-dir：防止具有不同内容竞争条件的相同构建
- [服务器-58022](https://jira.mongodb.org/browse/SERVER-58022)tenant_migration_resume_oplog_application.js应该考虑reumeTokens是应用程序批处理的一部分
- [服务器-58086](https://jira.mongodb.org/browse/SERVER-58086)调查为什么在某些任务中没有标记调试符号供下载
- [服务器-58087](https://jira.mongodb.org/browse/SERVER-58087)减少已激活生成任务的开销
- [服务器-58159](https://jira.mongodb.org/browse/SERVER-58159)延长单相索引构建的索引标识对账不变的松弛
- [服务器-58169](https://jira.mongodb.org/browse/SERVER-58169)围绕稳定时间戳计算来记录不变量的时间戳信息
- [服务器-58187](https://jira.mongodb.org/browse/SERVER-58187)提高连接收割器和MongoLDAP性能
- [服务器-58191](https://jira.mongodb.org/browse/SERVER-58191)[迁移协议]允许delete_during_migrate.js容忍缓慢变体的追赶阶段超时导致的块迁移失败。
- [服务器-58197](https://jira.mongodb.org/browse/SERVER-58197)从现有范围构建排序器时，通过引用传递范围
- [服务器-58202](https://jira.mongodb.org/browse/SERVER-58202)将多个测试标记为require_sharding
- [服务器-58208](https://jira.mongodb.org/browse/SERVER-58208)允许顶级$graph查找阶段在碎片上并行运行
- [服务器-58249](https://jira.mongodb.org/browse/SERVER-58249)findAndModify_flip_location.js在多版本套件中对4.4二进制文件运行时，应考虑种族向上搜索
- [服务器-58250](https://jira.mongodb.org/browse/SERVER-58250)$group和$setWindowFields的内存跟踪图使用效率低下
- [服务器-58280](https://jira.mongodb.org/browse/SERVER-58280)当索引构建处于活动状态时，初始同步挂在隐藏掉落的索引上
- [服务器-58283](https://jira.mongodb.org/browse/SERVER-58283)添加一个新的版本文件来设置MONGO_VERSION和MONGO_GIT_HASH
- [服务器-58332](https://jira.mongodb.org/browse/SERVER-58332)pipeline MemoryUsageTracker：为了指针稳定性，将StringMap更改为unordered_map
- [服务器-58335](https://jira.mongodb.org/browse/SERVER-58335)从5.0分支中删除SBE构建变体
- [服务器-58357](https://jira.mongodb.org/browse/SERVER-58357)[ephemeralForTest] TemporaryKVRecordStore无法在WCE循环中注册提交处理程序
- [服务器-58395](https://jira.mongodb.org/browse/SERVER-58395)如果重新分片指标没有为当前Op报告初始化，则应将donerState/RecientState设置为kUnused。
- [服务器-58400](https://jira.mongodb.org/browse/SERVER-58400)生成的超时需要考虑重复执行
- [服务器-58480](https://jira.mongodb.org/browse/SERVER-58480)在ContinuousTenantMigration钩子中添加必要的参数，以便进行适当的瞬态错误重试
- [服务器-58515](https://jira.mongodb.org/browse/SERVER-58515)[ephemeralForTest]在EFT构建器中禁用并行任务
- [服务器-58532](https://jira.mongodb.org/browse/SERVER-58532)在计算超时时，考虑构建何时是ASAN
- [服务器-58576](https://jira.mongodb.org/browse/SERVER-58576)改进任务生成测试
- [服务器-58651](https://jira.mongodb.org/browse/SERVER-58651)在动力循环中杀死出口处理程序中的ssh隧道过程
- [服务器-58662](https://jira.mongodb.org/browse/SERVER-58662)在旧版本的mongodb变体上禁用tsbs
- [服务器-58707](https://jira.mongodb.org/browse/SERVER-58707)将`bench_test*.js`测试移出并行测试作业
- [服务器-58734](https://jira.mongodb.org/browse/SERVER-58734)为新的更改流模糊器添加常青任务
- [服务器-58746](https://jira.mongodb.org/browse/SERVER-58746)macOS 10.12上的构建失败；mongodb 5.0.0需要macOS 10.13+？
- [服务器-58794](https://jira.mongodb.org/browse/SERVER-58794)_configsvrCreateDatabase和_flushDatabaseCacheUpdates应接受任何API版本参数
- [服务器-58816](https://jira.mongodb.org/browse/SERVER-58816)errors_on_committed_transaction.js与v5.0中的多版本测试不兼容
- [服务器-58936](https://jira.mongodb.org/browse/SERVER-58936)唯一的索引约束可能不会被执行
- [WT-6280](https://jira.mongodb.org/browse/WT-6280)如果与检查站处理比赛秩序混乱，则失败驱逐
- [WT-6729](https://jira.mongodb.org/browse/WT-6729)在运行回滚到稳定的活跃事务检查之前，先进行驱逐
- [WT-6782](https://jira.mongodb.org/browse/WT-6782)test_prepare_hs02 WT_ROLLBACK失败：并发操作之间的冲突
- [WT-6902](https://jira.mongodb.org/browse/WT-6902)架构指南的元数据子页面
- [WT-6914](https://jira.mongodb.org/browse/WT-6914)为架构指南编写“数据库文件”子页面
- [WT-7279](https://jira.mongodb.org/browse/WT-7279)允许多个终止呼叫用于存储源扩展
- [WT-7343](https://jira.mongodb.org/browse/WT-7343)编写一个执行 many-collection-test.py 的脚本
- [WT-7473](https://jira.mongodb.org/browse/WT-7473)解决代码中的“TODO：分层”注释
- [WT-7507](https://jira.mongodb.org/browse/WT-7507)更新历史商店和时间戳世界的打捞
- [WT-7520](https://jira.mongodb.org/browse/WT-7520)将开始和停止值添加到自动标志生成代码中
- [WT-7524](https://jira.mongodb.org/browse/WT-7524)重构函数以获取检查点列表；在跳过检查点时清除删除
- [WT-7539](https://jira.mongodb.org/browse/WT-7539)添加一个配置选项，允许用户指定调试模式。
- [WT-7543](https://jira.mongodb.org/browse/WT-7543)在构建默认配置路径时传递正确的测试名称
- [WT-7553](https://jira.mongodb.org/browse/WT-7553)放松对驱逐快速截断页面的限制，以避免缓存卡住的故障
- [WT-7556](https://jira.mongodb.org/browse/WT-7556)修复test_rollback_to_stable10失败cave_hs_ondisk为0
- [WT-7603](https://jira.mongodb.org/browse/WT-7603)对统计数据进行排序以修复JSON输出
- [WT-7605](https://jira.mongodb.org/browse/WT-7605)放弃对百万收藏测试的支持
- [WT-7609](https://jira.mongodb.org/browse/WT-7609)报告在多考尔测试中启动和关闭数据库所花费的时间
- [WT-7616](https://jira.mongodb.org/browse/WT-7616)根据许多集合工作根工作负载创建及格或失败测试
- [WT-7619](https://jira.mongodb.org/browse/WT-7619)当页面上的所有条目被删除时，添加新的优化，以跳过光标遍历中的页面
- [WT-7626](https://jira.mongodb.org/browse/WT-7626)我们只确保更新还原驱逐发生在测试调试模式09
- [WT-7628](https://jira.mongodb.org/browse/WT-7628)当测试框架中提供无效的命令行args时，返回错误消息
- [WT-7629](https://jira.mongodb.org/browse/WT-7629)在代码库中的.cxx文件上运行clang格式。
- [WT-7632](https://jira.mongodb.org/browse/WT-7632)修复test_rollback_to_stable14中的无效参数
- [WT-7640](https://jira.mongodb.org/browse/WT-7640)修复test_backup02故障，其中检查点表因不支持检查点光标而不同
- [WT-7660](https://jira.mongodb.org/browse/WT-7660)在cpp测试框架中将poc_test重命名为base_test，并添加insert_operation逻辑
- [WT-7667](https://jira.mongodb.org/browse/WT-7667)修复工作根JSON输出
- [WT-7668](https://jira.mongodb.org/browse/WT-7668)重载hs_cleanup测试的更新方法
- [WT-7670](https://jira.mongodb.org/browse/WT-7670)修改测试标签格式并标记额外的python测试
- [WT-7676](https://jira.mongodb.org/browse/WT-7676)重新格式化wtperf备份，仅读取文件，而不是wt_copy_and_sync
- [WT-7679](https://jira.mongodb.org/browse/WT-7679)为多处理应力创建一个常青测试
- [WT-7683](https://jira.mongodb.org/browse/WT-7683)添加python测试钩子在connection.close()期间调用flush_tier()
- [WT-7687](https://jira.mongodb.org/browse/WT-7687)在内部线程之前停止分层管理器线程
- [WT-7689](https://jira.mongodb.org/browse/WT-7689)在__curhs_insert中修复双免费修复
- [WT-7690](https://jira.mongodb.org/browse/WT-7690)修复将枚举与0进行比较时的覆盖率错误（incr_backup:table_changes）
- [WT-7692](https://jira.mongodb.org/browse/WT-7692)修复osx10 14 cmake上的检查测试失败
- [WT-7696](https://jira.mongodb.org/browse/WT-7696)修复覆盖率错误 - _rollback_to_stable_btree_apply_all中未使用的变量
- [WT-7698](https://jira.mongodb.org/browse/WT-7698)在许多dhandles场景中减少max_latency值，适用于工作生成
- [WT-7703](https://jira.mongodb.org/browse/WT-7703)修复test_checkpoint_snapshot04中的超时
- [WT-7705](https://jira.mongodb.org/browse/WT-7705)添加断言，以确保更新恢复中新磁盘映像没有更新
- [WT-7707](https://jira.mongodb.org/browse/WT-7707)简化插入拆分以使用拆分WT_REFs键
- [WT-7708](https://jira.mongodb.org/browse/WT-7708)添加断言，以确保持久时间戳大于准备提交结束时的稳定时间戳
- [WT-7715](https://jira.mongodb.org/browse/WT-7715)在txn_ckpt.c中修复未初始化的bool
- [WT-7717](https://jira.mongodb.org/browse/WT-7717)在local_store.c中更改宏以使用WT命名空间
- [WT-7719](https://jira.mongodb.org/browse/WT-7719)将ENABLE_STRICT的默认值更改为“OFF”（CMake可用性改进）
- [WT-7720](https://jira.mongodb.org/browse/WT-7720)更新POSIX CMAKE氧气文档（CMake可用性改进）
- [WT-7723](https://jira.mongodb.org/browse/WT-7723)如果更新被回滚或是更新链上的第一个稳定更新，请删除历史记录存储中的更新
- [WT-7724](https://jira.mongodb.org/browse/WT-7724)运行并发检查点和flush_tier时修复比赛
- [WT-7725](https://jira.mongodb.org/browse/WT-7725)在宏定义的参数周围添加缺失的括号
- [WT-7726](https://jira.mongodb.org/browse/WT-7726)将验证部分与数据库模型分开
- [WT-7727](https://jira.mongodb.org/browse/WT-7727)修复在“格式”测试期间传递给memcpy（）的空指针。
- [WT-7729](https://jira.mongodb.org/browse/WT-7729)修复了在检查站上写出正确的分层信息的问题
- [WT-7730](https://jira.mongodb.org/browse/WT-7730)移动最古老和稳定的时间戳，以匹配提交时间戳格式
- [WT-7732](https://jira.mongodb.org/browse/WT-7732)为flush_tier添加超时配置
- [WT-7739](https://jira.mongodb.org/browse/WT-7739)切换回使用MacOS 10.14进行常青编译任务
- [WT-7741](https://jira.mongodb.org/browse/WT-7741)修复crc32-x86.c中地址错位
- [WT-7742](https://jira.mongodb.org/browse/WT-7742)修复wt3184_dup_index_collator/main.c中地址错位
- [WT-7743](https://jira.mongodb.org/browse/WT-7743)修复wt2999_join_extractor csuite测试中的整数溢出
- [WT-7744](https://jira.mongodb.org/browse/WT-7744)修复wt3338_partial_update csuite中的空指针
- [WT-7746](https://jira.mongodb.org/browse/WT-7746)改进了与CMake助手'create_test_executable'的目录同步
- [WT-7748](https://jira.mongodb.org/browse/WT-7748)修复不在默认链接器路径上的库的CMake库探针
- [WT-7749](https://jira.mongodb.org/browse/WT-7749)NetBSD上构建和测试的各种修复程序
- [WT-7751](https://jira.mongodb.org/browse/WT-7751)添加断言，以确保我们永远不会选择已写入历史记录存储以进行数据存储的更新
- [WT-7752](https://jira.mongodb.org/browse/WT-7752)根据文档更新包装代码
- [WT-7754](https://jira.mongodb.org/browse/WT-7754)修复更新块管理器文件句柄时的竞赛
- [WT-7755](https://jira.mongodb.org/browse/WT-7755)YSCB：将YCSB的本机实现添加到WTPERF。
- [WT-7756](https://jira.mongodb.org/browse/WT-7756)RTS将清除墓碑后更新的HS标志
- [WT-7758](https://jira.mongodb.org/browse/WT-7758)当更新链太长时，强制驱逐页面
- [WT-7761](https://jira.mongodb.org/browse/WT-7761)改进debug_print，在cppsuite中包含时间戳、thread_id和重新排序args。
- [WT-7762](https://jira.mongodb.org/browse/WT-7762)为两个测试创建有压力的配置，将它们添加到常青中。
- [WT-7763](https://jira.mongodb.org/browse/WT-7763)在压力测试框架中发现的覆盖问题
- [WT-7765](https://jira.mongodb.org/browse/WT-7765)修复intpack-test3中的有符号整数溢出
- [WT-7766](https://jira.mongodb.org/browse/WT-7766)修复test_wt3338_partial_update中传递给memset的空指针
- [WT-7767](https://jira.mongodb.org/browse/WT-7767)curhs_remove和__txn_fixup_prepared_update的代码清理
- [WT-7770](https://jira.mongodb.org/browse/WT-7770)修复了在CMake中链接TCMalloc的问题
- [WT-7776](https://jira.mongodb.org/browse/WT-7776)在我们实例化完整更新之前，对修改更新的数量添加硬限制
- [WT-7778](https://jira.mongodb.org/browse/WT-7778)修复空取消引用，并返回不正确的分配大小
- [WT-7780](https://jira.mongodb.org/browse/WT-7780)保证在测试框架中进行日志消息排序。
- [WT-7781](https://jira.mongodb.org/browse/WT-7781)避免跳过CMake构建中第三方扩展库的python测试
- [WT-7782](https://jira.mongodb.org/browse/WT-7782)在cppsuite测试框架中将实现与标头分开
- [WT-7784](https://jira.mongodb.org/browse/WT-7784)启用RTS在时间戳表上使用检查点快照
- [WT-7787](https://jira.mongodb.org/browse/WT-7787)当缓存处于攻击模式时，不要阅读检查点清理页面
- [WT-7789](https://jira.mongodb.org/browse/WT-7789)将分层python测试更改为在没有扩展库的情况下失败
- [WT-7795](https://jira.mongodb.org/browse/WT-7795)在PRIxMAX之前修复CppSuite故障“预期）
- [WT-7796](https://jira.mongodb.org/browse/WT-7796)扫描跟踪表并删除其过时的部分。
- [WT-7797](https://jira.mongodb.org/browse/WT-7797)在CppSuite测试中禁用运行后统计数据
- [WT-7799](https://jira.mongodb.org/browse/WT-7799)不要报告python测试中wiredtiger_open的失败输出
- [WT-7802](https://jira.mongodb.org/browse/WT-7802)删除数据存储相同的事务更新壁球逻辑
- [WT-7804](https://jira.mongodb.org/browse/WT-7804)修复test_hs24从错误的值提交混合模式更新的问题
- [WT-7807](https://jira.mongodb.org/browse/WT-7807)在 backup_config 中移除未使用的 arg
- [WT-7811](https://jira.mongodb.org/browse/WT-7811)修复test_hs24无法从0时间戳提交
- [WT-7813](https://jira.mongodb.org/browse/WT-7813)如果我们看到准备好的更新，请停止插入历史记录商店
- [WT-7815](https://jira.mongodb.org/browse/WT-7815)为有序时间戳断言正确初始化prev_upd_ts
- [WT-7817](https://jira.mongodb.org/browse/WT-7817)使分层存储地址cookie向后兼容
- [WT-7825](https://jira.mongodb.org/browse/WT-7825)修复test_hs24键顺序
- [WT-7831](https://jira.mongodb.org/browse/WT-7831)重新打包单元格时清除上次运行的事务ID
- [WT-7832](https://jira.mongodb.org/browse/WT-7832)添加一个使用libsodium密码库的加密扩展。
- [WT-7836](https://jira.mongodb.org/browse/WT-7836)修复cppsuite测试框架中的一些小问题
- [WT-7837](https://jira.mongodb.org/browse/WT-7837)在wt_hs_insert_updates中清除更新结构，以避免触发断言
- [WT-7841](https://jira.mongodb.org/browse/WT-7841)添加“仅未加密”校验和配置，将校验和默认切换为“打开”
- [WT-7843](https://jira.mongodb.org/browse/WT-7843)添加缺失的宏以定义PRIxMAX
- [WT-7846](https://jira.mongodb.org/browse/WT-7846)禁用test_tiered08
- [WT-7851](https://jira.mongodb.org/browse/WT-7851)修复兼容性测试新版本中的非法校验和配置
- [WT-7852](https://jira.mongodb.org/browse/WT-7852)驱逐页面时不要释放驱逐服务器锁
- [WT-7856](https://jira.mongodb.org/browse/WT-7856)在test_tiered04中使用打开光标启用刷新测试
- [WT-7864](https://jira.mongodb.org/browse/WT-7864)添加对run.py的支持，用于在测试中运行列表/场景范围
- [WT-7865](https://jira.mongodb.org/browse/WT-7865)在RTS和测试之前等待驱逐时禁用超时断言
- [WT-7870](https://jira.mongodb.org/browse/WT-7870)修复循环代码复杂性的测量
- [WT-7871](https://jira.mongodb.org/browse/WT-7871)删除不再正确的注释
- [WT-7874](https://jira.mongodb.org/browse/WT-7874)删除另外两个陈旧的评论
- [WT-7883](https://jira.mongodb.org/browse/WT-7883)删除错误的wt_free语句
- [WT-7889](https://jira.mongodb.org/browse/WT-7889)在参考指南中查找/替换WiredTiger的现有用途
- [WT-7890](https://jira.mongodb.org/browse/WT-7890)修复config_lib中的CMake语法错误



## 5.0.1 更改日志

### 复制

[服务器-58398](https://jira.mongodb.org/browse/SERVER-58398)租户移民无限期悬挂

### 内部人员

- [服务器-58142](https://jira.mongodb.org/browse/SERVER-58142)当下一个批次回调处于错误状态时，TenantOplogBatcher应该过渡到完成
- [服务器-58171](https://jira.mongodb.org/browse/SERVER-58171)更改时间序列粒度不会更新视图定义
- [服务器-58489](https://jira.mongodb.org/browse/SERVER-58489)当具有重复名称作为视图时，集合创建卡在无限的writeConflictRetry循环中
- [服务器-58546](https://jira.mongodb.org/browse/SERVER-58546)向applyOps添加日志消息，以预览将应用哪些oplog条目



原文：[Changelog](https://www.mongodb.com/docs/upcoming/release-notes/5.0-changelog/)