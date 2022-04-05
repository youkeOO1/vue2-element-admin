<template>
  <div class="tinymce-container">
    <textarea :id="id" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editor-image @successCBK="handleUploadImg" />
    </div>
  </div>
</template>

<script>
import EditorImage from './components/EditorImage'
import dynamicLoadScript from './dynamicLoadScript'
import plugins from './plugins'
import toolbar from './toolbar'

const cdn = 'https://cdn.tiny.cloud/1/ssa7alk79ujph6z2aptr7md9k25roxax8zih3mpvt4fdgb75/tinymce/5/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: {
    EditorImage
  },
  props: {
    id: {
      type: String,
      default() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    width: {
      type: [String, Number],
      required: false,
      default: 'auto'
    },
    height: {
      type: Number,
      required: false,
      default: 600
    },
    // 富文本内容
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit view insert format tools table help'
    }
  },
  data() {
    return {
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      fullscreen: false,
      hasChange: false,
      hasInit: false
    }
  },
  watch: {
    value(newVal) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => {
        })
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      dynamicLoadScript(cdn, () => {
        this.initTinymce()
      })
    },
    initTinymce() {
      const self = this
      window.tinymce.init({
        selector: `#${this.id}`,
        menubar: this.menubar,
        plugins: plugins,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        height: this.height,
        language: this.languageTypeList['zh'],
        // 功能
        body_class: 'panel-body',
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        init_instance_callback: (editor) => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged ', (e) => {
            self.fullscreen = e.state
          })
        }
      })
    },
    handleUploadImg(arr) {
      arr.forEach(item => {
        window.tinymce.editors[this.id].insertContent(`<img src="${item.url}">`)
      })
    },
    destroyTinymce() {
      window.tinymce.editors[this.id].destroy()
    }
  }
}
</script>

<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    .editor-custom-btn-container {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 200;
    }
  }
</style>
