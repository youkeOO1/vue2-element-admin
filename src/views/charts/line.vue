<template>
  <div class="chart-container">
    <line-marker width="100%" height="100%" />
  </div>
</template>

<script>
import LineMarker from '@/components/Charts/LineMarker.vue'
export default {
  name: 'LineChart',
  components: {
    LineMarker
  }
}
</script>

