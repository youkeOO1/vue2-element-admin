<template>
  <div class="dashboard-editor-container">
    <div class="">
      <pan-thumb width="150px" height="150px" :image="avatar" style="float:left">
        You rules: editor
      </pan-thumb>
      <div class="info-container">
        <span class="info-title">Normal Editor</span>
        <span style="font-size: 20px; padding-top: 20px; display: inline-block;">Editor's Dashboard</span>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="emptyGif">
    </div>
    <github-corner />
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb/index.vue'
import GithubCorner from '@com/GithubCorner'
import { mapGetters } from 'vuex'

export default {
  components: {
    PanThumb,
    GithubCorner
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    background: #e3e3e3;
    min-height: 100vh;
    position: relative;
    padding: 50px 60px 0px;
    .info-container {
      position: relative;
      height: 150px;
      line-height: 200px;
      margin-left: 190px;
      .info-title {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
    .emptyGif {
      width: 45%;
      display: block;
      margin: 0 auto;
    }
  }
</style>
