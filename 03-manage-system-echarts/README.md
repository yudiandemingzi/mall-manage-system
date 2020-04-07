# 封装一个ECharts组件的一点思路

`整体效果`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200330202350003-1066958504.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="480">

## 一、封装一个ECharts组件的一点思路

#### 1、绘制一个简单的图表

 ECharts上手非常简单，具体简单示例可以参考我之前写的一篇博客：[图表工具--- ECharts.js学习（一） 简单入门](https://www.cnblogs.com/qdhxhz/p/8387581.html)。

#### 2、封装思路

在实际项目开发中，我们会经常与图表打交道,比如 **订单数量表**、**商品销量表**、**会员数量表**等等，它可能是以**折线图**、**柱状图**、**饼状图**等等的方式来展现。

如果我们没有封装组件的思想的话,那么我们每次需要画一个图表都要重复类似相同的工作，而且代码看去非常冗余。所以我们就需要考虑封装一个ECharts组件，这个组件通过接收

不同的数据来渲染成不同的图表,以后当需要生成一张图表的时候，只需要把相关的数据传入到这个组件中，就会渲染对应的图表。

而这里的核心就是 **哪些数据是需要我们传入组件中的**。针对这个问题我们来看下一个ECharts最简单的示例

```javascript
  // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
```
`运行结果`

<img src="https://img2020.cnblogs.com/blog/1090617/202003/1090617-20200330203242764-1607835783.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="310">

这里展示了一个最简单的图表,官方例子地址：[5 分钟上手 ECharts](https://www.echartsjs.com/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts),下面对这些参数做个讲解

 **title** :  [标题](https://www.echartsjs.com/zh/option.html#title) 

**tooltip** : [提示框组件](https://www.echartsjs.com/zh/option.html#tooltip)

**legend** : [图例组件](https://www.echartsjs.com/zh/option.html#legend)

  **xAxis** : [直角坐标轴中的 x 轴](https://www.echartsjs.com/zh/option.html#xAxis)

  **yAxis** : [直角坐标轴中的 y 轴](https://www.echartsjs.com/zh/option.html#yAxis)

 **series** : [系列列表。每个系列通过 type 决定自己的图表类型](https://www.echartsjs.com/zh/option.html#series)

这几个组件来看 `series` 和 `xAxis` 是肯定需要外部传来的数据，**y轴** 的数据跟series中data相关不需要单独再传。至于**title** , **tooltip** , **legend**并不是图表必须的，所以

不是必须要传的。就好比你一个图表你可以没有标题。

`注意` 这里还有一点 **x轴对于柱状图、折线图相关图是一定要有的，但对于饼状图来讲它又不是必须的**，所以这里封装一个ECharts组件时,需要考虑这一点。

#### 3、封装ECharts组件

新建一个EChart.vue,作为封装ECharts的组件

```html
<template>
  <!--图表展示在这个div中-->
  <div style="height: 100%" ref="echart">
    echart
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  //接收父类两个数据 1、chartData (series数据 + x坐标系数据）2、isAxisChart （是否有x坐标系，如果false，那么上面的xData就为空）
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
    isAxisChart: {
    //默认type为true 就代表默认是有x轴的
      type: Boolean,
      default: true
    }
  },
  computed: {
    //计算 选择是有x轴 还是没有x轴的数据
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    },
    //用于下面的resize 改变图表尺寸，在容器大小发生改变时需要手动调用
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  watch: {
    //监听chartData数据
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    },
    //监听isCollapse 因为头部水平扩展是一个动画需要时间，所以这里延迟300毫秒
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  data() {
    //在数据中有些数据在数据件中是写死的
    return {
      echart: null,
      axisOption: {
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '20%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#17b3a3'
              }
            }
          }
        ],
        color: [
          '#2ec7c9',
          '#b6a2de',
          '#5ab1ef',
          '#ffb980',
          '#d87a80',
          '#8d98b3',
          '#e5cf0d',
          '#97b552',
          '#95706d',
          '#dc69aa',
          '#07a2a4',
          '#9a7fd1',
          '#588dd5'
        ],
        series: []
      },
      normalOption: {
        tooltip: {
          trigger: 'item'
        },
        color: ['#0f78f4', '#dd536b', '#9462e5', '#a6a6a6', '#e1bb22', '#39c362', '#3ed1cf'],
        series: []
      }
    }
  },
  methods: {
    initChart() {
      //获取处理好的数据
      this.initChartData()
      //获取echart对象
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        //通过refs获取
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    //处理好数据
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    },
    resizeChart() {
      this.echart ? this.echart.resize() : ''
    }
  },
  mounted() {
    //resize 改变图表尺寸，在容器大小发生改变时需要手动调用（因为侧边栏是可以收缩的，所以这里图表根据是否收缩来改变图表尺寸）
    window.addEventListener('resize', this.resizeChart)
  },
  //销毁 防止内存泄漏
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>

```

这样一个简单的公共组件就完成了，接下来我们通过传入不同的数据到这个组件来渲染不同的图表。

<br>

## 二、示例

我们看到在首页有三个图表,那我们这里就要组装三种不同的数据，传入到EChart.vue组件中，来生成不同的图表。

```html
<template>
   <div>
       <!--图表一 这里的数据是折线图-->
    <echart style="height: 280px" :chartData="echartData.order"></echart>
       <!--图表二 这里的数据是柱状图-->
    <echart :chartData="echartData.user" style="height: 260px"></echart>
       <!--图表三 这里的数据是饼状图 因为饼状图是不用x轴的 所以这里isAxisChart为false-->
    <echart :chartData="echartData.video" style="height: 260px" :isAxisChart="false"> 
    </div>
</template>

<script>
import Echart from '../../components/EChart'
export default {
  components: {
    Echart
  },
  data() {
    return {
      echartData: {
        //图一
        order: {
          xData: [],
          series: []
        },
        //图二
        user: {
          xData: [],
          series: []
        },
        //图三 饼状图没有x轴
        mall: {
          series: []
        }
      }
    }
  },
  methods: {
    getTableData() {
      this.$http.get('/home/getData').then(res => {
        res = res.data
        // 订单折线图
        const order = res.data.orderData
        //x轴数据 为日前
        this.echartData.order.xData = order.date
        // 第一步取出series中的name部分——小米,三星、苹果...
        let keyArray = Object.keys(order.data[0])
        // 第二步，循环添加数据
        keyArray.forEach(key => {
          this.echartData.order.series.push({
            //如果有需要还可以做一步抓换比如：后台返回性别是1、2。那这里key === 1 ? '男' : 女,
            name: key === 'wechat' ? '小程序' : key,
            data: order.data.map(item => item[key]),
            type: 'line'
          })
        })
        // 用户柱状图
        this.echartData.user.xData = res.data.userData.map(item => item.date)
        this.echartData.user.series.push({
          name: '新增用户',
          data: res.data.userData.map(item => item.new),
          type: 'bar'
        })
        this.echartData.user.series.push({
          name: '活跃用户',
          data: res.data.userData.map(item => item.active),
          type: 'bar',
          barGap: 0
        })
        // 商品饼图
        this.echartData.mall.series.push({
          data: res.data.mallData,
          type: 'pie'
        })
      })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>
```

大致的思路就是这样的,如果你想在组件中加入title等参数，那也可以修改下这个组件就可以了。

**总结下封装组件的基本思路**

```
1、观察⽂档，考虑组件需要的基本参数
2、参数筛选，分为从⽗组件传来的参数和⾃身的参数
3、完善组件，观察设计图，找不同，在⽂档中寻找对应的配置项
4、细节优化，考虑多种场景下，图表⾃适应的处理
```

<br>

