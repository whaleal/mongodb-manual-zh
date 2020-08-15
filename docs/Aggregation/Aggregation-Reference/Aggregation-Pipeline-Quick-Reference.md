# [ ](#)聚合管道快速参考

[]()

在本页面

*   [阶段](#stages)

*   [表达式](#expressions)

*   [Operator 表达式](#operator-expressions)

*   [表达式 Operators 的索引](#index-of-expression-operators)
> 有关特定 operator 的详细信息，包括语法和示例，请单击特定的 operator 以转到其 reference 页面。

[]()

## <span id="stages">阶段</span>

[]()

### [](#阶段dbcollectionaggregate)阶段(db.collection.aggregate)

在[db.collection.aggregate](../../Reference/mongo-Shell-Methods/Collection-Methods/db-collection-aggregate.md)方法中，管道阶段出现在 array 中。文档按顺序通过各个阶段。除和[$geoNear]()阶段之外的所有阶段都可以在管道中多次出现。

```powershell
db.collection.aggregate( [ { <stage> }, ... ] )
```

| 阶段              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| [$addFields]()    | 向文档添加新字段。与[$project]()类似，[$addFields]()重塑了流中的每个文档;具体而言，通过向输出文档添加新字段，该文档包含输入文档和新添加字段中的现有字段。 |
| [$bucket]()       | 根据指定的表达式和存储区边界，将传入的文档分组，称为存储桶。 |
| [$bucketAuto]()   | 根据指定的表达式将传入的文档分类为特定数量的组(称为存储桶)。自动确定存储桶边界，以尝试将文档均匀地分配到指定数量的存储桶中。 |
| [$collStats]()    | 返回有关集合或视图的统计信息。                               |
| [$count]()        | 返回聚合管道此阶段的文档数量计数。                           |
| [$facet]()        | 在同一组输入文档的单个阶段内处理多个[聚合管道]()。允许创建能够在单个阶段中跨多个维度或方面表征数据的 multi-faceted 聚合。 |
| [$geoNear]()      | 基于与地理空间点的接近度返回有序的文档流。将[$match]()，[$sort]()和[$limit]()的功能合并到地理空间数据中。输出文档包括附加距离字段，并且可以包括位置标识符字段。 |
| [$graphLookup]()  | 对集合执行递归搜索。对于每个输出文档，添加一个新的 array 字段，该字段包含该文档的递归搜索的遍历结果。 |
| [$group]()        | 按指定的标识符表达式对文档进行分组，并将累加器 expression(s(如果指定)应用于每个 group。消耗所有输入文档，并为每个不同的 group 输出一个文档。输出文档仅包含标识符字段，如果指定，则包含累积字段。 |
| [$indexStats]()   | 返回有关集合的每个索引的使用的统计信息。                     |
| [$limit]()        | 将未修改的前 n 个文档传递给管道，其中 n 是指定的限制。对于每个输入文档，输出一个文档(对于前 n 个文档)或零文档(在前 n 个文档之后)。 |
| [$listSessions]() | 列出足以传播到`system.sessions`集合的所有会话。              |
| [$lookup]()       | 对同一数据库中的另一个集合执行左外连接，以从“已连接”集合中过滤文档以进行处理。 |
| [$match]()        | 过滤文档流以仅允许匹配的文档未经修改地传递到下一个管道阶段。 [$match]()使用标准的 MongoDB 查询。对于每个输入文档，输出一个文档(match)或零文档(无 match)。 |
| [$out]()          | 将聚合管道的结果文档写入集合。要使用[$out]()阶段，它必须是管道中的最后一个阶段。 |
| [$project]()      | 重新整形流中的每个文档，例如添加新字段或删除现有字段。对于每个输入文档，输出一个文档。 |
| [$redact]()       | 通过基于文档本身中存储的信息限制每个文档的内容来重塑流中的每个文档。包含[$project]()和[$match]()的功能。可用于实现字段 level 编辑。对于每个输入文档，输出一个或零个文档。 |
| [$replaceRoot]()  | 用指定的嵌入文档替换文档。该操作将替换输入文档中的所有现有字段，包括`_id`字段。指定嵌入在输入文档中的文档，以将嵌入的文档提升到顶部 level。 |
| [$sample]()       | 从输入中随机选择指定数量的文档。                             |
| [$skip]()         | 跳过前 n 个文档，其中 n 是指定的跳过编号，并将未修改的其余文档传递给管道。对于每个输入文档，输出零文档(对于前 n 个文档)或一个文档(如果在前 n 个文档之后)。 |
| [$sort]()         | 按指定的排序 key 重新排序文档流。只有 order 改变;文件保持不变。对于每个输入文档，输出一个文档。 |
| [$sortByCount]()  | 根据指定表达式的 value 对传入文档进行分组，然后计算每个不同 group 中的文档计数。 |
| [$unwind]()       | 从输入文档解构 array 字段以输出每个元素的文档。每个输出文档都使用元素 value 替换 array。对于每个输入文档，输出 n 个文档，其中 n 是 array 元素的数量，对于空 array 可以为零。 |

[]()

### [](#阶段dbaggregate)阶段(db.aggregate)

从 version 3.6 开始，MongoDB 还提供了[db.aggregate]()方法：

```powershell
db.aggregate( [ { <stage> }, ... ] )
```

以下阶段使用[db.aggregate()]()方法而不是[db.collection.aggregate()]()方法。

| 阶段                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| [$currentOp]()         | 返回有关 MongoDB 部署的 active and/or 休眠操作的信息。       |
| [$listLocalSessions]() | 列出最近在当前连接的[mongos]()或[mongod]()实例上使用的所有 active 会话。这些会话可能尚未传播到`system.sessions`集合。 |

[]()
[]()

## <span id="expressions">表达式</span>

表达式可以包括[field paths 和系统变量]()，[literals]()，[表达 objects]()和[表达式 operators]()。表达式可以嵌套。
[]()
[]()

### [](#字段路径和系统变量)字段路径和系统变量

聚合表达式使用[字段路径]()来访问输入文档中的字段。要指定字段路径，请使用带有美元符号前缀的 string `$`字段 name 或[虚线字段 name]()(如果该字段位于嵌入文档中)。对于 example，`"$user"`指定`user`字段的字段路径，或`"$user.name"`指定`"user.name"`字段的字段路径。

`"$<field>"`等效于`"$$CURRENT.<field>"`，其中[CURRENT]()是系统变量，默认情况下，在大多数阶段默认为当前 object 的根，除非在特定阶段另有说明。 [CURRENT]()可以反弹。

除了[CURRENT]()系统变量外，其他[系统变量]()也可用于表达式。要访问表达式中的变量，请在变量 name 前加上`$$`。
[]()
[]()

### [](#literals)Literals

Literals 可以是任何类型。但是，MongoDB 解析以美元符号`$`开头的 string literals 作为字段的路径，作为投影标志的 numeric/boolean literals。要避免解析 literals，请使用[$literal]()表达式。
[]()
[]()

### [](#表达式-objects)表达式 Objects

表达式 objects 具有以下形式：

```powershell
{ <field1>: <expression1>, ... }
```

如果表达式是数字或 boolean literals，MongoDB 将 literals 视为投影标志(e.g. `1`或`true`包括该字段)，仅在[$project]()阶段有效。要避免将 numeric 或 boolean literals 视为投影标志，请使用[$literal]()表达式来包装数字或 boolean literals。
[]()
[]()

## <span id="operator-expressions">Operator 表达式</span>

[]()
在这个部分

*   [算数表达式运算符](#arithmetic-expression-operators)
*   [数组表达式运算符](#array-expression-operators)
*   [布尔表达式运算符](#boolean-expression-operators)
*   [比较表达式运算符](#comparison-expression-operators)
*   [条件表达式运算符](#conditional-expression-operators)
*   [日期表达式运算符](#date-expression-operators)
*   [文字表达式运算符](#literal-expression-operator)
*   [对象表达式运算符](#object-expression-operators)
*   [集合表达式运算符](#set-expression-operators)
*   [字符串表达式运算符](#string-expression-operators)
*   [文本表达式运算符](#text-expression-operator)
*   [角度表达式运算符](#trigonometry-expression-operators)
*   [累加器($group)](#accumulators-group)
*   [累加器($project 和$addFields)](#accumulators-project-addfields)
*   [变量表达式运算符](#variable-expression-operators)

Operator 表达式与采用 arguments 的函数类似。通常，这些表达式采用 array 的 array 并具有以下形式：

```powershell
{ <operator>: [ <argument1>, <argument2> ... ] }
```

如果 operator 接受单个参数，则可以省略指定参数列表的外部 array：

```powershell
{ <operator>: <argument> }
```

如果参数是文字 array，为了避免解析歧义，必须将文字 array 包装在[$literal]()表达式中，或者保留指定参数列表的外部 array。

[]()

[]()

### <span id="arithmetic-expression-operators">算数表达式运算符</span>

算术表达式对 numbers 执行数学运算。一些算术表达式也可以支持 date 算术。

| 名称          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| [$abs]()      | 返回数字的绝对 value。                                       |
| [$add]()      | 添加 numbers 以 return 总和，或添加 numbers 和 date 以 return 新的 date。如果添加 numbers 和 date，则将 numbers 视为毫秒。接受任意数量的参数表达式，但最多只能有一个表达式解析为 date。 |
| [$ceil]()     | 返回大于或等于指定数字的最小 integer。                       |
| [$divide]()   | 返回将第一个数除以第二个数的结果。接受两个参数表达式。       |
| [$exp]()      | 将 e 提高到指定的指数。                                      |
| [$floor]()    | 返回小于或等于指定数字的最大 integer。                       |
| [$ln]()       | 计算数字的自然 log。                                         |
| [$log]()      | 计算指定基数中的数字的 log。                                 |
| [$log10]()    | 计算数字的 log 基数 10。                                     |
| [$mod]()      | 返回第一个数字的余数除以第二个数字。接受两个参数表达式。     |
| [$multiply]() | 将 numbers 乘以_return 产品。接受任意数量的参数表达式。      |
| [$pow]()      | 将数字提高到指定的指数。                                     |
| [$sqrt]()     | 计算平方根。                                                 |
| [$subtract]() | 返回从第一个中减去第二个 value 的结果。如果这两个值是 numbers，返回差异。如果这两个值是日期，则返回差异(以毫秒为单位)。如果这两个值是 date 和一个以毫秒为单位的数字，_return 结果 date。接受两个参数表达式。如果这两个值是 date 和数字，请首先指定 date 参数，因为从数字中减去 date 没有意义。 |
| [$trunc]()    | 截断其整数的数字。                                           |

[]()

### <span id="array-expression-operators">数组表达式运算符</span>

| 名称               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| [$arrayElemAt]()   | 返回指定的 array 索引处的元素。                              |
| [$arrayToObject]() | 将 key value 对的 array 转换为文档。                         |
| [$concatArrays]()  | 连接数组以 return 连接的 array。                             |
| [$filter]()        | 选择 array 的子集以 return array 仅包含 match 过滤条件的元素。 |
| [$in]()            | 返回一个 boolean，指示指定的 value 是否在 array 中。         |
| [$indexOfArray]()  | 搜索 array 以查找指定 value 的出现并返回第一次出现的 array 索引。如果未找到子字符串，则返回`-1`。 |
| [$isArray]()       | 确定操作数是否为 array。返回 boolean。                       |
| [$map]()           | 将子表达式应用于 array 的每个元素，并在 order 中返回结果值的 array。接受命名参数。 |
| [$objectToArray]() | 将文档转换为表示 key-value 对的文档的 array。                |
| [$range]()         | 根据 user-defined 输入输出包含整数序列的 array。             |
| [$reduce]()        | 将表达式应用于 array 中的每个元素，并将它们组合为单个 value。 |
| [$reverseArray]()  | 返回带有 reverse order 元素的 array。                        |
| [$size]()          | 返回 array 中的元素数。接受单个表达式作为参数。              |
| [$slice]()         | 返回 array 的子集。                                          |
| [$zip]()           | 将两个数组合并在一起。                                       |


[]()

### <span id="boolean-expression-operators">布尔表达式运算符</span>

Boolean 表达式将其参数表达式计算为布尔值，并将_retolean 作为结果返回 boolean。

除了`false` boolean value 之外，Boolean 表达式还计算为`false`以下：`null`，`0`和`undefined`值。 Boolean 表达式将所有其他值计算为`true`，包括 non-zero 数值和数组。

| 名称     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| [$and]() | 仅当其所有表达式求值为`true`时才返回`true`。接受任意数量的参数表达式。 |
| [$not]() | 返回与其参数表达式相反的 boolean value。接受单个参数表达式。 |
| [$or]()  | 当任何表达式求值为`true`时返回`true`。接受任意数量的参数表达式。 |

[]()

### <span id="comparison-expression-operators">比较表达式运算符</span>

比较表达式 return boolean 除了[$cmp]()，它返回一个数字。

比较表达式采用两个参数表达式并比较 value 和 type，使用[指定的 BSON 比较 order]()表示不同类型的值。

| 名称     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| [$cmp]() | 如果两个值相等则返回`0`，如果第一个 value 大于第二个值则返回`1`，如果第一个 value 小于第二个值，则返回`-1`。 |
| [$eq]()  | 如果值相等，则返回`true`。                                   |
| [$gt]()  | 如果第一个 value 大于第二个，则返回`true`。                  |
| [$gte]() | 如果第一个 value 大于或等于第二个，则返回`true`。            |
| [$lt]()  | 如果第一个 value 小于第二个，则返回`true`。                  |
| [$lte]() | 如果第一个 value 小于或等于第二个值，则返回`true`。          |
| [$ne]()  | 如果值不相等，则返回`true`。                                 |

[]()

### <span id="conditional-expression-operators">条件表达式运算符</span>

| 名称        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| [$cond]()   | 一个三元 operator，它计算一个表达式，并根据结果返回另外两个表达式之一的 value。接受有序列表中的三个表达式或三个命名参数。 |
| [$cond]()   | 如果第一个表达式导致 null 结果，则返回第一个表达式的 non-null 结果或第二个表达式的结果。空结果包含未定义值或缺少字段的实例。接受两个表达式作为 arguments。第二个表达式的结果可以为 null。 |
| [$switch]() | 评估一系列案例表达。当它找到一个计算结果为`true`的表达式时，`$switch`执行一个指定的表达式并突破控制流。 |


[]()

[]()

### <span id="date-expression-operators">日期表达式运算符</span>

以下 operators 返回 date objects 或 date object 的组件：

| 名称                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| [$dateFromParts]()  | 给出 date 的组成部分，构造一个 BSON Date object。            |
| [$dateFromString]() | 将 date/time string 转换为 date object。                     |
| [$dateToParts]()    | 返回包含 date 组成部分的文档。                               |
| [$dateToString]()   | 将 date 作为格式化的 string 返回。                           |
| [$dayOfMonth]()     | 将 date 的月中某天返回为 1 到 31 之间的数字。                |
| [$dayOfWeek]()      | 将 date 的星期几返回为 1(星期日)和 7(星期六)之间的数字。     |
| [$dayOfYear]()      | 将 date 的年中日期作为 1 到 366(闰年)之间的数字返回。        |
| [$hour]()           | 将 date 的小时数作为 0 到 23 之间的数字返回。                |
| [$isoDayOfWeek]()   | 返回 ISO 8601 格式的工作日编号，范围从`1`(星期一)到`7`(星期日)。 |
| [$isoWeek]()        | 返回 ISO 8601 格式的周数，范围从`1`到`53`。 Week numbers 从`1`开始，周(星期一到星期日)包含年份的第一个星期四。 |
| [$isoWeekYear]()    | 以 ISO 8601 格式返回年份编号。年份从第 1 周的星期一(ISO 8601)开始，结束于上周的星期日(ISO 8601)。 |
| [$millisecond]()    | 返回 date 的毫秒数，作为 0 到 999 之间的数字。               |
| [$minute]()         | 将 date 的分钟作为 0 到 59 之间的数字返回。                  |
| [$month]()          | 将 date 的月份返回为 1(1 月)和 12(12 月)之间的数字。         |
| [$second]()         | 返回 date 的秒数，作为 0 到 60 之间的数字(闰秒)。            |
| [$week]()           | 返回 date 的周数，作为 0(在一年的第一个星期日之前的部分周)和 53(闰年)之间的数字。 |
| [$year]()           | 将 date 的年份作为数字返回(例： 2014)。                      |

以下算术 operators 可以使用 date 操作数：

| 名称          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| [$add]()      | 添加 numbers 和 date 以 return 新的 date。如果添加 numbers 和 date，则将 numbers 视为毫秒。接受任意数量的参数表达式，但最多只能有一个表达式解析为 date。 |
| [$subtract]() | 返回从第一个中减去第二个 value 的结果。如果这两个值是日期，则返回差异(以毫秒为单位)。如果这两个值是 date 和一个以毫秒为单位的数字，_return 结果 date。接受两个参数表达式。如果这两个值是 date 和数字，请首先指定 date 参数，因为从数字中减去 date 没有意义。 |

[]()

### <span id="literal-expression-operator">文字表达式运算符</span>

| 名称         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| [$literal]() | 无需解析即可返回 value。用于聚合管道可以将其解释为表达式的值。对于 example，将[$literal]()表达式用于以`$`开头的 string，以避免将其解析为字段路径。 |

[]()

### <span id="object-expression-operators">对象表达式运算符</span>

| 名称               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| [$mergeObjects]()  | 将多个文档合并为一个文档。 <br/> version 3.6 中的新内容。    |
| [$objectToArray]() | 将文档转换为表示 key-value 对的文档的 array。 <br/> version 3.6 中的新内容。 |


[]()

[]()

### <span id="set-expression-operators">集合表达式运算符</span>

Set 表达式对数组执行 set 操作，将数组视为 sets。 Set 表达式忽略每个输入 array 和元素的 order 中的重复条目。

如果 set 操作返回一个 set，则该操作会过滤掉结果中的重复项，以输出仅包含唯一条目的 array。输出 array 中元素的 order 未指定。

如果集合包含嵌套的 array 元素，则 set 表达式不会下降到嵌套的 array 中，而是在 top-level 处计算 array。

| 名称                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| [$allElementsTrue]() | 如果没有集合的元素计算为`false`，则返回`true`，否则返回`false`。接受单个参数表达式。 |
| [$anyElementTrue]()  | 如果集合中的任何元素求值为`true`，则返回`true`;否则，返回`false`。接受单个参数表达式。 |
| [$setDifference]()   | 返回一个集合，其中的元素出现在第一个集合中但不出现在第二个集合中; i.e。相对于第一组执行第二组的[相对补充](http://en.wikipedia.org/wiki/Complement_(set_theory))。接受两个参数表达式。 |
| [$setEquals]()       | 如果输入 sets 具有相同的不同元素，则返回`true`。接受两个或多个参数表达式。 |
| [$setIntersection]() | 返回一个包含所有输入 sets 中出现的元素的集合。接受任意数量的参数表达式。 |
| [$setIsSubset]()     | 如果第一组的所有元素出现在第二组中，则返回`true`，包括第一组的等于第二组的时间; i.e。不是[严格的子集](http://en.wikipedia.org/wiki/Subset)。接受两个参数表达式。 |
| [$setUnion]()        | 返回一个包含任何输入 sets 中出现的元素的集合。               |


[]()

### <span id="string-expression-operators">字符串表达式运算符</span>

具有[$concat]()的 exception 的 String 表达式仅对 strings 的 ASCII 字符具有 well-defined 行为。

无论使用哪个字符，[$concat]()行为都是 well-defined。

| 名称                | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| [$concat]()         | 连接任意数量的 strings。                                     |
| [$dateFromString]() | 将 date/time string 转换为 date object。                     |
| [$dateToString]()   | 将 date 作为格式化的 string 返回。                           |
| [$indexOfBytes]()   | 搜索 string 以查找子字符串的出现并返回第一次出现的 UTF-8 字节索引。如果未找到子字符串，则返回`-1`。 |
| [$indexOfCP]()      | 搜索 string 以查找子字符串的出现并返回第一次出现的 UTF-8 code 点索引。如果找不到子字符串，则返回`-1` |
| [$split]()          | 根据分隔符将 string 拆分为子字符串。返回子字符串的 array。如果在 string 中找不到分隔符，则返回包含原始 string 的 array。 |
| [$strLenBytes]()    | 返回 string 中 UTF-8 编码字节的数量。                        |
| [$strLenCP]()       | 返回 string 中 UTF-8 [code 点](http://www.unicode.org/glossary/#exp._S_strLenBytes)的数量。 |
| [$strcasecmp]()     | 执行 case-insensitive string 比较并返回：如果两个 strings 相等则返回`0`，如果第一个 string 大于第二个，则返回`1`，如果第一个 string 小于第二个，则返回`-1`。 |
| [$substr]()         | 已过时。使用[$substrBytes]()或[$substrCP]()。                |
| [$substrBytes]()    | 返回 string 的子字符串。从 string 中指定的 UTF-8 字节索引(zero-based)处的字符开始，并继续指定的字节数。 |
| [$substrCP]()       | 返回 string 的子字符串。从 string 中指定的 UTF-8 [code point(CP)](http://www.unicode.org/glossary/#exp._S_substrBytes)索引(zero-based)处的字符开始，并继续指定的 code 点数。 |
| [$toLower]()        | 将 string 转换为小写。接受单个参数表达式。                   |
| [$toUpper]()        | 将 string 转换为大写。接受单个参数表达式。                   |

[]()

### <span id="text-expression-operator">文本表达式运算符</span>

| 名称      | 描述                 |
| --------- | -------------------- |
| [$meta]() | 访问文本搜索元数据。 |

[]()

### <span id="trigonometry-expression-operators">角度表达式运算符</span>

| 名称      | 描述                         |
| --------- | ---------------------------- |
| [$type]() | 返回该字段的 BSON 数据类型。 |


[](s

### <span id="accumulators-group">累加器($group)</span>

可以在[$group]()阶段使用，累加器是 operators，它们在文档通过管道时保持其 state(例： 总计，最大值，最小值和相关数据)。

当在[$group]()阶段用作累加器时，这些 operators 将单个表达式作为输入，为每个输入文档计算一次表达式，并为共享相同 group key 的 group 文档保持其阶段。

| 名称              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| [$addToSet]()     | 返回每个 group 的唯一表达式值的 array。 _Oray 元素的 Order 是未定义的。 |
| [$avg]()          | 返回数值的平均值。忽略 non-numeric 值。                      |
| [$first]()        | 从每个 group 的第一个文档返回一个 value。仅当文档位于已定义的 order 中时才定义 Order。 |
| [$last]()         | 从每个 group 的最后一个文档返回一个 value。仅当文档位于已定义的 order 中时才定义 Order。 |
| [$max]()          | 返回每个 group 的最高表达式 value。                          |
| [$mergeObjects]() | 返回通过组合每个 group 的输入文档创建的文档。                |
| [$min]()          | 返回每个 group 的最低表达式 value。                          |
| [$push]()         | 返回每个 group 的表达式值的 array。                          |
| [$stdDevPop]()    | 返回输入值的总体标准偏差。                                   |
| [$stdDevSamp]()   | 返回输入值的 sample 标准偏差。                               |
| [$sum]()          | 返回数值的总和。忽略 non-numeric 值。                        |

[]()

### <span id="accumulators-project-addfields">累加器($project 和$addFields)</span>

一些可用作[$group]()阶段累加器的运算符也可用于[$project]()和[$addFields]()阶段，但不能用作累加器。在[$project]()和[$addFields]()阶段使用时，这些 operators 不会维护它们的 state，并且可以将单个参数或多个 arguments 作为输入。

更改了 version 3.2.

以下累加器 operators 也可用于[$project]()和[$addFields]()阶段。

| 名称            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| [$avg]()        | 返回每个文档的指定表达式或表达式列表的平均值。忽略 non-numeric 值。 |
| [$max]()        | 返回每个文档的指定表达式或表达式列表的最大值                 |
| [$min]()        | 返回每个文档的指定表达式或表达式列表的最小值                 |
| [$stdDevPop]()  | 返回输入值的总体标准偏差。                                   |
| [$stdDevSamp]() | 返回输入值的 sample 标准偏差。                               |
| [$sum]()        | 返回数值的总和。忽略 non-numeric 值。                        |


[]()

### <span id="variable-expression-operators">变量表达式运算符</span>

| 名称     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| [$let]() | 定义在子表达式范围内使用的变量，并返回子表达式的结果。接受命名参数。 <br/>接受任意数量的参数表达式。 |


[]()

## <span id="index-of-expression-operators">表达式 Operators 的索引</span>

| <br />                                                       |                                                              |                                                              |                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [$abs]()<br/>[$add]()<br/>[$addToSet]()<br/>[$allElementsTrue]()<br/>[$and]()<br/>[$anyElementTrue]()<br/>[$arrayElemAt]()<br/>[$arrayToObject]()<br/>[$avg]()<br/>[$cmp]()<br/>[$concat]()<br/>[$concatArrays]()<br/>[$cond]()<br/>[$dateFromParts]()<br/>[$dateToParts]()<br/>[$dateFromString]()<br/>[$dateToString]() | [$dayOfMonth]()<br/>[$dayOfWeek]()<br/>[$dayOfYear]()<br/>[$divide]()<br/>[$eq]()<br/>[$exp]()<br/>[$filter]()<br/>[$first]()<br/>[$floor]()<br/>[$gt]()<br/>[$gte]()<br/>[$hour]()<br/>[$ifNull]()<br/>[$in]()<br/>[$indexOfArray]()<br/>[$indexOfBytes]()<br/>[$indexOfCP]()<br/>[$isArray]() | [$isoDayOfWeek]()<br/>[$isoWeek]()<br/>[$isoWeekYear]()<br/>[$last]()<br/>[$let]()<br/>[$literal]()<br/>[$ln]()<br/>[$log]()<br/>[$log10]()<br/>[$lt]()<br/>[$lte]()<br/>[$map]()<br/>[$max]()<br/>[$mergeObjects]()<br/>[$meta]()<br/>[$min]()<br/>[$millisecond]() | [$minute]()<br/>[$mod]()<br/>[$month]()<br/>[$multiply]()<br/>[$ne]()<br/>[$not]()<br/>[$objectToArray]()<br/>[$or]()<br/>[$pow]()<br/>[$push]()<br/>[$range]()<br/>[$reduce]()<br/>[$reverseArray]()<br/>[$second]()<br/>[$setDifference]()<br/>[$setEquals]()<br/>[$setIntersection]()<br/>[$setIsSubset]()<br/>[$setUnion]()<br/>[$size]() | [$slice]()<br/>[$split]()<br/>[$sqrt]()<br/>[$stdDevPop]()<br/>[$stdDevSamp]()<br/>[$strcasecmp]()<br/>[$strLenBytes]()<br/>[$strLenCP]()<br/>[$substr]()<br/>[$substrBytes]()<br/>[$substrCP]()<br/>[$subtract]()<br/>[$sum]()<br/>[$switch]()<br/>[$toLower]()<br/>[$toUpper]()<br/>[$trunc]()<br/>[$type]()<br/>[$week]()<br/>[$year]()<br/>[$zip]() |

