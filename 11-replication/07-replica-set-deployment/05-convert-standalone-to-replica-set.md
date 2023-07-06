# 将 Standalone 转换为副本集

本教程描述了将[独立](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-standalone) [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例转换为[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的过程。使用独立实例进行测试和开发，但始终在生产中使用副本集。

该过程特定于不属于分片集群的实例。要将分片独立实例转换为分片副本集，请参阅[将分片独立转换为分片副本集](https://www.mongodb.com/docs/manual/tutorial/convert-shard-standalone-to-shard-replica-set/) 。

要在不使用预先存在的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例的情况下部署副本集，请参阅[部署副本集](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/) 。

要安装独立实例，请参阅[安装教程。](https://www.mongodb.com/docs/manual/installation/#std-label-tutorials-installation)

## 程序



## IMPORTANT

为避免因 IP 地址更改而导致配置更新，请使用 DNS 主机名而不是 IP 地址。在配置副本集节点或分片集群节点时，使用 DNS 主机名而不是 IP 地址尤为重要。

使用主机名而不是 IP 地址来配置跨分割网络水平的集群。从 MongoDB 5.0 开始，仅配置了 IP 地址的节点将无法通过启动验证而不会启动。

1. 关闭[独立](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-standalone) [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

2. 重启实例。使用该[`--replSet`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--replSet) 选项指定新副本集的名称。

   例如，以下命令启动一个独立实例作为名为 的新副本集的节点rs0`。该命令使用独立的现有数据库路径`/srv/mongodb/db0`：

   

   ## WARNING

   在绑定到非本地主机（例如可公开访问的）IP 地址之前，请确保您已保护集群免受未经授权的访问。有关安全建议的完整列表，请参阅 [安全清单](https://www.mongodb.com/docs/manual/administration/security-checklist/)。至少，考虑 [启用身份验证](https://www.mongodb.com/docs/manual/administration/security-checklist/#std-label-checklist-auth)和 [强化网络基础设施。](https://www.mongodb.com/docs/manual/core/security-hardening/)

   ```
   mongod --port 27017 --dbpath /srv/mongodb/db0 --replSet rs0 --bind_ip localhost,<hostname(s)|ip address(es)>
   ```

   

   如果您的应用程序连接到多个副本集，则每个副本集必须具有不同的名称。一些驱动程序按副本集名称对副本集连接进行分组。

   有关配置选项的更多信息，请参阅 [配置文件选项](https://www.mongodb.com/docs/manual/reference/configuration-options/)和[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 手册页。

3. 连接[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

4. 用于[`rs.initiate()`](https://www.mongodb.com/docs/manual/reference/method/rs.initiate/#mongodb-method-rs.initiate)启动新的副本集：

   ```
   rs.initiate()
   ```

   

   副本集现在可以运行了。要查看副本集配置，请使用[`rs.conf()`](https://www.mongodb.com/docs/manual/reference/method/rs.conf/#mongodb-method-rs.conf). 要检查副本集的状态，请使用[`rs.status()`.](https://www.mongodb.com/docs/manual/reference/method/rs.status/#mongodb-method-rs.status)

要将成员添加到此副本集，请使用该[`rs.add()`](https://www.mongodb.com/docs/manual/reference/method/rs.add/#mongodb-method-rs.add)方法。有关将成员添加到副本集的更多信息，请参阅 [将成员添加到副本集。](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/)



## TIP

### 也可以看看：

[将独立分片转换为分片副本集](https://www.mongodb.com/docs/manual/tutorial/convert-shard-standalone-to-shard-replica-set/)

←  [将仲裁器添加到副本集](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/)[将成员添加到副本集](https://www.mongodb.com/docs/manual/tutorial/expand-replica-set/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/

译者：陆文龙

