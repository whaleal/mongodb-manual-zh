# MongoDB 2.4中的JavaScript更改 



考虑MongoDB 2.4中[V8 JavaScript引擎](https://www.mongodb.com/docs/upcoming/release-notes/2.4/#std-label-2.4-release-javascript-change)的以下影响:

> 在中使用新的`interpreterVersion（）`方法 `mongo` shell和[`javascript引擎`](https://www.mongodb.com/docs/upcoming/reference/command/buildInfo/#mongodb-data-buildInfo.javascriptEngine) db.serverBuildInfo（）输出中的字段[`，`](https://www.mongodb.com/docs/upcoming/reference/method/db.serverBuildInfo/#mongodb-method-db.serverBuildInfo)以确定 MongoDB二进制文件使用的JavaScript引擎。

### 改进的并发性

以前，需要JavaScript解释器的MongoDB操作 had to acquire a lock, and a single [`mongod`](https://www.mongodb.com/docs/upcoming/reference/program/mongod/#mongodb-binary-bin.mongod) could only run a 一次执行一个JavaScript操作。换用V8发动机后 并发性，方法是允许多个JavaScript操作在 同一时间。

### 现代化的JavaScript实现（ES5）

第5版[ECMA脚本](http://www.ecma-international.org/publications/standards/Ecma-262.htm)， 缩写为ES5，添加了许多新的语言功能，包括：

* 标准化[JSON](http://www.ecma-international.org/ecma-262/5.1/#sec-15.12.1)
* [严格模式](http://www.ecma-international.org/ecma-262/5.1/#sec-4.2.2)，
* [函数绑定（）](http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.5)，
* [阵列扩展](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16)，以及
* 吸气剂和设置剂

在V8中，MongoDB支持JavaScript的ES5实现，并带有 以下例外。

>下列功能在文档上无法按预期工作 **从MongoDB查询返回**：
>
>- `seal（）`在从返回的文档上引发异常 MongoDB查询。
>- `Object.freeze()` throws an exception on documents returned from MongoDB查询。
>- `对象。preventExtensions（）`错误地允许添加 MongoDB查询返回的文档的新属性。
>- `可枚举`属性，添加到返回的文档时 MongoDB查询在写操作期间不保存。
>
>参见[服务器-8216](https://jira.mongodb.org/browse/SERVER-8216)
>
>、[服务器-8223](https://jira.mongodb.org/browse/SERVER-8223)、 [SERVER-8215](https://jira.mongodb.org/browse/SERVER-8215)和[SERVER-8214](https://jira.mongodb.org/browse/SERVER-8214)
>
>以了解详细信息。
>
>对于尚未从MongoDB查询返回的对象， 功能按预期工作。

### 已删除非标准SpiderMonkey功能

V8**不**支持以下*非标准*[SpiderMonkey](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey)

 JavaScript 扩展，以前MongoDB使用SpiderMonkey作为 它JavaScript引擎。

#### E4X延伸导线

V8不支持*非标准*[E4X](https://developer.mozilla.org/en-US/docs/Archive/Web/E4X)

扩展。E4X型 提供本机[XML](https://developer.mozilla.org/en-US/docs/E4X/Processing_XML_with_E4X)

对象添加到JavaScript语言并添加用于嵌入的语法 JavaScript代码中的文本XML文档。

如果使用了任何 以下构造函数/方法：

- `可扩展标记语言（）`
- `命名空间（）`
- `Q名称（）`
- `XML列表（）`
- `是XML名称（）`

#### 解构转让

V8不支持非标准的结构化赋值。 重构赋值"从数组或对象中提取数据 一种反映数组和对象文字构造的语法。"-- [Mozilla文档](https://developer.mozilla.org/en-US/docs/JavaScript/New_in_JavaScript/1.7#Destructuring_assignment_(Merge_into_own_page.2Fsection))

##### 示例

下面的重构赋值为**残废的**带V8和 抛出一个`语法错误`：

```
original = [4, 8, 15];
var [b, ,c] = a;  // <== destructuring assignment
print(b) // 4
print(c) // 15
```

#### `Iterator()`、`StopIteration()`和生成器

V8不支持[Iterator（）、StopIteration（）和生成器](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Iterators_and_Generators)。

#### `InternalError()`

V8不支持`InternalError()`）。改为使用`Error()`。

#### `for each...in`构建

V8 不支持使用[对于每个...在](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Statements/for_each...in)建造。改为`for (var x in y)`构造。

##### 示例

以下内容`对于每个（y中的变量x）`构造是**残废的** 带V8：

``` shell
var o = { name: 'MongoDB', version: 2.4 };

for each (var value in o) {
  print(value);
}
```

相反，在2.4版本中，您可以使用 `for (var x in y)`构造:

```shell
var o = { name: 'MongoDB', version: 2.4 };

for (var prop in o) {
  var value = o[prop];
  print(value);
}
```

您还可以将数组*实例*方法`forEach()`与ES5方法`Object.keys()`一起使用：

```shell
Object.keys(o).forEach(function (key) {
  var value = o[key];
  print(value);
});
```

#### 数组理解

V8不支持[数组理解](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Predefined_Core_Objects#Array_comprehensions)。

使用其他方法，如`Array`实例方法`map()`）、`filter()`或`forEach()`）。

##### 示例：

使用V8，以下数组理解**无效**：

````
var a = { w: 1, x: 2, y: 3, z: 4 }

var arr = [i * i for each (i in a) if (i > 2)]
printjson(arr)
````

相反，您可以使用`Array`*实例*方法`forEach()`和ES5方法`Object.keys()`实现：

```
var a = { w: 1, x: 2, y: 3, z: 4 }

var arr = [];
Object.keys(a).forEach(function (key) {
  var val = a[key];
  if (val > 2) arr.push(val * val);
})
printjson(arr)
```

> 笔记
>
> 新逻辑使用`Array`*实例*方法`forEach()`，而不是*通用*方法`Array.forEach()`V8**不**支持`Array`方法。看[阵列通用方法](https://www.mongodb.com/docs/upcoming/release-notes/2.4-javascript/#std-label-array-generics)获取更多信息。

#### 多个捕获块

V8不支持多个`catch`块，并将抛出一个`SyntaxError`。

##### 示例:

以下多个捕获块对V8**无效**，并将抛出`"SyntaxError: Unexpected token if"`：

```
try {
  something()
} catch (err if err instanceof SomeError) {
  print('some error')
} catch (err) {
  print('standard error')
}
```

#### 条件函数定义

V8将产生与SpiderMonkey不同的结果[条件函数定义](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Functions)。

##### 示例：

以下条件函数定义在SpiderMonkey和V8中产生了不同的结果：

```
function test () {
   if (false) {
      function go () {};
   }
   print(typeof go)
}
```

使用SpiderMonkey，条件函数输出sundefined，而使用V8，条件函数输出`function`。

如果您的代码以这种方式定义函数，强烈建议您重构代码。以下示例将条件函数定义重构为在SpiderMonkey和V8中都有效。

```
function test () {
  var go;
  if (false) {
    go = function () {}
  }
  print(typeof go)
}
```

重构的代码输出在SpiderMonkey和V8中都没有`undefined`。

>笔记：
>
>ECMAscript禁止条件函数定义。要强制V8抛出`Error`，[启用严格模式](http://www.nczonline.net/blog/2012/03/13/its-time-to-start-using-javascript-strict-mode/)。
>
>```
>function test () {
>  'use strict';
>
>  if (false) {
>    function go () {}
>  }
>}
>```
>
>JavaScript代码抛出以下语法错误：
>
>```
>SyntaxError: In strict mode code, functions can only be declared at top level or immediately within another function.
>```

#### 字符串通用方法

V8不支持[字符串泛型](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String#String_generic_methods)。字符串泛型是`String`类上镜像实例方法的一组方法。

##### 示例：

通用方法`String.toLowerCase()`的以下使用对V8**无效**

```
var name = 'MongoDB';

var lower = String.toLowerCase(name);
```

使用V8，请使用`String`实例方法`toLowerCase()`，通过`String`类的*实例*提供：

```
var name = 'MongoDB';

var lower = name.toLowerCase();
print(name + ' becomes ' + lower);
```

使用V8，使用`String`*实例*方法，而不是以下*通用*方法：

|                          |                       |                              |
| :----------------------- | :-------------------- | :--------------------------- |
| `String.charAt()`        | `String.quote()`      | `String.toLocaleLowerCase()` |
| `String.charCodeAt()`    | `String.replace()`    | `String.toLocaleUpperCase()` |
| `String.concat()`        | `String.search()`     | `String.toLowerCase()`       |
| `String.endsWith()`      | `String.slice()`      | `String.toUpperCase()`       |
| `String.indexOf()`       | `String.split()`      | `String.trim()`              |
| `String.lastIndexOf()`   | `String.startsWith()` | `String.trimLeft()`          |
| `String.localeCompare()` | `String.substr()`     | `String.trimRight()`         |
| `String.match()`         | `String.substring()`  |                              |

### 阵列通用方法

V8不支持[数组通用方法](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array#Array_generic_methods)。数组泛型是`Array`类上镜像实例方法的一组方法。

##### 示例：

通用方法`Array.every()`的以下使用对V8**无效**：

```
var arr = [4, 8, 15, 16, 23, 42];

function isEven (val) {
   return 0 === val % 2;
}

var allEven = Array.every(arr, isEven);
print(allEven);
```

使用V8，请使用通过`Array`类*实例*可用的`Array`实例方法`every()`：

```
var allEven = arr.every(isEven);
print(allEven);
```

使用V8，使用`Array`*实例*方法，而不是以下*通用*方法：

|                   |                       |                   |
| :---------------- | :-------------------- | :---------------- |
| `Array.concat()`  | `Array.lastIndexOf()` | `Array.slice()`   |
| `Array.every()`   | `Array.map()`         | `Array.some()`    |
| `Array.filter()`  | `Array.pop()`         | `Array.sort()`    |
| `Array.forEach()` | `Array.push()`        | `Array.splice()`  |
| `Array.indexOf()` | `Array.reverse()`     | `Array.unshift()` |
| `Array.join()`    | `Array.shift()`       |                   |

### 数组实例方法`toSource()`

V8不支持`Array`实例方法[toSource（）](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/toSource)。改用`Array`实例方法`toString()`。

### `uneval()`

V8不支持非标准方法`uneval()`。使用标准化的[JSON.stringify()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/JSON/stringify)相反，方法。





译者：韩鹏帅
 参见

原文 - [JavaScript Changes in MongoDB 2.4]( https://docs.mongodb.com/manual/release-notes/2.4-javascript/ )

