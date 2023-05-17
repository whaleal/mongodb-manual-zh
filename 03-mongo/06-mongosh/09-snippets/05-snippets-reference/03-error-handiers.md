# 错误处理程序

>警告:
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

错误处理程序允许您指定正则表达式来捕获运行时错误并显示自定义错误消息。

要使用错误匹配器，请将一行添加到您的[package.json](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-prep-package.json)文件中，例如社区片段摘录中突出显示的行[GitHub 存储库。](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/mongocompat/package.json)

```
...
"description": "mongo compatibility script for mongosh",
"main": "index.js",
"errorMatchers": "error-matchers.js",
"license": "SSPL",
...
```

有关错误匹配代码的示例，请参见[mongocompat](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/mongocompat/error-matchers.js) 片段。





翻译：韩鹏帅

原文：[Error Handlers](https://www.mongodb.com/docs/mongodb-shell/snippets/error-handlers/)

