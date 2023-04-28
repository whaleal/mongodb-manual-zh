# 自定义`mongosh`提示

默认情况下，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)提示包括当前数据库名称。您可以修改该`prompt`变量以显示自定义字符串或返回有关`mongosh`会话的动态信息。

退出时不会存储自定义提示[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)。要让自定义提示通过重新启动持续存在，请将自定义提示的代码添加到.mongoshrc.js 。

## 显示行号

要在提示中显示行号[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，请在内部运行以下代码`mongosh`

```shell
let cmdCount = 1;
prompt = function() {
             return (cmdCount++) + "> ";
         }
```

提示将如下所示：

```shell
1> show collections
2> use test
3>
```

## 显示数据库和主机名

当前数据库名称是默认`mongosh`提示的一部分。要重新格式化提示以显示数据库和主机名，请使用如下函数

```shell
{
   const hostnameSymbol = Symbol('hostname');
   prompt = () => {
      if (!db[hostnameSymbol])
         db[hostnameSymbol] = db.serverStatus().host;
      return `${db.getName()}@${db[hostnameSymbol]}> `;
   };
}
```

提示将如下所示:

```shell
admin@centos0722:27502>
```

## 显示系统正常运行时间和文档计数

要创建显示系统正常运行时间和当前数据库中所有集合的文档计数的提示，请使用如下函数：

```shell
prompt = function() {
   return "Uptime:" + db.serverStatus().uptime +
          " Documents:" + db.stats().objects +
          " > ";
   }
```





翻译：韩鹏帅

原文： [Customize the mongosh Prompt](https://www.mongodb.com/docs/mongodb-shell/reference/customize-prompt/)
