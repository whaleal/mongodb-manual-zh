# 脚本注意事项

数据库查询的结果不能在以下上下文中传递：

- 类构造函数
- 非异步生成器函数
- `.sort()`数组回调

要访问数据库调用的结果，请使用[异步函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [异步生成器函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of), 或者`.map()`.

## 构造器

以下构造函数不起作用：

```shell
// This code will fail
class FindResults {
   constructor() {
      this.value = db.students.find();
   }
}
// This code will fail
function listEntries() { return db.students.find(); }
class FindResults {
   constructor() {
      this.value = listEntries();
   }
}
```

改用`async`函数：

```
class FindResults {
   constructor() {
      this.value = ( async() => {
         return db.students.find();
      } )();
   }
}
```

>笔记:
>
>您还可以创建一个在类中执行数据库操作的方法，作为使用异步 JavaScript 的替代方法。
>
>```
>class FindResults {
>   constructor() { }
>
>   init() { this.value = db.students.find(); }
> }
>```
>
>要使用此类，首先构造一个类实例，然后调用 `.init()`方法。

## 生成器函数

以下生成器函数不起作用：

```
// This code will fail
function* FindResults() {
   yield db.students.findMany();
}
// This code will fail
function listEntries() { return db.students.findMany(); }
function* findResults() {
   yield listEntries();
}
```

改为使用`async generator function`：

```
function listEntries() { return db.students.findMany(); }
async function* findResults() {
   yield listEntries();
}
```

## 数组排序

以下数组排序不起作用：

```
// This code will fail
db.getCollectionNames().sort( ( collectionOne, collectionTwo ) => {
  return db[ collectionOne ].estimatedDocumentCount() - db[ collectionOne ].estimatedDocumentCount() )
} );
```

改用`.map()`。

```
db.getCollectionNames().map( collectionName => {
   return { collectionName, size: db[ collectionName ].estimatedDocumentCount() };
} ).sort( ( collectionOne, collectionTwo ) => {
   return collectionOne.size - collectionTwo.size;
} ).map( collection => collection.collectionName);
```

这种数组排序方法通常比等效的不受支持的代码更高效。





翻译：韩鹏帅

原文：[Script Considerations](https://www.mongodb.com/docs/mongodb-shell/write-scripts/considerations/)

