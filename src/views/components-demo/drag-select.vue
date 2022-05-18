<template>
  <div class="components-container">
    <drag-select v-model="value" style="width:500px;" multiple placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"/>
    </drag-select>
    <div>
      <el-tag type="success" v-for="item in value" :key="item"> {{ item }}</el-tag>
    </div>
  </div>
</template>

<script>
import DragSelect from '@/components/DragSelect'

export default {
  components: {
    DragSelect
  },
  data() {
    return {
      value: ['Apple', 'Banana', 'Orange'],
      options: [{
        value: 'Apple',
        label: 'Apple'
      }, {
        value: 'Banana',
        label: 'Banana'
      }, {
        value: 'Orange',
        label: 'Orange'
      }, {
        value: 'Pear',
        label: 'Pear'
      }, {
        value: 'Strawberry',
        label: 'Strawberry'
      }]
    }
  }
}
</script>

<style>

</style>
