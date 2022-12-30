**模型货币数据**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#model-monetary-data)

**概述**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#overview)

处理货币数据的应用程序通常需要能够捕获货币的小数单位，并且需要在执行算术时以精确的精度模拟小数舍入。许多现代系统使用的基于二进制的浮点运算（即 float、double）无法表示精确的小数，并且需要某种程度的近似值，因此不适用于货币运算。在对货币数据建模时，此约束是一个重要的考虑因素。

有几种方法可以使用数字和非数字模型在 MongoDB 中对货币数据进行建模。

**数值模型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#numeric-model)

如果您需要查询数据库以获得精确的、数学上有效的匹配项或需要执行服务器端算术，例如 [`$inc`](https://www.mongodb.com/docs/manual/reference/operator/update/inc/#mongodb-update-up.-inc)、[`$mul`](https://www.mongodb.com/docs/manual/reference/operator/update/mul/#mongodb-update-up.-mul) 和[聚合管道算术](https://www.mongodb.com/docs/manual/meta/aggregation-quick-reference/#std-label-agg-quick-ref-operator-arithmetic)，则数字模型可能是合适的。]

**以下方法遵循数值模型：**

- [使用十进制 BSON 类型](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-decimal)这是一种基于十进制的浮点格式，能够提供精确的精度。在 MongoDB 版本 3.4 及更高版本中可用。
- [使用比例因子](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-scale-factor)`long`通过乘以 10 比例因子的幂将货币值转换为 64 位整数（ BSON 类型）。

**非数字模型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#non-numeric-model)

如果不需要对货币数据执行服务器端算法，或者如果服务器端近似值就足够了，则使用非数字模型对货币数据建模可能是合适的。

**以下方法遵循非数字模型：**

- [使用两个字段作为货币价值](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-monetary-value-non-numeric)：一个字段将确切的货币值存储为非数字`string`，另一个字段存储该值的基于二进制的浮点（`double`BSON 类型）近似值。

>[NOTE]
>
>本页提到的算术是指由[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)or[`mongos`](https://www.mongodb.com/docs/manual/reference/program/mongos/#mongodb-binary-bin.mongos)执行的服务器端算术，而不是客户端算术。

**数值模型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#numeric-model-1)

**使用十进制 BSON 类型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#using-the-decimal-bson-type)

`decimal128` [BSON 类型](https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-bson-types)使用 IEEE 754 基于十进制的`decimal128`浮点编号格式。与基于二进制的浮点格式（如`double`BSON 类型）不同， `decimal128`它不近似十进制值，并且能够提供处理货币数据所需的精确精度。

在[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，使用构造函数`decimal`分配和查询值。`Decimal128()`以下示例将包含汽油价格的文档添加到`gasprices`集合中：

```shell
db.gasprices.insertOne(
   {
      "date" : ISODate(),
      "price" : Decimal128("2.099"),
      "station" : "Quikstop",
      "grade" : "regular"
   }
)
```

以下查询与上面的文档匹配：

```shell
db.gasprices.find( { price: Decimal128("2.099") } )
```

有关`decimal`类型的更多信息，请参见 [十进制 128 。](https://www.mongodb.com/docs/mongodb-shell/reference/data-types/#std-label-shell-type-decimal)

**将值转换为十进制**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#converting-values-to-decimal)

`decimal`通过执行一次性转换或通过修改应用程序逻辑以在访问记录时执行转换，可以将集合的值转换为类型。

>[TIP]
>
>除了下面概述的过程，从 4.0 版开始，您可以使用[`$convert`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/convert/#mongodb-expression-exp.-convert)及其辅助 [`$toDecimal`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/toDecimal/#mongodb-expression-exp.-toDecimal)运算符将值转换为`Decimal128()`.

**一次性集合转换**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#one-time-collection-transformation)

可以通过遍历集合中的所有文档、将货币值转换为`decimal`类型并将文档写回集合来转换集合。

>[NOTE]
>
>强烈建议将该`decimal`值作为新字段添加到文档中，并在验证新字段的值后删除旧字段。

>[WARNING]
>
>请务必`decimal`在隔离的测试环境中测试转换。使用 MongoDB 3.4 版创建或修改数据文件后，它们将不再与以前的版本兼容，并且不支持降级包含小数的数据文件。

**比例因子变换：**

考虑以下使用的集合 [比例因子](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-scale-factor)方法并将货币值保存为表示美分数的 64 位整数：

```json
{ "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : NumberLong("1999") },
{ "_id" : 2, "description" : "Jeans", "size" : "36", "price" : NumberLong("3999") },
{ "_id" : 3, "description" : "Shorts", "size" : "32", "price" : NumberLong("2999") },
{ "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : NumberLong("2495") },
{ "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : NumberLong("8000") }
```

通过使用 [`$multiply`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/multiply/#mongodb-expression-exp.-multiply) 运算符将 `price `和 `NumberDecimal("0.01")` 相乘，可以将 `long` 值转换为适当格式的十进制值。 以下聚合管道将转换后的值分配给 [`$addFields`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields) 阶段中的新 `priceDec` 字段：

```shell
db.clothes.aggregate(
  [
    { $match: { price: { $type: "long" }, priceDec: { $exists: 0 } } },
    {
      $addFields: {
        priceDec: {
          $multiply: [ "$price", NumberDecimal( "0.01" ) ]
        }
      }
    }
  ]
).forEach( ( function( doc ) {
  db.clothes.save( doc );
} ) )
```

可以使用 `db.clothes.find()`查询来验证聚合管道的结果：

```json
{ "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : NumberLong(1999), "priceDec" : NumberDecimal("19.99") }
{ "_id" : 2, "description" : "Jeans", "size" : "36", "price" : NumberLong(3999), "priceDec" : NumberDecimal("39.99") }
{ "_id" : 3, "description" : "Shorts", "size" : "32", "price" : NumberLong(2999), "priceDec" : NumberDecimal("29.99") }
{ "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : NumberLong(2495), "priceDec" : NumberDecimal("24.95") }
{ "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : NumberLong(8000), "priceDec" : NumberDecimal("80.00") }
```

如果您不想添加具有该`decimal`值的新字段，可以覆盖原始字段。以下 [`updateMany()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany)方法首先检查是否`price` 存在并且它是 a `long`，然后将`long`值转换为 `decimal`并将其存储在`price`字段中：

```shell
db.clothes.updateMany(
  { price: { $type: "long" } },
  { $mul: { price: NumberDecimal( "0.01" ) } }
)
```

可以使用`db.clothes.find()`查询来验证结果：

```json
{ "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : NumberDecimal("19.99") }
{ "_id" : 2, "description" : "Jeans", "size" : "36", "price" : NumberDecimal("39.99") }
{ "_id" : 3, "description" : "Shorts", "size" : "32", "price" : NumberDecimal("29.99") }
{ "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : NumberDecimal("24.95") }
{ "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : NumberDecimal("80.00") }
```

**非数值转换：**

考虑以下使用的集合 [非数字的](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-monetary-value-non-numeric) 模型并将货币价值保存为`string`具有价值的精确表示：

```json
{ "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : "19.99" }
{ "_id" : 2, "description" : "Jeans", "size" : "36", "price" : "39.99" }
{ "_id" : 3, "description" : "Shorts", "size" : "32", "price" : "29.99" }
{ "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : "24.95" }
{ "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : "80.00" }
```

以下函数首先检查是否`price`存在并且它是一个`string`，然后将`string`值转换为一个`decimal` 值并将其存储在`priceDec`字段中：

```shell
db.clothes.find( { $and : [ { price: { $exists: true } }, { price: { $type: "string" } } ] } ).forEach( function( doc ) {
  doc.priceDec = NumberDecimal( doc.price );
  db.clothes.save( doc );
} );
```

该函数不会向命令行输出任何内容。可以使用`db.clothes.find()`查询来验证结果：

```json
{ "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : "19.99", "priceDec" : NumberDecimal("19.99") }
{ "_id" : 2, "description" : "Jeans", "size" : "36", "price" : "39.99", "priceDec" : NumberDecimal("39.99") }
{ "_id" : 3, "description" : "Shorts", "size" : "32", "price" : "29.99", "priceDec" : NumberDecimal("29.99") }
{ "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : "24.95", "priceDec" : NumberDecimal("24.95") }
{ "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : "80.00", "priceDec" : NumberDecimal("80.00") }
```

##### 应用逻辑转换[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#application-logic-transformation)

`decimal` 可以从应用程序逻辑中执行到类型的转换。在这种情况下，应用程序被修改为在访问记录时执行转换。

典型的应用逻辑如下：

- 测试新字段是否存在并且它是`decimal`类型
- 如果新`decimal`字段不存在：
  - 通过正确转换旧字段值来创建它
  - 删除旧字段
  - 保留转换后的记录

**使用比例因子**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#using-a-scale-factor)

>[NOTE]
>
>如果您使用的是 MongoDB 3.4 或更高版本，请使用 [十进制](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-decimal)货币数据建模类型优于 [比例因子](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-scale-factor)方法。

要使用比例因子方法对货币数据建模：

1. 确定货币价值所需的最大精度。例如，您的应用程序可能需要精确到十分之一美分的货币价值`USD`。
2. 通过将值乘以 10 的幂将货币值转换为整数，以确保所需的最大精度成为整数的最低有效位。例如，如果所需的最大精度是十分之一美分，则将货币值乘以 1000。
3. 存储转换后的货币值。

例如，以下缩放`9.99 USD`1000 以将精度保持在十分之一美分。

```json
{ price: 9990, currency: "USD" }
```

该模型假设对于给定的货币价值：

- 货币的比例因子是一致的；即给定货币的相同比例因子。
- 比例因子是货币的常数和已知属性；即应用程序可以根据货币确定比例因子。

使用此模型时，应用程序必须一致地执行值的适当缩放。

有关此模型的用例，请参阅[数值模型。](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-numeric-model-use-case)

**非数字模型**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#non-numeric-model-1)

要使用非数字模型对货币数据建模，请将值存储在两个字段中：

1. 在一个字段中，将确切的货币值编码为非数字数据类型；例如，`BinData`或一个`string`.
2. 在第二个字段中，存储精确值的双精度浮点近似值。

以下示例使用非数字模型来存储 `9.99 USD`价格和`0.25 USD`费用：

```json
{
  price: { display: "9.99", approx: 9.9900000000000002, currency: "USD" },
  fee: { display: "0.25", approx: 0.2499999999999999, currency: "USD" }
}
```

小心点，应用程序可以使用数值近似值对字段执行范围和排序查询。但是，使用近似字段进行查询和排序操作需要应用程序执行客户端后处理以解码精确值的非数字表示，然后根据精确的货币值过滤掉返回的文档。

有关此模型的用例，请参阅 [非数字模型。](https://www.mongodb.com/docs/manual/tutorial/model-monetary-data/#std-label-non-numeric-model-use-case)

 参见

原文 - [Model Monetary Data]( https://docs.mongodb.com/manual/tutorial/model-monetary-data/ )

译者：景圣
