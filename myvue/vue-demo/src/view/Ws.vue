<template>
    <div class="ws">
      <h1>这是ws测试页面</h1>
      {{msg}}
    </div>
</template>

<script>
  const socket = new WebSocket('ws://localhost:8000/websocket');

  export default {
    name: "Ws",
    data() {
      return {
        msg: null,
      }
    },
    methods: {
      handleWsOpen (event) {
        console.log("打开连接 -------- ");
        // socket.send("vue ==> 服务器 发送了一条消息：已建立连接");
      },
      handleWsClose (event) {
        console.log("关闭连接 -------- ");
      },
      handleWsMessage (event) {
        console.log("收到消息 -------- ");
        // console.log(event.data);
        let data = JSON.stringify(event.data);
        console.log("data ==> ", data);
        this.msg = data;
      },
    },
    mounted() {
      socket.addEventListener("open", this.handleWsOpen.bind(this), false);
      socket.addEventListener("close", this.handleWsClose.bind(this), false);
      socket.addEventListener("message", this.handleWsMessage.bind(this), false);
      socket.addEventListener("error", this.handleWsMessage.bind(this), false);
    }
  }
</script>

<style scoped>

</style>
