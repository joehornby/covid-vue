.<template>
  <div class="details">
    <h3>{{ detail.borough }}</h3>
    <p>New cases: {{ detail.newCases }}</p>
    <p>Total cases: {{ detail.totalCases }}</p>
  </div>
</template>

<script>
export default {
  props: {
    detail: Object
  }
}
</script>

<style lang="scss" scoped>
  @import '@/styles/_variables.scss';
  .details {
      position: fixed;
      width: 50%;
      bottom: 8rem;
      left: 50%;
      right: 0;
      @media (min-width: $bp){
        left: 0;
        width: 100%;
      }
    }
</style>