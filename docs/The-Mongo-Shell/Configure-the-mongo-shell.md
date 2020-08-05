
## 配置mongo Shell
**在本页面**<br />

* [自定义提示](#自定义)

* [在mongo shell中使用外部编辑器](#外部编辑器)

* [改变mongo shell(batchSize)](#changeSize)

### <span id="自定义">自定义提示</span>

您可以通过在 `mongo shell` 中设置变量提示来修改提示的内容。 提示变量可以包含字符串以及JavaScript代码。 如果提示符包含返回字符串的函数，则mongo可以在每个提示符中显示动态信息。<br />您可以在`.mongorc.js`文件中添加提示逻辑，以在每次启动mongo shell时设置提示。<br />

#### **自定义提示以显示操作数**  

例如，要使用当前会话中发出的操作数创建mongo shell提示，请在mongo shell中定义以下变量：

```java
cmdCount = 1;
  prompt = function() 
    	return (cmdCount++) + "> ";
}
```

提示将展示类似于以下内容：

```shell
1>
2>
3>
```

#### 自定义提示以显示数据库和主机名

要以`<database> @ <hostname> $`的形式创建`mongo shell`提示，请定义以下变量：<br />

```java
host = db.serverStatus().host;
prompt = function() 
	return db+"@"+host+"$ ";
    }
```

提示将类似于以下内容：

```
test@myHost1$
```

#### 自定义提示以显示时间和文档计数

要创建一个包含系统正常运行时间和当前数据库中文档数的`mongo shell`提示，请在`mongo shell`中定义以下提示变量：

```java
prompt = function(){
	return "Uptime:"+db.serverStatus().uptime+" Documents:"+db.stats().objects+" > "; }
```

提示符将类似于以下内容：

```shell
Uptime:5897 Documents:6 >
```

### <span id="外部编辑器">在mongo shell中使用外部编辑器</span>

您可以通过在启动`mongo shell` 之前设置`EDITOR`环境变量，这样就可以在 `mongo shell`中使用自己的编辑器。

```
export EDITOR=vim
mongo
```

进入`mongo shell`后，您可以通过输入`edit <variable>`或`edit <function>`使用指定的编辑器进行编辑，如以下示例所示：<br />
1.定义一个函数`myFunction`：

```java
function myFunction () { }
```

2.使用编辑器编辑函数：

```shell
edit myFunction
```


该命令将打开`vim`编辑会话。 完成编辑后，保存并退出`vim`编辑会话。<br />
3.在mongo shell中，键入`myFunction`以查看函数定义：


```shell
myFunction
```

展示的是已经保存编辑后的结果:

```java
function myFunction() { 
	print("This was edited");
}
```

> **注意**
>
> **当mongo shell解释在外部编辑器中编辑的代码时，它可能会修改函数中的代码，具体取决于JavaScript编译器。 例如，mongo可以将1 + 1转换为2或删除注释。 实际更改仅影响代码的外观，并且会根据所使用的JavaScript版本而有所不同，但不会影响代码的语义。**

### <span id="changeSize">改变mongo shell(batchSize)</span>

`db.collection.find()`方法是用于从集合中检索文档的JavaScript方法。 `db.collection.find()`方法将游标返回到结果。
 但是，在mongo shell中，如果未使用**var**关键字将返回的游标分配给变量，则该游标会自动迭代最多20次，来打印与查询匹配的前20个文档。 
 mongo shell将提示 输入`it`以使其再次迭代20次。<br />
 您可以设置`DBQuery.shellBatchSize`属性，以更改文档数默认值20，如以下示例中将其设置为10：

```shell
DBQuery.shellBatchSize = 10;
```
