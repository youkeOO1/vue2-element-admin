<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px"> Fixed header, sorted by header order, </div>
    <fixed-thead />
    <div style="margin:30px 0 5px 20px"> Not fixed header, sorted by click order </div>
    <un-fixed-thead />
  </div>
</template>

<script>
import FixedThead from './components/FixedThead.vue'
import UnFixedThead from './components/UnFixedThead'

export default {
  naem: 'DynamicTable',
  components: {
    FixedThead,
    UnFixedThead
  }
}
</script>

<style lang="scss" scoped>

</style>
