<template>
  <div class="app-container">
    <aside>
      The guide page is useful for some people who entered the project for the first time. You can
      briefly introduce the features of the project. Demo is based on
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js</a>.
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="handleStep">
      Show Guide
    </el-button>
  </div>
</template>

<script>
// gudie 路由检查
import { shepherd } from '@wytxer/shepherd-vue'
// import steps from './steps'

export default {
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    // this.driver = new Driver()
    this.$nextTick(() => {
      this.driver = shepherd({
        defaultStepOptions: {
          classes: 'my-shepherd-theme'
        }
      })
    })
  },
  methods: {
    handleStep() {
      // this.driver.highlight('#hamburger-containter')
      this.driver.addSteps([
        {
          attachTo: {
            element: '#hamburger-containter',
            on: 'auto'
          },
          title: 'Hamburger',
          text: 'Including Shepherd is easy! Just include shepherd.js. The styles are bundled with the JS.',
          buttons: [
            {
              action() {
                return this.next()
              },
              text: '下一步'
            }
          ]
        },
        {
          attachTo: {
            element: '#header-search',
            on: 'auto'
          },
          title: 'Search',
          text: '搜索',
          buttons: [
            {
              action() {
                return this.back()
              },
              text: '上一步'
            },
            {
              action() {
                return this.next()
              },
              text: '下一步'
            }
          ]
        },
        {
          attachTo: {
            element: '#avatar',
            on: 'auto'
          },
          title: 'Avatar',
          text: '头像',
          buttons: [
            {
              action() {
                return this.cancel()
              },
              text: '完成'
            }
          ]
        }
      ])
      this.driver.start()
    }
  }
}
</script>

<style lang="scss">
.my-shepherd-theme {
  &.shepherd-has-title {
    &.shepherd-element {
      padding: 15px;
      .shepherd-arrow {
        &::before {
          background: #fff;
        }
      }
      .shepherd-header {
        background: transparent;
        padding: 0;
        margin: 0;
        margin-bottom: 5px;
        font-size: 19px;
        line-height: 1.5;
        font-weight: 700;
      }
      .shepherd-text {
        font-size: 14px;
        line-height: 1.2;
        color: rgb(45, 45, 45);
        padding: 0;
        margin: 0;
      }
      .shepherd-footer {
        padding: 0;
        margin: 10px 0 0;
        button {
          display: inline-block;
          text-shadow: rgb(255, 255, 255) 1px 1px 0px;
          color: rgb(45, 45, 45);
          cursor: pointer;
          background-color: rgb(241, 241, 241);
          zoom: 1;
          padding: 3px 10px;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(212, 212, 212);
          border-image: initial;
          text-decoration: none;
          font: 11px / 1.3 sans-serif;
          outline: 0px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
