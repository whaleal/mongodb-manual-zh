 Priority 0 Replica Set Members

# 优先级为 0 的副本集成员[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#priority-0-replica-set-members)

[`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)成员是 **不能**成为[主](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)成员且**不能**触发 [选举](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-election)的成员。[优先级为 0 的成员可以确认以 的写关注](https://www.mongodb.com/docs/manual/reference/write-concern/#std-label-write-concern)发出的写操作 `w : <number>`。对于`"majority"`写入问题，优先级为 0 的成员也必须是投票成员（即[`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)大于`0`）才能确认写入。非投票副本集成员（即[`members[n\].votes`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.votes)is `0`）不能参与确认具有`"majority"`写关注的写操作。

除上述限制外，辅助节点具有 [`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)正常辅助节点的功能：它们维护数据集的副本、接受读取操作并在选举中投票。

[`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)如果特定成员部署在远离主部署的数据中心并因此具有更高的延迟，则可能需要配置副本集成员 。它可以很好地服务于本地读取请求，但由于其延迟可能不是执行主节点职责的理想选择。

对于这种情况，下图显示了左侧的数据中心托管主要节点和辅助节点，右侧的数据中心托管已配置为 *优先级 0*以防止其成为主要节点的辅助节点。由于此设置，只有左侧数据中心的成员才有资格成为选举中的主要成员。

![分布在两个数据中心的 3 成员副本集的示意图。 副本集包含一个优先级为 0 的成员。](../../../images/replica-set-priority-0-member01.svg)

点击放大

将此与副本集成员的默认优先级进行比较， [`priority 1`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)在这种情况下，其中任何一个辅助节点都有资格充当主要节点。有关详细信息，请参阅 [分布在两个或多个数据中心](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/)的副本集。

## 优先级为 0 的成员作为备用[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#priority-0-members-as-standbys)

次要的[`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)可以作为备用。在某些副本集中，可能无法在合理的时间内添加新成员。备用成员保留数据的当前副本，以便能够替换不可用的成员。

在许多情况下，您不需要将 standby 设置为*优先级 0*。但是，在具有不同硬件或[地理分布](https://www.mongodb.com/docs/manual/core/replica-set-architecture-geographically-distributed/#std-label-replica-set-geographical-distribution)的副本集中，*优先级为 0*的备用数据库可确保只有某些成员成为主数据库。

*优先级为 0*的备用数据库对于具有不同硬件或工作负载配置文件的集合中的某些成员也可能很有价值。在这些情况下，部署一个*优先级为 0*的成员，这样它就不会成为主要成员。还可以考虑为此目的使用[隐藏成员。](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/#std-label-replica-set-hidden-members)

如果您的集合已经有七个投票成员，也将成员配置为[non-voting 。](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-non-voting-members)

## 故障转移注意事项[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#failover-considerations)

将辅助节点配置为具有[`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)时，请考虑潜在的故障转移模式，包括所有可能的网络分区。始终确保您的主数据中心包含法定人数的投票成员和有资格成为主要成员的成员。

## 例子[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/replica-set-priority-0-member/#example)

要将辅助配置为具有[`priority 0`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.priority)，请参阅 [防止辅助成为主要。](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/)

←  [副本集次要成员](https://www.mongodb.com/docs/manual/core/replica-set-secondary/)[隐藏的副本集成员](https://www.mongodb.com/docs/manual/core/replica-set-hidden-member/) →



原文链接 - https://docs.mongodb.com/manual/core/replica-set-priority-0-member/ 

译者：陆文龙

