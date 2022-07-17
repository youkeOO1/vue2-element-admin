<template>
  <div class="chart-container">
    <chart width="100%" height="100%" id="keyBoard" />
  </div>
</template>

<script>
import chart from '@/components/Charts/Keyboard.vue'
export default {
  name: 'KeyboardChart',
  components: {
    chart
  }
}
</script>

<style scoped>
  .chart-container {
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
