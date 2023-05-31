## 片段

> 警告：
>
> **实验特征**
>
> 此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
> 预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

## 介绍

A`snippet`是脚本，打包后存放在registry中，方便分享和复用。

您可以[编写自己的脚本](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#std-label-mdb-shell-write-scripts)来 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)操作数据或执行管理任务。片段是对本地存储脚本的改进，因为它们可以轻松共享和维护。

此页面提供了使用片段的高级介绍。每个部分中的链接更深入地介绍了编写、管理和使用片段。

## 成分

代码段功能包含三个主要组件：

- **脚本**是可以与[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)
- **包**是与元数据捆绑在一起的脚本，因此可以更轻松地管理它们。
- **注册表**是可以共享的包的集合。

还有一些内置[命令](https://www.mongodb.com/docs/mongodb-shell/snippets/commands/#std-label-snip-commands)可帮助您使用片段和实用程序脚本来帮助完成 [打包任务。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-make-a-registry-index)

## 开始

开始使用片段的最快方法是尝试[社区登记处](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets) 由 MongoDB 维护。

您还可以创建自己的片段，将它们打包以便于管理，并配置注册表以共享它们。

- **尝试一个现有的片段**。

  [安装](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-install-packages)并[运行](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-run-snippets) 一个片段包[社区登记处](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets)

- **创建您自己的代码段包**。

  [编写](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-write)片段代码和支持文件。然后， [发布](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-publish)代码段包。

- **配置代码片段注册表**。

  使用[社区登记处](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets) 或[配置](https://www.mongodb.com/docs/mongodb-shell/snippets/registries-config/#std-label-snip-registry-config)私有注册表。







翻译：韩鹏帅

原文：[Snippets](https://www.mongodb.com/docs/mongodb-shell/snippets/)