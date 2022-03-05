<template>
  <div :class="className" :style="{ width: width, height: height }" />
</template>

<script>
// 待完成：优化尺寸变化时随尺寸变化，四个框的响应式还有问题
import * as echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartDate: {
      // echarts 需要的数据
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartDate: {
      deep: true,
      handler(val) {
        this.setOption(val)
      }
    }
  },
  mounted() {
    // mouted 的时候可以获取到data，但是vue的初始化并没有完成
    this.$nextTick(() => {
      this.initChart()
    })
  },
  /**
   * 实例销毁之前调用的生命周期函数
   */
  beforeDestroy() {
    // 严谨判断，chart是否有值
    if (!this.chart) {
      // echart 初始化失败
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption(this.chartDate)
    },
    /**
     * echarts 配置项
     */
    setOption({ expectedData, actualData }) {
      this.chart.setOption({
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false, // 坐标轴两边留白策略
          axisTick: {
            // 坐标轴刻度相关设置
            show: false
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          textStyle: {
            color: '#fff',
            borderWidth: 0
          }
        },
        series: [
          {
            name: 'expected',
            itemStyle: {
              color: '#FF005A'
            },
            lineStyle: {
              color: '#FF005A',
              widht: 2
            },
            type: 'line',
            smooth: true,
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            itemStyle: {
              color: '#3888fa'
            },
            lineStyle: {
              color: '#3888fa',
              widht: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            },
            emphasis: {
              disabled: true
            },
            type: 'line',
            smooth: true,
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>

<style></style>
