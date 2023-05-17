# 检索 Shell 日志

MongoDB 外壳使用[ndjson](http://ndjson.org/)存储会话日志。从版本 1.0.5 开始， 更新MongoDB Shell[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)日志格式以匹配 MongoDB 服务器日志格式。有关详细信息，请参阅[记录消息。](https://www.mongodb.com/docs/manual/reference/log-messages/#std-label-log-messages-ref)

您可以根据日志 ID查看或跟踪MongoDB Shell会话的日志.

>笔记:
>
>MongoDB Shell编辑来自[命令历史](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-command-history)和[日志。](https://www.mongodb.com/docs/mongodb-shell/logs/#std-label-mdb-shell-view-logs)

## 查看MongoDB Shell日志

1. 查找您的日志 ID。

   >例子:
   >
   >每次打开 shell 时，MongoDB Shell都会显示日志 ID。
   >
   >```shell
   >$ mongosh
   >Current Mongosh Log ID: c2961dbd6b73b052671d9df0
   >Connecting to: mongodb://127.0.0.1:27017
   >Using MongoDB: 4.2.8
   >Using Mongosh: 1.8.0
   >```

2. 查看会话日志

   **macOS和linux**

   MongoDB Shell将每个会话的日志保存到您的用户 `.mongodb/mongosh`目录：

   ```
   ~/.mongodb/mongosh/<LogID>_log
   ```

   运行以下命令以查看会话日志：

   ```
   cat ~/.mongodb/mongosh/<LogID>_log
   ```

   运行以下命令来跟踪会话的日志：

   ```
   tail -f ~/.mongodb/mongosh/<LogID>_log
   ```

   **Windows**

   MongoDB Shell将每个会话的日志保存到您的用户 

   `C:\Users\<username>\AppData\Local\`目录：

   ```
   %UserProfile%/AppData/Local/mongodb/mongosh/<LogID>_log
   ```

   运行以下 PowerShell 命令以查看会话日志：

   ```
   Get-Content %UserProfile%/AppData/Local/mongodb/mongosh/<LogID>_log
   ```

   运行以下 PowerShell 命令以跟踪会话的日志：

   ```
   Get-Content %UserProfile%/AppData/Local/mongodb/mongosh/<LogID>_log
   ```

## 查看MongoDB Shell命令历史记录

MongoDB Shell保存您跨会话运行的所有命令的历史记录。发出新命令时，会将其添加到历史文件的开头。

在文本编辑器中打开以下文件以查看MongoDB Shell命令历史记录：

| 操作系统       | 历史文件路径                                           |
| :------------- | :----------------------------------------------------- |
| macOS 和 Linux | `~/.mongodb/mongosh/.mongosh_repl_history`             |
| Windows        | `%UserProfile%/.mongodb/mongosh/.mongosh_repl_history` |

## 日志保留

`mongosh`保留日志文件 30 天。超过 30 天的日志文件将被自动删除。







翻译：韩鹏帅

原文：[Retrieve Shell Logs](https://www.mongodb.com/docs/mongodb-shell/logs/)