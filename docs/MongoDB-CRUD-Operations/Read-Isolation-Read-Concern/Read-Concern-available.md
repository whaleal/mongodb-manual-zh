## 阅读关注“available”

version 3.6 中的新内容。

读取关注“可用”的查询返回实例中的数据，但不保证数据已写入大多数副本集成员(i.e.可能会回滚)。

如果读取与因果关系一致无关，则读取关注“可用”是对二级读取的缺省值。

对于分片 cluster，“可用”读取问题为分区提供了更大的容忍度，因为它不会等待以确保一致性保证。但是，如果分片正在进行大块迁移，那么带有“可用”读取问题的查询可能会 return 孤立文档，因为“本地”读取问题与“本地”读取问题不同，它不会联系分片的主服务器或配置服务器以更新元数据。

对于未加密的集合(包括独立部署或副本集部署中的集合)，“本地”和“可用”读取问题的行为相同。

无论阅读关注 level 如何，节点上的最新数据可能无法反映系统中数据的最新 version。

> **也可以看看**
>
> orphanCleanupDelaySecs

### 可用行

阅读关注`available`无法与因果一致的会话一起使用。

### 例子

考虑写入操作 Write<sub>0</sub> 到三个成员副本集的以下时间轴：

> **注意**

* Write<sub>0</sub> 之前的所有写操作都已成功复制到所有成员。

* Write<sub>prev</sub> 是 Write<sub>0</sub>之前的写入。

* 在 Write<sub>0</sub>之后没有发生其他写操作。

  ![Timeline of a write operation to a three member replica set.](https://docs.mongodb.com/manual/_images/read-concern-write-timeline.svg)

| 时间          | 事件                                                         | 最新写                                                       | 最新的多数写                                                 |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| t<sub>0</sub> | 主要适用于Write<sub>0</sub>                                  | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>1</sub> | Secondary<sup>1</sup>适用于Write<sub>0</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>2</sub> | Secondary<sup>2</sup>适用于Write<sub>0</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>prev</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>3</sub> | Primary知道到Secondary<sub>1</sub>的复制成功，并向客户端发送确认 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>4</sub> | Primary 知道成功复制到 Secondary<sub>2</sub>                 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>prev</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>5</sub> | Secondary<sub>1</sub>接收通知(通过常规复制机制)以更新其最近 w：“多数”写入的快照 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>prev</sub> |
| t<sub>6</sub> | Secondary<sub>2</sub>接收通知(通过常规复制机制)以更新其最近 w：“多数”写入的快照 | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> | 主要：Write<sub>0</sub><br/>次要<sub>1</sub>：Write<sub>0</sub><br />次要<sub>2</sub>：Write<sub>0</sub> |


然后，下表总结了 time读取关注的读操作在 time `T`处将看到的数据的 state。

<table>
<thead>
<tr><th>阅读目标</th><th>Time `T`</th><th>数据状态</th></tr>
</thead>
<tbody>
<tr><td>主</td><td>在 t0 之后</td><td>数据反映了 Write0。</td></tr>
<tr><td>Secondary1</td><td>在 t1 之前</td><td>数据反映了 Writeprev</td></tr>
<tr><td>Secondary1</td><td>在 t1 之后</td><td>数据反映了 Write0</td></tr>
<tr><td>Secondary2</td><td>在 t2 之前</td><td>数据反映了 Writeprev</td></tr>
<tr><td>Secondary2</td><td>在 t2 之后</td><td>数据反映了 Write0</td></tr>

