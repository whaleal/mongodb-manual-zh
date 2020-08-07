# Authentication

# 身份验证

On this page

- [Authentication Methods](https://docs.mongodb.com/manual/core/authentication/#authentication-methods)
- [Authentication Mechanisms](https://docs.mongodb.com/manual/core/authentication/#authentication-mechanisms)
- [Internal Authentication](https://docs.mongodb.com/manual/core/authentication/#internal-authentication)
- [Authentication on Sharded Clusters](https://docs.mongodb.com/manual/core/authentication/#authentication-on-sharded-clusters)

在本页面

- 身份验证方法
- 身份验证机制
- 内部身份验证
- 分片集群中的身份验证

Authentication is the process of verifying the identity of a client. When access control, i.e. [authorization](https://docs.mongodb.com/manual/core/authorization/), is enabled, MongoDB requires all clients to authenticate themselves in order to determine their access.

身份验证是验证客户端身份的过程。当访问控制（即授权）开启的时候，MongoDB要求所有客户端进行身份认证，以确定他们的访问权限。

Although authentication and [authorization](https://docs.mongodb.com/manual/core/authorization/) are closely connected, authentication is distinct from authorization. Authentication verifies the identity of a user; authorization determines the verified user’s access to resources and operations.

尽管身份认证和授权紧密相连，但是身份认证和授权是不同的。身份认证是验证用户的身份，授权决定已通过验证的用户对资源和操作的访问权限。

## Authentication Methods

## 身份验证的方法

To authenticate as a user, you must provide a username, password, and the [authentication database](https://docs.mongodb.com/manual/reference/program/mongo/#mongo-shell-authentication-options) associated with that user.

作为一个用户要进行身份验证，你必须提供一个用户名、密码和关联这个用户的认证数据库。

To authenticate using the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) shell, either:

- Use the [`mongo`](https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo) command-line authentication options ([`--username`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-username), [`--password`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-password), and [`--authenticationDatabase`](https://docs.mongodb.com/manual/reference/program/mongo/#cmdoption-mongo-authenticationdatabase)) when connecting to the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instance, or
- Connect first to the [`mongod`](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) or [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instance, and then run the [`authenticate`](https://docs.mongodb.com/manual/reference/command/authenticate/#dbcmd.authenticate) command or the [`db.auth()`](https://docs.mongodb.com/manual/reference/method/db.auth/#db.auth) method against the [authentication database](https://docs.mongodb.com/manual/reference/program/mongo/#mongo-shell-authentication-options).

使用mongo shell 进行身份验证，可以：

- 当连接mongod或者mongos实例时，使用mongo命令行认证选项（--username、--password和--authenticationDatabase），也可以
- 先连接mongod或者mongos实例，然后在认证数据库上运行authenticate命令或者db.auth()方法。

> IMPORTANT:
>
> Authenticating multiple times as different users does **not** drop the credentials of previously-authenticated users. This may lead to a connection having more permissions than intended by the user, and causes operations within a [logical session](https://docs.mongodb.com/manual/reference/server-sessions/) to raise an error.

> 重要：
>
> 当使用不同的用户进行多次身份验证时，不会删除已经通过身份认证的用户的凭证。这可能导致这个进行过多个用户身份认证的连接具有比用户预期更多的权限，并导致在一个逻辑会话中的操作引发错误。

For examples of authenticating using a MongoDB driver, see the [driver documentation](https://docs.mongodb.com/ecosystem/drivers/).

关于使用MongoDB驱动程序进行身份验证的示例，请参阅驱动程序文档。

## Authentication Mechanisms

## 身份验证机制

MongoDB supports a number of [authentication mechanisms](https://docs.mongodb.com/manual/core/authentication-mechanisms/#security-authentication-mechanisms) that clients can use to verify their identity. These mechanisms allow MongoDB to integrate into your existing authentication system.

MongoDB支持许多身份认证机制，客户端可以使用这些身份认证机制来验证自己的身份。MongoDB允许集成这些机制到已经存在的身份认证系统。

MongoDB supports multiple authentication mechanisms:

- [SCRAM](https://docs.mongodb.com/manual/core/security-scram/#authentication-scram) (*Default*)
- [x.509 Certificate Authentication](https://docs.mongodb.com/manual/core/security-x.509/#security-auth-x509).

MongoDB支持多种身份验证机制：

- SCRAM（默认的）
- x.509证书身份验证

## Internal Authentication

## 内部身份验证

In addition to verifying the identity of a client, MongoDB can require members of replica sets and sharded clusters to [authenticate their membership](https://docs.mongodb.com/manual/core/security-internal-authentication/#inter-process-auth) to their respective replica set or sharded cluster. See [Internal/Membership Authentication](https://docs.mongodb.com/manual/core/security-internal-authentication/#inter-process-auth) for more information.

除了验证客户端的身份之外，MongoDB能要求副本集和分片集群的成员对其各自的副本集或者分片集群的成员资格进行身份验证。更多的信息请参阅：内部/成员身份认证。

## Authentication on Sharded Clusters

## 分片集群的身份验证

In sharded clusters, clients generally authenticate directly to the [`mongos`](https://docs.mongodb.com/manual/reference/program/mongos/#bin.mongos) instances. However, some maintenance operations may require authenticating directly to a specific shard. For more information on authentication and sharded clusters, see [Sharded Cluster Users](https://docs.mongodb.com/manual/core/security-users/#sharding-security).

在分片集群中，客户端通常直接向mongos实例进行身份认证。然而，一些维护操作可能要求对特定的分片进行认证。更多关于身份认证和分片集群的信息，请参阅分片集群用户。



原文链接：https://docs.mongodb.com/manual/core/authentication/

译者：傅立
