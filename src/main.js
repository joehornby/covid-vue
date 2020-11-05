import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueStatic from 'vue-static'

Vue.config.productionTip = false

Vue.use(VueAxios, axios, VueStatic)

new Vue({
  render: h => h(App),
}).$mount('#app')
