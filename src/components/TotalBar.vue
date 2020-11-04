<template>
  <div class="svg-container">
    <svg viewbox="0 0 100 100" preserveAspectRatio="none">
      <rect id="total-bar" :transform="`scale(1,-1) translate(0, -${windowHeight})`" x="0" y="0" width="100%" :height="`${height}%`">
      </rect>
    </svg>
  </div>
  
</template>

<script>

export default {
  props: {
    totalCases: {
      type: Number,
      required: true
      },
    maxCases: {
      type: Number,
      default: 30000
      },
    windowHeight: Number,
    updateInterval: Number
  },
  data() {
    return {}
  },
  computed: {
    height() {
      return this.totalCases / this.maxCases * 100
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variables';

  .svg-container {
    position: fixed;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    fill: $light-grey;
    mix-blend-mode: exclusion;
    pointer-events: none;
    svg {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      rect {
        transition: height 0.5s linear;
      }
    }
  }
</style>