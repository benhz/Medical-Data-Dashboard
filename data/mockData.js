/**
 * 医疗数据大屏 - 模拟数据配置
 * 所有数据都可以在此文件中修改
 */

const mockData = {
    // 概览数据
    overview: {
        todayPatients: 32,           // 今日就诊总数
        todayBeds: 268,              // 今日使用床位
        todayOutpatient: 1223,       // 今日门诊
        yesterdayOutpatient: 897,    // 昨日门诊
        todayInpatient: 1223,        // 今日住院
        yesterdayInpatient: 897,     // 昨日住院
        todayDischarge: 1223,        // 今日出院
        yesterdayDischarge: 897,     // 昨日出院
        todayDoctorVisit: 1223,      // 今日出诊
        yesterdayDoctorVisit: 897,   // 昨日出诊
        todaySurgery: 1223,          // 今日手术
        yesterdaySurgery: 897        // 昨日手术
    },

    // 性别比例数据
    gender: {
        male: 45,      // 男性占比 (%)
        female: 55     // 女性占比 (%)
    },

    // 主诊室注册人数 - 月度对比数据
    registration: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        personCount: [45, 52, 48, 56, 58, 52, 48],     // 人数
        timesCount: [38, 42, 52, 46, 42, 48, 45]       // 人次
    },

    // 每周人流量分布
    weeklyFlow: {
        days: ['一月', '二月', '三月', '四月', '五月', '六月'],
        current: [42, 48, 35, 52, 45, 38],     // 本代
        previous: [38, 45, 42, 48, 40, 42]     // 上一代
    },

    // 医院收入分类
    incomeDistribution: {
        categories: [
            { name: '门诊收入', value: 68, color: '#00f6ff' },
            { name: '住院收入', value: 80, color: '#0ea9b5' },
            { name: '不详收入', value: 45, color: '#ffd700' },
            { name: '手续收入', value: 32, color: '#00ff88' },
            { name: '门诊收入', value: 28, color: '#ff6b9d' },
            { name: '手续收入', value: 25, color: '#c792ea' }
        ]
    },

    // 一周就诊人数统计
    weeklyPatients: {
        total: 2847,
        breakdown: [
            { name: '儿童', value: 53.3, color: '#00f6ff' },
            { name: '成年', value: 26.7, color: '#ffd700' },
            { name: '青年', value: 13.3, color: '#00ff88' },
            { name: '中年', value: 6.7, color: '#ff6b9d' }
        ]
    },

    // 疾病分类排行
    diseaseRanking: [
        { name: '乡镇医院', value: 85 },
        { name: '医站', value: 72 },
        { name: '心血管', value: 65 },
        { name: '临床科', value: 58 },
        { name: '骨科', value: 52 }
    ],

    // 各科床位使用情况
    bedUsage: {
        departments: ['心内科', '外科', '儿科', '妇科'],
        thisWeek: [52, 48, 62, 58],    // 本周
        lastWeek: [48, 52, 56, 52]     // 上周
    },

    // 智能病症数据表格
    analysisTable: [
        { rank: 1, disease: '感冒', thisWeek: 96, lastWeek: 96 },
        { rank: 2, disease: '肺炎', thisWeek: 77, lastWeek: 75 },
        { rank: 3, disease: '高血压', thisWeek: 98, lastWeek: 124 },
        { rank: 4, disease: '糖尿病', thisWeek: 65, lastWeek: 93 },
        { rank: 5, disease: '失眠', thisWeek: 65, lastWeek: 85 },
        { rank: 6, disease: '胃病', thisWeek: 73, lastWeek: 68 },
        { rank: 7, disease: '精神疾病', thisWeek: 77, lastWeek: 75 },
        { rank: 8, disease: '骨折', thisWeek: 75, lastWeek: 68 },
        { rank: 9, disease: '失眠', thisWeek: 65, lastWeek: 85 },
        { rank: 10, disease: '肺炎', thisWeek: 60, lastWeek: 93 },
        { rank: 2, disease: '肺病医院', thisWeek: 150, lastWeek: 125 },
        { rank: 3, disease: '高血压', thisWeek: 98, lastWeek: 124 },
        { rank: 4, disease: '口腔医院', thisWeek: 95, lastWeek: 112 }
    ],

    // 额外统计数据
    extraStats: {
        alertCount: 3,          // 待处理告警
        emergencyCount: 12,     // 急诊患者
        appointmentCount: 45,   // 预约挂号
        vaccineCount: 28        // 疫苗接种
    },

    // 患者来源分布
    patientSource: [
        { name: '本市', value: 45 },
        { name: '外市', value: 28 },
        { name: '外省', value: 18 },
        { name: '其他', value: 9 }
    ]
};

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}
