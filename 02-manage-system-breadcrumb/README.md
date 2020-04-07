# <center>面包屑 + Tag标签切换功能</center>

这篇主要讲解 **面包屑** +  **Tag标签切换功能**：

`整体效果`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200328235021075-64252842.gif" style="border: 1px dashed rgb(255, 0, 0);" width="660" height="420">
<br>
<br>
<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200328235040766-791087150.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="660" height="220">

`说明` 从上面图片可以看出，面包屑是在head部分组件里,Tag标签虽然不再head部分组件里,但是它在整个管理后台系统中是会一直存在的，所以需要在Main.vue中。

这两块功能的实现,主要依赖Element-ui两个样式 [Breadcrumb 面包屑](https://element.eleme.cn/#/zh-CN/component/breadcrumb)  +  [Tag 标签](https://element.eleme.cn/#/zh-CN/component/tag)

##  一、面包屑功能 

#### 1、背景

整个大致逻辑是这样的,首先是面包屑 `首页` 一定要存在的,接下来 **侧边组件** 点击某菜单,把这个数据存到vuex中，然后 **头部组件** 来获取vuex中这个数据并展示。

#### 2、CommonAside(侧边栏)

侧边栏需要做的就是当click当前菜单 就要把这个数据存储到vuex中，为了头部组件来获取展示这份数据。

这里定义了一个click事件

```javascript
    methods: {
    //跳转路由 根据名称跳转
    clickMenu(item) {
      //调用vuex的selectMenu方法存储数据
      this.$store.commit('selectMenu', item)
      //跳转路由
      this.$router.push({ name: item.name })
    }
  }
```

#### 3、CommonHeader(头部组件)

因为面包屑是写在CommonHeader中，所以这里展示这部分代码

```html
 <el-breadcrumb separator-class="el-icon-arrow-right">
                <!--很明显 首页 一定是存在的 所以这里直接写死-->
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <!--第二级菜单名称 就要看左侧组件有没有点击指定菜单，没有那就只显示首页 点击就显示当前菜单名称-->
                <el-breadcrumb-item :to="current.path" v-if="current" >{{current.label}}</el-breadcrumb-item>
 </el-breadcrumb>

<script>
  //js部分
    import { mapState } from 'vuex'
    export default {
        computed: {
          //获取vuex数据的另一种写法
            ...mapState({
                current: state => state.tab.currentMenu
            })
        } 
    }
</script>
```

#### 4、vuex配置

这里用了一个属性为 **currentMenu** 的来存储当前菜单信息

```javascript
 state: {
    //当前菜单
    currentMenu: null,
  },
  mutations: {
    selectMenu(state, val) {
    //如果点击应该是首页的话 要把这份数据清空 因为头部组件已经把首页写死了 只有点击不是首页菜单才存储当前菜单
     val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
    }
  },
}
```

这样整个面包屑的功能就是实现了。

<br>

##  二、Tag标签切换功能

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200328235102488-2054721024.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="600" height="120">

#### 1、背景

从上面效果来看，我们发现：

```
1、首页的tag一开始就会存在，而且是不能进行删除的
2、当点击左侧栏的时候,如果tag没有该菜单名称则新增，如果已经有了那么当前tag背景为蓝色。
3、删除当前tag，如果是最后一个，那么路由调整到它前面那个标签并且背景变蓝，如果不是最后一个那么路由调整到它后面那个标签并且背景变蓝。
4、还有我们注意这个tag不论路由如何切换都是会存在的，所以这个tag一定要存在我们之前定义的Main.vue中。
```

#### 2、CommonTab.vue(标签组件)

```html
<template>
  <div class="tabs">
    <!--closable这里说明home是不能关闭的-->
    <el-tag
      :key="tag.name"
      size="small"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      @close="handleClose(tag, index)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
      //获取vuex的标签集合数据
    ...mapState({
      tags: state => state.tab.tabsList
    })
  },
  methods: {
    ...mapMutations({
      close: 'closeTab'
    }),
    //关闭标签
    handleClose(tag, index) {
      let length = this.tags.length - 1
      //vuex调方法的另一种写法
      this.close(tag)
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tag.name !== this.$route.name) {
        return
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        this.$router.push({ name: this.tags[index - 1].name })
      } else {
        // 否则往右边跳转
        this.$router.push({ name: this.tags[index].name })
      }
    },

    //选择标签跳转路由
    changeMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>
```

#### 3、vuex配置

```javascript
export default {

    //存储数据
    state: {
        currentMenu: null,
        tabsList: [
            {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 'home'
            }
        ]
    },
    //调用方法
    mutations: {

        //选择标签 选择面包屑
        selectMenu(state, val) {
            if (val.name === 'home') {
                state.currentMenu = null
            } else {
                state.currentMenu = val
                //如果等于-1说明tabsList不存在那么插入，否则什么都不做
                let result = state.tabsList.findIndex(item => item.name === val.name)
                result === -1 ? state.tabsList.push(val) : ''

            }
            // val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
        },
        //关闭标签
        closeTab(state, val) {
            let result = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(result, 1)
        },
    },
    actions: {}
}
```

####4、Main.vue(主组件)

既然tag在整个后台都要显示，那么就需要将CommonTab.vue加入到Main.vue中。

```html
<template>
    <el-container style="height: 100%">
        <el-aside width="auto">
            <common-aside></common-aside>
        </el-aside>
        <el-container>
            <el-header>
                <common-header></common-header>
            </el-header>
            <!--加入CommonTab-->
            <common-tab></common-tab>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>
```
