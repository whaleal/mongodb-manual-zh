# 创建和共享片段

>警告:
>
>**实验特征**
>
>此功能是实验性的。MongoDB 不提供对片段的支持。此功能可能随时更改或删除，恕不另行通知。
>
>预计不会出现错误，但是如果您遇到错误，请在 [GitHub 仓库](https://github.com/mongodb-labs/mongosh-snippets/issues) 对于这个项目。

您可以[编写脚本](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#std-label-mdb-shell-write-scripts)来操作数据或在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh). 将脚本打包为片段提供了一种在组织内或跨 MongoDB 用户社区轻松共享脚本的方法。

本页讨论：

- [准备中](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-write)一个片段包。
- [出版](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-publish)片段包到注册表。

有关片段包中的脚本和元数据文件的示例，请参阅[社区摘要注册表](https://github.com/mongodb-labs/mongosh-snippets)在 GitHub 上。

>提示:
>
>如果您打算将您的代码片段提交给[社区登记处](https://github.com/mongodb-labs/mongosh-snippets), 请务必查看中的信息[向 MongoDB 社区贡献一个片段包。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-contribute-a-package)

## 创建代码段包

本节中的步骤侧重于打包脚本。有关编写脚本的更多详细信息，请参阅[编写脚本。](https://www.mongodb.com/docs/mongodb-shell/write-scripts/#std-label-mdb-shell-write-scripts)

### 准备文件

1. 分叉社区存储库

   如果您打算为社区存储库做出贡献，请分叉代码片段[项目库。](https://github.com/mongodb-labs/mongosh-snippets)

   如果您想要创建私有存储库，则不必分叉社区存储库，但您应该在完成以下步骤时手动重新创建类似的目录结构

2. 创建包目录

   在分叉存储库的目录下为您的代码段包创建一个目录`snippets` 。该目录将包含脚本代码和多个元数据文件。

   此示例显示了两个代码段包的目录， `decrypt-cards`以及`update-auth`. 的内容 [社区片段](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets) 为清楚起见，省略了目录。

   ```
   mongo-snippets
   |
   ├── scripts
   │   ├── make-index.js
   │   └── show-index.js
   └── snippets
       ├── analyze-schema
       ├── decrypt-cards
       │   ├── LICENSE-Community.txt
       │   ├── README.md
       │   ├── error-matchers.js
       │   ├── index.js
       │   └── package.json
       ├── mock-collection
       ├── mongocompat
       ├── resumetoken
       ├── spawn-mongod
       └── update-auth
           ├── LICENSE
           ├── README.md
           ├── index.js
           └── package.json
   ```

3. 创建`README.md`

   创建一个`README.md`. 描述`README.md`了如何使用您的代码。当用户输入`snippet help`您的代码段时会显示此文件。

4. 创建`LICENSE`

   创建一个`LICENSE`文件。稍后您将需要输入许可证标识符字符串，因此请尝试从 [SPDX 许可证列表。](https://www.npmjs.com/package/spdx)

5. 创建`index.js`。

   创建一个`index.js`文件。

   - 此文件包含在控制台中公开的代码的入口点[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

   - 该脚本是用 JavaScript 编写的，用于定义您的新功能。

   - 脚本可以在单个文件或多个文件中。

   - 该脚本可以调用其他文件和本地或远程 npm 模块。对于`require()`远程 npm 模块，请使用以下结构：

     ```shell
     const localRequire = require('module').createRequire(__filename);)
     ```

     有关示例，请参见 [索引.js](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/resumetoken/index.js) 在片段中`resumetoken`。

   - `index.js`被引用在[包.json 。](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-prep-package.json)

   - MongoDB 存储库有[示例代码。](https://github.com/mongodb-labs/mongosh-snippets)

   >提示:
   >
   >如果您有现有脚本，请重命名它`index.js`或创建一个`index.js`文件来加载它。`index.js`有关加载其他脚本的文件示例 ，请参见[这个](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/mongocompat/index.js) 在里面[社区资料库。](https://github.com/mongodb-labs/mongosh-snippets)

### 准备`package.json`文件

`package.json`包含包注册表用于管理片段的元数据。

最小`package.json`文件如下所示：

```
{
    "name": "@mongosh/snippet-resumetoken",
    "snippetName": "resumetoken",
    "version": "1.0.2",
    "description": "Resume token decoder script",
    "main": "index.js",
    "license": "Apache-2.0",
    "publishConfig": {
       "access": "public"
    }
}
```

参数是:

| Field           | 描述                                                         |
| :-------------- | :----------------------------------------------------------- |
| "name"          | 包含代码段的 npm 包。                                        |
| "snippetName"   | 片段名称。这是与 等命令一起使用的名称`install`。             |
| "version"       | 包版本。这应该在您更新代码段时增加。                         |
| "description"   | 简要说明您的代码段的作用。注意，如果描述超过 50 或 60 个字符，可能会导致某些 [片段命令出现显示问题。](https://www.mongodb.com/docs/mongodb-shell/snippets/commands/#std-label-snip-commands) |
| "main"          | 这是您的代码的起点，`index.js`. 请注意，其他文件中的函数可以限定范围，以便它们在 shell 中也可用[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。 |
| "license"       | 代码用户的许可证。如果你想为共享注册表做贡献，许可证应该来自 [SPDX牌照清单](https://www.npmjs.com/package/spdx). 另见 [MongoDB 贡献者协议。](https://www.mongodb.com/legal/contributor-agreement) |
| "publishConfig" | 此值用于控制对代码段包的访问。 `public`是典型的，但 npm 提供 [其他选项](https://docs.npmjs.com/cli/v7/using-npm/config) 以及。 |

使用此代码创建框架`package.json`文件。编辑文件并替换每个文件`UPDATE`以插入代码段包的值。

```
{
    "name": "@UPDATE/UPDATE",
    "snippetName": "UPDATE",
    "version": "UPDATE",
    "description": "UPDATE",
    "main": "UPDATE",
    "license": "UPDATE",
    "publishConfig": {
       "access": "UPDATE"
    }
}
```

`package.json`MongoDB GitHub 中有几个文件示例[存储库。](https://github.com/mongodb-labs/mongosh-snippets)

>提示:
>
>MongoDB 使用 npm 作为包注册表。
>
>npm 依赖`package.json`文件来管理包。请参阅[npm 包文档](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)有关的更多信息`package.json`。

## 发布片段

要共享您的代码段，您必须将代码段包发布到注册表。该包裹将包含：

- 你的代码
- `README.md`
- `LICENSE`文件
- [包.json](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/#std-label-snip-prep-package.json)

文件完成后，请按照以下步骤创建和发布您的代码段包。

1. 创建注册表索引文件.

   `index.js`注册表索引文件与包含您的片段代码的文件不同。注册表索引文件 `index.bson.br`包含注册表中片段包的元数据。

   注册表索引文件在上传使用前必须进行压缩。这[制作索引.js](https://github.com/mongodb-labs/mongosh-snippets/blob/main/scripts/make-index.js) 脚本目录中的实用程序会遍历您的代码段源目录，收集创建注册表索引文件所需的信息。创建注册表索引文件后， `make-index.js`脚本还会对其进行压缩。

   跑步[制作索引.js](https://github.com/mongodb-labs/mongosh-snippets/blob/main/scripts/make-index.js) 从`mongo-snippets`目录创建索引。

   ```
   node ./scripts/make-index.js
   ```

   该脚本的输出是 [brotli 压缩](https://github.com/google/brotli/)注册表索引文件，`index.bson.br`.

   您可以使用[显示索引.js](https://github.com/mongodb-labs/mongosh-snippets/blob/main/scripts/show-index.js) 查看压缩的注册表索引文件。

   使用`make-index.js`是创建注册表索引的首选方法，但您也可以[手动创建注册表索引。](https://www.mongodb.com/docs/mongodb-shell/snippets/registry-index/#std-label-snip-manual-reg-index)

2. 提交你的代码片段

   将您的代码段和注册表索引文件提交到您的 GitHub 存储库。

3. 发布更改

4. 将您的更改发布到您的 npm 注册表。

   ```
   npm publish --access public
   ```

## 安装新的片段包

请按照以下步骤安装新的代码片段包：

1. 刷新元数据

   刷新本地[`mongosh`.](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)

   ```
   snippet refresh
   ```

2. 安装代码段

   安装片段.

   ```
   snippet install YOUR_NEW_SNIPPET
   ```

## 向 MongoDB 社区贡献一个代码片段包

如果您编写了可能对其他 MongoDB 用户有用的 代码[片段，我们邀请您将其贡献给](https://www.mongodb.com/docs/mongodb-shell/snippets/#std-label-snip-overview)[社区资料库](https://github.com/mongodb-labs/mongosh-snippets)托管在 GitHub 上。

要将片段提交到共享的 MongoDB 存储库：

1. 完成贡献者协议

   阅读并完成 [MongoDB 贡献者协议。](https://www.mongodb.com/legal/contributor-agreement)

2. 克隆存储库

   分叉并克隆 [片段项目存储库](https://github.com/mongodb-labs/mongosh-snippets) 来自 GitHub。

3. 创建您的包目录

   在下面为您的代码添加一个新目录 [片段/](https://github.com/mongodb-labs/mongosh-snippets/tree/main/snippets). 给它一个描述性的名字。

4. 创建您的包裹

   创建您的代码段包。确保它包含以下文件：

   - `package.json`
   - `index.js`
   - `README.md`
   - `LICENSE`

   您不必创建注册表索引文件。如果您的代码片段包被接受，MongoDB 将更新注册表索引文件。

5. 提交您的更改.

   将更改提交到 GitHub 存储库。

6. 提交您的代码片段。

   针对[片段项目存储库。](https://github.com/mongodb-labs/mongosh-snippets)

MongoDB 将审核您的拉取请求。如果被接受，我们将：

- 将您的代码合并到我们的 GitHub 存储库中。
- 将其发布到 npm 注册表。
- 将其添加到代码段索引中。





翻译：韩鹏帅

原文：[Create and Share Snippets](https://www.mongodb.com/docs/mongodb-shell/snippets/packages/)