import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 完整路由代码
export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/Main'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/Home/Home'),
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/UserManage/UserManage'),
        },
        {
          path: '/mall',
          name: 'mall',
          component: () => import('@/views/MallManage/MallManage'),
        },
        {
          path: '/page1',
          name: 'page1',
          component: () => import('@/views/Other/PageOne'),
        },
        {
          path: '/page2',
          name: 'page2',
          component: () => import('@/views/Other/PageTwo'),
        },
      ]
    }
  ]
})