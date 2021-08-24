<template>
    <!-- 页面样式 -->
    <div id="app">
        <h1>这是首页</h1>
<!--        <router-link :to="{name: 'UserList', params: {id: 1}}">list</router-link>-->
        <router-link to="/user/list">list</router-link>
        <router-link to="/user/profile">profile</router-link>
<!--      <main id="main-view">-->
        <router-view ></router-view>
<!--      </main>-->
    </div>
</template>

<script>
    export default {
        name: 'Main',
    }
</script>

<style scoped>
    /* 页面标签样式 */
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

  #main-view {
    background: tan;
  }
</style>
