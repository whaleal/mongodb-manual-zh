## 修改视图

在本页面

[EXAMPLE]() 



要修改视图，你可以:

-  删除并重新创建视图。
-  使用 [`collMod`](https://www.mongodb.com/docs/v6.0/reference/command/collMod/#mongodb-dbcommand-dbcmd.collMod) 命令。

考虑以下名为`lowStock`的视图:

```javascript
db.createView(
   "lowStock",
   "products",
   [ { $match: { quantity: { $lte: 20 } } } ]
)
```



### 删除并重新创建视图

下面的命令通过删除和重新创建视图来修改`lowStock`:

```javascript
db.lowStock.drop()

db.createView(
   "lowStock",
   "products",
   [ { $match: { quantity: { $lte: 10 } } } ]
)
```



### 使用`collMod`命令

可以使用`collMod`命令修改视图:

```javascript
db.runCommand( {
   collMod: "lowStock",
   viewOn: "products",
   "pipeline": [ { $match: { quantity: { $lte: 10 } } } ]
} )
```





原文链接：https://www.mongodb.com/docs/v6.0/core/views/update-view/

译者：杨帅