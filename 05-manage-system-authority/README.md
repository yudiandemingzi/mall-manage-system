# <center>权限管理思路讲解</center>

这篇主要讲解权限相关的功能：

`整体效果`

admin用户看到的菜单

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200407193308552-1764988568.gif" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="320">

xiaoxiao用户看到的菜单

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200407193318070-994462597.gif" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="320">

可以发现不同的用户所看到侧边栏的菜单是不一样的。

简单来讲大致需要满足的功能就是：

```
1、不同的用户会根据权限不同，在后台管理系统渲染不同的菜单栏。
2、用户登陆之后,会获取路由菜单和一个token,之后跳转的页面都需要带着token。
3、用户退出登陆,清除动态路由,清除token。跳转到login页面。
4、如果当前没有token，那么跳转到任何页面都应该重定向到login页面。
```

##  一、权限管理代码思路讲解 


####1、登陆所做的事情

登陆操作应该至少要做三件事情

1、获取当前用户对应的菜单栏的菜单,并存储到vuex和cookies中。

2、获取当前用户的Token，存储到vuex和cookie中

3、获取当前的菜单生成动态路由。


`代码`

```javascript
  methods: {
    login() {
      this.$http.post('api/permission/getMenu', this.form).then(res => {
        res = res.data
        if (res.code === 20000) {
          //先清除 房子重复加入
          this.$store.commit('clearMenu')
          //再加入
          this.$store.commit('setMenu', res.data.menu)
          //放入token
          this.$store.commit('setToken', res.data.token)
          //添加动态路由
          this.$store.commit('addMenu', this.$router)
          //跳转到首页
          this.$router.push({ name: 'home' })
        } else {
          //如果失败 提示失败信息
          this.$message.warning(res.data.message)
        }
      })
    }
  }
```


####2、退出登陆所做的事情

退出登陆所做的事情就和登陆相反,主要做两件事情1、清除vuex和cookie中的菜单 2、清除vuex和cookie中的token

`代码`
```javascript
logOut() {
      //清除token
      this.$store.commit('clearToken')
      //清除菜单
      this.$store.commit('clearMenu')
      //重定向 一般是登陆页
      location.reload()
    }
```


####3、路由守卫所做的事

因为是后台管理系统,所以在我们在每切换一个路由都需要判断当前token是否存在,这个时候就需要通过路由守卫来实现。

```javascript
router.beforeEach((to, from, next) => {
  // 防止刷新后vuex里丢失token
  store.commit('getToken')
  // 防止刷新后vuex里丢失标签列表tagList
  store.commit('getMenu')
  let token = store.state.user.token
  // 过滤登录页，因为去登陆页不需要token(防止死循环)
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})
```

整个过程大家就是这样。现在展示vuex相关的代码。

####4、vuex存放token相关方法。

```javascript
import Cookie from 'js-cookie'
export default {
  state: {
    token: ''
  },
  mutations: {
    //存放token
    setToken(state, val) {
      state.token = val
      Cookie.set('token', val)
    },
    //清空token
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    //获取token
    getToken(state) {
      state.token = Cookie.get('token')
    }
  },
  actions: {}
}

```

####5、vuex存放菜单相关方法

```javascript
import Cookie from 'js-cookie'
export default {
  state: {
    menu: []
  },
  mutations: {
    setMenu(state, val) {
      //vuex添加
      state.menu = val
      //cookie也添加
      Cookie.set('menu', JSON.stringify(val))
    },
    clearMenu(state) {
      //清除也一样 vuex和cookie都清除
      state.menu = []
      Cookie.remove('menu')
    },
    addMenu(state, router) {
      if (!Cookie.get('menu')) {
        return
      }
      //取出cookie数据 给vuex
      let menu = JSON.parse(Cookie.get('menu'))
      state.menu = menu
      //添加动态路由 主路由为Main.vue
      let currentMenu = [
        {
          path: '/',
          component: () => import(`@/views/Main`),
          children: []
        }
      ]
      //如果是一级菜单 那么菜单名称肯定有路由 如果是二级菜单那么一级没有 二级有路由
      menu.forEach(item => {
        if (item.children) {
          item.children = item.children.map(item => {
            item.component = () => import(`@/views/${item.url}`)
            return item
          })
          currentMenu[0].children.push(...item.children)
        } else {
          item.component = () => import(`@/views/${item.url}`)
          currentMenu[0].children.push(item)
        }
      })
      //添加动态路由
      router.addRoutes(currentMenu)
    }
  },
  actions: {}
}
```

整个电商后台管理系统相关内容到这里就已经写完了。

<br>

