<template>
  <div class="components-container">
    <aside>
      drag-list base ona <a href="https://github.com/SortableJS/Vue.Draggable">Vue.Draggable</a>
    </aside>
    <div>
      <dnd-list :data1="data1" :data1-title="data1Title" :data2="data2" :data2-title="data2Title" />
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'
import { fetchList } from '@/api/article'

export default {
  components: {
    DndList
  },
  data() {
    return {
      data1: [],
      data2: [],
      data1Title: 'List',
      data2Title: 'Article pool'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      fetchList().then(res => {
        console.log(res, 'res')
        const data = res.data.items
        this.data1 = data.slice(0, 8)
        this.data2 = data.slice(8)
      })
    }
  }
}
</script>

<style>

</style>
