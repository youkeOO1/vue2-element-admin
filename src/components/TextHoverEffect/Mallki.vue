<template>
  <a :class="className" class="link--mallki">
    {{ text }}
    <span :data-letters="text" />
    <span :data-letters="text" />
  </a>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: 'vue-element-admin'
    }
  }
}
</script>

<style lang="scss" scoped>
.link--mallki {
  color: #4dd9d5;
  font-weight: bold;
  transition: color .5s .25s;
  // overflow: hidden;
  line-height: 1;
  outline: none;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  &::before {
    content: " ";
    width: 100%;
    height: 6px;
    position: absolute;
    top: 50%;
    left: 0;
    background: #3888fa;
    transform: translate3d(-100%, 0, 0);
    transition: transform 0.4s;
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
  }
  span {
    width: 100%;
    height: 50%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    &:nth-of-type(2) {
      top: 50%;
    }
    &::before {
      content: attr(data-letters);
      color: #3888fa;
      width: 100%;
      position: absolute;
      left: 0;
      transition: transform 0.5s;
    }
    &:first-child::before {
      top: 0;
      transform: translate3d(0, 100%, 0);
    }
    &:nth-child(2)::before {
      bottom: 0;
      transform: translate3d(0, -100%, 0);
    }
  }
  &:hover {
    color: transparent;
    transition: none;
    &::before {
      transform: translate3d(100%,0,0);
    }
    span {
      &::before {
        transition-delay: 0.3s;
        transform: translate3d(0,0,0);
        transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
      }
    }
  }
}
</style>
