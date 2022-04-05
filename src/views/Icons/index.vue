<template>
  <div class="icons-container">
    <aside>
      <a href="">Add and use</a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div class="grid">
          <div v-for="item in svgIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
            <el-tooltip class="item" effect="dark" :content="generateIconCode(item)" placement="top">
              <div class="icon-item">
                <svg-icon :icon-class="item" class="disable" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item in elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item), $event)">
            <el-tooltip class="item" effect="dark" :content="generateElementIconCode(item)" placement="top">
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <span>{{ item }}</span>
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icon'
import clipboard from '@/utils/clipboard'

export default {
  data() {
    return {
      svgIcons,
      elementIcons
    }
  },
  methods: {
    generateIconCode(val) {
      return `<svg-icon icon-class="${val}" />`
    },
    generateElementIconCode(val) {
      return `<i class="el-icon-${val}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  .disable {
    pointer-events: none;
  }
  .icon-item {
    width: 100px;
    height: 85px;
    margin: 20px;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
    text-align: center;
    float: left;
    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }
  }
</style>
