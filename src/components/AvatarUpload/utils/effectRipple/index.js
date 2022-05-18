import './waves.css'

export default function effectRipple(e, option) {
  const opts = Object.assign(
    {
      ele: e.target,
      type: 'hit',
      bgc: 'rgba(0, 0, 0, 0.15)'
    },
    option
  )
  const target = opts.ele
  if (target) {
    target.style.position = 'relative'
    target.style.overflow = 'hidden'
    const rect = target.getBoundingClientRect()
    let ripple = document.querySelector('.waves-ripple')
    if (!ripple) {
      // 新建元素
      ripple = document.createElement('span')
      ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px'
      target.appendChild(ripple)
    }
    ripple.className = 'waves-ripple'
    switch (opts.type) {
      case 'center':
        ripple.style.top = rect.height / 2 - ripple.offsetHeight / 2 + 'px'
        ripple.style.left = rect.width / 2 - ripple.offsetWidht / 2 + 'px'
        break
      default:
        ripple.style.top =
          (e.pageY -
            rect.top -
            ripple.offsetHeight / 2 -
            document.documentElement.scrollTop || document.body.scrollTop
          ) + 'px'
        ripple.style.left =
          (e.pageX -
            rect.left -
            ripple.offsetWidht / 2 -
            document.documentElement.scrollLeft || document.body.scrollLeft
          ) + 'px'
    }
    ripple.style.backgroundColor = opts.bgc
    ripple.classList.add('z-active')
    return false
  }
}
