import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        locationName: '定位中...'
    },
    mutations: {
        update(state,config){
            Object.keys(config).map((item,index)=>{
                state[item] = config[item]
            })
        }
    }
})
export default store;