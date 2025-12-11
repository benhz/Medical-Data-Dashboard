# OCR系统应用案例

## 任务定义

**场景**: 通用场景文字识别(街景、文档、屏幕等)

## 核心学科

- **D2. 数据分布**: 覆盖多种字体、场景、角度
- **D4. 数据采集**: 真实拍照+合成渲染
- **D5. 数据清洗**: 去模糊、去重
- **D7. 数据增强**: 透视变换、光照变化、噪声

## 数据构建策略

### 分布设计

```python
scenarios = {
    '街景招牌': 3000,
    '文档扫描': 2000,
    '屏幕截图': 2000,
    '手写文字': 1000,
    '艺术字体': 500
}

transformations = {
    '旋转±15度': 0.5,
    '透视变换': 0.3,
    '模糊': 0.2,
    '噪声': 0.2
}
```

### 合成数据生成

```python
from PIL import Image, ImageDraw, ImageFont

def synthesize_ocr_data(text, font_path, background):
    img = Image.new('RGB', (500, 100), color=background)
    font = ImageFont.truetype(font_path, 36)
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), text, font=font, fill='black')

    # 应用变换
    img = apply_transforms(img)

    return img

# 生成10000张合成图片
```

## 结果

- 真实数据: 8,500张
- 合成数据: 15,000张
- 字符准确率: 96.5%

## 关键经验

1. **合成数据有效**: 占比60%+但提升显著
2. **覆盖多样场景**: 泛化能力是关键
3. **困难case**: 模糊、遮挡需重点补充

