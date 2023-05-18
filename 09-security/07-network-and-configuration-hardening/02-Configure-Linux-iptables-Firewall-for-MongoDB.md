## 为 MongoDB 配置 Linux`iptables` 防火墙

在现代 Linux 系统上，iptables 程序提供了管理 Linux 内核的 netfilter 或网络数据包过滤功能的方法。 这些防火墙规则使管理员能够控制哪些主机可以连接到系统，并通过限制可以连接到系统的主机来限制风险暴露。

本文档概述了 Linux 上 iptables 防火墙的基本防火墙配置。 使用这些方法作为您的大型网络组织的起点。 有关 MongoDB 的安全实践和风险管理的详细概述，请参阅[Security](https://www.mongodb.com/docs/manual/security/)。

**概述**

`iptables` 配置中的规则落入链中，它描述了过滤和处理特定流量流的过程。 链条有顺序，数据包必须通过链条中较早的规则才能到达较晚的规则。 本文档仅针对以下两个链：

**`INPUT`**

- 控制所有传入流量。

**`OUTPUT`**

- 控制所有传出流量

鉴于所有 MongoDB 进程的[default ports](https://www.mongodb.com/docs/manual/reference/default-mongodb-port/)，您必须配置网络规则，只允许您的应用程序与适当的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例之间进行必要的通信。

请注意，默认情况下，iptables 的默认策略是允许所有连接和流量，除非明确禁用。 本文档中概述的配置更改将创建规则，明确允许来自特定地址和特定端口的流量，使用默认策略丢弃所有未明确允许的流量。 当您正确配置 iptables 规则以仅允许您想要允许的流量时，您可以[Change Default Policy to `DROP`](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/#std-label-iptables-change-default-policy-to-drop)。

**图案**

本节包含许多配置 `iptables` 以用于 MongoDB 部署的模式和示例。 如果您使用端口配置设置配置了不同的[`port`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-net.port)，则需要相应地修改规则。

**进出 `mongod` 实例的流量**

此模式适用于作为独立实例或作为 [replica set](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的一部分运行的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。

此模式的目标是明确允许从应用程序服务器到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的流量。 在以下示例中，将 `<ip-address>` 替换为应用服务器的 IP 地址：

```shell
iptables -A INPUT -s <ip-address> -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

第一条规则允许来自`<ip-address>`端口的所有传入流量`27017`，这允许应用程序服务器连接到 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。第二条规则，允许来自 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)的传出流量到达应用程序服务器。

>[NOTE]
>
>可选的
>
>如果您只有一台应用服务器，您可以替换 `<ip-address>`为 IP 地址本身，例如： `198.51.100.55`. 您还可以使用 CIDR 表示法将此表示为 `198.51.100.55/32`. 如果您想允许更大的可能 IP 地址块，您可以`/24`使用以下规范之一来允许来自 的流量`<ip-address>`，如下所示：
>
>```shell
>10.10.10.10/24
>10.10.10.10/255.255.255.0
>```

**进出 `mongos` 实例的流量**

[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例为[sharded clusters](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-sharded-cluster)提供查询路由。 客户端连接到 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例，从客户端的角度来看，它们的行为与 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例相同。 反过来，[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 连接到作为分片集群组件的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。

使用相同的 `iptables` 命令来允许进出这些实例的流量，就像来自作为副本集成员的 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例一样。 以Mongod Instances 的 [Traffic to and from `mongod` Instances](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/#std-label-iptables-basic-rule-set) 部分概述的配置为例。

**进出 MongoDB 配置服务器的流量**

配置服务器托管存储分片集群元数据的[config database](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database)。 配置服务器侦听端口 27019 上的连接。因此，将以下 `iptables` 规则添加到配置服务器以允许端口 `27019` 上的传入和传出连接，以连接到其他配置服务器。

```shell
iptables -A INPUT -s <ip-address> -p tcp --destination-port 27019 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27019 -m state --state ESTABLISHED -j ACCEPT
```

将 `<ip-address> `替换为提供配置服务器的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 的地址或地址空间。

此外，配置服务器需要允许来自集群中所有 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例和集群中所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的传入连接。 添加类似于以下内容的规则：

```shell
iptables -A INPUT -s <ip-address> -p tcp --destination-port 27019 -m state --state NEW,ESTABLISHED -j ACCEPT
```

将 `<ip-address>` 替换为 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例和分片 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例的地址。

**进出 MongoDB 分片服务器的流量**

[Shard servers](https://www.mongodb.com/docs/manual/sharding/#std-label-sharding-background)默认为端口号 `27018`。您必须配置以下 `iptables` 规则以允许进出每个分片的流量：

```shell
iptables -A INPUT -s <ip-address> -p tcp --destination-port 27018 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27018 -m state --state ESTABLISHED -j ACCEPT
```

将 `<ip-address>` 规范替换为所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 的 IP 地址。 这允许您允许包括组成副本集成员在内的所有分片之间的传入和传出流量，以：

- 分片副本集中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。


- 其他分片中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。 [1]


此外，分片需要能够与以下设备建立传出连接：

配置服务器中的所有 [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) 实例。

创建类似于以下内容的规则，并将 `<ip-address>` 替换为配置服务器和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例的地址：

```shell
iptables -A OUTPUT -d <ip-address> -p tcp --source-port 27018 -m state --state ESTABLISHED -j ACCEPT
```

[1] 集群中的所有分片都需要能够与所有其他分片通信，以促进块和平衡操作。

**为监控系统提供访问权限**

[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat) 诊断工具在与[`--discover`](https://www.mongodb.com/docs/database-tools/mongostat/#std-option-mongostat.--discover) 一起运行时需要能够访问集群的所有组件，包括配置服务器、分片服务器和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。

在 3.6 版中更改：MongoDB 3.6 删除了已弃用的 HTTP 接口和 MongoDB 的 REST API。

**将默认策略更改为 DROP**

`iptables` 链的默认策略是允许所有流量。 完成所有 `iptables` 配置更改后，您必须将默认策略更改为 DROP，这样所有未明确允许的流量将无法到达 MongoDB 部署的组件。 发出以下命令来更改此策略：

```shell
iptables -P INPUT DROP

iptables -P OUTPUT DROP
```

**管理和维护 `iptables` 配置**

本节包含一些管理和使用 iptables 的基本操作。 有多种前端工具可以自动执行 iptables 配置的某些方面，但所有 iptables 前端的核心都提供相同的基本功能：

**使所有 `iptables` 规则持久化**

默认情况下，所有 iptables 规则仅存储在内存中。 当您的系统重新启动时，您的防火墙规则将恢复为默认值。 当您测试了一个规则集并保证它有效地控制流量时，您可以使用以下操作来使规则集持久化。

在 Red Hat Enterprise Linux、Fedora Linux 和相关发行版上，您可以发出以下命令：

```shell
service iptables save
```

在 Debian、Ubuntu 和相关发行版上，您可以使用以下命令将`iptables`规则转储到 `/etc/iptables.conf`文件中：

```shell
iptables-save > /etc/iptables.conf
```

运行以下操作恢复网络规则：

```
iptables-restore < /etc/iptables.conf
```

将此命令放在您的`rc.local`文件中，或放在 `/etc/network/if-up.d/iptables`具有其他类似操作的文件中。

**列出所有`iptables`规则**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/#list-all-iptables-rules)

要列出所有当前应用的`iptables`规则，请在系统 shell 中使用以下操作。

```shell
iptables -L
```

**刷新所有`iptables`规则**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/#flush-all-iptables-rules)

如果您在输入`iptables`规则时配置错误或者只是需要恢复到默认规则集，您可以在系统 shell 中使用以下操作来刷新所有规则：

```shell
iptables -F
```

如果您已经使`iptables`规则持久化，则需要在 [Make all `iptables` Rules Persistent](https://www.mongodb.com/docs/manual/tutorial/configure-linux-iptables-firewall/#std-label-iptables-make-all-rules-persistent)部分。

 参见

原文 - [Configure Linux iptables Firewall for MongoDB]( https://docs.mongodb.com/manual/tutorial/configure-linux-iptables-firewall/ )

译者：景圣