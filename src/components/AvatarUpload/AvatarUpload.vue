<template>
  <div v-show="value" class="vue-image-crop-upload">
    <!-- 包容器 -->
    <div class="vicp-wrap">
      <!--关闭 -->
      <div class="vicp-close" @click="off">
        <i class="vicp-icon4" />
      </div>
      <!-- 选择文件 step:1 -->
      <div v-show="step === 1" class="vicp-step1">
        <!-- 选择文件 + 拖拽上传 -->
        <div class="vicp-drop-area" @click="handelClick">
          <i v-show="loading != 1" class="vicp-icon1">
            <i class="vicp-icon1-arrow" />
            <i class="vicp-icon1-body" />
            <i class="vicp-icon1-bottom" />
          </i>
          <!-- 提示文字 -->
          <span v-show="loading != 1" class="vicp-hint"> {{ lang.hint }}</span>
          <!-- 是否支持组件 -->
          <span v-show="noSupported" class="vicp-no-supported-hint">{{ lang.noSupported }}</span>
          <input v-show="false" v-if="step == 1" ref="fileinput" type="file" @change="handleChange">
        </div>
        <!-- 显示错误 -->
        <div v-show="hasError" class="vicp-error">
          <i class="vicp-icon2" />
          {{ errMessage }}
        </div>
        <div class="vicp-operate">
          <a @click="off" @mousedown="ripple">{{ lang.btn.off }}</a>
        </div>
      </div>
      <!-- 操作图片 step: 2 -->
      <div v-if="step === 2" class="vicp-step2">
        <div class="vicp-crop">
          <div class="vicp-crop-left">
            <div class="vicp-img-container">
              <img
                :src="sourceImgUrl"
                :style="sourceImgStyle"
                class="vicp-img"
                @mousedown="startImgMove"
                @mousemove="imgMove"
                @mouseup="createImg"
                @mouseout="createImg"
              >
              <div :style="sourceImgShadeStyle" class="vicp-img-shade vicp-img-shade-1" />
              <div :style="sourceImgShadeStyle" class="vicp-img-shade vicp-img-shade-2" />
            </div>
            <div class="vicp-range">
              <input v-model="sourceImgData.scale" type="range" step="1" min="1" max="100" @input="changeScale">
              <i class="vicp-icon5" @mousedown="startScaleSub" @mouseup="endScaleSub" @mouseout="endScaleSub" />
              <i class="vicp-icon6" @mousedown="startScaleAdd" @mouseup="endScaleAdd" @mouseout="endScaleAdd" />
            </div>
            <div class="vicp-rotate">
              <i @mousedown="startRotateLeft" @mouseup="endRotate" @mouseout="endRotate">↺</i>
              <i @mousedown="startRotateRight" @mouseup="endRotate" @mouseout="endRotate">↻</i>
            </div>
          </div>
          <div class="vicp-crop-right">
            <div class="vicp-preview">
              <div class="vicp-preview-item">
                <img :src="createImgUrl" style="width: 100px; height: 100px">
                <span>{{ lang.preview }}</span>
              </div>
              <div class="vicp-preview-item vicp-preview-item-circle">
                <img :src="createImgUrl" style="width: 100px; height: 100px">
                <span>{{ lang.preview }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="vicp-operate">
          <a @click="setStep(1)" @mousedown="ripple"> {{ lang.btn.back }}</a>
          <a @click="beforUpload" @mousedown="ripple"> {{ lang.btn.save }}</a>
        </div>
      </div>
      <!-- 上传图片：setp: 3 -->
      <div v-if="step === 3" class="vicp-step3">
        <div class="vicp-upload">
          <span v-show="loading == 1" class="vicp-loading"> {{ lang.loading }}</span>
          <!-- 进度条 -->
          <div v-show="loading == 1" class="vicp-progress-wrap">
            <span class="vicp-progress" />
          </div>
          <!-- 成功展示的信息 -->
          <div v-show="loading == 2" class="vicp-success">
            <i class="vicp-icon3" />
            {{ lang.success }}
          </div>
          <!-- 失败展示的信息 -->
          <div v-show="loading == 3" class="vicp-error">
            <i class="vicp-icon2" />
            {{ lang.fail }}
          </div>
        </div>
        <div class="vicp-operate">
          <a @click="setStep(2)" @mousedown="ripple"> {{ lang.btn.off }}</a>
        </div>
      </div>
      <canvas v-show="false" ref="canvas" />
    </div>
  </div>
</template>

<script>
import language from './language'
import mimes from './mimes'
import bese64ChangeBlod from './utils/bese64ChangeBlob'
import effectRiple from './utils/effectRipple/index'
import request from '@/utils/request'

export default {
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    kid: {
      type: String,
      default() {
        return '' + (+new Date() + Number.parseInt(Math.random() * 1000))
      }
    },
    upFileName: {
      type: String,
      default: 'avatar'
    },
    url: {
      type: String,
      default: 'https://httpbin.org/post'
    },
    value: {
      type: Boolean,
      default: true
    },
    imgType: {
      type: String,
      default: 'jpg'
    },
    langType: {
      type: String,
      default: 'zh'
    },
    maxSize: {
      type: Number,
      default: 10240
    },
    // canvas 的 width
    width: {
      type: Number,
      default: 200
    },
    // canvas 的 height
    height: {
      type: Number,
      default: 200
    }
  },
  data() {
    const lang = language[this.langType] ? language[this.langType] : language['en']
    const templateMime = ['jpg', 'png']
    const mime = templateMime.indexOf(this.imgType) === -1 ? mimes['png'] : mimes[this.imgType]
    return {
      // 1选择文件 2剪裁 3上传
      step: 1,
      // 0未开始 1正在 2成功 3错误
      loading: 0,
      // 进度条
      progress: 0,
      ratio: this.width / this.height,
      lang,
      noSupported: false,
      hasError: false,
      errMessage: '',
      // 支持的图片类型
      mime,
      sourceImgUrl: '',
      sourceImg: '',
      createImgUrl: '',
      // 图片展示的属性
      sourceImgData: {
        // 角度
        degree: 0,
        isRotateOn: false,
        // 缩放
        scale: 0,
        isScaleAddOn: false,
        isScaleSubOn: false,
        width: 0,
        height: 0,
        natWidth: 0,
        natHeight: 0,
        minWidht: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        x: 0,
        y: 0
      },
      sourceImgContainer: {
        width: 240,
        height: 184
      },
      sourceImgMove: {
        isMoveOn: false,
        // 移动时的坐标
        sX: 0,
        sY: 0,
        // 图片的偏移
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    /**
     * 视口的宽度与高度
     * 视口 与 canvas 的比例
     */
    sourceImgMasking() {
      const { sourceImgContainer } = this
      const sRation = sourceImgContainer.width / sourceImgContainer.height
      let width = sourceImgContainer.width
      let height = sourceImgContainer.height
      let x = 0
      let y = 0
      let ratio = 0
      if (this.ratio < sRation) {
        // width 大于 height
        ratio = height / this.height // 视口与 canvas 的比例
        width = height // 让视口成为正方形
        x = (sourceImgContainer.width - width) / 2 // 遮罩层的宽度
      }
      if (this.ratio > sRation) {
        ratio = width / this.width
        height = width
        y = (sourceImgContainer.height - height) / 2
      }
      return {
        ratio,
        width,
        height,
        x,
        y
      }
    },
    /**
     * 图片样式
     */
    sourceImgStyle() {
      const { sourceImgData, sourceImgMasking } = this
      const sim = sourceImgMasking
      const sid = sourceImgData
      return {
        width: sid.width + 'px',
        height: sid.height + 'px',
        left: sid.x + sim.x + 'px',
        top: sid.y + sim.y + 'px',
        transform: `rotate(${sid.degree}deg)`
      }
    },
    /**
     * 遮罩层样式
     */
    sourceImgShadeStyle() {
      const { sourceImgMasking, sourceImgContainer } = this
      return {
        width: (sourceImgContainer.width - sourceImgMasking.width) / 2 + 'px',
        height: sourceImgContainer.height + 'px'
      }
    },
    /**
     * 进度条样式
     */
    progressStyle() {
      const { progress } = this
      return {
        width: progress + '%'
      }
    }
  },
  created() {
    document.addEventListener('keyup', this.closeHandler)
  },
  destroyed() {
    document.removeEventListener('keyup', this.closeHandler)
  },
  methods: {
    /**
     * 点击水波纹效果
     */
    ripple(e) {
      e.preventDefault()
      effectRiple(e)
    },
    /**
     * 关闭事件
     */
    closeHandler(e) {
      // key: "Escape" keyCode: 27
      if (this.value && (e.key === 'Escape' || e.keyCode === 27)) {
        this.off()
      }
    },
    /**
     * 触发选择文件事件
     */
    handelClick() {
      this.$refs.fileinput.click()
    },
    /**
     * 选择文件
     */
    handleChange(e) {
      e.preventDefault()
      if (this.loading !== 1) {
        this.reset()
        // 不在上传文件
        const files = e.target.files
        if (this.changeFile(files[0])) {
          this.setSourceImg(files[0])
        }
      }
    },
    /**
     * 缩放事件
     */
    changeScale(e) {
      e.preventDefault()
      const { sourceImgData } = this
      sourceImgData.isScaleAddOn = false
      sourceImgData.isScaleSubOn = false
      this.imgScale(sourceImgData.scale)
    },
    startScaleSub(e) {
      e.preventDefault()
      const { sourceImgData } = this
      sourceImgData.isScaleSubOn = true
      const scale = () => {
        if (sourceImgData.isScaleSubOn) {
          sourceImgData.scale = sourceImgData.scale <= 0 ? 0 : --sourceImgData.scale
          this.imgScale(sourceImgData.scale)
          setTimeout(() => {
            scale()
          }, 60)
        }
      }
      scale()
    },
    endScaleSub(e) {
      e.preventDefault()
      this.sourceImgData.isScaleSubOn = false
    },
    startScaleAdd(e) {
      e.preventDefault()
      const { sourceImgData } = this
      sourceImgData.isScaleAddOn = true
      const scale = () => {
        if (sourceImgData.isScaleAddOn) {
          sourceImgData.scale = sourceImgData.scale >= 100 ? 100 : ++sourceImgData.scale
          this.imgScale(sourceImgData.scale)
          setTimeout(() => {
            scale()
          }, 60)
        }
      }
      scale()
    },
    endScaleAdd(e) {
      e.preventDefault()
      this.sourceImgData.isScaleAddOn = false
    },
    /**
     * 旋转事件
     */
    startRotateRight(e) {
      e.preventDefault()
      const { sourceImgData } = this
      sourceImgData.isRotateOn = true
      const rotate = () => {
        if (sourceImgData.isRotateOn) {
          sourceImgData.degree += 1
          this.createImg()
          setTimeout(() => {
            rotate()
          }, 60)
        }
      }
      rotate()
    },
    startRotateLeft(e) {
      e.preventDefault()
      const { sourceImgData } = this
      sourceImgData.isRotate = true
      const rotate = () => {
        if (sourceImgData.isRotateOn) {
          sourceImgData.degree -= 1
          this.createImg()
          setTimeout(() => {
            rotate()
          }, 60)
        }
      }
      rotate()
    },
    endRotate(e) {
      e.preventDefault()
      this.sourceImgData.isRotateOn = false
    },
    /**
     * 检查文件
     */
    changeFile(file) {
      // 判断是否为文件
      if (file.type.indexOf('image') === -1) {
        // 不是图片
        this.hasError = true
        this.errMessage = this.lang.error.onlyImg
        return false
      }
      if (file.size / 1024 > this.maxSize) {
        // 单文件大小太大
        this.hasError = true
        this.errMessage = this.lang.error.outOfSize
        return false
      }
      return true
    },
    /**
     * 图片操作
     */
    /**
     * 读取图片
     */
    setSourceImg(file) {
      const fileReader = new FileReader()
      fileReader.onload = (event) => {
        const result = event.target.result
        this.startCrop(result)
      }
      fileReader.readAsDataURL(file)
    },
    /**
     * 获取图片信息
     */
    startCrop(url) {
      const { sourceImgData, sourceImgMasking } = this
      const sid = sourceImgData
      const sim = sourceImgMasking
      // const sic = sourceImgContainer
      const img = new Image()
      img.src = url
      img.onload = (e) => {
        const natRatio = img.width / img.height
        let width = sim.width
        let height = sim.height
        let x = 0
        let y = 0
        if (this.ratio < natRatio) {
          // width 大于 height
          width = height * natRatio
          x = (sim.width - width) / 2 // 图片偏移值
        }
        if (this.ratio > natRatio) {
          height = width * natRatio
          y = (sim.height - height) / 2
        }
        this.sourceImg = img
        this.sourceImgUrl = url
        sid.width = width
        sid.height = height
        sid.minWidht = width
        sid.minHeight = height
        sid.maxWidth = img.width * sim.ratio
        sid.maxHeight = img.height * sim.ratio
        sid.x = x
        sid.y = y
        sid.natWidth = img.width
        sid.natHeight = img.height
        // 重置图片展示属性
        sid.degree = 0
        sid.isRotateOn = false
        sid.scale = 0
        sid.isScaleAddOn = false
        sid.isScaleSubOn = false
        this.setStep(2)
        this.createImg()
      }
    },
    /**
     * 图片移动事件
     */
    startImgMove(e) {
      e.preventDefault()
      const { sourceImgMove, sourceImgData } = this
      sourceImgMove.sX = e.screenX
      sourceImgMove.sY = e.screenY
      sourceImgMove.x = sourceImgData.x
      sourceImgMove.y = sourceImgData.y
      this.sourceImgMove.isMoveOn = true
    },
    imgMove(e) {
      e.preventDefault()
      const { sourceImgMove: { sX, sY, x, y, isMoveOn }, sourceImgData, sourceImgMasking } = this
      const sid = sourceImgData
      const sim = sourceImgMasking
      const mX = e.screenX
      const mY = e.screenY
      const dX = mX - sX
      const dY = mY - sY
      let nx = x + dX
      let ny = y + dY
      if (!isMoveOn) return
      if (nx > 0) {
        nx = 0
      }
      if (ny > 0) {
        ny = 0
      }
      if (nx < sim.width - sid.width) {
        nx = sim.width - sid.width
      }
      if (ny < sim.height - sid.height) {
        ny = sim.height - sid.height
      }
      sid.x = nx
      sid.y = ny
    },
    preventDefault(e) {
      e.preventDefault()
    },

    /**
     * 图片缩放
     */
    imgScale(scale) {
      const {
        sourceImgData: { width, height, minWidht, minHeight, maxWidth, maxHeight, x, y },
        sourceImgMasking
      } = this
      const newWidth = minWidht + (maxWidth - minWidht) * (scale / 100)
      const newHeight = minHeight + (maxHeight - minHeight) * (scale / 100)
      //
      const mWidht = sourceImgMasking.width
      const mHeight = sourceImgMasking.height
      // 计算偏移值
      let newX = mWidht / 2 - (newWidth / width) * (mWidht / 2 - x)
      let newY = mHeight / 2 - (newHeight / height) * (minHeight / 2 - y)
      if (newX > 0) {
        newX = 0
      }
      if (newY > 0) {
        newY = 0
      }
      if (newX < mWidht - newWidth) {
        newX = mWidht - newWidth
      }
      if (newY < mHeight - newHeight) {
        newY = mHeight - newHeight
      }
      this.sourceImgData.width = newWidth
      this.sourceImgData.height = newHeight
      this.sourceImgData.x = newX
      this.sourceImgData.y = newY
      setTimeout(() => {
        if (this.sourceImgData.scale === scale) {
          this.createImg()
        }
      }, 300)
    },
    /**
     * 创建图片
     */
    createImg() {
      // 通过 canvas 实现 裁剪图片
      const {
        width,
        height,
        sourceImg,
        sourceImgData,
        sourceImgMasking: { ratio }
      } = this
      this.sourceImgMove.isMoveOn = false
      const canvas = this.$refs.canvas
      const sid = sourceImgData
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, width, height)
      // 旋转
      // 设置旋转中心
      ctx.translate(width / 2, height / 2)
      ctx.rotate(sid.degree * Math.PI / 180)
      ctx.translate(-width / 2, -height / 2)
      // 绘制图片
      // dx:image的左上角在目标canvas上 X 轴坐标
      // dy: image的左上角在目标canvas上 Y 轴坐标
      // dWidth: image在目标canvas上绘制的宽度。 允许对绘制的image进行缩放
      // dHeight: image在目标canvas上绘制的高度。 允许对绘制的image进行缩放
      const dx = sid.x / ratio
      const dy = sid.y / ratio
      const dWidth = sid.width / ratio
      const dHeight = sid.height / ratio
      ctx.drawImage(sourceImg, dx, dy, dWidth, dHeight)
      this.createImgUrl = canvas.toDataURL(this.mime)
    },
    // 上传
    /**
     * 上传之前
     */
    beforUpload() {
      // 检测 url 是否存在
      const { url, kid, upFileName, createImgUrl } = this
      if (typeof url === 'string' && url) {
        this.$emit('beforUpload', createImgUrl, kid, upFileName)
        this.upload()
      } else {
        this.off()
      }
    },
    /**
     * 上传
     */
    upload() {
      // 将 beta64 编码 转化为二进制
      const { createImgUrl, url, kid, upFileName, imgType, mime, params } = this
      const formData = new FormData()
      // 添加图片数据
      formData.append('', bese64ChangeBlod(createImgUrl, mime), upFileName + '.' + imgType)
      // 添加参数
      if (typeof params === 'object' && params) {
        // 存在参数
        Object.keys(params).forEach((key) => {
          formData.append(key, params[key])
        })
      }
      this.reset()
      this.loading = 1
      this.setStep(3)
      request({
        url,
        data: formData,
        method: 'POST'
      }).then((res) => {
        this.$emit('success', res)
        this.loading = 2
      }).catch((err) => {
        this.$emit('error', err, upFileName, kid)
        this.hasError = true
        this.errMessage = err
        this.loading = 3
      })
    },
    // 控制
    /**
     * 重置
     */
    reset() {
      this.hasError = false
      this.errMessage = ''
      this.loading = 0
      this.progress = 0
    },
    /**
     * 关闭
     */
    off() {
      setTimeout(() => {
        this.$emit('close')
        // 当 setp 处于上传阶段， 或者 loading 已经成功或者失败时关闭时重置
        if (this.step === 3 && (this.loading === 2 || this.loading === 3)) {
          this.reset()
          this.setStep(1)
        }
      }, 200)
    },
    /**
     * 设置步骤
     */
    setStep(num) {
      setTimeout(() => {
        this.step = num
      }, 200)
    }
  }
}
</script>

<style lang="scss">
@charset "UTF-8";
@-webkit-keyframes vicp_progress {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 40px;
  }
}
@keyframes vicp_progress {
  0% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 40px;
  }
}
@-webkit-keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
@keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
.vue-image-crop-upload {
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
}
.vue-image-crop-upload .vicp-wrap {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 600px;
  height: 330px;
  padding: 25px;
  background-color: #fff;
  border-radius: 2px;
  -webkit-animation: vicp 0.12s ease-in;
  animation: vicp 0.12s ease-in;
}
.vue-image-crop-upload .vicp-wrap .vicp-close {
  position: absolute;
  right: -30px;
  top: -30px;
}
.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4 {
  position: relative;
  display: block;
  width: 30px;
  height: 30px;
  cursor: pointer;
  -webkit-transition: -webkit-transform 0.18s;
  transition: -webkit-transform 0.18s;
  transition: transform 0.18s;
  transition: transform 0.18s, -webkit-transform 0.18s;
  -webkit-transform: rotate(0);
  -ms-transform: rotate(0);
  transform: rotate(0);
}
.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::after,
.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::before {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  content: '';
  position: absolute;
  top: 12px;
  left: 4px;
  width: 20px;
  height: 3px;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  background-color: #fff;
}
.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::after {
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4:hover {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area {
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 35px;
  height: 170px;
  background-color: rgba(0, 0, 0, 0.03);
  text-align: center;
  border: 1px dashed rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 {
  display: block;
  margin: 0 auto 6px;
  width: 42px;
  height: 42px;
  overflow: hidden;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-arrow {
  display: block;
  margin: 0 auto;
  width: 0;
  height: 0;
  border-bottom: 14.7px solid rgba(0, 0, 0, 0.3);
  border-left: 14.7px solid transparent;
  border-right: 14.7px solid transparent;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-body {
  display: block;
  width: 12.6px;
  height: 14.7px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.3);
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-icon1 .vicp-icon1-bottom {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: block;
  height: 12.6px;
  border: 6px solid rgba(0, 0, 0, 0.3);
  border-top: none;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-hint {
  display: block;
  padding: 15px;
  font-size: 14px;
  color: #666;
  line-height: 30px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area .vicp-no-supported-hint {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  padding: 30px;
  width: 100%;
  height: 60px;
  line-height: 30px;
  background-color: #eee;
  text-align: center;
  color: #666;
  font-size: 14px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step1 .vicp-drop-area:hover {
  cursor: pointer;
  border-color: rgba(0, 0, 0, 0.1);
  background-color: rgba(0, 0, 0, 0.05);
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop {
  overflow: hidden;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left {
  float: left;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-img-container {
  position: relative;
  display: block;
  width: 240px;
  height: 180px;
  background-color: #e5e5e0;
  overflow: hidden;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-img-container
  .vicp-img {
  position: absolute;
  display: block;
  cursor: move;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-img-container
  .vicp-img-shade {
  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  position: absolute;
  background-color: rgba(241, 242, 243, 0.8);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-img-container
  .vicp-img-shade.vicp-img-shade-1 {
  top: 0;
  left: 0;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-img-container
  .vicp-img-shade.vicp-img-shade-2 {
  bottom: 0;
  right: 0;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate {
  position: relative;
  width: 240px;
  height: 18px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.08);
  color: #fff;
  overflow: hidden;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i:hover {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.14);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-rotate
  i:first-child {
  float: left;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-rotate i:last-child {
  float: right;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range {
  position: relative;
  margin: 30px 0 10px 0;
  width: 240px;
  height: 18px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5,
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6 {
  position: absolute;
  top: 0;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.08);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  .vicp-icon5:hover,
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  .vicp-icon6:hover {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.14);
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon5 {
  left: 0;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  .vicp-icon5::before {
  position: absolute;
  content: '';
  display: block;
  left: 3px;
  top: 8px;
  width: 12px;
  height: 2px;
  background-color: #fff;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range .vicp-icon6 {
  right: 0;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  .vicp-icon6::before {
  position: absolute;
  content: '';
  display: block;
  left: 3px;
  top: 8px;
  width: 12px;
  height: 2px;
  background-color: #fff;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  .vicp-icon6::after {
  position: absolute;
  content: '';
  display: block;
  top: 3px;
  left: 8px;
  width: 2px;
  height: 12px;
  background-color: #fff;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range'] {
  display: block;
  padding-top: 5px;
  margin: 0 auto;
  width: 180px;
  height: 8px;
  vertical-align: top;
  background: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  /* 滑块
               ---------------------------------------------------------------*/
  /* 轨道
               ---------------------------------------------------------------*/
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:focus {
  outline: none;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-webkit-slider-thumb {
  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  -webkit-appearance: none;
  appearance: none;
  margin-top: -3px;
  width: 12px;
  height: 12px;
  background-color: #61c091;
  border-radius: 100%;
  border: none;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-moz-range-thumb {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  -moz-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background-color: #61c091;
  border-radius: 100%;
  border: none;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-ms-thumb {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
  appearance: none;
  width: 12px;
  height: 12px;
  background-color: #61c091;
  border: none;
  border-radius: 100%;
  -webkit-transition: 0.2s;
  transition: 0.2s;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:active::-moz-range-thumb {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  width: 14px;
  height: 14px;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:active::-ms-thumb {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  width: 14px;
  height: 14px;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:active::-webkit-slider-thumb {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  margin-top: -4px;
  width: 14px;
  height: 14px;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-webkit-slider-runnable-track {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 6px;
  cursor: pointer;
  border-radius: 2px;
  border: none;
  background-color: rgba(68, 170, 119, 0.3);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-moz-range-track {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  width: 100%;
  height: 6px;
  cursor: pointer;
  border-radius: 2px;
  border: none;
  background-color: rgba(68, 170, 119, 0.3);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-ms-track {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
  height: 6px;
  border-radius: 2px;
  border: none;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-ms-fill-lower {
  background-color: rgba(68, 170, 119, 0.3);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']::-ms-fill-upper {
  background-color: rgba(68, 170, 119, 0.15);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:focus::-webkit-slider-runnable-track {
  background-color: rgba(68, 170, 119, 0.5);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:focus::-moz-range-track {
  background-color: rgba(68, 170, 119, 0.5);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:focus::-ms-fill-lower {
  background-color: rgba(68, 170, 119, 0.45);
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-left
  .vicp-range
  input[type='range']:focus::-ms-fill-upper {
  background-color: rgba(68, 170, 119, 0.25);
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right {
  float: right;
}
.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right .vicp-preview {
  height: 150px;
  overflow: hidden;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item {
  position: relative;
  padding: 5px;
  width: 100px;
  height: 100px;
  float: left;
  margin-right: 16px;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item
  span {
  position: absolute;
  bottom: -30px;
  width: 100%;
  font-size: 14px;
  color: #bbb;
  display: block;
  text-align: center;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item
  img {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 3px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item.vicp-preview-item-circle {
  margin-right: 0;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step2
  .vicp-crop
  .vicp-crop-right
  .vicp-preview
  .vicp-preview-item.vicp-preview-item-circle
  img {
  border-radius: 100%;
}
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload {
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 35px;
  height: 170px;
  background-color: rgba(0, 0, 0, 0.03);
  text-align: center;
  border: 1px dashed #ddd;
}
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-loading {
  display: block;
  padding: 15px;
  font-size: 16px;
  color: #999;
  line-height: 30px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-progress-wrap {
  margin-top: 12px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-progress-wrap .vicp-progress {
  position: relative;
  display: block;
  height: 5px;
  border-radius: 3px;
  background-color: #4a7;
  -webkit-box-shadow: 0 2px 6px 0 rgba(68, 170, 119, 0.3);
  box-shadow: 0 2px 6px 0 rgba(68, 170, 119, 0.3);
  -webkit-transition: width 0.15s linear;
  transition: width 0.15s linear;
  background-image: -webkit-linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 40px 40px;
  -webkit-animation: vicp_progress 0.5s linear infinite;
  animation: vicp_progress 0.5s linear infinite;
}
.vue-image-crop-upload
  .vicp-wrap
  .vicp-step3
  .vicp-upload
  .vicp-progress-wrap
  .vicp-progress::after {
  content: '';
  position: absolute;
  display: block;
  top: -3px;
  right: -3px;
  width: 9px;
  height: 9px;
  border: 1px solid rgba(245, 246, 247, 0.7);
  -webkit-box-shadow: 0 1px 4px 0 rgba(68, 170, 119, 0.7);
  box-shadow: 0 1px 4px 0 rgba(68, 170, 119, 0.7);
  border-radius: 100%;
  background-color: #4a7;
}
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-error,
.vue-image-crop-upload .vicp-wrap .vicp-step3 .vicp-upload .vicp-success {
  height: 100px;
  line-height: 100px;
}
.vue-image-crop-upload .vicp-wrap .vicp-operate {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.vue-image-crop-upload .vicp-wrap .vicp-operate a {
  position: relative;
  float: left;
  display: block;
  margin-left: 10px;
  width: 100px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #4a7;
  border-radius: 2px;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.vue-image-crop-upload .vicp-wrap .vicp-operate a:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
.vue-image-crop-upload .vicp-wrap .vicp-error,
.vue-image-crop-upload .vicp-wrap .vicp-success {
  display: block;
  font-size: 14px;
  line-height: 24px;
  height: 24px;
  color: #d10;
  text-align: center;
  vertical-align: top;
}
.vue-image-crop-upload .vicp-wrap .vicp-success {
  color: #4a7;
}
.vue-image-crop-upload .vicp-wrap .vicp-icon3 {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  top: 4px;
}
.vue-image-crop-upload .vicp-wrap .vicp-icon3::after {
  position: absolute;
  top: 3px;
  left: 6px;
  width: 6px;
  height: 10px;
  border-width: 0 2px 2px 0;
  border-color: #4a7;
  border-style: solid;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  content: '';
}
.vue-image-crop-upload .vicp-wrap .vicp-icon2 {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  top: 4px;
}
.vue-image-crop-upload .vicp-wrap .vicp-icon2::after,
.vue-image-crop-upload .vicp-wrap .vicp-icon2::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 4px;
  width: 13px;
  height: 2px;
  background-color: #d10;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.vue-image-crop-upload .vicp-wrap .vicp-icon2::after {
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.e-ripple {
  position: absolute;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  background-clip: padding-box;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transform: scale(0);
  -ms-transform: scale(0);
  transform: scale(0);
  opacity: 1;
}
.e-ripple.z-active {
  opacity: 0;
  -webkit-transform: scale(2);
  -ms-transform: scale(2);
  transform: scale(2);
  -webkit-transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, -webkit-transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out;
  transition: opacity 1.2s ease-out, transform 0.6s ease-out, -webkit-transform 0.6s ease-out;
}
</style>
