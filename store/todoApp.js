import Vue from 'vue'
import _cloneDeep from 'lodash/cloneDeep' //깊은 복사
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'//for 사용시 배열 뒷에서 부터
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import dayjs from 'dayjs'


export default {
  namespaced:true,//독립적으로 네임스페이스
  //Data
  //state Data와 같이 함수여야 한다.
  state: () =>({
    db:null,
    todos:[],
    filter:'all'
  }),
  /*과 동일
  state(){
    retrun
  }
  */
  //Computed
  getters:{
    total(state){
      return state.todos.length
    },
    activeCount(state){
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount(state,getters){
      //return this.total - this.activeCount
      //getters.total = total(state) / getters.activeCount = activeCount(state)
      return getters.total - getters.activeCount
    },
    filteredTodos(state){
      //children안에 path의 파라미터 이름(id) 그 id 라는 파라미터의 데이터 값은 router-link to="all" all 이라는 데이터가 들어간다..
      //this.$route.params.id
      switch(state.filter){
        case 'all':
        default:
          return state.todos
        case 'active':
          return state.todos.filter(todo => !todo.done)
        case 'completed':
          return state.todos.filter(todo => todo.done)
      }
    },
  },
  //Methods
  //실제 값을 변경 할 때(비동기X)
  //state 변경 할수 있음
  //기본 인자는 state,{payload}
  mutations:{
    assignDB(state,db){
      state.db = db
    },
    createDB(state,newTodo){
      state.db
      .get('todos') //lodash에서 제공하는 함수
      .push(newTodo) //lodash에서 제공하는 함수
      .write() //lowdb에서 제공하는 함수
    },
    updateDB(state,{todo,value}){
      state.db
      .get('todos')
      .find({id:todo.id})
      .assign(value)
      .write()
    },
    deleteDB(state,todo){
      state.db
      .get('todos')
      .remove({ id: todo.id})
      .write()
    },
    assignTodos(state, todos){
      state.todos = todos
    },
    assignTodo(state,{foundTodo,value}){
      _assign(foundTodo,value)
    },
    pushTodo(state,newTodo){
      state.todos.push(newTodo)
    },
    deleteTodo(state,foundIndex){
      Vue.delete(state.todos,foundIndex)
    },
    updateTodo(state,{todo, key,value}){
      //todo['done'] == todo.done
      todo[key] = value
    },
    updateFilter(state,filter){
      state.filter = filter
    }
  },
  //Methods
  // 일반 로직(비동기O)
  //state 변경 할 수 없음.
  //인자: { rootState, state, dispatch, commit },{payload}
  actions:{
    //함수 정의시 매개 값은 2개 밖에 안댐.
    //state: state ,commit:mutations
    initDB({state,commit}){
      
      const adapter = new LocalStorage('todo-app')//DB 명칭
      //state.db = lowdb(adapter)
      commit('assignDB',lowdb(adapter))

      //has(): lodash에서 제공하는 함수 / 데이터 있는지 여부확인.
      const hasTodos = state.db.has('todos').value()

      if(hasTodos){
        //state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos',_cloneDeep(state.db.getState().todos))
      }else
      {
        //Local DB 초기화
        state.db
          .defaults({
            todos:[] //Table
          }).write()
      }
    },
    createTodo({state,commit},title){
      const date = dayjs(new Date())
      const dataStr = date.format('MMDDHHmmssSSS')
      
      const newTodo = {       
        id:dataStr,
        title,
        createdAt:new Date(),
        updatedAt:new Date(),
        done:false
      }

      //Create DB
      commit('createDB',newTodo)
      
      //Create Client
      commit('pushTodo',newTodo)
    },
    updateTodo({state,commit},{todo,value}){
      //Update DB
      commit('updateDB',{todo,value})

      const foundTodo = _find(state.todos,{id:todo.id})
      commit('assignTodo',{foundTodo,value})
    },
    deleteTodo({state,commit},todo){
      //DeleteDB
      commit('deleteDB',todo)

      const foundIndex = _findIndex(state.todos,{id:todo.id})
      commit('deleteTodo',foundIndex)
    },
    completeAll({state,commit},checked)
    {
      //commit : 반환값을 안가짐.
      const newTodes = state.db
        .get('todos')
        .forEach(todo =>{
          //todo.done = checked
          commit('updateTodo',{
            todo,
            key:'done',
            value:checked
          })
        })
        .write()

       // state.todos = _cloneDeep(newTodes)
       commit('assignTodos',_cloneDeep(newTodes))
        
    },
    clearCompleted({state,commit,dispatch}){

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

      //lodash lib 사용 위 주석 예제는 lib 사용 안하고 만들었때
      _forEachRight(state.todos,todo =>{
        if(todo.done)
        {
          //this.deleteTodo(todo)
          dispatch('deleteTodo',todo)
        }
      })
    }

  }
}
