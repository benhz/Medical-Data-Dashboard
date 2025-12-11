# D4. 数据采集科学（Acquisition Science）

## 定义

**数据采集科学**研究如何系统化、高效地从各种数据源获取数据，包括网络采集、日志采集、多模态采集、采集策略设计等。

> **核心问题**：如何设计采集策略，以高效、合规、高质量地获取所需数据？

## 核心采集类型

### 1. 网络采集（Web Crawling）

#### 采集策略

**广度优先 vs 深度优先**
```python
# 广度优先：先覆盖面
from queue import Queue
def bfs_crawl(start_url):
    queue = Queue()
    queue.put(start_url)
    while not queue.empty():
        url = queue.get()
        links = extract_links(url)
        for link in links:
            queue.put(link)

# 深度优先：先深入
def dfs_crawl(url, depth=0, max_depth=5):
    if depth > max_depth:
        return
    links = extract_links(url)
    for link in links:
        dfs_crawl(link, depth+1, max_depth)
```

#### 反爬虫对策

| 问题 | 解决方案 |
|------|---------|
| IP封禁 | 代理池轮换 |
| User-Agent检测 | 随机UA |
| 验证码 | OCR识别/打码平台 |
| 动态渲染 | Selenium/Puppeteer |
| 频率限制 | 延迟+并发控制 |

#### 最佳实践

```python
import scrapy
from scrapy.crawler import CrawlerProcess

class RespectfulSpider(scrapy.Spider):
    name = 'respectful'

    # 遵守robots.txt
    custom_settings = {
        'ROBOTSTXT_OBEY': True,
        'DOWNLOAD_DELAY': 2,  # 延迟2秒
        'CONCURRENT_REQUESTS': 16,  # 限制并发
        'USER_AGENT': 'MyBot/1.0 (contact@example.com)'
    }

    def parse(self, response):
        # 提取数据
        yield {
            'title': response.css('h1::text').get(),
            'content': response.css('.content::text').getall()
        }
```

### 2. API采集

#### 采集模式

**分页采集**
```python
def fetch_paginated_api(base_url, total_pages):
    all_data = []
    for page in range(1, total_pages+1):
        response = requests.get(f"{base_url}?page={page}")
        all_data.extend(response.json()['data'])
        time.sleep(0.5)  # 避免触发限流
    return all_data
```

**流式采集**
```python
# Twitter Stream API
import tweepy

class StreamListener(tweepy.StreamListener):
    def on_data(self, raw_data):
        data = json.loads(raw_data)
        save_to_db(data)

stream = tweepy.Stream(auth, StreamListener())
stream.filter(track=['machine learning'])
```

#### 速率限制处理

```python
from ratelimit import limits, sleep_and_retry

@sleep_and_retry
@limits(calls=100, period=60)  # 60秒内最多100次
def call_api(url):
    return requests.get(url)
```

### 3. 日志采集

#### 采集架构

```
数据源 → 采集器 → 消息队列 → 处理器 → 存储
```

**示例：用户行为日志采集**
```python
# 客户端埋点
import logging

logger = logging.getLogger('user_behavior')

def log_event(event_type, user_id, metadata):
    logger.info({
        'event_type': event_type,
        'user_id': user_id,
        'timestamp': time.time(),
        'metadata': metadata
    })

# 使用
log_event('page_view', user_id=123, metadata={'page': '/product/456'})
```

**采集工具**
- Fluentd / Logstash（日志收集）
- Kafka（消息队列）
- Elasticsearch（存储+搜索）

### 4. 多模态采集

#### 图像采集

**设备采集**
```python
import cv2

# 摄像头采集
cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret:
        break
    # 处理frame
    cv2.imwrite(f'frame_{timestamp}.jpg', frame)
```

**批量下载**
```python
from PIL import Image
import requests
from io import BytesIO

def download_image(url):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    return img
```

#### 语音采集

**录音采集**
```python
import sounddevice as sd
import scipy.io.wavfile as wav

fs = 16000  # 采样率
duration = 5  # 秒

recording = sd.rec(int(duration * fs), samplerate=fs, channels=1)
sd.wait()
wav.write('output.wav', fs, recording)
```

**质量控制**
- 采样率：16kHz（语音识别）、44.1kHz（高质量）
- 格式：WAV（无损）vs MP3（压缩）
- 降噪：去除背景噪声

## 采集策略设计

### 1. 采样策略

**随机采样**
```python
import random
sampled = random.sample(population, k=1000)
```

**分层采样**
```python
from sklearn.model_selection import train_test_split
# 按类别比例采样
sampled = data.groupby('category').apply(
    lambda x: x.sample(frac=0.1)
)
```

**时间窗口采样**
```python
# 每天采集特定时段的数据
hours = [9, 12, 15, 18, 21]  # 每3小时采集一次
for hour in hours:
    data = fetch_data(hour=hour)
```

### 2. 增量采集

**基于时间戳**
```python
last_timestamp = load_last_timestamp()
new_data = fetch_data(since=last_timestamp)
save_data(new_data)
update_last_timestamp()
```

**基于版本**
```python
last_version = get_last_version()
new_items = api.get_items(version_gt=last_version)
```

### 3. 去重策略

**哈希去重**
```python
import hashlib

def hash_content(content):
    return hashlib.md5(content.encode()).hexdigest()

seen_hashes = set()
for item in data:
    h = hash_content(item['content'])
    if h not in seen_hashes:
        seen_hashes.add(h)
        yield item
```

**近似去重（MinHash）**
```python
from datasketch import MinHash, MinHashLSH

lsh = MinHashLSH(threshold=0.9, num_perm=128)

for doc_id, doc in enumerate(documents):
    m = MinHash(num_perm=128)
    for word in doc.split():
        m.update(word.encode())
    lsh.insert(doc_id, m)

# 查找重复
duplicates = lsh.query(m)
```

## 质量控制

### 1. 完整性检查

```python
def validate_completeness(data):
    required_fields = ['id', 'text', 'timestamp']
    for item in data:
        for field in required_fields:
            assert field in item and item[field] is not None
```

### 2. 格式验证

```python
from jsonschema import validate

schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "text": {"type": "string", "minLength": 1},
        "label": {"type": "string", "enum": ["A", "B", "C"]}
    },
    "required": ["id", "text", "label"]
}

validate(instance=data_item, schema=schema)
```

### 3. 异常检测

```python
def detect_anomalies(data):
    # 检测空值
    assert data['text'].notnull().all()

    # 检测异常长度
    lengths = data['text'].str.len()
    assert lengths.mean() - 3*lengths.std() < lengths.min()
    assert lengths.max() < lengths.mean() + 3*lengths.std()

    # 检测重复
    assert data.duplicated().sum() / len(data) < 0.01
```

## 采集监控

### 关键指标

| 指标 | 说明 | 阈值示例 |
|------|------|---------|
| **吞吐量** | 每秒采集量 | >100/s |
| **成功率** | 成功/总请求 | >95% |
| **延迟** | 平均响应时间 | <500ms |
| **覆盖率** | 采集/目标数 | >90% |
| **去重率** | 重复/总量 | <10% |

### 监控系统

```python
import prometheus_client as prom

# 定义指标
crawl_counter = prom.Counter('crawl_total', 'Total crawl requests')
crawl_success = prom.Counter('crawl_success', 'Successful crawls')
crawl_duration = prom.Histogram('crawl_duration_seconds', 'Crawl duration')

# 记录
@crawl_duration.time()
def crawl_page(url):
    crawl_counter.inc()
    try:
        data = fetch(url)
        crawl_success.inc()
        return data
    except Exception as e:
        logger.error(f"Crawl failed: {e}")
```

## 伦理与合规

### Robots.txt遵守

```python
from urllib.robotparser import RobotFileParser

rp = RobotFileParser()
rp.set_url("https://example.com/robots.txt")
rp.read()

if rp.can_fetch("*", "https://example.com/page"):
    # 允许采集
    fetch_page()
```

### 隐私保护

```python
# 采集时脱敏
def anonymize_data(data):
    data['user_id'] = hash(data['user_id'])
    data['ip'] = data['ip'].rsplit('.', 1)[0] + '.xxx'
    return data
```

### 采集限流

```python
# 礼貌采集：避免对服务器造成压力
import time

def polite_crawl(urls):
    for url in urls:
        fetch(url)
        time.sleep(random.uniform(1, 3))  # 随机延迟1-3秒
```

## 工具链

### 爬虫框架
- **Scrapy**：Python爬虫框架
- **Puppeteer**：无头浏览器（Node.js）
- **Selenium**：浏览器自动化

### API客户端
- **requests**：HTTP库
- **httpx**：异步HTTP
- **tweepy**：Twitter API

### 数据采集平台
- **Airbyte**：开源ELT平台
- **Fivetran**：商业化数据同步
- **Apache NiFi**：数据流管理

### 监控工具
- **Prometheus + Grafana**：指标监控
- **ELK Stack**：日志分析

## 总结

数据采集是数据构建的第一道关卡：
- **策略优先**：采集前先设计策略（采样、去重、增量）
- **质量为先**：采集过程中实时质检
- **合规为底线**：遵守robots.txt、隐私法规
- **监控必备**：实时监控采集状态

## 延伸阅读

- [D3. 数据来源科学](D3-data-source.md) - 确定从哪里采集
- [D5. 数据清洗科学](D5-data-cleaning.md) - 采集后如何清洗
- [E1. 数据流水线工程](../03-engineering/E1-pipeline.md) - 将采集工程化

---

**核心观点**

> 数据采集不是"写个爬虫下载数据"，而是系统设计采集策略、质量控制、合规保障的工程实践。

