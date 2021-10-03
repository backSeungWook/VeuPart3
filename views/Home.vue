<template>
  <section class="home">
    <div>
      <h1>
        Baxk's Home page!!!
      </h1>
      <h2 @click="$router.push('/about')">
        About
      </h2>
      <h2 @click="toTodoApp">
        Todo App Start
      </h2>
      
      <!--tag : 어떠한 HTML 태그로 -->
      <router-link to="/todos" tag="h2"> 
        router-link Todos
      </router-link>
      
      
    </div>
  </section>
</template>

<script>
export default {
  methods:{
    toTodoApp(){
      this.$router.push('/todos')//push는 페이지 이동..
    }
  }
}
</script>