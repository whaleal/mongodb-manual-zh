# 片段命令

> 警告:
>
> 此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
> 预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

本文档概述了可用于[片段的命令。](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)

## 命令

| 命令        | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| `help`      | 显示有关特定片段的帮助文本或信息。看一个[例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-get-help)`snippet helpsnippet help <snippet-name>` |
| `info`      | 显示有关配置的片段存储库的信息。看一个 [例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-get-repo-info)`snippet info` |
| `install`   | 安装一个新的片段。看一个[例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-install-packages)`snippet install <snippet-name>` |
| `ls`        | 列出已安装片段的名称和版本。看一个 [例子](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-ex-ls)`snippet ls` |
| `load-all`  | 将所有已安装的片段加载到当前环境中。`snippet load-all`       |
| `outdated`  | 列出已更新注册表版本的片段。`snippet outdated`               |
| `refresh`   | 清除并刷新片段元数据缓存。看一个 [例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-ex-find-available)`snippet refresh` |
| `search`    | 列出可用的片段、它们的版本和简短描述。看一个[例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-ex-find-available)`snippet search` |
| `uninstall` | 删除已安装的片段。看一个[例子。](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-uninstall)`snippet uninstall <snippet-name>` |
| `update`    | 获取最新版本的已安装片段`snippet update`                     |





翻译：韩鹏帅

原文：[Snippet Commands](https://www.mongodb.com/docs/mongodb-shell/snippets/commands/)

