# D6. 标注科学（Annotation Science）

## 定义

**标注科学**研究如何为数据打上高质量标签,包括标注协议设计、多人一致性、标签冲突管理、专家标注体系、自动标注等。

> **核心问题**:如何系统化地为数据打上准确、一致、可靠的标签?

## 为什么标注如此关键?

### 标注质量定律
```
模型性能上限 ≤ 标注质量上限
标注一致性 → 模型置信度
```

**真实案例**:
- 某NER任务,三人标注一致性仅60% → 模型F1最多65%
- 某图像分类,标注错误率15% → 模型准确率最多85%
- 某对话系统,标注协议模糊 → 标注者各自理解,模型混乱

## 核心内容

### 1. 标注协议设计(Annotation Guideline)

#### 协议结构

```markdown
# 标注协议:命名实体识别

## 1. 任务定义
识别文本中的人名、地名、机构名

## 2. 标签体系
- PER:人名
- LOC:地名
- ORG:机构名

## 3. 标注规则
### 3.1 人名
- 包含:完整姓名、昵称、代称
- 示例:张三、小明、王总
- 不包含:职位名称(经理、教授)

### 3.2 边界情况
- "北京大学"→ ORG(整体标注,不拆分)
- "中国北京"→ LOC-中国 + LOC-北京(分别标注)

## 4. 困难case
- 模糊case:"苹果公司" vs "苹果"(水果)
  → 看上下文,有"公司"则标ORG
- 嵌套实体:"北京市朝阳区"
  → 标注最大范围LOC

## 5. 示例
- ✓ 正确:[张三]_PER 在[北京大学]_ORG 工作
- ✗ 错误:[张三教授]_PER(不含职位)
```

#### 设计原则

1. **明确性**:每个规则清晰无歧义
2. **完备性**:覆盖所有可能情况
3. **一致性**:规则之间不冲突
4. **可操作性**:标注者能够执行
5. **可验证性**:标注结果可检查

### 2. 标注流程设计

#### 单轮标注
```
数据 → 标注者 → 标注结果 → 质检 → 最终数据
```

#### 多轮标注(推荐)
```
数据
  ↓
标注者A、B、C(独立标注)
  ↓
计算一致性(IAA)
  ↓
一致?
├─ 是 → 接受
└─ 否 → 讨论/专家裁决
  ↓
最终标注
```

#### 迭代标注
```
v1协议 → 试标注100样本 → 分析冲突
  ↓
v2协议(改进) → 试标注200样本 → 再分析
  ↓
v3协议(最终) → 全量标注
```

### 3. 多人一致性(Inter-Annotator Agreement)

#### 一致性指标

**Cohen's Kappa(两人)**
```python
from sklearn.metrics import cohen_kappa_score

kappa = cohen_kappa_score(labels_A, labels_B)

# 解释
# kappa < 0.4:一致性差
# kappa 0.4-0.6:一致性中等
# kappa 0.6-0.8:一致性好
# kappa > 0.8:一致性优秀
```

**Fleiss' Kappa(多人)**
```python
from statsmodels.stats.inter_rater import fleiss_kappa

# data: (n_samples, n_categories)
# 每行是一个样本,每列是标注为某类别的人数
kappa = fleiss_kappa(data)
```

**F1 Score(序列标注)**
```python
from seqeval.metrics import f1_score

# 对于NER等序列标注任务
f1 = f1_score([labels_true], [labels_pred])
```

#### 一致性分析

```python
def analyze_disagreement(labels_A, labels_B, data):
    disagreements = []

    for i, (a, b) in enumerate(zip(labels_A, labels_B)):
        if a != b:
            disagreements.append({
                'index': i,
                'text': data[i],
                'label_A': a,
                'label_B': b
            })

    # 分析不一致的模式
    import pandas as pd
    df = pd.DataFrame(disagreements)
    confusion = pd.crosstab(df['label_A'], df['label_B'])
    print(confusion)

    return disagreements
```

### 4. 标签冲突管理

#### 冲突解决策略

| 策略 | 方法 | 适用场景 |
|------|------|---------|
| **多数投票** | 3+人标注,取多数 | 简单分类 |
| **专家裁决** | 专家做最终决定 | 复杂任务 |
| **讨论一致** | 标注者讨论达成共识 | 边界模糊 |
| **标签软化** | 保留多标签分布 | 本质模糊 |
| **标记争议** | 标记为难样本 | 训练数据 |

#### 多数投票实现

```python
from collections import Counter

def majority_vote(labels_list):
    """
    labels_list: [[label1_A, label2_A, ...], [label1_B, ...], ...]
    """
    final_labels = []
    for labels in zip(*labels_list):
        counter = Counter(labels)
        most_common = counter.most_common(1)[0]

        # 如果没有明显多数(票数相同)
        if len(counter) > 1 and list(counter.values()).count(most_common[1]) > 1:
            final_labels.append('AMBIGUOUS')  # 标记为模糊
        else:
            final_labels.append(most_common[0])

    return final_labels
```

#### 标签软化(Soft Labels)

```python
def create_soft_labels(labels_list, num_classes):
    """将多人标注转为概率分布"""
    soft_labels = []

    for labels in zip(*labels_list):
        counter = Counter(labels)
        probs = [counter.get(i, 0) / len(labels) for i in range(num_classes)]
        soft_labels.append(probs)

    return np.array(soft_labels)

# 训练时使用KL散度损失
from torch.nn import KLDivLoss
criterion = KLDivLoss()
```

### 5. 标注质量控制

#### 质检方法

**1. 金标准检查(Gold Standard)**
```python
# 准备100个专家标注的样本作为金标准
gold_standard = load_gold_standard()

# 每个标注者定期标注金标准样本
annotator_labels = annotator.label(gold_standard.data)

# 计算准确率
accuracy = np.mean(annotator_labels == gold_standard.labels)

if accuracy < 0.9:
    print("警告:标注者质量不合格,需要重新培训")
```

**2. 交叉验证**
```python
# 随机10%的样本由两人标注
def cross_validate(data, ratio=0.1):
    n_cross = int(len(data) * ratio)
    cross_indices = random.sample(range(len(data)), n_cross)

    for idx in cross_indices:
        labels_A = annotator_A.label(data[idx])
        labels_B = annotator_B.label(data[idx])

        if labels_A != labels_B:
            print(f"不一致样本{idx}: A={labels_A}, B={labels_B}")
```

**3. 一致性监控**
```python
import matplotlib.pyplot as plt

def monitor_consistency(kappa_scores, timestamps):
    plt.plot(timestamps, kappa_scores)
    plt.axhline(y=0.8, color='g', linestyle='--', label='目标')
    plt.axhline(y=0.6, color='r', linestyle='--', label='警戒线')
    plt.xlabel('时间')
    plt.ylabel('Kappa')
    plt.legend()
    plt.show()
```

### 6. 自动标注与人工协作

#### 自动标注方法

**1. 规则标注**
```python
import re

def rule_based_labeling(text):
    # 邮箱识别
    if re.match(r'[\w\.-]+@[\w\.-]+', text):
        return 'EMAIL'
    # 日期识别
    if re.match(r'\d{4}-\d{2}-\d{2}', text):
        return 'DATE'
    return 'OTHER'
```

**2. 模型预标注**
```python
# 使用已有模型预标注,人工校正
def pre_annotate(data, model):
    predictions = model.predict(data)
    confidences = model.predict_proba(data).max(axis=1)

    # 高置信度直接接受,低置信度人工审核
    for i, (pred, conf) in enumerate(zip(predictions, confidences)):
        if conf > 0.95:
            data[i]['label'] = pred
            data[i]['status'] = 'auto'
        else:
            data[i]['label'] = pred  # 作为建议
            data[i]['status'] = 'review'

    return data
```

**3. LLM标注**
```python
def llm_annotate(text, llm):
    prompt = f"""
    请对以下文本进行情感分类:正面/负面/中性

    文本:{text}

    分类:
    """
    response = llm.generate(prompt)
    return response.strip()

# 使用
from openai import OpenAI
client = OpenAI()

labels = [llm_annotate(text, client) for text in texts]
```

#### 人机协作策略

```
1. 规则标注(覆盖60%简单样本)
  ↓
2. 模型预标注(覆盖30%中等样本,人工校正)
  ↓
3. 人工标注(剩余10%困难样本)
  ↓
4. 质检(随机抽检5%)
```

### 7. 标注平台

#### 开源平台

| 平台 | 类型 | 特点 |
|------|------|------|
| **Label Studio** | 通用 | 支持文本、图像、音频 |
| **Doccano** | NLP | 轻量级,适合文本标注 |
| **CVAT** | CV | 专业图像/视频标注 |
| **Prodigy** | 通用 | 主动学习集成 |

#### 平台功能需求

- [ ] 多人协作
- [ ] 标注协议展示
- [ ] 快捷键支持
- [ ] 进度跟踪
- [ ] 一致性检查
- [ ] 导出标准格式
- [ ] 标注历史记录

## 标注成本估算

### 成本公式

```
总成本 = 样本数 × 单样本时间 × 标注人数 × 单位时间成本
```

### 时间估算

| 任务类型 | 单样本时间 | 示例 |
|---------|-----------|------|
| **简单分类** | 5-10秒 | 情感分类 |
| **命名实体** | 30-60秒 | NER |
| **语义分割** | 5-15分钟 | 图像分割 |
| **对话标注** | 2-5分钟 | 意图+槽位 |
| **医疗图像** | 10-30分钟 | 病灶标注 |

### 降低成本策略

1. **预标注**:使用模型自动标注,人工只需校正
2. **主动学习**:优先标注高价值样本
3. **众包**:简单任务众包,复杂任务专家
4. **迁移学习**:利用已有标注数据

## 特殊场景标注

### 序列标注(NER)

**BIO标注法**
```
B-PER:人名开始
I-PER:人名内部
O:非实体

示例:
张  B-PER
三  I-PER
在  O
北  B-LOC
京  I-LOC
```

### 关系抽取

```json
{
  "text": "张三在北京大学工作",
  "entities": [
    {"id": 1, "text": "张三", "type": "PER"},
    {"id": 2, "text": "北京大学", "type": "ORG"}
  ],
  "relations": [
    {"from": 1, "to": 2, "type": "work_at"}
  ]
}
```

### 对话标注

```json
{
  "utterance": "我想订一张明天去北京的机票",
  "intent": "book_flight",
  "slots": [
    {"type": "date", "value": "明天"},
    {"type": "destination", "value": "北京"}
  ]
}
```

## 最佳实践

1. **迭代协议**:不要一次性定完美协议,试标注后改进
2. **培训标注者**:标注前充分培训,统一理解
3. **定期校准**:定期标注金标准样本,保持一致性
4. **记录难点**:记录困难样本和决策,形成FAQ
5. **工具辅助**:使用专业标注平台,提升效率

## 总结

标注科学是数据构建的核心环节:
- **协议为先**:清晰的标注协议是高质量的前提
- **一致性为要**:多人一致性是质量的保障
- **人机结合**:自动标注提升效率,人工保证质量
- **持续优化**:标注是迭代过程,不断改进

## 延伸阅读

- [D1. 任务建模科学](D1-task-modeling.md) - 标签体系设计
- [D5. 数据清洗科学](D5-data-cleaning.md) - 标注前需清洗
- [D8. 数据评估科学](D8-evaluation.md) - 评估标注质量

---

**核心观点**

> 标注不是"打标签",而是系统化的科学过程:需要协议设计、质量控制、一致性保障、人机协作。高质量标注是模型性能的天花板。

