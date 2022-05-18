<template>
  <div class="components-container">
    <aside>
      This is based on <a href="//github.com/dai-siki/vue-image-crop-upload">vue-image-crop-upload</a> . Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.
    </aside>
    <div class="avatar-container">
      <pan-thumb :image="avatar" />
      <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow = true"> Change Avatar</el-button>
      <avatar-upload v-show="imagecropperShow" :width="300" :height="300" @close="close" />
    </div>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import AvatarUpload from '@/components/AvatarUpload/AvatarUpload'
import { mapGetters } from 'vuex'

export default {
  components: {
    PanThumb,
    AvatarUpload
  },
  data() {
    return {
      imagecropperShow: false
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  methods: {
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
