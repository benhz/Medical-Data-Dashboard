# 数据质量等级体系

## 质量等级定义

| 等级 | 噪声率 | IAA | 适用场景 |
|------|--------|-----|---------|
| **DQ-5** | <0.5% | >0.95 | 医疗诊断、金融风控 |
| **DQ-4** | <2% | >0.9 | 关键业务应用 |
| **DQ-3** | <5% | >0.8 | 生产系统 |
| **DQ-2** | <10% | >0.6 | 一般应用 |
| **DQ-1** | <20% | >0.4 | 研究实验 |

## 认证流程

### 1. 质量检测

```python
def assess_quality_level(dataset, metadata):
    """评估数据集质量等级"""
    noise_rate = metadata['quality']['label_noise_rate']
    iaa = metadata['annotations']['inter_annotator_agreement']
    completeness = metadata['quality'].get('completeness', 1.0)

    # 判定等级
    if noise_rate < 0.005 and iaa > 0.95 and completeness > 0.99:
        return 'DQ-5'
    elif noise_rate < 0.02 and iaa > 0.9:
        return 'DQ-4'
    elif noise_rate < 0.05 and iaa > 0.8:
        return 'DQ-3'
    elif noise_rate < 0.1 and iaa > 0.6:
        return 'DQ-2'
    else:
        return 'DQ-1'
```

### 2. 质量认证

1. 提交数据集和元数据
2. 自动质量检测
3. 人工抽检验证(10%样本)
4. 颁发质量等级证书

### 3. 持续监控

定期重新评估质量,确保等级维持。

## 质量提升路径

```
DQ-1 → DQ-2:
- 清洗明显噪声
- 改进标注协议

DQ-2 → DQ-3:
- 多人标注+一致性检查
- 专家校验困难样本

DQ-3 → DQ-4:
- 专家标注
- 严格质量控制

DQ-4 → DQ-5:
- 领域专家深度审核
- 多轮交叉验证
```

## 延伸阅读

- [D8. 数据评估科学](../02-disciplines/D8-evaluation.md)
- [overview.md](overview.md) - 治理体系概览

