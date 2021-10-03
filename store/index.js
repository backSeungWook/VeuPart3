import Vue from 'vue'
import Vuex from 'vuex'
import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules:{
    todoApp //todoApp:todoAPP  todoApp.js(독립적인 네임스페이스) 연결
  }
})