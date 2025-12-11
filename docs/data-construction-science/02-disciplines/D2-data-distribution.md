# D2. 数据分布科学（Data Distribution Science）

## 定义

**数据分布科学**研究数据应该具备什么样的分布形态才能支撑模型训练和泛化，包括自然分布建模、任务分布设计、长尾处理、覆盖度分析、多样性度量等。

> **核心问题**：给定一个任务，数据集应该呈现什么样的分布，才能让模型既学到规律又能泛化？

## 为什么分布如此重要?

### 分布即边界

机器学习的本质假设：
```
P(模型泛化到x) ≈ P(x ∈ 训练分布)
```

**结论**：模型只能在见过的分布上表现良好。

### 真实案例

**案例1：人脸识别的分布灾难**
```
训练数据：90%白人、10%其他族裔
结果：模型在白人上准确率95%，其他族裔仅60%
根因：分布不平衡导致的偏见
```

**案例2：OCR的字体崩溃**
```
训练数据：只有印刷体
测试场景：手写体、艺术字体
结果：几乎完全失效
根因：分布覆盖不足
```

## 核心内容

### 1. 分布的三种类型

#### (1) 自然分布（Natural Distribution）

**定义**：数据按真实世界自然出现的概率分布。

**特点**：
- 遵循幂律分布（Power Law）
- 少数类别占据大部分样本
- 长尾效应显著

**适用场景**：
- 推荐系统（热门物品 vs 冷门物品）
- 搜索引擎（高频query vs 低频query）
- 日志分析

**示例**：
```
电商商品点击分布：
- 头部20%商品 → 80%点击
- 尾部80%商品 → 20%点击
```

#### (2) 任务分布（Task Distribution）

**定义**：根据任务目标调整的分布，不一定等于自然分布。

**设计原则**：
- 每个类别有足够样本学习模式
- 长尾类别适度过采样
- 边界case充分覆盖

**适用场景**：
- 分类任务（需要每个类别准确率均衡）
- 检测任务（罕见目标也要检测到）
- NER（罕见实体类型也要识别）

**示例**：
```
垃圾邮件分类：
自然分布：正常邮件90%，垃圾邮件10%
任务分布：正常邮件50%，垃圾邮件50%（平衡采样）
→ 避免模型退化为"全预测正常"
```

#### (3) 风险分布（Risk Distribution）

**定义**：对高风险、高价值场景过采样的分布。

**设计原则**：
- 识别高风险场景（安全、合规、成本）
- 大幅过采样风险case
- 构造对抗样本

**适用场景**：
- 金融风控（欺诈case虽少但损失大）
- 医疗诊断（罕见病误诊代价高）
- 自动驾驶（corner case关乎安全）

**示例**：
```
信用卡欺诈检测：
自然分布：正常交易99.9%，欺诈0.1%
风险分布：正常50%，欺诈50%
+ 增加高风险场景（异地大额、深夜消费等）
```

### 2. 分布设计框架

#### 步骤1：分布调研

1. **分析真实分布**
   ```python
   # 统计类别分布
   from collections import Counter
   label_counts = Counter(labels)
   # 绘制分布图
   plt.bar(label_counts.keys(), label_counts.values())
   plt.yscale('log')  # 长尾可视化
   ```

2. **识别长尾**
   ```
   头部类别：累计占比80%的类别
   中部类别：累计占比80%-95%的类别
   尾部类别：累计占比95%-100%的类别
   ```

3. **分析覆盖度**
   - 哪些场景缺失？
   - 哪些边界case没有？

#### 步骤2：分布设计策略

| 策略 | 方法 | 适用场景 |
|------|------|---------|
| **自然采样** | 按真实分布采样 | 推荐、搜索 |
| **平衡采样** | 每类相同样本数 | 分类（类别重要性相同） |
| **分层采样** | 按重要性分层 | 类别重要性不同 |
| **加权采样** | 长尾类别过采样 | 长尾识别 |
| **合成采样** | 生成少数类样本 | 极度不平衡 |

#### 步骤3：长尾处理

**方法1：过采样（Oversampling）**
```python
from imblearn.over_sampling import RandomOverSampler, SMOTE

# 简单重复
ros = RandomOverSampler()
X_resampled, y_resampled = ros.fit_resample(X, y)

# SMOTE合成
smote = SMOTE()
X_resampled, y_resampled = smote.fit_resample(X, y)
```

**方法2：欠采样（Undersampling）**
```python
from imblearn.under_sampling import RandomUnderSampler

rus = RandomUnderSampler()
X_resampled, y_resampled = rus.fit_resample(X, y)
```

**方法3：混合策略**
```
1. 头部类别：欠采样到10000样本
2. 中部类别：保持原样
3. 尾部类别：过采样到1000样本
```

### 3. 覆盖度（Coverage）

**定义**：数据集覆盖了多少真实场景。

#### 覆盖度维度

**1. 类别覆盖**
```
Coverage_class = N_covered_classes / N_total_classes
```

**2. 特征覆盖**
- 文本：词汇覆盖率、句式多样性
- 图像：光照、角度、背景、遮挡
- 语音：口音、噪声、语速

**3. 场景覆盖**
- 正常场景 + 异常场景
- 典型case + 边缘case
- 单一条件 + 组合条件

#### 覆盖度评估

**方法1：枚举法**
```markdown
场景清单：
- [ ] 晴天、阴天、雨天、雪天
- [ ] 白天、黄昏、夜晚
- [ ] 正面、侧面、背面
- [ ] 无遮挡、部分遮挡、严重遮挡
...

覆盖度 = 已有场景数 / 总场景数
```

**方法2：嵌入空间分析**
```python
from sklearn.manifold import TSNE

# 将数据映射到嵌入空间
embeddings = model.encode(data)
# 可视化
tsne = TSNE(n_components=2)
coords = tsne.fit_transform(embeddings)
plt.scatter(coords[:, 0], coords[:, 1])

# 分析聚类 → 发现覆盖空白区
```

### 4. 多样性（Diversity）

**定义**：数据集内部的差异性和变化性。

#### 多样性度量

**1. 词汇多样性（文本）**
```python
# Type-Token Ratio
unique_words = len(set(words))
total_words = len(words)
ttr = unique_words / total_words
```

**2. 图像多样性**
```python
# 像素直方图差异
from skimage import exposure

histograms = [exposure.histogram(img) for img in images]
# 计算直方图间距离
diversity = np.mean([distance(h1, h2) for h1, h2 in combinations(histograms, 2)])
```

**3. 嵌入多样性（通用）**
```python
# 嵌入空间的平均距离
from scipy.spatial.distance import pdist

embeddings = model.encode(data)
diversity = np.mean(pdist(embeddings, metric='cosine'))
```

#### 提升多样性

1. **主动多样化采样**
   - 基于聚类：每个簇采样若干样本
   - 基于核心集（Coreset）：选择最具代表性的子集

2. **数据增强**
   - 文本：同义替换、回译
   - 图像：色彩、几何变换
   - 语音：噪声、变速

3. **多来源融合**
   - 不同渠道：网络、众包、专家
   - 不同领域：新闻、社交媒体、专业文献

### 5. 边缘案例（Edge Cases）

**定义**：极端、罕见、模糊的情况。

#### 边缘案例类型

| 类型 | 示例 | 处理方法 |
|------|------|---------|
| **极端值** | 超长文本、超大图像 | 采样 + 特殊处理 |
| **模糊样本** | 难以分类的边界case | 多人标注 + 投票 |
| **罕见组合** | 罕见实体+罕见上下文 | 主动构造 |
| **对抗样本** | 人为构造的困难样本 | 对抗生成 |
| **噪声样本** | 标注错误、数据损坏 | 清洗 + 校正 |

#### 边缘案例挖掘

**方法1：模型驱动**
```python
# 训练初始模型
model.train(data_v1)

# 找到模型不确定的样本
predictions = model.predict_proba(unlabeled_data)
uncertainty = entropy(predictions)
edge_cases = unlabeled_data[uncertainty > threshold]
```

**方法2：规则驱动**
```python
# 定义边缘条件
def is_edge_case(sample):
    return (
        len(sample.text) > 1000 or  # 超长
        sample.ambiguity_score > 0.8 or  # 模糊
        sample.entity_count > 10  # 实体密集
    )

edge_cases = [s for s in data if is_edge_case(s)]
```

## 实践方法论

### 最佳实践

#### 1. 分层构建数据集

```
数据集 = 核心集 + 多样性集 + 边缘集

- 核心集（60%）：典型场景，分布均衡
- 多样性集（30%）：覆盖各种变化
- 边缘集（10%）：罕见、困难case
```

#### 2. 迭代式分布优化

```
v1：自然采样，训练baseline
  ↓
分析错误 → 发现分布缺陷
  ↓
v2：补充缺失分布
  ↓
再分析 → 再优化
  ↓
v3：精细化分布
```

#### 3. 分布监控

```python
# 定期分析分布偏移
from scipy.stats import ks_2samp

# 比较训练集和线上数据分布
statistic, p_value = ks_2samp(train_features, online_features)

if p_value < 0.05:
    print("警告：分布显著偏移，需要更新数据集")
```

## 常见陷阱

### 陷阱1：盲目追求平衡

❌ 所有类别强制1:1
```
可能导致：
- 过度采样引入噪声
- 模型脱离真实分布
```

✅ 根据任务选择分布
```
- 召回为主任务 → 长尾过采样
- 精准为主任务 → 可以不平衡
```

### 陷阱2：忽略时间维度

❌ 数据全部来自历史某一时期
```
可能导致：
- 无法适应分布漂移
- 季节性、趋势性失效
```

✅ 时间分层采样
```
- 近期数据（60%）：反映当前分布
- 历史数据（40%）：保持稳定性
```

### 陷阱3：过拟合数据集

❌ 疯狂补充测试集错误case
```
可能导致：
- 测试集不再独立
- 过度优化特定分布
```

✅ 保持测试集冻结
```
- 只分析错误类型
- 在训练集补充类似分布
```

## 工具与方法

### 分布分析工具

```python
# 1. 类别分布可视化
import seaborn as sns
sns.countplot(data['label'])

# 2. 特征分布对比
import matplotlib.pyplot as plt
plt.hist([train_feature, test_feature], label=['Train', 'Test'])
plt.legend()

# 3. 分布相似度
from scipy.stats import wasserstein_distance
dist = wasserstein_distance(train_dist, test_dist)

# 4. 覆盖度分析
from sklearn.metrics import coverage_error
coverage = coverage_error(y_true, y_score)
```

### 采样工具

```python
# 不平衡数据处理
from imblearn.over_sampling import SMOTE, ADASYN
from imblearn.under_sampling import TomekLinks
from imblearn.combine import SMOTETomek

# 分层采样
from sklearn.model_selection import StratifiedShuffleSplit

# 时间序列采样
from sklearn.model_selection import TimeSeriesSplit
```

## 案例：医疗图像分布设计

### 场景
肺部X光片疾病分类（正常、肺炎、肺结核、肺癌）

### 分布设计

#### 1. 自然分布分析
```
正常：70%
肺炎：20%
肺结核：7%
肺癌：3%
```

#### 2. 任务分布设计
```
目标：所有疾病召回率>90%

策略：
- 正常：欠采样到5000
- 肺炎：保持2000
- 肺结核：过采样到2000（SMOTE + 数据增强）
- 肺癌：过采样到2000 + 主动收集
```

#### 3. 覆盖度设计
```
年龄维度：
- 儿童（0-12）：15%
- 青年（13-40）：30%
- 中年（41-60）：35%
- 老年（60+）：20%

设备维度：
- 品牌A、B、C各占1/3

拍摄条件：
- 不同角度、曝光度
```

#### 4. 边缘案例
```
- 早期病变（难以诊断）
- 多病并发
- 图像质量差（噪声、模糊）
- 罕见表现形式
```

## 总结

数据分布设计是数据构建的核心科学问题：
- **分布决定泛化**：模型只能在训练分布上工作
- **分布需要设计**：不是简单复制真实分布
- **分布需要迭代**：根据模型反馈持续优化

## 延伸阅读

- [D1. 任务建模科学](D1-task-modeling.md) - 任务建模决定分布设计目标
- [D3. 数据来源科学](D3-data-source.md) - 如何获取符合分布要求的数据
- [D8. 数据评估科学](D8-evaluation.md) - 如何评估分布质量

---

**核心观点**

> 数据分布不是"有什么用什么"，而是"需要什么设计什么"。分布设计是一门需要理论指导、数据分析、迭代优化的科学。

