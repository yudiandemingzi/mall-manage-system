# <center>总述</center>

## 一、项目效果 

`整体效果`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200326220854772-1538499772.gif" style="border: 1px dashed rgb(255, 0, 0);" width="800" height="400">

`登陆页`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200326220909756-2031447460.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="800" height="450">


`后台首页`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200326220919921-1571288028.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="800" height="567">


`用户管理页`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200326220933117-387212157.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="800" height="384">



`说明`  这里所有的数据都不是直接通过后端获取的, 而是通过Mock这个工具来模拟后端返回的接口数据。

<br>

##二、项目介绍

#### 1、技术架构

项目总体技术选型

```
vue-cli 3.0 + element-ui + vue-router + axios +  Vuex + Mock + echarts
```

#### 2、测试账号地址

`访问地址`: 待搭建

**账号**：admin  **密码**：admin

**账号**：xiaoxiao   **密码**：xiaoxiao

因为菜单是根据不同用户权限动态生成的，所以这里两个账户所看到的后台菜单是不一样的。

#### 3、项目整体结构

```makefile
mall-manage-system # 电商后台管理系统
|
---src
      |
      ---api
           |# axios实例 编写统一的请求响应拦截信息
            ---annotation
      ---assets # 存放静态资源和全局自定义样式
           |# 存放图片
            ---images 
           |# 存放自定义样式
            ---scss
      --- components # 小组件 一般这里的都是可以复用的
           |#首页侧边栏
            ---CommonAside.vue
           |#首页头部
            ---CommonHeader.vue
           |# element-ui 封装成公共from组件
            ---CommonForm.vue
           |# element-ui 面包屑组件
            ---CommonTab.vue
           |# element-ui 封装成公共表格组件
            ---CommonTable.vue 
           |# echarts 封装成公共图表组件
            ---EChart.vue  
        --- mock #模拟后端接口 返回数据
           |
        --- router#路由配置信息  
           |
        --- store #vuex配置信息
           |
        --- view # 页面级组件，一般复用性很低
           |# 首页相关组件
            ---Home
           |# 登陆页相关组件 
            ---Login
           |# 用户管理相关组件
            ---UserManage 
           |# 商品管理相关组件
            ---MallManage
           |# 主入口
            ---Main.vue
        --- App.vue
        --- main.js
        --- vue.config.js
```

#### 4、说明

接下来会分五篇博客大致讲下这个项目一些核心代码的实现

```
1、项目搭建+使⽤element实现⾸⻚布局
2、顶部导航菜单及与左侧导航联动的⾯包屑实现
3、封装一个ECharts组件的一点思路 
4、封装一个Form表单组件和Table表格组件 
5、企业开发之权限管理思路讲解
```


