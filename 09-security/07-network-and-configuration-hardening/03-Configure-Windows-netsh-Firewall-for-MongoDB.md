## 为 MongoDB 配置 Windows netsh 防火墙

在 Windows Server 系统上，netsh 程序提供了管理 netsh advfirewall import "C:\temp\MongoDBfw.wfw"的方法。 这些防火墙规则使管理员能够控制哪些主机可以连接到系统，并通过限制可以连接到系统的主机来限制风险暴露。

本文档概述了基本的 **Windows 防火墙**配置。 使用这些方法作为您的大型网络组织的起点。 有关 MongoDB 安全实践和风险管理的详细概述，请参阅[Security](https://www.mongodb.com/docs/manual/security/)。

>[TIP]
>
>也可以看看:
>
>[Windows Firewall](http://technet.microsoft.com/en-us/network/bb545423.aspx) documentation from Microsoft.

**概述**

**Windows 防火墙**按规则类型确定的顺序处理规则，并按以下顺序解析：

1. `Windows Service Hardening`
2. `Connection security rules`
3. `Authenticated Bypass Rules`
4. `Block Rules`
5. `Allow Rules`
6. `Default Rules`

默认情况下，**Windows 防火墙**中的策略允许所有出站连接并阻止所有传入连接。

鉴于所有 MongoDB 进程的默认端口，您必须配置网络规则，只允许您的应用程序与适当的 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 和 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例之间进行必要的通信。

本文档中概述的配置更改将创建规则，明确允许来自特定地址和特定端口的流量，使用默认策略丢弃所有未明确允许的流量。

您可以使用 netsh 命令行工具或通过 Windows 应用程序配置 **Windows 防火墙**。 在 Windows Server 2008 上，此应用程序是**管理工具**中**具有高级安全性的 Windows 防火墙**。 在以前版本的 Windows Server 上，访问**系统和安全**控制面板中的 **Windows 防火墙**应用程序。

本文档中的过程使用 netsh 命令行工具。

**模式**

本节包含一些配置 **Windows 防火墙**以用于 MongoDB 部署的模式和示例。 如果您使用端口配置设置配置了不同的端口，则需要相应地修改规则。

**进出 `mongod.exe` 实例的流量**

此模式适用于作为独立实例或作为[replica set](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)的一部分运行的所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。 此模式的目标是明确允许从应用程序服务器到 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例的流量。

```shell
netsh advfirewall firewall add rule name="Open mongod port 27017" dir=in action=allow protocol=TCP localport=27017
```

此规则允许所有传入流量到端口 `27017`，这允许应用程序服务器连接到[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。

**Windows 防火墙**还允许为整个应用程序而不是特定端口启用网络访问，如以下示例所示：

```shell
netsh advfirewall firewall add rule name="Allowing mongod" dir=in action=allow program=" C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
```

您可以通过以下调用允许对 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 服务器的所有访问：

```shell
netsh advfirewall firewall add rule name="Allowing mongos" dir=in action=allow program=" C:\Program Files\MongoDB\Server\3.4\bin\mongos.exe"
```

**进出 `mongos.exe` 实例的流量**

[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例为分片集群提供查询路由。 客户端连接到 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例，从客户端的角度来看，这些实例的行为与 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例相同。 反过来，[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 连接到作为分片集群组件的所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例。

使用相同的 **Windows** 防火墙命令来允许进出这些实例的流量，就像来自作为副本集成员的 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例一样。

```shell
netsh advfirewall firewall add rule name="Open mongod shard port 27018" dir=in action=allow protocol=TCP localport=27018
```

**进出 MongoDB 配置服务器的流量**

配置服务器，托管存储分片集群元数据的[config database](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-database) 。 每个生产集群都有三个配置服务器，使用 [`mongod --configsvr`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--configsvr)选项启动。 [1] 配置服务器侦听端口 `27019` 上的连接。因此，将以下 **Windows 防火墙**规则添加到配置服务器以允许端口 `27019` 上的传入和传出连接，以连接到其他配置服务器。

```shell
netsh advfirewall firewall add rule name="Open mongod config svr port 27019" dir=in action=allow protocol=TCP localport=27019
```

此外，配置服务器需要允许来自集群中所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例和集群中所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例的传入连接。 添加类似于以下内容的规则：

```shell
netsh advfirewall firewall add rule name="Open mongod config svr inbound" dir=in action=allow protocol=TCP remoteip=<ip-address> localport=27019
```

将 `<ip-address>` 替换为 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例和分片 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongos.exe/#mongodb-binary-bin.mongos.exe) 实例的地址。

[1] 您还可以通过在配置文件中使用 [`clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 设置的 `configsvr` 值来运行配置服务器。

**进出 MongoDB 分片服务器的流量**

对于分片服务器，作为 [`mongod --shardsvr`](https://www.mongodb.com/docs/manual/reference/program/mongod/#std-option-mongod.--shardsvr) [2] 运行时，因为默认端口号是 `27018`，当使用 [`clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 设置的 shardsvr 值运行时，您必须配置以下 **Windows 防火墙**规则以允许进出每个分片的流量：

```shell
netsh advfirewall firewall add rule name="Open mongod shardsvr inbound" dir=in action=allow protocol=TCP remoteip=<ip-address> localport=27018
netsh advfirewall firewall add rule name="Open mongod shardsvr outbound" dir=out action=allow protocol=TCP remoteip=<ip-address> localport=27018
```

将 `<ip-address>` 规范替换为所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例的 IP 地址。 这允许您允许包括组成副本集成员在内的所有分片之间的传入和传出流量：

- 分片副本集中的所有[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。


- 其他分片中的所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。 [3]


此外，分片需要能够与以下设备建立传出连接：

- 所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。


- 配置服务器中的所有 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例。


创建类似于以下内容的规则，并将 `<ip-address>` 替换为配置服务器和 [`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 实例的地址：

```shell
netsh advfirewall firewall add rule name="Open mongod config svr outbound" dir=out action=allow protocol=TCP remoteip=<ip-address> localport=27018
```

[2] 您还可以使用配置文件中 [`clusterRole`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-sharding.clusterRole) 设置的 `shardsvr` 值指定分片服务器选项。 分片成员通常也是使用默认端口的常规副本集。
[3] 集群中的所有分片都需要能够与所有其他分片通信，以促进块和平衡操作。
**为监控系统提供访问权限**

[`mongostat`](https://www.mongodb.com/docs/database-tools/mongostat/#mongodb-binary-bin.mongostat) 诊断工具在与[`--discover`](https://www.mongodb.com/docs/database-tools/mongostat/#std-option-mongostat.--discover) 一起运行时需要能够访问集群的所有组件，包括配置服务器、分片服务器和 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 实例。

在 3.6 版中更改：MongoDB 3.6 删除了已弃用的 HTTP 接口和 MongoDB 的 REST API。

**管理和维护 *Windows 防火墙*配置**

本节包含一些管理和使用 netsh 的基本操作。 虽然您可以使用 GUI 前端来管理 **Windows 防火墙**，但可以从 netsh 访问所有核心功能。

**删除所有 *Windows 防火墙*规则**

要删除允许[`exe`](https://www.mongodb.com/docs/manual/reference/program/mongod.exe/#mongodb-binary-bin.mongod.exe) 流量的防火墙规则：

```shell
netsh advfirewall firewall delete rule name="Open mongod port 27017" protocol=tcp localport=27017

netsh advfirewall firewall delete rule name="Open mongod shard port 27018" protocol=tcp localport=27018
```

**列出所有 *Windows 防火墙*规则**

要返回所有 **Windows 防火墙**规则的列表：

```shell
netsh advfirewall firewall show rule name=all
```

**重置 *Windows 防火墙***

要重置 **Windows 防火墙**规则：

```shell
netsh advfirewall reset
```

**备份和还原 *Windows 防火墙*规则**

为了简化大量系统的管理，您可以在 Windows 上非常容易地从不同的服务器导出或导入防火墙系统）规则：

使用以下命令导出所有防火墙规则：

```shell
netsh advfirewall export "C:\temp\MongoDBfw.wfw"
```

将`“C:\temp\MongoDBfw.wfw”`替换为您选择的路径。 您可以使用以下形式的命令导入使用此操作创建的文件：

```shell
netsh advfirewall import "C:\temp\MongoDBfw.wfw"
```

 参见

原文 - [Configure Windows netsh Firewall for MongoDB]( https://docs.mongodb.com/manual/tutorial/configure-windows-netsh-firewall/ )

译者：景圣