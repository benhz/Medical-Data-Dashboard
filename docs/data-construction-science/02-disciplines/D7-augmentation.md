# D7. 数据增强科学（Augmentation Science）

## 定义

**数据增强科学**研究如何通过变换、合成、生成等方法扩展数据集的多样性和规模,包括文本增强、图像增强、语音增强、对抗增强等。

> **核心问题**:如何在保持标签不变的前提下,增加数据的多样性和数量?

## 为什么需要数据增强?

### 数据增强的价值

```
1. 扩大数据规模 (5倍甚至10倍)
2. 提升模型泛化能力
3. 缓解过拟合
4. 平衡类别分布
5. 降低数据采集成本
```

**真实案例**:
- ImageNet训练:数据增强使top-1准确率提升3-5%
- NLP文本分类:使用回译增强,F1提升2-4%
- 语音识别:噪声增强使在嘈杂环境中准确率提升10%+

## 核心内容

### 1. 文本增强

#### (1) 同义替换(Synonym Replacement)

```python
import nltk
from nltk.corpus import wordnet

def synonym_replacement(sentence, n=2):
    words = sentence.split()
    new_words = words.copy()

    random_word_list = list(set([word for word in words if word.isalnum()]))
    random.shuffle(random_word_list)

    for random_word in random_word_list[:n]:
        synonyms = get_synonyms(random_word)
        if synonyms:
            synonym = random.choice(synonyms)
            new_words = [synonym if word == random_word else word for word in new_words]

    return ' '.join(new_words)

# 示例
original = "这部电影非常精彩"
augmented = synonym_replacement(original)
# → "这部电影很精彩"
```

#### (2) 回译(Back Translation)

```python
from transformers import MarianMTModel, MarianTokenizer

def back_translation(text, src='en', pivot='fr'):
    # 英语 → 法语
    model_name_en_fr = f'Helsinki-NLP/opus-mt-{src}-{pivot}'
    tokenizer = MarianTokenizer.from_pretrained(model_name_en_fr)
    model = MarianMTModel.from_pretrained(model_name_en_fr)

    translated = model.generate(**tokenizer(text, return_tensors="pt"))
    french_text = tokenizer.decode(translated[0], skip_special_tokens=True)

    # 法语 → 英语
    model_name_fr_en = f'Helsinki-NLP/opus-mt-{pivot}-{src}'
    tokenizer = MarianTokenizer.from_pretrained(model_name_fr_en)
    model = MarianMTModel.from_pretrained(model_name_fr_en)

    back_translated = model.generate(**tokenizer(french_text, return_tensors="pt"))
    return tokenizer.decode(back_translated[0], skip_special_tokens=True)
```

#### (3) 随机插入/删除/交换

```python
import random

def random_insertion(words, n=1):
    for _ in range(n):
        add_word = random.choice(words)
        random_idx = random.randint(0, len(words))
        words.insert(random_idx, add_word)
    return words

def random_deletion(words, p=0.1):
    if len(words) == 1:
        return words
    return [word for word in words if random.random() > p]

def random_swap(words, n=1):
    for _ in range(n):
        idx1, idx2 = random.sample(range(len(words)), 2)
        words[idx1], words[idx2] = words[idx2], words[idx1]
    return words
```

#### (4) LLM生成式增强

```python
def llm_augment(text, llm):
    prompt = f"""
    请对以下文本进行改写,保持原意但改变表达方式:

    原文: {text}

    改写:
    """
    response = llm.generate(prompt)
    return response.strip()
```

### 2. 图像增强

#### (1) 几何变换

```python
import albumentations as A

transform = A.Compose([
    A.Rotate(limit=30, p=0.5),          # 旋转±30度
    A.HorizontalFlip(p=0.5),            # 水平翻转
    A.ShiftScaleRotate(                 # 平移缩放旋转
        shift_limit=0.1,
        scale_limit=0.1,
        rotate_limit=15,
        p=0.5
    ),
    A.Perspective(p=0.3),               # 透视变换
])

augmented = transform(image=image)['image']
```

#### (2) 颜色变换

```python
color_transform = A.Compose([
    A.ColorJitter(                      # 颜色抖动
        brightness=0.2,
        contrast=0.2,
        saturation=0.2,
        hue=0.1,
        p=0.5
    ),
    A.RandomBrightnessContrast(p=0.5),  # 亮度对比度
    A.HueSaturationValue(p=0.3),        # 色调饱和度
    A.ToGray(p=0.1),                    # 转灰度
])
```

#### (3) 噪声与模糊

```python
noise_transform = A.Compose([
    A.GaussNoise(p=0.3),                # 高斯噪声
    A.GaussianBlur(blur_limit=3, p=0.3),# 高斯模糊
    A.MotionBlur(p=0.2),                # 运动模糊
    A.ImageCompression(                 # JPEG压缩
        quality_lower=80,
        quality_upper=100,
        p=0.2
    ),
])
```

#### (4) Cutout / Mixup / CutMix

```python
# Cutout: 随机遮挡
cutout = A.Cutout(
    num_holes=8,
    max_h_size=16,
    max_w_size=16,
    p=0.5
)

# Mixup
def mixup(image1, image2, label1, label2, alpha=0.2):
    lam = np.random.beta(alpha, alpha)
    mixed_image = lam * image1 + (1 - lam) * image2
    mixed_label = lam * label1 + (1 - lam) * label2
    return mixed_image, mixed_label

# CutMix
def cutmix(image1, image2, label1, label2):
    lam = np.random.beta(1.0, 1.0)
    h, w = image1.shape[:2]

    cut_rat = np.sqrt(1 - lam)
    cut_w, cut_h = int(w * cut_rat), int(h * cut_rat)

    cx, cy = np.random.randint(w), np.random.randint(h)
    x1 = np.clip(cx - cut_w // 2, 0, w)
    y1 = np.clip(cy - cut_h // 2, 0, h)
    x2 = np.clip(cx + cut_w // 2, 0, w)
    y2 = np.clip(cy + cut_h // 2, 0, h)

    image1[y1:y2, x1:x2] = image2[y1:y2, x1:x2]
    lam = 1 - ((x2 - x1) * (y2 - y1) / (w * h))

    return image1, lam * label1 + (1 - lam) * label2
```

### 3. 语音增强

#### (1) 时间变换

```python
import librosa

# 变速(不改变音调)
def time_stretch(audio, rate=1.2):
    return librosa.effects.time_stretch(audio, rate=rate)

# 变调(不改变速度)
def pitch_shift(audio, sr, n_steps=2):
    return librosa.effects.pitch_shift(audio, sr=sr, n_steps=n_steps)
```

#### (2) 添加噪声

```python
def add_noise(audio, noise_factor=0.005):
    noise = np.random.randn(len(audio))
    return audio + noise_factor * noise

def add_background_noise(audio, noise_audio, snr_db=10):
    # SNR: Signal-to-Noise Ratio
    audio_power = audio ** 2
    audio_power_avg = np.mean(audio_power)

    noise_power_avg = np.mean(noise_audio ** 2)
    noise_power_target = audio_power_avg / (10 ** (snr_db / 10))

    noise_scaled = noise_audio * np.sqrt(noise_power_target / noise_power_avg)
    return audio + noise_scaled[:len(audio)]
```

#### (3) 频谱增强(SpecAugment)

```python
def spec_augment(spectrogram, freq_mask=10, time_mask=10):
    # 频率遮蔽
    freq_len = spectrogram.shape[0]
    f = np.random.randint(0, freq_mask)
    f0 = np.random.randint(0, freq_len - f)
    spectrogram[f0:f0+f, :] = 0

    # 时间遮蔽
    time_len = spectrogram.shape[1]
    t = np.random.randint(0, time_mask)
    t0 = np.random.randint(0, time_len - t)
    spectrogram[:, t0:t0+t] = 0

    return spectrogram
```

### 4. 对抗性增强

#### (1) 对抗样本生成(FGSM)

```python
import torch

def fgsm_attack(model, images, labels, epsilon=0.01):
    images.requires_grad = True

    outputs = model(images)
    loss = torch.nn.functional.cross_entropy(outputs, labels)
    model.zero_grad()
    loss.backward()

    # 生成对抗样本
    perturbed_images = images + epsilon * images.grad.sign()
    perturbed_images = torch.clamp(perturbed_images, 0, 1)

    return perturbed_images
```

#### (2) 文本对抗样本

```python
def text_adversarial(text, model):
    # 同义词替换攻击
    words = text.split()
    for i, word in enumerate(words):
        synonyms = get_synonyms(word)
        for syn in synonyms:
            new_text = ' '.join(words[:i] + [syn] + words[i+1:])
            if model.predict(new_text) != model.predict(text):
                return new_text  # 找到能改变预测的替换
    return text
```

### 5. 生成式增强

#### (1) GAN生成

```python
# 使用预训练的StyleGAN生成人脸
from stylegan import StyleGAN

generator = StyleGAN.load_pretrained('ffhq')
latent = torch.randn(1, 512)
generated_image = generator(latent)
```

#### (2) 扩散模型生成

```python
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")

prompt = "a photo of a golden retriever playing in the park"
image = pipe(prompt).images[0]
```

## 增强策略设计

### 增强强度设计

| 阶段 | 策略 | 说明 |
|------|------|------|
| **训练初期** | 温和增强 | 保证模型学到基本模式 |
| **训练中期** | 中等增强 | 提升泛化能力 |
| **训练后期** | 强增强 | 增强鲁棒性 |

### 特定任务增强策略

**分类任务**
```python
# 目标: 提升鲁棒性
augmentation = A.Compose([
    A.RandomResizedCrop(224, 224),
    A.HorizontalFlip(p=0.5),
    A.ColorJitter(0.4, 0.4, 0.4, 0.1, p=0.8),
    A.RandomGrayscale(p=0.2),
])
```

**检测任务**
```python
# 目标: 保持bbox一致
augmentation = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.RandomBrightnessContrast(p=0.5),
], bbox_params=A.BboxParams(format='coco'))
```

**OCR任务**
```python
# 目标: 模拟真实场景
augmentation = A.Compose([
    A.Rotate(limit=5),              # 轻微旋转
    A.GaussianBlur(blur_limit=3),   # 轻微模糊
    A.ImageCompression(quality_lower=60),  # 压缩
    A.Perspective(),                # 透视变换
])
```

## 增强效果评估

### 评估指标

```python
def evaluate_augmentation(original_data, augmented_data, model):
    # 1. 多样性
    diversity = calculate_diversity(augmented_data)

    # 2. 标签保持率
    original_labels = model.predict(original_data)
    augmented_labels = model.predict(augmented_data)
    label_consistency = np.mean(original_labels == augmented_labels)

    # 3. 性能提升
    baseline_acc = train_and_eval(model, original_data)
    augmented_acc = train_and_eval(model, augmented_data)
    improvement = augmented_acc - baseline_acc

    return {
        'diversity': diversity,
        'label_consistency': label_consistency,
        'improvement': improvement
    }
```

## 工具库

### 文本增强
- **nlpaug**: 多种NLP增强方法
- **TextAugment**: 简单易用
- **EDA**: Easy Data Augmentation

### 图像增强
- **Albumentations**: 性能最优
- **imgaug**: 功能丰富
- **torchvision.transforms**: PyTorch原生

### 语音增强
- **audiomentations**: 音频增强
- **SpecAugment**: 频谱增强
- **torchaudio**: PyTorch音频库

## 最佳实践

1. **保持标签一致**:增强不应改变标签
2. **渐进式增强**:从温和到强烈
3. **领域适配**:根据任务特点选择增强方法
4. **评估多样性**:确保增强后多样性提升
5. **在线增强**:训练时实时增强(减少存储)

## 常见陷阱

### 陷阱1:过度增强

❌ 增强过强导致标签改变
```python
# 旋转90度可能改变语义
transform = A.Rotate(limit=90)
```

✅ 适度增强
```python
transform = A.Rotate(limit=15)  # 轻微旋转
```

### 陷阱2:增强与任务不匹配

❌ OCR任务使用水平翻转
```python
# 文字翻转后无法识别
A.HorizontalFlip(p=0.5)
```

✅ 使用合适的增强
```python
A.Perspective()  # 透视变换更合适
```

## 总结

数据增强是提升模型性能的高ROI方法:
- **成本低**:无需采集新数据
- **效果好**:通常提升2-5%性能
- **风险可控**:不改变标签
- **通用性强**:几乎所有任务都适用

## 延伸阅读

- [D2. 数据分布科学](D2-data-distribution.md) - 增强如何影响分布
- [D3. 数据来源科学](D3-data-source.md) - 生成式增强
- [E3. 自动化生成工程](../03-engineering/E3-auto-generation.md) - 规模化增强

---

**核心观点**

> 数据增强不是"随机变换",而是有策略、有评估、与任务匹配的科学方法。好的增强能让模型更鲁棒、更泛化。

