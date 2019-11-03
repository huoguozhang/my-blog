<template>
  <div class="login-comp-ct">
    <div class="header">
      Z-blog
    </div>
    <div class="main">
      <el-radio-group v-model="tabActive">
        <el-radio v-for="tab in tabs" :key="tab.name" :label="tab.name">
          {{ tab.label }}
        </el-radio>
      </el-radio-group>
      <el-form
        ref="userForm"
        align="left"
        class="my-form"
        label-position="left"
        label-width="80px"
        :rules="formRules"
        :model="userForm"
      >
        <el-form-item v-if="tabActive === 'signUp'" label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" class="w-200" prop="nickname" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" class="w-200" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" class="w-200" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">
            {{ tabs.find(v => v.name === tabActive).label }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import request from '~/client/api/index'
import { saveToken } from '~/client/utils/token'

interface UserFormType {
  username: string
  password: string
  nickname: string
}
const SIGNIN = 'signIn'
const SIGNUP = 'signUp'
type TAbActive = 'signIn' | 'signUp'
interface TabsArray {
  [index:number]: {name: string, label: string}
}

@Component({})
export default class Login extends Vue {
  [property: string]: any
  $refs: any
  tabActive: string = SIGNIN
  userForm: UserFormType = {
    username: '',
    password: '',
    nickname: ''
  }
  tabs:TabsArray = [
    {
      name: SIGNIN,
      label: '登录'
    },
    {
      name: SIGNUP,
      label: '注册'
    }
  ]
  formRules = {
    username: [
      { required: true, message: '请填写用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请填写密码', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请填写用户昵称', trigger: 'blur' }
    ]
  }
  login (username: string, password: string) {
    request.userLogin({ username, password }).then((res: any) => {
      saveToken(res.token)
      this.$router.push({
        path: '/recommend'
      })
    })
  }
  submitForm (): any {
    this.$refs.userForm.validate(async (valid: any) => {
      if (valid) {
        const { username, password, nickname } = this.userForm
        if (this.tabActive === SIGNIN) {
          this.login(username, password)
        } else {
          await request.userRegister({ username, password, nickname })
          this.login(username, password)
        }
      } else {
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.login-comp-ct {
  position: relative;
  height: 100vh;
  min-height: 600px;
  text-align: center;
  font-size: 14px;
  background: url("../assets/image/login-bg.jpg");
  background-size: cover;
  .header{
    padding: 80px 0 0 80px;
    text-align: left;
    font-size: 48px;
    font-weight: bold;
    color: orange;
  }
  .main{
    position: absolute;
    top: 80px;
    right: 160px;
    width: 400px;
    padding: 50px 50px 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
    vertical-align: middle;
    display: inline-block;
    .my-form{
      margin-top: 24px;
    }
  }
}
</style>
