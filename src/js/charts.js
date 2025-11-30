/**
 * 图表配置和初始化
 */

const Charts = {
    // 存储所有图表实例
    instances: {},

    /**
     * 初始化主诊室注册人数对比图表
     */
    initRegistrationChart(data) {
        const container = document.getElementById('registrationChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.registrationChart = chart;

        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                data: ['人数', '人次'],
                textStyle: {
                    color: '#a0d8e8'
                },
                top: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.months,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '人数',
                    type: 'bar',
                    data: data.personCount,
                    barWidth: '30%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ffd700' },
                            { offset: 1, color: '#ff8c00' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#ffed4e' },
                                { offset: 1, color: '#ffaa00' }
                            ])
                        }
                    }
                },
                {
                    name: '人次',
                    type: 'bar',
                    data: data.timesCount,
                    barWidth: '30%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f6ff' },
                            { offset: 1, color: '#0ea9b5' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#5dfdff' },
                                { offset: 1, color: '#00d4ff' }
                            ])
                        }
                    }
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化每周人流量分布图表
     */
    initWeeklyFlowChart(data) {
        const container = document.getElementById('weeklyFlowChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.weeklyFlowChart = chart;

        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                data: ['本代', '上一代'],
                textStyle: {
                    color: '#a0d8e8'
                },
                top: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.days,
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '本代',
                    type: 'line',
                    data: data.current,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        color: '#ffd700',
                        width: 3
                    },
                    itemStyle: {
                        color: '#ffd700',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 215, 0, 0.4)' },
                            { offset: 1, color: 'rgba(255, 215, 0, 0.05)' }
                        ])
                    }
                },
                {
                    name: '上一代',
                    type: 'line',
                    data: data.previous,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        color: '#00f6ff',
                        width: 3
                    },
                    itemStyle: {
                        color: '#00f6ff',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(0, 246, 255, 0.4)' },
                            { offset: 1, color: 'rgba(0, 246, 255, 0.05)' }
                        ])
                    }
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化医院收入分类图表
     */
    initIncomeDistributionChart(data) {
        const container = document.getElementById('incomeDistributionChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.incomeDistributionChart = chart;

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                },
                formatter: '{b}: {c}%'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '55%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
                        borderColor: 'rgba(0, 0, 0, 0.5)',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: '{b}\n{c}%',
                        color: '#a0d8e8',
                        fontSize: 11
                    },
                    labelLine: {
                        show: true,
                        lineStyle: {
                            color: 'rgba(0, 246, 255, 0.3)'
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 13,
                            fontWeight: 'bold'
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 246, 255, 0.5)'
                        }
                    },
                    data: data.categories.map(item => ({
                        value: item.value,
                        name: item.name,
                        itemStyle: {
                            color: item.color
                        }
                    }))
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化一周就诊人数统计图表
     */
    initWeeklyPatientsChart(data) {
        const container = document.getElementById('weeklyPatientsChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.weeklyPatientsChart = chart;

        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                },
                formatter: '{b}: {c}%'
            },
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '55%'],
                    radius: '80%',
                    startAngle: 220,
                    endAngle: -40,
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: {
                        lineStyle: {
                            width: 25,
                            color: [
                                [0.3, '#ff6b9d'],
                                [0.6, '#ffd700'],
                                [1, '#00ff88']
                            ]
                        }
                    },
                    pointer: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        distance: -25,
                        length: 8,
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function(value) {
                            return data.total;
                        },
                        color: '#00f6ff',
                        fontWeight: 'bold'
                    },
                    title: {
                        offsetCenter: [0, '35%'],
                        fontSize: 14,
                        color: '#a0d8e8'
                    },
                    data: [{
                        value: 26.7,
                        name: '本周总人数'
                    }]
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化疾病分类排行图表
     */
    initDiseaseRankingChart(data) {
        const container = document.getElementById('diseaseRankingChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.diseaseRankingChart = chart;

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '15%',
                right: '10%',
                bottom: '3%',
                top: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: data.map(item => item.name),
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                },
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    type: 'bar',
                    data: data.map((item, index) => ({
                        value: item.value,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                { offset: 0, color: index % 2 === 0 ? '#00f6ff' : '#ffd700' },
                                { offset: 1, color: index % 2 === 0 ? '#0ea9b5' : '#ff8c00' }
                            ]),
                            borderRadius: [0, 4, 4, 0]
                        }
                    })),
                    barWidth: '50%',
                    label: {
                        show: true,
                        position: 'right',
                        color: '#a0d8e8',
                        fontSize: 12
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 246, 255, 0.5)'
                        }
                    }
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化各科床位使用情况图表
     */
    initBedUsageChart(data) {
        const container = document.getElementById('bedUsageChart');
        if (!container) return;

        const chart = echarts.init(container);
        this.instances.bedUsageChart = chart;

        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(15, 45, 75, 0.9)',
                borderColor: '#00f6ff',
                borderWidth: 1,
                textStyle: {
                    color: '#fff'
                }
            },
            legend: {
                data: ['本周', '上周'],
                textStyle: {
                    color: '#a0d8e8'
                },
                top: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.departments,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#a0d8e8',
                    fontSize: 12
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 246, 255, 0.1)',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: '本周',
                    type: 'bar',
                    data: data.thisWeek,
                    barWidth: '25%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00ff88' },
                            { offset: 1, color: '#00aa55' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    name: '上周',
                    type: 'bar',
                    data: data.lastWeek,
                    barWidth: '25%',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#00f6ff' },
                            { offset: 1, color: '#0ea9b5' }
                        ]),
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };

        chart.setOption(option);
        Utils.handleChartResize(chart);
    },

    /**
     * 初始化所有图表
     */
    initAllCharts(data) {
        this.initRegistrationChart(data.registration);
        this.initWeeklyFlowChart(data.weeklyFlow);
        this.initIncomeDistributionChart(data.incomeDistribution);
        this.initWeeklyPatientsChart(data.weeklyPatients);
        this.initDiseaseRankingChart(data.diseaseRanking);
        this.initBedUsageChart(data.bedUsage);
    },

    /**
     * 销毁所有图表
     */
    disposeAll() {
        Object.values(this.instances).forEach(chart => {
            if (chart) {
                chart.dispose();
            }
        });
        this.instances = {};
    },

    /**
     * 刷新所有图表
     */
    refreshAll(data) {
        this.disposeAll();
        this.initAllCharts(data);
    }
};

// 导出图表对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Charts;
}
