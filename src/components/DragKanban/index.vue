<template>
  <div class="board-column">
    <div class="board-column-header">{{ headerTitle }}</div>
    <draggable :list="list" v-bind="$attrs" class="board-column-content">
      <div v-for=" item in list" :key="item.id" class="board-item">
        {{ item.name }} {{ item.id }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    headerTitle: {
      type: String,
      default: 'title'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.board-column {
  min-width: 300px;
  min-height: 60px;
  background: #f0f0f0;
  border-radius: 3px;
  .board-column-header {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    border-radius: 3px;
    padding: 0 20px;
  }
  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
  }
  .board-item {
    width: 100%;
    height: 68px;
    text-align: left;
    line-height: 68px;
    background: #fff;
    padding: 5px 10px;
    margin: 5px auto;
  }
}
</style>
