# E2. 数据平台工程（Data Platform Engineering）

## 定义

数据平台提供统一的数据存储、版本管理、元数据管理、可视化等基础设施。

## 平台架构

```
┌─────────────────────────────────────┐
│         可视化层 (Dashboard)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│       元数据管理 (Metadata Hub)      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      版本控制 (Version Control)      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         数据湖 (Data Lake)           │
└─────────────────────────────────────┘
```

## 核心功能

### 1. 数据湖

```python
# 使用Delta Lake
from delta import *

# 写入数据
df.write.format("delta").save("/data/datasets/v1")

# 读取数据
df = spark.read.format("delta").load("/data/datasets/v1")

# 时间旅行
df_historical = spark.read.format("delta") \
    .option("versionAsOf", 0) \
    .load("/data/datasets/v1")
```

### 2. 版本控制

使用DVC或LakeFS管理数据版本(参考D9)。

### 3. 元数据中心

```python
class MetadataHub:
    def register_dataset(self, name, version, metadata):
        """注册数据集元数据"""
        pass

    def query_dataset(self, name, version=None):
        """查询数据集信息"""
        pass

    def track_lineage(self, dataset_id):
        """追踪数据血缘"""
        pass
```

### 4. 数据目录

提供Web界面浏览、搜索、下载数据集。

## 技术栈

- **存储**: Delta Lake, Apache Iceberg
- **版本控制**: DVC, LakeFS
- **元数据**: Apache Atlas, OpenMetadata
- **可视化**: Streamlit, Dash

## 延伸阅读

- [D9. 数据治理科学](../02-disciplines/D9-governance.md)
- [E1. 数据流水线工程](E1-pipeline.md)

