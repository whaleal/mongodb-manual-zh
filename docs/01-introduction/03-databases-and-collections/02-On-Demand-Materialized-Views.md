# `On-Demand`物化视图

```javascript
/NOTE/
	解疑
  	 本页讨论按需实体化视图. 有关标准视图的讨论，请参见[视图](https://www.mongodb.com/docs/v6.0/core/views/#std-label-views-landing-page)。
      为了理解视图类型之间的差异，参见[Comparison with Standard Views](https://www.mongodb.com/docs/v6.0/core/materialized-views/#std-label-materialized-view-compare).

```

 按需物化视图是预先计算的聚合管道结果，存储在磁盘上并从磁盘读取。 按需物化视图通常是[`$merge`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/merge/#mongodb-pipeline-pipe.-merge) 或 [`$out`](https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/out/#mongodb-pipeline-pipe.-out) 阶段的结果。

