# 在控制台中使用片段

>警告:
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

此页面概述了在 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)控制台中使用片段。

## 安装片段包

您必须先安装一个代码片段包，然后才能使用它。安装片段包后，每次 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)启动时都会加载它。

如果您知道要安装的片段的名称，请输入：

```shell
snippet install <name>
```

否则，搜索存储库以获取可用片段列表。

```
snippet search
```

安装片段后，输入`y`以加载它。

```
 Running install...
 Installed new snippets analyze-schema. Do you want to load them now? [Y/n]: y
 Finished installing snippets: analyze-schema
```

>笔记:
>
>如果这是您第一次使用代码片段，您可能会看到如下警告：
>
>```
>This operation requires downloading a recent release of npm. Do
>you want to proceed? [Y/n]:
>```
>
>您必须安装 npm 才能使用片段。

## 运行片段

在运行新代码段之前，运行`snippet help <SNIPPET NAME>`以了解有关代码段功能的更多信息。

例如，表示您可以通过传递集合名称来`snippet help analyze-schema`使用 the 。`analyze-schema`

```
testDB> snippet help analyze-schema
 # analyze-schema
 Analyze the schema of a collection or a cursor.
```js
> schema(db.coll);
┌─────────┬───────┬───────────┬────────────┐
│ (index) │   0   │     1     │     2      │
├─────────┼───────┼───────────┼────────────┤
│    0    │ '_id' │ '100.0 %' │ 'ObjectID' │
│    1    │ 'a  ' │ '50.0 %'  │  'Number'  │
│    2    │ 'a  ' │ '50.0 %'  │  'String'  │
└─────────┴───────┴───────────┴────────────┘
```

一旦您知道如何调用片段，就可以像下面的示例一样使用它。

考虑`reservations`集合：

```
db.reservations.insertMany( [
   {"_id": 1001, "roomNum": 1, "reserved": true },
   {"_id": 1002, "roomNum": 2, "reserved": true },
   {"_id": 1003, "roomNum": 3, "reserved": "false" },
   {"_id": 1004, "roomNum": 4, "reserved": true },
] )
```

要分析集合，[安装](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/#std-label-snip-install-packages)如果代码 `analyze-schema`片段不存在，则传入集合名称以运行它。

```
snippet install analyze-schema
schema(db.reservations)
```

带有的文档`"_id": 3`被误输入为字符串。分析表明，`reserved`除了预期的布尔值之外，该字段还包含字符串元素。

```
┌─────────┬────────────┬───────────┬───────────┐
│ (index) │     0      │     1     │     2     │
├─────────┼────────────┼───────────┼───────────┤
│    0    │ '_id     ' │ '100.0 %' │ 'Number'  │
│    1    │ 'reserved' │ '75.0 %'  │ 'Boolean' │
│    2    │ 'reserved' │ '25.0 %'  │ 'String'  │
│    3    │ 'roomNum ' │ '100.0 %' │ 'Number'  │
└─────────┴────────────┴───────────┴───────────┘
```

## 卸载片段

使用`snippet uninstall`命令删除片段。如果您不确定名称，该`snippet ls`命令会列出所有已安装的片段。

此代码卸载`analyze-schema`代码段。

```
snippet uninstall analyze-schema
```

## 查找可用的代码段包

该`snippet ls`命令返回本地安装的片段列表以及一些版本和源信息。

```
snippets@ /root/.mongodb/mongosh/snippets
├── mongosh:PRIVATE..DecryptCards@1.0.5
├── mongosh:analyze-schema@1.0.5
└── npm@7.23.0
```

要查看注册表中可用的片段，首先 `refresh`是本地元数据缓存，然后是`search`.

```
snippet refresh
snippet search
```

`snippet search`列出可用的片段、它们的版本，并给出简短的描述。

此实例配置了第二个私有注册表。由于首先列出了私有注册表，因此这些片段在可用片段列表中位于 MongoDB 片段之前。

```
┌─────────┬─────────────────────────────────┬─────────┬────────────────────────────────────────────────────────────────┐
│ (index) │              name               │ version │                          description                           │
├─────────┼─────────────────────────────────┼─────────┼────────────────────────────────────────────────────────────────┤
│    0    │     'PRIVATE..DecryptCards'     │ '1.0.5' │                 'Decrypt credit card numbers'                  │
│    1    │ 'PRIVATE..updateAuthentication' │ '1.0.2' │             'Update user pwds and authentication'              │
│    2    │          'resumetoken'          │ '1.0.2' │                 'Resume token decoder script'                  │
│    3    │          'mongocompat'          │ '1.0.7' │            'mongo compatibility script for mongosh'            │
│    4    │         'spawn-mongod'          │ '1.0.1' │                'Spin up a local mongod process'                │
│    5    │        'mock-collection'        │ '1.0.2' │ 'mockCollection([{ a: 1 }, { a: 2 }]).find({ a: { $gt: 2 } })' │
│    6    │        'analyze-schema'         │ '1.0.5' │                       'schema(db.coll)'                        │
└─────────┴─────────────────────────────────┴─────────┴────────────────────────────────────────────────────────────────┘
```

## 获取存储库信息

显示每个片段存储库的主页和 URL：

```
snippet info
```

输出列出了每个存储库。

```
Snippet repository URL:      https://github.com/YOUR_COMPANY/YOUR_REPO_PATH/index.bson.br
  -->  Homepage:             https://davemungo.github.io/mongosh-snippets/
Snippet repository URL:      https://compass.mongodb.com/mongosh/snippets-index.bson.br
  -->  Homepage:             https://github.com/mongodb-labs/mongosh-snippets
```

## 获取代码片段的帮助

每个片段都是独一无二的，并且有自己的界面。查找有关特定片段如何工作的信息的最佳方法是 `README`通过运行查看其文件`snippet help`：

```
snippet help mongocompat
```

此命令显示`README`文件的[mongocompat](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets/mongocompat) 控制台中的片段[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

````
# mongocompat
Provide `mongo` legacy shell compatibility APIs.
```js
> Array.sum([1, 2, 3])
6
> tojsononeline({a:1,b:2,c:3})
{  "a" : 1,  "b" : 2,  "c" : 3 }
```
````

当您[创建自己的](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-create)代码片段包时，请务必包含一个`README.md`提供有用帮助的文件。





翻译：韩鹏帅

原文：[Use Snippets in the Console](https://www.mongodb.com/docs/mongodb-shell/snippets/working-with-snippets/)