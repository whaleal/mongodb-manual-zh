# 加密模式

## 概述

在此页面上，您可以了解如何为自动客户端字段级加密 (CSFLE) 创建加密模式，并查看详细说明如何创建 CSFLE 快速入门中使用的加密模式的 [示例。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)

## 加密模式

加密模式是一个 JSON 对象，它使用一个严格的子集 [JSON Schema Draft 4 标准语法](https://tools.ietf.org/html/draft-zyp-json-schema-04) 连同关键字`encrypt`并`encryptMetadata` 定义**加密规则**，这些规则指定启用 CSFLE 的客户端应如何加密您的文档。

加密规则是定义您的客户端应用程序如何加密您的字段的 JSON 键值对。您必须在加密规则中指定或继承以下信息：

* 用于加密您的字段的算法
* 您的客户使用哪个数据加密密钥 (DEK) 来加密您的字段
* 这[BSON](https://bsonspec.org/)你的领域类型

加密规则必须包含`encrypt`或 `encryptMetadata`关键字。

要了解有关您可以在加密架构中定义的加密算法的更多信息，请参阅[字段和加密类型。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/encryption-algorithms/#std-label-csfle-reference-encryption-algorithms)

要了解有关数据加密密钥的更多信息，请参阅[密钥和密钥保管库。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/keys-key-vaults/#std-label-csfle-reference-keys-key-vaults)

### 加密关键字

该`encrypt`关键字为 BSON 文档中的单个字段定义了加密规则。包含关键字的加密规则`encrypt`具有以下结构：

```
"<field-name-to-encrypt>": {
  "encrypt": {
    "algorithm": "<encryption algorithm to use>",
    "bsonType": "<bson type of field>",
    "keyId": [UUID("<_id of your Data Encryption Key>" )]
  }
}
```

### 加密元数据关键字

该`encryptMetadata`关键字定义了兄弟`properties`标签的子元素继承的加密规则。包含的加密规则`encryptMetadata`具有以下结构：

```
"bsonType": "object",
"encryptMetadata": {
  "algorithm": "<encryption algorithm inherited by children of properties field>",
  "keyId": [UUID("<_id of your Data Encryption Key>" )]
},
"properties": { <object to inherit encryptMetadata values> }

```

### patternProperties 关键字

`patternProperties`您可以在加密模式中使用关键字来为名称与正则表达式匹配的所有字段定义加密规则。这允许您根据单个正则表达式指定多个字段进行加密，或者仅使用字段名称的一部分来指定它们。关键字 `patternProperties`replaces`properties`在您的加密模式中。

`patternProperties`使用以下结构指定加密规则：

```
"bsonType": "object",
"patternProperties": {
    "<regular expression to match>": {
    "encrypt": {
        "algorithm": "<encryption algorithm to use>",
        "bsonType": "<bson type of field>",
        "keyId": [UUID("<_id of your Data Encryption Key>" )]
    }
}

```

`patternProperties`要查看如何使用加密 模式的示例[- 使用模式属性加密](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-field-level-encryption-auto-encrypt-with-pattern-properties)

## 例子

此示例说明如何生成在 CSFLE 快速入门的“[为您的文档创建加密模式”步骤中使用的加密模式。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quickstart-encryption-schema)

在快速入门中，您将具有以下结构的文档插入到`patients`数据库集合中`medicalRecords`：

```
{
  "_id": { "$oid": "<_id of your document>" },
  "name": "<name of patient>",
  "ssn": <integer>,
  "bloodType": "<blood type>",
  "medicalRecords": [
    { "weight": <integer>, "bloodPressure": "<blood pressure>" }
  ],
  "insurance": {
    "provider": "<provider name>",
    "policyNumber": <integer>
  }
}
```

### 指定命名空间

在您的加密模式的根目录下，指定您的加密模式适用的命名空间。指定以下内容以加密和解密`patients`数据库集合中的文档`medicalRecords` ：

```
{
  "medicalRecords.patients": {
    <the schema created in the following steps of this example>
  }
}
```

### 指定数据加密密钥

在快速入门中，您使用单个数据加密密钥 (DEK) 加密文档的所有字段。要将文档中的所有字段配置为使用单个 DEK 进行加密和解密，请使用加密模式根部`_id`的关键字指定 DEK，如下所示：`encryptMetadata`

```
{
  "medicalRecords.patients": {
    "bsonType": "object",
    "encryptMetadata": {
     "keyId": [UUID("<_id of your Data Encryption Key>" )]
   },
    "properties": {
      <the schema created in the following steps of this example>
    }
  }
}

```

### 选择加密规则

您决定使用以下加密算法对以下字段进行加密：

| 字段名称                 | 加密演算法    | BSON类型 |
| :----------------------- | :------------ | :------- |
| `ssn`                    | Deterministic | Int      |
| `bloodType`              | Random        | String   |
| `medicalRecords`         | Random        | Array    |
| `insurance.policyNumber` | Deterministic | Int      |

出于以下原因，您选择使用确定性加密来加密`ssn`和字段：`insurance.policyNumber`

- 您希望能够查询这些字段。
- 这些字段中的值具有高基数，因此该数据不易受到频率分析攻击。

您选择使用`bloodType`随机加密对字段进行加密，原因如下：

- 您不打算查询此字段。
- 此字段中的值具有低基数，如果您对它们进行确定性加密，则它们容易受到频率分析攻击。

您必须`medicalRecords`使用随机加密来加密字段，因为 CSFLE 不支持类型字段的确定性加密`array`。

> 提示:
>
> 要了解有关支持和不支持的自动加密操作的更多信息，请参阅[自动加密支持的操作。](https://www.mongodb.com/docs/manual/core/csfle/reference/supported-operations/#std-label-csfle-reference-automatic-encryption-supported-operations)

### 指定加密规则

要使用`ssn`确定性加密来加密字段，请在您的加密模式中指定以下内容：

```
"ssn": {
    "encrypt": {
        "bsonType": "int",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
    }
}
```

要使用`bloodType`随机加密来加密字段，请在您的加密模式中指定以下内容：

```
"bloodType": {
    "encrypt": {
        "bsonType": "string",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
    }
}

```

要使用`medicalRecords`随机加密来加密字段，请在您的加密模式中指定以下内容：

```
"medicalRecords": {
    "encrypt": {
        "bsonType": "array",
        "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
    }
}
```

要使用`insurance.policyNumber`确定性加密来加密字段，请在您的加密模式中指定以下内容：

```
"insurance": {
    "bsonType": "object",
    "properties": {
        "policyNumber": {
            "encrypt": {
                "bsonType": "int",
                "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
            }
        }
    }
}
```

### 查看完整架构

快速入门的完整加密架构如下：

```
{
  "medicalRecords.patients": {
    "bsonType": "object",
    "encryptMetadata": {
     "keyId": [UUID("<_id of your Data Encryption Key>" )]
   },
    "properties": {
      "insurance": {
        "bsonType": "object",
        "properties": {
          "policyNumber": {
            "encrypt": {
              "bsonType": "int",
              "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
            }
          }
        }
      },
      "medicalRecords": {
        "encrypt": {
          "bsonType": "array",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "bloodType": {
        "encrypt": {
          "bsonType": "string",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      },
      "ssn": {
        "encrypt": {
          "bsonType": "int",
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      }
    }
  }
}

```

## 了解更多

要了解有关加密模式的更多信息，请参阅 [CSFLE 加密模式](https://www.mongodb.com/docs/manual/core/csfle/reference/encryption-schemas/#std-label-csfle-reference-encryption-schemas)

要了解有关自动加密的更多信息，请参阅 [自动加密。](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/automatic-encryption/#std-label-csfle-fundamentals-automatic-encryption)

要查看快速入门，请参阅[快速入门。](https://www.mongodb.com/docs/manual/core/csfle/quick-start/#std-label-csfle-quick-start)







译者：韩鹏帅

原文：[Encryption Schemas](https://www.mongodb.com/docs/manual/core/csfle/fundamentals/create-schema/)