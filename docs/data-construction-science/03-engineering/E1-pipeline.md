# E1. 数据流水线工程（Data Pipeline Engineering）

## 定义

数据流水线工程将数据构建的各个环节(采集→清洗→标注→增强→评估)串联成自动化、可监控、可扩展的工程系统。

## 流水线架构

```
原始数据源
    ↓
[采集模块] (D4)
    ↓
[清洗模块] (D5)
    ↓
[标注模块] (D6)
    ↓
[增强模块] (D7)
    ↓
[评估模块] (D8)
    ↓
[版本管理] (D9)
    ↓
最终数据集
```

## 核心组件

### 1. 任务调度

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

dag = DAG(
    'data_pipeline',
    start_date=datetime(2025, 12, 11),
    schedule_interval='@daily'
)

crawl_task = PythonOperator(
    task_id='crawl',
    python_callable=crawl_data,
    dag=dag
)

clean_task = PythonOperator(
    task_id='clean',
    python_callable=clean_data,
    dag=dag
)

annotate_task = PythonOperator(
    task_id='annotate',
    python_callable=annotate_data,
    dag=dag
)

crawl_task >> clean_task >> annotate_task
```

### 2. 数据验证

```python
import great_expectations as ge

def validate_data(df):
    expectations = ge.dataset.PandasDataset(df)

    # 验证规则
    expectations.expect_column_to_exist('text')
    expectations.expect_column_values_to_not_be_null('text')
    expectations.expect_column_values_to_be_in_set('label', ['A', 'B', 'C'])

    results = expectations.validate()

    if not results['success']:
        raise ValueError("数据验证失败")

    return df
```

### 3. 监控告警

```python
import prometheus_client as prom

# 定义指标
pipeline_success = prom.Counter('pipeline_success_total', 'Successful pipeline runs')
pipeline_failure = prom.Counter('pipeline_failure_total', 'Failed pipeline runs')
pipeline_duration = prom.Histogram('pipeline_duration_seconds', 'Pipeline duration')

@pipeline_duration.time()
def run_pipeline():
    try:
        # 执行流水线
        result = execute_pipeline()
        pipeline_success.inc()
        return result
    except Exception as e:
        pipeline_failure.inc()
        send_alert(f"Pipeline failed: {e}")
        raise
```

## 最佳实践

1. **幂等性**: 重复执行产生相同结果
2. **可重试**: 失败自动重试
3. **可回滚**: 支持版本回退
4. **可监控**: 实时监控状态和指标
5. **模块化**: 各环节独立可替换

## 延伸阅读

- [D4-D8学科篇](../02-disciplines/) - 各模块的理论基础
- [E2. 数据平台工程](E2-platform.md) - 流水线运行的平台支撑

---

**核心观点**: 流水线工程是将学科理论转化为可执行系统的关键桥梁。

