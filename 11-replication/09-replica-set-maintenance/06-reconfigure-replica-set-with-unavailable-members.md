# 使用不可用节点重新配置副本集

要在**大多数**节点可用时重新配置[副本集，请按照](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)[副本集重新配置过程](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)中的示例 使用 当前[主节点上的操作](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)[。](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#std-label-replica-set-reconfiguration-usage)[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)

*本文档提供了在只有*少数节点可访问时重新配置副本集的步骤**。**

例如，您可能需要在地理分布的副本集中使用该过程，其中*任何*本地节点组都无法达到多数。有关这种情况的更多信息，请参阅[副本集选举](https://www.mongodb.com/docs/manual/core/replica-set-elections/#std-label-replica-set-elections)。



## 通过强制重新配置来重新配置[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/reconfigure-replica-set-with-unavailable-members/#reconfigure-by-forcing-the-reconfiguration)

此过程允许您在大多数[副本集](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-replica-set)节点关闭或无法访问时进行恢复。您连接到任何幸存的节点并使用该方法的`force`选项[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig) 。

该`force`选项将新配置强制应用到节点上。仅使用此过程从灾难性中断中恢复。`force`每次重新配置时不要使用。此外，不要`force`在任何自动脚本中使用该选项，并且`force`在仍然存在[主节点.](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-primary)

强制重新配置：

1. 备份一个幸存的节点。

2. 连接到幸存的节点并保存当前配置。考虑以下用于保存配置的示例命令：

   ```
   cfg = rs.conf()
   
   printjson(cfg)
   ```

   

3. 在同一节点上，[`members`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members)通过将数组设置为仅等于幸存节点，从数组中删除副本集的已关闭和无法访问的节点。考虑以下示例，它使用`cfg`在上一步中创建的变量：

   ```
   cfg.members = [cfg.members[0] , cfg.members[4] , cfg.members[7]]
   ```

   

4. 在同一节点上，使用选项设置为以下的[`rs.reconfig()`](https://www.mongodb.com/docs/manual/reference/method/rs.reconfig/#mongodb-method-rs.reconfig)命令重新配置集合：`force``true`

   ```
   rs.reconfig(cfg, {force : true})
   ```

   

   此操作强制从属服务器使用新配置。然后将配置传播到`members`数组中列出的所有幸存节点。然后副本集选出一个新的主节点。

   >## NOTE
   >
   >当你使用`force : true`时，副本集配置中的版本号显着增加，数万或数十万。这是正常的，旨在防止设置版本冲突，如果您不小心在网络分区的两侧强制重新配置，然后网络分区结束。
   
   

5. 如果故障或分区只是暂时的，请尽快关闭或停用已删除的节点。

>## TIP
>
>### 也可以看看：
>
>[重新同步副本集的节点](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)

←  [配置副本集标签集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)                        [管理链式复制](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/) →

原文链接 - https://docs.mongodb.com/manual/tutorial/reconfigure-replica-set-with-unavailable-members/ 

译者：陆文龙

