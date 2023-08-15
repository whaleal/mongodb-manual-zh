## 使用Docker安装MongoDB企业版

> 重要
>
> 将容器与MongoDB结合使用的推荐解决方案是：
>
> - 为了进行开发和测试，请使用 [MongoDB社区Docker容器](https://hub.docker.com/_/mongo/)。
> - 对于MongoDB企业版生产安装，请通过[MongoDB Ops Manager](https://docs.opsmanager.mongodb.com/current/tutorial/install-k8s-operator)使用Kubernetes 。
>

您可以使用官方 MongoDB Enterprise 映像将 MongoDB Enterprise Edition 作为 Docker 容器运行。如果您想要执行以下操作，请使用 Docker 容器来运行 MongoDB 部署：

- 快速设置部署。
- 避免编辑配置文件。
- 测试 MongoDB 多个版本的功能。

### 关于此任务

本页假设您事先了解 Docker。完整描述 [Docker](https://docs.docker.com/)超出了本文档的范围。

本程序使用官方[MongoDB 企业高级服务器](https://hub.docker.com/r/mongodb/mongodb-enterprise-server)容器，由 MongoDB 维护。

### 在你开始之前

安装[Docker。](https://docs.docker.com/install/)

安装[mongosh。](https://www.mongodb.com/docs/mongodb-shell/install/)

### 步骤

#### 1、拉取 MongoDB Docker 镜像

```
docker pull mongodb/mongodb-enterprise-server:latest
```

#### 2、将镜像作为容器运行

```
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-enterprise-server:latest
```

此命令中的`-p 27017:27017`会将容器端口映射到主机端口。这允许您使用连接字符串连接到 MongoDB `localhost:27017`。

`:`要安装特定版本的 MongoDB，请在 Docker run 命令中的后面指定版本。Docker 拉取并运行指定的版本。

例如，要运行 MongoDB 5.0：

```
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-enterprise-server:5.0-ubuntu2004
```

有关可用版本的完整列表，请参阅 [标签。](https://hub.docker.com/r/mongodb/mongodb-enterprise-server/tags)

> 笔记:
>
> **添加命令行选项**
>
> [您可以通过将命令行选项](https://www.mongodb.com/docs/v7.0/reference/configuration-file-settings-command-line-options-mapping/#std-label-conf-file-command-line-mapping) 附加到 docker run 命令来使用mongod 命令行选项。
>
> 例如，考虑[`mongod --replSet`](https://www.mongodb.com/docs/v7.0/reference/program/mongod/#std-option-mongod.--replSet)docker 命令行选项：
>
> ```
> docker run -p 27017:27017 -d mongodb/mongodb-enterprise-server:latest --name mongodb --replSet myReplicaSet
> ```

#### 3、检查容器是否正在运行

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
CONTAINER ID   IMAGE                                      COMMAND                 CREATED         STATUS         PORTS       NAMES
c29db5687290   mongodb-enterprise-server:latest  "docker-entrypoint.s…"   4 seconds ago   Up 3 seconds   27017/tcp   mongo
```

#### 4、连接到 MongoDB 部署`mongosh`

```
mongosh --port 27017
```

#### 5、**验证您的部署**

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

### 了解更多

有关兼容性信息，请参阅 [Docker 和 MongoDB 。](https://www.mongodb.com/compatibility/docker)



原文链接：https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-enterprise-with-docker/

译者：韩鹏帅

