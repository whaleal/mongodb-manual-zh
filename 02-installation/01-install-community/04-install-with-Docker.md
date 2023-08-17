## 使用 Docker 安装 MongoDB 社区

您可以使用官方 MongoDB 社区映像将 MongoDB 社区版作为 Docker 容器运行。使用 Docker 映像运行 MongoDB 部署有助于

- 快速部署。
- 帮助管理配置文件。
- 在多个版本的 MongoDB 上测试不同的功能。

### 关于此任务

本页介绍 MongoDB 社区版的 Docker 安装说明。这[MongoDB 企业 Docker 镜像](https://hub.docker.com/r/mongodb/mongodb-enterprise-server) 连同 [MongoDB Kubernetes 运营商](https://hub.docker.com/r/mongodb/mongodb-atlas-kubernetes-operator-prerelease) 建议用于生产部署。有关企业说明，请参阅[使用 Docker 安装 MongoDB Enterprise 。](https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-with-docker/#std-label-docker-mongodb-enterprise-install)

本程序使用官方[mongo社区镜像](https://hub.docker.com/r/mongodb/mongodb-community-server)，由 MongoDB 维护。

完整描述[Docker](https://docs.docker.com/)超出了本文档的范围。本页假设您事先了解 Docker。

### 在你开始之前

在运行 MongoDB Community Docker 容器之前，您必须安装[Docker](https://docs.docker.com/install/)。

### 步骤

1、拉取 MongoDB Docker 镜像

```
docker pull mongodb/mongodb-community-server
```

2、将镜像作为容器运行

```
docker run --name mongo -d mongodb/mongodb-community-server:latest
```

> 笔记:
>
> **安装特定版本的 MongoDB**
>
> `:`要安装特定版本的 MongoDB，请在 Docker run 命令中的后面指定版本。Docker 拉取并运行指定的版本。
>
> 例如，要运行 MongoDB 5.0：
>
> ```
> docker run --name mongo -d mongodb/mongodb-community-server:5.0-ubuntu2004
> ```
>
> 有关可用 MongoDB 社区服务器映像的完整列表，请参阅： [官方 Docker Hub 页面](https://hub.docker.com/r/mongodb/mongodb-community-server/tags)。

3、检查容器是否正在运行

要检查 Docker 容器的状态，请运行以下命令：

```
docker container ls
```

该`ls`命令的输出列出了描述正在运行的容器的以下字段：

- `Container ID`
- `Image`
- `Command`
- `Created`
- `Status`
- `Port`
- `Names`

```
CONTAINER ID   IMAGE                                       COMMAND                  CREATED         STATUS         PORTS       NAMES
c29db5687290   mongodb/mongodb-community-server:5.0-ubi8   "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   27017/tcp   mongo

```

4、连接到 MongoDB 部署`mongosh`

打开 的交互式容器实例`mongo`并使用 来连接到部署`mongosh`。

```
docker exec -it mongo mongosh
```

5、验证您的部署

要确认您的 MongoDB 实例正在运行，请运行以下`Hello` 命令：

```
db.runCommand(
   {
      hello: 1
   }
)
```

此命令的结果返回描述您的部署的文档 `mongod`：

```
{
   isWritablePrimary: true,
   topologyVersion: {
      processId: ObjectId("63c00e27195285e827d48908"),
      counter: Long("0")
},
   maxBsonObjectSize: 16777216,
   maxMessageSizeBytes: 48000000,
   maxWriteBatchSize: 100000,
   localTime: ISODate("2023-01-12T16:51:10.132Z"),
   logicalSessionTimeoutMinutes: 30,
   connectionId: 18,
   minWireVersion: 0,
   maxWireVersion: 20,
   readOnly: false,
   ok: 1
}
```



 参见

原文 - https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-community-with-docker

