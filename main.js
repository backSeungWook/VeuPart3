//현재 webpack에서 확장자 생략 하게 해놓음(js,vue 만 )
import Vue from 'vue'
import App from './App' //최상의 컴포넌트 App.vue
import router from './router'//라우터 연결 
import store from './store/' // /store/index.js

new Vue({
  el:'#app',
  router,//라우터 연결 /router/index.js
  store,//store:store
  render: h =>h(App) //App.vue 랜더링
  
  /*
  renber(createElementMsg){//render는 콜 백 매개변수를 갖음
    return createElementMsg(App)
  }
  */
})