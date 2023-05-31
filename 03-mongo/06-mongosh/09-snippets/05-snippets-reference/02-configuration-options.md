# 配置选项

>警告:
>
>**实验特征**
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 这些选项控制跟踪各个片段包的包管理器之间的交互。有关特定片段如何工作的更多详细信息，请参阅该片段的文档。

要修改代码段配置设置，请使用以下方法：

```
config.set('<OPTION>', '<VALUE>')
```

## 配置选项

| 选项                     | 类型    | 默认                                                         | 描述                                                         |
| :----------------------- | :------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `snippetAutoload`        | boolean | 真的                                                         | 在启动时自动加载已安装的片段。                               |
| `snippetIndexSourceURLs` | list    | [MongoDB 存储库索引文件](https://compass.mongodb.com/mongosh/snippets-index.bson.br) | `;`一个或多个 URL 的分号 ( ) 分隔列表。每个 URL 都链接到有关可用片段的元数据。查看 [多个源 URL 。](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#std-label-snip-multiple-urls)要禁用片段，请取消设置该值。看一个 [例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/configuration/#std-label-snip-ex-disable) |
| `snippetRegistryURL`     | string  | [MongoDB npm 注册表](https://registry.npmjs.org/)            | [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)npm 客户端用于安装片段的npm 注册表 |

[使用config](https://www.mongodb.com/docs/mongodb-shell/reference/configure-shell-settings-api/#std-label-mongosh-config)命令更新配置选项 ，然后重新启动 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以使更新生效。

## 例子

### 添加第二个注册表

通过将 URL 添加到 为敏感代码段配置第二个私有注册表`snippetIndexSourceURLs`。

```
config.set('snippetIndexSourceURLs',
  'https://github.com/YOUR_COMPANY/PATH_TO_YOUR_REGISTRY/index.bson.br;'
  + config.get('snippetIndexSourceURLs')
)
```

重新启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以使更新生效

### 禁用片段

片段功能需要索引源 URL 才能运行。取消设置此值然后重新启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以禁用片段

```
config.set('snippetIndexSourceURLs', '')
```

片段也可以从外部禁用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。如果[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)由于代码段配置损坏而无法启动，请禁用代码段并重新启动[`mongosh`。](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

```
mongosh --nodb --eval 'config.set("snippetIndexSourceURLs", "")'
```





翻译：韩鹏帅

原文：[Configuration Options](https://www.mongodb.com/docs/mongodb-shell/snippets/configuration/)
