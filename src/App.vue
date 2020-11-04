<template>
  <div id="app">
    <h1>COVID-19</h1>
    <TotalBar />
  </div>
</template>

<script>
import * as d3 from 'd3'
import TotalBar from './components/TotalBar'

export default {
  name: 'COVID',
  components: {
    TotalBar
  },
  data() {
    return {
      covidApi: 'https://data.london.gov.uk/api/table/s8c9t_j4fs2?$limit=5000',
      covidCsv: 'data/phe_cases_london_boroughs.csv',
      covidData: [],
      combinedData: [],
      groupedByDate:[],
      currentFrame: 0,
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
    },
    currentTotal() {
      return this.combinedData[this.currentFrame]
    }
  },
  methods: {
    getLocalData(csv) {
      return d3.csv(csv).then((data) => {
        data.forEach((d) => {
          // Convert strings to integers
          d.new_cases = +d.new_cases
          d.total_cases = +d.total_cases
        })
        this.covidData = data
        console.log(data)
        
      })
    },
    getData(api) {
      return this.$http.get(api)
        .then((response) => {
          this.covidData = response.data.rows
        })
    },
    getTotalsByDate(data) {
      // Sum total_cases from all boroughs by date
      let totalsByDate = d3.rollup(data, v => d3.sum(v, d => d.total_cases), d => d.date)
      console.log(totalsByDate)
      // Restore data structure
      totalsByDate = [...totalsByDate].flatMap(([key, value]) => ({date: key, total_cases: value}))
      console.log(totalsByDate)

      return totalsByDate
    },
    parseDate(dateString) {
      // Convert date string to date format
      const parseDate = d3.timeParse('%Y-%m-%d')
      return parseDate(dateString)
    }
  },
  async created() {
    /* Fetch data from API */
    // this.getData(this.covidApi)

    /* Fetch local data */
    await this.getLocalData(this.covidCsv)
    
    // Get an array of [date, total_cases] across all areas and store it in
    this.combinedData = this.getTotalsByDate(this.covidData)
    
  }
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

* {
  box-sizing: border-box;
  margin:0;
  padding:0;
}

body {
  background-color: $light-grey;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

</style>
