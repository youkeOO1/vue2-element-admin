<template>
  <div class="components-container board">
    <drag-kanban :group="group" :list="list1" class="kanban todo" header-title="Todo" />
    <drag-kanban :group="group" :list="list2" class="kanban working" header-title="Working" />
    <drag-kanban :group="group" :list="list3" class="kanban done" header-title="Done" />
  </div>
</template>

<script>
import DragKanban from '@/components/DragKanban'

export default {
  components: {
    DragKanban
  },
  data() {
    return {
      group: 'mission',
      list1: [
        { name: 'Mission', id: 1 },
        { name: 'Mission', id: 2 },
        { name: 'Mission', id: 3 },
        { name: 'Mission', id: 4 }
      ],
      list2: [
        { name: 'Mission', id: 5 },
        { name: 'Mission', id: 6 },
        { name: 'Mission', id: 7 }
      ],
      list3: [
        { name: 'Mission', id: 8 },
        { name: 'Mission', id: 9 },
        { name: 'Mission', id: 10 }
      ]
    }
  }
}
</script>

<style lang="scss" >
.board {
  display: flex;
  width: 1000px;
  justify-content: space-around;
  align-items: flex-start
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>
