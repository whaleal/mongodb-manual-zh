# 成员配置教程[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/administration/replica-set-member-configuration/#member-configuration-tutorials)

以下教程提供有关配置副本集成员以支持特定操作的信息，例如提供专用备份、支持报告或充当冷备用。

>## 警告
>
>避免重新配置包含不同 MongoDB 版本成员的副本集，因为验证规则可能因 MongoDB 版本而异。



- [调整副本集成员的优先级](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/)

  更改在主要选举中赋予副本集成员的优先级。

- [防止次要成为主要](https://www.mongodb.com/docs/manual/tutorial/configure-secondary-only-replica-set-member/)

  使次要成员没有资格被选为主要成员。

- [配置一个隐藏的副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-hidden-replica-set-member/)

  将次要成员配置为对应用程序不可见，以支持显着不同的用途，例如专用备份。

- [配置延迟副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/)

  配置辅助成员以保留数据集的延迟副本，以提供滚动备份。

- [配置非投票副本集成员](https://www.mongodb.com/docs/manual/tutorial/configure-a-non-voting-replica-set-member/)

  创建一个保留数据集副本但不在选举中投票的辅助成员。

- [将辅助节点转换为仲裁节点](https://www.mongodb.com/docs/manual/tutorial/convert-secondary-into-arbiter/)

  将辅助设备转换为仲裁设备。

←  [替换副本集成员](https://www.mongodb.com/docs/manual/tutorial/replace-replica-set-member/)[调整副本集成员的优先级](https://www.mongodb.com/docs/manual/tutorial/adjust-replica-set-member-priority/) →

请点击页面上方 EDIT THIS PAGE 参与翻译。
详见：
[贡献指南]( https://github.com/JinMuInfo/MongoDB-Manual-zh/blob/master/CONTRIBUTING.md )、
[原文链接](  https://docs.mongodb.com/manual/administration/replica-set-member-configuration/  )。

 参见

原文 - https://docs.mongodb.com/manual/administration/replica-set-member-configuration/ 

译者：陆文龙

