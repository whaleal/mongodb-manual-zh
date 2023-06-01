# 使用配置文件配置设置

您可以`mongosh`在全局配置文件中指定设置。当您在配置文件中指定设置时，这些设置将在启动时应用。创建配置文件后，文件中的设置将在您下次启动时生效`mongosh`。

## 配置文件格式

配置文件`mongosh`使用 YAML 格式。所有选项都在`mongosh`命名空间下。

### 示例配置文件

以下配置文件集:

- `displayBatchSize`至 50
- `inspectDepth`到 20
- `redactHistory`到`remove-redact`

```
mongosh:
  displayBatchSize: 50
  inspectDepth: 20
  redactHistory: "remove-redact"
```

## 配置文件位置

查找配置文件的文件位置`mongosh`取决于您的操作系统：

| 操作系统 | 文件位置                                                     |
| :------- | :----------------------------------------------------------- |
| Windows  | `mongosh.cfg`，在与二进制文件相同的目录中`mongosh.exe` 。    |
| macOS    | `mongosh`按照列出的顺序在以下目录中查找配置文件：`/usr/local/etc/mongosh.conf``/opt/homebrew/etc/mongosh.conf``/etc/mongosh.conf`一旦`mongosh`读取其中一个目录中的配置文件，列表中的任何剩余目录都不会被检查，并且这些目录中的配置文件将被忽略。 |
| Linux    | `/etc/mongosh.conf`                                          |

## 可配置的设置

`mongosh`您可以在配置文件中指定以下设置：

| 钥匙                     | 类型         | 默认                                                         | 描述                                                         |
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

## `config`API行为

[使用配置 API](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-configure-settings-api)指定的设置[：](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-configure-settings-api)

- 覆盖配置文件中指定的设置。
- 坚持重启。

> 例子:
>
> 考虑以下将设置设置为的配置 `inspectDepth`文件`20`：
>
> ```shell
> mongosh:
>   inspectDepth: 20
> ```
>
> 在您的`mongosh`会话期间，您运行以下命令以设置 `inspectDepth`为`10`：
>
> ```shell
> config.set( "inspectDepth", 10 )
> ```
>
> 的值`inspectDepth`变为，即使重新启动 也`10`将保持不变。`10``mongosh`





翻译：韩鹏帅

原文： [Configure Settings Using a Configuration File](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-global/)