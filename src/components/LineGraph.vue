<template>
<div class="graph-container">
  <div id="graph" class="aGraph"></div>
  <div id="slider-range" style="width: 100%"></div>
</div>
</template>

<script>
import * as d3 from 'd3'

export default {
  
}
</script>

<style lang="scss" scoped>
  @import '@/styles/_variables.scss';
  path {
    stroke: $light-grey;
    stroke-width: 2;
    fill: none;
    mix-blend-mode: exclusion;
  }
</style>