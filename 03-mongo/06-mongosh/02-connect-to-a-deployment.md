# 连接到服务

本页显示如何使用MongoDB Shell连接到MongoDB 服务。

## 先决条件

要使用 MongoDB shell程序，必须有MongoDB服务才能连接到。

* 对于免费的云托管部署，您可以使用[MongoDBAtlas](https://www.mongodb.com/cloud/atlas?tck=docs_mongosh)。
* 要了解如何运行本地MongoDB服务，请参见 [安装MongoDB](https://www.mongodb.com/docs/manual/installation/)。

### 支持的MongoDB版本

您可以使用MongoDBShell连接到MongoDB4.2版或 更大。

## 连接到默认端口上的本地服务

要连接到在本地主机上运行的MongoDB部署**，请**使用 **默认端口** 27017，运行`mongosh`，不带任何选项：

```bash
mongosh
```

这等效于以下命令：

```
mongosh "mongodb://localhost:27017"
```

## 连接到非默认端口上的本地服务

要在localhost上指定要连接的端口，可以使用以下任一方法：

* 具有所选端口的连接字符串
* -- port命令行选项

例如，以下命令连接到在本地主机端口28015上运行的服务：

```
mongosh "mongodb://localhost:28015"
```

```
mongosh --port 28015
```

## 连接到远程主机上的服务

要指定远程主机和端口，可以使用以下任一方法：

* 具有所选主机和端口的连接字符串。
* host和--port命令行选项。如果省略--port选项，mongosh将使用默认端口27017。

例如，以下命令连接到在主机www.example.com和端口28015上运行的MongoDB服务mongodb0.example.com：

```
mongosh "mongodb://mongodb0.example.com:28015"
```

```
mongosh --host mongodb0.example.com --port 28015
```

> 注：
>
> 连接到MongoDB Atlas
>
> 如果您的远程主机是Atlas群集，则可以将 Atlas UI中的连接字符串。要了解更多信息，请参见 [连接到群集](https://www.mongodb.com/docs/atlas/connect-to-cluster/#use-the-connect-dialog-to-connect-to-your-cluster) 在Atlas文件中。

## 指定连接选项

指定不同的连接选项以连接到不同类型的服务

### 使用身份验证连接

要连接到需要身份验证的MongoDB部署，请使用[--username](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--username)和[--authenticationDatabase](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--authenticationDatabase)选项。`mongosh`会提示您输入密码，但在您键入时会隐藏该密码。

例如，要在admin数据库上以用户alice身份进行身份验证，请运行以下命令：

```
mongosh "mongodb://mongodb0.example.com:28015" --username alice --authenticationDatabase admin
```

要在连接命令中提供口令而不是使用提示符，请使用[--password](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--password)选项。此选项用于以编程方式使用mongosh，如驱动程序。

> 另见：
>
> * 要对服务强制执行身份验证，请参见[启用访问控制](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)。
> * 要提供对MongoDB服务的访问，请参见[数据库用户](https://www.mongodb.com/docs/manual/core/security-users/)。

### 连接到副本集

要连接到副本集，您可以：

* 使用 [DNS种子列表连接格式](https://www.mongodb.com/docs/manual/reference/connection-string/#dns-seedlist-connection-format)。
* 在连接字符串中显式指定副本集名称和成员。

#### 选项1：DNS种子列表格式

要使用DNS种子列表连接格式，请在连接字符串中包含`+srv`修饰符。

例如，要连接到`www.example.com`上的副本集server.example.com，请运行以下命令：

```
mongosh "mongodb+srv://server.example.com/"
```

> 注：
>
> **+srv TLS Behavior**
>
> 当使用+srv连接字符串修饰符时，MongoDB自动将--tls连接选项设置为true。要覆盖此行为，请将[--tls](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--tls)设置为false。

#### 选项2：在连接字符串中指定成员

可以在连接字符串中指定单个副本集成员。

例如，要连接到名为replA的三成员副本集， `replA` , 运行以下命令：

```
mongosh
"mongodb://mongodb0.example.com.local:27017,mongodb1.example.com.local:27017,mongodb2.example.com.local:27017/?replicaSet=replA"
```

> 注：
>
> **自动添加directConnection参数**
>
> 当您在连接字符串中指定单个副本集成员时，mongosh会自动添加directConnection=true参数，除非至少满足以下条件之一：
>
> * replicaSet查询参数出现在连接字符串中。
> * 连接字符串使用mongodb+srv：//连接字符串格式。
> * 连接字符串包含具有多个主机的种子列表。
> * 连接字符串已包含directConnection参数。
>
> 当directConnection=true时，所有操作都在连接URI中指定的主机上运行。

### 使用TLS连接

要使用TLS连接到展开，您可以：

* 使用[DNS种子列表连接格式](https://www.mongodb.com/docs/manual/reference/connection-string/#dns-seedlist-connection-format)。+ srv连接字符串修饰符自动将连接的tls选项设置为true。

  例如，要连接到启用了tls的DNS种子列表定义的副本集，请运行以下命令：

  ```
  mongosh "mongodb+srv://server.example.com/"
  ```

* 在连接字符串中将--tls选项设置为true。
  例如，若要使用连接字符串选项启用tls，请运行以下命令：

  ```
  mongosh "mongodb://mongodb0.example.com:28015/?tls=true"
  ```

* 指定--tls命令行选项。
  例如，要连接到启用了tls的远程主机，请运行以下命令：

  ```
  mongosh "mongodb://mongodb0.example.com:28015" --tls
  ```

### 连接到特定数据库

要连接到特定数据库，请在中指定数据库 [连接字符串URI路径](https://www.mongodb.com/docs/manual/reference/connection-string/)。如果 未在URI路径中指定数据库，则连接到 `测试` 数据库。

例如，要连接到localhost上名为qa的数据库，请运行以下命令：

```
mongosh "mongodb://localhost:27017/qa"
```

连接到其他服务

如果您已经连接到MongoDBShell中，则可以使用Mongo（）或connect（）方法从MongoDBShell中连接到不同的节点。

若要了解如何使用这些方法连接到其他服务，请参见[打开新连接](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#std-label-mdb-shell-open-new-connections-in-shell)。



## 验证当前连接

若要验证当前的数据库连接，请使用 [`getMongo（）`](https://www.mongodb.com/docs/manual/reference/method/db.getMongo/#mongodb-method-db.getMongo) 方法。

方法返回当前连接的[连接字符串URI](https://www.mongodb.com/docs/manual/reference/connection-string/)

## 断开与服务的连接

要从服务退出连接并退出`mongosh`，请执行以下操作之一 以下操作：

* 输入`.exit`、`exit`或`exit()`。
* 输入 `quit` 或 `quit（）`。
* 按 `Ctrl` + `D组合键`
* 按 `Ctrl` + `C`键两次。

## 局限性

* [Kerberos身份验证](https://www.mongodb.com/docs/manual/core/kerberos/)不允许`authMechanismProperties=CANONICALIZE_HOST_NAME:true|false`在连接字符串中。相反，请使用以下任一方法：
  * `authMechanismProperties=CANONICALIZE_HOST_NAME:forward`
  * `authMechanismProperties=CANONICALIZE_HOST_NAME:forwardAndReverse`
  * `authMechanismProperties=CANONICALIZE_HOST_NAME:none`
* mongosh目前只支持zlib[压缩器](https://www.mongodb.com/docs/manual/core/wiredtiger/#compression)。不支持以下压缩程序：
  * `zstd`
  * `snappy`





翻译：韩鹏帅

原文：[Connect to a Deployment](https://www.mongodb.com/docs/mongodb-shell/connect/#connect-to-a-replica-set)

