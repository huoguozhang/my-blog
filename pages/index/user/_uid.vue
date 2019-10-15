<template>
  <div class="user-comp-ct">
    <div class="left">
      <div class="top">
        <div class="avatar-ct">
          <img v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" />
          <div v-else class="none"> 暂无头像 </div>
        </div>
        <div class="info-ct">
          <div class="nickname">
            {{ userInfo.nickname }}
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
      <el-tabs>
        <el-tab-pane icon="md-document" label="文章">
          <article-block v-for="item in 10" :key="item" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right">
      <div class="title">
        <span>个人简介</span>
        <span class="cursor-p" @click="beforeEdit">编辑</span>
      </div>
      <div class="description" v-text="userInfo.description">
      </div>
    </div>
    <el-dialog :visible.sync="showEditForm" title="编辑资料">
      <el-form ref="form" label-width="80px"  style="width: 300px;margin: 0 auto;">
        <el-form-item label="头像" :model="userForm" :rules="userFormRules">
          <imageUpload v-model="userForm.avatar" />
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input :value="userForm.username" class="w-200" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" class="w-200" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" class="w-200" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userForm.description" class="my-textarea" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button @click="showEditForm = false">
            取消
          </el-button>
          <el-button @click="submitForm" type="primary">
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { mapState } from 'vuex'
import { Vue, Component } from 'vue-property-decorator'
import articleBlock from '~/components/article-block/article-block.vue'
import imageUpload from '~/components/imageUpload.vue'
import request from '~/client/api'

interface UserForm {
  username: string
  nickname: string
  password: string
  description: string,
  avatar: string
}
@Component({
  computed: {
    ...mapState({
      currentUserInfo: state => state.user.info
    })
  },
  components: {
    articleBlock, imageUpload
  }
})
export default class User extends Vue {
  userFormRules: any = {
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
  showEditForm: boolean = false
  userInfo = {
    username: '',
    password: '',
    description: '',
    avatar: '',
    nickname: ''
  }
  userForm: UserForm = {
    username: '',
    password: '',
    description: '',
    avatar: '',
    nickname: ''
  }
  get uid () {
    return this.$route.params.uid
  }
  beforeEdit () {
    this.showEditForm = true
    this.userForm = { ...this.userForm, ...this.userInfo }
  }
  submitForm () {
    let data = {
      nickname: this.userForm.nickname,
      password: this.userForm.password,
      avatar: this.userForm.avatar,
      description: this.userForm.description
    }
    request.updateUserInfo(this.uid, data).then(() => {
      this.$refs.form.resetFields()
      this.showEditForm = false
      this.getUserInfo()
    })
  }
  getUserInfo () {
    request.getUserInfo({ uid: this.uid })
      .then((data: any) => {
       this.userInfo = data
      })
  }
  mounted () {
    this.getUserInfo()
  }
}
</script>
<style lang="scss" scoped>
.user-comp-ct {
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
        line-height: 80px;
        text-align: center;
        border-radius: 40px;
        overflow: hidden;
        .none{
          background: #3e76f6;
        }
        .avatar{
          width: 80px;
          height: 80px;
        }
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
    .description{
      padding: 0 16px;
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
  .user-comp-ct{
    .my-textarea{
    }
  }
</style>
