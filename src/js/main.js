/**
 * 医疗数据大屏 - 主程序
 */

class MedicalDashboard {
    constructor() {
        this.data = mockData;
        this.updateTimer = null;
        this.clockTimer = null;
    }

    /**
     * 初始化大屏
     */
    init() {
        console.log('🚀 医疗数据大屏初始化中...');

        // 1. 初始化时间显示
        this.initClock();

        // 2. 更新概览数据
        this.updateOverviewData();

        // 3. 初始化图表
        Charts.initAllCharts(this.data);

        // 4. 更新性别比例
        this.updateGenderData();

        // 5. 更新额外统计数据
        this.updateExtraStats();

        // 6. 更新分析表格
        this.updateAnalysisTable();

        // 7. 启动自动刷新
        this.startAutoRefresh();

        // 7. 监听窗口变化
        this.handleWindowResize();

        console.log('✅ 医疗数据大屏初始化完成！');
    }

    /**
     * 初始化时钟
     */
    initClock() {
        const updateClock = () => {
            const dateTimeElement = document.getElementById('currentDateTime');
            if (dateTimeElement) {
                dateTimeElement.textContent = Utils.formatDateTime();
            }
        };

        updateClock(); // 立即更新一次
        this.clockTimer = setInterval(updateClock, 1000); // 每秒更新
    }

    /**
     * 更新概览数据
     */
    updateOverviewData() {
        const { overview } = this.data;

        // 更新统计卡片
        this.updateElementWithAnimation('todayPatients', `${overview.todayPatients}人`);
        this.updateElementWithAnimation('todayBeds', `${overview.todayBeds}张`);

        // 更新对比数据
        this.updateElement('todayOutpatient', overview.todayOutpatient);
        this.updateElement('yesterdayOutpatient', overview.yesterdayOutpatient);

        this.updateElement('todayInpatient', overview.todayInpatient);
        this.updateElement('yesterdayInpatient', overview.yesterdayInpatient);

        this.updateElement('todayDischarge', overview.todayDischarge);
        this.updateElement('yesterdayDischarge', overview.yesterdayDischarge);

        this.updateElement('todayDoctorVisit', overview.todayDoctorVisit);
        this.updateElement('yesterdayDoctorVisit', overview.yesterdayDoctorVisit);

        this.updateElement('todaySurgery', overview.todaySurgery);
        this.updateElement('yesterdaySurgery', overview.yesterdaySurgery);
    }

    /**
     * 更新性别比例数据
     */
    updateGenderData() {
        const { gender } = this.data;

        this.updateElement('malePercentage', `${gender.male}%`);
        this.updateElement('femalePercentage', `${gender.female}%`);
    }

    /**
     * 更新额外统计数据
     */
    updateExtraStats() {
        const { extraStats } = this.data;

        this.updateElement('alertCount', extraStats.alertCount);
        this.updateElement('emergencyCount', extraStats.emergencyCount);
        this.updateElement('appointmentCount', extraStats.appointmentCount);
        this.updateElement('vaccineCount', extraStats.vaccineCount);
    }

    /**
     * 更新分析表格
     */
    updateAnalysisTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;

        const { analysisTable } = this.data;

        const tableHTML = analysisTable.map(row => `
            <tr>
                <td>${row.rank}</td>
                <td>${row.disease}</td>
                <td>${row.thisWeek}</td>
                <td>${row.lastWeek}</td>
            </tr>
        `).join('');

        tableBody.innerHTML = tableHTML;
    }

    /**
     * 更新元素内容
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * 带动画效果的更新
     */
    updateElementWithAnimation(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = value;
                element.style.transition = 'opacity 0.5s';
                element.style.opacity = '1';
            }, 200);
        }
    }

    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
        // 每30秒刷新一次数据（可根据需求调整）
        this.updateTimer = setInterval(() => {
            console.log('🔄 刷新数据...');
            this.refreshData();
        }, 30000);
    }

    /**
     * 刷新数据
     */
    refreshData() {
        // 这里可以调用 API 获取最新数据
        // 目前使用模拟数据

        // 模拟数据变化
        this.simulateDataChange();

        // 更新界面
        this.updateOverviewData();
        this.updateGenderData();
        this.updateExtraStats();
        this.updateAnalysisTable();

        // 刷新图表
        Charts.refreshAll(this.data);

        console.log('✅ 数据刷新完成');
    }

    /**
     * 模拟数据变化 (仅用于演示)
     */
    simulateDataChange() {
        // 随机变化一些数据
        const randomChange = (value, range = 10) => {
            const change = Math.floor(Math.random() * range * 2) - range;
            return Math.max(0, value + change);
        };

        // 更新概览数据
        this.data.overview.todayPatients = randomChange(this.data.overview.todayPatients, 5);
        this.data.overview.todayOutpatient = randomChange(this.data.overview.todayOutpatient, 50);
        this.data.overview.todayInpatient = randomChange(this.data.overview.todayInpatient, 30);

        // 更新图表数据
        this.data.registration.personCount = this.data.registration.personCount.map(v => randomChange(v, 3));
        this.data.registration.timesCount = this.data.registration.timesCount.map(v => randomChange(v, 3));
    }

    /**
     * 处理窗口大小变化
     */
    handleWindowResize() {
        const resizeHandler = Utils.debounce(() => {
            console.log('📐 窗口大小改变，调整图表...');
            Object.values(Charts.instances).forEach(chart => {
                if (chart) {
                    chart.resize();
                }
            });
        }, 300);

        window.addEventListener('resize', resizeHandler);
    }

    /**
     * 销毁大屏
     */
    destroy() {
        // 清除定时器
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        if (this.clockTimer) {
            clearInterval(this.clockTimer);
        }

        // 销毁所有图表
        Charts.disposeAll();

        console.log('🛑 医疗数据大屏已销毁');
    }

    /**
     * 导出数据为 JSON
     */
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `医疗数据_${new Date().getTime()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('📥 数据导出成功');
    }

    /**
     * 导入数据
     */
    importData(jsonData) {
        try {
            this.data = JSON.parse(jsonData);
            this.refreshData();
            console.log('📤 数据导入成功');
            return true;
        } catch (error) {
            console.error('❌ 数据导入失败:', error);
            return false;
        }
    }

    /**
     * 切换全屏模式
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('❌ 进入全屏失败:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /**
     * 截图功能
     */
    async captureScreenshot() {
        try {
            // 这里可以使用 html2canvas 等库实现截图
            console.log('📸 截图功能需要引入 html2canvas 库');
            alert('截图功能需要引入 html2canvas 库，请在项目中添加该库后使用');
        } catch (error) {
            console.error('❌ 截图失败:', error);
        }
    }
}

// 全局实例
let dashboard = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 页面加载完成');

    // 创建大屏实例
    dashboard = new MedicalDashboard();
    dashboard.init();

    // 暴露到全局，方便调试
    window.dashboard = dashboard;

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // F11: 全屏
        if (e.key === 'F11') {
            e.preventDefault();
            dashboard.toggleFullscreen();
        }
        // Ctrl+E: 导出数据
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            dashboard.exportData();
        }
        // Ctrl+R: 刷新数据
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            dashboard.refreshData();
        }
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('⏸️ 页面已隐藏，暂停刷新');
        } else {
            console.log('▶️ 页面已显示，恢复刷新');
        }
    });
});

// 页面卸载前清理
window.addEventListener('beforeunload', () => {
    if (dashboard) {
        dashboard.destroy();
    }
});

// 错误处理
window.addEventListener('error', (event) => {
    console.error('❌ 全局错误:', event.error);
});

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ 未处理的 Promise 拒绝:', event.reason);
});

console.log('📱 医疗数据大屏系统已加载');
console.log('💡 提示：');
console.log('  - 按 F11 进入/退出全屏');
console.log('  - 按 Ctrl+E 导出数据');
console.log('  - 按 Ctrl+R 手动刷新数据');
console.log('  - 使用 window.dashboard 访问大屏实例');
