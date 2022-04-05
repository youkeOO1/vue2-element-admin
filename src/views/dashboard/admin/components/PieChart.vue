<template>
  <div :class="className" :style="{width: width, height: height}" />
</template>

<script>
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
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption()
    },
    setOption() {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          borderWidth: 0,
          textStyle: {
            color: '#fff',
            fontWeight: 'bold'
          },
          formatter: '{a}<br /> {b}:{c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            type: 'pie',
            name: 'WEEKLY WRITE ARTICLES',
            center: ['50%', '38%'],
            radius: [15, 95],
            roseType: 'radius',
            data: [
              { name: 'Industries', value: 320 },
              { name: 'Technology', value: 240 },
              { name: 'Forex', value: 149 },
              { name: 'Gold', value: 100 },
              { name: 'Forecasts', value: 59 }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
