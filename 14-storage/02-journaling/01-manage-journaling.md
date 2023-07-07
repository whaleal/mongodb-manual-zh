# 管理日志

MongoDB 使用预*写日志记录*到磁盘[日志](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-journal)来保证[写操作](https://www.mongodb.com/docs/manual/crud/)的持久性。

WiredTiger 存储引擎不需要日志来保证崩溃后的一致状态。数据库将在恢复过程中恢复到最后一个一致的[检查点](https://www.mongodb.com/docs/manual/core/wiredtiger/#std-label-storage-wiredtiger-checkpoints) 。但是，如果 MongoDB 在检查点之间意外退出，则需要日志记录来恢复在最后一个检查点之后发生的写入。



## NOTE

从 MongoDB 4.0 开始，您不能为使用 WiredTiger 存储引擎的副本集节点指定[`--nojournal`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--nojournal)选项或[`storage.journal.enabled: false`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.enabled)。

启用日志功能后，如果[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)意外停止，程序可以恢复写入日志的所有内容。MongoDB 将在重新启动时重新应用写操作并保持一致的状态。默认情况下，最大程度的丢失写入（即未对日志进行的写入）是最近 100 毫秒内进行的写入，加上执行实际日志写入所花费的时间。有关 [`commitIntervalMs`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.commitIntervalMs)默认值的更多信息，请参阅 。

## 程序

### 禁用日志记录



## WARNING

不要在生产系统上禁用日志记录。

- 从 MongoDB 4.0 开始，您不能为使用 WiredTiger 存储引擎的副本集节点指定[`--nojournal`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--nojournal)选项或[`storage.journal.enabled: false`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.journal.enabled)。

要禁用独立部署日记功能，请使用[`--nojournal`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--nojournal)命令行选项启动 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)。

### 获取提交确认

[您可以使用Write Concern](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)和[`j`](https://www.mongodb.com/docs/manual/reference/write-concern/#mongodb-writeconcern-writeconcern.j)选项获得提交确认。有关详细信息，请参阅 [Write Concern。](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern-operation)

### 监控期刊状态

[`serverStatus`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-dbcommand-dbcmd.serverStatus)命令/[`db.serverStatus()`](https://www.mongodb.com/docs/manual/reference/method/db.serverStatus/#mongodb-method-db.serverStatus) 方法返回[`wiredTiger.log`](https://www.mongodb.com/docs/manual/reference/command/serverStatus/#mongodb-serverstatus-serverstatus.wiredTiger.log)，其中包含有关日志的统计信息。

### 意外关机后恢复数据

在崩溃后重新启动时，MongoDB 在服务器重新运行可日志目录中的所有日志文件。如果 MongoDB 必须重新执行日志文件，[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)请在日志输出中记录这些事件。

没有运行的理由`--repair`。



### 更改 WiredTiger Journal Compressor

对于 WiredTiger 存储引擎，MongoDB 默认情况下使用 `snappy`日志压缩器。要为[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例指定不同的压缩算法或不压缩 ：



## TIP

如果您在此过程中遇到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 的不正常关闭，则必须使用旧的压缩器设置来使用日志文件进行恢复。 恢复后，您可以重试该过程。

使用以下过程更改独立[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例的日志压缩器：

1. 将设置更新 [`storage.wiredTiger.engineConfig.journalCompressor`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-storage.wiredTiger.engineConfig.journalCompressor)为新值。

   如果您使用命令行选项而不是配置文件，则必须[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)在下面的重新启动期间更新命令行选项。

2. 执行[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的正常关闭。例如，连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)实例和问题[`db.shutdownServer()`：](https://www.mongodb.com/docs/manual/reference/method/db.shutdownServer/#mongodb-method-db.shutdownServer)

   ```
   db.getSiblingDB('admin').shutdownServer()
   ```

   

3. 确认进程不再运行后，重新启动[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例：

   - 如果您使用的是配置文件：

     ```
     mongod -f <path/to/myconfig.conf>
     ```

     

   - 如果您使用的是命令行选项而不是配置文件，请更新该[`--wiredTigerJournalCompressor`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--wiredTigerJournalCompressor)选项。

     ```
     mongod --wiredTigerJournalCompressor <differentCompressor|none>  ...
     ```

     

←  [日记](https://www.mongodb.com/docs/manual/core/journaling/)[网格文件系统](https://www.mongodb.com/docs/manual/core/gridfs/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/manage-journaling/

译者：陆文龙

