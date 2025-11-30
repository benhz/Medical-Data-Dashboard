# 🚀 快速入门

欢迎使用医疗运营监控数据大屏！这是一个开箱即用的专业数据可视化模板。

## 📦 立即使用（只需 3 步）

### 步骤 1: 打开大屏
```bash
# 方法 A: 直接双击
双击 index.html 文件

# 方法 B: 使用本地服务器（推荐）
python -m http.server 8000
# 然后访问 http://localhost:8000
```

### 步骤 2: 修改数据
打开 `data/mockData.js`，修改你需要的数据：

```javascript
// 修改今日就诊人数
todayPatients: 50,  // 改成你的数据

// 修改门诊数据
todayOutpatient: 1500,
yesterdayOutpatient: 1200,

// 就这么简单！
```

### 步骤 3: 刷新查看
保存文件后，在浏览器中按 `Ctrl+R` 或 `F5` 刷新页面，即可看到更新的数据。

---

## 🎨 自定义样式（可选）

想要换个颜色主题？编辑 `src/css/main.css`：

```css
:root {
    --primary-color: #00f6ff;    /* 主色 - 改成你喜欢的颜色 */
    --accent-color: #ffd700;     /* 强调色 */
}
```

**推荐配色方案：**
- 🔵 蓝色科技：`#00f6ff`（当前）
- 💜 紫色梦幻：`#c792ea`
- 💚 绿色生态：`#00ff88`
- 💗 粉色温馨：`#ff6b9d`

---

## 📊 包含的图表

1. **统计卡片** - 今日就诊、床位使用等关键指标
2. **柱状图** - 主诊室注册人数月度对比
3. **折线图** - 每周人流量趋势分析
4. **环形图** - 医院收入分类占比
5. **仪表盘** - 一周就诊人数统计
6. **横向条形图** - 疾病分类排行
7. **对比柱状图** - 各科床位使用情况
8. **性别比例** - 可视化展示男女比例
9. **数据表格** - 智能病症数据统计

---

## ⌨️ 快捷键

- **F11** - 全屏显示
- **Ctrl+R** - 刷新数据
- **Ctrl+E** - 导出数据
- **Ctrl+0** - 重置缩放

---

## 💡 常见需求

### Q: 如何添加新的数据？

**A:** 打开 `data/mockData.js`，在对应的对象中添加数据：

```javascript
// 例如：添加新的科室
bedUsage: {
    departments: ['心内科', '外科', '儿科', '妇科', '骨科'],  // 加一个
    thisWeek: [52, 48, 62, 58, 45],                          // 加一个数据
    lastWeek: [48, 52, 56, 52, 42]                           // 加一个数据
}
```

### Q: 如何修改刷新间隔？

**A:** 编辑 `src/js/main.js` 第 72 行：

```javascript
this.updateTimer = setInterval(() => {
    this.refreshData();
}, 30000);  // 改成你想要的毫秒数（如 10000 = 10秒）
```

### Q: 如何接入真实 API？

**A:** 在 `src/js/main.js` 的 `refreshData()` 方法中添加：

```javascript
async refreshData() {
    const response = await fetch('你的API地址');
    const data = await response.json();
    this.data = data;
    // ... 更新界面
}
```

### Q: 如何部署到服务器？

**A:** 直接上传整个文件夹到你的 Web 服务器即可！

---

## 📚 更多帮助

- 📖 完整文档：查看 [README.md](README.md)
- 📘 使用指南：查看 [USAGE.md](USAGE.md)
- 🔧 修改数据：编辑 `data/mockData.js`
- 🎨 自定义样式：编辑 `src/css/main.css`

---

## 🎯 下一步

1. ✅ 打开 index.html 查看效果
2. ✅ 修改 data/mockData.js 替换成你的数据
3. ✅ 调整 src/css/main.css 中的颜色主题
4. ✅ 部署到服务器供团队使用

---

## 💬 需要帮助？

- 检查浏览器控制台是否有错误（按 F12）
- 查看 [USAGE.md](USAGE.md) 的常见问题章节
- 参考 ECharts 官方文档：https://echarts.apache.org/

---

**就是这么简单！开始创建你的专业数据大屏吧！** 🎉
