<template>
  <div :id="id" :class="className" :style="{ width: width, height: height }" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixin/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xAxisData = []
      const data = []
      const data2 = []
      for (let i = 0; i < 50; i++) {
        xAxisData.push(i)
        data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3)
      }
      this.chart.setOption({
        backgroundColor: '#08263a',
        grid: {
          left: '5%',
          top: '5%'
        },
        xAxis: [
          {
            show: false,
            data: xAxisData
          },
          {
            show: false,
            data: xAxisData
          }
        ],
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#4a657a'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 50,
          dimension: 0,
          inRange: {
            color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
          },
          seriesIndex: [0, 2]
        },
        series: [
          {
            name: 'back',
            type: 'bar',
            z: 1,
            data: data2,
            itemStyle: {
              normal: {
                opacity: 0.4,
                barBorderRadius: 5,
                shadowBlur: 3,
                shadowColor: '#111'
              }
            }
          },
          {
            name: 'Simulate Shadow',
            type: 'line',
            z: 2,
            data,
            showSymbol: false,
            animationDelay: 0,
            animationEasing: 'elasticOut',
            animationDuration(idx) {
              return idx * 20
            },
            itemStyle: {
              color: 'transparent'
            },
            areaStyle: {
              color: '#08263a',
              shadowBlur: 50,
              shadowColor: '#000'
            }
          },
          {
            name: 'front',
            type: 'bar',
            z: 3,
            xAxisIndex: 1,
            data,
            itemStyle: {
              barBorderRadius: 5
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationEasingUpdate: 'elasticOut',
        animationDelay(idx) {
          return idx * 20
        },
        animationDelayUpdate(idx) {
          return idx * 20
        }
      })
    }
  }
}
</script>

<style></style>
