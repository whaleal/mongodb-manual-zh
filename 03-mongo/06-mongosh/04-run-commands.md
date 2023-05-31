# 运行命令

要在mongosh中运行命令，必须首先连接到MongoDB服务。

## 切换数据库

要显示正在使用的数据库，请键入`db`：

```bash
db
```

该操作应返回`test`，这是默认数据库。

要切换数据库，请发出use<db>helper，如下例所示：

```
use <database>
```

要访问当前数据库之外的其他数据库而不切换当前数据库上下文，请参见[db.getSiblingDB（）](https://www.mongodb.com/docs/manual/reference/method/db.getSiblingDB/#mongodb-method-db.getSiblingDB)方法。

要列出用户可用的数据库，请使用帮助器show dbs。

### 创建新数据库和集合

要创建新数据库，请<db>对要创建的数据库发出use命令。例如，以下命令使用insertOne（）操作创建数据库myNewDatabase和集合myCollection：

```
use myNewDatabase
db.myCollection.insertOne( { x: 1 } );
```

如果集合不存在，MongoDB将在您 首先存储该集合数据。

## 终止正在运行的命令

要终止[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中正在运行的命令或查询，请按Ctrl + C。

当您输入Ctrl + C时，mongosh：

* 中断活动命令，
* 尝试终止正在进行的服务器端操作，并且
* 返回命令提示符

如果 [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh) 不能干净地终止正在运行的进程， 它发出警告。

> 注：
>
> 在[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中按Ctrl + C不会终止异步代码。异步操作（如setTimeout）或操作（如fs.readFile）将继续运行。
>
> [mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)中没有办法终止异步代码。这与Node.js [REPL](https://nodejs.org/api/repl.html)中的行为相同。

按Ctrl + C一次将不会退出[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，按Ctrl + C两次退出[mongosh](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。

## 命令异常

在命令输出包括{ ok：0 }，mongosh将引发异常，并且不从服务器返回原始输出。

> 注：
>
> 在老版本`mongo shell`中，当命令的输出包括`{ ok：0 }`，则行为因命令而异。`mongosh`通过在这些场景中始终抛出异常来提供一致的行为。

## 清除 `mongosh` 控制台 

cls命令清除控制台。您还可以使用`Ctrl + L`和`console. clear（）`清除控制台。





翻译：韩鹏帅

原文：[Run Commands](https://www.mongodb.com/docs/mongodb-shell/run-commands/)