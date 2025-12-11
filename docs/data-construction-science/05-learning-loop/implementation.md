# 闭环实施方法

## 实施流程

### Step 1: 建立Baseline

```python
# 1. 准备初始数据集(v1)
initial_data = prepare_seed_data(size=1000)

# 2. 训练baseline模型
model_v1 = train_model(initial_data)

# 3. 评估性能
baseline_score = evaluate(model_v1, test_data)
print(f"Baseline: {baseline_score}")
```

### Step 2: 错误分析

```python
# 1. 收集错误样本
predictions = model_v1.predict(test_data)
errors = test_data[predictions != test_data.labels]

# 2. 分析错误模式
error_analysis = analyze_errors(errors)
print(f"错误类型: {error_analysis}")

# 3. 识别数据缺口
gaps = identify_gaps(train_data, errors)
```

### Step 3: 数据补充

```python
# 1. 主动学习采样
from modAL.models import ActiveLearner

learner = ActiveLearner(estimator=model_v1)
query_idx, query_samples = learner.query(unlabeled_pool, n_instances=100)

# 2. 人工标注
new_labels = human_annotate(query_samples)

# 3. 合并数据集
data_v2 = concatenate([data_v1, query_samples])
```

### Step 4: 模型更新

```python
# 1. 训练新模型
model_v2 = train_model(data_v2)

# 2. 评估提升
new_score = evaluate(model_v2, test_data)
improvement = new_score - baseline_score
print(f"提升: {improvement}")

# 3. 如果提升显著,部署新模型
if improvement > 0.02:
    deploy(model_v2)
```

### Step 5: 持续监控

```python
# 监控线上性能
def monitor_production(model, production_data):
    # 1. 检测分布漂移
    if detect_drift(production_data, train_data):
        alert("数据分布漂移,需要更新")

    # 2. 收集错误case
    errors = collect_errors(model, production_data)

    # 3. 定期触发数据更新
    if len(errors) > 100:
        trigger_data_update(errors)
```

## 自动化闭环系统

```python
class AutoDataLoop:
    def __init__(self, initial_data, initial_model):
        self.data = initial_data
        self.model = initial_model
        self.version = 1

    def run_iteration(self, unlabeled_pool, budget=100):
        """运行一次迭代"""

        # 1. 主动采样
        hard_cases = self.mine_hard_cases(unlabeled_pool, budget)

        # 2. 人工标注
        labeled_cases = self.annotate(hard_cases)

        # 3. 数据合并
        self.data = self.merge(self.data, labeled_cases)
        self.version += 1

        # 4. 重新训练
        self.model = self.retrain(self.data)

        # 5. 评估
        score = self.evaluate(self.model)
        self.log(f"v{self.version}: score={score}")

        return score

    def mine_hard_cases(self, pool, budget):
        """挖掘困难样本"""
        predictions = self.model.predict_proba(pool)
        uncertainty = entropy(predictions)
        top_indices = np.argsort(uncertainty)[-budget:]
        return pool[top_indices]

    def auto_loop(self, unlabeled_pool, iterations=10, budget=100):
        """自动化闭环"""
        for i in range(iterations):
            score = self.run_iteration(unlabeled_pool, budget)
            if score > 0.95:  # 达到目标
                break

# 使用
loop = AutoDataLoop(initial_data, initial_model)
loop.auto_loop(unlabeled_pool, iterations=10)
```

## 实施案例

### 情感分类闭环优化

```
v1 (1000样本,规则生成)
├─ Acc: 70%
└─ 问题: 讽刺语句识别差

v2 (+500讽刺样本)
├─ Acc: 78%
└─ 问题: 短文本分类差

v3 (+500短文本)
├─ Acc: 83%
└─ 问题: 方言表达识别差

v4 (+300方言样本)
├─ Acc: 86%
└─ 达到目标
```

## 最佳实践

1. **小步快跑**: 每次迭代增量小,但频率高
2. **度量驱动**: 每次改进都有明确的指标提升
3. **版本记录**: 清晰记录每个版本的变化
4. **A/B测试**: 新版本先小流量验证
5. **自动化**: 尽可能自动化闭环流程

## 常见问题

### Q: 多久迭代一次?

A: 取决于数据量和任务:
- 快速迭代期: 每周一次
- 稳定期: 每月一次
- 维护期: 按需更新

### Q: 何时停止迭代?

A: 满足以下条件之一:
- 达到性能目标
- 边际收益<1%
- 成本超过预算

## 延伸阅读

- [overview.md](overview.md) - 闭环理念
- [E4. 模型反馈工程](../03-engineering/E4-model-feedback.md)

---

**核心观点**: 闭环不是一次性项目,而是持续运营的系统。成功的关键是自动化、度量化、快速迭代。

