import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  //config
  //route
  {
    name:'index',
    path:'/',//root 최상위 페이지
    component:Home
  },
  {
    name:'about',
    path:'/about',
    component:About
  },
  {
    name:'todos',
    redirect:'/todos/all',
    path:'/todos',
    component:TodoApp,
    children:[
      {
        name:'todos-filter',
        path:':id'//:파라미터 ,id는파라미터 이름
      }
    ]
  }
]

//
export default new VueRouter({  
  routes //routes:routes 와 동일
})
