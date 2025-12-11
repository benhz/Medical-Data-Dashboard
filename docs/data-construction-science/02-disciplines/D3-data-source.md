# D3. 数据来源科学（Data Source Science）

## 定义

**数据来源科学**研究数据从哪里来、如何选择合适的数据源、如何组合多种数据源以构建高质量数据集。

> **核心问题**：给定任务需求和分布设计，应该从哪些渠道获取数据？

## 六大数据来源类型

### 1. 自然数据（Natural Data）

**定义**：真实世界自然产生的数据。

#### 来源渠道
- **公开数据**：网络爬虫、开放数据集、公共API
- **业务日志**：用户行为日志、系统日志、交易记录
- **传感器数据**：摄像头、麦克风、IoT设备
- **众包数据**：用户上传、UGC内容

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 真实性高 | 噪声多 |
| 反映真实分布 | 分布可能不平衡 |
| 成本相对低 | 覆盖可能不全 |

#### 适用场景
- 推荐系统（用户行为日志）
- 搜索引擎（query日志）
- 自然语言理解（网络文本）

### 2. 智能生成数据（Generative Data）

**定义**：使用AI模型（LLM、扩散模型等）生成的合成数据。

#### 生成方法

**文本生成**
```python
# 使用LLM生成训练数据
prompt = """
生成10个客服对话示例，场景：用户咨询退款
格式：用户问题 | 客服回答
"""
generated_data = llm.generate(prompt)
```

**图像生成**
```python
# 使用Stable Diffusion生成图像
from diffusers import StableDiffusionPipeline

prompt = "a photo of a cat wearing sunglasses"
image = pipeline(prompt).images[0]
```

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 规模化快速 | 真实性待验证 |
| 可控性强 | 可能有分布偏差 |
| 成本低 | 需要验证机制 |

#### 适用场景
- 对话系统（生成多样对话）
- 图像分类（数据增强）
- 长尾场景补充

### 3. 合成与模拟数据（Simulation Data）

**定义**：通过规则、模板、仿真系统生成的数据。

#### 合成方法

**模板合成**
```python
# 地址合成
templates = [
    "{province}{city}{district}{street}{number}号",
    "{province}{city}{district}{street}{building}栋{unit}单元{number}室"
]
synthetic_address = random.choice(templates).format(...)
```

**物理仿真**
```python
# 自动驾驶场景仿真（CARLA、AirSim）
weather = random.choice(['sunny', 'rainy', 'foggy'])
pedestrians = random.randint(0, 10)
scene = simulator.generate(weather=weather, pedestrians=pedestrians)
```

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 完全可控 | 真实性gap |
| 无隐私问题 | 规则复杂度高 |
| 标签完美准确 | 需要领域知识 |

#### 适用场景
- 自动驾驶（仿真环境）
- OCR（字体渲染）
- 语音识别（TTS合成）

### 4. 人工构造数据（Human-made Data）

**定义**：人工刻意构造的数据，通常用于覆盖特定场景。

#### 构造方法
1. **场景枚举**：列举所有场景，逐一构造
2. **边缘case设计**：针对难点设计样本
3. **对抗样本**：故意构造模型易错的样本

#### 示例
```markdown
任务：邮箱地址提取

人工构造：
1. 标准格式：user@example.com
2. 特殊字符：user.name+tag@sub.example.com
3. 边界case：user@localhost, a@b.c
4. 错误格式：user@, @example.com
```

#### 适用场景
- 规则解析（正则表达式测试）
- 边缘case测试
- 对抗鲁棒性训练

### 5. 领域专家数据（Expert-curated Data）

**定义**：由领域专家精心标注或创建的高质量数据。

#### 获取方式
- **医疗**：医生标注医学影像
- **法律**：律师标注法律文书
- **金融**：分析师标注风险案例

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 质量极高 | 成本极高 |
| 可信度强 | 规模受限 |
| 适合高风险场景 | 耗时长 |

#### 适用场景
- 医疗诊断
- 法律判决预测
- 金融风控

### 6. 主动学习驱动数据（Active Collected Data）

**定义**：根据模型反馈主动收集的数据。

#### 流程
```
训练初始模型
  ↓
模型预测未标注数据
  ↓
选择高价值样本（不确定性高、代表性强）
  ↓
人工标注
  ↓
加入训练集
  ↓
重新训练
```

#### 价值度量
```python
# 不确定性采样
predictions = model.predict_proba(unlabeled_data)
uncertainty = -np.sum(predictions * np.log(predictions), axis=1)
top_samples = unlabeled_data[np.argsort(uncertainty)[-100:]]

# 多样性采样
from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=100)
centers = kmeans.fit_predict(embeddings)
samples = [data[centers == i][0] for i in range(100)]
```

#### 适用场景
- 所有需要迭代优化的任务
- 标注预算有限的场景

## 数据源选择策略

### 决策树

```
是否有真实业务数据？
├─ 是 → 优先使用自然数据
│   └─ 是否足够？
│       ├─ 是 → 直接使用
│       └─ 否 → 补充其他来源
│
└─ 否 → 是否高风险领域（医疗、金融）？
    ├─ 是 → 必须专家数据
    └─ 否 → 可用生成/合成数据
```

### 组合策略

| 场景 | 推荐组合 |
|------|---------|
| **冷启动** | 合成数据（快速原型）+ 少量专家数据（质量锚点） |
| **快速迭代** | 自然数据 + 生成数据补充长尾 |
| **高质量需求** | 自然数据 + 专家校验 + 主动学习优化 |
| **大规模需求** | 自然数据 + 智能生成 + 自动质检 |

## 实践案例

### 案例1：对话系统数据来源

```markdown
需求：构建10000条客服对话

数据来源组合：
1. 真实对话日志（3000条）
   - 优点：真实场景
   - 缺点：隐私脱敏、覆盖不全

2. LLM生成（5000条）
   - Prompt：基于真实场景模板生成
   - 验证：人工抽检10%

3. 人工构造（1000条）
   - 目标：覆盖边缘case（投诉、特殊需求）

4. 主动学习（1000条）
   - 模型不确定的真实query → 人工标注
```

### 案例2：OCR数据来源

```markdown
需求：识别各种字体、场景的文字

数据来源组合：
1. 真实拍照（2000张）
   - 场景：街景、文档、屏幕拍摄

2. 合成渲染（10000张）
   - 方法：文字 + 随机字体 + 背景 + 变换
   - 工具：PIL, OpenCV

3. 公开数据集（5000张）
   - 如：ICDAR、COCO-Text

4. 困难case收集（1000张）
   - 模型错误的真实图片 → 重点优化
```

## 工具与资源

### 公开数据集

**NLP**
- Common Crawl（网络文本）
- Wikipedia Dump
- GitHub代码
- OpenSubtitles（对话）

**CV**
- ImageNet、COCO、Open Images
- LAION-5B（图文对）

**语音**
- LibriSpeech、Common Voice
- VoxCeleb（说话人识别）

**多模态**
- Conceptual Captions
- YFCC100M

### 数据生成工具

**文本**
- OpenAI API, Claude API
- Hugging Face Transformers
- Faker（假数据生成）

**图像**
- Stable Diffusion
- DALL-E
- Midjourney

**语音**
- TTS系统（gTTS, Azure Speech）
- 音频增强（audiomentations）

**合成**
- CARLA（自动驾驶）
- AirSim（仿真）
- Unity/Unreal（游戏引擎）

### 数据采集工具

**网络爬虫**
- Scrapy
- BeautifulSoup + Requests
- Selenium（动态网页）

**API采集**
- Twitter API, Reddit API
- 新闻API（NewsAPI, GDELT）

## 伦理与合规

### 数据使用合规检查

- [ ] 是否有数据使用权限？
- [ ] 是否侵犯隐私？（需脱敏）
- [ ] 是否侵犯版权？（需授权）
- [ ] 是否符合GDPR、CCPA等法规？
- [ ] 是否有偏见风险？（种族、性别等）

### 隐私保护

1. **数据脱敏**
   - 姓名 → 张** / User_001
   - 手机 → 138****1234
   - 地址 → 北京市朝阳区***

2. **差分隐私**
   ```python
   # 添加噪声保护隐私
   from diffprivlib import mechanisms
   noisy_data = mechanisms.Laplace().randomise(data)
   ```

3. **合成替代**
   - 使用合成数据替代真实敏感数据

## 总结

数据来源选择是数据构建的起点：
- **多样化组合**：单一来源往往不够，需要组合
- **质量与成本权衡**：专家数据质量高但贵，生成数据快但需验证
- **迭代优化**：从简单来源开始，逐步引入高质量数据
- **合规为先**：数据获取必须合法合规

## 延伸阅读

- [D4. 数据采集科学](D4-acquisition.md) - 如何系统地采集数据
- [D7. 数据增强科学](D7-augmentation.md) - 如何扩展现有数据
- [E3. 自动化生成工程](../03-engineering/E3-auto-generation.md) - 规模化生成数据

---

**核心观点**

> 数据来源不是"找到什么用什么"，而是"需要什么找什么、没有就造什么"。高质量数据集往往是多源数据的精心组合。

