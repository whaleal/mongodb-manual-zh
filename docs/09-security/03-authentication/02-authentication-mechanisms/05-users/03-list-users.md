**列出用户**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/list-users/#list-users)

要列出所有用户，请使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)查询 [system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合：

```shell
use admin
db.system.users.find()
```

>[IMPORTANT]
>
>不要直接修改[system.users](https://www.mongodb.com/docs/manual/reference/system-users-collection/)集合。要管理用户，请使用指定的[user management commands](https://www.mongodb.com/docs/manual/reference/command/#std-label-user-management-commands)

要列出通过 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)创建的 [sharded cluster](https://www.mongodb.com/docs/manual/sharding/) 的所有用户，请连接到  [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)并运行上述命令。MongoDB 将通过 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)把创建的用户存储在[配置服务器](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-config-server)的`admin` 数据库中。

要列出所有[shard local users](https://www.mongodb.com/docs/manual/core/security-users/#std-label-shard-local-users)，请直接连接到相应的分片并运行上述命令。MongoDB 将分*片本地*用户存储在分 `admin`片本身的数据库中。这些分片*本地*用户独立于通过 . 添加到分片集群的用户 [`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)。*分片本地*用户在分片本地，无法访问[`mongos`.](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)