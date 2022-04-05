<template>
  <div class="components-container">
    <aside>
      Markdown is based on <a href="github.com/nhn/tui.editor" target="_blank">tui.editor</a> ，simply wrapped with Vue.
      <a href="github.com/nhn/tui.editor">Documentation</a>
    </aside>
    <div class="editor-container">
      <el-tag class="tag-title">Basic:</el-tag>
      <markdown-editor v-model="content" :height="height" :language="language" />
    </div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'MarkdownDemo',
  components: {
    MarkdownEditor
  },
  data() {
    return {
      content: '![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)\n\n# Awesome Editor!\n\nIt has been _released as opensource in 2018_ and has ~~continually~~ evolved to **receive 10k GitHub ⭐️ Stars**.\n\n## Create Instance\n\nYou can create an instance with the following code and use `getHtml()` and `getMarkdown()` of the [Editor](https://github.com/nhn/tui.editor).\n\n```js\nconst editor = new Editor(options);\n```\n\n> See the table below for default options\n> > More API information can be found in the document\n\n| name | type | description |\n| --- | --- | --- |\n| el | `HTMLElement` | container element |\n\n## Features\n\n* CommonMark + GFM Specifications\n   * Live Preview\n   * Scroll Sync\n   * Auto Indent\n   * Syntax Highlight\n        1. Markdown\n        2. Preview\n\n## Support Wrappers\n\n> * Wrappers\n>    1. [x] React\n>    2. [x] Vue\n>    3. [ ] Ember',
      height: '300px',
      language: 'zh-CN'
    }
  }
}
</script>

<style></style>
