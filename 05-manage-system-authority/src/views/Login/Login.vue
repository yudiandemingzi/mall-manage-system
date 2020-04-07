<template>
  <el-form :model="form" status-icon :rules="rules" ref="form" label-width="100px" class="login-container">
    <h3 class="login_title">系统登录</h3>
    <el-form-item label="用户名" label-width="80px" prop="username" class="username">
      <el-input type="input" v-model="form.username" autocomplete="off" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="80px" prop="password">
      <el-input type="password" v-model="form.password" autocomplete="off" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item class="longin_submit">
      <el-button type="primary" @click="login" class="longin_submit">登陆</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            message: '用户名长度不能小于3位',
            trigger: 'blur'
          }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
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
}
</script>

<style>
.login-container {
  border-radius: 15px; /*圆角*/
  background-clip: padding-box; /*背景被裁剪到内边距框*/
  margin: 180px auto; /*边界 距上180px 左右居中*/
  width: 350px; /*表单宽度*/
  padding: 35px 35px 15px 35px; /*填充*/
  background: #fff;
  border: 1px solid #eaeaea; /*边框*/
  box-shadow: 0 0 25px #cac6c6; /*隐形*/
}

.login_title {
  margin: 0px auto 40px auto; /*上边界0 下边边界40 左右居中*/
  text-align: center; /*上面仅是标签居中 这里是文字居中*/
  color: #505458;
}

.longin_submit {
  margin: 10px auto 0px auto; /*上边界10 下边边界40 左右居中*/
}
</style>
