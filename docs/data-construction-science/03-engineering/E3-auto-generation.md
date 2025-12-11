# E3. 自动化生成工程（Auto-generation Engineering）

## 定义

使用LLM、生成模型等AI技术自动生成数据,实现规模化数据构建。

## 生成方法

### 1. LLM文本生成

```python
from openai import OpenAI

client = OpenAI()

def generate_training_data(prompt_template, num_samples=1000):
    generated_data = []

    for i in range(num_samples):
        prompt = prompt_template.format(index=i)
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        generated_data.append(response.choices[0].message.content)

    return generated_data

# 示例: 生成对话数据
prompt = """
生成一个客服对话示例:
场景: 用户咨询退款
格式: 用户: ... | 客服: ...
"""

dialogues = generate_training_data(prompt, num_samples=1000)
```

### 2. 图像生成

```python
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")

prompts = [
    "a golden retriever playing in the park",
    "a cat sleeping on a couch",
    # ... more prompts
]

images = [pipe(prompt).images[0] for prompt in prompts]
```

### 3. 合成数据

```python
# 模板合成
def synthesize_addresses(n=1000):
    provinces = ['北京市', '上海市', '广东省']
    cities = ['朝阳区', '浦东新区', '天河区']
    streets = ['中山路', '建国路', '人民路']

    addresses = []
    for _ in range(n):
        addr = f"{random.choice(provinces)}{random.choice(cities)}{random.choice(streets)}{random.randint(1,999)}号"
        addresses.append(addr)

    return addresses
```

## 质量控制

### 自动验证

```python
def auto_verify(generated_data, verifier_model):
    """使用另一个模型验证生成质量"""
    verified_data = []

    for item in generated_data:
        score = verifier_model.score(item)
        if score > 0.8:  # 高质量
            verified_data.append(item)

    return verified_data
```

## 延伸阅读

- [D3. 数据来源科学](../02-disciplines/D3-data-source.md)
- [D7. 数据增强科学](../02-disciplines/D7-augmentation.md)

