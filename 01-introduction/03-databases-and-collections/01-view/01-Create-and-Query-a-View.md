# 创建和查询视图

在本页面

[`db.createCollection()` Syntax]()

[`db.createView()` Syntax]()

[`Restrictions`]()

[`Example`]()

[`Behavior`]()



要创建视图，请使用[`db.createCollection()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) or [`db.createView()`.](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView)

```javascript
/IMPORTANT/
	 视图名称包含在集合列表输出中
    列出集合的操作，例如db.getCollectionInfos()和db.getCollectionNames()，在它们的输出中包含视图。
    视图定义是公共的;例如，db.getCollectionInfos()和视图上的explain操作将包括定义视图的管道。 因此，避免在视图定义中直接引用敏感字段和值。
```



## `db.createCollection()` Syntax

```javascript
db.createCollection(
  "<viewName>",
  {
    "viewOn" : "<source>",
    "pipeline" : [<pipeline>],
    "collation" : { <collation> }
  }
)
```



## `db.createView()` Syntax

```javascript
db.createView(
  "<viewName>",
  "<source>",
  [<pipeline>],
  {
    "collation" : { <collation> }
  }
)
```



## 限制条件

- 您必须在与源集合相同的数据库中创建视图。
-  视图定义管道不能包括 [`$out`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) or the [`$merge`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 阶段。这个限制也适用于嵌入式管道，比如在[`$lookup`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) 或 [`$facet`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/facet/#mongodb-pipeline-pipe.-facet) 阶段中使用的管道。
- 视图创建后不能重命名。



### 不支持的操作

某些操作在视图中不可用:

- [`db.collection.mapReduce()`.](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.mapReduce/#mongodb-method-db.collection.mapReduce)
- [`$text`](https://www.mongodb.com/docs/v6.0/reference/operator/query/text/#mongodb-query-op.-text) 操作，因为聚合中的`$text`操作仅对第一阶段有效。
- [`$geoNear`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear)管道阶段

 有关详细信息，请参见 [Supported Operations for Views.](https://www.mongodb.com/docs/v6.0/core/views/supported-operations/#std-label-views-supported-operations)。



## Example

 这个示例用学生数据填充一个集合，并创建一个视图来查询数据。



### 填充集合

创建一个`students`集合用于这个例子:

```javascript
db.students.insertMany( [
   { sID: 22001, name: "Alex", year: 1, score: 4.0 },
   { sID: 21001, name: "bernie", year: 2, score: 3.7 },
   { sID: 20010, name: "Chris", year: 3, score: 2.5 },
   { sID: 22021, name: "Drew", year: 1, score: 3.2 },
   { sID: 17301, name: "harley", year: 6, score: 3.1 },
   { sID: 21022, name: "Farmer", year: 1, score: 2.2 },
   { sID: 20020, name: "george", year: 3, score: 2.8 },
   { sID: 18020, name: "Harley", year: 5, score: 2.8 },
] )
```



### 使用`db.createView()`创建一个视图

使用 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 创建一个仅限于一年级学生的视图:

```javascript
db.createView(
   "firstYears",
   "students",
   [ { $match: { year: 1 } } ]
)
```

在这个例子中:

-  `firstYears`是新视图的名称。
- `students`是以集合为基础的的视图
- [`$match`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 是一个聚合表达式，匹配`studnets`集合中的一年级学生。



#### `Query the View`

下面的例子查询视图:

```javascript
db.firstYears.find({}, { _id: 0 } )
```

 下面的输出只包含了一年级学生的数据。 `{_id: 0}`[`projection`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#std-label-method-find-projection)抑制输出中的`_id`字段。

```javascript
[
  { sID: 22001, name: 'Alex', year: 1, score: 4 },
  { sID: 22021, name: 'Drew', year: 1, score: 3.2 },
  { sID: 21022, name: 'Farmer', year: 1, score: 2.2 }
]
```

```javascript
/NOTE/
	Projection限制
  	 视图上的Find()操作不支持以下投影操作符:
				$

				$elemMatch

				$slice

				$meta
```



###  使用`db.createCollection()`创建一个视图

  [`db.createCollection()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createCollection/#mongodb-method-db.createCollection) 方法允许创建具有特定选项的集合或视图。

 下面的示例创建一个`graduateStudents`视图。 视图只包含 [`$match`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match) 阶段选择的文档。 可选的[`collation`](https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation) 设置决定排序顺序。

```javascript
db.createCollection(
   "graduateStudents",
   {
      viewOn: "students",
      pipeline: [ { $match: { $expr: { $gt: [ "$year", 4 ] } } } ],
      collation: { locale: "en", caseFirst: "upper" }
   }
)
```

```javascript
/NOTE/
	Collation Behavior
  	 1. 可以在创建视图时为视图指定默认排序规则。如果没有指定排序规则，视图的默认排序规则是“simple”二进制比较排序规则。 也就是说，视图不继承集合的默认排序规则。
     2. 视图上的字符串比较使用视图的默认排序规则。尝试更改或覆盖视图默认排序规则的操作将失败并报错。
     3. 如果从另一个视图创建视图，则不能指定与源视图的排序规则不同的排序规则。
		 4.  如果执行涉及多个视图的聚合，例如$lookup或$graphLookup，视图必须具有相同的排序规则。
```

####  查询视图

下面的示例查询视图。为清楚起见，[`$unset`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/unset/#mongodb-pipeline-pipe.-unset)阶段从输出中删除了`_id`字段。

```javascript
db.graduateStudents.aggregate(
   [
      { $sort: { name: 1 } },
      { $unset: [ "_id" ] }
   ]
)
```

 在对输出进行排序时， [`$sort`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort) 阶段使用排序规则对大写字母在小写字母之前进行排序。

```javascript
[
  { sID: 18020, name: 'Harley', year: 5, score: 2.8 },
  { sID: 17301, name: 'harley', year: 6, score: 3.1 }
]
```

#### 获取授予当前用户的角色的医疗信息。

从 MongoDB 7.0 开始，您可以使用新的[`USER_ROLES`](https://www.mongodb.com/docs/v7.0/reference/aggregation-variables/#mongodb-variable-variable.USER_ROLES) 系统变量返回用户[角色。](https://www.mongodb.com/docs/v7.0/core/authorization/#std-label-roles)

本节中的示例显示用户对包含医疗信息的集合中的字段具有有限的访问权限。该示例使用一个视图，该视图从系统变量中读取当前用户角色`USER_ROLES`并根据角色隐藏字段。

该示例创建这些用户：

- `James`具有`Billing`可以访问`creditCard` 字段的角色。
- `Michelle`具有`Provider`可以访问 `diagnosisCode`字段的角色。

执行以下步骤来创建角色、用户、集合和视图：

该示例创建这些用户：

* `James`具有`Billing`可以访问`creditCard` 字段的角色。
* `Michelle`具有`Provider`可以访问 `diagnosisCode`字段的角色。

执行以下步骤来创建角色、用户、集合和视图：

1. 创建角色

   执行:

   ```
   db.createRole( { role: "Billing", privileges: [ { resource: { db: "test",
      collection: "medicalView" }, actions: [ "find" ] } ], roles: [ ] } )
   db.createRole( { role: "Provider", privileges: [ { resource: { db: "test",
      collection: "medicalView" }, actions: [ "find" ] } ], roles: [ ] } )
   ```

2. 创建用户

   创建指定的用户`James`并`Michelle`具有所需的角色。将数据库替换`test`为您的数据库名称。

   ```
   db.createUser( {
      user: "James",
      pwd: "js008",
      roles: [
         { role: "Billing", db: "test" }
      ]
   } )
   
   db.createUser( {
      user: "Michelle",
      pwd: "me009",
      roles: [
         { role: "Provider", db: "test" }
      ]
   } )
   ```

3. 创建集合

   执行:

   ```
   db.medical.insertMany( [
      {
         _id: 0,
         patientName: "Jack Jones",
         diagnosisCode: "CAS 17",
         creditCard: "1234-5678-9012-3456"
      },
      {
         _id: 1,
         patientName: "Mary Smith",
         diagnosisCode: "ACH 01",
         creditCard: "6541-7534-9637-3456"
      }
   ] )
   ```

4. 创建视图

   要使用系统变量，请添加`$$`到变量名称的开头。将`USER_ROLES`系统变量指定为`$$USER_ROLES`。

   该视图从系统变量中读取当前用户角色`USER_ROLES` ，并根据角色隐藏字段。

   执行：

   ````
   db.createView(
      "medicalView", "medical",
      [ {
         $set: {
            "diagnosisCode": {
               $cond: {
                  if: { $in: [
                     "Provider", "$$USER_ROLES.role"
                  ] },
                  then: "$diagnosisCode",
                  else: "$$REMOVE"
               }
         }
      },
      }, {
         $set: {
            "creditCard": {
               $cond: {
                  if: { $in: [
                     "Billing", "$$USER_ROLES.role"
                  ] },
                  then: "$creditCard",
                  else: "$$REMOVE"
               }
            }
         }
      } ]
   )
   ````

   视图示例：

   - 包括`diagnosisCode`具有该角色的用户的字段 `Provider`。
   - 包括`creditCard`具有该角色的用户的字段 `Billing`。
   - 使用[`$set`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/set/#mongodb-pipeline-pipe.-set)管道阶段并[`$$REMOVE`](https://www.mongodb.com/docs/v7.0/reference/aggregation-variables/#mongodb-variable-variable.REMOVE)根据查询视图的用户是否具有 中返回的匹配角色来隐藏字段 `$$USER_ROLES.role`。

执行以下步骤来检索可访问的信息 `James`：

1. 以James身份登录

   执行:

   ```
   db.auth( "James", "js008" )
   ```

2. 检索文档

   执行:

   ```
   db.medicalView.find()
   ```

3. 检查文件

   `James`具有`Billing`角色并查看以下文档，其中包含该`creditCard`字段但不包含该 `diagnosisCode`字段：

   ```
   [
      {
         _id: 0, patientName: 'Jack Jones',
         creditCard: '1234-5678-9012-3456'
      },
      {
         _id: 1, patientName: 'Mary Smith',
         creditCard: '6541-7534-9637-3456'
      }
   ]
   ```

执行以下步骤来检索可访问的信息 `Michelle`：

1. 以Michelle身份登录

   执行:

   ```
   db.auth( "Michelle", "me009" )
   ```

2. 检索文档

   执行:

   ```
   db.medicalView.find()
   ```

3. 检查文件

   `Michelle`具有`Provider`角色并查看以下文档，其中包含该`diagnosisCode`字段但不包含该 `creditCard`字段：

   ```
   [
      { _id: 0, patientName: 'Jack Jones',
         diagnosisCode: 'CAS 17' },
      { _id: 1, patientName: 'Mary Smith',
         diagnosisCode: 'ACH 01' }
   ]
   ```

#### 检索授予当前用户的角色的预算文档。

从 MongoDB 7.0 开始，您可以使用新的[`USER_ROLES`](https://www.mongodb.com/docs/v7.0/reference/aggregation-variables/#mongodb-variable-variable.USER_ROLES) 系统变量返回用户[角色。](https://www.mongodb.com/docs/v7.0/core/authorization/#std-label-roles)

本部分中的场景显示具有各种角色的用户，这些用户对包含预算信息的集合中的文档具有有限的访问权限。

该场景展示了 的一种可能用途`USER_ROLES`。该`budget` 集合包含带有名为 的字段的文档`allowedRoles`。正如您将在以下场景中看到的，您可以编写查询来比较字段中找到的用户角色`allowedRoles`与系统变量返回的角色`USER_ROLES`。

> 笔记:
>
> 对于另一个`USER_ROLES`示例场景，请参阅 [检索授予当前用户的角色的医疗信息](https://www.mongodb.com/docs/v7.0/core/views/create-view/#std-label-create-view-user-roles-system-variable-medical-example)。该示例不会将用户角色存储在文档字段中，如以下示例所示。

对于本节中的预算场景，请执行以下步骤来创建角色、用户和`budget`集合：

1. 创建角色

   执行:

   ````
   db.createRole( { role: "Marketing", roles: [], privileges: [] } )
   db.createRole( { role: "Sales", roles: [], privileges: [] } )
   db.createRole( { role: "Development", roles: [], privileges: [] } )
   db.createRole( { role: "Operations", roles: [], privileges: [] } )
   ````

2. 创建用户

   创建指定的用户`John`并`Jane`具有所需的角色。将数据库替换`test`为您的数据库名称。

   ```
   db.createUser( {
      user: "John",
      pwd: "jn008",
      roles: [
         { role: "Marketing", db: "test" },
         { role: "Development", db: "test" },
         { role: "Operations", db: "test" },
         { role: "read", db: "test" }
      ]
   } )
   
   db.createUser( {
      user: "Jane",
      pwd: "je009",
      roles: [
         { role: "Sales", db: "test" },
         { role: "Operations", db: "test" },
         { role: "read", db: "test" }
      ]
   } )
   ```

3. 创建集合

   执行:

   ```
   db.budget.insertMany( [
      {
         _id: 0,
         allowedRoles: [ "Marketing" ],
         comment: "For marketing team",
         yearlyBudget: 15000
      },
      {
         _id: 1,
         allowedRoles: [ "Sales" ],
         comment: "For sales team",
         yearlyBudget: 17000,
         salesEventsBudget: 1000
      },
      {
         _id: 2,
         allowedRoles: [ "Operations" ],
         comment: "For operations team",
         yearlyBudget: 19000,
         cloudBudget: 12000
      },
      {
         _id: 3,
         allowedRoles: [ "Development" ],
         comment: "For development team",
         yearlyBudget: 27000
      }
   ] )
   ```

执行以下步骤创建视图并检索可访问的文档`John`：

1. 创建视图

   要使用系统变量，请添加`$$`到变量名称的开头。将`USER_ROLES`系统变量指定为`$$USER_ROLES`。

   执行:

   ```
   db.createView(
      "budgetView", "budget",
      [ {
         $match: {
            $expr: {
               $not: {
                  $eq: [ { $setIntersection: [ "$allowedRoles", "$$USER_ROLES.role" ] }, [] ]
               }
            }
         }
      } ]
   )
   ```

   如果无法创建视图，请确保您以具有创建视图权限的用户身份登录。

   上一个示例从`budget` 集合中返回与运行该示例的用户所具有的至少一个角色相匹配的文档。为此，该示例 [`$setIntersection`](https://www.mongodb.com/docs/v7.0/reference/operator/aggregation/setIntersection/#mongodb-expression-exp.-setIntersection)返回`budget`文档`allowedRoles`字段与用户角色集之间的交集`$$USER_ROLES`不为空的文档。

2. 以John身份登录

   执行:

   ```
   db.auth( "John", "jn008" )
   ```

3. 检索文档

   执行:

   ```
   db.budgetView.find()
   ```

4. 检查文件

   `John`具有`Marketing`、`Operations`、 和`Development` 角色，并查看这些文档：

   ```
   [
      {
         _id: 0,
         allowedRoles: [ 'Marketing' ],
         comment: 'For marketing team',
         yearlyBudget: 15000
      },
      {
         _id: 2,
         allowedRoles: [ 'Operations' ],
         comment: 'For operations team',
         yearlyBudget: 19000,
         cloudBudget: 12000
      },
      {
         _id: 3,
         allowedRoles: [ 'Development' ],
         comment: 'For development team',
         yearlyBudget: 27000
      }
   ]
   ```

执行以下步骤来检索 Jane 可访问的文档：

1. 登录身份`Jane`

   执行:

   ```
   db.auth( "Jane", "je009" )
   ```

2. 检索文档

   执行:

   ```
   db.budgetView.find()
   ```

3. 检查文件

   `Jane`具有`Sales`和`Operations`角色，并查看这些文档：

   ```
   [
      {
         _id: 1,
         allowedRoles: [ 'Sales' ],
         comment: 'For sales team',
         yearlyBudget: 17000,
         salesEventsBudget: 1000
      },
      {
         _id: 2,
         allowedRoles: [ 'Operations' ],
         comment: 'For operations team',
         yearlyBudget: 19000,
         cloudBudget: 12000
      }
   ]
   ```

   > 笔记:
   >
   > 在分片集群上，另一个服务器节点可以代表用户在分片上运行查询。在这些查询中，`USER_ROLES`仍然填充用户的角色。

#### 多个数据库中具有相同名称的角色

多个数据库可以具有同名的角色。如果创建视图并在视图中引用特定角色，则应该同时指定`db`数据库名称字段和`role`字段，或者指定`_id`包含数据库名称和角色的字段。

以下示例返回分配给 的角色`Jane`，该角色具有不同名称的角色。该示例返回`_id`、`role`和`db`数据库名称：

1. 登录身份`Jane`

   执行:

   ```
   db.auth( "Jane", "je009" )
   ```

2. 检索文档

   执行:

   ```
   db.budget.findOne( {}, { myRoles: "$$USER_ROLES" } )
   ```

3. 检查文件

   示例输出，显示数组中的`_id`、`role`和`db` 数据库名称`myRoles`：

   ```
   {
      _id: 0,
      myRoles: [
         { _id: 'test.Operations', role: 'Operations', db: 'test' },
         { _id: 'test.Sales', role: 'Sales', db: 'test' },
         { _id: 'test.read', role: 'read', db: 'test' }
      ]
   }
   ```

## 行为

下面几节描述了视图创建和查询的行为。



###  聚合优化

 查询视图时:

-  [`db.collection.find()`](https://www.mongodb.com/docs/v6.0/reference/method/db.collection.find/#mongodb-method-db.collection.find) 的Query `filter`, `projection`, `sort`, `skip`, `limit`和其他操作被转换为等效的[aggregation pipeline stages](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation-pipeline/#std-label-aggregation-pipeline-operator-reference)。
-  `MongoDB`将客户端查询附加到底层管道，并将该组合管道的结果返回给客户端。 MongoDB可以对合并管道应用[聚合管道优化](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline-optimization/)。
-  [聚合管道优化器](https://www.mongodb.com/docs/v6.0/core/aggregation-pipeline-optimization/)重新塑造视图聚合管道阶段，以提高性能。优化不会改变查询结果。



### 资源锁定

[`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView)  在操作期间获取指定集合或视图上的排他锁。对集合的所有后续操作都必须等待，直到 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 释放锁。 [`db.createView()`](https://www.mongodb.com/docs/v6.0/reference/method/db.createView/#mongodb-method-db.createView) 通常在短时间内持有此锁。

 创建视图需要在系统上获得一个额外的排他锁在数据库中的`system.views`集合中。该锁阻止在数据库中创建或修改视图，直到命令执行完成。





原文链接：https://www.mongodb.com/docs/v6.0/core/views/create-view/

译者：杨帅