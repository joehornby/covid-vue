<template>
  <div id="app">
    <h1>COVID-19</h1>
    <div id="bar-total"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'COVID',
  components: {},
  data() {
    return {
      covidCSV: '~assets/phe_cases_london_boroughs.csv',
      covidData: []
    }
  },
  methods: {
    async getLocalData(csv) {
      const data = await d3.csv(csv).then((data) => {
        data.forEach((d) => {
          // Convert strings to integers
          d.new_cases = +d.new_cases
          d.total_cases = +d.total_cases
          // Convert date string to date format
          d.date = parseDate(d.date)
        })
      })
      this.covidData = data
    },
  },
  mounted() {
    // Fetch data on mount
    this.getLocalData(this.covidCSV)
  }
}
</script>

<style>

</style>
