<template>
  <div id="app">
      <router-link to="/home">home</router-link>
      <br>
      <router-link to="/main">main</router-link>
      <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  mounted(){
    console.log('$router',this.$router)
    console.log('$route',this.$route)
  }
}
</script>

<style> </style>
