<template>
  <div class="upload-container">
    <el-button size="small" type="primary" @click="dialogTableVisible = true"> upload </el-button>
    <el-dialog :visible.sync="dialogTableVisible">
      <el-upload
        :multiple="true"
        :show-file-list="true"
        :file-list="fileList"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-remove="handleRemove"
        list-type="picture-card"
        action="https://httpbin.org/post"
      />
      <el-button size="small" type="info">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">点击上传</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
      fileList: [],
      listObj: {}
    }
  },
  methods: {
    /**
     * 文件上传前的钩子函数
     * 生成图片信息
     */
    beforeAvatarUpload(file) {
      // console.log(file, 'beforeupload')
      const self = this
      const fileName = file.uid
      const _URL = window.URL || window.webkitURL
      this.listObj[fileName] = {}
      return new Promise((reslove) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          self.listObj[fileName] = {
            hasSuccess: false,
            uid: fileName,
            width: this.width,
            height: this.height
          }
        }
        reslove(true)
      })
    },
    /**
     * 文件上传成功的回调
     * 获取图片的 base64
     */
    handleAvatarSuccess(response, file, fileList) {
      // console.log(response, file, fileList, 'success')
      // console.log(this.listObj, 'listobj')
      const keys = Object.keys(this.listObj)
      for (let i = 0; i < keys.length; i++) {
        const curKey = keys[i]
        if (this.listObj[curKey].uid === file.uid) {
          this.listObj[curKey].url = response.files.file
          this.listObj[curKey].hasSuccess = true
          return
        }
      }
    },
    /**
     * 取消上传某个文件
     */
    handleRemove(file, fileList) {
      const keys = Object.keys(this.listObj)
      for (let i = 0; i < keys.length; i++) {
        const curKey = keys[i]
        if (this.listObj[curKey].uid === file.uid) {
          delete this.listObj[curKey]
          return
        }
      }
    },
    /**
     * 上传的文件全部读取成功
     */
    checkAllSuccess() {
      return Object.keys(this.listObj).every((key) => this.listObj[key].hasSuccess)
    },
    /**
     * 提交
     */
    handleSubmit() {
      const arr = Object.keys(this.listObj).map((key) => this.listObj[key])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
    }

  }
}
</script>

<style>

</style>
