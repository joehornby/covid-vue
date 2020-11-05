<template>
  <div class="counter-container">
    <div class="counter">
      <span>{{ totalCases }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalCases: {
      type: Number,
      required: true,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/_variables.scss';
  
  .counter-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  .counter {
    color: $light-grey;
    mix-blend-mode: exclusion;
    position: relative;
    @media(min-width: $bp) {
      transform-origin: bottom center;
      transform: rotate(-90deg);
      bottom: 0;
    }
    span {
      font-family: $display-font;
      font-size: calc(calc(25vw + 25vh) / 2);
    }
  }
</style>