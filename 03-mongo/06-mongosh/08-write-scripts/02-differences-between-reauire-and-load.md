# `require()`和之间的区别`load()`

和方法在您的脚本中包含文件和模块以增加功能`require()`。`load()`但是，它们的行为和可用性有所不同`require()`。 `load()`

### mongosh 中的脚本类型

您可以将以下类型的脚本与 mongosh 一起使用：

* mongosh 脚本，可以是以下任何一种：

  * [mongoshrc.js](https://www.mongodb.com/docs/mongodb-shell/mongoshrc/#std-label-mongoshrc-js)文件。

  * [使用load()](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-load)方法加载的代码。

* Node.js 脚本，它是用 加载的任何脚本`require()`，包括 npm 包。这些脚本始终是文件。

## 可用性`require()`和`load()`

和方法`require()`的`load()`可用性因您使用的脚本类型而异.

* 在`mongosh`脚本中， 和`require()`都`load()`可用。
* 在 Node.js 脚本中，仅`require()`可用

## `require()`和的文件路径`load()`

脚本的类型决定了您如何使用 `require()`或指定文件路径`load()`。

* 在`mongosh`脚本中：
  * `require()`使用标准 [Node.js模块解析算法](https://nodejs.org/api/modules.html)，从 shell 的当前工作目录开始。
  * `load()`需要：
    * 绝对路径，或
    * 相对路径。使用相对路径时，路径始终被解释为相对于 shell 当前工作目录的路径。
* 在 Node.js 脚本中，`require()`使用标准 [Node.js模块解析算法](https://nodejs.org/api/modules.html)，从被调用的文件开始`require()`。

>提示:
>
>要返回 shell 的当前工作目录，请 从脚本运行[pwd()方法。](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-pwd)
>
>要更改 shell 的工作目录，请在脚本中使用[cd()方法。](https://www.mongodb.com/docs/mongodb-shell/reference/methods/#std-label-mongosh-native-method-cd)

### `mongosh`在脚本中加载外部代码

您可以在脚本文件中加载外部代码`mongosh`，例如 npm 包或单独的`mongosh`脚本。

* `mongosh`要从另一个脚本加载脚本`mongosh`，请使用`__dirname`环境变量。环境`__dirname`变量返回包含正在执行的文件的目录的绝对路径。

  >例子:
  >
  >要加载从另一个 脚本`mongosh`命名的脚本，请将以下行添加到您的脚本中：`test-suite.js``mongosh`
  >
  >```
  >load(__dirname + '/test-suite.js')
  >```

  使用`_dirname`变量指定绝对路径可确保您正在加载的单独脚本不受外部因素（例如从何处`mongosh`开始）的影响。

* 要从`mongosh`脚本加载 Node.js 脚本，请使用 `require()`方法。

  > 例子:
  >
  > 加载[日期-fns](https://www.npmjs.com/package/date-fns) 模块，`mongosh`将以下行`test-suite2.js`添加到您的脚本中：
  >
  > ```
  > const localRequire = require('date-fns').createRequire(__filename);
  > const fileExports = localRequire('./test-suite2.js'); }
  > ```

## 访问`mongosh`API

- `mongosh`脚本可以使用`mongosh`API。
- Node.js 脚本无权访问 API `mongosh`。

例如，`db`全局变量（用于显示当前数据库）在脚本中可用`mongosh`。它在 Node.js 脚本中不可用。

>重要的:
>
>`mongosh`脚本和 Node.js 脚本以不同的方式运行[语境](https://nodejs.org/api/vm.html#vm_what_does_it_mean_to_contextify_an_object). 当在每种类型的脚本中运行相同的命令时，它们可能会表现出不同的行为，例如返回不同的数据类型。`mongosh` 因此，如果您在 Node.js 脚本中运行代码，您可能会观察到意想不到的结果。
>
>通常，您不应在 Node.js 脚本中保留特定于 mongosh 的代码。



翻译：韩鹏帅

原文：[Differences Between `require()` and `load()`](https://www.mongodb.com/docs/mongodb-shell/write-scripts/require-load-differences/)
