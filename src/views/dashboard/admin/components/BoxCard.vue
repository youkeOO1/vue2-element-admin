<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="avatar" />
      <mallki class-name="mallki-text" text="vue-element-admin" />
      <div style="padding-top:35px;" class="progress-item">
        <span>Vue</span>
        <el-progress :percentage="70" />
      </div>
      <div class="progress-item">
        <span>JavaScript</span>
        <el-progress :percentage="18" />
      </div>
      <div class="progress-item">
        <span>CSS</span>
        <el-progress :percentage="12" />
      </div>
      <div class="progress-item">
        <span>ESLint</span>
        <el-progress :percentage="100" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb/index.vue'
import Mallki from '@/components/TextHoverEffect/Mallki.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    PanThumb,
    Mallki
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" >
  .box-card-component {
    .el-card__header {
      padding: 0 ;
      .box-card-header {
        height: 220px;
        position: relative;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .box-card-component {
    .box-card-header {
      height: 220px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        transition: all .3s linear;
        &:hover {
          transform: scale(1.1, 1.1);
          filter: contrast(120%);
        }
      }
    }
    .mallki-text{
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      font-weight: bold;
    }
    .progress-item {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
</style>
