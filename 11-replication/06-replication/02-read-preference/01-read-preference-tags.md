# 阅读偏好标签集列表[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-tags/#read-preference-tag-set-lists)

如果一个或多个副本集成员与关联 [`tags`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)，您可以在读取首选项中指定一个标记集列表（标记集数组）以定位这些成员。

要使用标签[配置](https://www.mongodb.com/docs/manual/reference/replica-configuration/#std-label-replica-set-configuration-document)成员，请设置[`members[n\].tags`](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)为包含标签名称和值对的文档。标签的值必须是字符串。

```
{ "<tag1>": "<string1>", "<tag2>": "<string2>",... }
```

然后，您可以在读取首选项中包含一个标记集列表，以定位标记的成员。标签集列表是一组标签集，其中每个标签集包含一个或多个标签/值对。

```
[ { "<tag1>": "<string1>", "<tag2>": "<string2>",... }, ... ]
```

为了找到副本集成员，MongoDB 连续尝试每个文档，直到找到匹配项。看[标签匹配顺序](https://www.mongodb.com/docs/manual/core/read-preference-tags/#std-label-read-pref-order-matching)了解详情。

例如，如果次要成员具有以下内容 [`members[n\].tags`：](https://www.mongodb.com/docs/manual/reference/replica-configuration/#mongodb-rsconf-rsconf.members-n-.tags)

```
{ "region": "South", "datacenter": "A" }
```



然后，以下标签集列表可以将读取操作定向到上述次级（或具有相同标签的其他成员）：

```
[ { "region": "South", "datacenter": "A" }, { } ]     // Find members with both tag values. If none are found, read from any eligible member.
[ { "region": "South" }, { "datacenter": "A" }, { } ] // Find members with the specified region tag. Only if not found, then find members with the specified datacenter tag. If none are found, read from any eligible member.
[ { "datacenter": "A" }, { "region": "South" }, { } ] // Find members with the specified datacenter tag. Only if not found, then find members with the specified region tag. If none are found, read from any eligible member.
[ { "region": "South" }, { } ]                        // Find members with the specified region tag value. If none are found, read from any eligible member.
[ { "datacenter": "A" }, { } ]                        // Find members with the specified datacenter tag value. If none are found, read from any eligible member.
[ { } ]                                               // Find any eligible member.
```



## 标签匹配顺序[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-tags/#order-of-tag-matching)

如果标签集列表包含多个文档，MongoDB 会连续尝试每个文档，直到找到匹配项。找到匹配项后，该标记集将用于查找所有符合条件的匹配成员，而忽略其余标记集。如果没有成员与任何标记集匹配，则读取操作返回错误。



## 提示

为避免在没有成员匹配任何标记规范时出现错误，您可以添加一个空文档`{ }`作为标记集列表的最后一个元素，以从任何符合条件的成员处读取。

例如，考虑以下包含三个标签集的标签集列表：

```
[ { "region": "South", "datacenter": "A" },  { "rack": "rack-1" }, { } ]
```

首先，MongoDB 尝试查找同时标记有`"region": "South"`和的成员`"datacenter": "A"`。

```
{ "region": "South", "datacenter": "A" }
```

- 如果找到一个成员，则不考虑剩余的标记集。相反，MongoDB 使用此标记集来查找所有符合条件的成员。

- 否则，MongoDB 会尝试查找具有第二个文档中指定标签的成员

  ```
  { "rack": "rack-1" }
  ```

  - 如果发现某个成员被标记，则不考虑剩余的标记集。相反，MongoDB 使用此标记集来查找所有符合条件的成员。

  - 否则，考虑第三个文件。

    ```
    { }
    ```

    空文档匹配任何符合条件的成员。

## 标签集列表和阅读偏好模式[![img](https://www.mongodb.com/docs/manual/assets/link.svg)](https://www.mongodb.com/docs/manual/core/read-preference-tags/#tag-set-list-and-read-preference-modes)

标签与 mode 不兼容，一般来说，仅在为读取操作[选择](https://www.mongodb.com/docs/manual/core/read-preference-mechanics/#std-label-replica-set-read-preference-behavior-member-selection)集合 的[次要](https://www.mongodb.com/docs/manual/reference/glossary/#std-term-secondary)成员[`primary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primary)时才适用。但是， 读取模式与标签集列表结合使用时，会选择网络延迟最低的匹配成员。该成员可能是主要成员或次要成员。[`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest)

| 模式                                                         | 笔记                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [`primaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-primaryPreferred) | 指定的标签集列表仅在选择符合条件的次级时适用。     |
| [`secondary`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondary) | 指定的标签集列表始终适用。                         |
| [`secondaryPreferred`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-secondaryPreferred) | 指定的标签集列表仅在选择符合条件的次级时适用。     |
| [`nearest`](https://www.mongodb.com/docs/manual/core/read-preference/#mongodb-readmode-nearest) | 指定的标签集列表适用于选择主要还是符合条件的次要。 |

有关[模式](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference-modes)和标签集列表之间交互的信息，请参阅 [特定的阅读首选项模式文档。](https://www.mongodb.com/docs/manual/core/read-preference/#std-label-replica-set-read-preference-modes)

有关配置标签集列表的信息，请参阅 [配置副本集标签集](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/)教程。

←  [阅读偏好](https://www.mongodb.com/docs/manual/core/read-preference/)[阅读偏好`maxStalenessSeconds`](https://www.mongodb.com/docs/manual/core/read-preference-staleness/) →

原文链接 -https://docs.mongodb.com/manual/core/read-preference-tags/ 

译者：陆文龙

