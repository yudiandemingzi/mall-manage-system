#  <center>项目搭建 + ⾸⻚布局实现</center>

这篇主要讲解 **项目搭建 + 后台⾸⻚布局实现** ：

`整体效果`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200328105838850-190800795.gif" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="350">

<br>

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200328105850541-224594930.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="350">

后台首页按布局一共包含3个部分:  **1、左侧栏部分  2、头部部分 3、内容部分。**

`说明` 在整个后台管理系统中，**左侧栏和头部部分是应该一直在页面中展示的**，所以对于每个页面这两个组件都应该存在,而 **内容部分** 才是通过router的跳转而跳到不同的组件。

下面先把整个项目搭建一下，然后再来讲解上面三个部分

## 一、项目搭建 

#### 1、环境搭建

```php
#1、安装node （node -v查询版本号）
node 安装 

#2、安装淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org

#3、安装 webpack，以全局的方式安装
npm install webpack -g

#4、全局安装vue以及脚手架vue-cli
npm install @vue/cli -g --unsafe-perm

#5、创建vue项目 mall-manage-system是你起的项目名称
vue create mall-manage-system

#6、运行当前项目 这个整个项目就搭建好了
npm run serve
```

在安装中可能会存在的问题

1、[node升级后，项目中的node-sass报错的问题](https://www.cnblogs.com/milo-wjh/p/9175138.html)

2、[npm install 报错，提示 gyp ERR! stack Error: EACCES: permission denied 解决方法](https://blog.csdn.net/tianyaopen/article/details/103992397)

#### 2、项目初期搭建

如果上面都安装成功，那么通过 **npm run serve** 就可用启动该项目了。这里把简单说明下一些公共配置

`1、main.js(主文件)`

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'  //引入 vue-router
import store from './store'    //引入 vuex
// 全局配置
import '@/assets/scss/reset.scss' //全局样式
import 'element-ui/lib/theme-chalk/index.css' //element-ui样式
import http from '@/api/config'  //axios
import './mock'   // mockjs
// 第三方包
import ElementUI from 'element-ui'
Vue.use(ElementUI)
Vue.prototype.$http = http
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```

`2、router(路由跳转配置)`

`router作用`：简单理解就是帮助组件之间跳转用的。

这里为了性能都采用懒加载，还有这里不管先登陆登陆页面 默认跳转组件为 **Main.vue**

```javascript
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
```

`3、vuex(存储共享数据)`

 `vuex作用`：vuex解决了组件之间同一状态的共享问题。

```js
export default {
  //存储数据
  state: {
    isCollapse: false
  },
  //调用方法
  mutations: {
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {}
}
```

这里先只设定一个全局数据isCollapse，用于侧边栏是否水平展开。

`4、axios`

`axios作用`：axios主要是用于向后台发起请求的，还有在请求中做更多是可控功能。

```js
import axios from 'axios'

// 创建一个axios实例
const service = axios.create({
  // 请求超时时间
  timeout: 3000
})

export default service
```

其它的这里就不详细讲解了，在文章最下面会附上github地址

<br>

## 二、Main.vue 

这个是后台系统的主组件，它采用的布局是 element-ui的 Container 布局容器 [Container 布局容器](https://element.eleme.cn/#/zh-CN/component/container)

```html
<template>
    <el-container style="height: 100%">
        <!--左侧栏-->
        <el-aside width="auto">
            <!--左侧栏控件-->
            <common-aside></common-aside>
        </el-aside>
        <!--右侧栏-->
        <el-container>
            <!--header部分-->
            <el-header>
                <!--header部分控件-->
                <common-header></common-header>
            </el-header>
            <el-main>
   <!--左侧栏 和 header部分对于整个后台部分都是不变的，唯一变的就是上面3的部分，这里就通过router-view来展示所需控件-->
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import CommonAside from '../components/CommonAside'
    import CommonHeader from "../components/CommonHeader";

    export default {
        components: {
            CommonAside,
            CommonHeader
        }
    }
</script>

```

这样整个后台管理系统的整个轮廓就定下来了，接下来通过路由的切换的组件展示在`router-view`的位置。

<br>

## 三、左侧栏部分(CommonAside.vue)  

它采用的布局是 element-ui的 [NavMenu 导航菜单](https://element.eleme.cn/#/zh-CN/component/menu)

```html
<template>
  <!--collapse 是否水平折叠收起菜单-->
  <el-menu
    :collapse="isCollapse"
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!--是否水平折叠收起菜单 会影响这里字段的显示 -->
    <h3 v-show="isCollapse">偶囧</h3>
    <h3 v-show="!isCollapse">偶囧后台管理系统</h3>
    <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path" @click="clickMenu(item)">
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu :index="item.label" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="subItem.path" v-for="(subItem, subIndex) in item.children" :key="subIndex" @click="clickMenu(subItem)">
          <i :class="'el-icon-' + subItem.icon"></i>
          <span slot="title">{{ subItem.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  //计算属性
  computed: {
    //没有子菜单
    noChildren() {
      return this.menu.filter(item => !item.children)
    },
    //有子菜单 (这样设置会有一个问题 就是有子菜单的 永远会在没有子菜单的下面）
    hasChildren() {
      return this.menu.filter(item => item.children)
    },
    isCollapse() {
      // 这里的数据就是从vuex取得
      return this.$store.state.tab.isCollapse
    }
  },
  data() {
    return {
      menu: [
        {
          path: '/user',
          name: 'user',
          label: '用户管理',
          icon: 'user',
          url: 'UserManage/UserManage'
        },
        {
          label: '其他',
          icon: 'location',
          children: [
            {
              path: '/page1',
              name: 'page1',
              label: '页面1',
              icon: 'setting',
              url: 'Other/PageOne'
            },
            {
              path: '/page2',
              name: 'page2',
              label: '页面2',
              icon: 'setting',
              url: 'Other/PageTwo'
            }
          ]
        }
      ]
    }
  },
  methods: {
    //跳转路由 根据名称跳转
    clickMenu(item) {
      this.$router.push({ name: item.name })
    }
  }
}
</script>
```

<br>

##  四、header部分(CommonHeader.vue) 

这里通过点击那个图标来控制：**左侧栏是否水平折叠收起菜单，所以这里来修改vuex中 isCollapse 数据。**

它采用的布局是 element-ui的 [Dropdown 下拉菜单](https://element.eleme.cn/#/zh-CN/component/dropdown)

```html
<template>
    <header>
        <div class="l-content">
            <el-button plain icon="el-icon-menu" size="mini" @click="collapseMenu"></el-button>
            <h3 style=" color : #fff">首页</h3>
        </div>
        <div class="r-content">
            <el-dropdown trigger="click" size="mini">
                <span class="el-dropdown-link"><img :src="userImg" class="user"/></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                userImg: require('../assets/images/user.png')
            }
        },
        methods: {
            //控制左侧菜单是否折叠
            collapseMenu() {
                this.$store.commit('collapseMenu')
            },
            //退出登陆
            logOut() {
                location.reload()
            }
        }
    }
</script>
```

<br>

##  五、Home.vue

它采用的布局是 element-ui的 [Card 卡片](https://element.eleme.cn/#/zh-CN/component/card) + [Layout 布局](https://element.eleme.cn/#/zh-CN/component/layout)

```html
<template>
    <el-row class="home" :gutter="20">
     <!--span默认一共是24，这里占8 下面占16，所以这两个分隔栏所占的宽度 是1:2-->
    <el-col :span="8" style="margin-top: 20px">
        <!--shadow属性设置卡片阴影出现的时机-->
        <el-card shadow='hover'>
            <div class="user">
                <img :src="userImg"/>
                <div class="userinfo">
                    <p class="name">Admin</p>
                    <p class="access">超级管理员</p>
                </div>
            </div>
            <div class="login-info">
                <p>上次登录时间：<span>2019-10-20</span></p>
                <p>上次登录地点：<span>北京</span></p>
            </div>
        </el-card>
        <el-card style="height: 460px ; margin-top: 20px">
            <el-table :data="tableData">
                <el-table-column show-overflow-tooltip v-for="(val, key) in tableLabel" :key="key" :prop="key"
                                 :label="val"></el-table-column>
            </el-table>
        </el-card>
    </el-col>
        <el-col :span="16" style="margin-top: 20px">
            <div class="num">
                <el-card shadow="hover" v-for="item in countData" :key="item.name" :body-style="{ display: 'flex', padding: 0}">
                    <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
                    <div class="detail">
                        <p class="num">￥ {{ item.value }}</p>
                        <p class="txt">{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
            <el-card shadow="hover" style="height: 280px">
            </el-card>
            <div class="graph">
                <el-card shadow="hover" style="height: 260px">
                </el-card>
                <el-card shadow="hover" style="height: 260px">
                </el-card>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        data() {
            return {
                userImg: require('../../assets/images/user.png'),
                countData: [],
                tableData: [],
                tableLabel: {
                    name: '课程',
                    todayBuy: '今日购买',
                    monthBuy: '本月购买',
                    totalBuy: '总购买'
                }
            }
        },
        methods: {
            getTableData() {
                this.$http.get('/home/getData').then(res => {
                    res = res.data
                    this.tableData = res.data.tableData
                })
            }
        },
        //一进组件就会去请求后端接口 获取首页数据
        created() {
            this.getTableData()
        }
    }
```

<br>

