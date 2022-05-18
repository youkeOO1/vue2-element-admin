<template>
  <div class="dndList">
    <div class="dndList-list">
      <h3>{{ data1Title }}</h3>
      <draggable v-model="data1" group="people">
        <div v-for="item in data1" :key="item.id" class="list-complete-item">
          <div class="list-complete-item-handle">
            {{ item.id }}[{{ item.author }}] {{ item.title }}
          </div>
          <div class="list-complete-item-icon">
            <span @click="handleDel(item)">
              <i class="el-icon-delete" />
            </span>
          </div>
        </div>
      </draggable>
    </div>
    <div class="dndList-list">
      <h3>{{ data2Title }}</h3>
      <draggable v-model="data2" group="people">
        <div v-for="item in data2" :key="item.id" class="list-complete-item">
          <div class="list-complete-item-handle" @click="hangdleSwitch(item)">
            {{ item.id }}[{{ item.author }}] {{ item.title }}
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    data1: {
      type: Array,
      default() {
        return []
      }
    },
    data2: {
      type: Array,
      default() {
        return []
      }
    },
    data1Title: {
      type: String,
      default: ''
    },
    data2Title: {
      type: String,
      default: ''
    }
  },
  methods: {
    selectData(arr, data) {
      return arr.every(item => data.id !== item.id)
    },
    handleDel(data) {
      for (const item of this.data1) {
        if (item.id === data.id) {
          const index = this.data1.indexOf(data)
          this.data1.splice(index, 1)
          break
        }
      }
      if (this.selectData(this.data1, data)) {
        this.data2.unshift(data)
      }
    },
    hangdleSwitch(data) {
      for (const item of this.data2) {
        if (item.id === data.id) {
          const index = this.data2.indexOf(data)
          this.data2.splice(index, 1)
          break
        }
      }
      if (this.selectData(this.data2, data)) {
        this.data1.unshift(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dndList {
  width: 100%;
  background: #fff;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-around;
  .dndList-list {
    width: 48%;
    .list-complete-item {
      font-size: 14px;
      padding: 5px 12px;
      cursor: pointer;
      margin-top: 4px;
      position: relative;
      border: 1px solid #bfcbd9;
      .list-complete-item-handle {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 50px;
      }
      .list-complete-item-icon {
        position: absolute;
        right: 0;
        span{
          float: right;
          margin-top: -20px;
          margin-right: 5px;
        }
        .el-icon-delete {
          color: red;
        }
      }
    }
  }
}
</style>
