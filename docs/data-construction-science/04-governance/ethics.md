# 数据伦理

## 核心原则

### 1. 隐私保护

**个人信息脱敏**
```python
def anonymize_pii(data):
    """匿名化个人身份信息"""
    # 姓名
    data['name'] = data['name'].apply(lambda x: x[0] + '**')
    # 手机
    data['phone'] = data['phone'].apply(lambda x: x[:3] + '****' + x[-4:])
    # 邮箱
    data['email'] = data['email'].apply(lambda x: x[0] + '***@' + x.split('@')[1])

    return data
```

**差分隐私**
```python
from diffprivlib.mechanisms import Laplace

# 添加噪声保护隐私
mechanism = Laplace(epsilon=1.0, sensitivity=1.0)
noisy_data = mechanism.randomise(data)
```

### 2. 公平性

**检测偏见**
```python
def check_fairness(model, data, sensitive_attr='gender'):
    """检查模型在不同群体上的公平性"""
    groups = data[sensitive_attr].unique()

    for group in groups:
        group_data = data[data[sensitive_attr] == group]
        accuracy = model.score(group_data)
        print(f"{group}群体准确率: {accuracy}")

    # 如果群体间差异>5%,需要关注
```

### 3. 透明性

- 记录数据来源
- 文档标注协议
- 提供数据说明

## 伦理审查清单

- [ ] 是否获得数据使用许可?
- [ ] 是否保护个人隐私?
- [ ] 是否存在群体偏见?
- [ ] 是否有潜在歧视风险?
- [ ] 是否可能被恶意使用?

## 延伸阅读

- [compliance.md](compliance.md) - 法律合规
- [D9. 数据治理科学](../02-disciplines/D9-governance.md)

