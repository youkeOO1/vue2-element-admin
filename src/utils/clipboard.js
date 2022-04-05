import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Vue.prototype.$message({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500
  })
}
function clipboardError() {
  Vue.prototype.$message({
    message: 'Copy failed',
    type: 'error'
  })
}

/**
 * 剪贴板
 * @param {*} text
 * @param {*} event
 */
export default function handleClipboard(text, event) {
  // 实例 Clipboardjs, 由于第一参数传递的是 e.target, 有时不会触发，初步测试，点击父元素会触发
  // 单击 icon 和 文本 不会触发
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  // 强制触发
  clipboard.onClick(event)
}

