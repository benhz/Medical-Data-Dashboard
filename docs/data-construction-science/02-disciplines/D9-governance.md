# D9. 数据治理科学（Data Governance Science）

## 定义

**数据治理科学**研究数据全生命周期的管理、合规、安全、版本控制、权限管理等,确保数据的可信、可控、可追溯。

> **核心问题**:如何系统化地管理数据资产,确保质量、合规、安全?

## 为什么需要数据治理?

### 数据治理的价值

```
1. 合规保障 (GDPR、HIPAA、金融监管)
2. 质量保证 (版本管理、审计追踪)
3. 风险控制 (隐私保护、安全管理)
4. 资产复用 (元数据管理、知识沉淀)
5. 协作效率 (权限管理、标准化)
```

**没有治理的后果**:
- 数据泄露 → 巨额罚款
- 版本混乱 → 模型不可复现
- 质量失控 → 模型性能下降
- 知识流失 → 重复劳动

## 核心内容

### 1. 数据版本管理（Dataset Versioning）

#### 为什么需要版本管理?

```
1. 可复现性:任何模型都能追溯到训练数据版本
2. 迭代优化:清晰记录数据改进历程
3. 回滚能力:发现问题可快速回退
4. A/B测试:对比不同数据版本的效果
```

#### 版本管理工具

**DVC (Data Version Control)**
```bash
# 初始化
dvc init

# 追踪数据文件
dvc add data/train.csv

# 提交版本
git add data/train.csv.dvc .gitignore
git commit -m "v1: Initial dataset"
git tag -a "data-v1" -m "First version"

# 切换版本
git checkout data-v2
dvc checkout
```

**LakeFS**
```bash
# 创建分支
lakectl branch create lakefs://repo/experiment-branch -s lakefs://repo/main

# 提交变更
lakectl commit lakefs://repo/experiment-branch -m "Added 1000 samples"

# 合并
lakectl merge lakefs://repo/experiment-branch lakefs://repo/main
```

#### 版本命名规范

```
命名格式: {project}_{task}_{version}_{date}

示例:
- nlp_classification_v1.0_20251211
- ocr_detection_v2.1_20251215
- medical_diagnosis_v3.0_20251220

版本号规则:
- 主版本(v1 → v2): 重大架构变化
- 次版本(v1.0 → v1.1): 增加新数据
- 修订版本(v1.1.0 → v1.1.1): 修复错误
```

### 2. 元数据管理（Metadata Management）

#### 元数据类型

**数据集元数据**
```yaml
dataset:
  name: "sentiment_classification_v1"
  created_at: "2025-12-11"
  created_by: "data_team"
  description: "中文情感分类数据集"

  statistics:
    total_samples: 50000
    num_classes: 3
    class_distribution:
      positive: 20000
      negative: 15000
      neutral: 15000

  schema:
    fields:
      - name: "text"
        type: "string"
        description: "评论文本"
      - name: "label"
        type: "categorical"
        values: ["positive", "negative", "neutral"]

  provenance:
    sources:
      - "电商评论 (60%)"
      - "微博数据 (30%)"
      - "人工构造 (10%)"

  quality:
    label_noise_rate: 0.05
    duplicate_rate: 0.02
    dq_score: 0.87

  annotations:
    protocol_version: "v2.1"
    num_annotators: 5
    inter_annotator_agreement: 0.82
```

**样本元数据**
```json
{
  "id": "sample_001",
  "text": "这个产品非常好用",
  "label": "positive",
  "metadata": {
    "source": "taobao",
    "annotator": "annotator_03",
    "annotation_time": "2025-12-11T10:30:00",
    "confidence": 0.95,
    "review_status": "approved",
    "difficulty": "easy"
  }
}
```

#### 元数据管理系统

```python
import yaml

class MetadataManager:
    def __init__(self, metadata_path):
        self.metadata_path = metadata_path
        self.metadata = self.load()

    def load(self):
        with open(self.metadata_path) as f:
            return yaml.safe_load(f)

    def update(self, key, value):
        self.metadata[key] = value
        self.save()

    def save(self):
        with open(self.metadata_path, 'w') as f:
            yaml.dump(self.metadata, f)

    def get_provenance(self):
        return self.metadata.get('provenance', {})

    def get_quality_metrics(self):
        return self.metadata.get('quality', {})
```

### 3. 权限管理（Access Control）

#### RBAC (Role-Based Access Control)

```python
roles = {
    'data_admin': {
        'permissions': ['read', 'write', 'delete', 'grant']
    },
    'annotator': {
        'permissions': ['read', 'annotate']
    },
    'model_engineer': {
        'permissions': ['read']
    },
    'auditor': {
        'permissions': ['read', 'audit']
    }
}

class AccessControl:
    def __init__(self, roles):
        self.roles = roles
        self.user_roles = {}

    def grant_role(self, user, role):
        if role not in self.roles:
            raise ValueError(f"Role {role} not defined")
        self.user_roles[user] = role

    def check_permission(self, user, permission):
        role = self.user_roles.get(user)
        if not role:
            return False
        return permission in self.roles[role]['permissions']

    def authorize(self, user, operation):
        if not self.check_permission(user, operation):
            raise PermissionError(f"User {user} not authorized for {operation}")
```

### 4. 审计追踪（Audit Trail）

#### 审计日志设计

```python
import logging
import json
from datetime import datetime

class AuditLogger:
    def __init__(self, log_file='audit.log'):
        self.logger = logging.getLogger('audit')
        handler = logging.FileHandler(log_file)
        handler.setFormatter(logging.Formatter('%(message)s'))
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)

    def log(self, event_type, user, resource, action, details=None):
        event = {
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'user': user,
            'resource': resource,
            'action': action,
            'details': details or {}
        }
        self.logger.info(json.dumps(event))

# 使用
auditor = AuditLogger()

auditor.log('data_access', user='alice', resource='dataset_v1', action='read')
auditor.log('data_modification', user='bob', resource='sample_001',
            action='update', details={'field': 'label', 'old': 'A', 'new': 'B'})
auditor.log('data_export', user='charlie', resource='dataset_v1',
            action='export', details={'format': 'csv', 'rows': 1000})
```

#### 审计查询

```python
def query_audit_log(log_file, filters):
    """
    filters = {
        'user': 'alice',
        'action': 'delete',
        'start_time': '2025-12-01',
        'end_time': '2025-12-31'
    }
    """
    results = []

    with open(log_file) as f:
        for line in f:
            event = json.loads(line)

            # 应用过滤器
            if all(event.get(k) == v for k, v in filters.items()):
                results.append(event)

    return results
```

### 5. 数据生命周期管理

#### 生命周期阶段

```
创建 → 验证 → 标注 → 审核 → 发布 → 使用 → 归档 → 销毁
```

**状态机**
```python
from enum import Enum

class DataLifecycleState(Enum):
    CREATED = "created"
    VALIDATED = "validated"
    ANNOTATED = "annotated"
    REVIEWED = "reviewed"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    DELETED = "deleted"

class DataLifecycle:
    transitions = {
        'CREATED': ['VALIDATED'],
        'VALIDATED': ['ANNOTATED'],
        'ANNOTATED': ['REVIEWED'],
        'REVIEWED': ['PUBLISHED', 'ANNOTATED'],  # 可退回重新标注
        'PUBLISHED': ['ARCHIVED'],
        'ARCHIVED': ['DELETED']
    }

    def __init__(self, dataset_id):
        self.dataset_id = dataset_id
        self.state = DataLifecycleState.CREATED

    def transition(self, new_state):
        if new_state.name not in self.transitions[self.state.name]:
            raise ValueError(f"Invalid transition from {self.state} to {new_state}")

        self.state = new_state
        self.log_transition(new_state)

    def log_transition(self, new_state):
        auditor.log('lifecycle_change', user='system',
                   resource=self.dataset_id,
                   action='state_change',
                   details={'new_state': new_state.value})
```

#### 数据归档策略

```python
def archive_old_datasets(storage, retention_days=365):
    """归档超过一年未使用的数据集"""
    from datetime import datetime, timedelta

    threshold = datetime.now() - timedelta(days=retention_days)

    for dataset in storage.list_datasets():
        last_accessed = dataset.get_last_access_time()

        if last_accessed < threshold:
            # 归档到冷存储
            storage.archive(dataset.id)
            auditor.log('data_archive', user='system',
                       resource=dataset.id, action='archive')
```

### 6. 合规管理（Compliance）

#### GDPR合规

```python
class GDPRCompliance:
    def __init__(self, dataset):
        self.dataset = dataset

    def anonymize_pii(self):
        """匿名化个人身份信息"""
        pii_fields = ['name', 'email', 'phone', 'address']

        for field in pii_fields:
            if field in self.dataset.columns:
                self.dataset[field] = self.dataset[field].apply(self.hash_value)

    def hash_value(self, value):
        import hashlib
        return hashlib.sha256(str(value).encode()).hexdigest()[:16]

    def right_to_erasure(self, user_id):
        """用户删除权"""
        self.dataset = self.dataset[self.dataset['user_id'] != user_id]
        auditor.log('gdpr_erasure', user='system',
                   resource='dataset', action='delete',
                   details={'user_id': user_id})

    def data_export(self, user_id):
        """数据可携带权"""
        user_data = self.dataset[self.dataset['user_id'] == user_id]
        return user_data.to_dict('records')
```

#### 医疗数据合规(HIPAA)

```python
class HIPAACompliance:
    PHI_IDENTIFIERS = [
        'name', 'address', 'date_of_birth', 'phone',
        'ssn', 'medical_record_number', 'email'
    ]

    def deidentify(self, dataset):
        """去标识化"""
        for identifier in self.PHI_IDENTIFIERS:
            if identifier in dataset.columns:
                dataset = dataset.drop(columns=[identifier])

        # 日期模糊化(只保留年份)
        if 'date' in dataset.columns:
            dataset['date'] = dataset['date'].dt.year

        return dataset

    def audit_access(self, user, purpose):
        """访问审计"""
        if purpose not in ['treatment', 'payment', 'operations']:
            raise PermissionError("Invalid access purpose")

        auditor.log('hipaa_access', user=user,
                   resource='medical_data', action='access',
                   details={'purpose': purpose})
```

### 7. 数据质量等级体系

#### 质量等级定义

| 等级 | 标准 | 适用场景 |
|------|------|---------|
| **DQ-1** | 基础可用(噪声<20%) | 研究实验 |
| **DQ-2** | 良好(噪声<10%, IAA>0.6) | 一般应用 |
| **DQ-3** | 高质量(噪声<5%, IAA>0.8) | 生产系统 |
| **DQ-4** | 卓越(噪声<2%, IAA>0.9) | 关键应用 |
| **DQ-5** | 完美(噪声<0.5%, IAA>0.95) | 高风险应用(医疗、金融) |

#### 质量认证流程

```python
def certify_dataset_quality(dataset, metadata):
    checklist = {
        'label_noise_rate': metadata['quality']['label_noise_rate'],
        'iaa': metadata['annotations']['inter_annotator_agreement'],
        'duplicate_rate': metadata['quality']['duplicate_rate'],
        'completeness': metadata['quality'].get('completeness', 1.0)
    }

    if (checklist['label_noise_rate'] < 0.005 and
        checklist['iaa'] > 0.95 and
        checklist['duplicate_rate'] < 0.01 and
        checklist['completeness'] > 0.99):
        return 'DQ-5'

    elif (checklist['label_noise_rate'] < 0.02 and
          checklist['iaa'] > 0.9):
        return 'DQ-4'

    elif (checklist['label_noise_rate'] < 0.05 and
          checklist['iaa'] > 0.8):
        return 'DQ-3'

    elif (checklist['label_noise_rate'] < 0.1 and
          checklist['iaa'] > 0.6):
        return 'DQ-2'

    else:
        return 'DQ-1'
```

## 治理工具链

### 开源工具

| 工具 | 用途 |
|------|------|
| **DVC** | 数据版本控制 |
| **LakeFS** | 数据湖版本管理 |
| **Apache Atlas** | 元数据管理 |
| **OpenMetadata** | 元数据平台 |
| **Great Expectations** | 数据验证 |

### 商业工具

- **Collibra**: 企业级数据治理
- **Alation**: 数据目录
- **Informatica**: 数据质量管理

## 最佳实践

1. **版本管理为先**: 所有数据必须版本化
2. **元数据完整**: 记录数据来源、处理过程、质量指标
3. **权限最小化**: 只授予必要权限
4. **全程审计**: 记录所有数据操作
5. **合规优先**: 特别是医疗、金融等高风险领域

## 总结

数据治理是数据构建的基础设施:
- **合规保障**: 避免法律风险
- **质量保证**: 系统化质量管理
- **资产管理**: 数据可复用、可追溯
- **长期价值**: 数据治理是长期投资

## 延伸阅读

- [D8. 数据评估科学](D8-evaluation.md) - 质量评估是治理基础
- [E2. 数据平台工程](../03-engineering/E2-platform.md) - 治理的工程实现
- [治理体系](../04-governance/overview.md) - 详细治理框架

---

**核心观点**

> 数据治理不是"管理负担",而是数据资产的保值增值机制。没有治理的数据是负债,有治理的数据才是资产。

