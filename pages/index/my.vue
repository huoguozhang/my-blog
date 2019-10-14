<template>
  <div class="my-comp-ct">
    <div class="left">
      <div class="top">
        <div class="avatar-ct" />
        <div class="info-ct">
          <div class="nickname">
            火锅小王子
          </div>
          <div class="other-info">
            <div class="item">
              文章
              <div>88</div>
            </div>
            <div class="item">
              字数
              <div>8789</div>
            </div>
            <div class="item">
              收获喜欢
              <div>100</div>
            </div>
          </div>
        </div>
      </div>
      <Tabs>
        <TabPane icon="md-document" label="文章">
          <article-block v-for="item in 10" :key="item" />
        </TabPane>
      </Tabs>
    </div>
    <div class="right">
      <div class="title">
        <span>个人简介</span>
        <span class="cursor-p" @click="showEditForm=true">编辑</span>
      </div>
      <div class="brief">
        github: https://github.com/huoguozhang
        <br>
        掘金、思否同名：火锅小王子
        <br>
        主要工作是：前端工程师
        喜欢折腾
        <br>
        本站技术栈:
        vue vuex vue-router typescript nuxt.js iView nodejs express.js my-sql
        目前正在开发中
      </div>
    </div>
    <Modal v-model="showEditForm" title="编辑资料">
      <Form :label-width="80">
        <FormItem label="头像" :model="userForm" :rules="userFormRules">
          <imageUpload />
        </FormItem>
        <FormItem label="登录名" prop="username">
          <Input :value="userForm.username" disabled />
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="userForm.nickname" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="userForm.password" />
        </FormItem>
        <FormItem label="简介">
          <Input v-model="userForm.brief" class="my-textarea" type="textarea" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Tabs, TabPane, Dialog, Form, FormItem, Avatar, Input } from 'element-ui'
import articleBlock from '~/components/article-block/article-block.vue'
import imageUpload from '~/components/imageUpload.vue'
interface UserForm {
  username: string
  nickname: string
  password: string
  brief: string,
  avatar: string
}
@Component({
  data () {
    return {
      userFormRules: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请填写昵称', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Tabs, TabPane, articleBlock, Dialog, Form, FormItem, Avatar, Input, imageUpload
  }
})
export default class My extends Vue {
  showEditForm: boolean = false
  userForm: UserForm = {
    username: 'huoguozhang',
    password: '123',
    brief: 'hahah',
    avatar: 'hahha',
    nickname: '火锅小王子'
  }
}
</script>
<style lang="scss" scoped>
.my-comp-ct {
  display: flex;
  .left{
    width: 700px;
    .top{
      padding: 0 16px;
      display: flex;
      margin-bottom: 24px;
      .avatar-ct{
        width: 80px;
        height: 80px;
        border-radius: 40px;
        background: #3e76f6;
      }
      .info-ct{
        margin-left: 24px;
        .nickname{
          height: 31px;
          font-size: 21px;
          font-weight: 700;
        }
        .other-info{
          display: flex;
          .item{
            height: 42px;
            line-height: 1.7;
            font-size: 12px;
            margin: 0 7px 6px 0;
            padding: 0 7px 0 0;
            border-right: 1px solid #f0f0f0;
          }
        }
      }
    }
  }
  .right{
    margin-left: 24px;
    /*border: 1px solid;*/
    flex: 7;
    .title{
      display: flex;
      padding: 16px;
      justify-content: space-between;
      margin-bottom: 16px;
      font-size: 14px;
      color: #969696;
    }
    .brief{
      padding: 0 16px;
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
  .my-comp-ct{
    .my-textarea{
      .ivu-input{
        min-height: 200px !important;
      }
    }
  }
</style>
