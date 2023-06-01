# 注册表和注册表配置

>警告:
>
>**实验特征**
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

本页讨论不同的注册表以及如何配置您的系统以使用它们。

## 注册表配置的类型

片段功能使用 [npm 包管理器](https://www.npmjs.com/package/npm)从预先指定的注册表安装片段。您可以将本地配置 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)为使用一个或多个注册表：

- 这[社区登记处](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets) 由 MongoDB 维护
- 您维护的私有注册表
- 多个注册表一起使用

### 使用 MongoDB 注册表

这是一个公众号，[社区登记处](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets) 由 MongoDB 维护。

社区注册表是默认注册表。它提供了几个有用的片段，可以帮助您入门。社区注册表中的片段也是[好的例子](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets)[当您准备好创建自己的片段](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-create) 时使用。

鼓励 MongoDB 用户为此公共注册表做出贡献。要了解如何与其他 MongoDB 用户共享您的代码，请参阅 [向 MongoDB 社区贡献代码段包。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-contribute-a-package)

### 使用私有代码片段注册表

您可以使用私有注册表在内部共享代码。

如果您的代码片段泄露了专有或敏感信息，您可以将它们存储在私有的本地注册表中，而不是公共注册表中。

要创建私有注册表，请参阅[定义一个新注册表。](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#std-label-snip-define-a-registry)

### 使用多个注册表

私有注册表也可以与社区注册表和其他私有注册表结合使用。使用多个注册表可以让您受益于由 MongoDB 或第三方维护的代码片段，同时还可以保持对您不想与外部共享的代码的控制。

要配置多个注册表，请参阅[连接到注册表。](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#std-label-snip-multiple-urls)

## 如何配置注册表

要使用私有注册表或多个注册表：

- [定义一个新注册表。](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#std-label-snip-define-a-registry)
- 创建[注册表索引文件。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-make-a-registry-index)
- 更新`snippetIndexSourceURLs`以包含指向您的注册表索引文件的链接。
- 更新`snippetRegistryURL`以指向您的注册表主机（可选）。

### 定义新注册表

这[npm 公共注册表](https://registry.npmjs.org/)托管 MongoDB 片段社区注册表。您也可以使用 npm 来托管您自己的公共或私有注册表。

1. 创建 GitHub 存储库。

   您会将片段包从 GitHub 存储库推送到您的 npm 注册表。

   跟着[GitHub 文档](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) 创建存储库。

2. 创建一个 npm 注册表

   跟着[npm 注册表文档](https://docs.npmjs.com/cli/v7/using-npm/registry)创建注册表。

3. 更新`snippetIndexSourceURLs`。

   跟着[npm 注册表文档](https://docs.npmjs.com/cli/v7/using-npm/registry)创建注册表。

4. 更新`snippetIndexSourceURLs`。[![img](https://www.mongodb.com/docs/mongodb-shell/assets/link.svg)](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#update-snippetindexsourceurls)

   要使新注册表可用于本地 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)安装，请更新 `snippetIndexSourceURLs`配置设置。

   ```
   config.set('snippetIndexSourceURLs',
   'https://github.com/YOUR_COMPANY/PATH_TO_YOUR_REPOSITORY/index.bson.br;'
   + config.get('snippetIndexSourceURLs') )
   ```

   ### 连接到注册表

   您可以使用私有注册表来补充或代替社区 MongoDB 注册表。

   `snippetIndexSourceURLs`ia 一个 URL 列表。每个 URL 都定义了一个索引文件的路径，该文件包含该注册表中片段的元数据。

   通过将 URL 添加到 `snippetIndexSourceURLs`.

   ```
   config.set('snippetIndexSourceURLs',
     'https://github.com/YOUR_COMPANY/PATH_TO_YOUR_REPOSITORY/index.bson.br;'
     + config.get('snippetIndexSourceURLs')
   )
   ```

   重新启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以使更新生效。

   >重要的:
   >
   >如果同名的两个片段出现在多个注册表中，则本地系统更新将基于列表中第一个注册表中的条目`snippetIndexSourceURLs`。
   >
   >不要重复使用片段名称以避免潜在的冲突。





翻译：韩鹏帅

原文：[Registries and Registry Configuration](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/)