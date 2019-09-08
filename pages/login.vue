<template>
  <div class="login-comp-ct">
    <div class="header">
      Z-blog
    </div>
    <div class="main">
      <Tabs v-model="tabActive">
        <TabPane :label="tab.label" v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <Form :rules="formRules" :model="userForm" :ref="'userForm' + tab.name">
            <Form-item label="用户名" prop="username">
              <Input v-model="userForm.username" />
            </Form-item>
            <Form-item label="密码" prop="password">
              <Input v-model="userForm.password" type="password" />
            </Form-item>
            <Form-item>
              <Button type="primary" @click="submitForm('userForm' + tab.name)">{{tab.label}}</Button>
            </Form-item>
          </Form>
        </TabPane>
    </Tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Tabs, TabPane, Form, FormItem, Input, Button } from 'iview'
interface UserForm {
  username: string,
  password: string
}
const SIGNIN = 'signIn'
const SIGNUP = 'signUp'
type TAbActive = 'signIn' | 'signUp'
interface TabsArray {
  [index:number]: {name: string, label: string}
}
@Component({
  components: {
    Tabs, TabPane, Form, FormItem, Input, Button
  }
})
export default class Login extends Vue {
  userForm!: UserForm
  tabActive!: TAbActive
  tabs: TabsArray
  [property: string]: any
  $refs: any
  constructor () {
    super()
    this.tabActive = SIGNIN
    this.userForm = {
      username: '',
      password: ''
    }
    this.tabs = [
      {
        name: SIGNIN,
        label: '登录'
      },
      {
        name: SIGNUP,
        label: '注册'
      }
    ]
  }
  data () {
    return {
      formRules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ]
      }
    }
  }

  submitForm (formName: string): any {
    this.$refs[formName][0].validate((valid: any) => {
      if (valid) {
        this.$router.push({
          path: '/recommend'
        })
      } else {
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.login-comp-ct {
  height: 100%;
  min-height: 750px;
  text-align: center;
  font-size: 14px;
  background-color: #f1f1f1;
  .header{
    padding: 80px 0 0 80px;
    text-align: left;
    font-size: 48px;
    font-weight: bold;
    color: orange;
  }
  .main{
    width: 400px;
    margin: 60px auto 0;
    padding: 50px 50px 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
    vertical-align: middle;
    display: inline-block;
  }
}
</style>
