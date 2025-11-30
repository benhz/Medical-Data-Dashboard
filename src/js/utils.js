/**
 * 工具函数库
 */

const Utils = {
    /**
     * 格式化当前日期时间
     * @returns {string} 格式化后的日期时间字符串
     */
    formatDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    /**
     * 获取中文日期
     * @returns {string} 中文格式日期
     */
    getChineseDate() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${month}月${day}日`;
    },

    /**
     * 生成随机温度 (用于演示)
     * @param {number} min 最小温度
     * @param {number} max 最大温度
     * @returns {number} 随机温度
     */
    getRandomTemperature(min = 20, max = 35) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 数字动画效果
     * @param {HTMLElement} element DOM 元素
     * @param {number} target 目标数字
     * @param {number} duration 动画持续时间(ms)
     * @param {string} suffix 后缀文字
     */
    animateNumber(element, target, duration = 1000, suffix = '') {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    },

    /**
     * 防抖函数
     * @param {Function} func 要执行的函数
     * @param {number} wait 等待时间
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func 要执行的函数
     * @param {number} limit 时间间隔
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 深拷贝对象
     * @param {Object} obj 要拷贝的对象
     * @returns {Object} 拷贝后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));

        const clonedObj = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = this.deepClone(obj[key]);
            }
        }
        return clonedObj;
    },

    /**
     * 格式化数字 (添加千分位)
     * @param {number} num 要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * 生成随机颜色
     * @returns {string} 十六进制颜色值
     */
    getRandomColor() {
        const colors = [
            '#00f6ff', '#0ea9b5', '#ffd700', '#00ff88',
            '#ff6b9d', '#c792ea', '#82aaff', '#ffcb6b'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * 检测是否为移动设备
     * @returns {boolean} 是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * 获取响应式图表大小
     * @param {HTMLElement} container 容器元素
     * @returns {Object} 宽度和高度
     */
    getResponsiveSize(container) {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        return { width, height };
    },

    /**
     * 数据更新动画
     * @param {Function} callback 更新回调函数
     * @param {number} interval 更新间隔(ms)
     * @returns {number} 定时器ID
     */
    autoUpdate(callback, interval = 30000) {
        callback(); // 立即执行一次
        return setInterval(callback, interval);
    },

    /**
     * 显示加载动画
     * @param {HTMLElement} element 目标元素
     */
    showLoading(element) {
        element.innerHTML = '<div class="loading">加载中...</div>';
    },

    /**
     * 隐藏加载动画
     * @param {HTMLElement} element 目标元素
     */
    hideLoading(element) {
        const loading = element.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    },

    /**
     * 获取ECharts通用配置
     * @returns {Object} ECharts配置对象
     */
    getCommonChartConfig() {
        return {
            textStyle: {
                color: '#a0d8e8',
                fontFamily: 'Microsoft YaHei, PingFang SC, sans-serif'
            },
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut'
        };
    },

    /**
     * 图表自适应
     * @param {Object} chart ECharts实例
     */
    handleChartResize(chart) {
        if (!chart) return;

        const resizeHandler = this.debounce(() => {
            chart.resize();
        }, 300);

        window.addEventListener('resize', resizeHandler);

        // 返回清理函数
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    },

    /**
     * 存储数据到本地
     * @param {string} key 键名
     * @param {*} value 值
     */
    saveToLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    },

    /**
     * 从本地读取数据
     * @param {string} key 键名
     * @returns {*} 存储的值
     */
    loadFromLocal(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('LocalStorage load failed:', e);
            return null;
        }
    },

    /**
     * 清除本地存储
     * @param {string} key 键名，不传则清除所有
     */
    clearLocal(key) {
        if (key) {
            localStorage.removeItem(key);
        } else {
            localStorage.clear();
        }
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
