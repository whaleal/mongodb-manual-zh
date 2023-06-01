# CSFLE 加密模式

## 概述

> **企业版特证**
>
> 字段级加密的自动特性仅在 MongoDB Enterprise 4.2 或更高版本以及 MongoDB Atlas 4.2 或更高版本的集群中可用

*4.2版中的新功能*。

加密模式包含用户指定的规则，这些规则标识哪些字段必须加密以及如何加密这些字段。应用程序必须使用一个严格的子集指定自动加密规则[JSON Schema Draft 4 标准语法](https://tools.ietf.org/html/draft-zyp-json-schema-04)以及以下特定于加密的关键字：

- [加密](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encyption-schemas-encrypt-keyword) 指定加密当前字段时要使用的加密选项。
- [加密元数据](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-field-level-encryption-encryptMetadata-keyword)指定可继承的加密选项。

对于 MongoDB 4.2+ shell，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo)构造函数创建数据库连接，自动加密规则包含在 Client-Side Field Level Encryption [配置对象](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts)中。 有关示例，请参阅[连接到启用了自动客户端加密的集群。](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-mongo-connection-automatic-client-side-encryption-enabled)

对于官方 MongoDB 4.2+ 兼容驱动程序，使用驱动程序特定的数据库连接构造函数 ( `MongoClient`) 创建数据库连接，自动加密规则包含在客户端字段级加密配置对象中。要了解有关 CSFLE 特定 `MongoClient`选项的更多信息，请参阅[mongo 客户端](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)页面。

> 重要的:
>
> **不要在加密模式中指定文档验证关键字**
>
> 不要 在自动加密规则中指定文档验证关键字**。**要定义文档验证规则，请配置 [模式验证。](https://www.mongodb.com/docs/manual/core/schema-validation/#std-label-schema-validation-overview)

## 定义

`encrypt`

*目的*

```
"bsonType" : "object",
"properties" : {
  "<fieldName>" : {
    "encrypt" : {
      "algorithm" : "<string>",
      "bsonType" : "<string>" | [ "<string>" ],
      "keyId" : [ <UUID> ]
    }
  }
}
```

表示`<fieldName>`必须加密。该`encrypt` 对象具有以下要求：

- `encrypt`对象中不能有任何同级字段 `<fieldName>`。`encrypt`必须是对象的唯一子对象 `<fieldName>`。
- `encrypt``items`不能在或关键字的任何子模式中指定 `additionalItems`。具体来说，自动客户端字段级加密不支持加密数组的单个元素。

该对象**只能**`encrypt`包含以下字段：

```
algorithm

bsonType

keyId
```

在发出自动加密的读取或写入操作时，在对象中包含任何其他字段`encrypt`会导致错误

如果[`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.keyId)或者 [`algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)被省略时， [为 CSFLE 安装和配置 mongocryptd](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-mongocryptd)检查父字段的完整树并尝试从最近的构建这些选项 [`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)指定选项的对象。[`bsonType`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.bsonType)不能被继承，*可能*需要根据值 [`algorithm`.](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)

如果无法使用为对象指定的字段和任何必需的 继承密钥`mongocryptd`构造完整对象，则自动加密失败并返回错误。`encrypt``encryptMetadata`

**encrypt.algorithm**

指示在加密 的值时要使用的加密算法`<fieldName>`。*仅*支持以下算法 ：

- `AEAD_AES_256_CBC_HMAC_SHA_512-Random`
- `AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`

有关加密算法的完整文档，请参阅 [字段和加密类型。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-reference-encryption-algorithms)

如果省略，[Install and Configure mongocryptd for CSFLE](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-csfle-reference-mongocryptd)将检查父字段的完整树以查找最近的[`encryptMetadata.algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.algorithm)键并继承该值。如果没有父母 [`algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.algorithm)存在，自动字段级加密失败并返回错误。

* 如果`encrypt.algorithm`或其继承值为 `AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`，则该 `encrypt`对象*需要*[`encrypt.bsonType`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.bsonType)场地。
* 如果`encrypt.algorithm`或其继承值为 `AEAD_AES_256_CBC_HMAC_SHA_512-Random`，则该`encrypt`对象*可能*包括 [`encrypt.bsonType`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.bsonType)场地。

**encrypt.bsonType**

*字符串 | 字符串数组*

被加密字段的[BSON 类型](https://www.mongodb.com/docs/manual/reference/bson-types/#std-label-bson-types)。如果需要[`encrypt.algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)是 `AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`

如果[`encrypt.algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)或其继承值是 `AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`，`bsonType` *必须*指定*单一*类型。 `bsonType`不**支持** 以下任何具有确定性加密算法的 BSON 类型：

- `double`
- `decimal128`
- `bool`
- `object`
- `array`
- `javascriptWithScope`（*已弃用*）

如果[`encrypt.algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)或其继承值是 `AED_AES_256_CBC_HMAC_SHA_512-Random`,`bsonType`是可选的，可以指定支持的 bson 类型的数组。对于带有`bsonType`of`array`或 的字段`object`，客户端加密*整个*数组或对象而不是它们的单个元素。

`'encrypt.bsonType`不**支持**以下类型不管[`encrypt.algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)或其继承值：

- `minKey`
- `maxKey`
- `null`
- `undefined`

**encrypt.keyId**

*单个 UUID 数组*

用于加密字段值的数据加密密钥的 UUID。UUID 是一个 BSON[二进制数据](http://bsonspec.org/spec.html)子类型的元素`4`。

在数组中指定*一个字符串。*

如果省略，[Install and Configure mongocryptd for CSFLE](https://www.mongodb.com/docs/manual/core/csfle/reference/mongocryptd/#std-label-mongocryptd)将检查父字段的完整树以查找最近的 [`encryptMetadata.keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.keyId)键并继承该值。如果没有父母 [`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.keyId)存在，自动字段级加密失败并返回错误。

这[`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.keyId)或其继承值*必须存在于作为自动加密*[配置选项](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts) 的一部分指定的 Key Vault 集合中 。如果指定的数据加密密钥不存在，则自动加密失败。

官方 MongoDB 4.2+ 兼容驱动程序对指定 UUID 有特定于语言的要求。请参阅 [驱动程序文档](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-field-level-encryption-drivers) 以获取有关实现客户端字段级加密的完整文档。

**encryptMetadata**

```
{
  "bsonType" : "object",
  "encryptMetadata" : {
    "algorithm" : "<string>",
    "keyId" : [ <UUID> ]
  },
  "properties" : {
    "encrypt" : {}
  }
}
```

定义加密选项[`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt) 嵌套在兄弟中的对象`properties`可以继承。如果 [`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)缺少支持加密所需的选项，`mongocryptd`搜索整个父对象树以找到一个[`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)指定缺失选项的对象。

`encryptMetadata`必须在带有 的子模式中指定`bsonType: "object"`。`encryptMetadata`不能指定给`items`或`additionalItems`关键字的任何子模式。具体来说，自动客户端字段级加密不支持加密数组的单个元素。

该对象*只能*`encryptMetadata`包含以下字段。在发出自动加密的读取或写入操作时，在对象中包含任何其他字段会导致错误：`encrypt`

- [`algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.algorithm)
- [`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.keyId)

**encryptMetadata.algorithm**

*String*

用于加密给定字段的加密算法。如果 [`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)对象丢失 [`algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.algorithm)字段，`mongocryptd` 搜索整个父对象树以找到一个 [`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)指定的对象 [`encryptMetadata.algorithm`.](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.algorithm)

*仅*支持以下算法：

- `AEAD_AES_256_CBC_HMAC_SHA_512-Random`
- `AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`

有关加密算法的完整文档，请参阅 [字段和加密类型。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-algorithms)

如果指定`AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic`，任何`encrypt`继承该值的对象都*必须*指定 [`encrypt.bsonType`.](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.bsonType)

`encryptMetadata.keyId`

*单个 UUID 数组*

数据加密密钥的 UUID。UUID 是一个 BSON[二进制数据](http://bsonspec.org/spec.html)子类型的元素`4`。

在数组中指定*一个字符串。*

如果[`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)对象丢失 [`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt.keyId)字段，`mongocryptd` 搜索整个父对象树以找到一个[`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)指定的对象[`encryptMetadata.keyId`.](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.keyId)

数据加密密钥*必须存在于作为自动加密*[配置选项](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)的一部分指定的 Key Vault 集合中。指定的配置选项*还*必须包括对用于创建数据密钥的[密钥管理服务 (KMS)](https://www.mongodb.com/docs/manual/core/csfle/reference/kms-providers/#std-label-field-level-encryption-kms)和客户主密钥 (CMK)的适当访问 。如果数据加密密钥不存在*或*客户端无法使用指定的 KMS 和 CMK 解密密钥，则自动加密失败。

官方 MongoDB 4.2+ 兼容驱动程序对指定 UUID 有特定于语言的要求。请参阅 [驱动程序文档](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-field-level-encryption-drivers) 以获取有关实现客户端字段级加密的完整文档。

## 例子

### 加密模式 - 多个字段

考虑一个集合`MedCo.patients`，其中每个文档都具有以下结构：

```
{
  "fname" : "<String>",
  "lname" : "<String>",
  "passportId" : "<String>",
  "bloodType" : "<String>",
  "medicalRecords" : [
    {<object>}
  ],
  "insurance" : {
    "policyNumber" : "<string>",
    "provider" : "<string>"
  }
}
```

以下字段包含可以查询的个人身份信息 (PII)：

* `passportId`
* `bloodType`
* `insurance.policyNumber`
* `insurance.provider`

[确定性](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-deterministic)加密算法 保证值的加密输出保持静态。这允许查询特定值以增加对频率分析恢复的敏感性为代价返回有意义的结果。因此，确定性加密算法同时满足数据的加密和可查询性要求

以下字段包含可能永远不会被查询的受法律保护的个人身份信息 (PII)：

* `medicalRecords`

[随机](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-random)加密算法保证了一个值的加密输出始终是唯一的。这可以防止对特定字段值的查询返回有意义的结果，同时支持对字段内容的最高可能保护。因此，随机加密算法同时满足了数据的加密和可查询性要求。

以下模式指定了满足上述集合要求的自动加密规则`MedCo.patients`：

```
{
  "MedCo.patients" : {
    "bsonType" : "object",
    "properties" : {
      "passportId" : {
        "encrypt" : {
          "keyId" : [UUID("bffb361b-30d3-42c0-b7a4-d24a272b72e3")],
          "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          "bsonType" : "string"
        }
      },
      "bloodType" : {
        "encrypt" : {
          "keyId" : [UUID("bffb361b-30d3-42c0-b7a4-d24a272b72e3")],
          "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          "bsonType" : "string"
        }
      },
      "medicalRecords" : {
        "encrypt" : {
          "keyId" : [UUID("f3821212-e697-4d65-b740-4a6791697c6d")],
          "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          "bsonType" : "array"
        }
      },
      "insurance" : {
        "bsonType" : "object",
        "properties" : {
          "policyNumber" : {
            "encrypt" : {
              "keyId" : [UUID("bffb361b-30d3-42c0-b7a4-d24a272b72e3")],
              "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
              "bsonType" : "string"
            }
          },
          "provider" : {
            "encrypt" : {
              "keyId" : [UUID("bffb361b-30d3-42c0-b7a4-d24a272b72e3")],
              "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
              "bsonType" : "string"
            }
          }
        }
      }
    }
  }
}
```

以上自动加密规则将`passportId`、 `bloodType`、`insurance.policyNumber`、`insurance.provider`、 和`medicalRecords`字段标记为加密。

- 、、和 字段需要使用指定密钥进行确定性加密`passportId`。`bloodType``insurance.policyNumber``provider`
- 该`medicalRecords`字段需要使用指定密钥进行随机加密。

虽然客户端字段级加密不支持加密单个数组元素，但随机加密支持加密整个 *数组*字段而不是字段中的单个元素。示例自动加密规则为 `medicalRecords`字段指定随机加密以加密整个数组。如果指定了自动加密规则[`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)或者 [`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)在`medicalRecords.items`或 中`medicalRecords.additionalItems`，自动字段级加密失败并返回错误。

官方 MongoDB 4.2+ 兼容驱动程序，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，以及 4.2 或更高版本的旧版`mongo`shell 需要指定自动加密规则作为创建数据库连接对象的一部分：

- 对于`mongosh`，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo) 构造函数创建数据库连接。`schemaMap`为参数的key 指定自动加密规则[`AutoEncryptionOpts`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts)。 有关完整示例，请参阅 [连接到启用了自动客户端加密的集群。](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-mongo-connection-automatic-client-side-encryption-enabled)
- 对于官方 MongoDB 4.2+ 兼容驱动程序，使用驱动程序特定的数据库连接构造函数 ( `MongoClient`) 创建数据库连接，自动加密规则包含在客户端字段级加密配置对象中。参考[驱动程序 API 参考](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-field-level-encryption-drivers)以获得更完整的文档和教程。

对于所有客户端，指定给客户端字段级加密参数的`keyVault`和*必须*授予对自动加密规则中指定的数据加密密钥*和*用于加密数据加密密钥的客户主密钥的访问权限。`kmsProviders`

### 加密模式 - 具有继承性的多个字段

考虑一个集合`MedCo.patients`，其中每个文档都具有以下结构：

```
{
  "fname" : "<String>",
  "lname" : "<String>",
  "passportId" : "<String>",
  "bloodType" : "<String>",
  "medicalRecords" : [
    {<object>}
  ],
  "insurance" : {
    "policyNumber" : "<string>",
    "provider" : "<string>"
  }
}
```

以下字段包含可能被查询的私有数据：

- `passportId`
- `bloodType`
- `insurance.policyNumber`
- `insurance.provider`

[确定性](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-deterministic)加密算法 保证值的加密输出保持静态。这允许查询特定值以增加对频率分析恢复的敏感性为代价返回有意义的结果。因此，确定性加密算法同时满足数据的加密和可查询性要求。

以下字段包含可能永远不会被查询的私有数据：

- `medicalRecords`

[随机](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-field-level-encryption-random)加密算法保证了一个值的加密输出始终是唯一的。这可以防止对特定字段值的查询返回有意义的结果，同时支持对字段内容的最高可能保护。因此，随机加密算法同时满足了数据的加密和可查询性要求。

以下模式指定满足集合加密要求的自动加密规则`MedCo.patients`：

```
{
  "MedCo.patients" : {
    "bsonType" : "object",
    "encryptMetadata" : {
      "keyId" : [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
      "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    },
    "properties" : {
      "passportId" : {
        "encrypt" : {
          "bsonType" : "string"
        }
      },
      "bloodType" : {
        "encrypt" : {
          "bsonType" : "string"
        }
      },
      "medicalRecords" : {
        "encrypt" : {
          "keyId" : [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
          "algorithm" : "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          "bsonType" : "array"
        }
      },
      "insurance" : {
        "bsonType" : "object",
        "properties" : {
          "policyNumber" : {
            "encrypt" : {
              "bsonType" : "string"
            }
          },
          "provider" : {
            "encrypt" : {
              "bsonType" : "string"
            }
          }
        }
      }
    }
  }
}
```

以上自动加密规则将`passportId`、 `bloodType`、`insurance.policyNumber`、`insurance.provider`、 和`medicalRecords`字段标记为加密。

* `passportId`、`bloodType`、`insurance.policyNumber`和 字段`provider`从父 `encryptMetadata`字段继承其加密设置。具体来说，这些字段继承了[`algorithm`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.algorithm)和 [`keyId`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata.keyId)使用指定的数据加密密钥指定确定性加密的值。
* 该`medicalRecords`字段需要使用指定密钥进行随机加密。这些`encrypt`选项会覆盖父`encryptMetadata`字段中指定的选项。

虽然客户端字段级加密不支持加密单个数组元素，但随机加密支持加密整个 *数组*字段而不是字段中的单个元素。示例自动加密规则为 `medicalRecords`字段指定随机加密以加密整个数组。如果指定了自动加密规则[`encrypt`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encrypt)或者 [`encryptMetadata`](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#mongodb-autoencryptkeyword-autoencryptkeyword.encryptMetadata)在`medicalRecords.items`或 中`medicalRecords.additionalItems`，自动字段级加密失败并返回错误。

官方 MongoDB 4.2+ 兼容驱动程序，[`mongosh`](https://www.mongodb.com/docs/mongodb-shell/#mongodb-binary-bin.mongosh)，以及 4.2 或更高版本的旧版`mongo`shell 需要指定自动加密规则作为创建数据库连接对象的一部分：

* 对于`mongosh`，使用[`Mongo()`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#mongodb-method-Mongo) 构造函数创建数据库连接。`schemaMap`为参数的key 指定自动加密规则[`AutoEncryptionOpts`](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-autoEncryptionOpts)。 有关完整示例，请参阅 [连接到启用了自动客户端加密的集群。](https://www.mongodb.com/docs/manual/reference/method/Mongo/#std-label-mongo-connection-automatic-client-side-encryption-enabled)
* 对于官方 MongoDB 4.2+ 兼容驱动程序，使用驱动程序特定的数据库连接构造函数 ( `MongoClient`) 创建数据库连接，自动加密规则包含在客户端字段级加密配置对象中。参考[驱动程序 API 参考](https://www.mongodb.com/docs/manual/core/csfle/reference/compatibility/#std-label-field-level-encryption-drivers)以获得更完整的文档和教程。

对于所有客户端，指定给客户端字段级加密参数的`keyVault`和*必须*授予对自动加密规则中指定的数据加密密钥*和*用于加密数据加密密钥的客户主密钥的访问权限。`kmsProviders`

要详细了解您的 CMK 和 Key Vault 集合，请参阅[密钥保管库](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)页面。

要了解有关加密算法的更多信息，请参阅[加密算法](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-reference-encryption-algorithms)页面。

要了解有关 CSFLE 特定`MongoClient`选项的更多信息，请参阅[mongo 客户端](https://www.mongodb.com/docs/manual/core/csfle/reference/csfle-options-clients/#std-label-csfle-reference-mongo-client)页面。

### 加密模式 - 使用模式属性加密

`patternProperties`您可以在加密模式中使用关键字来为名称与正则表达式匹配的所有字段定义加密规则。

考虑一个集合`MedCo.patients`，其中每个文档都具有以下结构：

```
{
  "fname" : "<string>",
  "lname" : "<string>",
  "passportId_PIIString" : "<string>",
  "bloodType_PIIString" : "<string>",
  "medicalRecords_PIIArray" : [
    {<object>}
  ],
  "insurance" : {
    "policyNumber_PIINumber" : "<number>",
    "provider_PIIString" : "<string>"
  }
}
```

包含私有数据的字段由附加在字段名称末尾的“_PII<type>”标记标识。

- `passportId_PIIString`
- `bloodType_PIIString`
- `medicalRecords_PIIArray`
- `insurance.policyNumber_PIINumber`
- `insurance.provider_PIIString`

您可以使用`patternProperties`关键字来配置这些字段以进行加密，而无需单独标识每个字段，也无需使用完整的字段名称。通过使用匹配所有以“_PII<type>”标记结尾的字段的正则表达式来执行此操作。

以下 JSON 架构使用`patternProperties`正则表达式来指定要加密的字段。

```
{
  "MedCo.patients": {
  "bsonType": "object",
  "patternProperties": {
    "_PIIString$": {
      "encrypt": {
        "keyId": [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
        "bsonType": "string",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
      },
    },
    "_PIIArray$": {
      "encrypt": {
        "keyId": [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
        "bsonType": "array",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
      },
    },
    "insurance": {
      "bsonType": "object",
      "patternProperties": {
        "_PIINumber$": {
          "encrypt": {
            "keyId": [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
            "bsonType": "int",
            "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          },
        },
        "_PIIString$": {
          "encrypt": {
            "keyId": [UUID("6c512f5e-09bc-434f-b6db-c42eee30c6b1")],
            "bsonType": "string",
            "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          },
        },
      },
    },
  },
  },
}
```

以上自动加密规则将`passportId_PIIString`, `bloodType_PIIString`, `medicalRecords_PIIArray`, `insurance.policyNumber_PIINumber`, `insurance.provider_PIIString`字段标记为加密。

要了解有关`patternProperties`关键字的更多信息，请参阅 [patternProperties 关键字。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/#std-label-csfle-fundamentals-pattern-properties)







译者：韩鹏帅

原文：[CSFLE Encryption Schemas](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/)
