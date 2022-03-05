/**
 * 防抖函数
 * @param { Function } fun 回调函数
 * @param { Number } wait 间隔时间
 * @param { Boolean } immediate 立即执行
 * @returns Function
 * 实现思路
 * 防抖函数返回一个函数，获取当前时间戳
 * 判断是否立即执行
 * 判断计时器是否有值
 *  没有值, 将计时器赋值一个setTimout() 计时器调用 later 函数
 *    later 函数中再次获取现在的时间戳
 *    判断是否达到间隔要求
 *      没有达到要求，将 计时器重新赋值
 *      达到要求
 *        不是立即执行
 *          回调函数。apply(this, args)
 * 立即执行 fun.apply(this, arg)
 */
export function debounce(fun, wait, immediate) {
  let timeout, timestamp, nowRun, context, res, args
  const later = function() {
    const lastTime = +new Date() - timestamp
    if (lastTime < wait && lastTime > 0) {
      timeout = setTimeout(later, lastTime - wait)
    } else {
      timeout = null
      if (!immediate) {
        res = fun.apply(context, args)
        if (!timeout) timeout = context = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    nowRun = immediate && !timeout
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (nowRun) {
      res = fun.apply(context, args)
      timeout = context = null
    }
    return res
  }
}
