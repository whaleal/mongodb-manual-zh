#  实施现场级编辑

[$redact]() 管道运算符根据存储在文档本身中的信息限制文档的内容。

![Diagram of security architecture with middleware and redaction.](https://www.mongodb.com/docs/manual/images/redact-security-architecture.bakedsvg.svg)

如果要存储访问条件数据，可以向文档和嵌入文档添加一个字段。如果要允许对同一数据使用多种访问级别组合，可以考虑将访问字段设置为一组数组中的一个数组。 每个数组元素都包含一个必需的集合，允许拥有该集合的用户访问数据。

然后，在[`db.collection.aggregate()`]() 操作中包含 [`$redact`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\21-redact.md) 阶段，根据查看数据所需的访问权限来限制结果集的内容。

有关[`$redact`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\21-redact.md)管道运算符的更多信息，包括其语法和关联的系统变量以及其他示例，请参阅 [[`$redact`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\21-redact.md)](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\21-redact.md)。

## 步骤

例如，预测集合包含以下形式的文档，其中 tags 字段确定查看数据所需的访问级别：

```javascript
{
   _id: 1,
   title: "123 Department Report",
   tags: [ [ "G" ], [ "FDW" ] ],
   year: 2014,
   subsections: [
       {
           subtitle: "Section 1: Overview",
           tags: [ [ "SI", "G" ], [ "FDW" ] ],
           content:  "Section 1: This is the content of section 1."
       },
       {
           subtitle: "Section 2: Analysis",
           tags: [ [ "STLW" ] ],
           content: "Section 2: This is the content of section 2."
       },
       {
           subtitle: "Section 3: Budgeting",
           tags: [ [ "TK" ], [ "FDW", "TGE" ] ],
           content: {
               text: "Section 3: This is the content of section3.",
               tags: [ [ "HCS"], [ "FDW", "TGE", "BX" ] ]
           }
       }
   ]
}
```

对于每个文档，tags 字段包含查看数据所需的各种访问分组。 例如，值 `[ [ "G" ], [ "FDW", "TGE" ] ]` 可以指定用户需要访问级别 `["G"]` 或同时拥有 `[ "FDW", "TGE" ]` 才能查看 数据。

考虑一个只能查看标记为`"FDW"`或`"TGE"`的信息的用户。 如果要为该用户查询 2014 年所有文档，可以包含一个 [`$redact`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\21-redact.md) 阶段，如下所示：

```javascript
var userAccess = [ "FDW", "TGE" ];
db.forecasts.aggregate(
   [
     { $match: { year: 2014 } },
     { $redact:
         {
           $cond: {
                    if: { $anyElementTrue:
                           {
                             $map: {
                                     input: "$tags" ,
                                     as: "fieldTag",
                                     in: { $setIsSubset: [ "$$fieldTag", userAccess ] }
                                   }
                           }
                        },
                     then: "$$DESCEND",
                     else: "$$PRUNE"
                  }
         }
     }
   ]
)
```

聚合操作为用户返回以下“已编辑”文档：

```javascript
{ "_id" : 1,
  "title" : "123 Department Report",
  "tags" : [ [ "G" ], [ "FDW" ] ],
  "year" : 2014,
  "subsections" :
     [
        {
          "subtitle" : "Section 1: Overview",
          "tags" : [ [ "SI", "G" ], [ "FDW" ] ],
          "content" : "Section 1: This is the content of section 1."
        },
       {
         "subtitle" : "Section 3: Budgeting",
         "tags" : [ [ "TK" ], [ "FDW", "TGE" ] ]
       }
     ]
}
```

>[TIP]提示
>
>也可以看看：
>
>- [`$map`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\32-map.md)
>- [`$setIsSubset`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\33-setIsSubset.md)
>- [`$anyElementTrue`](C:\Users\14040\Desktop\mongodb-manual-zh-dev\16-reference\01-operator\03-aggregation-pipeline\34-anyElementTrue.md)

译者：景圣

参见

原文 - [Implement Field Level Redaction]( https://docs.mongodb.com/manual/tutorial/implement-field-level-redaction/ )



