# 5.1 更改日志

## 5.1.1 更改日志

### 分片

- [服务器-51329](https://jira.mongodb.org/browse/SERVER-51329)关闭mongos服务器时意外不可重试错误
- [服务器-55382](https://jira.mongodb.org/browse/SERVER-55382)忽略可重试写入转换为事务的错误，以及该事务在random_moveChunk_update_shard_key.js中失败的错误
- [服务器-57686](https://jira.mongodb.org/browse/SERVER-57686)我们需要测试覆盖，在选举面前进行分片
- [服务器-58343](https://jira.mongodb.org/browse/SERVER-58343)Re-enable reshard_collection_failover_shutdown_basic.js
- [服务器-59719](https://jira.mongodb.org/browse/SERVER-59719)shardsvr{Commit, Abort}ReshardCollection可能会在降级时返回无法恢复的错误，导致配置服务器上的fassert()
- [服务器-59806](https://jira.mongodb.org/browse/SERVER-59806)碎片收集的优化路径在大量块的情况下无法成功
- [服务器-60730](https://jira.mongodb.org/browse/SERVER-60730)shardsvrDrop数据库应始终加入现有协调员
- [服务器-60751](https://jira.mongodb.org/browse/SERVER-60751)move_chunk_critical_section_non_internal_client_abort.js不考虑配置服务器降级
- [服务器-60945](https://jira.mongodb.org/browse/SERVER-60945)增加resharding_large_number_of_initial_chunks.js的分片关键部分超时值
- [服务器-61027](https://jira.mongodb.org/browse/SERVER-61027)港口许可证 移民变更
- [服务器-61186](https://jira.mongodb.org/browse/SERVER-61186)删除ReshardingTest夹具的isMixedVersionCluster()方法
- [服务器-61289](https://jira.mongodb.org/browse/SERVER-61289)使resharding_retryable_writes.js更稳健地计时
- [服务器-61473](https://jira.mongodb.org/browse/SERVER-61473)分页协调员多次调用ReshardingMetrics::onCompletion()进行瞬态错误，导致配置服务器崩溃
- [服务器-61482](https://jira.mongodb.org/browse/SERVER-61482)config.reshardingOperations的更新等待在持有oplog插槽时重建PrimaryOnlyService，无限期地停止在配置服务器上的复制
- [服务器-61483](https://jira.mongodb.org/browse/SERVER-61483)分片协调员未能恢复中止的升级决定，试图将操作视为成功，导致数据不一致
- [服务器-61607](https://jira.mongodb.org/browse/SERVER-61607)在resharding_nonblocking_coordinator_rebuild.js中接受DuplicateKey作为可能的错误
- [服务器-61633](https://jira.mongodb.org/browse/SERVER-61633)Resharding的RecipientStateMachine不会加入ReshardingOplogFetcher的线程池，导致服务器在关机时崩溃

### 复制

- [服务器-54909](https://jira.mongodb.org/browse/SERVER-54909)在replSetGetStatus中，报告所有成员的最后一次耐用和最后一次应用操作墙时间
- [服务器-59721](https://jira.mongodb.org/browse/SERVER-59721)执行回滚到稳定时间戳后，节点可能无法与其他成员同步
- [服务器-60946](https://jira.mongodb.org/browse/SERVER-60946)当具有不同优先级的节点启动replset时，replsetprio1.js中的竞争条件
- [服务器-60969](https://jira.mongodb.org/browse/SERVER-60969)ReplClientInfo::getLastOp在用于等待租户迁移中的复制之前可能不会更新
- [服务器-61440](https://jira.mongodb.org/browse/SERVER-61440)种族 in tenant_migration_recipient_current_op.js

### 集合

[服务器-59924](https://jira.mongodb.org/browse/SERVER-59924)在分片集群上使用“可用”读取关注点执行聚合时出错

### 储存

[服务器-58736](https://jira.mongodb.org/browse/SERVER-58736)避免在许多集合的回滚中出现二次行为

### 内部人员

- [服务器-55535](https://jira.mongodb.org/browse/SERVER-55535)性能测试以进行更改流优化
- [服务器-59297](https://jira.mongodb.org/browse/SERVER-59297)允许系统线程在InterruptedDueToStorageChange中幸存下来
- [服务器-59871](https://jira.mongodb.org/browse/SERVER-59871)startup_recovery_for_restore_restarts.js需要确保在故障点后发生检查点
- [服务器-60393](https://jira.mongodb.org/browse/SERVER-60393)将replica_sets_jscore_passthrough时间限制提高到3小时。
- [服务器-60567](https://jira.mongodb.org/browse/SERVER-60567)修复SBE命令对集合UUID的处理
- [服务器-60616](https://jira.mongodb.org/browse/SERVER-60616)覆盖率分析缺陷120880：未签名与0的比较
- [服务器-60632](https://jira.mongodb.org/browse/SERVER-60632)当重命名收集目标已经存在时，mongos上的错误不一致
- [服务器-60671](https://jira.mongodb.org/browse/SERVER-60671)移除匕首
- [服务器-60729](https://jira.mongodb.org/browse/SERVER-60729)在 initiate_takes_stable_checkpoint.js 中显式提升第一个节点
- [服务器-60756](https://jira.mongodb.org/browse/SERVER-60756)在multi_statement_transaction_atomicity_isolation.js中添加失败更新的其他日志记录
- [服务器-61021](https://jira.mongodb.org/browse/SERVER-61021)文档可能会在timeseries_delete.js中按顺序检索
- [服务器-61039](https://jira.mongodb.org/browse/SERVER-61039)分片时间序列列表索引应报告视图的命名空间
- [服务器-61164](https://jira.mongodb.org/browse/SERVER-61164)接受错误代码48（不适当的身份验证）作为LDAP活力检查的有效响应
- [服务器-61178](https://jira.mongodb.org/browse/SERVER-61178)在find_cmd_with_indexes_timeseries.js中使用较少的并发性
- [服务器-61208](https://jira.mongodb.org/browse/SERVER-61208)当平衡器不应该在 transactions_stale_shard_version_errors.js中运行时，它可能会运行
- [服务器-61238](https://jira.mongodb.org/browse/SERVER-61238)Resmoke hook的线程日志没有显示
- [服务器-61269](https://jira.mongodb.org/browse/SERVER-61269)将日志添加到awaitdata_getmore_cmd.js
- [服务器-61270](https://jira.mongodb.org/browse/SERVER-61270)覆盖率分析缺陷121083：宏比较无符号到0
- [服务器-61291](https://jira.mongodb.org/browse/SERVER-61291)修复与checkout_idl_files_from_past_releases.py的前向兼容性
- [服务器-61295](https://jira.mongodb.org/browse/SERVER-61295)SERVER-35721中列出的完整TODO
- [服务器-61296](https://jira.mongodb.org/browse/SERVER-61296)SERVER-26792中列出的完整待办事项
- [服务器-61304](https://jira.mongodb.org/browse/SERVER-61304)无法将 --use-system-{pcre,boost,...}与r5.1.0一起使用
- [服务器-61308](https://jira.mongodb.org/browse/SERVER-61308)CappedPosition如果在租户迁移期间隐藏的集合会丢失
- [服务器-61309](https://jira.mongodb.org/browse/SERVER-61309)修复时间序列存储桶锁重新获取逻辑
- [服务器-61353](https://jira.mongodb.org/browse/SERVER-61353)MongoDB 5.1.0显示开发版启动警告
- [服务器-61360](https://jira.mongodb.org/browse/SERVER-61360)减少Debian 9变体jlink以防止OOM案例
- [服务器-61405](https://jira.mongodb.org/browse/SERVER-61405)考虑从$$SEARCH_META中删除FCV支票
- [服务器-61489](https://jira.mongodb.org/browse/SERVER-61489)恢复executor_with_mock_net_stress_test测试
- [服务器-61496](https://jira.mongodb.org/browse/SERVER-61496)[SBE] buildSortMerge()不考虑嵌套的MERGE_SORT阶段
- [服务器-61532](https://jira.mongodb.org/browse/SERVER-61532)需要揭露检测违禁行为的交易对手。
- [服务器-61597](https://jira.mongodb.org/browse/SERVER-61597)使用确定性顺序进行random_moveChunk_timeseries_inserts.js



原文：[Changelog](https://www.mongodb.com/docs/upcoming/release-notes/5.1-changelog/)