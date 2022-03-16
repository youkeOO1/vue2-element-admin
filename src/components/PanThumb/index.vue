<template>
  <div class="pan-item" :style="{ width, height, zIndex, }">
    <div class="pan-info">
      <div class="pan-rule-containter">
        <slot />
      </div>
    </div>
    <div :style="{ backgroundImage: `url(${image})` }" class="pan-thumb" />
  </div>
</template>

<script>
// import { number } from 'echarts'
export default {
  props: {
    width: {
      type: String,
      default: '70px'
    },
    height: {
      type: String,
      default: '70px'
    },
    zIndex: {
      type: Number,
      default: 1
    },
    image: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .pan-item {
    width: 70px;
    height: 70px;
    position: absolute;
    top: -45px;
    left: 0;
    background: #fff;
    border: 5px solid #fff;
    border-radius: 50%;
    .pan-info {
      width: inherit;
      height: inherit;
      border-radius: 50%;
      overflow: hidden;
      .pan-rule-containter {
        padding: 20px;
        text-align: center;
      }
    }
    .pan-thumb {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 50%;
      overflow: hidden;
      background-image: url("https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif");
      background-size: cover;
      background-position: center center;
      transform-origin: 95% 40%;
      transition: all .3s ease-in-out;
    }
    &:hover {
      .pan-thumb {
        transform: rotate(-110deg);
      }
    }
  }
</style>
