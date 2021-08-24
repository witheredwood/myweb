// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// element ui 组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
Vue.use(router);  // 安装路由
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,  // 配置路由
  components: { App },
  template: '<App/>',
  render: h => h(App),
})
