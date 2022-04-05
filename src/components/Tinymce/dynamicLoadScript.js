let callbacks = []

function loadedTinymce() {
  return window.tinymce
}
/**
 * 动态加载js
 * @param {*} src
 * @param {*} callback
 */
export default function dynamicLoadScript(src, callback) {
  const isElement = document.getElementById(src)
  const cd = callback || function() {}
  // 获取不到元素，创建 script 元素
  if (!isElement) {
    const script = document.createElement('script')
    script.src = src
    script.id = src
    document.body.appendChild(script)
    callbacks.push(cd)
    const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd
    onEnd(script)
  }
  // 获取到元素
  if (isElement && cd) {
    if (loadedTinymce()) {
      cd(null, isElement)
    } else {
      callbacks.push(cd)
    }
  }
  // 浏览器支持 onload 事件
  function stdOnEnd(script) {
    script.onload = function() {
      // 动态加载的js 的 onload 事件会在 window.onload 事件前触发
      this.onload = this.onerror = null
      for (const item of callbacks) {
        item(null, script)
      }
      callbacks = null
    }
    script.onerror = function() {
      this.onload = this.onerror = null
      cd(new Error(new Error('Failed to load ' + src)), script)
    }
  }
  // ie 不支持 onload 事件
  function ieOnEnd(script) {
    script.onreadystatechange = function() {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      for (const item of callbacks) {
        item(null, script)
      }
      callbacks = null
    }
  }
}
