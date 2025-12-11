# 合规管理

## 主要法规

### 1. GDPR (欧盟数据保护条例)

**核心权利**
- 知情权: 告知数据用途
- 访问权: 用户可查看自己的数据
- 删除权: 用户可要求删除数据
- 可携带权: 数据可导出

**实施要点**
```python
class GDPRCompliance:
    def right_to_access(self, user_id):
        """用户访问权"""
        return self.get_user_data(user_id)

    def right_to_erasure(self, user_id):
        """用户删除权(被遗忘权)"""
        self.delete_user_data(user_id)
        self.log_deletion(user_id)

    def right_to_portability(self, user_id):
        """数据可携带权"""
        data = self.get_user_data(user_id)
        return data.to_json()
```

### 2. HIPAA (美国医疗数据隐私法)

**保护对象**: 受保护健康信息(PHI)

**去标识化要求**
```python
PHI_IDENTIFIERS = [
    'name', 'address', 'phone', 'email',
    'ssn', 'medical_record_number',
    'account_number', 'biometric_id'
]

def deidentify_hipaa(medical_data):
    """HIPAA去标识化"""
    for identifier in PHI_IDENTIFIERS:
        if identifier in medical_data.columns:
            medical_data = medical_data.drop(columns=[identifier])

    # 日期只保留年份
    medical_data['date'] = medical_data['date'].dt.year

    return medical_data
```

### 3. 金融监管

- 数据加密存储
- 访问日志审计
- 定期安全评估

## 合规检查清单

- [ ] GDPR合规(如涉及欧盟用户)
- [ ] HIPAA合规(如医疗数据)
- [ ] 数据跨境合规
- [ ] 用户授权获取
- [ ] 安全存储加密
- [ ] 访问审计日志

## 延伸阅读

- [ethics.md](ethics.md) - 数据伦理
- [D9. 数据治理科学](../02-disciplines/D9-governance.md)

