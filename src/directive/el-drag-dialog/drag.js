export default {
  bind(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    const getSytle = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()
    dialogHeaderEl.onmousedown = (e) => {
      // 初始位置
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      // 容器的 width and height
      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight
      // 视口的 width and height
      const viewWidth = document.body.clientWidth
      const viewHeight = document.body.clientHeight
      // min and max left
      const minL = dragDom.offsetLeft
      const maxL = viewWidth - dragDom.offsetLeft - dragDomWidth
      // min and max top
      const minT = dragDom.offsetTop
      const maxT = viewHeight - dragDom.offsetTop - dragDomHeight
      // 容器的 left and top
      let styL = getSytle(dragDom, 'left')
      let styT = getSytle(dragDom, 'top')
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
      }
      if (styT.includes('%')) {
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = (e) => {
        let l = e.clientX - disX
        let t = e.clientY - disY

        // 计算偏移距离
        if (-l > minL) {
          l = -minL
        } else if (l > maxL) {
          l = maxL
        }
        if (-t > minT) {
          t = -minT
        } else if (t > maxT) {
          t = maxT
        }
        dragDom.style.cssText = `;left:${l + styL}px;top:${t + styT}px;`

        vnode.child.$emit('dragDialog')
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
