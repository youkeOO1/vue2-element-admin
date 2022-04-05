<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// 代码高亮
import 'codemirror/mode/javascript/javascript.js'
// 主题
import 'codemirror/theme/mbo.css'
// 代码错误检查
require('script-loader!jsonlint')
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
// 括号，引号编辑和删除时成对出现
import 'codemirror/addon/edit/closebrackets'
// 折叠代码要用到一些玩意
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/comment-fold.js'

export default {
  name: 'JsonEditor',
  // eslint-disable-next-line array-bracket-spacing
  props: [ 'value'],
  data() {
    return {
      jsonEditor: null
    }
  },
  watch: {
    value(newVal) {
      const editorValue = this.jsonEditor.getValue()
      if (newVal !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(newVal, null, 2))
      }
      setTimeout(() => {
        this.jsonEditor.refresh()
      })
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'application/json',
      lint: true,
      tabSize: 2,
      lineNumbers: true, // 行号
      smartIndent: true, // 是否智能缩进
      styleActiveLine: true, // 当前行高亮
      theme: 'mbo',
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      lineWrapping: true, // 自动换行
      matchBrackets: true, // 括号匹配显示
      autoCloseBrackets: true, // 输入和退格时成对
      foldGutter: true // 折叠代码
    })
    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('changes', (cm) => {
      this.$emit('input', cm.getValue())
    })
  }
}
</script>

<style>

</style>
