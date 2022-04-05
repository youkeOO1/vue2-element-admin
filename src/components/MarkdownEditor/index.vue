<template>
  <div :id="id" />
</template>

<script>
import '@toast-ui/editor/dist/i18n/zh-cn'
import '@toast-ui/editor/dist/i18n/ja-jp'
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import defaultOptions from './defaul-option'

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default: 'markdown-editor' + +new Date() + ((Math.random() * 1000).toFixed(0))
    },
    options: {
      type: Object,
      required: false,
      default() {
        return {}
      }
    },
    height: {
      type: String,
      default: '300px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh-CN'
    },
    mode: {
      type: String,
      required: false,
      default: 'markdown'
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions() {
      const option = Object.assign({}, defaultOptions, this.options)
      option.initialEditType = this.mode
      option.language = this.language
      option.height = this.height
      return option
    }
  },
  watch: {
    value(newVal) {
      this.setValue(newVal)
    },
    height(newVal) {
      this.editor.setHeight(newVal)
    },
    mode(newVal) {
      this.editor.changeMode(newVal)
    },
    language() {
      this.destroyEditor()
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    init() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        ...this.editorOptions
      })
      if (this.value) {
        this.editor.setMarkdown(this.value, true)
      }
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getMarkdown())
      })
      window.editor = this.editor
    },
    setValue(value) {
      this.editor.setMarkdown(value, true)
    },
    getValue() {
      return this.editor.getMarkdown()
    },
    destroyEditor() {
      this.editor.destroy()
    }
  }
}
</script>

<style>

</style>
