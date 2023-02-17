# 4.0更改日志

### 4.0.28 更改日志

### 安全

[服务器-57727](https://jira.mongodb.org/browse/SERVER-57727)x509_invalid.js中的比赛条件

### 分片

- [服务器-53335](https://jira.mongodb.org/browse/SERVER-53335)使用非“简单”整理的查询、更新和删除在使用散列分片时可能会丢失文档
- [服务器-54064](https://jira.mongodb.org/browse/SERVER-54064)关于仲裁员的会议累积起来，无法清除
- [服务器-55648](https://jira.mongodb.org/browse/SERVER-55648)Mongos在关机的情况下不会返回顶级批处理写错误
- [服务器-59929](https://jira.mongodb.org/browse/SERVER-59929)意外的慢速更新/插入拆分块和移动Chunk的操作基础
- [服务器-60654](https://jira.mongodb.org/browse/SERVER-60654)将autoSplitVector逻辑反向移植到v4.0
- [服务器-62065](https://jira.mongodb.org/browse/SERVER-62065)从3.6升级到4.0的路径可以在碎片上留下没有历史记录的大块条目

### 复制

[服务器-56096](https://jira.mongodb.org/browse/SERVER-56096)ReplicationRecoveryImpl::recoverFromOplog中的不变故障

### 集合

* [服务器-44484](https://jira.mongodb.org/browse/SERVER-44484)带有更新的更改流查看集合被分片之前更新的uisues

- [服务器-59613](https://jira.mongodb.org/browse/SERVER-59613)如果超过内存限制，$range表达式应该返回错误

### 储存

[服务器-45953](https://jira.mongodb.org/browse/SERVER-45953)豁免oplog读者获得阅读门票

### 内部人员

- [服务器-40486](https://jira.mongodb.org/browse/SERVER-40486)删除测试生命周期代码
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-56326](https://jira.mongodb.org/browse/SERVER-56326)将 round() 方法添加到 Decimal128 类中
- [服务器-58104](https://jira.mongodb.org/browse/SERVER-58104)如果使用_id以外的碎片键丢弃并重新分片，config.system.sessions集合最终可能会出现无效的块
- [服务器-58192](https://jira.mongodb.org/browse/SERVER-58192)在QueryPlannerAnalysis::analyzeSort()中使用更多unique_ptrs
- [服务器-59120](https://jira.mongodb.org/browse/SERVER-59120)为commitChunksMerge创建单元测试
- [服务器-59191](https://jira.mongodb.org/browse/SERVER-59191)SPIKE：git.get_project无法克隆
- [服务器-59725](https://jira.mongodb.org/browse/SERVER-59725)从额外的RHEL 6.2变体中删除推送任务
- [服务器-59804](https://jira.mongodb.org/browse/SERVER-59804)在system_perf.yml中使用单独的YCSB分支
- [服务器-59874](https://jira.mongodb.org/browse/SERVER-59874)删除4.0分支上的stats.js。
- [服务器-59887](https://jira.mongodb.org/browse/SERVER-59887)减少change_stream_shard_failover.js测试片度
- [服务器-60290](https://jira.mongodb.org/browse/SERVER-60290)更新Windows外部身份验证测试分发
- [服务器-60344](https://jira.mongodb.org/browse/SERVER-60344)滞后设置FCV副本破坏测试的行动计划
- [服务器-60588](https://jira.mongodb.org/browse/SERVER-60588)$multiply在某些情况下在经典引擎中错误地抛出错误
- [服务器-60670](https://jira.mongodb.org/browse/SERVER-60670)使用单独的分支而不是TPCC的特定提交
- [服务器-60671](https://jira.mongodb.org/browse/SERVER-60671)移除匕首
- [服务器-60934](https://jira.mongodb.org/browse/SERVER-60934)在测试change_stream_shard_failover.js中增加RSM的冗大度
- [服务器-60961](https://jira.mongodb.org/browse/SERVER-60961)向不生成multiversion_exclude_tags.yml的旧分支添加排除标签
- [服务器-60971](https://jira.mongodb.org/browse/SERVER-60971)删除对BF建议服务的来电
- [服务器-61152](https://jira.mongodb.org/browse/SERVER-61152)修复4.0分支上的绒毛
- [服务器-61530](https://jira.mongodb.org/browse/SERVER-61530)在4.0上的SSL Amazon Linux上为拆分任务提供大型发行版选项
- [服务器-61559](https://jira.mongodb.org/browse/SERVER-61559)从4.0分支中删除jepsen_register_linearizableRead。
- [服务器-61791](https://jira.mongodb.org/browse/SERVER-61791)Pin pymongo
- [服务器-62164](https://jira.mongodb.org/browse/SERVER-62164)删除所有稳定分支上的几个过时的构建变体
- [WT-6568](https://jira.mongodb.org/browse/WT-6568)修复拆分生成的使用
- [WT-6926](https://jira.mongodb.org/browse/WT-6926)更新WiredTiger源代码以包含2021年版权声明
- [WT-7065](https://jira.mongodb.org/browse/WT-7065)将WT_DHANDLE_DEAD的检查添加到断言中
- [WT-7135](https://jira.mongodb.org/browse/WT-7135)编写损坏的元数据时要检测的额外检查
- [WT-7437](https://jira.mongodb.org/browse/WT-7437)将文档升级到doxygen 1.8.17
- [WT-7871](https://jira.mongodb.org/browse/WT-7871)删除不再正确的注释
- [WT-7874](https://jira.mongodb.org/browse/WT-7874)删除另外两个陈旧的评论



## 4.0.27 更改日志[![img](https://www.mongodb.com/docs/upcoming/assets/link.svg)](https://www.mongodb.com/docs/upcoming/release-notes/4.0-changelog/#4.0.27-changelog)

### 分片

[服务器-40170](https://jira.mongodb.org/browse/SERVER-40170)增加通过NetworkTestEnv::launchAsync安排工作的单元测试的默认超时

### 复制

- [服务器-34938](https://jira.mongodb.org/browse/SERVER-34938)由于单个oplog批次将内容固定在缓存中，导致二次减速或挂起
- [服务器-36263](https://jira.mongodb.org/browse/SERVER-36263)在applyOps中绕过操作验证应该需要特殊特权

### 查询

[服务器-58127](https://jira.mongodb.org/browse/SERVER-58127)修复benchRun()内存泄漏，以便在异常下解析benchRun() args

### 储存

[服务器-40712](https://jira.mongodb.org/browse/SERVER-40712)澄清db.dropDatabase和dropDatabase命令的行为

### 构建和包装

[服务器-54729](https://jira.mongodb.org/browse/SERVER-54729)MongoDB Enterprise Debian/Ubuntu软件包应依赖于libsasl2-modules和libsasl2-modules-gssapi-mit

### 内部人员

- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-55649](https://jira.mongodb.org/browse/SERVER-55649)为非分片集群记录的分片消息
- [服务器-56516](https://jira.mongodb.org/browse/SERVER-56516)修复$slice投影运算符解析代码中的未定义行为
- [服务器-57642](https://jira.mongodb.org/browse/SERVER-57642)src/mongo/db/query/plan_yield_policy.cpp 75上的不变故障 | 中止
- [服务器-57798](https://jira.mongodb.org/browse/SERVER-57798)当由于使用./install_compass的连接问题而无法安装MongoDB指南针时，请引导用户访问MongoDB指南针下载页面
- [服务器-57983](https://jira.mongodb.org/browse/SERVER-57983)经典引擎中$range的整数溢出
- [服务器-58283](https://jira.mongodb.org/browse/SERVER-58283)添加一个新的版本文件来设置MONGO_VERSION和MONGO_GIT_HASH
- [服务器-58402](https://jira.mongodb.org/browse/SERVER-58402)在 shutdown_primary.js 中增加关机命令的超时
- [服务器-59055](https://jira.mongodb.org/browse/SERVER-59055)Pin oauthlib == 4.0分支中的3.1.0
- [服务器-59074](https://jira.mongodb.org/browse/SERVER-59074)不要仅仅为了设置/等待oplog可见性而获取存储票据
- [服务器-59197](https://jira.mongodb.org/browse/SERVER-59197)当相应的会话文档被删除时，删除fam图像条目
- [服务器-59242](https://jira.mongodb.org/browse/SERVER-59242)更新到snmp 5.9.1
- [服务器-59262](https://jira.mongodb.org/browse/SERVER-59262)从storeFindAndModifyImagesInSideCollection构建变体中删除burn_in_tests任务
- [服务器-59414](https://jira.mongodb.org/browse/SERVER-59414)在旧分支的Powercycle中重试策展人设置
- [服务器-59504](https://jira.mongodb.org/browse/SERVER-59504)修复v4.0上network_test_env.h中的格式



## 4.0.26 更改日志

### 安全

[服务器-56240](https://jira.mongodb.org/browse/SERVER-56240)打开密钥存储数据存储的检查点

### 分片

- [服务器-48648](https://jira.mongodb.org/browse/SERVER-48648)在_configsvrCommitChunkMerge中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-48653](https://jira.mongodb.org/browse/SERVER-48653)在_configsvrCommitChunkSplit中返回更新的ShardVersion，以避免盲元数据刷新
- [服务器-56654](https://jira.mongodb.org/browse/SERVER-56654)不要将集合分布式锁用于块分割
- [服务器-56779](https://jira.mongodb.org/browse/SERVER-56779)不要将集合分布式锁用于块合并
- [服务器-56786](https://jira.mongodb.org/browse/SERVER-56786)mergeChunks路径上有三个路由信息刷新和两个块扫描
- [服务器-58109](https://jira.mongodb.org/browse/SERVER-58109)新的'_configsvrMergeChunks'路径比旧路径更贵

### 复制

- [服务器-44316](https://jira.mongodb.org/browse/SERVER-44316)在InitialSyncer中记录消息以开始应用时间戳不正确
- [服务器-55465](https://jira.mongodb.org/browse/SERVER-55465)在选举中，当当前初选投票请求失败时，修复不变问题，即迎头收购
- [服务器-56054](https://jira.mongodb.org/browse/SERVER-56054)将复制写入器线程池的minThreads值更改为0

### 查询

[服务器-58127](https://jira.mongodb.org/browse/SERVER-58127)修复benchRun()内存泄漏，以便在异常下解析benchRun() args

### 集合

[服务器-41741](https://jira.mongodb.org/browse/SERVER-41741)提高change_streams_shell_helper_resume_token.js的鲁棒性

### 构建和包装

- [服务器-50568](https://jira.mongodb.org/browse/SERVER-50568)平台支持：从5.0中删除Ubuntu18.04 zSeries
- [服务器-54729](https://jira.mongodb.org/browse/SERVER-54729)MongoDB Enterprise Debian/Ubuntu软件包应依赖于libsasl2-modules和libsasl2-modules-gssapi-mit

### 内部人员

- [服务器-40590](https://jira.mongodb.org/browse/SERVER-40590)删除KeyedExecutor
- [服务器-53643](https://jira.mongodb.org/browse/SERVER-53643)启动可以看到旧版本的功能兼容性版本文档
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-55119](https://jira.mongodb.org/browse/SERVER-55119)创建启动警告，表明不建议使用没有SAN的X.509证书
- [服务器-55649](https://jira.mongodb.org/browse/SERVER-55649)为非分片集群记录的分片消息
- [服务器-56307](https://jira.mongodb.org/browse/SERVER-56307)块迁移“收敛算法”非常原始
- [服务器-56452](https://jira.mongodb.org/browse/SERVER-56452)PooledLDAPConnection::setup的回调中的自锚
- [服务器-56501](https://jira.mongodb.org/browse/SERVER-56501)为旧操作代码（OP_QUERY、OP_INSERT等）添加操作计数器
- [服务器-56516](https://jira.mongodb.org/browse/SERVER-56516)修复$slice投影运算符解析代码中的未定义行为
- [服务器-57053](https://jira.mongodb.org/browse/SERVER-57053)用$not的$text重写$nor无效
- [服务器-57057](https://jira.mongodb.org/browse/SERVER-57057)减少mergeChunks路径上的路由信息刷新
- [服务器-57064](https://jira.mongodb.org/browse/SERVER-57064)在mongos上记录创建索引和dropIndex（es）
- [服务器-57145](https://jira.mongodb.org/browse/SERVER-57145)OCSPManager::requestStatus上的不变故障
- [服务器-57157](https://jira.mongodb.org/browse/SERVER-57157)assert serverStatus命令在getBinVersion() jstest helper中工作
- [服务器-57275](https://jira.mongodb.org/browse/SERVER-57275)更新kmip_server.py以更加冗长
- [服务器-57328](https://jira.mongodb.org/browse/SERVER-57328)使ReplsetTest.upgradeSet()容忍连任
- [服务器-57330](https://jira.mongodb.org/browse/SERVER-57330)更新perf和sys-perf的perf yaml配置以使用perf.send
- [服务器-57454](https://jira.mongodb.org/browse/SERVER-57454)块捐赠者将NotMaster错误从收件人传播回迁移管理器，使其相信捐赠者不是主要的
- [服务器-57497](https://jira.mongodb.org/browse/SERVER-57497)store_retryable_find_and_modify_images_in_side_collection.js应该在重试的findAndModify响应中考虑稍后的集群时间
- [服务器-57564](https://jira.mongodb.org/browse/SERVER-57564)将系统超时持续时间延长至>2小时，以便Fio复制所有文件
- [服务器-57691](https://jira.mongodb.org/browse/SERVER-57691)[仅限4.0]如果不是在WUOW中，请提前在TxnResources中返回
- [服务器-57798](https://jira.mongodb.org/browse/SERVER-57798)当由于使用./install_compass的连接问题而无法安装MongoDB指南针时，请引导用户访问MongoDB指南针下载页面
- [服务器-57897](https://jira.mongodb.org/browse/SERVER-57897)将readPrefMode选项添加到benchRun find/findOne ops
- [服务器-57954](https://jira.mongodb.org/browse/SERVER-57954)在sys-perf.yml中更新TPC-C版本
- [服务器-58118](https://jira.mongodb.org/browse/SERVER-58118)当RSM刷新所有主机时，Spammy日志记录
- [服务器-58191](https://jira.mongodb.org/browse/SERVER-58191)[迁移协议]允许delete_during_migrate.js容忍缓慢变体的追赶阶段超时导致的块迁移失败。
- [服务器-58248](https://jira.mongodb.org/browse/SERVER-58248)修复检查FeatureCompatibilityVersion是否由多数提交时的错误代码
- [服务器-58283](https://jira.mongodb.org/browse/SERVER-58283)添加一个新的版本文件来设置MONGO_VERSION和MONGO_GIT_HASH
- [服务器-58313](https://jira.mongodb.org/browse/SERVER-58313)修复服务器-55460后端口到v4.2和v4.0导致的软件包测试失败



## 4.0.25 更改日志

### 分片

- [服务器-40293](https://jira.mongodb.org/browse/SERVER-40293)change_stream.js删除测试应该对更改流进行无序检查
- [服务器-47699](https://jira.mongodb.org/browse/SERVER-47699)将范围删除器使用的收益类型从YIELD_MANUAL更改为YIELD_AUTO
- [服务器-56515](https://jira.mongodb.org/browse/SERVER-56515)块合并不考虑`incrementChunkMajorVersionOnChunkSplits`参数
- [服务器-57009](https://jira.mongodb.org/browse/SERVER-57009)在FCV更改期间发生崩溃时的额外调试信息
- [服务器-57055](https://jira.mongodb.org/browse/SERVER-57055)delete_during_migrate.js在启用了代码覆盖的测试套件中始终失败
- [服务器-57102](https://jira.mongodb.org/browse/SERVER-57102)修复ShardServerCatalogCacheLoader上的不变量，以考虑不同的术语

### 写入操作

[服务器-38909](https://jira.mongodb.org/browse/SERVER-38909)允许空更新修饰符，视为无操作而不是错误

### 构建和包装

- [服务器-54057](https://jira.mongodb.org/browse/SERVER-54057)Mongodb-org-server el8软件包依赖python2
- [服务器-54386](https://jira.mongodb.org/browse/SERVER-54386)如果systemctl守护进程无法运行，mongodb 3.6.22安装失败
- [服务器-55460](https://jira.mongodb.org/browse/SERVER-55460)修复SLES 12的RPM包装和测试

### 内部人员

- [服务器-37125](https://jira.mongodb.org/browse/SERVER-37125)如果进程参考已不复存在，Powercycle应忽略它
- [服务器-38811](https://jira.mongodb.org/browse/SERVER-38811)TCP_KEEPINTVL应该是1秒
- [服务器-43617](https://jira.mongodb.org/browse/SERVER-43617)在mongos上添加指标，以指示命令（查找、聚合等）的目标碎片数量
- [服务器-45153](https://jira.mongodb.org/browse/SERVER-45153)在FTDCFileManager中忽略指标临时文件
- [服务器-47509](https://jira.mongodb.org/browse/SERVER-47509)resmoke接受多个“mongodSetParameters”选项，但只使用最后一个选项
- [服务器-48636](https://jira.mongodb.org/browse/SERVER-48636)Increase assertEventDoesNotWakeCursor getMore timeout in only_wake_getmore_for_relevant_changes.js
- [服务器-48890](https://jira.mongodb.org/browse/SERVER-48890)允许带有空文档的$addFields，并使其不执行
- [服务器-51465](https://jira.mongodb.org/browse/SERVER-51465)指南针安装程序更新后更新软件包测试
- [服务器-52610](https://jira.mongodb.org/browse/SERVER-52610)验证安装前缀已添加到RPM的正确位置
- [服务器-52833](https://jira.mongodb.org/browse/SERVER-52833)复制恢复后，封装集合可能包含太多文档
- [服务器-53726](https://jira.mongodb.org/browse/SERVER-53726)平台支持：删除RHEL6 zSeries
- [服务器-53728](https://jira.mongodb.org/browse/SERVER-53728)平台支持：删除SLES12 zSeries
- [服务器-55019](https://jira.mongodb.org/browse/SERVER-55019)install_compass 并非在所有受支持的平台上运行
- [服务器-56164](https://jira.mongodb.org/browse/SERVER-56164)所有性能项目都使用主DSI分支
- [服务器-56217](https://jira.mongodb.org/browse/SERVER-56217)PoolForHost::_maxInUse为<int>::max，无法更改，当连接最大化时，DBConnectionPool::get()总是抛出
- [服务器-56361](https://jira.mongodb.org/browse/SERVER-56361)RSM更好的FTDC诊断，包括服务器端是Master处理
- [服务器-56371](https://jira.mongodb.org/browse/SERVER-56371)将时间lib升级到2021.06
- [服务器-56373](https://jira.mongodb.org/browse/SERVER-56373)[RRFaM]将FaM图像写入txn表时，使用`needsRetryImage`
- [服务器-56374](https://jira.mongodb.org/browse/SERVER-56374)[RRFaM]将更新路径写入config.image_collection
- [服务器-56375](https://jira.mongodb.org/browse/SERVER-56375)[RRFaM]将删除路径写入config.transactions
- [服务器-56376](https://jira.mongodb.org/browse/SERVER-56376)[RRFaM]添加jstest来练习两个可重试的FaM行为
- [服务器-56489](https://jira.mongodb.org/browse/SERVER-56489)带有随机hello服务器端延迟的新直通测试
- [服务器-56563](https://jira.mongodb.org/browse/SERVER-56563)[RRFaM]为块迁移伪造noop图像oplog条目
- [服务器-56668](https://jira.mongodb.org/browse/SERVER-56668)在主服务器上将FCV设置为4.0时创建config.image_collection
- [服务器-56713](https://jira.mongodb.org/browse/SERVER-56713)[RRFaM]避免在初始同步时创建图像
- [服务器-56795](https://jira.mongodb.org/browse/SERVER-56795)SERVER-53274的更改被无意中恢复
- [服务器-56819](https://jira.mongodb.org/browse/SERVER-56819)$indexOfCP在使用非零开始索引（仅限经典执行引擎）的空字符串中搜索空字符串时返回错误的结果
- [服务器-56854](https://jira.mongodb.org/browse/SERVER-56854)提供RSM请求超时并将服务器标记为失败的能力
- [服务器-57015](https://jira.mongodb.org/browse/SERVER-57015)[RRFaM]写入图像集合必须处于UnreplicatedWriteBlock中
- [服务器-57044](https://jira.mongodb.org/browse/SERVER-57044)[v4.0]添加jstest，即使storeFindAndModifyImagesInSideCollection=true，更改FCV将禁用新的可重试查找和Modify格式
- [服务器-57172](https://jira.mongodb.org/browse/SERVER-57172)在DSI post_run之前发送json.s
- [服务器-57173](https://jira.mongodb.org/browse/SERVER-57173)当次要者在minValid之前应用操作时，为可重试的findAndModify编写无效的图像
- [服务器-57356](https://jira.mongodb.org/browse/SERVER-57356)更好地记录失败的块迁移



## 4.0.24 更改日志

### 复制

- [服务器-49187](https://jira.mongodb.org/browse/SERVER-49187)使ReplSetTest .stepUp()对选举失败具有鲁棒性。
- [服务器-50049](https://jira.mongodb.org/browse/SERVER-50049)assert.soonNoExcept()不应访问TestData.traceExceptions进行非烟雾测试。
- [服务器-51163](https://jira.mongodb.org/browse/SERVER-51163)将返回InvalidReplicaSetConfig的节点标记为向下
- [服务器-53666](https://jira.mongodb.org/browse/SERVER-53666)curback测试夹具中的二级，不能保证重新启动后处于次要状态
- [服务器-54708](https://jira.mongodb.org/browse/SERVER-54708)如果 emrc=false 和 inMemory 时，回滚测试夹具仅确保同步源的 lastApplied > 回滚节点的 lastApplied

### 查询

- [服务器-36926](https://jira.mongodb.org/browse/SERVER-36926)光标管理器中签名溢出的未定义行为可能导致mongos不变故障
- [服务器-50073](https://jira.mongodb.org/browse/SERVER-50073)创建混合哈希/非哈希索引时的错误消息不会说明问题
- [服务器-54710](https://jira.mongodb.org/browse/SERVER-54710)大量$or子句可以创建超过最大BSON大小的剖析条目，导致查询在不应该失败时失败

### 运营

[服务器-54770](https://jira.mongodb.org/browse/SERVER-54770)将/proc/meminfo MemAvailable添加到FTDC

### 构建和包装

- [服务器-54031](https://jira.mongodb.org/browse/SERVER-54031)errorcodes.py没有检查Python脚本中的嵌入式C++代码
- [服务器-54255](https://jira.mongodb.org/browse/SERVER-54255)更新RHEL 7 AMI进行软件包测试

### 内部人员

- [服务器-5722](https://jira.mongodb.org/browse/SERVER-5722)支持JS基准线束的操作数组中的“排序”字段
- [服务器-35649](https://jira.mongodb.org/browse/SERVER-35649)由于自我失败而被移除的节点应该重新尝试找到自己
- [服务器-43847](https://jira.mongodb.org/browse/SERVER-43847)使ReplSetTest的stepUp功能能够抵御减速机器的速度
- [服务器-44132](https://jira.mongodb.org/browse/SERVER-44132)DataBuilder移动分配计算大小不正确
- [服务器-45836](https://jira.mongodb.org/browse/SERVER-45836)在默认日志级别提供更多LDAP详细信息（如服务器IP）
- [服务器-47030](https://jira.mongodb.org/browse/SERVER-47030)修复date_time_support代码，以免产生异常
- [服务器-48910](https://jira.mongodb.org/browse/SERVER-48910)不要将keystore.metadata视为<= 4.0上的密钥存储
- [服务器-52953](https://jira.mongodb.org/browse/SERVER-52953)当maxDistance设置为0时，$geoNear并不总是匹配给定的坐标
- [服务器-53566](https://jira.mongodb.org/browse/SERVER-53566)调查并复制“opCtx！= nullptr && _opCtx == nullptr" 不变
- [服务器-53612](https://jira.mongodb.org/browse/SERVER-53612)如果所有节点都赶上，但没有一个节点可以立即选择，StepDown将挂到超时
- [服务器-53831](https://jira.mongodb.org/browse/SERVER-53831)强迫SpiderMonkey在ReplSetTest.checkOplogs中收集垃圾
- [服务器-53992](https://jira.mongodb.org/browse/SERVER-53992)从性能任务中删除检测异常值的调用
- [服务器-54136](https://jira.mongodb.org/browse/SERVER-54136)使身份验证命令尊重强制执行用户Cluster分离
- [服务器-54139](https://jira.mongodb.org/browse/SERVER-54139)从HTTP curl客户端中删除CURL共享支持
- [服务器-55189](https://jira.mongodb.org/browse/SERVER-55189)在从rslib.js中的syncFrom()返回之前，请调用awaitReplication()
- [服务器-55395](https://jira.mongodb.org/browse/SERVER-55395)4.0.23不使用gcc 10构建
- [WT-4296](https://jira.mongodb.org/browse/WT-4296)为扫荡服务器添加攻击性模式
- [WT-4614](https://jira.mongodb.org/browse/WT-4614)桌子掉落后立即触发清扫以收回空间
- [WT-6309](https://jira.mongodb.org/browse/WT-6309)向wt printlog命令添加对开始/停止参数的支持
- [WT-6430](https://jira.mongodb.org/browse/WT-6430)将WT_CONN_SERVER标志移动到自己的字段中
- [WT-7026](https://jira.mongodb.org/browse/WT-7026)在比赛的情况下，通过原子读取和设置ref->addr
- [WT-7028](https://jira.mongodb.org/browse/WT-7028)在检查点收集手柄期间，扫描线程不应锁定
- [WT-7104](https://jira.mongodb.org/browse/WT-7104)从printlog输出编辑用户数据



## 4.0.23 更改日志

### 分片

- [服务器-50305](https://jira.mongodb.org/browse/SERVER-50305)ARS::next()不遵守OperationContext截止日期
- [服务器-53274](https://jira.mongodb.org/browse/SERVER-53274)在FCV升级到4.0时，将`history`字段强制写入所有块是不必要的

### 复制

- [服务器-52744](https://jira.mongodb.org/browse/SERVER-52744)rollback node's lastApplied > sync source's lastApplied in rollback_after_enabling_majority_reads.js
- [服务器-53345](https://jira.mongodb.org/browse/SERVER-53345)原谅arbiter_new_hostname.js来自多版本测试
- [服务器-53459](https://jira.mongodb.org/browse/SERVER-53459)rollback_all_op_types.js应确保同步源的lastApplied>回滚节点的lastApplied
- [服务器-53609](https://jira.mongodb.org/browse/SERVER-53609)lastCommittedTransaction部分导致频繁的模式更改，限制FTDC的保留

### 查询

- [服务器-40361](https://jira.mongodb.org/browse/SERVER-40361)减少计划缓存条目的内存占用
- [服务器-47869](https://jira.mongodb.org/browse/SERVER-47869)将诊断日志添加到ClusterCursorManager

### 储存

- [服务器-46876](https://jira.mongodb.org/browse/SERVER-46876)在驱逐压力期间，我们应该停止紧凑的操作，而不是破坏这个过程
- [服务器-52950](https://jira.mongodb.org/browse/SERVER-52950)recoverOplogAsStandalone模式不得启动oplog truncater线程

### 运营

[服务器-54074](https://jira.mongodb.org/browse/SERVER-54074)[v4.0] 记录表格日志设置更改的开始和结束

### 内部人员

- [服务器-43904](https://jira.mongodb.org/browse/SERVER-43904)下台阶时，上下行不会过滤掉冻结的节点
- [服务器-46686](https://jira.mongodb.org/browse/SERVER-46686)说明不尊重 maxTimeMS
- [服务器-46740](https://jira.mongodb.org/browse/SERVER-46740)establishCursors() 必须始终耗尽AsyncRequestsSender::_baton
- [服务器-52879](https://jira.mongodb.org/browse/SERVER-52879)由于关闭空闲缓存的WT会话，周期性操作延迟每5分钟飙升一次
- [服务器-53234](https://jira.mongodb.org/browse/SERVER-53234)当对测试数据库运行后台操作时，jstests/core/profile2.js失败
- [服务器-54091](https://jira.mongodb.org/browse/SERVER-54091)更新resmoke.py运行的dbhash检查的断言消息
- [服务器-54134](https://jira.mongodb.org/browse/SERVER-54134)在setup_multiversion_mongodb.py的旧分支上忽略较新的mongo版本



## 4.0.22 更改日志

### 分片

- [服务器-36739](https://jira.mongodb.org/browse/SERVER-36739)在并发降级套件中使用mongos_manual_intervention_action钩子
- [服务器-41192](https://jira.mongodb.org/browse/SERVER-41192)在“`logicalSessionRecordCache`
- [服务器-42632](https://jira.mongodb.org/browse/SERVER-42632)禁用伸手配置服务器以使集成测试通过的pinger线程
- [服务器-46393](https://jira.mongodb.org/browse/SERVER-46393)在计算操作时，请务必检查客户端上次操作时间以附加到响应
- [服务器-48679](https://jira.mongodb.org/browse/SERVER-48679)flushRoutingTableCacheUpdates应该用kWrite而不是kRead阻止关键部分
- [服务器-51808](https://jira.mongodb.org/browse/SERVER-51808)不变失败：阅读关注级别！=可用
- [服务器-51885](https://jira.mongodb.org/browse/SERVER-51885)Blacklist balancing_sessions_collection.js 来自 sharding_csrs_continuous_config_stepdown
- [服务器-52955](https://jira.mongodb.org/browse/SERVER-52955)KeysCollectionClientDirect应该检查存储引擎是否支持大多数读取问题

### 复制

- [服务器-33747](https://jira.mongodb.org/browse/SERVER-33747)如果重新启动后无法在配置中找到自己，仲裁员会尝试启动数据复制
- [服务器-50116](https://jira.mongodb.org/browse/SERVER-50116)启用复制时禁止oplog写入
- [服务器-51262](https://jira.mongodb.org/browse/SERVER-51262)将 skipCheckingForNotMasterInCommandDispatch 重命名为 skipCheckingForHelloInCommandDispatch
- [服务器-51598](https://jira.mongodb.org/browse/SERVER-51598)添加测试事务过期逻辑的新测试套件
- [服务器-51887](https://jira.mongodb.org/browse/SERVER-51887)4.0分支上oplog测试中的“无效名称空间”
- [服务器-52560](https://jira.mongodb.org/browse/SERVER-52560)oplog_writes_only_permitted_on_standalone.js必须等待插入进入稳定的检查点
- [服务器-52680](https://jira.mongodb.org/browse/SERVER-52680)删除了启动时在重新添加到副本集后卡在STARTUP2中的节点
- [服务器-53026](https://jira.mongodb.org/browse/SERVER-53026)次要无法重新启动复制

### 查询

[服务器-32960](https://jira.mongodb.org/browse/SERVER-32960)$mod的四舍五入/截断行为不一致

### 集合

[服务器-48523](https://jira.mongodb.org/browse/SERVER-48523)尝试恢复更改流时，无条件检查操作日志中的第一个条目

### 储存

- [服务器-51858](https://jira.mongodb.org/browse/SERVER-51858)在4.0.20上调查可查询的问题
- [服务器-52902](https://jira.mongodb.org/browse/SERVER-52902)删除断言！haveJournalFiles() 在dur_journal.cpp:265

### 运营s

- [服务器-46729](https://jira.mongodb.org/browse/SERVER-46729)为不可用的OCSP响应器制作Windows shell软故障
- [服务器-51757](https://jira.mongodb.org/browse/SERVER-51757)在FTDC中收集/proc/vmstat numa_pages_migrated统计数据

### 构建和包装

[服务器-52891](https://jira.mongodb.org/browse/SERVER-52891)运行PPC构建的频率较低

### 内部人员

- [服务器-45624](https://jira.mongodb.org/browse/SERVER-45624)预拆分和分发大块的会话集合
- [服务器-45992](https://jira.mongodb.org/browse/SERVER-45992)InMemory引擎启动警告令人困惑
- [服务器-48742](https://jira.mongodb.org/browse/SERVER-48742)每当通过setProfilingLevel更改分析器设置时进行记录
- [服务器-49165](https://jira.mongodb.org/browse/SERVER-49165)Client.Disconnect中的endSessions命令导致需要身份验证的主机上未经身份验证的连接的授权失败
- [服务器-50123](https://jira.mongodb.org/browse/SERVER-50123)所有平台上创纪录的物理内核数量
- [服务器-50267](https://jira.mongodb.org/browse/SERVER-50267)为'rawMongoProgramOutput()'设置输出限制
- [服务器-50365](https://jira.mongodb.org/browse/SERVER-50365)陷入无法超时的长期交易
- [服务器-50445](https://jira.mongodb.org/browse/SERVER-50445)当NumberLong减法在ExpressionSubtract中溢出时，将值作为双倍返回
- [服务器-50605](https://jira.mongodb.org/browse/SERVER-50605)添加{logMessage: "msg"}仅测试命令
- [服务器-51303](https://jira.mongodb.org/browse/SERVER-51303)查找阶段，然后在类型上使用错误字段的$match
- [服务器-51607](https://jira.mongodb.org/browse/SERVER-51607)将扭曲依赖项升级到至少扭曲-19.7.0
- [服务器-51902](https://jira.mongodb.org/browse/SERVER-51902)检查存储引擎是否支持恢复到稳定时间戳，而不是eMRC=false in sync_tail.cpp
- [服务器-52646](https://jira.mongodb.org/browse/SERVER-52646)验证并可能修复userToDNMapping正则表达式重写规则中的边缘情况
- [服务器-52654](https://jira.mongodb.org/browse/SERVER-52654)未由监控密钥为HMAC线程生成的新签名密钥
- [服务器-52806](https://jira.mongodb.org/browse/SERVER-52806)deb安装文件假设系统化
- [服务器-52969](https://jira.mongodb.org/browse/SERVER-52969)在非主分支上禁用Powercyle
- [服务器-53233](https://jira.mongodb.org/browse/SERVER-53233)修复change_streams_update_lookup_shard_metadata_missing.js [4.2, 4.0]
- [服务器-53348](https://jira.mongodb.org/browse/SERVER-53348)Pin PyOpenSSL
- [WT-6507](https://jira.mongodb.org/browse/WT-6507)我们的操作超时后，退出缓存驱逐人员
- [WT-6602](https://jira.mongodb.org/browse/WT-6602)允许传递操作超时ms以提交和回滚
- [WT-6666](https://jira.mongodb.org/browse/WT-6666)当我们在回滚和提交中配置操作计时器时，启动它



## 4.0.21 更改日志

### 安全

- [服务器-45803](https://jira.mongodb.org/browse/SERVER-45803)mongodecrypt需要一个ServiceContext
- [服务器-45938](https://jira.mongodb.org/browse/SERVER-45938)如果clusterMode:keyFile，允许在客户端x509证书中匹配O/OU/DC
- [服务器-47733](https://jira.mongodb.org/browse/SERVER-47733)SymmetricEncryptorWindows在调用更新时不应填充
- [服务器-50463](https://jira.mongodb.org/browse/SERVER-50463)Make PooledLDAPConnection::刷新获得自有

### 分片

[服务器-47616](https://jira.mongodb.org/browse/SERVER-47616)改善了逻辑会话无法在单个连接上进行多个用户身份验证时的错误

### 复制

- [服务器-48518](https://jira.mongodb.org/browse/SERVER-48518)通过retch回滚（EMRC = false）可以让读者看到回滚的数据，即使在回滚节点赶上主节点之后也是如此。
- [服务器-48928](https://jira.mongodb.org/browse/SERVER-48928)允许主要选择完成排水模式，即使它正在无条件下降
- [服务器-49986](https://jira.mongodb.org/browse/SERVER-49986)将 isMaster 命令转换为 hello 并添加别名
- [服务器-49987](https://jira.mongodb.org/browse/SERVER-49987)如果在mongod上发送了“hello”，请重命名响应字段
- [服务器-49988](https://jira.mongodb.org/browse/SERVER-49988)如果mongos上发送了“hello”，请重命名响应字段
- [服务器-49989](https://jira.mongodb.org/browse/SERVER-49989)添加db.hello() shell helper
- [服务器-49990](https://jira.mongodb.org/browse/SERVER-49990)别名setSlaveOk()和getSlaveOk() shell助手
- [服务器-49991](https://jira.mongodb.org/browse/SERVER-49991)别名printSlaveReplicationInfo（）shell助手
- [服务器-50607](https://jira.mongodb.org/browse/SERVER-50607)调用_checkForShutdownAndConvertStatus_inlock时必须保持互斥
- [服务器-50626](https://jira.mongodb.org/browse/SERVER-50626)在read_concern_majority_getmore_secondaries.js中比赛
- [服务器-50631](https://jira.mongodb.org/browse/SERVER-50631)[v4.0] Ban rollback_after_disabling_majority_reads.js with --nojournal和MMAPv1
- [服务器-50640](https://jira.mongodb.org/browse/SERVER-50640)listCommands除了“hello”命令名外，还应该返回“isMaster”别名
- [服务器-50747](https://jira.mongodb.org/browse/SERVER-50747)在change_streams_update_lookup_shard_metadata_missing.js中增加无操作间隔
- [服务器-50963](https://jira.mongodb.org/browse/SERVER-50963)rollback_via_refetch_anomaly.js在内存存储引擎上失败

### 查询

- [服务器-18341](https://jira.mongodb.org/browse/SERVER-18341)匹配器返回假阳性，与MinKey/MaxKey的谓词进行比较
- [服务器-35921](https://jira.mongodb.org/browse/SERVER-35921)索引扫描对MinKey和MaxKey使用错误的边界
- [服务器-39392](https://jira.mongodb.org/browse/SERVER-39392)PlanStage::dispose中的不变总是被评估为true
- [服务器-45233](https://jira.mongodb.org/browse/SERVER-45233)索引到数组的不等式返回错误的结果
- [服务器-50291](https://jira.mongodb.org/browse/SERVER-50291)添加查询旋钮，以不同顺序枚举$或子项
- [服务器-51083](https://jira.mongodb.org/browse/SERVER-51083)正则表达式索引边界问题
- [服务器-51120](https://jira.mongodb.org/browse/SERVER-51120)使用SORT_MERGE查找查询，在指定排序时错误地对结果进行排序

### 集合

[服务器-40317](https://jira.mongodb.org/browse/SERVER-40317)$facet执行对它可以消耗多少内存没有限制

### 储存

[服务器-50915](https://jira.mongodb.org/browse/SERVER-50915)[v4.0]当大多数阅读担忧关闭时，fsyncLock不得接受稳定的检查点

### 运营

[服务器-26726](https://jira.mongodb.org/browse/SERVER-26726)检查createIndex()的参数数量，如果两个以上的参数，则抛出错误

### 构建和包装

- [服务器-46342](https://jira.mongodb.org/browse/SERVER-46342)MDB的DEB安装在安装时不会发出systemctl守护进程重新加载
- [服务器-47138](https://jira.mongodb.org/browse/SERVER-47138)MSI安装程序生成错误的配置文件
- [服务器-50078](https://jira.mongodb.org/browse/SERVER-50078)当它不应该有时，编译旁路应用

### 内部人员

- [服务器-15902](https://jira.mongodb.org/browse/SERVER-15902)通过sigaltstack使用信号处理堆栈来改善堆栈溢出的行为
- [服务器-41872](https://jira.mongodb.org/browse/SERVER-41872)PlanEnumerator And Assignment::选择订单不稳定，与生成的一组计划相关
- [服务器-43233](https://jira.mongodb.org/browse/SERVER-43233)添加仅为LDAP组请求特定属性的能力
- [服务器-43973](https://jira.mongodb.org/browse/SERVER-43973)jsTestName()应该为并行套件中的每个线程返回一个唯一的名称
- [服务器-45202](https://jira.mongodb.org/browse/SERVER-45202)改进命令别名基础设施
- [服务器-47883](https://jira.mongodb.org/browse/SERVER-47883)新当选的初选不会等到单相背景索引构建完成后才接受写入
- [服务器-48410](https://jira.mongodb.org/browse/SERVER-48410)日期时间库的签名整数溢出修复
- [服务器-48709](https://jira.mongodb.org/browse/SERVER-48709)配置服务器上的签名密钥生成器线程没有按预期唤醒
- [服务器-49054](https://jira.mongodb.org/browse/SERVER-49054)服务器MSI应该安装指南针而不是指南针社区
- [服务器-49352](https://jira.mongodb.org/browse/SERVER-49352)4.0不使用python 3.8构建
- [服务器-49786](https://jira.mongodb.org/browse/SERVER-49786)冻结非主工作项目的DSI和Genny
- [服务器-50180](https://jira.mongodb.org/browse/SERVER-50180)修复AuthorizationManager中的用户生命周期管理::acquireUserForSessionRefresh
- [服务器-50183](https://jira.mongodb.org/browse/SERVER-50183)Copy _awaitPrimaryAppliedSurpassesRollbackApplied函数从RollbackTest复制到RollbackTestDeluxe
- [服务器-50216](https://jira.mongodb.org/browse/SERVER-50216)调整sys-perf频率
- [服务器-50736](https://jira.mongodb.org/browse/SERVER-50736)让OpenSSL明确接受ClientHello中显示的SNI
- [服务器-50818](https://jira.mongodb.org/browse/SERVER-50818)覆盖率分析缺陷114987：免费使用包装对象
- [服务器-51106](https://jira.mongodb.org/browse/SERVER-51106)使 isMaster 命令成为 Hello 的派生类
- [服务器-51608](https://jira.mongodb.org/browse/SERVER-51608)[4.0] backport implicitly_retry_on_background_op_in_progress.js
- [服务器-51802](https://jira.mongodb.org/browse/SERVER-51802)在v4.0上将require_majority_read_concern标签添加到decrypt_tool.js
- [工具-2589](https://jira.mongodb.org/browse/TOOLS-2589)[v4.0] sslAllowInvalidHostnames完全绕过ssl/tls服务器认证验证
- [WT-6421](https://jira.mongodb.org/browse/WT-6421)避免解析干净文件的元数据检查点
- [WT-6559](https://jira.mongodb.org/browse/WT-6559)使用新会话的会话ID来确定统计存储桶
- [WT-6598](https://jira.mongodb.org/browse/WT-6598)添加新的API，允许更改dhandle哈希桶大小



## 4.0.20 更改日志

### 分片

- [服务器-40441](https://jira.mongodb.org/browse/SERVER-40441)当尝试创建会话集合或检查是否存在时，仲裁节点会记录错误消息
- [服务器-44115](https://jira.mongodb.org/browse/SERVER-44115)从分片jscore测试中排除jstests/core/autocomplete.js
- [服务器-47799](https://jira.mongodb.org/browse/SERVER-47799)AsyncRequestsSender应该在InterruptedAtShutdown重试之间更新副本集监视器
- [服务器-48491](https://jira.mongodb.org/browse/SERVER-48491)将require_document_locking标签添加到sss_collection_reaping.js
- [服务器-48674](https://jira.mongodb.org/browse/SERVER-48674)在检查节点是否是LogicalSessionCacheImpl中的仲裁器之前，请检查是否启用了复制
- [服务器-48926](https://jira.mongodb.org/browse/SERVER-48926)修复在碎片次要错误地将投票设置为0的剩余分片测试
- [服务器-49233](https://jira.mongodb.org/browse/SERVER-49233)引入一个标志，以切换拆分期间撞合集合主要版本的逻辑

### 复制

- [服务器-37390](https://jira.mongodb.org/browse/SERVER-37390)如果RollbackTestFixture没有关闭当前的主服务器，则不需要等待新的主主服务器
- [服务器-42004](https://jira.mongodb.org/browse/SERVER-42004)localhost{1,2,3}.js测试应该等待选择初选后再关闭测试
- [服务器-45610](https://jira.mongodb.org/browse/SERVER-45610)当系统正在恢复时，一些读取工作
- [服务器-46897](https://jira.mongodb.org/browse/SERVER-46897)已移除的节点可能永远不会发送心跳以获取最新配置
- [服务器-47849](https://jira.mongodb.org/browse/SERVER-47849)为关机任务添加更多日志记录
- [服务器-48276](https://jira.mongodb.org/browse/SERVER-48276)ReplSet免费监控URL不一致
- [服务器-48967](https://jira.mongodb.org/browse/SERVER-48967)防止在次调的空命名空间上复制写入
- [服务器-50039](https://jira.mongodb.org/browse/SERVER-50039)dbadmin.js测试中的计时错误

### 查询

- [服务器-47223](https://jira.mongodb.org/browse/SERVER-47223)geoNear/$geoNear不应用索引提示
- [服务器-48993](https://jira.mongodb.org/browse/SERVER-48993)explodeForSort可能会产生不正确的查询计划
- [服务器-49527](https://jira.mongodb.org/browse/SERVER-49527)recoverFromOplogAsStandalone不会放松索引约束

### 储存

- [服务器-43097](https://jira.mongodb.org/browse/SERVER-43097)改进索引构建因启动恢复而突出显示的日志消息传递
- [服务器-47694](https://jira.mongodb.org/browse/SERVER-47694)再次修复多键。
- [服务器-48453](https://jira.mongodb.org/browse/SERVER-48453)在删除时懒惰地初始化记录存储的自动增量计数器
- [服务器-48695](https://jira.mongodb.org/browse/SERVER-48695)setAppliedThrough必须在恢复单元上设置ordercommit=false
- [服务器-49449](https://jira.mongodb.org/browse/SERVER-49449)index_restart_secondary.js与不支持持久性的存储引擎不兼容

### 运营

- [服务器-44051](https://jira.mongodb.org/browse/SERVER-44051)getShardDistribution（）在删除但之前分片集合时没有报告“Collection XYZ未分片”
- [服务器-48244](https://jira.mongodb.org/browse/SERVER-48244)Shell不应该对允许的解释级别进行硬编码，而是让服务器拒绝它

### 构建和包装ing/release-notes/4.0-changelog/#build-and-packaging-6)

- [服务器-42042](https://jira.mongodb.org/browse/SERVER-42042)使用工具链编译器和tcmalloc在动态构建的早期警告或失败
- [服务器-46927](https://jira.mongodb.org/browse/SERVER-46927)阐明发布相关任务的依赖项
- [服务器-48329](https://jira.mongodb.org/browse/SERVER-48329)调整主分支或所有稳定分支上action_type.h的命名
- [服务器-48640](https://jira.mongodb.org/browse/SERVER-48640)更新RHEL 6.2 AMI进行软件包测试
- [服务器-48659](https://jira.mongodb.org/browse/SERVER-48659)更新SLES 12 AMI进行软件包测试
- [服务器-48681](https://jira.mongodb.org/browse/SERVER-48681)更新Debian 8.1 AMI进行软件包测试
- [服务器-49925](https://jira.mongodb.org/browse/SERVER-49925)动态构建器不应将mongodbtoolchain与tcmalloc相结合
- [服务器-50124](https://jira.mongodb.org/browse/SERVER-50124)Pin lazy-object-proxy python模块

### 内部人员

- [服务器-33229](https://jira.mongodb.org/browse/SERVER-33229)在auto_retry_on_network_error.js中重载startParallelShell，在加载auto_retry_on_network_error.js覆盖后连接
- [服务器-36454](https://jira.mongodb.org/browse/SERVER-36454)升级ASIO
- [服务器-37993](https://jira.mongodb.org/browse/SERVER-37993)将asio升级到eed287d46c14310f0daf4ff19b0297917143723
- [服务器-41600](https://jira.mongodb.org/browse/SERVER-41600)IndexCatalog::refreshEntry应该使CollectionInfoCache中的索引无效
- [服务器-42908](https://jira.mongodb.org/browse/SERVER-42908)将ErrorCodes添加到可重试错误中以匹配驱动程序
- [服务器-46758](https://jira.mongodb.org/browse/SERVER-46758)在FCV更改被大多数提交之前，setFCV可以中断，并在不运行setFCV服务器逻辑的情况下回滚FCV
- [服务器-47930](https://jira.mongodb.org/browse/SERVER-47930)Ubuntu 20.04 - ldap_authz_authn.js加载测试证书失败
- [服务器-48032](https://jira.mongodb.org/browse/SERVER-48032)更新MongoDB开发人员社区论坛的社区邮件列表参考
- [服务器-48107](https://jira.mongodb.org/browse/SERVER-48107)在rollback_test.js中重试replSetStepDown
- [服务器-48514](https://jira.mongodb.org/browse/SERVER-48514)服务器状态选举指标的单独测试“调用”和“成功”字段
- [服务器-48569](https://jira.mongodb.org/browse/SERVER-48569)将冲突操作InProgress作为可接受的错误代码添加到validateCollectionsCallback中
- [服务器-48657](https://jira.mongodb.org/browse/SERVER-48657)使用常青模块控制perf项目中的信号处理
- [服务器-49007](https://jira.mongodb.org/browse/SERVER-49007)mock_http_server.py中指标响应中的往返注册ID
- [服务器-49071](https://jira.mongodb.org/browse/SERVER-49071)使ldap_fastest_host_selection.js容忍统计中缺失的LDAP服务器
- [服务器-49142](https://jira.mongodb.org/browse/SERVER-49142)在RoleName::parseFromBSON()中验证正确的字段名
- [服务器-49335](https://jira.mongodb.org/browse/SERVER-49335)publish_packages应该使用barque API密钥
- [服务器-49404](https://jira.mongodb.org/browse/SERVER-49404)在$arrayToObject中执行额外的检查
- [WT-5242](https://jira.mongodb.org/browse/WT-5242)尽量减少备份期间固定的检查点
- [WT-6118](https://jira.mongodb.org/browse/WT-6118)修复备份中缺少检查点的问题
- [WT-6141](https://jira.mongodb.org/browse/WT-6141)在备份期间禁用检查点删除



## 4.0.19 更改日志

### 分片

- [服务器-37929](https://jira.mongodb.org/browse/SERVER-37929)配置服务器中的ShardRegistry可以在回滚后保留无效条目，直到下次重新加载
- [服务器-39498](https://jira.mongodb.org/browse/SERVER-39498)ShardRegistry在复制Rollback内部重新加载可能会卡住
- [服务器-42862](https://jira.mongodb.org/browse/SERVER-42862)防止mergeChunks命令中的碎片刷新加入早期刷新
- [服务器-45910](https://jira.mongodb.org/browse/SERVER-45910)路由器可能会在未分片集合的写入操作上瞄准错误的碎片
- [服务器-46487](https://jira.mongodb.org/browse/SERVER-46487)散射/采集操作的蒙古路由可能具有无界延迟
- [服务器-46942](https://jira.mongodb.org/browse/SERVER-46942)如果服务器在network_interface_tl上关闭得太快，状态信息可能会泄露
- [服务器-47436](https://jira.mongodb.org/browse/SERVER-47436)让碎片在dataSize命令中验证shardKey
- [服务器-47745](https://jira.mongodb.org/browse/SERVER-47745)使ShardingCatalogManager中的块查询与3.4中创建的块兼容
- [服务器-47913](https://jira.mongodb.org/browse/SERVER-47913)在拆分块和分布式锁获取中编辑分片消息
- [服务器-47999](https://jira.mongodb.org/browse/SERVER-47999)balance_repl.js在尝试从辅助读取之前，应确保写入已复制

### 复制

- [服务器-46195](https://jira.mongodb.org/browse/SERVER-46195)rollback_after_enabling_majority_reads.js中的次要在验证命令之前进入回滚
- [服务器-47558](https://jira.mongodb.org/browse/SERVER-47558)4.0 上恢复 SERVER-38356
- [服务器-47613](https://jira.mongodb.org/browse/SERVER-47613)进程中的不变ReplSetRequestVotes
- [服务器-47695](https://jira.mongodb.org/browse/SERVER-47695)编写由可以幸存的线程运行的命令可能会失败操作ServiceEntryPoint中的Time不变
- [服务器-48276](https://jira.mongodb.org/browse/SERVER-48276)ReplSet免费监控URL不一致
- [服务器-48374](https://jira.mongodb.org/browse/SERVER-48374)在rollback_after_enabling_majority_reads.js中传递awaitReplication()的数组

### 查询

- [服务器-40805](https://jira.mongodb.org/browse/SERVER-40805)在日志文件中指出重新规划的原因
- [服务器-47209](https://jira.mongodb.org/browse/SERVER-47209)change_streams_update_lookup_shard_metadata_missing.js应该处理在回滚时建立更改流光标的节点
- [服务器-47773](https://jira.mongodb.org/browse/SERVER-47773)geoNear invariant on mongos
- [服务器-47994](https://jira.mongodb.org/browse/SERVER-47994)修复GeoHash中的数字溢出问题

### 写入操作

[服务器-47233](https://jira.mongodb.org/browse/SERVER-47233)WriteOp可以处于挂起状态，导致错误的NoProgress来自mongos的写入错误

### 集合

[服务器-44689](https://jira.mongodb.org/browse/SERVER-44689)为用户请求中每次使用聚合阶段添加serverStatus计数器

### 储存

- [服务器-46398](https://jira.mongodb.org/browse/SERVER-46398)在macOS上启动mongod时建议显式dbpath，但找不到默认的dbpath
- [服务器-46699](https://jira.mongodb.org/browse/SERVER-46699)在FTDC中报告oplog可见性时间戳

### 运营

[服务器-45295](https://jira.mongodb.org/browse/SERVER-45295)确保LDAP日志始终包含AuthZN操作的上下文

### 内部人员

- [服务器-39241](https://jira.mongodb.org/browse/SERVER-39241)如果没有提供预测，计划评分错误地将noFetchBonus奖金应用于所有计划
- [服务器-42525](https://jira.mongodb.org/browse/SERVER-42525)单节点复制集不应在关闭期间等待可选择的赶上继发
- [服务器-43889](https://jira.mongodb.org/browse/SERVER-43889)区分可重试写入和命令失败时的事务
- [服务器-45334](https://jira.mongodb.org/browse/SERVER-45334)MSI安装程序中未遵守服务名称
- [服务器-45367](https://jira.mongodb.org/browse/SERVER-45367)当范围删除器等待打开的光标时，请在日志中列出这些光标。
- [服务器-45508](https://jira.mongodb.org/browse/SERVER-45508)具有下降点范围的 getFieldsWithStringBounds中的不变故障
- [服务器-46633](https://jira.mongodb.org/browse/SERVER-46633)Windows TLS实现可能会在无关的错误上声明主机名不匹配
- [服务器-46758](https://jira.mongodb.org/browse/SERVER-46758)在FCV更改被大多数提交之前，setFCV可以中断，并在不运行setFCV服务器逻辑的情况下回滚FCV
- [服务器-47063](https://jira.mongodb.org/browse/SERVER-47063)将静态OpenSSL升级到1.1.1e
- [服务器-47071](https://jira.mongodb.org/browse/SERVER-47071)CheckReplOplogs可能无法检测到不匹配
- [服务器-47187](https://jira.mongodb.org/browse/SERVER-47187)当SeIncreaseWorkingSetPrivilege不存在时添加启动警告
- [服务器-47256](https://jira.mongodb.org/browse/SERVER-47256)更新repo软件包文件的列表维护程序
- [服务器-47373](https://jira.mongodb.org/browse/SERVER-47373)改进空TLS数据包的处理
- [服务器-47634](https://jira.mongodb.org/browse/SERVER-47634)使stepup.js中的度量测试更健壮
- [服务器-47686](https://jira.mongodb.org/browse/SERVER-47686)将静态OpenSSL升级到1.1.1g
- [服务器-47765](https://jira.mongodb.org/browse/SERVER-47765)仅限4.0：使DocumentSourceGraphLookup上方声明的变量在
- [服务器-47798](https://jira.mongodb.org/browse/SERVER-47798)审计是mongod和mongos的主响应验证
- [服务器-48269](https://jira.mongodb.org/browse/SERVER-48269)在4.0中修复rlp测试



## 4.0.18 更改日志

### 安全

- [服务器-46834](https://jira.mongodb.org/browse/SERVER-46834)在UserCacheInvalidator中使用单调时间
- [服务器-47113](https://jira.mongodb.org/browse/SERVER-47113)LDAP连接池获取状态应该拥有主机列表

### 分片

- [服务器-29153](https://jira.mongodb.org/browse/SERVER-29153)在ShardingTest初始化中进行写入之前，请确保复制集节点同意哪个节点是主节点
- [服务器-44463](https://jira.mongodb.org/browse/SERVER-44463)insertConfigDocumentsAsRetryableWrite()错误地计算BSON数组开销
- [服务器-45119](https://jira.mongodb.org/browse/SERVER-45119)CollectionShardingState::getCurrentShardVersionIfKnown返回集合版本而不是碎片版本
- [服务器-46307](https://jira.mongodb.org/browse/SERVER-46307)database_versioning_safe_secondary_reads.js不应在碎片次要上设置“投票：0”

### 复制

[服务器-33627](https://jira.mongodb.org/browse/SERVER-33627)初始同步器需要处理异常

### 查询

[服务器-32903](https://jira.mongodb.org/browse/SERVER-32903)在初始同步期间，应忽略模棱两可的字段名称错误

### 运营

- [服务器-34199](https://jira.mongodb.org/browse/SERVER-34199)serverStatus的“定时”部分可能会对ftdc保留产生重大影响
- [服务器-41117](https://jira.mongodb.org/browse/SERVER-41117)来自并行测试的黑名单autocomplete.js
- [服务器-44892](https://jira.mongodb.org/browse/SERVER-44892)getShardDistribution应该使用$collStats agg阶段，而不是collStats命令
- [服务器-46024](https://jira.mongodb.org/browse/SERVER-46024)在FTDC中收集/proc/vmstat交换统计数据

### 构建和包装

- [服务器-46983](https://jira.mongodb.org/browse/SERVER-46983)上传回购构建包以更正URL
- [服务器-46996](https://jira.mongodb.org/browse/SERVER-46996)所有push/publish_packages任务都应该在小型主机上运行

### 内部人员

- [服务器-30739](https://jira.mongodb.org/browse/SERVER-30739)如果初始replSetConfig失败，config_server_checks.js应该断言
- [服务器-36467](https://jira.mongodb.org/browse/SERVER-36467)连续降级覆盖应保持参数
- [服务器-37148](https://jira.mongodb.org/browse/SERVER-37148)删除mr_shard_version.js和mr_during_migrate.js，转而使用MR FSM测试
- [服务器-38119](https://jira.mongodb.org/browse/SERVER-38119)Windows转储文件命名不考虑目录名称中的点
- [服务器-42278](https://jira.mongodb.org/browse/SERVER-42278)在LDAP连接建立期间生产的具有手动派生尺寸的Log SockAddrs
- [服务器-43763](https://jira.mongodb.org/browse/SERVER-43763)弄清楚当libldap使用OpenSSL构建时，是否可以禁用全局LDAP同步。
- [服务器-45050](https://jira.mongodb.org/browse/SERVER-45050)更改Windows Kerberos客户端，以便在未指定密码时使用默认凭据
- [服务器-45156](https://jira.mongodb.org/browse/SERVER-45156)SockAddr构造函数应该使用sockaddr，而不是sockaddr_storage
- [服务器-45867](https://jira.mongodb.org/browse/SERVER-45867)使用最新版本的信号处理
- [服务器-46754](https://jira.mongodb.org/browse/SERVER-46754)使用新的repobuilder服务
- [服务器-46766](https://jira.mongodb.org/browse/SERVER-46766)每次运行后都会撕毁集群
- [服务器-46851](https://jira.mongodb.org/browse/SERVER-46851)减少逻辑会话缓存测试中的作业数量
- [服务器-46899](https://jira.mongodb.org/browse/SERVER-46899)在4.0和3.6中修复tcmallocReleaseRate参数
- [服务器-47080](https://jira.mongodb.org/browse/SERVER-47080)为LDAP测试启用详细日志记录
- [服务器-47114](https://jira.mongodb.org/browse/SERVER-47114)让ldapproxy.py在Windows上使用IOCP
- [WT-5119](https://jira.mongodb.org/browse/WT-5119)如果用检查站读取种族，出生标记记录可以作为正常更新读取
- [WT-5376](https://jira.mongodb.org/browse/WT-5376)WT_UPDATE.type字段可以在返回键/值对时进行可见性检查



## 4.0.17 更改日志

### 分片

- [服务器-44598](https://jira.mongodb.org/browse/SERVER-44598)碎片不会将忽略版本视为“预期碎片”
- [服务器-45273](https://jira.mongodb.org/browse/SERVER-45273)删除 allow_partial_results.js 和 return_partial_shards_down.js 中的 mongos 版本检查
- [服务器-45599](https://jira.mongodb.org/browse/SERVER-45599)返回作为SERVER-32198到4.0的一部分对CollectionShardingState所做的更改
- [服务器-45770](https://jira.mongodb.org/browse/SERVER-45770)添加到日志文件中包含的关于“moveChunk.to”的信息
- [服务器-46001](https://jira.mongodb.org/browse/SERVER-46001)将checkShardingIndex移到主碎片上的shardCollection的读取关键部分之外
- [服务器-46466](https://jira.mongodb.org/browse/SERVER-46466)与findAndModify可重试写入和会话迁移进行竞赛

### 复制

- [服务器-34768](https://jira.mongodb.org/browse/SERVER-34768)如果对赶上进度的滞后节点运行，回滚可能会失败
- [服务器-35050](https://jira.mongodb.org/browse/SERVER-35050)不要因为文档计数负而中止集合克隆
- [服务器-35437](https://jira.mongodb.org/browse/SERVER-35437)在multi_rs.js中等待stepdown命令后的辅助状态
- [服务器-39112](https://jira.mongodb.org/browse/SERVER-39112)主排水模式可能会不必要地缓慢
- [服务器-39495](https://jira.mongodb.org/browse/SERVER-39495)更新中省略了分键，并使用multi:true删除oplog条目
- [服务器-42219](https://jira.mongodb.org/browse/SERVER-42219)当主退出排水模式时，Oplog缓冲区并不总是空的
- [服务器-43867](https://jira.mongodb.org/browse/SERVER-43867)通过在测试中重新获取来解决回滚的不可恢复性
- [服务器-45178](https://jira.mongodb.org/browse/SERVER-45178)通过回滚回滚可能会导致回滚成功发生，而没有更新回滚ID。
- [服务器-45493](https://jira.mongodb.org/browse/SERVER-45493)在e election_candidate_and_participant_metrics.js 中暂时禁用失败断言
- [服务器-45840](https://jira.mongodb.org/browse/SERVER-45840)从 replica_sets_kill_secondaries_jscore_passthrough运行空洞的黑名单测试
- [服务器-46050](https://jira.mongodb.org/browse/SERVER-46050)使用 getLastAppliedOpTime 而不是 getHeartbeatAppliedOpTime 来检查小学的位置
- [服务器-46238](https://jira.mongodb.org/browse/SERVER-46238)commitTransaction和事务到期之间的竞争导致不变

### 查询

[服务器-45363](https://jira.mongodb.org/browse/SERVER-45363)使用通配符时mongodb文本索引和权重问题

### 集合

[服务器-45418](https://jira.mongodb.org/browse/SERVER-45418)DocumentSourceCursor批处理内存会计不考虑空文档，导致无界内存用于类似计数的聚合

### 内部人员

- [服务器-40014](https://jira.mongodb.org/browse/SERVER-40014)System-Perf：默认 is_patch 展开为 false
- [服务器-44325](https://jira.mongodb.org/browse/SERVER-44325)添加polyfill进行证书链验证
- [服务器-44435](https://jira.mongodb.org/browse/SERVER-44435)允许根据CA选择性地启用x509授权
- [服务器-44853](https://jira.mongodb.org/browse/SERVER-44853)当未选择安装mongod时，MSI应跳过安装MongoD服务对话框
- [服务器-45766](https://jira.mongodb.org/browse/SERVER-45766)从服务器yaml中删除“要求”
- [服务器-46082](https://jira.mongodb.org/browse/SERVER-46082)将bin/analysis.py用于性能项目
- [服务器-46126](https://jira.mongodb.org/browse/SERVER-46126)ldap_insuffcient_access_rights.js中的LDAP代理和mongod启动竞赛
- [服务器-46174](https://jira.mongodb.org/browse/SERVER-46174)SSL_get0_verified_chain polyfill中的免费对等证书
- [服务器-46365](https://jira.mongodb.org/browse/SERVER-46365)getMore command before rs.initiate() can trip invariant
- [服务器-46630](https://jira.mongodb.org/browse/SERVER-46630)RemoveSaver将GCM标签写入错误的文件位置
- [WT-5150](https://jira.mongodb.org/browse/WT-5150)LAS扫描不会删除不再需要的条目
- [WT-5192](https://jira.mongodb.org/browse/WT-5192)不要让检查站在没有快照的情况下驱逐
- [WT-5263](https://jira.mongodb.org/browse/WT-5263)写入旁路文件的准备好的更新并不总是根据需要阅读
- [WT-5395](https://jira.mongodb.org/browse/WT-5395)当有很多争议时，修复读取锁实现中的错误
- [WT-5587](https://jira.mongodb.org/browse/WT-5587)限制后续检查站删除的检查点数量



## 4.0.16 更改日志

### 分片

- [服务器-44103](https://jira.mongodb.org/browse/SERVER-44103)clear_jumbo.js应该等待平衡器进入模式：满一轮以上
- [服务器-44130](https://jira.mongodb.org/browse/SERVER-44130)逻辑_time_metadata.js中assert.lte参数的翻转顺序

### 复制

- [服务器-45758](https://jira.mongodb.org/browse/SERVER-45758)在会话_test中将睡眠添加到TimeInactiveMicrosShouldBeSetUponUnstashAndStash
- [服务器-45761](https://jira.mongodb.org/browse/SERVER-45761)在session_test中使用相同的时钟进行测试和工作代码[v4.0]

### 查询

- [服务器-44658](https://jira.mongodb.org/browse/SERVER-44658)为noPassthrough/max_time_ms.js添加正确的标签
- [服务器-45279](https://jira.mongodb.org/browse/SERVER-45279)粒度圆形圆形无穷大时可能会卡在循环中

### 储存

- [服务器-38794](https://jira.mongodb.org/browse/SERVER-38794)如果抛出写入冲突异常，CollectionOptions可能会丢失在createCollection中
- [服务器-45289](https://jira.mongodb.org/browse/SERVER-45289)条件跳转或移动取决于validate_adaptor.cpp中的未初始化值

### 构建和包装

- [服务器-45713](https://jira.mongodb.org/browse/SERVER-45713)在大型rhel70发行版上运行rhel7推送和发布任务
- [服务器-45732](https://jira.mongodb.org/browse/SERVER-45732)更积极地过滤net-snmp-config调用中的标志

### 内部人员

- [服务器-40047](https://jira.mongodb.org/browse/SERVER-40047)阻止队列的测试不应测试无保证条件
- [服务器-42573](https://jira.mongodb.org/browse/SERVER-42573)仅警告readConcern在主-中级仲裁器配置中启用的多数
- [服务器-45486](https://jira.mongodb.org/browse/SERVER-45486)在'hashed_index_bad_keys_cleanup.js'中为调试索引键计数不匹配问题添加信息
- [服务器-45831](https://jira.mongodb.org/browse/SERVER-45831)[4.0]性能回归处理大型聚合命令



## 4.0.15 更改日志

### 安全

[服务器-45309](https://jira.mongodb.org/browse/SERVER-45309)确保绑定凭据比LDAP操作寿命更长

### 分片

- [服务器-33597](https://jira.mongodb.org/browse/SERVER-33597)使 allow_partial_results.js, return_partial_shards_down.js 将碎片作为复制集启动
- [服务器-36865](https://jira.mongodb.org/browse/SERVER-36865)使扩展kill_rooted_or.js的fsm工作负载在分片并发套件中更健壮，或将其列入黑名单
- [服务器-43195](https://jira.mongodb.org/browse/SERVER-43195)向ChunkManager ShardKeyNotFound故障添加命名空间，以便更好地诊断故障。
- [服务器-44341](https://jira.mongodb.org/browse/SERVER-44341)在收集碎片时预先拆分时，不要只选择与区域关联的所有碎片中的第一个碎片
- [服务器-45100](https://jira.mongodb.org/browse/SERVER-45100)使BatchWriteExecutor仅针对不成功的碎片重试多写

### 复制

- [服务器-35407](https://jira.mongodb.org/browse/SERVER-35407)复制协调员外部状态和数据复制不得在关机后启动
- [服务器-44061](https://jira.mongodb.org/browse/SERVER-44061)在设置复制维护模式时进行竞赛。
- [服务器-44503](https://jira.mongodb.org/browse/SERVER-44503)在replsets/auth2.js中比赛
- [服务器-45396](https://jira.mongodb.org/browse/SERVER-45396)使用splithorizon时修复了是Master响应中的“我”字段

### 查询

- [服务器-42565](https://jira.mongodb.org/browse/SERVER-42565)聚合和查找命令对缺失字段进行不同排序
- [服务器-45152](https://jira.mongodb.org/browse/SERVER-45152)数组上不等式的否定可能会绊倒不变

### 集合

[服务器-44733](https://jira.mongodb.org/browse/SERVER-44733)如果单个碎片无法用于updateLookup，则更改流应抛出ChangeStreamFatalError

### 储存

- [服务器-43910](https://jira.mongodb.org/browse/SERVER-43910)在LockManager::dump()输出中包含客户端/OpCtx信息
- [服务器-44796](https://jira.mongodb.org/browse/SERVER-44796)调整非日记启动警告，使它更具吸引力

### 运营

[服务器-45290](https://jira.mongodb.org/browse/SERVER-45290)从v4.2的第三方库清单中删除上游元数据

### 构建和包装

- [服务器-44550](https://jira.mongodb.org/browse/SERVER-44550)删除特定于移动的嵌入式命令
- [服务器-45346](https://jira.mongodb.org/browse/SERVER-45346)Ubuntu 18.04软件包测试任务无法安装openssl

### 内部人员

- [服务器-34844](https://jira.mongodb.org/browse/SERVER-34844)在apply_batches_totalMillis中放松期望
- [服务器-37406](https://jira.mongodb.org/browse/SERVER-37406)藏匿的储物柜应该保留有关拥有交易的信息
- [服务器-39131](https://jira.mongodb.org/browse/SERVER-39131)重构存储引擎锁定文件支持
- [服务器-43210](https://jira.mongodb.org/browse/SERVER-43210)jstests/sharding/kill_sessions.js不会等待操作被杀死。
- [服务器-43246](https://jira.mongodb.org/browse/SERVER-43246)添加一个日志行，用于由于逻辑会话清理而获取光标的时间
- [服务器-43349](https://jira.mongodb.org/browse/SERVER-43349)$elemMatch $not $ne的序列化不正确
- [服务器-44578](https://jira.mongodb.org/browse/SERVER-44578)从storage_wiredtiger_core的LIBDEPS_PRIVATE中删除未使用的db_raii和server_status库
- [服务器-44828](https://jira.mongodb.org/browse/SERVER-44828)将$sort吸收到查询层后，纠正逻辑以重新计算依赖项
- [服务器-45472](https://jira.mongodb.org/browse/SERVER-45472)确保RoleGraph可以序列化身份验证限制到BSON
- [WT-4636](https://jira.mongodb.org/browse/WT-4636)在syscall测试中修复strace
- [WT-5042](https://jira.mongodb.org/browse/WT-5042)减少检查点的配置解析开销
- [WT-5106](https://jira.mongodb.org/browse/WT-5106)删除clang格式脚本中的临时文件
- [WT-5112](https://jira.mongodb.org/browse/WT-5112)在s_goto.py中处理带有多个单词的goto标签
- [WT-5120](https://jira.mongodb.org/browse/WT-5120)当和解没有释放驱逐生成时，检查点会挂起
- [WT-5125](https://jira.mongodb.org/browse/WT-5125)为驱逐目标战略添加新的统计数据
- [WT-5135](https://jira.mongodb.org/browse/WT-5135)更改side文件插入以使用cursor.insert
- [WT-5169](https://jira.mongodb.org/browse/WT-5169)WT_REF_LIMBO页面不支持快速（仅限页页）搜索
- [WT-5196](https://jira.mongodb.org/browse/WT-5196)启用LAS扫描后，数据与测试/检查点不匹配失败
- [WT-5218](https://jira.mongodb.org/browse/WT-5218)使用WT_CACHE_EVICT_NOKEEP阅读器改进驱逐，以区分干净和肮脏的页面
- [WT-5239](https://jira.mongodb.org/browse/WT-5239)修复有关元数据文件打开的syscall失败
- [WT-5247](https://jira.mongodb.org/browse/WT-5247)确保只记录幂等的修改操作
- [WT-5277](https://jira.mongodb.org/browse/WT-5277)在旁置文件中检测到光标键乱序
- [WT-5297](https://jira.mongodb.org/browse/WT-5297)syscall.py在mongodb-4.0上失败



## 4.0.14 更改日志

### 安全

- [服务器-28011](https://jira.mongodb.org/browse/SERVER-28011)在--kmipServerName参数中支持多个KMIP主机
- [服务器-43090](https://jira.mongodb.org/browse/SERVER-43090)使用Okta修复LDAP连接运行状况测试
- [服务器-43653](https://jira.mongodb.org/browse/SERVER-43653)将静态OpenSSL升级到1.1.1d
- [服务器-44320](https://jira.mongodb.org/browse/SERVER-44320)允许通过操作类型授权分区分片命令

### 分片

- [服务器-31083](https://jira.mongodb.org/browse/SERVER-31083)允许将主碎片传递给新数据库的“启用共享”命令
- [服务器-42737](https://jira.mongodb.org/browse/SERVER-42737)MongoDB卡在更新元数据上
- [服务器-42914](https://jira.mongodb.org/browse/SERVER-42914)为平衡器实现随机块选择策略，用于并发_*_with_balancer工作负载
- [服务器-44476](https://jira.mongodb.org/browse/SERVER-44476)包括 removeShard 输出中剩余的巨型块数

### 复制

- [服务器-41504](https://jira.mongodb.org/browse/SERVER-41504)在初选replSetStatus中跟踪追赶期间的操作数量
- [服务器-41505](https://jira.mongodb.org/browse/SERVER-41505)跟踪服务器状态中追赶操作的平均数量
- [服务器-41506](https://jira.mongodb.org/browse/SERVER-41506)跟踪与调用选举的节点关联的指标
- [服务器-41507](https://jira.mongodb.org/browse/SERVER-41507)跟踪在初选时在replSetStatus中编写新术语oplog条目的时间
- [服务器-41508](https://jira.mongodb.org/browse/SERVER-41508)跟踪新术语oplog条目在初选replSetStatus中占多数的时间
- [服务器-41512](https://jira.mongodb.org/browse/SERVER-41512)跟踪与选举中节点投票相关的指标
- [服务器-41513](https://jira.mongodb.org/browse/SERVER-41513)跟踪新术语oplog条目由主节点编写并由secondal在所有节点的replSetStatus中应用的时间
- [服务器-42534](https://jira.mongodb.org/browse/SERVER-42534)在 freeze_timeout.js 中以更少的时间退出初选，并增加选举TimeoutMillis
- [服务器-43239](https://jira.mongodb.org/browse/SERVER-43239)repSetGetStatus中的numCatchUpOps不正确
- [服务器-43398](https://jira.mongodb.org/browse/SERVER-43398)在replSetGetStatus_new_term_oplog_entry_fields.js中修复比赛
- [服务器-43695](https://jira.mongodb.org/browse/SERVER-43695)将睡眠添加到session_test.cpp，以考虑curTimeMicros和Date_t时钟源之间的差异[v4.0]
- [服务器-43703](https://jira.mongodb.org/browse/SERVER-43703)禁用rsSyncApplyStop故障点和停止服务器时的比赛
- [服务器-43868](https://jira.mongodb.org/browse/SERVER-43868)Session::TxnResources::release()可以在析构函数中抛出异常（仅限4.0.x）
- [服务器-43879](https://jira.mongodb.org/browse/SERVER-43879)OplogInterfaceLocal::next应该返回拥有的BSON对象
- [服务器-43972](https://jira.mongodb.org/browse/SERVER-43972)initial_sync_capped_index.js在运行validate之前应该检查SECONDARY状态
- [服务器-44005](https://jira.mongodb.org/browse/SERVER-44005)提高rollback_after_enabling_majority_reads.js的鲁棒性
- [服务器-44643](https://jira.mongodb.org/browse/SERVER-44643)在rollback_after_enabling_majority_reads.js中使用awaitSecondaryNodes而不是waitForState
- [服务器-44675](https://jira.mongodb.org/browse/SERVER-44675)server_status_metrics.js因服务器状态中的racy repl.buffer.count指标而失败
- [服务器-44788](https://jira.mongodb.org/browse/SERVER-44788)在 seed_secondary_without_sessions_table.js 中使用 awaitSecondaryNodes 而不是 waitForState

### 查询

- [服务器-32567](https://jira.mongodb.org/browse/SERVER-32567)将queryoptimizer3.js替换为FSM测试
- [服务器-43699](https://jira.mongodb.org/browse/SERVER-43699)查找$mod可能导致UB
- [服务器-44050](https://jira.mongodb.org/browse/SERVER-44050)沿着“散列”索引键路径的数组没有被正确拒绝
- [服务器-44269](https://jira.mongodb.org/browse/SERVER-44269)现代化max_time_ms.js
- [服务器-44571](https://jira.mongodb.org/browse/SERVER-44571)升级后无法更新或删除服务器-44050损坏场景中涉及的文档

### 集合

- [服务器-38691](https://jira.mongodb.org/browse/SERVER-38691)serverInfo没有解释聚合输出
- [服务器-42756](https://jira.mongodb.org/browse/SERVER-42756)$multiply运算符可能会返回，但错误或不带错误，具体取决于是否启用了管道优化
- [服务器-43034](https://jira.mongodb.org/browse/SERVER-43034)DoubleDoubleSummation中的特殊值处理不一致
- [服务器-43764](https://jira.mongodb.org/browse/SERVER-43764)在DoubleSummation中添加更多特殊值测试
- [服务器-44174](https://jira.mongodb.org/browse/SERVER-44174)$push和$addToSet应该限制内存使用
- [服务器-44869](https://jira.mongodb.org/browse/SERVER-44869)添加查询旋钮以控制$push和$addToSet的内存限制

### 储存

* [服务器-42312](https://jira.mongodb.org/browse/SERVER-42312)在回滚期间进行验证可能会导致计数不匹配

- [服务器-43322](https://jira.mongodb.org/browse/SERVER-43322)添加用于测量OplogStones性能的跟踪工具
- [服务器-43908](https://jira.mongodb.org/browse/SERVER-43908)修改IndexConsistency哈希映射键，以避免在KeyString表单中针对不同索引的重复索引键上点击不变
- [服务器-44188](https://jira.mongodb.org/browse/SERVER-44188)[4.0] validate_tests应该删除从光标获得的RecordId的索引条目

### 运营

* [服务器-28604](https://jira.mongodb.org/browse/SERVER-28604)记录光标何时因超时而收获

### 构建和包装

- [服务器-37766](https://jira.mongodb.org/browse/SERVER-37766)平台支持：从4.0中删除社区zSeries
- [服务器-37772](https://jira.mongodb.org/browse/SERVER-37772)平台支持：添加社区和企业RHEL 8 x64
- [服务器-44392](https://jira.mongodb.org/browse/SERVER-44392)平台支持：删除zSeries ubuntu 16.04
- [服务器-44545](https://jira.mongodb.org/browse/SERVER-44545)删除移动平台上嵌入式SDK的构建器
- [服务器-44546](https://jira.mongodb.org/browse/SERVER-44546)删除特定于移动的构建和代码工件
- [服务器-44687](https://jira.mongodb.org/browse/SERVER-44687)错误：“操作员删除”不可用：macOS 10.12中引入

### 内部人员

- [服务器-25025](https://jira.mongodb.org/browse/SERVER-25025)当WiredTiger上有数万个集合/索引时，缩短启动时间
- [服务器-38002](https://jira.mongodb.org/browse/SERVER-38002)将Pcre升级到至少8.42
- [服务器-39574](https://jira.mongodb.org/browse/SERVER-39574)在Windows上的PEMKeyFile中支持中间证书
- [服务器-40218](https://jira.mongodb.org/browse/SERVER-40218)使用expations.write在system_perf.yml中写出扩展
- [服务器-40669](https://jira.mongodb.org/browse/SERVER-40669)install_compass不应显式使用python3
- [服务器-40749](https://jira.mongodb.org/browse/SERVER-40749)在生成的任务配置文件名中包含执行
- [服务器-42014](https://jira.mongodb.org/browse/SERVER-42014)[4.0] repairDatabase在重新打开数据库之前应捕获并报告修复收集的异常
- [服务器-42961](https://jira.mongodb.org/browse/SERVER-42961)修复SLES上的拆分地平线测试
- [服务器-43079](https://jira.mongodb.org/browse/SERVER-43079)LogicalSessionCacheRefresh触发的故障点
- [服务器-43085](https://jira.mongodb.org/browse/SERVER-43085)使用SHA-256而不是SHA-1重新生成所有测试证书
- [服务器-43151](https://jira.mongodb.org/browse/SERVER-43151)value.cpp:1368聚合断言中出错
- [服务器-43241](https://jira.mongodb.org/browse/SERVER-43241)修复关机期间ARS dtor中的执行器故障
- [服务器-43319](https://jira.mongodb.org/browse/SERVER-43319)增加“并发_同时”夹具的光标超时
- [服务器-43576](https://jira.mongodb.org/browse/SERVER-43576)DBClientRS不传播applicationName
- [服务器-43577](https://jira.mongodb.org/browse/SERVER-43577)确保记录终止连接的ssl异常。
- [服务器-43741](https://jira.mongodb.org/browse/SERVER-43741)scons.py不应该吞下底层的ImportError
- [服务器-43771](https://jira.mongodb.org/browse/SERVER-43771)制作v4.0的ClockSource::waitForCondition，直到避免将Date_t::max()转换为系统时间
- [服务器-43843](https://jira.mongodb.org/browse/SERVER-43843)在回滚模糊器“restartNode”命令期间跳过验证
- [服务器-43900](https://jira.mongodb.org/browse/SERVER-43900)将stitch_support_lib_build_and_test和嵌入式_sdk_build_and_test任务组的max_hosts设置为1
- [服务器-44006](https://jira.mongodb.org/browse/SERVER-44006)将包装许可证从AGPL更改为SSPL
- [服务器-44009](https://jira.mongodb.org/browse/SERVER-44009)上传sys-perf和微基标的pip冻结输出
- [服务器-44064](https://jira.mongodb.org/browse/SERVER-44064)对MessageCompressorManager参数执行显式转换
- [服务器-44140](https://jira.mongodb.org/browse/SERVER-44140)使用没有DSI的信号处理
- [服务器-44183](https://jira.mongodb.org/browse/SERVER-44183)未能在asio插座上收听应该是致命的
- [服务器-44248](https://jira.mongodb.org/browse/SERVER-44248)[4.0] 在 disk/repair_collection_failure.js 中使用 tojson 代替 JSON.stringify
- [服务器-44312](https://jira.mongodb.org/browse/SERVER-44312)在信号处理的性能测试中指定常青授权
- [服务器-44319](https://jira.mongodb.org/browse/SERVER-44319)在Windows上跳过replica_sets/auth1.js中的keyfile检查
- [服务器-44567](https://jira.mongodb.org/browse/SERVER-44567)重新实现v4.0的CommandState析构函数
- [服务器-44568](https://jira.mongodb.org/browse/SERVER-44568)将服务器时区数据文件的嵌入式版本更新为tzdb-2019c
- [服务器-44651](https://jira.mongodb.org/browse/SERVER-44651)更新信号处理版本
- [服务器-44727](https://jira.mongodb.org/browse/SERVER-44727)检测更改不应通过run-dsi调用
- [服务器-44868](https://jira.mongodb.org/browse/SERVER-44868)Initialsync日志保存人和日志保存人-短测试应分别将快照ID和数据集链接传递给dsi（sys-perf）
- [服务器-44946](https://jira.mongodb.org/browse/SERVER-44946)在BACKPORT-4512中禁用可重启用测试
- [WT-4499](https://jira.mongodb.org/browse/WT-4499)修复光标密钥订单检查失败的准备交易
- [WT-4520](https://jira.mongodb.org/browse/WT-4520)修复光标导航期间准备事务影响
- [WT-4537](https://jira.mongodb.org/browse/WT-4537)修复WiredTiger光标在准备重试时的上一个遍历失败
- [WT-4617](https://jira.mongodb.org/browse/WT-4617)光标下一个/上一个只返回一次PREPART_CONFLICT
- [WT-4733](https://jira.mongodb.org/browse/WT-4733)更改测试/格式以进行更长期的可重复读取测试
- [WT-4844](https://jira.mongodb.org/browse/WT-4844)仅当设置的读取时间戳比最古老的时间戳旧时，才记录信息消息。
- [WT-4899](https://jira.mongodb.org/browse/WT-4899)修复更新链中可能允许多个胎记的错误
- [WT-4940](https://jira.mongodb.org/browse/WT-4940)每次更新都应设置已准备/未提交对账
- [WT-4943](https://jira.mongodb.org/browse/WT-4943)修复了可能丢弃未提交的更新的错误
- [WT-4961](https://jira.mongodb.org/browse/WT-4961)具有缓存溢出的检查点必须保留读取历史记录
- [WT-5160](https://jira.mongodb.org/browse/WT-5160)在调用rollback_to_stable之前，停止要求检查站
- [WT-5201](https://jira.mongodb.org/browse/WT-5201)将开发测试格式迁移到mongodb-4.0分支



## 4.0.13 更改日志

### 安全

[服务器-43751](https://jira.mongodb.org/browse/SERVER-43751)重新计算压缩机管理器消息参数

### 分片

- [服务器-10456](https://jira.mongodb.org/browse/SERVER-10456)获取用于查找要克隆文档的光标逻辑（在迁移中）与removeRange不同
- [服务器-36159](https://jira.mongodb.org/browse/SERVER-36159)每当八卦配置服务器opTime术语发生变化时进行记录
- [服务器-36222](https://jira.mongodb.org/browse/SERVER-36222)在shard_identity_rollback.js中调用ReplSetTest.restart是疯狂的
- [服务器-36315](https://jira.mongodb.org/browse/SERVER-36315)下台后，CSRS dist锁管理器一直试图解锁锁
- [服务器-41480](https://jira.mongodb.org/browse/SERVER-41480)块分割/合并的增量集合主要版本
- [服务器-42793](https://jira.mongodb.org/browse/SERVER-42793)自动拆分尺寸跟踪器随机初始值太低

### 复制

- [服务器-34526](https://jira.mongodb.org/browse/SERVER-34526)从repl测试中删除livenodes列表
- [服务器-37173](https://jira.mongodb.org/browse/SERVER-37173)rollbackViaRefetch应该能通过尝试放弃不存在的收藏
- [服务器-38356](https://jira.mongodb.org/browse/SERVER-38356)禁止在存在重置配置时删除oplog
- [服务器-38685](https://jira.mongodb.org/browse/SERVER-38685)如果使用内存SE并编写ConcernMajorityJournalDefault为真，则启动警告
- [服务器-39310](https://jira.mongodb.org/browse/SERVER-39310)Check canServeReadsFor in get更多
- [服务器-40009](https://jira.mongodb.org/browse/SERVER-40009)在初始同步的早期阶段设置/荣誉初始同步标志
- [服务器-40954](https://jira.mongodb.org/browse/SERVER-40954)FCV 3.6中不可恢复的回滚错误消息应建议降级到3.6
- [服务器-41218](https://jira.mongodb.org/browse/SERVER-41218)rollback_after_enabling_majority_reads.js测试在重新启动其他节点之前应确保正确的主节点[v4.0]
- [服务器-41499](https://jira.mongodb.org/browse/SERVER-41499)跟踪服务器状态中每个原因调用的选举次数
- [服务器-41500](https://jira.mongodb.org/browse/SERVER-41500)在服务器状态中跟踪每个原因的成功选举数量
- [服务器-41501](https://jira.mongodb.org/browse/SERVER-41501)在serverStatus中跟踪需要进行初步追赶的选举次数
- [服务器-41502](https://jira.mongodb.org/browse/SERVER-41502)在服务器状态中跟踪主要追赶结束的次数
- [服务器-41503](https://jira.mongodb.org/browse/SERVER-41503)跟踪目标opTime，以便在初选的replSetStatus中赶上
- [服务器-41509](https://jira.mongodb.org/browse/SERVER-41509)在服务器状态中跟踪尝试的下阶次数
- [服务器-41510](https://jira.mongodb.org/browse/SERVER-41510)在服务器状态中跟踪失败的降级次数
- [服务器-41511](https://jira.mongodb.org/browse/SERVER-41511)跟踪因在serverStatus中看到更高术语而导致的降级次数
- [服务器-41792](https://jira.mongodb.org/browse/SERVER-41792)启动副本集成员独立，恢复FromOplogAsStandalone为true，应该根据我们开始的检查点从oplog重播条目。
- [服务器-41918](https://jira.mongodb.org/browse/SERVER-41918)CollectionBulkLoader预计不会出现来自MultiIndexBlock的异常
- [服务器-42129](https://jira.mongodb.org/browse/SERVER-42129)修改测试，以考虑重新启动后临时ForTest存储引擎丢失的操作日志
- [服务器-42155](https://jira.mongodb.org/browse/SERVER-42155)表示阅读时术语不匹配Concern超时
- [服务器-42454](https://jira.mongodb.org/browse/SERVER-42454)在do_not_advance_commit_point_beyond_last_applied_term.js中禁用故障点之前，等待节点找到适当的同步源
- [服务器-42714](https://jira.mongodb.org/browse/SERVER-42714)在0级完成日志复制恢复oplog应用程序
- [服务器-42767](https://jira.mongodb.org/browse/SERVER-42767)改进ReplSetTest.stopSet中的登录
- [服务器-42910](https://jira.mongodb.org/browse/SERVER-42910)由于 afterClusterTime，时间戳较高但比同步源更低的Oplog查询不应超时
- [服务器-43230](https://jira.mongodb.org/browse/SERVER-43230)在catchup_takeover_two_nodes_ahead.js中修复比赛
- [服务器-43245](https://jira.mongodb.org/browse/SERVER-43245)在 seed_secondary_without_sessions_table.js 中等待节点在重新启动时成为辅助节点

### 查询

- [服务器-37690](https://jira.mongodb.org/browse/SERVER-37690)countDocuments在匹配0个文档时抛出错误
- [服务器-40110](https://jira.mongodb.org/browse/SERVER-40110)ClusterCursorManager::CursorEntry::isKillPending()不应调用checkForInterrupt
- [服务器-40382](https://jira.mongodb.org/browse/SERVER-40382)添加服务器状态指标以报告计划缓存内存消耗
- [服务器-41863](https://jira.mongodb.org/browse/SERVER-41863)在返回之前，让睡眠命令检查服务器时钟是否已提前
- [服务器-42749](https://jira.mongodb.org/browse/SERVER-42749)禁止server_status_with_timeout_cursors进行事务直通
- [服务器-43074](https://jira.mongodb.org/browse/SERVER-43074)在编写目录文档时，请勿使用全局变量对“multikeyPath”信息进行编码

### 储存

- [服务器-41909](https://jira.mongodb.org/browse/SERVER-41909)将ValidateCmd Genny工作负载添加到system_perf.yml
- [服务器-42398](https://jira.mongodb.org/browse/SERVER-42398)无论准备的状态如何，中止Transaction和commitTransaction命令都不应获取票据。
- [服务器-42441](https://jira.mongodb.org/browse/SERVER-42441)重命名CollectionForApplyOps应始终重命名目标（如果存在的话）
- [服务器-42652](https://jira.mongodb.org/browse/SERVER-42652)修复重命名集合的问题
- [服务器-42709](https://jira.mongodb.org/browse/SERVER-42709)更改有关启动时丢失UUID的错误消息
- [服务器-42915](https://jira.mongodb.org/browse/SERVER-42915)新风格修复的目录更正通常是假阳性，积极地将repl节点标记为损坏

### 运营

- [服务器-42257](https://jira.mongodb.org/browse/SERVER-42257)添加新的shell启动横幅
- [服务器-43081](https://jira.mongodb.org/browse/SERVER-43081)验证应该报告何时设置索引的“multikeyPaths”，但“multikey”标志是false
- [服务器-43350](https://jira.mongodb.org/browse/SERVER-43350)尝试加入集合时，服务器崩溃（使用管道进行$查找）。

### 构建和包装

- [服务器-42911](https://jira.mongodb.org/browse/SERVER-42911)通过 building.md 重建 mongodb，但由于 ModuleNotFoundError 导致无法构建：Windows 上没有名为“猎豹”的模块，上面有 MSVC
- [服务器-44114](https://jira.mongodb.org/browse/SERVER-44114)不要在Ubuntu 18.04 s390x上使用scons缓存

### 内部人员

- [服务器-37837](https://jira.mongodb.org/browse/SERVER-37837)如果没有发生书面记录，交易参与者可能永远不会被清理干净
- [服务器-38141](https://jira.mongodb.org/browse/SERVER-38141)MONGO_CONFIG_HAS_SSL_SET_ECDH_AUTO的不正确使用阻止了椭圆曲线自动协商的启用
- [服务器-38493](https://jira.mongodb.org/browse/SERVER-38493)允许可查询的存储引擎重用mongod和HTTP服务器之间的连接
- [服务器-39777](https://jira.mongodb.org/browse/SERVER-39777)在关机时验证节点之前，以高冻结超时降级节点
- [服务器-41099](https://jira.mongodb.org/browse/SERVER-41099)修复从碎片中错误传播错误以解释命令
- [服务器-41102](https://jira.mongodb.org/browse/SERVER-41102)在transiter_layer_asio_test中加入线程
- [服务器-41248](https://jira.mongodb.org/browse/SERVER-41248)确保ReplicaSetMonitor使用真正的随机数据初始化其随机状态
- [服务器-41261](https://jira.mongodb.org/browse/SERVER-41261)使用公共点后面的oplog条目来计算rollbackTimeLimitSecs
- [服务器-41802](https://jira.mongodb.org/browse/SERVER-41802)generate_resmoke_tasks不应用max_sub_suites选项
- [服务器-41939](https://jira.mongodb.org/browse/SERVER-41939)先连接到最快的LDAP服务器
- [服务器-41990](https://jira.mongodb.org/browse/SERVER-41990)Burn_in不应该对唯一钩子的平均钩子时间
- [服务器-42075](https://jira.mongodb.org/browse/SERVER-42075)将DSI模块添加到perf.yml
- [服务器-42107](https://jira.mongodb.org/browse/SERVER-42107)在isHealthy()实现中，LDAP conn池不应阻止网络
- [服务器-42178](https://jira.mongodb.org/browse/SERVER-42178)在SLES上禁用Split Horizon HOSTALIAS测试
- [服务器-42216](https://jira.mongodb.org/browse/SERVER-42216)确保pin_getmore_cursor.js等待服务器完成杀死光标
- [服务器-42476](https://jira.mongodb.org/browse/SERVER-42476)改进免费监控测试
- [服务器-42618](https://jira.mongodb.org/browse/SERVER-42618)禁用所有构建变体的旧版SCons缓存修剪
- [服务器-42706](https://jira.mongodb.org/browse/SERVER-42706)测试播种二级，没有会话或交易表
- [服务器-42814](https://jira.mongodb.org/browse/SERVER-42814)删除关于溢出文件大小配额的信息消息
- [服务器-42866](https://jira.mongodb.org/browse/SERVER-42866)在运行测试之前，对ShardedCluster测试夹具中的所有碎片触发逻辑会话缓存刷新
- [服务器-42953](https://jira.mongodb.org/browse/SERVER-42953)ttl_repl_secondary_disabled.js应该阻止选举
- [服务器-43022](https://jira.mongodb.org/browse/SERVER-43022)允许编译在rel 62上独立运行
- [服务器-43186](https://jira.mongodb.org/browse/SERVER-43186)限制添加到生成套件的测试数量
- [服务器-43200](https://jira.mongodb.org/browse/SERVER-43200)使auth/mongoURIAuth.js对慢速命令进行鲁棒
- [服务器-43240](https://jira.mongodb.org/browse/SERVER-43240)在v4.0 mongo中将DSI和mongo-perf模块添加到MMAP构建变体中
- [服务器-43582](https://jira.mongodb.org/browse/SERVER-43582)不要尝试对ReplicaSet Monitor进行身份验证
- [服务器-43634](https://jira.mongodb.org/browse/SERVER-43634)报告丢失的scons的不同错误，但无法导入scons
- [WT-4502](https://jira.mongodb.org/browse/WT-4502)断言检查页面上的危险指针太强了
- [WT-4792](https://jira.mongodb.org/browse/WT-4792)添加统计信息以跟踪LRU排序后排队驱逐的页面
- [WT-4840](https://jira.mongodb.org/browse/WT-4840)WT_CURSOR.modify必须需要显式快照隔离事务
- [WT-4869](https://jira.mongodb.org/browse/WT-4869)当驱逐落后时，停止增加缓存压力
- [WT-4881](https://jira.mongodb.org/browse/WT-4881)放松对重新进入和解的限制
- [WT-4882](https://jira.mongodb.org/browse/WT-4882)当有大型元数据页面时，提高检查点性能
- [WT-4892](https://jira.mongodb.org/browse/WT-4892)改进关于强迫驱逐的统计数据
- [WT-4893](https://jira.mongodb.org/browse/WT-4893)修复树中内部页面子页面驱逐检查和光标之间的竞争
- [WT-4895](https://jira.mongodb.org/browse/WT-4895)修复调试驱逐模式，以便它更随机地选择倾斜
- [WT-4898](https://jira.mongodb.org/browse/WT-4898)如果很忙，不要让驱逐服务器进行对调和
- [WT-4920](https://jira.mongodb.org/browse/WT-4920)当驱逐服务器等待页面转换时添加统计跟踪
- [WT-4956](https://jira.mongodb.org/browse/WT-4956)处理对页面进行40亿次更新而未驱逐的情况
- [WT-4957](https://jira.mongodb.org/browse/WT-4957)恢复关于页面何时排队进行紧急驱逐的部分更改
- [WT-5050](https://jira.mongodb.org/browse/WT-5050)紧急驱逐元数据页面时断言失败
- [WT-5074](https://jira.mongodb.org/browse/WT-5074)修复异国情调架构的“检查”



## 4.0.12 更改日志

### 安全

[服务器-41587](https://jira.mongodb.org/browse/SERVER-41587)改进SECBUFFER_EXTRA处理

### 分片

[服务器-36394](https://jira.mongodb.org/browse/SERVER-36394)当自动拆分=false或拆分矢量返回太少的拆分点时，蒙古人应该重置块大小跟踪信息

### 复制

[服务器-42467](https://jira.mongodb.org/browse/SERVER-42467)initial_sync_test_fixture_test假设有线老虎

### 查询

[服务器-41829](https://jira.mongodb.org/browse/SERVER-41829)findAndModify忽略了不是对象的过滤器表达式

### 运营

[服务器-41152](https://jira.mongodb.org/browse/SERVER-41152)身份验证机制字符串中的空格至少应该产生警告消息

### 构建和包装

- [服务器-42173](https://jira.mongodb.org/browse/SERVER-42173)将Ubuntu 14.04添加到v4.0
- [服务器-42603](https://jira.mongodb.org/browse/SERVER-42603)最近更改的服务文件可能会导致循环依赖项

### 内部人员

- [服务器-35114](https://jira.mongodb.org/browse/SERVER-35114)可以调整周期性运行器中的活跃工作周期
- [服务器-38395](https://jira.mongodb.org/browse/SERVER-38395)导入某些resmokelib模块时，Python全局日志记录器受到污染
- [服务器-39348](https://jira.mongodb.org/browse/SERVER-39348)TLASIO单元测试中的清洁发布会话
- [服务器-39928](https://jira.mongodb.org/browse/SERVER-39928)停止每晚在驱动程序中使用Python 2.6测试PyMongo
- [服务器-39936](https://jira.mongodb.org/browse/SERVER-39936)使用 PeriodicRunner 手柄简化关机顺序
- [服务器-40899](https://jira.mongodb.org/browse/SERVER-40899)不允许在change_stream_update_lookup_read_concern.js中进行链式
- [服务器-42061](https://jira.mongodb.org/browse/SERVER-42061)在ESE中验证解密的有效负载
- [WT-4878](https://jira.mongodb.org/browse/WT-4878)禁用随机处理选择和微调驱逐目标计算
- [WT-4913](https://jira.mongodb.org/browse/WT-4913)在未对齐8B和/或8B倍数的块上修复Windows CRC32



## 4.0.11 更改日志

### 安全

- [服务器-41069](https://jira.mongodb.org/browse/SERVER-41069)能够通过x509扩展禁用授权
- [服务器-41441](https://jira.mongodb.org/browse/SERVER-41441)将静态OpenSSL升级到1.1.1c

### 分片

- [服务器-26531](https://jira.mongodb.org/browse/SERVER-26531)当拥有它的碎片捐赠一块时，块状的巨型旗帜可以清除
- [服务器-36004](https://jira.mongodb.org/browse/SERVER-36004)SessionUpdateTracker应该忽略映像前/后操作日志的无操作条目
- [服务器-36443](https://jira.mongodb.org/browse/SERVER-36443)长期运行的查询不应导致未使用的ChunkManager对象的堆积
- [服务器-36469](https://jira.mongodb.org/browse/SERVER-36469)shard_kill_and_pooling没有查询它应该查询的碎片
- [服务器-38457](https://jira.mongodb.org/browse/SERVER-38457)实际上在可重试写入测试中修复比赛条件
- [服务器-39756](https://jira.mongodb.org/browse/SERVER-39756)分分一个非常大的收藏可能会导致针对这个集合的大量书写
- [服务器-40346](https://jira.mongodb.org/browse/SERVER-40346)使用BatchWriter编写shardCollection初始块
- [服务器-40535](https://jira.mongodb.org/browse/SERVER-40535)如果在ReplicaSet中读取签名密钥时使用ReadConcern级别：local，则可以获得不存在的密钥
- [服务器-41575](https://jira.mongodb.org/browse/SERVER-41575)secondary_shard_versioning.js不应将碎片次要投票设置为0
- [服务器-41859](https://jira.mongodb.org/browse/SERVER-41859)logical_time_metadata.js不应该假设lastApplied opTime等于$clusterTime
- [服务器-41866](https://jira.mongodb.org/browse/SERVER-41866)CatalogCache中的反向互斥获取顺序::_scheduleDatabaseRefresh
- [服务器-41867](https://jira.mongodb.org/browse/SERVER-41867)CatalogCache::_scheduleDatabaseRefresh/_scheduleCollectionRefresh可以尝试抓取它已经拥有的_mutex
- [服务器-41869](https://jira.mongodb.org/browse/SERVER-41869)CatalogCache::_scheduleCollectionRefresh中的反向互斥获取顺序
- [服务器-42024](https://jira.mongodb.org/browse/SERVER-42024)shards_and_config_return_last_committed_optime.js不应假设响应中的opTime等于元数据中的opTime

### 复制

- [服务器-37065](https://jira.mongodb.org/browse/SERVER-37065)报告 ismaster：在学习新术语后立即在 isMaster 命令响应中进行false
- [服务器-38659](https://jira.mongodb.org/browse/SERVER-38659)IsMasterIsFalseDuringStepdown单元测试中的比赛条件
- [服务器-40248](https://jira.mongodb.org/browse/SERVER-40248)OplogEntry的getOperationToApply（）返回错误的更新字段
- [服务器-40336](https://jira.mongodb.org/browse/SERVER-40336)ReplicationCoordinatorImpl::_random对同时启动的复制集成员不稳健壮
- [服务器-41036](https://jira.mongodb.org/browse/SERVER-41036)Make ReadWriteAbility::_canAcceptNonLocalWrites AtomicWord<bool>以防止读取撕裂。
- [服务器-41342](https://jira.mongodb.org/browse/SERVER-41342)read_committed_stale_history.js必须执行连续写入，以确保大多数提交点传播到次要
- [服务器-41497](https://jira.mongodb.org/browse/SERVER-41497)为ElectelectMetrics、ElectCandidateMetrics和ElectlectParticipant指标创建IDL类型
- [服务器-41498](https://jira.mongodb.org/browse/SERVER-41498)创建复制指标类
- [服务器-42055](https://jira.mongodb.org/browse/SERVER-42055)仅获取集合IX锁来编写lastVote文档

### 查询

- [服务器-40134](https://jira.mongodb.org/browse/SERVER-40134)当不同的路径是多键时，针对视图的不同命令可能会返回错误的结果
- [服务器-40869](https://jira.mongodb.org/browse/SERVER-40869)用日期减去可能会导致未定义的行为
- [服务器-41065](https://jira.mongodb.org/browse/SERVER-41065)通过传递“变量”作为参数，使agg evaluate()线程安全
- [服务器-42079](https://jira.mongodb.org/browse/SERVER-42079)所有非主启动的索引构建都应标记为背景中级

### 集合

- [服务器-40383](https://jira.mongodb.org/browse/SERVER-40383)如果isoWeek小于1，dateFromParts不会正确溢出
- [服务器-41785](https://jira.mongodb.org/browse/SERVER-41785)提高change_streams_resume_same_clustertime_different_uuid.js的鲁棒性
- [服务器-42232](https://jira.mongodb.org/browse/SERVER-42232)添加新碎片会使之前的所有简历令牌无效

### 储存

- [服务器-41351](https://jira.mongodb.org/browse/SERVER-41351)改进了未能获得存储统计收集锁的错误消息
- [服务器-41533](https://jira.mongodb.org/browse/SERVER-41533)删除不必要的IndexConsistency::_classMutex
- [服务器-41534](https://jira.mongodb.org/browse/SERVER-41534)在RecordStoreValidateAdaptor中重用KeyString
- [服务器-41535](https://jira.mongodb.org/browse/SERVER-41535)使用矢量代替地图进行IndexConsistency::_indexesInfo
- [服务器-41536](https://jira.mongodb.org/browse/SERVER-41536)使用矢量而不是地图进行索引一致性哈希桶
- [服务器-41537](https://jira.mongodb.org/browse/SERVER-41537)使用64K哈希桶而不是4M进行索引验证
- [服务器-41538](https://jira.mongodb.org/browse/SERVER-41538)在IndexConsistency中通过indexNumber删除间接
- [服务器-41539](https://jira.mongodb.org/browse/SERVER-41539)IndexInfo中的缓存密钥排序
- [服务器-41540](https://jira.mongodb.org/browse/SERVER-41540)修复_indexNsResults地图使用
- [服务器-41541](https://jira.mongodb.org/browse/SERVER-41541)在IndexInfo中为RecordStoreValidateAdaptor放置一个KeyString

#### 有线老虎

- [服务器-41913](https://jira.mongodb.org/browse/SERVER-41913)避免对记录的集合进行就地修改操作

### 运营

- [服务器-36099](https://jira.mongodb.org/browse/SERVER-36099)对于大型安装来说，蒙古的FTDC规模大得令人无法使用
- [服务器-41632](https://jira.mongodb.org/browse/SERVER-41632)db.collection.getShardDistribution() 显示NaN

### 构建和包装

- [服务器-36043](https://jira.mongodb.org/browse/SERVER-36043)mongod的系统单元在multi.user目标之前开始
- [服务器-39465](https://jira.mongodb.org/browse/SERVER-39465)将master android builds更新为r19 NDK
- [服务器-40133](https://jira.mongodb.org/browse/SERVER-40133)创建供应商第三方库的Markdown描述
- [服务器-40563](https://jira.mongodb.org/browse/SERVER-40563)我们的init脚本检查/proc/[pid]/stat应该验证`(${procname})`是进程的命令名称。
- [服务器-41039](https://jira.mongodb.org/browse/SERVER-41039)Android和java多架构构建器在配置扩展期间无法导入yaml
- [服务器-41302](https://jira.mongodb.org/browse/SERVER-41302)解除对从4.2分支发布嵌入式SDK的限制
- [服务器-41424](https://jira.mongodb.org/browse/SERVER-41424)如果使用错误的Python解释器调用scons，则应提前失败
- [服务器-41443](https://jira.mongodb.org/browse/SERVER-41443)更新企业许可证
- [服务器-41568](https://jira.mongodb.org/browse/SERVER-41568)更新2019年6月6日的第三方内容
- [服务器-42233](https://jira.mongodb.org/browse/SERVER-42233)Bump Windows软件包依赖项

### 内部人员

- [服务器-26626](https://jira.mongodb.org/browse/SERVER-26626)在external_auth_WT JSTests中，确保Saslauthd在继续测试之前已完全启动
- [服务器-33589](https://jira.mongodb.org/browse/SERVER-33589)创建初始同步模糊器套件
- [服务器-35067](https://jira.mongodb.org/browse/SERVER-35067)Blacklist explain2.js from retryable writes jscore stepdown suite
- [服务器-37984](https://jira.mongodb.org/browse/SERVER-37984)升级yaml-cpp >= 0.6.0
- [服务器-39480](https://jira.mongodb.org/browse/SERVER-39480)在DBClientConnection中记录网络故障状态
- [服务器-39642](https://jira.mongodb.org/browse/SERVER-39642)当范围连接未返回池时，减少出口计数器
- [服务器-40052](https://jira.mongodb.org/browse/SERVER-40052)蒙古的关机可以触发BatchWriteOp不变
- [服务器-40156](https://jira.mongodb.org/browse/SERVER-40156)Split Horizon的初始实现
- [服务器-40295](https://jira.mongodb.org/browse/SERVER-40295)向 stage_builder.cpp 不变消息添加详细信息
- [服务器-40643](https://jira.mongodb.org/browse/SERVER-40643)使用Split Horizon添加`replSetConfig`和`replSetInitiate`的测试
- [服务器-40645](https://jira.mongodb.org/browse/SERVER-40645)添加Split Horizon的SNI/TLS行为测试
- [服务器-40738](https://jira.mongodb.org/browse/SERVER-40738)在进行Android移动构建时，不要尝试上传常青tarball
- [服务器-40923](https://jira.mongodb.org/browse/SERVER-40923)从“run jstestfuzz” Evergreen 函数中删除 npm 测试命令
- [服务器-40924](https://jira.mongodb.org/browse/SERVER-40924)将Evergreen任务添加到理智检查模糊器可以解析JavaScript测试
- [服务器-41004](https://jira.mongodb.org/browse/SERVER-41004)killSessions命令可以返回CursorNotFound错误以成功杀死
- [服务器-41013](https://jira.mongodb.org/browse/SERVER-41013)使lock_stats.js测试对未设置的统计数据更具弹性
- [服务器-41016](https://jira.mongodb.org/browse/SERVER-41016)计算大型文档更新的增量
- [服务器-41047](https://jira.mongodb.org/browse/SERVER-41047)errnoWithDescription总是在Linux上返回“未知错误”
- [服务器-41062](https://jira.mongodb.org/browse/SERVER-41062)当事务太大而无法容纳单个应用时，请务必返回TransactionTooLarge而不是BSONObjectTooLarge
- [服务器-41075](https://jira.mongodb.org/browse/SERVER-41075)从操作上下文包含路径中删除'mongo/repl/replication_coordinator.h'
- [服务器-41096](https://jira.mongodb.org/browse/SERVER-41096)ContinuousStepdown线程和resmoke runner无法在“降级允许的文件”和“降级文件”上正确同步
- [服务器-41131](https://jira.mongodb.org/browse/SERVER-41131)添加StrongWeakFinishLine
- [服务器-41148](https://jira.mongodb.org/browse/SERVER-41148)FTDC正在调用boost::filesystem，而没有传递error_code参数
- [服务器-41164](https://jira.mongodb.org/browse/SERVER-41164)在db名称中使用'|'管道时，更改流管道正则表达式匹配错误的操作日志文档
- [服务器-41169](https://jira.mongodb.org/browse/SERVER-41169)Linux的大多数动力循环测试都已从Evergreen中删除
- [服务器-41184](https://jira.mongodb.org/browse/SERVER-41184)添加指标，以指示查询中仅使用_id完成的分片更新数量
- [服务器-41349](https://jira.mongodb.org/browse/SERVER-41349)为缓慢的dns分辨率添加日志语句
- [服务器-41361](https://jira.mongodb.org/browse/SERVER-41361)在已经将PBWM锁放在次调时，不要最后阅读应用
- [服务器-41401](https://jira.mongodb.org/browse/SERVER-41401)patch_files.txt不区分企业文件和社区文件
- [服务器-41432](https://jira.mongodb.org/browse/SERVER-41432)创建失败点，启用时使$expr计算为false，而不是在遇到无效表达式时出错
- [服务器-41442](https://jira.mongodb.org/browse/SERVER-41442)在umask.js中修复第二场比赛
- [服务器-41546](https://jira.mongodb.org/browse/SERVER-41546)SysV init脚本应该验证PIDfile的存在，而不是失败
- [服务器-41680](https://jira.mongodb.org/browse/SERVER-41680)传播${branch_name}常青扩展到模糊调用
- [服务器-41702](https://jira.mongodb.org/browse/SERVER-41702)在AutoGetCollectionForRead中生成锁之前复制集合命名空间字符串
- [服务器-41753](https://jira.mongodb.org/browse/SERVER-41753)修复indexc.js，不要依赖时钟总是向前移动
- [服务器-41789](https://jira.mongodb.org/browse/SERVER-41789)sys-perf：在bootstrap.yml配置文件中使用bootstrap.overrides
- [服务器-41828](https://jira.mongodb.org/browse/SERVER-41828)确保LDAP conn池更喜欢首先列出的ldap服务器
- [服务器-41833](https://jira.mongodb.org/browse/SERVER-41833)更新README许可证文本
- [服务器-41862](https://jira.mongodb.org/browse/SERVER-41862)使用于拆分重新吸烟任务生成的文件可选
- [服务器-41897](https://jira.mongodb.org/browse/SERVER-41897)使用assert.sameMembers比较jstests/ssl/libs/ssl_x509_role_auth.js中的两个集合
- [服务器-41967](https://jira.mongodb.org/browse/SERVER-41967)Symlink/data到Z而不是C
- [服务器-42002](https://jira.mongodb.org/browse/SERVER-42002)db/coll名称中正则表达式字符的JSTest应遵守系统差异
- [服务器-42195](https://jira.mongodb.org/browse/SERVER-42195)当使用--repeat >1运行时，Stepdown套件在Python异常的情况下失败
- [服务器-42228](https://jira.mongodb.org/browse/SERVER-42228)LoggerRuntimeConfigError异常可能导致后台dbhash线程运行，直到Evergreen任务超时
- [WT-4477](https://jira.mongodb.org/browse/WT-4477)添加驱逐调试模式和额外的检查
- [WT-4690](https://jira.mongodb.org/browse/WT-4690)确保驱逐在检查站期间不会分裂
- [WT-4706](https://jira.mongodb.org/browse/WT-4706)添加统计数据来跟踪旁表尺寸
- [WT-4712](https://jira.mongodb.org/browse/WT-4712)为未记录的表添加调试日志操作记录
- [WT-4723](https://jira.mongodb.org/browse/WT-4723)重组对账代码
- [WT-4760](https://jira.mongodb.org/browse/WT-4760)检查点不应通过稳定的更新读取
- [WT-4776](https://jira.mongodb.org/browse/WT-4776)修改操作应等同于更新
- [WT-4803](https://jira.mongodb.org/browse/WT-4803)为缓存溢出机制实现file_max配置
- [WT-4817](https://jira.mongodb.org/browse/WT-4817)时间戳中的堆缓冲区溢出故障
- [WT-4823](https://jira.mongodb.org/browse/WT-4823)添加未初始化的旁白资源的检查
- [WT-4827](https://jira.mongodb.org/browse/WT-4827)当读取截断的页面时应用提交时间戳
- [WT-4848](https://jira.mongodb.org/browse/WT-4848)修复计算差异时的perf回归



## 4.0.10 更改日志

### 安全

- [服务器-38217](https://jira.mongodb.org/browse/SERVER-38217)考虑在审计日志中记录杀死光标的失败尝试
- [服务器-39864](https://jira.mongodb.org/browse/SERVER-39864)在SASL Start中将主体名称提取移动到错误处理程序
- [服务器-40226](https://jira.mongodb.org/browse/SERVER-40226)将静态OpenSSL升级到1.1.1b
- [服务器-40393](https://jira.mongodb.org/browse/SERVER-40393)在ASIO中禁用SSL_MODE_RELEASE_BUFFERS
- [服务器-40817](https://jira.mongodb.org/browse/SERVER-40817)在RoleGraphUpdate中处理角色集合的createIndexes

### 分片

- [服务器-36355](https://jira.mongodb.org/browse/SERVER-36355)改进了并非所有文档中都存在碎片键时的错误消息
- [服务器-36457](https://jira.mongodb.org/browse/SERVER-36457)mongos_rs_shard_failure_tolerance.js测试应该断言movePrimary命令成功
- [服务器-39420](https://jira.mongodb.org/browse/SERVER-39420)删除内存布尔值，以指示config.server.sessions集合设置
- [服务器-40318](https://jira.mongodb.org/browse/SERVER-40318)NamespaceSerializer::lock中的条件变量等待不是例外安全
- [服务器-40346](https://jira.mongodb.org/browse/SERVER-40346)使用BatchWriter编写shardCollection初始块

### 复制

- [服务器-35636](https://jira.mongodb.org/browse/SERVER-35636)重命名applyOps的集合需要检查目标命名空间的完整性
- [服务器-39221](https://jira.mongodb.org/browse/SERVER-39221)启用MajorityReadConcern升级/降级后的测试回滚
- [服务器-39672](https://jira.mongodb.org/browse/SERVER-39672)多语句事务中的ReadConcern级别默认为“快照”
- [服务器-39831](https://jira.mongodb.org/browse/SERVER-39831)如果从同步源学习，切勿更新超过上次应用的提交点
- [服务器-40068](https://jira.mongodb.org/browse/SERVER-40068)来自 replica_sets_jscore_passthrough.yml 取消黑名单 kill_sessions_kills_transaction.js
- [服务器-40329](https://jira.mongodb.org/browse/SERVER-40329)以TXN详细程度级别记录所有交易>= 1
- [服务器-40335](https://jira.mongodb.org/browse/SERVER-40335)不要在ReplSetTest.stopSet()中等待选举交接
- [服务器-40628](https://jira.mongodb.org/browse/SERVER-40628)在replsetprio1.js设置下，初始同步可能会失败
- [服务器-40788](https://jira.mongodb.org/browse/SERVER-40788)改进围绕复制追赶的日志记录
- [服务器-40839](https://jira.mongodb.org/browse/SERVER-40839)为空的未准备事务添加测试
- [服务器-40855](https://jira.mongodb.org/browse/SERVER-40855)run_check_repl_dbhash_background.js，大多数读取关注为false必须允许缺少多数操作时间
- [服务器-40976](https://jira.mongodb.org/browse/SERVER-40976)rollback_after_enabling_majority_reads.js不应在mmapv1上运行
- [服务器-41006](https://jira.mongodb.org/browse/SERVER-41006)使relbatchlimitbytes可配置
- [服务器-41081](https://jira.mongodb.org/browse/SERVER-41081)do_not_advance_commit_point_beyond_last_applied_term.js必须等待节点E到达stopReplProducerOnDocument failpoint

### 查询

[服务器-40618](https://jira.mongodb.org/browse/SERVER-40618)从因果一致的jscore直通中删除removec.js

### 储存

- [服务器-30356](https://jira.mongodb.org/browse/SERVER-30356)改进验证的错误报告
- [服务器-32709](https://jira.mongodb.org/browse/SERVER-32709)移动SE：索引创建需要很长时间
- [服务器-40786](https://jira.mongodb.org/browse/SERVER-40786)改进IndexCatalog::dropAllIndexes()中的错误消息
- [服务器-41213](https://jira.mongodb.org/browse/SERVER-41213)独特的后台索引构建可能会产生不一致的键

### 运营

- [服务器-34621](https://jira.mongodb.org/browse/SERVER-34621)如果客户尝试重新谈判，请记录
- [服务器-38625](https://jira.mongodb.org/browse/SERVER-38625)改进Atlas用户未配置IP白名单时的shell错误处理
- [服务器-38867](https://jira.mongodb.org/browse/SERVER-38867)“显示集合”不再列出系统。*集合
- [服务器-39820](https://jira.mongodb.org/browse/SERVER-39820)将客户端IP地址添加到成功的身份验证日志消息中
- [服务器-40112](https://jira.mongodb.org/browse/SERVER-40112)db.disableFreeMonitoring()即使在rs.slaveOk()之后，在二级返回“不是主”
- [服务器-40423](https://jira.mongodb.org/browse/SERVER-40423)当“计数”作为事务中的第一个命令运行时，误导性错误消息
- [服务器-40866](https://jira.mongodb.org/browse/SERVER-40866)使用JSON.stringify()在tojson()中序列化字符串

### 构建和包装

- [服务器-37765](https://jira.mongodb.org/browse/SERVER-37765)平台支持：删除Ubuntu 14.04
- [服务器-39025](https://jira.mongodb.org/browse/SERVER-39025)Windows MSI无人值守安装缺少带有ADDLOCAL的mongod.exe
- [服务器-40242](https://jira.mongodb.org/browse/SERVER-40242)更新供应商工具的横幅包含
- [服务器-40491](https://jira.mongodb.org/browse/SERVER-40491)更新Debian 8图像进行软件包测试
- [服务器-41038](https://jira.mongodb.org/browse/SERVER-41038)MONGO_VERSION的git描述结果因git版本而异

### 内部人员

- [服务器-39869](https://jira.mongodb.org/browse/SERVER-39869)系统性能：在所有任务中启用身份验证
- [服务器-40166](https://jira.mongodb.org/browse/SERVER-40166)Force BG时钟现在== Date_t::lastNow
- [服务器-40246](https://jira.mongodb.org/browse/SERVER-40246)为光标管理器sys perf工作负载创建常青任务
- [服务器-40344](https://jira.mongodb.org/browse/SERVER-40344)将ASAN建筑商升级到Ubuntu 18.04
- [服务器-40514](https://jira.mongodb.org/browse/SERVER-40514)BufferedHandler.close()和BufferedHandler.flush()之间的竞争导致resmoke.py挂在--log=buildlogger上
- [服务器-40553](https://jira.mongodb.org/browse/SERVER-40553)在listCollections中过滤未经授权的视图
- [服务器-40654](https://jira.mongodb.org/browse/SERVER-40654)不要覆盖PPC上生成任务的超时
- [服务器-40704](https://jira.mongodb.org/browse/SERVER-40704)在动态设置最小值时有更好的任务超时
- [服务器-40720](https://jira.mongodb.org/browse/SERVER-40720)提高看门狗保险丝测试的可靠性
- [服务器-40758](https://jira.mongodb.org/browse/SERVER-40758)增加可用于logical_session_cache_replication*任务的内存量
- [服务器-40840](https://jira.mongodb.org/browse/SERVER-40840)在ssl_cert_password.js中禁用工具测试
- [服务器-40889](https://jira.mongodb.org/browse/SERVER-40889)free_monitoring测试应该使用virtualenv
- [服务器-40922](https://jira.mongodb.org/browse/SERVER-40922)将npm安装命令添加到“run jstestfuzz”常青函数
- [服务器-40932](https://jira.mongodb.org/browse/SERVER-40932)增加关闭ServiceExecutor的超时
- [服务器-41088](https://jira.mongodb.org/browse/SERVER-41088)传播常青订单字段到雪松进行系统性能
- [服务器-41103](https://jira.mongodb.org/browse/SERVER-41103)修复模糊器任务调用
- [工具-2068](https://jira.mongodb.org/browse/TOOLS-2068)mongodump oplog延迟
- [工具-2290](https://jira.mongodb.org/browse/TOOLS-2290)mongorestore不应将集合名称中的%视为URL转义字符
- [WT-4352](https://jira.mongodb.org/browse/WT-4352)在更多情况下解决驱逐期间的胎记
- [WT-4631](https://jira.mongodb.org/browse/WT-4631)始终清除交易的读取时间戳
- [WT-4687](https://jira.mongodb.org/browse/WT-4687)查询all_committed不应该得到零时间戳
- [WT-4693](https://jira.mongodb.org/browse/WT-4693)WT_CONNECTION::reconfigure降级时不需要安静
- [WT-4750](https://jira.mongodb.org/browse/WT-4750)当文件关闭并重新打开时，Sweep可以删除活跃的旁白记录
- [WT-4759](https://jira.mongodb.org/browse/WT-4759)当旧的溢出值被丢弃时，保存副本
- [WT-4768](https://jira.mongodb.org/browse/WT-4768)不一致的数据，旁望驱逐，然后横扫
- [WT-4769](https://jira.mongodb.org/browse/WT-4769)不要丢弃空页的活动历史记录
- [WT-4794](https://jira.mongodb.org/browse/WT-4794)Mark lookaside历史在所有路径中都解决了
- [WT-4796](https://jira.mongodb.org/browse/WT-4796)增强跟踪参考状态过渡的诊断程序



## 4.0.9 更改日志

### 安全

[服务器-38945](https://jira.mongodb.org/browse/SERVER-38945)SSL性能回归

### 分片

[服务器-40333](https://jira.mongodb.org/browse/SERVER-40333)碎片集合上的每个碎片只克隆一次集合选项

### 复制

- [服务器-39278](https://jira.mongodb.org/browse/SERVER-39278)等待回滚完成，然后在transient_txn_error_labels_with_write_concern.js中结束会话
- [服务器-39672](https://jira.mongodb.org/browse/SERVER-39672)多语句事务中的ReadConcern级别默认为“快照”
- [服务器-40039](https://jira.mongodb.org/browse/SERVER-40039)在initial_sync_invalid_index_spec.js中增加 assert.soon超时
- [服务器-40298](https://jira.mongodb.org/browse/SERVER-40298)在4.0上跟踪交易大小

### 查询

- [服务器-38949](https://jira.mongodb.org/browse/SERVER-38949){$ne: ["String"]}查询的索引边界不正确
- [服务器-40391](https://jira.mongodb.org/browse/SERVER-40391)删除低值expn2.js测试

### 储存

- [服务器-16571](https://jira.mongodb.org/browse/SERVER-16571)当它们不同时，使用实际内存约束与系统总内存
- [服务器-39026](https://jira.mongodb.org/browse/SERVER-39026)使用正确的类型检索WiredTiger统计数据
- [服务器-39654](https://jira.mongodb.org/browse/SERVER-39654)未记录缓慢交易的存储统计信息
- [服务器-40390](https://jira.mongodb.org/browse/SERVER-40390)Blacklist skip_repairing_fcv.js从4.0上的mmapv1运行

### 运营

- [服务器-40131](https://jira.mongodb.org/browse/SERVER-40131)Windows stacktrace生成器中的格式字符串不正确。
- [服务器-40259](https://jira.mongodb.org/browse/SERVER-40259)包括ASIO和变体的第三方通知

### 构建和包装

[服务器-36622](https://jira.mongodb.org/browse/SERVER-36622)较新的Ubuntu的软件包测试失败

### 内部人员

- [服务器-34260](https://jira.mongodb.org/browse/SERVER-34260)能够重用从mongod到LDAP服务器的单个TCP连接
- [服务器-38239](https://jira.mongodb.org/browse/SERVER-38239)定义和实现获取存储界面的操作统计信息
- [服务器-38240](https://jira.mongodb.org/browse/SERVER-38240)扩展OpDebug对象以支持存储统计信息
- [服务器-38243](https://jira.mongodb.org/browse/SERVER-38243)测试会话存储统计信息是慢操作报告的一部分
- [服务器-38649](https://jira.mongodb.org/browse/SERVER-38649)添加AlarmScheduler和AlarmRunner用于通用警报
- [服务器-38984](https://jira.mongodb.org/browse/SERVER-38984)将ID附加给用户
- [服务器-39061](https://jira.mongodb.org/browse/SERVER-39061)修复wt_operation_stats测试以等待操作日志出现
- [服务器-39178](https://jira.mongodb.org/browse/SERVER-39178)在MongoURI中谈判SCRAM机制::connect()
- [服务器-39361](https://jira.mongodb.org/browse/SERVER-39361)将收集存储引擎统计信息与关机同步
- [服务器-39488](https://jira.mongodb.org/browse/SERVER-39488)测试在配置文件输出中没有看到存储统计信息。
- [服务器-39764](https://jira.mongodb.org/browse/SERVER-39764)使用嵌入式数组否定$in可能会错误地从缓存中计划，触发不变
- [服务器-39869](https://jira.mongodb.org/browse/SERVER-39869)系统性能：在所有任务中启用身份验证
- [服务器-39934](https://jira.mongodb.org/browse/SERVER-39934)CurOp::completeAndLogOperation不应等待全局锁定
- [服务器-40341](https://jira.mongodb.org/browse/SERVER-40341)通过ConnectionPool接口线程SSL连接模式
- [WT-4324](https://jira.mongodb.org/browse/WT-4324)确保检查站将来会用数据重写页面
- [WT-4554](https://jira.mongodb.org/browse/WT-4554)增强WT打捞，以处理损坏的WiredTiger.turtle案件
- [WT-4619](https://jira.mongodb.org/browse/WT-4619)覆盖范围111398：内存泄漏



## 4.0.8 更改日志

### 安全

[服务器-39217](https://jira.mongodb.org/browse/SERVER-39217)TLS中间CA证书不适用于macOS和4.0.5

### 分片

[服务器-35219](https://jira.mongodb.org/browse/SERVER-35219)通过会话重新获得MongoDB平衡器性能

### 复制

- [服务器-37255](https://jira.mongodb.org/browse/SERVER-37255)具有并发选择的replSetReconfig可以触发不变
- [服务器-38994](https://jira.mongodb.org/browse/SERVER-38994)在SIGTERM上下台
- [服务器-40194](https://jira.mongodb.org/browse/SERVER-40194)在4.0上恢复SERVER-33248
- [服务器-40355](https://jira.mongodb.org/browse/SERVER-40355)包含_id大于节点数量的rs.config将崩溃

### 查询

[服务器-39903](https://jira.mongodb.org/browse/SERVER-39903)对于内部使用的命名空间，应忽略 notablescan 参数

### 储存

[服务器-40024](https://jira.mongodb.org/browse/SERVER-40024)在辅助上重命名集合可以设置集合最小可见快照时间戳在后台索引构建的幽灵提交集群时间戳后向后

### 运营

[服务器-37722](https://jira.mongodb.org/browse/SERVER-37722)静音模式不会抑制连接结束事件

### 构建和包装

[服务器-35628](https://jira.mongodb.org/browse/SERVER-35628)运行时链接失败，不会导致安卓模拟器测试失败

### 工具

[工具-2229](https://jira.mongodb.org/browse/TOOLS-2229)当未能将put_id与exed_id一起使用时，Mongofiles会删除现有文件的块

### 内部人员

- [服务器-34286](https://jira.mongodb.org/browse/SERVER-34286)noPassthrough/currentop_query.js在Amazon Linux 2上失败
- [服务器-36750](https://jira.mongodb.org/browse/SERVER-36750)内存变体中ppc64le上的黑名单 memory.js
- [服务器-37389](https://jira.mongodb.org/browse/SERVER-37389)出于不同的连接故障原因提供不同的消息
- [服务器-38644](https://jira.mongodb.org/browse/SERVER-38644)防止短暂的文件在掩码测试期间消失
- [服务器-39580](https://jira.mongodb.org/browse/SERVER-39580)[4.0]如果主要版本太低，请跳过修复FCV文档
- [服务器-40154](https://jira.mongodb.org/browse/SERVER-40154)change_streams_resume_at_same_clustertime.js不应承担更改顺序
- [服务器-40233](https://jira.mongodb.org/browse/SERVER-40233)将交易寿命限制秒从3小时提高到24小时
- [服务器-40305](https://jira.mongodb.org/browse/SERVER-40305)将诊断日志添加到max_time_ms.js



## 4.0.7 更改日志

### 安全

- [服务器-36606](https://jira.mongodb.org/browse/SERVER-36606)删除BSON审计事件的大小限制
- [服务器-39202](https://jira.mongodb.org/browse/SERVER-39202)改进关键容器名称的确定性计算
- [服务器-39571](https://jira.mongodb.org/browse/SERVER-39571)mongod无法验证CNG提供商的证书

### 分片

- [服务器-36901](https://jira.mongodb.org/browse/SERVER-36901)sh.status()“上次报告的错误：”实际上是第5条最新错误消息
- [服务器-36958](https://jira.mongodb.org/browse/SERVER-36958)`_configsvrShardCollection`命令的部分内容不会重试网络错误
- [服务器-37591](https://jira.mongodb.org/browse/SERVER-37591)在`startClone`完成之前，MigrationSourceManager不是例外安全的
- [服务器-38192](https://jira.mongodb.org/browse/SERVER-38192)忽略刷新LogicalSessionCacheNow的重复密钥错误
- [服务器-38205](https://jira.mongodb.org/browse/SERVER-38205)为巨型块外壳优化splitVector
- [服务器-38387](https://jira.mongodb.org/browse/SERVER-38387)agg_out.js并发工作负载总是无法分片输出集合
- [服务器-39203](https://jira.mongodb.org/browse/SERVER-39203)failcommand_ignores_internal.js对mongod 3.6失败
- [服务器-39847](https://jira.mongodb.org/browse/SERVER-39847)当目标碎片的事务历史记录被oplog截断时，迁移会话信息可能会触发fassert
- [服务器-40010](https://jira.mongodb.org/browse/SERVER-40010)4.0二进制和3.6 FCV的碎片辅助正在调用`_flushDatabaseCacheUpdates`

### 复制

- [服务器-35663](https://jira.mongodb.org/browse/SERVER-35663)复制恢复不会更新逻辑时钟
- [服务器-37179](https://jira.mongodb.org/browse/SERVER-37179)每当commitTransaction返回NoSuchTransaction错误时，请等待指定的写入问题
- [服务器-37274](https://jira.mongodb.org/browse/SERVER-37274)commands_that_accept_wc测试可以给出次要优先级为零
- [服务器-37569](https://jira.mongodb.org/browse/SERVER-37569)禁止MapReduce使用txnNumbers会话
- [服务器-37846](https://jira.mongodb.org/browse/SERVER-37846)如果写入已提交，则表示对仲裁员感到满意
- [服务器-38297](https://jira.mongodb.org/browse/SERVER-38297)杀死目前正在申请准备oplog条目的二级会话可以
- [服务器-38354](https://jira.mongodb.org/browse/SERVER-38354)在启动时读取上次应用的选项时允许关机错误
- [服务器-38722](https://jira.mongodb.org/browse/SERVER-38722)CollectionCloner应该在集合掉落时处理QueryPlanKilled
- [服务器-39215](https://jira.mongodb.org/browse/SERVER-39215)修复aggregation_currentop.js，这样我们就不会比较从2个不同来源（mozjs和服务器）生成的时间戳。
- [服务器-39286](https://jira.mongodb.org/browse/SERVER-39286)server_write_concern_metrics.js必须使用require_journaling标签
- [服务器-39490](https://jira.mongodb.org/browse/SERVER-39490)opWriteConcernCounters可能会因溢出而导致未定义的行为
- [服务器-39641](https://jira.mongodb.org/browse/SERVER-39641)Blacklist max_time_ms.js from read concern linearizable passthrough

### 查询

- [服务器-13779](https://jira.mongodb.org/browse/SERVER-13779)允许$不应用于$regex（目前只允许/regex/语法）
- [服务器-36910](https://jira.mongodb.org/browse/SERVER-36910)降低查找期间PlanExecutor::DEAD错误的严重性或删除日志消息
- [服务器-38764](https://jira.mongodb.org/browse/SERVER-38764)外部排序器应使用64位整数进行文件偏移量
- [服务器-39210](https://jira.mongodb.org/browse/SERVER-39210)将调试日志记录添加到change_streams/shell_helper.js
- [服务器-39472](https://jira.mongodb.org/browse/SERVER-39472)返回端口更改为apply_ops_concurrent_non_atomic.js，以考虑3.6和4.0中的HMAC键插入。
- [服务器-39650](https://jira.mongodb.org/browse/SERVER-39650)确保无法在发送给mongos的原始聚合命令中指定内部选项
- [服务器-39771](https://jira.mongodb.org/browse/SERVER-39771)在某些情况下，TextMatchExpression崩溃而不是序列化

### 集合

- [服务器-31098](https://jira.mongodb.org/browse/SERVER-31098)聚合查询的system.profile中错误的ns
- [服务器-35740](https://jira.mongodb.org/browse/SERVER-35740)报告每个（可能是空的）更改流批次的高水位简历令牌
- [服务器-38408](https://jira.mongodb.org/browse/SERVER-38408)从所有mongoD更改流返回postBatchResumeToken
- [服务器-38410](https://jira.mongodb.org/browse/SERVER-38410)允许ARM使用postBatchResumeToken进行合并
- [服务器-38411](https://jira.mongodb.org/browse/SERVER-38411)通过mongoS向客户端传播postBatchResumeToken
- [服务器-38412](https://jira.mongodb.org/browse/SERVER-38412)允许从高水位标记的简历令牌中恢复
- [服务器-38413](https://jira.mongodb.org/browse/SERVER-38413)始终设置初始postBatchResumeToken
- [服务器-38414](https://jira.mongodb.org/browse/SERVER-38414)更改流高水印的升级/降级测试
- [服务器-38942](https://jira.mongodb.org/browse/SERVER-38942)提高postBatchResumeToken集成测试的鲁棒性
- [服务器-38975](https://jira.mongodb.org/browse/SERVER-38975)单收集高水位标记在不存在收集的碎片上省略UUID
- [服务器-39166](https://jira.mongodb.org/browse/SERVER-39166)$graphLookup应该迫使管道在分片集群中分裂
- [服务器-39322](https://jira.mongodb.org/browse/SERVER-39322)使用静态缓冲区修复不正确的snprintf调用的Backport timelib修复
- [服务器-39394](https://jira.mongodb.org/browse/SERVER-39394)视图整理检查应该穿过嵌套的$查找管道
- [服务器-39410](https://jira.mongodb.org/browse/SERVER-39410)在DScuror中重新启用更改流光标的批处理
- [服务器-39487](https://jira.mongodb.org/browse/SERVER-39487)NumberDecimal的聚合运算符$sqrt输出与$exp相同
- [服务器-39612](https://jira.mongodb.org/browse/SERVER-39612)在$geoNear中验证字段
- [服务器-40094](https://jira.mongodb.org/browse/SERVER-40094)不要在DSShardCheckResumability中过早拒绝恢复尝试

### JavaScript

[服务器-39481](https://jira.mongodb.org/browse/SERVER-39481)删除未使用的C++注入JS构造函数

### 储存

- [服务器-17010](https://jira.mongodb.org/browse/SERVER-17010)减少基于文件的排序器中的文件句柄使用
- [服务器-35449](https://jira.mongodb.org/browse/SERVER-35449)返回任何未完成交易使用的最古老的读取时间戳
- [服务器-35732](https://jira.mongodb.org/browse/SERVER-35732)连字符数据库名称不适用于dbStats.fsUsedSize / TotalSize
- [服务器-38555](https://jira.mongodb.org/browse/SERVER-38555)cappedTruncateAfter在启用MajorityReadConcern=false时，不得在启动恢复期间设置最旧的时间戳
- [服务器-38745](https://jira.mongodb.org/browse/SERVER-38745)MigrationDestinationManager在构建多个索引时分配错误的时间戳
- [服务器-38801](https://jira.mongodb.org/browse/SERVER-38801)在可查询的`listDirectory`调用中应对大型BSON斑点。
- [服务器-38833](https://jira.mongodb.org/browse/SERVER-38833)未能为存储事务盖上时间戳，需要重新启动事务
- [服务器-39106](https://jira.mongodb.org/browse/SERVER-39106)如果有最大锁定超时且没有截止日期，GlobalLock收购应该在门票购买超时抛售
- [服务器-39259](https://jira.mongodb.org/browse/SERVER-39259)移动SE：调整SQLite Pragmas以提高性能
- [服务器-39719](https://jira.mongodb.org/browse/SERVER-39719)确保从具有进行索引构建的辅助进行初始同步的节点在初始同步完成之前创建索引
- [服务器-39723](https://jira.mongodb.org/browse/SERVER-39723)更改listIndexes命令行为以显示正在进行的索引构建
- [服务器-39773](https://jira.mongodb.org/browse/SERVER-39773)减少rollback_wt_cache_full.js中的更新次数
- [服务器-39871](https://jira.mongodb.org/browse/SERVER-39871)使catalog_raii_test更能抵抗Windows上的时钟问题
- [服务器-39922](https://jira.mongodb.org/browse/SERVER-39922)修复移动的锁统计子操作测试

### 运营

- [服务器-34422](https://jira.mongodb.org/browse/SERVER-34422)公开空闲与活动客户端线程的指标
- [服务器-37155](https://jira.mongodb.org/browse/SERVER-37155)改进LDAP服务器日志记录
- [服务器-38038](https://jira.mongodb.org/browse/SERVER-38038)mongo shell应该与ErrorExtraInfo衍生品链接
- [服务器-38530](https://jira.mongodb.org/browse/SERVER-38530)添加 getResumeToken shell 帮助
- [服务器-39093](https://jira.mongodb.org/browse/SERVER-39093)如果不将--ssl指定为mongo shell，就无法将TLS与readPreference={mode: "secondary"}一起使用

### 构建和包装

- [服务器-33958](https://jira.mongodb.org/browse/SERVER-33958)使用薄存档时，--cache=nolinked模式应该将薄存档推送到缓存
- [服务器-35356](https://jira.mongodb.org/browse/SERVER-35356)为嵌入式SDK添加发布过程构建器
- [服务器-35737](https://jira.mongodb.org/browse/SERVER-35737)install_compass 在 MacOS 上失败
- [服务器-39354](https://jira.mongodb.org/browse/SERVER-39354)从先前的分支中删除SCons缓存修剪
- [服务器-39483](https://jira.mongodb.org/browse/SERVER-39483)不应缓存剥离的二进制文件和.debug文件

### 工具

- [工具-2030](https://jira.mongodb.org/browse/TOOLS-2030)mongodump不会转储system.js集合
- [工具-2109](https://jira.mongodb.org/browse/TOOLS-2109)使用Go 1.11构建工具
- [工具-2166](https://jira.mongodb.org/browse/TOOLS-2166)mongoimport --uri 记录了错误的连接主机

### 内部人员

- [服务器-35138](https://jira.mongodb.org/browse/SERVER-35138)如果有未捕获的异常，service_state_machine.cpp应该记录回溯
- [服务器-35551](https://jira.mongodb.org/browse/SERVER-35551)Mongobridge节点在重新启动后不记得其网络分区配置
- [服务器-36231](https://jira.mongodb.org/browse/SERVER-36231)Mongos写入路径不查找可重试的写入关注错误
- [服务器-37183](https://jira.mongodb.org/browse/SERVER-37183)BSONElement::safeNumberLong不安全
- [服务器-37382](https://jira.mongodb.org/browse/SERVER-37382)printShardingStatus.js与ShardingUptimeReporter线程的比赛
- [服务器-37620](https://jira.mongodb.org/browse/SERVER-37620)提高watchdog_test的可靠性
- [服务器-38319](https://jira.mongodb.org/browse/SERVER-38319)DBClientRS应该通过所有路径传播URI选项
- [服务器-38538](https://jira.mongodb.org/browse/SERVER-38538)提高周期性运行器Impl的螺纹安全性
- [服务器-38674](https://jira.mongodb.org/browse/SERVER-38674)--ssl=off构建发出scons警告
- [服务器-38697](https://jira.mongodb.org/browse/SERVER-38697)PID的动力循环杀戮可能会试图杀死错误的过程
- [服务器-38725](https://jira.mongodb.org/browse/SERVER-38725)Maven中央发布自动化无法关闭sonatype存储库（401未经授权）
- [服务器-38746](https://jira.mongodb.org/browse/SERVER-38746)提供交易中止的原因
- [服务器-38748](https://jira.mongodb.org/browse/SERVER-38748)通过applyOps创建的后台索引应在命令线程上运行
- [服务器-38789](https://jira.mongodb.org/browse/SERVER-38789)在ssl_alert_reporting.js中接受Windows上的连接失败
- [服务器-38816](https://jira.mongodb.org/browse/SERVER-38816)在目标运行时对所需任务使用gen generate.tasks
- [服务器-38837](https://jira.mongodb.org/browse/SERVER-38837)在OnePausableJobResumesCorrectly中使 periodic_runner_impl_test更加宽松
- [服务器-38933](https://jira.mongodb.org/browse/SERVER-38933)currentOp没有能力掉落碎片
- [服务器-38954](https://jira.mongodb.org/browse/SERVER-38954)在max_time_ms.js中增加测试用例的查询执行时间，预计测试用例将达到时间限制
- [服务器-39009](https://jira.mongodb.org/browse/SERVER-39009)通过环境变量使bulldlogger凭据位置可配置
- [服务器-39014](https://jira.mongodb.org/browse/SERVER-39014)使用Windows MSI重新安装时报告的错误错误
- [服务器-39019](https://jira.mongodb.org/browse/SERVER-39019)$elemMatch $ne序列化不正确，不会往返
- [服务器-39031](https://jira.mongodb.org/browse/SERVER-39031)使SCons默认--工作到CPU计数
- [服务器-39056](https://jira.mongodb.org/browse/SERVER-39056)进一步完善readWriteAnyDatabase
- [服务器-39058](https://jira.mongodb.org/browse/SERVER-39058)将AuthorizationSession中的用户集修改与客户端同步
- [服务器-39127](https://jira.mongodb.org/browse/SERVER-39127)对于所有变体上已转换的任务，请使用gen generate.tasks
- [服务器-39128](https://jira.mongodb.org/browse/SERVER-39128)在从mongo shell连接期间避免双重身份验证
- [服务器-39138](https://jira.mongodb.org/browse/SERVER-39138)新的测试套件在划分套件时无法正确处理排除
- [服务器-39212](https://jira.mongodb.org/browse/SERVER-39212)waitFor后台dbhash检查中的Secondaries必须等待lastApplied才能到达clusterTime，当启用MajorityReadConcern=false
- [服务器-39232](https://jira.mongodb.org/browse/SERVER-39232)允许不需要授权的命令刷新会话
- [服务器-39284](https://jira.mongodb.org/browse/SERVER-39284)通过重复执行更好地处理生成的任务的超时
- [服务器-39303](https://jira.mongodb.org/browse/SERVER-39303)覆盖率分析缺陷105263：空格检查后取消引用
- [服务器-39386](https://jira.mongodb.org/browse/SERVER-39386)具体使用我们想要使用的安卓NDK版本
- [服务器-39421](https://jira.mongodb.org/browse/SERVER-39421)修复opCtx和接力棒等待
- [服务器-39564](https://jira.mongodb.org/browse/SERVER-39564) burn_in_tests.py doesn't run tests in the configuration for `*_gen` Evergreen tasks
- [服务器-39590](https://jira.mongodb.org/browse/SERVER-39590)改进port_options.js日志文件轮询
- [服务器-39686](https://jira.mongodb.org/browse/SERVER-39686)清理cloud_nightly项目文件
- [服务器-39746](https://jira.mongodb.org/browse/SERVER-39746)系统性能：在runtime.yml中编写项目
- [服务器-39779](https://jira.mongodb.org/browse/SERVER-39779)如果不是所有测试都有历史记录，请不要覆盖超时
- [服务器-39822](https://jira.mongodb.org/browse/SERVER-39822)提高watchdog_test.exe测试可靠性
- [服务器-39823](https://jira.mongodb.org/browse/SERVER-39823)免费监控可能会忽略二级注册请求
- [服务器-39830](https://jira.mongodb.org/browse/SERVER-39830)定期比赛Runner在start()和stop()之间
- [服务器-39900](https://jira.mongodb.org/browse/SERVER-39900)change_streams_resume_at_same_clustertime.js不应该假设在同一集群时间执行跨碎片的多重更新
- [服务器-39946](https://jira.mongodb.org/browse/SERVER-39946)仅通过过滤测试历史记录处理拆分任务
- [服务器-40034](https://jira.mongodb.org/browse/SERVER-40034)对于与编译相关的任务组，将setup_group_can_fail_task设置为true
- [服务器-40076](https://jira.mongodb.org/browse/SERVER-40076)标记JavaScript测试，说明它们无法在Atlas中运行的原因
- [服务器-40195](https://jira.mongodb.org/browse/SERVER-40195)固定所有Gradle依赖项
- [工具-1906](https://jira.mongodb.org/browse/TOOLS-1906)忽略mongorestore错误“x509证书例程：X509_STORE_add_cert:cert已经在哈希表中”
- [工具-2158](https://jira.mongodb.org/browse/TOOLS-2158)mongodump在Windows上失败，“错误地打开系统CA商店：访问被拒绝”。
- [工具-2167](https://jira.mongodb.org/browse/TOOLS-2167)为在Windows上构建添加CGO标志
- [工具-2168](https://jira.mongodb.org/browse/TOOLS-2168)添加在MacOS上构建的CGO标志
- [工具-2210](https://jira.mongodb.org/browse/TOOLS-2210)使用启用地址空间布局随机（ASLR）标志的工具进行构建
- [WT-4447](https://jira.mongodb.org/browse/WT-4447)添加原型实现，允许限制每个子系统的IO
- [WT-4483](https://jira.mongodb.org/browse/WT-4483)改进对大值的小更新的缓存
- [WT-4518](https://jira.mongodb.org/browse/WT-4518)在API崩溃返回之前，给应用程序一个处理恐慌的机会
- [WT-4522](https://jira.mongodb.org/browse/WT-4522)将WiredTiger版权更新到2019年
- [WT-4528](https://jira.mongodb.org/browse/WT-4528)访问被拒绝时重试Windows功能
- [WT-4532](https://jira.mongodb.org/browse/WT-4532)修复__wt_page_in_func中WT_DATA_HANDLE的空指针访问
- [WT-4547](https://jira.mongodb.org/browse/WT-4547)合并写入的容量和块管理器字节
- [WT-4562](https://jira.mongodb.org/browse/WT-4562)覆盖范围：可能除以零 conn_capacity:434
- [WT-4576](https://jira.mongodb.org/browse/WT-4576)conn_capacity.c中的覆盖警告
- [WT-4615](https://jira.mongodb.org/browse/WT-4615)在返回备份光标之前同步备份文件



## 4.0.6 更改日志

### 安全

- [服务器-37565](https://jira.mongodb.org/browse/SERVER-37565)mongod在升级到4.0.2后持续重新启动
- [服务器-38293](https://jira.mongodb.org/browse/SERVER-38293)让列表数据库了解集合权限

### 分片

- [服务器-9043](https://jira.mongodb.org/browse/SERVER-9043)在配置服务器和碎片上链接`flushRouterConfig`
- [服务器-31156](https://jira.mongodb.org/browse/SERVER-31156)管理员命令仅更新一个集合的块元数据
- [服务器-36863](https://jira.mongodb.org/browse/SERVER-36863)query_config.js假设config.mongos始终存在
- [服务器-38050](https://jira.mongodb.org/browse/SERVER-38050)删除器在删除循环后无法验证它仍然在同一集合上运行
- [服务器-38062](https://jira.mongodb.org/browse/SERVER-38062)将 assert.commandWorked() 添加到 read_pref_cmd.js 中的命令中
- [服务器-38196](https://jira.mongodb.org/browse/SERVER-38196)保障分析缺陷105128：未检查的退货价值
- [服务器-38472](https://jira.mongodb.org/browse/SERVER-38472)即使碎片尚未完成自己的shardCollection命令，配置服务器也可以提前返回shardCollection命令
- [服务器-38641](https://jira.mongodb.org/browse/SERVER-38641)clone_catalog_data.js应该在CSRS上调用awaitLastOpCommitted，然后直接针对碎片调用_cloneCatalogData
- [服务器-38751](https://jira.mongodb.org/browse/SERVER-38751)_migrateClone和_transferMods在MigrationDestinationManager中被错误地标记为幂等
- [服务器-39030](https://jira.mongodb.org/browse/SERVER-39030)splitVector记录了错误的信息
- [服务器-39180](https://jira.mongodb.org/browse/SERVER-39180)使用预创建的区域分片非空集合时，可以选择错误的初始块所有者碎片
- [服务器-39234](https://jira.mongodb.org/browse/SERVER-39234)在混合碎片版本配置中分叉空集合可能会将所有块留在主碎片上

### 复制

- [服务器-32146](https://jira.mongodb.org/browse/SERVER-32146)记录慢速操作日志输入应用程序
- [服务器-34943](https://jira.mongodb.org/browse/SERVER-34943)failCommand failpoint应该忽略来自副本集成员的命令
- [服务器-35608](https://jira.mongodb.org/browse/SERVER-35608)最后一个应用Optime的不变项永远不会大于我们当前的术语
- [服务器-37189](https://jira.mongodb.org/browse/SERVER-37189)transactions.currentActive的值为-1
- [服务器-37910](https://jira.mongodb.org/browse/SERVER-37910)为在批处理边界上应用的辅助操作数量创建新的服务器状态指标
- [服务器-37915](https://jira.mongodb.org/browse/SERVER-37915)复制不会在次要上更新opsCounterRepl命令
- [服务器-38052](https://jira.mongodb.org/browse/SERVER-38052)ReplBatcher线程必须处理异常
- [服务器-38059](https://jira.mongodb.org/browse/SERVER-38059)事务写入冲突测试应该在失败时清理任何事务
- [服务器-38200](https://jira.mongodb.org/browse/SERVER-38200)修复./jstests/replsets/initial_sync_oplog_hole.js，以防止在测试中使用过时的心跳信息。
- [服务器-38476](https://jira.mongodb.org/browse/SERVER-38476)再次增加clean_shutdown_oplog_state.js的超时
- [服务器-38647](https://jira.mongodb.org/browse/SERVER-38647)backup_restore_rolling.js可能会因降级而失败
- [服务器-38740](https://jira.mongodb.org/browse/SERVER-38740)删除等待drop在bort_transaction_thread_does_not_block_on_locks.js中等待删除等待X锁
- [服务器-38998](https://jira.mongodb.org/browse/SERVER-38998)为readConcern和writeConcern创建服务器状态指标
- [服务器-39142](https://jira.mongodb.org/browse/SERVER-39142)ServerWriteConcernMetrics在修改成员之前必须锁定_mutex
- [服务器-39267](https://jira.mongodb.org/browse/SERVER-39267)守卫opWriteConcern旗帜背后的柜台

### 查询

- [服务器-35455](https://jira.mongodb.org/browse/SERVER-35455)QueryPlannerAccess应该用unique_ptr而不是原始指针持有自己的指针
- [服务器-38275](https://jira.mongodb.org/browse/SERVER-38275)句柄解释没有命名空间
- [服务器-38601](https://jira.mongodb.org/browse/SERVER-38601)添加规划期间内存泄漏的回归测试

### 写入操作

[服务器-37284](https://jira.mongodb.org/browse/SERVER-37284)当删除的文档数量未知时，ndeleted:0被记录/分析

### 集合

[服务器-39109](https://jira.mongodb.org/browse/SERVER-39109)蒙古崩溃：不变故障！_exec src/mongo/db/pipeline/document_source_cursor.cpp 295

### 储存

- [服务器-37484](https://jira.mongodb.org/browse/SERVER-37484)仅更改启动时的表记录设置，而不是创建集合
- [服务器-37911](https://jira.mongodb.org/browse/SERVER-37911)通过applyOps创建索引应在WUOW中通知opObserver索引提交
- [服务器-38434](https://jira.mongodb.org/browse/SERVER-38434)可查询的BackupMode和wiredTigerEngineConfigString标志不兼容
- [服务器-38498](https://jira.mongodb.org/browse/SERVER-38498)减少rollback_wt_cache_full.js中的更新次数
- [服务器-38779](https://jira.mongodb.org/browse/SERVER-38779)建立一个机制，定期从会话缓存中清理旧会话
- [服务器-38869](https://jira.mongodb.org/browse/SERVER-38869)在run_check_repl_dbhash_background.js中记录更多信息
- [服务器-38928](https://jira.mongodb.org/browse/SERVER-38928)背景dbhash测试钩子错误地依赖于主的最后一个应用>=其次要的最后一次应用

### 运营

- [服务器-33469](https://jira.mongodb.org/browse/SERVER-33469)使syslog日志行与mongod日志行一致
- [服务器-38983](https://jira.mongodb.org/browse/SERVER-38983)将UserNotFound与身份验证故障区分开来

### 构建和包装

- [服务器-35936](https://jira.mongodb.org/browse/SERVER-35936)MongoDB社区Windows安装程序无法安装指南针
- [服务器-37775](https://jira.mongodb.org/browse/SERVER-37775)平台支持：添加社区RHEL7（zSeries）
- [服务器-37777](https://jira.mongodb.org/browse/SERVER-37777)平台支持：添加社区SLES12（zSeries）
- [服务器-37778](https://jira.mongodb.org/browse/SERVER-37778)平台支持：添加社区和企业Ubuntu 18.04（zSeries）
- [服务器-38416](https://jira.mongodb.org/browse/SERVER-38416)将静态OpenSSL升级到1.1.1a
- [服务器-38726](https://jira.mongodb.org/browse/SERVER-38726)添加稳定的工具链变量文件
- [服务器-39176](https://jira.mongodb.org/browse/SERVER-39176)RHEL7 s390x的回购配置缺失

### 内部人员

- [服务器-31755](https://jira.mongodb.org/browse/SERVER-31755)将中间$lookup文档大小提高到100MB，并使其可配置
- [服务器-34394](https://jira.mongodb.org/browse/SERVER-34394)明确防止SNMP使用的服务器选项
- [服务器-35393](https://jira.mongodb.org/browse/SERVER-35393)Go驱动程序单元测试在进行大量插入时会收到错误代码9001
- [服务器-35620](https://jira.mongodb.org/browse/SERVER-35620)下载的文件完整性：使用shasum而不是python脚本
- [服务器-36740](https://jira.mongodb.org/browse/SERVER-36740)有时，窗户上的崩溃不会提供回溯
- [服务器-36774](https://jira.mongodb.org/browse/SERVER-36774)允许shell断言函数为“消息”参数获取对象
- [服务器-36817](https://jira.mongodb.org/browse/SERVER-36817)当服务器已经是主服务器时，由stepdown线程运行的replSetFreeze命令可能会失败
- [服务器-37078](https://jira.mongodb.org/browse/SERVER-37078)使用awaitSecondaryNodes()而不是waitForState()来确认节点是re repair_invalidates_replica_set_nodes.js中的次要节点
- [服务器-37143](https://jira.mongodb.org/browse/SERVER-37143)重试后台DB哈希钩子中中断的错误
- [服务器-37240](https://jira.mongodb.org/browse/SERVER-37240)为enableMajorityReadConcern:false变体启用dbhash背景线程
- [服务器-37241](https://jira.mongodb.org/browse/SERVER-37241)在会话集合中添加测试以验证会话的正确过期
- [服务器-37359](https://jira.mongodb.org/browse/SERVER-37359)更新测试生命周期脚本以使用新的Evergreen测试统计端点
- [服务器-37428](https://jira.mongodb.org/browse/SERVER-37428)Sys-perf：linux使用企业位构建
- [服务器-37490](https://jira.mongodb.org/browse/SERVER-37490)增加电源循环的ConnectTimeout
- [服务器-37562](https://jira.mongodb.org/browse/SERVER-37562)在SessionsCollectionRS中将所有IX锁简化为IS锁
- [服务器-38109](https://jira.mongodb.org/browse/SERVER-38109)更新generate_resmoke_suite.py以使用缓存的历史端点
- [服务器-38110](https://jira.mongodb.org/browse/SERVER-38110)为子套件生成resmoke配置YAML
- [服务器-38112](https://jira.mongodb.org/browse/SERVER-38112)在等/evergreen.yml中添加“生成resmoke子套件”
- [服务器-38113](https://jira.mongodb.org/browse/SERVER-38113)为生成的子套件生成常青配置
- [服务器-38114](https://jira.mongodb.org/browse/SERVER-38114)更新 evergreen.yml，以使用生成任务来执行已经拆分的任务
- [服务器-38115](https://jira.mongodb.org/browse/SERVER-38115)将resmoke.py --job的设置合并到python脚本
- [服务器-38177](https://jira.mongodb.org/browse/SERVER-38177)使用bind_ip修复会导致空指针取消引用
- [服务器-38182](https://jira.mongodb.org/browse/SERVER-38182)run_check_repl_dbhash_background在出错后中止所有事务，即使它们已经成功提交
- [服务器-38415](https://jira.mongodb.org/browse/SERVER-38415)checkLog.containsWithCount不会在assert.soon的每个循环之前重置计数
- [服务器-38445](https://jira.mongodb.org/browse/SERVER-38445)Date_t和持续时间添加可能会溢出
- [服务器-38509](https://jira.mongodb.org/browse/SERVER-38509)在generate_resmoke_suites中处理测试历史记录的降级模式
- [服务器-38616](https://jira.mongodb.org/browse/SERVER-38616)LDAPArrayIterator使用空数组初始化时行为不正确
- [服务器-38639](https://jira.mongodb.org/browse/SERVER-38639)在etp/evergreen.yml的“运行测试”中安装psutil模块[v4.0]
- [服务器-38710](https://jira.mongodb.org/browse/SERVER-38710)在生成常青任务时支持依赖项
- [服务器-38748](https://jira.mongodb.org/browse/SERVER-38748)通过applyOps创建的后台索引应在命令线程上运行
- [服务器-38818](https://jira.mongodb.org/browse/SERVER-38818)更好地处理生成任务之间的依赖关系
- [服务器-38887](https://jira.mongodb.org/browse/SERVER-38887)Mongo.getDBs()没有正确检查权限
- [服务器-38946](https://jira.mongodb.org/browse/SERVER-38946)在生成的测试中正确处理新的排除
- [服务器-38990](https://jira.mongodb.org/browse/SERVER-38990)排除对s390x变体需要mmapv1的测试
- [服务器-39013](https://jira.mongodb.org/browse/SERVER-39013)为absl添加gdb漂亮的打印机::flat_hash_map/set
- [WT-4192](https://jira.mongodb.org/browse/WT-4192)移除WiredTiger原始压缩支持
- [WT-4280](https://jira.mongodb.org/browse/WT-4280)添加调试以了解哪个会话有危险指针
- [WT-4319](https://jira.mongodb.org/browse/WT-4319)csuite测试的改进
- [WT-4331](https://jira.mongodb.org/browse/WT-4331)进一步延长test_bug019.py的最大等待时间
- [WT-4383](https://jira.mongodb.org/browse/WT-4383)更新会话统计信息以反映运营统计信息。
- [WT-4384](https://jira.mongodb.org/browse/WT-4384)添加有关会话统计光标的文档
- [WT-4393](https://jira.mongodb.org/browse/WT-4393)记录用于读取已提交隔离的光标行为
- [WT-4410](https://jira.mongodb.org/browse/WT-4410)拆分“单元测试”任务，以减少Evergreen Ubuntu构建变体运行时
- [WT-4417](https://jira.mongodb.org/browse/WT-4417)使os_cache_max和os_cache_dirty_max可重新配置
- [WT-4421](https://jira.mongodb.org/browse/WT-4421)添加一种计算修改操作的方法
- [WT-4430](https://jira.mongodb.org/browse/WT-4430)通过快速截断修复准备和页面实例化之间的竞争
- [WT-4434](https://jira.mongodb.org/browse/WT-4434)将zstd压缩级别从3修改为6
- [WT-4438](https://jira.mongodb.org/browse/WT-4438)对光标缓存总数使用更准确的统计信息
- [WT-4442](https://jira.mongodb.org/browse/WT-4442)添加复制备份光标的功能
- [WT-4454](https://jira.mongodb.org/browse/WT-4454)在添加新的“检查”或csuite测试时自动生成Evergreen配置
- [WT-4455](https://jira.mongodb.org/browse/WT-4455)test_wt4156_metadata_salvage with HAVE_ATTACH在zSeries上失败
- [WT-4457](https://jira.mongodb.org/browse/WT-4457)为日志子系统添加最大肮脏的系统缓冲区
- [WT-4463](https://jira.mongodb.org/browse/WT-4463)减少csuite手柄锁测试的运行时间
- [WT-4464](https://jira.mongodb.org/browse/WT-4464)在调试输出行存储内部页面键可能无法正确格式化
- [WT-4469](https://jira.mongodb.org/browse/WT-4469)覆盖范围#105148：冗余测试
- [WT-4470](https://jira.mongodb.org/browse/WT-4470)尽量减少需要TESTUTIL_ENABLE_LONG_TESTS的测试
- [WT-4479](https://jira.mongodb.org/browse/WT-4479)从测试中删除模式锁定等待断言
- [WT-4480](https://jira.mongodb.org/browse/WT-4480)修复重复的备份光标和归档检查
- [WT-4481](https://jira.mongodb.org/browse/WT-4481)常青脚本清理
- [WT-4482](https://jira.mongodb.org/browse/WT-4482)麻布



## 4.0.5 更改日志

### 安全

- [服务器-35212](https://jira.mongodb.org/browse/SERVER-35212)当未指定authSource时，URI连接不会默认为管理数据库
- [服务器-37687](https://jira.mongodb.org/browse/SERVER-37687)在绑定失败中捕获libldap错误字符串

### 分片

- [服务器-30714](https://jira.mongodb.org/browse/SERVER-30714)在ReplicationCoordinatorExternalStateImpl::_shardingOnTransitionToPrimaryHook中处理降级错误
- [服务器-36349](https://jira.mongodb.org/browse/SERVER-36349)当ServiceEntryPoint中没有创建OperationContext时，在OperationShardingState析构函数中处理ShardingOperationFailedStatus
- [服务器-36965](https://jira.mongodb.org/browse/SERVER-36965)确保setUp写入insafe`safe_secondary_reads_single_migration_suspend_range_deletion.js`被传播到碎片辅助
- [服务器-36966](https://jira.mongodb.org/browse/SERVER-36966)分片地图减少可能无法清理临时输出收集
- [服务器-37051](https://jira.mongodb.org/browse/SERVER-37051)ShardServerCatalogCacheLoader在从任务队列中读取后不会检查内部术语
- [服务器-37080](https://jira.mongodb.org/browse/SERVER-37080)为块迁移实现可调的批处理大小
- [服务器-37339](https://jira.mongodb.org/browse/SERVER-37339)在分片组件完全初始化之前，分片状态设置为在网格上初始化
- [服务器-37354](https://jira.mongodb.org/browse/SERVER-37354)让_shardsvrShardCollection重新进入
- [服务器-37511](https://jira.mongodb.org/browse/SERVER-37511)逻辑会话收割器和刷新线程应立即设置会话集合
- [服务器-37616](https://jira.mongodb.org/browse/SERVER-37616)为测距器实现可调的批处理大小
- [服务器-37624](https://jira.mongodb.org/browse/SERVER-37624)当您更改localLogicalSessionTimeoutMinutes的值时，会话永远不会过期
- [服务器-37902](https://jira.mongodb.org/browse/SERVER-37902)recovering_slaveok.js应该断言它成功的所有写入
- [服务器-37918](https://jira.mongodb.org/browse/SERVER-37918)如果传递未排序区域列表，快速初始拆分算法会生成损坏的路由信息
- [服务器-37932](https://jira.mongodb.org/browse/SERVER-37932)删除coll_epoch_test1.js中试图测试一些不起作用的东西的错误部分，但由于测试中的错误，测试通过了
- [服务器-38371](https://jira.mongodb.org/browse/SERVER-38371)如果其他早期会话遇到新事务，会话目录迁移将跳过以后的会话
- [服务器-38392](https://jira.mongodb.org/browse/SERVER-38392)删除关于我们不能分割与标签关联的非空集合的说法

### 复制

- [服务器-37317](https://jira.mongodb.org/browse/SERVER-37317)在缓慢的事务日志单元测试中使sepmillis更加保守
- [服务器-37500](https://jira.mongodb.org/browse/SERVER-37500)Blacklist geo_s2ordering from replica_sets_kill_primary_jscore_passthrough suite
- [服务器-37557](https://jira.mongodb.org/browse/SERVER-37557)添加有关启用MajorityReadConcern和使用仲裁器的启动警告
- [服务器-37676](https://jira.mongodb.org/browse/SERVER-37676)允许在中止的交易中隐式集合创建
- [服务器-37935](https://jira.mongodb.org/browse/SERVER-37935)删除更改流测试套件的读取关注“多数”覆盖
- [服务器-38024](https://jira.mongodb.org/browse/SERVER-38024)initial_sync_oplog_hole测试应标记为需要文档锁定

### 查询

- [服务器-36115](https://jira.mongodb.org/browse/SERVER-36115)invalidated_cursors.js FSM工作负载应确保killOp发送到与currentOp相同的节点
- [服务器-37385](https://jira.mongodb.org/browse/SERVER-37385)更改max_time_ms.js以容忍“中断”错误代码
- [服务器-37838](https://jira.mongodb.org/browse/SERVER-37838)stepDown during a get更多，然后是OP_KILL_CURSORS可以崩溃服务器
- [服务器-38070](https://jira.mongodb.org/browse/SERVER-38070)聚合表达式中的无限循环
- [服务器-38164](https://jira.mongodb.org/browse/SERVER-38164)$或下推优化无法正确处理$elemMatch中的$

### 集合

- [服务器-37027](https://jira.mongodb.org/browse/SERVER-37027)[仅限4.0]当流检测到FCV更改时，调整更改流恢复令牌
- [服务器-37182](https://jira.mongodb.org/browse/SERVER-37182)在$arrayToObject之后引用整个对象与该对象的字段时的不同值
- [服务器-37200](https://jira.mongodb.org/browse/SERVER-37200)$listSessions对mongos不起作用的$match阶段
- [服务器-37750](https://jira.mongodb.org/browse/SERVER-37750)优化的$样本阶段不会产生
- [服务器-37779](https://jira.mongodb.org/browse/SERVER-37779)mongos没有正确地强制更改流必须是第一阶段
- [服务器-38223](https://jira.mongodb.org/browse/SERVER-38223)change_fcv_during_change_stream.js需要大多数阅读关注
- [服务器-38332](https://jira.mongodb.org/browse/SERVER-38332)change_fcv_during_change_stream.js需要事务

### 储存

- [服务器-29825](https://jira.mongodb.org/browse/SERVER-29825)不允许从未复制的DB重命名，反之亦然
- [服务器-36873](https://jira.mongodb.org/browse/SERVER-36873)ReplicationCoordinatorExternalStateImpl::shutdown()在等待_taskExecutor时不得持有_threadMutex
- [服务器-36968](https://jira.mongodb.org/browse/SERVER-36968)在检查AuthZN索引存在之前重建中断的索引
- [服务器-37313](https://jira.mongodb.org/browse/SERVER-37313)在二级前景索引构建期间，FTDC集合被阻止
- [服务器-37408](https://jira.mongodb.org/browse/SERVER-37408)将 afterClusterTime 添加到初始同步收集扫描中
- [服务器-37524](https://jira.mongodb.org/browse/SERVER-37524)带有存储看门狗的内存存储引擎崩溃了服务器
- [服务器-37784](https://jira.mongodb.org/browse/SERVER-37784)修复尺寸存储器不应该令人信不火
- [服务器-37796](https://jira.mongodb.org/browse/SERVER-37796)在开始维修时，无论错误代码如何，请务必挽救WiredTiger元数据
- [服务器-37862](https://jira.mongodb.org/browse/SERVER-37862)在initial_sync_wt_cache_full.js中减少更新操作
- [服务器-37930](https://jira.mongodb.org/browse/SERVER-37930)在嵌套的applyOps中添加createIndexes的测试覆盖范围
- [服务器-37931](https://jira.mongodb.org/browse/SERVER-37931)lock_stats_suboperation_logs.js应该忽略噪声锁定统计信息

### 运营

- [服务器-35485](https://jira.mongodb.org/browse/SERVER-35485)Mongo Shell不接受压缩机连接字符串参数
- [服务器-36262](https://jira.mongodb.org/browse/SERVER-36262)mongo shell：允许用户在没有listDatabases特权的情况下显示dbs（在<4.0版本的服务器上）
- [服务器-36272](https://jira.mongodb.org/browse/SERVER-36272)密码中某些字符的shell断言失败
- [服务器-36977](https://jira.mongodb.org/browse/SERVER-36977)初始mongod.log使用umask vs模式600创建

### 构建和包装

- [服务器-35972](https://jira.mongodb.org/browse/SERVER-35972)更频繁地运行推送任务
- [服务器-37598](https://jira.mongodb.org/browse/SERVER-37598)为GCC 8添加金丝雀生成器
- [服务器-38049](https://jira.mongodb.org/browse/SERVER-38049)embedded-android pom.xml应声明slf4j依赖项为可选
- [服务器-38078](https://jira.mongodb.org/browse/SERVER-38078)WT SCons配置fallocate和sync_file_range的检查已损坏
- [服务器-38421](https://jira.mongodb.org/browse/SERVER-38421)加密的要求应该反映工具链中的内容
- [服务器-38581](https://jira.mongodb.org/browse/SERVER-38581)创建“is_release”编译扩展

### 工具

- [工具-1709](https://jira.mongodb.org/browse/TOOLS-1709)使用-ldflags设置构建版本和git修订版
- [工具-2149](https://jira.mongodb.org/browse/TOOLS-2149)在Evergreen之外配置构建

### 内部人员

- [服务器-34770](https://jira.mongodb.org/browse/SERVER-34770)重试降级套件中的JavaScript执行中断
- [服务器-35062](https://jira.mongodb.org/browse/SERVER-35062)将TPCC添加到Sys Perf配置中
- [服务器-35250](https://jira.mongodb.org/browse/SERVER-35250)在debug_symbols tar中保存dbtest调试符号
- [服务器-35768](https://jira.mongodb.org/browse/SERVER-35768)gssapiServiceName URL参数不起作用
- [服务器-35832](https://jira.mongodb.org/browse/SERVER-35832)正确使用 Dagger 常青配置中的缺陷
- [服务器-36060](https://jira.mongodb.org/browse/SERVER-36060)在clang-6上进行单元测试干净构建
- [服务器-36437](https://jira.mongodb.org/browse/SERVER-36437)dbstats命令应该将数据库锁定在MODE_IS中，而不是MODE_S
- [服务器-36626](https://jira.mongodb.org/browse/SERVER-36626)从左到右绘制等待图
- [服务器-36805](https://jira.mongodb.org/browse/SERVER-36805)在3个节点replset上运行tpcc
- [服务器-36998](https://jira.mongodb.org/browse/SERVER-36998)compile_dbtest任务没有在Enterprise Windows 2008R2构建器上针对大型发行版运行
- [服务器-37472](https://jira.mongodb.org/browse/SERVER-37472)如果用户在没有将FCV设置为4.0的情况下降级到4.0二进制文件，则改进行为
- [服务器-37526](https://jira.mongodb.org/browse/SERVER-37526)IDLify list数据库命令
- [服务器-37527](https://jira.mongodb.org/browse/SERVER-37527)ServerMechanismBase类中的逻辑损坏。
- [服务器-37551](https://jira.mongodb.org/browse/SERVER-37551)将{authorizedDatabases:bool}参数添加到{listDatabases}命令中。
- [服务器-37628](https://jira.mongodb.org/browse/SERVER-37628)修复mongo_uri_test：无效测试案例构建
- [服务器-37678](https://jira.mongodb.org/browse/SERVER-37678)更新lint以在标头文件中执行SSPL
- [服务器-37717](https://jira.mongodb.org/browse/SERVER-37717)Baton::notify()和Waitable::wait()之间的比赛
- [服务器-37854](https://jira.mongodb.org/browse/SERVER-37854)覆盖率分析缺陷105094：单硝化标量场
- [服务器-37877](https://jira.mongodb.org/browse/SERVER-37877)在v4.0上启用审计的sys-perf测试
- [服务器-37913](https://jira.mongodb.org/browse/SERVER-37913)coll_epoch_test1.js在删除集合后不会等待配置服务器复制。
- [服务器-37941](https://jira.mongodb.org/browse/SERVER-37941)当IPv6别名存在时，指定--bind_ip本地主机会导致错误“地址已使用”
- [服务器-38055](https://jira.mongodb.org/browse/SERVER-38055)通过shell启动的Mongod服务器不尊重TestData.enableMajorityReadConcern
- [服务器-38066](https://jira.mongodb.org/browse/SERVER-38066)Shell utils应该以二进制模式打开文件
- [服务器-38098](https://jira.mongodb.org/browse/SERVER-38098)MongoDB的yaml-cpp被最新的MSVC拒绝
- [服务器-38111](https://jira.mongodb.org/browse/SERVER-38111)在generate_resmoke_suite.py中实现max_sub_suites
- [服务器-38116](https://jira.mongodb.org/browse/SERVER-38116)更新模糊器任务以使用gener生成.tasks
- [服务器-38159](https://jira.mongodb.org/browse/SERVER-38159)mmapv1上的黑名单umask nopassthrough测试
- [服务器-38178](https://jira.mongodb.org/browse/SERVER-38178)使用终止的StringDatas时，在data_builder.h中缓冲区溢出
- [服务器-38281](https://jira.mongodb.org/browse/SERVER-38281)TLS信息消息没有捕获到系统日志中
- [服务器-38303](https://jira.mongodb.org/browse/SERVER-38303)暂时处理由于未启用ipv6的s390x机器导致的ipv6故障
- [服务器-38306](https://jira.mongodb.org/browse/SERVER-38306)在vergreen_gen_fuzzer_test中将“multipath”更改为“multiversion”
- [服务器-38312](https://jira.mongodb.org/browse/SERVER-38312)无法在长名称的变体上运行jstestfuzz*任务
- [服务器-38452](https://jira.mongodb.org/browse/SERVER-38452)自动化MongoDB嵌入式Maven Central版本
- [工具-1566](https://jira.mongodb.org/browse/TOOLS-1566)不应包含Linux 64版本的“ssl”标签
- [工具-1742](https://jira.mongodb.org/browse/TOOLS-1742)util和testutil之间的导入周期
- [工具-1996](https://jira.mongodb.org/browse/TOOLS-1996)允许从普通GOPATH内部构建工具
- [工具-2155](https://jira.mongodb.org/browse/TOOLS-2155)在Evergreen和Server Evergreen中通过ldflags设置版本/git-commit
- [工具-2157](https://jira.mongodb.org/browse/TOOLS-2157)更新服务器供应商
- [WT-3756](https://jira.mongodb.org/browse/WT-3756)如果我们使用速度不够快，请向下调整预分配的文件量
- [WT-4043](https://jira.mongodb.org/browse/WT-4043)转储缓存时取锁，以避免崩溃
- [WT-4159](https://jira.mongodb.org/browse/WT-4159)改进日志预分配算法
- [WT-4298](https://jira.mongodb.org/browse/WT-4298)修复工作根以重试WT_ROLLBACK，并在热身后清除操作
- [WT-4343](https://jira.mongodb.org/browse/WT-4343)睡觉时解锁，允许其他日志线程取得进展
- [WT-4345](https://jira.mongodb.org/browse/WT-4345)在面对丢失的日志文件时设置损坏并返回打捞
- [WT-4371](https://jira.mongodb.org/browse/WT-4371)改进Workgen以创建类似MongoDB的工作负载
- [WT-4372](https://jira.mongodb.org/browse/WT-4372)对于吞吐量测试，创建一个标准指标来测量延迟平滑度
- [WT-4376](https://jira.mongodb.org/browse/WT-4376)修复了打开表格索引可以比赛的错误
- [WT-4378](https://jira.mongodb.org/browse/WT-4378)为会话级别统计创建新的自动函数和光标
- [WT-4381](https://jira.mongodb.org/browse/WT-4381)重置WT_SESSION::reset()上的会话统计信息
- [WT-4385](https://jira.mongodb.org/browse/WT-4385)光标扫描期间的准备冲突可能会返回错误的键
- [WT-4392](https://jira.mongodb.org/browse/WT-4392)绒毛大变化
- [WT-4394](https://jira.mongodb.org/browse/WT-4394)通过拆分“检查”测试来减少Evergreen Ubuntu构建变体的运行时
- [WT-4395](https://jira.mongodb.org/browse/WT-4395)Seg故障使用日志光标行走损坏的日志
- [WT-4396](https://jira.mongodb.org/browse/WT-4396)在准备冲突后重试时，光标无法找到有效的更新
- [WT-4399](https://jira.mongodb.org/browse/WT-4399)使用工作根的wtperf仿真修复压缩
- [WT-4400](https://jira.mongodb.org/browse/WT-4400)修复PRIxxx宏的工作根使用，这是旧C++编译器所需的
- [WT-4401](https://jira.mongodb.org/browse/WT-4401)workgen：wtperf仿真：sample_interval用整数值打破
- [WT-4402](https://jira.mongodb.org/browse/WT-4402)在wtperf中添加回滚支持并监控JSON输出
- [WT-4403](https://jira.mongodb.org/browse/WT-4403)添加统计跟踪累积的脏缓存
- [WT-4405](https://jira.mongodb.org/browse/WT-4405)修复准备的交易的下一个和上一个光标
- [WT-4409](https://jira.mongodb.org/browse/WT-4409)修复工作根节流
- [WT-4411](https://jira.mongodb.org/browse/WT-4411)添加了当前缓存光标总数的连接统计信息
- [WT-4412](https://jira.mongodb.org/browse/WT-4412)wtperf 覆盖修复
- [WT-4418](https://jira.mongodb.org/browse/WT-4418)不要保留分配给缓存光标的键/值内存缓冲区
- [WT-4419](https://jira.mongodb.org/browse/WT-4419)大端机器错误地配置了小端crc32c支持
- [WT-4422](https://jira.mongodb.org/browse/WT-4422)不要排队清理页面进行紧急驱逐
- [WT-4427](https://jira.mongodb.org/browse/WT-4427)使WiredTiger时间戳始终打开，并发出8字节
- [WT-4440](https://jira.mongodb.org/browse/WT-4440)为了清晰起见，强制复制稳定的时间戳



## 4.0.4 更改日志

### 安全

[服务器-37135](https://jira.mongodb.org/browse/SERVER-37135)TLSVersionCounts需要跟踪和报告TLS 1.3

### 分片

- [服务器-29160](https://jira.mongodb.org/browse/SERVER-29160)分流通常使用15秒的写入关注超时，这些超时在迁移相关操作中超时，并导致BF
- [服务器-31563](https://jira.mongodb.org/browse/SERVER-31563)重新评估not_allowed_on_sharded_collection_cmd.js测试
- [服务器-31892](https://jira.mongodb.org/browse/SERVER-31892)moveChunk with `waitForDelete`不会等待大多数人的写作担忧
- [服务器-35323](https://jira.mongodb.org/browse/SERVER-35323)sessionId匹配忽略了lsid的userId部分
- [服务器-35763](https://jira.mongodb.org/browse/SERVER-35763)lastWriteDate字段在迁移过程中可以在repl集节点之间不同步
- [服务器-36831](https://jira.mongodb.org/browse/SERVER-36831)mongos上的LogicalSessionCache无法正确报告活动操作
- [服务器-36850](https://jira.mongodb.org/browse/SERVER-36850)添加复制直通套件，以检测LogicalSessionsCache中的错误
- [服务器-36959](https://jira.mongodb.org/browse/SERVER-36959)_shardServerShardCollection在计算配置服务器上的块时应使用 afterOpTime
- [服务器-37142](https://jira.mongodb.org/browse/SERVER-37142)移动过程中的不变故障主要在清理期间
- [服务器-37330](https://jira.mongodb.org/browse/SERVER-37330)添加分片直通套件，以检测LogicalSessionCache中的错误
- [服务器-37430](https://jira.mongodb.org/browse/SERVER-37430)在定期运行器在mongod关闭中被摧毁后，销毁分片任务执行者和AsyncRequestSenders
- [服务器-37496](https://jira.mongodb.org/browse/SERVER-37496)进程多线程后，平衡器不应该注册关机任务
- [服务器-37578](https://jira.mongodb.org/browse/SERVER-37578)在分片集合之前，断言区域与碎片相关联
- [服务器-37657](https://jira.mongodb.org/browse/SERVER-37657)如果批处理包含非增加的交易编号，请报告违规的oplog条目
- [服务器-37918](https://jira.mongodb.org/browse/SERVER-37918)如果传递未排序区域列表，快速初始拆分算法会生成损坏的路由信息

### 复制

- [服务器-20845](https://jira.mongodb.org/browse/SERVER-20845)将replSetReconfig重新添加到审计套件中
- [服务器-36978](https://jira.mongodb.org/browse/SERVER-36978)在运行任务之前，TaskRunner必须确保线程的客户端已初始化
- [服务器-36979](https://jira.mongodb.org/browse/SERVER-36979)中止交易必须在释放锁之前中止WUOW。
- [服务器-37118](https://jira.mongodb.org/browse/SERVER-37118)覆盖分析缺陷105000：错误顺序的论点
- [服务器-37227](https://jira.mongodb.org/browse/SERVER-37227)重新引入启用MajorityReadConcern:false服务器参数
- [服务器-37514](https://jira.mongodb.org/browse/SERVER-37514)快照阅读没有at的关注Cluster时间应该总是投机性的

### 查询

- [服务器-37058](https://jira.mongodb.org/browse/SERVER-37058)在数组中更新数字字段名称可能会导致验证失败
- [服务器-37132](https://jira.mongodb.org/browse/SERVER-37132)使用正则表达式否定$in可能会错误地从缓存中计划，导致查询结果缺失

### JavaScript

- [服务器-30773](https://jira.mongodb.org/browse/SERVER-30773)bsonWoCompare和bsonBinaryEqual应该与bsonelement类型一起工作
- [服务器-37126](https://jira.mongodb.org/browse/SERVER-37126)为所有外部implscope方法安全调用run

### 储存

- [服务器-26854](https://jira.mongodb.org/browse/SERVER-26854)子操作的LockStats不应包括之前子操作的时间
- [服务器-36534](https://jira.mongodb.org/browse/SERVER-36534)编写操作日志条目时，不要在操作日志上获取锁
- [服务器-36883](https://jira.mongodb.org/browse/SERVER-36883)在SERVER-36534中支持非文档锁定存储引擎
- [服务器-37055](https://jira.mongodb.org/browse/SERVER-37055)IndexBuildBlock::fail()应该抓住一个锁
- [服务器-37394](https://jira.mongodb.org/browse/SERVER-37394)不变的失败截止日期！= Date_t::max() 或 Invariant failure date.isFormattable()
- [服务器-37618](https://jira.mongodb.org/browse/SERVER-37618)捕获lock_stats_suboperation_logs.js中的所有日志
- [服务器-37662](https://jira.mongodb.org/browse/SERVER-37662)在服务器状态的输出中包含备份客户状态
- [服务器-37749](https://jira.mongodb.org/browse/SERVER-37749)replSetResizeOplog命令无法验证参数

### 构建和包装

- [服务器-37067](https://jira.mongodb.org/browse/SERVER-37067)将静态OpenSSL升级到1.1.0i
- [服务器-37158](https://jira.mongodb.org/browse/SERVER-37158)为darwin SDK共享库设置兼容性_version字段
- [服务器-37402](https://jira.mongodb.org/browse/SERVER-37402)改进移动许可文本
- [服务器-37407](https://jira.mongodb.org/browse/SERVER-37407)协调嵌入式tarball名称和未打包的目录名称
- [服务器-37488](https://jira.mongodb.org/browse/SERVER-37488)将BCSymbolsMap安装到darwin嵌入式框架中
- [服务器-37584](https://jira.mongodb.org/browse/SERVER-37584)在区分大小写的macOS文件系统上构建失败：CommonHmac.h
- [服务器-37596](https://jira.mongodb.org/browse/SERVER-37596)将调试信息包添加到移动SDK构建中
- [服务器-37640](https://jira.mongodb.org/browse/SERVER-37640)全局命名空间中没有名为“SSLCopyRequestedPeerNameLength”的成员
- [服务器-37651](https://jira.mongodb.org/browse/SERVER-37651)更新MongoDB社区版的许可证文件
- [服务器-37691](https://jira.mongodb.org/browse/SERVER-37691)使用-fapplication-extension标志编译WatchOS版本
- [服务器-37754](https://jira.mongodb.org/browse/SERVER-37754)IDL文件中的许可证头重复
- [服务器-37785](https://jira.mongodb.org/browse/SERVER-37785)在框架中重命名捆绑标识符，以遵守捆绑命名规则
- [服务器-37852](https://jira.mongodb.org/browse/SERVER-37852)在发布版本上发布移动工件

### 工具

- [工具-2069](https://jira.mongodb.org/browse/TOOLS-2069)mongoreplay不支持SCRAM-SHA-256
- [工具-2102](https://jira.mongodb.org/browse/TOOLS-2102)Mongorestore不会检查解码oplog.bson文件的错误
- [工具-2131](https://jira.mongodb.org/browse/TOOLS-2131)mongorestore使用--archive和--oplogReplay选项重播oplog

### 内部人员

- [服务器-18985](https://jira.mongodb.org/browse/SERVER-18985)setParameter应该在0级进行记录
- [服务器-31570](https://jira.mongodb.org/browse/SERVER-31570)调整蒙戈布里奇端口分配，以便于调试
- [服务器-33470](https://jira.mongodb.org/browse/SERVER-33470)在 hook_test_archival.py 中记录存档消息，即使成功
- [服务器-34986](https://jira.mongodb.org/browse/SERVER-34986)CIDR Block 豁免 maxConns
- [服务器-35570](https://jira.mongodb.org/browse/SERVER-35570)提高 backup_restore.js 围绕删除测试数据库的鲁棒性
- [服务器-35818](https://jira.mongodb.org/browse/SERVER-35818)提供stdx::变体
- [服务器-35861](https://jira.mongodb.org/browse/SERVER-35861)在perf.yml中删除对dashboard_gen.py的调用
- [服务器-36250](https://jira.mongodb.org/browse/SERVER-36250)添加对可选记录特定协商TLS版本的支持
- [服务器-36420](https://jira.mongodb.org/browse/SERVER-36420)SecTrustCopyAnchor证书在叉子后使用不安全
- [服务器-36451](https://jira.mongodb.org/browse/SERVER-36451)由于无法启动主节点，带有杀戮节点的ContinuousStepdown可能会挂起
- [服务器-36705](https://jira.mongodb.org/browse/SERVER-36705)为嵌入式darwin框架添加CocoaPod
- [服务器-36721](https://jira.mongodb.org/browse/SERVER-36721)list_local_sessions.js无法与reshLogicalSessionCacheNow同时运行
- [服务器-36756](https://jira.mongodb.org/browse/SERVER-36756)当模糊器的自我测试失败时，记录10gen/jstestfuzz存储库的githash
- [服务器-36885](https://jira.mongodb.org/browse/SERVER-36885)当资源暂时耗时，让ASIO记住IOCP状态
- [服务器-36964](https://jira.mongodb.org/browse/SERVER-36964)防止SessionsCollectionRS中的二等生尝试设置会话集合。
- [服务器-36986](https://jira.mongodb.org/browse/SERVER-36986)list_local_sessions.js预计与LogicalSessionsCache刷新同时运行时不存在的会话
- [服务器-36988](https://jira.mongodb.org/browse/SERVER-36988)与LogicalSessionCache刷新套件同时运行时，awaitdata_getmore_cmd.js超时
- [服务器-37064](https://jira.mongodb.org/browse/SERVER-37064)将“mongod_flags”包裹在多行上，以提高可读性
- [服务器-37081](https://jira.mongodb.org/browse/SERVER-37081)解决GenericSocket时捕获asio::system_errors
- [服务器-37083](https://jira.mongodb.org/browse/SERVER-37083)改进窗口安全分配器
- [服务器-37228](https://jira.mongodb.org/browse/SERVER-37228)在挂分析仪的等待图中转义双引号
- [服务器-37334](https://jira.mongodb.org/browse/SERVER-37334)剥离不必要的共享对象的.jar和.aar
- [服务器-37353](https://jira.mongodb.org/browse/SERVER-37353)优雅地处理LLONG_MIN的$slice价值
- [服务器-37391](https://jira.mongodb.org/browse/SERVER-37391)plan_cache_index_create.js应该等待索引构建开始，而不仅仅是createIndexes命令启动
- [服务器-37393](https://jira.mongodb.org/browse/SERVER-37393)修复析构器竞赛`ReplicaSetMonitorManager`
- [服务器-37410](https://jira.mongodb.org/browse/SERVER-37410)添加独立的直通套件，以检测LogicalSessionCache中的错误
- [服务器-37411](https://jira.mongodb.org/browse/SERVER-37411)修复嵌入式Info.plist中的捆绑标识符
- [服务器-37424](https://jira.mongodb.org/browse/SERVER-37424)Sys-perf：将v4.0分支批处理时间更改为每周一次
- [服务器-37425](https://jira.mongodb.org/browse/SERVER-37425)寿命测试-将批次时间增加到每年一次
- [服务器-37464](https://jira.mongodb.org/browse/SERVER-37464)减少secondary_reads.js工作负载中的线程计数和迭代
- [服务器-37467](https://jira.mongodb.org/browse/SERVER-37467)让collect_resource_info.py从瞬态错误中恢复。
- [服务器-37477](https://jira.mongodb.org/browse/SERVER-37477)禁用TIG每日cron for update_test_lifecycle
- [服务器-37495](https://jira.mongodb.org/browse/SERVER-37495)将Android最低API级别更改为21
- [服务器-37513](https://jira.mongodb.org/browse/SERVER-37513)从MongoEmbeddedCAPI.create传递JNA异常
- [服务器-37561](https://jira.mongodb.org/browse/SERVER-37561)服务器启动警告显示虚假的空行
- [服务器-37563](https://jira.mongodb.org/browse/SERVER-37563)摆脱`getGlobalAuthorizationManager`和对`authorization_manager_global`库的不必要引用
- [服务器-37583](https://jira.mongodb.org/browse/SERVER-37583)etc/cloud_nightly.yml的更改
- [服务器-37599](https://jira.mongodb.org/browse/SERVER-37599)外壳生成进程的日志退出代码
- [服务器-37683](https://jira.mongodb.org/browse/SERVER-37683)在CocoaPod podspec中将嵌入式iOS min版本更改为11.0
- [服务器-37684](https://jira.mongodb.org/browse/SERVER-37684)在常绿构建器中将嵌入式iOS min版本更改为11.0
- [服务器-37685](https://jira.mongodb.org/browse/SERVER-37685)确保免费监控队列在相同截止日期的消息上保留FIFO
- [服务器-37701](https://jira.mongodb.org/browse/SERVER-37701)跟踪时，使SessionUpdateTracker包含LogicalSessionId的uid部分
- [服务器-37744](https://jira.mongodb.org/browse/SERVER-37744)在mongoc_embedded podspec中修复许可证路径
- [服务器-37755](https://jira.mongodb.org/browse/SERVER-37755)mongoc和bson.frameworks的.plist无效
- [服务器-37813](https://jira.mongodb.org/browse/SERVER-37813)将Android发布从Bintray切换到Artifactory
- [服务器-37832](https://jira.mongodb.org/browse/SERVER-37832)修复v4.0上的Windows/OSX ssl_options_test unittests
- [WT-3898](https://jira.mongodb.org/browse/WT-3898)将准备好的更新放在一边，直到它们被阅读
- [WT-3995](https://jira.mongodb.org/browse/WT-3995)增强时间戳中止以接受更多线程
- [WT-4149](https://jira.mongodb.org/browse/WT-4149)日志恢复和打捞应处理日志文件的删除或截断
- [WT-4164](https://jira.mongodb.org/browse/WT-4164)确保测试/格式配置合理大小的缓存
- [WT-4214](https://jira.mongodb.org/browse/WT-4214)简化时间戳中止测试的时间戳处理
- [WT-4217](https://jira.mongodb.org/browse/WT-4217)增强提交和回滚以重新阅读准备好的更新
- [WT-4220](https://jira.mongodb.org/browse/WT-4220)启用长期运行准备支持
- [WT-4224](https://jira.mongodb.org/browse/WT-4224)添加已准备交易的统计数据
- [WT-4293](https://jira.mongodb.org/browse/WT-4293)WT_CURSOR.remove可能会失去光标位置
- [WT-4297](https://jira.mongodb.org/browse/WT-4297)增强稳定的吞吐量工作负载
- [WT-4314](https://jira.mongodb.org/browse/WT-4314)驱逐树时，不要访问未映射的页面
- [WT-4315](https://jira.mongodb.org/browse/WT-4315)在rollback_to_stable中，如果强制执行，仅检查时间戳顺序
- [WT-4322](https://jira.mongodb.org/browse/WT-4322)在进行检查中启用基于I/O的直接崩溃测试
- [WT-4323](https://jira.mongodb.org/browse/WT-4323)修复设置事务read_timestamp和更新全局固定时间戳之间的竞争
- [WT-4328](https://jira.mongodb.org/browse/WT-4328)在txn中对模式操作使用内部会话句柄
- [WT-4330](https://jira.mongodb.org/browse/WT-4330)如果指定了转储或printlog命令的-f选项，请将wt实用程序更改为不使用stdout
- [WT-4333](https://jira.mongodb.org/browse/WT-4333)WiredTiger光标缓存无法处理所有可能的锁定句柄状态
- [WT-4335](https://jira.mongodb.org/browse/WT-4335)不要因为扫荡活动而失败rollback_to_stable
- [WT-4337](https://jira.mongodb.org/browse/WT-4337)覆盖范围#1395811检查使用时间
- [WT-4338](https://jira.mongodb.org/browse/WT-4338)新的WT_TXN_TS_XXX标志打破#undef HAVE_TIMESTAMPS构建
- [WT-4339](https://jira.mongodb.org/browse/WT-4339)恢复之前简化句柄锁定的提交的一部分
- [WT-4340](https://jira.mongodb.org/browse/WT-4340)光标缓存层可能会错误地释放太多的手柄锁
- [WT-4341](https://jira.mongodb.org/browse/WT-4341)支持Evergeen的百万次收集测试
- [WT-4342](https://jira.mongodb.org/browse/WT-4342)在timetamp_abort测试中在所有配置字符串上设置会话最大值
- [WT-4346](https://jira.mongodb.org/browse/WT-4346)在阅读页面时，从旁路中删除准备好的更新。
- [WT-4347](https://jira.mongodb.org/browse/WT-4347)使用默认配置限制timetamp_abort生成的线程
- [WT-4348](https://jira.mongodb.org/browse/WT-4348)在random_directio测试中生成线程之前创建所有表
- [WT-4351](https://jira.mongodb.org/browse/WT-4351)确保解决已准备的交易使用来自自身的更新
- [WT-4355](https://jira.mongodb.org/browse/WT-4355)在交易回滚期间未能找到准备好的更新
- [WT-4358](https://jira.mongodb.org/browse/WT-4358)增强手柄锁应力测试程序
- [WT-4374](https://jira.mongodb.org/browse/WT-4374)修复页面可能错误地从WT_REF_LIMBO过渡的错误
- [WT-4387](https://jira.mongodb.org/browse/WT-4387)修复工作根中引用共享库的顺序
- [WT-4389](https://jira.mongodb.org/browse/WT-4389)更新wtperf runner脚本以接受多个参数



## 4.0.3 更改日志

### 安全

- [服务器-35418](https://jira.mongodb.org/browse/SERVER-35418)允许分别指定传入和传出连接的CA
- [服务器-36456](https://jira.mongodb.org/browse/SERVER-36456)MongoD在Windows上不支持kerberos
- [服务器-36827](https://jira.mongodb.org/browse/SERVER-36827)关于“无法执行SSL证书验证”的警告具有误导性

### 分片

- [服务器-30841](https://jira.mongodb.org/browse/SERVER-30841)降低元数据刷新日志记录量
- [服务器-34500](https://jira.mongodb.org/browse/SERVER-34500)在setFCV之后从secondary读取时，在database_versioning_upgrade_downgrade.js测试中使用因果一致性
- [服务器-35222](https://jira.mongodb.org/browse/SERVER-35222)在过期的会话清理时在配置服务器上崩溃
- [服务器-35755](https://jira.mongodb.org/browse/SERVER-35755)shard_filtering_metadata_refresh.cpp中的CollectionLock获取可能会导致服务器在降级时终止
- [服务器-35773](https://jira.mongodb.org/browse/SERVER-35773)MetadataManager直接调用目录缓存
- [服务器-36054](https://jira.mongodb.org/browse/SERVER-36054)摆脱ScopedCollectionMetadata的运算符bool
- [服务器-36116](https://jira.mongodb.org/browse/SERVER-36116)摆脱CollectureShardingState::resetAll
- [服务器-36130](https://jira.mongodb.org/browse/SERVER-36130)迁移状态报告验证连接字符串，但这些字符串可能会改变
- [服务器-36164](https://jira.mongodb.org/browse/SERVER-36164)来自MetadataManager的解偶范围范围元数据
- [服务器-36332](https://jira.mongodb.org/browse/SERVER-36332)GetMore中的CursorNotFound错误在二级会话上
- [服务器-36433](https://jira.mongodb.org/browse/SERVER-36433)NamespaceSerializer锁应在删除数据库期间使用
- [服务器-36634](https://jira.mongodb.org/browse/SERVER-36634)在_shardsvrShardCollection中更改FCV检查以检查CommandNotFound，并在非主碎片上创建集合后写入配置
- [服务器-37050](https://jira.mongodb.org/browse/SERVER-37050)在session_collection_auto_healing中等待复制

### 复制

- [服务器-35616](https://jira.mongodb.org/browse/SERVER-35616)对初始同步节点的Oplog查询可能会导致分割故障
- [服务器-35793](https://jira.mongodb.org/browse/SERVER-35793)编写并发性测试来验证全服务器范围的事务指标跟踪
- [服务器-35821](https://jira.mongodb.org/browse/SERVER-35821)readConcern:snapshot交易需要一个读取时间戳<= WT的all_committed点
- [服务器-36127](https://jira.mongodb.org/browse/SERVER-36127)在apply_batch_only_goes_forward.js中使用w:majority而不是w:2
- [服务器-36470](https://jira.mongodb.org/browse/SERVER-36470)防止change_stream_failover.js在旧主步骤关闭后选择与旧主级相同的新主级。
- [服务器-36503](https://jira.mongodb.org/browse/SERVER-36503)在选举交接期间跳过模拟选举
- [服务器-36539](https://jira.mongodb.org/browse/SERVER-36539)如果未设置更多ToCome，请测试DBClientCursor发送获取更多排气光标
- [服务器-36565](https://jira.mongodb.org/browse/SERVER-36565)使用事务终止会话可能会导致线程抛出WriteConflictError
- [服务器-36746](https://jira.mongodb.org/browse/SERVER-36746)失败的下台尝试不应该无条件地将LeaderMode重置为kMaster
- [服务器-36846](https://jira.mongodb.org/browse/SERVER-36846)当尝试断言已过时，TransactionsMetrics单元测试应该会睡一会儿> 0
- [服务器-36975](https://jira.mongodb.org/browse/SERVER-36975)在read_concern_snapshot_catalog_invalidation.js中修复比赛条件
- [服务器-36982](https://jira.mongodb.org/browse/SERVER-36982)重新引入启用MajorityReadConcern:false服务器参数
- [服务器-36985](https://jira.mongodb.org/browse/SERVER-36985)回滚后立即测试单个副本集交易ViaRefetch
- [服务器-37010](https://jira.mongodb.org/browse/SERVER-37010)防止initial_sync4.js和initial_sync_rename_collection*.js中的意外选举
- [服务器-37048](https://jira.mongodb.org/browse/SERVER-37048)每当访问oplog集合指针时，请按住全局意图锁
- [服务器-37105](https://jira.mongodb.org/browse/SERVER-37105)从堆栈跟踪中明确命令是否在事务中运行
- [服务器-37147](https://jira.mongodb.org/browse/SERVER-37147)sessions_collection_auto_healing.js应使用2个节点副本集
- [服务器-37152](https://jira.mongodb.org/browse/SERVER-37152)增加在tags.js中预期成功的写入的写入关注超时

### 查询

- [服务器-13946](https://jira.mongodb.org/browse/SERVER-13946)考虑将跳过阶段放在获取阶段下方
- [服务器-36212](https://jira.mongodb.org/browse/SERVER-36212)在FCV为4.0之前， getMore不应该强制执行会话ID匹配
- [服务器-36299](https://jira.mongodb.org/browse/SERVER-36299)在DBClientCursor中使用OP_MSG实现对排气光标的支持
- [服务器-36435](https://jira.mongodb.org/browse/SERVER-36435)在awaitdata_getmore_cmd.js中增加maxTimeMS超时
- [服务器-36453](https://jira.mongodb.org/browse/SERVER-36453)在aggregation_cursor_invalidations.js中修复比赛条件
- [服务器-36944](https://jira.mongodb.org/browse/SERVER-36944)在创建v:1索引时，applyOps不允许未知字段名称
- [服务器-36951](https://jira.mongodb.org/browse/SERVER-36951)applyOps应该使用没有UUID的createIndexes命令

### 集合

[服务器-36993](https://jira.mongodb.org/browse/SERVER-36993)mongod崩溃：不变故障索引或src/mongo/db/query/index_tag.cpp 237

### 储存

- [服务器-34577](https://jira.mongodb.org/browse/SERVER-34577)read_after_optime.js在mongoe上失败
- [服务器-34606](https://jira.mongodb.org/browse/SERVER-34606)测试（并可能修复）大多数提交点和操作截断周围的行为
- [服务器-35657](https://jira.mongodb.org/browse/SERVER-35657)当操作等待oplog可见性时，不要延迟日志刷新
- [服务器-35780](https://jira.mongodb.org/browse/SERVER-35780) `renameCollection`跨数据库错误地为二级索引构建的元数据盖上时间戳
- [服务器-36400](https://jira.mongodb.org/browse/SERVER-36400)在退出每个BackgroundJob的运行主体时显式销毁客户端
- [服务器-36531](https://jira.mongodb.org/browse/SERVER-36531)当WT门票用尽时，尽管存在UnruptibleLockGuard，但锁购可能会抛出
- [服务器-36879](https://jira.mongodb.org/browse/SERVER-36879)为回滚期间卡住的缓存问题编写回归测试
- [服务器-36961](https://jira.mongodb.org/browse/SERVER-36961)createIndexes命令应该检查索引是否已经存在弱锁
- [服务器-36969](https://jira.mongodb.org/browse/SERVER-36969)initial_sync_wt_cache_full.js在慢速主机上完成需要太长时间
- [服务器-37002](https://jira.mongodb.org/browse/SERVER-37002)通过重命名删除具有长索引名称的集合在MMAPv1下失败
- [服务器-37121](https://jira.mongodb.org/browse/SERVER-37121)重试时间戳辅助背景索引构建

#### 有线老虎

- [服务器-19815](https://jira.mongodb.org/browse/SERVER-19815)使用WiredTiger存储引擎使维修更坚固

### 运营

- [服务器-27588](https://jira.mongodb.org/browse/SERVER-27588)禁用thp时禁用trans透明_hugepages碎片整理的警告
- [服务器-33606](https://jira.mongodb.org/browse/SERVER-33606)如果服务器不支持逻辑会话，mongo shell startSession()应该会失败
- [服务器-34864](https://jira.mongodb.org/browse/SERVER-34864)字符串值字段不应参与ftdc中的模式更改检测
- [服务器-35989](https://jira.mongodb.org/browse/SERVER-35989)Mongo shell需要一个计数文档功能

### 构建和包装

- [服务器-29908](https://jira.mongodb.org/browse/SERVER-29908)库db/s/sharding和db/query/query是直接循环的
- [服务器-33911](https://jira.mongodb.org/browse/SERVER-33911)允许为特定目标覆盖全局链路模型
- [服务器-33912](https://jira.mongodb.org/browse/SERVER-33912)从嵌入式构建中删除--disable-warnings-as-errors
- [服务器-34007](https://jira.mongodb.org/browse/SERVER-34007)Relicense Embedded SDK 构建
- [服务器-35078](https://jira.mongodb.org/browse/SERVER-35078)使用位码构建嵌入式SDK
- [服务器-35184](https://jira.mongodb.org/browse/SERVER-35184)为嵌入式SDK构建器启用链接时间优化
- [服务器-36884](https://jira.mongodb.org/browse/SERVER-36884)更新稳定分支上的策展人版本
- [服务器-36943](https://jira.mongodb.org/browse/SERVER-36943)使用-Wl,-object_path_lto构建嵌入式目标
- [服务器-37138](https://jira.mongodb.org/browse/SERVER-37138)恢复到始终使用位码构建
- [服务器-37157](https://jira.mongodb.org/browse/SERVER-37157)为嵌入式创建统一的darwin构建器
- [服务器-37251](https://jira.mongodb.org/browse/SERVER-37251)恢复到Android NDK设置的稳定通道

### 工具

- [服务器-30997](https://jira.mongodb.org/browse/SERVER-30997)mongo cli --密码被屏蔽，但在使用mongodb://连接字符串时不会被屏蔽
- [工具-2035](https://jira.mongodb.org/browse/TOOLS-2035)mongofiles_write_concern_mongos.js在服务器不稳定时失败

### 内部人员

- [服务器-28990](https://jira.mongodb.org/browse/SERVER-28990)当开始时--维修蒙古人不应该试图绑定到端口
- [服务器-33908](https://jira.mongodb.org/browse/SERVER-33908)在CAPI实现中添加调用前和调用后后台活动钩子
- [服务器-33978](https://jira.mongodb.org/browse/SERVER-33978)evergreen.yml中对sudo的引用应使用${set_sudo}
- [服务器-34120](https://jira.mongodb.org/browse/SERVER-34120)范围连接未返回池
- [服务器-34711](https://jira.mongodb.org/browse/SERVER-34711)启用burn_in_tests以了解Evergreen任务选择器
- [服务器-34798](https://jira.mongodb.org/browse/SERVER-34798)用装饰和灵活的初始化代码替换ServiceContext的子类
- [服务器-35216](https://jira.mongodb.org/browse/SERVER-35216)将ReplicaSetManager刷新期暴露在mongo shell中
- [服务器-35233](https://jira.mongodb.org/browse/SERVER-35233)Powercycle远程收集验证不会跳过视图
- [服务器-35284](https://jira.mongodb.org/browse/SERVER-35284)C++“死亡测试”单元测试应在构建测试夹具之前分叉，而不是之后。
- [服务器-35517](https://jira.mongodb.org/browse/SERVER-35517)在mongo shell中添加故障点机制
- [服务器-35585](https://jira.mongodb.org/browse/SERVER-35585)Make PeriodicRunner工作可平铺/可恢复
- [服务器-35629](https://jira.mongodb.org/browse/SERVER-35629)使用WiredTiger打捞API修复元数据文件
- [服务器-35630](https://jira.mongodb.org/browse/SERVER-35630)数据文件丢失或损坏应导致MongoDB退出并显示错误消息以运行修复
- [服务器-35696](https://jira.mongodb.org/browse/SERVER-35696)提供一种恢复WiredTiger已知但_mdb_catalog未知的身份的方法
- [服务器-35731](https://jira.mongodb.org/browse/SERVER-35731)防止修复的节点重新加入副本集
- [服务器-35782](https://jira.mongodb.org/browse/SERVER-35782)维修应该把不可挽救的数据文件移到一边，代替它们创建空文件
- [服务器-35784](https://jira.mongodb.org/browse/SERVER-35784)修复名称模糊的测试夹具`commands_test.cpp`
- [服务器-35800](https://jira.mongodb.org/browse/SERVER-35800)resmoke.py应该重新尝试从日志保存器获取build_id和test_id
- [服务器-35985](https://jira.mongodb.org/browse/SERVER-35985)sessions_test和sharding_catalog_manager_test在销毁ServiceContext之前不会销毁所有客户端
- [服务器-36019](https://jira.mongodb.org/browse/SERVER-36019)创建脚本以收集Android应用程序的资源利用率
- [服务器-36069](https://jira.mongodb.org/browse/SERVER-36069)与mongoebench兼容的供应商JSON配置文件从mongodb/mongo-perf到src/third_party
- [服务器-36076](https://jira.mongodb.org/browse/SERVER-36076)创建新的resmoke.py测试套件，用于在桌面上运行mongoebench
- [服务器-36077](https://jira.mongodb.org/browse/SERVER-36077)创建新的resmoke.py测试套件，用于在Android设备上运行mongoebench
- [服务器-36078](https://jira.mongodb.org/browse/SERVER-36078)将adb资源监视器集成到Android的mongoebench测试套件中
- [服务器-36084](https://jira.mongodb.org/browse/SERVER-36084)从嵌入式中删除分片运行时
- [服务器-36162](https://jira.mongodb.org/browse/SERVER-36162)Powercycle - 确保在远程主机上执行内部崩溃命令
- [服务器-36169](https://jira.mongodb.org/browse/SERVER-36169)重新吸烟：除了下梯钩外，光秃秃的举起
- [服务器-36258](https://jira.mongodb.org/browse/SERVER-36258)在执行mongo初始化器后执行ServiceContext的构建，而不是在
- [服务器-36347](https://jira.mongodb.org/browse/SERVER-36347)让parse_zone_info.js处理来自ServiceContext重构的新错误消息
- [服务器-36351](https://jira.mongodb.org/browse/SERVER-36351)ServiceContextMongoDTest没有正确地保留TempDir
- [服务器-36474](https://jira.mongodb.org/browse/SERVER-36474)如果在命令行禁用免费监控，则无法启动副本集
- [服务器-36621](https://jira.mongodb.org/browse/SERVER-36621)capi_test.cpp中对log()的调用不会打印到stdout
- [服务器-36691](https://jira.mongodb.org/browse/SERVER-36691)仅在从维修开始时恢复孤儿收集身份，而不是在不干净的关机后
- [服务器-36702](https://jira.mongodb.org/browse/SERVER-36702)SCons将能够将二进制文件安装为darwin框架
- [服务器-36703](https://jira.mongodb.org/browse/SERVER-36703)SCons将能够与darwin框架联系起来
- [服务器-36704](https://jira.mongodb.org/browse/SERVER-36704)嵌入到支持与独立蒙古相同的逻辑会话
- [服务器-36722](https://jira.mongodb.org/browse/SERVER-36722)为嵌入式AAR/JAR添加远程maven存储库
- [服务器-36725](https://jira.mongodb.org/browse/SERVER-36725)periodic_runner_impl_test应该手动调用 tearDown
- [服务器-36732](https://jira.mongodb.org/browse/SERVER-36732)等待所有二等兵在选举交接中当选jstests
- [服务器-36747](https://jira.mongodb.org/browse/SERVER-36747)在“jstests/ssl/ssl_client_certificate_warning_suppression.js”中添加一个小时间延迟
- [服务器-36749](https://jira.mongodb.org/browse/SERVER-36749)删除服务执行器自适应关机中的竞赛
- [服务器-36757](https://jira.mongodb.org/browse/SERVER-36757)生成并提取与mongoebench兼容的JSON配置文件到一致的位置
- [服务器-36761](https://jira.mongodb.org/browse/SERVER-36761)将requireplication标签添加到disk/repair_invalidates_replica_set_config.js
- [服务器-36768](https://jira.mongodb.org/browse/SERVER-36768)孤儿收藏恢复应允许重新命名恢复的集合
- [服务器-36783](https://jira.mongodb.org/browse/SERVER-36783)在rhel62-large上运行enprise-rhel-62-64-bit-inmem的secondary_reads_passthrough任务
- [服务器-36836](https://jira.mongodb.org/browse/SERVER-36836)v4.0 fsm工作负载“yield_group.js”应接受“InternalError”作为组命令的可能结果
- [服务器-36842](https://jira.mongodb.org/browse/SERVER-36842)电源循环主机不变故障后未生成核心转储
- [服务器-36869](https://jira.mongodb.org/browse/SERVER-36869)fsm上限的集合检查应该只对断言进行1次查询
- [服务器-36897](https://jira.mongodb.org/browse/SERVER-36897)OplogReader.hasNext可以返回false -> true，令人困惑`checkOplogs`
- [服务器-36906](https://jira.mongodb.org/browse/SERVER-36906)连接状态现在允许为kConnectionState未知
- [服务器-36919](https://jira.mongodb.org/browse/SERVER-36919)添加服务器setParameter tlsWithholdClientCertificate（bool）
- [服务器-36942](https://jira.mongodb.org/browse/SERVER-36942)区分无效主机名和无效证书
- [服务器-36947](https://jira.mongodb.org/browse/SERVER-36947)为perf微基准启用测试命令
- [服务器-36980](https://jira.mongodb.org/browse/SERVER-36980)从常青树中取出旧的聚合模糊器
- [服务器-36987](https://jira.mongodb.org/browse/SERVER-36987)ChunkVersion::minorVersion截断为16位
- [服务器-37013](https://jira.mongodb.org/browse/SERVER-37013)兼容mongoebench的JSON配置文件尝试在不使用“查找”命令的情况下从视图中读取
- [服务器-37041](https://jira.mongodb.org/browse/SERVER-37041)更新旧分支机构上的评估黑名单，以解释不同分支机构测试的差异
- [服务器-37042](https://jira.mongodb.org/browse/SERVER-37042)在ReplSetTest中处理来自cursor.next的异常
- [服务器-37071](https://jira.mongodb.org/browse/SERVER-37071)来自retryable_writes_jscore_stepdown_passthrough的黑名单set7.js和max_doc_size.js
- [服务器-37127](https://jira.mongodb.org/browse/SERVER-37127)更新sys-perf的基线比较
- [服务器-37149](https://jira.mongodb.org/browse/SERVER-37149)移除 ScheduleBeforeStartupTest中的死锁
- [服务器-37156](https://jira.mongodb.org/browse/SERVER-37156)benchRun应该等待它产生的工人线程退出
- [服务器-37170](https://jira.mongodb.org/browse/SERVER-37170)mongos无法从动态构建上的错误“DuplicateKey SetWiredTigerCustomizationHooks”开始
- [服务器-37216](https://jira.mongodb.org/browse/SERVER-37216)Android Multiarch构建器无法发布到mavenLocal
- [服务器-37256](https://jira.mongodb.org/browse/SERVER-37256)将缺失的index_access_methods依赖项添加到storage_wiredtiger_recovery_unit_test
- [工具-1989](https://jira.mongodb.org/browse/TOOLS-1989)切换常青密集型测试，以匹配服务器优先构建版本
- [工具-2050](https://jira.mongodb.org/browse/TOOLS-2050)由于访问违规错误，oplog_rename_test在Windows上失败
- [工具-2099](https://jira.mongodb.org/browse/TOOLS-2099)工具jstests在副本集关闭时失败
- [WT-3735](https://jira.mongodb.org/browse/WT-3735)添加一个生成大量页面拆分的工头工作负载
- [WT-3736](https://jira.mongodb.org/browse/WT-3736)添加统计数据来衡量旁觀光标上的争用
- [WT-3879](https://jira.mongodb.org/browse/WT-3879)禁止检查点驱逐元数据页面
- [WT-3894](https://jira.mongodb.org/browse/WT-3894)时间戳队列实现和统计改进
- [WT-4090](https://jira.mongodb.org/browse/WT-4090)低优先级读取
- [WT-4104](https://jira.mongodb.org/browse/WT-4104)修复与伯克利db比较数据内容时的测试/格式故障
- [WT-4119](https://jira.mongodb.org/browse/WT-4119)避免在列存储扫描期间重新启动更新/删除
- [WT-4131](https://jira.mongodb.org/browse/WT-4131)将外观重新命名为缓存溢出
- [WT-4144](https://jira.mongodb.org/browse/WT-4144)修复带有旁观历史的rollback_to_stable
- [WT-4154](https://jira.mongodb.org/browse/WT-4154)表面最古老的阅读时间戳
- [WT-4156](https://jira.mongodb.org/browse/WT-4156)添加新的wiredtiger_salvage顶级API
- [WT-4176](https://jira.mongodb.org/browse/WT-4176)公开WT_SESSION.query_timestamp方法
- [WT-4177](https://jira.mongodb.org/browse/WT-4177)打开备份光标应该强制切换日志文件
- [WT-4185](https://jira.mongodb.org/browse/WT-4185)阅读页面时，不要删除所有旁白条目
- [WT-4211](https://jira.mongodb.org/browse/WT-4211)为长期准备的交易添加自动测试
- [WT-4212](https://jira.mongodb.org/browse/WT-4212)更新旁路模式以处理准备好的交易
- [WT-4216](https://jira.mongodb.org/browse/WT-4216)使用单独的计数器进行page_swap产量和睡眠
- [WT-4218](https://jira.mongodb.org/browse/WT-4218)将驱逐更改为驱逐准备好的更新
- [WT-4225](https://jira.mongodb.org/browse/WT-4225)自动进行备份测试，通过dd模拟卷快照
- [WT-4231](https://jira.mongodb.org/browse/WT-4231)用属性修复函数的ctags索引
- [WT-4233](https://jira.mongodb.org/browse/WT-4233)将日志损坏错误更改为警告并截断日志
- [WT-4239](https://jira.mongodb.org/browse/WT-4239)不要允许检查点在树上执行插入-分裂
- [WT-4241](https://jira.mongodb.org/browse/WT-4241)GNU堆栈部分绝不应有条件编译
- [WT-4243](https://jira.mongodb.org/browse/WT-4243)修复旁扫，以免删除所需的条目
- [WT-4246](https://jira.mongodb.org/browse/WT-4246)更改交易更新列表以支持间接引用
- [WT-4248](https://jira.mongodb.org/browse/WT-4248)修复schema_abort中缓慢机器的检查点
- [WT-4249](https://jira.mongodb.org/browse/WT-4249)尝试在验证操作期间丢弃脏页面
- [WT-4251](https://jira.mongodb.org/browse/WT-4251)无法丢弃已准备的更新
- [WT-4252](https://jira.mongodb.org/browse/WT-4252)Btree调试函数可以在错误时泄漏划痕缓冲区。
- [WT-4253](https://jira.mongodb.org/browse/WT-4253)用于盲读的Btree调试功能不处理行存储内部页面
- [WT-4256](https://jira.mongodb.org/browse/WT-4256)在rollback_to_stable期间松开检查
- [WT-4257](https://jira.mongodb.org/browse/WT-4257)不要假设来自旁路的时间戳在内存中对齐
- [WT-4259](https://jira.mongodb.org/browse/WT-4259)当驱逐失败时，将ref恢复到以前的状态，而不是MEM
- [WT-4261](https://jira.mongodb.org/browse/WT-4261)测试打捞不同步的元数据/乌龟文件
- [WT-4262](https://jira.mongodb.org/browse/WT-4262)锁定删除的儿童以驱逐内部页面
- [WT-4263](https://jira.mongodb.org/browse/WT-4263)在复制按键进行旁白写时，请使用正确的树
- [WT-4264](https://jira.mongodb.org/browse/WT-4264)压实可以随着页面修改而竞争
- [WT-4267](https://jira.mongodb.org/browse/WT-4267)固定长度的列存储操作可能会损坏数据
- [WT-4268](https://jira.mongodb.org/browse/WT-4268)随机中止应等到记录文件存在后再启动计时器
- [WT-4270](https://jira.mongodb.org/browse/WT-4270)添加一个操作字段以了解线程挂在哪里
- [WT-4272](https://jira.mongodb.org/browse/WT-4272)对于缓慢的I/O系统，将启动超时增加到30秒
- [WT-4274](https://jira.mongodb.org/browse/WT-4274)修复wt4156_metadata_salvage测试中的内存泄漏
- [WT-4277](https://jira.mongodb.org/browse/WT-4277)使专栏商店的截断更有效率
- [WT-4281](https://jira.mongodb.org/browse/WT-4281)缩短Python测试套件的运行时间
- [WT-4282](https://jira.mongodb.org/browse/WT-4282)除非有需要，否则不要将页面从边缘转换为mem
- [WT-4283](https://jira.mongodb.org/browse/WT-4283)恢复WT_ERROR并使用损坏的标志
- [WT-4284](https://jira.mongodb.org/browse/WT-4284)在错误恢复时打印一条冗长的消息
- [WT-4285](https://jira.mongodb.org/browse/WT-4285)修复wt4156_metadata_salvage覆盖/绒毛投诉
- [WT-4286](https://jira.mongodb.org/browse/WT-4286)如果完全匹配，列商店应跳过表末检查
- [WT-4288](https://jira.mongodb.org/browse/WT-4288)不要让关闭conn的返回值覆盖WT_TRY_SALVAGE
- [WT-4289](https://jira.mongodb.org/browse/WT-4289)在test_txn19.py中将WT_DATA_CORRUPTION更新为WT_TRY_SALVAGE
- [WT-4291](https://jira.mongodb.org/browse/WT-4291)通过查找WT_ERROR修复test_txn19.py错误检测
- [WT-4292](https://jira.mongodb.org/browse/WT-4292)添加对testutil_cleanup的调用，以避免内存泄漏
- [WT-4300](https://jira.mongodb.org/browse/WT-4300)设置更新时间戳可以覆盖WT_REF.addr字段
- [WT-4301](https://jira.mongodb.org/browse/WT-4301)WT_CURSOR.reserve操作在提交时可能会泄漏内存
- [WT-4305](https://jira.mongodb.org/browse/WT-4305)添加一个门格变量，用于长期运行准备支持
- [WT-4306](https://jira.mongodb.org/browse/WT-4306)如果元数据页面需要驱逐，请修复模式
- [WT-4308](https://jira.mongodb.org/browse/WT-4308)在同步期间插入拆分不应释放块
- [WT-4321](https://jira.mongodb.org/browse/WT-4321)禁用随机直接I/O测试
- [WT-4325](https://jira.mongodb.org/browse/WT-4325)添加qsort(3)调用的WiredTiger本地版本



## 4.0.2 更改日志

### 分片

- [服务器-14394](https://jira.mongodb.org/browse/SERVER-14394)直接在碎片上创建初始散列碎片密钥块
- [服务器-25333](https://jira.mongodb.org/browse/SERVER-25333)清理迁移目的地经理
- [服务器-27725](https://jira.mongodb.org/browse/SERVER-27725)迁移块时使用批量插入
- [服务器-33417](https://jira.mongodb.org/browse/SERVER-33417)在迁移目标管理器中用复制设计的写入关注方法替换自定义多数写入追赶
- [服务器-35092](https://jira.mongodb.org/browse/SERVER-35092)ShardServerCatalogCacheLoader应该有一个暂停等待阅读关注
- [服务器-35238](https://jira.mongodb.org/browse/SERVER-35238)在mongos_manual_intervention_actions.js中删除mapReduce的部分写入块后，删除集合
- [服务器-35441](https://jira.mongodb.org/browse/SERVER-35441)drop/dropDatabase不会清理config.tags
- [服务器-35658](https://jira.mongodb.org/browse/SERVER-35658)会议迁移对复制品设置的初选过于敏感
- [服务器-35676](https://jira.mongodb.org/browse/SERVER-35676)numInitialChunks参数未验证
- [服务器-35720](https://jira.mongodb.org/browse/SERVER-35720)允许在不存在的集合上创建区域
- [服务器-35722](https://jira.mongodb.org/browse/SERVER-35722)创建在主碎片上运行的内部_shardsvrShardCollection命令
- [服务器-35723](https://jira.mongodb.org/browse/SERVER-35723)将集合关键部分变成RAII类
- [服务器-35794](https://jira.mongodb.org/browse/SERVER-35794)在内部shardCollection命令期间读取集合的区域信息
- [服务器-35849](https://jira.mongodb.org/browse/SERVER-35849)删除写入命令的依赖性`sharding_runtime_d`
- [服务器-36031](https://jira.mongodb.org/browse/SERVER-36031)移动逻辑以创建初始块，并将碎片收集期间的元数据更新为主碎片
- [服务器-36071](https://jira.mongodb.org/browse/SERVER-36071)检查shardsvrShardCollection响应状态
- [服务器-36092](https://jira.mongodb.org/browse/SERVER-36092)创建内部命令，使用现有uuid在新碎片上创建集合
- [服务器-36102](https://jira.mongodb.org/browse/SERVER-36102)在适当的碎片上创建初始块，用于分区分片
- [服务器-36322](https://jira.mongodb.org/browse/SERVER-36322)NamespaceSerializer锁应该用于dropCollection
- [服务器-36463](https://jira.mongodb.org/browse/SERVER-36463)在未经身份验证的连接上绕过对sMaster的虚拟签名的验证
- [服务器-36550](https://jira.mongodb.org/browse/SERVER-36550)sharding_last_stable_mongos_and_mixed_shards套件中的黑名单drop_sharded_db_tags_cleanup.js
- [服务器-36849](https://jira.mongodb.org/browse/SERVER-36849)在v4.0上禁用新的碎片收集路径

### 复制

- [服务器-32148](https://jira.mongodb.org/browse/SERVER-32148)使NamespaceNotFound成为空卡顶和转换托卡顶的可接受错误
- [服务器-32907](https://jira.mongodb.org/browse/SERVER-32907)在测试中将心跳日志冗差调低
- [服务器-33243](https://jira.mongodb.org/browse/SERVER-33243)改进节点更改同步源时的日志记录
- [服务器-33248](https://jira.mongodb.org/browse/SERVER-33248)如果具有更高的lastOpCommitted，则允许选择我们最新的同步源
- [服务器-35058](https://jira.mongodb.org/browse/SERVER-35058)不要仅仅依靠心跳来发出降级命令中次要位置的信号
- [服务器-35126](https://jira.mongodb.org/browse/SERVER-35126)创建TxnStats类并将其存储在会话中
- [服务器-35129](https://jira.mongodb.org/browse/SERVER-35129)创建一个ServerTransactionsMetrics类，并将其作为装饰存储在ServiceContext上
- [服务器-35146](https://jira.mongodb.org/browse/SERVER-35146)跟踪已开始交易的总数
- [服务器-35147](https://jira.mongodb.org/browse/SERVER-35147)在ServerTransactionsMetrics中跟踪已提交和中止的事务总数
- [服务器-35149](https://jira.mongodb.org/browse/SERVER-35149)在ServerTransactionsMetrics中跟踪未完成的事务总数
- [服务器-35151](https://jira.mongodb.org/browse/SERVER-35151)在ServerTransactionsMetrics中跟踪活动和非活动事务的总数
- [服务器-35168](https://jira.mongodb.org/browse/SERVER-35168)跟踪有关最后一个客户端在会话上运行事务操作的信息
- [服务器-35173](https://jira.mongodb.org/browse/SERVER-35173)将自动提交值添加到currentOp的事务子文档中
- [服务器-35174](https://jira.mongodb.org/browse/SERVER-35174)将readConcern和readTimestamp添加到currentOp的事务子文档中
- [服务器-35239](https://jira.mongodb.org/browse/SERVER-35239)AwaitData光标必须处理从具有更高lastKnownCommittedOpTime的客户端获取更多内容
- [服务器-35246](https://jira.mongodb.org/browse/SERVER-35246)在replsettest.js中checkReplicaSet期间运行collMod时忽略NamespaceNotFound错误
- [服务器-35292](https://jira.mongodb.org/browse/SERVER-35292)将已启动的事务总数添加到服务器状态
- [服务器-35293](https://jira.mongodb.org/browse/SERVER-35293)将活跃和不活跃的事务计数添加到服务器状态
- [服务器-35294](https://jira.mongodb.org/browse/SERVER-35294)将未完成的事务总数添加到服务器状态
- [服务器-35295](https://jira.mongodb.org/browse/SERVER-35295)将已提交和中止的事务总数添加到服务器状态
- [服务器-35300](https://jira.mongodb.org/browse/SERVER-35300)在TxnStats中跟踪交易总持续时间
- [服务器-35302](https://jira.mongodb.org/browse/SERVER-35302)将startWallClockTime添加到currentOp的事务子文档中
- [服务器-35305](https://jira.mongodb.org/browse/SERVER-35305)将时间OpenMicros添加到currentOp的事务子文档中
- [服务器-35308](https://jira.mongodb.org/browse/SERVER-35308)在SingleTransactionStats中跟踪交易的总活动时间
- [服务器-35310](https://jira.mongodb.org/browse/SERVER-35310)将 timeActiveMicros 和 timeInactiveMicros 添加到 currentOp 的事务子文档中
- [服务器-35388](https://jira.mongodb.org/browse/SERVER-35388)改进交易中禁止的聚合阶段的误导性错误消息
- [服务器-35428](https://jira.mongodb.org/browse/SERVER-35428)添加将两个OpDebug对象添加到一起的功能
- [服务器-35432](https://jira.mongodb.org/browse/SERVER-35432)添加一种打印有关缓慢交易的信息的方法
- [服务器-35433](https://jira.mongodb.org/browse/SERVER-35433)完成缓慢的交易后记录
- [服务器-35434](https://jira.mongodb.org/browse/SERVER-35434)在SingleTransactionStats中跟踪聚合的OpDebug统计信息
- [服务器-35442](https://jira.mongodb.org/browse/SERVER-35442)降级全局锁定获取应使用等待时间，而不是冻结时间
- [服务器-35450](https://jira.mongodb.org/browse/SERVER-35450)对于非活动事务，将有关最后一个客户端运行事务操作的信息添加到currentOp中
- [服务器-35492](https://jira.mongodb.org/browse/SERVER-35492)将TxnStats重命名为SingleTransactionStats
- [服务器-35623](https://jira.mongodb.org/browse/SERVER-35623)在下台时向符合条件的候选人发送replSetStepUp命令
- [服务器-35624](https://jira.mongodb.org/browse/SERVER-35624)默认情况下启用选举切换并更新受影响的测试
- [服务器-35695](https://jira.mongodb.org/browse/SERVER-35695)使用命令行标志在inMemory存储引擎上启用事务
- [服务器-35742](https://jira.mongodb.org/browse/SERVER-35742)更新失败提交的ServerTransactionsMetrics
- [服务器-35754](https://jira.mongodb.org/browse/SERVER-35754)在 catchup_takeover_one_high_priority.js 中避免 stopSet() 中的网络错误
- [服务器-35766](https://jira.mongodb.org/browse/SERVER-35766)在候选人的新任期内发送的复制命令可以中断并发投票请求
- [服务器-35770](https://jira.mongodb.org/browse/SERVER-35770)当所有WiredTiger写票用尽时，运行多声明交易可能会导致死锁
- [服务器-35951](https://jira.mongodb.org/browse/SERVER-35951)在PV1下，单个节点RS的ReplicationCoordinatorImpl::processReplSetFreeze应该开始选举，而不是自动获胜。
- [服务器-35962](https://jira.mongodb.org/browse/SERVER-35962)buildindexes_false_with_system_indexes.js重新启动节点，应标记为[requires_persistence]
- [服务器-36128](https://jira.mongodb.org/browse/SERVER-36128)ReplicationCoordinatorImpl::fillIsMasterForReplSet在关机时应返回IsMaster:false
- [服务器-36225](https://jira.mongodb.org/browse/SERVER-36225)调用getMinValid时，请勿保留复制互斥体
- [服务器-36234](https://jira.mongodb.org/browse/SERVER-36234)修复./jstests/replsets/initial_sync_drop_collection.js，以防止在测试中使用过时的心跳信息。
- [服务器-36327](https://jira.mongodb.org/browse/SERVER-36327)使用stepUp命令而不是优先级作为在tags.js中指定主节点的一种方式
- [服务器-36331](https://jira.mongodb.org/browse/SERVER-36331)当事务过期时，终止运行操作
- [服务器-36461](https://jira.mongodb.org/browse/SERVER-36461)将“交易”标识符添加到缓慢的事务日志输出中
- [服务器-36592](https://jira.mongodb.org/browse/SERVER-36592)来自 backup_restore.js lib的黑名单 snapshot_read_kill_op_only.js 工作负载
- [服务器-36664](https://jira.mongodb.org/browse/SERVER-36664)在read_committed_with_catalog_changes.js中使用awaitReplication代替getLastError
- [服务器-36685](https://jira.mongodb.org/browse/SERVER-36685)TransactionParticipant（4.0中的Session）和客户端锁的反向顺序

### 查询

- [服务器-26387](https://jira.mongodb.org/browse/SERVER-26387)将noPassthrough/indexbg2.js替换为使用故障点的测试
- [服务器-34846](https://jira.mongodb.org/browse/SERVER-34846)当整理不涉及匹配或排序时，带有整理字段的覆盖索引会返回错误的结果
- [服务器-36239](https://jira.mongodb.org/browse/SERVER-36239)MatchExpression解析器查询规则

### 集合

- [服务器-36070](https://jira.mongodb.org/browse/SERVER-36070)启用审计时，带有$out的聚合会导致错误
- [服务器-36123](https://jira.mongodb.org/browse/SERVER-36123)使用模式拒绝$out：如果输出集合被分片，则“replaceCollection”
- [服务器-36715](https://jira.mongodb.org/browse/SERVER-36715)将$sort阶段推向查询系统可能会使管道处于未缝合状态

### JavaScript

[服务器-35986](https://jira.mongodb.org/browse/SERVER-35986)停止在旧分支上的并行套件中运行eval命令

### 储存

- [服务器-32994](https://jira.mongodb.org/browse/SERVER-32994)创建一个脚本，在降级后以正确的格式重建唯一索引
- [服务器-33740](https://jira.mongodb.org/browse/SERVER-33740)添加针对移动存储引擎运行动力循环的常青任务
- [服务器-35367](https://jira.mongodb.org/browse/SERVER-35367)在更少的waitForAllEarlierOplogWritesToBeVisible()中保持锁定
- [服务器-35386](https://jira.mongodb.org/browse/SERVER-35386)等待二级的多数提交点提前，然后在secondary_reads_timestamp_visibility.js中暂停批处理应用程序
- [服务器-35473](https://jira.mongodb.org/browse/SERVER-35473)移动SE：使用map-reduce jstests修复writeConflictRetry循环
- [服务器-35845](https://jira.mongodb.org/browse/SERVER-35845)将标签添加到noPassthrough/indexbg2.js
- [服务器-36005](https://jira.mongodb.org/browse/SERVER-36005) `IndexCatalogEntryImpl::_catalogIsReady`无条件打电话是不安全的。
- [服务器-36062](https://jira.mongodb.org/browse/SERVER-36062)移动SE：停止在移动变体上运行并发套件
- [服务器-36238](https://jira.mongodb.org/browse/SERVER-36238)禁用日志时，复制集启动失败：wt_cache_full.js、initial_sync_wt_cache_full.js、recovery_wt_cache_full.js
- [服务器-36397](https://jira.mongodb.org/browse/SERVER-36397)尝试创建TTL索引时，嵌入式服务器SDK应该会返回错误

#### 有线老虎

- [服务器-28734](https://jira.mongodb.org/browse/SERVER-28734)当缺少元数据但有_mdb_catalog数据时，恢复WiredTiger数据文件

### 运营

- [服务器-34664](https://jira.mongodb.org/browse/SERVER-34664)事务中不受支持的命令应该会出错
- [服务器-35180](https://jira.mongodb.org/browse/SERVER-35180)防止在直接客户端中设置操作会话信息值
- [服务器-35617](https://jira.mongodb.org/browse/SERVER-35617)令人不快的db.enableFree监控新推出的mongod上的“不是主”错误
- [服务器-36294](https://jira.mongodb.org/browse/SERVER-36294)currentActive和currentInactive的总和不等于currentOpen交易
- [服务器-36479](https://jira.mongodb.org/browse/SERVER-36479)日志编辑不会显示计划摘要，当记录缓慢的查询时

### 构建和包装

- [服务器-34393](https://jira.mongodb.org/browse/SERVER-34393)嵌入式传输层不应依赖于mongo内部代码
- [服务器-36686](https://jira.mongodb.org/browse/SERVER-36686)将嵌入式C驱动程序升级到1.12.0
- [服务器-36733](https://jira.mongodb.org/browse/SERVER-36733)重命名嵌入式目标SCons别名
- [服务器-36766](https://jira.mongodb.org/browse/SERVER-36766)为嵌入式SDK API添加导入/导出宏

### 内部人员

- [服务器-32281](https://jira.mongodb.org/browse/SERVER-32281)线程池任务执行器忽略从startCommand（）返回的错误
- [服务器-33695](https://jira.mongodb.org/browse/SERVER-33695)在powertest.py的恢复前后文件中包含循环名称
- [服务器-34258](https://jira.mongodb.org/browse/SERVER-34258)Windows上mount_drives.sh出错
- [服务器-34558](https://jira.mongodb.org/browse/SERVER-34558)将SSL_version添加到客户端元数据日志记录中
- [服务器-35003](https://jira.mongodb.org/browse/SERVER-35003)考虑将平衡器阈值始终为1
- [服务器-35025](https://jira.mongodb.org/browse/SERVER-35025)根据调用删除碎片的确切时间进行的测试无效
- [服务器-35037](https://jira.mongodb.org/browse/SERVER-35037)创建新的并发套件，在单个事务中运行连续操作
- [服务器-35056](https://jira.mongodb.org/browse/SERVER-35056)在NetworkInterfaceTL关机时刷新准备回调
- [服务器-35100](https://jira.mongodb.org/browse/SERVER-35100)当钩子动态测试失败时，请勿记录Python堆栈跟踪
- [服务器-35110](https://jira.mongodb.org/browse/SERVER-35110)在set_feature_compatibility_version.js中记录预期致命断言/其他错误的位置
- [服务器-35215](https://jira.mongodb.org/browse/SERVER-35215)Future::onError<ErrorCodes::Error>()允许您为单个代码注册处理程序。
- [服务器-35234](https://jira.mongodb.org/browse/SERVER-35234)makePromiseFuture<T>()创建绑定的承诺和未来
- [服务器-35244](https://jira.mongodb.org/browse/SERVER-35244)在4.0.0-rc0中删除配置db在3.7.9及更早版本中传递时失败
- [服务器-35537](https://jira.mongodb.org/browse/SERVER-35537)创建可以与嵌入式一起使用的benchRun()版本
- [服务器-35559](https://jira.mongodb.org/browse/SERVER-35559)更新事务重试函数，以便在提交后不调用中止
- [服务器-35592](https://jira.mongodb.org/browse/SERVER-35592)为嵌入式CAPI创建Java绑定
- [服务器-35654](https://jira.mongodb.org/browse/SERVER-35654)rollback_transaction_table.js即使在WT运行中也失败
- [服务器-35661](https://jira.mongodb.org/browse/SERVER-35661)将5秒同步延迟添加到回滚关机模糊器
- [服务器-35684](https://jira.mongodb.org/browse/SERVER-35684)删除promise.getFuture（）
- [服务器-35706](https://jira.mongodb.org/browse/SERVER-35706)修复逻辑SessionCacheImpl的竞争
- [服务器-35775](https://jira.mongodb.org/browse/SERVER-35775)db.getFreeMonitoringStatus()中无益的消息字符串
- [服务器-35919](https://jira.mongodb.org/browse/SERVER-35919)确保所有“使用事务”的测试都以w:多数执行集合掉线
- [服务器-35946](https://jira.mongodb.org/browse/SERVER-35946)Powercycle kill_mongod函数应确保服务不处于运行状态
- [服务器-36001](https://jira.mongodb.org/browse/SERVER-36001)将require_document_locking标签添加到noPassthrough/indexbg2.js
- [服务器-36067](https://jira.mongodb.org/browse/SERVER-36067)将工件从在Evergreen中运行安装移动测试目标上传到S3
- [服务器-36069](https://jira.mongodb.org/browse/SERVER-36069)与mongoebench兼容的供应商JSON配置文件从mongodb/mongo-perf到src/third_party
- [服务器-36073](https://jira.mongodb.org/browse/SERVER-36073)将统计数据从BenchRunner::finish()保存到mongoebench中的JSON文件中
- [服务器-36129](https://jira.mongodb.org/browse/SERVER-36129)并发降级套件在启动降级线程之前，应等待工作负载设置的复制
- [服务器-36191](https://jira.mongodb.org/browse/SERVER-36191)清理将BSONElement转换为字符串的逻辑
- [服务器-36245](https://jira.mongodb.org/browse/SERVER-36245)创建一个多拱安卓变体
- [服务器-36274](https://jira.mongodb.org/browse/SERVER-36274)在sys-perf中重新启用--ycsb吞吐量分析
- [服务器-36301](https://jira.mongodb.org/browse/SERVER-36301)在RHEL 6.7 s390x上构建带有H HAVE_NO_CRC32_HARDWARE的WT
- [服务器-36399](https://jira.mongodb.org/browse/SERVER-36399)填写云夜间测试的任务
- [服务器-36406](https://jira.mongodb.org/browse/SERVER-36406)db._authOrThrow应该优先考虑用户指定的身份验证机制，而不是服务器的机制
- [服务器-36448](https://jira.mongodb.org/browse/SERVER-36448)在使用ContinuousStepdown钩子的套件中禁用选举交接
- [服务器-36462](https://jira.mongodb.org/browse/SERVER-36462)将atlas用户添加到runtime_secret.yml
- [服务器-36466](https://jira.mongodb.org/browse/SERVER-36466)SpecificPool的安全关机条件
- [服务器-36623](https://jira.mongodb.org/browse/SERVER-36623)在修复数据库之前，请勿重建索引
- [WT-3276](https://jira.mongodb.org/browse/WT-3276)添加恢复=salvage以从损坏的日志文件中恢复
- [WT-3856](https://jira.mongodb.org/browse/WT-3856)创建一个测试，通过模式操作将恢复运行到不同时间点
- [WT-3943](https://jira.mongodb.org/browse/WT-3943)当python测试断言时，包括完整的错误消息
- [WT-3955](https://jira.mongodb.org/browse/WT-3955)添加详细选项，以记录更多错误退货信息
- [WT-3963](https://jira.mongodb.org/browse/WT-3963)添加模式密集型中止测试
- [WT-3968](https://jira.mongodb.org/browse/WT-3968)使用压缩比调整页面大小
- [WT-4010](https://jira.mongodb.org/browse/WT-4010)简化测试/格式时间戳处理。
- [WT-4026](https://jira.mongodb.org/browse/WT-4026)为现有文件扩展名配置API添加实现
- [WT-4134](https://jira.mongodb.org/browse/WT-4134)重做断言，我们不会丢弃所需的历史
- [WT-4147](https://jira.mongodb.org/browse/WT-4147)日志恢复不应忽略日志文件中日志记录之外的损坏
- [WT-4160](https://jira.mongodb.org/browse/WT-4160)在不使用时间戳时恢复性能
- [WT-4168](https://jira.mongodb.org/browse/WT-4168)更新3.1.0版本的升级文档
- [WT-4169](https://jira.mongodb.org/browse/WT-4169)修复验证转储页面失败的问题
- [WT-4171](https://jira.mongodb.org/browse/WT-4171)启用树木行走计时应力会导致过度减速
- [WT-4172](https://jira.mongodb.org/browse/WT-4172)在释放裁判之前，在更多地方添加诊断危险指针检查
- [WT-4174](https://jira.mongodb.org/browse/WT-4174)使用in_memory=true运行时，请勿访问rollback_to_stable中的外观文件
- [WT-4178](https://jira.mongodb.org/browse/WT-4178)修复了内存中所需的wt_btree_immediately_durable
- [WT-4179](https://jira.mongodb.org/browse/WT-4179)公开WiredTiger crc32c函数
- [WT-4182](https://jira.mongodb.org/browse/WT-4182)对日志校验和错误使用保守的方法
- [WT-4183](https://jira.mongodb.org/browse/WT-4183)扩展详细选项，以在错误返回时记录更多消息
- [WT-4186](https://jira.mongodb.org/browse/WT-4186)日志恢复应检测并报告日志记录中的损坏
- [WT-4187](https://jira.mongodb.org/browse/WT-4187)覆盖范围：未使用的价值投诉
- [WT-4188](https://jira.mongodb.org/browse/WT-4188)覆盖范围：未核对的退货价值投诉
- [WT-4189](https://jira.mongodb.org/browse/WT-4189)__async_flush_wait()中的潜在无限循环。
- [WT-4191](https://jira.mongodb.org/browse/WT-4191)修复覆盖静态分析错误
- [WT-4193](https://jira.mongodb.org/browse/WT-4193)测试/格式快照隔离搜索不匹配
- [WT-4194](https://jira.mongodb.org/browse/WT-4194)通过多张表格提高驱逐的公平性
- [WT-4195](https://jira.mongodb.org/browse/WT-4195)当遇到非法值时，请记录失败的值
- [WT-4196](https://jira.mongodb.org/browse/WT-4196)无论机器字节顺序如何，都要使日志损坏检查工作
- [WT-4198](https://jira.mongodb.org/browse/WT-4198)一些受支持的MongoDB架构不支持crc32硬件
- [WT-4199](https://jira.mongodb.org/browse/WT-4199)修复错误的日志损坏报告
- [WT-4201](https://jira.mongodb.org/browse/WT-4201)修复覆盖率静态分析问题
- [WT-4206](https://jira.mongodb.org/browse/WT-4206)修复光标关闭例程中的错误处理
- [WT-4207](https://jira.mongodb.org/browse/WT-4207)覆盖范围#1394567：空指针取消引用
- [WT-4208](https://jira.mongodb.org/browse/WT-4208)树木漫步可能会被锁定的内部页面打断
- [WT-4210](https://jira.mongodb.org/browse/WT-4210)模式中止子进程过早失败
- [WT-4213](https://jira.mongodb.org/browse/WT-4213)重命名具有冗余或误导性文本的锁形统计信息
- [WT-4215](https://jira.mongodb.org/browse/WT-4215)允许在没有打捞的情况下恢复备份
- [WT-4226](https://jira.mongodb.org/browse/WT-4226)测试/格式LSM配置可能会错误配置准备和时间戳
- [WT-4229](https://jira.mongodb.org/browse/WT-4229)麻布
- [WT-4234](https://jira.mongodb.org/browse/WT-4234)删除对传统工具statlog.py的文档提及
- [WT-4235](https://jira.mongodb.org/browse/WT-4235)修复工作负载之间表状态的工作根跟踪
- [WT-4242](https://jira.mongodb.org/browse/WT-4242)新的日志文件扩展名Python测试失败



## 4.0.1 更改日志

### 安全

- [服务器-35125](https://jira.mongodb.org/browse/SERVER-35125)SSLHandshakeManager::doServerHandshake中的空指针读取访问违规
- [服务器-36027](https://jira.mongodb.org/browse/SERVER-36027)企业构建无法识别--redactClientLogData标志

### 分片

- [服务器-33237](https://jira.mongodb.org/browse/SERVER-33237)优化范围删除器速度
- [服务器-33697](https://jira.mongodb.org/browse/SERVER-33697)对缓存会话的数量进行理智检查
- [服务器-34897](https://jira.mongodb.org/browse/SERVER-34897)引入参数来控制MongoS是否应该自动重试失败的`find`命令
- [服务器-35609](https://jira.mongodb.org/browse/SERVER-35609)如果只写一个块，则在 primaryShard 上创建初始块
- [服务器-35632](https://jira.mongodb.org/browse/SERVER-35632)Blacklist lagged_config_secondary.js和all_config_servers_blackholed_from_mongos.js来自RHEL 6.7 s390x变体
- [服务器-35691](https://jira.mongodb.org/browse/SERVER-35691)让所有返回StaleConfig错误的代码路径通过StaleConfigInfo序列化程序
- [服务器-35711](https://jira.mongodb.org/browse/SERVER-35711)从碎片服务器目录缓存加载程序中删除未使用的匿名函数getPersistedMaxDbVersion()
- [服务器-35745](https://jira.mongodb.org/browse/SERVER-35745)_getNextSessionMods不包含oplogReplay标志来查询迁移期间创建的新oplog
- [服务器-35938](https://jira.mongodb.org/browse/SERVER-35938)NamespaceSerializer锁应用于数据库以及创建收集期间的集合
- [服务器-35997](https://jira.mongodb.org/browse/SERVER-35997)在安全二次读取测试中进行shardCollection后，等待在配置服务器上的复制
- [服务器-36041](https://jira.mongodb.org/browse/SERVER-36041)增加更改日志和操作日志的大小
- [服务器-36075](https://jira.mongodb.org/browse/SERVER-36075)向shard_identity_rollback.js添加注释，解释为什么我们在shardsvr上将FCV设置为4.0
- [服务器-36132](https://jira.mongodb.org/browse/SERVER-36132)不变的是，块迁移实际上反映在成功提交后的元数据中
- [服务器-36232](https://jira.mongodb.org/browse/SERVER-36232)块迁移提交后刷新可能看不到已提交的元数据

### 复制

- [服务器-32088](https://jira.mongodb.org/browse/SERVER-32088)ChangeStream resumeAfter不适用于分片集合，如果不是所有碎片都有集合的块
- [服务器-34414](https://jira.mongodb.org/browse/SERVER-34414)使用buildsIndexes创建角色：false节点击中了fassert
- [服务器-34758](https://jira.mongodb.org/browse/SERVER-34758)replSetGetStatus可以使用initialSyncer死锁
- [服务器-35124](https://jira.mongodb.org/browse/SERVER-35124)由于`flushing mmaps`需要很长时间，带有MMAP V1的降级套件经常会失败
- [服务器-35200](https://jira.mongodb.org/browse/SERVER-35200)在稳态复制期间加快OplogFetcher中的故障检测
- [服务器-35388](https://jira.mongodb.org/browse/SERVER-35388)改进交易中禁止的聚合阶段的误导性错误消息
- [服务器-35488](https://jira.mongodb.org/browse/SERVER-35488)ReplSetTest.waitForState()应确保节点已完成关闭连接
- [服务器-35571](https://jira.mongodb.org/browse/SERVER-35571)等到所有节点都稳定后，checkOplogs
- [服务器-35991](https://jira.mongodb.org/browse/SERVER-35991)在set_feature_compatibility_version.js中关闭链
- [服务器-35992](https://jira.mongodb.org/browse/SERVER-35992)SecondaryReadsTest中应该没有投票权

### 查询

- [服务器-34789](https://jira.mongodb.org/browse/SERVER-34789)使用带有“resumeAfter”的“无效”通知中的简历令牌应该会出错
- [服务器-34933](https://jira.mongodb.org/browse/SERVER-34933)pcre动词支持
- [服务器-35693](https://jira.mongodb.org/browse/SERVER-35693)由于O(n^2) boost::flat_set构造函数，$in的解析需要二次时间
- [服务器-35751](https://jira.mongodb.org/browse/SERVER-35751)使kill_own_ops.js更健壮
- [服务器-35851](https://jira.mongodb.org/browse/SERVER-35851)在调用std::sort之前，考虑检查传递给$in的数组是否已经排序
- [服务器-35929](https://jira.mongodb.org/browse/SERVER-35929)由于无效，重新加载视图目录时可能免费使用

### 集合

- [服务器-35028](https://jira.mongodb.org/browse/SERVER-35028)添加更改流通知以进行收集删除和重命名
- [服务器-35029](https://jira.mongodb.org/browse/SERVER-35029)为数据库删除添加更改流通知
- [服务器-35084](https://jira.mongodb.org/browse/SERVER-35084)change_stream_enforce_max_time_ms_on_mongos.js expects getMore to schedule follow-up getMores
- [服务器-35634](https://jira.mongodb.org/browse/SERVER-35634)view_catalog_cycle_lookup.js不应该总是断言在视图上查找会成功
- [服务器-35961](https://jira.mongodb.org/browse/SERVER-35961)在MapReduce命令中删除未初始化的计数变量

### 目录

[服务器-35563](https://jira.mongodb.org/browse/SERVER-35563)UUIDCatalog onCreateCollection观察员应在原子上取消注册并重新注册目录条目

### 储存

- [服务器-32509](https://jira.mongodb.org/browse/SERVER-32509)移动SE：为不受支持的启动选项实现错误报告
- [服务器-32997](https://jira.mongodb.org/browse/SERVER-32997)移动SE：设计和实现多读数或单写并发
- [服务器-33605](https://jira.mongodb.org/browse/SERVER-33605)移动SE：禁用上限集合
- [服务器-33651](https://jira.mongodb.org/browse/SERVER-33651)移动SE：使用全同步模式进行SQLite写入
- [服务器-34002](https://jira.mongodb.org/browse/SERVER-34002)readConcern_snapshot.js应该等到写入在次要上以多数提交，然后再阅读
- [服务器-34113](https://jira.mongodb.org/browse/SERVER-34113)删除对多文档事务之外快照读取的所有支持
- [服务器-34129](https://jira.mongodb.org/browse/SERVER-34129)在操作日志截断期间，不要按住数据库或集合锁
- [服务器-34579](https://jira.mongodb.org/browse/SERVER-34579)不要为移动存储引擎填充索引详细信息
- [服务器-34713](https://jira.mongodb.org/browse/SERVER-34713)逐步下降数据库性能
- [服务器-35085](https://jira.mongodb.org/browse/SERVER-35085)修复可能会导致并发初始同步操作的虚假命名空间NotFound错误
- [服务器-35317](https://jira.mongodb.org/browse/SERVER-35317)restartCatalog有问题地丢弃minVisibleSnapshot数据
- [服务器-35398](https://jira.mongodb.org/browse/SERVER-35398)Mobile SE：删除带上限收集的代码
- [服务器-35671](https://jira.mongodb.org/browse/SERVER-35671)DatabaseHolderImpl::closeAll可以将目录保持不完整的状态
- [服务器-35704](https://jira.mongodb.org/browse/SERVER-35704)将readConcern_snapshot.js标记为'uses_transactions'
- [服务器-35789](https://jira.mongodb.org/browse/SERVER-35789)检查多文档txns的索引目录是否已不匹配
- [服务器-35859](https://jira.mongodb.org/browse/SERVER-35859)禁用rocksdb构建变体
- [服务器-35994](https://jira.mongodb.org/browse/SERVER-35994)在secondary_reads_unique_indexes.js测试中减少CPU负载
- [服务器-36006](https://jira.mongodb.org/browse/SERVER-36006) `multiInitialSyncApply`应考虑设置一个读取时间戳`kNoTimestamp`
- [服务器-36025](https://jira.mongodb.org/browse/SERVER-36025)RestartCatalogCommand可以尝试在独立服务器上重新初始化oplog指针
- [服务器-36167](https://jira.mongodb.org/browse/SERVER-36167)为WT`flags`成员添加漂亮的打印机

### GridFS

[服务器-35361](https://jira.mongodb.org/browse/SERVER-35361)filemd5命令在手动屈服后无法安全地清理PlanExecutor

### 运营

- [服务器-27264](https://jira.mongodb.org/browse/SERVER-27264)使用net.ssl.allowConnectionsWithoutCertificates：true，允许禁用任何客户端证书日志警告
- [服务器-32064](https://jira.mongodb.org/browse/SERVER-32064)mongo shell的所有命令请求中都应包含逻辑会话ID
- [服务器-34160](https://jira.mongodb.org/browse/SERVER-34160)Mongo客户端在终止时运行缓冲命令。
- [服务器-35758](https://jira.mongodb.org/browse/SERVER-35758)Mongo shell在重写“db”后运行事务时提示错误
- [服务器-35903](https://jira.mongodb.org/browse/SERVER-35903)免费监控不允许在没有先启用外壳的情况下禁用外壳
- [服务器-36010](https://jira.mongodb.org/browse/SERVER-36010)更改Windows stacktraces的日志消息，以使用error()或严重()而不是log()
- [服务器-36088](https://jira.mongodb.org/browse/SERVER-36088)副本集连接字符串在4.0 shell + Windows上触发访问违规

### 构建和包装

- [服务器-33000](https://jira.mongodb.org/browse/SERVER-33000)平台支持：添加Ubuntu 18.04
- [服务器-33996](https://jira.mongodb.org/browse/SERVER-33996)在捆绑SDK之前，不要应用自我签名。
- [服务器-35600](https://jira.mongodb.org/browse/SERVER-35600)添加对armv7-k的支持
- [服务器-35901](https://jira.mongodb.org/browse/SERVER-35901)向lint任务添加工具链路径
- [服务器-36039](https://jira.mongodb.org/browse/SERVER-36039)在FreeBSD上支持LibreSSL 2.7
- [服务器-36082](https://jira.mongodb.org/browse/SERVER-36082)不要将 getShardMap 命令链接到嵌入式

### 工具

- [工具-2058](https://jira.mongodb.org/browse/TOOLS-2058)mongoreplay没有显示OP_MSG命令
- [工具-2062](https://jira.mongodb.org/browse/TOOLS-2062)在mongoreplay中支持zlib压缩
- [工具-2075](https://jira.mongodb.org/browse/TOOLS-2075)mongoreplay总是重播到次要

### 内部人员

- [服务器-33817](https://jira.mongodb.org/browse/SERVER-33817)使用杀死蒙古的动力循环测试
- [服务器-34563](https://jira.mongodb.org/browse/SERVER-34563)如果返回的记录驻留在子域中，则通过SRV记录连接失败
- [服务器-34793](https://jira.mongodb.org/browse/SERVER-34793)在任务完成失败时向BF建议服务器添加呼叫
- [服务器-34810](https://jira.mongodb.org/browse/SERVER-34810)会话缓存刷新可能会错误地杀死仍在使用的光标
- [服务器-34956](https://jira.mongodb.org/browse/SERVER-34956)big_object1.js对意外的降级没有弹性
- [服务器-34984](https://jira.mongodb.org/browse/SERVER-34984)更新 major_version_upgrade.js 测试，将 setFCV 调用到最新的 FCV
- [服务器-34996](https://jira.mongodb.org/browse/SERVER-34996)在evergreen.yml中将aws_ec2.py的console_output和console_screenshot保存为工件
- [服务器-35101](https://jira.mongodb.org/browse/SERVER-35101)以不同的方式处理形成不良的bindIp参数
- [服务器-35165](https://jira.mongodb.org/browse/SERVER-35165)在4.0分支上禁用并重新启用update_test_lifecycle Evergreen任务
- [服务器-35188](https://jira.mongodb.org/browse/SERVER-35188)ServiceLiason* 类型中的错别字
- [服务器-35263](https://jira.mongodb.org/browse/SERVER-35263)添加FSM工作负载，用于测试跨多个集合和数据库的事务内部更新的原子性和隔离性
- [服务器-35312](https://jira.mongodb.org/browse/SERVER-35312)更新system_perf.yml和perf.yml，以比较主和4.0的3.6.5基线
- [服务器-35313](https://jira.mongodb.org/browse/SERVER-35313)CleanupConcurrencyWorkloads resmoke hook需要处理平衡器
- [服务器-35383](https://jira.mongodb.org/browse/SERVER-35383)增加stepdown套件中使用的ContinuousStepdown钩的选举TimeoutMillis
- [服务器-35389](https://jira.mongodb.org/browse/SERVER-35389)从旧的FSM套件中删除死代码
- [服务器-35506](https://jira.mongodb.org/browse/SERVER-35506)Powercycle wait_for_mongod_shutdown函数应确保mongod进程不再运行
- [服务器-35523](https://jira.mongodb.org/browse/SERVER-35523)FSMWorkloadTestCase错误地设置了TestData.sameDB=true和TestData.sameCollection=true
- [服务器-35550](https://jira.mongodb.org/browse/SERVER-35550)桥接器在进行出站连接时不应阻止监听器
- [服务器-35578](https://jira.mongodb.org/browse/SERVER-35578)将软件包测试切换到新的软件包测试VPC
- [服务器-35588](https://jira.mongodb.org/browse/SERVER-35588)powertest.py只有在成功replSetGetConfig后才应该调用replSetReconfigure命令
- [服务器-35627](https://jira.mongodb.org/browse/SERVER-35627)维修应该从现有元数据中重新创建缺失的收集数据文件
- [服务器-35664](https://jira.mongodb.org/browse/SERVER-35664)在api24系统映像上运行Android嵌入式测试
- [服务器-35668](https://jira.mongodb.org/browse/SERVER-35668)避免将并发测试移动到arm64上的小实例
- [服务器-35675](https://jira.mongodb.org/browse/SERVER-35675)find_by_uuid_and_rename.js在集合重命名期间屈服时不应从QueryPlanKilled失败
- [服务器-35692](https://jira.mongodb.org/browse/SERVER-35692)在指标响应中添加对可选的重新注册bool的支持
- [服务器-35702](https://jira.mongodb.org/browse/SERVER-35702)停止运行agg，在macOS上更新模糊器
- [服务器-35724](https://jira.mongodb.org/browse/SERVER-35724)无法通过ssh访问的远程EC2主机应该会因系统错误而失败
- [服务器-35727](https://jira.mongodb.org/browse/SERVER-35727)将嵌入式sdk编译任务纳入多任务组。
- [服务器-35834](https://jira.mongodb.org/browse/SERVER-35834)修复微软编译器上的`dns_name_test`中的编译错误
- [服务器-35850](https://jira.mongodb.org/browse/SERVER-35850)将文件名后缀更新为v4.0-最新版本，用于夜间构建
- [服务器-35858](https://jira.mongodb.org/browse/SERVER-35858)呼叫BF建议服务时出错
- [服务器-35908](https://jira.mongodb.org/browse/SERVER-35908)在关闭嵌入式之前，关闭mongoed中的服务入口点
- [服务器-35990](https://jira.mongodb.org/browse/SERVER-35990)更新 evergreen_task_timeout.py REQUIRED_BUILD_VARIANTS列表
- [服务器-35993](https://jira.mongodb.org/browse/SERVER-35993)read_concern_uninitiated_set重新启动节点，因此不得允许短暂存储
- [服务器-36055](https://jira.mongodb.org/browse/SERVER-36055)移动SE：紧凑型在移动设备上返回错误的错误代码
- [服务器-36144](https://jira.mongodb.org/browse/SERVER-36144)想要添加一个空cloud_nightly.yml文件
- [工具-1991](https://jira.mongodb.org/browse/TOOLS-1991)使用Go 1.10.1构建工具
- [WT-3839](https://jira.mongodb.org/browse/WT-3839)记录范围截断与插入重叠时未定义的行为
- [WT-3917](https://jira.mongodb.org/browse/WT-3917)增强WT_CURSOR::围绕提交可见性保留文档
- [WT-4024](https://jira.mongodb.org/browse/WT-4024)修复分裂和下一个/上一个之间的竞争
- [WT-4048](https://jira.mongodb.org/browse/WT-4048)推广 timing_stress_for_test拆分功能
- [WT-4067](https://jira.mongodb.org/browse/WT-4067)增强LSM，不要在缓存中固定那么多历史记录
- [WT-4101](https://jira.mongodb.org/browse/WT-4101)不要在会话期间中止驱逐服务器，验证何时保留 oldest_timestamp
- [WT-4111](https://jira.mongodb.org/browse/WT-4111)改进检查点擦洗算法
- [WT-4125](https://jira.mongodb.org/browse/WT-4125)确保具有稳定时间戳的后续检查点不会读太多
- [WT-4133](https://jira.mongodb.org/browse/WT-4133)覆盖范围1393445，1393446取消检查前的取消引用
- [WT-4136](https://jira.mongodb.org/browse/WT-4136)添加一个新的定时应力标志，在树搜索期间产生
- [WT-4138](https://jira.mongodb.org/browse/WT-4138)添加一个暂停选项，等待缓存中的空格
- [WT-4139](https://jira.mongodb.org/browse/WT-4139)重命名光标重新启动统计信息以匹配实现
- [WT-4140](https://jira.mongodb.org/browse/WT-4140)光标步行不必要地限制快速驱逐页面选择。
- [WT-4141](https://jira.mongodb.org/browse/WT-4141)用时间戳增强检查站，以更快地解除驱逐的封锁
- [WT-4143](https://jira.mongodb.org/browse/WT-4143)如果存在，请使用WiredTiger.turtle.set，但WiredTiger.turtle没有
- [WT-4145](https://jira.mongodb.org/browse/WT-4145)仅在检查站期间包含检查站时间戳
- [WT-4146](https://jira.mongodb.org/browse/WT-4146)覆盖范围1393639，未使用变量
- [WT-4152](https://jira.mongodb.org/browse/WT-4152)保存退货值，以便稍后在交易代码中进行比较
- [WT-4163](https://jira.mongodb.org/browse/WT-4163)麻布





原文 - [4.0 Changelog]( https://docs.mongodb.com/manual/release-notes/4.0-changelog/ )

