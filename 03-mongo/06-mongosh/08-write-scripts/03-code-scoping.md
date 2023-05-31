# 代码范围

当 JavaScript 加载到 时，用、和[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)定义的顶级函数和变量 被添加到全局范围。`const``var``let`

考虑以下代码：

```shell
const SNIPPET_VERSION = "4.3.2";
var loadedFlag = true;
let unloaded = false;

function isSnippetLoaded(loadedFlag) {
   return ( loadedFlag ? "Snippet is loaded" : "Snippet is not loaded" )
}
```

变量 、`SNIPPET_VERSION`和`loadedFlag`与`unloaded` 函数 一起添加到全局范围 `isSnippetLoaded()`。

为避免与其他代码中定义的函数和变量发生冲突，请务必在编写脚本时考虑作用域。作为最佳实践，MongoDB 建议包装您的代码以限制范围。这可以防止在全局范围内与名称相似的元素发生意外范围冲突。

将函数和变量保持在全局范围之外的一种方法是像这样包装您的代码：

```
'use strict';
(() => {
   ...
})()
```

>提示:
>
>```shell
>use strict;用于脚本。如果你直接进入控制台， use strict; 会切换到一个名为.mongoshmongoshstrict
>```

## 示例：限制范围

比较以下代码示例。它们非常相似，但第二个是以限制变量范围的方式编写的。

示例 1：不受限制的范围。

```shell
let averageGrossSales = [ 10000, 15000, 9000, 22000 ];

const Q1_DISCOUNT = .10;
const Q2_DISCOUNT = .15;
const Q3_DISCOUNT = .06;
const Q4_DISCOUNT = .23;

function quarterlySales(grossAmount, discount ) {
   return grossAmount * discount ;
}

function yearlySales() {
   let annualTotal = 0;

   annualTotal += quarterlySales(averageGrossSales[0], Q1_DISCOUNT );
   annualTotal += quarterlySales(averageGrossSales[1], Q2_DISCOUNT );
   annualTotal += quarterlySales(averageGrossSales[2], Q3_DISCOUNT );
   annualTotal += quarterlySales(averageGrossSales[3], Q4_DISCOUNT );

   return annualTotal ;
}
```

示例 2：限制范围。

```
(() => {

   let averageGrossSales = [ 10000, 15000, 9000, 22000 ];

   const Q1_DISCOUNT = .10;
   const Q2_DISCOUNT = .15;
   const Q3_DISCOUNT = .06;
   const Q4_DISCOUNT = .23;

   function quarterlySales(grossAmount, discount ) {
      return grossAmount * discount ;
   }

   globalThis.exposedYearlySales = function yearlySales() {
      let annualTotal = 0;

      annualTotal += quarterlySales(averageGrossSales[0], Q1_DISCOUNT );
      annualTotal += quarterlySales(averageGrossSales[1], Q2_DISCOUNT );
      annualTotal += quarterlySales(averageGrossSales[2], Q3_DISCOUNT );
      annualTotal += quarterlySales(averageGrossSales[3], Q4_DISCOUNT );

      return annualTotal ;
   }
} )()
```

在示例 2 中，以下元素都在匿名函数范围内，并且都被排除在全局范围之外：

- 主要功能，`yearlySales()`
- 辅助功能，`quarterlySales()`
- 变量

`globalThis.exposedYearlySales = function yearlySales()` 赋值语句添加到`exposedYearlySales`全局范围。

当你调用`exposedYearlySales()`它时调用函数`yearlySales()` 。该`yearlySales()`函数不能直接访问。





翻译：韩鹏帅

原文：[Code Scoping](https://www.mongodb.com/docs/mongodb-shell/write-scripts/scoping/)
