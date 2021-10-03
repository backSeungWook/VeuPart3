<template>
<div class="todo-app">

  <div class="todo-app__actions">
    <div class="filters">
      
      <router-link 
        to="all"
        tag="button"
      >
      <!--template 문법에서는 this사용 X -->
      <!-- store getters get -->
      <!-- $store.getters.todoApp -->
        모든 항목({{ total }})
      </router-link>
      <router-link  
        to="active" 
        tag="button"
      >
        해야 할 항목({{ activeCount }})
      </router-link>
      <router-link  
        to="completed"
        tag="button"
      >
        완료된 항목({{completedCount}})
      </router-link>
    </div>

    <div class="actions clearfix">
      <div class="float--left">
        <label>
          <input 
            v-model="allDone"
            type="checkbox" 
          />
          <span class="icon">
            <i class="material-icons">done_all</i>
          </span> 
        </label>
      </div>

      <div class="float--right clearfix">
        <button class="btn float--left"
          @click="scrollToTop"
        >
          <i class="material-icons">expand_less</i>
        </button>
        <button class="btn float--left"
          @click="scrollToBottom"
        >
          <i class="material-icons">expand_more</i>
        </button>
        <button
          class="btn btn--danger float--left"
          @click="clearCompleted"
        >
          <i class="material-icons">delete_sweep</i>
        </button>
      </div>
    </div>
  </div>
  <!-- @update-todo="updateTodo" 자식이 부모에게 전달 -->
  <!-- 현재는 Vuex store로 이관 하여 사용 안함. -->
  <div class="todo-app__list">
    <todo-item 
      v-for="todo in filteredTodos" :key="todo.id"
      :todo="todo"
    />
  </div>

  <!-- 자식이  @create-todo로 데이터를 보내면 createTodo 실행 -->
  <!-- @create-todo="createTodo" 현재는 Vuex store로 이관 하여 사용 안함. -->
  <todo-creator class="todo-app__creator" />
  
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

//외부 라이브러리 import
import scrollTo from 'scroll-to'
//import cryptoRandomString from '/crypto-random-string';

import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'

export default {
  components:{
    TodoCreator,
    TodoItem
  },
  //데이터는 무조건 함수로 선언
  /*Vuex로 인하여 사용 안함
  data(){
    return{
      db:null,
      todos:[]
    }
  },
  */
  computed:{
    //... : 전개 연산자
    ...mapState('todoApp',[
      'todos'
    ]),
    ...mapGetters('todoApp',[
      'total',
      'activeCount',
      'completedCount',
      'filteredTodos'
    ]),
 
    /*Vuex로 인하여 사용 안함
    total(){
      return this.todos.length
    },
    activeCount(){
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount(){
      return this.total - this.activeCount
    },*/
    allDone:{
      get(){
        return this.total === this.completedCount && this.total > 0
      },
      set(checked){
        this.completeAll(checked)
      }
    }
  },
  watch:{
    $route(){
      //this.$store.commit('todoApp/updateFilter',this.$$route.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  created(){
    this.initDB()
  },
  methods:{
    ...mapMutations('todoApp',[
      'updateFilter'
    ]),
    ...mapActions('todoApp',[
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),

    /*Vuex로 인하여 사용 안함
    initDB(){
      const adapter = new LocalStorage('todo-app')//DB 명칭
      this.db = lowdb(adapter)

      //has(): lodash에서 제공하는 함수 / 데이터 있는지 여부확인.
      const hasTodos = this.db.has('todos').value()

      if(hasTodos){
        this.todos = _cloneDeep(this.db.getState().todos)
      }else
      {
        //Local DB 초기화
        this.db
          .defaults({
            todos:[] //Table
          }).write()
      }
    },*/
    

    scrollToTop(){
      scrollTo(0,0,{ //X,Y,개체
        ease:'linear',//linear 동일한 속도
        duration:1000//기본값이 1초
      })
    },
    scrollToBottom(){
      scrollTo(0,document.body.scrollHeight,{
        ease:'linear',
        duration:1000
      })
    }
  }
}
</script>


<style lang="scss">
//scss에 _style.scss 불러오기 style이름에 _붙지 않은 이유는 Scss의 partials 것 때문
 @import "scss/style";

 .filters button.router-link-active{
   background: royalblue;
   color: whilte;
 }
</style>

