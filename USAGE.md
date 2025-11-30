# 医疗数据大屏使用指南

## 📋 目录
1. [快速开始](#快速开始)
2. [修改数据](#修改数据)
3. [自定义样式](#自定义样式)
4. [高级功能](#高级功能)
5. [常见问题](#常见问题)

---

## 快速开始

### 方法一：直接打开
双击 `index.html` 文件即可在浏览器中打开大屏。

### 方法二：使用本地服务器（推荐）
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve

# 或使用 PHP
php -S localhost:8000
```

然后在浏览器访问：`http://localhost:8000`

---

## 修改数据

### 📂 数据文件位置
所有数据都存储在：`data/mockData.js`

### 📊 数据结构说明

#### 1. 概览数据 (overview)
```javascript
overview: {
    todayPatients: 32,           // 今日就诊总数
    todayBeds: 268,              // 今日使用床位
    todayOutpatient: 1223,       // 今日门诊
    yesterdayOutpatient: 897,    // 昨日门诊
    // ... 其他字段
}
```

**修改示例：**
```javascript
// 修改今日就诊人数为 50
todayPatients: 50,

// 修改今日门诊为 1500
todayOutpatient: 1500,
```

#### 2. 性别比例 (gender)
```javascript
gender: {
    male: 45,      // 男性占比 (%)
    female: 55     // 女性占比 (%)
}
```

**注意：** 男性 + 女性 = 100%

#### 3. 主诊室注册人数对比 (registration)
```javascript
registration: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    personCount: [45, 52, 48, 56, 58, 52, 48],     // 人数
    timesCount: [38, 42, 52, 46, 42, 48, 45]       // 人次
}
```

**修改示例：**
```javascript
// 修改月份
months: ['一月', '二月', '三月', '四月'],

// 修改人数数据（长度必须与月份数组一致）
personCount: [50, 60, 55, 65],
timesCount: [40, 50, 48, 58],
```

#### 4. 每周人流量分布 (weeklyFlow)
```javascript
weeklyFlow: {
    days: ['一月', '二月', '三月', '四月', '五月', '六月'],
    current: [42, 48, 35, 52, 45, 38],     // 本代
    previous: [38, 45, 42, 48, 40, 42]     // 上一代
}
```

#### 5. 医院收入分类 (incomeDistribution)
```javascript
incomeDistribution: {
    categories: [
        { name: '门诊收入', value: 68, color: '#00f6ff' },
        { name: '住院收入', value: 80, color: '#0ea9b5' },
        // ... 更多分类
    ]
}
```

**修改示例：**
```javascript
// 添加新的收入分类
{ name: '药品收入', value: 75, color: '#ff6b9d' },

// 修改现有分类的数值
{ name: '门诊收入', value: 90, color: '#00f6ff' },
```

#### 6. 一周就诊人数统计 (weeklyPatients)
```javascript
weeklyPatients: {
    total: 2847,  // 总人数
    breakdown: [
        { name: '儿童', value: 53.3, color: '#00f6ff' },
        { name: '成年', value: 26.7, color: '#ffd700' },
        // ... 更多分组
    ]
}
```

**注意：** breakdown 中所有 value 的总和应该为 100%

#### 7. 疾病分类排行 (diseaseRanking)
```javascript
diseaseRanking: [
    { name: '乡镇医院', value: 85 },
    { name: '医站', value: 72 },
    // ... 更多数据
]
```

#### 8. 各科床位使用情况 (bedUsage)
```javascript
bedUsage: {
    departments: ['心内科', '外科', '儿科', '妇科'],
    thisWeek: [52, 48, 62, 58],    // 本周
    lastWeek: [48, 52, 56, 52]     // 上周
}
```

**修改示例：**
```javascript
// 添加新的科室
departments: ['心内科', '外科', '儿科', '妇科', '骨科'],
thisWeek: [52, 48, 62, 58, 45],
lastWeek: [48, 52, 56, 52, 42],
```

#### 9. 智能病症数据表格 (analysisTable)
```javascript
analysisTable: [
    { rank: 1, disease: '感冒', thisWeek: 96, lastWeek: 96 },
    { rank: 2, disease: '肺炎', thisWeek: 77, lastWeek: 75 },
    // ... 更多数据
]
```

---

## 自定义样式

### 🎨 修改主题色

编辑 `src/css/main.css` 文件，找到以下部分：

```css
:root {
    /* 主题色 */
    --primary-color: #00f6ff;      /* 主色调 */
    --secondary-color: #0ea9b5;    /* 辅助色 */
    --accent-color: #ffd700;       /* 强调色 */

    /* 修改为你喜欢的颜色 */
    --primary-color: #ff6b9d;      /* 粉色主题 */
    --secondary-color: #c792ea;    /* 紫色辅助 */
}
```

### 📐 修改布局

#### 调整左右面板宽度
在 `src/css/main.css` 中找到：

```css
.dashboard-content {
    grid-template-columns: 280px 1fr 320px;
    /* 修改为：*/
    grid-template-columns: 300px 1fr 350px;
}
```

#### 修改卡片大小
```css
.stat-card {
    padding: 20px;  /* 修改内边距 */
}

.card-value {
    font-size: 28px;  /* 修改数字大小 */
}
```

### 🎬 禁用动画
如果需要禁用动画效果，在 `src/css/main.css` 末尾添加：

```css
* {
    animation: none !important;
    transition: none !important;
}
```

---

## 高级功能

### 🔄 调整自动刷新间隔

编辑 `src/js/main.js`，找到以下代码：

```javascript
startAutoRefresh() {
    // 修改刷新间隔（单位：毫秒）
    this.updateTimer = setInterval(() => {
        this.refreshData();
    }, 30000);  // 30000ms = 30秒
}
```

修改为你需要的间隔时间：
- `10000` = 10秒
- `60000` = 1分钟
- `300000` = 5分钟

### 🔌 接入真实 API

在 `src/js/main.js` 的 `refreshData()` 方法中添加：

```javascript
async refreshData() {
    try {
        // 调用你的 API
        const response = await fetch('YOUR_API_URL');
        const data = await response.json();

        // 更新数据
        this.data = data;

        // 更新界面
        this.updateOverviewData();
        this.updateGenderData();
        this.updateAnalysisTable();
        Charts.refreshAll(this.data);

    } catch (error) {
        console.error('数据获取失败:', error);
    }
}
```

### ⌨️ 键盘快捷键

当前支持的快捷键：
- **F11**: 进入/退出全屏
- **Ctrl+E**: 导出数据为 JSON
- **Ctrl+R**: 手动刷新数据

添加自定义快捷键，在 `src/js/main.js` 中修改：

```javascript
document.addEventListener('keydown', (e) => {
    // 添加 Ctrl+S 保存截图
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        dashboard.captureScreenshot();
    }
});
```

### 📊 添加新图表

1. 在 `data/mockData.js` 中添加数据：
```javascript
newChart: {
    labels: ['A', 'B', 'C'],
    values: [10, 20, 30]
}
```

2. 在 `index.html` 中添加容器：
```html
<div class="chart-body" id="newChart"></div>
```

3. 在 `src/js/charts.js` 中添加初始化方法：
```javascript
initNewChart(data) {
    const container = document.getElementById('newChart');
    const chart = echarts.init(container);
    // ... 配置图表
}
```

4. 在 `initAllCharts()` 方法中调用：
```javascript
initAllCharts(data) {
    // ... 其他图表
    this.initNewChart(data.newChart);
}
```

---

## 常见问题

### ❓ 图表不显示？

**解决方法：**
1. 检查浏览器控制台是否有错误
2. 确认已正确引入 ECharts 库
3. 检查数据格式是否正确
4. 尝试刷新页面（Ctrl+F5）

### ❓ 修改数据后没有变化？

**解决方法：**
1. 清除浏览器缓存（Ctrl+Shift+Delete）
2. 硬刷新页面（Ctrl+F5）
3. 检查文件是否保存成功
4. 检查 JavaScript 控制台是否有语法错误

### ❓ 页面布局错乱？

**解决方法：**
1. 检查 CSS 文件是否正确加载
2. 使用浏览器开发者工具检查元素样式
3. 确认屏幕分辨率是否支持（建议 1920x1080）
4. 尝试缩放浏览器页面（Ctrl+0 重置缩放）

### ❓ 图表显示不全？

**解决方法：**
1. 调整容器的 `min-height` 属性
2. 检查数据是否超出显示范围
3. 调整图表的 `grid` 配置
4. 使用 `chart.resize()` 重新计算大小

### ❓ 如何部署到服务器？

**步骤：**
1. 将整个项目文件夹上传到服务器
2. 确保 Web 服务器可以访问 index.html
3. 配置正确的 MIME 类型
4. 如果使用 CDN，确保服务器可以访问外网

**Nginx 配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/Medical-Data-Dashboard;
        index index.html;
    }
}
```

### ❓ 性能优化建议

1. **减少数据量**：如果数据量很大，考虑分页或懒加载
2. **降低刷新频率**：根据实际需求调整刷新间隔
3. **压缩资源**：使用工具压缩 CSS 和 JS 文件
4. **使用 CDN**：ECharts 等库使用 CDN 加速
5. **图片优化**：如果有图片，使用 WebP 格式

---

## 📞 技术支持

如果遇到其他问题，请：
1. 查看浏览器控制台的错误信息
2. 检查 `data/mockData.js` 的数据格式
3. 参考 ECharts 官方文档：https://echarts.apache.org/

---

## 🎓 学习资源

- **ECharts 官方文档**: https://echarts.apache.org/zh/index.html
- **JavaScript 教程**: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript
- **CSS 教程**: https://developer.mozilla.org/zh-CN/docs/Web/CSS
- **HTML 教程**: https://developer.mozilla.org/zh-CN/docs/Web/HTML

---

**祝你使用愉快！** 🎉
