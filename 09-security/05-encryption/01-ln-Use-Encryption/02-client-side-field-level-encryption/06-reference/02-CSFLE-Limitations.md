# CSFLE 限制

## 读写操作支持

only[`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod)存储加密[`BinData`](https://www.mongodb.com/docs/manual/reference/mongodb-extended-json-v1/#mongodb-bsontype-data_binary)并应用任何聚合表达式或查询运算符指定针对该值的加密字段`BinData`。虽然表达式或运算符可能支持`BinData`字段，但与针对解密值发出相同的表达式或运算符相比，结果值可能不正确或出乎意料。`mongod` 如果表达式或运算符不支持 `BinData`值，则抛出错误。

例如，考虑一个确定性加密的整数`Salary`。`Salary`大于 的 文档的查询过滤器`100000`。在发出查询之前，应用程序使用确定性加密显式（手动）加密查询值。将 的*加密*值与存储在每个文档中的*加密*`mongod`值进行比较。虽然操作成功返回，但值的比较可能会返回与解密整数值的比较不同的结果。 `BinData``100000` `BinData``BinData`

自动客户端字段级加密拒绝读取或写入操作，这些操作在针对加密字段发出时会返回不正确或意外的结果。有关完整文档，请参阅 [自动加密支持的操作。](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)

执行显式（手动）加密的应用程序可以参考链接页面作为对加密字段发出读/写操作的指南。

## 观点

[如果基础视图](https://www.mongodb.com/docs/manual/core/views/#std-label-views-landing-page)聚合管道*或*查询引用加密字段，则针对包含使用客户端字段级加密加密的值的集合视图的查询可能会返回意外或不正确的结果。如果在包含使用客户端字段级加密加密的值的集合上创建视图，请避免对加密字段进行操作以降低意外或不正确结果的风险。

虽然为自动客户端字段级加密配置的 4.2+ 兼容驱动程序支持 [自动加密操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)，但对于不支持的读写操作，底层支持库无法内省视图目录以将给定集合识别为视图。因此，应用程序不能依赖自动客户端字段级加密验证来防止对具有加密字段的集合的视图进行不受支持的查询。

对于使用显式（手动）加密来查询包含加密值的集合的视图的应用程序，请考虑 在针对加密字段发出时*仅*使用具有已知[正常行为的查询运算符来构造查询。](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-supported-query-operators)

## 校对

客户端字段级加密不遵守用户指定的排序规则或集合默认[排序规则](https://www.mongodb.com/docs/manual/reference/collation/#std-label-collation-document-fields)。字段级加密会隐藏字段值并阻止正常的整理行为。针对加密字段的排序规则敏感查询可能会返回意外或不正确的结果。

虽然为自动客户端字段级加密配置的 4.2+ 兼容驱动程序支持 [自动加密操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)，但对于不支持的读写操作，底层支持库无法自省集合目录以识别默认排序规则。因此，应用程序不能依赖客户端字段级加密验证来防止查询具有排序规则默认值的加密字段。

## 唯一索引

如果索引键指定任何 [随机加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-random-encryption)字段，则[唯一索引](https://www.mongodb.com/docs/manual/core/index-unique/#std-label-index-type-unique)*不能保证唯一性。*

给定特定输入，使用随机算法加密的字段*总是会*产生不同的加密值。服务器认为每个加密值都是唯一的，即使解密后的值本身不是唯一的。因此，该集合可以包含多个文档，这些文档对于具有索引强制唯一约束的字段具有重复的解密值。

虽然为自动客户端字段级加密配置的 4.2+ 兼容驱动程序支持 [对不受支持的读取和写入操作进行自动加密的操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations) ，但底层支持库无法自检索引目录以将给定字段标识为唯一。因此，应用程序不能依赖自动客户端字段级加密验证来防止随机加密字段上的唯一约束违规。

## 片键

在加密字段上指定分[片键](https://www.mongodb.com/docs/manual/core/sharding-shard-key/#std-label-shard-key)*或* 加密现有分片键的字段可能会导致意外或不正确的分片行为

虽然为自动客户端字段级加密配置的 4.2+ 兼容驱动程序支持 [自动加密操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)，但对于不支持的读写操作，底层支持库无法自省分片目录元数据来识别分片键字段。因此，应用程序不能依赖自动字段级加密验证来防止分片键字段的加密。

## 读/写查询支持

自动客户端字段级加密支持命令、查询运算符、更新运算符、聚合阶段和聚合表达式的子集。有关完整文档，请参阅 [自动加密支持的操作。](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)







译者：韩鹏帅

原文：[CSFLE Limitations](https://www.mongodb.com/docs/manual/core/csfle/reference/limitations/)
