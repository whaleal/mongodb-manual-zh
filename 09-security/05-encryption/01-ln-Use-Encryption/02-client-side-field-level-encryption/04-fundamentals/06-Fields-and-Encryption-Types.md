## 字段和加密类型

本页描述了 MongoDB 用于执行客户端字段级加密 (CSFLE) 的加密类型。为了执行 CSFLE，MongoDB 使用以下类型的加密算法：

- [确定性加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-deterministic-encryption)
- [随机加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-random-encryption)

## 确定性加密

确定性加密算法确保每次执行算法时给定的输入值始终加密为*相同的输出值。*虽然确定性加密为读取操作提供了更好的支持，但基数较低的加密数据容易受到频率分析恢复的影响。

对于读取操作中*未*使用的敏感字段，应用程序可以使用[随机加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-random-encryption)以改进对频率分析恢复的保护。

> 重要的
>
> **不支持确定性加密对象和数组**
>
> 确定性加密不支持加密整个对象和数组。要了解更多信息并查看示例，请参阅 [支持加密对象和数组。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-encrypting-objects-support)

### 查询确定性加密字段上的文档

您可以使用标准的 MongoDB 驱动程序查询确定性加密的字段，并且[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)方法。

要查看确定性加密字段上所有支持的查询运算符的完整列表，请参阅 [自动加密支持的操作](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)

要了解有关加密数据读取的更多信息，请参阅 [加密读取。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-encrypted-reads-diagram)

> 笔记:
>
> **从未配置 CSFLE 的客户端查询**
>
> 当您使用未配置为使用客户端字段级加密 (CSFLE) 的客户端查询加密字段时，查询将返回空值。未配置 CSFLE 的客户端无法查询加密字段。

## 随机加密

随机加密算法确保每次执行算法时给定的输入值总是加密为*不同的输出值。*虽然随机加密提供了最强的数据机密性保证，但它也阻止了对必须在加密字段上运行以评估查询的任何读取操作的支持。

*对于读取操作中使用的*敏感字段，应用程序必须使用[确定性加密](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-deterministic-encryption)用于改进对加密字段的读取支持。

### 支持加密对象和数组

仅支持加密整个对象或数组 [随机加密。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-random-encryption)

例如，考虑以下文档：

```
{
   "personal_information" : {
      "ssn" : "123-45-6789",
      "credit_score" : 750,
      "credit_cards" : [ "1234-5678-9012-3456", "9876-5432-1098-7654"]
   },
   "phone_numbers" : [ "(212) 555-0153" ]
}
```

使用随机加密算法加密`personal_information`和字段加密*整个*对象。虽然这会保护嵌套在这些字段下的所有字段，但也会阻止对这些嵌套字段进行查询。`phone_numbers`

要了解有关支持的加密操作的更多信息，请参阅 [支持的自动加密操作。](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)

### 查询随机加密字段上的文档

您不能直接查询随机加密字段上的文档。但是，您可以使用另一个字段来查找包含随机加密字段数据的近似值的文档。

例如，考虑以下字段`ssn`随机加密的文档：

```
{
   "_id": "5d6ecdce70401f03b27448fc",
   "name": "Jon Doe",
   "ssn": 241014209,
   "bloodType": "AB+",
   "medicalRecords": [
       {
           "weight": 180,
           "bloodPressure": "120/80"
       }
   ],
   "insurance": {
       "provider": "MaestCare",
       "policyNumber": 123142
   }
}
```

`ssn`您可以添加另一个名为 的纯文本字段，而不是查询该字段`last4ssn`，该字段包含该字段的最后 4 位数字`ssn` 。然后，您可以在该字段上查询`last4ssn`作为以下内容的代理 `ssn`：

```
{
   "_id": "5d6ecdce70401f03b27448fc",
   "name": "Jon Doe",
   "ssn": 241014209,
   "last4ssn": 4209,
   "bloodType": "AB+",
   "medicalRecords": [
      {
            "weight": 180,
            "bloodPressure": "120/80"
      }
   ],
   "insurance": {
      "provider": "MaestCare",
      "policyNumber": 123142
   }
}
```







译者：韩鹏帅

原文：[Fields and Encryption Types](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/)
