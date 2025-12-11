# NLP文本分类应用案例

## 任务定义

**场景**: 电商评论情感分类(正面/负面/中性)

## 学科应用

| 学科 | 应用 |
|------|------|
| D1. 任务建模 | 定义三分类任务,F1为核心指标 |
| D2. 数据分布 | 平衡采样(每类5000样本) |
| D5. 数据清洗 | 去重、去噪声、文本归一化 |
| D6. 标注 | 三人标注+多数投票,IAA>0.8 |
| D7. 数据增强 | 回译、同义替换 |
| D8. 数据评估 | 噪声率<5%,分布平衡性检查 |

## 数据构建流程

### 1. 数据采集 (D3, D4)

```python
# 来源组合
sources = {
    '淘宝评论': 8000,  # 真实数据
    'LLM生成': 5000,   # 补充多样性
    '人工构造': 2000   # 边缘case
}
```

### 2. 数据清洗 (D5)

```python
# 去重
data = dedup(data, key='text')

# 文本归一化
data['text'] = data['text'].apply(normalize_text)

# 异常检测
outliers = detect_outliers(data)
```

### 3. 标注 (D6)

```python
# 三人标注
labels_A = annotator_A.label(data)
labels_B = annotator_B.label(data)
labels_C = annotator_C.label(data)

# 多数投票
final_labels = majority_vote([labels_A, labels_B, labels_C])

# IAA检查
kappa = cohen_kappa_score(labels_A, labels_B)
assert kappa > 0.8, "一致性不足"
```

### 4. 数据增强 (D7)

```python
# 回译增强
augmented = []
for text in data:
    # 中文→英文→中文
    aug_text = back_translate(text, pivot='en')
    augmented.append(aug_text)

# 最终数据集: 原始15k + 增强15k = 30k
```

## 结果

- 数据集规模: 30,000样本
- 质量等级: DQ-3(噪声<5%, IAA=0.82)
- 模型性能: F1=87% (baseline=75%)

## 关键经验

1. **平衡采样很重要**: 自然分布(正70%/负20%/中10%)导致模型偏向正面,平衡后F1提升5%
2. **回译增强有效**: 尤其对中性样本,F1提升3%
3. **边缘case补充**: 讽刺、方言等困难样本显著提升鲁棒性

## 延伸阅读

- [D1-D8学科篇](../02-disciplines/)
- [闭环优化](../05-learning-loop/overview.md)

