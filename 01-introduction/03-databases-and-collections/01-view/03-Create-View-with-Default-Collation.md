#  创建一个默认排序规则的视图

[`Collation`](https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-manual-collation) 允许您指定特定于语言的字符串比较规则， 例如字母大小写和重音符号的规则。

本页说明如何为视图指定默认排序规则。



## 例子

 使用以下文档创建一个`places`集合:

```javascript
db.places.insertMany([
   { _id: 1, category: "café" }
   { _id: 2, category: "cafe" }
   { _id: 3, category: "cafE" }
])
```

 下面的操作创建一个视图，在视图级别指定排序规则:

```javascript
db.createView(
   "placesView",
   "places",
   [ { $project: { category: 1 } } ],
   { collation: { locale: "fr", strength: 1 } }
)
```

下面的操作使用视图的排序规则:

```javascript
db.placesView.count( { category: "cafe" } )
```

 操作返回结果`3`。

```javascript
/NOTE/
	排序行为
  	1.  可以在创建视图时为视图指定默认排序规则,如果没有指定排序规则，视图的默认排序规则是"simple" 二进制比较排序规则,就是说，视图不继承集合的默认排序规则。
		2.  视图上的字符串比较使用视图的默认排序规则.尝试更改或覆盖视图默认排序规则的操作将失败并报错。
		3.  如果从另一个视图创建视图，则不能指定与源视图的排序规则不同的排序规则。
    4.  如果执行涉及多个视图的聚合， 例如$lookup或$graphLookup，视图必须具有相同的排序规则。


```





原文链接：https://www.mongodb.com/docs/v6.0/core/views/specify-collation/

译者：杨帅