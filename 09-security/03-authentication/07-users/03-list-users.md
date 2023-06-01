### 列出用户

要列出所有用户，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)查询 [system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合：

```shell
use admin
db.system.users.find()
```

> 重要的:
>
> 不要直接修改[system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合。要管理用户，请使用指定的[用户管理命令。](https://www.mongodb.com/docs/manual/reference/command/#std-label-user-management-commands)

要列出通过 a 创建的[分片集群](https://www.mongodb.com/docs/manual/sharding/)[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)的所有用户，请连接到 a [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)并运行上述命令。MongoDB 将通过 a 创建的用户存储在[配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server) 的数据库[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)中[。](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)`admin`

要列出所有[分片本地用户](https://www.mongodb.com/docs/manual/core/security-users/#std-label-shard-local-users)，请直接连接到相应的分片并运行上述命令。MongoDB 将*分片本地*用户存储在 `admin`分片本身的数据库中。这些*分片本地*用户独立于通过 . 添加到分片集群的用户 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。*分片本地*用户在分片本地，无法访问[`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)









翻译：韩鹏帅

原文：[List Users](https://www.mongodb.com/docs/manual/tutorial/list-users/)
