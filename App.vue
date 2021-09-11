<template>
  <h1 >{{ msg }}</h1>
</template>

<script>
export default{
  data(){
    return{
      msg: 'Hello Vue Test'
    }
  }
}
</script>

<style scoped lang="scss">
$color:red;
h1{
  color: $color;
  display: flex;
  
}
</style>