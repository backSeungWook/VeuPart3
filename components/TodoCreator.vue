<template>
  <div>
    <button @click="createTodo">
      <i class="material-icons">add</i>
    </button>
    <input 
     :value="title"
     :placeholder="placeholder"
     type="text"
     @input="title = $event.target.value"
     @keypress.enter="createTodo"/>
  </div>
</template>

<script>
export default {
  data(){
    return{
      title:'',
      placeholder:'할 일을 추가하세요.'
    }
  },methods:{
    createTodo(){
      const validatedTitle = this.title && this.title.trim()
      if(!validatedTitle){
        alert('유효하지 않은 제목입니다.')
        this.title = this.title.trim()
        return
      }
      //$emit : 부모로 create-todo이름의 title데이터 전달 
      //this.$emit('create-todo',this.title) 
      //vuex store 사용으로 사용 안함.
      this.$store.dispatch('todoApp/createTodo',this.title)//createTodo만 사용 하면 store/index.js에 있는 actions 를 참조
      this.title=''
      
      this.$nextTick(() =>{
        window.scrollTo(0,document.body.scrollHeight)
      })
      
    }
  }
}
</script>

