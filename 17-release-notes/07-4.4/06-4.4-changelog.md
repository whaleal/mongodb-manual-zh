# 4.4 更改日志

## 4.4.18 更改日志

### 查询

- [服务器-50454](https://jira.mongodb.org/browse/SERVER-50454)避免将“keyValue”字段发送给重复密钥错误的驱动程序
- [服务器-66289](https://jira.mongodb.org/browse/SERVER-66289)$out错误地在v5.0.8上抛出BSONObj大小错误

### 运营

[服务器-67793](https://jira.mongodb.org/browse/SERVER-67793)init.d中的log_progress_msg不会打印消息

### 构建和包装

[服务器-48203](https://jira.mongodb.org/browse/SERVER-48203)支持Ninja构建的安装操作

### 内部人员

- [服务器-56368](https://jira.mongodb.org/browse/SERVER-56368)禁止在集合聚合上运行$backupCursor/$backupCursorExtend
- [服务器-58673](https://jira.mongodb.org/browse/SERVER-58673)启用 featureFlagPerShardCursor
- [服务器-61185](https://jira.mongodb.org/browse/SERVER-61185)使用prefix_search进行唯一的索引查找
- [服务器-62400](https://jira.mongodb.org/browse/SERVER-62400)将$_passthroughToShard参数添加到AggregateCommandRequest
- [服务器-62681](https://jira.mongodb.org/browse/SERVER-62681)根据碎片光标直通套件创建更改流
- [服务器-62738](https://jira.mongodb.org/browse/SERVER-62738)赋予蒙古人通过特定碎片的能力
- [服务器-63585](https://jira.mongodb.org/browse/SERVER-63585)当删除回滚和另一个事务删除相同的行时，Fastcount会不同步
- [服务器-63772](https://jira.mongodb.org/browse/SERVER-63772)批处理后恢复令牌未从每个碎片光标更改流的初始批次发送
- [服务器-63773](https://jira.mongodb.org/browse/SERVER-63773)Per Shard cursor post batch resume token not set in get更多回复
- [服务器-63774](https://jira.mongodb.org/browse/SERVER-63774)通过可选的dbVersion来运行PipelineOnSpecificShard
- [服务器-63781](https://jira.mongodb.org/browse/SERVER-63781)$sortKey没有从后批处理恢复令牌中筛选出来
- [服务器-68115](https://jira.mongodb.org/browse/SERVER-68115)修复了“elemMatchRootLength > 0”不变触发器的错误
- [服务器-68126](https://jira.mongodb.org/browse/SERVER-68126)在AutoSplitVector中检查负maxChunkSize输入值
- [服务器-68470](https://jira.mongodb.org/browse/SERVER-68470)由于缺少阴影实用工具，Amazon Linux 4.2/4.4 RPM无法安装
- [服务器-69001](https://jira.mongodb.org/browse/SERVER-69001)初始同步应将minValid文档设置为“stopTimestamp”
- [服务器-69003](https://jira.mongodb.org/browse/SERVER-69003)[4.4] backport pm-2419 通过蒙古每个碎片光标
- [服务器-69133](https://jira.mongodb.org/browse/SERVER-69133)删除硬链接安装操作的冗余设置
- [服务器-69281](https://jira.mongodb.org/browse/SERVER-69281)强制最小忍者版本
- [服务器-69348](https://jira.mongodb.org/browse/SERVER-69348)命令必须声明空的身份验证检查才能普遍调用
- [服务器-69389](https://jira.mongodb.org/browse/SERVER-69389)命令checkAuthorization可能会为现有集合抛出ErrorCodes::NamespaceNotFound，同时尝试在节点关闭时将UUID重新解析为命名空间。
- [服务器-69443](https://jira.mongodb.org/browse/SERVER-69443)[4.4]当--enableMajorityReadConcern=false时，允许在多文档txns中进行投机多数读取
- [服务器-69446](https://jira.mongodb.org/browse/SERVER-69446)增加选举TimeoutMillis injstests/replsets/dbcheck_write_concern.js
- [服务器-69569](https://jira.mongodb.org/browse/SERVER-69569)Python脚本在Evergreen任务中失败
- [服务器-69785](https://jira.mongodb.org/browse/SERVER-69785)robustify change_streams_per_shard_cursor.js
- [服务器-69868](https://jira.mongodb.org/browse/SERVER-69868)启动关机的TransportLayer时返回错误
- [服务器-69912](https://jira.mongodb.org/browse/SERVER-69912)SConstruct可以错误地执行
- [服务器-70235](https://jira.mongodb.org/browse/SERVER-70235)如果集合uuid不匹配，请勿在v4.2-v4.4升级时创建范围删除文档
- [服务器-70299](https://jira.mongodb.org/browse/SERVER-70299)删除JSON.send命令用法
- [服务器-70348](https://jira.mongodb.org/browse/SERVER-70348)删除可查询WT的EAGAIN，并在内部重试
- [服务器-70398](https://jira.mongodb.org/browse/SERVER-70398)当不存在执行时处理案例
- [服务器-70469](https://jira.mongodb.org/browse/SERVER-70469)在看门狗测试中使用虚拟env python
- [服务器-70483](https://jira.mongodb.org/browse/SERVER-70483)更新Resmoke，将“evergreen_execution”传递给日志管理员。
- [服务器-70484](https://jira.mongodb.org/browse/SERVER-70484)从perf.yml和sys_perf.yml中删除信号处理模块
- [服务器-70633](https://jira.mongodb.org/browse/SERVER-70633)制作每个碎片光标套件实际上在5.0中运行测试
- [服务器-70938](https://jira.mongodb.org/browse/SERVER-70938)从虚拟env设置中删除--system-site-packages
- [WT-7912](https://jira.mongodb.org/browse/WT-7912)修复优化附近的前缀搜索，以处理按键范围跨页面分割的场景。



## 4.4.17 更改日志

## 分片

- [服务器-50898](https://jira.mongodb.org/browse/SERVER-50898)safe_secondary_reads_causal_consistency.js必须等待_configsvrCommitChunkMigration的效果成为所有CSRS成员的多数提交快照
- [服务器-56127](https://jira.mongodb.org/browse/SERVER-56127)如果块被迁移，并且分键模式使用嵌套字段，可重试更新可能会执行多次
- [服务器-63732](https://jira.mongodb.org/browse/SERVER-63732)将新的隐式CreateIndex和exlectionUniquenessCheck添加到shardCollection命令
- [服务器-64142](https://jira.mongodb.org/browse/SERVER-64142)添加新的 enforceUniqueness 来 refineCollectionShardKey 命令
- [服务器-69220](https://jira.mongodb.org/browse/SERVER-69220)refineCollectionShardKey允许在基于范围和散列之间切换当前碎片密钥字段，导致数据不一致
- [服务器-69228](https://jira.mongodb.org/browse/SERVER-69228)chunk_migration_with_schema_validation.js多版本测试套件失败（v4.4和v4.2）

### 运营

[服务器-68548](https://jira.mongodb.org/browse/SERVER-68548)mongo shell版本4.4.15记录asio消息，尽管--安静的旗帜

### 内部人员

- [服务器-52676](https://jira.mongodb.org/browse/SERVER-52676)对冲读取应该忽略陈旧错误
- [服务器-61275](https://jira.mongodb.org/browse/SERVER-61275)在会话缓存关闭后销毁大小存储器
- [服务器-64573](https://jira.mongodb.org/browse/SERVER-64573)使隐式创建索引和强制执行独特性检查字段可选
- [服务器-64741](https://jira.mongodb.org/browse/SERVER-64741)Create mongos appendOplogNote命令
- [服务器-65382](https://jira.mongodb.org/browse/SERVER-65382)AutoSplitVector不应使用clientReadable对碎片键字段进行重新排序
- [服务器-67465](https://jira.mongodb.org/browse/SERVER-67465)确保超时不会失败对冲操作
- [服务器-68039](https://jira.mongodb.org/browse/SERVER-68039)MongoDB v5.0上的旧pymongo版本3.10.1导致对等体重置连接后不变故障（message.operation() == dbMsg）
- [服务器-68691](https://jira.mongodb.org/browse/SERVER-68691)$graphLookup不会报告“restrictSearchWithMatch”过滤器的变量引用
- [服务器-68694](https://jira.mongodb.org/browse/SERVER-68694)调查紧凑型命令周围的锁定
- [服务器-68766](https://jira.mongodb.org/browse/SERVER-68766)添加重新启用单值MapReduce优化的选项
- [服务器-68925](https://jira.mongodb.org/browse/SERVER-68925)在启动时重新引入检查表日志记录设置（恢复SERVER-43664）
- [服务器-69268](https://jira.mongodb.org/browse/SERVER-69268)在burn_in_tags_gen期间禁用旁路编译
- [服务器-69590](https://jira.mongodb.org/browse/SERVER-69590)叮当手臂平台上的libunwind警告
- [服务器-69611](https://jira.mongodb.org/browse/SERVER-69611)默认情况下设置-ffp-contract=off编译器选项
- [WT-9302](https://jira.mongodb.org/browse/WT-9302)在api_data.py中不建议使用object_target_size作为配置
- [WT-9311](https://jira.mongodb.org/browse/WT-9311)确保日志消息清楚地识别存储硬件损坏
- [WT-9477](https://jira.mongodb.org/browse/WT-9477)不要允许检查点触发内部页面拆分，这会导致检查站内部页面损坏
- [WT-9870](https://jira.mongodb.org/browse/WT-9870)修复在恢复期间更新旧时间戳时更新固定时间戳的问题



## 4.4.16 更改日志

### 分片

- [服务器-40865](https://jira.mongodb.org/browse/SERVER-40865)ShardServerCatalogCacheLoader不会将读取操作与同一集合的其他操作序列化
- [服务器-51056](https://jira.mongodb.org/browse/SERVER-51056)禁用 refine_collection_shard_key_atomic.js，从在sharding_csrs_continuous_config_stepdown套件中运行
- [服务器-56185](https://jira.mongodb.org/browse/SERVER-56185)调查会话迁移和块迁移关键部分的可能改进
- [服务器-58747](https://jira.mongodb.org/browse/SERVER-58747)ShardServerCatalogCacheLoader不会在升级时中断正在进行的操作
- [服务器-62656](https://jira.mongodb.org/browse/SERVER-62656)从mongos到shard-server连接池大小的分组mongos-to-config-server连接池大小
- [服务器-63243](https://jira.mongodb.org/browse/SERVER-63243)范围删除器不得以循环方式清理孤儿范围
- [服务器-67492](https://jira.mongodb.org/browse/SERVER-67492)失败的块迁移可能导致接收者碎片在主和次要之间有不同的config.transactions记录

### 查询

[服务器-67012](https://jira.mongodb.org/browse/SERVER-67012)复合索引特定组合的命令错误

### JavaScript

[服务器-61234](https://jira.mongodb.org/browse/SERVER-61234)当服务器端JS函数直接返回时，基于JS对象的类型没有正确自动序列化

### 运营

[服务器-50138](https://jira.mongodb.org/browse/SERVER-50138)服务器为每个绑定套接字记录警告：“在NetworkInterface启动期间没有配置TransportLayer”

### 构建和包装

- [服务器-61894](https://jira.mongodb.org/browse/SERVER-61894)支持更改流规格中的“showRawUpdateDescription”选项
- [服务器-63159](https://jira.mongodb.org/browse/SERVER-63159)实现$_internalApplyOplogUpdate聚合阶段

### 内部人员

- [服务器-52641](https://jira.mongodb.org/browse/SERVER-52641)indexbg_restart_secondary.js应该等待所有三个索引构建开始，然后再重新启动辅助
- [服务器-58176](https://jira.mongodb.org/browse/SERVER-58176)Mongos无法验证readConcern对插入/更新/删除命令
- [服务器-59658](https://jira.mongodb.org/browse/SERVER-59658)改进日志记录，以反映等待复制的分片元数据刷新
- [服务器-60334](https://jira.mongodb.org/browse/SERVER-60334)避免在WiredTigerSizeStorer中缓存光标和会话
- [服务器-60607](https://jira.mongodb.org/browse/SERVER-60607)改进地理索引版本的大/NaN值的处理
- [服务器-60958](https://jira.mongodb.org/browse/SERVER-60958)当发生降级事件时，避免服务器挂起块迁移
- [服务器-61321](https://jira.mongodb.org/browse/SERVER-61321)改进了文本索引版本对大/NaN值的处理
- [服务器-64244](https://jira.mongodb.org/browse/SERVER-64244)RunDBCheckInBackground应该能够抵御中断
- [服务器-64403](https://jira.mongodb.org/browse/SERVER-64403)使用SORT_MERGE整理-编码缺失的排序属性查找查询
- [服务器-64659](https://jira.mongodb.org/browse/SERVER-64659)在服务器中报告索引构建期间使用的文件描述符数量
- [服务器-64797](https://jira.mongodb.org/browse/SERVER-64797)使用WT的新数字时间戳API
- [服务器-65262](https://jira.mongodb.org/browse/SERVER-65262)扩展使用WT数字时间戳API
- [服务器-65399](https://jira.mongodb.org/browse/SERVER-65399)“commitIndexBuild”操作日志条目是未重新启动的未完成索引构建的禁止操作
- [服务器-66310](https://jira.mongodb.org/browse/SERVER-66310)让ExpressionSetUnion::isCommutative()整理意识到
- [服务器-66418](https://jira.mongodb.org/browse/SERVER-66418)由于字符串顺序假设，依赖分析期间创建的不良投影
- [服务器-66461](https://jira.mongodb.org/browse/SERVER-66461)在构建过程中更早地运行公证
- [服务器-66548](https://jira.mongodb.org/browse/SERVER-66548)$lookup顺序缓存可能会错误地将$facet视为无关
- [服务器-66556](https://jira.mongodb.org/browse/SERVER-66556)在关机期间释放光标时防止潜在的竞争
- [服务器-66621](https://jira.mongodb.org/browse/SERVER-66621)从4.4降级到4.2时，主节点卡住等待次要完成indexBuild
- [服务器-66651](https://jira.mongodb.org/browse/SERVER-66651)角色“恢复”不足以进行蒙古恢复 --preserveUUID
- [服务器-66726](https://jira.mongodb.org/browse/SERVER-66726)修复killAllSessionsByPattern中的序列化
- [服务器-66841](https://jira.mongodb.org/browse/SERVER-66841)LOGV2：在反斜杠字符发生截断时无效的JSON
- [服务器-66938](https://jira.mongodb.org/browse/SERVER-66938)大幅简化命令以生成忍者文件
- [服务器-67122](https://jira.mongodb.org/browse/SERVER-67122)使用--module=ninja构建时添加警告，提示它被弃用
- [服务器-67164](https://jira.mongodb.org/browse/SERVER-67164)修复软件包测试v4.4
- [服务器-67220](https://jira.mongodb.org/browse/SERVER-67220)[5.0] set_fcv_prepared_transaction.js无法抵御 StaleConfig 错误
- [服务器-67296](https://jira.mongodb.org/browse/SERVER-67296)将用于提交块相关DDL操作的configsvr命令的OpCtx标记为可中断
- [服务器-67302](https://jira.mongodb.org/browse/SERVER-67302)“在没有读取时间戳或PBWM锁的情况下从复制集合中读取”随着时钟更改而崩溃
- [服务器-67398](https://jira.mongodb.org/browse/SERVER-67398)具有传统安装模式的构建被破坏了
- [服务器-67532](https://jira.mongodb.org/browse/SERVER-67532)在OplogServerStatusSection中失败更少
- [服务器-67662](https://jira.mongodb.org/browse/SERVER-67662)[4.4] evergreen.yml "scons lint" 无法处理 is_patch 变量的空字符串
- [服务器-67683](https://jira.mongodb.org/browse/SERVER-67683)在快速和选择构建中更改一些模式
- [服务器-67993](https://jira.mongodb.org/browse/SERVER-67993)修复4.4 pylinters错误
- [服务器-68130](https://jira.mongodb.org/browse/SERVER-68130)AutoSplitVector可以生成比BSONObjMaxUserSize更大的响应
- [服务器-68158](https://jira.mongodb.org/browse/SERVER-68158)serverstatus_indexbulkbuilder.js应在创建索引后在主服务器上运行listIndexes
- [服务器-68184](https://jira.mongodb.org/browse/SERVER-68184)在checkWritesOfCommittedTxns中索引时使用Number而不是NumberLong
- [服务器-68359](https://jira.mongodb.org/browse/SERVER-68359)[4.4]如果过期后秒是NaN，则防止TTLMonitor处理索引
- [服务器-68418](https://jira.mongodb.org/browse/SERVER-68418)[4.4] index_build_restart_secondary.js不支持单相索引构建
- [服务器-68487](https://jira.mongodb.org/browse/SERVER-68487)添加BSONElement方法来检查NaN字段值
- [服务器-68540](https://jira.mongodb.org/browse/SERVER-68540)为jscore测试添加docker_incompatible标签
- [服务器-68574](https://jira.mongodb.org/browse/SERVER-68574)切换到新的日志保存人集群
- [WT-9029](https://jira.mongodb.org/browse/WT-9029)从WT_SESSION::create中删除object_target_size选项
- [WT-9096](https://jira.mongodb.org/browse/WT-9096)修复了有时在密钥不存在时返回错误的键/值附近的搜索



## 4.4.15 更改日志

### 分片

- [服务器-51064](https://jira.mongodb.org/browse/SERVER-51064)在random_moveChunk_index_operations.js中将“目的地碎片不能与源相同”作为可接受的错误
- [服务器-61249](https://jira.mongodb.org/browse/SERVER-61249)refine_collection_shard_key_basic.js依赖于尽最大努力的刷新，这在故障转移的情况下可能不会发生
- [服务器-62175](https://jira.mongodb.org/browse/SERVER-62175)Mongos未能为在_parseCommand中断的命令附加RetryableWrite错误标签
- [服务器-62272](https://jira.mongodb.org/browse/SERVER-62272)向集合中添加模式验证可以防止失败文档的块迁移
- [服务器-65821](https://jira.mongodb.org/browse/SERVER-65821)当有准备好的交易没有持续提交/侵权决策时，setFCV期间处于僵局
- [服务器-66041](https://jira.mongodb.org/browse/SERVER-66041)块克隆器绝不能认为只有一份文件的块太大

### 查询

[服务器-63642](https://jira.mongodb.org/browse/SERVER-63642)添加serverStatus指标来衡量多规划性能

### 构建和包装

- [服务器-42470](https://jira.mongodb.org/browse/SERVER-42470)为libunwind生成其他配置
- [服务器-64332](https://jira.mongodb.org/browse/SERVER-64332)公证MongoDB为macos构建

### 内部人员

* [服务器-54900](https://jira.mongodb.org/browse/SERVER-54900)阻止网络呼叫可能会无限期地延迟同步源解析

- [服务器-55173](https://jira.mongodb.org/browse/SERVER-55173)WiredTigerSession::releaseCursor中的分割故障
- [服务器-58506](https://jira.mongodb.org/browse/SERVER-58506)命令公开服务器参数的可设置性
- [服务器-60758](https://jira.mongodb.org/browse/SERVER-60758)防止dbVersion刷新在txn_recover_decision_using_recovery_router.js中失败的事务
- [服务器-61018](https://jira.mongodb.org/browse/SERVER-61018)创建通用直方图类型
- [服务器-61095](https://jira.mongodb.org/browse/SERVER-61095)改进transit_layer_asio_test.cpp
- [服务器-61097](https://jira.mongodb.org/browse/SERVER-61097)SizeStorer可能会因缓存删除而死锁
- [服务器-61856](https://jira.mongodb.org/browse/SERVER-61856)将libunwind升级到1.6.2+
- [服务器-62941](https://jira.mongodb.org/browse/SERVER-62941)更新FTDCServerStatusCommandCollector，以包含来自serverStatus命令的oplog指标
- [服务器-62992](https://jira.mongodb.org/browse/SERVER-62992)消除对resmoke.ini的需求
- [服务器-63421](https://jira.mongodb.org/browse/SERVER-63421)[v4.4] 放松术语限制检查副本，以检查长长的边界，而不是int
- [服务器-63479](https://jira.mongodb.org/browse/SERVER-63479)在碎片环境中更正$$SEARCH_META禁令
- [服务器-64184](https://jira.mongodb.org/browse/SERVER-64184)跟踪 allowDiskUse:true in agg 命令的使用情况
- [服务器-64664](https://jira.mongodb.org/browse/SERVER-64664)忍者工具不应考虑安装文件生成的源代码
- [服务器-65024](https://jira.mongodb.org/browse/SERVER-65024)具有相同_id值的多个文档使reIndex不变
- [服务器-65131](https://jira.mongodb.org/browse/SERVER-65131)禁用机会主义阅读定位（对冲读取除外）
- [服务器-65166](https://jira.mongodb.org/browse/SERVER-65166)在bort_in_progress_transactions_on_step_up.js中使用比较优化
- [服务器-65271](https://jira.mongodb.org/browse/SERVER-65271)serverStatus应该允许细粒度指标排除
- [服务器-65636](https://jira.mongodb.org/browse/SERVER-65636)取消每个主机LDAP连接数量的限制
- [服务器-65995](https://jira.mongodb.org/browse/SERVER-65995)减少老树枝上的常青克朗频率
- [服务器-66087](https://jira.mongodb.org/browse/SERVER-66087)在启用线程之前调用curl_global_init
- [服务器-66089](https://jira.mongodb.org/browse/SERVER-66089)初始同步应该与稍后的后ClusterTime一起读取交易表
- [服务器-66111](https://jira.mongodb.org/browse/SERVER-66111)HTTPClient的Curl实现应尊重默认超时
- [服务器-66176](https://jira.mongodb.org/browse/SERVER-66176)[v4.4/v4.2] 尽量减少CollectionCatalog互斥下的工作
- [服务器-66319](https://jira.mongodb.org/browse/SERVER-66319)dbcheck_no_history_on_secondary.js过早禁用dbCheck故障点
- [服务器-66433](https://jira.mongodb.org/browse/SERVER-66433)后端口截止日期等待重叠范围删除完成到v5.1之前的版本
- [服务器-66466](https://jira.mongodb.org/browse/SERVER-66466)删除TransportLayerASIOTest对ThreadContext的依赖
- [服务器-66559](https://jira.mongodb.org/browse/SERVER-66559)将内部QueryMaxAddToSetBytes参数从32位扩展到64位
- [服务器-66799](https://jira.mongodb.org/browse/SERVER-66799)修复ephemeralForTest上的 getParameterWithDetails.js故障
- [服务器-66955](https://jira.mongodb.org/browse/SERVER-66955)删除perf项目中的JSON.send使用情况
- [服务器-67017](https://jira.mongodb.org/browse/SERVER-67017)在shard_existing_coll_chunk_count.js中再考虑一个块（v4.4）
- [服务器-67212](https://jira.mongodb.org/browse/SERVER-67212)修复transit_layer_asio_test中的数据竞赛
- [WT-8622](https://jira.mongodb.org/browse/WT-8622)在恢复开始时阅读last_ckpt_base_write_gen
- [WT-9054](https://jira.mongodb.org/browse/WT-9054)在format.sh中正确配置拆分应力选项



## 4.4.14 更改日志

### 分片

[服务器-55429](https://jira.mongodb.org/browse/SERVER-55429)当接收器没有清理重叠范围时，提前中止迁移

### TTL

[服务器-52724](https://jira.mongodb.org/browse/SERVER-52724)在TTL工作完成后，增量TTL通过服务器状态指标

### 内部人员

- [服务器-44847](https://jira.mongodb.org/browse/SERVER-44847)清理IDL文件中附加到不同命令和计数命令的显式“评论”字段名称
- [服务器-56003](https://jira.mongodb.org/browse/SERVER-56003)忍者+带有不断变化的编译器的冰淇淋不会再生run-icecc.sh
- [服务器-57000](https://jira.mongodb.org/browse/SERVER-57000)修复相关管道与面的处理
- [服务器-57037](https://jira.mongodb.org/browse/SERVER-57037)提高操作员计数器的精度
- [服务器-57676](https://jira.mongodb.org/browse/SERVER-57676)在oplog_rollover.js中发布“hangOplogCapMaintainerThread”之前，请等待检查站
- [服务器-58310](https://jira.mongodb.org/browse/SERVER-58310)当任务取消大约在收到排气网络响应的同时发生时，ThreadPoolTaskExecutor内存不安全
- [服务器-59435](https://jira.mongodb.org/browse/SERVER-59435)在DocumentSource::optimizeAt()中修复双免费
- [服务器-60412](https://jira.mongodb.org/browse/SERVER-60412)主机内存限制检查不尊重cgroups v2
- [服务器-61769](https://jira.mongodb.org/browse/SERVER-61769)尝试在分片集群上的事务中运行$out或$merge的聚合会使空闲光标打开
- [服务器-62229](https://jira.mongodb.org/browse/SERVER-62229)修复在re recoverFromOplogAsStandalone=true时应用索引构建条目时的不变问题
- [服务器-62242](https://jira.mongodb.org/browse/SERVER-62242)$indexOfArray不适用于数组中的重复值
- [服务器-63315](https://jira.mongodb.org/browse/SERVER-63315)Count命令只接受字符串注释，但应该接受4.4中的任何BSON类型
- [服务器-63497](https://jira.mongodb.org/browse/SERVER-63497)修复冰淇淋调试
- [服务器-63974](https://jira.mongodb.org/browse/SERVER-63974)其危险python依赖性的别针版本
- [服务器-64079](https://jira.mongodb.org/browse/SERVER-64079)$search命令在FCV 4.2的4.4二进制文件中失败
- [服务器-64202](https://jira.mongodb.org/browse/SERVER-64202)[4.4]如果主服务器看不到大多数副本集，initial_sync_aborts_two_phase_index_builds_hide_index.js可能会失败
- [服务器-64304](https://jira.mongodb.org/browse/SERVER-64304)使用--recoverFromOplogAsStandalone可能会导致索引构建崩溃服务器
- [服务器-64410](https://jira.mongodb.org/browse/SERVER-64410)调查当存储源在$search中为真时，我们是否需要在searchScore上排序
- [服务器-64554](https://jira.mongodb.org/browse/SERVER-64554)abortIndexBuild操作日志条目在使用--recoverFromOplogAsStandalone运行时没有效果
- [服务器-64757](https://jira.mongodb.org/browse/SERVER-64757)改进了Windows上scons无法生成忍者时的错误消息
- [服务器-64772](https://jira.mongodb.org/browse/SERVER-64772)在index_killop_after_stepdown.js中，不要在stepdown之前完成索引构建
- [服务器-64983](https://jira.mongodb.org/browse/SERVER-64983)在TransactionParticipant::_resetTransactionState中回滚WT事务之前释放客户端锁
- [服务器-65032](https://jira.mongodb.org/browse/SERVER-65032)Pin python软件包BaseResponse for ocsp套件
- [服务器-65421](https://jira.mongodb.org/browse/SERVER-65421)修复RHEL 6/7上的软件包测试失败
- [服务器-65422](https://jira.mongodb.org/browse/SERVER-65422)修复Ubuntu 16.04上的软件包测试失败
- [服务器-65690](https://jira.mongodb.org/browse/SERVER-65690)[v4.4] 跳过单相索引构建变体的 backup_restore_abort_and_start_index_build.js
- [服务器-65718](https://jira.mongodb.org/browse/SERVER-65718)修复mypy错误
- [WT-8074](https://jira.mongodb.org/browse/WT-8074)如果将内容插入历史记录失败，则对和解时会惊慌失措
- [WT-8149](https://jira.mongodb.org/browse/WT-8149)更新元数据打捞csuite测试，以处理打捞表元数据，而无需打捞文件元数据
- [WT-8198](https://jira.mongodb.org/browse/WT-8198)将批量负载光标切换到划痕缓冲区
- [WT-8270](https://jira.mongodb.org/browse/WT-8270)更新时间窗口清除过时的对账阶段，以正确考虑全局可见性。
- [WT-8362](https://jira.mongodb.org/browse/WT-8362)当OOO墓碑写入数据存储时，删除或重写密钥的HS条目
- [WT-8422](https://jira.mongodb.org/browse/WT-8422)如果磁盘上的单元格已过时，请清除磁盘单元格时间窗口
- [WT-8450](https://jira.mongodb.org/browse/WT-8450)在hs_cleanup_stress中报告统计数据，不要验证它们
- [WT-8598](https://jira.mongodb.org/browse/WT-8598)避免在关机时始终清理检查站
- [WT-8649](https://jira.mongodb.org/browse/WT-8649)除非重置或关闭，否则WT_SESSION方法无法释放划痕缓冲区
- [WT-8708](https://jira.mongodb.org/browse/WT-8708)修复测试/检查点中的时间戳使用错误
- [WT-8743](https://jira.mongodb.org/browse/WT-8743)配置hs_cleanup配置以减少缓存的压力
- [WT-8753](https://jira.mongodb.org/browse/WT-8753)回滚内存、准备就绪、对账更新时添加墓碑
- [WT-8799](https://jira.mongodb.org/browse/WT-8799)在mongodb-5.0上禁用文档更新
- [WT-8824](https://jira.mongodb.org/browse/WT-8824)在mongodb-4.4上禁用代码覆盖测量
- [WT-8874](https://jira.mongodb.org/browse/WT-8874)在mongodb-5.0上禁用兼容性测试
- [WT-8879](https://jira.mongodb.org/browse/WT-8879)当所选墓碑全局可见时，设置OOO标志
- [WT-8894](https://jira.mongodb.org/browse/WT-8894)找到通往mongod可执行文件的路径进行多集合测试
- [WT-8909](https://jira.mongodb.org/browse/WT-8909)在4.4上禁用cpp测试搜索_near_01
- [WT-8924](https://jira.mongodb.org/browse/WT-8924)在行存储中检查冲突时，不要在磁盘时间窗口上检查是否有插入列表



## 4.4.13 更改日志

### 分片

- [服务器-26755](https://jira.mongodb.org/browse/SERVER-26755)如果获取所有块需要超过30秒，集合块加载将完全中止
- [服务器-62065](https://jira.mongodb.org/browse/SERVER-62065)从3.6升级到4.0的路径可以在碎片上留下没有历史记录的大块条目
- [服务器-62171](https://jira.mongodb.org/browse/SERVER-62171)在sharding_statistics_server_status.js中将日志添加到runConcurrentMoveChunk的输出中
- [服务器-62906](https://jira.mongodb.org/browse/SERVER-62906)在createCollection/shardCollection路径中添加一个勾号，以验证集合名称长度

### 复制

[服务器-48059](https://jira.mongodb.org/browse/SERVER-48059)concurrency_replication_for_backup_restore的WaitForReplication钩子应该忽略由于安静模式而导致的关机错误

### 查询

- [服务器-40691](https://jira.mongodb.org/browse/SERVER-40691)$nin:[[],...]查询没有索引
- [服务器-59754](https://jira.mongodb.org/browse/SERVER-59754)对于共享相同$lookup形状的操作，queryHash/planCacheKey的日志记录不正确
- [服务器-62147](https://jira.mongodb.org/browse/SERVER-62147)当需要多个getMore批处理时，使用OP_QUERY协议的排气查询会中断

### 储存

[服务器-55483](https://jira.mongodb.org/browse/SERVER-55483)添加一个新的启动参数，跳过验证表日志设置

### 内部人员

- [服务器-48068](https://jira.mongodb.org/browse/SERVER-48068)assert.soon()在try/finally中启用挂起分析器可能会导致ProgramRegistry中的不变故障
- [服务器-48328](https://jira.mongodb.org/browse/SERVER-48328)删除索引密钥生成错误白名单
- [服务器-48367](https://jira.mongodb.org/browse/SERVER-48367)envp在全局初始化器中可能不可靠
- [服务器-49882](https://jira.mongodb.org/browse/SERVER-49882)JSThread::run()中捕获块的日志状态
- [服务器-53239](https://jira.mongodb.org/browse/SERVER-53239)在共享的未来单元测试中修复比赛
- [服务器-57037](https://jira.mongodb.org/browse/SERVER-57037)提高操作员计数器的精度
- [服务器-57312](https://jira.mongodb.org/browse/SERVER-57312)固定传递Python依赖项，并使用固定文件在Evergreen中安装
- [服务器-57662](https://jira.mongodb.org/browse/SERVER-57662)在刷新逻辑会话缓存之前，等待config.system.sessions集合存在于配置服务器上
- [服务器-59375](https://jira.mongodb.org/browse/SERVER-59375)应该收集关于瞬态故障的汇总统计数据
- [服务器-59779](https://jira.mongodb.org/browse/SERVER-59779)在ReplSetTest中replSetFreeze之前调用asCluster()
- [服务器-60392](https://jira.mongodb.org/browse/SERVER-60392)修复priority_takeover_two_nodes_equal_priority测试中的时序。
- [服务器-61315](https://jira.mongodb.org/browse/SERVER-61315)Ldap运行状况检查执行器应该支持中止的任务
- [服务器-61662](https://jira.mongodb.org/browse/SERVER-61662)SCons配置检查应始终以冗差运行
- [服务器-61837](https://jira.mongodb.org/browse/SERVER-61837)[v4.4] 在空集合的迁移目标碎片中创建索引后，确保等待多数写入关注
- [服务器-61977](https://jira.mongodb.org/browse/SERVER-61977)并发回滚和stepUp可能会导致节点在上次应用之前从时间戳中获取，一旦它下降。
- [服务器-62085](https://jira.mongodb.org/browse/SERVER-62085)在验证中使用更多位进行hashedMultikeyMetadataPaths
- [服务器-62336](https://jira.mongodb.org/browse/SERVER-62336)容忍SnapshotToodbCheck测试中的旧错误
- [服务器-62368](https://jira.mongodb.org/browse/SERVER-62368)范围删除器必须尊重范围删除器批量延迟MS
- [服务器-62380](https://jira.mongodb.org/browse/SERVER-62380)在rollback_set_fcv.js中启动回滚测试之前，等待每个节点上大多数提交点
- [服务器-62465](https://jira.mongodb.org/browse/SERVER-62465)更新强度后，生成的运行状况检查应设置新的强度值。
- [服务器-62511](https://jira.mongodb.org/browse/SERVER-62511)在dbcheck_no_history_on_secondary.js中比赛
- [服务器-62513](https://jira.mongodb.org/browse/SERVER-62513)RunDBCheckInBackground应该重试中断错误
- [服务器-62514](https://jira.mongodb.org/browse/SERVER-62514)dbcheck_write_concern.js应该防止主服务器下台
- [服务器-62668](https://jira.mongodb.org/browse/SERVER-62668)在OperationContext中同步对ImpersonatedUserMetadata的访问。
- [服务器-62678](https://jira.mongodb.org/browse/SERVER-62678)迁移LDAP运行状况检查器以使用永久OpenLDAP和AD服务器
- [服务器-62706](https://jira.mongodb.org/browse/SERVER-62706)dbcheck.js：处理具有混合调试/发布成员的副本集
- [服务器-62824](https://jira.mongodb.org/browse/SERVER-62824)修复v4.4上的op_msg_fuzzer初始化顺序
- [服务器-62875](https://jira.mongodb.org/browse/SERVER-62875)[v4.4] 存档multi_stmt_txn_jscore_passthrough_with_migration套件的数据文件
- [服务器-62928](https://jira.mongodb.org/browse/SERVER-62928)在健康观察者测试中增加LDAP检查之间的间隔
- [服务器-62948](https://jira.mongodb.org/browse/SERVER-62948)确保FTDC收集器没有读取时间戳
- [服务器-63057](https://jira.mongodb.org/browse/SERVER-63057)/usr/bin/dig LDAP观察者测试依赖于片状
- [服务器-63097](https://jira.mongodb.org/browse/SERVER-63097)stepdown_race_with_transaction.js应使用“uses_transactions”标签。
- [服务器-63141](https://jira.mongodb.org/browse/SERVER-63141)$lookup/$redact/$let行为与管道优化的差异
- [服务器-63197](https://jira.mongodb.org/browse/SERVER-63197)Pin microbenchmarks genny版本
- [服务器-63203](https://jira.mongodb.org/browse/SERVER-63203)如果发现超过8192个分叉点，分块器永远不会分裂
- [服务器-63234](https://jira.mongodb.org/browse/SERVER-63234)更好的日志记录来解释LDAP健康检查松弛度
- [服务器-63422](https://jira.mongodb.org/browse/SERVER-63422)修复v4.4上op_msg_fuzzer测试的构建失败
- [服务器-63505](https://jira.mongodb.org/browse/SERVER-63505)确保仲裁员识别rollback_views.js中的主节点
- [WT-8004](https://jira.mongodb.org/browse/WT-8004)为架构指南创建读取顺序
- [WT-8320](https://jira.mongodb.org/browse/WT-8320)选择从历史商店恢复的更新，无论可见性如何
- [WT-8424](https://jira.mongodb.org/browse/WT-8424)在小端使用一致的工具链
- [WT-8477](https://jira.mongodb.org/browse/WT-8477)在我们的常青测试中强制使用Pymongo 3.12.2
- [WT-8605](https://jira.mongodb.org/browse/WT-8605)禁用Evergreen中非开发分支的perf测试



## 4.4.12 更改日志

### 分片

[服务器-61637](https://jira.mongodb.org/browse/SERVER-61637)审查范围删除器批处理策略

### 内部人员

- [服务器-53239](https://jira.mongodb.org/browse/SERVER-53239)在共享的未来单元测试中修复比赛
- [服务器-58152](https://jira.mongodb.org/browse/SERVER-58152)为从集群拓扑中删除故障Mongos创建功能标志
- [服务器-58153](https://jira.mongodb.org/browse/SERVER-58153)启用功能标志，用于从集群拓扑中删除故障Mongos
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
- [服务器-59368](https://jira.mongodb.org/browse/SERVER-59368)系统应该正确处理正在打开/关闭的健康检查器
- [服务器-59370](https://jira.mongodb.org/browse/SERVER-59370)在kActiveFaultDuration的瞬态故障状态下时，应该过渡到ActiveFault状态
- [服务器-59382](https://jira.mongodb.org/browse/SERVER-59382)执行不进入ActiveFault状态的非关键方面
- [服务器-59386](https://jira.mongodb.org/browse/SERVER-59386)应提供定期进行LDAP运行状况检查的能力
- [服务器-59394](https://jira.mongodb.org/browse/SERVER-59394)模拟ldap失败场景的设置集成测试
- [服务器-59397](https://jira.mongodb.org/browse/SERVER-59397)为健康检查期实施随机化
- [服务器-59496](https://jira.mongodb.org/browse/SERVER-59496)故障类应该是活动故障面的容器
- [服务器-59522](https://jira.mongodb.org/browse/SERVER-59522)HealthCheckStatus应该跟踪故障状态和生命周期
- [服务器-59567](https://jira.mongodb.org/browse/SERVER-59567)定期检查应调用观察者，模拟HealthObserver模拟故障
- [服务器-59608](https://jira.mongodb.org/browse/SERVER-59608)覆盖分析缺陷120502：解析警告
- [服务器-59912](https://jira.mongodb.org/browse/SERVER-59912)Ldap健康检查器的初始无操作脚手架
- [服务器-60079](https://jira.mongodb.org/browse/SERVER-60079)包含Ldap观察者通用模式的通用健康观察者代码
- [服务器-60084](https://jira.mongodb.org/browse/SERVER-60084)修复企业Ldap中与叮当相关的编译失败
- [服务器-60316](https://jira.mongodb.org/browse/SERVER-60316)FaultManager应该从禁用定期检查开始
- [服务器-60587](https://jira.mongodb.org/browse/SERVER-60587)实施FaultFacet
- [服务器-60944](https://jira.mongodb.org/browse/SERVER-60944)更改updateWithSuppliedFacet和更新的界面
- [服务器-61220](https://jira.mongodb.org/browse/SERVER-61220)进度监视器的集成测试
- [服务器-61368](https://jira.mongodb.org/browse/SERVER-61368)FaultManager测试套件应使用真正的线程池
- [服务器-61438](https://jira.mongodb.org/browse/SERVER-61438)在health_observer_test.cpp中修复比赛
- [服务器-61529](https://jira.mongodb.org/browse/SERVER-61529)Ldap测试应该等待连接收割机终止
- [服务器-61871](https://jira.mongodb.org/browse/SERVER-61871)使用tassert进行状态机程序员错误
- [服务器-61872](https://jira.mongodb.org/browse/SERVER-61872)在FaultManager中修复线程池饥饿
- [服务器-61873](https://jira.mongodb.org/browse/SERVER-61873)LDAP运行时参数
- [服务器-61914](https://jira.mongodb.org/browse/SERVER-61914)将故障面详细信息添加到FaultImpl::toBSON
- [服务器-61921](https://jira.mongodb.org/browse/SERVER-61921)FaultManager中noSSL模式下的链接失败
- [服务器-61930](https://jira.mongodb.org/browse/SERVER-61930)如果在进行一次健康检查时超时，单个健康观察者应返回错误
- [服务器-61956](https://jira.mongodb.org/browse/SERVER-61956)修复访问状态机状态时的数据竞赛
- [服务器-62037](https://jira.mongodb.org/browse/SERVER-62037)修复linux-1-node-15gbwtcache的系统perf yaml文件中的复制集定义
- [服务器-62084](https://jira.mongodb.org/browse/SERVER-62084)FaultFacetType的序列化器坏了
- [服务器-62096](https://jira.mongodb.org/browse/SERVER-62096)/proc/<id>/smaps不可用
- [服务器-62098](https://jira.mongodb.org/browse/SERVER-62098)在 fault_manager.cpp 中具有互斥体的 Guard healthCheckContexts
- [服务器-62174](https://jira.mongodb.org/browse/SERVER-62174)FaultManager支持运行状况检查间隔的动态配置
- [服务器-62188](https://jira.mongodb.org/browse/SERVER-62188)在DeadlineFuture中免费使用关机比赛
- [服务器-62197](https://jira.mongodb.org/browse/SERVER-62197)移除额外的状态互斥锁。
- [服务器-62202](https://jira.mongodb.org/browse/SERVER-62202)日志ID 5936504应包含作为字符串的观察者类型
- [服务器-62203](https://jira.mongodb.org/browse/SERVER-62203)将线程名称“健康检查进度监视器”更改为“FaultManagerProgressMonitor”
- [服务器-62204](https://jira.mongodb.org/browse/SERVER-62204)如果未启用观察者，则不要安排健康检查
- [服务器-62226](https://jira.mongodb.org/browse/SERVER-62226)在EFT上禁用dbcheck_no_history_on_secondary.js
- [服务器-62280](https://jira.mongodb.org/browse/SERVER-62280)在 fault_state_machine_test.cpp 中进行初始检查时过早过渡到确定
- [服务器-62291](https://jira.mongodb.org/browse/SERVER-62291)在运行状况监视器的4.4后端口中查找skipValidatingExitCode的替代品
- [服务器-62312](https://jira.mongodb.org/browse/SERVER-62312)在4.4后港和其他家政服务中启用功能标志
- [服务器-62371](https://jira.mongodb.org/browse/SERVER-62371)ldap_mongos_health_checking.js中罕见代码路径上的语法错误
- [服务器-62373](https://jira.mongodb.org/browse/SERVER-62373)LDAP运行状况检查集成测试应该断言统计数据
- [服务器-62555](https://jira.mongodb.org/browse/SERVER-62555)Ldap集成测试应该会崩溃服务器



## 4.4.11 更改日志

### 分片

- [服务器-45149](https://jira.mongodb.org/browse/SERVER-45149)txn_two_phase_commit_failover.js中的replSetStepDown命令不应超时
- [服务器-51329](https://jira.mongodb.org/browse/SERVER-51329)关闭mongos服务器时意外不可重试错误
- [服务器-53335](https://jira.mongodb.org/browse/SERVER-53335)使用非“简单”整理的查询、更新和删除在使用散列分片时可能会丢失文档
- [服务器-54623](https://jira.mongodb.org/browse/SERVER-54623)减少因果一致性直通套件中的作业数量
- [服务器-55382](https://jira.mongodb.org/browse/SERVER-55382)忽略可重试写入转换为事务的错误，以及该事务在random_moveChunk_update_shard_key.js中失败的错误
- [服务器-55392](https://jira.mongodb.org/browse/SERVER-55392)将时间戳字段添加到config.rangeDeletions
- [服务器-55412](https://jira.mongodb.org/browse/SERVER-55412)镜像读取应该传播碎片版本字段
- [服务器-56226](https://jira.mongodb.org/browse/SERVER-56226)[v4.4]在config.collections条目上引入“许可迁移”字段，以防止块迁移提交
- [服务器-56227](https://jira.mongodb.org/browse/SERVER-56227)添加面向用户的命令，将分片集合的允许移民设置为false
- [服务器-59890](https://jira.mongodb.org/browse/SERVER-59890)从config stepdown套件中排除migmig_coordinator_shutdown_in_critical_section.js测试
- [服务器-60552](https://jira.mongodb.org/browse/SERVER-60552)metadata_manager_test中不存在的集合的单独测试
- [服务器-60652](https://jira.mongodb.org/browse/SERVER-60652)将autoSplitVector逻辑反向移植到v4.4
- [服务器-60682](https://jira.mongodb.org/browse/SERVER-60682)事务协调员可能会阻止获取WiredTiger写票以坚持其决定，延长交易处于准备状态
- [服务器-60738](https://jira.mongodb.org/browse/SERVER-60738)更新不存在集合的元数据管理器测试
- [服务器-60804](https://jira.mongodb.org/browse/SERVER-60804)从cursor_valid_after_shard_stepdown中删除碎片版本检查
- [服务器-61461](https://jira.mongodb.org/browse/SERVER-61461)update_shard_key_doc_moves_shards.js因次要虚假刷新而失败
- [服务器-61628](https://jira.mongodb.org/browse/SERVER-61628)当numDeleted < numDocsToRemovePerBatch时，请勿重新安排范围删除任务
- [服务器-61689](https://jira.mongodb.org/browse/SERVER-61689)ActiveMigrationsRegistry::lock方法无法正确处理其异常
- [服务器-61816](https://jira.mongodb.org/browse/SERVER-61816)cancel_coordinate_txn_commit_with_tickets_exhausted.js由于交易收割者和事务协调员之间的竞争条件可以永远挂起

### 复制

- [服务器-54909](https://jira.mongodb.org/browse/SERVER-54909)在replSetGetStatus中，报告所有成员的最后一次耐用和最后一次应用操作墙时间
- [服务器-55376](https://jira.mongodb.org/browse/SERVER-55376)重新配置可以在PSA集中回滚已提交的写入
- [服务器-60946](https://jira.mongodb.org/browse/SERVER-60946)当具有不同优先级的节点启动replset时，replsetprio1.js中的竞争条件

### 查询

- [服务器-57588](https://jira.mongodb.org/browse/SERVER-57588)当值为数组的数组位置被索引时，查询结果不一致
- [服务器-60586](https://jira.mongodb.org/browse/SERVER-60586)out_max_time_ms.js无法正确启用“maxTimeNeverTimeOut”故障点，导致虚假的测试失败

### 集合

- [服务器-59613](https://jira.mongodb.org/browse/SERVER-59613)如果超过内存限制，$range表达式应该会出错
- [服务器-59924](https://jira.mongodb.org/browse/SERVER-59924)在分片集群上使用“可用”读取关注点执行聚合时出错

### 储存

- [服务器-30846](https://jira.mongodb.org/browse/SERVER-30846)在FSM测试中运行dbCheck作为后台工作负载
- [服务器-45953](https://jira.mongodb.org/browse/SERVER-45953)豁免oplog读者获得阅读门票
- [服务器-48293](https://jira.mongodb.org/browse/SERVER-48293)从config.system.indexBuilds中删除不活跃的索引构建

### 运营notes/4.4-changelog/#operations-3)

[服务器-28953](https://jira.mongodb.org/browse/SERVER-28953)在FTDC中捕获df（磁盘完整）统计数据

### 内部人员

- [服务器-34597](https://jira.mongodb.org/browse/SERVER-34597)shardedcluster.py没有正确等待碎片初始化
- [服务器-46521](https://jira.mongodb.org/browse/SERVER-46521)扩展镜像读取生成测试
- [服务器-46533](https://jira.mongodb.org/browse/SERVER-46533)CmdUpdate应该保留底层BSON
- [服务器-48673](https://jira.mongodb.org/browse/SERVER-48673)在并发降级套件中使用passConnectionCache=true时，Worker线程可能会耗尽命令重试
- [服务器-49028](https://jira.mongodb.org/browse/SERVER-49028)如果主无法看到大部分副本集，initial_sync_aborts_two_phase_index_builds.js可能会失败
- [服务器-51087](https://jira.mongodb.org/browse/SERVER-51087)添加测试实用程序，用于创建具有指定边界的空分片集合
- [服务器-55395](https://jira.mongodb.org/browse/SERVER-55395)4.0.23不使用gcc 10构建
- [服务器-56602](https://jira.mongodb.org/browse/SERVER-56602)在serverStatus中跟踪匹配表达式的使用情况
- [服务器-56801](https://jira.mongodb.org/browse/SERVER-56801)更新PSA集中重新配置检查的占位符链接
- [服务器-56887](https://jira.mongodb.org/browse/SERVER-56887)setIndexCommitQuorum命令在不存在的索引构建上对mongos运行时返回{ok: 1}
- [服务器-56919](https://jira.mongodb.org/browse/SERVER-56919)将memberIndex的验证添加到reconfigToPSASet() shell helper
- [服务器-57284](https://jira.mongodb.org/browse/SERVER-57284)在reconfig_for_psa_set_shell.js中等待配置承诺
- [服务器-57289](https://jira.mongodb.org/browse/SERVER-57289)编辑不应该将BSONArray转换为BSONObj
- [服务器-57605](https://jira.mongodb.org/browse/SERVER-57605)将Decimal128相等比较助手暴露在shell上
- [服务器-58119](https://jira.mongodb.org/browse/SERVER-58119)single_node_set_new_hostname.js需要使用assert.soonNoExcept调用replSetReconfig
- [服务器-58385](https://jira.mongodb.org/browse/SERVER-58385)恢复操作日志应用程序更新了错误集合的多密钥信息
- [服务器-58406](https://jira.mongodb.org/browse/SERVER-58406)启用TestingProctor后启用调试日志记录
- [服务器-58412](https://jira.mongodb.org/browse/SERVER-58412)更改settings.chaining在副本集配置中启用应该会影响同步源的更改
- [服务器-58636](https://jira.mongodb.org/browse/SERVER-58636)在根据辅助同步源计算stopTimestamp时，初始同步节点可能会错过最终的操作日志条目
- [服务器-58888](https://jira.mongodb.org/browse/SERVER-58888)$union用模式解释“executionStats”不考虑被推下的阶段
- [服务器-59108](https://jira.mongodb.org/browse/SERVER-59108)解决交易操作在下台后不会被杀死的竞争
- [服务器-59191](https://jira.mongodb.org/browse/SERVER-59191)SPIKE：git.get_project无法克隆
- [服务器-59226](https://jira.mongodb.org/browse/SERVER-59226)标记为不间断的配置文件会话下台时陷入僵局
- [服务器-59329](https://jira.mongodb.org/browse/SERVER-59329)如果节点不再是主节点，请确保使用TemporaryOperationContext抛出错误
- [服务器-59409](https://jira.mongodb.org/browse/SERVER-59409)重新配置复制和升级之间的竞争可能导致RSM卡在报告ReplicaSetNoPrimary中
- [服务器-59459](https://jira.mongodb.org/browse/SERVER-59459)mongodb无法使用glibc-2.34构建
- [服务器-59672](https://jira.mongodb.org/browse/SERVER-59672)修复在step_down_during_draining3.js中停止复制的问题
- [服务器-59858](https://jira.mongodb.org/browse/SERVER-59858)添加反应堆线程上计划的任务的可观测性
- [服务器-59879](https://jira.mongodb.org/browse/SERVER-59879)调整maxTimeMS值，以便在并行测试套件中实现更慢的执行速度
- [服务器-60096](https://jira.mongodb.org/browse/SERVER-60096)将rollbackHangCommonPointBeforeReplCommitPoint failpoint添加到RVR
- [服务器-60218](https://jira.mongodb.org/browse/SERVER-60218)改进$group阶段
- [服务器-60310](https://jira.mongodb.org/browse/SERVER-60310)OCSP响应验证不应考虑无关证书的状态
- [服务器-60326](https://jira.mongodb.org/browse/SERVER-60326)当X509证书的主题名称为空时，Windows Server无法启动
- [服务器-60456](https://jira.mongodb.org/browse/SERVER-60456)在Windows上严重延迟绑定期间，LDAPBindOptions超出了范围
- [服务器-60511](https://jira.mongodb.org/browse/SERVER-60511)与固定时间戳相比， getPinnedOplog 返回值应始终为 std::min
- [服务器-60520](https://jira.mongodb.org/browse/SERVER-60520)默认'enableSearchMeta'为true（v4.4）
- [服务器-60550](https://jira.mongodb.org/browse/SERVER-60550)通过sendToRecipient()提交远程命令时，m migration_util函数可能会错过一些响应错误
- [服务器-60582](https://jira.mongodb.org/browse/SERVER-60582)[v4.4] initiate_emrc_false.js需要等待初始检查点
- [服务器-60588](https://jira.mongodb.org/browse/SERVER-60588)$multiply在某些情况下在经典引擎中错误地抛出错误
- [服务器-60606](https://jira.mongodb.org/browse/SERVER-60606)当索引构建从数据克隆阶段开始时，初始同步期间的比赛条件
- [服务器-60670](https://jira.mongodb.org/browse/SERVER-60670)使用单独的分支而不是TPCC的特定提交
- [服务器-60671](https://jira.mongodb.org/browse/SERVER-60671)移除匕首
- [服务器-60685](https://jira.mongodb.org/browse/SERVER-60685)TransactionCoordinator可能会中断具有非中断错误类别的本地执行更新，导致服务器崩溃
- [服务器-60756](https://jira.mongodb.org/browse/SERVER-60756)在multi_statement_transaction_atomicity_isolation.js中添加失败更新的其他日志记录
- [服务器-60788](https://jira.mongodb.org/browse/SERVER-60788)merge_causes_infinite_loop.js试图公开一个不再存在的问题
- [服务器-60809](https://jira.mongodb.org/browse/SERVER-60809)在$search后添加不查找功能
- [服务器-60877](https://jira.mongodb.org/browse/SERVER-60877)在replLogUpdate上更正MutableOplogEntry的无意副本
- [服务器-60928](https://jira.mongodb.org/browse/SERVER-60928)[4.4]最新的4.2蒙古人无法使用具有复合散列碎片密钥的碎片集合启动
- [服务器-60948](https://jira.mongodb.org/browse/SERVER-60948)在mit_id_index.js的新集合中插入文档，以等待在辅助索引上成功构建
- [服务器-60971](https://jira.mongodb.org/browse/SERVER-60971)删除对BF建议服务的来电
- [服务器-61164](https://jira.mongodb.org/browse/SERVER-61164)接受错误代码48（不适当的身份验证）作为LDAP活力检查的有效响应
- [服务器-61427](https://jira.mongodb.org/browse/SERVER-61427)由于检查许多虚假副本，唯一的索引构建可能会导致提交期间的可用性损失
- [服务器-61466](https://jira.mongodb.org/browse/SERVER-61466)端口RSM { electionId, setVersion } 命令扫描RSM
- [服务器-61479](https://jira.mongodb.org/browse/SERVER-61479)减少后，增加连接到副本集的重试次数
- [服务器-61550](https://jira.mongodb.org/browse/SERVER-61550)在perf.yml中修改auto_workload_path以相对于cwd
- [服务器-61681](https://jira.mongodb.org/browse/SERVER-61681)等待replSetGetStatus在replSetGetStatus_member_wall_times.js中更新
- [服务器-61690](https://jira.mongodb.org/browse/SERVER-61690)调整地图集搜索的存储字段协议
- [服务器-61738](https://jira.mongodb.org/browse/SERVER-61738)恢复dbCheck.js，使其具有确定性
- [服务器-61743](https://jira.mongodb.org/browse/SERVER-61743)除x86_64平台外，不应应用-fno-builtin-memcmp标志
- [服务器-61748](https://jira.mongodb.org/browse/SERVER-61748)dbCheck在批处理期间不应保持强大的数据库锁
- [服务器-61754](https://jira.mongodb.org/browse/SERVER-61754)dbCheck在批处理期间不应保持强大的收集锁
- [服务器-61757](https://jira.mongodb.org/browse/SERVER-61757)添加dbCheck命令选项来自定义批处理大小
- [服务器-61791](https://jira.mongodb.org/browse/SERVER-61791)pin pymongo
- [服务器-61846](https://jira.mongodb.org/browse/SERVER-61846)防止编辑抛出BSONObjectTooLarge
- [服务器-61852](https://jira.mongodb.org/browse/SERVER-61852)dbCheck应该尝试用后退锁定集合
- [服务器-61862](https://jira.mongodb.org/browse/SERVER-61862)在v4.4中公开$_internalReadAtClusterTime命令
- [服务器-61877](https://jira.mongodb.org/browse/SERVER-61877)从dbCheck中删除目录一致性验证
- [服务器-61955](https://jira.mongodb.org/browse/SERVER-61955)将dbCheck公开为一个普遍可用的命令
- [服务器-62022](https://jira.mongodb.org/browse/SERVER-62022)减少生产中的dbCheck信息日志记录，日志开始和停止
- [服务器-62023](https://jira.mongodb.org/browse/SERVER-62023)提高dbCheck可观察性
- [服务器-62041](https://jira.mongodb.org/browse/SERVER-62041)向dbCheck添加最大批处理执行时间
- [服务器-62164](https://jira.mongodb.org/browse/SERVER-62164)删除所有稳定分支上的几个过时的构建变体
- [服务器-62210](https://jira.mongodb.org/browse/SERVER-62210)修复db检查掉落和重新创建的集合的进度仪表处理
- [服务器-62212](https://jira.mongodb.org/browse/SERVER-62212)支持写入关注dbCheck
- [WT-5009](https://jira.mongodb.org/browse/WT-5009)将剩余的有线tiger-perf-lsm测试迁移到Evergreen
- [WT-5743](https://jira.mongodb.org/browse/WT-5743)当为VLCS清除事务ID时重写单元格
- [WT-5939](https://jira.mongodb.org/browse/WT-5939)修复了test_config06中导致“无法删除目录”错误的命名冲突（仅限OSX）
- [WT-6077](https://jira.mongodb.org/browse/WT-6077)添加新的统计数据来跟踪紧凑的进度
- [WT-7250](https://jira.mongodb.org/browse/WT-7250)修复测试以执行显式驱逐，而不是依赖低缓存大小
- [WT-7494](https://jira.mongodb.org/browse/WT-7494)添加Python测试以在恢复期间触发更新恢复驱逐
- [WT-7885](https://jira.mongodb.org/browse/WT-7885)确保WiredTiger测试尽可能使用tcmalloc
- [WT-8026](https://jira.mongodb.org/browse/WT-8026)在Evergreen中运行PPC/zSeries/macOS主线构建的频率较低
- [WT-8067](https://jira.mongodb.org/browse/WT-8067)修复确保将最新的历史存储值插入完整更新的代码
- [WT-8116](https://jira.mongodb.org/browse/WT-8116)修复cpp测试框架中与继承有关的问题
- [WT-8147](https://jira.mongodb.org/browse/WT-8147)在cppsuite配置中检测无效语法
- [WT-8168](https://jira.mongodb.org/browse/WT-8168)修复cpp测试附近搜索中未使用的变量
- [WT-8199](https://jira.mongodb.org/browse/WT-8199)让s_all接受符合Python PEP8的换行符
- [WT-8203](https://jira.mongodb.org/browse/WT-8203)修复访问页面时的分层违规行为
- [WT-8204](https://jira.mongodb.org/browse/WT-8204)在“wt7989_compact_checkpoint”CSuite测试中修复可能的比赛条件
- [WT-8214](https://jira.mongodb.org/browse/WT-8214)只发布WiredTiger开发Evergreen项目的文档
- [WT-8225](https://jira.mongodb.org/browse/WT-8225)在zstd获取上下文中修复数据竞赛
- [WT-8226](https://jira.mongodb.org/browse/WT-8226)修复 largest_key 未能考虑已准备好的更新
- [WT-8395](https://jira.mongodb.org/browse/WT-8395)从4.4.3和4.4.4升级到4.4.8+和5.0.2+后数据不一致
- [WT-8534](https://jira.mongodb.org/browse/WT-8534)允许检索用于备份恢复恢复的检查点快照
- [WT-8576](https://jira.mongodb.org/browse/WT-8576)启用登录测试检查点



## 4.4.10 更改日志

### 安全

[服务器-50050](https://jira.mongodb.org/browse/SERVER-50050)Build with --ssl=off失败

### 分片

- [服务器-53332](https://jira.mongodb.org/browse/SERVER-53332)将ShardRegistry::_connStringLookup更改为将连接字符串存储为std::strings
- [服务器-54064](https://jira.mongodb.org/browse/SERVER-54064)关于仲裁员的会议累积起来，无法清除
- [服务器-55975](https://jira.mongodb.org/browse/SERVER-55975)core/find_and_modify.js测试不适合在降级套件中运行
- [服务器-59160](https://jira.mongodb.org/browse/SERVER-59160)在test_stacked_migration_cleanup.js中禁用平衡器
- [服务器-59769](https://jira.mongodb.org/browse/SERVER-59769)平衡器与块迁移测试冲突
- [服务器-59916](https://jira.mongodb.org/browse/SERVER-59916)T{1, 2}Starts{First, Second}AndWins In WriteConflictHelpers不同步提交失败的事务
- [服务器-60142](https://jira.mongodb.org/browse/SERVER-60142)清除过滤元数据后，碎片可以在孤儿身上迁移
- [服务器-60419](https://jira.mongodb.org/browse/SERVER-60419)使CleanUpForMigrateIn确定性

### 复制

- [服务器-50241](https://jira.mongodb.org/browse/SERVER-50241)PeriodicShardedIndexConsistencyChecker应该跳过删除的集合
- [服务器-55376](https://jira.mongodb.org/browse/SERVER-55376)重新配置可以在PSA集中回滚已提交的写入
- [服务器-58988](https://jira.mongodb.org/browse/SERVER-58988)在主要追赶期间避免同步源选择周期。
- [服务器-60153](https://jira.mongodb.org/browse/SERVER-60153)选举期间的更多信息级别日志

### 查询

- [服务器-51806](https://jira.mongodb.org/browse/SERVER-51806)索引构建的批量键插入阶段保持IX锁而不屈服
- [服务器-54791](https://jira.mongodb.org/browse/SERVER-54791)使用外部排序构建索引期间过度使用文件描述符
- [服务器-57321](https://jira.mongodb.org/browse/SERVER-57321)$mod匹配表达式错误地处理NaN、Infinity和大值

### 集合

[服务器-49214](https://jira.mongodb.org/browse/SERVER-49214)添加$toHashedIndexKey表达式

### 运营

[服务器-53242](https://jira.mongodb.org/browse/SERVER-53242)Always log collmod命令

### 内部人员

- [服务器-34597](https://jira.mongodb.org/browse/SERVER-34597)shardedcluster.py没有正确等待碎片初始化
- [服务器-46147](https://jira.mongodb.org/browse/SERVER-46147)更新维修以修复多键错误，而无需执行索引重建
- [服务器-49340](https://jira.mongodb.org/browse/SERVER-49340)添加维修模式以验证启动 --repair
- [服务器-52850](https://jira.mongodb.org/browse/SERVER-52850)从 initial_sync_nodes_maintain_and_gossip_commit_point.js中删除断言
- [服务器-53448](https://jira.mongodb.org/browse/SERVER-53448)使ftdc_mirrored_reads.js对减速机器具有弹性
- [服务器-54825](https://jira.mongodb.org/browse/SERVER-54825)在rslib.js中的'find()'之后使用'toArray()'之后的数组访问
- [服务器-55904](https://jira.mongodb.org/browse/SERVER-55904)合并 getFirstOplogEntry 和 getLeastRecentOp 助手
- [服务器-56326](https://jira.mongodb.org/browse/SERVER-56326)将 round() 方法添加到 Decimal128 类中
- [服务器-56416](https://jira.mongodb.org/browse/SERVER-56416)mongod--版本在M1笔记本电脑上以无关的日志线返回
- [服务器-56919](https://jira.mongodb.org/browse/SERVER-56919)将memberIndex的验证添加到reconfigToPSASet() shell helper
- [服务器-57284](https://jira.mongodb.org/browse/SERVER-57284)在reconfig_for_psa_set_shell.js中等待配置承诺
- [服务器-57605](https://jira.mongodb.org/browse/SERVER-57605)将Decimal128相等比较助手暴露在shell上
- [服务器-57938](https://jira.mongodb.org/browse/SERVER-57938)当查询具有$geoIntersect和2dsphere索引时，跳过存储的GeoJSON的多边形验证
- [服务器-58047](https://jira.mongodb.org/browse/SERVER-58047)$toHashedIndexKey表达式不会添加任何依赖项
- [服务器-58104](https://jira.mongodb.org/browse/SERVER-58104)如果使用_id以外的碎片键丢弃并重新分片，config.system.sessions集合最终可能会出现无效的块
- [服务器-58122](https://jira.mongodb.org/browse/SERVER-58122)在resync_majority_member.js中将不变故障的搜索日志替换为故障点使用
- [服务器-58139](https://jira.mongodb.org/browse/SERVER-58139)避免网络界面测试的泄漏状态::CancelLocally
- [服务器-58148](https://jira.mongodb.org/browse/SERVER-58148)mirrored_reads.js断言不考虑镜像读取失败
- [服务器-58183](https://jira.mongodb.org/browse/SERVER-58183)_applyPrepareTransaction不能确保准备Conflict行为是kIgnoreConflictAccept在重试尝试时写
- [服务器-58203](https://jira.mongodb.org/browse/SERVER-58203)改善$unionWith舞台
- [服务器-58583](https://jira.mongodb.org/browse/SERVER-58583)mongocryptd的查询分析不处理查找中的表达式投影
- [服务器-58777](https://jira.mongodb.org/browse/SERVER-58777)插入和更新对空子文档是否是嵌套级别存在分歧
- [服务器-58780](https://jira.mongodb.org/browse/SERVER-58780)[v4.4] 如果replSetInitiate失败，请确保_shouldSetStableTimestamp恢复为true
- [服务器-59010](https://jira.mongodb.org/browse/SERVER-59010)修复SSL关闭构建，当ssl = off时，不应使用OCSPManager
- [服务器-59074](https://jira.mongodb.org/browse/SERVER-59074)不要仅仅为了设置/等待oplog可见性而获取存储票据
- [服务器-59120](https://jira.mongodb.org/browse/SERVER-59120)为commitChunksMerge创建单元测试
- [服务器-59143](https://jira.mongodb.org/browse/SERVER-59143)如果在忍者模块到位的情况下使用“--忍者”工具选项，则很难失败
- [服务器-59190](https://jira.mongodb.org/browse/SERVER-59190)IndexAccessMethod可以在索引构建批量负载产量期间销毁
- [服务器-59294](https://jira.mongodb.org/browse/SERVER-59294)检查oidReset的操作类型
- [服务器-59299](https://jira.mongodb.org/browse/SERVER-59299)改进$匹配阶段
- [服务器-59425](https://jira.mongodb.org/browse/SERVER-59425)Ninja未能在本地安装存档目标
- [服务器-59456](https://jira.mongodb.org/browse/SERVER-59456)启动LDAPReaper线程池
- [服务器-59476](https://jira.mongodb.org/browse/SERVER-59476)validate_commit_message不允许恢复有线型进口
- [服务器-59651](https://jira.mongodb.org/browse/SERVER-59651)replsettest runCommandWithRetry应该处理缓慢的配置
- [服务器-59725](https://jira.mongodb.org/browse/SERVER-59725)从额外的RHEL 6.2变体中删除推送任务
- [服务器-59804](https://jira.mongodb.org/browse/SERVER-59804)在system_perf.yml中使用单独的YCSB分支
- [服务器-59866](https://jira.mongodb.org/browse/SERVER-59866)当currentCommittedSnapshot被删除时，阻止FCV等待多数
- [服务器-59867](https://jira.mongodb.org/browse/SERVER-59867)ReplSetConfig/MemberConfig中的拆分地平线映射应该确定性地序列化
- [服务器-59876](https://jira.mongodb.org/browse/SERVER-59876)在建立出口连接时，从libcrypto.so返回的严重延迟
- [服务器-60025](https://jira.mongodb.org/browse/SERVER-60025)由于生成无效的运行时对象，队列文档使服务器崩溃
- [服务器-60062](https://jira.mongodb.org/browse/SERVER-60062)修复拓扑描述克隆中发现的重复uuid和服务器描述深度副本
- [服务器-60085](https://jira.mongodb.org/browse/SERVER-60085)回退测试套件的上限数量与套件中的测试数量
- [服务器-60290](https://jira.mongodb.org/browse/SERVER-60290)更新Windows外部授权测试发行版
- [服务器-60299](https://jira.mongodb.org/browse/SERVER-60299)Bugzilla #2613的Backport PCRE错误修复
- [服务器-60406](https://jira.mongodb.org/browse/SERVER-60406)当没有搜索结果时，$searchMeta在分片集群中的未分片集合上失败
- [WT-5270](https://jira.mongodb.org/browse/WT-5270)为常青创建wtperf脚本
- [WT-6193](https://jira.mongodb.org/browse/WT-6193)在格式测试中重新启用VLCS测试
- [WT-6669](https://jira.mongodb.org/browse/WT-6669)在常青中启用VLCS覆盖和检查点测试
- [WT-6900](https://jira.mongodb.org/browse/WT-6900)为架构指南编写“模式”子页面
- [WT-6903](https://jira.mongodb.org/browse/WT-6903)为建筑指南编写“dhandle/btree”子页面
- [WT-6907](https://jira.mongodb.org/browse/WT-6907)为架构指南编写“快照”子页面
- [WT-6909](https://jira.mongodb.org/browse/WT-6909)驱逐建筑指南
- [WT-6913](https://jira.mongodb.org/browse/WT-6913)文件系统和os接口架构指南
- [WT-7169](https://jira.mongodb.org/browse/WT-7169)提交ts不应小于test_timestamp22.py中最后一个耐用的ts
- [WT-7294](https://jira.mongodb.org/browse/WT-7294)重新启用VLCS常绿内生性测试
- [WT-7392](https://jira.mongodb.org/browse/WT-7392)添加了驱逐的旗帜来处理，供会话扫描使用
- [WT-7601](https://jira.mongodb.org/browse/WT-7601)修复操作跟踪文档中的错别字
- [WT-7695](https://jira.mongodb.org/browse/WT-7695)在__cursor_key_order_check_row中发现密钥乱序时，倾倒整棵树
- [WT-7745](https://jira.mongodb.org/browse/WT-7745)添加宏来识别btree对象的uris
- [WT-7757](https://jira.mongodb.org/browse/WT-7757)跳过过时的页，而无需阅读它们
- [WT-7844](https://jira.mongodb.org/browse/WT-7844)为分层存储添加tiered_abort压力测试。
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
- [WT-8119](https://jira.mongodb.org/browse/WT-8119)将有针对性的紧凑测试添加到现有测试框架中
- [WT-8121](https://jira.mongodb.org/browse/WT-8121)创建一个长期运行的压力测试，在很长一段时间内插入大量数据
- [WT-8125](https://jira.mongodb.org/browse/WT-8125)更新hs_cleanup cppsuite测试以使用新的thread_context逻辑
- [WT-8126](https://jira.mongodb.org/browse/WT-8126)只有在实例化已删除的行商店页页面时，才将btree标记为脏
- [WT-8146](https://jira.mongodb.org/browse/WT-8146)CPP测试结束时停止跟踪组件
- [WT-8148](https://jira.mongodb.org/browse/WT-8148)修复util_verify.c中的评论错别字
- [WT-8161](https://jira.mongodb.org/browse/WT-8161)减少CMake常青烟雾的冗长
- [WT-8162](https://jira.mongodb.org/browse/WT-8162)在'define_c_test'助手中重构烟雾arg的使用
- [WT-8164](https://jira.mongodb.org/browse/WT-8164)在Windows上禁用rollback_to_stable10 python测试
- [WT-8171](https://jira.mongodb.org/browse/WT-8171)在CPP测试框架中实现C风格测试
- [WT-8193](https://jira.mongodb.org/browse/WT-8193)VLCS回滚到稳定中的错误角落案例



## 4.4.9 更改日志

### 安全

[服务器-57716](https://jira.mongodb.org/browse/SERVER-57716)PEM中的部分证书链导致OCSP中的验证失败

### 复制

- [服务器-34938](https://jira.mongodb.org/browse/SERVER-34938)由于单个oplog批次将内容固定在缓存中，导致二次减速或挂起
- [服务器-36263](https://jira.mongodb.org/browse/SERVER-36263)在applyOps中绕过操作验证应该需要特殊特权
- [服务器-44316](https://jira.mongodb.org/browse/SERVER-44316)在InitialSyncer中记录消息以开始应用时间戳不正确
- [服务器-59212](https://jira.mongodb.org/browse/SERVER-59212)在catchup_takeover_with_higher_config.js中等待追赶接管之前，请确保节点已下台
- [服务器-59478](https://jira.mongodb.org/browse/SERVER-59478)在 catchup_takeover_with_higher_config.js中获取RSTL之前，请移动serverStatus命令

### 查询

[服务器-57178](https://jira.mongodb.org/browse/SERVER-57178)添加多键复合指数的回归测试

### 储存

[服务器-56877](https://jira.mongodb.org/browse/SERVER-56877)中止多键目录更新后，插入操作可能无法将索引设置为多键

### 构建和包装

[WT-7830](https://jira.mongodb.org/browse/WT-7830)迁移python设置脚本以使用cmake

### 内部人员

- [服务器-49435](https://jira.mongodb.org/browse/SERVER-49435)如果连接未来没有立即准备就绪，NetworkInterfaceTL::setTimer中的uassert可能会导致服务器崩溃
- [服务器-53069](https://jira.mongodb.org/browse/SERVER-53069)禁用地址和记忆消毒剂变体的死亡测试
- [服务器-53479](https://jira.mongodb.org/browse/SERVER-53479)在 mirror_reads.js 中等待镜像操作
- [服务器-53849](https://jira.mongodb.org/browse/SERVER-53849)在timetamped_reads_wait_for_prepare_oplog_visibility.js中远离getLog
- [服务器-55589](https://jira.mongodb.org/browse/SERVER-55589)replSetMaintenance命令不接受RSTL
- [服务器-56580](https://jira.mongodb.org/browse/SERVER-56580)提升构建工具=稳定的下一个
- [服务器-57262](https://jira.mongodb.org/browse/SERVER-57262)允许节点投票给配置更高的候选人
- [服务器-57268](https://jira.mongodb.org/browse/SERVER-57268)添加多键查询到validate_multikey_restart.js
- [服务器-57360](https://jira.mongodb.org/browse/SERVER-57360)在~LockerImpl中记录“不变（_requests.empty（））；”的额外调试信息
- [服务器-57630](https://jira.mongodb.org/browse/SERVER-57630)在Ubuntu 18.04上对OpenSSL 1.1.1运行时启用SSL_OP_NO_RENEGOTIATION
- [服务器-57752](https://jira.mongodb.org/browse/SERVER-57752)在清洁关闭检查站期间测试终止蒙古
- [服务器-57893](https://jira.mongodb.org/browse/SERVER-57893)使rsm_horizon_change.js对网络故障具有弹性
- [服务器-58051](https://jira.mongodb.org/browse/SERVER-58051)Mongod.exe不会在Windows 10上发布旋转日志的文件句柄
- [服务器-58169](https://jira.mongodb.org/browse/SERVER-58169)围绕稳定时间戳计算来记录不变量的时间戳信息
- [服务器-58184](https://jira.mongodb.org/browse/SERVER-58184)当在启动时恢复准备好的事务时，检查点线程会导致断言
- [服务器-58280](https://jira.mongodb.org/browse/SERVER-58280)当索引构建处于活动状态时，初始同步挂在隐藏掉落的索引上
- [服务器-58402](https://jira.mongodb.org/browse/SERVER-58402)在 shutdown_primary.js 中增加关机命令的超时
- [服务器-58581](https://jira.mongodb.org/browse/SERVER-58581)添加从mongot填充的SEARCH_META变量
- [服务器-58582](https://jira.mongodb.org/browse/SERVER-58582)创建$文档阶段并实现无集合unionWith
- [服务器-58588](https://jira.mongodb.org/browse/SERVER-58588)实施$searchMeta阶段
- [服务器-58594](https://jira.mongodb.org/browse/SERVER-58594)ReplicationCoordinatorImpl::handleHeartbeatResponse_forTest在读取_rsConfig时不使用_mutex
- [服务器-58676](https://jira.mongodb.org/browse/SERVER-58676)禁止在分片集合中设置SEARCH_META变量的管道
- [服务器-58813](https://jira.mongodb.org/browse/SERVER-58813)Robustify jstests/multiversion/hashed_index_bad_keys_cleanup.js
- [服务器-58886](https://jira.mongodb.org/browse/SERVER-58886)允许从分片搜索查询返回“vars”结果，但在SEARCH_META访问失败
- [服务器-59135](https://jira.mongodb.org/browse/SERVER-59135)使MSI中的mongocrypted目标依赖于libsasl2
- [服务器-59188](https://jira.mongodb.org/browse/SERVER-59188)覆盖率分析缺陷120391：单硝化标量场
- [服务器-59197](https://jira.mongodb.org/browse/SERVER-59197)当相应的会话文档被删除时，删除fam图像条目
- [服务器-59242](https://jira.mongodb.org/browse/SERVER-59242)更新到snmp 5.9.1
- [服务器-59262](https://jira.mongodb.org/browse/SERVER-59262)从storeFindAndModifyImagesInSideCollection构建变体中删除burn_in_tests任务
- [服务器-59414](https://jira.mongodb.org/browse/SERVER-59414)在旧分支的Powercycle中重试策展人设置
- [服务器-59469](https://jira.mongodb.org/browse/SERVER-59469)在burn_in_tags变体列表中添加缺失的空间
- [服务器-59573](https://jira.mongodb.org/browse/SERVER-59573)添加setParameter，可用于在会话中恢复不活跃的光标超时
- [WT-6755](https://jira.mongodb.org/browse/WT-6755)文档：填充开发人员术语表
- [WT-6902](https://jira.mongodb.org/browse/WT-6902)架构指南的元数据子页面
- [WT-6910](https://jira.mongodb.org/browse/WT-6910)为建筑指南编写“历史商店”子页面
- [WT-6911](https://jira.mongodb.org/browse/WT-6911)为架构指南编写“块管理器”子页面
- [WT-6914](https://jira.mongodb.org/browse/WT-6914)为架构指南编写“数据库文件”子页面
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
- [WT-7703](https://jira.mongodb.org/browse/WT-7703)修复test_checkpoint_snapshot04中的超时
- [WT-7718](https://jira.mongodb.org/browse/WT-7718)重命名'build_cmake'
- [WT-7732](https://jira.mongodb.org/browse/WT-7732)为flush_tier添加超时配置
- [WT-7758](https://jira.mongodb.org/browse/WT-7758)当更新链太长时，强制驱逐页面
- [WT-7787](https://jira.mongodb.org/browse/WT-7787)当缓存处于攻击模式时，不要阅读检查点清理页面
- [WT-7789](https://jira.mongodb.org/browse/WT-7789)将分层python测试更改为在没有扩展库的情况下失败
- [WT-7817](https://jira.mongodb.org/browse/WT-7817)使分层存储地址cookie向后兼容
- [WT-7838](https://jira.mongodb.org/browse/WT-7838)能够使有序时间戳断言比日志消息做更多的事情
- [WT-7842](https://jira.mongodb.org/browse/WT-7842)在多集合测试中删除显式ulimit-n调用
- [WT-7860](https://jira.mongodb.org/browse/WT-7860)改进代码覆盖范围报告
- [WT-7864](https://jira.mongodb.org/browse/WT-7864)添加对run.py的支持，用于在测试中运行列表/场景范围
- [WT-7865](https://jira.mongodb.org/browse/WT-7865)在RTS和测试之前等待驱逐时禁用超时断言
- [WT-7866](https://jira.mongodb.org/browse/WT-7866)更新cppsuite-hs-cleanup-stress中的cache_hs_insert限制
- [WT-7870](https://jira.mongodb.org/browse/WT-7870)修复循环代码复杂性的测量
- [WT-7871](https://jira.mongodb.org/browse/WT-7871)删除不再正确的注释
- [WT-7874](https://jira.mongodb.org/browse/WT-7874)删除另外两个陈旧的评论
- [WT-7876](https://jira.mongodb.org/browse/WT-7876)更新回滚到稳定测试，以使用正确的布尔值并更新统计检查逻辑
- [WT-7880](https://jira.mongodb.org/browse/WT-7880)修复了准备好更新后的更新在历史记录存储中时的历史商店记录问题
- [WT-7882](https://jira.mongodb.org/browse/WT-7882)修复mongodb-4.4分支上wiredtiger.in的差异
- [WT-7883](https://jira.mongodb.org/browse/WT-7883)删除错误的wt_free语句
- [WT-7889](https://jira.mongodb.org/browse/WT-7889)在参考指南中查找/替换WiredTiger的现有用途
- [WT-7890](https://jira.mongodb.org/browse/WT-7890)修复config_lib中的CMake语法错误
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



## 4.4.8 更改日志

### 安全

[服务器-57727](https://jira.mongodb.org/browse/SERVER-57727)x509_invalid.js中的比赛条件

### 分片

- [服务器-6036](https://jira.mongodb.org/browse/SERVER-6036)禁用属于会话的光标超时
- [服务器-52906](https://jira.mongodb.org/browse/SERVER-52906)moveChunk在迁移失败后，由于缺少碎片密钥索引，回滚克隆索引可能会无限挂起
- [服务器-57850](https://jira.mongodb.org/browse/SERVER-57850)在authCommands.js上等待迁移时增加超时

### 复制

- [服务器-37904](https://jira.mongodb.org/browse/SERVER-37904)允许节点覆盖集群链（启用/禁用）设置
- [服务器-58164](https://jira.mongodb.org/browse/SERVER-58164)当组插入失败时，错误类型不会打印在日志中。
- [服务器-58258](https://jira.mongodb.org/browse/SERVER-58258)等待初始同步以清除状态，然后断言“replSetGetStatus”回复没有“initialSync”字段

### 查询

[服务器-58127](https://jira.mongodb.org/browse/SERVER-58127)修复benchRun()内存泄漏，以便在异常下解析benchRun() args

### 储存

- [服务器-49714](https://jira.mongodb.org/browse/SERVER-49714)当存在多个oplog集合时，Oplog可见性线程可以从无拥有的内存中读取
- [服务器-50287](https://jira.mongodb.org/browse/SERVER-50287)drop_index.js在带有stepdown的直通套件中运行时失败

### 构建和包装

[服务器-54729](https://jira.mongodb.org/browse/SERVER-54729)MongoDB Enterprise Debian/Ubuntu软件包应依赖于libsasl2-modules和libsasl2-modules-gssapi-mit

### 内部人员

- [服务器-56424](https://jira.mongodb.org/browse/SERVER-56424)改进系统错误ENOSPC的索引构建不变消息“28：设备上没有空格”
- [服务器-56620](https://jira.mongodb.org/browse/SERVER-56620)节点应明确清除仲裁器 durableOpTimeAndWalltime
- [服务器-57642](https://jira.mongodb.org/browse/SERVER-57642)src/mongo/db/query/plan_yield_policy.cpp 75上的不变故障 | 中止
- [服务器-57650](https://jira.mongodb.org/browse/SERVER-57650)在等待对收件人命令的响应时，使MigrationChunkClonerSource可中断
- [服务器-57798](https://jira.mongodb.org/browse/SERVER-57798)当由于使用./install_compass的连接问题而无法安装MongoDB指南针时，请引导用户访问MongoDB指南针下载页面
- [服务器-57983](https://jira.mongodb.org/browse/SERVER-57983)经典引擎中$range的整数溢出
- [服务器-58187](https://jira.mongodb.org/browse/SERVER-58187)提高连接收割器和MongoLDAP性能
- [服务器-58191](https://jira.mongodb.org/browse/SERVER-58191)[迁移协议]允许delete_during_migrate.js容忍缓慢变体的追赶阶段超时导致的块迁移失败。
- [服务器-58283](https://jira.mongodb.org/browse/SERVER-58283)添加一个新的版本文件来设置MONGO_VERSION和MONGO_GIT_HASH
- [服务器-58936](https://jira.mongodb.org/browse/SERVER-58936)唯一的索引约束可能不会被执行
- [WT-6280](https://jira.mongodb.org/browse/WT-6280)如果与检查站处理比赛秩序混乱，则失败驱逐
- [WT-6729](https://jira.mongodb.org/browse/WT-6729)在运行回滚到稳定的活跃事务检查之前，先进行驱逐
- [WT-6782](https://jira.mongodb.org/browse/WT-6782)test_prepare_hs02 WT_ROLLBACK失败：并发操作之间的冲突
- [WT-7231](https://jira.mongodb.org/browse/WT-7231)将CMake构建和测试添加到Evergreen中
- [WT-7279](https://jira.mongodb.org/browse/WT-7279)允许多个终止呼叫用于存储源扩展
- [WT-7343](https://jira.mongodb.org/browse/WT-7343)编写一个执行 many-collection-test.py 的脚本
- [WT-7383](https://jira.mongodb.org/browse/WT-7383)添加新的hs_cleanup测试和重构工作负载生成器和数据库操作的框架
- [WT-7473](https://jira.mongodb.org/browse/WT-7473)解决代码中的“TODO：分层”注释
- [WT-7507](https://jira.mongodb.org/browse/WT-7507)更新历史商店和时间戳世界的打捞
- [WT-7520](https://jira.mongodb.org/browse/WT-7520)将开始和停止值添加到自动标志生成代码中
- [WT-7524](https://jira.mongodb.org/browse/WT-7524)重构函数以获取检查点列表；在跳过检查点时清除删除
- [WT-7539](https://jira.mongodb.org/browse/WT-7539)添加一个配置选项，允许用户指定调试模式。
- [WT-7543](https://jira.mongodb.org/browse/WT-7543)在构建默认配置路径时传递正确的测试名称
- [WT-7553](https://jira.mongodb.org/browse/WT-7553)放松对驱逐快速截断页面的限制，以避免缓存卡住的故障
- [WT-7556](https://jira.mongodb.org/browse/WT-7556)修复test_rollback_to_stable10失败cave_hs_ondisk为0
- [WT-7583](https://jira.mongodb.org/browse/WT-7583)覆盖分析缺陷114074：逻辑死代码（返工）
- [WT-7585](https://jira.mongodb.org/browse/WT-7585)修复循环复杂度测试失败
- [WT-7589](https://jira.mongodb.org/browse/WT-7589)修复分层测试中刷新层后重新打开连接的问题
- [WT-7603](https://jira.mongodb.org/browse/WT-7603)对统计数据进行排序以修复JSON输出
- [WT-7605](https://jira.mongodb.org/browse/WT-7605)放弃对百万收藏测试的支持
- [WT-7609](https://jira.mongodb.org/browse/WT-7609)报告在多考尔测试中启动和关闭数据库所花费的时间
- [WT-7616](https://jira.mongodb.org/browse/WT-7616)根据许多集合工作根工作负载创建及格或失败测试
- [WT-7619](https://jira.mongodb.org/browse/WT-7619)当页面上的所有条目被删除时，添加新的优化，以跳过光标遍历中的页面
- [WT-7626](https://jira.mongodb.org/browse/WT-7626)我们只确保更新还原驱逐发生在测试调试模式09
- [WT-7628](https://jira.mongodb.org/browse/WT-7628)当测试框架中提供无效的命令行args时，返回错误消息
- [WT-7629](https://jira.mongodb.org/browse/WT-7629)在代码库中的.cxx文件上运行clang格式。
- [WT-7632](https://jira.mongodb.org/browse/WT-7632)修复test_rollback_to_stable14中的无效参数
- [WT-7639](https://jira.mongodb.org/browse/WT-7639)在断言丢失的文件之前，更改test_tiered02.py以收集更多数据
- [WT-7640](https://jira.mongodb.org/browse/WT-7640)修复test_backup02故障，其中检查点表因不支持检查点光标而不同
- [WT-7644](https://jira.mongodb.org/browse/WT-7644)实现分层存储的python钩子
- [WT-7646](https://jira.mongodb.org/browse/WT-7646)删除WT_WITH_BUCKET_STORAGE宏的不需要的用途
- [WT-7647](https://jira.mongodb.org/browse/WT-7647)更改Zstandard包装，以包含上下文管理
- [WT-7649](https://jira.mongodb.org/browse/WT-7649)恢复期间跳过时间戳断言
- [WT-7659](https://jira.mongodb.org/browse/WT-7659)不允许在分层表上重命名
- [WT-7660](https://jira.mongodb.org/browse/WT-7660)在cpp测试框架中将poc_test重命名为base_test，并添加insert_operation逻辑
- [WT-7667](https://jira.mongodb.org/browse/WT-7667)修复工作根JSON输出
- [WT-7668](https://jira.mongodb.org/browse/WT-7668)重载hs_cleanup测试的更新方法
- [WT-7670](https://jira.mongodb.org/browse/WT-7670)修改测试标签格式并标记额外的python测试
- [WT-7672](https://jira.mongodb.org/browse/WT-7672)从Windows CMake Evergreen构建变体中删除量级检查测试
- [WT-7674](https://jira.mongodb.org/browse/WT-7674)减少快速截断页面的回滚到稳定的工作
- [WT-7675](https://jira.mongodb.org/browse/WT-7675)在不使用检查点的情况下查询最后一个ckpt时间戳更改
- [WT-7676](https://jira.mongodb.org/browse/WT-7676)重新格式化wtperf备份，仅读取文件，而不是wt_copy_and_sync
- [WT-7679](https://jira.mongodb.org/browse/WT-7679)为多处理应力创建一个常青测试
- [WT-7680](https://jira.mongodb.org/browse/WT-7680)重构回滚到稳定，以支持对单个文件进行操作
- [WT-7683](https://jira.mongodb.org/browse/WT-7683)添加python测试钩子在connection.close()期间调用flush_tier()
- [WT-7685](https://jira.mongodb.org/browse/WT-7685)修复工作根中延迟的无效值和单位
- [WT-7686](https://jira.mongodb.org/browse/WT-7686)修复配置调用，允许“同步”选项适用于flush_tier
- [WT-7687](https://jira.mongodb.org/browse/WT-7687)在内部线程之前停止分层管理器线程
- [WT-7689](https://jira.mongodb.org/browse/WT-7689)在__curhs_insert中修复双免费修复
- [WT-7690](https://jira.mongodb.org/browse/WT-7690)修复将枚举与0进行比较时的覆盖率错误（incr_backup:table_changes）
- [WT-7692](https://jira.mongodb.org/browse/WT-7692)修复osx10 14 cmake上的检查测试失败
- [WT-7696](https://jira.mongodb.org/browse/WT-7696)修复覆盖率错误 - _rollback_to_stable_btree_apply_all中未使用的变量
- [WT-7698](https://jira.mongodb.org/browse/WT-7698)在许多dhandles场景中减少max_latency值，适用于工作生成
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
- [WT-7882](https://jira.mongodb.org/browse/WT-7882)修复mongodb-4.4分支上wiredtiger.in的差异



## 4.4.7 更改日志

### 安全

- [服务器-55797](https://jira.mongodb.org/browse/SERVER-55797)修复x509_invalid.js中的种族问题
- [服务器-56240](https://jira.mongodb.org/browse/SERVER-56240)打开密钥存储数据存储的检查点

### 分片

- [服务器-47534](https://jira.mongodb.org/browse/SERVER-47534)Unblacklist mongos_dataSize.js from sharding_last_stable_mongos_and_mixed_shards suite
- [服务器-47699](https://jira.mongodb.org/browse/SERVER-47699)将范围删除器使用的收益类型从YIELD_MANUAL更改为YIELD_AUTO
- [服务器-48648](https://jira.mongodb.org/browse/SERVER-48648)在_configsvrCommitChunkMerge中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-48653](https://jira.mongodb.org/browse/SERVER-48653)在_configsvrCommitChunkSplit中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-50209](https://jira.mongodb.org/browse/SERVER-50209)ShardRegistry内部重新加载不会中断
- [服务器-51170](https://jira.mongodb.org/browse/SERVER-51170)确保在ShardingState初始化后进行数据库刷新
- [服务器-54675](https://jira.mongodb.org/browse/SERVER-54675)如果在启动时发现为负数或从复制回滚中出来，则将收集数据大小四舍五入为零
- [服务器-56261](https://jira.mongodb.org/browse/SERVER-56261)hasTransientTransactionOrRetryableWriteError的不变故障
- [服务器-56654](https://jira.mongodb.org/browse/SERVER-56654)不要将集合分布式锁用于块分割
- [服务器-56779](https://jira.mongodb.org/browse/SERVER-56779)不要将集合分布式锁用于块合并
- [服务器-56786](https://jira.mongodb.org/browse/SERVER-56786)mergeChunks路径上有三个路由信息刷新和两个块扫描
- [服务器-57009](https://jira.mongodb.org/browse/SERVER-57009)在FCV更改期间发生崩溃时的额外调试信息
- [服务器-57055](https://jira.mongodb.org/browse/SERVER-57055)delete_during_migrate.js在启用了代码覆盖的测试套件中始终失败
- [服务器-57102](https://jira.mongodb.org/browse/SERVER-57102)修复ShardServerCatalogCacheLoader上的不变量，以考虑不同的术语
- [服务器-57475](https://jira.mongodb.org/browse/SERVER-57475)ShardingTest.stop必须加入顶级块迁移
- [服务器-58109](https://jira.mongodb.org/browse/SERVER-58109)新的'_configsvrMergeChunks'路径比旧路径更贵

### 复制

- [服务器-50327](https://jira.mongodb.org/browse/SERVER-50327)在new_transaction_waits_for_previous_txn_table_updates.js中将命名空间参数添加到故障点
- [服务器-53447](https://jira.mongodb.org/browse/SERVER-53447)Blacklist insert1.js with from transaction passthrough tests with failure
- [服务器-55070](https://jira.mongodb.org/browse/SERVER-55070)避免解析BSON oplog条目中的不必要的字段
- [服务器-55120](https://jira.mongodb.org/browse/SERVER-55120)修复启动时出现无效配置时致命错误消息的文档链接
- [服务器-55465](https://jira.mongodb.org/browse/SERVER-55465)在选举中，当当前初选投票请求失败时，修复不变问题，即迎头收购
- [服务器-55573](https://jira.mongodb.org/browse/SERVER-55573)降级和块迁移之间的僵局
- [服务器-55751](https://jira.mongodb.org/browse/SERVER-55751)在initial_sync_nodes_contribute_to_liveness_majority.js中增加选举超时
- [服务器-55766](https://jira.mongodb.org/browse/SERVER-55766)引入优化的“用于恢复”启动复制恢复机制
- [服务器-56054](https://jira.mongodb.org/browse/SERVER-56054)将复制写入器线程池的minThreads值更改为0
- [服务器-56415](https://jira.mongodb.org/browse/SERVER-56415)当给定非默认节点集时，AwaitNodesAgreeOnPrimary不起作用
- [服务器-56937](https://jira.mongodb.org/browse/SERVER-56937)multi_rs.js中的upgradeSet()在升级主服务器时可能会失去身份验证状态

### 查询

- [服务器-53433](https://jira.mongodb.org/browse/SERVER-53433)地图减少是在直接连接到碎片时版本的
- [服务器-56144](https://jira.mongodb.org/browse/SERVER-56144)将所有与查询相关的微基准切换为使用命令而不是传统的有线协议
- [服务器-56465](https://jira.mongodb.org/browse/SERVER-56465)变量中的不变失败::getRuntimeConstants() const

### 写入操作

- [服务器-38909](https://jira.mongodb.org/browse/SERVER-38909)允许空更新修饰符，视为无操作而不是错误
- [服务器-56518](https://jira.mongodb.org/browse/SERVER-56518)findAndModify无条件删除无条件写入图像前无操作操作日志条目，导致块迁移期间崩溃

### 集合

[服务器-53760](https://jira.mongodb.org/browse/SERVER-53760)$unwind + $sort管道在溢出到磁盘时会产生大量文件句柄

### 储存

- [服务器-46805](https://jira.mongodb.org/browse/SERVER-46805)验证应该限制第二次通行证中的内存使用
- [服务器-48528](https://jira.mongodb.org/browse/SERVER-48528)由于KeyString散列，ValidateTests可能会偶尔失败
- [服务器-51699](https://jira.mongodb.org/browse/SERVER-51699)index_build_restart_secondary.js（indexbg_restart_secondary.js）在重新启动节点后检查索引时应处理异常
- [服务器-54005](https://jira.mongodb.org/browse/SERVER-54005)oplogTruncateAfterPoint逻辑可能无法找到带有时间戳LTE WT的all_durable时间戳的oplog条目
- [服务器-56780](https://jira.mongodb.org/browse/SERVER-56780)[4.4] mongod collStats不处理规模的大值

### 运营

[服务器-48567](https://jira.mongodb.org/browse/SERVER-48567)处理snmpwalk时的警告

### 构建和包装

- [服务器-46871](https://jira.mongodb.org/browse/SERVER-46871)liblzma的存在显然没有通过配置来检查
- [服务器-48691](https://jira.mongodb.org/browse/SERVER-48691)修复Windows Enterprise Server上的Ninja构建版本
- [服务器-50568](https://jira.mongodb.org/browse/SERVER-50568)平台支持：从5.0中删除Ubuntu18.04 zSeries
- [服务器-53054](https://jira.mongodb.org/browse/SERVER-53054)忍者构建器无法在Windows上链接到LNK1561：必须定义入口点
- [服务器-53952](https://jira.mongodb.org/browse/SERVER-53952)使用ninja + ASan构建毒害了构建/安装/目录
- [服务器-55460](https://jira.mongodb.org/browse/SERVER-55460)修复SLES 12的RPM包装和测试

### 内部人员

- [服务器-37125](https://jira.mongodb.org/browse/SERVER-37125)如果进程参考已不复存在，Powercycle应忽略它
- [服务器-40820](https://jira.mongodb.org/browse/SERVER-40820)Jstestfuzz套件介绍虚假的写入冲突
- [服务器-47720](https://jira.mongodb.org/browse/SERVER-47720)澄清“在密钥索引中找不到RecordId（...）”日志消息
- [服务器-48890](https://jira.mongodb.org/browse/SERVER-48890)允许带有空文档的$addFields，并使其不执行
- [服务器-49336](https://jira.mongodb.org/browse/SERVER-49336)如果客户端元数据在失败期间丢失，请设置客户端元数据Command
- [服务器-49930](https://jira.mongodb.org/browse/SERVER-49930)在createCollectionForApplyOps()中记录集合名称，不变，在稳态复制中集合不会被重命名
- [服务器-50549](https://jira.mongodb.org/browse/SERVER-50549)在代理命令中转换与连接相关的错误代码
- [服务器-50576](https://jira.mongodb.org/browse/SERVER-50576)MSI安装程序中缺少mongokerberos实用程序
- [服务器-50662](https://jira.mongodb.org/browse/SERVER-50662)在FTDC中支持大双倍值和其他双值
- [服务器-51172](https://jira.mongodb.org/browse/SERVER-51172)在计算测试时间时，重新吸烟有时会抛出TypeError
- [服务器-52657](https://jira.mongodb.org/browse/SERVER-52657)index_commands_shard_targeting.js依赖于太短的MaxTimeMs
- [服务器-52689](https://jira.mongodb.org/browse/SERVER-52689)重新启用 refine_shard_key_transaction_stress
- [服务器-53035](https://jira.mongodb.org/browse/SERVER-53035)在单元测试中提供一种从非主线程进行ASSERT的方法
- [服务器-53187](https://jira.mongodb.org/browse/SERVER-53187)split_vector/chunk_splitter行22107和21908的结构化日志改进
- [服务器-53334](https://jira.mongodb.org/browse/SERVER-53334)意外不变故障，导致服务器关机
- [服务器-53624](https://jira.mongodb.org/browse/SERVER-53624)4.4 mongos没有将RetryableWriteError标签附加到关机错误
- [服务器-53643](https://jira.mongodb.org/browse/SERVER-53643)启动可以看到旧版本的功能兼容性版本文档
- [服务器-53646](https://jira.mongodb.org/browse/SERVER-53646)如果在awaitable_hello_on_nodes_with_invalid_configs.js中等待故障点抛出，则捕获异常
- [服务器-53671](https://jira.mongodb.org/browse/SERVER-53671)使~PooledScope()对“InterruptedAtShutdown”异常具有弹性
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-54489](https://jira.mongodb.org/browse/SERVER-54489)完全验证可以不受约束地附加错误
- [服务器-54793](https://jira.mongodb.org/browse/SERVER-54793)如果任务成功，请删除核心文件
- [服务器-54878](https://jira.mongodb.org/browse/SERVER-54878)Compact可以记录freedBytes的错误值
- [服务器-54890](https://jira.mongodb.org/browse/SERVER-54890)在4.4中禁用上限集合的后台验证和dbHash检查
- [服务器-54896](https://jira.mongodb.org/browse/SERVER-54896)设置 getLastErrorDefaults 会破坏多文档事务
- [服务器-55012](https://jira.mongodb.org/browse/SERVER-55012)renameBetweenDBs需要在writeConflict的情况下始终重新定位其光标
- [服务器-55034](https://jira.mongodb.org/browse/SERVER-55034)配置文件命令不应接受S或X数据库锁
- [服务器-55119](https://jira.mongodb.org/browse/SERVER-55119)创建启动警告，表明不建议使用没有SAN的X.509证书
- [服务器-55249](https://jira.mongodb.org/browse/SERVER-55249)将所有数据文件存档在主线所需构建器上失败测试
- [服务器-55275](https://jira.mongodb.org/browse/SERVER-55275)索引生成器必须检查收集扫描和批量加载阶段之间的中断
- [服务器-55316](https://jira.mongodb.org/browse/SERVER-55316)断开LDAP连接线
- [服务器-55742](https://jira.mongodb.org/browse/SERVER-55742)在windows/macOS上定义kmipClientCertificateSelector配置
- [服务器-55753](https://jira.mongodb.org/browse/SERVER-55753)在 transactions_committed_with_tickets_exhausted.js中使用w: majority for createCollection命令
- [服务器-56062](https://jira.mongodb.org/browse/SERVER-56062)在CappedPositionLost错误后重新启动索引构建
- [服务器-56164](https://jira.mongodb.org/browse/SERVER-56164)所有性能项目都使用主DSI分支
- [服务器-56216](https://jira.mongodb.org/browse/SERVER-56216)提交队列应验证代码中没有打开的TODO
- [服务器-56307](https://jira.mongodb.org/browse/SERVER-56307)块迁移“收敛算法”非常原始
- [服务器-56310](https://jira.mongodb.org/browse/SERVER-56310)在kill_sessions_with_prepared_transaction.js中使用w：多数创建收藏命令
- [服务器-56325](https://jira.mongodb.org/browse/SERVER-56325)等待 server_transaction_metrics.js 中的故障点被击中，以便收到有效的 serverStatus
- [服务器-56347](https://jira.mongodb.org/browse/SERVER-56347)在发布中启用LSE内在功能
- [服务器-56371](https://jira.mongodb.org/browse/SERVER-56371)将时间lib升级到2021.06
- [服务器-56372](https://jira.mongodb.org/browse/SERVER-56372)添加retryableFindAndModifyStorageLocation服务器参数
- [服务器-56373](https://jira.mongodb.org/browse/SERVER-56373)[RRFaM]将FaM图像写入txn表时，使用需求编写oplog条目RetryImage
- [服务器-56374](https://jira.mongodb.org/browse/SERVER-56374)[RRFaM]将更新路径写入config.image_collection
- [服务器-56375](https://jira.mongodb.org/browse/SERVER-56375)[RRFaM]将删除路径写入config.transactions
- [服务器-56376](https://jira.mongodb.org/browse/SERVER-56376)[RRFaM]添加jstest来练习两个可重试的FaM行为
- [服务器-56377](https://jira.mongodb.org/browse/SERVER-56377)[RRFaM]添加FSM测试，在翻转服务器参数时执行可重试的FaM
- [服务器-56452](https://jira.mongodb.org/browse/SERVER-56452)PooledLDAPConnection::setup的回调中的自锚
- [服务器-56468](https://jira.mongodb.org/browse/SERVER-56468){$ne: null}谓词的计划缓存条目不正确，导致查询结果缺失
- [服务器-56501](https://jira.mongodb.org/browse/SERVER-56501)为旧操作代码（OP_QUERY、OP_INSERT等）添加操作计数器
- [服务器-56509](https://jira.mongodb.org/browse/SERVER-56509)将唯一的索引插入_keyExists调用包装在WT光标重新配置中。
- [服务器-56516](https://jira.mongodb.org/browse/SERVER-56516)修复$slice投影运算符解析代码中的未定义行为
- [服务器-56563](https://jira.mongodb.org/browse/SERVER-56563)[RRFaM]为块迁移伪造noop图像oplog条目
- [服务器-56630](https://jira.mongodb.org/browse/SERVER-56630)Unittest OpObserverImpl::onDelete/onUpdate paths for retryable findAndModify
- [服务器-56713](https://jira.mongodb.org/browse/SERVER-56713)[RRFaM]避免在初始同步时创建图像
- [服务器-56751](https://jira.mongodb.org/browse/SERVER-56751)作为运行补丁构建的一部分，检查待办事项注释
- [服务器-56772](https://jira.mongodb.org/browse/SERVER-56772)如果在collMod期间发生写入冲突，验证器BSON将丢失
- [服务器-56819](https://jira.mongodb.org/browse/SERVER-56819)$indexOfCP在使用非零开始索引（仅限经典执行引擎）的空字符串中搜索空字符串时返回错误的结果
- [服务器-56839](https://jira.mongodb.org/browse/SERVER-56839)与最近提交的准备交易同时进行的指数寻求可能会返回错误的结果
- [服务器-56929](https://jira.mongodb.org/browse/SERVER-56929)改进错误消息，以处理不当降级导致收集选项无效的问题
- [服务器-56952](https://jira.mongodb.org/browse/SERVER-56952)[4.4]使用storeFindAndModifyImagesInSideCollection=true添加新的构建变体
- [服务器-56961](https://jira.mongodb.org/browse/SERVER-56961)[v4.4]在运行FuzserRestoreClusterSettings钩子时，确保集群在FCV 4.4中
- [服务器-56976](https://jira.mongodb.org/browse/SERVER-56976)当索引构建等待提交法定人数满足时，“setIndexCommitQuorum”命令无效
- [服务器-57015](https://jira.mongodb.org/browse/SERVER-57015)[RRFaM]写入图像集合必须处于UnreplicatedWriteBlock中
- [服务器-57036](https://jira.mongodb.org/browse/SERVER-57036)Pin MarkupSafe == 1.1.0
- [服务器-57043](https://jira.mongodb.org/browse/SERVER-57043)分支测试
- [服务器-57053](https://jira.mongodb.org/browse/SERVER-57053)用$not的$text重写$nor无效
- [服务器-57057](https://jira.mongodb.org/browse/SERVER-57057)减少mergeChunks路径上的路由信息刷新
- [服务器-57064](https://jira.mongodb.org/browse/SERVER-57064)在mongos上记录创建索引和dropIndex（es）
- [服务器-57074](https://jira.mongodb.org/browse/SERVER-57074)[v4.4] 将 require_document_locking 标签添加到 index_build_capped_position_lost.js
- [服务器-57084](https://jira.mongodb.org/browse/SERVER-57084)MSI的构建必须取决于PDB的安装
- [服务器-57091](https://jira.mongodb.org/browse/SERVER-57091)粒度中的无限循环RounderPreferredNumbers::roundDown
- [服务器-57117](https://jira.mongodb.org/browse/SERVER-57117)ReadPreference设置解析对“对冲”选项的不正确类型没有弹性
- [服务器-57136](https://jira.mongodb.org/browse/SERVER-57136)分片集群中二次关机时的不兼容的线版本错误
- [服务器-57145](https://jira.mongodb.org/browse/SERVER-57145)OCSPManager::requestStatus上的不变故障
- [服务器-57157](https://jira.mongodb.org/browse/SERVER-57157)assert serverStatus命令在getBinVersion() jstest helper中工作
- [服务器-57172](https://jira.mongodb.org/browse/SERVER-57172)在DSI post_run之前发送json.s
- [服务器-57173](https://jira.mongodb.org/browse/SERVER-57173)当次要者在minValid之前应用操作时，为可重试的findAndModify编写无效的图像
- [服务器-57192](https://jira.mongodb.org/browse/SERVER-57192)[4.4]较低的dbHash和后台验证锁定获取超时
- [服务器-57233](https://jira.mongodb.org/browse/SERVER-57233)如果未启用多线程，则内联收割LDAP连接
- [服务器-57251](https://jira.mongodb.org/browse/SERVER-57251)修复salvage_incomplete_rolling_index_builds.js中的checkLog比赛
- [服务器-57270](https://jira.mongodb.org/browse/SERVER-57270)在ephemeralForTest上禁用prebread_cursor_out_of_bounds.js
- [服务器-57273](https://jira.mongodb.org/browse/SERVER-57273)删除flow_control_replica_set.js测试
- [服务器-57275](https://jira.mongodb.org/browse/SERVER-57275)更新kmip_server.py以更加冗长
- [服务器-57328](https://jira.mongodb.org/browse/SERVER-57328)使ReplsetTest.upgradeSet()容忍连任
- [服务器-57330](https://jira.mongodb.org/browse/SERVER-57330)更新perf和sys-perf的perf yaml配置以使用perf.send
- [服务器-57476](https://jira.mongodb.org/browse/SERVER-57476)操作可能会在保持操作时阻止准备冲突，无限期地停止复制
- [服务器-57492](https://jira.mongodb.org/browse/SERVER-57492)边桌写入插入的不仅仅是键串
- [服务器-57497](https://jira.mongodb.org/browse/SERVER-57497)store_retryable_find_and_modify_images_in_side_collection.js应该在重试的findAndModify响应中考虑稍后的集群时间
- [服务器-57541](https://jira.mongodb.org/browse/SERVER-57541)mypy 0.900 打破 lint_pylinters
- [服务器-57557](https://jira.mongodb.org/browse/SERVER-57557)[v4.4] 支持运行带有mongos连接的checkFCV() shell助手
- [服务器-57564](https://jira.mongodb.org/browse/SERVER-57564)将系统超时持续时间延长至>2小时，以便Fio复制所有文件
- [服务器-57708](https://jira.mongodb.org/browse/SERVER-57708)ClientMetadata解析错误可能会使ClientMetadataState装饰处于无效状态
- [服务器-57768](https://jira.mongodb.org/browse/SERVER-57768)不建议使用的计数器在包装时不会重置为零
- [服务器-57897](https://jira.mongodb.org/browse/SERVER-57897)将readPrefMode选项添加到benchRun find/findOne ops
- [服务器-57954](https://jira.mongodb.org/browse/SERVER-57954)在sys-perf.yml中更新TPC-C版本
- [服务器-58267](https://jira.mongodb.org/browse/SERVER-58267)修复v4.4中的shardVersion重试用法（SERVER-47530的部分樱桃选择）
- [服务器-58306](https://jira.mongodb.org/browse/SERVER-58306)如果在降级杀死opCtx后调用checkForInterrupt()，chunkInserter线程可以终止（）
- [WT-6204](https://jira.mongodb.org/browse/WT-6204)文件关闭时备份和检查点之间可能发生的比赛
- [WT-6230](https://jira.mongodb.org/browse/WT-6230)消毒python测试套件目录命名
- [WT-6362](https://jira.mongodb.org/browse/WT-6362)确保用户会话上下文中的历史记录存储操作正确
- [WT-6387](https://jira.mongodb.org/browse/WT-6387)删除未使用的WT_CURSTD_UPDATE_LOCAL标志
- [WT-6403](https://jira.mongodb.org/browse/WT-6403)恢复格式非时间戳事务性测试
- [WT-6436](https://jira.mongodb.org/browse/WT-6436)修复了重试搜索历史记录存储时未重置密钥的问题
- [WT-6538](https://jira.mongodb.org/browse/WT-6538)修复页面上准备可见性检查，如果开始和停止是否来自同一准备的交易
- [WT-6555](https://jira.mongodb.org/browse/WT-6555)修复test_txn13中的内存错误
- [WT-6576](https://jira.mongodb.org/browse/WT-6576)修复已中止的磁盘准备密钥
- [WT-6737](https://jira.mongodb.org/browse/WT-6737)在test_hs14中添加显式检查点以提高可预测性
- [WT-6893](https://jira.mongodb.org/browse/WT-6893)在兼容性测试中禁用huffman配置
- [WT-6956](https://jira.mongodb.org/browse/WT-6956)Cut WiredTiger 10.0.0版本
- [WT-7076](https://jira.mongodb.org/browse/WT-7076)在WiredTiger中分层存储的数据放置
- [WT-7092](https://jira.mongodb.org/browse/WT-7092)将打开/关闭缓存光标时对哈希URI的调用减少一个
- [WT-7105](https://jira.mongodb.org/browse/WT-7105)添加恢复错误消息以包含URI
- [WT-7106](https://jira.mongodb.org/browse/WT-7106)增加增量编码用于历史存储记录的频率
- [WT-7133](https://jira.mongodb.org/browse/WT-7133)修复因HS缓存压力高而减少目标页面时统计收集中的错误
- [WT-7135](https://jira.mongodb.org/browse/WT-7135)编写损坏的元数据时要检测的额外检查
- [WT-7173](https://jira.mongodb.org/browse/WT-7173)为分层存储设计对象命名方案
- [WT-7176](https://jira.mongodb.org/browse/WT-7176)将Ubuntu 18.04 ASAN变体添加到有线虎构建中
- [WT-7185](https://jira.mongodb.org/browse/WT-7185)如果交易是强行驱逐且最古老，请避免中止交易
- [WT-7186](https://jira.mongodb.org/browse/WT-7186)在准备情景中更正预期的内存中止更新
- [WT-7190](https://jira.mongodb.org/browse/WT-7190)当检查站在历史商店运行时，限制驱逐非历史商店页面
- [WT-7191](https://jira.mongodb.org/browse/WT-7191)将FNV哈希替换为城市哈希
- [WT-7204](https://jira.mongodb.org/browse/WT-7204)更新光标向后行走键实例化支持
- [WT-7228](https://jira.mongodb.org/browse/WT-7228)如果我们在历史商店里找不到钥匙，就不要打电话
- [WT-7229](https://jira.mongodb.org/browse/WT-7229)对齐顺序和混合模式处理
- [WT-7230](https://jira.mongodb.org/browse/WT-7230)CMake构建系统支持x86 POSIX目标
- [WT-7234](https://jira.mongodb.org/browse/WT-7234)前缀压缩键和内存放大
- [WT-7241](https://jira.mongodb.org/browse/WT-7241)添加断言以验证准备的事务中止机制是否正常工作
- [WT-7253](https://jira.mongodb.org/browse/WT-7253)将导入功能添加到测试/格式中
- [WT-7264](https://jira.mongodb.org/browse/WT-7264)创建附近搜索的新配置，使其在搜索前缀时可以快速退出
- [WT-7266](https://jira.mongodb.org/browse/WT-7266)测试以验证已关闭活动历史记录的重读文件
- [WT-7267](https://jira.mongodb.org/browse/WT-7267)在search_near中推断光标位置时比较整个历史存储密钥
- [WT-7281](https://jira.mongodb.org/browse/WT-7281)添加指标以记录扫描的会话总数
- [WT-7282](https://jira.mongodb.org/browse/WT-7282)将调试消息备份为冗长消息
- [WT-7296](https://jira.mongodb.org/browse/WT-7296)在测试框架中将默认配置与提供的测试配置合并
- [WT-7297](https://jira.mongodb.org/browse/WT-7297)修复search_near断言
- [WT-7312](https://jira.mongodb.org/browse/WT-7312)键/值更新为字符串类型并保存创建的键
- [WT-7315](https://jira.mongodb.org/browse/WT-7315)在测试框架中实现更新线程操作
- [WT-7316](https://jira.mongodb.org/browse/WT-7316)添加操作油门，并修改组件功能以分离核心循环
- [WT-7325](https://jira.mongodb.org/browse/WT-7325)创建一个脚本，在WT测试框架中生成新的测试
- [WT-7329](https://jira.mongodb.org/browse/WT-7329)为Python测试添加钩子功能
- [WT-7332](https://jira.mongodb.org/browse/WT-7332)添加在工作根中循环创建和删除表的能力
- [WT-7345](https://jira.mongodb.org/browse/WT-7345)更新不正确的版权声明格式
- [WT-7346](https://jira.mongodb.org/browse/WT-7346)将新的API更改连接到本地存储扩展
- [WT-7348](https://jira.mongodb.org/browse/WT-7348)完整的CMake POSIX支持
- [WT-7355](https://jira.mongodb.org/browse/WT-7355)创建python钩子来验证分层光标实现
- [WT-7356](https://jira.mongodb.org/browse/WT-7356)为分层表实现批量负载
- [WT-7365](https://jira.mongodb.org/browse/WT-7365)更改配置文件格式
- [WT-7367](https://jira.mongodb.org/browse/WT-7367)不要删除内存数据库btree页面的不稳定更新
- [WT-7368](https://jira.mongodb.org/browse/WT-7368)添加WT_STORAGE_SOURCE.customize_file_system代替位置
- [WT-7374](https://jira.mongodb.org/browse/WT-7374)为文档更新任务添加缺失的分支检查逻辑
- [WT-7376](https://jira.mongodb.org/browse/WT-7376)初始化分层光标名称
- [WT-7379](https://jira.mongodb.org/browse/WT-7379)在兼容性测试中禁用列存储测试
- [WT-7380](https://jira.mongodb.org/browse/WT-7380)修复有线虎连接字符串以清除统计数据
- [WT-7381](https://jira.mongodb.org/browse/WT-7381)Cache btree在检查点之间的ckptlist
- [WT-7382](https://jira.mongodb.org/browse/WT-7382)在测试框架中重构数据库验证
- [WT-7384](https://jira.mongodb.org/browse/WT-7384)修复插入历史记录存储时断言火灾
- [WT-7385](https://jira.mongodb.org/browse/WT-7385)从可重新配置中删除'auth_token'
- [WT-7387](https://jira.mongodb.org/browse/WT-7387)将集群/成员替换为hostid
- [WT-7388](https://jira.mongodb.org/browse/WT-7388)有条件地将parens添加到分配中
- [WT-7389](https://jira.mongodb.org/browse/WT-7389)删除定位的分层光标应该保持光标位置
- [WT-7390](https://jira.mongodb.org/browse/WT-7390)向Python测试运行器添加--noremove标志
- [WT-7394](https://jira.mongodb.org/browse/WT-7394)覆盖率分析缺陷118020：单硝化标量变量
- [WT-7395](https://jira.mongodb.org/browse/WT-7395)覆盖分析缺陷118042：空格检查后取消引用
- [WT-7400](https://jira.mongodb.org/browse/WT-7400)在修复乱序时间戳之前，为搜索设置WT_HS_READ_ALL标志

- [WT-7403](https://jira.mongodb.org/browse/WT-7403)永远在空分层表循环上的随机光标
- [WT-7407](https://jira.mongodb.org/browse/WT-7407)测试/格式故障分类器
- [WT-7409](https://jira.mongodb.org/browse/WT-7409)删除死代码
- [WT-7410](https://jira.mongodb.org/browse/WT-7410)将会话标志分成两部分，以适应将来更多的会话标志
- [WT-7411](https://jira.mongodb.org/browse/WT-7411)统计和计数器来跟踪准备好的更新
- [WT-7413](https://jira.mongodb.org/browse/WT-7413)向wtperf添加一个选项以运行备份操作
- [WT-7414](https://jira.mongodb.org/browse/WT-7414)创建一个python测试，以确保备份期间删除的所有表都存在于备份中
- [WT-7415](https://jira.mongodb.org/browse/WT-7415)使用备份选项添加新配置文件
- [WT-7416](https://jira.mongodb.org/browse/WT-7416)导入的表需要在增量备份之间完整副本
- [WT-7419](https://jira.mongodb.org/browse/WT-7419)使用WT文件系统的分层本地存储更改
- [WT-7420](https://jira.mongodb.org/browse/WT-7420)分层本地存储更改为将文件刷新为存储桶目录
- [WT-7423](https://jira.mongodb.org/browse/WT-7423)清除检查点LSN和导入时的备份元数据
- [WT-7425](https://jira.mongodb.org/browse/WT-7425)修复-C命令行选项
- [WT-7428](https://jira.mongodb.org/browse/WT-7428)将存储桶移动到分层结构
- [WT-7429](https://jira.mongodb.org/browse/WT-7429)切换分层对象时设置只读元数据
- [WT-7437](https://jira.mongodb.org/browse/WT-7437)将文档升级到doxygen 1.8.17
- [WT-7440](https://jira.mongodb.org/browse/WT-7440)将文件光标与分层存储集成
- [WT-7446](https://jira.mongodb.org/browse/WT-7446)修复测试框架中不正确的持续时间_秒值
- [WT-7447](https://jira.mongodb.org/browse/WT-7447)修复断言火灾，因为页面上没有从堆栈中弹出无序更新
- [WT-7452](https://jira.mongodb.org/browse/WT-7452)改进恢复（和RTS）需要很长时间的日志记录
- [WT-7453](https://jira.mongodb.org/browse/WT-7453)覆盖率分析缺陷119968：继续没有效果
- [WT-7454](https://jira.mongodb.org/browse/WT-7454)覆盖率分析缺陷119967：继续没有效果
- [WT-7455](https://jira.mongodb.org/browse/WT-7455)覆盖率分析缺陷119966：冗余测试
- [WT-7456](https://jira.mongodb.org/browse/WT-7456)覆盖率分析缺陷119965：单硝化指针读取
- [WT-7457](https://jira.mongodb.org/browse/WT-7457)覆盖范围：修复本地商店重命名中的错误
- [WT-7458](https://jira.mongodb.org/browse/WT-7458)覆盖率分析缺陷119949：冗余测试
- [WT-7459](https://jira.mongodb.org/browse/WT-7459)覆盖率分析缺陷119947：冗余测试
- [WT-7463](https://jira.mongodb.org/browse/WT-7463)使用wt_off_t避免不兼容的指针类型
- [WT-7468](https://jira.mongodb.org/browse/WT-7468)修复分层文件和对象元数据配置
- [WT-7469](https://jira.mongodb.org/browse/WT-7469)修复潜在的热备份读取锁从未解锁
- [WT-7474](https://jira.mongodb.org/browse/WT-7474)每当执行搜索时，重置光标顺序检查
- [WT-7475](https://jira.mongodb.org/browse/WT-7475)更新格式以使用新的历史存储光标类型
- [WT-7476](https://jira.mongodb.org/browse/WT-7476)更新配置处理方式，以允许可选的配置设置
- [WT-7477](https://jira.mongodb.org/browse/WT-7477)修复覆盖错误：可能的NULL取消引用
- [WT-7478](https://jira.mongodb.org/browse/WT-7478)修复封面printf arg类型以匹配格式
- [WT-7480](https://jira.mongodb.org/browse/WT-7480)清理测试框架中的thread_contexts
- [WT-7481](https://jira.mongodb.org/browse/WT-7481)修复磁盘映像写入生成与btree基写入生成比较的错误断言
- [WT-7484](https://jira.mongodb.org/browse/WT-7484)覆盖率分析缺陷120014：单硝化标量变量
- [WT-7485](https://jira.mongodb.org/browse/WT-7485)覆盖率分析缺陷120018：资源泄漏
- [WT-7486](https://jira.mongodb.org/browse/WT-7486)覆盖率兴奋NULL取消引用
- [WT-7487](https://jira.mongodb.org/browse/WT-7487)覆盖率兴奋NULL取消引用
- [WT-7488](https://jira.mongodb.org/browse/WT-7488)覆盖分析缺陷120015：空格检查后取消引用
- [WT-7489](https://jira.mongodb.org/browse/WT-7489)避免与检查站同时运行RTS
- [WT-7493](https://jira.mongodb.org/browse/WT-7493)添加新的连接配置，通过更新恢复删除来控制页面删除
- [WT-7496](https://jira.mongodb.org/browse/WT-7496)将每个层可以支持的操作添加到数据结构中
- [WT-7497](https://jira.mongodb.org/browse/WT-7497)向对象元数据添加刷新组件
- [WT-7498](https://jira.mongodb.org/browse/WT-7498)实现分层存储内部线程操作
- [WT-7499](https://jira.mongodb.org/browse/WT-7499)更改WT_STORAGE_SOURCE.flush API并添加flush_finish
- [WT-7500](https://jira.mongodb.org/browse/WT-7500)重构分层线程开始代码
- [WT-7504](https://jira.mongodb.org/browse/WT-7504)修复test_hs21缓存卡在脏处
- [WT-7506](https://jira.mongodb.org/browse/WT-7506)允许在自动格式化注释中进行单引号和双引号
- [WT-7510](https://jira.mongodb.org/browse/WT-7510)在测试/格式中启用直接I/O时禁用导入
- [WT-7511](https://jira.mongodb.org/browse/WT-7511)添加断言，以确保在搜索前固定历史商店页面
- [WT-7514](https://jira.mongodb.org/browse/WT-7514)让分层子系统代表块管理器打开文件
- [WT-7519](https://jira.mongodb.org/browse/WT-7519)修复WT_DATA_HANDLE中的标志字段溢出
- [WT-7523](https://jira.mongodb.org/browse/WT-7523)测试以验证多个已准备的更新，无论是提交还是回滚
- [WT-7525](https://jira.mongodb.org/browse/WT-7525)在历史记录商店插入后立即添加密钥订单检查
- [WT-7528](https://jira.mongodb.org/browse/WT-7528)修复WT_SESSION更改返回EBUSY
- [WT-7531](https://jira.mongodb.org/browse/WT-7531)将更新恢复驱逐视为进度
- [WT-7532](https://jira.mongodb.org/browse/WT-7532)当分层管理器调用flush_tier_once时，按住模式锁定
- [WT-7535](https://jira.mongodb.org/browse/WT-7535)完整的CMake Windows支持
- [WT-7537](https://jira.mongodb.org/browse/WT-7537)将本地层对象后缀更改为.wtobj
- [WT-7541](https://jira.mongodb.org/browse/WT-7541)更新了常青命令，用不受欢迎的字符解析文件夹名称
- [WT-7542](https://jira.mongodb.org/browse/WT-7542)添加Python测试，在重新启动后重新配置zstd压缩级别
- [WT-7545](https://jira.mongodb.org/browse/WT-7545)将升级/降级测试限制为快照隔离时的交易时间戳
- [WT-7546](https://jira.mongodb.org/browse/WT-7546)覆盖范围：CppSuite测试线束中的小问题
- [WT-7548](https://jira.mongodb.org/browse/WT-7548)创建宏以识别与Btree直接关联的处理
- [WT-7549](https://jira.mongodb.org/browse/WT-7549)清理块管理器标识符以使用对象ID命名
- [WT-7550](https://jira.mongodb.org/browse/WT-7550)正确检查固定页面，并修复错误时不重置光标的问题
- [WT-7565](https://jira.mongodb.org/browse/WT-7565)更新无效的备份配置
- [WT-7566](https://jira.mongodb.org/browse/WT-7566)解决免费后写字的问题
- [WT-7567](https://jira.mongodb.org/browse/WT-7567)重新设计分层存储重新配置
- [WT-7569](https://jira.mongodb.org/browse/WT-7569)修复错误地压制订单错误的时间戳更新
- [WT-7573](https://jira.mongodb.org/browse/WT-7573)在wtperf测试中打印错误消息并退出无效的备份配置
- [WT-7574](https://jira.mongodb.org/browse/WT-7574)禁用OS/X的紧凑型测试
- [WT-7577](https://jira.mongodb.org/browse/WT-7577)将同步配置添加到flush_tier
- [WT-7579](https://jira.mongodb.org/browse/WT-7579)由于快照隔离搜索不匹配，在兼容性测试中禁用前缀测试
- [WT-7581](https://jira.mongodb.org/browse/WT-7581)使wt_cache_config args与其他配置函数保持一致
- [WT-7588](https://jira.mongodb.org/browse/WT-7588)制作分层对象ID数字32位
- [WT-7594](https://jira.mongodb.org/browse/WT-7594)在格式TS运行上使用key_consistent模式
- [WT-7595](https://jira.mongodb.org/browse/WT-7595)在历史存储光标中添加标志，以跟踪底层表插入是否成功
- [WT-7602](https://jira.mongodb.org/browse/WT-7602)修复MacOS CMake编译问题
- [WT-7625](https://jira.mongodb.org/browse/WT-7625)更新油门配置，以便在测试框架中更方便用户
- [WT-7633](https://jira.mongodb.org/browse/WT-7633)将文档更新的Evergreen任务切换到更新的Ubuntu 20.04发行版
- [WT-7634](https://jira.mongodb.org/browse/WT-7634)在Doxygen中禁用人页面生成
- [WT-7642](https://jira.mongodb.org/browse/WT-7642)修复在历史记录商店光标密钥订单检查中插入搜索标志
- [WT-7643](https://jira.mongodb.org/browse/WT-7643)更新分层存储的检查点解码工具
- [WT-7651](https://jira.mongodb.org/browse/WT-7651)为flush_tier调用添加同步
- [WT-7656](https://jira.mongodb.org/browse/WT-7656)连接线程后销毁分层的condvar
- [WT-7699](https://jira.mongodb.org/browse/WT-7699)修复RTS处理以中止无序准备的交易
- [WT-7706](https://jira.mongodb.org/browse/WT-7706)当磁盘值是中止的准备更新时，请使用相同的事务更新
- [WT-7710](https://jira.mongodb.org/browse/WT-7710)修复了使用历史存储btree初始化历史存储光标的问题
- [WT-7721](https://jira.mongodb.org/browse/WT-7721)更新测试格式以重新打开具有不同配置的现有数据库
- [WT-7783](https://jira.mongodb.org/browse/WT-7783)修复RTS在磁盘更新出现问题时恢复墓碑，准备更新



## 4.4.6 更改日志

### 安全

* [服务器-51364](https://jira.mongodb.org/browse/SERVER-51364)带有OCSP和TLS的Ubuntu 18.04服务器无法工作

- [服务器-54799](https://jira.mongodb.org/browse/SERVER-54799)AWS IAM Auth不支持AWS中国和政府地区的ARN，这些地区ARN不以“arn:aws:iam”开头
- [服务器-55122](https://jira.mongodb.org/browse/SERVER-55122)修复OCSP允许tlsCertificateKeyFile中的中间证书
- [服务器-55332](https://jira.mongodb.org/browse/SERVER-55332)在OCSP分片测试中修复比赛条件

### 分片

- [服务器-48573](https://jira.mongodb.org/browse/SERVER-48573)txn_two_phase_commit_killop.js应该处理没有opCtx的客户端
- [服务器-52564](https://jira.mongodb.org/browse/SERVER-52564)下台和MongoDOperationContextSession之间的僵局
- [服务器-53973](https://jira.mongodb.org/browse/SERVER-53973)迁移管理器恢复应处理findShardKey期间失败的findIntersectingChunk

### 复制

- [服务器-50486](https://jira.mongodb.org/browse/SERVER-50486)invokeWithSessionCheckedOut在二级交易上被调用
- [服务器-54970](https://jira.mongodb.org/browse/SERVER-54970)更新拱形指南的“中止单个副本集交易”部分
- [服务器-55007](https://jira.mongodb.org/browse/SERVER-55007)下台和MongoDOperationContextSession之间的僵局
- [服务器-55008](https://jira.mongodb.org/browse/SERVER-55008)只有当初始同步中的BackgroundOperationInProg错误时，才会中止两相索引构建

### 储存

[服务器-55374](https://jira.mongodb.org/browse/SERVER-55374)[v4.4] Backport原始服务器-50045再次更改

### 运营

[服务器-48580](https://jira.mongodb.org/browse/SERVER-48580)在client_metadata_slowlog_rs.js中等待复制

### 内部人员

- [服务器-49237](https://jira.mongodb.org/browse/SERVER-49237)添加一种方式，让OperationContexts选择加入，以便在下台时总是被中断
- [服务器-50060](https://jira.mongodb.org/browse/SERVER-50060)使oplog_slow_sampling_logging.js容忍时钟中的小变化
- [服务器-50875](https://jira.mongodb.org/browse/SERVER-50875)覆盖率分析缺陷115634：单硝化标量场
- [服务器-51335](https://jira.mongodb.org/browse/SERVER-51335)修复4.4上的libfuzzer
- [服务器-51425](https://jira.mongodb.org/browse/SERVER-51425)回滚后重新启动JournalFlusher不是线程安全的
- [服务器-51457](https://jira.mongodb.org/browse/SERVER-51457)改进投机身份验证尝试失败的日志行
- [服务器-53604](https://jira.mongodb.org/browse/SERVER-53604)在身份验证审计日志中包含原始aws iam arn
- [服务器-53852](https://jira.mongodb.org/browse/SERVER-53852)MongoDB随机悬挂
- [服务器-55189](https://jira.mongodb.org/browse/SERVER-55189)在从rslib.js中的syncFrom()返回之前，请调用awaitReplication()
- [服务器-55602](https://jira.mongodb.org/browse/SERVER-55602)指定restoreToOplogTimestamp时，在WiredTigerKVEngine::makeTemporaryRecordStore中放松非只读不变
- [WT-7373](https://jira.mongodb.org/browse/WT-7373)改进oplog上缓慢的随机光标操作
- [WT-7426](https://jira.mongodb.org/browse/WT-7426)创建页面图像时设置写入生成编号
- [WT-7442](https://jira.mongodb.org/browse/WT-7442)只有当处理单更新不稳定时，RTS才打开dhandle
- [WT-7460](https://jira.mongodb.org/browse/WT-7460)RTS中止已准备的交易中止所有更新



## 4.4.5 更改日志



## 警告

由于存在严重问题，不建议使用MongoDB 4.4.5版本的生产，[WT-7426](https://jira.mongodb.org/browse/WT-7426)。这个问题在4.4.6版本中得到修复。

### 分片

- [服务器-53462](https://jira.mongodb.org/browse/SERVER-53462)改进测距器日志记录
- [服务器-53827](https://jira.mongodb.org/browse/SERVER-53827)range_deleter_server_status.js应该使用 assert.soon 检查范围删除任务的数量
- [服务器-54014](https://jira.mongodb.org/browse/SERVER-54014)为checkOID请求定义合理的maxTimeMsOverride
- [服务器-54585](https://jira.mongodb.org/browse/SERVER-54585)无法针对配置服务器集合运行`findAndModify`
- [服务器-54701](https://jira.mongodb.org/browse/SERVER-54701)shardCollection可能会成功写入配置服务器，但最终在主碎片上缺少索引

### 复制

- [服务器-48179](https://jira.mongodb.org/browse/SERVER-48179)删除回滚节点将在过渡时使节点崩溃
- [服务器-49294](https://jira.mongodb.org/browse/SERVER-49294)waitInIsMaster_failpoint.js在启用failpoint之前应确保已连接shell
- [服务器-50412](https://jira.mongodb.org/browse/SERVER-50412)将“非主”错误消息更改为“非主”
- [服务器-50414](https://jira.mongodb.org/browse/SERVER-50414)将“不是主或次要；当前无法从此replSet成员读取”更改为“非主或次要；当前无法从此replSet成员读取”
- [服务器-53248](https://jira.mongodb.org/browse/SERVER-53248)在retryable_prepared_commit_transaction_after_failover.js中提交事务之前调用awaitLastOpCommitted
- [服务器-53666](https://jira.mongodb.org/browse/SERVER-53666)curback测试夹具中的二级，不能保证重新启动后处于次要状态
- [服务器-54147](https://jira.mongodb.org/browse/SERVER-54147)initial_sync_nodes_contribute_to_liveness_majorities.js应该验证该术语是否增加，而不是与特定数字进行比较
- [服务器-54180](https://jira.mongodb.org/browse/SERVER-54180)ReplSetTest的stepUp函数仅等待6秒，节点才能就主服务器达成一致
- [服务器-54339](https://jira.mongodb.org/browse/SERVER-54339)在rollback_crud_op_sequences.js中防止自发选举
- [服务器-54528](https://jira.mongodb.org/browse/SERVER-54528)在initial_sync_fails_when_source_removed.js中关闭副本集和初始同步失败之间的竞争
- [服务器-54540](https://jira.mongodb.org/browse/SERVER-54540)允许重新启动心跳时出现网络错误，以诱导回滚测试夹具中的回滚
- [服务器-54648](https://jira.mongodb.org/browse/SERVER-54648)将正确的日志详细度添加到disallow_adding_initialized_node2.js
- [服务器-54938](https://jira.mongodb.org/browse/SERVER-54938)在二级操作日志应用程序上，每批只刷新一次日志

### 查询

- [服务器-48963](https://jira.mongodb.org/browse/SERVER-48963)使max_time_ms_sharded.js更健壮
- [服务器-54710](https://jira.mongodb.org/browse/SERVER-54710)大量$or子句可以创建超过最大BSON大小的剖析条目，导致查询在不应该失败时失败

### 集合

[服务器-54296](https://jira.mongodb.org/browse/SERVER-54296)不变故障 | 不变后中止

### 储存

- [服务器-45847](https://jira.mongodb.org/browse/SERVER-45847)将JournalFlusher从存储引擎层中拉出，并将其放在存储引擎上方
- [服务器-46826](https://jira.mongodb.org/browse/SERVER-46826)实例化临时引擎和不耐用的JournalFlusher线程（nojournal=true）
- [服务器-48149](https://jira.mongodb.org/browse/SERVER-48149)将waitUntilDurable的来电者移动到JournalFlusher::waitForJournalFlush
- [服务器-49191](https://jira.mongodb.org/browse/SERVER-49191)将oplogTruncateAfterPoint缓存在内存中，并仅在它发生变化时更新它
- [服务器-53875](https://jira.mongodb.org/browse/SERVER-53875)除非单元测试中要求，否则完全停止JournalFlusher线程运行，使其无法访问仍在初始化的基础设施

### 运营

- [服务器-50396](https://jira.mongodb.org/browse/SERVER-50396)将mongosymb_multithread与当前的SIGUSR2堆栈转储格式对齐
- [服务器-52651](https://jira.mongodb.org/browse/SERVER-52651)添加对Azure的FLE支持
- [服务器-54770](https://jira.mongodb.org/browse/SERVER-54770)将/proc/meminfo MemAvailable添加到FTDC

### 构建和包装

- [服务器-54031](https://jira.mongodb.org/browse/SERVER-54031)errorcodes.py没有检查Python脚本中的嵌入式C++代码
- [服务器-54057](https://jira.mongodb.org/browse/SERVER-54057)Mongodb-org-server el8软件包依赖python2
- [服务器-54200](https://jira.mongodb.org/browse/SERVER-54200)安装核心应该是默认的构建目标，而不仅仅是mongod
- [服务器-54255](https://jira.mongodb.org/browse/SERVER-54255)更新RHEL 7 AMI进行软件包测试
- [服务器-54386](https://jira.mongodb.org/browse/SERVER-54386)如果systemctl守护进程无法运行，mongodb 3.6.22安装失败
- [服务器-54699](https://jira.mongodb.org/browse/SERVER-54699)mongodb-org 4.4.4 - EL6软件包丢失
- [服务器-54858](https://jira.mongodb.org/browse/SERVER-54858)更新Amazon Linux AMI进行软件包测试
- [服务器-55067](https://jira.mongodb.org/browse/SERVER-55067)将Windows构建版本迁移到VS Current发行版

### 内部人员

- [服务器-5722](https://jira.mongodb.org/browse/SERVER-5722)支持JS基准线束的操作数组中的“排序”字段
- [服务器-45836](https://jira.mongodb.org/browse/SERVER-45836)在默认日志级别提供更多LDAP详细信息（如服务器IP）
- [服务器-46686](https://jira.mongodb.org/browse/SERVER-46686)说明不尊重 maxTimeMS
- [服务器-47509](https://jira.mongodb.org/browse/SERVER-47509)resmoke接受多个“mongodSetParameters”选项，但只使用最后一个选项
- [服务器-48650](https://jira.mongodb.org/browse/SERVER-48650)单元测试的ServiceContext的NetworkInterfaceMockClockSource不能继续依赖复制协调员的生命周期才能保持有效
- [服务器-49695](https://jira.mongodb.org/browse/SERVER-49695)澄清和正确同步isOplogTruncateAfterPointBeingUsedForPrimary
- [服务器-50426](https://jira.mongodb.org/browse/SERVER-50426)添加一个分隔符，指示死亡测试运行的结束
- [服务器-50592](https://jira.mongodb.org/browse/SERVER-50592)更新mypy pip要求
- [服务器-51038](https://jira.mongodb.org/browse/SERVER-51038)resmoke.py无法在python 3.8上运行
- [服务器-51281](https://jira.mongodb.org/browse/SERVER-51281)mongod live locked
- [服务器-51330](https://jira.mongodb.org/browse/SERVER-51330)StorageTimestampTests取决于oplog批处理写入线程调度
- [服务器-51465](https://jira.mongodb.org/browse/SERVER-51465)指南针安装程序更新后更新软件包测试
- [服务器-51722](https://jira.mongodb.org/browse/SERVER-51722)确保MongoDB使用ARM LSE原子构建
- [服务器-52610](https://jira.mongodb.org/browse/SERVER-52610)验证安装前缀已添加到RPM的正确位置
- [服务器-52833](https://jira.mongodb.org/browse/SERVER-52833)复制恢复后，封装集合可能包含太多文档
- [服务器-52884](https://jira.mongodb.org/browse/SERVER-52884)在reconstruct_prepared_transactions_initial_sync.js中删除种族
- [服务器-52953](https://jira.mongodb.org/browse/SERVER-52953)当maxDistance设置为0时，$geoNear并不总是匹配给定的坐标
- [服务器-53359](https://jira.mongodb.org/browse/SERVER-53359)jstestfuzz（突变）模糊器在验证期间强制使用最后的FCV，而不是最新的
- [服务器-53394](https://jira.mongodb.org/browse/SERVER-53394)使MongoD默认禁用ShardingTaskExecutorPoolReplicaSetMatching
- [服务器-53428](https://jira.mongodb.org/browse/SERVER-53428)将“状态”字段添加到initialSyncMetrics
- [服务器-53431](https://jira.mongodb.org/browse/SERVER-53431)服务器应在降级时使用适当的拓扑版本响应正在运行的操作
- [服务器-53566](https://jira.mongodb.org/browse/SERVER-53566)调查并复制“opCtx！= nullptr && _opCtx == nullptr" 不变
- [服务器-53579](https://jira.mongodb.org/browse/SERVER-53579)python的dev-requirements.txt与pip 20.3.3不兼容
- [服务器-53612](https://jira.mongodb.org/browse/SERVER-53612)如果所有节点都赶上，但没有一个节点可以立即选择，StepDown将挂到超时
- [服务器-53787](https://jira.mongodb.org/browse/SERVER-53787)更新日志管理器快照
- [服务器-53831](https://jira.mongodb.org/browse/SERVER-53831)强迫SpiderMonkey在ReplSetTest.checkOplogs中收集垃圾
- [服务器-53932](https://jira.mongodb.org/browse/SERVER-53932)在恢复准备好的事务期间进行多键写入可以使用提交时间戳<稳定时间戳
- [服务器-53980](https://jira.mongodb.org/browse/SERVER-53980)在sys-perf.yml模块中更新linkbench2版本
- [服务器-53985](https://jira.mongodb.org/browse/SERVER-53985)确保joinUnblockStepDown线程已连接并正在等待在unconditional_step_down.js中启动降级
- [服务器-53992](https://jira.mongodb.org/browse/SERVER-53992)从性能任务中删除检测异常值的调用
- [服务器-54091](https://jira.mongodb.org/browse/SERVER-54091)更新resmoke.py运行的dbhash检查的断言消息
- [服务器-54136](https://jira.mongodb.org/browse/SERVER-54136)使身份验证命令尊重强制执行用户Cluster分离
- [服务器-54139](https://jira.mongodb.org/browse/SERVER-54139)从HTTP curl客户端中删除CURL共享支持
- [服务器-54169](https://jira.mongodb.org/browse/SERVER-54169)更新geo_s2disjoint_holes.js以检查预期错误代码
- [服务器-54365](https://jira.mongodb.org/browse/SERVER-54365)允许ClientOutOfLineExecutor跳过关机
- [服务器-54366](https://jira.mongodb.org/browse/SERVER-54366)等待节点开始降级，然后杀死force_shutdown_primary.js中的关机操作
- [服务器-54369](https://jira.mongodb.org/browse/SERVER-54369)将Jasper gRPC更新到最新版本
- [服务器-54406](https://jira.mongodb.org/browse/SERVER-54406)NetworkInterfaceMock应该允许同时中断和响应
- [服务器-54450](https://jira.mongodb.org/browse/SERVER-54450)在dsi分析步骤后发送perf.json
- [服务器-54458](https://jira.mongodb.org/browse/SERVER-54458)更新供应商scons，将uuid用于缓存tmpfile
- [服务器-54484](https://jira.mongodb.org/browse/SERVER-54484)resmoke/util/archival.py依赖于已弃用，现已删除thread.isAlive
- [服务器-54608](https://jira.mongodb.org/browse/SERVER-54608)dropIndexes需要在主节点和次要节点上做出相同的断言
- [服务器-54667](https://jira.mongodb.org/browse/SERVER-54667)在jstests/core/collation_update.js中稳健定位运算符测试用例
- [服务器-54684](https://jira.mongodb.org/browse/SERVER-54684)由于init功能失误，arm64上的JS性能下降
- [服务器-54685](https://jira.mongodb.org/browse/SERVER-54685)arm64的MONGO_YIELD_CORE_FOR_SMT的错误定义
- [服务器-54897](https://jira.mongodb.org/browse/SERVER-54897)将单碎片配置添加到etc/system_perf.yml
- [服务器-55013](https://jira.mongodb.org/browse/SERVER-55013)改进 PooledLDAPConnection::runFuncWithTimeout中的生命周期管理
- [服务器-55019](https://jira.mongodb.org/browse/SERVER-55019)install_compass 并非在所有受支持的平台上运行
- [服务器-55298](https://jira.mongodb.org/browse/SERVER-55298)重现和调查BSONObjectTooLarge错误
- [服务器-55369](https://jira.mongodb.org/browse/SERVER-55369)[v4.4] 不要在单相索引构建变体上运行drop_indexes_prevents_dropping_ready_indexes_after_aborting.js
- [服务器-55370](https://jira.mongodb.org/browse/SERVER-55370)使用BackgroundOperationInProgressForNamespace修复drop_indexes_aborts_in_progress_index_builds_wildcard.js行为
- [服务器-55428](https://jira.mongodb.org/browse/SERVER-55428)4.9分公司测试票
- [WT-5137](https://jira.mongodb.org/browse/WT-5137)切换到macos-1014 Evergreen发行版
- [WT-6066](https://jira.mongodb.org/browse/WT-6066)在常青树上重新启用耐受性测试
- [WT-6163](https://jira.mongodb.org/browse/WT-6163)将固定的存在检查折叠到__wt_txn_pinned_timestamp
- [WT-6389](https://jira.mongodb.org/browse/WT-6389)强制执行历史记录存储光标的寿命与预期的一样
- [WT-6513](https://jira.mongodb.org/browse/WT-6513)更新历史记录存储配置，使溢出键不太可能
- [WT-6525](https://jira.mongodb.org/browse/WT-6525)__wt_hs_insert_updates中需要的新参数来指示在历史记录中成功写入
- [WT-6673](https://jira.mongodb.org/browse/WT-6673)RTS通过删除检查点快照以外的更新来修复不一致的检查点
- [WT-6709](https://jira.mongodb.org/browse/WT-6709)删除用于存储已读/耐用时间戳的时间戳队列
- [WT-6714](https://jira.mongodb.org/browse/WT-6714)更新WT公开API的API文档
- [WT-6715](https://jira.mongodb.org/browse/WT-6715)记录WT中记录/未记录表的行为
- [WT-6819](https://jira.mongodb.org/browse/WT-6819)允许具有活动历史记录的扫描手柄
- [WT-6850](https://jira.mongodb.org/browse/WT-6850)为工作负载生成器类创建和添加配置解析
- [WT-6851](https://jira.mongodb.org/browse/WT-6851)将线程管理库添加到cpp测试框架中
- [WT-6853](https://jira.mongodb.org/browse/WT-6853)添加工作负载操作跟踪
- [WT-6854](https://jira.mongodb.org/browse/WT-6854)实现测试线束验证
- [WT-6855](https://jira.mongodb.org/browse/WT-6855)运行时监视器的初始实现
- [WT-6856](https://jira.mongodb.org/browse/WT-6856)扩展框架支持的配置
- [WT-6897](https://jira.mongodb.org/browse/WT-6897)使用历史商店转储功能创建测试
- [WT-6898](https://jira.mongodb.org/browse/WT-6898)实现特定集合/树的历史存储转储
- [WT-6912](https://jira.mongodb.org/browse/WT-6912)为架构指南编写“日志”子页面
- [WT-6926](https://jira.mongodb.org/browse/WT-6926)更新WiredTiger源代码以包含2021年版权声明
- [WT-6935](https://jira.mongodb.org/browse/WT-6935)更新元数据中所有文件检查点的连接基写入生成值
- [WT-6950](https://jira.mongodb.org/browse/WT-6950)创建测试覆盖范围文档登陆页面
- [WT-6963](https://jira.mongodb.org/browse/WT-6963)迁移历史记录存储，验证以使用新的历史商店光标
- [WT-6964](https://jira.mongodb.org/browse/WT-6964)迁移对账以使用新的历史记录商店光标
- [WT-6965](https://jira.mongodb.org/browse/WT-6965)迁移标准光标搜索以使用新的历史商店光标
- [WT-7028](https://jira.mongodb.org/browse/WT-7028)在检查点收集手柄期间，扫描线程不应锁定
- [WT-7045](https://jira.mongodb.org/browse/WT-7045)修复 simulate_crash_restart 中的 FileNotFoundError
- [WT-7047](https://jira.mongodb.org/browse/WT-7047)根据test_prepare_hs04中的要求使用稳定的时间戳
- [WT-7060](https://jira.mongodb.org/browse/WT-7060)在启动时设置历史记录存储文件大小统计信息
- [WT-7070](https://jira.mongodb.org/browse/WT-7070)分类栏位存储HS测试失败
- [WT-7072](https://jira.mongodb.org/browse/WT-7072)添加列存储示例
- [WT-7085](https://jira.mongodb.org/browse/WT-7085)迁移回滚准备好的txns逻辑，以使用新的历史记录存储光标。
- [WT-7086](https://jira.mongodb.org/browse/WT-7086)将回滚迁移到稳定逻辑以使用新的历史存储光标。
- [WT-7087](https://jira.mongodb.org/browse/WT-7087)分层存储的API
- [WT-7095](https://jira.mongodb.org/browse/WT-7095)历史存储检查点期间的检查点生成更新
- [WT-7099](https://jira.mongodb.org/browse/WT-7099)修复了准备回滚后未考虑重新插入历史记录存储的断言
- [WT-7108](https://jira.mongodb.org/browse/WT-7108)更新列存储文档以包含ex_col_store示例
- [WT-7119](https://jira.mongodb.org/browse/WT-7119)向RTS添加可变长度列存储支持，以便在没有历史记录的数据存储中进行更新
- [WT-7120](https://jira.mongodb.org/browse/WT-7120)将可变长度列存储添加到RTS中，以便在带有历史记录的数据存储中进行更新
- [WT-7143](https://jira.mongodb.org/browse/WT-7143)当使用中的处理无法重新打开时，收集有关断言失败的数据
- [WT-7146](https://jira.mongodb.org/browse/WT-7146)修复与开发同步后的编译
- [WT-7150](https://jira.mongodb.org/browse/WT-7150)模式项目中的尾随unit mem
- [WT-7160](https://jira.mongodb.org/browse/WT-7160)将有线老虎-doc-build作业迁移到Evergreen
- [WT-7162](https://jira.mongodb.org/browse/WT-7162)删除用于内存消毒剂测试的c++测试框架
- [WT-7163](https://jira.mongodb.org/browse/WT-7163)记录新的wt打印日志选项
- [WT-7164](https://jira.mongodb.org/browse/WT-7164)将“HS光标重组”功能分支合并为开发
- [WT-7167](https://jira.mongodb.org/browse/WT-7167)不要对wt转储/负载进行前向兼容性测试
- [WT-7174](https://jira.mongodb.org/browse/WT-7174)修复cppsuite测试的内存泄漏
- [WT-7177](https://jira.mongodb.org/browse/WT-7177)创建一个实现本地存储解决方案的共享存储扩展
- [WT-7181](https://jira.mongodb.org/browse/WT-7181)关闭测试/格式的LSM测试
- [WT-7183](https://jira.mongodb.org/browse/WT-7183)对测试覆盖范围文档中的测试文件名进行排序
- [WT-7184](https://jira.mongodb.org/browse/WT-7184)防止文档文件中的非ASCII输入
- [WT-7192](https://jira.mongodb.org/browse/WT-7192)修复无法重新打开使用中的手柄时断言失败的问题
- [WT-7200](https://jira.mongodb.org/browse/WT-7200)修复历史记录商店中的订单时间戳时停止交易ID不正确
- [WT-7202](https://jira.mongodb.org/browse/WT-7202)检查断言中是否没有计数
- [WT-7206](https://jira.mongodb.org/browse/WT-7206)更新测试框架以与C++风格保持一致
- [WT-7208](https://jira.mongodb.org/browse/WT-7208)当从属索引无法打开时，将表光标保持有效状态
- [WT-7210](https://jira.mongodb.org/browse/WT-7210)在备份光标打开时添加导入/导出测试
- [WT-7211](https://jira.mongodb.org/browse/WT-7211)在压力测试框架中添加了缺失的退货语句
- [WT-7214](https://jira.mongodb.org/browse/WT-7214)在macos-1012 Evergreen发行版上运行macOS编译任务
- [WT-7217](https://jira.mongodb.org/browse/WT-7217)覆盖率分析缺陷117685：单硝化指针读取
- [WT-7223](https://jira.mongodb.org/browse/WT-7223)WT_CALL_FUNCTION不应该打印出消息
- [WT-7224](https://jira.mongodb.org/browse/WT-7224)将test_config.c移至src/config
- [WT-7225](https://jira.mongodb.org/browse/WT-7225)重新调整历史记录存储的验证关键功能
- [WT-7235](https://jira.mongodb.org/browse/WT-7235)增强对象命名的分层API
- [WT-7237](https://jira.mongodb.org/browse/WT-7237)创建组件接口，以改进测试框架中的类heirachy
- [WT-7238](https://jira.mongodb.org/browse/WT-7238)使用构造函数初始化列表来避免seg故障
- [WT-7239](https://jira.mongodb.org/browse/WT-7239)将编译步骤嵌入到macOS单元测试中
- [WT-7242](https://jira.mongodb.org/browse/WT-7242)修复实例，正确使用系统API，无需加密
- [WT-7243](https://jira.mongodb.org/browse/WT-7243)修复test_bug025中的意外输出失败
- [WT-7246](https://jira.mongodb.org/browse/WT-7246)从会话中删除旧的HS光标
- [WT-7249](https://jira.mongodb.org/browse/WT-7249)调整存储源扩展API
- [WT-7252](https://jira.mongodb.org/browse/WT-7252)删除由WT-6673推送的冗余代码
- [WT-7254](https://jira.mongodb.org/browse/WT-7254)清除cur_hs.c中的函数名称
- [WT-7257](https://jira.mongodb.org/browse/WT-7257)添加RTS测试以跳过没有不稳定更新的页面
- [WT-7261](https://jira.mongodb.org/browse/WT-7261)确保在打开历史记录存储光标后出现错误时关闭
- [WT-7263](https://jira.mongodb.org/browse/WT-7263)将注释移动到它谈论的代码
- [WT-7268](https://jira.mongodb.org/browse/WT-7268)Coverity报告test_harness代码的故障
- [WT-7269](https://jira.mongodb.org/browse/WT-7269)为所有 RTS 现有测试启用列存储场景
- [WT-7270](https://jira.mongodb.org/browse/WT-7270)将缺失的C包含添加到test.h中，以便编译旧的g++版本
- [WT-7275](https://jira.mongodb.org/browse/WT-7275)将时间戳和事务管理添加到测试框架中
- [WT-7288](https://jira.mongodb.org/browse/WT-7288)构建一个多处理压力.wtperf工作负载
- [WT-7289](https://jira.mongodb.org/browse/WT-7289)为idle_table_cycle添加警告和致命的wtperf选项
- [WT-7290](https://jira.mongodb.org/browse/WT-7290)将 many-dhandle-stress.wtperf 导入 workgen
- [WT-7295](https://jira.mongodb.org/browse/WT-7295)与旧版本的WT的兼容性
- [WT-7298](https://jira.mongodb.org/browse/WT-7298)从分层光标代码中删除LSM引用
- [WT-7299](https://jira.mongodb.org/browse/WT-7299)从结果中删除Python测试的无关输出
- [WT-7300](https://jira.mongodb.org/browse/WT-7300)将loadload_generator加载阶段移动到运行中
- [WT-7301](https://jira.mongodb.org/browse/WT-7301)在poc_test中恢复配置更改
- [WT-7302](https://jira.mongodb.org/browse/WT-7302)使用上次连接基写生成作为btree的最小基写生成
- [WT-7307](https://jira.mongodb.org/browse/WT-7307)重新制作历史商店光标上一次和下一次通话的墓碑可见性检查
- [WT-7308](https://jira.mongodb.org/browse/WT-7308)更新测试框架的配置定义，使其结构化得更强
- [WT-7311](https://jira.mongodb.org/browse/WT-7311)指定要在测试框架中运行的测试的新选项
- [WT-7328](https://jira.mongodb.org/browse/WT-7328)覆盖范围：local_storage扩展中的多个警告
- [WT-7331](https://jira.mongodb.org/browse/WT-7331)修复我们最初将历史商店光标放在e精确密钥上时的确切返回
- [WT-7338](https://jira.mongodb.org/browse/WT-7338)在构建测试框架时复制配置目录
- [WT-7339](https://jira.mongodb.org/browse/WT-7339)覆盖范围：交易定位器不正确
- [WT-7349](https://jira.mongodb.org/browse/WT-7349)在驱逐期间通过HS时可以免费访问内存
- [WT-7354](https://jira.mongodb.org/browse/WT-7354)重构分层模式代码以遵循约定
- [WT-7360](https://jira.mongodb.org/browse/WT-7360)修复一些Evergreen构建器的批处理时间设置
- [WT-7361](https://jira.mongodb.org/browse/WT-7361)从补丁构建中删除文档更新任务



## 4.4.4 更改日志

### 安全

* [服务器-49280](https://jira.mongodb.org/browse/SERVER-49280)调查ocspValidationRefreshPeriodSecs的问题

### 分片

- [服务器-49713](https://jira.mongodb.org/browse/SERVER-49713)跳过在shard_removal_triggers_catalog_cache_invalidation.js中检查孤儿文档
- [服务器-53236](https://jira.mongodb.org/browse/SERVER-53236)禁用merge_with_move_primary.js在sharding_csrs_continuous_config_stepdown套件上运行
- [服务器-53444](https://jira.mongodb.org/browse/SERVER-53444)在 assert.soon 中运行 removeShard 的测试，等待状态“完成”，而不是在 ShardNotFound 上出错
- [服务器-53471](https://jira.mongodb.org/browse/SERVER-53471)将范围DeleterBatchSize设置为128

### 复制

- [服务器-29030](https://jira.mongodb.org/browse/SERVER-29030)通过心跳请求宣布新的主要
- [服务器-50318](https://jira.mongodb.org/browse/SERVER-50318)仅重新启动计划的心跳
- [服务器-53026](https://jira.mongodb.org/browse/SERVER-53026)次要无法重新启动复制
- [服务器-53345](https://jira.mongodb.org/browse/SERVER-53345)原谅arbiter_new_hostname.js来自多版本测试
- [服务器-53609](https://jira.mongodb.org/browse/SERVER-53609)lastCommittedTransaction部分导致频繁的模式更改，限制FTDC的保留

### 查询

- [服务器-47869](https://jira.mongodb.org/browse/SERVER-47869)将诊断日志添加到ClusterCursorManager
- [服务器-50769](https://jira.mongodb.org/browse/SERVER-50769)服务器在expr:{"expr":"_currentApplyOps.getArrayLength() > 0","file":"src/mongo/db/pipeline/document_source_change_stream_transform.cpp","line":535}}
- [服务器-53176](https://jira.mongodb.org/browse/SERVER-53176)当commitQuorum包含投票buildIndexes:false成员时返回错误
- [服务器-53929](https://jira.mongodb.org/browse/SERVER-53929)不变故障后服务器崩溃

### 集合

- [服务器-40090](https://jira.mongodb.org/browse/SERVER-40090)gg中的DISTINCT_SCAN仅在指定特定格式的_id时使用
- [服务器-51886](https://jira.mongodb.org/browse/SERVER-51886)当集合名称发生冲突时，$lookup + $merge管道可能无法正确解析视图

### 储存

- [服务器-46876](https://jira.mongodb.org/browse/SERVER-46876)在驱逐压力期间，我们应该停止紧凑的操作，而不是破坏这个过程
- [服务器-48002](https://jira.mongodb.org/browse/SERVER-48002)忽略准备冲突时，请勿强制执行DataCorruption检测断言
- [服务器-48471](https://jira.mongodb.org/browse/SERVER-48471)散列索引可能被错误地标记为多键，并且不符合分片键的条件

#### 有线老虎

- [服务器-52596](https://jira.mongodb.org/browse/SERVER-52596)在K8S pod中检测memLimitMB，并告知WiredTigerCacheSize计算pod RAM而不是整个系统RAM

### 构建和包装

[服务器-53037](https://jira.mongodb.org/browse/SERVER-53037)RHEL8.2 arm64软件包名称中有x86_64

### 内部人员

- [服务器-43904](https://jira.mongodb.org/browse/SERVER-43904)下台阶时，上下行不会过滤掉冻结的节点
- [服务器-46740](https://jira.mongodb.org/browse/SERVER-46740)establishCursors() 必须始终耗尽AsyncRequestsSender::_baton
- [服务器-47030](https://jira.mongodb.org/browse/SERVER-47030)修复date_time_support代码，以免产生异常
- [服务器-48516](https://jira.mongodb.org/browse/SERVER-48516)在启动时，确认具有身份验证的副本集节点可以连接到自己
- [服务器-48994](https://jira.mongodb.org/browse/SERVER-48994)LogTransactionOperationsForShardingHandler必须使用UnruptibleLockGuard
- [服务器-49222](https://jira.mongodb.org/browse/SERVER-49222)Amazon Linux 2上的ARM64支持
- [服务器-49371](https://jira.mongodb.org/browse/SERVER-49371)介绍InlineRecursiveCountingExecutor
- [服务器-49495](https://jira.mongodb.org/browse/SERVER-49495)在auth_pass_prompt.js中修复比赛
- [服务器-50475](https://jira.mongodb.org/browse/SERVER-50475)mr_noscripting.js可以在新地图上虚假失败减少实现
- [服务器-51337](https://jira.mongodb.org/browse/SERVER-51337)在NetworkInterfaceMock中移动后使用
- [服务器-52585](https://jira.mongodb.org/browse/SERVER-52585)idl_tool.py未设置buildscript/idl/*依赖项
- [服务器-52787](https://jira.mongodb.org/browse/SERVER-52787)调整ocsp_sharding_基本测试响应有效期
- [服务器-52867](https://jira.mongodb.org/browse/SERVER-52867)在awaitable_hello_on_nodes_with_invalid_configs.js中发送新命令之前，请确保辅助在删除后已完成连接
- [服务器-52879](https://jira.mongodb.org/browse/SERVER-52879)由于关闭空闲缓存的WT会话，周期性操作延迟每5分钟飙升一次
- [服务器-52919](https://jira.mongodb.org/browse/SERVER-52919)未启用电线压缩以进行初始同步
- [服务器-52983](https://jira.mongodb.org/browse/SERVER-52983)initial_sync_replSetGetStatus.js中的断言必须考虑小于collectionClonerBatchSize的批处理大小
- [服务器-53234](https://jira.mongodb.org/browse/SERVER-53234)当对测试数据库运行后台操作时，jstests/core/profile2.js失败
- [服务器-53323](https://jira.mongodb.org/browse/SERVER-53323)在Enterprise Windows（内存）构建变量的大型发行版上运行concurrency_simultaneous_replication
- [服务器-53376](https://jira.mongodb.org/browse/SERVER-53376)[4.4] dbHash可以实时锁定中止的索引构建
- [服务器-53422](https://jira.mongodb.org/browse/SERVER-53422)[v4.4] 将create_collection.js从noPassthroughWithMongod移动到noPassthrough
- [服务器-53440](https://jira.mongodb.org/browse/SERVER-53440)[v4.4] plan_cache_drop_database.js断言太严格了
- [服务器-53445](https://jira.mongodb.org/browse/SERVER-53445)[4.4]强制锁获取超时进行后台验证
- [服务器-53559](https://jira.mongodb.org/browse/SERVER-53559)在将备份数据中的节点添加到副本集之前，停止备份/恢复测试中的后台工作负载
- [服务器-53565](https://jira.mongodb.org/browse/SERVER-53565)在sys-perf.yml和perf.yml模块中更新TPC-C版本
- [服务器-53694](https://jira.mongodb.org/browse/SERVER-53694)CleanEveryN计时信息需要解释硬编码的N
- [服务器-53717](https://jira.mongodb.org/browse/SERVER-53717)动态拆分大型并发任务
- [服务器-53780](https://jira.mongodb.org/browse/SERVER-53780)修复测试参数中缺少的报价
- [服务器-53841](https://jira.mongodb.org/browse/SERVER-53841)oplog_rollover.js的额外日志记录
- [服务器-53844](https://jira.mongodb.org/browse/SERVER-53844)在initial_sync_drop_against_last_stable.js中断言之前，请确保复制插入新集合
- [服务器-53960](https://jira.mongodb.org/browse/SERVER-53960)burn_in_tests试图针对非企业构建变体运行企业测试
- [服务器-54110](https://jira.mongodb.org/browse/SERVER-54110)修复4.4上的buildscripts_test失败
- [服务器-54126](https://jira.mongodb.org/browse/SERVER-54126)[4.4] buildindexes*.js假设提交Quorum总是被接受的
- [服务器-54134](https://jira.mongodb.org/browse/SERVER-54134)在setup_multiversion_mongodb.py的旧分支上忽略较新的mongo版本
- [WT-4625](https://jira.mongodb.org/browse/WT-4625)添加骆驼案例名称的支票
- [WT-4649](https://jira.mongodb.org/browse/WT-4649)更新构建系统以允许不同的C++编译器
- [WT-5101](https://jira.mongodb.org/browse/WT-5101)使Clang格式识别剩余的循环宏
- [WT-5111](https://jira.mongodb.org/browse/WT-5111)修复wt2909_checkpoint_integrity和wt3120_filesys，因此独立运行是很自然的
- [WT-5545](https://jira.mongodb.org/browse/WT-5545)向RTS添加固定长度列存储支持，以处理更新列表中的更新
- [WT-6309](https://jira.mongodb.org/browse/WT-6309)向wt printlog命令添加对开始/停止参数的支持
- [WT-6313](https://jira.mongodb.org/browse/WT-6313)在写入basecfg时，在排除列表中添加了exid_metadata配置
- [WT-6354](https://jira.mongodb.org/browse/WT-6354)通过打印日志、降级、升级测试来增加公用事业覆盖范围
- [WT-6430](https://jira.mongodb.org/browse/WT-6430)将WT_CONN_SERVER标志移动到自己的字段中
- [WT-6432](https://jira.mongodb.org/browse/WT-6432)添加测试用例来滥用时间戳API
- [WT-6504](https://jira.mongodb.org/browse/WT-6504)如果我们在历史记录商店中看到页面值，请不要退后退到页面值作为基本值
- [WT-6567](https://jira.mongodb.org/browse/WT-6567)为架构指南编写“回滚到稳定”子页面
- [WT-6568](https://jira.mongodb.org/browse/WT-6568)修复拆分生成的使用
- [WT-6605](https://jira.mongodb.org/browse/WT-6605)增强回滚到稳定的详细消息传递
- [WT-6677](https://jira.mongodb.org/browse/WT-6677)将已提交/未提交的隔离映射到只读事务
- [WT-6710](https://jira.mongodb.org/browse/WT-6710)将默认事务隔离更改为快照
- [WT-6711](https://jira.mongodb.org/browse/WT-6711)添加新的API WT_SESSION.reset_snapshot来更新快照
- [WT-6717](https://jira.mongodb.org/browse/WT-6717)限制LSM的使用仅限于与兼容功能一起运行
- [WT-6740](https://jira.mongodb.org/browse/WT-6740)通过将恢复会话误认为驱逐会话来修复无意中发布快照的问题
- [WT-6743](https://jira.mongodb.org/browse/WT-6743)在光标重新通话期间保存和恢复会话的数据句柄
- [WT-6772](https://jira.mongodb.org/browse/WT-6772)在test_hs09的数据存储中添加对准备更新的支持
- [WT-6800](https://jira.mongodb.org/browse/WT-6800)每笔交易插入一个键，使test_txn24在macOS上通过
- [WT-6802](https://jira.mongodb.org/browse/WT-6802)不要为内部和重入api调用设置操作计时器
- [WT-6831](https://jira.mongodb.org/browse/WT-6831)如果与准备好的更新提交/回滚进行比赛，请重试搜索
- [WT-6846](https://jira.mongodb.org/browse/WT-6846)新的cpp测试框架的初始测试程序
- [WT-6848](https://jira.mongodb.org/browse/WT-6848)将程序拆分为测试和框架组件
- [WT-6861](https://jira.mongodb.org/browse/WT-6861)添加记录有关意外时间戳使用的消息的功能
- [WT-6862](https://jira.mongodb.org/browse/WT-6862)删除统计描述中的重复
- [WT-6863](https://jira.mongodb.org/browse/WT-6863)通过改进统计宏来减少代码重复
- [WT-6866](https://jira.mongodb.org/browse/WT-6866)重构python备份测试初始基类
- [WT-6888](https://jira.mongodb.org/browse/WT-6888)WTPERF报告在填充期间上界项目计数不正确
- [WT-6901](https://jira.mongodb.org/browse/WT-6901)为架构指南编写“光标”子页面
- [WT-6924](https://jira.mongodb.org/browse/WT-6924)队列历史记录存储页面，以便在缓存压力高时紧急驱逐
- [WT-6946](https://jira.mongodb.org/browse/WT-6946)将测试标签添加到初始一组测试程序中
- [WT-6947](https://jira.mongodb.org/browse/WT-6947)从测试标签自动生成测试覆盖文档
- [WT-6969](https://jira.mongodb.org/browse/WT-6969)不要更新自动提交交易的现有快照
- [WT-6981](https://jira.mongodb.org/browse/WT-6981)为Python测试套件运行添加随机性
- [WT-6983](https://jira.mongodb.org/browse/WT-6983)使wiredtiger.in文本包装在Python版本之间保持一致
- [WT-6990](https://jira.mongodb.org/browse/WT-6990)__wt_cursor_cache_get中没有考虑新的光标调试配置
- [WT-6991](https://jira.mongodb.org/browse/WT-6991)使WT_IS_HS和WT_IS_METADATA保持一致-两者都在dhandle上运行
- [WT-6992](https://jira.mongodb.org/browse/WT-6992)在数据存储和历史存储搜索之间添加计时压力
- [WT-6994](https://jira.mongodb.org/browse/WT-6994)每当检测到按键顺序时，请转储光标页面
- [WT-6996](https://jira.mongodb.org/browse/WT-6996)在python测试套件中修复 suite_random.rand32()
- [WT-7004](https://jira.mongodb.org/browse/WT-7004)检查站的建筑指南页面
- [WT-7020](https://jira.mongodb.org/browse/WT-7020)断言密钥的上一个更新时间戳
- [WT-7025](https://jira.mongodb.org/browse/WT-7025)覆盖范围：未使用的值“op_ts”
- [WT-7026](https://jira.mongodb.org/browse/WT-7026)在比赛的情况下，通过原子读取和设置ref->addr
- [WT-7027](https://jira.mongodb.org/browse/WT-7027)在增量备份的读取提交隔离处运行force_stop的元数据检查点
- [WT-7038](https://jira.mongodb.org/browse/WT-7038)更新标头以兼容C++
- [WT-7039](https://jira.mongodb.org/browse/WT-7039)使用WiredTiger配置API创建测试配置框架
- [WT-7054](https://jira.mongodb.org/browse/WT-7054)更改钥匙乱打印的顺序，以避免比赛
- [WT-7065](https://jira.mongodb.org/browse/WT-7065)将WT_DHANDLE_DEAD的检查添加到断言中
- [WT-7066](https://jira.mongodb.org/browse/WT-7066)点README文档链接到de develop/index.html
- [WT-7067](https://jira.mongodb.org/browse/WT-7067)将列存储添加到test_hs01
- [WT-7068](https://jira.mongodb.org/browse/WT-7068)将列存储支持添加到test_hs03
- [WT-7069](https://jira.mongodb.org/browse/WT-7069)启用列存储配置到历史记录存储
- [WT-7071](https://jira.mongodb.org/browse/WT-7071)将列存储支持添加到test_hs16
- [WT-7084](https://jira.mongodb.org/browse/WT-7084)修复测试代码中的断言和注释错误
- [WT-7089](https://jira.mongodb.org/browse/WT-7089)不要跳过页面过时的检查点对象
- [WT-7091](https://jira.mongodb.org/browse/WT-7091)限制使用LSM仅与兼容的增量备份机制一起运行
- [WT-7102](https://jira.mongodb.org/browse/WT-7102)将完整和增量备份测试功能迁移到wtbackup类
- [WT-7104](https://jira.mongodb.org/browse/WT-7104)从printlog输出编辑用户数据
- [WT-7109](https://jira.mongodb.org/browse/WT-7109)保留不再支持的向后兼容性配置选项
- [WT-7113](https://jira.mongodb.org/browse/WT-7113)将原型分层存储代码集成到WT中
- [WT-7114](https://jira.mongodb.org/browse/WT-7114)恢复Makefile代码以始终运行原型脚本
- [WT-7116](https://jira.mongodb.org/browse/WT-7116)改进兼容性测试，以测试向后兼容性的配置选项
- [WT-7117](https://jira.mongodb.org/browse/WT-7117)RTS在恢复更新时跳过比磁盘上基本更新更新更新的修改
- [WT-7121](https://jira.mongodb.org/browse/WT-7121)在WT中包含对数结构分配python测试
- [WT-7126](https://jira.mongodb.org/browse/WT-7126)覆盖率分析缺陷116991：显式空取消引用
- [WT-7127](https://jira.mongodb.org/browse/WT-7127)覆盖率分析缺陷116992：未检查的退货值
- [WT-7128](https://jira.mongodb.org/browse/WT-7128)覆盖率分析缺陷116993：资源泄漏
- [WT-7131](https://jira.mongodb.org/browse/WT-7131)如果配置为零层，分层光标应返回错误
- [WT-7137](https://jira.mongodb.org/browse/WT-7137)更新断言，以便在检查重复插入时考虑已删除的HS值
- [WT-7138](https://jira.mongodb.org/browse/WT-7138)不要对有准备更新的页面进行快速截断
- [WT-7159](https://jira.mongodb.org/browse/WT-7159)始终将磁盘更新写成历史记录存储的完整更新



## 4.4.3 更改日志

### 分片

- [服务器-48261](https://jira.mongodb.org/browse/SERVER-48261)取消将使用“mixedShardTest”助手的授权测试列入黑名单
- [服务器-48571](https://jira.mongodb.org/browse/SERVER-48571)如果收到目标错误和响应错误，写入操作可能不变
- [服务器-51834](https://jira.mongodb.org/browse/SERVER-51834)移动中的种族Chunk测试
- [服务器-52686](https://jira.mongodb.org/browse/SERVER-52686)来自sharding_csrs_continuous_config_stepdown的Blacklist transactions_causal_consistency.js测试
- [服务器-53029](https://jira.mongodb.org/browse/SERVER-53029)端口 SERVER-52955 的更改到以后的分支

### 复制

- [服务器-33747](https://jira.mongodb.org/browse/SERVER-33747)如果重新启动后无法在配置中找到自己，仲裁员会尝试启动数据复制
- [服务器-49159](https://jira.mongodb.org/browse/SERVER-49159)如果currentTime在waitForReadConcernImpl中未初始化，则返回NotPrimaryOrSecondary
- [服务器-49187](https://jira.mongodb.org/browse/SERVER-49187)使ReplSetTest .stepUp()对选举失败具有鲁棒性。
- [服务器-50049](https://jira.mongodb.org/browse/SERVER-50049)assert.soonNoExcept()不应访问TestData.traceExceptions进行非烟雾测试。
- [服务器-50416](https://jira.mongodb.org/browse/SERVER-50416)在服务器状态中将 notMasterLegacyUnacknowledgedWrites更改为 notPrimaryLegacyUnacknowledgedWrites
- [服务器-50417](https://jira.mongodb.org/browse/SERVER-50417)在服务器状态中将 notMasterUnacknowledgedWrites 更改为 notPrimaryUnacknowledgedWrites
- [服务器-50901](https://jira.mongodb.org/browse/SERVER-50901)RollbackTest在进行数据一致性检查之前应该等待次要测试
- [服务器-51261](https://jira.mongodb.org/browse/SERVER-51261)将hangWaitingForIsMasterResponseOnStandalone更名为hangWaitingForHelloResponseOnStandalone
- [服务器-51262](https://jira.mongodb.org/browse/SERVER-51262)将 skipCheckingForNotMasterInCommandDispatch 重命名为 skipCheckingForHelloInCommandDispatch
- [服务器-51333](https://jira.mongodb.org/browse/SERVER-51333)setFeatureCompatibilityVersion在从FCV 4.4降级到存在长集合名称的FCV 4.2时应失败
- [服务器-52560](https://jira.mongodb.org/browse/SERVER-52560)oplog_writes_only_permitted_on_standalone.js必须等待插入进入稳定的检查点
- [服务器-52680](https://jira.mongodb.org/browse/SERVER-52680)删除了启动时在重新添加到副本集后卡在STARTUP2中的节点
- [服务器-52744](https://jira.mongodb.org/browse/SERVER-52744)rollback node's lastApplied > sync source's lastApplied in rollback_after_enabling_majority_reads.js
- [服务器-53197](https://jira.mongodb.org/browse/SERVER-53197)等待的hello/isMaster出现在缓慢的查询日志中，第2部分

### 查询

- [服务器-32960](https://jira.mongodb.org/browse/SERVER-32960)$mod的四舍五入/截断行为不一致
- [服务器-40361](https://jira.mongodb.org/browse/SERVER-40361)减少计划缓存条目的内存占用
- [服务器-48529](https://jira.mongodb.org/browse/SERVER-48529)删除未使用的PlanCache::feedback()机制
- [服务器-49744](https://jira.mongodb.org/browse/SERVER-49744)$search的每份文档评分元数据
- [服务器-49810](https://jira.mongodb.org/browse/SERVER-49810)facet/use_cases.js的稳定结果比较
- [服务器-52589](https://jira.mongodb.org/browse/SERVER-52589)FETCH期间的索引键一致性检查在某些情况下可能会失败

### 集合

[服务器-33966](https://jira.mongodb.org/browse/SERVER-33966)聚合中的冗余$sort阻止了最佳$limit$sort整合

### 储存

- [服务器-50502](https://jira.mongodb.org/browse/SERVER-50502)锁管理器转储logv2消息需要logv2::LogTruncation::禁用设置，以便锁定转储不会被截断
- [服务器-51122](https://jira.mongodb.org/browse/SERVER-51122)[v4.4]快照窗口代码必须始终如一地使用TestingProctor，而不能启用获取TestCommandsEnabled
- [服务器-51858](https://jira.mongodb.org/browse/SERVER-51858)在4.0.20上调查可查询的问题
- [服务器-52950](https://jira.mongodb.org/browse/SERVER-52950)recoverOplogAsStandalone模式不得启动oplog truncater线程

### 运营

- [服务器-48221](https://jira.mongodb.org/browse/SERVER-48221)存储引擎后关闭ftdc
- [服务器-51603](https://jira.mongodb.org/browse/SERVER-51603)添加日志消息，以便通过异常路径验证失败
- [服务器-51652](https://jira.mongodb.org/browse/SERVER-51652)为验证使用KeyString添加更好的错误处理
- [服务器-51757](https://jira.mongodb.org/browse/SERVER-51757)在FTDC中收集/proc/vmstat numa_pages_migrated统计数据
- [服务器-51829](https://jira.mongodb.org/browse/SERVER-51829)在验证输出时始终显示索引级别的损坏原因

### 构建和包装

- [服务器-41262](https://jira.mongodb.org/browse/SERVER-41262)从compile_all_run_unittests_TG中解分编译_all以减少制作span
- [服务器-52580](https://jira.mongodb.org/browse/SERVER-52580)4.4分支中缺少Windows mh工件
- [服务器-52891](https://jira.mongodb.org/browse/SERVER-52891)运行PPC构建的频率较低

### 内部人员

- [服务器-47863](https://jira.mongodb.org/browse/SERVER-47863)初始同步进度指标
- [服务器-49232](https://jira.mongodb.org/browse/SERVER-49232)激活故障点时混淆日志消息
- [服务器-50267](https://jira.mongodb.org/browse/SERVER-50267)为'rawMongoProgramOutput()'设置输出限制
- [服务器-50271](https://jira.mongodb.org/browse/SERVER-50271)从shell中删除--logv2
- [服务器-50445](https://jira.mongodb.org/browse/SERVER-50445)当NumberLong减法在ExpressionSubtract中溢出时，将值作为双倍返回
- [服务器-50547](https://jira.mongodb.org/browse/SERVER-50547)探索聚合管道长度限制
- [服务器-51057](https://jira.mongodb.org/browse/SERVER-51057)测试get更多指标在server_status_metrics.js中增量
- [服务器-51164](https://jira.mongodb.org/browse/SERVER-51164)移除非DSI微基准
- [服务器-51405](https://jira.mongodb.org/browse/SERVER-51405)在v4.4上禁用ephemeralForTest的一些并发套件
- [服务器-51418](https://jira.mongodb.org/browse/SERVER-51418)在StepdownShouldInterruptConfigWrite中解决比赛条件
- [服务器-51454](https://jira.mongodb.org/browse/SERVER-51454)operationProfiling.filter配置选项拒绝agg表达式
- [服务器-51526](https://jira.mongodb.org/browse/SERVER-51526)在时间安排良好的WriteConflictException的情况下，混合索引构建可能会错过写入和崩溃
- [服务器-51715](https://jira.mongodb.org/browse/SERVER-51715)在optime.js的日志行中用tojson（）包装时间戳
- [服务器-51718](https://jira.mongodb.org/browse/SERVER-51718)禁止考虑稀疏的散列索引来回答$exists：虚假查询。
- [服务器-51733](https://jira.mongodb.org/browse/SERVER-51733)docker容器中的配置服务器无法启动身份验证
- [服务器-51793](https://jira.mongodb.org/browse/SERVER-51793)通过在rhel62-large上运行burn_in_tags生成的任务，加快编译任务的速度
- [服务器-51796](https://jira.mongodb.org/browse/SERVER-51796)“恢复孤儿数据文件”中缺少逗号（22334）日志消息参数
- [服务器-51797](https://jira.mongodb.org/browse/SERVER-51797)将task_path_suffix添加到evergreen.yml
- [服务器-51818](https://jira.mongodb.org/browse/SERVER-51818)在Mutex析构函数中为不变消息添加名称
- [服务器-52530](https://jira.mongodb.org/browse/SERVER-52530)Mongo v.4.4.1 crash - UnknownError -31803: WT_NOTFOUND
- [服务器-52586](https://jira.mongodb.org/browse/SERVER-52586)在sys-perf中禁用 refine_shard_key_transaction_stress 任务
- [服务器-52625](https://jira.mongodb.org/browse/SERVER-52625)链接台写入常规位置
- [服务器-52646](https://jira.mongodb.org/browse/SERVER-52646)验证并可能修复userToDNMapping正则表达式重写规则中的边缘情况
- [服务器-52654](https://jira.mongodb.org/browse/SERVER-52654)未由监控密钥为HMAC线程生成的新签名密钥
- [服务器-52666](https://jira.mongodb.org/browse/SERVER-52666)ycsb是一个模块，写入一个方便的位置
- [服务器-52740](https://jira.mongodb.org/browse/SERVER-52740)介绍rhel62-medium发行版，适用于内存占用大的非编译任务
- [服务器-52746](https://jira.mongodb.org/browse/SERVER-52746)确保find_cmd.js中的可尾光标无效
- [服务器-52775](https://jira.mongodb.org/browse/SERVER-52775)修复sys-perf模块问题
- [服务器-52806](https://jira.mongodb.org/browse/SERVER-52806)deb安装文件假设系统化
- [服务器-52817](https://jira.mongodb.org/browse/SERVER-52817)在sys-perf.yml模块中更新YCSB版本
- [服务器-52824](https://jira.mongodb.org/browse/SERVER-52824)通过路径支持AWS角色
- [服务器-52834](https://jira.mongodb.org/browse/SERVER-52834)迁移sys-perf和perf任务以使用新的run_workload DSI命令
- [服务器-52929](https://jira.mongodb.org/browse/SERVER-52929)使用32个键正确处理复合索引
- [服务器-52969](https://jira.mongodb.org/browse/SERVER-52969)在非主分支上禁用Powercyle
- [服务器-52975](https://jira.mongodb.org/browse/SERVER-52975)修复了“collection_impl.cpp”中集合验证器选项中“onRollback”回调的使用
- [服务器-53017](https://jira.mongodb.org/browse/SERVER-53017)replSetGetStatus remainingInitialSyncEstimatedMillis总是0
- [服务器-53058](https://jira.mongodb.org/browse/SERVER-53058)在设置动态超时时，更好地说明CleanEveryN运行时
- [服务器-53068](https://jira.mongodb.org/browse/SERVER-53068)使用10gen/linkbench2代替mdcallag/linkbench进行系统perf
- [服务器-53196](https://jira.mongodb.org/browse/SERVER-53196)如果指定了大型发行版但不可用，则无法生成任务
- [服务器-53314](https://jira.mongodb.org/browse/SERVER-53314)生成的任务可以指定空发行版
- [WT-4780](https://jira.mongodb.org/browse/WT-4780)启用提交时间戳比所有读者更新的断言
- [WT-6449](https://jira.mongodb.org/browse/WT-6449)用于WT常青测试的悬挂式分析仪
- [WT-6563](https://jira.mongodb.org/browse/WT-6563)为无效的修改应用程序创建复制器
- [WT-6678](https://jira.mongodb.org/browse/WT-6678)删除对密钥的霍夫曼编码支持
- [WT-6693](https://jira.mongodb.org/browse/WT-6693)添加导入对象的兼容性测试
- [WT-6706](https://jira.mongodb.org/browse/WT-6706)添加表格导入维修功能
- [WT-6713](https://jira.mongodb.org/browse/WT-6713)从自定义数据源中删除事务支持
- [WT-6722](https://jira.mongodb.org/browse/WT-6722)查看历史商店模块中的功能名称
- [WT-6750](https://jira.mongodb.org/browse/WT-6750)断言确保历史记录存储中没有重复的条目
- [WT-6751](https://jira.mongodb.org/browse/WT-6751)断言新值是否与历史存储更新的旧值相同
- [WT-6752](https://jira.mongodb.org/browse/WT-6752)断言历史记录存储不会有任何未提交的更新
- [WT-6753](https://jira.mongodb.org/browse/WT-6753)断言只能修改历史存储更新的停止时间对。
- [WT-6816](https://jira.mongodb.org/browse/WT-6816)设计写入生成方案，允许具有活动历史记录的处理被关闭/重新打开
- [WT-6824](https://jira.mongodb.org/browse/WT-6824)修复与UTF编码相关的OSX python测试错误
- [WT-6828](https://jira.mongodb.org/browse/WT-6828)在README中修复文档链接
- [WT-6830](https://jira.mongodb.org/browse/WT-6830)在与字符串串联之前对字节进行编码
- [WT-6835](https://jira.mongodb.org/browse/WT-6835)添加API以允许合并增量备份信息
- [WT-6836](https://jira.mongodb.org/browse/WT-6836)处理阴影表中最后一个按键，在时间戳中止中退时被回滚到稳定
- [WT-6839](https://jira.mongodb.org/browse/WT-6839)添加API以查询现有的增量备份ID
- [WT-6842](https://jira.mongodb.org/browse/WT-6842)添加示例，仅显示使用src_id
- [WT-6844](https://jira.mongodb.org/browse/WT-6844)使力停止持久
- [WT-6845](https://jira.mongodb.org/browse/WT-6845)在历史商店运营时，将会话btree设置为HS
- [WT-6857](https://jira.mongodb.org/browse/WT-6857)为历史记录存储访问定义一个新的光标。
- [WT-6858](https://jira.mongodb.org/browse/WT-6858)为历史记录存储光标实现插入方法
- [WT-6859](https://jira.mongodb.org/browse/WT-6859)为历史存储光标实现search_near方法
- [WT-6860](https://jira.mongodb.org/browse/WT-6860)将相关的历史存储统计数据添加到数据句柄中
- [WT-6867](https://jira.mongodb.org/browse/WT-6867)文档：为架构指南创建模型子页面
- [WT-6868](https://jira.mongodb.org/browse/WT-6868)不要缓存元数据操作的历史存储光标
- [WT-6869](https://jira.mongodb.org/browse/WT-6869)断言树走，永远不要回头，参考
- [WT-6870](https://jira.mongodb.org/browse/WT-6870)重命名历史商店统计数据，以更好地描述其用例。
- [WT-6872](https://jira.mongodb.org/browse/WT-6872)将产量说明替换为ISB
- [WT-6875](https://jira.mongodb.org/browse/WT-6875)删除遗留的导入调用
- [WT-6882](https://jira.mongodb.org/browse/WT-6882)在增量备份期间创建的文件应完整复制
- [WT-6883](https://jira.mongodb.org/browse/WT-6883)重做更改以分解备份范围并修复EOF
- [WT-6894](https://jira.mongodb.org/browse/WT-6894)实现历史存储光标prev和后续方法
- [WT-6895](https://jira.mongodb.org/browse/WT-6895)实现HS光标更新方法
- [WT-6896](https://jira.mongodb.org/browse/WT-6896)hs光标删除的初始实现
- [WT-6916](https://jira.mongodb.org/browse/WT-6916)为架构指南创建存根子页面
- [WT-6922](https://jira.mongodb.org/browse/WT-6922)将随机整合测试添加到incr_backup
- [WT-6925](https://jira.mongodb.org/browse/WT-6925)修复错误的注释
- [WT-6934](https://jira.mongodb.org/browse/WT-6934)修复__wt_hs_upd_find错误地返回WT_NOTFOUND
- [WT-6957](https://jira.mongodb.org/browse/WT-6957)如果__wt_hs_modify返回WT_RESTART，请重新定位光标
- [WT-6958](https://jira.mongodb.org/browse/WT-6958)修复操作后历史记录存储光标位置
- [WT-6961](https://jira.mongodb.org/browse/WT-6961)RTS没有稳定的时间戳
- [WT-6986](https://jira.mongodb.org/browse/WT-6986)将UndoDB支持添加到format.sh



## 4.4.2 更改日志

### 安全

- [服务器-45938](https://jira.mongodb.org/browse/SERVER-45938)如果clusterMode:keyFile，允许在客户端x509证书中匹配O/OU/DC
- [服务器-47964](https://jira.mongodb.org/browse/SERVER-47964)添加OCSP分层测试

- [服务器-49826](https://jira.mongodb.org/browse/SERVER-49826)在RHEL / Centos 7.6变体中启用OCSP订书机
- [服务器-50065](https://jira.mongodb.org/browse/SERVER-50065)添加证书轮换的OCSP测试
- [服务器-50463](https://jira.mongodb.org/browse/SERVER-50463)Make PooledLDAPConnection::刷新获得自有

### 分片

- [服务器-36739](https://jira.mongodb.org/browse/SERVER-36739)在并发降级套件中使用mongos_manual_intervention_action钩子
- [服务器-47616](https://jira.mongodb.org/browse/SERVER-47616)改善了逻辑会话无法在单个连接上进行多个用户身份验证时的错误
- [服务器-48504](https://jira.mongodb.org/browse/SERVER-48504)StaleShardVersion和ShardNotFound异常的组合使ChunkManagerTargeter崩溃
- [服务器-48566](https://jira.mongodb.org/browse/SERVER-48566)主节点中的碎片加载程序盲目阅读config.cache.collections的版本
- [服务器-48654](https://jira.mongodb.org/browse/SERVER-48654)TransactionCoordinatorMetricsTest应在启动WaitForMajorityService之前安装模拟勾号源
- [服务器-48699](https://jira.mongodb.org/browse/SERVER-48699)在_configsvrMoveChunk命令启动之前，MaxTimeMS可能会在 range_deleter_interacts_correctly_with_refine_shard_key.js测试中过期
- [服务器-49019](https://jira.mongodb.org/browse/SERVER-49019)refineShardKey可以在降级时点击getLastError不变
- [服务器-50451](https://jira.mongodb.org/browse/SERVER-50451)range_deleter_shutdown_and_failover_during_set_fcv.js应该针对蒙古人重试setFCV，直到成功处理缓慢的选举
- [服务器-50470](https://jira.mongodb.org/browse/SERVER-50470)让persistipantsList将TransactionCoordinatorReachedAbortDecision转换为NoSuchTransaction
- [服务器-50545](https://jira.mongodb.org/browse/SERVER-50545)在index_operations_abort_concurrent_outgoing_migrations.js中重试冲突操作InProgress
- [服务器-50750](https://jira.mongodb.org/browse/SERVER-50750)细化碎片键以包含嵌套字段会导致碎片原语上的“刷新缓存集合错误”
- [服务器-50795](https://jira.mongodb.org/browse/SERVER-50795)从config.migrations中的文档中提取forceJumbo在MigrationType::fromBSON中可以抛出
- [服务器-50900](https://jira.mongodb.org/browse/SERVER-50900)禁用cursor_valid_after_shard_stepdown.js的PeriodicShardedIndexConsistencyChecker
- [服务器-51673](https://jira.mongodb.org/browse/SERVER-51673)在deaction_coordinator_test中修复测试用例，在尝试坚持决策之前关闭AsyncWorkScheduler

### 复制

- [服务器-46930](https://jira.mongodb.org/browse/SERVER-46930)AutoGetOplog无法正确获取非文档锁定引擎的集合IX锁
- [服务器-48600](https://jira.mongodb.org/browse/SERVER-48600)RefineCollectionShardKey不会检查事务写入关注错误
- [服务器-48928](https://jira.mongodb.org/browse/SERVER-48928)允许主要选择完成排水模式，即使它正在无条件下降
- [服务器-49462](https://jira.mongodb.org/browse/SERVER-49462)在ReplSetTest.checkOplogs中等待二等生准备好
- [服务器-49730](https://jira.mongodb.org/browse/SERVER-49730)替换waitForDrainFinish的用法
- [服务器-49986](https://jira.mongodb.org/browse/SERVER-49986)将 isMaster 命令转换为 hello 并添加别名
- [服务器-49987](https://jira.mongodb.org/browse/SERVER-49987)如果在mongod上发送了“hello”，请重命名响应字段
- [服务器-49988](https://jira.mongodb.org/browse/SERVER-49988)如果mongos上发送了“hello”，请重命名响应字段
- [服务器-49989](https://jira.mongodb.org/browse/SERVER-49989)添加db.hello() shell helper
- [服务器-50083](https://jira.mongodb.org/browse/SERVER-50083)重新配置杀死初级和降级直通应该禁用选举切换
- [服务器-50097](https://jira.mongodb.org/browse/SERVER-50097)如果使用IsMaster命令别名，则不准确的 exhaustIsMasterMetrics
- [服务器-50103](https://jira.mongodb.org/browse/SERVER-50103)使用侧连接发送终止光标请求时，DBClientCursor不会设置套接字超时
- [服务器-50116](https://jira.mongodb.org/browse/SERVER-50116)启用复制时禁止oplog写入
- [服务器-50320](https://jira.mongodb.org/browse/SERVER-50320)修复初始同步器中的取消比赛
- [服务器-50405](https://jira.mongodb.org/browse/SERVER-50405)别名是mongocryptd中的Master，并附加适当的响应字段
- [服务器-50407](https://jira.mongodb.org/browse/SERVER-50407)mongotmock中的别名是Master，并附加适当的响应字段
- [服务器-50408](https://jira.mongodb.org/browse/SERVER-50408)将NotMaster ErrorCode名称更改为NotWritablePrimary
- [服务器-50409](https://jira.mongodb.org/browse/SERVER-50409)将NotMasterNoSlaveOk ErrorCode更改为NotPrimaryNoSecondaryOk
- [服务器-50410](https://jira.mongodb.org/browse/SERVER-50410)将NotMasterOrSecondary ErrorCode名称更改为NotPrimaryOrSecondary
- [服务器-50411](https://jira.mongodb.org/browse/SERVER-50411)将NoConfigMaster ErrorCode名称更改为NoConfigPrimary
- [服务器-50415](https://jira.mongodb.org/browse/SERVER-50415)将waitInIsMaster故障点重命名为waitInHello
- [服务器-50418](https://jira.mongodb.org/browse/SERVER-50418)将 exhaustHello 添加到 serverStatus
- [服务器-50447](https://jira.mongodb.org/browse/SERVER-50447)修复backports_required_for_multiversion_tests.yml中ismaster.js中的票据依赖性
- [服务器-50527](https://jira.mongodb.org/browse/SERVER-50527)将NotMasterError类别更改为NotPrimaryError
- [服务器-50607](https://jira.mongodb.org/browse/SERVER-50607)调用_checkForShutdownAndConvertStatus_inlock时必须保持互斥
- [服务器-50626](https://jira.mongodb.org/browse/SERVER-50626)在read_concern_majority_getmore_secondaries.js中比赛
- [服务器-50640](https://jira.mongodb.org/browse/SERVER-50640)listCommands除了“hello”命令名外，还应该返回“isMaster”别名
- [服务器-50869](https://jira.mongodb.org/browse/SERVER-50869)后台同步可能会在升级过程中错误地设置应用
- [服务器-51047](https://jira.mongodb.org/browse/SERVER-51047)standalone_replication_recovery_relaxes_index_constaints.js不应在4.4中的replica_sets_multiversion中运行
- [服务器-51163](https://jira.mongodb.org/browse/SERVER-51163)将返回InvalidReplicaSetConfig的节点标记为向下
- [服务器-51259](https://jira.mongodb.org/browse/SERVER-51259)重命名waitForIsMasterResponse to waitForHelloResponse
- [服务器-51260](https://jira.mongodb.org/browse/SERVER-51260)将hangWhileWaitingForIsMasterResponse重命名为hangWhileWaitingForHelloResponse
- [服务器-51597](https://jira.mongodb.org/browse/SERVER-51597)当配置发生变化时，不要尝试干净地关闭初始同步器
- [服务器-51726](https://jira.mongodb.org/browse/SERVER-51726)当主执行器关闭时，保持状态代码的兼容性

### 查询

- [服务器-47469](https://jira.mongodb.org/browse/SERVER-47469)applyOps不接受视图操作的独家锁定
- [服务器-48128](https://jira.mongodb.org/browse/SERVER-48128)带有输出的mapreduce和聚合在rs上不起作用，以进行集群升级
- [服务器-48617](https://jira.mongodb.org/browse/SERVER-48617)并发“createIndexes”可以通过用尽写入票据来阻止主写入和独立主写入操作。
- [服务器-50028](https://jira.mongodb.org/browse/SERVER-50028)覆盖率分析缺陷114771：空格检查后取消引用
- [服务器-50029](https://jira.mongodb.org/browse/SERVER-50029)覆盖率分析缺陷115663：单硝化标量变量
- [服务器-50291](https://jira.mongodb.org/browse/SERVER-50291)添加查询旋钮，以不同顺序枚举$或子项
- [服务器-51120](https://jira.mongodb.org/browse/SERVER-51120)使用SORT_MERGE查找查询，在指定排序时错误地对结果进行排序
- [服务器-51853](https://jira.mongodb.org/browse/SERVER-51853)始终在AbstractIndexAccessMethod::insertKeys中初始化numInserted out-parameter

### 写入操作

- [服务器-44586](https://jira.mongodb.org/browse/SERVER-44586)将指标添加到serverStatus以跟踪更新命令的类型
- [服务器-49154](https://jira.mongodb.org/browse/SERVER-49154)添加回归测试，以确保将FCV设置为4.2禁用集合/索引创建

### 集合

- [服务器-30405](https://jira.mongodb.org/browse/SERVER-30405)添加表达式以生成随机数
- [服务器-40317](https://jira.mongodb.org/browse/SERVER-40317)$facet执行对它可以消耗多少内存没有限制
- [服务器-48390](https://jira.mongodb.org/browse/SERVER-48390)拥有$accumulator的组抱怨在小于96MB的集合中内存超过100MB
- [服务器-48523](https://jira.mongodb.org/browse/SERVER-48523)尝试恢复更改流时，无条件检查操作日志中的第一个条目
- [服务器-49469](https://jira.mongodb.org/browse/SERVER-49469)解释excutionStats for $unionWith错误地显示内部管道的COLLLSCAN

### 目录

[服务器-50030](https://jira.mongodb.org/browse/SERVER-50030)覆盖分析缺陷115212：使用错误的操作员

### 储存

- [服务器-43664](https://jira.mongodb.org/browse/SERVER-43664)通过优化WiredTigerUtil::setTableLogging()，加快许多表的WiredTiger存储引擎启动
- [服务器-47681](https://jira.mongodb.org/browse/SERVER-47681)后台验证使用kNoOverlap读取源而不是kAllDurableSnapshot，以防止我们不得不对次要进行PBWM锁定
- [服务器-47803](https://jira.mongodb.org/browse/SERVER-47803)将数据库级别配置文件设置从数据库移动到CollectionCatalog
- [服务器-47812](https://jira.mongodb.org/browse/SERVER-47812)次要者坚持通配符多键路径乱序
- [服务器-47959](https://jira.mongodb.org/browse/SERVER-47959)Retry JournalFlusher操作日志读取并发{full:true}验证操作日志集合上的命令引起的WriteConflictExceptions
- [服务器-48021](https://jira.mongodb.org/browse/SERVER-48021)将WT调试表日志模式添加到`*kill_(primary|secondary)*`测试
- [服务器-48154](https://jira.mongodb.org/browse/SERVER-48154)标识滴管应定期产生全局IS锁
- [服务器-48245](https://jira.mongodb.org/browse/SERVER-48245)待删除的集合允许索引下降
- [服务器-49776](https://jira.mongodb.org/browse/SERVER-49776)将端口MDB <-> WT版本表从4.2到4.4和母版表，请
- [服务器-50045](https://jira.mongodb.org/browse/SERVER-50045)JournalFlusher可以在回滚期间中断ShutdownInProgress的书面担忧
- [服务器-50586](https://jira.mongodb.org/browse/SERVER-50586)在抛出任何异常之前，集合验证应将集合的命名空间附加到输出中
- [服务器-51302](https://jira.mongodb.org/browse/SERVER-51302)覆盖阅读时间戳检查以刷新交易

### 运营

- [服务器-26726](https://jira.mongodb.org/browse/SERVER-26726)检查createIndex()的参数数量，如果两个以上的参数，则抛出错误
- [服务器-46189](https://jira.mongodb.org/browse/SERVER-46189)shell挂着消息“不允许使用单个副本集丢失的ssl模式
- [服务器-48244](https://jira.mongodb.org/browse/SERVER-48244)Shell不应该对允许的解释级别进行硬编码，而是让服务器拒绝它
- [服务器-49320](https://jira.mongodb.org/browse/SERVER-49320)如果无法创建日志文件，则不会产生错误消息
- [服务器-50270](https://jira.mongodb.org/browse/SERVER-50270)shell应该需要AWS身份验证的密码
- [服务器-50491](https://jira.mongodb.org/browse/SERVER-50491)由于freeStorageSize限制FTDC保留而频繁的模式更改

### 构建和包装

- [服务器-23668](https://jira.mongodb.org/browse/SERVER-23668)scons缩写选项无法正常工作
- [服务器-43903](https://jira.mongodb.org/browse/SERVER-43903)所有编译任务都应上传配置日志和缓存日志
- [服务器-47355](https://jira.mongodb.org/browse/SERVER-47355)硬编码的dest-test/bin路径不得包含在aws_e2e_ecs.js中
- [服务器-47943](https://jira.mongodb.org/browse/SERVER-47943)如果指定了ICECC或CCACHE，但无法加载，则显式错误
- [服务器-48282](https://jira.mongodb.org/browse/SERVER-48282)平台支持：添加社区和企业RHEL 8 ARM
- [服务器-50016](https://jira.mongodb.org/browse/SERVER-50016)缺少可变自定义文件失败
- [服务器-50091](https://jira.mongodb.org/browse/SERVER-50091)为ARM64构建器启用SCons缓存
- [服务器-50125](https://jira.mongodb.org/browse/SERVER-50125)带有ccache的UBSAN并不总是尊重-fsanitize-blacklist选项
- [服务器-50363](https://jira.mongodb.org/browse/SERVER-50363)促进--build-tools=稳定的下一个
- [服务器-50648](https://jira.mongodb.org/browse/SERVER-50648)RHEL 8.2 ARM构建器的publish_packages任务不应在ARM主机上运行。
- [服务器-50674](https://jira.mongodb.org/browse/SERVER-50674)达尔文--分离调试工具不应用`x`标志剥离

### 内部人员

- [服务器-34484](https://jira.mongodb.org/browse/SERVER-34484)IDL目标在外部构建路径上不起作用。
- [服务器-35649](https://jira.mongodb.org/browse/SERVER-35649)由于自我失败而被移除的节点应该重新尝试找到自己
- [服务器-38289](https://jira.mongodb.org/browse/SERVER-38289)教SCons关于.idl文件
- [服务器-39562](https://jira.mongodb.org/browse/SERVER-39562)维修应该处理重复的唯一索引键
- [服务器-43491](https://jira.mongodb.org/browse/SERVER-43491)指定jstest仅保证对mongod（而不是mongos）的一致行为
- [服务器-45626](https://jira.mongodb.org/browse/SERVER-45626)一致的Oplog锁定规则
- [服务器-45992](https://jira.mongodb.org/browse/SERVER-45992)InMemory引擎启动警告令人困惑
- [服务器-46275](https://jira.mongodb.org/browse/SERVER-46275)在认证生成工具中添加对ECDSA w/OCSP的支持
- [服务器-46321](https://jira.mongodb.org/browse/SERVER-46321)更新手册页
- [服务器-46625](https://jira.mongodb.org/browse/SERVER-46625)改进了当mongocryptd请求发送到非mongocryptd守护进程时的诊断
- [服务器-46798](https://jira.mongodb.org/browse/SERVER-46798)删除 VersionInfoInterface::isSameMajorVersion
- [服务器-47375](https://jira.mongodb.org/browse/SERVER-47375)SERVER-45798中列出的完整待办事项
- [服务器-47827](https://jira.mongodb.org/browse/SERVER-47827)请求本地运行本地burn_in_tests.py，自主服务器以来更改的所有测试，包括在本地分支中提交的测试
- [服务器-48030](https://jira.mongodb.org/browse/SERVER-48030)使用GetShardMap和旧的RSM修复僵局
- [服务器-48067](https://jira.mongodb.org/browse/SERVER-48067)使用大量非唯一密钥减少唯一索引构建的内存消耗
- [服务器-48170](https://jira.mongodb.org/browse/SERVER-48170)当使用带有2节点副本集碎片的upgradeCluster()时，多版本测试假设主稳定性
- [服务器-48324](https://jira.mongodb.org/browse/SERVER-48324)公开参数以在ftdc中包含tcmalloc详细统计信息
- [服务器-48334](https://jira.mongodb.org/browse/SERVER-48334)使用未处理的WriteConflictException在调试构建中，索引构建可能会失败
- [服务器-48410](https://jira.mongodb.org/browse/SERVER-48410)日期时间库的签名整数溢出修复
- [服务器-48452](https://jira.mongodb.org/browse/SERVER-48452)内部阅读器应默认为没有时间戳的阅读
- [服务器-48474](https://jira.mongodb.org/browse/SERVER-48474)添加$sampleRate匹配表达式
- [服务器-48705](https://jira.mongodb.org/browse/SERVER-48705)resmoke.py发送SIGABRT在夹具拆解时进行核心转储可能会从挂起分析器覆盖核心文件
- [服务器-48742](https://jira.mongodb.org/browse/SERVER-48742)每当通过setProfilingLevel更改分析器设置时进行记录
- [服务器-48884](https://jira.mongodb.org/browse/SERVER-48884)测试监考生初始化器有错误的先决条件
- [服务器-48946](https://jira.mongodb.org/browse/SERVER-48946)删除v4.4分支中的Biggie常绿变体
- [服务器-48949](https://jira.mongodb.org/browse/SERVER-48949)4.4中的snapshot_window_util.cpp中错过了logv2清理
- [服务器-49102](https://jira.mongodb.org/browse/SERVER-49102)接受过滤器表达式作为slowMS/sampleRate的替代品
- [服务器-49165](https://jira.mongodb.org/browse/SERVER-49165)Client.Disconnect中的endSessions命令导致需要身份验证的主机上未经身份验证的连接的授权失败
- [服务器-49396](https://jira.mongodb.org/browse/SERVER-49396)仅激活用户连接的skipWriteConflictRetries故障点
- [服务器-49402](https://jira.mongodb.org/browse/SERVER-49402)连接到数据湖时出现误导性错误信息
- [服务器-49507](https://jira.mongodb.org/browse/SERVER-49507)在使用大量重复记录重建唯一索引时，减少启动修复中的内存消耗
- [服务器-49766](https://jira.mongodb.org/browse/SERVER-49766)索引和非索引集合返回空查询的不同结果
- [服务器-49857](https://jira.mongodb.org/browse/SERVER-49857)ASAN Ubuntu 18.04构建变体并不象征其输出
- [服务器-49926](https://jira.mongodb.org/browse/SERVER-49926)[4.4] collMod不应接受FCV 4.2中的“recordPreImages: false”选项
- [服务器-49957](https://jira.mongodb.org/browse/SERVER-49957)在 getPrevAndNextUUID 中阅读越界
- [服务器-50010](https://jira.mongodb.org/browse/SERVER-50010)Mongodb构建应该有特定的忍者再生规则
- [服务器-50051](https://jira.mongodb.org/browse/SERVER-50051)使jstests/multiversion/hashed_index_bad_keys_cleanup.js更健壮
- [服务器-50072](https://jira.mongodb.org/browse/SERVER-50072)初始化MongoRunner.EXIT_ABORT时检查_isWindows()
- [服务器-50123](https://jira.mongodb.org/browse/SERVER-50123)所有平台上创纪录的物理内核数量
- [服务器-50134](https://jira.mongodb.org/browse/SERVER-50134)通过DSI运行微基准测试
- [服务器-50148](https://jira.mongodb.org/browse/SERVER-50148)修复MultiIndexBlock中的移动后使用
- [服务器-50242](https://jira.mongodb.org/browse/SERVER-50242)在mongos中看到的s for ismaster的缓慢查询消息
- [服务器-50246](https://jira.mongodb.org/browse/SERVER-50246)$unionWith解释从子管道中的任何阶段丢失信息，这些信息被光标阶段吸收
- [服务器-50249](https://jira.mongodb.org/browse/SERVER-50249)通过软件包管理器从4.2.8升级到4.4.0
- [服务器-50326](https://jira.mongodb.org/browse/SERVER-50326)将agg_out.js工作负载中的分片限制为单个线程
- [服务器-50365](https://jira.mongodb.org/browse/SERVER-50365)陷入无法超时的长期交易
- [服务器-50376](https://jira.mongodb.org/browse/SERVER-50376)Ninja接下来没有看到编译器更改
- [服务器-50379](https://jira.mongodb.org/browse/SERVER-50379)减少频率`!`和`*`4.4上的建筑商
- [服务器-50394](https://jira.mongodb.org/browse/SERVER-50394)mongod审计日志在分片环境中将DDL操作归因于__system用户
- [服务器-50401](https://jira.mongodb.org/browse/SERVER-50401)处理作为提交应用的补丁
- [服务器-50490](https://jira.mongodb.org/browse/SERVER-50490)将服务器重新启动的日志严重性从警告（-2）降低回日志（0）
- [服务器-50530](https://jira.mongodb.org/browse/SERVER-50530)档案-mh目标不是建在窗户上
- [服务器-50605](https://jira.mongodb.org/browse/SERVER-50605)添加{logMessage: "msg"}仅测试命令
- [服务器-50635](https://jira.mongodb.org/browse/SERVER-50635)分片测试结束时的索引一致性检查对ShardNotFound不可靠
- [服务器-50690](https://jira.mongodb.org/browse/SERVER-50690)添加选项以指定绑定ip到ocsp模拟
- [服务器-50736](https://jira.mongodb.org/browse/SERVER-50736)让OpenSSL明确接受ClientHello中显示的SNI
- [服务器-50818](https://jira.mongodb.org/browse/SERVER-50818)覆盖率分析缺陷114987：免费使用包装对象
- [服务器-50852](https://jira.mongodb.org/browse/SERVER-50852)BF Day - 悬挂分析仪用于C++单元测试的“有趣的过程”模式与db_unittests不匹配
- [服务器-50866](https://jira.mongodb.org/browse/SERVER-50866)systemd unit mongod.service应使用“After=network-online.target”
- [服务器-50895](https://jira.mongodb.org/browse/SERVER-50895)如果执行不需要子管道，则$union使用缓存的解释管道将被泄露
- [服务器-50913](https://jira.mongodb.org/browse/SERVER-50913)拆解配置服务器最后在分片集群中
- [服务器-50955](https://jira.mongodb.org/browse/SERVER-50955)oplog_rollover.js暂停OplogCapMaintainerThread，直到需要截断
- [服务器-51041](https://jira.mongodb.org/browse/SERVER-51041)次要读取的节流启动交易
- [服务器-51045](https://jira.mongodb.org/browse/SERVER-51045)[v4.4] 更新阻止列表，等待 SERVER-46625 4.2 后端口
- [服务器-51097](https://jira.mongodb.org/browse/SERVER-51097)unittest运行了一个多小时，使提交队列停滞不前
- [服务器-51106](https://jira.mongodb.org/browse/SERVER-51106)使 isMaster 命令成为 Hello 的派生类
- [服务器-51194](https://jira.mongodb.org/browse/SERVER-51194)接下来为构建工具制定常青任务
- [服务器-51220](https://jira.mongodb.org/browse/SERVER-51220)处理间接下拉的审计归因
- [服务器-51242](https://jira.mongodb.org/browse/SERVER-51242)在微基准DSI任务中禁用金丝雀
- [服务器-51303](https://jira.mongodb.org/browse/SERVER-51303)查找阶段，然后在类型上使用错误字段的$match
- [服务器-51384](https://jira.mongodb.org/browse/SERVER-51384)启用并修复驱动程序编译夜间测试4.4
- [服务器-51467](https://jira.mongodb.org/browse/SERVER-51467)在change_streams_multiversion_cluster.js中升级集群时，将waitUntilStable设置为true
- [服务器-51604](https://jira.mongodb.org/browse/SERVER-51604)如果调试符号上传失败，Evergreen编译任务应该会失败
- [服务器-51607](https://jira.mongodb.org/browse/SERVER-51607)将扭曲依赖项升级到至少扭曲-19.7.0
- [服务器-51685](https://jira.mongodb.org/browse/SERVER-51685)修复了MongoDB 4.4.1的下载，用于4.4分支上的多版本测试
- [服务器-51771](https://jira.mongodb.org/browse/SERVER-51771)libunwind无法使用GCC >=10.2构建
- [服务器-52617](https://jira.mongodb.org/browse/SERVER-52617)在运行remateToOplogTimestamp之前，将指针缓存到oplog集合
- [服务器-52696](https://jira.mongodb.org/browse/SERVER-52696)将sysbench添加到system_perf.yml模块
- [服务器-52697](https://jira.mongodb.org/browse/SERVER-52697)将tpcc添加到system_perf.yml模块
- [WT-4310](https://jira.mongodb.org/browse/WT-4310)在基于数据损坏的诊断构建中添加不中止的选项
- [WT-5144](https://jira.mongodb.org/browse/WT-5144)在perf程序中使用wt_clock而不是wt_epoch
- [WT-5585](https://jira.mongodb.org/browse/WT-5585)删除cache_overflow配置选项
- [WT-5645](https://jira.mongodb.org/browse/WT-5645)添加循环完成已知故障测试/格式配置的Evergreen测试
- [WT-5691](https://jira.mongodb.org/browse/WT-5691)处理导入的文件比当前数据库早几代写入的场景
- [WT-5693](https://jira.mongodb.org/browse/WT-5693)启用test_wt4105_large_doc_small_upd
- [WT-6000](https://jira.mongodb.org/browse/WT-6000)以格式增强增量备份测试，以支持重新启动
- [WT-6006](https://jira.mongodb.org/browse/WT-6006)在检查点压力测试中将测试二进制文件恢复到10
- [WT-6027](https://jira.mongodb.org/browse/WT-6027)修复文档拼写错误和警告
- [WT-6181](https://jira.mongodb.org/browse/WT-6181)让Python Evergreen测试在失败时打印标准输出
- [WT-6263](https://jira.mongodb.org/browse/WT-6263)重新启用历史记录商店验证
- [WT-6277](https://jira.mongodb.org/browse/WT-6277)兼容性测试验证时间戳验证失败
- [WT-6322](https://jira.mongodb.org/browse/WT-6322)将完全兼容性测试分成更小的小组
- [WT-6390](https://jira.mongodb.org/browse/WT-6390)将compact02超时从8 => 10分钟延长
- [WT-6404](https://jira.mongodb.org/browse/WT-6404)添加时序重音，在调用__wt_txn_begin后延迟检查点
- [WT-6410](https://jira.mongodb.org/browse/WT-6410)删除WT_SESSION.rebalance
- [WT-6427](https://jira.mongodb.org/browse/WT-6427)在设置旧时间戳时，请务必设置稳定的时间戳
- [WT-6446](https://jira.mongodb.org/browse/WT-6446) Rename `*.i` files into `*_inline.h` files
- [WT-6451](https://jira.mongodb.org/browse/WT-6451)如果需要历史阅读，请勿驱逐干净的元数据页面
- [WT-6463](https://jira.mongodb.org/browse/WT-6463)历史记录存储操作应尊重缓存大小
- [WT-6467](https://jira.mongodb.org/browse/WT-6467)修复历史记录商店验证
- [WT-6471](https://jira.mongodb.org/browse/WT-6471)避免不存在的叮当格式二进制文件的错误消息
- [WT-6472](https://jira.mongodb.org/browse/WT-6472)更新timetamp_abort测试缓存配置
- [WT-6478](https://jira.mongodb.org/browse/WT-6478)光标缓存统计信息没有增量
- [WT-6490](https://jira.mongodb.org/browse/WT-6490)获取驱逐线程的快照
- [WT-6505](https://jira.mongodb.org/browse/WT-6505)添加缺失文件失败的调试
- [WT-6507](https://jira.mongodb.org/browse/WT-6507)我们的操作超时后，退出缓存驱逐人员
- [WT-6526](https://jira.mongodb.org/browse/WT-6526)修复不干净关机后在只读模式下打开DB时断言失败
- [WT-6532](https://jira.mongodb.org/browse/WT-6532)在拆分长度计算中考虑更新结构开销
- [WT-6544](https://jira.mongodb.org/browse/WT-6544)未附加到从数据或历史存储恢复的墓碑上的页面值
- [WT-6546](https://jira.mongodb.org/browse/WT-6546)更新快速截断，以使用最新的启动耐用ts
- [WT-6556](https://jira.mongodb.org/browse/WT-6556)修复内部会话使用内部会话关闭功能而不是公共API，以避免内存泄漏
- [WT-6559](https://jira.mongodb.org/browse/WT-6559)使用新会话的会话ID来确定统计存储桶
- [WT-6560](https://jira.mongodb.org/browse/WT-6560)修复WT实用程序中全局打捞的使用
- [WT-6561](https://jira.mongodb.org/browse/WT-6561)在wt实用程序使用输出中提供MongoDB配置
- [WT-6569](https://jira.mongodb.org/browse/WT-6569)在写入数据存储之前，将准备好的更新压缩成单个更新
- [WT-6570](https://jira.mongodb.org/browse/WT-6570)RTS删除历史记录商店中没有停止时间戳的剩余更新
- [WT-6571](https://jira.mongodb.org/browse/WT-6571)Lseek不能使用error_sys_check，因为它不会返回int
- [WT-6577](https://jira.mongodb.org/browse/WT-6577)历史记录存储转储输出混淆时间窗口
- [WT-6581](https://jira.mongodb.org/browse/WT-6581)在test_hs15中修复类名
- [WT-6583](https://jira.mongodb.org/browse/WT-6583)仅在发布交易时清除读取时间戳
- [WT-6586](https://jira.mongodb.org/browse/WT-6586)插入历史记录存储的墓碑也应标记为WT_UPDATE_HS
- [WT-6589](https://jira.mongodb.org/browse/WT-6589)修复禁用的光标缓存python测试
- [WT-6591](https://jira.mongodb.org/browse/WT-6591)在Python测试中关闭连接之前停止检查点线程
- [WT-6592](https://jira.mongodb.org/browse/WT-6592)避免因未构建扩展而跳过的Python测试的标记错误
- [WT-6593](https://jira.mongodb.org/browse/WT-6593)在test_rollback_to_stable10中重试冲突操作
- [WT-6596](https://jira.mongodb.org/browse/WT-6596)增加时间戳中止测试的缓存，并为所有中止测试单独设置密钥空格
- [WT-6598](https://jira.mongodb.org/browse/WT-6598)添加新的API，允许更改dhandle哈希桶大小
- [WT-6602](https://jira.mongodb.org/browse/WT-6602)允许传递操作超时ms以提交和回滚
- [WT-6604](https://jira.mongodb.org/browse/WT-6604)修复注释中描述WT_CELL结构的错别字
- [WT-6610](https://jira.mongodb.org/browse/WT-6610)修复增量备份检查点解析以处理升级
- [WT-6612](https://jira.mongodb.org/browse/WT-6612)在test_prepare08中增加缓存大小，以修复缓存压力导致的回滚错误
- [WT-6613](https://jira.mongodb.org/browse/WT-6613)添加早期_load标志的python测试
- [WT-6615](https://jira.mongodb.org/browse/WT-6615)在实际使用的地方初始化last_upd
- [WT-6616](https://jira.mongodb.org/browse/WT-6616)完成后设置检查站的旧时间戳
- [WT-6619](https://jira.mongodb.org/browse/WT-6619)消除test_cursor13.py中无限循环的可能性
- [WT-6624](https://jira.mongodb.org/browse/WT-6624)将事务快照用于执行驱逐的应用程序
- [WT-6625](https://jira.mongodb.org/browse/WT-6625)删除过时的TODO
- [WT-6629](https://jira.mongodb.org/browse/WT-6629)支持元数据中的索引表：创建光标
- [WT-6635](https://jira.mongodb.org/browse/WT-6635)禁用混合和列文件类型测试
- [WT-6640](https://jira.mongodb.org/browse/WT-6640)覆盖范围：未能恢复已保存的处理
- [WT-6641](https://jira.mongodb.org/browse/WT-6641)覆盖范围：未使用的价值
- [WT-6643](https://jira.mongodb.org/browse/WT-6643)显式设置LSN的64位uint部分用于原子分配
- [WT-6649](https://jira.mongodb.org/browse/WT-6649)覆盖范围：__wt_rec_need_split中的无意整数溢出
- [WT-6650](https://jira.mongodb.org/browse/WT-6650)覆盖范围：会话中的空取消引用::关闭
- [WT-6653](https://jira.mongodb.org/browse/WT-6653)在RTS测试中重试之前回滚/重新启动txn
- [WT-6654](https://jira.mongodb.org/browse/WT-6654)清理test_backup15.py
- [WT-6657](https://jira.mongodb.org/browse/WT-6657)修复在没有时间戳的情况下插入更新时的历史商店恐慌
- [WT-6666](https://jira.mongodb.org/browse/WT-6666)当我们在回滚和提交中配置操作计时器时，启动它
- [WT-6670](https://jira.mongodb.org/browse/WT-6670)修复未初始化的缓冲区
- [WT-6671](https://jira.mongodb.org/browse/WT-6671)在元数据中保存用于获取检查点的检查点快照
- [WT-6674](https://jira.mongodb.org/browse/WT-6674)删除异步API代码和文档
- [WT-6675](https://jira.mongodb.org/browse/WT-6675)删除WiredTiger Java语言API和文档
- [WT-6680](https://jira.mongodb.org/browse/WT-6680)暂时停用历史记录商店验证
- [WT-6683](https://jira.mongodb.org/browse/WT-6683)修复逻辑死机代码
- [WT-6685](https://jira.mongodb.org/browse/WT-6685)将导入配置选项添加到WT_SESSION::create
- [WT-6689](https://jira.mongodb.org/browse/WT-6689)在提供导出的配置时添加对文件导入的支持
- [WT-6690](https://jira.mongodb.org/browse/WT-6690)在提供导出配置时添加对表导入的支持
- [WT-6691](https://jira.mongodb.org/browse/WT-6691)添加文件导入维修功能
- [WT-6692](https://jira.mongodb.org/browse/WT-6692)处理导入的时间戳比当前DB的时间戳更新的场景
- [WT-6708](https://jira.mongodb.org/browse/WT-6708)在汇总时间窗口中将最古老的开始txn重新用于最新的txn
- [WT-6712](https://jira.mongodb.org/browse/WT-6712)当未设置稳定时间戳时，允许RTS运行
- [WT-6720](https://jira.mongodb.org/browse/WT-6720)添加新的hs open()和close()方法
- [WT-6725](https://jira.mongodb.org/browse/WT-6725)跳过检查从磁盘恢复的更新的可见性
- [WT-6731](https://jira.mongodb.org/browse/WT-6731)防止WT_RESTART返回到API调用
- [WT-6732](https://jira.mongodb.org/browse/WT-6732)修复Evergreen任务日志中的任务后命令噪音
- [WT-6734](https://jira.mongodb.org/browse/WT-6734)向Swig Java界面添加缺失的牙套
- [WT-6736](https://jira.mongodb.org/browse/WT-6736)添加统计数据，与检查站并行跟踪驱逐
- [WT-6741](https://jira.mongodb.org/browse/WT-6741)在导入时添加对受支持数据源的检查
- [WT-6746](https://jira.mongodb.org/browse/WT-6746)在检查点期间将基本写入生成保存在元数据中
- [WT-6756](https://jira.mongodb.org/browse/WT-6756)重新排列最高级别的文档
- [WT-6761](https://jira.mongodb.org/browse/WT-6761)忽略test_rollback_to_stable10的stdout
- [WT-6762](https://jira.mongodb.org/browse/WT-6762)使用统计数据而不是文件来检查消耗量
- [WT-6763](https://jira.mongodb.org/browse/WT-6763)修复插入到更新链后插入失败时链条上的释放更新
- [WT-6764](https://jira.mongodb.org/browse/WT-6764)在时间戳中止测试中发布检查点信息之前，等待稳定的时间戳移动
- [WT-6765](https://jira.mongodb.org/browse/WT-6765)添加更多调试和更早地检测丢失的文件
- [WT-6767](https://jira.mongodb.org/browse/WT-6767)添加新的读取时间戳配置，使其设置为比最古老的时间戳更早
- [WT-6783](https://jira.mongodb.org/browse/WT-6783)为表格生成唯一的密钥，以确保日志记录
- [WT-6792](https://jira.mongodb.org/browse/WT-6792)更新兼容性测试，以测试mongodb-5.0分支
- [WT-6793](https://jira.mongodb.org/browse/WT-6793)组织代码统计常青任务
- [WT-6797](https://jira.mongodb.org/browse/WT-6797)确保短路前的条目最小
- [WT-6798](https://jira.mongodb.org/browse/WT-6798)利用手臂LSE原子和正确的强度屏障
- [WT-6806](https://jira.mongodb.org/browse/WT-6806)在random_directio中退后退侵略性流产
- [WT-6808](https://jira.mongodb.org/browse/WT-6808)文档：添加顶级架构图片
- [WT-6809](https://jira.mongodb.org/browse/WT-6809)通过更早移动hs光标缓存来避免死锁
- [WT-6811](https://jira.mongodb.org/browse/WT-6811)允许年长的读者在混合模式操作背后阅读
- [WT-6812](https://jira.mongodb.org/browse/WT-6812)修复“乱序修复”可能损坏历史价值
- [WT-6813](https://jira.mongodb.org/browse/WT-6813)修复schema_create中的内存泄漏
- [WT-6822](https://jira.mongodb.org/browse/WT-6822)所有测试使用正确的python，并为分裂应力测试设置env
- [WT-6827](https://jira.mongodb.org/browse/WT-6827)按顺序运行scons检查示例，而不是并行



## 4.4.1 更改日志

### 安全

- [服务器-47733](https://jira.mongodb.org/browse/SERVER-47733)SymmetricEncryptorWindows在调用更新时不应填充
- [服务器-49339](https://jira.mongodb.org/browse/SERVER-49339)将ocspValidationRefreshPeriodSecs重命名为ocspStaplingRefreshPeriodSecs
- [服务器-49383](https://jira.mongodb.org/browse/SERVER-49383)断言OCSP响应器中存在主机标头

### 分片

- [服务器-43938](https://jira.mongodb.org/browse/SERVER-43938)让auth_sharding_cmd_metadata.js将碎片作为副本集开始
- [服务器-46811](https://jira.mongodb.org/browse/SERVER-46811)multi=true更新可以修改孤儿文档的分键，并导致它们被拥有
- [服务器-47753](https://jira.mongodb.org/browse/SERVER-47753)在stepdown并发套件中启用random_moveChunk_index_operations.js
- [服务器-47900](https://jira.mongodb.org/browse/SERVER-47900)禁用检查孤儿在4.4多版本测试中删除的助手
- [服务器-48066](https://jira.mongodb.org/browse/SERVER-48066)不允许更新碎片密钥并发性测试将碎片密钥更新到相同的值
- [服务器-48096](https://jira.mongodb.org/browse/SERVER-48096)jstests上的定期分段索引一致性检查器线程可能会导致意外的碎片刷新
- [服务器-48229](https://jira.mongodb.org/browse/SERVER-48229)在复制协调员之后关闭周期性共享索引一致性检查器，因此在作业停止后，没有线程会尝试暂停作业
- [服务器-48341](https://jira.mongodb.org/browse/SERVER-48341)在将SERVER-48307反向移植到4.4后，从SERVER-48307黑名单下的测试中删除require_fcv_46。
- [服务器-48365](https://jira.mongodb.org/browse/SERVER-48365)迁移管理器恢复应该处理一个精制的碎片密钥
- [服务器-48531](https://jira.mongodb.org/browse/SERVER-48531)分块器、准备的事务和降级线程之间可能会发生3种方式死锁。
- [服务器-48556](https://jira.mongodb.org/browse/SERVER-48556)random_moveChunk_broadcast_delete_transaction.js在等待范围删除任务完成时，应将降级错误视为可接受的moveChunk错误
- [服务器-48601](https://jira.mongodb.org/browse/SERVER-48601)ChunkSplitter应该对splitVector和splitChunk使用相同的块边界
- [服务器-48641](https://jira.mongodb.org/browse/SERVER-48641)由于迁移目的地经理等待对会话签出的书面关注而导致的死锁
- [服务器-48679](https://jira.mongodb.org/browse/SERVER-48679)flushRoutingTableCacheUpdates应该用kWrite而不是kRead阻止关键部分
- [服务器-48689](https://jira.mongodb.org/browse/SERVER-48689)MigrationDestinationManager等待线程加入并签出会话
- [服务器-48699](https://jira.mongodb.org/browse/SERVER-48699)在_configsvrMoveChunk命令启动之前，MaxTimeMS可能会在 range_deleter_interacts_correctly_with_refine_shard_key.js测试中过期
- [服务器-48929](https://jira.mongodb.org/browse/SERVER-48929)moveChunk助手需要忽略LockTimeout错误
- [服务器-49044](https://jira.mongodb.org/browse/SERVER-49044)让AsyncRequestSender不要使用startTransaction=true重试远程命令请求
- [服务器-49085](https://jira.mongodb.org/browse/SERVER-49085)添加MovePrimaryInProgress错误代码
- [服务器-49086](https://jira.mongodb.org/browse/SERVER-49086)插入、更新和删除命令时MovePrimaryInProgress错误失败
- [服务器-49087](https://jira.mongodb.org/browse/SERVER-49087)添加对测试MovePrimaryInProgress的支持
- [服务器-49088](https://jira.mongodb.org/browse/SERVER-49088)在findAndModify命令上使用MovePrimaryInProgress失败
- [服务器-49089](https://jira.mongodb.org/browse/SERVER-49089)在mapReduce命令上使用MovePrimaryInProgress失败
- [服务器-49091](https://jira.mongodb.org/browse/SERVER-49091)在create、collMod、drop和renameCollection命令中出现MovePrimaryInProgress错误失败
- [服务器-49092](https://jira.mongodb.org/browse/SERVER-49092)createIndexes和dropIndexes命令中的MovePrimaryInProgress错误失败
- [服务器-49311](https://jira.mongodb.org/browse/SERVER-49311)PeriodicShardedIndexConsistencyChecker可能会导致stale_mongos_and_restarted_shards_agree_on_shard_version.js上的故障
- [服务器-49433](https://jira.mongodb.org/browse/SERVER-49433)停止在块分割上增加集合主要版本
- [服务器-49452](https://jira.mongodb.org/browse/SERVER-49452)collMod命令中的MovePrimaryInProgress错误失败
- [服务器-49546](https://jira.mongodb.org/browse/SERVER-49546)将FCV设置为4.4应该批量插入范围删除任务，而不是一次插入一个
- [服务器-49699](https://jira.mongodb.org/browse/SERVER-49699)waitForCurOpByFailPoint不应该忽略4.4中的过滤器参数
- [服务器-49715](https://jira.mongodb.org/browse/SERVER-49715)在setFCV上找到未拥有范围时检查中断，以保持4.4
- [服务器-49734](https://jira.mongodb.org/browse/SERVER-49734)升级时对平衡器::initiateBalancer()的调用应该是异步的
- [服务器-49765](https://jira.mongodb.org/browse/SERVER-49765)MovePrimaryInProgress for dropIndexes命令失败
- [服务器-49809](https://jira.mongodb.org/browse/SERVER-49809)如果视图是在移动期间创建的，视图定义可能会丢失

### 复制

- [服务器-39621](https://jira.mongodb.org/browse/SERVER-39621)禁用的链条在主步骤下时强制同步源更改，即使oplog fetcher没有在同步源上被杀死
- [服务器-47263](https://jira.mongodb.org/browse/SERVER-47263)失败的模拟竞选时日志消息不准确
- [服务器-47612](https://jira.mongodb.org/browse/SERVER-47612)remove_newly_added_field_after_finishing_initial_sync.js中的选举不稳健
- [服务器-47645](https://jira.mongodb.org/browse/SERVER-47645)下台时必须使所有会话无效
- [服务器-47849](https://jira.mongodb.org/browse/SERVER-47849)为关机任务添加更多日志记录
- [服务器-48525](https://jira.mongodb.org/browse/SERVER-48525)禁止在准备好交易时删除config.transactions
- [服务器-48712](https://jira.mongodb.org/browse/SERVER-48712)在write_concern_after_stepdown.js中比赛
- [服务器-48776](https://jira.mongodb.org/browse/SERVER-48776)在重新配置法定人数检查期间删除配置版本和术语检查
- [服务器-48967](https://jira.mongodb.org/browse/SERVER-48967)防止在次调的空命名空间上复制写入
- [服务器-48975](https://jira.mongodb.org/browse/SERVER-48975)增加是自我记录冗短语
- [服务器-48979](https://jira.mongodb.org/browse/SERVER-48979)在change_stream_stepdown.js中配置传播和选举之间的竞争
- [服务器-49676](https://jira.mongodb.org/browse/SERVER-49676)覆盖率分析缺陷115809：单硝化标量场
- [服务器-49683](https://jira.mongodb.org/browse/SERVER-49683)catchup_takeover_two_nodes_ahead.js应该使用indateWithHighElectionTimeout()来防止虚假的选举
- [服务器-49924](https://jira.mongodb.org/browse/SERVER-49924)前端口SERVER-49527到主分支
- [服务器-49990](https://jira.mongodb.org/browse/SERVER-49990)别名setSlaveOk()和getSlaveOk() shell助手
- [服务器-49991](https://jira.mongodb.org/browse/SERVER-49991)别名printSlaveReplicationInfo（）shell助手
- [服务器-50039](https://jira.mongodb.org/browse/SERVER-50039)dbadmin.js测试中的计时错误
- [服务器-50063](https://jira.mongodb.org/browse/SERVER-50063)Oplog fetcher可以在关机时返回网络错误或CallbackCanceled
- [服务器-50140](https://jira.mongodb.org/browse/SERVER-50140)初始同步无法在同步源的不干净重新启动中幸存下来
- [服务器-50325](https://jira.mongodb.org/browse/SERVER-50325)在no_writes_to_config_transactions_with_prepared_transaction.js中允许额外的错误代码

### 查询

- [服务器-39392](https://jira.mongodb.org/browse/SERVER-39392)PlanStage::dispose中的不变总是被评估为true
- [服务器-48442](https://jira.mongodb.org/browse/SERVER-48442)修复change_streams.js以任何顺序测试事件
- [服务器-48950](https://jira.mongodb.org/browse/SERVER-48950)增强对$search的解释，以公开来自mongot的统计数据
- [服务器-48993](https://jira.mongodb.org/browse/SERVER-48993)explodeForSort可能会产生不正确的查询计划
- [服务器-49010](https://jira.mongodb.org/browse/SERVER-49010)在index_stepdown_after_init.js中增加日志详细度
- [服务器-49389](https://jira.mongodb.org/browse/SERVER-49389)索引构建初始化消息记录的频率高于预期
- [服务器-49514](https://jira.mongodb.org/browse/SERVER-49514)'index_abort_before_commit_signal.js'应该检查'IndexBuildAborted'错误代码
- [服务器-49530](https://jira.mongodb.org/browse/SERVER-49530)将操作日志恢复的最终索引构建阶段修复为独立模式

### 储存

- [服务器-48658](https://jira.mongodb.org/browse/SERVER-48658)TTL监视器不应在QueryPlanKilled的“E”级别进行记录
- [服务器-49415](https://jira.mongodb.org/browse/SERVER-49415)create_new_indexes_with_conflict.js由于不可靠的日志行检查而间歇性挂起
- [服务器-49521](https://jira.mongodb.org/browse/SERVER-49521)修复core/txn中的测试，将写入关注“多数”用于在开始事务之前运行的createIndexes命令
- [服务器-49556](https://jira.mongodb.org/browse/SERVER-49556)修复fsm_workloads/indexed_insert_base.js索引设置中的索引构建，以处理多文档事务
- [服务器-49949](https://jira.mongodb.org/browse/SERVER-49949)重建包含多键写入的准备事务会崩溃初始同步节点。
- [服务器-50137](https://jira.mongodb.org/browse/SERVER-50137)由于3.4中生成的oplog条目，MongoDB以不变故障崩溃

### 运营

- [服务器-45260](https://jira.mongodb.org/browse/SERVER-45260)shell_utils_launcher.cpp中的shell助手不应该使用验证（）
- [服务器-47697](https://jira.mongodb.org/browse/SERVER-47697)让logger:: typedefs到logv2::LogSeverity、logv2::LogComponent等
- [服务器-47698](https://jira.mongodb.org/browse/SERVER-47698)LogSeverity constexpr
- [服务器-47736](https://jira.mongodb.org/browse/SERVER-47736)将LogSeverityLimiter从logger/带到logv2/

### 构建和包装

- [服务器-45930](https://jira.mongodb.org/browse/SERVER-45930)使mongodb社区依赖于自制工具
- [服务器-47138](https://jira.mongodb.org/browse/SERVER-47138)MSI安装程序生成错误的配置文件
- [服务器-48041](https://jira.mongodb.org/browse/SERVER-48041)告诉冰淇淋消毒剂黑名单文件
- [服务器-48443](https://jira.mongodb.org/browse/SERVER-48443)GCC和ICECC 1.2+的编译错误
- [服务器-48885](https://jira.mongodb.org/browse/SERVER-48885)build.ninja生成的文件中的Pathsplit错误，其中包含包含空格的PATH组件
- [服务器-48966](https://jira.mongodb.org/browse/SERVER-48966)忍者生成器不会依赖模板输入
- [服务器-49036](https://jira.mongodb.org/browse/SERVER-49036)ninja生成的compile_commands.json是不完整的。
- [服务器-49395](https://jira.mongodb.org/browse/SERVER-49395)无法在本地运行单元测试套件（回归）
- [服务器-49466](https://jira.mongodb.org/browse/SERVER-49466)引入--build-tools=next标志来订阅--ninja=next
- [服务器-49493](https://jira.mongodb.org/browse/SERVER-49493)通过deps文件跟踪SCons文件进行再生
- [服务器-49932](https://jira.mongodb.org/browse/SERVER-49932)MSI构建过程通过进入构建目录的路径获取文件
- [服务器-50078](https://jira.mongodb.org/browse/SERVER-50078)当它不应该有时，编译旁路应用

### 内部人员

- [服务器-25548](https://jira.mongodb.org/browse/SERVER-25548)炮弹坠毁后，烟雾不应该继续
- [服务器-43490](https://jira.mongodb.org/browse/SERVER-43490)验证我们是否可以执行SERVER-38686中列出的TODO
- [服务器-46726](https://jira.mongodb.org/browse/SERVER-46726)提供单独的设置参数来禁用诊断工作
- [服务器-46842](https://jira.mongodb.org/browse/SERVER-46842)如果进程崩溃，resmoke.py不应该在降级套件中运行数据一致性检查
- [服务器-47518](https://jira.mongodb.org/browse/SERVER-47518)使用定义静态持续时间不朽物体的实用程序来缓解dtor订单的惨败
- [服务器-47598](https://jira.mongodb.org/browse/SERVER-47598)本地安装的mongodbtoolchains可能会影响远程冰淇淋的构建
- [服务器-47604](https://jira.mongodb.org/browse/SERVER-47604)如果索引构建因降级而在后台继续，请不要记录“索引构建失败”
- [服务器-47639](https://jira.mongodb.org/browse/SERVER-47639)使用异步获取主机请求和并发拓扑更改修复比赛
- [服务器-47775](https://jira.mongodb.org/browse/SERVER-47775)LOGV2_FATAL 未能打印堆栈跟踪
- [服务器-47892](https://jira.mongodb.org/browse/SERVER-47892)DiagnosticInfo for 闩锁与创建和破坏ServiceContexts的单元测试集成不完美
- [服务器-47933](https://jira.mongodb.org/browse/SERVER-47933)logv2：检测属性冲突
- [服务器-48048](https://jira.mongodb.org/browse/SERVER-48048)使用resmoke标签文件进行多版本黑名单
- [服务器-48107](https://jira.mongodb.org/browse/SERVER-48107)在rollback_test.js中重试replSetStepDown
- [服务器-48178](https://jira.mongodb.org/browse/SERVER-48178)在重新配置中查找自我可能会因回滚而关闭连接而中断
- [服务器-48204](https://jira.mongodb.org/browse/SERVER-48204)改进miror_reads.js中的断言
- [服务器-48339](https://jira.mongodb.org/browse/SERVER-48339)确保操作挂在 unionWith_current_op.js 的故障点上
- [服务器-48506](https://jira.mongodb.org/browse/SERVER-48506)当RSM截止日期小于最大值时，抛出MaxTimeMS过期，而不是FailedToSatisfyReadPreference
- [服务器-48572](https://jira.mongodb.org/browse/SERVER-48572)random_moveChunk_refine_collection_shard_key.js需要忽略moveChunk的LockTimeout错误
- [服务器-48709](https://jira.mongodb.org/browse/SERVER-48709)配置服务器上的签名密钥生成器线程没有按预期唤醒
- [服务器-48901](https://jira.mongodb.org/browse/SERVER-48901)让客户端观察者销毁ClientOutOfLineExecutor
- [服务器-48952](https://jira.mongodb.org/browse/SERVER-48952)src/mongo/util/stacktrace_posix.cpp的logv2清理
- [服务器-48965](https://jira.mongodb.org/browse/SERVER-48965)让 update_and_bulk_insert.js 不那么重
- [服务器-48982](https://jira.mongodb.org/browse/SERVER-48982)响应心跳，直到在StepdownShouldInterruptConfigWrite中重新配置线程完成
- [服务器-49007](https://jira.mongodb.org/browse/SERVER-49007)mock_http_server.py中指标响应中的往返注册ID
- [服务器-49016](https://jira.mongodb.org/browse/SERVER-49016)Ninja构建报告“没有这样的文件：/proc/cpuinfo”
- [服务器-49026](https://jira.mongodb.org/browse/SERVER-49026)pseudo_commands.js可以错误地使用opId '1234'杀死操作
- [服务器-49054](https://jira.mongodb.org/browse/SERVER-49054)服务器MSI应该安装指南针而不是指南针社区
- [服务器-49090](https://jira.mongodb.org/browse/SERVER-49090)聚合命令中的MovePrimaryInProgress错误失败
- [服务器-49097](https://jira.mongodb.org/browse/SERVER-49097)sys-perf构建不同于发布版本构建
- [服务器-49126](https://jira.mongodb.org/browse/SERVER-49126)允许NetworkInterfaceIntegrationTest成为内部客户端
- [服务器-49335](https://jira.mongodb.org/browse/SERVER-49335)publish_packages应该使用barque API密钥
- [服务器-49404](https://jira.mongodb.org/browse/SERVER-49404)在$arrayToObject中执行额外的检查
- [服务器-49417](https://jira.mongodb.org/browse/SERVER-49417)sessionId在“接受连接”服务器日志中使用
- [服务器-49432](https://jira.mongodb.org/browse/SERVER-49432)在ServiceExecutorSync关机中避免删除后读取
- [服务器-49438](https://jira.mongodb.org/browse/SERVER-49438)允许mory.js测试接受$where超时中断
- [服务器-49457](https://jira.mongodb.org/browse/SERVER-49457)Ninja mongod构建失败，重复符号链接器错误
- [服务器-49476](https://jira.mongodb.org/browse/SERVER-49476)在Ubuntu 18.04和20.04上禁用ldap_authz_bind
- [服务器-49523](https://jira.mongodb.org/browse/SERVER-49523)如果主服务器看不到大多数副本集，'commit_quorum_does_not_hang_with_initial_sync.js'可能会失败
- [服务器-49690](https://jira.mongodb.org/browse/SERVER-49690)搜索旧操作日志条目时重试“CappedPositionLost”
- [服务器-49693](https://jira.mongodb.org/browse/SERVER-49693)在浮点表示复制品SetPingTimeMillis
- [服务器-49694](https://jira.mongodb.org/browse/SERVER-49694)在分片集群上，最近的或对冲读取可能无法路由到近碎片的副本。
- [服务器-49704](https://jira.mongodb.org/browse/SERVER-49704)txn_being_applied_to_secondary_cannot_be_killed.js不应该允许选举
- [服务器-49716](https://jira.mongodb.org/browse/SERVER-49716)"gather_failed_unittests"不适用于ubuntu1804-build
- [服务器-49922](https://jira.mongodb.org/browse/SERVER-49922)减轻schema_validator_with_expr_variables.js的重
- [服务器-49933](https://jira.mongodb.org/browse/SERVER-49933)将雪松身份验证信息放入sys-perf任务中
- [服务器-50170](https://jira.mongodb.org/browse/SERVER-50170)修复mongos上的服务器选择失败
- [服务器-50173](https://jira.mongodb.org/browse/SERVER-50173)[v4.4]从测试套件sharding_multiversion的后端口列表中删除explode_for_sort_collation.js
- [服务器-50178](https://jira.mongodb.org/browse/SERVER-50178)将日志记录添加到initial_sync_nodes_maintain_and_gossip_commit_point.js
- [服务器-50183](https://jira.mongodb.org/browse/SERVER-50183)Copy _awaitPrimaryAppliedSurpassesRollbackApplied函数从RollbackTest复制到RollbackTestDeluxe
- [服务器-50216](https://jira.mongodb.org/browse/SERVER-50216)调整sys-perf频率
- [服务器-50290](https://jira.mongodb.org/browse/SERVER-50290)对任务分割实施更严格的限制
- [服务器-50308](https://jira.mongodb.org/browse/SERVER-50308)清理失败的光标建立时调整调试日志消息
- [服务器-50352](https://jira.mongodb.org/browse/SERVER-50352)添加对多版本排除之前语法的理解
- [服务器-50362](https://jira.mongodb.org/browse/SERVER-50362)为多版本标签生成添加重复执行的弹性
- [WT-5571](https://jira.mongodb.org/browse/WT-5571)Evergreen丢失了编译器警告，需要添加到CFLAGS的方法
- [WT-5717](https://jira.mongodb.org/browse/WT-5717)可重启用历史商店打捞测试
- [WT-5945](https://jira.mongodb.org/browse/WT-5945)为test_wt2853_perf启用更严格的性能
- [WT-5970](https://jira.mongodb.org/browse/WT-5970)更新test_wt4333_handle_locks以使用1GB缓存大小
- [WT-6215](https://jira.mongodb.org/browse/WT-6215)清除有关重命名的备份块信息：已恢复
- [WT-6233](https://jira.mongodb.org/browse/WT-6233)添加统计数据，以跟踪由于插入0个盖销条目而从历史记录商店中删除密钥的次数
- [WT-6274](https://jira.mongodb.org/browse/WT-6274)SESSIONs不应该嵌套调用以获取/释放hs光标
- [WT-6325](https://jira.mongodb.org/browse/WT-6325)快速截断可能导致从未解决准备操作
- [WT-6331](https://jira.mongodb.org/browse/WT-6331)在WiredTiger启动时设置最古老的时间戳
- [WT-6421](https://jira.mongodb.org/browse/WT-6421)避免解析干净文件的元数据检查点
- [WT-6425](https://jira.mongodb.org/browse/WT-6425)关闭日志归档以避免文件复制竞赛
- [WT-6440](https://jira.mongodb.org/browse/WT-6440)在__wt_txn_update_check中使用页面可见性检查帮助
- [WT-6466](https://jira.mongodb.org/browse/WT-6466)当HS光标关闭时，不要重置WT_SESSION计时器
- [WT-6468](https://jira.mongodb.org/browse/WT-6468)丢弃被检查站清理的已删除页面
- [WT-6473](https://jira.mongodb.org/browse/WT-6473)带有微小缓存的格式配置可能导致空对象
- [WT-6474](https://jira.mongodb.org/browse/WT-6474)在进行任何命令行或配置文件处理之前，配置全局RNG
- [WT-6479](https://jira.mongodb.org/browse/WT-6479)在历史记录存储的第一次全局可见更新后，请勿插入更新
- [WT-6492](https://jira.mongodb.org/browse/WT-6492)使用WT_UPDATE_RESTORED_FROM_DS确定页面值是否在更新链上
- [WT-6493](https://jira.mongodb.org/browse/WT-6493)如果同时修改准备好的更新，请重试处理更新列表
- [WT-6499](https://jira.mongodb.org/browse/WT-6499)忽略主导缓存使用的树的驱逐优先级
- [WT-6511](https://jira.mongodb.org/browse/WT-6511)光标连接：在完成子句时显式推进迭代器
- [WT-6514](https://jira.mongodb.org/browse/WT-6514)修复文档中eviction_updates_trigger的描述
- [WT-6517](https://jira.mongodb.org/browse/WT-6517)更新test_txn13，以避免回滚错误
- [WT-6519](https://jira.mongodb.org/browse/WT-6519)在兼容性测试中添加mongodb-4.6分支的测试范围
- [WT-6527](https://jira.mongodb.org/browse/WT-6527)当无法分配线程时，请从WT API干净地返回
- [WT-6528](https://jira.mongodb.org/browse/WT-6528)删除WiredTiger API和源代码中的冒犯性术语
- [WT-6539](https://jira.mongodb.org/browse/WT-6539)修复备份和重命名内存泄漏
- [WT-6543](https://jira.mongodb.org/browse/WT-6543)区分测试任务的重启之间的常青工件链接
- [WT-6551](https://jira.mongodb.org/browse/WT-6551)避免在日志预分配测试开始时出现时间问题
- [WT-6552](https://jira.mongodb.org/browse/WT-6552)修复在常青.yml中为未通过PPC测试配置标志的问题
- [WT-6578](https://jira.mongodb.org/browse/WT-6578)防止对账忽略磁盘价值
- [WT-6611](https://jira.mongodb.org/browse/WT-6611)恢复增强功能，允许重命名和增量备份
- [WT-6623](https://jira.mongodb.org/browse/WT-6623)在恢复文件扫描中设置连接级别文件ID



原文 - [4.4 Changelog]( https://docs.mongodb.com/manual/release-notes/4.4-changelog/ )

