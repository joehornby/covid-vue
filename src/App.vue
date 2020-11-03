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
      covidApi: 'https://data.london.gov.uk/api/table/s8c9t_j4fs2?$limit=5000',
      covidCsv: 'data/phe_cases_london_boroughs.csv',
      covidData: null
    }
  },
  methods: {
    getLocalData(csv) {
      const parseDate = d3.timeParse('%Y-%m-%d')
      const data = d3.csv(csv).then((data) => {
        data.forEach((d) => {
          // Convert strings to integers
          d.new_cases = +d.new_cases
          d.total_cases = +d.total_cases
          // Convert date string to date format
          d.date = parseDate(d.date)
        })
        console.log(data)
      })
      this.covidData = data
    },
    getData(api) {
      this.$http.get(api).then((response) => {
        this.covidData = response.data.rows
        console.log(response.data.rows)
      })
    }
  },
  mounted() {
    /* Fetch data from API */
    // this.getData(this.covidApi)

    /* Fetch local data */
    this.getLocalData(this.covidCsv)
  }
}
</script>

<style>

</style>
