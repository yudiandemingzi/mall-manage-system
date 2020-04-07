# <center>封装一个Form表单组件和Table组件</center>

这篇主要讲解实现图表的功能：

`整体效果`

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200406212604578-1988887549.gif" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="310">

**图片效果**

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200406211737316-2130603644.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="360">


## 一、封装一个Form表单组件

#### 1、封装思路

我们需要看下一个基础form组件，需要哪些数据。我们看下官网一个示例 [Form 表单](https://element.eleme.cn/#/zh-CN/component/form)

```html
<template>
<el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="姓名" >
        <el-input v-model="form.name" style="width: 195px"></el-input>
    </el-form-item>
    <el-form-item label="国籍">
        <el-select v-model="form.region" placeholder="请选择国籍">
            <el-option label="中国" value="china"></el-option>
            <el-option label="美国" value="America"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="爱好">
        <el-checkbox-group v-model="form.type">
            <el-checkbox label="画画" name="type" ></el-checkbox>
            <el-checkbox label="吹泡泡" name="type"></el-checkbox>
            <el-checkbox label="放风筝" name="type"></el-checkbox>
            <el-checkbox label="看佩琦" name="type"></el-checkbox>
        </el-checkbox-group>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit" size="small">立即创建</el-button>
    </el-form-item>
</el-form>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    type: []
                }
            }
        },
        methods: {
            onSubmit() {
                console.log('提交 -> ' + this.form.name + " " + this.form.region + " " + this.form.type );
            }
        }
    }
</script>
```

`运行结果`

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200406211830668-1185314968.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="660">


从这个简单的示例,至少有两份数据是需要父组件传入到表单组件中的:

1、v-model对应的数据,这份数据是用户选择好后给父组件的，所以是双向绑定的。

2、label 对应的数据，这里是写死的，既然要封装成一个控件那么这份数据也需要父组件传过来。

`注意` 这里需要注意的一点就是标签的类型是input 还是select是需要外面传来过来的数据告知的。同时如果是select那么还需要把option下面的数据返回。

#### 2、封装Form组件

新建一个CommonForm.vue,作为封装Form的组件

```html
<template>
    <!--是否行内表单-->
    <el-form :inline="inline" :model="form" ref="form" label-width="100px">
        <!--标签显示名称-->
        <el-form-item v-for="item in formLabel" :key="item.model" :label="item.label">
            <!--根据type来显示是什么标签-->
            <el-input v-model="form[item.model]" :placeholder="'请输入' + item.label" v-if="item.type==='input'"></el-input>
            <el-select v-model="form[item.model]" placeholder="请选择" v-if="item.type === 'select'">
                 <!--如果是select或者checkbox 、Radio就还需要选项信息-->
                <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-switch v-model="form[item.model]" v-if="item.type === 'switch'"></el-switch>
            <el-date-picker v-model="form[item.model]" type="date" placeholder="选择日期" v-if="item.type === 'date'" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <!--留一个插槽-->
        <el-form-item><slot></slot></el-form-item>
    </el-form>
</template>

<script>
    export default {
        //inline 属性可以让表单域变为行内的表单域
        //form 表单数据 formLabel 是标签数据
        props: {
            inline: Boolean,
            form: Object,
            formLabel: Array
        }
    }
</script>

```

这样一个简单的表单公共组件就完成了。

<br>

## <font color=#FFD700> 一、封装一个Table组件 </font>

#### 1、封装思路

同样我们需要去看下element有关表格最简单的示例。[Table 表格](https://element.eleme.cn/#/zh-CN/component/table)

`代码示例`

```html
<template>
    <el-table
            :data="tableData"
            style="width: 100%">
        <el-table-column
                prop="date"
                label="日期"
                width="180">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="address"
                label="地址">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [{
                    date: '2017-05-04',
                    name: '小小',
                    address: '浙江省杭州市千岛湖镇 阳光路'
                }, {
                    date: '1956-05-04',
                    name: '爷爷',
                    address: '浙江省杭州市千岛湖镇 清波花园'
                }, {
                    date: '1958-05-04',
                    name: '奶奶',
                    address: '浙江省杭州市千岛湖镇 冬瓜乌'
                }]
            }
        }
    }
</script>

```

`运行结果`

<img src="https://img2020.cnblogs.com/blog/1090617/202004/1090617-20200406211843753-1572765516.jpg" style="border: 1px dashed rgb(255, 0, 0);" width="700" height="260">

从这个简单的示例,至少也是两份数据是需要父组件传入到表格组件中的：

1、v-model对应的数据,这份数据是用户选择好后给父组件的。

2、label 对应的数据，这里是写死的，既然要封装成一个控件那么这份数据也需要外面传过来。

`注意` 这里除了上面这两份数据外,还有一份数据在实际开发中也是需要的,那就是分页信息,因为一般table数据都会比较多所以分页还是非常需要的。

#### 2、封装Table组件

新建一个CommonTable.vue,作为封装Table的组件

```html
<template>
    <div class="common-table">
        <!--stripe	是否为斑马纹  v-loading在请求数据未返回的时间有个加载的图案,提高用户体验-->
        <el-table :data="tableData" height="90%" stripe v-loading="config.loading">
            <!--第一行为序号 默认写死-->
            <el-table-column label="序号" width="85">
                <!--slot-scope="scope" 这里取到当前单元格,scope.$index就是索引 默认从0开始这里从1开始-->
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ (config.page - 1) * 20 + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <!--show-overflow-tooltip 当内容过长被隐藏时显示 tooltip-->
            <el-table-column show-overflow-tooltip v-for="item in tableLabel" :key="item.prop" :label="item.label" :width="item.width ? item.width : 125">
                <!--其实可以在上面:prop="item.prop"就可以显示表单数据 这里设置插槽的方式话更加灵活 我们可以写样式-->
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
            <!--操作-->
            <el-table-column label="操作" min-width="180">
                <template slot-scope="scope">
                    <el-button size="min" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="min" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination class="pager" layout="prev, pager, next" :total="config.total" :current-page.sync="config.page" @current-change="changePage" :page-size="20"></el-pagination>
    </div>
</template>

<script>
    // config分页数据，这里面至少包括当前页码 总数量
    export default {
        props: {
            tableData: Array,
            tableLabel: Array,
            config: Object
        },
        methods: {
            //更新
            handleEdit(row) {
                this.$emit('edit', row)
            },
            //删除
            handleDelete(row) {
                this.$emit('del', row)
            },
            //分页
            changePage(page) {
                this.$emit('changePage', page)
            }
        }
    }
</script>
```

<br>

##  三、示例

这里展示用户管理组件(UserManage.vue),它使用了上面两个封装后的组件。

```html
<template>
  <div class="manage">
      <el-dialog :title="operateType === 'add' ? '新增用户' : '更新用户'" :visible.sync="isShow">
          <common-form :formLabel="operateFormLabel" :form="operateForm" ref="form"></common-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="isShow = false">取 消</el-button>
              <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
      </el-dialog>
      <div class="manage-header">
          <el-button type="primary" @click="addUser">+ 新增</el-button>
          <common-form inline :formLabel="formLabel" :form="searchFrom">
              <el-button type="primary" @click="getList(searchFrom.keyword)">搜索</el-button>
          </common-form>
      </div>
      <!--依次是: 表格数据 表格标签数据 分页数据  列表方法 更新方法 删除方法-->
      <common-table :tableData="tableData" :tableLabel="tableLabel" :config="config" @changePage="getList()" @edit="editUser" @del="delUser"></common-table>
  </div>
</template>

<script>
    import CommonForm from '../../components/CommonForm'
    import CommonTable from '../../components/CommonTable'
    export default {
        components: {
            CommonForm,
            CommonTable
        },
        data() {
            return {
                operateType: 'add',
                isShow: false,
                tableData: [],
                tableLabel: [
                    {
                        prop: 'name',
                        label: '姓名'
                    },
                    {
                        prop: 'age',
                        label: '年龄'
                    },
                    {
                        prop: 'sexLabel',
                        label: '性别'
                    },
                    {
                        prop: 'birth',
                        label: '出生日期',
                        width: 200
                    },
                    {
                        prop: 'addr',
                        label: '地址',
                        width: 320
                    }
                ],
                config: {
                    page: 1,
                    total: 30,
                    loading: false
                },
                operateForm: {
                    name: '',
                    addr: '',
                    age: '',
                    birth: '',
                    sex: ''
                },
                operateFormLabel: [
                    {
                        model: 'name',
                        label: '姓名',
                        type: 'input'
                    },
                    {
                        model: 'age',
                        label: '年龄',
                        type: 'input'
                    },
                    {
                        model: 'sex',
                        label: '性别',
                        type: 'select',
                        opts: [
                            {
                                label: '男',
                                value: 1
                            },
                            {
                                label: '女',
                                value: 0
                            }
                        ]
                    },
                    {
                        model: 'birth',
                        label: '出生日期',
                        type: 'date'
                    },
                    {
                        model: 'addr',
                        label: '地址',
                        type: 'input'
                    }
                ],
                searchFrom: {
                    keyword: ''
                },
                formLabel: [
                    {
                        model: 'keyword',
                        label: '',
                        type: 'input'
                    }
                ]
            }
        },
        methods: {
            getList(name = '') {
                this.config.loading = true
                // 搜索时，页码需要设置为1，才能正确返回数据，因为数据是从第一页开始返回的
                name ? (this.config.page = 1) : ''
                this.$http
                    .get('/api/user/getUser', {
                        params: {
                            page: this.config.page,
                            name
                        }
                    })
                    .then(res => {
                        this.tableData = res.data.list.map(item => {
                            item.sexLabel = item.sex === 0 ? '女' : '男'
                            return item
                        })
                        this.config.total = res.data.count
                        this.config.loading = false
                    })
            },
            addUser() {
                this.operateForm = {}
                this.operateType = 'add'
                this.isShow = true
            },
            editUser(row) {
                this.operateType = 'edit'
                this.isShow = true
                this.operateForm = row
            },
            confirm() {
                if (this.operateType === 'edit') {
                    console.log(this.operateForm)
                    this.$http.post('/api/user/edit', this.operateForm).then(res => {
                        console.log(res.data)
                        this.isShow = false
                        this.getList()
                    })
                } else {
                    this.$http.post('/api/user/add', this.operateForm).then(res => {
                        console.log(res.data)
                        this.isShow = false
                        this.getList()
                    })
                }
            },
            delUser(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        let id = row.id
                        this.$http
                            .get('/api/user/del', {
                                params: {
                                    id
                                }
                            })
                            .then(res => {
                                console.log(res.data)
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })
                                this.getList()
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            }
        },
        created() {
            this.getList()
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/scss/common';
</style>

```

<br>

