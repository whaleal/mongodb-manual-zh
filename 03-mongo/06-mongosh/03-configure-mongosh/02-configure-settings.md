# 配置设置

要指定某些 shell 行为，您可以配置`mongosh` 设置

## 可配置的设置

您可以配置以下设置`mongosh`：

| Key                      | 类型          | 默认                                                         | 描述                                                         |
| :----------------------- | :------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `displayBatchSize`       | 整数          | 20                                                           | 每次游标迭代显示的项目数                                     |
| `enableTelemetry`        | boolean       | `true`                                                       | 允许将匿名跟踪和诊断数据发送到 MongoDB。                     |
| `editor`                 | string        | `null`                                                       | 指定要在控制台中使用的编辑器`mongosh`。如果已设置，则覆盖`EDITOR`环境变量。 |
| `forceDisableTelemetry`  | boolean       | `true`                                                       | 仅在全局配置文件中可用。为真时，用户无法手动启用遥测。       |
| `historyLength`          | 整数          | 1000                                                         | `mongosh`要存储在REPL 历史文件中的项目数。                   |
| `inspectCompact`         | 整数或boolean | 3个                                                          | `mongosh`在单行上输出的内部元素的级别。短数组元素也被组合在一行中。如果设置为`false`，`mongosh`则在其自己的行上输出每个字段。 |
| `inspectDepth`           | 整数或无穷大  | 6个                                                          | 打印对象的深度。设置`inspectDepth` 为`Infinity`（javascript 对象）将所有嵌套对象打印到它们的完整深度。 |
| `redactHistory`          | string        | `remove`                                                     | 控制将哪些信息记录在 shell 历史记录中。必须是以下之一：`keep`: 保留所有历史记录。`remove`：删除包含敏感信息的行。`remove-redact`：编辑敏感信息。 |
| `showStackTraces`        | boolean       | `false`                                                      | 控制堆栈跟踪以及错误消息的显示。                             |
| `snippetAutoload`        | boolean       | `true`                                                       | 如果`true`，则在启动时自动加载已安装的 片段。                |
| `snippetIndexSourceURLs` | string        | [MongoDB 存储库](https://compass.mongodb.com/mongosh/snippets-index.bson.br) | 链接到片段注册表的以分号分隔的 URL 列表 。                   |
| `snippetRegistryURL`     | string        | [npm 注册表](https://registry.npmjs.org/)                    | `mongosh`安装snippet的 npm 客户端使用的 npm 注册表。         |

## 如何配置设置

要配置`mongosh`设置，您可以使用：

- [配置 API](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-configure-settings-api)
- [全局配置文件](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-global/#std-label-configure-settings-global)







翻译：韩鹏帅

原文： [Configure Settings](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings/)

