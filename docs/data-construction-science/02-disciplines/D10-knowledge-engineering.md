# D10. 数据知识工程（Data Knowledge Engineering）

## 定义

**数据知识工程**研究如何将数据结构化为可复用的知识资产,包括知识图谱、标签体系、本体论、多模态知识对齐等。

> **核心问题**:如何将零散的数据提炼为系统化、可复用的知识?

## 为什么需要知识工程?

### 从数据到知识的跃迁

```
数据 (Data): 原始事实
  ↓ 清洗、标注
信息 (Information): 有意义的数据
  ↓ 结构化、关联
知识 (Knowledge): 系统化的信息
  ↓ 推理、应用
智慧 (Wisdom): 可决策的知识
```

**知识工程的价值**:
1. **可复用**: 知识可跨任务复用
2. **可推理**: 支持逻辑推理和问答
3. **可解释**: 提升模型可解释性
4. **可传承**: 领域知识系统沉淀

## 核心内容

### 1. 知识图谱（Knowledge Graph）

#### 知识图谱结构

```
实体 (Entity) - 关系 (Relation) - 实体 (Entity)
```

**示例**:
```
(张三, 工作于, 北京大学)
(北京大学, 位于, 北京市)
(北京市, 属于, 中国)
```

#### 构建知识图谱

**步骤1: 实体识别**
```python
# 使用NER提取实体
from transformers import pipeline

ner = pipeline("ner", model="xlm-roberta-large-finetuned-conll03-english")

text = "张三在北京大学工作"
entities = ner(text)

# 结果: [
#   {"entity": "PER", "word": "张三"},
#   {"entity": "ORG", "word": "北京大学"}
# ]
```

**步骤2: 关系抽取**
```python
# 使用关系抽取模型
def extract_relations(text):
    # 示例: 基于规则的关系抽取
    patterns = {
        '工作于': r'(.+?)在(.+?)工作',
        '位于': r'(.+?)位于(.+?)',
    }

    relations = []
    for rel, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            relations.append({
                'head': match.group(1),
                'relation': rel,
                'tail': match.group(2)
            })

    return relations
```

**步骤3: 知识融合**
```python
class KnowledgeGraph:
    def __init__(self):
        self.entities = {}  # {entity_id: entity_info}
        self.relations = []  # [(head_id, relation, tail_id)]

    def add_entity(self, entity_name, entity_type):
        entity_id = len(self.entities)
        self.entities[entity_id] = {
            'name': entity_name,
            'type': entity_type
        }
        return entity_id

    def add_relation(self, head_id, relation, tail_id):
        self.relations.append((head_id, relation, tail_id))

    def query(self, head_name, relation):
        """查询: 给定头实体和关系,返回尾实体"""
        head_id = self.get_entity_id(head_name)
        results = []

        for h, r, t in self.relations:
            if h == head_id and r == relation:
                results.append(self.entities[t]['name'])

        return results

    def get_entity_id(self, name):
        for eid, entity in self.entities.items():
            if entity['name'] == name:
                return eid
        return None
```

#### 知识图谱应用

**问答系统**
```python
# 问题: "张三在哪里工作?"
# 解析: (张三, 工作于, ?)

kg = KnowledgeGraph()
answer = kg.query("张三", "工作于")
# → ["北京大学"]

# 多跳推理: "张三工作的地方在哪个城市?"
# (张三, 工作于, X) AND (X, 位于, Y)

company = kg.query("张三", "工作于")[0]  # 北京大学
city = kg.query(company, "位于")[0]      # 北京市
```

### 2. 标签体系（Taxonomy / Ontology）

#### 层次化标签体系

```
商品分类体系:
├── 电子产品
│   ├── 手机
│   │   ├── 智能手机
│   │   └── 功能机
│   ├── 电脑
│   │   ├── 笔记本
│   │   └── 台式机
│   └── 相机
├── 服装
│   ├── 上衣
│   └── 裤子
└── 食品
    ├── 零食
    └── 饮料
```

#### 本体论设计（Ontology）

```python
class Ontology:
    def __init__(self):
        self.classes = {}      # {class_name: class_info}
        self.properties = {}   # {property_name: property_info}
        self.hierarchy = {}    # {class: [subclasses]}

    def add_class(self, class_name, parent=None):
        self.classes[class_name] = {
            'parent': parent,
            'properties': []
        }

        if parent:
            if parent not in self.hierarchy:
                self.hierarchy[parent] = []
            self.hierarchy[parent].append(class_name)

    def add_property(self, property_name, domain, range_type):
        self.properties[property_name] = {
            'domain': domain,      # 哪个类可以有这个属性
            'range': range_type    # 属性值类型
        }

    def is_subclass_of(self, class_a, class_b):
        """判断class_a是否是class_b的子类"""
        if class_a == class_b:
            return True

        parent = self.classes[class_a].get('parent')
        if parent:
            return self.is_subclass_of(parent, class_b)

        return False

# 示例: 构建产品本体
ontology = Ontology()

ontology.add_class('产品')
ontology.add_class('电子产品', parent='产品')
ontology.add_class('手机', parent='电子产品')
ontology.add_class('智能手机', parent='手机')

ontology.add_property('品牌', domain='产品', range_type='string')
ontology.add_property('价格', domain='产品', range_type='float')
ontology.add_property('操作系统', domain='智能手机', range_type='string')

# 查询
print(ontology.is_subclass_of('智能手机', '产品'))  # True
```

### 3. 数据结构化（Structured Knowledge）

#### 从非结构化到结构化

**文本 → 结构化**
```python
# 原始文本
text = "iPhone 14 Pro是苹果公司2022年发布的旗舰手机,售价7999元"

# 结构化提取
structured = {
    "产品名": "iPhone 14 Pro",
    "品牌": "苹果",
    "类别": "手机",
    "发布年份": 2022,
    "定位": "旗舰",
    "价格": 7999,
    "货币": "CNY"
}
```

**信息抽取框架**
```python
import spacy

class InformationExtractor:
    def __init__(self):
        self.nlp = spacy.load("zh_core_web_sm")

    def extract(self, text, template):
        """
        template = {
            '产品名': {'type': 'PRODUCT'},
            '品牌': {'type': 'ORG'},
            '价格': {'type': 'MONEY', 'unit': 'CNY'}
        }
        """
        doc = self.nlp(text)
        result = {}

        for field, config in template.items():
            # 根据实体类型提取
            for ent in doc.ents:
                if ent.label_ == config['type']:
                    result[field] = ent.text

        return result
```

### 4. 多模态知识对齐

#### 视觉-语言对齐

```python
# 图像-文本对齐
from transformers import CLIPProcessor, CLIPModel

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# 计算图像和文本的相似度
def align_image_text(image, texts):
    inputs = processor(
        text=texts,
        images=image,
        return_tensors="pt",
        padding=True
    )

    outputs = model(**inputs)
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)

    return probs

# 示例
image = load_image("cat.jpg")
texts = ["a cat", "a dog", "a bird"]
probs = align_image_text(image, texts)
# → [0.95, 0.03, 0.02]  # 最匹配"a cat"
```

#### 跨模态知识图谱

```python
class MultimodalKG:
    def __init__(self):
        self.text_entities = {}
        self.image_entities = {}
        self.audio_entities = {}
        self.alignments = []  # [(modality1, id1, modality2, id2, score)]

    def add_alignment(self, modality1, id1, modality2, id2, score):
        self.alignments.append({
            'modality1': modality1,
            'id1': id1,
            'modality2': modality2,
            'id2': id2,
            'score': score
        })

    def query_cross_modal(self, modality, entity_id, target_modality):
        """跨模态查询"""
        results = []

        for align in self.alignments:
            if (align['modality1'] == modality and align['id1'] == entity_id and
                align['modality2'] == target_modality):
                results.append({
                    'id': align['id2'],
                    'score': align['score']
                })

        return sorted(results, key=lambda x: x['score'], reverse=True)
```

### 5. 领域知识库构建

#### 医疗知识库示例

```python
class MedicalKnowledgeBase:
    def __init__(self):
        self.diseases = {}     # 疾病
        self.symptoms = {}     # 症状
        self.treatments = {}   # 治疗方法
        self.relations = {
            'has_symptom': [],     # (disease, symptom)
            'treated_by': [],      # (disease, treatment)
            'contraindicated': []  # (treatment, condition)
        }

    def add_disease(self, name, description, icd_code):
        self.diseases[name] = {
            'description': description,
            'icd_code': icd_code
        }

    def add_symptom_relation(self, disease, symptom, probability):
        self.relations['has_symptom'].append({
            'disease': disease,
            'symptom': symptom,
            'probability': probability
        })

    def diagnose(self, symptoms):
        """基于症状推断疾病"""
        candidate_diseases = {}

        for disease in self.diseases:
            score = 0
            disease_symptoms = [
                r for r in self.relations['has_symptom']
                if r['disease'] == disease
            ]

            for symptom in symptoms:
                for ds in disease_symptoms:
                    if ds['symptom'] == symptom:
                        score += ds['probability']

            if score > 0:
                candidate_diseases[disease] = score

        return sorted(candidate_diseases.items(),
                     key=lambda x: x[1], reverse=True)

# 使用
kb = MedicalKnowledgeBase()
kb.add_disease('感冒', '常见呼吸道疾病', 'J00')
kb.add_symptom_relation('感冒', '发烧', 0.8)
kb.add_symptom_relation('感冒', '咳嗽', 0.9)
kb.add_symptom_relation('感冒', '流鼻涕', 0.85)

# 诊断
patient_symptoms = ['发烧', '咳嗽']
diagnosis = kb.diagnose(patient_symptoms)
# → [('感冒', 1.7), ...]
```

#### 法律知识库

```python
class LegalKnowledgeBase:
    def __init__(self):
        self.laws = {}          # 法律条文
        self.cases = {}         # 案例
        self.precedents = {}    # 判例
        self.citations = []     # 引用关系

    def add_law(self, law_id, title, content):
        self.laws[law_id] = {
            'title': title,
            'content': content
        }

    def add_case(self, case_id, description, verdict, cited_laws):
        self.cases[case_id] = {
            'description': description,
            'verdict': verdict,
            'cited_laws': cited_laws
        }

        for law_id in cited_laws:
            self.citations.append((case_id, law_id))

    def find_similar_cases(self, description, top_k=5):
        """找相似案例"""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        all_descriptions = [case['description'] for case in self.cases.values()]
        all_descriptions.append(description)

        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(all_descriptions)

        similarities = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1])[0]

        top_indices = similarities.argsort()[-top_k:][::-1]
        case_ids = list(self.cases.keys())

        return [(case_ids[i], similarities[i]) for i in top_indices]
```

## 知识抽取技术

### 1. 实体抽取（NER）

```python
# 使用BERT进行实体抽取
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")

ner = pipeline("ner", model=model, tokenizer=tokenizer)

text = "Apple Inc. is located in Cupertino, California."
entities = ner(text)
```

### 2. 关系抽取（Relation Extraction）

```python
# 使用Prompt进行关系抽取
def extract_relations_with_llm(text, llm):
    prompt = f"""
    从以下文本中抽取实体之间的关系,以JSON格式返回:

    文本: {text}

    格式:
    {{
        "entities": [实体列表],
        "relations": [
            {{"head": "实体1", "relation": "关系类型", "tail": "实体2"}}
        ]
    }}
    """

    response = llm.generate(prompt)
    return json.loads(response)
```

### 3. 事件抽取（Event Extraction）

```python
def extract_events(text):
    """
    抽取事件结构: (触发词, 参与者, 时间, 地点)
    """
    event_template = {
        'trigger': None,
        'participants': [],
        'time': None,
        'location': None
    }

    # 使用依存句法分析
    doc = nlp(text)

    # 识别事件触发词(通常是动词)
    for token in doc:
        if token.pos_ == 'VERB':
            event_template['trigger'] = token.text

            # 找参与者(主语、宾语)
            for child in token.children:
                if child.dep_ in ['nsubj', 'dobj']:
                    event_template['participants'].append(child.text)

    return event_template
```

## 知识图谱工具

### 图数据库

| 工具 | 特点 |
|------|------|
| **Neo4j** | 最流行的图数据库 |
| **ArangoDB** | 多模型数据库 |
| **JanusGraph** | 分布式图数据库 |

### 知识抽取框架

- **Stanford CoreNLP**: NLP工具包
- **spaCy**: 快速NER和关系抽取
- **DeepKE**: 深度学习知识抽取

### 知识图谱平台

- **OpenKG**: 开放知识图谱
- **DBpedia**: 结构化维基百科
- **Wikidata**: 协作知识库

## 应用场景

### 1. 智能问答

```python
# 基于知识图谱的问答
class KGQASystem:
    def __init__(self, kg):
        self.kg = kg

    def answer(self, question):
        # 解析问题
        parsed = self.parse_question(question)

        # 在知识图谱中查询
        answer = self.kg.query(
            head=parsed['entity'],
            relation=parsed['relation']
        )

        return answer

    def parse_question(self, question):
        # 简单示例: "张三在哪里工作?"
        # → {'entity': '张三', 'relation': '工作于'}

        patterns = {
            r'(.+?)在哪里工作': ('entity', '工作于'),
            r'(.+?)位于哪里': ('entity', '位于'),
        }

        for pattern, (entity_type, relation) in patterns.items():
            match = re.search(pattern, question)
            if match:
                return {
                    'entity': match.group(1),
                    'relation': relation
                }

        return None
```

### 2. 推荐系统

```python
# 基于知识图谱的推荐
def kg_based_recommendation(user_history, kg, top_k=10):
    """基于用户历史和知识图谱推荐"""
    candidate_items = set()

    # 从用户历史物品出发,沿图谱探索
    for item in user_history:
        # 找相关物品(通过关系连接)
        related = kg.query(item, relation='similar_to')
        related.extend(kg.query(item, relation='same_category'))

        candidate_items.update(related)

    # 过滤已交互物品
    candidate_items -= set(user_history)

    # 排序(基于图谱中的权重)
    scored_items = [
        (item, kg.get_similarity_score(user_history, item))
        for item in candidate_items
    ]

    return sorted(scored_items, key=lambda x: x[1], reverse=True)[:top_k]
```

## 总结

数据知识工程将数据提升为可复用的知识资产:
- **结构化**: 从零散数据到系统知识
- **可推理**: 支持逻辑推理和问答
- **可复用**: 跨任务、跨领域复用
- **可传承**: 领域知识系统沉淀

## 延伸阅读

- [D1. 任务建模科学](D1-task-modeling.md) - 标签体系设计
- [D6. 标注科学](D6-annotation.md) - 知识标注
- [应用案例: 法律问答](../06-applications/legal-qa.md) - 知识图谱应用

---

**核心观点**

> 数据知识工程不是"整理数据",而是将数据提炼为可推理、可复用、可传承的知识资产。知识是数据的终极形态。

