<template>
  <li class="todo" :class="{ completed: todo.done, editing: editing}">
    <div class="view">
      <input :checked="todo.done" class="toggle" type="checkbox" @change="toggleTodo(todo)">
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input
      v-focus="editing"
      type="text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="canceEdit"
      @blur="doneEdit"
    >
  </li>
</template>

<script>
export default {
  /**
   * 用户第一个双击内容，很有可能是为啦修改内容，故将修改框内容为空，
   * 当误触失去焦点事件且内容为空，不能将删除，而是放弃修改
   * 只有将内容删除才能提交删除任务事件
   */
  directives: {
    // 自定义指令，输入框聚焦
    // 使用的钩子函数为 updata 监听 value 值的变化触发
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },
  props: {
    todo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      editing: false
    }
  },
  methods: {
    /**
     * 切换任务状态
     */
    toggleTodo(todo) {
      this.$emit('toggleTodo', todo)
    },
    /**
     * 删除任务
     */
    deleteTodo(todo) {
      this.$emit('deleteTodo', todo)
    },
    /**
     * 提交任务
     */
    editTodo({ todo, value }) {
      this.$emit('editTodo', { todo, value })
    },
    /**
     * 完成编辑
     */
    doneEdit(e) {
      const value = e.target.value.trim()
      const { todo } = this
      if (!value) {
        // 当为空值，将该任务删除
        this.deleteTodo(todo)
      } else {
        // 不为空值，将数据传递给父组件
        this.editTodo({ todo, value })
        this.editing = false
      }
    },
    /**
     * 取消编辑
     */
    canceEdit(e) {
      e.target.value = this.todo.text
      this.editing = false
    }
  }
}
</script>

<style>

</style>
