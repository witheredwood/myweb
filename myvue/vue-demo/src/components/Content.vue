<template>
    <!-- 页面样式 -->
    <div id="app">
        <h1>这是内容页</h1>
    </div>
</template>

<script>
    export default {
      name: 'Content',
      beforeRouteEnter: (to, from, next) => {
          console.log("beforeRouteEnter ==> 进入路由之前");
          next(vm => {   // vm 实例
            vm.getData();  // 在进入路由之前拿到数据
          });
      },
      beforeRouteLeave: (to, from, next) => {
        console.log("beforeRouteLeave ==> 离开路由之前");
        next();
      },
      methods: {
        getData: function () {
          this.axios({
            method: 'get',
            url: 'http://localhost:8080/static/mock/user.json',
          }).then((response) => {
            console.log(response.data);
          })
        }
      }
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
</style>