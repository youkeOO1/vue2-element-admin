// 可继续遍历的数据类型
const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const argsTag = '[object Arguments]'
// 不可继续遍历的数据结构
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const numberTag = '[object Number]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const errorTag = '[object Error]'
const regexpTag = '[object RegExp]'
const funcTag = '[object Function]'

/**
 * 深度克隆
 * map
 * set
 * array
 * object
 * Arguments
 */
const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag]

/**
 *  工具函数-通用while循环
 * @param {*} array
 * @param {*} iteratee
 * @returns
 */
function forEach(array, iteratee) {
  let index = -1
  const length = array.length
  while (++index < length) {
    iteratee(array[index], index)
  }
  return array
}
/**
 * 工具函数-判断是否为引用值
 * @param {*} target
 * @returns
 */
function isObject(target) {
  const type = typeof target
  return target !== null && (type === 'object' || type === 'function')
}
/**
 * 工具函数-获取实际类型
 *
 * @param {*} target
 * @returns
 */
function getType(target) {
  return Object.prototype.toString.call(target)
}
/**
 *  工具函数-初始化被克隆的对象
 *  创建一个深度类型的容器,通过 constructor 创建一个新的数据容器
 * @param {*} target
 * @returns
 */
function getInit(target) {
  const Ctor = target.constructor
  return new Ctor()
  // 等效于
  // let array = []
  // let Array = array.constructor
  // return new Array()
}
/**
 * 工具函数-克隆symbol
 * @param {*} targe
 * @returns
 */
function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe))
}
/**
 * 工具函数-克隆正则
 * @param {*} targe
 * @returns
 */
function cloneReg(targe) {
  const reFlags = /\w*$/
  const result = new targe.constructor(targe.source, reFlags.exec(targe))
  result.lastIndex = targe.lastIndex
  return result
}
/**
 * 工具函数-克隆函数
 * @param {*} func
 * @returns
 */
function cloneFunction(func) {
  // "function (a, b) {
  //   return a + b;
  // }"
  const bodyReg = /(?<={)(.|\r\n)+(?=})/m // 正则有问题，无法匹配到函数体
  const paramReg = /(?<=\().+(?=\)\s+{)/ // () {
  const funcString = func.toString()
  if (func.prototype) {
    // 普通函数，箭头函数没有原型
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) {
      if (param) {
        const paramArr = param[0].split(',')
        return new Function(...paramArr, body[0])
      } else {
        return new Function(body[0])
      }
    } else {
      return null
    }
  } else {
    // 箭头函数
    // eslint-disable-next-line no-eval
    return eval(funcString)
  }
}
/**
 * 工具函数-克隆不可遍历类型
 * boolean
 * number
 * string
 * error
 * date
 * regexp
 * symbol
 * function
 * null
 *
 * @param {*} targe
 * @param {*} type
 * @returns
 */
function cloneOtherType(targe, type) {
  const Ctor = targe.constructor
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      // 克隆 Date 类型数据
      return new Ctor(targe)
    case regexpTag:
      return cloneReg(targe)
    case symbolTag:
      return cloneSymbol(targe)
    case funcTag:
      return cloneFunction(targe)
    default:
      return null
  }
}

/**
 * clone 主函数
 * @param {*} target
 * @param {*} map
 * @returns
 */
export function deepClone(target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    // 原始类型直接返回
    return target
  }

  // 初始化 根据不同的数据类型进行操作
  const type = getType(target)
  let cloneTarget
  if (deepTag.includes(type)) {
    // 克隆引用值
    cloneTarget = getInit(target, type)
  } else {
    return cloneOtherType(target, type)
  }

  // 防止循环引用 处理循环引用
  if (map.get(target)) {
    return map.get(target)
  }
  map.set(target, cloneTarget)

  // 克隆set
  if (type === setTag) {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value, map))
    })
    return cloneTarget
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map))
    })
    return cloneTarget
  }

  // 克隆对象和数组
  const keys = type === arrayTag ? undefined : Object.keys(target)
  // 当 clone 的类型为 array keys = undefined
  // 当 clone 的类型为 object keys = object.keys()
  forEach(keys || target, (value, key) => {
    if (keys) {
      // 当为对象的时候 froEach() 传递过去的是 keys
      // keys 是个数组 value = 对象的key key = keys的索引
      key = value
    }
    cloneTarget[key] = deepClone(target[key], map)
  })

  return cloneTarget
}
