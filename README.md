# 医疗运营监控数据大屏

## 项目简介
这是一个专业的医疗数据可视化大屏模板，用于实时监控医院运营数据。

## 功能特点
- ✅ 响应式设计，支持多种屏幕尺寸
- ✅ 基于 ECharts 5.x 的强大图表库
- ✅ 深色科技主题，视觉效果出色
- ✅ 模块化数据配置，易于修改和扩展
- ✅ 支持实时数据更新
- ✅ 10+ 种数据可视化组件

## 技术栈
- HTML5
- CSS3
- JavaScript (ES6+)
- ECharts 5.5.0

## 项目结构
```
Medical-Data-Dashboard/
├── index.html              # 主页面
├── src/
│   ├── css/
│   │   ├── main.css       # 主样式文件
│   │   └── responsive.css  # 响应式样式
│   ├── js/
│   │   ├── main.js        # 主逻辑文件
│   │   ├── charts.js      # 图表配置
│   │   └── utils.js       # 工具函数
│   └── assets/            # 静态资源
├── data/
│   └── mockData.json      # 模拟数据
└── config/
    └── chartConfig.js     # 图表配置
```

## 快速开始

### 1. 本地运行
```bash
# 直接打开 index.html 或使用本地服务器
python -m http.server 8000
# 或
npx serve
```

### 2. 访问
打开浏览器访问：http://localhost:8000

## 数据配置

所有数据都在 `data/mockData.json` 文件中配置，你可以轻松修改：

```json
{
  "overview": {
    "todayPatients": 32,
    "todayBeds": 268,
    ...
  }
}
```

## 包含的可视化组件

1. **统计卡片** - 实时数据指标
2. **双柱状图** - 主诊室注册人数对比
3. **折线图** - 每周人流量趋势
4. **环形图** - 医院收入分类
5. **进度环** - 一周就诊人数
6. **横向条形图** - 疾病分类排行
7. **双柱对比图** - 各科室床位使用情况
8. **性别比例展示** - 就诊人群分析
9. **智能分析表格** - 病症数据统计

## 自定义修改

### 修改主题色
编辑 `src/css/main.css` 中的 CSS 变量：
```css
:root {
  --primary-color: #00f6ff;
  --secondary-color: #0ea9b5;
  --bg-dark: #0a1e32;
  ...
}
```

### 修改数据
编辑 `data/mockData.json` 文件，修改对应的数据字段。

### 添加新图表
在 `src/js/charts.js` 中添加新的图表配置函数。

## 浏览器支持
- Chrome >= 80
- Firefox >= 75
- Safari >= 13
- Edge >= 80

## 开发建议
- 建议使用 1920x1080 分辨率进行开发
- 支持全屏显示（按 F11）
- 数据每 30 秒自动刷新（可配置）

## License
MIT License

## 作者
Created with ❤️ by Claude
