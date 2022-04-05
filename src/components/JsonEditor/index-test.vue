<template>
  <div class="json-editor">
    <codemirror ref="cmEditor" :options="cmOption" @changes="handleChanges" />
    <!-- <vue-codemirror :value="JSONValue" :options="cmOption" /> -->
  </div>
</template>

<script>
import 'codemirror/lib/codemirror.css'
// import VueCodemirror from 'vue-codemirror'
import { codemirror } from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
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
  components: {
    codemirror
    // VueCodemirror
  },
  // eslint-disable-next-line array-bracket-spacing
  props: [ 'value' ],
  data() {
    return {
      cmOption: {
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
      }
    }
  },
  computed: {
    jsonEditor() {
      return this.$refs.cmEditor.codemirror
    }
  },
  watch: {
    value(newVal) {
      const editorValue = this.jsonEditor.getValue()
      if (editorValue !== newVal) {
        this.jsonEditor.setValue(JSON.stringify(newVal, null, 2))
      }
      setTimeout(() => {
        this.jsonEditor.refresh()
      }, 1)
    }
  },
  mounted() {
    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
  },
  methods: {
    handleChanges(cm) {
      this.$emit('input', cm.getValue())
    }
  }
}
</script>

<style lang="scss" scoped>
  .json-editor {
    height: 100%;
    ::v-deep {
      .CodeMirror {
        height: auto;
      }
    }
  }
</style>
