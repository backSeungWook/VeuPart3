<template>
<div class="todo-app">

  <div class="todo-app__actions">
    <div class="filters">
      <button 
        :class="{ active: filter === 'all'}"
        @click="changeFilter('all')"
      >
        모든 항목({{total}})
      </button>
      <button 
        :class="{ active: filter === 'active'}"
        @click="changeFilter('active')"
      >
        해야 할 항목({{activeCount}})
      </button>
      <button 
        :class="{ active: filter === 'completed'}"
        @click="changeFilter('completed')"
      >
        완료된 항목({{completedCount}})
      </button>
    </div>

    <div class="actions">
      <input 
        v-model="allDone"
        type="checkbox" 
      />
      <button @click="clearCompleted">
        완료된 항목 삭제
      </button>
    </div>
  </div>
  
  <div class="todo-app__list">
    <todo-item 
      v-for="todo in filteredTodos" :key="todo.id"
      :todo="todo"
      @update-todo="updateTodo"
      @delete-todo="deleteTodo"
    />
  </div>

  <hr />
  <!-- 자식이  @create-todo로 데이터를 보내면 createTodo 실행 -->
  <todo-creator class="todo-app_creator" @create-todo="createTodo"/>
  
</div>
</template>

<script>
//외부 라이브러리 import
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _cloneDeep from 'lodash/cloneDeep' //깊은 복사
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import dayjs from 'dayjs'
//import cryptoRandomString from '/crypto-random-string';


import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
  components:{
    TodoCreator,
    TodoItem
  },
  //데이터는 무조건 함수로 선언
  data(){
    return{
      db:null,
      todos:[],
      filter:'all',
    }
  },
  computed:{
    filteredTodos(){
      console.log('aaaa')
      switch(this.filter){
        case 'all':
        default:
          return this.todos
        case 'active':
          return this.todos.filter(todo => !todo.done)
        case 'completed':
          return this.todos.filter(todo => todo.done)
      }
    },
    total(){
      return this.todos.length
    },
    activeCount(){
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount(){
      return this.total - this.activeCount
    },
    allDone:{
      get(){
        return this.total === this.completedCount && this.total > 0
      },
      set(checked){
        this.completeAll(checked)
      }
    }
  },
  created(){
    this.initDB()
  },
  methods:{
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
    },
    createTodo(title){
      const date = dayjs(new Date())
      const dataStr = date.format('MMDDHHmmss')
      
      const newTodo = {       
        id:dataStr,
        title,
        createdAt:new Date(),
        updatedAt:new Date(),
        done:false
      }

      //Create DB
      this.db
        .get('todos') //lodash에서 제공하는 함수
        .push(newTodo) //lodash에서 제공하는 함수
        .write() //lowdb에서 제공하는 함수
      
      //Create Client
      this.todos.push(newTodo)
    },
    updateTodo(todo,value){
      this.db
        .get('todos')
        .find({id:todo.id})
        .assign(value)
        .write()
      
      const foundTodo = _find(this.todos,{id:todo.id})
      
      _assign(foundTodo,value)
    },
    deleteTodo(todo){
      this.db
        .get('todos')
        .remove({ id: todo.id})
        .write()

      const foundIndex = _findIndex(this.todos,{id:todo.id})
      this.$delete(this.todos,foundIndex)
    },
    changeFilter(filter){    
      this.filter = filter
    },
    completeAll(checked)
    {
      const newTodes = this.db
        .get('todos')
        .forEach(todo =>{
          todo.done = checked
        })
        .write()

      this.todos = _cloneDeep(newTodes)
    },
    clearCompleted(){

      //배열 삭제 시 index 뒤에서 부터 삭제 
      /* lodash lib 사용 안한 코드
      this.todos
        .reduce((list,todo,index) =>{
          if(todo.done){
            list.push(index)
          }
        },[])
        .reverse()
        .forEach(index => {
          this.deleteTodo(this.todos[index])
        })*/
      //lodash lib 사용
      _forEachRight(this.todos,todo =>{
        if(todo.done)
        {
          this.deleteTodo(todo)
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
  button.active{
    font-weight:bold;
  }
</style>

