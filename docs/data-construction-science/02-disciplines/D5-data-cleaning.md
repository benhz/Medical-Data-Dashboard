# D5. 数据清洗科学（Data Cleaning Science）

## 定义

**数据清洗科学**研究如何系统化地提升数据质量，包括噪声建模、去重、归一化、异常检测、自动纠错等。

> **核心问题**：如何将原始、杂乱的数据转化为高质量的训练数据？

## 为什么清洗如此重要？

### 数据质量定律
```
Garbage In, Garbage Out
数据质量上限 = 模型性能上限
```

**真实案例**：
- 某NLP分类任务，标注噪声20% → 模型准确率最多80%
- 某图像检测，重复样本30% → 模型过拟合严重
- 某推荐系统，异常用户行为5% → 推荐质量大幅下降

## 核心内容

### 1. 噪声建模（Noise Modeling）

#### 噪声类型

| 类型 | 定义 | 示例 | 检测方法 |
|------|------|------|---------|
| **标注噪声** | 标签错误 | 猫被标为狗 | 多人标注一致性 |
| **输入噪声** | 数据本身错误 | 图像模糊、文本乱码 | 质量评分 |
| **格式噪声** | 格式不一致 | "2025-12-11" vs "12/11/2025" | 正则匹配 |
| **重复噪声** | 样本重复 | 完全相同的记录 | 哈希去重 |
| **异常噪声** | 离群点 | 年龄=999 | 统计检测 |

#### 噪声估算

**方法1：多人标注一致性**
```python
from sklearn.metrics import cohen_kappa_score

# 两个标注者的标注结果
labels_annotator1 = [...]
labels_annotator2 = [...]

# Cohen's Kappa（一致性系数）
kappa = cohen_kappa_score(labels_annotator1, labels_annotator2)

# kappa < 0.6 → 噪声可能>20%
# kappa 0.6-0.8 → 噪声约10-20%
# kappa > 0.8 → 噪声<10%
```

**方法2：置信学习（Confident Learning）**
```python
from cleanlab import filter

# 使用模型预测找出噪声
predicted_probs = model.predict_proba(X)
noisy_indices = filter.find_label_issues(
    labels=y,
    pred_probs=predicted_probs,
    return_indices_ranked_by='self_confidence'
)
```

### 2. 去重（Deduplication）

#### 精确去重

```python
import hashlib

def exact_dedup(data, key='text'):
    seen = set()
    for item in data:
        h = hashlib.md5(item[key].encode()).hexdigest()
        if h not in seen:
            seen.add(h)
            yield item
```

#### 近似去重

**MinHash LSH**
```python
from datasketch import MinHash, MinHashLSH

def fuzzy_dedup(documents, threshold=0.9):
    lsh = MinHashLSH(threshold=threshold, num_perm=128)

    for doc_id, doc in enumerate(documents):
        m = MinHash(num_perm=128)
        for word in doc.split():
            m.update(word.encode())
        lsh.insert(doc_id, m)

    # 找出重复组
    duplicates = []
    seen = set()
    for doc_id in range(len(documents)):
        if doc_id in seen:
            continue
        m = create_minhash(documents[doc_id])
        dups = lsh.query(m)
        if len(dups) > 1:
            duplicates.append(dups)
            seen.update(dups)

    return duplicates
```

**图像去重（感知哈希）**
```python
import imagehash
from PIL import Image

def image_dedup(image_paths, threshold=5):
    hashes = {}
    for path in image_paths:
        img = Image.open(path)
        h = imagehash.phash(img)
        hashes[path] = h

    # 找出相似图像
    duplicates = []
    seen = set()
    for path1, h1 in hashes.items():
        if path1 in seen:
            continue
        group = [path1]
        for path2, h2 in hashes.items():
            if path1 != path2 and h1 - h2 < threshold:
                group.append(path2)
                seen.add(path2)
        if len(group) > 1:
            duplicates.append(group)

    return duplicates
```

### 3. 归一化（Normalization）

#### 文本归一化

```python
def normalize_text(text):
    # 1. 统一大小写
    text = text.lower()

    # 2. 去除多余空白
    text = ' '.join(text.split())

    # 3. 统一标点
    text = text.replace('，', ',').replace('。', '.')

    # 4. 去除特殊字符
    import re
    text = re.sub(r'[^\w\s,.]', '', text)

    # 5. Unicode归一化
    import unicodedata
    text = unicodedata.normalize('NFKC', text)

    return text
```

#### 数值归一化

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Z-score归一化
scaler = StandardScaler()
X_normalized = scaler.fit_transform(X)

# Min-Max归一化到[0,1]
scaler = MinMaxScaler()
X_normalized = scaler.fit_transform(X)
```

#### 日期时间归一化

```python
from dateutil import parser
import pytz

def normalize_datetime(dt_string):
    # 解析各种格式
    dt = parser.parse(dt_string)

    # 转换到UTC
    if dt.tzinfo is None:
        dt = pytz.utc.localize(dt)
    else:
        dt = dt.astimezone(pytz.utc)

    # 统一格式
    return dt.isoformat()

# 示例
normalize_datetime("2025-12-11 10:30")  # → "2025-12-11T10:30:00+00:00"
normalize_datetime("12/11/2025")        # → "2025-12-11T00:00:00+00:00"
```

### 4. 异常检测（Outlier Detection）

#### 统计方法

**3-sigma规则**
```python
import numpy as np

def detect_outliers_zscore(data, threshold=3):
    mean = np.mean(data)
    std = np.std(data)
    z_scores = np.abs((data - mean) / std)
    return np.where(z_scores > threshold)[0]
```

**IQR方法**
```python
def detect_outliers_iqr(data):
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1

    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    return np.where((data < lower_bound) | (data > upper_bound))[0]
```

#### 机器学习方法

**Isolation Forest**
```python
from sklearn.ensemble import IsolationForest

clf = IsolationForest(contamination=0.1, random_state=42)
predictions = clf.fit_predict(X)
outliers = np.where(predictions == -1)[0]
```

**Local Outlier Factor**
```python
from sklearn.neighbors import LocalOutlierFactor

lof = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
predictions = lof.fit_predict(X)
outliers = np.where(predictions == -1)[0]
```

### 5. 嵌入空间聚类清洗

#### 方法流程

```python
from sklearn.cluster import KMeans
from sentence_transformers import SentenceTransformer

# 1. 生成嵌入
model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(texts)

# 2. 聚类
kmeans = KMeans(n_clusters=50, random_state=42)
clusters = kmeans.fit_predict(embeddings)

# 3. 检查每个簇
for cluster_id in range(50):
    cluster_samples = [texts[i] for i in range(len(texts)) if clusters[i] == cluster_id]

    # 如果簇过小（可能是异常）
    if len(cluster_samples) < 5:
        print(f"异常簇{cluster_id}: {cluster_samples}")

    # 如果簇内标签不一致（可能是噪声）
    cluster_labels = [labels[i] for i in range(len(texts)) if clusters[i] == cluster_id]
    if len(set(cluster_labels)) > 1:
        print(f"标签不一致簇{cluster_id}")
```

### 6. 自动纠错

#### 拼写纠错

```python
from symspellpy import SymSpell

sym_spell = SymSpell(max_dictionary_edit_distance=2)
sym_spell.load_dictionary("frequency_dictionary_en_82_765.txt", 0, 1)

def correct_text(text):
    words = text.split()
    corrected = []
    for word in words:
        suggestions = sym_spell.lookup(word, Verbosity.CLOSEST)
        if suggestions:
            corrected.append(suggestions[0].term)
        else:
            corrected.append(word)
    return ' '.join(corrected)
```

#### 数据修复（基于规则）

```python
def repair_data(data):
    # 修复缺失值
    data['age'].fillna(data['age'].median(), inplace=True)

    # 修复格式错误
    data['phone'] = data['phone'].str.replace(r'\D', '', regex=True)

    # 修复逻辑错误
    data.loc[data['age'] < 0, 'age'] = abs(data['age'])
    data.loc[data['age'] > 150, 'age'] = None

    return data
```

## 清洗流程

### 标准流程

```
原始数据
  ↓
1. 格式验证（Schema检查）
  ↓
2. 去重（精确+近似）
  ↓
3. 归一化（统一格式）
  ↓
4. 异常检测（统计+ML）
  ↓
5. 噪声标注（标记可疑样本）
  ↓
6. 人工审核（抽检+修正）
  ↓
清洗后数据
```

### 清洗等级

| 等级 | 清洗程度 | 适用场景 |
|------|---------|---------|
| **L1: 基础** | 去重+格式化 | 探索阶段 |
| **L2: 标准** | L1+异常检测 | 一般应用 |
| **L3: 严格** | L2+噪声检测+人工审核 | 生产系统 |
| **L4: 极致** | L3+专家校验 | 高风险应用 |

## 清洗工具

### 开源工具

**数据验证**
- Great Expectations（数据质量验证）
- Pandera（DataFrame验证）

**去重**
- datasketch（MinHash LSH）
- dedupe（模糊匹配）

**清洗**
- pandas（数据处理）
- pyjanitor（清洗工具集）
- cleanlab（噪声检测）

**异常检测**
- scikit-learn（Isolation Forest, LOF）
- PyOD（异常检测算法库）

### 商业工具

- Trifacta Wrangler（数据清洗平台）
- OpenRefine（开源清洗工具）
- Talend Data Quality

## 质量评估

### 清洗效果指标

```python
def evaluate_cleaning(original, cleaned):
    metrics = {}

    # 去重率
    metrics['dedup_rate'] = 1 - len(cleaned) / len(original)

    # 缺失值率
    metrics['missing_rate'] = cleaned.isnull().sum().sum() / cleaned.size

    # 格式一致性
    metrics['format_consistency'] = check_format_consistency(cleaned)

    # 异常值率
    metrics['outlier_rate'] = detect_outliers(cleaned).sum() / len(cleaned)

    return metrics
```

## 常见陷阱

### 陷阱1：过度清洗

❌ 删除所有异常值
```
可能导致：丢失重要的边缘case
```

✅ 标记而非删除
```
标记可疑样本，让模型学习处理
```

### 陷阱2：忽略领域知识

❌ 纯统计方法清洗
```
可能导致：误删正常但罕见的样本
```

✅ 结合领域规则
```
医疗数据：年龄>100可能是错误，但也可能是真实案例
```

### 陷阱3：清洗后不验证

❌ 清洗完直接使用
```
可能导致：引入新的错误
```

✅ 清洗后抽检
```
随机抽取100样本人工验证
```

## 最佳实践

1. **保留原始数据**：清洗后的数据单独存储
2. **可追溯性**：记录清洗过程和规则
3. **迭代清洗**：清洗→训练→分析→再清洗
4. **人机结合**：自动清洗+人工抽检
5. **版本管理**：数据集版本化（v1_raw, v1_cleaned）

## 总结

数据清洗是数据构建中最耗时但最关键的环节：
- **质量优先**：宁可少而精，不要多而杂
- **系统方法**：遵循标准流程，避免遗漏
- **工具自动化**：使用专业工具提升效率
- **持续迭代**：清洗不是一次性任务

## 延伸阅读

- [D4. 数据采集科学](D4-acquisition.md) - 采集后需要清洗
- [D6. 标注科学](D6-annotation.md) - 清洗后才标注
- [D8. 数据评估科学](D8-evaluation.md) - 评估清洗效果

---

**核心观点**

> 数据清洗不是"删除脏数据"，而是系统化提升数据质量的科学过程。高质量数据是模型性能的基石。

