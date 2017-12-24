<template>
  <div id="app">
    <router-view>
      <template slot-scope="props">
        <span v-for="(item,index) in props.arr" :key="index">{{item}}1</span>
      </template>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
