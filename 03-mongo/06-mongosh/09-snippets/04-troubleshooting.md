# 故障排除

> 警告:
>
> **实验特征**
>
> 此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
> 预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

以下部分提供故障排除建议。

## 查看`npm`日志文件

如果遇到问题，日志`npm`文件是一个很好的起点。日志文件位置将根据您的`npm` 安装而有所不同。它会是这样的：

```
/<NPM USER HOME>/.npm/_logs/2021-09-16T22_03_34_534Z-debug.log
```

当您找到日志文件时，请检查最近的一个。

## 非特定错误消息

**问题**：[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)当您尝试启动 shell 时返回非特定错误消息。

**解决方案**：禁用代码片段，重新启动[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)以继续调试。

```
mongosh --nodb --eval 'config.set("snippetIndexSourceURLs", "")'
```

## 错误：`Cannot find module`[![img](https://www.mongodb.com/docs/mongodb-shell/assets/link.svg)](https://www.mongodb.com/docs/mongodb-shell/snippets/troubleshooting/#error--cannot-find-module)

**问题**：[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)当您尝试启动 shell 时返回如下错误消息：

```
Error: Cannot find module '/<PATH to USER HOME>/.mongodb/mongosh/snippets/node_modules/@<REGISTRY NAME>/bad-snippet-name'
```

这[npm 日志文件](https://www.mongodb.com/docs/mongodb-shell/snippets/troubleshooting/#std-label-snip-npm-logs)可能有这样的行：

```
36 error code ELSPROBLEMS
37 error missing: @<REGISTRY NAME>/bad-snippet-name@*, required by snippets@
```

**解决方案**：编辑`~/.mongodb/mongosh/snippets/package.json` 文件以删除带有`bad-snippet-name`.

在此示例中，不要忘记也从上面的行中删除结尾的逗号。

```
{
   "dependencies": {
      "@mongosh/snippet-analyze-schema": "^1.0.5",
      "@mongosh/snippet-spawn-mongod": "^1.0.1",
      "npm": "*",
      "@<REGISTRY NAME>/bad-snippet-name": "^1.0.7"
   }
}
```

## 卸载代码段失败

**问题**：卸载失败，但错误消息指向不同的片段。

为了便于阅读，下面的错误消息被重新格式化：

```
Running uninstall...
Uncaught:
Error: Command failed: /usr/bin/mongosh
          /root/.mongodb/mongosh/snippets/node_modules/npm/bin/npm-cli.js
          --no-package-lock
          --ignore-scripts
          --registry=https://registry.npmjs.org uninstall
          --save @mongosh/snippet-mongocompat with exit code 1: \
                 npm ERR! code E404 npm ERR! 404 Not Found
         - GET https://registry.npmjs.org/@<REGISTRY NAME>%2fbad-snippet-name
         - Not found
npm ERR! 404
npm ERR! 404  '@<REGISTRY NAME>/bad-snippet-namen@*' is not in this registry.
```

**解决方案**：编辑`package.json`文件以删除丢失的条目。在此示例中，从上面的行中删除突出显示的行和结尾的逗号。

```
{
   "dependencies": {
      "@mongosh/snippet-analyze-schema": "^1.0.5",
      "@mongosh/snippet-spawn-mongod": "^1.0.1",
      "npm": "*",
      "@<REGISTRY NAME>/bad-snippet-name": "^1.0.7"
   }
}
```







翻译：韩鹏帅

原文：[Troubleshooting](https://www.mongodb.com/docs/mongodb-shell/snippets/troubleshooting/)
