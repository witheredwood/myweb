<template>
  <div id="app">
<!--    <h1>This is APP View</h1>-->
<!--    &lt;!&ndash; 链接 &ndash;&gt;-->
<!--    <router-link to="/main">首页</router-link>-->
<!--&lt;!&ndash;    <router-link to="/content">内容页</router-link>&ndash;&gt;-->
<!--    <router-link to="/login">登录</router-link>-->
    <!-- 视图。展示 template模板 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
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
