## CSFLE 密码原语

MongoDB 使用 CSFLE 加密所有字段[AEAD](https://en.wikipedia.org/w/index.php?title=Authenticated_encryption&oldid=1079879470#Authenticated_encryption_with_associated_data_(AEAD)) AES-256-CBC 加密算法。

- 如果您为字段指定确定性加密，您的应用程序会将确定性初始化向量传递给 AEAD。
- 如果您为字段指定随机加密，您的应用程序会将随机初始化向量传递给 AEAD。

> 笔记:
>
> **认证加密**
>
> MongoDB CSFLE 使用 [加密然后MAC](https://en.wikipedia.org/wiki/Authenticated_encryption#Encrypt-then-MAC_(EtM)) 执行经过身份验证的加密的方法。MongoDB CSFLE 使用 HMAC-SHA-512 算法生成您的 MAC。







译者：韩鹏帅

原文：[CSFLE Cryptographic Primitives](https://www.mongodb.com/docs/manual/core/csfle/reference/cryptographic-primitives/)