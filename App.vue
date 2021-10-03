<!-- 최상위 컴포넌트 -->
<template>
  <div>
    <router-link to="/" class="to-home">
    <!--router-link-acive: 경로상에 있는 주소이면 붇고 -->
    <!--router-link-exact-acive: router-link to="" 경로에 완전 일치하면 -->
      <i class="material-icons">home</i>
    </router-link>
    <router-view /> <!-- 연결 한 라우터 영역 등록-->
  </div>
  
</template>

<script>
export default {
  created(){
    console.log(this.$route)
  }
}
</script>

<style lang="scss">
.to-home.router-link-exact-active{
  display: none;
}

</style>