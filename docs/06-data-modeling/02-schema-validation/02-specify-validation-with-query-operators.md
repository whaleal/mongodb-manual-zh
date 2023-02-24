**使用查询运算符指定验证**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#specify-validation-with-query-operators)

您可以使用查询运算符（例如[`$eq`](https://www.mongodb.com/docs/manual/reference/operator/query/eq/#mongodb-query-op.-eq) 和）来指定验证[`$gt`](https://www.mongodb.com/docs/manual/reference/operator/query/gt/#mongodb-query-op.-gt)以比较字段。

使用查询运算符进行模式验证的一个常见用例是，当您想要创建在运行时比较多个字段值的动态验证规则时。例如，如果您有一个字段依赖于另一个字段的值并且需要确保这些值彼此正确成比例。

**限制**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#restrictions)

- 您不能在对象中指定以下[查询运算符](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors)`validator`：
  - [`$expr`](https://www.mongodb.com/docs/manual/reference/operator/query/expr/#mongodb-query-op.-expr)与[`$function`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/function/#mongodb-expression-exp.-function)表达式
  - [`$near`](https://www.mongodb.com/docs/manual/reference/operator/query/near/#mongodb-query-op.-near)
  - [`$nearSphere`](https://www.mongodb.com/docs/manual/reference/operator/query/nearSphere/#mongodb-query-op.-nearSphere)
  - [`$text`](https://www.mongodb.com/docs/manual/reference/operator/query/text/#mongodb-query-op.-text)
  - [`$where`](https://www.mongodb.com/docs/manual/reference/operator/query/where/#mongodb-query-op.-where)
- 您不能为以下内容指定架构验证：
  - `admin`、`local`和`config`数据库中的集合
  - [系统收藏](https://www.mongodb.com/docs/manual/reference/system-collections/#std-label-metadata-system-collections)

**语境**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#context)

考虑一个跟踪客户订单的应用程序。订单有基本价格和增值税。该`orders` 集合包含以下字段以跟踪总价：

- `price`
- `VAT`
- `totalWithVAT`

**步骤**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#steps)

以下过程使用查询运算符创建模式验证，以确保`totalWithVAT`匹配预期的 `price`和组合`VAT`。

1. **创建一个带有验证的集合**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#create-a-collection-with-validation.)

   创建一个`orders`带有模式验证的集合：

   ```shell
   db.createCollection( "orders",
      {
         validator: {
            $expr:
               {
                  $eq: [
                     "$totalWithVAT",
                     { $multiply: [ "$total", { $sum:[ 1, "$VAT" ] } ] }
                  ]
               }
         }
      }
   )
   ```

   通过此验证，您只能在 `totalWithVAT`字段等于时插入文档`total * (1 + VAT)`。

2. **确认验证可防止无效文档**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#confirm-that-the-validation-prevents-invalid-documents.)

   以下操作失败，因为该`totalWithVAT`字段不等于正确的值：

   ```shell
   db.orders.insertOne( {
      total: NumberDecimal("141"),
      VAT: NumberDecimal("0.20"),
      totalWithVAT: NumberDecimal("169")
   } )
   ```

   141 * (1 + 0.20) 等于 169.2，因此该 `totalWithVAT`字段的值必须为 169.2。

   该操作返回此错误：

   ```shell
   MongoServerError: Document failed validation
   Additional information: {
     failingDocumentId: ObjectId("62bcc9b073c105dde9231293"),
     details: {
       operatorName: '$expr',
       specifiedAs: {
         '$expr': {
           '$eq': [
             '$totalWithVAT',
             {
               '$multiply': [ '$total', { '$sum': [ 1, '$VAT' ] } ]
             }
           ]
         }
       },
       reason: 'expression did not match',
       expressionResult: false
     }
   }
   ```

3. **使文件有效并插入**。[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#make-the-document-valid-and-insert-it.)

   将文档更新为具有正确的`totalWithVAT` 值后，操作成功：

   ```shell
   db.orders.insertOne( {
      total: NumberDecimal("141"),
      VAT: NumberDecimal("0.20"),
      totalWithVAT: NumberDecimal("169.2")
   } )
   ```

   MongoDB返回如下输出，说明插入成功：

   ```json
   {
     acknowledged: true,
     insertedId: ObjectId("6304f4651e52f124b84479ba"
   }
   ```

**附加信息**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#additional-information)

您可以将查询运算符验证与[JSON 模式验证相结合。](https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/#std-label-schema-validation-json)

例如，考虑`sales`具有此架构验证的集合：

```shell
db.createCollection{ "sales", {
  validator: {
    "$and": [
      // Validation with query operators
      {
        "$expr": {
          "$lt": ["$lineItems.discountedPrice", "$lineItems.price"]
        }
      },
      // Validation with JSON Schema
      {
        "$jsonSchema": {
          "properties": {
            "items": { "bsonType": "array" }
          }
        }
      }
    ]
  }
}
```

前面的验证对 `sales`集合中的文档强制执行这些规则：

- `lineItems.discountedPrice`必须小于`lineItems.price`。此规则是使用[`$lt`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lt/#mongodb-expression-exp.-lt)运算符指定的。
- 该`items`字段必须是一个数组。此规则使用 指定 [`$jsonSchema`。](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#mongodb-query-op.-jsonSchema)

**学到更多**[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/#learn-more)

- 要查看 MongoDB 中可用的所有查询运算符，请参阅 [查询选择器。](https://www.mongodb.com/docs/manual/reference/operator/query/#std-label-query-selectors)
- 要了解有关`$expr`允许在查询语言中使用聚合表达式的运算符的更多信息，请参阅[`$expr`。](https://www.mongodb.com/docs/manual/reference/operator/query/expr/#mongodb-query-op.-expr)

参见

原文：[Specify Validation With Query Operators](https://www.mongodb.com/docs/manual/core/schema-validation/specify-query-expression-rules/)

译者：景圣