import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入组件
import Content from "../components/Content";
import Main from "../components/Main";
import Login from "../view/Login";
import UserList from '../view/user/List';
import UserProfile from '../view/user/Profile';
import Ws from '../view/Ws';
import Pagination from '../view/Pagination';

// 安装路由
Vue.use(VueRouter);

// 配置导出路由
export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/content',   // 路由路径
      name: 'content',
      component: Content,  // 跳转的组件
    },
    {
      path: '/main',   // 路由路径
      name: 'main',
      component: Main,  // 跳转的组件
      children: [
        { path: '/user/list', name: 'UserList', component: UserList },
        { path: '/user/profile', name: 'UserProfile', component: UserProfile, props: true },
      ]
    },
    {
      path: '/login',   // 路由路径
      component: Login,  // 跳转的组件
    },
    {path: '/ws', component: Ws},
    {path: '/pagination', name: 'Pagination', component: Pagination},
  ]
})
