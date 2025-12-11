# D8. 数据评估科学（Data Evaluation Science）

## 定义

**数据评估科学**研究如何量化评估数据集质量,包括标签质量、覆盖度、分布一致性、噪声率分析、多模态质量评估等。

> **核心问题**:如何客观、可量化地评估数据集的质量?

## 为什么需要数据评估?

### 数据评估的价值

```
1. 发现数据问题(噪声、偏差、缺口)
2. 指导数据改进方向
3. 预测模型性能上限
4. 比较不同数据集优劣
5. 支撑数据采购决策
```

**核心理念**:
```
如果不能度量,就不能优化
Data Quality → Model Performance
```

## 评估维度

### 1. 标签质量（Label Quality）

#### (1) 一致性（Consistency）

**多人标注一致性（IAA）**
```python
from sklearn.metrics import cohen_kappa_score

# Cohen's Kappa
kappa = cohen_kappa_score(labels_A, labels_B)

# 解释标准
quality_level = {
    (0.8, 1.0]: "优秀 (噪声<10%)",
    (0.6, 0.8]: "良好 (噪声10-20%)",
    (0.4, 0.6]: "中等 (噪声20-30%)",
    (0.0, 0.4]: "差 (噪声>30%)"
}
```

**自一致性（Self-consistency）**
```python
# 同一个人隔一段时间重新标注同样样本
def self_consistency(annotator, samples, interval_days=30):
    labels_t1 = annotator.label(samples, time=0)
    labels_t2 = annotator.label(samples, time=interval_days)

    consistency = np.mean(labels_t1 == labels_t2)
    return consistency

# consistency < 0.9 说明协议不清晰或标注者不稳定
```

#### (2) 准确性（Accuracy）

**基于金标准**
```python
# 准备专家标注的金标准样本
gold_standard = load_gold_standard()

# 评估标注准确率
accuracy = np.mean(annotated_labels == gold_standard.labels)
precision = precision_score(gold_standard.labels, annotated_labels, average='macro')
recall = recall_score(gold_standard.labels, annotated_labels, average='macro')
```

**基于模型反馈**
```python
from cleanlab import filter

# 使用置信学习检测标签错误
predicted_probs = model.predict_proba(X)
label_issues = filter.find_label_issues(
    labels=y,
    pred_probs=predicted_probs,
    return_indices_ranked_by='self_confidence'
)

estimated_noise_rate = len(label_issues) / len(y)
```

### 2. 数据覆盖度（Coverage）

#### (1) 类别覆盖

```python
def evaluate_class_coverage(dataset, all_classes):
    present_classes = set(dataset['label'].unique())
    coverage = len(present_classes) / len(all_classes)

    # 每个类别的样本数
    class_counts = dataset['label'].value_counts()

    # 识别缺失或稀疏的类别
    missing_classes = set(all_classes) - present_classes
    sparse_classes = class_counts[class_counts < 10].index.tolist()

    return {
        'coverage': coverage,
        'missing': missing_classes,
        'sparse': sparse_classes,
        'counts': class_counts
    }
```

#### (2) 特征空间覆盖

**嵌入空间分析**
```python
from sklearn.manifold import TSNE
from scipy.spatial import ConvexHull

def embedding_coverage(train_data, test_data, model):
    # 生成嵌入
    train_emb = model.encode(train_data)
    test_emb = model.encode(test_data)

    # 可视化
    combined = np.vstack([train_emb, test_emb])
    tsne = TSNE(n_components=2)
    coords = tsne.fit_transform(combined)

    # 计算凸包覆盖率
    train_hull = ConvexHull(coords[:len(train_emb)])
    test_points_in_hull = np.sum([
        point_in_hull(p, train_hull) for p in coords[len(train_emb):]
    ])
    coverage = test_points_in_hull / len(test_emb)

    return coverage
```

#### (3) 场景覆盖

```python
def evaluate_scenario_coverage(dataset, scenario_checklist):
    """
    scenario_checklist = {
        '晴天': lambda x: x['weather'] == 'sunny',
        '雨天': lambda x: x['weather'] == 'rainy',
        '夜晚': lambda x: x['time'] == 'night',
        ...
    }
    """
    coverage_report = {}

    for scenario_name, condition in scenario_checklist.items():
        matching_samples = [x for x in dataset if condition(x)]
        coverage_report[scenario_name] = {
            'count': len(matching_samples),
            'ratio': len(matching_samples) / len(dataset)
        }

    total_coverage = sum(1 for v in coverage_report.values() if v['count'] > 0) / len(scenario_checklist)

    return coverage_report, total_coverage
```

### 3. 分布质量（Distribution Quality）

#### (1) 类别平衡性

```python
def evaluate_balance(labels):
    from scipy.stats import entropy

    label_counts = np.bincount(labels)
    probabilities = label_counts / len(labels)

    # Shannon熵(越大越平衡)
    balance_score = entropy(probabilities) / np.log(len(label_counts))

    # Gini系数(越小越平衡)
    sorted_counts = np.sort(label_counts)
    n = len(sorted_counts)
    gini = (2 * np.sum((np.arange(n) + 1) * sorted_counts)) / (n * np.sum(sorted_counts)) - (n + 1) / n

    return {
        'entropy': balance_score,  # 0-1, 越大越平衡
        'gini': gini,              # 0-1, 越小越平衡
        'max_min_ratio': label_counts.max() / label_counts.min()
    }
```

#### (2) 分布一致性（Train-Test Alignment）

```python
from scipy.stats import wasserstein_distance, ks_2samp

def distribution_alignment(train_data, test_data):
    # 标签分布对比
    train_label_dist = train_data['label'].value_counts(normalize=True)
    test_label_dist = test_data['label'].value_counts(normalize=True)

    # Wasserstein距离(越小越一致)
    w_dist = wasserstein_distance(train_label_dist, test_label_dist)

    # 特征分布对比(KS检验)
    feature_dists = []
    for col in train_data.select_dtypes(include=[np.number]).columns:
        statistic, p_value = ks_2samp(train_data[col], test_data[col])
        feature_dists.append({
            'feature': col,
            'statistic': statistic,
            'p_value': p_value,
            'aligned': p_value > 0.05
        })

    return {
        'label_distance': w_dist,
        'feature_alignment': feature_dists
    }
```

### 4. 噪声分析（Noise Analysis）

#### (1) 噪声率估计

```python
def estimate_noise_rate(data, labels, model):
    # 使用交叉验证估计
    from sklearn.model_selection import cross_val_predict

    predicted_labels = cross_val_predict(model, data, labels, cv=5)

    # 不一致的样本可能是噪声
    potential_noise = predicted_labels != labels
    noise_rate = np.mean(potential_noise)

    return noise_rate, potential_noise
```

#### (2) 噪声类型分析

```python
def analyze_noise_types(dataset):
    noise_types = {
        'duplicates': detect_duplicates(dataset),
        'outliers': detect_outliers(dataset),
        'label_inconsistency': detect_label_issues(dataset),
        'format_errors': detect_format_errors(dataset),
        'missing_values': dataset.isnull().sum()
    }

    return noise_types
```

### 5. 多样性（Diversity）

#### (1) 词汇多样性（文本）

```python
def text_diversity(texts):
    all_words = ' '.join(texts).split()

    # Type-Token Ratio
    ttr = len(set(all_words)) / len(all_words)

    # Hapax Legomena (只出现一次的词占比)
    from collections import Counter
    word_counts = Counter(all_words)
    hapax = sum(1 for count in word_counts.values() if count == 1)
    hapax_ratio = hapax / len(word_counts)

    return {
        'ttr': ttr,
        'hapax_ratio': hapax_ratio,
        'vocab_size': len(word_counts)
    }
```

#### (2) 视觉多样性（图像）

```python
def image_diversity(images):
    # 颜色多样性
    color_histograms = [cv2.calcHist([img], [0,1,2], None, [8,8,8], [0,256,0,256,0,256]) for img in images]

    # 计算平均两两距离
    from scipy.spatial.distance import cdist
    distances = pdist(color_histograms, metric='euclidean')
    diversity = np.mean(distances)

    return diversity
```

### 6. 完整性（Completeness）

```python
def evaluate_completeness(dataset, required_fields):
    completeness_report = {}

    for field in required_fields:
        missing = dataset[field].isnull().sum()
        completeness_report[field] = {
            'missing_count': missing,
            'missing_ratio': missing / len(dataset),
            'completeness': 1 - missing / len(dataset)
        }

    overall_completeness = np.mean([v['completeness'] for v in completeness_report.values()])

    return completeness_report, overall_completeness
```

## 综合质量评分

### 数据质量等级（DQ Score）

```python
def data_quality_score(dataset, test_dataset=None):
    scores = {}

    # 1. 标签质量 (0-1)
    scores['label_quality'] = evaluate_label_quality(dataset)

    # 2. 覆盖度 (0-1)
    scores['coverage'] = evaluate_coverage(dataset)

    # 3. 平衡性 (0-1)
    scores['balance'] = evaluate_balance(dataset['label'])['entropy']

    # 4. 多样性 (0-1)
    scores['diversity'] = evaluate_diversity(dataset)

    # 5. 完整性 (0-1)
    scores['completeness'] = evaluate_completeness(dataset)[1]

    # 6. 分布一致性 (0-1, 仅当有测试集时)
    if test_dataset is not None:
        scores['alignment'] = 1 - evaluate_alignment(dataset, test_dataset)

    # 综合评分
    weights = {
        'label_quality': 0.3,
        'coverage': 0.2,
        'balance': 0.15,
        'diversity': 0.15,
        'completeness': 0.1,
        'alignment': 0.1
    }

    dq_score = sum(scores[k] * weights.get(k, 0) for k in scores)

    return {
        'overall_score': dq_score,
        'detail_scores': scores,
        'level': classify_dq_level(dq_score)
    }

def classify_dq_level(score):
    if score >= 0.9:
        return 'DQ-5 (Perfect)'
    elif score >= 0.8:
        return 'DQ-4 (Excellent)'
    elif score >= 0.7:
        return 'DQ-3 (Good)'
    elif score >= 0.6:
        return 'DQ-2 (Fair)'
    else:
        return 'DQ-1 (Poor)'
```

## 数据评估报告

### 自动生成报告

```python
def generate_data_report(dataset, output_path='data_report.html'):
    import matplotlib.pyplot as plt
    import seaborn as sns

    report = {
        'basic_stats': {
            'total_samples': len(dataset),
            'num_features': len(dataset.columns),
            'num_classes': len(dataset['label'].unique()),
        },
        'quality_scores': data_quality_score(dataset),
        'distribution': {
            'label_distribution': dataset['label'].value_counts().to_dict(),
            'balance_metrics': evaluate_balance(dataset['label'])
        },
        'issues': {
            'duplicates': detect_duplicates(dataset),
            'outliers': detect_outliers(dataset),
            'missing': dataset.isnull().sum().to_dict()
        }
    }

    # 生成可视化
    figs = []

    # 类别分布
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.countplot(data=dataset, x='label', ax=ax)
    ax.set_title('Label Distribution')
    figs.append(fig)

    # 生成HTML报告
    html = generate_html_report(report, figs)

    with open(output_path, 'w') as f:
        f.write(html)

    return report
```

## 工具与框架

### 开源工具

- **Great Expectations**: 数据验证框架
- **Evidently AI**: 数据质量监控
- **cleanlab**: 噪声检测
- **pandas-profiling**: 自动生成数据报告

### 使用示例

```python
# Great Expectations
import great_expectations as ge

df = ge.read_csv('data.csv')
df.expect_column_values_to_be_in_set('label', ['A', 'B', 'C'])
df.expect_column_values_to_not_be_null('text')

# Evidently
from evidently.report import Report
from evidently.metric_preset import DataQualityPreset

report = Report(metrics=[DataQualityPreset()])
report.run(reference_data=train_df, current_data=test_df)
report.save_html('quality_report.html')
```

## 最佳实践

1. **定期评估**: 每个数据版本都评估质量
2. **多维度**: 不只看一个指标,综合评估
3. **自动化**: 集成到数据流水线
4. **可视化**: 生成可视化报告便于理解
5. **追踪变化**: 跟踪质量随时间的变化

## 总结

数据评估是数据构建的质量保障:
- **客观度量**: 用数字说话,避免主观判断
- **发现问题**: 及早发现数据缺陷
- **指导优化**: 明确改进方向
- **预测性能**: 数据质量预示模型上限

## 延伸阅读

- [D5. 数据清洗科学](D5-data-cleaning.md) - 评估后需清洗
- [D6. 标注科学](D6-annotation.md) - 评估标注质量
- [E4. 模型反馈工程](../03-engineering/E4-model-feedback.md) - 模型反馈评估数据

---

**核心观点**

> 数据评估不是"目测一下",而是系统化、量化、多维度的科学评估。好的评估体系是数据质量持续提升的基础。

