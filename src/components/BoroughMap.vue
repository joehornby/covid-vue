<template>
  <div>
    rows: {{ rows }}
    cols: {{ cols }}
  </div>
</template>

<script>
import { boroughInfo } from '../borough-info'

export default {
  data() {
    return {

    }
  },
  computed: {
    rows() {
      // Find max row index from Borough info object
      return Math.max(...boroughInfo.map(o => o.grid.row), 0)
    },
    cols() {
      // Find max col index from Borough info object
      return Math.max(...boroughInfo.map(o => o.grid.col), 0)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>