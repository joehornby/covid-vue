<template>
  <svg height="100%" width="100%" viewbox="0 0 100 100" preserveAspectRatio="none">
    <g>
      <rect id="total-bar" x="0" y="0" width="100%" height="80%">
      </rect>
    </g>
  </svg>
</template>

<script>
export default {
  setup () {
    

    return {}
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/variables';

  svg {
    position: fixed;
    bottom: 0;
    left: 0;
    top: 0;
    right: 0;
    fill: $light-grey;
    mix-blend-mode: exclusion;
  }
</style>