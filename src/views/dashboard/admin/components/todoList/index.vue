<template>
  <section class="todoapp">
    <!-- 顶部 输入框添加任务 -->
    <header class="header">
      <input type="text" placeholder="todoList" class="new-todo" @keyup.enter="addTodo">
    </header>
    <!-- 主要内容 是否全选， 任务列表 -->
    <main class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked})">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo-vue
          v-for="todo in filteredTodos"
          :key="todo.text"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @deleteTodo="deleteTodo"
          @editTodo="editTodo"
        />
      </ul>
    </main>
    <footer class="footer">
      <span class="todo-count"><strong> {{ remaining }} </strong> {{ remaining | pluralize('item') }} left</span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key} " @click.prevent="visibility = key">
            {{ key | capitalize }}
          </a>
        </li>
      </ul>
    </footer>
  </section>
</template>

<script>
import todoVue from './todo.vue'

const STORAGE_KEY = 'todos'
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}
const defalutList = [
  { text: 'star this repository', done: false },
  { text: 'fork this repository', done: false },
  { text: 'follow author', done: false },
  { text: 'vue-element-admin', done: true },
  { text: 'vue', done: true },
  { text: 'element-ui', done: true },
  { text: 'axios', done: true },
  { text: 'webpack', done: true }
]

export default {
  components: {
    todoVue
  },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1)
  },
  data() {
    return {
      visibility: 'all',
      todos: defalutList,
      filters
    }
  },
  computed: {
    allChecked() {
      return this.todos.every((todo) => todo.done)
    },
    /**
     * 根据显示规则过滤数据
     */
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    /**
     * 任务数量
     */
    remaining() {
      return this.todos.filter((todo) => todo.done).length
    }
  },
  methods: {
    /**
     * 保存到本地
     */
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    /**
     * 添加任务
     */
    addTodo(e) {
      const text = e.target.value
      if (text.trim()) {
        this.todos.push({
          text,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },
    /**
     * 切换任务状态
     */
    toggleTodo(todo) {
      todo.done = !todo.done
      this.setLocalStorage()
    },
    /**
     * 删除任务
     */
    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      this.setLocalStorage()
    },
    /**
     * 修改任务
     */
    editTodo({ todo, value }) {
      todo.text = value
      this.setLocalStorage()
    },
    /**
     * 全选与取消全选
     */
    toggleAll({ done }) {
      this.todos.forEach((todo) => {
        todo.done = done
        this.setLocalStorage()
      })
    }
  }
}
</script>

<style lang="scss" >
  @import './index.scss'
</style>
