# 副本集维护教程[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/administration/replica-set-maintenance/#replica-set-maintenance-tutorials)

以下教程提供有关维护现有副本集的信息。

- [改变 Oplog 的大小](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/)

  增加记录操作的[oplog的大小。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-oplog)在大多数情况下，默认的 oplog 大小就足够了。

- [对副本集节点执行维护](https://www.mongodb.com/docs/manual/tutorial/perform-maintence-on-replica-set-members/)

  对副本集的节点执行维护，同时最大限度地减少停机时间。

- [强制节点成为主节点](https://www.mongodb.com/docs/manual/tutorial/force-member-to-be-primary/)

  强制副本集节点成为主节点。

- [重新同步副本集的节点](https://www.mongodb.com/docs/manual/tutorial/resync-replica-set-member/)

  同步节点上的数据。要么在新节点上执行初始同步，要么在已经落后太多而无法通过正常复制赶上的现有节点上重新同步数据。

- [配置副本集标签集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)

  将标签分配给副本集节点，用于将读取和写入操作定位到特定节点。

- [使用不可用节点重新配置副本集](https://www.mongodb.com/docs/manual/tutorial/reconfigure-replica-set-with-unavailable-members/)

  当大多数副本集节点关闭或无法访问时，重新配置副本集。

- [管理链式复制](https://www.mongodb.com/docs/manual/tutorial/manage-chained-replication/)

  禁用或启用链式复制。当一个从节点从另一个从节点而不是主节点复制时，就会发生链式复制。

- [更改副本集中的主机名](https://www.mongodb.com/docs/manual/tutorial/change-hostnames-in-a-replica-set/)

  更新副本集配置以反映节点主机名的变化。

- [配置次要的同步目标](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-secondary-sync-target/)

  指定从节点从中同步的节点。

- [重命名副本集](https://www.mongodb.com/docs/manual/tutorial/rename-unsharded-replica-set/)

  重命名未分片的副本集。

- [安全修改 PSA 副本集](https://www.mongodb.com/docs/manual/tutorial/modify-psa-replica-set-safely/)

  安全地对主辅仲裁器 (PSA) 副本集或正在更改为 PSA 架构的副本集执行一些重新配置更改。

- [使用 PSA 副本集缓解性能问题](https://www.mongodb.com/docs/manual/tutorial/mitigate-psa-performance-issues/)

  为具有三节点主从仲裁器 (PSA) 架构的部署降低缓存压力并增加写入流量。

←  [将辅助节点转换为仲裁节点](https://www.mongodb.com/docs/manual/tutorial/convert-secondary-into-arbiter/)[改变 Oplog 的大小](https://www.mongodb.com/docs/manual/tutorial/change-oplog-size/) →

请点击页面上方 EDIT THIS PAGE 参与翻译。
详见：
[贡献指南]( https://github.com/JinMuInfo/MongoDB-Manual-zh/blob/master/CONTRIBUTING.md )、
[原文链接](  https://docs.mongodb.com/manual/administration/replica-set-maintenance/  )。

 参见

原文链接 - https://docs.mongodb.com/manual/administration/replica-set-maintenance/ 

译者：陆文龙

