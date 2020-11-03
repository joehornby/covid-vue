<template>
  <div id="app">
    <h1>COVID-19</h1>
    <ul>
      <li v-for="borough in boroughs" :key="borough">{{ borough }}</li>
    </ul>
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
      covidData: [],
    }
  },
  computed: {
    boroughs() {
      const boroughs = []
        // Find unique area names in data
        this.covidData.forEach((el) => {
          // If the current area_name is not in the boroughs array, add it
          if (!boroughs.includes(el.area_name)) {
            boroughs.push(el.area_name)
          }
        })
      return boroughs
    }
  },
  methods: {
    getLocalData(csv) {
      const parseDate = d3.timeParse('%Y-%m-%d')
      d3.csv(csv).then((data) => {
        data.forEach((d) => {
          // Convert strings to integers
          d.new_cases = +d.new_cases
          d.total_cases = +d.total_cases
          // Convert date string to date format
          d.date = parseDate(d.date)
        })
        this.covidData = data
      })
      
    },
    getData(api) {
      this.$http.get(api).then((response) => {
        this.covidData = response.data.rows
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
