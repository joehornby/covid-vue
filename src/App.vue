<template>
  <div id="app">
    <div class="wrapper" :v-if="dataLoaded">

      <header>
        <h1>London<br/>COVID-19 Cases</h1>
      <h2>Total cases<br/>{{ currentBorough }}</h2>
      <h2>
        {{ currentDate.day }}.{{ currentDate.month }}<br />
      {{ currentDate.year }}</h2>
      </header>
      
      <button @click="startAnimation">Go</button>
      <section id="data">
        <BoroughMap :currentData="dataGroupedByDate[currentIndex].data" />
        <TotalBar 
          v-if="dataLoaded" 
          :totalCases="currentTotal" 
          :maxCases="maxCases" 
          :windowHeight="windowHeight" />
          <Counter :totalCases="currentTotal"/>
      </section>
      <div class="controls">
        <VueSimpleRangeSlider
                      style="width: 100px"
                      :min=0
                      :max=stopIndex
                      v-model="indexRange"
                      barColor="#f2f2f2"
                      activeBarColor="#f2f2f2"
              />
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import VueSimpleRangeSlider from 'vue-simple-range-slider'
import 'vue-simple-range-slider/dist/vueSimpleRangeSlider.css'

import TotalBar from './components/TotalBar'
import BoroughMap from './components/BoroughMap'
import Counter from './components/Counter'

export default {
  name: 'COVID',
  components: {
    TotalBar,
    BoroughMap,
    Counter,
    VueSimpleRangeSlider,
  },
  data() {
    return {
      covidApi: 'https://data.london.gov.uk/api/table/s8c9t_j4fs2?$limit=5000',
      covidCsv: 'data/phe_cases_london_boroughs.csv',
      useApi: false,
      covidData: [],
      combinedData: [],
      dataLoaded: false,
      currentIndex: 0,
      tweenedTotal: 0,
      windowHeight: window.innerHeight,
      updateInterval: 0.5,
      animationId: undefined,
      indexRange: [0, this.stopIndex]
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
    currentBorough() {
      return "All boroughs"
    },
    currentTotal() {
      return this.combinedData[this.currentIndex].total_cases
    },
    currentDate() {
      let dateSliced = this.combinedData[this.currentIndex].date.split("-")
      let date =  { 
          year: dateSliced[0],
          month: dateSliced[1], 
          day: dateSliced[2]
        }
      return date 
    },
    stopIndex() {
      return this.combinedData.length - 1
    },
    maxCases() {
      return Math.max(...this.combinedData.map(o => o.total_cases), 0)
    },
    dataGroupedByDate() {
      let dataByDate = d3.group(this.covidData, d => d.date)
      // Restore data structure
      dataByDate = [...dataByDate].flatMap(([key, value]) => ({date: key, data: value}))
      return dataByDate
    },
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
      this.currentIndex = 0
      this.animationId = setInterval(() => {
        if (this.currentIndex < this.stopIndex) {
          this.currentIndex ++
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
  overflow: hidden;
  background-color: $light-grey;
  background-image: radial-gradient(rgba($light-grey, 20%) 5%, transparent 5%);
  background-position: 0 0;
  background-size: 2rem 2rem;
  background-blend-mode: exclusion;
}
#app {
  color: $light-grey;
  mix-blend-mode: exclusion;
}
h1, h2, h3, h4, p {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 200;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

/* Layout */

header {
  padding: 1rem;
  @media (min-width: $bp) {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
  }
  
}

/* Transition */

.slide-enter-active {
  transition: all .1s linear;
}
.slide-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter {
  transform: translateY(-20px);
}
.slide-leave-to {
  transform: translateY(20px);
}

</style>
