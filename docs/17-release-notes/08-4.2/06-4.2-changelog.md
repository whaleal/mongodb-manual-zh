# 4.2 更改日志

## 4.2.23 更改日志

### 分片

- [服务器-56127](https://jira.mongodb.org/browse/SERVER-56127)如果块被迁移，并且分键模式使用嵌套字段，可重试更新可能会执行多次
- [服务器-63732](https://jira.mongodb.org/browse/SERVER-63732)将新的隐式CreateIndex和exlectionUniquenessCheck添加到shardCollection命令

### 内部人员

- [服务器-61275](https://jira.mongodb.org/browse/SERVER-61275)在会话缓存关闭后销毁大小存储器
- [服务器-64573](https://jira.mongodb.org/browse/SERVER-64573)使隐式创建索引和强制执行独特性检查字段可选
- [服务器-64659](https://jira.mongodb.org/browse/SERVER-64659)在服务器中报告索引构建期间使用的文件描述符数量
- [服务器-64741](https://jira.mongodb.org/browse/SERVER-64741)Create mongos appendOplogNote命令
- [服务器-66310](https://jira.mongodb.org/browse/SERVER-66310)让ExpressionSetUnion::isCommutative()整理意识到
- [服务器-66726](https://jira.mongodb.org/browse/SERVER-66726)修复killAllSessionsByPattern中的序列化
- [服务器-68158](https://jira.mongodb.org/browse/SERVER-68158)serverstatus_indexbulkbuilder.js应在创建索引后在主服务器上运行listIndexes
- [服务器-68359](https://jira.mongodb.org/browse/SERVER-68359)如果过期后秒是NaN，请防止TTLMonitor处理索引
- [服务器-68487](https://jira.mongodb.org/browse/SERVER-68487)添加BSONElement方法来检查NaN字段值
- [服务器-68574](https://jira.mongodb.org/browse/SERVER-68574)切换到新的日志保存人集群
- [服务器-68691](https://jira.mongodb.org/browse/SERVER-68691)$graphLookup不会报告“restrictSearchWithMatch”过滤器的变量引用
- [服务器-68714](https://jira.mongodb.org/browse/SERVER-68714)mongo shell中安全随机数生成器中的NaN问题
- [服务器-68925](https://jira.mongodb.org/browse/SERVER-68925)在启动时重新引入检查表日志记录设置（恢复SERVER-43664）
- [服务器-69611](https://jira.mongodb.org/browse/SERVER-69611)默认情况下设置-ffp-contract=off编译器选项



## 4.2.22 更改日志

### 分片

- [服务器-58747](https://jira.mongodb.org/browse/SERVER-58747)ShardServerCatalogCacheLoader不会在升级时中断正在进行的操作
- [服务器-62272](https://jira.mongodb.org/browse/SERVER-62272)向集合中添加模式验证可以防止失败文档的块迁移
- [服务器-62656](https://jira.mongodb.org/browse/SERVER-62656)从mongos到shard-server连接池大小的分组mongos-to-config-server连接池大小

### 构建和包装

- [服务器-61894](https://jira.mongodb.org/browse/SERVER-61894)支持更改流规格中的“showRawUpdateDescription”选项
- [服务器-63159](https://jira.mongodb.org/browse/SERVER-63159)实现$_internalApplyOplogUpdate聚合阶段

### 内部人员

- [服务器-55173](https://jira.mongodb.org/browse/SERVER-55173)WiredTigerSession::releaseCursor中的分割故障
- [服务器-59658](https://jira.mongodb.org/browse/SERVER-59658)改进日志记录，以反映等待复制的分片元数据刷新
- [服务器-60334](https://jira.mongodb.org/browse/SERVER-60334)避免在WiredTigerSizeStorer中缓存光标和会话
- [服务器-60607](https://jira.mongodb.org/browse/SERVER-60607)改进地理索引版本的大/NaN值的处理
- [服务器-61321](https://jira.mongodb.org/browse/SERVER-61321)改进了文本索引版本对大/NaN值的处理
- [服务器-64403](https://jira.mongodb.org/browse/SERVER-64403)使用SORT_MERGE整理-编码缺失的排序属性查找查询
- [服务器-66418](https://jira.mongodb.org/browse/SERVER-66418)由于字符串顺序假设，依赖分析期间创建的不良投影
- [服务器-66461](https://jira.mongodb.org/browse/SERVER-66461)在构建过程中更早地运行公证
- [服务器-66556](https://jira.mongodb.org/browse/SERVER-66556)在关机期间释放光标时防止潜在的竞争
- [服务器-67993](https://jira.mongodb.org/browse/SERVER-67993)修复4.4 pylinters错误
- [服务器-68130](https://jira.mongodb.org/browse/SERVER-68130)AutoSplitVector可以生成比BSONObjMaxUserSize更大的响应
- [服务器-68199](https://jira.mongodb.org/browse/SERVER-68199)在renameCollection命令的现有目标集合上构建的活动索引可能会使mongod失败



## 4.2.21 更改日志

### 构建和包装

- [服务器-64332](https://jira.mongodb.org/browse/SERVER-64332)公证MongoDB为macos构建
- [服务器-67139](https://jira.mongodb.org/browse/SERVER-67139)更新rhel6软件包测试ami

### 内部人员

- [服务器-58506](https://jira.mongodb.org/browse/SERVER-58506)命令公开服务器参数的可设置性
- [服务器-61097](https://jira.mongodb.org/browse/SERVER-61097)SizeStorer可能会因缓存删除而死锁
- [服务器-64184](https://jira.mongodb.org/browse/SERVER-64184)跟踪 allowDiskUse:true in agg 命令的使用情况
- [服务器-65166](https://jira.mongodb.org/browse/SERVER-65166)在bort_in_progress_transactions_on_step_up.js中使用比较优化
- [服务器-65244](https://jira.mongodb.org/browse/SERVER-65244)将RHEL 7 s390x添加到4.2
- [服务器-66176](https://jira.mongodb.org/browse/SERVER-66176)[v4.4/v4.2] 尽量减少CollectionCatalog互斥下的工作
- [服务器-66559](https://jira.mongodb.org/browse/SERVER-66559)将内部QueryMaxAddToSetBytes参数从32位扩展到64位
- [服务器-66799](https://jira.mongodb.org/browse/SERVER-66799)修复ephemeralForTest上的 getParameterWithDetails.js故障
- [服务器-66955](https://jira.mongodb.org/browse/SERVER-66955)删除perf项目中的JSON.send使用情况



## 4.2.20 更改日志

### 分片

[服务器-64903](https://jira.mongodb.org/browse/SERVER-64903)使cancel_coordinate_txn_commit_with_tickets_exhausted.js对执行删除的ShardServerCatalogCacheLoader具有鲁棒性

### 集合

[服务器-41714](https://jira.mongodb.org/browse/SERVER-41714)$facet运算符在管道中复制文档，前面是$addFields和$match运算符（按此确切顺序）

### 内部人员

- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-57000](https://jira.mongodb.org/browse/SERVER-57000)修复相关管道与面的处理
- [服务器-57676](https://jira.mongodb.org/browse/SERVER-57676)在oplog_rollover.js中发布“hangOplogCapMaintainerThread”之前，请等待检查站
- [服务器-59435](https://jira.mongodb.org/browse/SERVER-59435)在DocumentSource::optimizeAt()中修复双免费
- [服务器-60412](https://jira.mongodb.org/browse/SERVER-60412)主机内存限制检查不尊重cgroups v2
- [服务器-62242](https://jira.mongodb.org/browse/SERVER-62242)$indexOfArray不适用于数组中的重复值
- [服务器-63141](https://jira.mongodb.org/browse/SERVER-63141)$lookup/$redact/$let行为与管道优化的差异
- [服务器-64642](https://jira.mongodb.org/browse/SERVER-64642)修复mongos在关机时返回CallbackCanceled和未中断AtShutdown的错误
- [服务器-64983](https://jira.mongodb.org/browse/SERVER-64983)在TransactionParticipant::_resetTransactionState中回滚WT事务之前释放客户端锁
- [服务器-65421](https://jira.mongodb.org/browse/SERVER-65421)修复RHEL 6/7上的软件包测试失败
- [服务器-65422](https://jira.mongodb.org/browse/SERVER-65422)修复Ubuntu 16.04上的软件包测试失败



## 4.2.19 更改日志

### 分片

- [服务器-26755](https://jira.mongodb.org/browse/SERVER-26755)如果获取所有块需要超过30秒，集合块加载将完全中止
- [服务器-45149](https://jira.mongodb.org/browse/SERVER-45149)txn_two_phase_commit_failover.js中的replSetStepDown命令不应超时
- [服务器-53335](https://jira.mongodb.org/browse/SERVER-53335)使用非“简单”整理的查询、更新和删除在使用散列分片时可能会丢失文档
- [服务器-59929](https://jira.mongodb.org/browse/SERVER-59929)意外变慢的更新/插入分割块操作的转ase和移动Chunk
- [服务器-60682](https://jira.mongodb.org/browse/SERVER-60682)事务协调员可能会阻止获取WiredTiger写票以坚持其决定，延长交易处于准备状态
- [服务器-61816](https://jira.mongodb.org/browse/SERVER-61816)cancel_coordinate_txn_commit_with_tickets_exhausted.js由于交易收割者和事务协调员之间的竞争条件可以永远挂起
- [服务器-61924](https://jira.mongodb.org/browse/SERVER-61924)由于4.0中缺少故障点命令，retryable_mongos_write_errors.js在4.2个多版本套件中失败
- [服务器-62065](https://jira.mongodb.org/browse/SERVER-62065)从3.6升级到4.0的路径可以在碎片上留下没有历史记录的大块条目
- [服务器-62739](https://jira.mongodb.org/browse/SERVER-62739)cancel_coordinate_txn_commit_with_tickets_exhausted.js测试不应使用临时存储引擎运行
- [服务器-62906](https://jira.mongodb.org/browse/SERVER-62906)在createCollection/shardCollection路径中添加一个勾号，以验证集合名称长度

### 查询

- [服务器-23664](https://jira.mongodb.org/browse/SERVER-23664)当余数不是数字时，$mod匹配表达式应该会引发错误
- [服务器-40691](https://jira.mongodb.org/browse/SERVER-40691)$nin:[[],...]查询没有索引
- [服务器-57588](https://jira.mongodb.org/browse/SERVER-57588)当值为数组的数组位置被索引时，查询结果不一致
- [服务器-59754](https://jira.mongodb.org/browse/SERVER-59754)对于共享相同$lookup形状的操作，queryHash/planCacheKey的日志记录不正确
- [服务器-62147](https://jira.mongodb.org/browse/SERVER-62147)当需要多个getMore批处理时，使用OP_QUERY协议的排气查询会中断

### 集合

[服务器-44484](https://jira.mongodb.org/browse/SERVER-44484)带有更新的更改流查看集合被分片之前更新的uisues

### 储存

[服务器-55483](https://jira.mongodb.org/browse/SERVER-55483)添加一个新的启动参数，跳过验证表日志设置

### 内部人员

- [服务器-51087](https://jira.mongodb.org/browse/SERVER-51087)添加测试实用程序，用于创建具有指定边界的空分片集合
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-57312](https://jira.mongodb.org/browse/SERVER-57312)固定传递Python依赖项，并使用固定文件在Evergreen中安装
- [服务器-60392](https://jira.mongodb.org/browse/SERVER-60392)修复priority_takeover_two_nodes_equal_priority测试中的时序。
- [服务器-60685](https://jira.mongodb.org/browse/SERVER-60685)TransactionCoordinator可能会中断具有非中断错误类别的本地执行更新，导致服务器崩溃
- [服务器-61662](https://jira.mongodb.org/browse/SERVER-61662)SCons配置检查应始终以冗差运行
- [服务器-61743](https://jira.mongodb.org/browse/SERVER-61743)除x86_64平台外，不应应用-fno-builtin-memcmp标志
- [服务器-62005](https://jira.mongodb.org/browse/SERVER-62005)[4.2] 将 require_document_locking 添加到 unique_index_insert_during_collection_scan.js
- [服务器-62164](https://jira.mongodb.org/browse/SERVER-62164)删除所有稳定分支上的几个过时的构建变体
- [服务器-62320](https://jira.mongodb.org/browse/SERVER-62320)（v4.2）修复std::move in find命令后的使用
- [服务器-62668](https://jira.mongodb.org/browse/SERVER-62668)在OperationContext中同步对ImpersonatedUserMetadata的访问。
- [服务器-62825](https://jira.mongodb.org/browse/SERVER-62825)Robustify causally_consistent_index_builds.js
- [服务器-63197](https://jira.mongodb.org/browse/SERVER-63197)Pin microbenchmarks genny版本
- [服务器-63203](https://jira.mongodb.org/browse/SERVER-63203)如果发现超过8192个分叉点，分块器永远不会分裂
- [WT-7993](https://jira.mongodb.org/browse/WT-7993)如果收集手柄，并且不在攻击性驱逐模式下，请进行驱逐睡眠，让检查站抓住有争议的旋转锁。



## 4.2.18 更改日志

### 分片

- [服务器-48504](https://jira.mongodb.org/browse/SERVER-48504)StaleShardVersion和ShardNotFound异常的组合使ChunkManagerTargeter崩溃
- [服务器-54064](https://jira.mongodb.org/browse/SERVER-54064)关于仲裁员的会议累积起来，无法清除
- [服务器-54623](https://jira.mongodb.org/browse/SERVER-54623)减少因果一致性直通套件中的作业数量
- [服务器-56226](https://jira.mongodb.org/browse/SERVER-56226)[v4.4]在config.collections条目上引入“许可迁移”字段，以防止块迁移提交
- [服务器-56227](https://jira.mongodb.org/browse/SERVER-56227)添加面向用户的命令，将分片集合的允许移民设置为false
- [服务器-58985](https://jira.mongodb.org/browse/SERVER-58985)一旦SERVER-55648反向移植到v4.0，在多版本套件中重新启用retryable_mongos_write_errors.js
- [服务器-59160](https://jira.mongodb.org/browse/SERVER-59160)在test_stacked_migration_cleanup.js中禁用平衡器
- [服务器-59916](https://jira.mongodb.org/browse/SERVER-59916)T{1, 2}Starts{First, Second}AndWins In WriteConflictHelpers不同步提交失败的事务
- [服务器-60653](https://jira.mongodb.org/browse/SERVER-60653)将autoSplitVector逻辑反向移植到v4.2

### 复制

- [服务器-50241](https://jira.mongodb.org/browse/SERVER-50241)PeriodicShardedIndexConsistencyChecker应该跳过删除的集合
- [服务器-56096](https://jira.mongodb.org/browse/SERVER-56096)ReplicationRecoveryImpl::recoverFromOplog中的不变故障
- [服务器-58988](https://jira.mongodb.org/browse/SERVER-58988)在主要追赶期间避免同步源选择周期。

### 集合

[服务器-59613](https://jira.mongodb.org/browse/SERVER-59613)如果超过内存限制，$range表达式应该会出错

### 储存

[服务器-45953](https://jira.mongodb.org/browse/SERVER-45953)豁免oplog读者获得阅读门票

### 运营

- [服务器-28953](https://jira.mongodb.org/browse/SERVER-28953)在FTDC中捕获df（磁盘完整）统计数据
- [服务器-53242](https://jira.mongodb.org/browse/SERVER-53242)Always log collmod命令

### 内部人员

- [服务器-52976](https://jira.mongodb.org/browse/SERVER-52976)[4.2] collection_validation.cpp没有在4.2分支的任何地方使用
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-55589](https://jira.mongodb.org/browse/SERVER-55589)replSetMaintenance命令不接受RSTL
- [服务器-56326](https://jira.mongodb.org/browse/SERVER-56326)将 round() 方法添加到 Decimal128 类中
- [服务器-56602](https://jira.mongodb.org/browse/SERVER-56602)在serverStatus中跟踪匹配表达式的使用情况
- [服务器-57557](https://jira.mongodb.org/browse/SERVER-57557)[v4.4] 支持运行带有mongos连接的checkFCV() shell助手
- [服务器-57605](https://jira.mongodb.org/browse/SERVER-57605)将Decimal128相等比较助手暴露在shell上
- [服务器-58104](https://jira.mongodb.org/browse/SERVER-58104)如果使用_id以外的碎片键丢弃并重新分片，config.system.sessions集合最终可能会出现无效的块
- [服务器-58119](https://jira.mongodb.org/browse/SERVER-58119)single_node_set_new_hostname.js需要使用assert.soonNoExcept调用replSetReconfig
- [服务器-58183](https://jira.mongodb.org/browse/SERVER-58183)_applyPrepareTransaction不能确保准备Conflict行为是kIgnoreConflictAccept在重试尝试时写
- [服务器-58192](https://jira.mongodb.org/browse/SERVER-58192)在QueryPlannerAnalysis::analyzeSort()中使用更多unique_ptrs
- [服务器-58780](https://jira.mongodb.org/browse/SERVER-58780)[v4.4] 如果replSetInitiate失败，请确保_shouldSetStableTimestamp恢复为true
- [服务器-59108](https://jira.mongodb.org/browse/SERVER-59108)解决交易操作在下台后不会被杀死的竞争
- [服务器-59120](https://jira.mongodb.org/browse/SERVER-59120)为commitChunksMerge创建单元测试
- [服务器-59191](https://jira.mongodb.org/browse/SERVER-59191)SPIKE：git.get_project无法克隆
- [服务器-59226](https://jira.mongodb.org/browse/SERVER-59226)标记为不间断的配置文件会话下台时陷入僵局
- [服务器-59294](https://jira.mongodb.org/browse/SERVER-59294)检查oidReset的操作类型
- [服务器-59459](https://jira.mongodb.org/browse/SERVER-59459)mongodb无法使用glibc-2.34构建
- [服务器-59725](https://jira.mongodb.org/browse/SERVER-59725)从额外的RHEL 6.2变体中删除推送任务
- [服务器-59804](https://jira.mongodb.org/browse/SERVER-59804)在system_perf.yml中使用单独的YCSB分支
- [服务器-59879](https://jira.mongodb.org/browse/SERVER-59879)调整maxTimeMS值，以便在并行测试套件中实现更慢的执行速度
- [服务器-60080](https://jira.mongodb.org/browse/SERVER-60080)[v4.2]禁用与ephemeralForTest不兼容的测试
- [服务器-60085](https://jira.mongodb.org/browse/SERVER-60085)回退测试套件的上限数量与套件中的测试数量
- [服务器-60149](https://jira.mongodb.org/browse/SERVER-60149)将RRFaM构建变体添加到v4.2分支上的mongocryptd列表中
- [服务器-60290](https://jira.mongodb.org/browse/SERVER-60290)更新Windows外部授权测试发行版
- [服务器-60299](https://jira.mongodb.org/browse/SERVER-60299)Bugzilla #2613的Backport PCRE错误修复
- [服务器-60456](https://jira.mongodb.org/browse/SERVER-60456)在Windows上严重延迟绑定期间，LDAPBindOptions超出了范围
- [服务器-60496](https://jira.mongodb.org/browse/SERVER-60496)Resmoke在Evergreen.yml中误解了报价
- [服务器-60582](https://jira.mongodb.org/browse/SERVER-60582)[v4.4] initiate_emrc_false.js需要等待初始检查点
- [服务器-60588](https://jira.mongodb.org/browse/SERVER-60588)$multiply在某些情况下在经典引擎中错误地抛出错误
- [服务器-60670](https://jira.mongodb.org/browse/SERVER-60670)使用单独的分支而不是TPCC的特定提交
- [服务器-60671](https://jira.mongodb.org/browse/SERVER-60671)移除匕首
- [服务器-60897](https://jira.mongodb.org/browse/SERVER-60897)[4.2]当试图重新插入无效的BSON时，蒙古人可能会永远循环
- [服务器-60898](https://jira.mongodb.org/browse/SERVER-60898)[v4.2]排除stepdown_race_with_transaction.js在ephemeralForTest上运行
- [服务器-60961](https://jira.mongodb.org/browse/SERVER-60961)向不生成multiversion_exclude_tags.yml的旧分支添加排除标签
- [服务器-60971](https://jira.mongodb.org/browse/SERVER-60971)删除对BF建议服务的来电
- [服务器-61164](https://jira.mongodb.org/browse/SERVER-61164)接受错误代码48（不适当的身份验证）作为LDAP活力检查的有效响应
- [服务器-61427](https://jira.mongodb.org/browse/SERVER-61427)由于检查许多虚假副本，唯一的索引构建可能会导致提交期间的可用性损失
- [服务器-61544](https://jira.mongodb.org/browse/SERVER-61544)[4.2]修复stepdown_race_with_transaction.js的排除标签
- [服务器-61550](https://jira.mongodb.org/browse/SERVER-61550)在perf.yml中修改auto_workload_path以相对于cwd
- [服务器-61791](https://jira.mongodb.org/browse/SERVER-61791)pin pymongo
- [WT-7566](https://jira.mongodb.org/browse/WT-7566)解决免费后写字的问题
- [WT-7858](https://jira.mongodb.org/browse/WT-7858)修复malloc在溢出键的边界外写入问题
- [WT-7984](https://jira.mongodb.org/browse/WT-7984)修复可能导致检查点省略一页数据的错误



## 4.2.17 更改日志

### 储存

[服务器-49521](https://jira.mongodb.org/browse/SERVER-49521)修复core/txn中的测试，将写入关注“多数”用于在开始事务之前运行的createIndexes命令

### 内部人员

- [服务器-48090](https://jira.mongodb.org/browse/SERVER-48090)支持python 3.6 for evergreen.py和shrub.py
- [服务器-50549](https://jira.mongodb.org/browse/SERVER-50549)在代理命令中转换与连接相关的错误代码
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-59456](https://jira.mongodb.org/browse/SERVER-59456)启动LDAPReaper线程池
- [服务器-59876](https://jira.mongodb.org/browse/SERVER-59876)在建立出口连接时，从libcrypto.so返回的严重延迟



## 4.2.16 更改日志

### 安全

[服务器-57727](https://jira.mongodb.org/browse/SERVER-57727)x509_invalid.js中的比赛条件

### 分片

- [服务器-55648](https://jira.mongodb.org/browse/SERVER-55648)Mongos在关机的情况下不会返回顶级批处理写错误
- [服务器-58909](https://jira.mongodb.org/browse/SERVER-58909)迁移到4.2版本的“管理员”和“配置”数据库缺少版本

### 复制

- [服务器-34938](https://jira.mongodb.org/browse/SERVER-34938)由于单个oplog批次将内容固定在缓存中，导致二次减速或挂起
- [服务器-36263](https://jira.mongodb.org/browse/SERVER-36263)在applyOps中绕过操作验证应该需要特殊特权
- [服务器-37904](https://jira.mongodb.org/browse/SERVER-37904)允许节点覆盖集群链（启用/禁用）设置
- [服务器-39621](https://jira.mongodb.org/browse/SERVER-39621)禁用的链条在主步骤下时强制同步源更改，即使oplog fetcher没有在同步源上被杀死
- [服务器-41875](https://jira.mongodb.org/browse/SERVER-41875)应该禁止WiredTiger存储的jstestfuzz_concurrent_replication_continuous__stepdown套件上的“emptyCapped”命令。
- [服务器-50486](https://jira.mongodb.org/browse/SERVER-50486)invokeWithSessionCheckedOut在二级交易上被调用
- [服务器-55465](https://jira.mongodb.org/browse/SERVER-55465)在选举中，当当前初选投票请求失败时，修复不变问题，即迎头收购
- [服务器-58258](https://jira.mongodb.org/browse/SERVER-58258)等待初始同步以清除状态，然后断言“replSetGetStatus”回复没有“initialSync”字段

### 查询

- [服务器-55319](https://jira.mongodb.org/browse/SERVER-55319)[4.2]索引构建完成后，不变故障是VersionInitialized() src/mongo/db/server_options.h 217
- [服务器-58127](https://jira.mongodb.org/browse/SERVER-58127)修复benchRun()内存泄漏，以便在异常下解析benchRun() args

### 构建和包装

[服务器-54729](https://jira.mongodb.org/browse/SERVER-54729)MongoDB Enterprise Debian/Ubuntu软件包应依赖于libsasl2-modules和libsasl2-modules-gssapi-mit

### 内部人员

- [服务器-49237](https://jira.mongodb.org/browse/SERVER-49237)添加一种方式，让OperationContexts选择加入，以便在下台时总是被中断
- [服务器-50547](https://jira.mongodb.org/browse/SERVER-50547)探索聚合管道长度限制
- [服务器-52728](https://jira.mongodb.org/browse/SERVER-52728)从MongoDB 2.4升级到4.2的路径会导致配置服务器停机
- [服务器-53431](https://jira.mongodb.org/browse/SERVER-53431)服务器应在降级时使用适当的拓扑版本响应正在运行的操作
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-55649](https://jira.mongodb.org/browse/SERVER-55649)为非分片集群记录的分片消息
- [服务器-56489](https://jira.mongodb.org/browse/SERVER-56489)带有随机hello服务器端延迟的新直通测试
- [服务器-56516](https://jira.mongodb.org/browse/SERVER-56516)修复$slice投影运算符解析代码中的未定义行为
- [服务器-56839](https://jira.mongodb.org/browse/SERVER-56839)与最近提交的准备交易同时进行的指数寻求可能会返回错误的结果
- [服务器-57033](https://jira.mongodb.org/browse/SERVER-57033)4.2中的AuthorizationManager缓存应使用角色作为缓存密钥
- [服务器-57064](https://jira.mongodb.org/browse/SERVER-57064)在mongos上记录创建索引和dropIndex（es）
- [服务器-57360](https://jira.mongodb.org/browse/SERVER-57360)在~LockerImpl中记录“不变（_requests.empty（））；”的额外调试信息
- [服务器-57642](https://jira.mongodb.org/browse/SERVER-57642)src/mongo/db/query/plan_yield_policy.cpp 75上的不变故障 | 中止
- [服务器-57650](https://jira.mongodb.org/browse/SERVER-57650)在等待对收件人命令的响应时，使MigrationChunkClonerSource可中断
- [服务器-57798](https://jira.mongodb.org/browse/SERVER-57798)当由于使用./install_compass的连接问题而无法安装MongoDB指南针时，请引导用户访问MongoDB指南针下载页面
- [服务器-57983](https://jira.mongodb.org/browse/SERVER-57983)经典引擎中$range的整数溢出
- [服务器-58169](https://jira.mongodb.org/browse/SERVER-58169)围绕稳定时间戳计算来记录不变量的时间戳信息
- [服务器-58187](https://jira.mongodb.org/browse/SERVER-58187)提高连接收割器和MongoLDAP性能
- [服务器-58191](https://jira.mongodb.org/browse/SERVER-58191)[迁移协议]允许delete_during_migrate.js容忍缓慢变体的追赶阶段超时导致的块迁移失败。
- [服务器-58283](https://jira.mongodb.org/browse/SERVER-58283)添加一个新的版本文件来设置MONGO_VERSION和MONGO_GIT_HASH
- [服务器-58313](https://jira.mongodb.org/browse/SERVER-58313)修复服务器-55460后端口到v4.2和v4.0导致的软件包测试失败
- [服务器-58402](https://jira.mongodb.org/browse/SERVER-58402)在 shutdown_primary.js 中增加关机命令的超时
- [服务器-58623](https://jira.mongodb.org/browse/SERVER-58623)在延迟的Hello测试中缩短mongos RSM刷新间隔
- [服务器-58826](https://jira.mongodb.org/browse/SERVER-58826)[4.2] 不允许 compact_keeps_indexes.js 和 explain_shell_helpers .js 在并行套件上同时运行
- [服务器-59074](https://jira.mongodb.org/browse/SERVER-59074)不要仅仅为了设置/等待oplog可见性而获取存储票据
- [服务器-59135](https://jira.mongodb.org/browse/SERVER-59135)使MSI中的mongocrypted目标依赖于libsasl2
- [服务器-59197](https://jira.mongodb.org/browse/SERVER-59197)当相应的会话文档被删除时，删除fam图像条目
- [服务器-59242](https://jira.mongodb.org/browse/SERVER-59242)更新到snmp 5.9.1
- [服务器-59262](https://jira.mongodb.org/browse/SERVER-59262)从storeFindAndModifyImagesInSideCollection构建变体中删除burn_in_tests任务
- [服务器-59388](https://jira.mongodb.org/browse/SERVER-59388)恢复BACKPORT-10185
- [服务器-59414](https://jira.mongodb.org/browse/SERVER-59414)在旧分支的Powercycle中重试策展人设置
- [WT-6568](https://jira.mongodb.org/browse/WT-6568)修复拆分生成的使用
- [WT-6926](https://jira.mongodb.org/browse/WT-6926)更新WiredTiger源代码以包含2021年版权声明
- [WT-7065](https://jira.mongodb.org/browse/WT-7065)将WT_DHANDLE_DEAD的检查添加到断言中
- [WT-7135](https://jira.mongodb.org/browse/WT-7135)编写损坏的元数据时要检测的额外检查
- [WT-7437](https://jira.mongodb.org/browse/WT-7437)将文档升级到doxygen 1.8.17
- [WT-7675](https://jira.mongodb.org/browse/WT-7675)在不使用检查点的情况下查询最后一个ckpt时间戳更改
- [WT-7721](https://jira.mongodb.org/browse/WT-7721)更新测试格式以重新打开具有不同配置的现有数据库
- [WT-7776](https://jira.mongodb.org/browse/WT-7776)在我们实例化完整更新之前，对修改更新的数量添加硬限制
- [WT-7871](https://jira.mongodb.org/browse/WT-7871)删除不再正确的注释



## 4.2.15 更改日志

### 安全

[服务器-56240](https://jira.mongodb.org/browse/SERVER-56240)打开密钥存储数据存储的检查点

### 分片

- [服务器-46811](https://jira.mongodb.org/browse/SERVER-46811)multi=true更新可以修改孤儿文档的分键，并导致它们被拥有
- [服务器-47534](https://jira.mongodb.org/browse/SERVER-47534)Unblacklist mongos_dataSize.js from sharding_last_stable_mongos_and_mixed_shards suite
- [服务器-47699](https://jira.mongodb.org/browse/SERVER-47699)将范围删除器使用的收益类型从YIELD_MANUAL更改为YIELD_AUTO
- [服务器-48648](https://jira.mongodb.org/browse/SERVER-48648)在_configsvrCommitChunkMerge中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-48653](https://jira.mongodb.org/browse/SERVER-48653)在_configsvrCommitChunkSplit中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-51170](https://jira.mongodb.org/browse/SERVER-51170)确保在ShardingState初始化后进行数据库刷新
- [服务器-53029](https://jira.mongodb.org/browse/SERVER-53029)端口 SERVER-52955 的更改到以后的分支
- [服务器-56515](https://jira.mongodb.org/browse/SERVER-56515)块合并不考虑增量ChunkMajorVersionOnChunkSplits参数
- [服务器-56654](https://jira.mongodb.org/browse/SERVER-56654)不要将集合分布式锁用于块分割
- [服务器-56779](https://jira.mongodb.org/browse/SERVER-56779)不要将集合分布式锁用于块合并
- [服务器-56786](https://jira.mongodb.org/browse/SERVER-56786)mergeChunks路径上有三个路由信息刷新和两个块扫描
- [服务器-57009](https://jira.mongodb.org/browse/SERVER-57009)在FCV更改期间发生崩溃时的额外调试信息
- [服务器-57055](https://jira.mongodb.org/browse/SERVER-57055)delete_during_migrate.js在启用了代码覆盖的测试套件中始终失败
- [服务器-57102](https://jira.mongodb.org/browse/SERVER-57102)修复ShardServerCatalogCacheLoader上的不变量，以考虑不同的术语
- [服务器-58109](https://jira.mongodb.org/browse/SERVER-58109)新的'_configsvrMergeChunks'路径比旧路径更贵

### 复制

- [服务器-44316](https://jira.mongodb.org/browse/SERVER-44316)在InitialSyncer中记录消息以开始应用时间戳不正确
- [服务器-45919](https://jira.mongodb.org/browse/SERVER-45919)当与选举赛跑时，应允许replSetReconfig在InterruptedDueToReplStateChange中失败
- [服务器-53447](https://jira.mongodb.org/browse/SERVER-53447)Blacklist insert1.js with from transaction passthrough tests with failure
- [服务器-55465](https://jira.mongodb.org/browse/SERVER-55465)在选举中，当当前初选投票请求失败时，修复不变问题，即迎头收购
- [服务器-55766](https://jira.mongodb.org/browse/SERVER-55766)引入优化的“用于恢复”启动复制恢复机制
- [服务器-56054](https://jira.mongodb.org/browse/SERVER-56054)将复制写入器线程池的minThreads值更改为0
- [服务器-56415](https://jira.mongodb.org/browse/SERVER-56415)当给定非默认节点集时，AwaitNodesAgreeOnPrimary不起作用
- [服务器-56937](https://jira.mongodb.org/browse/SERVER-56937)multi_rs.js中的upgradeSet()在升级主服务器时可能会失去身份验证状态

### 写入操作

[服务器-38909](https://jira.mongodb.org/browse/SERVER-38909)允许空更新修饰符，视为无操作而不是错误

### 储存

[服务器-51699](https://jira.mongodb.org/browse/SERVER-51699)index_build_restart_secondary.js（indexbg_restart_secondary.js）在重新启动节点后检查索引时应处理异常

### 运营

[服务器-48567](https://jira.mongodb.org/browse/SERVER-48567)处理snmpwalk时的警告

### 构建和包装

- [服务器-50568](https://jira.mongodb.org/browse/SERVER-50568)平台支持：从5.0中删除Ubuntu18.04 zSeries
- [服务器-55460](https://jira.mongodb.org/browse/SERVER-55460)修复SLES 12的RPM包装和测试

### 内部人员

- [服务器-37125](https://jira.mongodb.org/browse/SERVER-37125)如果进程参考已不复存在，Powercycle应忽略它
- [服务器-43617](https://jira.mongodb.org/browse/SERVER-43617)在mongos上添加指标，以指示命令（查找、聚合等）的目标碎片数量
- [服务器-45153](https://jira.mongodb.org/browse/SERVER-45153)在FTDCFileManager中忽略指标临时文件
- [服务器-47509](https://jira.mongodb.org/browse/SERVER-47509)resmoke接受多个“mongodSetParameters”选项，但只使用最后一个选项
- [服务器-47720](https://jira.mongodb.org/browse/SERVER-47720)澄清“在密钥索引中找不到RecordId（...）”日志消息
- [服务器-48636](https://jira.mongodb.org/browse/SERVER-48636)Increase assertEventDoesNotWakeCursor getMore timeout in only_wake_getmore_for_relevant_changes.js
- [服务器-48890](https://jira.mongodb.org/browse/SERVER-48890)允许带有空文档的$addFields，并使其不执行
- [服务器-49336](https://jira.mongodb.org/browse/SERVER-49336)如果客户端元数据在失败期间丢失，请设置客户端元数据Command
- [服务器-50955](https://jira.mongodb.org/browse/SERVER-50955)oplog_rollover.js暂停OplogCapMaintainerThread，直到需要截断
- [服务器-53334](https://jira.mongodb.org/browse/SERVER-53334)意外不变故障，导致服务器关机
- [服务器-53643](https://jira.mongodb.org/browse/SERVER-53643)启动可以看到旧版本的功能兼容性版本文档
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-53841](https://jira.mongodb.org/browse/SERVER-53841)oplog_rollover.js的额外日志记录
- [服务器-54489](https://jira.mongodb.org/browse/SERVER-54489)完全验证可以不受约束地附加错误
- [服务器-54897](https://jira.mongodb.org/browse/SERVER-54897)将单碎片配置添加到etc/system_perf.yml
- [服务器-55019](https://jira.mongodb.org/browse/SERVER-55019)install_compass 并非在所有受支持的平台上运行
- [服务器-55119](https://jira.mongodb.org/browse/SERVER-55119)创建启动警告，表明不建议使用没有SAN的X.509证书
- [服务器-55316](https://jira.mongodb.org/browse/SERVER-55316)断开LDAP连接线
- [服务器-55742](https://jira.mongodb.org/browse/SERVER-55742)在windows/macOS上定义kmipClientCertificateSelector配置
- [服务器-56062](https://jira.mongodb.org/browse/SERVER-56062)在CappedPositionLost错误后重新启动索引构建
- [服务器-56164](https://jira.mongodb.org/browse/SERVER-56164)所有性能项目都使用主DSI分支
- [服务器-56273](https://jira.mongodb.org/browse/SERVER-56273)更新Powercycle远程主机设置中的策展人哈希
- [服务器-56307](https://jira.mongodb.org/browse/SERVER-56307)块迁移“收敛算法”非常原始
- [服务器-56310](https://jira.mongodb.org/browse/SERVER-56310)在kill_sessions_with_prepared_transaction.js中使用w：多数创建收藏命令
- [服务器-56325](https://jira.mongodb.org/browse/SERVER-56325)等待 server_transaction_metrics.js 中的故障点被击中，以便收到有效的 serverStatus
- [服务器-56347](https://jira.mongodb.org/browse/SERVER-56347)在发布中启用LSE内在功能
- [服务器-56372](https://jira.mongodb.org/browse/SERVER-56372)添加retryableFindAndModifyStorageLocation服务器参数
- [服务器-56373](https://jira.mongodb.org/browse/SERVER-56373)[RRFaM]将FaM图像写入txn表时，使用需求编写oplog条目RetryImage
- [服务器-56374](https://jira.mongodb.org/browse/SERVER-56374)[RRFaM]将更新路径写入config.image_collection
- [服务器-56375](https://jira.mongodb.org/browse/SERVER-56375)[RRFaM]将删除路径写入config.transactions
- [服务器-56376](https://jira.mongodb.org/browse/SERVER-56376)[RRFaM]添加jstest来练习两个可重试的FaM行为
- [服务器-56377](https://jira.mongodb.org/browse/SERVER-56377)[RRFaM]添加FSM测试，在翻转服务器参数时执行可重试的FaM
- [服务器-56452](https://jira.mongodb.org/browse/SERVER-56452)PooledLDAPConnection::setup的回调中的自锚
- [服务器-56468](https://jira.mongodb.org/browse/SERVER-56468){$ne: null}谓词的计划缓存条目不正确，导致查询结果缺失
- [服务器-56501](https://jira.mongodb.org/browse/SERVER-56501)为旧操作代码（OP_QUERY、OP_INSERT等）添加操作计数器
- [服务器-56563](https://jira.mongodb.org/browse/SERVER-56563)[RRFaM]为块迁移伪造noop图像oplog条目
- [服务器-56630](https://jira.mongodb.org/browse/SERVER-56630)Unittest OpObserverImpl::onDelete/onUpdate paths for retryable findAndModify
- [服务器-56713](https://jira.mongodb.org/browse/SERVER-56713)[RRFaM]避免在初始同步时创建图像
- [服务器-56715](https://jira.mongodb.org/browse/SERVER-56715)在4.2上对日志保存人数据集使用错误的var名称
- [服务器-56819](https://jira.mongodb.org/browse/SERVER-56819)$indexOfCP在使用非零开始索引（仅限经典执行引擎）的空字符串中搜索空字符串时返回错误的结果
- [服务器-56952](https://jira.mongodb.org/browse/SERVER-56952)[4.4]使用storeFindAndModifyImagesInSideCollection=true添加新的构建变体
- [服务器-57015](https://jira.mongodb.org/browse/SERVER-57015)[RRFaM]写入图像集合必须处于UnreplicatedWriteBlock中
- [服务器-57036](https://jira.mongodb.org/browse/SERVER-57036)Pin MarkupSafe == 1.1.0
- [服务器-57043](https://jira.mongodb.org/browse/SERVER-57043)分支测试
- [服务器-57053](https://jira.mongodb.org/browse/SERVER-57053)用$not的$text重写$nor无效
- [服务器-57057](https://jira.mongodb.org/browse/SERVER-57057)减少mergeChunks路径上的路由信息刷新
- [服务器-57091](https://jira.mongodb.org/browse/SERVER-57091)粒度中的无限循环RounderPreferredNumbers::roundDown
- [服务器-57145](https://jira.mongodb.org/browse/SERVER-57145)OCSPManager::requestStatus上的不变故障
- [服务器-57157](https://jira.mongodb.org/browse/SERVER-57157)assert serverStatus命令在getBinVersion() jstest helper中工作
- [服务器-57172](https://jira.mongodb.org/browse/SERVER-57172)在DSI post_run之前发送json.s
- [服务器-57173](https://jira.mongodb.org/browse/SERVER-57173)当次要者在minValid之前应用操作时，为可重试的findAndModify编写无效的图像
- [服务器-57233](https://jira.mongodb.org/browse/SERVER-57233)如果未启用多线程，则内联收割LDAP连接
- [服务器-57273](https://jira.mongodb.org/browse/SERVER-57273)删除flow_control_replica_set.js测试
- [服务器-57275](https://jira.mongodb.org/browse/SERVER-57275)更新kmip_server.py以更加冗长
- [服务器-57299](https://jira.mongodb.org/browse/SERVER-57299)需要在startup_recovery_for_restore_needs_rollback.js中等待失败的退出代码
- [服务器-57328](https://jira.mongodb.org/browse/SERVER-57328)使ReplsetTest.upgradeSet()容忍连任
- [服务器-57330](https://jira.mongodb.org/browse/SERVER-57330)更新perf和sys-perf的perf yaml配置以使用perf.send
- [服务器-57476](https://jira.mongodb.org/browse/SERVER-57476)操作可能会在保持操作时阻止准备冲突，无限期地停止复制
- [服务器-57490](https://jira.mongodb.org/browse/SERVER-57490)[v4.2]将storeFindAndModify构建变体名称添加到etp/evergreen.yml中的mongodcryptd列表中
- [服务器-57497](https://jira.mongodb.org/browse/SERVER-57497)store_retryable_find_and_modify_images_in_side_collection.js应该在重试的findAndModify响应中考虑稍后的集群时间
- [服务器-57544](https://jira.mongodb.org/browse/SERVER-57544)另外，backport store_retryable_find_and_modify_images_in_side_collection.js到4.2
- [服务器-57564](https://jira.mongodb.org/browse/SERVER-57564)将系统超时持续时间延长至>2小时，以便Fio复制所有文件
- [服务器-57708](https://jira.mongodb.org/browse/SERVER-57708)ClientMetadata解析错误可能会使ClientMetadataState装饰处于无效状态
- [服务器-57768](https://jira.mongodb.org/browse/SERVER-57768)不建议使用的计数器在包装时不会重置为零
- [服务器-57897](https://jira.mongodb.org/browse/SERVER-57897)将readPrefMode选项添加到benchRun find/findOne ops
- [服务器-57954](https://jira.mongodb.org/browse/SERVER-57954)在sys-perf.yml中更新TPC-C版本



## 4.2.14 更改日志

### 分片

[服务器-52564](https://jira.mongodb.org/browse/SERVER-52564)下台和MongoDOperationContextSession之间的僵局

### 复制

- [服务器-50412](https://jira.mongodb.org/browse/SERVER-50412)将“非主”错误消息更改为“非主”
- [服务器-50414](https://jira.mongodb.org/browse/SERVER-50414)将“不是主或次要；当前无法从此replSet成员读取”更改为“非主或次要；当前无法从此replSet成员读取”
- [服务器-54180](https://jira.mongodb.org/browse/SERVER-54180)ReplSetTest的stepUp函数仅等待6秒，节点才能就主服务器达成一致
- [服务器-55007](https://jira.mongodb.org/browse/SERVER-55007)下台和MongoDOperationContextSession之间的僵局

### 查询

[服务器-54710](https://jira.mongodb.org/browse/SERVER-54710)大量$or子句可以创建超过最大BSON大小的剖析条目，导致查询在不应该失败时失败

### 储存

[服务器-44821](https://jira.mongodb.org/browse/SERVER-44821)检索被慢速操作日志应用程序阻止的currentOp的存储统计信息

### 运营

[服务器-54770](https://jira.mongodb.org/browse/SERVER-54770)将/proc/meminfo MemAvailable添加到FTDC

### 构建和包装

- [服务器-54031](https://jira.mongodb.org/browse/SERVER-54031)errorcodes.py没有检查Python脚本中的嵌入式C++代码
- [服务器-54057](https://jira.mongodb.org/browse/SERVER-54057)Mongodb-org-server el8软件包依赖python2
- [服务器-54386](https://jira.mongodb.org/browse/SERVER-54386)如果systemctl守护进程无法运行，mongodb 3.6.22安装失败
- [服务器-55067](https://jira.mongodb.org/browse/SERVER-55067)将Windows构建版本迁移到VS Current发行版

### 内部人员

- [服务器-5722](https://jira.mongodb.org/browse/SERVER-5722)支持JS基准线束的操作数组中的“排序”字段
- [服务器-42944](https://jira.mongodb.org/browse/SERVER-42944)scons compiledb退出带有堆栈跟踪
- [服务器-49054](https://jira.mongodb.org/browse/SERVER-49054)服务器MSI应该安装指南针而不是指南针社区
- [服务器-51465](https://jira.mongodb.org/browse/SERVER-51465)指南针安装程序更新后更新软件包测试
- [服务器-52610](https://jira.mongodb.org/browse/SERVER-52610)验证安装前缀已添加到RPM的正确位置
- [服务器-52833](https://jira.mongodb.org/browse/SERVER-52833)复制恢复后，封装集合可能包含太多文档
- [服务器-52953](https://jira.mongodb.org/browse/SERVER-52953)当maxDistance设置为0时，$geoNear并不总是匹配给定的坐标
- [服务器-53566](https://jira.mongodb.org/browse/SERVER-53566)调查并复制“opCtx！= nullptr && _opCtx == nullptr" 不变
- [服务器-54136](https://jira.mongodb.org/browse/SERVER-54136)使身份验证命令尊重强制执行用户Cluster分离
- [服务器-55038](https://jira.mongodb.org/browse/SERVER-55038)如果zbigMapReduce.js失败，请收集数据文件
- [服务器-55189](https://jira.mongodb.org/browse/SERVER-55189)在从rslib.js中的syncFrom()返回之前，请调用awaitReplication()
- [服务器-55225](https://jira.mongodb.org/browse/SERVER-55225)[v4.2] 为incremental_backup_rollback.js收集数据文件
- [服务器-55395](https://jira.mongodb.org/browse/SERVER-55395)4.0.23不使用gcc 10构建
- [服务器-55602](https://jira.mongodb.org/browse/SERVER-55602)指定restoreToOplogTimestamp时，在WiredTigerKVEngine::makeTemporaryRecordStore中放松非只读不变
- [服务器-55753](https://jira.mongodb.org/browse/SERVER-55753)在 transactions_committed_with_tickets_exhausted.js中使用w: majority for createCollection命令
- [服务器-56164](https://jira.mongodb.org/browse/SERVER-56164)所有性能项目都使用主DSI分支
- [服务器-56371](https://jira.mongodb.org/browse/SERVER-56371)将时间lib升级到2021.06
- [服务器-56451](https://jira.mongodb.org/browse/SERVER-56451)[4.2]更新备份API的测试，以便在与检查点线程冲突时重试
- [WT-7373](https://jira.mongodb.org/browse/WT-7373)改进oplog上缓慢的随机光标操作



## 4.2.13 更改日志

### 分片

- [服务器-53236](https://jira.mongodb.org/browse/SERVER-53236)禁用merge_with_move_primary.js在sharding_csrs_continuous_config_stepdown套件上运行
- [服务器-53651](https://jira.mongodb.org/browse/SERVER-53651)只需在read_pref_cmd.js中搜索用户发布的配置文件聚合
- [服务器-54014](https://jira.mongodb.org/browse/SERVER-54014)为checkOID请求定义合理的maxTimeMsOverride

### 复制

- [服务器-51163](https://jira.mongodb.org/browse/SERVER-51163)将返回InvalidReplicaSetConfig的节点标记为向下
- [服务器-53248](https://jira.mongodb.org/browse/SERVER-53248)在retryable_prepared_commit_transaction_after_failover.js中提交事务之前调用awaitLastOpCommitted
- [服务器-53609](https://jira.mongodb.org/browse/SERVER-53609)lastCommittedTransaction部分导致频繁的模式更改，限制FTDC的保留
- [服务器-53666](https://jira.mongodb.org/browse/SERVER-53666)curback测试夹具中的二级，不能保证重新启动后处于次要状态
- [服务器-54339](https://jira.mongodb.org/browse/SERVER-54339)在rollback_crud_op_sequences.js中防止自发选举
- [服务器-54648](https://jira.mongodb.org/browse/SERVER-54648)将正确的日志详细度添加到disallow_adding_initialized_node2.js

### 查询

- [服务器-47869](https://jira.mongodb.org/browse/SERVER-47869)将诊断日志添加到ClusterCursorManager
- [服务器-48442](https://jira.mongodb.org/browse/SERVER-48442)修复change_streams.js以任何顺序测试事件
- [服务器-50073](https://jira.mongodb.org/browse/SERVER-50073)创建混合哈希/非哈希索引时的错误消息不会说明问题
- [服务器-54660](https://jira.mongodb.org/browse/SERVER-54660)使jstests/sharding/kill_pinned_cursor.js更强大

### 储存

- [服务器-46876](https://jira.mongodb.org/browse/SERVER-46876)在驱逐压力期间，我们应该停止紧凑的操作，而不是破坏这个过程
- [服务器-54760](https://jira.mongodb.org/browse/SERVER-54760)(4.2) 幽灵时间戳可能导致并发因果快照读取不读取自己的写入

### 构建和包装

- [服务器-52705](https://jira.mongodb.org/browse/SERVER-52705)根据building.md重建mongodb失败，因为python3是一个别名/链接（导向到ModuleNotFoundError）
- [服务器-54058](https://jira.mongodb.org/browse/SERVER-54058)更新Debian 10 AMI进行软件包测试
- [服务器-54255](https://jira.mongodb.org/browse/SERVER-54255)更新RHEL 7 AMI进行软件包测试
- [服务器-54858](https://jira.mongodb.org/browse/SERVER-54858)更新Amazon Linux AMI进行软件包测试

### 内部人员

- [服务器-35649](https://jira.mongodb.org/browse/SERVER-35649)由于自我失败而被移除的节点应该重新尝试找到自己
- [服务器-43904](https://jira.mongodb.org/browse/SERVER-43904)下台阶时，上下行不会过滤掉冻结的节点
- [服务器-44132](https://jira.mongodb.org/browse/SERVER-44132)DataBuilder移动分配计算大小不正确
- [服务器-45836](https://jira.mongodb.org/browse/SERVER-45836)在默认日志级别提供更多LDAP详细信息（如服务器IP）
- [服务器-46686](https://jira.mongodb.org/browse/SERVER-46686)说明不尊重 maxTimeMS
- [服务器-46740](https://jira.mongodb.org/browse/SERVER-46740)establishCursors() 必须始终耗尽AsyncRequestsSender::_baton
- [服务器-47030](https://jira.mongodb.org/browse/SERVER-47030)修复date_time_support代码，以免产生异常
- [服务器-49222](https://jira.mongodb.org/browse/SERVER-49222)Amazon Linux 2上的ARM64支持
- [服务器-50592](https://jira.mongodb.org/browse/SERVER-50592)更新mypy pip要求
- [服务器-51038](https://jira.mongodb.org/browse/SERVER-51038)resmoke.py无法在python 3.8上运行
- [服务器-51722](https://jira.mongodb.org/browse/SERVER-51722)确保MongoDB使用ARM LSE原子构建
- [服务器-52884](https://jira.mongodb.org/browse/SERVER-52884)在reconstruct_prepared_transactions_initial_sync.js中删除种族
- [服务器-53196](https://jira.mongodb.org/browse/SERVER-53196)如果指定了大型发行版但不可用，则无法生成任务
- [服务器-53394](https://jira.mongodb.org/browse/SERVER-53394)使MongoD默认禁用ShardingTaskExecutorPoolReplicaSetMatching
- [服务器-53579](https://jira.mongodb.org/browse/SERVER-53579)python的dev-requirements.txt与pip 20.3.3不兼容
- [服务器-53612](https://jira.mongodb.org/browse/SERVER-53612)如果所有节点都赶上，但没有一个节点可以立即选择，StepDown将挂到超时
- [服务器-53717](https://jira.mongodb.org/browse/SERVER-53717)动态拆分大型并发任务
- [服务器-53780](https://jira.mongodb.org/browse/SERVER-53780)修复测试参数中缺少的报价
- [服务器-53831](https://jira.mongodb.org/browse/SERVER-53831)强迫SpiderMonkey在ReplSetTest.checkOplogs中收集垃圾
- [服务器-53836](https://jira.mongodb.org/browse/SERVER-53836)在Enterprise Ubuntu 16.04（使用{taskExecutorPoolSize=4}）构建变体上添加与多版本相关的扩展
- [服务器-53932](https://jira.mongodb.org/browse/SERVER-53932)在恢复准备好的事务期间进行多键写入可以使用提交时间戳<稳定时间戳
- [服务器-53992](https://jira.mongodb.org/browse/SERVER-53992)从性能任务中删除检测异常值的调用
- [服务器-54091](https://jira.mongodb.org/browse/SERVER-54091)更新resmoke.py运行的dbhash检查的断言消息
- [服务器-54134](https://jira.mongodb.org/browse/SERVER-54134)在setup_multiversion_mongodb.py的旧分支上忽略较新的mongo版本
- [服务器-54139](https://jira.mongodb.org/browse/SERVER-54139)从HTTP curl客户端中删除CURL共享支持
- [服务器-54278](https://jira.mongodb.org/browse/SERVER-54278)默认情况下，添加功能标志以禁用机会主义读取
- [服务器-54366](https://jira.mongodb.org/browse/SERVER-54366)等待节点开始降级，然后杀死force_shutdown_primary.js中的关机操作
- [服务器-54369](https://jira.mongodb.org/browse/SERVER-54369)将Jasper gRPC更新到最新版本
- [服务器-54458](https://jira.mongodb.org/browse/SERVER-54458)更新供应商scons，将uuid用于缓存tmpfile
- [服务器-54484](https://jira.mongodb.org/browse/SERVER-54484)resmoke/util/archival.py依赖于已弃用，现已删除thread.isAlive
- [服务器-54505](https://jira.mongodb.org/browse/SERVER-54505)修复4.2中忽略的大型发行版构建变体的逻辑
- [服务器-54684](https://jira.mongodb.org/browse/SERVER-54684)由于init功能失误，arm64上的JS性能下降
- [服务器-54685](https://jira.mongodb.org/browse/SERVER-54685)arm64的MONGO_YIELD_CORE_FOR_SMT的错误定义
- [服务器-54733](https://jira.mongodb.org/browse/SERVER-54733)企业Ubuntu 16.04 arm64聚合_multiversion_fuzzer故障
- [WT-6309](https://jira.mongodb.org/browse/WT-6309)向wt printlog命令添加对开始/停止参数的支持
- [WT-6430](https://jira.mongodb.org/browse/WT-6430)将WT_CONN_SERVER标志移动到自己的字段中
- [WT-6844](https://jira.mongodb.org/browse/WT-6844)使力停止持久
- [WT-7026](https://jira.mongodb.org/browse/WT-7026)在比赛的情况下，通过原子读取和设置ref->addr
- [WT-7027](https://jira.mongodb.org/browse/WT-7027)在增量备份的读取提交隔离处运行force_stop的元数据检查点
- [WT-7028](https://jira.mongodb.org/browse/WT-7028)在检查点收集手柄期间，扫描线程不应锁定
- [WT-7104](https://jira.mongodb.org/browse/WT-7104)从printlog输出编辑用户数据



## 4.2.12 更改日志

### 分片

- [服务器-46393](https://jira.mongodb.org/browse/SERVER-46393)在计算操作时，请务必检查客户端上次操作时间以附加到响应
- [服务器-50900](https://jira.mongodb.org/browse/SERVER-50900)禁用cursor_valid_after_shard_stepdown.js的PeriodicShardedIndexConsistencyChecker
- [服务器-52732](https://jira.mongodb.org/browse/SERVER-52732)正常运行时间报告在ShardingTest初始化期间禁用自动拆分
- [服务器-53444](https://jira.mongodb.org/browse/SERVER-53444)在 assert.soon 中运行 removeShard 的测试，等待状态“完成”，而不是在 ShardNotFound 上出错

### 复制

- [服务器-49187](https://jira.mongodb.org/browse/SERVER-49187)使ReplSetTest .stepUp()对选举失败具有鲁棒性。
- [服务器-50049](https://jira.mongodb.org/browse/SERVER-50049)assert.soonNoExcept()不应访问TestData.traceExceptions进行非烟雾测试。
- [服务器-50416](https://jira.mongodb.org/browse/SERVER-50416)在服务器状态中将 notMasterLegacyUnacknowledgedWrites更改为 notPrimaryLegacyUnacknowledgedWrites
- [服务器-50417](https://jira.mongodb.org/browse/SERVER-50417)在服务器状态中将 notMasterUnacknowledgedWrites 更改为 notPrimaryUnacknowledgedWrites
- [服务器-50869](https://jira.mongodb.org/browse/SERVER-50869)后台同步可能会在升级过程中错误地设置应用
- [服务器-50901](https://jira.mongodb.org/browse/SERVER-50901)RollbackTest在进行数据一致性检查之前应该等待次要测试
- [服务器-52560](https://jira.mongodb.org/browse/SERVER-52560)oplog_writes_only_permitted_on_standalone.js必须等待插入进入稳定的检查点
- [服务器-52680](https://jira.mongodb.org/browse/SERVER-52680)删除了启动时在重新添加到副本集后卡在STARTUP2中的节点
- [服务器-52744](https://jira.mongodb.org/browse/SERVER-52744)rollback node's lastApplied > sync source's lastApplied in rollback_after_enabling_majority_reads.js
- [服务器-53026](https://jira.mongodb.org/browse/SERVER-53026)次要无法重新启动复制
- [服务器-53345](https://jira.mongodb.org/browse/SERVER-53345)原谅arbiter_new_hostname.js来自多版本测试

### 查询

- [服务器-32960](https://jira.mongodb.org/browse/SERVER-32960)$mod的四舍五入/截断行为不一致
- [服务器-40361](https://jira.mongodb.org/browse/SERVER-40361)减少计划缓存条目的内存占用
- [服务器-50769](https://jira.mongodb.org/browse/SERVER-50769)服务器在expr:{"expr":"_currentApplyOps.getArrayLength() > 0","file":"src/mongo/db/pipeline/document_source_change_stream_transform.cpp","line":535}}

### 集合

- [服务器-34741](https://jira.mongodb.org/browse/SERVER-34741)如果条件在组键上，请将$match移动到$group前面
- [服务器-40090](https://jira.mongodb.org/browse/SERVER-40090)gg中的DISTINCT_SCAN仅在指定特定格式的_id时使用
- [服务器-51886](https://jira.mongodb.org/browse/SERVER-51886)当集合名称发生冲突时，$lookup + $merge管道可能无法正确解析视图

### 储存

- [服务器-47812](https://jira.mongodb.org/browse/SERVER-47812)次要者坚持通配符多键路径乱序
- [服务器-48471](https://jira.mongodb.org/browse/SERVER-48471)散列索引可能被错误地标记为多键，并且不符合分片键的条件
- [服务器-51858](https://jira.mongodb.org/browse/SERVER-51858)在4.0.20上调查可查询的问题
- [服务器-52950](https://jira.mongodb.org/browse/SERVER-52950)recoverOplogAsStandalone模式不得启动oplog truncater线程
- [服务器-53703](https://jira.mongodb.org/browse/SERVER-53703)[4.2] 在所有耐用的时间戳下开立交易可能会倒退

### 构建和包装

[服务器-52891](https://jira.mongodb.org/browse/SERVER-52891)运行PPC构建的频率较低

### 内部人员

- [服务器-41836](https://jira.mongodb.org/browse/SERVER-41836)在FSM测试中记录线程ID作为错误的一部分
- [服务器-43739](https://jira.mongodb.org/browse/SERVER-43739)如果启用了允许无效主机名，则不会在OSX上设置SNI名称
- [服务器-44375](https://jira.mongodb.org/browse/SERVER-44375)修复cure_with_drop_shard.js，当curop命令因ShardNotFound而失败时
- [服务器-47863](https://jira.mongodb.org/browse/SERVER-47863)初始同步进度指标
- [服务器-48742](https://jira.mongodb.org/browse/SERVER-48742)每当通过setProfilingLevel更改分析器设置时进行记录
- [服务器-50267](https://jira.mongodb.org/browse/SERVER-50267)为'rawMongoProgramOutput()'设置输出限制
- [服务器-50445](https://jira.mongodb.org/browse/SERVER-50445)当NumberLong减法在ExpressionSubtract中溢出时，将值作为双倍返回
- [服务器-51526](https://jira.mongodb.org/browse/SERVER-51526)在时间安排良好的WriteConflictException的情况下，混合索引构建可能会错过写入和崩溃
- [服务器-51607](https://jira.mongodb.org/browse/SERVER-51607)将扭曲依赖项升级到至少扭曲-19.7.0
- [服务器-52618](https://jira.mongodb.org/browse/SERVER-52618)稀疏哈希索引不应用于相等到空匹配
- [服务器-52646](https://jira.mongodb.org/browse/SERVER-52646)验证并可能修复userToDNMapping正则表达式重写规则中的边缘情况
- [服务器-52654](https://jira.mongodb.org/browse/SERVER-52654)未由监控密钥为HMAC线程生成的新签名密钥
- [服务器-52806](https://jira.mongodb.org/browse/SERVER-52806)deb安装文件假设系统化
- [服务器-52879](https://jira.mongodb.org/browse/SERVER-52879)由于关闭空闲缓存的WT会话，周期性操作延迟每5分钟飙升一次
- [服务器-52919](https://jira.mongodb.org/browse/SERVER-52919)未启用电线压缩以进行初始同步
- [服务器-52929](https://jira.mongodb.org/browse/SERVER-52929)使用32个键正确处理复合索引
- [服务器-52969](https://jira.mongodb.org/browse/SERVER-52969)在非主分支上禁用Powercyle
- [服务器-52975](https://jira.mongodb.org/browse/SERVER-52975)修复了“collection_impl.cpp”中集合验证器选项中“onRollback”回调的使用
- [服务器-53233](https://jira.mongodb.org/browse/SERVER-53233)修复change_streams_update_lookup_shard_metadata_missing.js [4.2, 4.0]
- [服务器-53234](https://jira.mongodb.org/browse/SERVER-53234)当对测试数据库运行后台操作时，jstests/core/profile2.js失败
- [WT-6835](https://jira.mongodb.org/browse/WT-6835)添加API以允许合并增量备份信息
- [WT-6839](https://jira.mongodb.org/browse/WT-6839)添加API以查询现有的增量备份ID
- [WT-6882](https://jira.mongodb.org/browse/WT-6882)在增量备份期间创建的文件应完整复制
- [WT-6922](https://jira.mongodb.org/browse/WT-6922)将随机整合测试添加到incr_backup



## 4.2.11 更改日志

### 安全

[服务器-45938](https://jira.mongodb.org/browse/SERVER-45938)如果clusterMode:keyFile，允许在客户端x509证书中匹配O/OU/DC

### 分片

- [服务器-36739](https://jira.mongodb.org/browse/SERVER-36739)在并发降级套件中使用mongos_manual_intervention_action钩子
- [服务器-47616](https://jira.mongodb.org/browse/SERVER-47616)改善了逻辑会话无法在单个连接上进行多个用户身份验证时的错误
- [服务器-51808](https://jira.mongodb.org/browse/SERVER-51808)不变失败：阅读关注级别！=可用

### 复制

- [服务器-33747](https://jira.mongodb.org/browse/SERVER-33747)如果重新启动后无法在配置中找到自己，仲裁员会尝试启动数据复制
- [服务器-50116](https://jira.mongodb.org/browse/SERVER-50116)启用复制时禁止oplog写入
- [服务器-50415](https://jira.mongodb.org/browse/SERVER-50415)将waitInIsMaster故障点重命名为waitInHello
- [服务器-50527](https://jira.mongodb.org/browse/SERVER-50527)将NotMasterError类别更改为NotPrimaryError

### 查询

- [服务器-51120](https://jira.mongodb.org/browse/SERVER-51120)使用SORT_MERGE查找查询，在指定排序时错误地对结果进行排序
- [服务器-51853](https://jira.mongodb.org/browse/SERVER-51853)始终在AbstractIndexAccessMethod::insertKeys中初始化numInserted out-parameter

### 写入操作

[服务器-44586](https://jira.mongodb.org/browse/SERVER-44586)将指标添加到serverStatus以跟踪更新命令的类型

### 集合

[服务器-48523](https://jira.mongodb.org/browse/SERVER-48523)尝试恢复更改流时，无条件检查操作日志中的第一个条目

### 储存

[服务器-43664](https://jira.mongodb.org/browse/SERVER-43664)通过优化WiredTigerUtil::setTableLogging()，加快许多表的WiredTiger存储引擎启动

### 运营

- [服务器-46729](https://jira.mongodb.org/browse/SERVER-46729)为不可用的OCSP响应器制作Windows shell软故障
- [服务器-51757](https://jira.mongodb.org/browse/SERVER-51757)在FTDC中收集/proc/vmstat numa_pages_migrated统计数据

### 构建和包装

- [服务器-46342](https://jira.mongodb.org/browse/SERVER-46342)MDB的DEB安装在安装时不会发出systemctl守护进程重新加载
- [服务器-50016](https://jira.mongodb.org/browse/SERVER-50016)缺少可变自定义文件失败

### 内部人员

- [服务器-43973](https://jira.mongodb.org/browse/SERVER-43973)jsTestName()应该为并行套件中的每个线程返回一个唯一的名称
- [服务器-45992](https://jira.mongodb.org/browse/SERVER-45992)InMemory引擎启动警告令人困惑
- [服务器-46625](https://jira.mongodb.org/browse/SERVER-46625)改进了当mongocryptd请求发送到非mongocryptd守护进程时的诊断
- [服务器-48078](https://jira.mongodb.org/browse/SERVER-48078)删除依赖单调时钟源的OpDebug不变量
- [服务器-48502](https://jira.mongodb.org/browse/SERVER-48502)在kill_pinned_cursor.js中收紧$currentOp和固定光标检查
- [服务器-49165](https://jira.mongodb.org/browse/SERVER-49165)Client.Disconnect中的endSessions命令导致需要身份验证的主机上未经身份验证的连接的授权失败
- [服务器-49957](https://jira.mongodb.org/browse/SERVER-49957)在 getPrevAndNextUUID 中阅读越界
- [服务器-50072](https://jira.mongodb.org/browse/SERVER-50072)初始化MongoRunner.EXIT_ABORT时检查_isWindows()
- [服务器-50123](https://jira.mongodb.org/browse/SERVER-50123)所有平台上创纪录的物理内核数量
- [服务器-50216](https://jira.mongodb.org/browse/SERVER-50216)调整sys-perf频率
- [服务器-50365](https://jira.mongodb.org/browse/SERVER-50365)陷入无法超时的长期交易
- [服务器-50605](https://jira.mongodb.org/browse/SERVER-50605)添加{logMessage: "msg"}仅测试命令
- [服务器-50647](https://jira.mongodb.org/browse/SERVER-50647)修复Windows的OCSP HTTP客户端超时
- [服务器-50736](https://jira.mongodb.org/browse/SERVER-50736)让OpenSSL明确接受ClientHello中显示的SNI
- [服务器-50818](https://jira.mongodb.org/browse/SERVER-50818)覆盖率分析缺陷114987：免费使用包装对象
- [服务器-51004](https://jira.mongodb.org/browse/SERVER-51004)在sys-perf-4.2上禁用WT-Develop sys-perf构建变体
- [服务器-51058](https://jira.mongodb.org/browse/SERVER-51058)log_remote_op_wait.js 误用 rawMongoProgramOutput
- [服务器-51106](https://jira.mongodb.org/browse/SERVER-51106)使 isMaster 命令成为 Hello 的派生类
- [服务器-51220](https://jira.mongodb.org/browse/SERVER-51220)处理间接下拉的审计归因
- [服务器-51303](https://jira.mongodb.org/browse/SERVER-51303)查找阶段，然后在类型上使用错误字段的$match
- [服务器-51840](https://jira.mongodb.org/browse/SERVER-51840)在Windows调试的4.2上减少dbtest作业
- [工具-2588](https://jira.mongodb.org/browse/TOOLS-2588)[v4.2] sslAllowInvalidHostnames完全绕过ssl/tls服务器认证验证
- [WT-6160](https://jira.mongodb.org/browse/WT-6160)修复堆栈覆盖导致的格式失败
- [WT-6507](https://jira.mongodb.org/browse/WT-6507)我们的操作超时后，退出缓存驱逐人员
- [WT-6602](https://jira.mongodb.org/browse/WT-6602)允许传递操作超时ms以提交和回滚
- [WT-6666](https://jira.mongodb.org/browse/WT-6666)当我们在回滚和提交中配置操作计时器时，启动它



## 4.2.10 更改日志

### 安全

[服务器-50463](https://jira.mongodb.org/browse/SERVER-50463)Make PooledLDAPConnection::刷新获得自有

### 分片

- [服务器-37422](https://jira.mongodb.org/browse/SERVER-37422)日志均衡器在操作日志中启动和停止事件
- [服务器-48601](https://jira.mongodb.org/browse/SERVER-48601)ChunkSplitter应该对splitVector和splitChunk使用相同的块边界
- [服务器-48679](https://jira.mongodb.org/browse/SERVER-48679)flushRoutingTableCacheUpdates应该用kWrite而不是kRead阻止关键部分
- [服务器-50889](https://jira.mongodb.org/browse/SERVER-50889)migration_failure.js应该通过路由器而不是配置服务器运行setFCV

### 复制

- [服务器-47263](https://jira.mongodb.org/browse/SERVER-47263)失败的模拟竞选时日志消息不准确
- [服务器-47645](https://jira.mongodb.org/browse/SERVER-47645)下台时必须使所有会话无效
- [服务器-48518](https://jira.mongodb.org/browse/SERVER-48518)通过retch回滚（EMRC = false）可以让读者看到回滚的数据，即使在回滚节点赶上主节点之后也是如此。
- [服务器-48928](https://jira.mongodb.org/browse/SERVER-48928)允许主要选择完成排水模式，即使它正在无条件下降
- [服务器-49986](https://jira.mongodb.org/browse/SERVER-49986)将 isMaster 命令转换为 hello 并添加别名
- [服务器-49987](https://jira.mongodb.org/browse/SERVER-49987)如果在mongod上发送了“hello”，请重命名响应字段
- [服务器-49988](https://jira.mongodb.org/browse/SERVER-49988)如果mongos上发送了“hello”，请重命名响应字段
- [服务器-49989](https://jira.mongodb.org/browse/SERVER-49989)添加db.hello() shell helper
- [服务器-49990](https://jira.mongodb.org/browse/SERVER-49990)别名setSlaveOk()和getSlaveOk() shell助手
- [服务器-49991](https://jira.mongodb.org/browse/SERVER-49991)别名printSlaveReplicationInfo（）shell助手
- [服务器-50405](https://jira.mongodb.org/browse/SERVER-50405)别名是mongocryptd中的Master，并附加适当的响应字段
- [服务器-50607](https://jira.mongodb.org/browse/SERVER-50607)调用_checkForShutdownAndConvertStatus_inlock时必须保持互斥
- [服务器-50626](https://jira.mongodb.org/browse/SERVER-50626)在read_concern_majority_getmore_secondaries.js中比赛
- [服务器-50640](https://jira.mongodb.org/browse/SERVER-50640)listCommands除了“hello”命令名外，还应该返回“isMaster”别名

### 查询

- [服务器-47469](https://jira.mongodb.org/browse/SERVER-47469)applyOps不接受视图操作的独家锁定
- [服务器-50291](https://jira.mongodb.org/browse/SERVER-50291)添加查询旋钮，以不同顺序枚举$或子项

### 集合

- [服务器-31368](https://jira.mongodb.org/browse/SERVER-31368)在合并光标聚合阶段等待其他碎片的日志时间
- [服务器-40317](https://jira.mongodb.org/browse/SERVER-40317)$facet执行对它可以消耗多少内存没有限制

### 运营

[服务器-26726](https://jira.mongodb.org/browse/SERVER-26726)检查createIndex()的参数数量，如果两个以上的参数，则抛出错误

### 构建和包装

- [服务器-23668](https://jira.mongodb.org/browse/SERVER-23668)scons缩写选项无法正常工作
- [服务器-44632](https://jira.mongodb.org/browse/SERVER-44632)平台支持：从4.2中删除社区zSeries
- [服务器-47138](https://jira.mongodb.org/browse/SERVER-47138)MSI安装程序生成错误的配置文件
- [服务器-50078](https://jira.mongodb.org/browse/SERVER-50078)当它不应该有时，编译旁路应用

### 内部人员

- [服务器-42852](https://jira.mongodb.org/browse/SERVER-42852)buildStages() STAGE_SHARDING_FILTER块应该通过unique_ptr保存子阶段树
- [服务器-43233](https://jira.mongodb.org/browse/SERVER-43233)添加仅为LDAP组请求特定属性的能力
- [服务器-45202](https://jira.mongodb.org/browse/SERVER-45202)改进命令别名基础设施
- [服务器-47428](https://jira.mongodb.org/browse/SERVER-47428)将concurrency_sharded* Evergreen任务移动到-large distros
- [服务器-48048](https://jira.mongodb.org/browse/SERVER-48048)使用resmoke标签文件进行多版本黑名单
- [服务器-48410](https://jira.mongodb.org/browse/SERVER-48410)日期时间库的签名整数溢出修复
- [服务器-48709](https://jira.mongodb.org/browse/SERVER-48709)配置服务器上的签名密钥生成器线程没有按预期唤醒
- [服务器-49054](https://jira.mongodb.org/browse/SERVER-49054)服务器MSI应该安装指南针而不是指南针社区
- [服务器-49438](https://jira.mongodb.org/browse/SERVER-49438)允许mory.js测试接受$where超时中断
- [服务器-49766](https://jira.mongodb.org/browse/SERVER-49766)索引和非索引集合返回空查询的不同结果
- [服务器-49786](https://jira.mongodb.org/browse/SERVER-49786)冻结非主工作项目的DSI和Genny
- [服务器-49922](https://jira.mongodb.org/browse/SERVER-49922)减轻schema_validator_with_expr_variables.js的重
- [服务器-50183](https://jira.mongodb.org/browse/SERVER-50183)Copy _awaitPrimaryAppliedSurpassesRollbackApplied函数从RollbackTest复制到RollbackTestDeluxe
- [服务器-50326](https://jira.mongodb.org/browse/SERVER-50326)将agg_out.js工作负载中的分片限制为单个线程
- [服务器-50394](https://jira.mongodb.org/browse/SERVER-50394)mongod审计日志在分片环境中将DDL操作归因于__system用户
- [服务器-50403](https://jira.mongodb.org/browse/SERVER-50403)在组合的视觉工作室图像上构建服务器
- [服务器-50760](https://jira.mongodb.org/browse/SERVER-50760)[v4.2] Switch MultiOplogEntrySyncTailTest使用有线虎
- [服务器-50822](https://jira.mongodb.org/browse/SERVER-50822)[4.2] dont_read_oplog_hole_on_step_up.js应该等待所有节点就主节点达成一致
- [服务器-51041](https://jira.mongodb.org/browse/SERVER-51041)次要读取的节流启动交易
- [WT-6000](https://jira.mongodb.org/browse/WT-6000)以格式增强增量备份测试，以支持重新启动
- [WT-6215](https://jira.mongodb.org/browse/WT-6215)清除有关重命名的备份块信息：已恢复
- [WT-6421](https://jira.mongodb.org/browse/WT-6421)避免解析干净文件的元数据检查点
- [WT-6539](https://jira.mongodb.org/browse/WT-6539)修复备份和重命名内存泄漏
- [WT-6559](https://jira.mongodb.org/browse/WT-6559)使用新会话的会话ID来确定统计存储桶
- [WT-6598](https://jira.mongodb.org/browse/WT-6598)添加新的API，允许更改dhandle哈希桶大小
- [WT-6610](https://jira.mongodb.org/browse/WT-6610)修复增量备份检查点解析以处理升级
- [WT-6611](https://jira.mongodb.org/browse/WT-6611)恢复增强功能，允许重命名和增量备份



## 4.2.9 更改日志

### 安全

[服务器-47733](https://jira.mongodb.org/browse/SERVER-47733)SymmetricEncryptorWindows在调用更新时不应填充

### 分片

- [服务器-40441](https://jira.mongodb.org/browse/SERVER-40441)当尝试创建会话集合或检查是否存在时，仲裁节点会记录错误消息
- [服务器-46194](https://jira.mongodb.org/browse/SERVER-46194)在迁移中应用传输模组不会处理写入冲突
- [服务器-48096](https://jira.mongodb.org/browse/SERVER-48096)jstests上的定期分段索引一致性检查器线程可能会导致意外的碎片刷新
- [服务器-48229](https://jira.mongodb.org/browse/SERVER-48229)在复制协调员之后关闭周期性共享索引一致性检查器，因此在作业停止后，没有线程会尝试暂停作业
- [服务器-48491](https://jira.mongodb.org/browse/SERVER-48491)将require_document_locking标签添加到sss_collection_reaping.js
- [服务器-48674](https://jira.mongodb.org/browse/SERVER-48674)在检查节点是否是LogicalSessionCacheImpl中的仲裁器之前，请检查是否启用了复制
- [服务器-48926](https://jira.mongodb.org/browse/SERVER-48926)修复在碎片次要错误地将投票设置为0的剩余分片测试
- [服务器-49233](https://jira.mongodb.org/browse/SERVER-49233)引入一个标志，以切换拆分期间撞合集合主要版本的逻辑
- [服务器-49311](https://jira.mongodb.org/browse/SERVER-49311)PeriodicShardedIndexConsistencyChecker可能会导致stale_mongos_and_restarted_shards_agree_on_shard_version.js上的故障

### 复制

- [服务器-44779](https://jira.mongodb.org/browse/SERVER-44779)击中准备冲突的不变内部操作必须标记为可杀死
- [服务器-45610](https://jira.mongodb.org/browse/SERVER-45610)当系统正在恢复时，一些读取工作
- [服务器-47849](https://jira.mongodb.org/browse/SERVER-47849)为关机任务添加更多日志记录
- [服务器-48525](https://jira.mongodb.org/browse/SERVER-48525)禁止在准备好交易时删除config.transactions
- [服务器-48527](https://jira.mongodb.org/browse/SERVER-48527)在升级时中止正在进行的交易应在返回前清除会话状态
- [服务器-48576](https://jira.mongodb.org/browse/SERVER-48576)在change_stream_stepdown.js中修复选举竞争
- [服务器-48611](https://jira.mongodb.org/browse/SERVER-48611)speculative_majority_find.js在运行预计将成功的多数读取之前，应调用awaitLastOpCommitted
- [服务器-48712](https://jira.mongodb.org/browse/SERVER-48712)在write_concern_after_stepdown.js中比赛
- [服务器-48778](https://jira.mongodb.org/browse/SERVER-48778)使reconstruct_prepared_transactions_initial_sync.js对选举失败具有鲁棒性。
- [服务器-48967](https://jira.mongodb.org/browse/SERVER-48967)防止在次调的空命名空间上复制写入
- [服务器-48979](https://jira.mongodb.org/browse/SERVER-48979)在change_stream_stepdown.js中配置传播和选举之间的竞争
- [服务器-49471](https://jira.mongodb.org/browse/SERVER-49471)应用准备交易操作日志条目时在WT_ROLLBACK上重试
- [服务器-50039](https://jira.mongodb.org/browse/SERVER-50039)dbadmin.js测试中的计时错误

### 查询

- [服务器-35921](https://jira.mongodb.org/browse/SERVER-35921)索引扫描对MinKey和MaxKey使用错误的边界
- [服务器-44273](https://jira.mongodb.org/browse/SERVER-44273)未能在Windows平台上解析某些时区规范。
- [服务器-45233](https://jira.mongodb.org/browse/SERVER-45233)索引到数组的不等式返回错误的结果
- [服务器-47223](https://jira.mongodb.org/browse/SERVER-47223)geoNear/$geoNear不应用索引提示
- [服务器-48614](https://jira.mongodb.org/browse/SERVER-48614)使用 partialIndexFilter 的通配符索引的计划缓存密钥计算不正确，导致查询结果不正确
- [服务器-48950](https://jira.mongodb.org/browse/SERVER-48950)增强对$search的解释，以公开来自mongot的统计数据
- [服务器-48993](https://jira.mongodb.org/browse/SERVER-48993)explodeForSort可能会产生不正确的查询计划
- [服务器-49527](https://jira.mongodb.org/browse/SERVER-49527)recoverFromOplogAsStandalone不会放松索引约束

### 目录

[服务器-47714](https://jira.mongodb.org/browse/SERVER-47714)使用WiredTigerRecordStore::insertRecord 95的system.profile集合上的次要断言：不支持操作

### 储存

- [服务器-44529](https://jira.mongodb.org/browse/SERVER-44529)在屈服和降级后重新获得锁会导致恢复单元的参数错误
- [服务器-48274](https://jira.mongodb.org/browse/SERVER-48274)删除加密分片集群可查询还原的只读模式
- [服务器-48453](https://jira.mongodb.org/browse/SERVER-48453)在删除时懒惰地初始化记录存储的自动增量计数器
- [服务器-48695](https://jira.mongodb.org/browse/SERVER-48695)setAppliedThrough必须在恢复单元上设置ordercommit=false

### 运营

- [服务器-44051](https://jira.mongodb.org/browse/SERVER-44051)getShardDistribution（）在删除但之前分片集合时没有报告“Collection XYZ未分片”
- [服务器-48244](https://jira.mongodb.org/browse/SERVER-48244)Shell不应该对允许的解释级别进行硬编码，而是让服务器拒绝它

### 构建和包装

- [服务器-42042](https://jira.mongodb.org/browse/SERVER-42042)使用工具链编译器和tcmalloc在动态构建的早期警告或失败
- [服务器-46445](https://jira.mongodb.org/browse/SERVER-46445)MongoDB MSI安装程序在服务器配置窗口中安装时显示无关的错误消息
- [服务器-48329](https://jira.mongodb.org/browse/SERVER-48329)调整主分支或所有稳定分支上action_type.h的命名
- [服务器-48640](https://jira.mongodb.org/browse/SERVER-48640)更新RHEL 6.2 AMI进行软件包测试

### 内部人员

- [服务器-33229](https://jira.mongodb.org/browse/SERVER-33229)在auto_retry_on_network_error.js中重载startParallelShell，在加载auto_retry_on_network_error.js覆盖后连接
- [服务器-41070](https://jira.mongodb.org/browse/SERVER-41070)添加blockConnection模式以失败命令
- [服务器-43490](https://jira.mongodb.org/browse/SERVER-43490)验证我们是否可以执行SERVER-38686中列出的TODO
- [服务器-46721](https://jira.mongodb.org/browse/SERVER-46721)上升可能会导致屈服后在PIT有孔的读数
- [服务器-46854](https://jira.mongodb.org/browse/SERVER-46854)在jstests/sharding/lookup_mongod_unaware.js中禁用配置服务器上的周期性索引一致性检查器
- [服务器-47195](https://jira.mongodb.org/browse/SERVER-47195)允许 failCommand failpoint 仅在特定的 MongoClient 上触发
- [服务器-47883](https://jira.mongodb.org/browse/SERVER-47883)新当选的初选不会等到单相背景索引构建完成后才接受写入
- [服务器-47930](https://jira.mongodb.org/browse/SERVER-47930)Ubuntu 20.04 - ldap_authz_authn.js加载测试证书失败
- [服务器-48032](https://jira.mongodb.org/browse/SERVER-48032)更新MongoDB开发人员社区论坛的社区邮件列表参考
- [服务器-48058](https://jira.mongodb.org/browse/SERVER-48058)确保abort_transactions_on_step_up等待应用opime
- [服务器-48067](https://jira.mongodb.org/browse/SERVER-48067)使用大量非唯一密钥减少唯一索引构建的内存消耗
- [服务器-48107](https://jira.mongodb.org/browse/SERVER-48107)在rollback_test.js中重试replSetStepDown
- [服务器-48514](https://jira.mongodb.org/browse/SERVER-48514)服务器状态选举指标的单独测试“调用”和“成功”字段
- [服务器-48532](https://jira.mongodb.org/browse/SERVER-48532)[4.2] IndexBuildInterceptor::areAllWritesApplied可能会返回false，尽管所有记录都已明显应用
- [服务器-48568](https://jira.mongodb.org/browse/SERVER-48568)在change_streams_multi_version_transaction.js中使用'nodeOptions'
- [服务器-48569](https://jira.mongodb.org/browse/SERVER-48569)将冲突操作InProgress作为可接受的错误代码添加到validateCollectionsCallback中
- [服务器-48657](https://jira.mongodb.org/browse/SERVER-48657)使用常青模块控制perf项目中的信号处理
- [服务器-48891](https://jira.mongodb.org/browse/SERVER-48891)当数据库不存在时，reIndex中对ViewCatalog的nullptr取消引用
- [服务器-48907](https://jira.mongodb.org/browse/SERVER-48907)允许用户使用常青集模块修补对linkbench/linkbench2的测试更改
- [服务器-49007](https://jira.mongodb.org/browse/SERVER-49007)mock_http_server.py中指标响应中的往返注册ID
- [服务器-49071](https://jira.mongodb.org/browse/SERVER-49071)使ldap_fastest_host_selection.js容忍统计中缺失的LDAP服务器
- [服务器-49097](https://jira.mongodb.org/browse/SERVER-49097)sys-perf构建不同于发布版本构建
- [服务器-49142](https://jira.mongodb.org/browse/SERVER-49142)在RoleName::parseFromBSON()中验证正确的字段名
- [服务器-49335](https://jira.mongodb.org/browse/SERVER-49335)publish_packages应该使用barque API密钥
- [服务器-49404](https://jira.mongodb.org/browse/SERVER-49404)在$arrayToObject中执行额外的检查
- [服务器-49690](https://jira.mongodb.org/browse/SERVER-49690)搜索旧操作日志条目时重试“CappedPositionLost”
- [服务器-49704](https://jira.mongodb.org/browse/SERVER-49704)txn_being_applied_to_secondary_cannot_be_killed.js不应该允许选举
- [服务器-50173](https://jira.mongodb.org/browse/SERVER-50173)[v4.4]从测试套件sharding_multiversion的后端口列表中删除explode_for_sort_collation.js
- [WT-6261](https://jira.mongodb.org/browse/WT-6261)关闭增量备份重命名测试
- [WT-6319](https://jira.mongodb.org/browse/WT-6319)修复损坏的加密项目：衬垫尺寸小于实际尺寸
- [WT-6480](https://jira.mongodb.org/browse/WT-6480)修复了在每个增量备份中反复复制没有块修改信息的文件的错误
- [WT-6495](https://jira.mongodb.org/browse/WT-6495)重构 test_backup16.py



## 4.2.8 更改日志

### 分片

- [服务器-40441](https://jira.mongodb.org/browse/SERVER-40441)当尝试创建会话集合或检查是否存在时，仲裁节点会记录错误消息
- [服务器-45554](https://jira.mongodb.org/browse/SERVER-45554)从分片测试套件中取消核心/txns的黑名单
- [服务器-47799](https://jira.mongodb.org/browse/SERVER-47799)AsyncRequestsSender应该在InterruptedAtShutdown重试之间更新副本集监视器
- [服务器-47913](https://jira.mongodb.org/browse/SERVER-47913)在拆分块和分布式锁获取中编辑分片消息
- [服务器-48307](https://jira.mongodb.org/browse/SERVER-48307)写入一个碎片并从一个或多个其他碎片读取的事务可能会错误地表明成功提交后重试失败
- [服务器-48491](https://jira.mongodb.org/browse/SERVER-48491)将require_document_locking标签添加到sss_collection_reaping.js
- [服务器-48674](https://jira.mongodb.org/browse/SERVER-48674)在检查节点是否是LogicalSessionCacheImpl中的仲裁器之前，请检查是否启用了复制

### 复制

- [服务器-46496](https://jira.mongodb.org/browse/SERVER-46496)在reconfig_add_remove_arbiter.js中重试异常
- [服务器-46897](https://jira.mongodb.org/browse/SERVER-46897)已移除的节点可能永远不会发送心跳以获取最新配置
- [服务器-47528](https://jira.mongodb.org/browse/SERVER-47528)replSetGetStatus中存在initialSyncStatus会消耗太多的FTDC空间
- [服务器-47879](https://jira.mongodb.org/browse/SERVER-47879)应该在rollback_reconstructs_transactions_prepared_before_stable中从主读出
- [服务器-48101](https://jira.mongodb.org/browse/SERVER-48101)在optime.js中启用持久性时，请使用“j:true”
- [服务器-48250](https://jira.mongodb.org/browse/SERVER-48250)在write_concern_after_stepdown_and_stepup.js中降级之前，等待挂起多数写
- [服务器-48276](https://jira.mongodb.org/browse/SERVER-48276)ReplSet免费监控URL不一致
- [服务器-48371](https://jira.mongodb.org/browse/SERVER-48371)transactions_during_step_down.js必须在shell中中止事务
- [服务器-48541](https://jira.mongodb.org/browse/SERVER-48541)修复fcv文档回滚时的日志输出

### 查询

- [服务器-47209](https://jira.mongodb.org/browse/SERVER-47209)change_streams_update_lookup_shard_metadata_missing.js应该处理在回滚时建立更改流光标的节点
- [服务器-47773](https://jira.mongodb.org/browse/SERVER-47773)geoNear invariant on mongos
- [服务器-47994](https://jira.mongodb.org/browse/SERVER-47994)修复GeoHash中的数字溢出问题

### 储存

- [服务器-43097](https://jira.mongodb.org/browse/SERVER-43097)改进索引构建因启动恢复而突出显示的日志消息传递
- [服务器-45570](https://jira.mongodb.org/browse/SERVER-45570)将ProgressMeter添加到索引构建启动恢复代码路径中
- [服务器-48384](https://jira.mongodb.org/browse/SERVER-48384)在TimestampMonitor摧毁其成员之前停止定期工作

### 运营

- [服务器-44051](https://jira.mongodb.org/browse/SERVER-44051)getShardDistribution（）在删除但之前分片集合时没有报告“Collection XYZ未分片”
- [服务器-46189](https://jira.mongodb.org/browse/SERVER-46189)shell挂着消息“不允许使用单个副本集丢失的ssl模式

### 构建和包装

- [服务器-48640](https://jira.mongodb.org/browse/SERVER-48640)更新RHEL 6.2 AMI进行软件包测试
- [服务器-48659](https://jira.mongodb.org/browse/SERVER-48659)更新SLES 12 AMI进行软件包测试

### 内部人员

- [服务器-46758](https://jira.mongodb.org/browse/SERVER-46758)在FCV更改被大多数提交之前，setFCV可以中断，并在不运行setFCV服务器逻辑的情况下回滚FCV
- [服务器-47187](https://jira.mongodb.org/browse/SERVER-47187)当SeIncreaseWorkingSetPrivilege不存在时添加启动警告
- [服务器-47256](https://jira.mongodb.org/browse/SERVER-47256)更新repo软件包文件的列表维护程序
- [服务器-47611](https://jira.mongodb.org/browse/SERVER-47611)使用argparse重新工作到_local_args函数
- [服务器-47798](https://jira.mongodb.org/browse/SERVER-47798)审计是mongod和mongos的主响应验证
- [服务器-47877](https://jira.mongodb.org/browse/SERVER-47877)一些重复集测试在没有断言的情况下使用arrayEq
- [服务器-48346](https://jira.mongodb.org/browse/SERVER-48346)修复参考捕获的障碍的生命周期问题
- [服务器-48369](https://jira.mongodb.org/browse/SERVER-48369)修复 prepare_conflict.js 在创建索引时使用写入 concern “多数”
- [服务器-48657](https://jira.mongodb.org/browse/SERVER-48657)使用常青模块控制perf项目中的信号处理
- [工具-2562](https://jira.mongodb.org/browse/TOOLS-2562)[v4.2] Oplog重播无法处理条目>16 MB
- [工具-2586](https://jira.mongodb.org/browse/TOOLS-2586)[v4.2]写入位置设置不正确
- [WT-6366](https://jira.mongodb.org/browse/WT-6366)用于增量备份的块修改位图中的逐个溢出



## 4.2.7 更改日志

### 安全

- [服务器-45514](https://jira.mongodb.org/browse/SERVER-45514)[FLE]如果验证操作是“警告”，则拒绝带有加密相关关键字的文档验证器
- [服务器-48039](https://jira.mongodb.org/browse/SERVER-48039)无法识别的选项：net.ssl.clusterCertificateSelector in MongoDB v4.2

### 分片

- [服务器-42632](https://jira.mongodb.org/browse/SERVER-42632)禁用伸手配置服务器以使集成测试通过的pinger线程
- [服务器-42772](https://jira.mongodb.org/browse/SERVER-42772)TransactionCoordinatorService::joinPreviousRound和协调员破坏之间的竞争可能会触发不变
- [服务器-43100](https://jira.mongodb.org/browse/SERVER-43100)删除CotcomitReturnsNoneIfCoordinator已删除单元测试
- [服务器-45009](https://jira.mongodb.org/browse/SERVER-45009)事务协调员任务应该稳健，无法关闭，否则无法下台
- [服务器-46396](https://jira.mongodb.org/browse/SERVER-46396)添加指标以跟踪目录缓存刷新后被阻止的操作数量
- [服务器-46487](https://jira.mongodb.org/browse/SERVER-46487)散射/采集操作的蒙古路由可能具有无界延迟
- [服务器-47481](https://jira.mongodb.org/browse/SERVER-47481)在基于ShardedClusterFixture的套件中，在CSRS上将minNumChunksForSessionsCollection设置为1
- [服务器-47745](https://jira.mongodb.org/browse/SERVER-47745)使ShardingCatalogManager中的块查询与3.4中创建的块兼容
- [服务器-47999](https://jira.mongodb.org/browse/SERVER-47999)balance_repl.js在尝试从辅助读取之前，应确保写入已复制

### 复制

- [服务器-38731](https://jira.mongodb.org/browse/SERVER-38731)能够在初始同步中指定同步源读取首选项
- [服务器-47190](https://jira.mongodb.org/browse/SERVER-47190)用力关机命令：true应该忽略所有降级错误
- [服务器-47613](https://jira.mongodb.org/browse/SERVER-47613)进程中的不变ReplSetRequestVotes
- [服务器-47622](https://jira.mongodb.org/browse/SERVER-47622)replSetReconfig.js在运行reconfig命令之前应该检查 ismaster
- [服务器-47695](https://jira.mongodb.org/browse/SERVER-47695)编写由可以幸存的线程运行的命令可能会失败操作ServiceEntryPoint中的Time不变
- [服务器-48046](https://jira.mongodb.org/browse/SERVER-48046){replSetFreeze: 0} 在 RollbackTest.restartNode() 中完成的 {replSetFreeze: 0} 应具有网络错误的弹性

### 查询

[服务器-46810](https://jira.mongodb.org/browse/SERVER-46810)当唯一索引包含排序时，损坏的E11000重复密钥错误

### 集合

- [服务器-46819](https://jira.mongodb.org/browse/SERVER-46819)允许在更改流分片直通中进行交易
- [服务器-47581](https://jira.mongodb.org/browse/SERVER-47581)mongoS没有在$mergeCursors管道上设置“useNewUpsert”[4.4，4.2]

### 储存

- [服务器-44577](https://jira.mongodb.org/browse/SERVER-44577)在读取数据之前，请确保WiredTiger光标已启动交易
- [服务器-46398](https://jira.mongodb.org/browse/SERVER-46398)在macOS上启动mongod时建议显式dbpath，但找不到默认的dbpath
- [服务器-46699](https://jira.mongodb.org/browse/SERVER-46699)在FTDC中报告oplog可见性时间戳
- [服务器-47462](https://jira.mongodb.org/browse/SERVER-47462)从mongoDB 4.2中删除“SetIndexCommitQuorum”命令支持

### 运营

- [服务器-45295](https://jira.mongodb.org/browse/SERVER-45295)确保LDAP日志始终包含AuthZN操作的上下文
- [服务器-47553](https://jira.mongodb.org/browse/SERVER-47553)mongos在刷新签名密钥时因客户端断开连接而崩溃

### 构建和包装

- [服务器-44072](https://jira.mongodb.org/browse/SERVER-44072)平台支持：添加企业RHEL 8 PPC
- [服务器-48094](https://jira.mongodb.org/browse/SERVER-48094)将RHEL 8.1添加到repo_config yaml

### 内部人员

- [服务器-42927](https://jira.mongodb.org/browse/SERVER-42927)在Windows上的hang_analyzer.py中增加符号加载的冗高性
- [服务器-43468](https://jira.mongodb.org/browse/SERVER-43468)SERVER-38690中列出的完整待办事项
- [服务器-45117](https://jira.mongodb.org/browse/SERVER-45117)Guard NetworkInterfaceTL::setAlarm()更激进
- [服务器-45624](https://jira.mongodb.org/browse/SERVER-45624)预拆分和分发大块的会话集合
- [服务器-46633](https://jira.mongodb.org/browse/SERVER-46633)Windows TLS实现可能会在无关的错误上声明主机名不匹配
- [服务器-46684](https://jira.mongodb.org/browse/SERVER-46684)将悬挂式分析仪重新打包为烟雾子命令
- [服务器-46769](https://jira.mongodb.org/browse/SERVER-46769)从optparse迁移到argparse
- [服务器-46841](https://jira.mongodb.org/browse/SERVER-46841)让定期运行器在停止时中断被阻止的操作
- [服务器-47056](https://jira.mongodb.org/browse/SERVER-47056)不要在初始同步中使用readOnce光标进行收集扫描
- [服务器-47063](https://jira.mongodb.org/browse/SERVER-47063)将静态OpenSSL升级到1.1.1e
- [服务器-47071](https://jira.mongodb.org/browse/SERVER-47071)CheckReplOplogs可能无法检测到不匹配
- [服务器-47264](https://jira.mongodb.org/browse/SERVER-47264)Backport DocumentSourceBucketAuto::optimize()函数到4.2
- [服务器-47351](https://jira.mongodb.org/browse/SERVER-47351)更好地将NetworkInterfaceTL关机与机上命令同步
- [服务器-47373](https://jira.mongodb.org/browse/SERVER-47373)改进空TLS数据包的处理
- [服务器-47429](https://jira.mongodb.org/browse/SERVER-47429)身份验证机制参数未验证
- [服务器-47475](https://jira.mongodb.org/browse/SERVER-47475)让定期工作意识到全球关闭时的取消
- [服务器-47507](https://jira.mongodb.org/browse/SERVER-47507)关闭时取消所有剩余的出口命令
- [服务器-47623](https://jira.mongodb.org/browse/SERVER-47623)修复v4.2上的use-diagnostic-latches=off
- [服务器-47633](https://jira.mongodb.org/browse/SERVER-47633)将uses_transactions标签添加到index_build_yield_prepare_conflicts.js
- [服务器-47634](https://jira.mongodb.org/browse/SERVER-47634)使stepup.js中的度量测试更健壮
- [服务器-47668](https://jira.mongodb.org/browse/SERVER-47668)在fet feature_compatibility_version_documentation.h 中将 FCV 文档链接更新为 4.2
- [服务器-47685](https://jira.mongodb.org/browse/SERVER-47685)从主分支中删除fetch_and_build_openssl.sh
- [服务器-47893](https://jira.mongodb.org/browse/SERVER-47893)添加测试，确认$graphLookup上方定义的变量可供使用
- [服务器-47919](https://jira.mongodb.org/browse/SERVER-47919)不要在find-suites中公开--suite选项；改用set_default
- [服务器-47940](https://jira.mongodb.org/browse/SERVER-47940)在resmoke.py之间添加空格，并在powertest中运行
- [服务器-48005](https://jira.mongodb.org/browse/SERVER-48005)减少Ubuntu 1804 ARM上的并行性
- [工具-2526](https://jira.mongodb.org/browse/TOOLS-2526)[v4.2] mongorestore在调用createIndexes之前可能会错误地验证索引名称长度
- [工具-2532](https://jira.mongodb.org/browse/TOOLS-2532)[v4.2] mongorestore挂在无效的存档上
- [WT-4954](https://jira.mongodb.org/browse/WT-4954)文档重复的备份光标
- [WT-5212](https://jira.mongodb.org/browse/WT-5212)备份数据验证测试
- [WT-5214](https://jira.mongodb.org/browse/WT-5214)验证潜在的增量故障
- [WT-5246](https://jira.mongodb.org/browse/WT-5246)更新WiredTiger备份文档
- [WT-5589](https://jira.mongodb.org/browse/WT-5589)force_stop在重复光标打开时不返回错误
- [WT-5624](https://jira.mongodb.org/browse/WT-5624)增量单位测试应使用偏移量/长度范围
- [WT-5695](https://jira.mongodb.org/browse/WT-5695)修复了在备份范围案例中使用O_CREAT的增量备份示例
- [WT-5697](https://jira.mongodb.org/browse/WT-5697)删除或重命名表在增量备份测试中返回EBUSY
- [WT-5699](https://jira.mongodb.org/browse/WT-5699)重构增量备份范围代码
- [WT-5719](https://jira.mongodb.org/browse/WT-5719)增量备份元数据应引用ID字符串
- [WT-5722](https://jira.mongodb.org/browse/WT-5722)增量备份应该对标识符进行姓名检查
- [WT-5834](https://jira.mongodb.org/browse/WT-5834)增量备份返回过大的偏移量
- [WT-5914](https://jira.mongodb.org/browse/WT-5914)仅当测试/格式的存档关闭时，才配置日志增量备份
- [WT-5989](https://jira.mongodb.org/browse/WT-5989)workgen中的支持参数
- [WT-5999](https://jira.mongodb.org/browse/WT-5999)更新格式，以便可以在现有数据库上重新启动



## 4.2.6 更改日志

### 安全

- [服务器-45803](https://jira.mongodb.org/browse/SERVER-45803)mongodecrypt需要一个ServiceContext
- [服务器-46834](https://jira.mongodb.org/browse/SERVER-46834)在UserCacheInvalidator中使用单调时间
- [服务器-47113](https://jira.mongodb.org/browse/SERVER-47113)LDAP连接池获取状态应该拥有主机列表

### 分片

- [服务器-29153](https://jira.mongodb.org/browse/SERVER-29153)在ShardingTest初始化中进行写入之前，请确保复制集节点同意哪个节点是主节点
- [服务器-32871](https://jira.mongodb.org/browse/SERVER-32871)删除碎片后，ReplicaSetMonitor在fanout查询中删除了ShardNotFound错误
- [服务器-41278](https://jira.mongodb.org/browse/SERVER-41278)FSM killSession助手不应终止由后台钩子运行的会话
- [服务器-41777](https://jira.mongodb.org/browse/SERVER-41777)分片集合后制作multi_mongos2.js await复制
- [服务器-42304](https://jira.mongodb.org/browse/SERVER-42304)在sharded_collections_causally_consistent_jscore_txns_passthrough中加载因果一致性覆盖
- [服务器-42827](https://jira.mongodb.org/browse/SERVER-42827)如果至少一个碎片返回OK，而其他碎片返回无法ImplicitlyCreateCollection，则允许会话集合返回OK以创建索引
- [服务器-42862](https://jira.mongodb.org/browse/SERVER-42862)防止mergeChunks命令中的碎片刷新加入早期刷新
- [服务器-43848](https://jira.mongodb.org/browse/SERVER-43848)在txn下查找/更新/删除没有碎片键谓词，快照读取可能会错过文档
- [服务器-44115](https://jira.mongodb.org/browse/SERVER-44115)从分片jscore测试中排除jstests/core/autocomplete.js
- [服务器-44463](https://jira.mongodb.org/browse/SERVER-44463)insertConfigDocumentsAsRetryableWrite()错误地计算BSON数组开销
- [服务器-45119](https://jira.mongodb.org/browse/SERVER-45119)CollectionShardingState::getCurrentShardVersionIfKnown返回集合版本而不是碎片版本
- [服务器-45389](https://jira.mongodb.org/browse/SERVER-45389)添加指标，跟踪碎片索引不一致的频率
- [服务器-45910](https://jira.mongodb.org/browse/SERVER-45910)路由器可能会在未分片集合的写入操作上瞄准错误的碎片
- [服务器-46084](https://jira.mongodb.org/browse/SERVER-46084)不要在聚合中使用$setUnion来查找不一致的分片索引
- [服务器-46307](https://jira.mongodb.org/browse/SERVER-46307)database_versioning_safe_secondary_reads.js不应在碎片次要上设置“投票：0”
- [服务器-46942](https://jira.mongodb.org/browse/SERVER-46942)如果服务器在network_interface_tl上关闭得太快，状态信息可能会泄露
- [服务器-47436](https://jira.mongodb.org/browse/SERVER-47436)让碎片在dataSize命令中验证shardKey

### 复制

- [服务器-33627](https://jira.mongodb.org/browse/SERVER-33627)初始同步器需要处理异常
- [服务器-35437](https://jira.mongodb.org/browse/SERVER-35437)在multi_rs.js中等待stepdown命令后的辅助状态
- [服务器-46517](https://jira.mongodb.org/browse/SERVER-46517)Stepdown将canAcceptWrites()的基础状态从RSTL X模式下更改
- [服务器-47109](https://jira.mongodb.org/browse/SERVER-47109)从两相索引构建中以replset1.js进行竞赛

### 查询

- [服务器-40805](https://jira.mongodb.org/browse/SERVER-40805)在日志文件中指出重新规划的原因
- [服务器-45147](https://jira.mongodb.org/browse/SERVER-45147)“幽灵”时间戳必须将事务设置为无序
- [服务器-46872](https://jira.mongodb.org/browse/SERVER-46872)yield_with_drop.js FSM工作负载应允许使用NoProgressMade失败

### 写入操作

[服务器-47233](https://jira.mongodb.org/browse/SERVER-47233)WriteOp可以处于挂起状态，导致错误的NoProgress来自mongos的写入错误

### 集合

[服务器-44689](https://jira.mongodb.org/browse/SERVER-44689)为用户请求中每次使用聚合阶段添加serverStatus计数器

### 储存

- [服务器-44507](https://jira.mongodb.org/browse/SERVER-44507)混合索引构建能够为包含已准备文档的集合提交（获取更强的模式锁）。（仅限4.2）
- [服务器-46468](https://jira.mongodb.org/browse/SERVER-46468)验证命令可能会生成过长的响应
- [服务器-46865](https://jira.mongodb.org/browse/SERVER-46865)collMod不应使用数据库MODE_X锁
- [服务器-47006](https://jira.mongodb.org/browse/SERVER-47006)在4.4到4.2之间实施降级楼层
- [服务器-47425](https://jira.mongodb.org/browse/SERVER-47425)当4.2在启动时发现日志版本4记录时，请继续编写日志版本4记录

### 运营

- [服务器-44892](https://jira.mongodb.org/browse/SERVER-44892)getShardDistribution应该使用$collStats agg阶段，而不是collStats命令
- [服务器-46024](https://jira.mongodb.org/browse/SERVER-46024)在FTDC中收集/proc/vmstat交换统计数据

### 构建和包装

- [服务器-43231](https://jira.mongodb.org/browse/SERVER-43231)添加对某些Ubuntu LTS版本发布mqlrun工件的支持
- [服务器-46996](https://jira.mongodb.org/browse/SERVER-46996)所有push/publish_packages任务都应该在小型主机上运行

### 内部人员

- [服务器-15902](https://jira.mongodb.org/browse/SERVER-15902)通过sigaltstack使用信号处理堆栈来改善堆栈溢出的行为
- [服务器-38119](https://jira.mongodb.org/browse/SERVER-38119)Windows转储文件命名不考虑目录名称中的点
- [服务器-39241](https://jira.mongodb.org/browse/SERVER-39241)如果没有提供预测，计划评分错误地将noFetchBonus奖金应用于所有计划
- [服务器-41160](https://jira.mongodb.org/browse/SERVER-41160)为CatalogCacheLoader添加关机方法
- [服务器-42278](https://jira.mongodb.org/browse/SERVER-42278)在LDAP连接建立期间生产的具有手动派生尺寸的Log SockAddrs
- [服务器-42455](https://jira.mongodb.org/browse/SERVER-42455)ReplicaSetChangeNotifier::onConfirmedSet在关机期间不安全
- [服务器-42525](https://jira.mongodb.org/browse/SERVER-42525)单节点复制集不应在关闭期间等待可选择的赶上继发
- [服务器-43011](https://jira.mongodb.org/browse/SERVER-43011)添加可选的命名空间限制以失败命令故障点
- [服务器-43732](https://jira.mongodb.org/browse/SERVER-43732)burn_in_tests没有检测到核心的变化
- [服务器-43889](https://jira.mongodb.org/browse/SERVER-43889)区分可重试写入和命令失败时的事务
- [服务器-45143](https://jira.mongodb.org/browse/SERVER-45143)缺少预期字段“protocolVersion”，但该字段具有默认值
- [服务器-45334](https://jira.mongodb.org/browse/SERVER-45334)MSI安装程序中未遵守服务名称
- [服务器-45508](https://jira.mongodb.org/browse/SERVER-45508)具有下降点范围的 getFieldsWithStringBounds中的不变故障
- [服务器-45525](https://jira.mongodb.org/browse/SERVER-45525)ReplBatcher应在kNoTimestamp上显式读取
- [服务器-45835](https://jira.mongodb.org/browse/SERVER-45835)将优化的Linkbench作为新任务添加到Sys-perf
- [服务器-45881](https://jira.mongodb.org/browse/SERVER-45881)调查并实现多文档交易所需的流量控制节流
- [服务器-46135](https://jira.mongodb.org/browse/SERVER-46135)创建 selected_tests 别名
- [服务器-46362](https://jira.mongodb.org/browse/SERVER-46362)让set_step_params测试容忍零星连接
- [服务器-46410](https://jira.mongodb.org/browse/SERVER-46410)验证应该检查唯一索引中的重复密钥
- [服务器-46439](https://jira.mongodb.org/browse/SERVER-46439)添加burn_in_tags的验收测试
- [服务器-46501](https://jira.mongodb.org/browse/SERVER-46501)将/proc/self/mountinfo添加到hostInfo响应中
- [服务器-46851](https://jira.mongodb.org/browse/SERVER-46851)减少逻辑会话缓存测试中的作业数量
- [服务器-46861](https://jira.mongodb.org/browse/SERVER-46861)更新perf.yml以使用更新的genny调用
- [服务器-46980](https://jira.mongodb.org/browse/SERVER-46980)在v4.2中向Enterprise RHEL 7.0构建器添加多版本*扩展
- [服务器-47080](https://jira.mongodb.org/browse/SERVER-47080)为LDAP测试启用详细日志记录
- [服务器-47114](https://jira.mongodb.org/browse/SERVER-47114)让ldapproxy.py在Windows上使用IOCP
- [服务器-47174](https://jira.mongodb.org/browse/SERVER-47174)mozjs第三方代码文件夹被git忽略
- [服务器-47193](https://jira.mongodb.org/browse/SERVER-47193)createIndexes命令在4.2台服务器上接受“commitQuorum”选项
- [服务器-47384](https://jira.mongodb.org/browse/SERVER-47384)删除SERVER-41070的TODO注释
- [服务器-47407](https://jira.mongodb.org/browse/SERVER-47407)在索引构建集合扫描循环中避免WriteUnitOfWork
- [WT-5669](https://jira.mongodb.org/browse/WT-5669)准备具有持久历史的支持：后端口数据格式更改为4.2
- [WT-5866](https://jira.mongodb.org/browse/WT-5866)降级到4.2时删除历史存储文件
- [WT-5892](https://jira.mongodb.org/browse/WT-5892)颠簸日志/WT版本，以促进MongoDB 4.2的降级地板
- [WT-5934](https://jira.mongodb.org/browse/WT-5934)停止验证4.2中从磁盘读取的时间戳
- [WT-5966](https://jira.mongodb.org/browse/WT-5966)4.4 如果忽略单元格，降级可能会导致4.2个核心转储



## 4.2.5 更改日志

### 分片

[服务器-45770](https://jira.mongodb.org/browse/SERVER-45770)添加到日志文件中包含的关于“moveChunk.to”的信息

### 储存

[服务器-46858](https://jira.mongodb.org/browse/SERVER-46858)[4.2]如果可查询的备份缺少“recoverToOplogTimestamp”标志，则以只读模式启动WT

### 构建和包装

[服务器-46983](https://jira.mongodb.org/browse/SERVER-46983)上传回购构建包以更正URL

### 内部人员

- [服务器-45043](https://jira.mongodb.org/browse/SERVER-45043)修复Ubuntu上的SSL测试失败
- [服务器-45156](https://jira.mongodb.org/browse/SERVER-45156)SockAddr构造函数应该使用sockaddr，而不是sockaddr_storage
- [服务器-46126](https://jira.mongodb.org/browse/SERVER-46126)ldap_insuffcient_access_rights.js中的LDAP代理和mongod启动竞赛
- [服务器-46630](https://jira.mongodb.org/browse/SERVER-46630)RemoveSaver将GCM标签写入错误的文件位置
- [服务器-46746](https://jira.mongodb.org/browse/SERVER-46746)将sysbench大规模工作负载添加到sys-perf中，以进行持久的历史测试
- [服务器-46754](https://jira.mongodb.org/browse/SERVER-46754)使用新的repobuilder服务
- [服务器-46766](https://jira.mongodb.org/browse/SERVER-46766)每次运行后都会撕毁集群



## 4.2.4 更改日志

### 分片

- [服务器-42617](https://jira.mongodb.org/browse/SERVER-42617)克隆中的竞赛文档CatchesInsert错误可能会导致它返回意外错误
- [服务器-44103](https://jira.mongodb.org/browse/SERVER-44103)clear_jumbo.js应该等待平衡器进入模式：满一轮以上
- [服务器-44130](https://jira.mongodb.org/browse/SERVER-44130)逻辑_time_metadata.js中assert.lte参数的翻转顺序
- [服务器-44839](https://jira.mongodb.org/browse/SERVER-44839)mongos ftdc指标中的频繁模式更改限制了保留期
- [服务器-44915](https://jira.mongodb.org/browse/SERVER-44915)扩展$indexStats输出，以包含完整的索引选项和碎片名称
- [服务器-45273](https://jira.mongodb.org/browse/SERVER-45273)删除 allow_partial_results.js 和 return_partial_shards_down.js 中的 mongos 版本检查
- [服务器-46001](https://jira.mongodb.org/browse/SERVER-46001)将checkShardingIndex移到主碎片上的shardCollection的读取关键部分之外
- [服务器-46121](https://jira.mongodb.org/browse/SERVER-46121)更改任务ExecutorPoolSize后，mongos崩溃，出现不变错误

### 复制

- [服务器-34768](https://jira.mongodb.org/browse/SERVER-34768)如果对赶上进度的滞后节点运行，回滚可能会失败
- [服务器-35050](https://jira.mongodb.org/browse/SERVER-35050)不要因为文档计数负而中止集合克隆
- [服务器-38028](https://jira.mongodb.org/browse/SERVER-38028)在会话上准备交易的参与者应阻止会话中更高txn号码的请求，而不是失败新请求
- [服务器-39112](https://jira.mongodb.org/browse/SERVER-39112)主排水模式可能会不必要地缓慢
- [服务器-43867](https://jira.mongodb.org/browse/SERVER-43867)通过在测试中重新获取来解决回滚的不可恢复性
- [服务器-44260](https://jira.mongodb.org/browse/SERVER-44260)如果所有已提交点被保留，事务可能会与会话中的之前事务发生冲突
- [服务器-45010](https://jira.mongodb.org/browse/SERVER-45010)回滚后清理关机ViaRefetch with eMRC=false可能会导致我们错误地覆盖不稳定的检查点
- [服务器-45178](https://jira.mongodb.org/browse/SERVER-45178)通过回滚回滚可能会导致回滚成功发生，而没有更新回滚ID。
- [服务器-45421](https://jira.mongodb.org/browse/SERVER-45421)修复 transactions_block_ddl.js 对作为设置阶段的一部分运行的命令使用写入关注“多数”。
- [服务器-45492](https://jira.mongodb.org/browse/SERVER-45492)将rollback_dup_ids.js标记为'requires_persistence'和'requires_journaling'
- [服务器-45493](https://jira.mongodb.org/browse/SERVER-45493)在e election_candidate_and_participant_metrics.js 中暂时禁用失败断言
- [服务器-45612](https://jira.mongodb.org/browse/SERVER-45612)在4.2 concurrency_simultaneous_replication套件中删除mapReduce +准备测试
- [服务器-45839](https://jira.mongodb.org/browse/SERVER-45839)如果给定范围之间没有oplog条目可以应用，re recoverFromOplogUpTo不应不变
- [服务器-45840](https://jira.mongodb.org/browse/SERVER-45840)从 replica_sets_kill_secondaries_jscore_passthrough运行空洞的黑名单测试
- [服务器-45842](https://jira.mongodb.org/browse/SERVER-45842)删除检查上次应用的操作日志条目是否与re recoverFromOplogUpTo中请求的恢复时间戳具有相同时间戳的断言
- [服务器-45906](https://jira.mongodb.org/browse/SERVER-45906)启用MajorityReadConcern=false时未正确触发初始稳定检查点
- [服务器-46050](https://jira.mongodb.org/browse/SERVER-46050)使用 getLastAppliedOpTime 而不是 getHeartbeatAppliedOpTime 来检查小学的位置
- [服务器-46188](https://jira.mongodb.org/browse/SERVER-46188)由于maxTimeMS不兼容，从分片交易直通套件中列出write_conflicts_with_non_txns.js
- [服务器-46218](https://jira.mongodb.org/browse/SERVER-46218)在仲裁器中删除和关闭之间的竞争

### 查询

- [服务器-32903](https://jira.mongodb.org/browse/SERVER-32903)在初始同步期间，应忽略模棱两可的字段名称错误
- [服务器-45279](https://jira.mongodb.org/browse/SERVER-45279)粒度圆形圆形无穷大时可能会卡在循环中
- [服务器-45363](https://jira.mongodb.org/browse/SERVER-45363)使用通配符时mongodb文本索引和权重问题
- [服务器-45927](https://jira.mongodb.org/browse/SERVER-45927)Atlas FTS的别名

### 写入操作

[服务器-45611](https://jira.mongodb.org/browse/SERVER-45611)懒惰地强制执行持久收集验证器已形成良好

### 集合

- [服务器-40603](https://jira.mongodb.org/browse/SERVER-40603)对新的mongohouse DocumentSources进行更彻底的审查/审计
- [服务器-44942](https://jira.mongodb.org/browse/SERVER-44942)如果在从源集合中复制索引之前删除临时集合，$out将点击不变
- [服务器-45418](https://jira.mongodb.org/browse/SERVER-45418)DocumentSourceCursor批处理内存会计不考虑空文档，导致无界内存用于类似计数的聚合

### 目录

[服务器-45137](https://jira.mongodb.org/browse/SERVER-45137)在Top::Record中增加内存分配，收集率高，创建和下降

### 储存

- [服务器-41968](https://jira.mongodb.org/browse/SERVER-41968)启用IndexBuildsCoordinator时，IndexBuildTest.getIndexBuildOpId（）选择性不够强
- [服务器-42830](https://jira.mongodb.org/browse/SERVER-42830)应用重命名操作可能会导致多个WT事务
- [服务器-43794](https://jira.mongodb.org/browse/SERVER-43794)更改MongoDB备份光标API以包含偏移量/长度范围
- [服务器-44370](https://jira.mongodb.org/browse/SERVER-44370)让openBackupCursor接受增量备份请求的输入
- [服务器-44406](https://jira.mongodb.org/browse/SERVER-44406)添加$backupCursor API以强制禁用增量备份
- [服务器-44407](https://jira.mongodb.org/browse/SERVER-44407)将增量备份光标管与WT输出连接。
- [服务器-44410](https://jira.mongodb.org/browse/SERVER-44410)更改备份光标结果以包含文件大小
- [服务器-44426](https://jira.mongodb.org/browse/SERVER-44426)将可查询的备份模式转发FS写入到后端API
- [服务器-44433](https://jira.mongodb.org/browse/SERVER-44433)具有可查询的备份模式向前打开文件/创建对后端API的调用
- [服务器-44438](https://jira.mongodb.org/browse/SERVER-44438)让可查询的BackupMode在读/写模式下打开WT
- [服务器-44442](https://jira.mongodb.org/browse/SERVER-44442)允许可查询的BackupMode执行复制恢复
- [服务器-45006](https://jira.mongodb.org/browse/SERVER-45006)LockerImpl::wasGlobalLockTaken()总是返回true
- [服务器-45007](https://jira.mongodb.org/browse/SERVER-45007)GlobalLock构造函数中的PBWM收购忽略了截止日期
- [服务器-45288](https://jira.mongodb.org/browse/SERVER-45288)切换幂等测试，使用WiredTiger而不是ephemeralForTest
- [服务器-45289](https://jira.mongodb.org/browse/SERVER-45289)条件跳转或移动取决于validate_adaptor.cpp中的未初始化值
- [服务器-45374](https://jira.mongodb.org/browse/SERVER-45374)作为启动恢复/修复的一部分而重建的唯一索引是将数据格式版本用作6或8，而不是11或12。
- [服务器-45481](https://jira.mongodb.org/browse/SERVER-45481)更改备份API以返回要复制的块以进行增量备份
- [服务器-45581](https://jira.mongodb.org/browse/SERVER-45581)更改增量备份API，以允许指定块大小粒度
- [服务器-45660](https://jira.mongodb.org/browse/SERVER-45660)从可查询的备份中删除blockSize
- [服务器-45663](https://jira.mongodb.org/browse/SERVER-45663)为可查询的BackupMode实现文件重命名，并修复文件大小跟踪
- [服务器-45821](https://jira.mongodb.org/browse/SERVER-45821)重新启用禁用的增量备份光标测试并添加其他测试
- [服务器-46010](https://jira.mongodb.org/browse/SERVER-46010)在备份源上的复制回滚中，增量备份应保持可行
- [服务器-46366](https://jira.mongodb.org/browse/SERVER-46366)将备份光标用户参数附加到元数据文档中
- [服务器-46375](https://jira.mongodb.org/browse/SERVER-46375)包括文件的偏移量、长度对，作为增量第一次完整备份的一部分
- [服务器-46488](https://jira.mongodb.org/browse/SERVER-46488)可查询BackupMode应使用恢复时间戳从启动时的日志文件中恢复
- [服务器-46565](https://jira.mongodb.org/browse/SERVER-46565)扩展ESE备份测试以使用$extendBackupCursor

### 运营

[服务器-45662](https://jira.mongodb.org/browse/SERVER-45662)流量控制电流操作时间获取微量统计不再更新

### 构建和包装

- [服务器-45713](https://jira.mongodb.org/browse/SERVER-45713)在大型rhel70发行版上运行rhel7推送和发布任务
- [服务器-45732](https://jira.mongodb.org/browse/SERVER-45732)更积极地过滤net-snmp-config调用中的标志
- [服务器-45879](https://jira.mongodb.org/browse/SERVER-45879)没有为s390x Ubuntu 18.04生产4.2.3的构建
- [服务器-45922](https://jira.mongodb.org/browse/SERVER-45922)在overflow_arithmetic.h中构建失败：constexpr函数永远不会产生常量表达式

### 工具

[工具-2430](https://jira.mongodb.org/browse/TOOLS-2430)mongorestore：在虚线索引键中，将“散列”替换为“1”

### 内部人员

- [服务器-37148](https://jira.mongodb.org/browse/SERVER-37148)删除mr_shard_version.js和mr_during_migrate.js，转而使用MR FSM测试
- [服务器-41872](https://jira.mongodb.org/browse/SERVER-41872)PlanEnumerator And Assignment::选择订单不稳定，与生成的一组计划相关
- [服务器-42930](https://jira.mongodb.org/browse/SERVER-42930)ConnectionPool控制器更新必须跨主机批量进行
- [服务器-43308](https://jira.mongodb.org/browse/SERVER-43308)mqlrun中的不变故障：doc.value().isOwned()
- [服务器-43339](https://jira.mongodb.org/browse/SERVER-43339)获得GlobalLock::GlobalLock()一部分的PBWM锁应该是可以中断的。否则，它不会尊重MaxTimeMS。
- [服务器-43470](https://jira.mongodb.org/browse/SERVER-43470)SERVER-35156中列出的完整待办事项
- [服务器-43726](https://jira.mongodb.org/browse/SERVER-43726)让ssl_alert_reporting.js容忍RHEL8上的LEGACY加密策略
- [服务器-43763](https://jira.mongodb.org/browse/SERVER-43763)弄清楚当libldap使用OpenSSL构建时，是否可以禁用全局LDAP同步。
- [服务器-43971](https://jira.mongodb.org/browse/SERVER-43971)如果文件中指定了管道，MQLRUN会崩溃
- [服务器-44325](https://jira.mongodb.org/browse/SERVER-44325)添加polyfill进行证书链验证
- [服务器-44435](https://jira.mongodb.org/browse/SERVER-44435)允许根据CA选择性地启用x509授权
- [服务器-44620](https://jira.mongodb.org/browse/SERVER-44620)修复Debian 10上的sslProviderSupports助手
- [服务器-44853](https://jira.mongodb.org/browse/SERVER-44853)当未选择安装mongod时，MSI应跳过安装MongoD服务对话框
- [服务器-44904](https://jira.mongodb.org/browse/SERVER-44904)在重建未完成的索引时，启动恢复不应删除损坏的文档
- [服务器-45261](https://jira.mongodb.org/browse/SERVER-45261)在NiTL ctor中创建更多状态
- [服务器-45486](https://jira.mongodb.org/browse/SERVER-45486)在'hashed_index_bad_keys_cleanup.js'中为调试索引键计数不匹配问题添加信息
- [服务器-45544](https://jira.mongodb.org/browse/SERVER-45544)某些测试的burn_in_tests可以超时，无论发生了什么变化
- [服务器-45546](https://jira.mongodb.org/browse/SERVER-45546)不要为被动成员创建HostPools
- [服务器-45644](https://jira.mongodb.org/browse/SERVER-45644)重新评估burn_in_test使用的超时
- [服务器-45726](https://jira.mongodb.org/browse/SERVER-45726)使用TaskExecutorCursor允许空的第一个批处理
- [服务器-45748](https://jira.mongodb.org/browse/SERVER-45748)burn_in_tags_bypass_compile没有查看正确的任务
- [服务器-45764](https://jira.mongodb.org/browse/SERVER-45764)生成重烟任务在设置超时时需要考虑设置时间
- [服务器-45766](https://jira.mongodb.org/browse/SERVER-45766)从服务器yaml中删除“要求”
- [服务器-45825](https://jira.mongodb.org/browse/SERVER-45825)为ephemeralForTest存储引擎禁用tool_replset
- [服务器-45867](https://jira.mongodb.org/browse/SERVER-45867)使用最新版本的信号处理
- [服务器-46003](https://jira.mongodb.org/browse/SERVER-46003)在内部发送“搜索”从mongod到mongot，而不是“searchBeta”
- [服务器-46082](https://jira.mongodb.org/browse/SERVER-46082)将bin/analysis.py用于性能项目
- [服务器-46174](https://jira.mongodb.org/browse/SERVER-46174)SSL_get0_verified_chain polyfill中的免费对等证书
- [服务器-46197](https://jira.mongodb.org/browse/SERVER-46197)制作构建标志以禁用诊断闩锁
- [工具-2461](https://jira.mongodb.org/browse/TOOLS-2461)Backport mongorestore散列索引修复为4.2
- [WT-4886](https://jira.mongodb.org/browse/WT-4886)避免依赖test_bug018的特定错误消息文本
- [WT-4968](https://jira.mongodb.org/browse/WT-4968)删除所有提交的时间戳
- [WT-4999](https://jira.mongodb.org/browse/WT-4999)将Jenkins的“wiredtiger-test-format-stress-zseries”工作迁移到Evergreen
- [WT-5003](https://jira.mongodb.org/browse/WT-5003)将Jenkins的“wiredtiger-test-race-condition-stress-sanitizer”工作迁移到Evergreen
- [WT-5024](https://jira.mongodb.org/browse/WT-5024)将Jenkins的“wiredtiger兼容性”工作迁移到Evergreen
- [WT-5041](https://jira.mongodb.org/browse/WT-5041)在test_calc_modify.py中正确分发修改
- [WT-5081](https://jira.mongodb.org/browse/WT-5081)在Python测试套件中添加对ASan构建的支持
- [WT-5119](https://jira.mongodb.org/browse/WT-5119)如果用检查站读取种族，出生标记记录可以作为正常更新读取
- [WT-5159](https://jira.mongodb.org/browse/WT-5159)使有线虎在SWIG 4.0.0之后工作
- [WT-5165](https://jira.mongodb.org/browse/WT-5165)添加光标复制调试模式
- [WT-5192](https://jira.mongodb.org/browse/WT-5192)不要让检查站在没有快照的情况下驱逐
- [WT-5199](https://jira.mongodb.org/browse/WT-5199)将正确性任务添加到rel80 Evergreen构建变体中
- [WT-5206](https://jira.mongodb.org/browse/WT-5206)返回正确的检查点修改后的冻结列表
- [WT-5235](https://jira.mongodb.org/browse/WT-5235)制作一个工作负载来显示旁觀的争论
- [WT-5255](https://jira.mongodb.org/browse/WT-5255)如果直接I/O配置为测试/格式，请关闭外部程序
- [WT-5261](https://jira.mongodb.org/browse/WT-5261)覆盖率报告任务在Evergreen中超时
- [WT-5334](https://jira.mongodb.org/browse/WT-5334)添加静态wt构建的测试覆盖范围
- [WT-5366](https://jira.mongodb.org/browse/WT-5366)重新提交和读取未提交的交易可能会阻止驱逐
- [WT-5371](https://jira.mongodb.org/browse/WT-5371)修复test_stat08.py断言失败
- [WT-5372](https://jira.mongodb.org/browse/WT-5372)跳过长期运行格式的应力消毒器任务的已知错误
- [WT-5376](https://jira.mongodb.org/browse/WT-5376)WT_UPDATE.type字段可以在返回键/值对时进行可见性检查
- [WT-5377](https://jira.mongodb.org/browse/WT-5377)格式测试程序中的可变长度列存储插入锁定可能会阻止驱逐
- [WT-5379](https://jira.mongodb.org/browse/WT-5379)缺少varargs清理
- [WT-5380](https://jira.mongodb.org/browse/WT-5380)统计清晰没有清除适当的旁白光标统计信息
- [WT-5383](https://jira.mongodb.org/browse/WT-5383)更新WiredTiger源代码，以包含2020年版权声明
- [WT-5387](https://jira.mongodb.org/browse/WT-5387)准备好的交易解决方案可能会阻止活动页面上的驱逐
- [WT-5393](https://jira.mongodb.org/browse/WT-5393)准备的事务回滚和API错误处理修复
- [WT-5395](https://jira.mongodb.org/browse/WT-5395)当有很多争议时，修复读取锁实现中的错误
- [WT-5398](https://jira.mongodb.org/browse/WT-5398)在rel80 Evergreen构建变体中添加更多正确性任务
- [WT-5405](https://jira.mongodb.org/browse/WT-5405)将LSM格式测试单独作为Evergreen任务
- [WT-5410](https://jira.mongodb.org/browse/WT-5410)WiredTiger格式的时间戳字符串缓冲区大小太小
- [WT-5437](https://jira.mongodb.org/browse/WT-5437)打捞过度消耗缓存内存导致驱逐停滞不前
- [WT-5440](https://jira.mongodb.org/browse/WT-5440)__wt_txn_clear_read_timestamp()有一个不必要的序列化点
- [WT-5442](https://jira.mongodb.org/browse/WT-5442)修复test_shared_cache01.py中的失败
- [WT-5443](https://jira.mongodb.org/browse/WT-5443)在Evergreen中禁用PPC格式测试
- [WT-5444](https://jira.mongodb.org/browse/WT-5444)在Evergreen中重新启用PPC格式测试
- [WT-5445](https://jira.mongodb.org/browse/WT-5445)在format.sh中处理相对的“主页”目录
- [WT-5449](https://jira.mongodb.org/browse/WT-5449)增加历史商店压力工作量的争议
- [WT-5450](https://jira.mongodb.org/browse/WT-5450)支持测试/格式长期运行操作的超时设置
- [WT-5458](https://jira.mongodb.org/browse/WT-5458)修复linux-directio测试中的常青超时失败
- [WT-5460](https://jira.mongodb.org/browse/WT-5460)linux-directio测试捕获的缓冲区对齐失败
- [WT-5468](https://jira.mongodb.org/browse/WT-5468)改进了“wt load”的文档
- [WT-5480](https://jira.mongodb.org/browse/WT-5480)不要使用线程解决准备好的交易来帮助驱逐
- [WT-5488](https://jira.mongodb.org/browse/WT-5488)转储失败的CONFIG用于常青测试/格式任务
- [WT-5521](https://jira.mongodb.org/browse/WT-5521)缓存在格式初始加载过程中卡住，配置为库检查点
- [WT-5534](https://jira.mongodb.org/browse/WT-5534)增量备份需要接受旧的元数据
- [WT-5536](https://jira.mongodb.org/browse/WT-5536)添加zstd作为WiredTiger Python软件包的内置压缩机
- [WT-5537](https://jira.mongodb.org/browse/WT-5537)每个内存消毒器使用正确的WT_ITEM字段
- [WT-5538](https://jira.mongodb.org/browse/WT-5538)更改格式以忽略配置文件中的常青时间戳
- [WT-5553](https://jira.mongodb.org/browse/WT-5553)如果主光标不是增量源，则返回错误
- [WT-5554](https://jira.mongodb.org/browse/WT-5554)在增量备份中检索文件大小时的日志路径帐户
- [WT-5564](https://jira.mongodb.org/browse/WT-5564)当增量位字符串增长时，缓冲区没有正确扩展
- [WT-5584](https://jira.mongodb.org/browse/WT-5584)更改格式以忽略配置文件中的常青时间戳
- [WT-5587](https://jira.mongodb.org/browse/WT-5587)限制后续检查站删除的检查点数量



## 4.2.3 更改日志

### 安全

- [服务器-44922](https://jira.mongodb.org/browse/SERVER-44922)用户获取不应增加缓存生成
- [服务器-45309](https://jira.mongodb.org/browse/SERVER-45309)确保绑定凭据比LDAP操作寿命更长

### 分片

- [服务器-33597](https://jira.mongodb.org/browse/SERVER-33597)使 allow_partial_results.js, return_partial_shards_down.js 将碎片作为复制集启动
- [服务器-40435](https://jira.mongodb.org/browse/SERVER-40435)清除巨型旗帜的clearJumboChunk命令
- [服务器-42914](https://jira.mongodb.org/browse/SERVER-42914)为平衡器实现随机块选择策略，用于并发_*_with_balancer工作负载
- [服务器-43195](https://jira.mongodb.org/browse/SERVER-43195)向ChunkManager ShardKeyNotFound故障添加命名空间，以便更好地诊断故障。
- [服务器-43960](https://jira.mongodb.org/browse/SERVER-43960)sharding_balance4.js应该等待更新之间的持续分块
- [服务器-44341](https://jira.mongodb.org/browse/SERVER-44341)在收集碎片时预先拆分时，不要只选择与区域关联的所有碎片中的第一个碎片
- [服务器-44598](https://jira.mongodb.org/browse/SERVER-44598)碎片不会将忽略版本视为“预期碎片”
- [服务器-45100](https://jira.mongodb.org/browse/SERVER-45100)使BatchWriteExecutor仅针对不成功的碎片重试多写
- [服务器-45272](https://jira.mongodb.org/browse/SERVER-45272)删除 allow_partial_results.js 和 return_partial_shards_down.js 中关于最后稳定行为的断言

### 复制

- [服务器-35407](https://jira.mongodb.org/browse/SERVER-35407)复制协调员外部状态和数据复制不得在关机后启动
- [服务器-37390](https://jira.mongodb.org/browse/SERVER-37390)如果RollbackTestFixture没有关闭当前的主服务器，则不需要等待新的主主服务器
- [服务器-42825](https://jira.mongodb.org/browse/SERVER-42825)作为状态过渡的一部分（上步/下）停止杀死用户操作后，记录指标.repl.stepDown计数器。
- [服务器-43875](https://jira.mongodb.org/browse/SERVER-43875)由于缺少正在运行事务的操作日志条目，初始同步可能会崩溃
- [服务器-43978](https://jira.mongodb.org/browse/SERVER-43978)流产oplog孔后，稳定的时间戳不会重新计算
- [服务器-44061](https://jira.mongodb.org/browse/SERVER-44061)在设置复制维护模式时进行竞赛。
- [服务器-44503](https://jira.mongodb.org/browse/SERVER-44503)在replsets/auth2.js中比赛
- [服务器-45155](https://jira.mongodb.org/browse/SERVER-45155)在测试的db目录中写入回滚文件转储的临时文件
- [服务器-45270](https://jira.mongodb.org/browse/SERVER-45270)增加对慢速DNS的脆弱性
- [服务器-45350](https://jira.mongodb.org/browse/SERVER-45350)在standalone_replication_recovery_idempotent.js中使用awaitMajorityCommitted
- [服务器-45396](https://jira.mongodb.org/browse/SERVER-45396)使用splithorizon时修复了是Master响应中的“我”字段

### 查询

- [服务器-32567](https://jira.mongodb.org/browse/SERVER-32567)将queryoptimizer3.js替换为FSM测试
- [服务器-41263](https://jira.mongodb.org/browse/SERVER-41263)不允许将空字符串作为索引键类型
- [服务器-42565](https://jira.mongodb.org/browse/SERVER-42565)聚合和查找命令对缺失字段进行不同排序
- [服务器-44977](https://jira.mongodb.org/browse/SERVER-44977)允许使用updateLookup的更改流直接在分片集群中的碎片mongoD上运行
- [服务器-44984](https://jira.mongodb.org/browse/SERVER-44984)减少索引线程池大小，并减少每次构建使用的内存
- [服务器-45152](https://jira.mongodb.org/browse/SERVER-45152)数组上不等式的否定可能会绊倒不变

### 集合

- [服务器-43764](https://jira.mongodb.org/browse/SERVER-43764)在DoubleSummation中添加更多特殊值测试
- [服务器-44174](https://jira.mongodb.org/browse/SERVER-44174)$push和$addToSet应该限制内存使用
- [服务器-44733](https://jira.mongodb.org/browse/SERVER-44733)在无法自动恢复更改流的情况下，显式返回流致命错误
- [服务器-44869](https://jira.mongodb.org/browse/SERVER-44869)添加查询旋钮以控制$push和$addToSet的内存限制
- [服务器-45177](https://jira.mongodb.org/browse/SERVER-45177)mapReduce的查询中不等于（$ne）会导致分割错误

### 储存

- [服务器-28977](https://jira.mongodb.org/browse/SERVER-28977)覆盖分析缺陷101508：数据竞争状况
- [服务器-42183](https://jira.mongodb.org/browse/SERVER-42183)转储目录时检查是否有重复的命名空间
- [服务器-43018](https://jira.mongodb.org/browse/SERVER-43018)正式签订安全访问目录的合同
- [服务器-43910](https://jira.mongodb.org/browse/SERVER-43910)在LockManager::dump()输出中包含客户端/OpCtx信息
- [服务器-44619](https://jira.mongodb.org/browse/SERVER-44619)BtreeKeyGenerator::_extractNextElement() uassert消息添加到命令结果时超过16mb BSON文档限制
- [服务器-44796](https://jira.mongodb.org/browse/SERVER-44796)调整非日记启动警告，使它更具吸引力

#### 有线老虎

- [服务器-44991](https://jira.mongodb.org/browse/SERVER-44991)带有公共前缀的键的索引中的性能回归

### 运营

- [服务器-44044](https://jira.mongodb.org/browse/SERVER-44044)从KeyVault.createDataKey()中删除未使用的第二个参数
- [服务器-45290](https://jira.mongodb.org/browse/SERVER-45290)从v4.2的第三方库清单中删除上游元数据

### 构建和包装

- [服务器-44546](https://jira.mongodb.org/browse/SERVER-44546)删除特定于移动的构建和代码工件
- [服务器-44550](https://jira.mongodb.org/browse/SERVER-44550)删除特定于移动的嵌入式命令
- [服务器-44557](https://jira.mongodb.org/browse/SERVER-44557)为SCons MSVC_VERSION标志设置显式默认值
- [服务器-45346](https://jira.mongodb.org/browse/SERVER-45346)Ubuntu 18.04软件包测试任务无法安装openssl

### 工具

- [工具-1952](https://jira.mongodb.org/browse/TOOLS-1952)在WiredTiger节点上运行时，默认使用--forceTableScan
- [工具-2422](https://jira.mongodb.org/browse/TOOLS-2422)mongorestore不会删除admin.tempusers
- [工具-2423](https://jira.mongodb.org/browse/TOOLS-2423)如果admin.tempusers存在于转储中，mongorestore不会删除它
- [工具-2425](https://jira.mongodb.org/browse/TOOLS-2425)Backport“在重播上次操作时挂起的TOOLS-2403 mongorestore在存档模式下失败”
- [工具-2436](https://jira.mongodb.org/browse/TOOLS-2436)后港工具-2422和工具-2423
- [工具-2451](https://jira.mongodb.org/browse/TOOLS-2451)Backport TOOLS-1952至4.2
- [工具-2453](https://jira.mongodb.org/browse/TOOLS-2453)索引键未正确转义
- [工具-2454](https://jira.mongodb.org/browse/TOOLS-2454)后港工具-2453

### 内部人员

- [服务器-34844](https://jira.mongodb.org/browse/SERVER-34844)在apply_batches_totalMillis中放松期望
- [服务器-42573](https://jira.mongodb.org/browse/SERVER-42573)仅警告readConcern在主-中级仲裁器配置中启用的多数
- [服务器-42631](https://jira.mongodb.org/browse/SERVER-42631)从stepdown套件中使用Mongo.logout()的黑名单测试
- [服务器-42697](https://jira.mongodb.org/browse/SERVER-42697)通过setParameter暴露tcmalloc_release_rate
- [服务器-43210](https://jira.mongodb.org/browse/SERVER-43210)jstests/sharding/kill_sessions.js不会等待操作被杀死。
- [服务器-43246](https://jira.mongodb.org/browse/SERVER-43246)添加一个日志行，用于由于逻辑会话清理而获取光标的时间
- [服务器-43310](https://jira.mongodb.org/browse/SERVER-43310)如果设置了`rs.slaveOk()`，mongos试图连接到辅助设备以创建索引。
- [服务器-43324](https://jira.mongodb.org/browse/SERVER-43324)为更干净的功能API添加BasicLockableAdaptor
- [服务器-43349](https://jira.mongodb.org/browse/SERVER-43349)$elemMatch $not $ne的序列化不正确
- [服务器-43623](https://jira.mongodb.org/browse/SERVER-43623)停止在NetworkInterfaceASIO中捕获异常
- [服务器-44430](https://jira.mongodb.org/browse/SERVER-44430)从 BF-14793 修复 tls_enumerators.py
- [服务器-44464](https://jira.mongodb.org/browse/SERVER-44464)将新的“一键”genny工作负载任务添加到system_perf.yml
- [服务器-44477](https://jira.mongodb.org/browse/SERVER-44477)如果主碎片上没有文档，则使用模式“合并”映射减少到现有的分片集合可能会删除并重新创建目标
- [服务器-44527](https://jira.mongodb.org/browse/SERVER-44527)地图简化为现有的碎片集合可能会错误地在目标碎片上创建新集合
- [服务器-44568](https://jira.mongodb.org/browse/SERVER-44568)将服务器时区数据文件的嵌入式版本更新为tzdb-2019c
- [服务器-44595](https://jira.mongodb.org/browse/SERVER-44595)mongod的Linux关闭有时永远不会完成
- [服务器-44775](https://jira.mongodb.org/browse/SERVER-44775)Make FailPoint::pauseWhileSet increment _timesEntered一次
- [服务器-44828](https://jira.mongodb.org/browse/SERVER-44828)将$sort吸收到查询层后，纠正逻辑以重新计算依赖项
- [服务器-44964](https://jira.mongodb.org/browse/SERVER-44964)[4.2]根据BSONObj缓冲区容量而不是大小计算每个键的索引构建内存使用情况
- [服务器-45050](https://jira.mongodb.org/browse/SERVER-45050)更改Windows Kerberos客户端，以便在未指定密码时使用默认凭据
- [服务器-45180](https://jira.mongodb.org/browse/SERVER-45180)对公里服务使用更长时间的重试
- [服务器-45320](https://jira.mongodb.org/browse/SERVER-45320)从构建脚本中删除常青客户端
- [服务器-45472](https://jira.mongodb.org/browse/SERVER-45472)确保RoleGraph可以序列化身份验证限制到BSON
- [服务器-45698](https://jira.mongodb.org/browse/SERVER-45698)从sys-perf中删除Jasper烟雾测试
- [工具-2424](https://jira.mongodb.org/browse/TOOLS-2424)Backport“重播oplog失败时，TOOLS-1826 mongorestore在存档模式下恐慌”
- [WT-4919](https://jira.mongodb.org/browse/WT-4919)添加调试模式，在__wt_realloc_def中分配确切的内存量
- [WT-4921](https://jira.mongodb.org/browse/WT-4921)添加调试模式选项，以减缓检查点的创建速度
- [WT-4969](https://jira.mongodb.org/browse/WT-4969)删除lsm_merge配置选项
- [WT-4996](https://jira.mongodb.org/browse/WT-4996)将Jenkins的“wiredtiger-test-check-long”工作迁移到Evergreen
- [WT-4997](https://jira.mongodb.org/browse/WT-4997)将Jenkins的“wiredtiger-test-format-stress”工作迁移到Evergreen
- [WT-4998](https://jira.mongodb.org/browse/WT-4998)将Jenkins的“wiredtiger-test-format-stress-ppc”工作迁移到Evergreen
- [WT-5000](https://jira.mongodb.org/browse/WT-5000)将Jenkins的“wiredtiger-test-format-stress-sanitizer”工作迁移到Evergreen
- [WT-5004](https://jira.mongodb.org/browse/WT-5004)将Jenkins的“wiredtiger-test-checkpoint-stress”工作迁移到Evergreen
- [WT-5005](https://jira.mongodb.org/browse/WT-5005)将Jenkins的“wiredtiger-test-recovery-stress”工作迁移到Evergreen
- [WT-5006](https://jira.mongodb.org/browse/WT-5006)将Jenkins的“wiredtiger-test-split-stress”工作迁移到Evergreen
- [WT-5037](https://jira.mongodb.org/browse/WT-5037)将github中的应用程序开发人员资源文档移动到WT文档
- [WT-5044](https://jira.mongodb.org/browse/WT-5044)记录在遇到时间戳使用问题时的更多信息
- [WT-5047](https://jira.mongodb.org/browse/WT-5047)对于损坏的日志，请务必返回WT_TRY_SALVAGE
- [WT-5077](https://jira.mongodb.org/browse/WT-5077)复制目录时，无故障地处理ENOENT
- [WT-5082](https://jira.mongodb.org/browse/WT-5082)即使固定最古老的事务ID，应用程序线程也被分配驱逐
- [WT-5090](https://jira.mongodb.org/browse/WT-5090)滚动线程时记录消息，因为它包含最古老的时间戳
- [WT-5112](https://jira.mongodb.org/browse/WT-5112)在s_goto.py中处理带有多个单词的goto标签
- [WT-5120](https://jira.mongodb.org/browse/WT-5120)当和解没有释放驱逐生成时，检查点会挂起
- [WT-5139](https://jira.mongodb.org/browse/WT-5139)WiredTiger增量备份API
- [WT-5221](https://jira.mongodb.org/browse/WT-5221)绕过测试_wt2853_常青制作检查-msan测试中的perf
- [WT-5232](https://jira.mongodb.org/browse/WT-5232)创建一个包装脚本来支持Evergreen中的格式重力测试
- [WT-5257](https://jira.mongodb.org/browse/WT-5257)覆盖分析错误：113971空格检查后取消引用
- [WT-5263](https://jira.mongodb.org/browse/WT-5263)写入旁路文件的准备好的更新并不总是根据需要阅读
- [WT-5274](https://jira.mongodb.org/browse/WT-5274)format.sh必须处理核心转储信号和“gdb附加”构建模式
- [WT-5276](https://jira.mongodb.org/browse/WT-5276)测试/格式需要在批量加载期间向前移动最古老的时间戳
- [WT-5277](https://jira.mongodb.org/browse/WT-5277)在旁置文件中检测到光标键乱序
- [WT-5288](https://jira.mongodb.org/browse/WT-5288)format.sh必须区分格式超时并终止子进程
- [WT-5305](https://jira.mongodb.org/browse/WT-5305)format.sh必须处理格式对wt实用程序的使用
- [WT-5309](https://jira.mongodb.org/browse/WT-5309)更新format.sh脚本以添加前缀命令参数
- [WT-5311](https://jira.mongodb.org/browse/WT-5311)格式时间戳与MongoDB相同
- [WT-5312](https://jira.mongodb.org/browse/WT-5312)将执行随机光标操作的线程添加到格式的缓存大小计算中
- [WT-5314](https://jira.mongodb.org/browse/WT-5314)避免加载Python测试有空白名称的扩展
- [WT-5319](https://jira.mongodb.org/browse/WT-5319)当没有实例化密钥时，避免清除保存的最后一个密钥
- [WT-5324](https://jira.mongodb.org/browse/WT-5324)WiredTiger API错误处理修复
- [WT-5327](https://jira.mongodb.org/browse/WT-5327)备份光标API可能无法恢复WT_SESSION名称信息
- [WT-5330](https://jira.mongodb.org/browse/WT-5330)MongoDB中正在回转只读交易
- [WT-5360](https://jira.mongodb.org/browse/WT-5360)添加在开发人员文档中构建术语表的模板
- [WT-5365](https://jira.mongodb.org/browse/WT-5365)删除格式的长期事务支持



## 4.2.2 更改日志

### 安全

- [服务器-43090](https://jira.mongodb.org/browse/SERVER-43090)使用Okta修复LDAP连接运行状况测试
- [服务器-43640](https://jira.mongodb.org/browse/SERVER-43640)用户缓存无效器在dtor中不变会降低可反驳性
- [服务器-43653](https://jira.mongodb.org/browse/SERVER-43653)将静态OpenSSL升级到1.1.1d
- [服务器-44320](https://jira.mongodb.org/browse/SERVER-44320)允许通过操作类型授权分区分片命令

### 分片

- [服务器-31083](https://jira.mongodb.org/browse/SERVER-31083)允许将主碎片传递给新数据库的“启用共享”命令
- [服务器-39332](https://jira.mongodb.org/browse/SERVER-39332)防止测试直接将集合丢弃在碎片上
- [服务器-41480](https://jira.mongodb.org/browse/SERVER-41480)块分割/合并的增量集合主要版本
- [服务器-42737](https://jira.mongodb.org/browse/SERVER-42737)MongoDB卡在更新元数据上
- [服务器-42769](https://jira.mongodb.org/browse/SERVER-42769)启用AutoSplit后，ShardingTest应调用awaitLastOpCommitted
- [服务器-43337](https://jira.mongodb.org/browse/SERVER-43337)处理findAndModify转换为事务时碎片上出现的错误。
- [服务器-44113](https://jira.mongodb.org/browse/SERVER-44113)在 transactions_reject_writes_for_moved_chunks.js散列大小写中刷新正确命名空间的元数据
- [服务器-44261](https://jira.mongodb.org/browse/SERVER-44261)将waitForFailpoint函数替换为waitForFailPoint命令
- [服务器-44289](https://jira.mongodb.org/browse/SERVER-44289)可重试写，更改碎片键值，并拥有包含写入关注的碎片，无效选项失败
- [服务器-44476](https://jira.mongodb.org/browse/SERVER-44476)包括 removeShard 输出中剩余的巨型块数

### 复制

- [服务器-40372](https://jira.mongodb.org/browse/SERVER-40372)在4.2+上跟踪交易大小
- [服务器-41512](https://jira.mongodb.org/browse/SERVER-41512)跟踪与选举中节点投票相关的指标
- [服务器-41513](https://jira.mongodb.org/browse/SERVER-41513)跟踪新术语oplog条目由主节点编写并由secondal在所有节点的replSetStatus中应用的时间
- [服务器-42025](https://jira.mongodb.org/browse/SERVER-42025)防止在 prepare_transaction_read_at_cluster_time.js 中推进最旧的时间戳。
- [服务器-42366](https://jira.mongodb.org/browse/SERVER-42366)当EMRC=false时，我们可能会在强制返回到共同点后，在回滚期间提前设置稳定时间戳
- [服务器-42925](https://jira.mongodb.org/browse/SERVER-42925)幂等性测试存在oplog可存在问题
- [服务器-43239](https://jira.mongodb.org/browse/SERVER-43239)repSetGetStatus中的numCatchUpOps不正确
- [服务器-43703](https://jira.mongodb.org/browse/SERVER-43703)禁用rsSyncApplyStop故障点和停止服务器时的比赛
- [服务器-43729](https://jira.mongodb.org/browse/SERVER-43729)replSetFreeze完成了RollbackTest.transitionToSyncSourceOperations的一部分，DuringRollback应该具有错误的弹性。
- [服务器-43972](https://jira.mongodb.org/browse/SERVER-43972)initial_sync_capped_index.js在运行validate之前应该检查SECONDARY状态
- [服务器-44259](https://jira.mongodb.org/browse/SERVER-44259)rollback_after_enabling_majority_reads.js测试应等待重新启动的节点处于次要状态，然后再运行stepUp命令
- [服务器-44373](https://jira.mongodb.org/browse/SERVER-44373)recover_multiple_prepared_transactions_startup.js测试应等待大多数提交点提前，然后再提交准备好的事务
- [服务器-44457](https://jira.mongodb.org/browse/SERVER-44457)在v4.2上更新 backports_required_for_multiversion.yml，并附上完整的多版本测试套件列表
- [服务器-44643](https://jira.mongodb.org/browse/SERVER-44643)在rollback_after_enabling_majority_reads.js中使用awaitSecondaryNodes而不是waitForState
- [服务器-44675](https://jira.mongodb.org/browse/SERVER-44675)server_status_metrics.js因服务器状态中的racy repl.buffer.count指标而失败

### 查询

- [服务器-43338](https://jira.mongodb.org/browse/SERVER-43338)[4.2]在FCV 4.0中删除admin.system.*索引在启动时可能会不变
- [服务器-44026](https://jira.mongodb.org/browse/SERVER-44026)移除全局X锁以进行重新索引
- [服务器-44050](https://jira.mongodb.org/browse/SERVER-44050)沿着“散列”索引键路径的数组没有被正确拒绝
- [服务器-44269](https://jira.mongodb.org/browse/SERVER-44269)现代化max_time_ms.js
- [服务器-44377](https://jira.mongodb.org/browse/SERVER-44377)索引不等式为空的不变失败
- [服务器-44571](https://jira.mongodb.org/browse/SERVER-44571)升级后无法更新或删除服务器-44050损坏场景中涉及的文档
- [服务器-44617](https://jira.mongodb.org/browse/SERVER-44617)当其中一个捕获组与输入不匹配，但模式匹配时，$regexFind崩溃

### 集合

- [服务器-43034](https://jira.mongodb.org/browse/SERVER-43034)DoubleDoubleSummation中的特殊值处理不一致
- [服务器-43860](https://jira.mongodb.org/browse/SERVER-43860)$merge中的管道样式更新可能会产生意想不到的结果

### 目录

- [服务器-43402](https://jira.mongodb.org/browse/SERVER-43402)二级操作日志可以有条目来创建相同名称但大写不同的数据库，然后再删除旧数据库
- [服务器-43880](https://jira.mongodb.org/browse/SERVER-43880)在生成光标后，跨数据库重命名Collection使用无有的RecordData

### 储存

- [服务器-33272](https://jira.mongodb.org/browse/SERVER-33272)DatabaseHolder::close()函数不再需要全局写锁，dropDatabase命令也不需要全局写入锁。
- [服务器-43152](https://jira.mongodb.org/browse/SERVER-43152)删除两阶段CreateIndexes测试命令
- [服务器-43882](https://jira.mongodb.org/browse/SERVER-43882)构建启动恢复索引在生成光标后使用未拥有的RecordData
- [服务器-43908](https://jira.mongodb.org/browse/SERVER-43908)修改IndexConsistency哈希映射键，以避免在KeyString表单中针对不同索引的重复索引键上点击不变
- [服务器-44239](https://jira.mongodb.org/browse/SERVER-44239)确保lock_stats.js中的并行shell成功完成，以正确记录服务器状态
- [服务器-44612](https://jira.mongodb.org/browse/SERVER-44612)recoverFromOplogAsStandalone with takeUnstableCheckpointOnShutdown如果在成功尝试后重审，应该会成功
- [服务器-44744](https://jira.mongodb.org/browse/SERVER-44744)从queryable_mmapv1天内删除过时的代码。
- [服务器-44755](https://jira.mongodb.org/browse/SERVER-44755)在wt_missing_file_errors.js中更改断言编号

### 运营

- [服务器-42886](https://jira.mongodb.org/browse/SERVER-42886)修复shell中的`bypassAutoDecrypt`设置
- [服务器-43265](https://jira.mongodb.org/browse/SERVER-43265)使用URI压缩机参数时，Mongo Shell退出时出现InvalidOptions错误
- [服务器-43884](https://jira.mongodb.org/browse/SERVER-43884)改进了mongocryptd源错误的错误格式

### 构建和包装

- [服务器-44177](https://jira.mongodb.org/browse/SERVER-44177)降低异国情调构建变体的频率
- [服务器-44392](https://jira.mongodb.org/browse/SERVER-44392)平台支持：删除zSeries ubuntu 16.04
- [服务器-44398](https://jira.mongodb.org/browse/SERVER-44398)在Suse 15上禁用多版本测试
- [服务器-44545](https://jira.mongodb.org/browse/SERVER-44545)删除移动平台上嵌入式SDK的构建器
- [服务器-44579](https://jira.mongodb.org/browse/SERVER-44579)Pin pywin32 python模块
- [服务器-44687](https://jira.mongodb.org/browse/SERVER-44687)错误：“操作员删除”不可用：macOS 10.12中引入

### 工具

[工具-2380](https://jira.mongodb.org/browse/TOOLS-2380)启用身份验证后，mongodump对隐藏节点失败

### 内部人员

- [服务器-39165](https://jira.mongodb.org/browse/SERVER-39165)添加waitForFailpoint命令
- [服务器-39993](https://jira.mongodb.org/browse/SERVER-39993)添加并发降级套件的终止和终止版本
- [服务器-40667](https://jira.mongodb.org/browse/SERVER-40667)MongoD存储监管机构应该将意外中断视为过程致命
- [服务器-41140](https://jira.mongodb.org/browse/SERVER-41140)MultiIndexBlock的所有用途都应确保呼叫者检查重复的密钥约束
- [服务器-42393](https://jira.mongodb.org/browse/SERVER-42393)在wt_file_helper.js assertStartInReplSet期间设置故障点的竞赛
- [服务器-42576](https://jira.mongodb.org/browse/SERVER-42576)在logical_session_cache_*套件中将并发作业的数量从4个减少到2个
- [服务器-42688](https://jira.mongodb.org/browse/SERVER-42688)M/R Agg：修复性能测试，以便在新地图上运行有效选项Reduce
- [服务器-42748](https://jira.mongodb.org/browse/SERVER-42748)M/R Agg：支持在映射/减少参数中使用存储过程（system.js）
- [服务器-42790](https://jira.mongodb.org/browse/SERVER-42790)将ConnectionPool的kDiagnosticLogLevel从3更改为4
- [服务器-42818](https://jira.mongodb.org/browse/SERVER-42818)M/R Agg：确保非物质化视图上的mapReduce失败，并发出合理的错误消息
- [服务器-42961](https://jira.mongodb.org/browse/SERVER-42961)修复SLES上的拆分地平线测试
- [服务器-43079](https://jira.mongodb.org/browse/SERVER-43079)LogicalSessionCacheRefresh触发的故障点
- [服务器-43085](https://jira.mongodb.org/browse/SERVER-43085)使用SHA-256而不是SHA-1重新生成所有测试证书
- [服务器-43151](https://jira.mongodb.org/browse/SERVER-43151)value.cpp:1368聚合断言中出错
- [服务器-43213](https://jira.mongodb.org/browse/SERVER-43213)agg_out_interrupt_cleanup.js不应使用继承的“查询”状态
- [服务器-43319](https://jira.mongodb.org/browse/SERVER-43319)增加“并发_同时”夹具的光标超时
- [服务器-43576](https://jira.mongodb.org/browse/SERVER-43576)DBClientRS不传播applicationName
- [服务器-43577](https://jira.mongodb.org/browse/SERVER-43577)确保记录终止连接的ssl异常。
- [服务器-43579](https://jira.mongodb.org/browse/SERVER-43579)AWS KMS支持需要对KMS的可用性保持稳健性
- [服务器-43693](https://jira.mongodb.org/browse/SERVER-43693)降低create_index_background_unique_collmod*工作负载中collMods的概率
- [服务器-43749](https://jira.mongodb.org/browse/SERVER-43749)使地图现代化减少服务器-42690所涵盖的核心测试
- [服务器-43843](https://jira.mongodb.org/browse/SERVER-43843)在回滚模糊器“restartNode”命令期间跳过验证
- [服务器-43900](https://jira.mongodb.org/browse/SERVER-43900)将stitch_support_lib_build_and_test和嵌入式_sdk_build_and_test任务组的max_hosts设置为1
- [服务器-43987](https://jira.mongodb.org/browse/SERVER-43987)使用OperationContext::waitForConditionOrInterrupt()要求谓词
- [服务器-44006](https://jira.mongodb.org/browse/SERVER-44006)将包装许可证从AGPL更改为SSPL
- [服务器-44009](https://jira.mongodb.org/browse/SERVER-44009)上传sys-perf和微基标的pip冻结输出
- [服务器-44027](https://jira.mongodb.org/browse/SERVER-44027)删除全局X锁，以便在DB之间重新命名收集
- [服务器-44028](https://jira.mongodb.org/browse/SERVER-44028)移除克隆器的全局X锁
- [服务器-44029](https://jira.mongodb.org/browse/SERVER-44029)删除replSetResizeOplog的全局X锁
- [服务器-44064](https://jira.mongodb.org/browse/SERVER-44064)对MessageCompressorManager参数执行显式转换
- [服务器-44119](https://jira.mongodb.org/browse/SERVER-44119)在默认的SetParameter::set(BSONElement)处理程序中修复字符串胁迫
- [服务器-44183](https://jira.mongodb.org/browse/SERVER-44183)未能在asio插座上收听应该是致命的
- [服务器-44287](https://jira.mongodb.org/browse/SERVER-44287)阿格先生：放松地图减少IDL以忽略“jsMode”选项并更改map减少解析器以允许“nonAtomic: true”并禁止“out.sharded: false”
- [服务器-44310](https://jira.mongodb.org/browse/SERVER-44310)使waitForFailPoint命令需要maxTimeMS
- [服务器-44312](https://jira.mongodb.org/browse/SERVER-44312)在信号处理的性能测试中指定常青授权
- [服务器-44319](https://jira.mongodb.org/browse/SERVER-44319)在Windows上跳过replica_sets/auth1.js中的keyfile检查
- [服务器-44578](https://jira.mongodb.org/browse/SERVER-44578)从storage_wiredtiger_core的LIBDEPS_PRIVATE中删除未使用的db_raii和server_status库
- [服务器-44651](https://jira.mongodb.org/browse/SERVER-44651)更新信号处理版本
- [服务器-44721](https://jira.mongodb.org/browse/SERVER-44721)Shell KMS AWS支持无法解密响应
- [服务器-44727](https://jira.mongodb.org/browse/SERVER-44727)检测更改不应通过run-dsi调用
- [服务器-44868](https://jira.mongodb.org/browse/SERVER-44868)Initialsync日志保存人和日志保存人-短测试应分别将快照ID和数据集链接传递给dsi（sys-perf）
- [WT-4486](https://jira.mongodb.org/browse/WT-4486)在肮脏的最大测试中，同步次数没有增加
- [WT-4565](https://jira.mongodb.org/browse/WT-4565)使用不等待的读取标志设置修复树步代码
- [WT-4702](https://jira.mongodb.org/browse/WT-4702)切换到ubuntu1804-test Evergreen发行版
- [WT-4715](https://jira.mongodb.org/browse/WT-4715)如果旧交易或时间戳被选择驱逐的线程固定，工作负载将停滞不前
- [WT-4961](https://jira.mongodb.org/browse/WT-4961)具有缓存溢出的检查点必须保留读取历史记录
- [WT-4976](https://jira.mongodb.org/browse/WT-4976)将Jenkins的“wiredtiger-pull-request-builds”工作迁移到Evergreen
- [WT-4983](https://jira.mongodb.org/browse/WT-4983)将Jenkins的“Wiredtiger”工作迁移到Evergreen
- [WT-4987](https://jira.mongodb.org/browse/WT-4987)将Jenkins的“wiredtiger-test-checkpoint”工作迁移到Evergreen
- [WT-4988](https://jira.mongodb.org/browse/WT-4988)将Jenkins的“wiredtiger-test-unit”工作迁移到Evergreen
- [WT-4989](https://jira.mongodb.org/browse/WT-4989)将Jenkins的“wiredtiger-test-unit-long”工作迁移到Evergreen
- [WT-4990](https://jira.mongodb.org/browse/WT-4990)将Jenkins的“wiredtiger-test-unit-ppc”工作迁移到Evergreen
- [WT-4991](https://jira.mongodb.org/browse/WT-4991)将Jenkins的“wiredtiger-test-unit-zseries”工作迁移到Evergreen
- [WT-4994](https://jira.mongodb.org/browse/WT-4994)将Jenkins的“wiredtiger-test-spinlock”工作迁移到Evergreen
- [WT-4995](https://jira.mongodb.org/browse/WT-4995)将Jenkins的“wiredtiger-test-wtperf”工作迁移到Evergreen
- [WT-5033](https://jira.mongodb.org/browse/WT-5033)将Jenkins的“wiredtiger-test-time-shift-sensitivity”工作迁移到Evergreen
- [WT-5042](https://jira.mongodb.org/browse/WT-5042)减少检查点的配置解析开销
- [WT-5048](https://jira.mongodb.org/browse/WT-5048)带有损坏元文件的wiredtiger_open应始终返回WT_TRY_SALVAGE
- [WT-5083](https://jira.mongodb.org/browse/WT-5083)添加mips64el支持
- [WT-5106](https://jira.mongodb.org/browse/WT-5106)删除clang格式脚本中的临时文件
- [WT-5118](https://jira.mongodb.org/browse/WT-5118)删除错误的断言，即没有对丢弃的WT_REF的危险引用
- [WT-5122](https://jira.mongodb.org/browse/WT-5122)在进行最终检查点之前关闭扫描服务器
- [WT-5123](https://jira.mongodb.org/browse/WT-5123)填写多段评论
- [WT-5125](https://jira.mongodb.org/browse/WT-5125)为驱逐目标战略添加新的统计数据
- [WT-5126](https://jira.mongodb.org/browse/WT-5126)修复有关已准备好的更新解决方案的错误断言
- [WT-5128](https://jira.mongodb.org/browse/WT-5128)添加脚本以使用XRay分析运行wtperf
- [WT-5134](https://jira.mongodb.org/browse/WT-5134)修复仅页页搜索和搜索附近操作
- [WT-5135](https://jira.mongodb.org/browse/WT-5135)更改side文件插入以使用cursor.insert
- [WT-5140](https://jira.mongodb.org/browse/WT-5140)修复返回随机项的光标可以使用未初始化的缓冲区
- [WT-5142](https://jira.mongodb.org/browse/WT-5142)使用溢出键重新平衡或批量加载对象时，不要创建巨大的根页
- [WT-5143](https://jira.mongodb.org/browse/WT-5143)修复错误消息中的错别字
- [WT-5145](https://jira.mongodb.org/browse/WT-5145)修复访问pinned_timestamp和连接状态的竞争条件
- [WT-5149](https://jira.mongodb.org/browse/WT-5149)清除调试字段值，使其不会变质
- [WT-5150](https://jira.mongodb.org/browse/WT-5150)LAS扫描不会删除不再需要的条目
- [WT-5156](https://jira.mongodb.org/browse/WT-5156)Lookaside表光标无法在隔离级别运行 WT_ISO_READ_UNCOMMITTED
- [WT-5157](https://jira.mongodb.org/browse/WT-5157)修复自旋锁实现中的原子用法
- [WT-5160](https://jira.mongodb.org/browse/WT-5160)在调用rollback_to_stable之前，停止要求检查站
- [WT-5163](https://jira.mongodb.org/browse/WT-5163)修复配置随机检索时WT_CURSOR.next中忽略的故障返回
- [WT-5164](https://jira.mongodb.org/browse/WT-5164)修复不一致的下划线/破折号输出
- [WT-5169](https://jira.mongodb.org/browse/WT-5169)WT_REF_LIMBO页面不支持快速（仅限页页）搜索
- [WT-5174](https://jira.mongodb.org/browse/WT-5174)截断回滚锁定不足
- [WT-5176](https://jira.mongodb.org/browse/WT-5176)使用Evergreen任务标签对拉取请求任务进行分组
- [WT-5187](https://jira.mongodb.org/browse/WT-5187)检查点错误路径可以尝试释放未保留的危险指针
- [WT-5189](https://jira.mongodb.org/browse/WT-5189)Python2：处理并发测试选项（-j）下发生的错误
- [WT-5193](https://jira.mongodb.org/browse/WT-5193)将LAS掉落的表格从WT-5150恢复
- [WT-5195](https://jira.mongodb.org/browse/WT-5195)减少Evergreen Windows构建变体的Python单元测试构建时间
- [WT-5196](https://jira.mongodb.org/browse/WT-5196)启用LAS扫描后，数据与测试/检查点不匹配失败
- [WT-5197](https://jira.mongodb.org/browse/WT-5197)在Evergreen中修复消毒剂运行时标志
- [WT-5204](https://jira.mongodb.org/browse/WT-5204)将诊断日志代码添加到生成排水功能中
- [WT-5207](https://jira.mongodb.org/browse/WT-5207)尽量减少WT-5043诊断测试，以排除驱逐本身以外的时间
- [WT-5211](https://jira.mongodb.org/browse/WT-5211)在转储页面和LAS之前打印不匹配的信息
- [WT-5218](https://jira.mongodb.org/browse/WT-5218)使用WT_CACHE_EVICT_NOKEEP阅读器改进驱逐，以区分干净和肮脏的页面
- [WT-5220](https://jira.mongodb.org/browse/WT-5220)从WT-5150重新启用LAS下拉表更改
- [WT-5239](https://jira.mongodb.org/browse/WT-5239)修复有关元数据文件打开的syscall失败
- [WT-5247](https://jira.mongodb.org/browse/WT-5247)确保只记录幂等的修改操作
- [WT-5251](https://jira.mongodb.org/browse/WT-5251)增加Linux syscall测试的频率
- [WT-5252](https://jira.mongodb.org/browse/WT-5252)修复Evergreen中的Ubuntu 18.04 PPC和zSeries单元测试失败



## 4.2.1 更改日志

### 安全

- [服务器-28011](https://jira.mongodb.org/browse/SERVER-28011)在--kmipServerName参数中支持多个KMIP主机
- [服务器-41277](https://jira.mongodb.org/browse/SERVER-41277)创建FLE数据框架类
- [服务器-42351](https://jira.mongodb.org/browse/SERVER-42351)RHEL8 TLS 1.0和TLS 1.1协议在DEFAULT全系统加密策略级别中被禁用
- [服务器-43243](https://jira.mongodb.org/browse/SERVER-43243)重新引入未使用的维修数据库ActionType

### 分片

- [服务器-10456](https://jira.mongodb.org/browse/SERVER-10456)获取用于查找要克隆文档的光标逻辑（在迁移中）与removeRange不同
- [服务器-11328](https://jira.mongodb.org/browse/SERVER-11328)允许并发排出碎片
- [服务器-33973](https://jira.mongodb.org/browse/SERVER-33973)强制清理收集/数据库丢失失败后可能保留的部分数据的命令
- [服务器-36222](https://jira.mongodb.org/browse/SERVER-36222)在shard_identity_rollback.js中调用ReplSetTest.restart是疯狂的
- [服务器-36315](https://jira.mongodb.org/browse/SERVER-36315)下台后，CSRS dist锁管理器一直试图解锁锁
- [服务器-39573](https://jira.mongodb.org/browse/SERVER-39573)在日志标签“TransactionCoordinator”中添加唯一的ID
- [服务器-39763](https://jira.mongodb.org/browse/SERVER-39763)transactions_target_at_point_in_time.js应该禁用过期的旧块历史记录
- [服务器-40258](https://jira.mongodb.org/browse/SERVER-40258)放松对碎片上的分片元数据刷新的锁定要求
- [服务器-40496](https://jira.mongodb.org/browse/SERVER-40496)transactions_snapshot_errors_subsequent_statements.js和 transactions_writes_not_retryable.js不应使用模式{times: 1}进行故障点
- [服务器-40852](https://jira.mongodb.org/browse/SERVER-40852)mongod_returns_no_cluster_time_without_keys.js应该等待shard primary加载集群时间键
- [服务器-40983](https://jira.mongodb.org/browse/SERVER-40983)跟踪和记录当前Op的mongos上的相关单笔交易指标
- [服务器-41374](https://jira.mongodb.org/browse/SERVER-41374)将currentOpen、currentActive和currentInactive添加到mongos事务服务器状态输出
- [服务器-41376](https://jira.mongodb.org/browse/SERVER-41376)mongos上的跟踪时间交易是活跃和不活跃的，并包含在缓慢的txn日志记录中
- [服务器-41615](https://jira.mongodb.org/browse/SERVER-41615)事务协调员诊断应处理协调员故障转移
- [服务器-41758](https://jira.mongodb.org/browse/SERVER-41758)允许删除config.shards，并可能导致mongos在聚合代码中崩溃
- [服务器-42006](https://jira.mongodb.org/browse/SERVER-42006)将事务标签添加到 prepared_txn_metadata_refresh.js
- [服务器-42234](https://jira.mongodb.org/browse/SERVER-42234)使txn_two_phase_commit_failover.js对同时运行选举的所有复制节点都具有鲁棒性
- [服务器-42335](https://jira.mongodb.org/browse/SERVER-42335)ShutdownShouldCancelQueuedRequests cpp测试可以忽略杀戮信号
- [服务器-42338](https://jira.mongodb.org/browse/SERVER-42338)transaction_coordinator_test可以自我死锁
- [服务器-42457](https://jira.mongodb.org/browse/SERVER-42457)在从外部线程进行观察之前，检查是否在TransactionRouter上设置了集群时间
- [服务器-42559](https://jira.mongodb.org/browse/SERVER-42559)WaitWithOpTimeEarlierThanLowestQueued的比赛导致它失败
- [服务器-42610](https://jira.mongodb.org/browse/SERVER-42610)在shards_and_config_return_last_committed_optime.js中翻转assert.lte参数的顺序
- [服务器-42751](https://jira.mongodb.org/browse/SERVER-42751)观察迁移事务提交时采取CSRLock
- [服务器-42809](https://jira.mongodb.org/browse/SERVER-42809)跟踪和记录当前Op的mongod上事务协调员的相关单两阶段提交指标
- [服务器-42842](https://jira.mongodb.org/browse/SERVER-42842)无法在分片集群的管理数据库中删除集合
- [服务器-42856](https://jira.mongodb.org/browse/SERVER-42856)写入交易可能会发送到错误的碎片
- [服务器-42907](https://jira.mongodb.org/browse/SERVER-42907)为mongos currentOp输出中的交易添加时间ActiveMicros和时间不活跃的Micros
- [服务器-42963](https://jira.mongodb.org/browse/SERVER-42963)对于活动会话，仅在TransactionRouter::Observer::_reportState()中设置事务统计信息
- [服务器-43196](https://jira.mongodb.org/browse/SERVER-43196)Blacklist update_where.js来自带有平衡器且没有txn覆盖的分片并发套件

### 复制

- [服务器-7019](https://jira.mongodb.org/browse/SERVER-7019)rs.status需要显示初始同步正在发生
- [服务器-7681](https://jira.mongodb.org/browse/SERVER-7681)在ReplSetGetStatus/isMaster中报告多数数
- [服务器-36570](https://jira.mongodb.org/browse/SERVER-36570)使OplogEntry可变
- [服务器-38356](https://jira.mongodb.org/browse/SERVER-38356)禁止在存在重置配置时删除oplog
- [服务器-39576](https://jira.mongodb.org/browse/SERVER-39576)删除doTxn测试命令
- [服务器-39610](https://jira.mongodb.org/browse/SERVER-39610)重新格式化交易参与者的评论，并删除对指标互斥的最后一次引用
- [服务器-39613](https://jira.mongodb.org/browse/SERVER-39613)从TransactionState中删除kCommittingWithPrepare和kCommittingWithoutPrepare
- [服务器-39614](https://jira.mongodb.org/browse/SERVER-39614)从TransactionParticipant中删除inActiveOrKilledMultiDocumentTransaction()
- [服务器-40466](https://jira.mongodb.org/browse/SERVER-40466)统一为InMultiDocumentTransaction和朋友的支票
- [服务器-41221](https://jira.mongodb.org/browse/SERVER-41221)rollback_after_enabling_majority_reads.js测试应确保最终回滚发生在节点0上
- [服务器-41457](https://jira.mongodb.org/browse/SERVER-41457)统一TransactionParticipant为中止交易提供的不同方式
- [服务器-41465](https://jira.mongodb.org/browse/SERVER-41465)在对二级交易应用操作时的fassert
- [服务器-41481](https://jira.mongodb.org/browse/SERVER-41481)返回dbResponse对象，该对象存储在接收命令中与 exhaustNS和 exhaustCursorId一起存储
- [服务器-41482](https://jira.mongodb.org/browse/SERVER-41482)makeExhaustMessage 信息不应再调用 OpMsg::parse
- [服务器-41497](https://jira.mongodb.org/browse/SERVER-41497)为ElectelectMetrics、ElectCandidateMetrics和ElectlectParticipant指标创建IDL类型
- [服务器-41498](https://jira.mongodb.org/browse/SERVER-41498)创建复制指标类
- [服务器-41499](https://jira.mongodb.org/browse/SERVER-41499)跟踪服务器状态中每个原因调用的选举次数
- [服务器-41500](https://jira.mongodb.org/browse/SERVER-41500)在服务器状态中跟踪每个原因的成功选举数量
- [服务器-41501](https://jira.mongodb.org/browse/SERVER-41501)在serverStatus中跟踪需要进行初步追赶的选举次数
- [服务器-41502](https://jira.mongodb.org/browse/SERVER-41502)在服务器状态中跟踪主要追赶结束的次数
- [服务器-41503](https://jira.mongodb.org/browse/SERVER-41503)跟踪目标opTime，以便在初选的replSetStatus中赶上
- [服务器-41504](https://jira.mongodb.org/browse/SERVER-41504)在初选replSetStatus中跟踪追赶期间的操作数量
- [服务器-41505](https://jira.mongodb.org/browse/SERVER-41505)跟踪服务器状态中追赶操作的平均数量
- [服务器-41506](https://jira.mongodb.org/browse/SERVER-41506)跟踪与调用选举的节点关联的指标
- [服务器-41507](https://jira.mongodb.org/browse/SERVER-41507)跟踪在初选时在replSetStatus中编写新术语oplog条目的时间
- [服务器-41508](https://jira.mongodb.org/browse/SERVER-41508)跟踪新术语oplog条目在初选replSetStatus中占多数的时间
- [服务器-41509](https://jira.mongodb.org/browse/SERVER-41509)在服务器状态中跟踪尝试的下阶次数
- [服务器-41510](https://jira.mongodb.org/browse/SERVER-41510)在服务器状态中跟踪失败的降级次数
- [服务器-41511](https://jira.mongodb.org/browse/SERVER-41511)跟踪因在serverStatus中看到更高术语而导致的降级次数
- [服务器-41580](https://jira.mongodb.org/browse/SERVER-41580)不要在No Journal构建器上运行事务套件
- [服务器-41788](https://jira.mongodb.org/browse/SERVER-41788)将OplogApplication::Mode添加到OplogApplier中的选项中
- [服务器-41918](https://jira.mongodb.org/browse/SERVER-41918)CollectionBulkLoader预计不会出现来自MultiIndexBlock的异常
- [服务器-41955](https://jira.mongodb.org/browse/SERVER-41955)添加测试，以复制在初始同步期间收到的准备操作日志条目
- [服务器-41956](https://jira.mongodb.org/browse/SERVER-41956)添加提交killOp和中止准备好的事务的集成测试
- [服务器-41957](https://jira.mongodb.org/browse/SERVER-41957)为带有已准备的事务的会话添加killSessions的集成测试
- [服务器-41958](https://jira.mongodb.org/browse/SERVER-41958)添加一个回滚准备的测试，然后尝试重试准备
- [服务器-41959](https://jira.mongodb.org/browse/SERVER-41959)通过applyOps命令测试正在运行的事务命令
- [服务器-42129](https://jira.mongodb.org/browse/SERVER-42129)修改测试，以考虑重新启动后临时ForTest存储引擎丢失的操作日志
- [服务器-42155](https://jira.mongodb.org/browse/SERVER-42155)表示阅读时术语不匹配Concern超时
- [服务器-42219](https://jira.mongodb.org/browse/SERVER-42219)当主退出排水模式时，Oplog缓冲区并不总是空的
- [服务器-42453](https://jira.mongodb.org/browse/SERVER-42453)确保当前集群时间大于step_down_on_secondary.js中读取的 afterClusterTime值
- [服务器-42454](https://jira.mongodb.org/browse/SERVER-42454)在do_not_advance_commit_point_beyond_last_applied_term.js中禁用故障点之前，等待节点找到适当的同步源
- [服务器-42478](https://jira.mongodb.org/browse/SERVER-42478)从create/createIndexes的oplog应用程序中删除DB MODE_X锁
- [服务器-42484](https://jira.mongodb.org/browse/SERVER-42484)在初始同步数据克隆期间编写多键索引键时，可能不在必需的WriteUnitOfWork中
- [服务器-42523](https://jira.mongodb.org/browse/SERVER-42523)将更多日志记录添加到oplog_rollover.js
- [服务器-42534](https://jira.mongodb.org/browse/SERVER-42534)在 freeze_timeout.js 中以更少的时间退出初选，并增加选举TimeoutMillis
- [服务器-42562](https://jira.mongodb.org/browse/SERVER-42562)增加resource_prepared_transactions_startup_secondary_application.js的选举超时
- [服务器-42602](https://jira.mongodb.org/browse/SERVER-42602)保证不会因滚动_fuzzer_[un]clean_shutdowns套件中的节点重新启动缓慢而发生无条件的降级。
- [服务器-42613](https://jira.mongodb.org/browse/SERVER-42613)getHashes应该默认为liveSlaves，而不是replsettest.js中的_slaves
- [服务器-42714](https://jira.mongodb.org/browse/SERVER-42714)在0级完成日志复制恢复oplog应用程序
- [服务器-42750](https://jira.mongodb.org/browse/SERVER-42750)OperationContext::inMultiDocumentTransaction()在恢复期间对准备的事务应用操作时不会返回true
- [服务器-42755](https://jira.mongodb.org/browse/SERVER-42755)recover_prepared_txn_with_multikey_write.js应确保重新启动节点后目录对象上不会产生准备冲突
- [服务器-42767](https://jira.mongodb.org/browse/SERVER-42767)改进ReplSetTest.stopSet中的登录
- [服务器-42910](https://jira.mongodb.org/browse/SERVER-42910)由于 afterClusterTime，时间戳较高但比同步源更低的Oplog查询不应超时
- [服务器-43016](https://jira.mongodb.org/browse/SERVER-43016)修复timetamped_reads_wait_for_prepare_oplog_visibility.js中的错别字，并检查nModified = 1
- [服务器-43230](https://jira.mongodb.org/browse/SERVER-43230)在catchup_takeover_two_nodes_ahead.js中修复比赛
- [服务器-43237](https://jira.mongodb.org/browse/SERVER-43237)replSetFreeze和replSetStepDown cmd在回滚测试中完成了一部分restartNode()/transitionToSteadyStateOperations()应具有网络错误的弹性。
- [服务器-43330](https://jira.mongodb.org/browse/SERVER-43330)ReplicationStateTransitionLockGuard::_unlock无法与其移动构造函数配合使用

### 查询

- [服务器-37690](https://jira.mongodb.org/browse/SERVER-37690)countDocuments在匹配0个文档时抛出错误
- [服务器-40110](https://jira.mongodb.org/browse/SERVER-40110)ClusterCursorManager::CursorEntry::isKillPending()不应调用checkForInterrupt
- [服务器-40382](https://jira.mongodb.org/browse/SERVER-40382)添加服务器状态指标以报告计划缓存内存消耗
- [服务器-41863](https://jira.mongodb.org/browse/SERVER-41863)在返回之前，让睡眠命令检查服务器时钟是否已提前
- [服务器-41996](https://jira.mongodb.org/browse/SERVER-41996)改进PlanExecutor错误日志记录
- [服务器-42399](https://jira.mongodb.org/browse/SERVER-42399)如果抛出异常，max_time_ms.js测试应始终禁用故障点
- [服务器-42514](https://jira.mongodb.org/browse/SERVER-42514)等待所有节点在text_index_limits.js中完成索引构建
- [服务器-42518](https://jira.mongodb.org/browse/SERVER-42518)当查询路径具有多个后续数组索引时，通配符索引计划会错过结果
- [服务器-42744](https://jira.mongodb.org/browse/SERVER-42744)修复交易历史记录迭代器，不要返回可能悬垂的无有BSON
- [服务器-42749](https://jira.mongodb.org/browse/SERVER-42749)禁止server_status_with_timeout_cursors进行事务直通
- [服务器-42864](https://jira.mongodb.org/browse/SERVER-42864)更改索引构建初始写入时间戳逻辑
- [服务器-43074](https://jira.mongodb.org/browse/SERVER-43074)在编写目录文档时，请勿使用全局变量对“multikeyPath”信息进行编码
- [服务器-43202](https://jira.mongodb.org/browse/SERVER-43202)聚合系统可以在中断后继续尝试执行查询计划，导致服务器致命的不变失败

### 集合

- [服务器-41770](https://jira.mongodb.org/browse/SERVER-41770)更改流支持大型事务的多版本测试
- [服务器-42756](https://jira.mongodb.org/browse/SERVER-42756)$multiply运算符可能会返回，但错误或不带错误，具体取决于是否启用了管道优化

### 目录

[服务器-42567](https://jira.mongodb.org/browse/SERVER-42567)从CollectionImpl和IndexCatalogImpl中删除魔法

### 储存

- [服务器-39708](https://jira.mongodb.org/browse/SERVER-39708)在IndexBuildInterceptor::sideWrite中快速无操作多键更新，以避免互斥获取
- [服务器-41533](https://jira.mongodb.org/browse/SERVER-41533)删除不必要的IndexConsistency::_classMutex
- [服务器-41534](https://jira.mongodb.org/browse/SERVER-41534)在RecordStoreValidateAdaptor中重用KeyString
- [服务器-41535](https://jira.mongodb.org/browse/SERVER-41535)使用矢量代替地图进行IndexConsistency::_indexesInfo
- [服务器-41536](https://jira.mongodb.org/browse/SERVER-41536)使用矢量而不是地图进行索引一致性哈希桶
- [服务器-41537](https://jira.mongodb.org/browse/SERVER-41537)使用64K哈希桶而不是4M进行索引验证
- [服务器-41538](https://jira.mongodb.org/browse/SERVER-41538)在IndexConsistency中通过indexNumber删除间接
- [服务器-41539](https://jira.mongodb.org/browse/SERVER-41539)IndexInfo中的缓存密钥排序
- [服务器-41540](https://jira.mongodb.org/browse/SERVER-41540)修复_indexNsResults地图使用
- [服务器-41909](https://jira.mongodb.org/browse/SERVER-41909)将ValidateCmd Genny工作负载添加到system_perf.yml
- [服务器-41937](https://jira.mongodb.org/browse/SERVER-41937)在TimetampMonitor::startup()或notifyAll()中添加try-catch块以抑制异常
- [服务器-41947](https://jira.mongodb.org/browse/SERVER-41947)不允许在rename命令中使用“system.views”集合名称作为源或目标名称
- [服务器-42060](https://jira.mongodb.org/browse/SERVER-42060)限制KeyString _appendBsonValue和toBsonValue的最大递归深度
- [服务器-42205](https://jira.mongodb.org/browse/SERVER-42205)将快照窗口的缓存压力阈值从50提高到95
- [服务器-42373](https://jira.mongodb.org/browse/SERVER-42373)删除不存在的集合时，防止出现“无效视图定义”错误
- [服务器-42441](https://jira.mongodb.org/browse/SERVER-42441)重命名CollectionForApplyOps应始终重命名目标（如果存在的话）
- [服务器-42652](https://jira.mongodb.org/browse/SERVER-42652)修复重命名集合的问题
- [服务器-42718](https://jira.mongodb.org/browse/SERVER-42718)dropDatabase命令可以同时运行，导致无效状态
- [服务器-42799](https://jira.mongodb.org/browse/SERVER-42799)获取无需noop写入即可清理索引构建的时间戳
- [服务器-42800](https://jira.mongodb.org/browse/SERVER-42800)跳过临时记录存储的大小调整，用于索引构建
- [服务器-42803](https://jira.mongodb.org/browse/SERVER-42803)在TimetampMonitor中删除“no except”
- [服务器-42824](https://jira.mongodb.org/browse/SERVER-42824)不要锁定RSTL进行索引构建清理
- [服务器-42869](https://jira.mongodb.org/browse/SERVER-42869)拦截器被销毁后，IndexBuildInterceptor回滚处理程序访问_sideWritesCounter字段
- [服务器-42915](https://jira.mongodb.org/browse/SERVER-42915)新风格修复的目录更正通常是假阳性，积极地将repl节点标记为损坏
- [服务器-43019](https://jira.mongodb.org/browse/SERVER-43019)IndexBuildsCoordinator在辅助时删除中断的索引构建
- [服务器-43025](https://jira.mongodb.org/browse/SERVER-43025)回滚应忽略无操作启动IndexBuild操作日志条目
- [服务器-43075](https://jira.mongodb.org/browse/SERVER-43075)MongoDB 4.2无法在yaml配置文件中使用storage.journal.commitIntervalMs参数。
- [服务器-43322](https://jira.mongodb.org/browse/SERVER-43322)添加用于测量OplogStones性能的跟踪工具

#### 有线老虎

- [服务器-39004](https://jira.mongodb.org/browse/SERVER-39004)引入溢出文件的配额机制

### 运营

- [服务器-41874](https://jira.mongodb.org/browse/SERVER-41874)切勿在并发_simultaneous_replication中杀死shell垃圾收集中的光标
- [服务器-42599](https://jira.mongodb.org/browse/SERVER-42599)回归阻止在没有listCollections特权的情况下使用“显示集合”
- [服务器-42969](https://jira.mongodb.org/browse/SERVER-42969)在“USERPROFILE”环境变量中处理非ascii字符。
- [服务器-43005](https://jira.mongodb.org/browse/SERVER-43005)getKeyVault.createKey()应该返回创建的数据密钥
- [服务器-43039](https://jira.mongodb.org/browse/SERVER-43039)db.collection.bulkWrite不支持替换提示One
- [服务器-43265](https://jira.mongodb.org/browse/SERVER-43265)使用URI压缩机参数时，Mongo Shell退出时出现InvalidOptions错误

### 构建和包装

- [服务器-37768](https://jira.mongodb.org/browse/SERVER-37768)平台支持：添加社区和企业Debian 10 x64
- [服务器-37772](https://jira.mongodb.org/browse/SERVER-37772)平台支持：添加社区和企业RHEL 8 x64
- [服务器-41232](https://jira.mongodb.org/browse/SERVER-41232)更新手册页
- [服务器-41431](https://jira.mongodb.org/browse/SERVER-41431)平台支持：重新启用SUSE 15构建变体
- [服务器-41570](https://jira.mongodb.org/browse/SERVER-41570)Xcode 11 会生成新的警告
- [服务器-42778](https://jira.mongodb.org/browse/SERVER-42778)hot_backups应该使用RHEL 7大号
- [服务器-42787](https://jira.mongodb.org/browse/SERVER-42787)4.2.0回归（vs 4.0.12）：使用各种系统包构建失败
- [服务器-42911](https://jira.mongodb.org/browse/SERVER-42911)通过 building.md 重建 mongodb，但由于 ModuleNotFoundError 导致无法构建：Windows 上没有名为“猎豹”的模块，上面有 MSVC
- [服务器-43046](https://jira.mongodb.org/browse/SERVER-43046)使用工具链python二进制文件创建虚拟环境

### 内部人员

- [服务器-25025](https://jira.mongodb.org/browse/SERVER-25025)当WiredTiger上有数万个集合/索引时，缩短启动时间
- [服务器-36816](https://jira.mongodb.org/browse/SERVER-36816)在dbhash检查期间，避免在主目录和次要上重新加载视图目录
- [服务器-39776](https://jira.mongodb.org/browse/SERVER-39776)初始同步和复制线程同时启动和关机竞赛
- [服务器-40004](https://jira.mongodb.org/browse/SERVER-40004)更改AtomicWord::compareAndSwap的签名以模拟实现
- [服务器-41466](https://jira.mongodb.org/browse/SERVER-41466)Blacklist mongos_no_detect_sharding from sharding_csrs_continuous_config_stepdown
- [服务器-41492](https://jira.mongodb.org/browse/SERVER-41492)禁用WiredTiger光标缓存，并在测试中引入更积极的文件句柄扫描
- [服务器-41585](https://jira.mongodb.org/browse/SERVER-41585)background_thread_clock_source_test不应该假设我们可以安排背景线程
- [服务器-41622](https://jira.mongodb.org/browse/SERVER-41622)减少flow_control_replica_set.js中的噪音
- [服务器-41802](https://jira.mongodb.org/browse/SERVER-41802)generate_resmoke_tasks不应用max_sub_suites选项
- [服务器-41939](https://jira.mongodb.org/browse/SERVER-41939)先连接到最快的LDAP服务器
- [服务器-42067](https://jira.mongodb.org/browse/SERVER-42067)确保按键排序偏移量不超过复合索引键的最大数量
- [服务器-42069](https://jira.mongodb.org/browse/SERVER-42069)在KeyString V0中编码十进制类型时
- [服务器-42075](https://jira.mongodb.org/browse/SERVER-42075)将DSI模块添加到perf.yml
- [服务器-42178](https://jira.mongodb.org/browse/SERVER-42178)在SLES上禁用Split Horizon HOSTALIAS测试
- [服务器-42210](https://jira.mongodb.org/browse/SERVER-42210)修改多个数据库上的更改流测试以支持交错
- [服务器-42216](https://jira.mongodb.org/browse/SERVER-42216)确保pin_getmore_cursor.js等待服务器完成杀死光标
- [服务器-42303](https://jira.mongodb.org/browse/SERVER-42303)NetworkInterfaceTL应该立即离线调度，再也不会了
- [服务器-42305](https://jira.mongodb.org/browse/SERVER-42305)在心跳中推进提交点之前，需要确保复制完成初始化
- [服务器-42310](https://jira.mongodb.org/browse/SERVER-42310)在hang_analyzer.py中指定NamedTemporaryFile的模式
- [服务器-42356](https://jira.mongodb.org/browse/SERVER-42356)拆解（完成=真实）从未需要NoOpFixture
- [服务器-42400](https://jira.mongodb.org/browse/SERVER-42400)在system_perf.yml中添加新任务，用于事务工作负载中的百万个文档
- [服务器-42419](https://jira.mongodb.org/browse/SERVER-42419)禁止在大多数读取关注的情况下运行 whole_cluster_metadata_notifications 测试
- [服务器-42424](https://jira.mongodb.org/browse/SERVER-42424)来自定期杀死次要套件的黑名单max_doc_size.js和mr_bigobject.js
- [服务器-42440](https://jira.mongodb.org/browse/SERVER-42440)burn_in_test应该在它们通常运行的发行版上运行任务
- [服务器-42452](https://jira.mongodb.org/browse/SERVER-42452)failNonIntentLocksIfWaitNeed failpoint在UninterruptibleLockGuard中中断锁定请求
- [服务器-42461](https://jira.mongodb.org/browse/SERVER-42461)允许在SERVER-29446中聚合_during_balancing.js待处理工作中的错误
- [服务器-42469](https://jira.mongodb.org/browse/SERVER-42469)将初始同步通过超时增加到24小时
- [服务器-42476](https://jira.mongodb.org/browse/SERVER-42476)改进免费监控测试
- [服务器-42520](https://jira.mongodb.org/browse/SERVER-42520)$changeStream聚合的自动加密失败，错误模糊
- [服务器-42561](https://jira.mongodb.org/browse/SERVER-42561)search_beta_*测试仅在测试更改时失败
- [服务器-42571](https://jira.mongodb.org/browse/SERVER-42571)在动力循环期间在远程计算机上收集Windows事件日志
- [服务器-42608](https://jira.mongodb.org/browse/SERVER-42608)允许updateOne和updateMany在shell助手中接受提示
- [服务器-42615](https://jira.mongodb.org/browse/SERVER-42615)每个电源循环循环后，在Windows上运行chkdsk命令
- [服务器-42622](https://jira.mongodb.org/browse/SERVER-42622)resmoke.py不会试图拆毁夹具，如果设置它会引发异常
- [服务器-42623](https://jira.mongodb.org/browse/SERVER-42623)Python 3中的sched模块导致close()事件被错误地取消，导致resmoke.py挂起
- [服务器-42837](https://jira.mongodb.org/browse/SERVER-42837)允许waitInFindBeforeBatch FailPoint获取data.nss参数
- [服务器-42866](https://jira.mongodb.org/browse/SERVER-42866)在运行测试之前，对ShardedCluster测试夹具中的所有碎片触发逻辑会话缓存刷新
- [服务器-42888](https://jira.mongodb.org/browse/SERVER-42888)不建议在mapReduce命令中使用CodeWScope
- [服务器-42917](https://jira.mongodb.org/browse/SERVER-42917)在延迟计算过程中，流量控制应忽略有缺陷的挂钟时间读数
- [服务器-42946](https://jira.mongodb.org/browse/SERVER-42946)使用现有事务表将4.2 FCV单独设置为MongoDB崩溃
- [服务器-42953](https://jira.mongodb.org/browse/SERVER-42953)ttl_repl_secondary_disabled.js应该阻止选举
- [服务器-43004](https://jira.mongodb.org/browse/SERVER-43004)在分片套件中打开zbigMapReduce的存档
- [服务器-43022](https://jira.mongodb.org/browse/SERVER-43022)允许编译在rel 62上独立运行
- [服务器-43081](https://jira.mongodb.org/browse/SERVER-43081)验证应该报告何时设置索引的“multikeyPaths”，但“multikey”标志是false
- [服务器-43093](https://jira.mongodb.org/browse/SERVER-43093)对ShardingReplicaSetChangeListener::onConfirmedSet的并发调用可能会导致固定执行器的饥饿
- [服务器-43166](https://jira.mongodb.org/browse/SERVER-43166)auditFormat BSON写入不完整的bson
- [服务器-43186](https://jira.mongodb.org/browse/SERVER-43186)限制添加到生成套件的测试数量
- [服务器-43200](https://jira.mongodb.org/browse/SERVER-43200)使auth/mongoURIAuth.js对慢速命令进行鲁棒
- [服务器-43288](https://jira.mongodb.org/browse/SERVER-43288)更新生成任务的回退值





原文 - [4.2 Changelog]( https://docs.mongodb.com/manual/release-notes/4.2-changelog/ )

