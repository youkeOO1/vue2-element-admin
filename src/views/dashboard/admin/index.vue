<template>
  <div class="dashboard-editor-container">
    <github-corner />
    <!-- 面板组 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <!-- 折线组 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-date="lineChartData" />
    </el-row>
    <!-- 雷达，南丁格尔图， 柱状图 -->
    <el-row :gutter="32">
      <!-- 雷达图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <radder-chart />
        </div>
      </el-col>
      <!-- 南丁格尔图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <!-- 柱状图 -->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
    <!-- 功能区 -->
    <el-row :gutter="8">
      <!-- 事务表 -->
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <!-- 任务表 -->
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <!-- 个人卡片 -->
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@com/GithubCorner'
import PanelGroup from './components/PanelGroup.vue'
import LineChart from './components/LineChart.vue'
import RadderChart from './components/RadderChart.vue'
import PieChart from './components/PieChart.vue'
import BarChart from './components/BarChart.vue'
import TransactionTable from './components/TransactionTable.vue'
import TodoList from './components/todoList/index.vue'
import BoxCard from './components/BoxCard.vue'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RadderChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background: #f0f2f5;
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
