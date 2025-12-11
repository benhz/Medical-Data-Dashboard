# E4. 模型反馈工程（Model-driven Feedback Engineering）

## 定义

通过模型反馈驱动数据改进,实现数据-模型闭环优化。

## 核心机制

### 1. 困难样本挖掘

```python
def mine_hard_cases(model, unlabeled_data):
    """挖掘模型不确定的困难样本"""
    predictions = model.predict_proba(unlabeled_data)

    # 计算不确定性(熵)
    uncertainty = -np.sum(predictions * np.log(predictions + 1e-10), axis=1)

    # 选择最不确定的样本
    top_indices = np.argsort(uncertainty)[-100:]

    return unlabeled_data[top_indices]
```

### 2. 主动学习

```python
from modAL.models import ActiveLearner

# 初始化主动学习器
learner = ActiveLearner(
    estimator=RandomForestClassifier(),
    X_training=X_initial,
    y_training=y_initial
)

# 主动学习循环
for i in range(10):
    # 查询最有价值的样本
    query_idx, query_instance = learner.query(X_pool)

    # 人工标注
    y_new = human_annotate(query_instance)

    # 更新模型
    learner.teach(X_pool[query_idx], y_new)

    # 从池中移除
    X_pool = np.delete(X_pool, query_idx, axis=0)
```

### 3. 数据缺口分析

```python
def analyze_data_gaps(train_data, test_data, model):
    """分析训练集与测试集的差距"""

    # 在测试集上评估
    predictions = model.predict(test_data)
    errors = test_data[predictions != test_data.labels]

    # 聚类错误样本
    from sklearn.cluster import KMeans
    embeddings = model.encode(errors)
    clusters = KMeans(n_clusters=10).fit_predict(embeddings)

    # 分析每个簇的特征
    for cluster_id in range(10):
        cluster_samples = errors[clusters == cluster_id]
        print(f"缺口类型{cluster_id}: {len(cluster_samples)}样本")
        # 分析这类样本的共同特征

    return errors
```

### 4. 在线学习

```python
class OnlineLearner:
    def __init__(self, model):
        self.model = model

    def update_from_production(self, new_data, new_labels):
        """从生产环境持续学习"""
        # 增量训练
        self.model.partial_fit(new_data, new_labels)

    def monitor_drift(self, production_data, train_data):
        """监控数据漂移"""
        from scipy.stats import ks_2samp

        # KS检验
        stat, p_value = ks_2samp(production_data, train_data)

        if p_value < 0.05:
            print("警告: 检测到数据分布漂移")
            self.trigger_retraining()
```

## 闭环流程

```
训练模型v1
    ↓
部署上线
    ↓
收集错误case
    ↓
分析数据缺口
    ↓
补充数据 → 数据集v2
    ↓
训练模型v2
    ↓
...
```

## 延伸阅读

- [D8. 数据评估科学](../02-disciplines/D8-evaluation.md)
- [数据-模型闭环](../05-learning-loop/overview.md)

