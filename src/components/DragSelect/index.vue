<template>
<!-- 对 el-select 进行二次封装 使用 v-bind 和 v-on 对 el-select 原有配置进行绑定 -->
  <el-select ref="elSelect" v-model="selectVal" v-bind="$attrs" v-on="$listeners">
    <slot />
  </el-select>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    selectVal: {
      get() {
        return [...this.value]
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.sortSelect()
  },
  methods: {
    sortSelect() {
      const el = this.$refs['elSelect'].$el.querySelectorAll('.el-select__tags>span')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        // setData: function(dataTransfer) {
        //   dataTransfer.setData('Text', '')
        // },
        onEnd: (evt) => {
          const targetRow = this.value.splice(evt.oldIndex, 1)[0]
          this.value.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-select {
  ::v-deep {
    .sortable-ghost {
      opacity: .8;
      color: #fff !important;
      background: #42b983 !important;
    }

    .el-tag {
      cursor: pointer;
    }
  }
}
</style>
