## 编写脚本

您可以为修改 MongoDB 中的数据或执行管理操作的MongoDB Shell编写脚本。您可能还想将脚本打包为[片段](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)，以便于分发和管理。

本教程介绍使用MongoDB Shell和 JavaScript 访问 MongoDB。

## 执行 JavaScript 文件

### 从 mongosh 中执行脚本

您可以使用[load()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-load)`.js`方法从MongoDB Shell中执行文件。

#### 文件路径

load [()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-load)方法接受相对和绝对路径。如果MongoDB Shell的当前工作目录 是`/data/db`，并且`connect-and-insert.js`在 目录中，那么MongoDB Shell`/data/db/scripts`中的以下调用 是等效的：

```
load( "scripts/connect-and-insert.js" )
load( "/data/db/scripts/connect-and-insert.js" )
```

#### 例子

以下示例创建并执行一个脚本：

- 连接到在默认端口上运行的本地实例。
- 连接到`myDatabase`数据库。
- 使用`movies`示例文档填充集合。

1. `connect-and-insert.js`创建一个名为以下内容的文件:

   ```
   db = connect( 'mongodb://localhost/myDatabase' );
   
   db.movies.insertMany( [
      {
         title: 'Titanic',
         year: 1997,
         genres: [ 'Drama', 'Romance' ]
      },
      {
         title: 'Spirited Away',
         year: 2001,
         genres: [ 'Animation', 'Adventure', 'Family' ]
      },
      {
         title: 'Casablanca',
         genres: [ 'Drama', 'Romance', 'War' ]
      }
   ] )
   ```

2. 要加载和执行该`connect-and-insert.js`文件，请使用 `mongosh`连接到您的部署并运行以下命令：

   ```
   load( "connect-and-insert.js" )
   ```

3. 要确认文档是否正确加载，请使用 `myDatabase`集合并查询`movies`集合。

   ```
   use myDatabase
   db.movies.find()
   ```

>笔记：
>
>[load()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-load)方法没有搜索路径。如果目标脚本不在当前工作目录或指定的完整路径中，则MongoDB Shell无法访问该文件。

### 从命令行执行脚本

您可以使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)从命令行执行脚本而无需进入[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)控制台。

要指定文件名，请使用`--file`或`-f`参数指定文件名。`--file`除了或参数之外，您可能还需要指定连接信息`-f`。

>提示：
>
>如果不使用参数标志将文件名传递给，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)如果有其他命令行参数，连接可能会失败。
>
>要传递文件名，请始终使用`--file`or `-f`。

例子：

以下示例创建脚本并从命令行运行它们。

- `loadMovies.js`, 使用[`insertMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/#mongodb-method-db.collection.insertMany)更新本地 MongodDB 实例。
- `queryMovies.js`使用[`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)以验证更新。

1. 复制此脚本并将其另存为`loadMovies.js`.

   ```
   db = connect( 'mongodb://localhost/films' );
   
   db.movies.insertMany( [
      {
         title: 'Titanic',
         year: 1997,
         genres: [ 'Drama', 'Romance' ]
      },
      {
         title: 'Spirited Away',
         year: 2001,
         genres: [ 'Animation', 'Adventure', 'Family' ]
      },
      {
         title: 'Casablanca',
         genres: [ 'Drama', 'Romance', 'War' ]
      }
   ] )
   ```

   >提示：
   >
   >验证突出显示行中的连接字符串。如果您的 MongoDB 实例未在 上运行`localhost:27017`，则必须编辑连接字符串。
   >
   >例如，以下连接字符串连接到 `localhost`端口`27500`：
   >
   >```
   >db = connect( 'mongodb://localhost:27500/films' );
   >```

2. 复制此脚本并将其另存为`queryMovies.js`.

   ```
   db = connect( 'mongodb://localhost/films' );
   printjson( db.movies.find( {} ) );
   ```

3. 从命令行运行脚本。

   ```
   mongosh --file loadMovies.js --file queryMovies.js
   ```

4. 验证输出。

   ```
   Loading file: loadMovies.js
   Loading file: queryMovies.js
   [
      {
         _id: ObjectId("616f1b8092dbee425b661117"),
         title: 'Titanic',
         year: 1997,
         genres: [ 'Drama', 'Romance' ]
      },
      {
         _id: ObjectId("616f1b8092dbee425b661118"),
         title: 'Spirited Away',
         year: 2001,
         genres: [ 'Animation', 'Adventure', 'Family' ]
      },
      {
         _id: ObjectId("616f1b8092dbee425b661119"),
         title: 'Casablanca',
         genres: [ 'Drama', 'Romance', 'War' ]
      }
   ]
   ```

   的输出[`db.collection.find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)命令显示`movies`集合已更新。

   >提示：
   >
   >要使输出可见，请使用`printjson()`调用 [`db.collection.find()`.](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)
   >
   >```
   >printjson( db.movies.find( {} ) ) ;
   >```

### 使用身份验证从命令行执行脚本

针对远程执行脚本[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)需要身份验证的实例，除了文件名之外，还要指定连接和身份验证详细信息。

例如：

```
mongosh --host 172.17.0.3 --port 27500 --username filmFan --password superSecret --file loadMovies.js
```

您还可以指定选项的缩写形式：

```
mongosh --host 172.17.0.3 --port 27500 -u filmFan -p superSecret -f loadMovies.js
```

> 提示：
>
> `bash`在和之类的 shell 中`zsh`，如果您以空格开始命令，它将不会保存在您的命令历史记录中。如果您在命令行上输入密码，这可以最大限度地减少暴露。

## 从配置文件执行代码

启动时，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)检查`HOME`目录中是否有名为 .js 的 JavaScript 文件`.mongoshrc.js`。如果找到该文件， 则读取第一次显示提示前[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)的内容。`.mongoshrc.js`

>提示：
>
>**也可以看看：**
>
>- [自定义](https://www.mongodb.com/docs/mongodb-shell/reference/customize-prompt/#std-label-customize-the-mongosh-prompt)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示
>- `.mongoshrc`配置文件

### 执行 JavaScript 代码

要更新[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示以显示行号，请将以下代码添加到`<your-home-directory>/.mongoshrc.js`

```
let cmdCount = 1;
prompt = function() {
             return (cmdCount++) + "> ";
         }
```

提示将如下所示：

```
1> show collections
2> use test
3>
```

### 执行 MongoDB 代码

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要在客户端连接到数据库 时创建日志，请将以下代码添加到`<your-home-directory>/.mongoshrc.js`：

```
db.clientConnections.insertOne( { connectTime: ISODate() } )
```

每次连接到数据库时，MongoDB 服务器都会将如下文档添加到集合中`clientConnections`。

```
{
  _id: ObjectId("61d4bbf0fa4c85f53418070f"),
  connectTime: ISODate("2022-01-04T21:28:16.367Z")
}
```

### 执行 JavaScript 和 MongoDB 代码

当前数据库名称是默认`mongosh`提示的一部分。要重新格式化提示以显示数据库和主机名，请使用如下函数：

```
{
   const hostnameSymbol = Symbol('hostname');
   prompt = () => {
      if (!db[hostnameSymbol])
         db[hostnameSymbol] = db.serverStatus().host;
      return `${db.getName()}@${db[hostnameSymbol]}> `;
   };
}
```

提示将如下所示：

```
admin@centos0722:27502>
```

## 打开新连接

从MongoDB Shell或 JavaScript 文件中，您可以使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)方法：

```
new Mongo()
new Mongo(<host>)
new Mongo(<host:port>)
```

>笔记：
>
>MongoDB Shell不支持 [ClientSideFieldLevelEncryptionOptions](https://www.mongodb.com/docs/manual/reference/method/Mongo/#clientsidefieldlevelencryptionoptions) 文件与[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)方法。

### 连接到本地 MongoDB 实例

考虑在默认端口上的本地主机上运行的 MongoDB 实例。

下面的例子：

- 实例化到实例的新连接，并且
- 将全局`db`变量设置为`myDatabase`使用 [`Mongo.getDB()`](https://www.mongodb.com/docs/manual/reference/method/Mongo.getDB/#mongodb-method-Mongo.getDB)方法。

```
conn = Mongo();
db = conn.getDB("myDatabase");
```

### 连接到实施访问控制的 MongoDB 实例

要连接到实施访问控制的 MongoDB 实例，您必须在[连接字符串。](https://www.mongodb.com/docs/manual/reference/connection-string/)

以下命令连接到一个 MongoDB 实例：

- `localhost`在默认端口上运行，并且
- 安全使用[SCRAM 。](https://www.mongodb.com/docs/manual/core/security-scram/)

```
conn = Mongo("mongodb://<username>:<password>@localhost:27017/<authDB>");
```

>笔记：
>
>MongoDB Shell编辑来自[命令历史记录](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-command-history)和[日志的](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-view-logs)凭据[。](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-view-logs)

### 用于`connect()`连接到 MongoDB 实例

您还可以使用[连接（）](https://www.mongodb.com/docs/manual/reference/method/connect/)方法连接到 MongoDB 实例。

以下命令：

- `localhost`连接到使用非默认端口运行的 MongoDB 实例`27020`，并且
- 设置全局`db`变量。

```
db = connect("localhost:27020/myDatabase");
```

### 连接注意事项

编写脚本时要考虑可移植性和操作环境。

#### 脚本包括连接细节

如果脚本中包含连接详细信息：

- 您不需要在命令行上指定连接信息。
- 您应该使用`--nodb`参数。

考虑一个[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)上运行的实例 `localhost:27500`

以下脚本打印用户数。复制代码并将其另存为`getUserCount.js`.

```
db = connect( "localhost:27500/admin" );˘
printjson( db.system.users.countDocuments() );
```

运行`getUserCount.js`：

```
mongosh --nodb --file getUserCount.js
```

- [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)默认为端口 27170。
- [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)在端口 27500 上运行。
- 该`--nodb`参数指示[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)运行脚本而不先连接到[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)实例。

突出显示的行是正确的，但`getUserCount.js`不会运行，`--nodb`因为[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)无法连接到本地实例。与`--nodb`，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)运行 `getUserCount.js`并使用突出显示的信息进行连接。

#### 脚本不包括连接细节

在脚本中指定连接信息很方便，但这也降低了它的可移植性。该`getUserCount.js`脚本必须更新才能在远程实例上运行或在不同端口上运行。

为了增加可移植性，使用[`db.getSiblingDB()`](https://www.mongodb.com/docs/manual/reference/method/db.getSiblingDB/#mongodb-method-db.getSiblingDB)并在命令行指定连接信息.

下面的脚本比它更便携，`getUserCount.js`因为它没有特定的连接细节。复制代码并将其另存为`portableGetUserCount.js`.

```
db = db.getSiblingDB( "admin" );
printjson( db.system.users.countDocuments() );
```

要运行`portableGetUserCount.js`，请在命令行中指定主机和端口：

```
mongosh --host 172.17.0.3 --port 27500 --file portableGetUserCount.js
```

要`portableGetUserCount.js`在不同的主机或端口上运行，请更改命令行上的连接详细信息。不同的是`getUserCount.js`，您不必编辑脚本即可运行`portableGetUserCount.js`。









翻译：韩鹏帅

原文：[Write Scripts](https://www.mongodb.com/docs/mongodb-shell/write-scripts/)