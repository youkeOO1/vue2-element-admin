<template>
  <!-- 富文本，富文本的图片上传 -->
  <div class="tinymce-container">
    <editor
      id="uuid"
      api-key="ssa7alk79ujph6z2aptr7md9k25roxax8zih3mpvt4fdgb75"
      :init="init"
    />
    <div class="editor-custom-btn-container">
      <!-- 本地图片上传 -->
      <editor-image />
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import EditorImage from './components/EditorImage'
import toolbar from './toolbar'
import plugins from './plugins'
import dynamicLoadScript from './dynamicLoadScript'

const cdn = 'https://cdn.tiny.cloud/1/ssa7alk79ujph6z2aptr7md9k25roxax8zih3mpvt4fdgb75/tinymce/5/tinymce.min.js'

export default {
  components: {
    Editor,
    EditorImage
  },
  props: {
    width: {
      type: [String, Number],
      required: false,
      default: 'auto'
    },
    height: {
      type: [String, Number],
      required: false,
      default: '600px'
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
      init: {},
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      },
      content: ''
    }
  },
  mounted() {
    // dynamicLoadScript(cdn, () => {
    //   this.tinymceInit()
    // })
    // tinymce.init({})
    this.tinymceInit()
    // tinymce.init({})
  },
  methods: {
    tinymceInit() {
      this.init = {
        language: this.languageTypeList['zh'],
        // 基本配置：菜单栏，工具栏，插件
        // 菜单栏 最上面
        menubar: this.menubar,
        // 工具栏配置
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        // 插件栏
        plugins: plugins,
        // 界面配置
        height: this.height,
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
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.$emit('input', editor.getContent())
          })
        }
      }
    },
    test() {
      console.log('test')
    }
  }
}
</script>

<style>
</style>
