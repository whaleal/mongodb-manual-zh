# 2.4 更改日志



## 2.4.14

- 包装：与文档相比，Init脚本将流程限制设置为不同的值（[服务器-17780）](https://jira.mongodb.org/browse/SERVER-17780)
- 安全性：在v8中计算BinData长度（[服务器-17647）](https://jira.mongodb.org/browse/SERVER-17647)
- 构建：将PCRE版本从8.30升级到最新版本（[服务器-17252）](https://jira.mongodb.org/browse/SERVER-17252)



## 2.4.13 - 更改

- 安全性：强制BSON BinData长度验证（[服务器-17278）](https://jira.mongodb.org/browse/SERVER-17278)
- 安全性：禁用SSLv3密码（[服务器-15673）](https://jira.mongodb.org/browse/SERVER-15673)
- 网络：改进BSON验证（[服务器-17264）](https://jira.mongodb.org/browse/SERVER-17264)



## 2.4.12 - 更改

- 分页：设置错误上的分片连接清理可能会崩溃mongos（[服务器-15056）](https://jira.mongodb.org/browse/SERVER-15056)
- 分页：首次获取分布式锁时出现“类型7”（OID）错误（[服务器-13616）](https://jira.mongodb.org/browse/SERVER-13616)
- 存储：创建时显式零.ns文件（[服务器-15369）](https://jira.mongodb.org/browse/SERVER-15369)
- 存储：部分写入日志的最后一节导致恢复失败（[服务器-15111）](https://jira.mongodb.org/browse/SERVER-15111)



## 2.4.11 - 更改

- 安全：潜在的信息泄露（[服务器-14268）](https://jira.mongodb.org/browse/SERVER-14268)
- 复制：带有`$prefix`字段的`_id`由于插入未验证而导致复制失败（[服务器-12209）](https://jira.mongodb.org/browse/SERVER-12209)
- 分叉：无效访问：`SplitChunkCommand::run`中的seg故障（[服务器-14342）](https://jira.mongodb.org/browse/SERVER-14342)
- 索引：在`_id`上创建降序索引可能会损坏命名空间（[服务器-14833）](https://jira.mongodb.org/browse/SERVER-14833)
- 文本搜索：更新带有文本索引字段的文档可能会导致错误的条目（[服务器-14738）](https://jira.mongodb.org/browse/SERVER-14738)
- 构建：添加SCons标志以覆盖将所有警告视为错误（[服务器-13724）](https://jira.mongodb.org/browse/SERVER-13724)
- 打包：修复mongodb enterprise 2.4 init脚本，允许每个主机有多个进程（[服务器-14336）](https://jira.mongodb.org/browse/SERVER-14336)
- JavaScript：不要将本机函数指针存储为函数原型中的属性（[服务器-14254）](https://jira.mongodb.org/browse/SERVER-14254)



## 2.4.10 - 更改

- 索引：修复了同时构建索引时可能导致索引损坏的问题（[服务器-12990）](https://jira.mongodb.org/browse/SERVER-12990)
- 索引：修复了在索引构建期间关闭辅助节点时可能导致索引损坏的问题（[服务器-12956）](https://jira.mongodb.org/browse/SERVER-12956)
- 索引：Mongod现在可以识别不兼容的“未来”文本和地理索引版本，并优雅地退出（[服务器-12914）](https://jira.mongodb.org/browse/SERVER-12914)
- 索引：修复了同时构建同一索引多次时可能导致次要索引复制失败的问题（[服务器-12662）](https://jira.mongodb.org/browse/SERVER-12662)
- 索引：修复了如果索引构建失败可能导致集合中第十个索引索引损坏的问题（[服务器-12481）](https://jira.mongodb.org/browse/SERVER-12481)
- 索引：引入了文本和地理索引的版本控制，以确保向后兼容性（[服务器-12175）](https://jira.mongodb.org/browse/SERVER-12175)
- 索引：不允许在system.indexes集合上构建索引，这可能导致次要索引的初始同步失败（[服务器-10231）](https://jira.mongodb.org/browse/SERVER-10231)
- 分页：当配置服务器不同步时，避免频繁的即时平衡器重试（[服务器-12908）](https://jira.mongodb.org/browse/SERVER-12908)
- 分页：在配置服务器上将索引添加到锁定集合中，以避免在大量集合时进行长时间查询（[服务器-12548）](https://jira.mongodb.org/browse/SERVER-12548)
- 分页：修复了同时分片集合时可能损坏配置元数据缓存的问题（[服务器-12515）](https://jira.mongodb.org/browse/SERVER-12515)
- 分页：如果集合中已经包含数据，请不要移动使用散列碎片键在集合上创建的块（[服务器-9259）](https://jira.mongodb.org/browse/SERVER-9259)
- 复制：修复了在紧凑操作期间节点在副本集中似乎处于停机状态的问题（[服务器-12264）](https://jira.mongodb.org/browse/SERVER-12264)
- 复制：修复了节点不否决选举时可能导致选举延迟的问题（[服务器-12170）](https://jira.mongodb.org/browse/SERVER-12170)
- 复制：如果在副本集中检测到多个初选，则降级所有初选，以确保选举结果正确（[服务器-10793）](https://jira.mongodb.org/browse/SERVER-10793)
- 复制：在时钟倾斜检测时，次要将直接从主同步，以避免同步周期（[服务器-8375）](https://jira.mongodb.org/browse/SERVER-8375)
- 运行时：SIGXCPU信号现在被捕获，mongod写入日志消息并优雅地退出（[服务器-12034）](https://jira.mongodb.org/browse/SERVER-12034)
- 运行时：修复了当/sys/dev/block目录不可读时，mongod无法在Linux上启动的问题（[服务器-9248）](https://jira.mongodb.org/browse/SERVER-9248)
- Windows：不再在Windows 7或Windows Server 2008 R2以外的系统上零填充新分配的文件（[服务器-8480）](https://jira.mongodb.org/browse/SERVER-8480)
- GridFS：块大小从256kB减少到255kB，以避免使用PowerOf2Sizes选项的开销（[服务器-13331）](https://jira.mongodb.org/browse/SERVER-13331)
- SNMP：修复了smilint下的MIB文件验证（[服务器-12487）](https://jira.mongodb.org/browse/SERVER-12487)
- Shell：修复了V8内存分配中可能导致长期运行的shell命令崩溃的问题（[服务器-11871）](https://jira.mongodb.org/browse/SERVER-11871)
- Shell：修复了md5sumFile shell实用程序中的内存泄漏（[服务器-11560）](https://jira.mongodb.org/browse/SERVER-11560)

## 以前的版本

- [所有2.4.9的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.9" AND project %3D SERVER)。
- [所有2.4.8的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.8" AND project %3D SERVER)。
- [所有2.4.7的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.7" AND project %3D SERVER)。
- [所有2.4.6的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.6" AND project %3D SERVER)。
- [所有2.4.5的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.5" AND project %3D SERVER)。
- [所有2.4.4改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.4" AND project %3D SERVER)。
- [所有2.4.3改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.3" AND project %3D SERVER)。
- [所有2.4.2的改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.2" AND project %3D SERVER)
- [所有2.4.1改进](https://jira.mongodb.org/issues/?jql=fixVersion %3D "2.4.1" AND project %3D SERVER)。



译者：韩鹏帅

 参见

原文 - [2.4 Changelog]( https://docs.mongodb.com/manual/release-notes/2.4-changelog/ )

