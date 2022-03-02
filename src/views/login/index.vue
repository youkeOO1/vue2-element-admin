<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>
      <!-- username  -->
      <el-form-item>
        <span class="svg-containter">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <!-- password -->
      <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="left" manual>
        <el-form-item>
          <span class="svg-containter">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            name="password"
            :type="passwordType"
            tabindex="2"
            autocomplete="off"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye': 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  data() {
    /**
     * 检查账户
     */
    const validateUsername = (rule, value, callback) => {
      if (validUsername(value)) {
        callback()
      } else {
        callback(new Error('请输入用户名: admin 或者 editor'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route, 'route-watch')
        const query = route.query
        if (query) {
          // 获取路由的下一跳
          this.redirect = query.redirect
          // 获取路由的其他参数
          this.otherQuery = this.getOtherQuery(query)
          console.log(this.redirect, this.otherQuery)
        }
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 展示密码
     */
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    /**
     * 登录
     */
    handleLogin() {
      console.log('开始登录')
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 跳转路径 两种情况
            // 第一种: 登录后跳转到首页
            // 第二种：从某个页面跳转到登录页面，登录成功后再跳转回去
            // 使用 redirect 实现，每次跳转到登录页面传递过来一个 redirect 参数，当 redirect 为空时说明需要跳转到首页
            // this.$router.push({
            //   path: this.redirect || '/',
            //   query: this.otherQuery
            // })
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          }).catch(() => {
            // 发送的登录请求发生错误
            this.loading = false
          })
        } else {
          return false
        }
      })
    },

    /**
     * 获取其他查询参数
     * /foo?user=1
     * @param { Object } query 查询参数
     */
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          // 获取不是 redirect 的查询参数 redirect 的参数会指向页面
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;
  .login-container {
    .el-input {
      display: inline-block;
      width: 85%;
      height: 47px;
      input {
        background: transparent;
        border: 0px;
        border-radius: 0px;
        height: 47px;
        padding: 12px 5px 12px 15px;
        color: $light-gray;
        caret-color: $cursor;
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light-gray: #eee;
  .login-container {
    background: $bg;
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    .login-form {
      width: 520px;
      max-width: 100%;
      margin: 0 auto;
      overflow: hidden;
      padding: 160px 35px 0;
      box-sizing: border-box;
      position: relative;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light-gray;
        text-align: center;
        font-weight: bold;
        margin: 0px auto 40px auto;
      }
    }
    .svg-containter {
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      padding: 6px 5px 6px 15px;
      box-sizing: border-box;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
