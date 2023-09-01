## 使用 Health Manager 管理分片集群的运行状况

本文档介绍如何使用Health Manager来监控和管理分片集群的健康问题。

### 概述

健康管理器在 指定的时间对[健康管理器方面](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-health-manager-facet)运行健康检查[强度等级](https://www.mongodb.com/docs/manual/administration/health-managers/#std-label-health-managers-intensity-levels)。Health Manager检查按指定的时间间隔运行。可以将运行状况管理器配置为自动将出现故障的[mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)从集群中移出。 [进度监视器](https://www.mongodb.com/docs/manual/administration/health-managers/#std-label-health-managers-progress-monitor)确保Health Manager检查不会卡住或无响应。

### Health Manager方面

下表显示了可用的 Health Manager 方面：

| Facet          | Health Manager检查的内容                     |
| :------------- | :------------------------------------------- |
| `configServer` | 与配置服务器连接相关的集群运行状况问题。     |
| `dns`          | 与 DNS 可用性和功能相关的集群健康问题。      |
| `ldap`         | 与 LDAP 可用性和功能相关的集群运行状况问题。 |

### Health Manager的强度级别

下表显示了可用的 Health Manager 强度级别：

| 强度等级       | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| `critical`     | 此方面的运行状况管理器已启用，并且能够在发生错误时将出现故障的[mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)从集群中移出。Health Manager会等待指定的时间， [`activeFaultDurationSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.activeFaultDurationSecs)然后自动停止[mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)并将其移出集群。 |
| `non-critical` | 此方面的运行状况管理器已启用并记录错误，但如果遇到错误， [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)仍保留在集群中。 |
| `off`          | 此方面的运行状况管理器已禁用。mongos不会在这方面执行任何健康检查,这是默认强度级别。 |

### 故障持续时间

当检测到故障并且Health Manager强度级别设置为 时`critical`，Health Manager会等待 指定的时间， [`activeFaultDurationSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.activeFaultDurationSecs)然后自动停止 [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)并将其移出集群。

### 进度监视器

[进度监视器](https://www.mongodb.com/docs/manual/administration/health-managers/#std-label-health-managers-progress-monitor)运行测试以确保Health Manager检查不会卡住或无响应。进度监视器按照 指定的时间间隔运行这些测试`interval`。如果运行状况检查开始但未在指定的超时时间内完成`deadline`，进度监视器将停止 [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)并将其从集群中删除。

### `progressMonitor`领域

| Field      | 描述                                                         | 单位 |
| :--------- | :----------------------------------------------------------- | :--- |
| `interval` | 确保健康管理器不会卡住或反应迟钝的频率。                     | 毫秒 |
| `deadline` | 如果Health Manager检查没有取得进展，则[mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)自动失败之前超时。 | 秒数 |

#### 例子

以下示例显示了如何配置Health Manager 。有关Health Manager参数的信息，请参阅[Health Manager 参数。](https://www.mongodb.com/docs/manual/reference/parameters/#std-label-health-manager-parameters)

#### 强度

例如，要将`dns` Health Manager方面设置为 `critical`强度级别，请在启动时发出以下命令：

```
mongos --setParameter 'healthMonitoringIntensities={ values:[ { type:"dns", intensity: "critical"} ] }'
```

或者如果[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到正在运行的会话 [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
db.adminCommand(
  {
      setParameter: 1,
      healthMonitoringIntensities: { values: [ { type: "dns", intensity: "critical" } ] } } )
  }
)
```

用 设置的参数[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在重新启动后不会保留。详细信息请参见[设置参数页面。](https://www.mongodb.com/docs/manual/reference/command/setParameter/#std-label-setParameter-commands-not-persistent)

要使此设置持久，请使用 以下示例中的选项`healthMonitoringIntensities` 在[mongos 配置文件中进行设置：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)

```
setParameter:
   healthMonitoringIntensities: "{ values:[ { type:\"dns\", intensity: \"critical\"} ] }"
```

`healthMonitoringIntensities`接受一系列文档， `values`. 每个文档都有`values`两个字段：

- `type`,健康管理器方面
- `intensity`, 强度等级

[`healthMonitoringIntensities`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.healthMonitoringIntensities)详情请参阅。

### 间隔

例如，要将`ldap` Health Manager方面设置为每 30 秒运行一次运行状况检查，请在启动时发出以下命令：

```
mongos --setParameter 'healthMonitoringIntervals={ values:[ { type:"ldap", interval: "30000"} ] }'
```

或者，如果在连接到运行中的 [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos) 的 [mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 会话中使用 [setParameter](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter) 命令：

```
db.adminCommand(
  {
      setParameter: 1,
      healthMonitoringIntervals: { values: [ { type: "ldap", interval: "30000" } ] } } )
  }
)
```

用 设置的参数[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在重新启动后不会保留。详细信息请参见[设置参数页面。](https://www.mongodb.com/docs/manual/reference/command/setParameter/#std-label-setParameter-commands-not-persistent)

要使此设置持久，请使用 以下示例中的选项`healthMonitoringIntervals` 在[mongos 配置文件中进行设置：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)

```
setParameter:
   healthMonitoringIntervals: "{ values: [{type: \"ldap\", interval: 200}] }"
```

`healthMonitoringIntervals`接受一系列文档， `values`. 每个文档都有`values`两个字段：

- `type`,健康管理器方面
- `interval`，运行的时间间隔，以毫秒为单位

[`healthMonitoringIntervals`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.healthMonitoringIntervals)详情请参阅。

#### 故障持续时间

例如，要将从失败到崩溃的持续时间设置为五分钟，请在启动时发出以下命令：

```
mongos --setParameter activeFaultDurationSecs=300
```

或者如果[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到正在运行的会话 [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
db.adminCommand(
  {
      setParameter: 1,
      activeFaultDurationSecs: 300
  }
)
```

用 设置的参数[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在重新启动后不会保留。详细信息请参见[设置参数页面。](https://www.mongodb.com/docs/manual/reference/command/setParameter/#std-label-setParameter-commands-not-persistent)

要使此设置持久，请使用 以下示例中的选项`activeFaultDurationSecs` 在[mongos 配置文件中进行设置：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)

```
setParameter:
   activeFaultDurationSecs: 300
```

[`activeFaultDurationSecs`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.activeFaultDurationSecs)详情请参阅。

#### 进度监视器

[进度监视器](https://www.mongodb.com/docs/manual/administration/health-managers/#std-label-health-managers-progress-monitor)运行测试以确保Health Manager检查不会卡住或无响应。进度监视器按照 指定的时间间隔运行这些测试`interval`。如果运行状况检查开始但未在指定的超时时间内完成`deadline`，进度监视器将停止 [mongos](https://www.mongodb.com/docs/manual/reference/program/mongos/#std-label-mongos)并将其从集群中删除。

要将 分别设置`interval`为 1000 毫秒和`deadline` 300 秒，请在启动时发出以下命令：

```
mongos --setParameter 'progressMonitor={"interval": 1000, "deadline": 300}'
```

或者如果[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)连接到正在运行的会话 [`mongos`：](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)

```
db.adminCommand(
  {
      setParameter: 1,
      progressMonitor: { interval: 1000, deadline: 300 } )
  }
)
```

用 设置的参数[`setParameter`](https://www.mongodb.com/docs/manual/reference/command/setParameter/#mongodb-dbcommand-dbcmd.setParameter)在重新启动后不会保留。详细信息请参见[设置参数页面。](https://www.mongodb.com/docs/manual/reference/command/setParameter/#std-label-setParameter-commands-not-persistent)

要使此设置持久，请使用 以下示例中的选项`progressMonitor` 在[mongos 配置文件中进行设置：](https://www.mongodb.com/docs/manual/reference/configuration-options/#std-label-configuration-options)[`setParameter`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-setParameter)

```
setParameter:
   progressMonitor: "{ interval: 1000, deadline: 300 }"
```

[`progressMonitor`](https://www.mongodb.com/docs/manual/reference/parameters/#mongodb-parameter-param.progressMonitor)详情请参阅。



 参见

原文 - [Manage Sharded Cluster Health with Health Managers](https://www.mongodb.com/docs/manual/administration/health-managers/#active-fault-duration)