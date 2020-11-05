<template>
  <div class="counter-container">
    <span class="counter">{{ totalCases }}</span>
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
    display: flex;
    align-items: flex-end;
  }
  .counter {
    font-family: $display-font;
    font-size: calc(calc(25vw + 25vh) / 2);
    color: $light-grey;
    mix-blend-mode: exclusion;
    padding-left: 2rem;

    @media(min-width: $bp) {
      transform-origin: center;
      transform: rotate(180deg);
      writing-mode: vertical-lr;
      bottom: 0;
      font-size: 40vh;
      padding: 2rem 0 0 0; // Strange order = writing mode + transform
    }
  }
</style>