# 配置Telemetry选项

mongosh 收集匿名聚合使用数据以改进 MongoDB 产品。 mongosh 默认收集此信息，但您可以随时禁用此数据收集。

## 数据追踪者`mongosh`

`mongosh`跟踪以下数据：

- `mongosh`连接到的MongoDB 的类型。例如，企业版、社区版或 Atlas Data Lake。
- 这些方法在`mongosh`. `mongosh`只跟踪方法的名称，不跟踪提供给方法的任何参数。
- 用户是否使用`mongosh`.
- 错误。

`mongosh` *不*跟踪：

- IP 地址、主机名、用户名或凭据。
- 查询在`mongosh`.
- 存储在 MongoDB 部署中的任何数据。
- 个人身份信息。

有关详细信息，请参阅 MongoDB 的[隐私政策。](https://www.mongodb.com/legal/privacy-policy?tck=docs_mongosh)

## 切换Telemetry收集

使用以下方法`mongosh`切换Telemetry数据收集。

- `disableTelemetry()`

  为 禁用遥测`mongosh`。

  ```
  disableTelemetry()
  ```

  命令响应确认遥测已禁用：

  ```
  Telemetry is now disabled.
  ```

  > 提示:
  >
  > 您还可以使用 [`--eval`](https://www.mongodb.com/docs/mongodb-shell/reference/options/#std-option-mongosh.--eval)启动选项在启动时禁用遥测。
  >
  > 以下命令`mongosh`在禁用遥测的情况下启动：
  >
  > ```shell
  > mongosh --nodb --eval "disableTelemetry()"
  > ```

- `enableTelemetry()`

  为 启用遥测`mongosh`。

  ```
  enableTelemetry()
  ```

  命令响应确认遥测已启用：

  ```
  Telemetry is now enabled.
  ```

  



翻译：韩鹏帅

原文： [Configure Telemetry Options](https://www.mongodb.com/docs/mongodb-shell/telemetry/)