# 在脚本中包含外部文件和模块

>重要的:
>
>Node.js、模块和 [要求（）](https://nodejs.org/api/modules.html#modules_require_id) 函数超出了本教程的范围。要了解更多信息，请参阅[Node.js 文档。](https://nodejs.org/api/modules.html)

要在交互中使用文件和模块`mongosh`，请使用 [要求（）](https://nodejs.org/api/modules.html#modules_require_id) 功能。

在您的`mongosh`脚本中，您可以要求：

- 本地文件
- 内置 Node.js 模块
- 外部 (npm) Node.js 模块

## 需要本地文件

您可以在脚本中使用 JavaScript 文件，`mongosh`而无需任何额外的设置或配置。

>笔记:
>
>`mongosh`不执行用 导入的文件`require()`。相反，`mongosh`将导入文件中的所有内容添加到当前执行范围。

> 例子:
>
> `test.js`要包含位于当前工作目录中的名为的文件，请使用以下命令之一：
>
> ```
> require('./tests.js')
> ```
>
> ```
> var tests = require('./tests.js')
> ```

## 需要内置模块

您可以需要内置的 Node.js 模块（例如 [fs](https://nodejs.org/api/fs.html#fs_file_system))`mongosh` 无需任何额外的设置或配置。

>例子:
>
>以下示例创建并执行一个脚本：
>
>- 连接到在默认端口上运行的本地部署。
>- 使用`myDatabase.employees`示例数据填充集合。
>- 使用该`fs`模块将集合中的文档写入 `myDatabase.employees`名为 `employee.json`.
>
>1. `employee-to-text-file.js`创建一个名为以下内容的文件：
>
>   ```
>   const fs = require('fs');
>   
>   db = connect('mongodb://localhost/myDatabase');
>   
>   db.employees.insertMany( [
>      { "name": "Alice", "department": "engineering" },
>      { "name": "Bob", "department": "sales" },
>      { "name": "Carol", "department": "finance" }
>   ] )
>   
>   const document = db.employees.findOne();
>   
>   fs.writeFileSync('employee.json', JSON.stringify(document));
>   ```
>
>2. 要加载并执行该`employee-to-text-file.js`文件，请从 运行以下命令`mongosh`：
>
>   ```
>   load("employee-to-text-file.js")
>   ```
>
>3. 要确认数据已写入文件，请打开文件 `employee.json`。

## 需要一个 npm 模块

您可以需要 Node.js 模块（例如从 [npm](https://www.npmjs.com/)). 要使用外部模块，您必须安装模块：

- 在全球范围内
- 在`node_modules`当前工作目录的目录中。

>提示:
>
>你可以使用这个结构来 require 远程 npm 模块：
>
>```
>const localRequire = require('module').createRequire(__filename);)
>```
>
>有关示例，请参见 [索引.js](https://github.com/mongodb-labs/mongosh-snippets/blob/main/snippets/resumetoken/index.js) 在片段中`resumetoken`。

>例子:
>
>>重要的:
>>
>>要运行此示例，您必须安装[日期-fns](https://www.npmjs.com/package/date-fns)全局或`node_modules`当前工作目录中的目录中的模块。
>
>以下示例创建并执行一个脚本：
>
>- 连接到在默认端口上运行的本地部署。
>- 使用`myDatabase.cakeSales`示例数据填充集合。
>- 使用[日期-fns](https://www.npmjs.com/package/date-fns) 格式化日期的模块。
>
>1. `date-fns-formatting.js`创建一个名为以下内容的文件：
>
>   ```shell
>   const formatDistance = require('date-fns/formatDistance')
>   
>   db = connect('mongodb://localhost/myDatabase');
>   
>   db.cakeSales.insertMany( [
>      { _id: 0, type: "chocolate", orderDate: new Date("2020-05-18T14:10:30Z"),
>      state: "CA", price: 13, quantity: 120 },
>      { _id: 1, type: "chocolate", orderDate: new Date("2021-03-20T11:30:05Z"),
>      state: "WA", price: 14, quantity: 140 },
>      { _id: 2, type: "vanilla", orderDate: new Date("2021-01-11T06:31:15Z"),
>      state: "CA", price: 12, quantity: 145 },
>      { _id: 3, type: "vanilla", orderDate: new Date("2020-02-08T13:13:23Z"),
>      state: "WA", price: 13, quantity: 104 },
>      { _id: 4, type: "strawberry", orderDate: new Date("2019-05-18T16:09:01Z"),
>      state: "CA", price: 41, quantity: 162 },
>      { _id: 5, type: "strawberry", orderDate: new Date("2019-01-08T06:12:03Z"),
>      state: "WA", price: 43, quantity: 134 }
>   ] )
>   
>   const saleDate0 = db.cakeSales.findOne( { _id: 0 } ).orderDate
>   const saleDate1 = db.cakeSales.findOne( { _id: 1 } ).orderDate
>   
>   const saleDateDistance0 = formatDistance(saleDate0, new Date(), { addSuffix: true })
>   const saleDateDistance1 = formatDistance(saleDate1, new Date(), { addSuffix: true })
>   
>   print("{ _id: 0 } orderDate was " + saleDateDistance0)
>   print("{ _id: 1 } orderDate was " + saleDateDistance1)
>   
>   ```
>
>2. 要加载并执行该`date-fns-formatting.js`文件，请从 运行以下命令`mongosh`：
>
>   ```
>   load("date-fns-formatting.js")
>   ```
>
>   `mongosh`输出类似于以下内容：
>
>   ```
>   { _id: 0 } orderDate was over 1 year ago
>   { _id: 1 } orderDate was 7 months ago
>   ```
>
>   您的输出可能因运行示例的日期而异。





翻译：韩鹏帅

原文：[Include External Files and Modules in Scripts](https://www.mongodb.com/docs/mongodb-shell/write-scripts/require-external-modules/)

