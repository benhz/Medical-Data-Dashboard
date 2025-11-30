/**
 * 数据模板 - 快速切换不同场景的数据
 *
 * 使用方法：
 * 1. 复制你需要的场景数据
 * 2. 粘贴到 mockData.js 中替换对应部分
 * 3. 刷新页面查看效果
 */

// ========== 场景 1: 大型综合医院 ==========
const largeHospitalData = {
    overview: {
        todayPatients: 856,
        todayBeds: 1245,
        todayOutpatient: 5678,
        yesterdayOutpatient: 5234,
        todayInpatient: 1245,
        yesterdayInpatient: 1189,
        todayDischarge: 234,
        yesterdayDischarge: 267,
        todayDoctorVisit: 456,
        yesterdayDoctorVisit: 423,
        todaySurgery: 89,
        yesterdaySurgery: 76
    },
    gender: {
        male: 48,
        female: 52
    },
    registration: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        personCount: [4500, 4800, 4600, 5200, 5400, 5100, 4900],
        timesCount: [5200, 5500, 5300, 5900, 6100, 5800, 5600]
    }
};

// ========== 场景 2: 社区医院/诊所 ==========
const communityClinicData = {
    overview: {
        todayPatients: 45,
        todayBeds: 28,
        todayOutpatient: 123,
        yesterdayOutpatient: 108,
        todayInpatient: 28,
        yesterdayInpatient: 25,
        todayDischarge: 5,
        yesterdayDischarge: 7,
        todayDoctorVisit: 12,
        yesterdayDoctorVisit: 10,
        todaySurgery: 2,
        yesterdaySurgery: 1
    },
    gender: {
        male: 42,
        female: 58
    },
    registration: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        personCount: [80, 92, 85, 98, 105, 95, 88],
        timesCount: [95, 108, 102, 115, 122, 112, 105]
    }
};

// ========== 场景 3: 专科医院（儿科） ==========
const pediatricHospitalData = {
    overview: {
        todayPatients: 234,
        todayBeds: 156,
        todayOutpatient: 1234,
        yesterdayOutpatient: 1156,
        todayInpatient: 156,
        yesterdayInpatient: 148,
        todayDischarge: 23,
        yesterdayDischarge: 28,
        todayDoctorVisit: 45,
        yesterdayDoctorVisit: 42,
        todaySurgery: 8,
        yesterdaySurgery: 6
    },
    gender: {
        male: 52,
        female: 48
    },
    weeklyPatients: {
        total: 3542,
        breakdown: [
            { name: '婴幼儿', value: 38.5, color: '#00f6ff' },
            { name: '学龄前', value: 32.8, color: '#ffd700' },
            { name: '学龄期', value: 22.4, color: '#00ff88' },
            { name: '青少年', value: 6.3, color: '#ff6b9d' }
        ]
    }
};

// ========== 场景 4: 急诊中心 ==========
const emergencyData = {
    overview: {
        todayPatients: 456,
        todayBeds: 89,
        todayOutpatient: 456,
        yesterdayOutpatient: 423,
        todayInpatient: 89,
        yesterdayInpatient: 92,
        todayDischarge: 45,
        yesterdayDischarge: 38,
        todayDoctorVisit: 123,
        yesterdayDoctorVisit: 115,
        todaySurgery: 23,
        yesterdaySurgery: 19
    },
    diseaseRanking: [
        { name: '创伤', value: 125 },
        { name: '心脑血管', value: 98 },
        { name: '呼吸系统', value: 87 },
        { name: '消化系统', value: 72 },
        { name: '其他急症', value: 64 }
    ],
    analysisTable: [
        { rank: 1, disease: '外伤', thisWeek: 156, lastWeek: 142 },
        { rank: 2, disease: '急性心梗', thisWeek: 89, lastWeek: 95 },
        { rank: 3, disease: '脑卒中', thisWeek: 76, lastWeek: 82 },
        { rank: 4, disease: '急性肺炎', thisWeek: 65, lastWeek: 58 },
        { rank: 5, disease: '急性胃炎', thisWeek: 54, lastWeek: 62 }
    ]
};

// ========== 场景 5: 体检中心 ==========
const healthCheckData = {
    overview: {
        todayPatients: 189,
        todayBeds: 0,
        todayOutpatient: 189,
        yesterdayOutpatient: 176,
        todayInpatient: 0,
        yesterdayInpatient: 0,
        todayDischarge: 0,
        yesterdayDischarge: 0,
        todayDoctorVisit: 15,
        yesterdayDoctorVisit: 14,
        todaySurgery: 0,
        yesterdaySurgery: 0
    },
    gender: {
        male: 55,
        female: 45
    },
    incomeDistribution: {
        categories: [
            { name: '常规体检', value: 45, color: '#00f6ff' },
            { name: '高端体检', value: 28, color: '#ffd700' },
            { name: '职业体检', value: 15, color: '#00ff88' },
            { name: '专项检查', value: 8, color: '#ff6b9d' },
            { name: '其他项目', value: 4, color: '#c792ea' }
        ]
    },
    analysisTable: [
        { rank: 1, disease: '高血脂', thisWeek: 234, lastWeek: 218 },
        { rank: 2, disease: '脂肪肝', thisWeek: 187, lastWeek: 195 },
        { rank: 3, disease: '颈椎病', thisWeek: 156, lastWeek: 142 },
        { rank: 4, disease: '视力异常', thisWeek: 134, lastWeek: 128 },
        { rank: 5, disease: '血压异常', thisWeek: 98, lastWeek: 105 }
    ]
};

// ========== 场景 6: 康复中心 ==========
const rehabilitationData = {
    overview: {
        todayPatients: 67,
        todayBeds: 89,
        todayOutpatient: 34,
        yesterdayOutpatient: 32,
        todayInpatient: 89,
        yesterdayInpatient: 87,
        todayDischarge: 3,
        yesterdayDischarge: 5,
        todayDoctorVisit: 8,
        yesterdayDoctorVisit: 7,
        todaySurgery: 0,
        yesterdaySurgery: 0
    },
    bedUsage: {
        departments: ['理疗科', '运动康复', '神经康复', '骨科康复', '心肺康复'],
        thisWeek: [78, 85, 92, 68, 75],
        lastWeek: [72, 82, 88, 65, 70]
    },
    analysisTable: [
        { rank: 1, disease: '脑卒中康复', thisWeek: 45, lastWeek: 42 },
        { rank: 2, disease: '骨折术后', thisWeek: 38, lastWeek: 35 },
        { rank: 3, disease: '运动损伤', thisWeek: 28, lastWeek: 31 },
        { rank: 4, disease: '脊髓损伤', thisWeek: 15, lastWeek: 16 },
        { rank: 5, disease: '慢性疼痛', thisWeek: 12, lastWeek: 14 }
    ]
};

// ========== 场景 7: 精神卫生中心 ==========
const mentalHealthData = {
    overview: {
        todayPatients: 123,
        todayBeds: 234,
        todayOutpatient: 89,
        yesterdayOutpatient: 76,
        todayInpatient: 234,
        yesterdayInpatient: 231,
        todayDischarge: 5,
        yesterdayDischarge: 8,
        todayDoctorVisit: 23,
        yesterdayDoctorVisit: 21,
        todaySurgery: 0,
        yesterdaySurgery: 0
    },
    analysisTable: [
        { rank: 1, disease: '抑郁症', thisWeek: 89, lastWeek: 92 },
        { rank: 2, disease: '焦虑症', thisWeek: 76, lastWeek: 71 },
        { rank: 3, disease: '双相情感障碍', thisWeek: 45, lastWeek: 48 },
        { rank: 4, disease: '精神分裂症', thisWeek: 34, lastWeek: 36 },
        { rank: 5, disease: '强迫症', thisWeek: 28, lastWeek: 25 }
    ]
};

// ========== 颜色主题配置 ==========
const colorThemes = {
    // 科技蓝（默认）
    techBlue: {
        primary: '#00f6ff',
        secondary: '#0ea9b5',
        accent: '#ffd700'
    },
    // 梦幻紫
    dreamPurple: {
        primary: '#c792ea',
        secondary: '#a76cc7',
        accent: '#ffcb6b'
    },
    // 生态绿
    ecoGreen: {
        primary: '#00ff88',
        secondary: '#00cc6a',
        accent: '#ffed4e'
    },
    // 温馨粉
    warmPink: {
        primary: '#ff6b9d',
        secondary: '#e85d8a',
        accent: '#ffd700'
    },
    // 商务灰
    businessGray: {
        primary: '#82aaff',
        secondary: '#5f7d9a',
        accent: '#ffcb6b'
    }
};

// 导出所有场景数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        largeHospitalData,
        communityClinicData,
        pediatricHospitalData,
        emergencyData,
        healthCheckData,
        rehabilitationData,
        mentalHealthData,
        colorThemes
    };
}

/**
 * 使用示例：
 *
 * 1. 快速切换到大型医院场景：
 *    将 largeHospitalData 中的数据复制到 mockData.js
 *
 * 2. 修改主题颜色：
 *    在 src/css/main.css 中修改 :root 变量为对应主题的颜色
 *
 * 3. 混合使用：
 *    可以只替换某个部分，如只更新 overview 数据
 */
