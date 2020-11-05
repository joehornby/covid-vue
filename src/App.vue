<template>
  <div id="app">
    <h1>COVID-19</h1>
    <button @click="startAnimation">Go</button>
    <section :v-if="dataLoaded" id="data">
      <BoroughMap />
      <TotalBar 
        v-if="dataLoaded" 
        :totalCases="currentTotal" 
        :maxCases="maxCases" 
        :windowHeight="windowHeight" />
        <Counter :totalCases="currentTotal"/>
    </section>
  </div>
</template>

<script>
import * as d3 from 'd3'
// import * as gsap from 'gsap';

import TotalBar from './components/TotalBar'
import BoroughMap from './components/BoroughMap'
import Counter from './components/Counter'

export default {
  name: 'COVID',
  components: {
    TotalBar,
    BoroughMap,
    Counter
  },
  data() {
    return {
      covidApi: 'https://data.london.gov.uk/api/table/s8c9t_j4fs2?$limit=5000',
      covidCsv: 'data/phe_cases_london_boroughs.csv',
      useApi: false,
      covidData: [],
      combinedData: [],
      dataLoaded: false,
      currentFrame: 0,
      tweenedTotal: 0,
      windowHeight: window.innerHeight,
      updateInterval: 0.5,
      animationId: undefined,
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
      return this.combinedData[this.currentFrame].total_cases
    },
    stopIndex() {
      return this.combinedData.length - 1
    },
    maxCases() {
      return Math.max(...this.combinedData.map(o => o.total_cases), 0)
    }
  },
  methods: {
    loadData(csv) {
      return d3.csv(csv).then((data) => {
        data.forEach((d) => {
          // Convert strings to integers
          d.new_cases = +d.new_cases
          d.total_cases = +d.total_cases
        })
        return data
      })
    },
    getData(api) {
      this.$http.get(api)
        .then((response) => {
          return response.data.rows
        })
    },
    getTotalsByDate(data) {
      // Sum total_cases from all boroughs by date
      let totalsByDate = d3.rollup(data, v => d3.sum(v, d => d.total_cases), d => d.date)
      // Restore data structure
      totalsByDate = [...totalsByDate].flatMap(([key, value]) => ({date: key, total_cases: value}))

      return totalsByDate
    },
    parseDate(dateString) {
      // Convert date string to date format
      const parseDate = d3.timeParse('%Y-%m-%d')
      return parseDate(dateString)
    },
    onResize() {
      this.windowHeight = window.innerHeight
    },
    startAnimation() {
      console.log('starting animation')
      this.currentFrame = 0
      this.animationId = setInterval(() => {
        if (this.currentFrame < this.stopIndex) {
          this.currentFrame ++
        } else {
          clearInterval(this.animationId)
        }
      }, this.updateInterval * 1000)
      }
  }, 
  async created() {
    try {
      if (this.useApi) {
        // Fetch data from API
        this.covidData = await this.getData(this.covidApi)
      } else {
        // Fetch local data
        this.covidData = await this.loadData(this.covidCsv)
      }  

      // Get an array of [date, total_cases] across all areas and store it in
      this.combinedData = await this.getTotalsByDate(this.covidData)
      this.dataLoaded = true
      
    } catch (err) {
      console.log(err)
    }

  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  beforeDestroy() { 
    window.removeEventListener('resize', this.onResize); 
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';

* {
  box-sizing: border-box;
  margin:0;
  padding:0;
}
html, body, #app {
  height: 100%;
  width: 100%;
}
body {
  background-color: $light-grey;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
#app {
  color: $light-grey;
  mix-blend-mode: exclusion;
}

</style>
