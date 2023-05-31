# 使用 API 配置设置

API`config`提供了检查和更新 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)配置的方法。使用`config` API 进行的更新在会话之间持续存在。

>笔记:
>
>API`config`可以在命令行界面中使用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 。它在 [embedded Compass shell。](https://www.mongodb.com/docs/compass/current/embedded-shell/)

## 句法

打印当前[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)配置

```
config
```

返回 的当前值`<property>`：

```
config.get( "<property>" )
```

将当前设置更改`<property>`为`<value>`：

```
config.set( "<property>", <value> )
```

将 a`<property>`重置为默认值：

```
config.reset( "<property>" )
```

### 支持的`property`参数

| Key                      | 类型         | 默认                                                         | 描述                                                         |
| :----------------------- | :----------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `displayBatchSize`       | 整数         | 20                                                           | 每次游标迭代显示的项目数                                     |
| `enableTelemetry`        | 布尔值       | `true`                                                       | 允许将匿名跟踪和诊断数据发送到 MongoDB。                     |
| `editor`                 | string       | `null`                                                       | 指定要在控制台中使用的编辑器[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 。如果已设置，则覆盖`EDITOR`环境变量。 |
| `forceDisableTelemetry`  | 布尔值       | `true`                                                       | 仅在全局配置文件中可用。为真时，用户无法手动启用遥测。       |
| `historyLength`          | 整数         | 1000                                                         | [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)要存储在REPL 历史文件中的项目数。 |
| `inspectCompact`         | 整数或布尔值 | 3个                                                          | [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)在单行上输出的内部元素的级别。短数组元素也被组合在一行中。如果设置为`false`，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)则在其自己的行上输出每个字段。 |
| `inspectDepth`           | 整数或无穷大 | 6个                                                          | 打印对象的深度。设置`inspectDepth` 为`Infinity`（javascript 对象）将所有嵌套对象打印到它们的完整深度。 |
| `redactHistory`          | string       | `remove`                                                     | 控制将哪些信息记录在 shell 历史记录中。必须是以下之一：`keep`: 保留所有历史记录。`remove`：删除包含敏感信息的行。`remove-redact`：编辑敏感信息。 |
| `showStackTraces`        | 布尔值       | `false`                                                      | 控制堆栈跟踪以及错误消息的显示。                             |
| `snippetAutoload`        | 布尔值       | `true`                                                       | 如果`true`，则在启动时自动加载已安装的 [片段](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)。 |
| `snippetIndexSourceURLs` | string       | [MongoDB 存储库](https://compass.mongodb.com/mongosh/snippets-index.bson.br) | [链接到片段注册表的以分号](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)分隔的 URL 列表 。 |
| `snippetRegistryURL`     | string       | [npm 注册表](https://registry.npmjs.org/)                    | [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)安装[snippet](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)的 npm 客户端使用的 npm 注册表[。](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview) |

## 行为

### 从历史记录中删除或编辑敏感信息

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)做出“最大努力”尝试匹配通常对应于某些类型的敏感信息的模式。

有匹配的模式：

- 证书和密钥
- 电子邮件地址
- 通用用户目录
- HTTP(s) 网址
- IP地址
- MongoDB 连接字符串

某些操作，例如[`connect()`](https://www.mongodb.com/docs/manual/reference/method/connect/#mongodb-method-connect), 被认为是天生敏感的。如果`redactHistory`设置为`remove`或 ，包含这些操作的行将[从命令行历史记录](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-command-history)`remove-redact`中删除 。

其他操作，比如[`find()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#mongodb-method-db.collection.find)，有时会有敏感信息，例如电子邮件地址。除非设置为 ，否则shell [历史记录](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-command-history)将保留输入的这些行。`redactHistory``remove-redact`

### 配置文件的行为

使用 API 指定的设置`config`：

- 覆盖[配置文件中指定的设置。](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-global/#std-label-configure-settings-global)
- 坚持重启

>例子:
>
>考虑以下将设置设置为的配置 `inspectDepth`文件`20`：
>
>```shell
>mongosh:
>  inspectDepth: 20
>```
>
>在您的`mongosh`会话期间，您运行以下命令以设置 `inspectDepth`为`10`：
>
>```shell
>config.set( "inspectDepth", 10 )
>```
>
>的值`inspectDepth`变为，即使重新启动 也`10`将保持不变。`10``mongosh`

## 例子

### 更新游标返回的项目数

考虑查看包含大量大型文档的集合。您可以更新`batchSize`以限制游标返回的项目数。

```shell
config.set("displayBatchSize", 3)
```

未来的`db.collection.find()`操作每次游标迭代只会返回 3 个文档。

### 打开堆栈跟踪

启用堆栈跟踪以查看更详细的错误报告。

```shell
config.set("showStackTraces", true)
```

输出不同，如下所示：

```shell
// showStackTraces set to 'false'
Enterprise> db.orders.find( {}, { $thisWontWork: 1 } )
MongoError: FieldPath field names may not start with '$'.
// showStackTraces set to 'true'
Enterprise> db.orders.find( {}, { $thisWontWork: 1 } )
Uncaught:
MongoError: FieldPath field names may not start with '$'.
    at MessageStream.messageHandler (/usr/bin/mongosh:58878:20)
    at MessageStream.emit (events.js:315:20)
    at MessageStream.EventEmitter.emit (domain.js:548:15)
    at processIncomingData (/usr/bin/mongosh:57954:12)
    at MessageStream._write (/usr/bin/mongosh:57850:5)
    at writeOrBuffer (_stream_writable.js:352:12)
    at MessageStream.Writable.write (_stream_writable.js:303:10)
    at Socket.ondata (_stream_readable.js:719:22)
    at Socket.emit (events.js:315:20)
    at Socket.EventEmitter.emit (domain.js:548:15)
```

### `config`从外部调用API

您可以使用with`config`从命令行调用 API 。在这种情况下，该 选项意味着将在不连接到 MongoDB 数据库的情况下进行更新。[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)[`--nodb`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--nodb)[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

>重要的
>
>[`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval) 您必须为表达式和属性使用不同的引号`config`。也就是说，一个是单引号，另一个是双引号。

```shell
mongosh --nodb --eval 'config.set("enableTelemetry", true)'
```

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)返回附加信息以及 API 调用的结果。

```shell
Current Mongosh Log ID:      609583b730e14918fa0d363f
Using MongoDB:               undefined
Using Mongosh Beta:  0.12.1
For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/
Setting "enableTelemetry" has been changed
```

### 编辑敏感信息

`redactHistory`比较设置为 `remove-redact`或时调用的历史记录`remove`。

设置`redactHistory`为`remove-redact`模式并输入包含电子邮件地址的查询。

```shell
config.set( "redactHistory", "remove-redact" )
db.contacts.find( {"email": "customer@clients.com" } )
```

当您按`up arrow`重播上一个命令时，电子邮件地址会被编辑。

```shell
db.contacts.find( {"email": "<email>" } )  // Redacted
```

设置`redactHistory`为`remove`模式并输入包含电子邮件地址的查询。

```shell
config.set( "redactHistory", "remove" )
db.contacts.find( {"email": "customer@clients.com" } )
```

当您按`up arrow`重播上一个命令时，电子邮件地址会出现。

```shell
db.contacts.find( {"email": "customer@clients.com" } )
```

shell[历史](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-command-history)反映了这些变化。（请注意，这会首先存储最近的输入。）

```shell
db.contacts.find( {"email": "customer@clients.com" } )
config.set( "redactHistory", "remove" )
db.contacts.find( {"email": "<email>" } )
config.set( "redactHistory", "remove-redact" )
```

### 将配置设置重置为默认值

如果您修改了配置设置并希望将其重置为默认值，请使用`config.reset( "<property>" )`.

1. 将设置值更改`historyLength`为`2000`：

   ```shell
   config.set("historyLength", 2000)
   ```

2. 验证 的更新值`historyLength`：

   ```shell
   config.get("historyLength")
   ```

3. 将设置重置`historyLength`为默认值`1000`：

   ```shell
   config.reset("historyLength")
   ```

4. 验证 的更新值`historyLength`：

   ```shell
   config.get("historyLength")
   ```

   

翻译：韩鹏帅

原文： [Configure Settings Using the API](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/)
